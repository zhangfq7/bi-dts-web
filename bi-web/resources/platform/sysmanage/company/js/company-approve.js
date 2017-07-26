define(['sabace', 'message'], function(sabace, message) {

	function init() {
		jQuery('#createCompanyButton').on("click", createCompany);
		jQuery('#joinCompanyButton').on("click", joinCompany);

		// 企业类型
		jQuery("#companyType").treeselect({
			height: 200,
			chkStyle: "radio",
			searchAjaxParam: "companyTypeName",
			width: (jQuery('#companyType').width() + 21),
			url: sabace.handleUrlParam('/platform/sysmanage/company/company-type')
		});
		
		jQuery('#create, #join').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
		
		// 校验用户输入的企业编码是否存在
		jQuery('#companyId').bind("blur", function() {
			var isError = $('#companyId').validationEngine('validate');
			if(isError){
				return false;
			}
			
			var companyId = $("#companyId").val();
			var paramData = {
				companyId: companyId.toUpperCase()
			};
			
			sabace.ajax({
				url: sabace.handleUrlParam("/platform/sysmanage/company/company-exist"),
				data: paramData,
				success: function(req) {
					if (req.existFlag == "true") {
						$(".tip-class").html('<span class="f16 green"><i class="fa fa-check f16"></i></span>');
					} else {
						$(".tip-class").html('<span class="f14 red"><i class="fa fa-times-circle f16"></i>&nbsp;' + sabace.getMessage('company.msg.companyId.noExist'), + '</span>');
					}
					$(".tip-class").show();
				},
				error: function(req) {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('company.label.error'),
						message: req.responseText || sabace.getMessage('company.label.sendError')
					});
				}
			});
		});
		
		jQuery("#companyId").on("keydown",function(evt){
			$(".tip-class").html('');
			$(".tip-class").hide();
		});
	}

	// 用户创建自己的企业信息
	function createCompany() {		
		var isPass = $('#create').validationEngine('validate');
		if(!isPass){
			return false;
		}
		
		var paramData = {
			companyName: $("#companyName").val().trim(),
			companyType: $("#companyType").attr("truevalue"),
			companyDesc: $("#companyDesc").val()
		};
		
		bi.dialog.confirm({
            title: sabace.getMessage('company.label.confirm'),
            message: sabace.getMessage('company.msg.saveCompany.confirm'),
            callback: function(result) {
            	if (!result) {
            		return;
            	}
            	
        		sabace.ajax({
        			url: sabace.handleUrlParam("/platform/sysmanage/company/create-company"),
        			data: paramData,
        			loading: {
        				title: sabace.getMessage('company.label.tip'),
        				text: sabace.getMessage('company.label.pleaseWait')
        			},
        			success: function(req) {
        				if (req.createFlag == "true") {
        					bi.dialog.show({
        						title: sabace.getMessage('company.label.succeed'),
        						message: sabace.getMessage('company.msg.saveCompany.success'),
        						onhide: function() {
        							setTimeout(function() {
        								document.location.href = webpath + "/platform/frame/login";
        							}, 200);
        						}
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
	
	// 用户加入其他的企业
	function joinCompany() {
		var isPass = $('#join').validationEngine('validate');
		if(!isPass){
			return false;
		}
		
		var companyId = $("#companyId").val();
		var authMsg = $("#authMsg").val();
		var paramData = {
			companyId: companyId.toUpperCase(),
			authMsg: authMsg
		};
		
		bi.dialog.confirm({
            title: sabace.getMessage('company.label.confirm'),
            message: sabace.getMessage('company.msg.joinCompany.confirm'),
            callback: function(result) {
            	if (!result) {
            		return;
            	}
            	
        		sabace.ajax({
        			url: sabace.handleUrlParam("/platform/sysmanage/company/join-company"),
        			data: paramData,
        			loading: {
        				title: sabace.getMessage('company.label.tip'),
        				text: sabace.getMessage('company.label.pleaseWait')
        			},
        			success: function(req) {
        				if (req.joinFlag == "9") {
        					bi.dialog.show({
        						title: sabace.getMessage('company.label.succeed'),
        						message: sabace.getMessage('company.msg.joinCompany.success')
        					});
        				} else if (req.joinFlag == "1") {
        					bi.dialog.show({
        						type: bi.dialog.TYPE_WARNING,
        						title: sabace.getMessage('company.label.tip'),
        						message: sabace.getMessage('company.msg.joinCompany.alreadyJoin')
        					});
        				} else if (req.joinFlag == "2") {
        					bi.dialog.show({
        						type: bi.dialog.TYPE_WARNING,
        						title: sabace.getMessage('company.label.tip'),
        						message: sabace.getMessage('company.msg.joinCompany.alreadyAgree')
        					});
        				} else if (req.joinFlag == "3") {
        					bi.dialog.show({
        						type: bi.dialog.TYPE_WARNING,
        						title: sabace.getMessage('company.label.tip'),
        						message: sabace.getMessage('company.msg.joinCompany.alreadySend')
        					});
        				} else {
        					bi.dialog.show({
        						type: bi.dialog.TYPE_DANGER,
        						title: sabace.getMessage('company.label.error'),
        						message: sabace.getMessage('company.msg.joinCompany.fail')
        					});
        				}
        			},
        			error: function(req) {
        				bi.dialog.show({
        					type: bi.dialog.TYPE_DANGER,
        					title: sabace.getMessage('company.label.error'),
        					message: req.responseText || sabace.getMessage('company.msg.joinCompany.error')
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