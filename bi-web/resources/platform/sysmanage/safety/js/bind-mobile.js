define(['sabace', 'safety/message'], function(sabace, message) {
	function init(){
		    //验证码点击变换
		    jQuery(".captcha-pic img").on("click", function(obj, evt) {
			jQuery(".captcha-pic img").attr('src', sabace.handleUrlParam("/ImageServlet?") + Math.random());
		});
        //绑定点击获取验证码事件
		jQuery('#getvalidNum').on("click",sendSms);
		//绑定按钮事件
		jQuery("#comfirm-bind").on("click", function(obj, evt) {
			if(validateInput()){
			sabace.ajax({			
				url: sabace.handleUrlParam("/platform/sysmanage/safety/bind-mobile"),
				data: {
					mobileNum:jQuery("#mobileNum").val(),
					checkCode:jQuery("#checkCode").val(),
					captcha:jQuery("#captcha").val()
				},
				success: function(req) {
					// 如果验证失败
		            if (!req.validateFlag){
		            	validateFalse(sabace.getMessage(req.errorMsg));
		            }
		            else{
						bi.dialog.show({
							title: sabace.getMessage('safety.msg.success'),
							message: sabace.getMessage('safety.msg.successfully')
						});
						sabace.timeout(function(){top.document.location.href = sabace.handleUrlParam("/platform/sysmanage/user/safety")},3000);
					}
				},
				error: function(req) {
					bi.dialog.alert({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('safety.msg.error'),
			            message: sabace.getMessage('safety.msg.exception'),
			            closeByBackdrop: false,
						closeByKeyboard: false,
				    });
				}
			});
			}
			//document.location.href = sabace.handleUrlParam("/platform/sysmanage/safety/validate-code?i");
		});
	}
	//校验输入信息
	function validateInput() {
		var checkCode = jQuery("#checkCode").val();
		var mobileNum = jQuery("#mobileNum").val();
		var captcha = jQuery("#captcha").val();
		var phoneReg = /^((13[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8}$/;	
		if (sabace.IsEmpty(mobileNum)){
			validateFalse( sabace.getMessage('safety.msg.mobile.empty'))
        	return false;
		}
		if (!phoneReg.test(mobileNum)){
			validateFalse( sabace.getMessage('safety.msg.mobile.error'))
        	return false;
		}
		if (checkCode.length != 4){
			validateFalse( sabace.getMessage('safety.msg.checkCode.lengthError'))
        	return false;
		}		
		if (captcha.length != 4){
			validateFalse( sabace.getMessage('safety.msg.captcha.error'))
        	return false;
		}
		return true;
	}	
	
	function sendSms() {
		var mobileNum = jQuery("#mobileNum").val();
		var phoneReg = /^((13[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8}$/;	
		if (sabace.IsEmpty(mobileNum)){
			validateFalse( sabace.getMessage('safety.msg.mobile.empty'))
        	return;
		}
		if (!phoneReg.test(mobileNum)){
			validateFalse( sabace.getMessage('safety.msg.mobile.error'))
        	return;
		}
		countdown.init(this);
		//发送短信校验码
		var captcha = jQuery("#captcha").val();
		sabace.ajax({
			data: {
				mobileNum: jQuery("#mobileNum").val()
			},
			url: sabace.handleUrlParam("/platform/sysmanage/safety/send-sms"),
			success: function(req) {
				// 如果验证失败
				if (!req.validateFlag) {
					validateFalse(sabace.getMessage(req.errorMsg));
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('user.label.error'),
					message: req.responseText || sabace.getMessage('safety.msg.exception')
				});
			}
		});
	
	}
	
	//短信发送按钮变化事件
	var countdown = {
		node: null,
		count: 60,
		start: function() {
			if (this.count > 0) {
				this.node.innerHTML = this.count--+sabace.getMessage('safety.label.send.msg');
				var _this = this;
				sabace.timeout(function() {
					_this.start();
				}, 1000);
			} else {
				this.node.removeAttribute("disabled");
				this.node.innerHTML = sabace.getMessage('safety.button.getMsg');
				this.count = 60;
			}
		},
		//初始化
		init: function(node) {
			this.node = node;
			this.node.setAttribute("disabled", true);
			this.start();
		}
	};
	
	//校验错误
	function validateFalse(errorMsg) {
		jQuery(".captcha-pic img").attr("src", sabace.handleUrlParam("/ImageServlet?") + Math.random());
		bi.dialog.show({
			type: 'type-warning',
			title: sabace.getMessage('safety.msg.prompt'),
			message: errorMsg,
		});
	}
	//返回页面所需方法
	return {
		init:init
	}
});
