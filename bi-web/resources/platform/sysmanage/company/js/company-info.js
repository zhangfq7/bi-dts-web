define(['sabace', 'company/message'], function(sabace, message) {
	function init() {
		jQuery('#saveCompanyButton').on("click", saveCompanyInfo);
		
		//企业类型
		jQuery("#companyType").treeselect({
			height: 200,
			chkStyle: "radio",
			searchAjaxParam: "companyTypeName",
			width: (jQuery('#companyType').width() + 21),
			url: sabace.handleUrlParam('/platform/sysmanage/company/company-type'),
		});

		jQuery('#savePanel').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
	}

	function saveCompanyInfo() {
		var isPass = $('#savePanel').validationEngine('validate');
		if(!isPass){
			return false;
		}
		
		var companyId = $("#companyId").val();
		var companyName = $("#companyName").val().trim();
		var companyDesc = $("#companyDesc").val();
		var companyType = $("#companyType").attr("truevalue");
		var paramData = {
			companyId: companyId,
			companyName: companyName,
			companyType: companyType,
			companyRemark: companyDesc
		};
		
		bi.dialog.confirm({
            title: sabace.getMessage('company.label.confirm'),
            message: sabace.getMessage('company.msg.saveCompany.confirm'),
            callback: function(result) {
            	if (!result) {
            		return;
            	}
            	
        		sabace.ajax({
        			url: sabace.handleUrlParam("/platform/sysmanage/company/save-company"),
        			data: paramData,
        			loading: {
        				title: sabace.getMessage('company.label.tip'),
        				text: sabace.getMessage('company.label.pleaseWait')
        			},
        			success: function(req) {
        				if (req.saveFlag == "true") {
        					bi.dialog.show({
        						title: sabace.getMessage('company.label.succeed'),
        						message: sabace.getMessage('company.msg.saveCompany.success')
        					});
        				} else {
        					bi.dialog.show({
        						type: bi.dialog.TYPE_DANGER,
        						title: sabace.getMessage('company.label.error'),
        						message: sabace.getMessage(req.errorMsg)
        					});
        				}
        			},
        			error: function(req) {
        				bi.dialog.show({
        					type: bi.dialog.TYPE_DANGER,
        					title: sabace.getMessage('company.label.error'),
        					message: req.responseText || sabace.getMessage('company.msg.saveCompany.error')
        				});
        			}
        		});
            }
		});
	}

	//返回页面所需方法
	return {
		init: init
	}

});