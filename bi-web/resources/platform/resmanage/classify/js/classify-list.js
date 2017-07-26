define(['sabace', 'classify/order'], function(sabace, classifyOrder) {
	var projectId;
	jQuery(function(){
		// 初始化订购记录列表
		initClassifyList();
		
		// 绑定按钮事件
		jQuery('#add').on("click", addClassify);
		jQuery('#search').on("click", queryClassifyList);
		jQuery('#order').bind("click", orderClassifyList);
			
		
		jQuery("#claasifyListPanel").on("click", '.classifyEdit', function(){
			modifyClassify(this);
		});
		jQuery("#claasifyListPanel").on("click", '.classifyDelete', function(){
			deleteClassify(this);
		});
		jQuery("body").on("change","#classifyProjectId",function(){
			projectId = $(this).val();
			console.log(projectId);
		})
	});

	function initClassifyList(){
		var postData = {};
		$("#claasifyListGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/resmanage/classify/classify-list'),
			styleUI: 'Bootstrap',
			autowidth: true,
			postData: postData,
			height: 'auto',
			mtype: 'post',
			regional: 'cn',
			datatype: "json",
			viewrecords: true, 
			forceFit: true,
			//rownumbers: true,
			colModel: [{
				label: "排序编码",
				name: 'orderId',
				width: 80,
				align: 'center',
				hlign: 'center',
				sortable: false
			}, {
				label: "业务分类编码",
				name: 'classifyId',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false,
				hidden: true
			}, {
                label: "租户名称",
                name: 'proName',
                width: 150,
                align: 'left',
                hlign: 'center',
                sortable: false
            }
			, {
				label: "业务分类名称",
				name: 'classifyName',
				width: 150,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: "业务分类描述",
				name: 'classifyDesc',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: "创建人",
				name: 'createId',
				width: 80,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: "更新时间",
				name: 'adminTime',
				width: 120,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				"name": "proId",
				"hidden": true
			}, {
				label: "操作",
				name: 'operate',
				width: 130,
				align: 'center',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					var classifyId = rowObject.classifyId;
					var classifyName = rowObject.classifyName;
					var classifyDesc = rowObject.classifyDesc;
					var classifyProId = rowObject.proId;
					return "<a href='javascript:void(0)' class='classifyEdit' classifyId='" + classifyId + "' classifyName='" + classifyName + "' classifyDesc='" + classifyDesc + "' classifyProId='" + classifyProId + "'>"+sabace.getMessage('classify.label.modify')+"</a> / " +
						"<a href='javascript:void(0)' class='classifyDelete' classifyId='" + classifyId + "'>"+sabace.getMessage('classify.label.delete')+"</a> ";
//					var orderEndDate = rowObject.orderEndDate;
//					if(sabace.IsEmpty(orderEndDate)){
//						return "<a href='javascript:void(0)' class='orderEdit' orderId='" + orderId + "' orderEndDate='"+rowObject.orderEndDate+"' orderNum='"+rowObject.orderNum+"'>变更</a> /  " +
//						"<a href='javascript:void(0)' class='orderClose' orderId='" + orderId + "'>关闭</a> ";
//					}else{
//						return "<a href='javascript:void(0)' class='orderEdit' orderId='" + orderId + "' orderEndDate='"+rowObject.orderEndDate+"' orderNum='"+rowObject.orderNum+"'>变更</a>";
//					}
				}
			}],
			rowNum: 10,
			rowList: [10, 20, 30],
			pager: "#claasifyListGridPager",
			jsonReader: {
				records: "total",
				total: "totalPages"
			},
			afterInsertRow: function(rowId, data) {
				jQuery(this).jqGrid('setCell', rowid, 'operate', '<a>'+sabace.getMessage('order.label.operation')+'</a>');
			}
		});
	}
	
	function addClassify(){
		jQuery("#classifyName").attr("value", "");
		jQuery("#description").html("");
		var dialog = bi.dialog.show({
			title: "新增业务分类",
			message: jQuery("#add-page").outerHTML(),
			nl2br: false,
			closable: true,
			closeByBackdrop: false,
			closeByKeyboard: false,
			buttons: [{
				label: "取消",
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: "保存",
				cssClass: 'btn-info',
				action: function(dialogItself) {
					// 判断验证
					if(projectId == "" || null == projectId){
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('classify.label.tip'),
							message:sabace.getMessage('classify.msg.chooseProjectName')
						});
						return false;
					}
					var isPass = dialog.getModalBody().find("#add-page").validationEngine('validate');
					if (!isPass) {
						return false;
					}
					bi.dialog.confirm({
						title: "确认",
						message: "您确定要保存业务分类信息吗？",
						callback: function(result) {
							if (!result) {
								return;
							}

							var classifyName = dialog.getModalBody().find("#classifyName").val();
							var description = dialog.getModalBody().find("#description").val();
							var dataParams = {
								classifyName: classifyName,
								classifyDesc: description,
								proId:projectId
							};
							sabace.ajax({
								data: dataParams,
								loading: {
									title: sabace.getMessage('classify.label.tip'),
									text: sabace.getMessage('classify.label.pleaseWait')
								},
								url: sabace.handleUrlParam("/platform/resmanage/classify/save-classify"),
								success: function(req) {
									var saveFlag = req.saveFlag;
									if("0" == saveFlag){
										var nameExist = req.nameExist;
										if("1" == nameExist){
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('classify.label.tip'),
												message: "当前企业下已经存在该业务分类名称，请修改后重试！"
											});
										}
									}else{
										jQuery('#claasifyListGrid').trigger("reloadGrid");
										dialog.close();
										bi.dialog.show({
											title: sabace.getMessage('classify.label.tip'),
											message: "业务分类信息保存成功"
										});
									}
								},
								error: function(req) {
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: sabace.getMessage('classify.label.tip'),
										message: req.responseText || sabace.getMessage('group.msg.save.exception')
									});
								}
							});

						}
					});
				}
			}]
		});
		dialog.getModalBody().find("#add-page").validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'topRight',
			showOneMessage: true
		});
	}
	
	function modifyClassify(obj){
		var classifyId = jQuery(obj).attr("classifyId");
		var classifyName = jQuery(obj).attr("classifyName");
		var classifyDesc = jQuery(obj).attr("classifyDesc");
		var classifyProId = jQuery(obj).attr("classifyProId");
		console.log(classifyProId);
		jQuery("#classifyName").attr("value", classifyName);
		jQuery("#description").html(classifyDesc);
		jQuery("#classifyProjectId").find("option[value="+classifyProId+"]").attr("selected",true);
		var dialog = bi.dialog.show({
			title: "修改业务分类",
			message: jQuery("#add-page").outerHTML(),
			nl2br: false,
			closable: true,
			closeByBackdrop: false,
			closeByKeyboard: false,
			buttons: [{
				label: "取消",
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: "保存",
				cssClass: 'btn-info',
				action: function(dialogItself) {
					// 判断验证
					if(projectId == "" || null == projectId){
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('classify.label.tip'),
							message:sabace.getMessage('classify.msg.chooseProjectName')
						});
						return false;
					}
					var isPass = dialog.getModalBody().find("#add-page").validationEngine('validate');
					if (!isPass) {
						return false;
					}
					bi.dialog.confirm({
						title: "确认",
						message: "您确定要保存业务分类信息吗？",
						callback: function(result) {
							if (!result) {
								return;
							}

							var classifyName = dialog.getModalBody().find("#classifyName").val();
							var description = dialog.getModalBody().find("#description").val();
							var dataParams = {
								classifyId: classifyId,
								classifyName: classifyName,
								classifyDesc: description,
								proId:projectId
							};
							sabace.ajax({
								data: dataParams,
								loading: {
									title: sabace.getMessage('classify.label.tip'),
									text: sabace.getMessage('classify.label.pleaseWait')
								},
								url: sabace.handleUrlParam("/platform/resmanage/classify/save-classify"),
								success: function(req) {
									var saveFlag = req.saveFlag;
									if("0" == saveFlag){
										var nameExist = req.nameExist;
										if("1" == nameExist){
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('classify.label.tip'),
												message: "当前企业下已经存在该业务分类名称，请修改后重试！"
											});
										}
									}else{
										
										jQuery('#claasifyListGrid').trigger("reloadGrid");
										dialog.close();
										bi.dialog.show({
											title: sabace.getMessage('classify.label.tip'),
											message: "业务分类信息修改成功"
										});
									}
									
								},
								error: function(req) {
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: sabace.getMessage('classify.label.tip'),
										message: req.responseText || sabace.getMessage('group.msg.save.exception')
									});
								}
							});
						}
					});
				}
			}]
		});
	}
	
	function deleteClassify(obj){
		var classifyId = jQuery(obj).attr("classifyId");

		bi.dialog.confirm({
			title: "提示",
			message: "删除业务分类信息，相关数据的业务分类信息会被置为空，确认要删除吗？",
			callback: function(result) {
				if (result) {
					sabace.ajax({
						type: "post",
						cache: false,
						dataType: "json",
						url: sabace.handleUrlParam("/platform/resmanage/classify/delete-classify/"),
						data: {
							"classifyId": classifyId
						},
						loading: {
							title: "提示",
							text: "正在删除信息，请稍候……"
						},
						success: function(req) {
								bi.dialog.show({
									title: "提示",
									message: '删除成功！',
									nl2br: false,
									closable: true,
									closeByBackdrop: false,
									closeByKeyboard: false,
									buttons: [{
										label: '确定',
										cssClass: 'btn-info',
										action: function(dialogItself) {
											jQuery('#claasifyListGrid').trigger("reloadGrid");
											dialogItself.close();
										}
									}]
								});
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: "删除失败",
								message: req.responseText || "删除失败"
							});
						}
					});
				}
			}
		});
	}
	
	function queryClassifyList(){
		var postData = {};
		postData.classifyName = jQuery("#className").val();
		postData.classifyDesc = jQuery("#classDesc").val();
		postData.createId = jQuery("#createName").val();
		jQuery("#claasifyListGrid").jqGrid('setGridParam', {
			postData: postData
		}).trigger("reloadGrid");
	}
	
	var orderDialog
	function orderClassifyList(){
		var url = sabace.handleUrlParam("/platform/resmanage/classify/classify-order");
		orderDialog = new bi.dialog.show({
			title: '业务分类排序',
			message: jQuery('<div id="classify-order-dialog"></div>').load(url),
			cssClass: 'classify-order-dialog',
			nl2br: false,
			closable: true,
			closeByBackdrop: false,
			closeByKeyboard: false,
			onshown : function() {
				classifyOrder.init();
			},
			buttons:[{
				label: "取消",
				cssClass: 'btn-default',
				action: function(dialog) {
					dialog.close();
				}
			},{
		   		label: "确定",
		   		cssClass: 'btn-info',
		   		action: function(dialog){
		   			classifyOrder.saveOrder();
				}
			}
		   ]
		});		
	}
	
	function closeOrderDialog(){
		orderDialog.close();
	}
	
	window.closeOrderDialog = closeOrderDialog;
});
