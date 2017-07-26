define(['sabace'], function(sabace) {
	jQuery("#username,#pswd").val("");
	var Login = {
		init: function() {
			var url = window.location.toString();
			var type = url.split("#")[1] || "login";
			if (type == 'login') {
				Login.view.showLogin("init");
			} else {
				Login.view.showRegister("init");
			}
			jQuery("body").removeClass("hidden");
			Login.view.bindEvent();
		},
		checkMobile: function(phoneNum) {
			return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phoneNum)
		},
		checkEmail: function(email) {
			return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
		},
		login: function() {
			jQuery(".contanier").removeClass("moveX");
			var $username = jQuery("#username");
			var $pswd = jQuery("#pswd");
			var $picCode = jQuery("#login_picCode");
			var $username_val = $username.val();
			var $pswd_val = $pswd.val();
			
			
			if (!$username_val) {
				Login.showError($username, sabace.getMessage('login.msg.inputUsername'))
				return ;
			}  else if (!$pswd_val) {
				Login.showError($pswd, sabace.getMessage('login.msg.inputPassword'))
				return;
			} 
			
			//ajax param参数
			var paramData = {
				userID:sabace.encode64($username_val),
				userPassword:sabace.encode64($pswd_val),
				updateFlag: Login.module.updateFlag
			}
			
			if (Login.module.errorFlag == 1 || jQuery("#errorCount").val() >= 3) {
				var $picCode_val =  $picCode.val();
				if (!$picCode_val) {
					Login.showError($picCode, sabace.getMessage('login.msg.inputCaptcha'))
					return;
				}
				paramData.captcha = $picCode_val;
			}
			
			//出现loading的样式
			jQuery(".login-button,.passwordPanel .load").toggle();
			
			
			//通过验证,判断是否记住帐号
			var $this = jQuery("#rememberCode");
			if ($this.hasClass("checked")) {
				jQuery.cookie('username', $username_val, {expires: 7});
			} else {
				jQuery.cookie('username', '');
			}
			
		    jQuery("#username,#pswd").prop("disabled",true);
		    var js_path = respath_js+'/resources/platform/frame/login/img/head-error.png';
			sabace.ajax({
				url: webpath + "/platform/login/validate-login/validate",
				data: paramData,
				success: function(req) {
					jQuery("#username,#pswd").prop("disabled",false);
					// 如果验证失败
					if (!req.validateFlag) {
						if ("password" == req.showObject) {
							Login.showError($username, sabace.getMessage(req.errorMsg));
						} else if("captcha" == req.showObject){
							Login.showError($picCode, sabace.getMessage(req.errorMsg));
						}
						if(req.errorFlag == true){
							jQuery("#login_picCodePanel").fadeIn();
							Login.module.errorFlag = 1;
						}
						jQuery(".contanier").addClass("moveX");
						jQuery(".login-button,.passwordPanel .load").toggle();
						return;
					} else {
						function success() {
							jQuery(".loginPanel").fadeOut();
							if(jQuery("#opt-type").prev().size() == 0){
								jQuery("#opt-type").before('<span class="hidden">' + sabace.getMessage('login.msg.welcome') + '</span>').prev().fadeIn(100);
							}
							jQuery(".login-logo").animate({
								"margin-top": "100px"
							}, 500);
							jQuery(".login-text").animate({
								"margin-top": "10px"
							}, 500);
							
							setTimeout(function() {
								document.location.href = webpath + "/platform/frame/login";
							}, 200);
						}
						
						var qianyiHtml = '';
						qianyiHtml += '<div class="bg-color-move">';
						qianyiHtml += '<div class="sorrytitle">';
						qianyiHtml += '<img src="'+js_path+'"/>';
						// updateFlag=1，表示需要做数据迁移
						if (req.updateFlag == "1") {
							Login.module.updateFlag = "1";
							qianyiHtml += '<span>数据迁移中.....</span>';
							qianyiHtml += '</div></div>';
							jQuery(".warning").append(qianyiHtml).parent().show();
							Login.login();

							// 启动每隔5秒查询数据迁移进度的方法
							//success();
						} else if (req.updateFlag == "2") {
							qianyiHtml += '<span>数据还没有迁移完毕，再等等.....</span>';
							qianyiHtml += '</div></div>';
							// updateFlag=2，表示数据正在迁移过程中
							jQuery(".warning").append(qianyiHtml).parent().show();
						} else {
							if (req.retMsg != undefined) {
								var qianyiHtml2 = '';
								qianyiHtml2 += '<div class="bg-color-move">';
								qianyiHtml2 += '<div class="sorrytitle">';
								qianyiHtml2 += '<img src="'+js_path+'"/>';
								qianyiHtml2 += '<span>'+sabace.getMessage(req.retMsg)+'</span>';
								qianyiHtml2 += '</div></div>';
								jQuery(".warning").empty().append(qianyiHtml2).parent().show();
								setTimeout(function() {
									success();
								}, 4000);
							} else {
								success();
							}
						}
					}
				},
				error: function(req) {
					var errorHtml = '';
					errorHtml += '<div class="bg-color">';
					errorHtml += '<div class="sorrytitle">';
					errorHtml += '<img src="'+js_path+'"/>';
					errorHtml += '<span>抱歉，您访问的页面生病了</span>';
					errorHtml += '</div>';
					errorHtml += '<div class="closetitle">';
					errorHtml += '<span>5</span>秒后页面自动关闭';
					errorHtml += '</div></div>';
					jQuery(".bg .warning").append(errorHtml);
					jQuery(".login-button,.passwordPanel .load").toggle();
					jQuery(".bg").show();
					var sond = 5;
					var sInterval = setInterval(function() {
						sond--;
						$('.bg .warning .bg-color .closetitle span').text(sond);
						if (sond == 0) {
							$('.bg .warning .bg-color').remove();
							clearInterval(sInterval);
							jQuery(".bg").hide();
							jQuery("#username,#pswd").prop("disabled",false);
						}
					}, 1000);
				}
			});

		},
		register: function() {
			if (sabace.IsEmpty(Login.checkRegisterForm())) {
				return;
			}
			jQuery(".register-button span,.register-button .load").toggle();
			sabace.ajax({
				url: webpath + "/platform/register/register-user/register",
				data: Login.checkRegisterForm(),
				success: function(req) {
					// 如果验证失败
					if (!req.validateFlag) {
						if("validateCode"==req.showObject){
		            		Login.showError(jQuery("#validateCode"),sabace.getMessage(req.errorMsg)); 
		            	}
						else if("password"==req.showObject){
							Login.showError(jQuery("#reg_pswd1"),sabace.getMessage(req.errorMsg));
						}
		            	else{
		            		Login.showError(jQuery("#reg_username"), sabace.getMessage(req.errorMsg)); 
		            	}
						jQuery(".register-button span,.register-button .load").toggle();
					} else {
						jQuery(".contanier").removeClass("reg");
						jQuery(".login-text,.registerPanel").fadeOut();
						jQuery(".login-logo").animate({
							"margin-top": "80px"
						}, 800);
						jQuery("<div id='sucessTip' class='login-text'> "+sabace.getMessage('register.msg.success')+"</div>").appendTo("body");
						jQuery("#sucessTip").animate({
							"margin-top": "300px"
						}, 900);						
						setTimeout(function() {
							document.location.href = webpath + "/platform/login/page";;
						  },2000);					
					}
				},
				error: function(req) {
					jQuery(".warning").text("系统发生异常！").parent().show();
					//Login.showError($phoneCode, '222');
				}
			});
		},
		checkRegisterForm: function() {

			//如果注册面板存在错误告警 终止操作
			if (jQuery(".registerPanel").find(".error").length) {
				return null;
			}

			var $username = jQuery("#reg_username");
			var $reg_pswd1 = jQuery("#reg_pswd1");
			var $reg_pswd2 = jQuery("#reg_pswd2");
			
			var $username_val=$username.val().toLowerCase();
			var $reg_pswd1_val=$reg_pswd1.val();
			var $reg_pswd2_val=$reg_pswd2.val();
            var paramData={};
			//已验证的账户名
			var userName = jQuery("#reg_username").data("userName");

			var $validateCode = jQuery("#validateCode");
			var $validateCode_val = jQuery("#validateCode").val();
			if (!$username_val) {
				Login.showError($username, sabace.getMessage('login.msg.inputUsername'));
				return null;
			}
			if ($reg_pswd1_val.length <= 0) {
				Login.showError($reg_pswd1, sabace.getMessage('login.msg.inputPassword'));
				return null;
			}
			if ($reg_pswd1_val != $reg_pswd2_val) {
				Login.showError($reg_pswd2, sabace.getMessage('register.msg.diffPassword'));
				return null;
			}
			if ($username_val != userName) {
				Login.showError($validateCode, sabace.getMessage('register.msg.validateCodeError'));
				return null;
			}
			if (!$validateCode_val) {
				Login.showError($validateCode, sabace.getMessage('register.msg.inputValidateCode'));
				return null;
			}
			if (Login.checkMobile($username_val)) {		
				paramData.mobileNum = $username_val;
				paramData.email = "";
				paramData.validateCode = $validateCode_val;
				paramData.way = "phone";
			} else if (Login.checkEmail($username_val)) {
				paramData.email = $username_val;
				paramData.validateCode = $validateCode_val;
				paramData.mobileNum = "";
				paramData.way = "email";
			}			
			paramData.userPassword =$reg_pswd1.val()
            return paramData;
			
		},
		sendValidateCode: function($this) {
			var $userName = jQuery("#reg_username");
			userName=$userName.val().toLowerCase();
			//记录此时系统发送的需要验证的账户名
			if(Login.checkMobile(userName)){
				jQuery("#reg_username").data("userName", userName);				
				var userType="mobileNum"
			}else{
				jQuery("#reg_username").data("userName", userName);
				var userType="email"
			}
			
			//开始倒计时
			$this.fadeOut(100, function() {
				jQuery("#time").fadeIn();
			});
			
			var timeNum = 30;
			Login.module.timer = setInterval(function() {
				timeNum--;
				jQuery("#time span").text(timeNum);
				if (timeNum == 0) {
					Login.restartTime();
				}
			}, 1000)
		},
		restartTime:function(){
			clearInterval(Login.module.timer);
			jQuery("#time").fadeOut(100, function() {
				jQuery("#sendValidateCode").fadeIn();
				jQuery("#time span").text(30)
			});
		},
		showSuccess: function($this) {
			//Login.removeTip($this);
			$this.after("<div class='successPanel'></div>");
		},
		showError: function($this, errorText) {
			Login.removeTip($this);
			$this.parent().addClass("error");
			$this.after("<div class='errorPanel'>" + errorText + "</div>");
		},
		removeTip: function($this) {
			$this.parent().removeClass("error").find(".errorPanel,.successPanel").remove();
		}
	};
	Login.module = {
		type: 'login',//当前页面类型
		errorFlag: 0,//错误标识 ,后面要改成seesion返回
		updateFlag: '0',//是否需要迁移数据
		email: {
			'qq.com': 'http://mail.qq.com',
			'gmail.com': 'http://mail.google.com',
			'sina.com': 'http://mail.sina.com.cn',
			'163.com': 'http://mail.163.com',
			'126.com': 'http://mail.126.com',
			'yeah.net': 'http://www.yeah.net/',
			'sohu.com': 'http://mail.sohu.com/',
			'tom.com': 'http://mail.tom.com/',
			'sogou.com': 'http://mail.sogou.com/',
			'139.com': 'http://mail.10086.cn/',
			'hotmail.com': 'http://www.hotmail.com',
			'live.com': 'http://login.live.com/',
			'live.cn': 'http://login.live.cn/',
			'live.com.cn': 'http://login.live.com.cn',
			'189.com': 'http://webmail16.189.cn/webmail/',
			'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
			'yahoo.cn': 'http://mail.cn.yahoo.com/',
			'eyou.com': 'http://www.eyou.com/',
			'21cn.com': 'http://mail.21cn.com/',
			'188.com': 'http://www.188.com/',
			'foxmail.com': 'http://www.foxmail.com',
			'outlook.com': 'http://www.outlook.com'
		}
	};
	Login.view = {
		showLogin: function(init) {
			jQuery(".registerPanel").fadeOut(init ? 0 : 300, function() {
				jQuery("#opt-type").text(sabace.getMessage('login.label.login'));
				jQuery(".contanier").removeClass("reg");
				jQuery(".loginPanel").fadeIn();
			});
			Login.module.type = 'login';
			var username_cookie = jQuery.cookie('username');
			if (username_cookie) {
				var $username = jQuery("#username");
				$username.prev().hide();
				$username.val(username_cookie);
				jQuery("#rememberCode").addClass("checked");
			} else {
				jQuery("#rememberCode").removeClass("checked");
			}
			
		},
		showRegister: function(init) {
			jQuery(".loginPanel").fadeOut(init ? 0 : 300, function() {
				jQuery("#opt-type").text(sabace.getMessage('register.label.register') );
				jQuery(".contanier").addClass("reg");
				jQuery(".registerPanel").fadeIn();
			});
			Login.module.type = 'register';
		},
		bindEvent: function() {

			//绑定placeholder
			jQuery("#username,#pswd,#reg_username,#reg_pswd1,#reg_pswd2,#validateCode,#login_picCode").on("keyup input", function() {
				var $this = jQuery(this);
				$this.prev()[$this.val() ? "hide" : "fadeIn"]();
			});

			//绑定获取焦点边框高亮
			jQuery("#username,#pswd,#reg_username,#reg_pswd1,#reg_pswd2").on("focus", function() {
				jQuery(this).parent().addClass('active');
			}).on("blur", function() {
				jQuery(this).parent().removeClass('active');
				//兼容手机端
				setTimeout(function() {
					if (jQuery(".active").length == 0) {
						jQuery("body").animate({
							scrollTop: 0
						}, 500);
					}
				}, 800)
			});

			jQuery(".bg").on("click",function(event){
				if(!jQuery(event.target).hasClass("warning"))jQuery(this).hide();
			})
			
			//绑定复选框事件
			jQuery(".icon-checkbox").on('click', function() {
				jQuery(this).toggleClass('checked');
			})

			//绑定显示注册面板事件
			jQuery(".regPanel").click(function() {
				Login.view.showRegister();
				document.location.hash = '#register';
			})

			//绑定显示登录面板事件
			jQuery(".goLoginPanel").click(function() {
				Login.view.showLogin();
				document.location.hash = '#login';
			});
			
			//绑定忘记密码链接暂时的
			jQuery(".forgetPanel").click(function() {
				document.location.href = webpath + "/platform/retripsd/enter-page/retripsd";
			});

			//点击注册按钮
			jQuery(".register-button").click(function() {
				Login.register();
			})

			//点击发送验证嘛
			jQuery("#sendValidateCode").on("click", function() {
				Login.sendValidateCode($(this));
			})

			//国际化点击切换
			jQuery('.chinese,.english').on("click", function() {
				var url = "";
				if (jQuery(this).hasClass("chinese")) {
					url = webpath + '/platform/login/index?lang=zh';
				} else {
					url = webpath + '/platform/login/index?lang=en';
				}
				if (Login.module.type == "login") {
					url += '#login';
				} else {
					url += '#register';
				}
				location.href = url;
			});

			jQuery(".codePanel img").on("click", function() {
				jQuery(this).attr('src', webpath + "/ImageServlet?" + Math.random());
			})

			//兼容手机
			document.addEventListener('touchmove', function(event) {
				event.preventDefault();
			})

			//注册用户名失去焦点事件
			jQuery("#reg_username").on("blur", function() {
				var $this = jQuery(this);
				var value = $this.val();
                if(value != $this.data("tempName"))
                {
                	jQuery("#validateCodePanel").hide();
                }
                var $userName = jQuery("#reg_username");
				userName=$userName.val().toLowerCase();
				//记录此时系统发送的需要验证的账户名
				if(Login.checkMobile(userName)){
					jQuery("#reg_username").data("userName", userName);				
					var userType="mobileNum"
				}else{
					jQuery("#reg_username").data("userName", userName);
					var userType="email"
				}
				sabace.ajax({
					type: "post",
					cache: false,
					dataType: "json",
					data: {
						   userName:userName,
						   userType:userType
						  },
					url: webpath + "/platform/register/send-sms/register",
					success: function(req) {
						if (!req.validateFlag) {
							Login.showError(jQuery("#reg_username"), sabace.getMessage(req.errorMsg));
							return;
						}else{
							if (Login.checkMobile(value)||Login.checkEmail(value)) {
								jQuery("#validateCodePanel").show();
								Login.restartTime();
							}else {
								Login.showError($this, sabace.getMessage('register.msg.formatError')); //格式不正确
								return;
							}
							
							Login.showSuccess($this); //显示正确提示
							$this.data("tempName", value);
						}
					},
					error: function(req) {
						Login.showError($phoneNum, sabace.getMessage('login.msg.exception'));
					}
				});
				
			});

			//密码失去焦点事件
			jQuery("#reg_pswd1").on("blur", function() {
				var $this = jQuery(this);
				var value = $this.val();
				if (value.length < 6 && value.length != 0) {
					Login.showError($this,  sabace.getMessage('register.msg.lengthError'));
				} else if (value.length >= 6) {
					Login.showSuccess($this); //显示正确提示
				}
			});

			//确认密码失去焦点事件
			jQuery("#reg_pswd2").on("blur", function() {
				var $this = jQuery(this);
				var $this1 = jQuery("#reg_pswd1");

				var value = $this.val();
				if (!value) return;
				var value1 = $this1.val();
				Login.removeTip($this);
				if (value != value1) {
					if (!$this1.parent().hasClass("error")) {
						Login.showError($this,  sabace.getMessage('register.msg.diffPassword'));
					}
				} else {
					Login.showSuccess($this); //显示正确提示
				}
			});

			//验证码框获得焦点时，去除错误信息
			jQuery("#validateCode,#username,#pswd,#reg_pswd1,#reg_pswd2,#reg_username,#login_picCode").on('focus', function() {
				Login.removeTip($(this));
			})

			jQuery(".login-button").on("click", function() {
				Login.login();
			})

			//用户快捷操作
			$('body').on('keypress', function(event) {

				//用户登录操作
				if (Login.module.type == "login") {

					var $username = jQuery("#username");
					var $pswd = jQuery("#pswd");

					if (!$username.val() && jQuery(':focus').length==0) {
						$username.focus();
						return;
					}
					if (event.keyCode == "13") {
						if (!$pswd.val()) {
							$pswd.focus();
						} else {
							Login.login();
						}
					}

				} else { //用户注册操作
					var $reg_username = jQuery("#reg_username"),
						$reg_pswd1 = jQuery("#reg_pswd1"),
						$reg_pswd2 = jQuery("#reg_pswd2");
					if (!$reg_username.val() && jQuery(':focus').length==0) {
						$reg_username.focus();
						return;
					}
					if (event.keyCode == "13") {
						if (!$reg_pswd1.val()) {
							$reg_pswd1.focus();
						} else if (!$reg_pswd2.val()) {
							$reg_pswd2.focus();
						} else if (!$reg_pswd2.val()) {
							$reg_pswd2.focus();
						}
					}
				}

			})
		}
	};
	Login.init();
})