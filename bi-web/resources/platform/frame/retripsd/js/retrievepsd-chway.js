define(['sabace', 'dialog','retrievepsd/message'], function(sabace, dialog,message) {
	jQuery(function() {
		jQuery(".mobile-way").on("click", findMobileNum);
		jQuery(".email-way").on("click", findEmail);
	})

	//点击手机验证	
	function findMobileNum() {
			sabace.ajax({
				type: "post",
				loading:{
					title:'执行中',
					text:'正在提交信息，请稍后...'
				},
				cache: false,
				dataType: "json",
				url: sabace.handleUrlParam("/platform/retripsd/check-mobileNum"),
				success: function(req) {
					if (req.noSession) {
						document.location.href = sabace.handleUrlParam("/platform/retripsd/enter-page");
					}
					// 如果验证失败
					if (!req.validateFlag) {
						validateFalse(sabace.getMessage(req.errorMsg));
					} else {
						document.location.href = sabace.handleUrlParam("/platform/retripsd/mobile-page");
					}
				},
				error: function(req) {
					validateFalse(sabace.getMessage('retripsd.msg.Exception'));
				}
			});
		}
		//点击邮箱验证

	function findEmail() {
		var userId = jQuery("#userId").text();
		sabace.ajax({
			type: "post",
			cache: false,
			loading:{
				title:'执行中',
				text:'正在提交信息，请稍后...'
			},
			dataType: "json",
			url: sabace.handleUrlParam("/platform/retripsd/check-email"),
			success: function(req) {
				if (req.noSession) {
					document.location.href = sabace.handleUrlParam("/platform/retripsd/enter-page");
				}
				// 如果验证失败
				if (!req.validateFlag) {
					validateFalse(sabace.getMessage(req.errorMsg));
				} else {
					document.location.href = sabace.handleUrlParam("/platform/retripsd/email-page");
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: 'type-danger',
					title: sabace.getMessage('retripsd.msg.prompt'),
					message: sabace.getMessage('retripsd.msg.Exception'),
				});
			}
		});
	}

	function validateFalse(errorMsg) {
		bi.dialog.show({
			type: 'type-warning',
			title: sabace.getMessage('retripsd.msg.prompt'),
			message: errorMsg,
		});
	}
});