define(['sabace', 'dialog','retrievepsd/message'], function(sabace, dialog,message) {
	jQuery(function() {
		jQuery("#first-next").html(sabace.getMessage('retripsd.button.nextStep'));
		jQuery("#first-next").on("click", checkUser);
	})

	function checkUser() {
		if (jQuery(".text-step1").prop('disabled')) {
			return;
		}
		var userId = jQuery("#userId").val().toLowerCase();
		var phoneReg = /^((13[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/;
		var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		var userIdReg = /^[U,u]+\d{7}/
		if (sabace.IsEmpty(userId)) {
			bi.dialog.show({
				type: 'type-danger',
				title: sabace.getMessage('retripsd.msg.prompt'),
				message: sabace.getMessage('retripsd.msg.inputUser')
			});
			return;
		}

		// 判断是邮箱还是手机
		var flag;
		if (phoneReg.test(userId)) {
			flag = "phone";
		}
		if (emailReg.test(userId)) {
			flag = "email";
		}
		if (userIdReg.test(userId)) {
			flag = "userId";
		}
		if (sabace.IsEmpty(flag)) {
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('retripsd.msg.prompt'),
				message: sabace.getMessage('retripsd.msg.errorUser'),
			});
			jQuery("#userId").focus();
			return;
		}
		
		// 用户点击登录后,禁止再重新输入信息
		jQuery("#userId,#first-next").prop("disabled", true);
		
		jQuery("#first-next").html(sabace.getMessage('retripsd.button.waiting'))
		var params = {
			userId: userId,
			type: flag
		}
		sabace.ajax({
			type: "post",
			cache: false,
			dataType: "json",
			url: sabace.handleUrlParam("/platform/retripsd/check-user"),
			data: params,
			success: function(req) {
				// 如果验证失败
				if (!req.validateFlag) {
					validateFalse(sabace.getMessage(req.errorMsg));
				} else {
					if ("phone" == flag) {
						document.location.href = sabace.handleUrlParam("/platform/retripsd/mobile-page");
					}
					if ("email" == flag) {
						document.location.href = sabace.handleUrlParam("/platform/retripsd/email-page");
					}
					if ("userId" == flag) {
						document.location.href = sabace.handleUrlParam("/platform/retripsd/choose-page");
					}
				}
			},
			error: function(req) {
				validateFalse(sabace.getMessage('retripsd.msg.Exception'));
			}
		});
	}

	function validateFalse(errorMsg) {
		bi.dialog.show({
			type: 'type-warning',
			title: sabace.getMessage('retripsd.msg.prompt'),
			message: errorMsg,
		});
		// 修改登陆的图标样式和输入框样式
		jQuery("#first-next").html(sabace.getMessage('retripsd.button.nextStep'))
		jQuery("#userId,#first-next").prop("disabled", false);
	}
});