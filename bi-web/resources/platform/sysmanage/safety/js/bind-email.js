define(['sabace','safety/message'], function(sabace,message) {
	function init(){
		//绑定修改页面
		jQuery("#validate-sub").on("click",submit);
	}	
	
	function submit(){
	 	//校验信息 
		var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		var newEmail = jQuery("#newEmail").val();
		var reNewEmail = jQuery("#reNewEmail").val();
		if (sabace.IsEmpty(newEmail)) {
			validateFalse(sabace.getMessage('safety.msg.newEmail.empty'));
        	return ;
		}
		if (sabace.IsEmpty(reNewEmail)) {
			validateFalse(sabace.getMessage('safety.msg.reNewEmail.empty'));
        	return ;
		}

		if (!emailReg.test(newEmail)) {
			validateFalse(sabace.getMessage('safety.msg.newEmail.error'));
        	return ;
		}
		if (newEmail!=reNewEmail) {
			validateFalse(sabace.getMessage('safety.msg.email.diff'));
        	return ;
		}
		
		var paramData={
			type: "bind",
			newEmail: newEmail.toLowerCase()
		};
		
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/safety/edit-email"),
			data: paramData,
			success: function(req) {
				// 如果验证失败
				if (!req.validateFlag) {
					bi.dialog.alert({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('safety.msg.error'),
						message: sabace.getMessage(req.errorMsg),
						callback: function(result) {
							if (req.expireFlag) {
								var params = {};
								params.type = 4;
								redirecPage(sabace.handleUrlParam("/platform/sysmanage/safety/validate"), params);
							}
			            }
					});
				} else {
					bi.dialog.show({
						title: sabace.getMessage('safety.msg.success'),
						message: sabace.getMessage('safety.msg.successfully'),
						closeByBackdrop: false,
						closeByKeyboard: false,
					});
					sabace.timeout(function(){top.document.location.href = sabace.handleUrlParam("/platform/sysmanage/user/safety")},3000);
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
	
	// 页面跳转方法
	function redirecPage(url, params){
		var html = "";
		// 遍历参数
		for(var name in params){
			html += "<input name='" + name + "' value='" + params[name] + "'/>";
		}
		var formTemp = jQuery("<form></form>",{
			"method":"post",
			"action": url,
			"html": html
		});
		jQuery('body').append(formTemp);
		formTemp.submit();
		jQuery(formTemp).remove();
	}
	
	//显示错误
	function validateFalse(errorMsg) {
		bi.dialog.show({
			type: 'type-warning',
			title: sabace.getMessage('safety.msg.prompt'),
			message: errorMsg
		});
	}
	//返回页面所需方法
	return {
		init:init
	}
});
