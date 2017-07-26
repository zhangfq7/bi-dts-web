define(['sabace','safety/message'], function(sabace,message) {
	function init(){	
		//绑定修改按钮事件
		jQuery("#validate-sub").on("click",submit);
	}	
	function submit(){
		var phoneReg = /^((13[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8}$/;
		var oldMobile = jQuery("#oldMobile").val();
		var newMobile = jQuery("#newMobile").val();
		var reNewMobile = jQuery("#reNewMobile").val();
		//校验信息
		if (sabace.IsEmpty(oldMobile)) {
			validateFalse(sabace.getMessage('safety.msg.oldMobile.empty'));
        	return ;
		}
		if (sabace.IsEmpty(newMobile)) {
			validateFalse(sabace.getMessage('safety.msg.newMobile.empty'));
        	return ;
		}
		if (sabace.IsEmpty(reNewMobile)) {
			validateFalse(sabace.getMessage('safety.msg.reNewMobile.empty'));
        	return ;
		}		
		if (!phoneReg.test(oldMobile)) {
			validateFalse(sabace.getMessage('safety.msg.oldMobile.error'));
        	return ;
		}
		if (!phoneReg.test(newMobile)) {
			validateFalse(sabace.getMessage('safety.msg.newMobile.error'));
        	return ;
		}
		
		if (newMobile!=reNewMobile) {
			validateFalse(sabace.getMessage('safety.msg.mobile.diff'));
        	return ;
		}
		
		var paramData={
				oldMobile:oldMobile,
				newMobile:newMobile
			};
			sabace.ajax({
				url: sabace.handleUrlParam("/platform/sysmanage/safety/edit-mobile"),
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
									params.type = 3;
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
			message: errorMsg,
		});
	}
	
	//返回页面所需方法
	return {
		init:init
	}
});
