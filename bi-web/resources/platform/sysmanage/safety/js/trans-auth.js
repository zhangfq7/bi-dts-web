define(['sabace', 'safety/message'], function(sabace, message) {
	function init(){
		$('#transUser').ajaxChosen({
			fields: ['code','label'],
			searchAjaxParam: 'userId',
			upperChosenId: 'companyType',
			findPage: false,
			disabled: true,
			url : sabace.handleUrlParam('/platform/sysmanage/safety/query-company-user')
		});
		//转移权限确认按钮
		jQuery("#submit").on("click",transAuth)
	}
	
	function transAuth(){
		var userIdReg = /^(U|u)+\d{7}$/;
		var transUserId=jQuery(".chosen-single >span").text();
		if(!userIdReg.test(transUserId)){
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('safety.msg.prompt'),
				message: sabace.getMessage('safety.msg.userId.empty'),
			});
			return;
		}
		bi.dialog.confirm({
            title: sabace.getMessage('safety.msg.transAuth'),
            message: sabace.getMessage('safety.msg.confirmTrans'),
            callback: function(result) {
                if(result) {
                	sabace.ajax({
            			url: sabace.handleUrlParam("/platform/sysmanage/safety/trans-auth"),
            			data:{transUserId:transUserId}, 
            			success: function(req) {
            				if (!req.validateFlag) {
            					bi.dialog.alert({
        							type: bi.dialog.TYPE_DANGER,
        							title: sabace.getMessage('safety.msg.error'),
        							message: sabace.getMessage(req.errorMsg),
        							callback: function(result) {
        								if (req.expireFlag) {
        									var params = {};
        									params.type = 5;
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
                					top.document.location.href = sabace.handleUrlParam("/platform/sysmanage/user/safety")
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
	
	//返回页面所需方法
	return {
		init:init
	}
});
