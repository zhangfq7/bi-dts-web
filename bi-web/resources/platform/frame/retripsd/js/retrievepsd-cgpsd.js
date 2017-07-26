define(['sabace', 'dialog','retrievepsd/message'], function(sabace, dialog,message) {
	jQuery(function() {
		 initpage();
		 jQuery("#cgpsd-next").on("click",changePsd);
		 
	})
	
	function initpage(){
		var level = jQuery('#psdLevel').attr("value")-1;
		$('#psdLevel>div:eq('+ level + ')').removeClass("tipdisplay");
	}
	
	
	//修改密码
	function changePsd() {
		    //校验信息
			var password = jQuery("#newPassword").val();
			var rePassword = jQuery("#renewPassword").val();
			if (sabace.IsEmpty(password)) {
				bi.dialog.show({
					type: 'type-warning',
					title: sabace.getMessage('retripsd.msg.prompt'),
					message: sabace.getMessage('retripsd.msg.inputPassword'),
				});
				jQuery("#newPassword").focus();
				return;
			} else if (password.length < 6) {
				bi.dialog.show({
					type: 'type-warning',
					title: sabace.getMessage('retripsd.msg.prompt'),
					message: sabace.getMessage('retripsd.msg.shortPassword'),
				});
				jQuery("#newPassword").focus();
				return;
			}
			if (sabace.IsEmpty(rePassword)) {
				bi.dialog.show({
					type: 'type-warning',
					title: sabace.getMessage('retripsd.msg.prompt'),
					message: sabace.getMessage('retripsd.msg.inputRepassword'),
				});
				jQuery("#userId").focus();
				return;
			} else if (password != rePassword) {
				bi.dialog.show({
					type: 'type-warning',
					title: sabace.getMessage('retripsd.msg.prompt'),
					message: sabace.getMessage('retripsd.msg.diffPassword'),
				});
				jQuery("#rePassword").focus();
				return;
			}
			
			sabace.ajax({
				type: "post",
				cache: false,
				dataType: "json",
				url: sabace.handleUrlParam("/platform/retripsd/change-password"),
				data: {
					password:password,
				},
				success: function(req) {
					if (!req.validateFlag) {
						if(req.noCache){
							document.location.href = sabace.handleUrlParam("/platform/retripsd/enter-page");
						}
						bi.dialog.show({
							type: 'type-warning',
							title: sabace.getMessage('retripsd.msg.prompt'),
							message: sabace.getMessage(req.errorMsg),
						});
					} else {
						document.location.href = sabace.handleUrlParam("/platform/retripsd/finish");
					}
							
				},
			});    
		}
	
});
     