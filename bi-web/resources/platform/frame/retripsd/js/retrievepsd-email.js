define(['sabace', 'dialog','retrievepsd/message'], function(sabace, dialog,message) {
	jQuery(function() {
			jQuery('#sendBtn').on("click", sendMsg);
			jQuery('.btn-next').on("click", checkMsg);
		})
		//验证码点击事件
	jQuery(".validate-img img").on("click", function() {
		this.src = sabace.handleUrlParam("/ImageServlet?") + Math.random();
	});
	//短信发送按钮事件
	var countdown = {
		node: null,
		count: 60,
		start: function() {
			if (this.count > 0) {
				this.node.innerHTML = this.count--+sabace.getMessage('retripsd.label.msg');
				var _this = this;
				setTimeout(function() {
					_this.start();
				}, 1000);
			} else {
				this.node.removeAttribute("disabled");
				this.node.innerHTML = sabace.getMessage('retripsd.button.getMsg');
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

	function sendMsg() {
		countdown.init(this);
		jQuery("#tip").show();
		send();
	}

	//发送验证码
	function send() {
		var validateCode = jQuery("#msg").val();
		sabace.ajax({
			type: "post",
			cache: false,
			data:{
				userType:"email"
			},
			dataType: "json",
			url: sabace.handleUrlParam("/platform/retripsd/send-message"),
			success: function(req) {
				if (req.noSession) {
					sabace.handleUrlParam("/platform/retripsd/enter-page");
				}
				// 如果验证失败
				if (!req.validateFlag) {
					validateFalse(sabace.getMessage(req.errorMsg));
				}
			},
			error: function(req) {
				validateFalse(sabace.getMessage('retripsd.msg.Exception'));
			}
		});
	}

	function checkMsg() {
		if (jQuery("#msg,#code").prop('disabled')) {
			return;
		}
		var msg = jQuery("#msg").val();
		var code = jQuery("#code").val();
		if (sabace.IsEmpty(msg)) {
			jQuery("#msg").focus();
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('retripsd.msg.prompt'),
				message: sabace.getMessage('retripsd.msg.emptyCode'),
			});
			return;
		}

		if (msg.length != 4) {
			jQuery("#msg").focus();
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('retripsd.msg.prompt'), 
				message: sabace.getMessage('retripsd.msg.Code.lengthError'),
			});
			return;
		}

		if (sabace.IsEmpty(code)) {
			jQuery("#code").focus();
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('retripsd.msg.prompt'),
				message: sabace.getMessage('retripsd.msg.emptyCaptcha'),
			});
			return;
		}

		if (msg.length != 4) {
			jQuery("#msg").focus();
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('retripsd.msg.prompt'),
				message: sabace.getMessage('retripsd.msg.Captcha.lengthError'),
			});
			return;
		}
		var param = {
			msg: msg,
			code: code,
			type:"email"
		}
		jQuery("#msg,#code,.btn-next").prop("disabled", true);
		sabace.ajax({
			type: "post",
			cache: false,
			dataType: "json",
			url: sabace.handleUrlParam("/platform/retripsd/check-validateCode"),
			data: param,
			success: function(req) {
				if (req.noSession) {
					document.location.href = sabace.handleUrlParam("/platform/retripsd/enter-page");
				}
				// 如果验证失败
				if (!req.validateFlag) {
					validateFalse(sabace.getMessage(req.errorMsg));
				} else {
					document.location.href = sabace.handleUrlParam("/platform/retripsd/changepsd-page");
				}
			},
			error: function(req) {
				validateFalse(sabace.getMessage('retripsd.msg.Exception'));
			}
		});
	}

	//校验错误
	function validateFalse(errorMsg) {
		jQuery("#msg,#code,.btn-next").prop("disabled", false);
		jQuery(".validate-img img").attr("src", sabace.handleUrlParam("/ImageServlet?") + Math.random());
		bi.dialog.show({
			type: 'type-warning',
			title: sabace.getMessage('retripsd.msg.prompt'),
			message: errorMsg,
		});
	}
});