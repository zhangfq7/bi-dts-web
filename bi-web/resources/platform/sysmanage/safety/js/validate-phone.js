define(['sabace','safety/message'], function(sabace, message) {
	function init() {
		var mobileNum = jQuery("#mobileNum").html();
		if (sabace.IsEmpty(mobileNum)) {
			document.location.href = sabace.handleUrlParam("/platform/sysmanage/user/safety");
		}

		jQuery(".captcha-class img").on("click", function(obj, evt) {
			$(this).attr('src', webpath + "/ImageServlet?t=" + Math.random());
		});

		//绑定点击获取验证码事件
		jQuery('#sendCodeButton').on("click", sendSms);

		jQuery('.tab-pane').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
	}


	//绑定验证按钮事件
	jQuery("#validateButton").on("click", function(obj, evt) {
		var isPass = $('.tab-pane').validationEngine('validate');
		if (!isPass) {
			return false;
		}

		var paramData = {};
		paramData.checkCode = jQuery("#checkCode").val();
		paramData.captcha = jQuery("#captcha").val();

		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/safety/validate-code"),
			data: paramData,
			loading: {
				title: sabace.getMessage('safety.msg.prompt'),
				text: sabace.getMessage('safety.msg.validateLoading')
			},
			success: function(req) {
				// 如果验证失败
				if (!req.validateFlag) {
					validateFalse(sabace.getMessage(req.errorMsg));
				} else {
					//根据传入type跳转不同页面（1：修改密码2：修改邮箱3：修改手机4：绑定邮箱5：转移权限）
					var type = jQuery('#type').val();
					if ("1" == type) {
						document.location.href = sabace.handleUrlParam("/platform/sysmanage/safety/edit-pwd-page");
					}
					if ("2" == type) {
						document.location.href = sabace.handleUrlParam("/platform/sysmanage/safety/edit-email-page");
					}
					if ("3" == type) {
						document.location.href = sabace.handleUrlParam("/platform/sysmanage/safety/edit-mobile-page");
					}
					if ("4" == type) {
						document.location.href = sabace.handleUrlParam("/platform/sysmanage/safety/bind-email-page");
					}
					if ("5" == type) {
						document.location.href = sabace.handleUrlParam("/platform/sysmanage/safety/trans-auth-page");
					}
				}
			},
			error: function(req) {
				bi.dialog.alert({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('safety.msg.error'),
					message: sabace.getMessage('safety.msg.exception')
				});
			}
		});
	});


	function sendSms() {
		//显示提示
		jQuery("#tip .tip").show(); 
		countdown.init(this);
		//发送短信校验码
		sabace.ajax({
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
					title: sabace.getMessage('safety.msg.error'),
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
				this.node.innerHTML = this.count-- + sabace.getMessage('safety.label.send.msg');
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
		$("#captcha").val('');
		$(".captcha-class img").attr('src', sabace.handleUrlParam("/ImageServlet?") + Math.random());
		bi.dialog.show({
			type: 'type-warning',
			title: sabace.getMessage('safety.msg.error'),
			message: errorMsg,
		});
	}

	//返回页面所需方法
	return {
		init: init
	}
});