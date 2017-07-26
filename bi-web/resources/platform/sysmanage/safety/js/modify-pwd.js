define(['sabace','safety/message'], function(sabace,message) {
	function init(){	
		//绑定修改按钮事件
		jQuery("#validate-sub").on("click",submit);
	}
	
	function submit(){
		var oldPsd = jQuery("#oldPsd").val();
		var newPsd = jQuery("#newPsd").val();
		var reNewPsd = jQuery("#reNewPsd").val();
		//校验信息
		if (sabace.IsEmpty(oldPsd)) {
			validateFalse(sabace.getMessage('safety.msg.oldPsd.empty'));
        	return ;
		}
		if (sabace.IsEmpty(newPsd)) {
			validateFalse(sabace.getMessage('safety.msg.newPsd.empty'));
        	return ;
		}
		if (newPsd.length<6) {
			validateFalse(sabace.getMessage('safety.msg.password.short'));
        	return ;
		}
		if (sabace.IsEmpty(reNewPsd)) {
			validateFalse(sabace.getMessage('safety.msg.reNewPsd.empty'));
        	return ;
		}
		if (newPsd!=reNewPsd) {
			validateFalse(sabace.getMessage('safety.msg.password.diff'));
        	return ;
		}
		if (newPsd==oldPsd) {
			validateFalse(sabace.getMessage('safety.msg.oldNewPsd.same'));
        	return ;
		}
		var paramData={
				oldPassword:oldPsd,
				newPassword:newPsd
			};
			sabace.ajax({
				url: sabace.handleUrlParam("/platform/sysmanage/safety/edit-pwd"),
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
									params.type = 1;
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
						sabace.timeout(function(){
							if(forceChangePwd == '1'){
								top.document.location.href = webpath+"/platform/frame/login";
							}else{
								top.document.location.href = sabace.handleUrlParam("/platform/sysmanage/user/safety");
							}
						}, 3000);
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
