define(['sabace','user/message'], function(sabace,message) {
	function init() {
		
		//根据按钮选择跳转页面
		jQuery(".entry-oper").on("click", function() {
			if ($(this).hasClass("modify-pwd")) {
				var mobileNum = jQuery('#mobileNum').html();
				if (sabace.IsEmpty(mobileNum)) {
					bindMobileTip();
					return;
				}
				var params = {};
				params.type = 1;
				redirecPage(sabace.handleUrlParam("/platform/sysmanage/safety/validate"), params);
			} else if ($(this).hasClass("modify-email")) {
				var mobileNum = jQuery('#mobileNum').html();
				if (sabace.IsEmpty(mobileNum)) {
					bindMobileTip();
					return;
				}
				var params = {};
				params.type = 2;
				redirecPage(sabace.handleUrlParam("/platform/sysmanage/safety/validate"), params);
			} else if ($(this).hasClass("modify-phone")) {
				var mobileNum = jQuery('#mobileNum').html();
				if (sabace.IsEmpty(mobileNum)) {
					bindMobileTip();
					return;
				}
				var params = {};
				params.type = 3;
				redirecPage(sabace.handleUrlParam("/platform/sysmanage/safety/validate"), params);
			} else if ($(this).hasClass("bind-email")) {
				var mobileNum = jQuery('#mobileNum').html();
				if (sabace.IsEmpty(mobileNum)) {
					bindMobileTip();
					return;
				}
				var params = {};
				params.type = 4;
				redirecPage(sabace.handleUrlParam("/platform/sysmanage/safety/validate"), params);
			} else if ($(this).hasClass("bind-phone")) {
				document.location.href = sabace.handleUrlParam("/platform/sysmanage/safety/bind-mobile-page");
			} else if ($(this).hasClass("oper-detail")) {
				alert("建设中");
			} else if ($(this).hasClass("transfer-right")) {
				var mobileNum = jQuery('#mobileNum').html();
				if (sabace.IsEmpty(mobileNum)) {
					bindMobileTip();
					return;
				}
				var params = {};
				params.type = 5;
				redirecPage(sabace.handleUrlParam("/platform/sysmanage/safety/validate"), params);
			}
		})
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
    		
	function bindMobileTip() {
		bi.dialog.alert({
			type: 'type-warning',
			title: sabace.getMessage('user.label.tip'),
			message: sabace.getMessage('user.label.unbindMobile')
		});
	} 
	//返回页面所需方法
	return {
		init: init
	}
});