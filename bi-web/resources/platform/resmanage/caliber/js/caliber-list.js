define(['sabace','caliber/message'], function(sabace,message) {
	
	var calibertList = {};

	var projectId;
	jQuery(function(){
		jQuery("body").on("change","#caliberProjectId",function(){
			projectId = $(this).val();
			console.log(projectId);
		})
	});
	//展示
	caliberList.view={
			//初始化
			caliberDateList:function (){

				var postData = {};
				$("#caliberDateList").jqGrid({
					 url: sabace.handleUrlParam('/platform/resmanage/caliber/query-caliber-date'),
					 styleUI: 'Bootstrap',
					 datatype: "json",
					 postData: postData,
					 mtype: 'post',
					 forceFit: true,
					 gridComplete: function() {
			 				jQuery("input[type=checkbox]").on("click",caliberList.view.selectRow);
						},
					 onSelectRow: function(rowid) {
							var checkFlag = jQuery('tr[id=' + rowid + ']>td>input').prop("checked");
							jQuery("input[type=checkbox]").prop("checked", false);
							jQuery('tr[id=' + rowid + ']>td>input').prop("checked", !checkFlag);
							if(checkFlag){
								$("#caliberDateList").trigger("reloadGrid");
								
							};
							var selRow = $('#caliberDateList').jqGrid('getRowData', rowid);
							
							if ("false" == selRow["optFlag"])
							{
								jQuery("#edit").addClass("disabled");
								jQuery("#delete").addClass("disabled");
							}
							else
							{
								jQuery("#edit").removeClass("disabled");
								jQuery("#delete").removeClass("disabled");
							}
						},
						beforeSelectRow: function(rowid) {
							
						},
					 colModel: [{
							"name": '',
							"index": 'caliberId',
							"formatter": "checkbox",
							"formatoptions": {
								disabled: false
							},
							"width": 20
						},{
							name: 'caliberId',
							"index": "caliberId",
							"sorttype": "int",
							"key": true,
							"hidden": true
						},{
							label: sabace.getMessage('caliber.caliberlist.label.caliberName'),
							name: 'caliberName',
							width: 100,
							align: 'left',
							hlign: 'center',
							sortable: false
						}, {
							label: sabace.getMessage('caliber.caliberlist.label.caliberDesc'),
							name: 'caliberDesc',
							width: 200,
							align: 'left',
							hlign: 'center',
							sortable: false
						},{
							label: sabace.getMessage('caliber.caliberlist.label.adminId'),
							name: 'adminId',
							width: 100,
							align: 'left',
							hlign: 'center',
							sortable: false
						},{
							label: sabace.getMessage('caliber.caliberlist.label.adminTime'),
							name: 'adminTime',
							width: 100,
							align: 'left',
							hlign: 'center',
							sortable: false
						},{
							"name": "optFlag",
							"hidden": true
						}, {
						 "name": "proId",
						 "hidden": true
					 }],
						
					sortorder: "asc",
					forceFit: true,
					viewrecords: true, // show the current page, data rang and total
					autowidth: true,
					sortname: "caliberId",
					scrollrows: true,
					columnsResize: true,
					height: 'auto',
					rowNum: 10,
					rowList: [10, 20, 30],
					pager: "#caliberListGridPager",
					jsonReader: {
						records: "total",
						total: "totalPages"
					},
					afterInsertRow: function(rowId, data) {
						jQuery(this).jqGrid('setCell', rowid, 'operate', '<a>操作</a>');
					},
					regional: 'cn'
				  });
				
			},
			// 点击复选框按钮事件
			selectRow: function() {
				var flag = jQuery(this).prop("checked");
				jQuery("input[type=checkbox]").prop("checked", false);
				jQuery(this).prop("checked", !flag);
				jQuery("#caliberDateList").jqGrid('setSelection', jQuery(this).parent().next().text());
			},
			
			//删除
			caliberDateDel: function () {
				if (jQuery("#delete").hasClass("disabled"))
				{
					return;
				}	
				var id = $('#caliberDateList').jqGrid('getGridParam', "selrow");
				var sleRow = $('#caliberDateList').jqGrid('getRowData', id);
				var caliberId = sleRow["caliberId"];
				
				//如果没有选择
				var checkFlag =jQuery("#"+id).find("input[type='checkbox']").prop("checked");
				if (sabace.IsEmpty(id) || !checkFlag) {
					bi.dialog.show({
						type: 'type-warning',
						title: sabace.getMessage('caliber.caliberlist.msg.prompt'),
						message: sabace.getMessage('caliber.caliberlist.msg.empty'),
					});
					return;
				} else {
					bi.dialog.confirm({
						title: sabace.getMessage('caliber.caliberlist.msg.prompt'),
						message: sabace.getMessage('caliber.caliberlist.msg.confirm.delete'),
						callback: function(result) {
							if (result) {
								sabace.ajax({
									type: "post",
									cache: false,
									dataType: "json",
									data: {
										caliberId: caliberId
									},
									url: sabace.handleUrlParam("/platform/resmanage/caliber/del-caliber-date"),
									success: function(req) {
										jQuery('#caliberDateList').trigger("reloadGrid");
										bi.dialog.show({
											title: sabace.getMessage('caliber.caliberlist.msg.prompt'),
											message: req.responseText || sabace.getMessage('caliber.caliberlist.msg.delsuccess')
										});
									},
									error: function(req) {
										bi.dialog.show({
											type: bi.dialog.TYPE_DANGER,
											title: sabace.getMessage('caliber.caliberlist.msg.prompt'),
											message: req.responseText || sabace.getMessage('caliber.caliberlist.msg.del.exception')
										});
									}
								});
							}
						}
					});
				}
			},
			//修改
			caliberDateEdit:function(){
				if (jQuery("#edit").hasClass("disabled"))
				{
					return;
				}	
				jQuery("#caliberName").attr("value", "");
				jQuery("#caliberDesc").attr("value", "");
				var id = $('#caliberDateList').jqGrid('getGridParam', "selrow");
				var sleRow = $('#caliberDateList').jqGrid('getRowData', id);
				var caliberName = sleRow["caliberName"];
				var caliberId = sleRow["caliberId"];
				var caliberDesc = sleRow["caliberDesc"];
				var proIdOrigin = sleRow["proId"];

				//如果没有选择
				var checkFlag =jQuery("#"+id).find("input[type='checkbox']").prop("checked");
				if (sabace.IsEmpty(id) || !checkFlag) {
					bi.dialog.show({
						type: 'type-warning',
						title: sabace.getMessage('caliber.caliberlist.msg.prompt'),
						message: sabace.getMessage('caliber.caliberlist.msg.empty'),
					});
					return;
				}
				jQuery("#caliberName").attr("value", caliberName);
				jQuery("#caliberDesc").html(caliberDesc);
				jQuery("#caliberProjectId").find("option[value="+proIdOrigin+"]").attr("selected",true);
				// 字段编辑对话框
				var dialog = bi.dialog.show({
					title: sabace.getMessage('caliber.caliberlist.label.editCaliber'),
					message: jQuery("#add-page").outerHTML(),
					nl2br: false,
					closable: true,
					closeByBackdrop: false,
					closeByKeyboard: false,
					cssClass: 'caliber-add-dialog',
					buttons: [{
						label: sabace.getMessage('caliber.caliberlist.button.cancel'),
						action: function(dialog) {
							dialog.close();
						}
					}, {
						label: sabace.getMessage('caliber.caliberlist.button.save'),
						cssClass: 'btn-info',
						action: function(dialogItself) {

							// 判断验证
							if(projectId == "" || null == projectId){
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('caliber.caliberlist.label.tip'),
									message:sabace.getMessage('caliber.msg.chooseProjectName')
								});
								return false;
							}
							var isPass = dialog.getModalBody().find("#add-page").validationEngine('validate');
							if (!isPass) {
								return false;
							}
							bi.dialog.confirm({
								title: sabace.getMessage('caliber.caliberlist.title.confirm'),
								message: sabace.getMessage('caliber.caliberlist.msg.saveConfirm'),
								callback: function(result) {
									if (!result) {
										return;
									}
									var caliberName = dialog.getModalBody().find("#caliberName").val();
									var caliberDesc = dialog.getModalBody().find("#caliberDesc").val();
									var dataParams = {
										caliberId: caliberId,
										caliberName: caliberName,
										caliberDesc: caliberDesc,
										proId:projectId
									};
									sabace.ajax({
										loading: {
											title: sabace.getMessage('caliber.caliberlist.label.tip'),
											text: sabace.getMessage('caliber.caliberlist.label.pleaseWait')
										},
										url: sabace.handleUrlParam("/platform/resmanage/caliber/add-edit-caliber-date"),
										data: dataParams,
										success: function(req) {
											var result = req.result;
											if("0" == result){
												var nameExist = req.nameExist;
												if("1" == nameExist){
													bi.dialog.show({
														type: bi.dialog.TYPE_DANGER,
														title: sabace.getMessage('caliber.caliberlist.label.tip'),
														message: sabace.getMessage('caliber.caliberlist.msq.CaliberExist')
													});
												}
											}else{
												jQuery('#caliberDateList').trigger("reloadGrid");
												dialog.close();
												bi.dialog.show({
													title: sabace.getMessage('caliber.caliberlist.label.tip'),
													message:sabace.getMessage('caliber.caliberlist.msq.saveSuccess')
												});
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('caliber.caliberlist.label.tip'),
												message: req.responseText || sabace.getMessage('caliber.caliberlist.msg.save.exception')
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
				
			},
			//新增
			caliberDateAdd:function(){
				jQuery("#caliberName").attr("value", "");
				jQuery("#caliberDesc").html("");
				var dialog = bi.dialog.show({
					title: sabace.getMessage('caliber.caliberlist.title.caliberAdd'),
					message: jQuery("#add-page").outerHTML(),
					nl2br: false,
					closable: true,
					closeByBackdrop: false,
					closeByKeyboard: false,
					buttons: [{
						label: sabace.getMessage('caliber.caliberlist.button.cancel'),
						action: function(dialog) {
							dialog.close();
						}
					}, {
						label: sabace.getMessage('caliber.caliberlist.button.save'),
						cssClass: 'btn-info',
						action: function(dialogItself) {
							// 判断验证
							if(projectId == "" || null == projectId){
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('caliber.caliberlist.label.tip'),
									message:sabace.getMessage('caliber.msg.chooseProjectName')
								});
								return false;
							}
							var isPass = dialog.getModalBody().find("#add-page").validationEngine('validate');
							if (!isPass) {
								return false;
							}
							bi.dialog.confirm({
								title: sabace.getMessage('caliber.caliberlist.title.confirm'),
								message: sabace.getMessage('caliber.caliberlist.msg.saveConfirm'),
								callback: function(result) {
									if (!result) {
										return;
									}

									var caliberName = dialog.getModalBody().find("#caliberName").val();
									var caliberDesc = dialog.getModalBody().find("#caliberDesc").val();
									var dataParams = {
										caliberName: caliberName,
										caliberDesc: caliberDesc,
										proId:projectId
									};
									sabace.ajax({
										data: dataParams,
										loading: {
											title: sabace.getMessage('caliber.caliberlist.label.tip'),
											text: sabace.getMessage('caliber.caliberlist.label.pleaseWait')
										},
										url: sabace.handleUrlParam("/platform/resmanage/caliber/add-edit-caliber-date"),
										success: function(req) {
											var result = req.result;
											if("0" == result){
												var nameExist = req.nameExist;
												if("1" == nameExist){
													bi.dialog.show({
														type: bi.dialog.TYPE_DANGER,
														title: sabace.getMessage('caliber.caliberlist.label.tip'),
														message: "当前口径名称已存在，请修改后重试！"
													});
												}
											}else{
												jQuery('#caliberDateList').trigger("reloadGrid");
												dialog.close();
												bi.dialog.show({
													title: sabace.getMessage('caliber.caliberlist.label.tip'),
													message: "口径信息保存成功"
												});
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('caliber.caliberlist.label.tip'),
												message: req.responseText || sabace.getMessage('caliber.caliberlist.msg.save.exception')
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
			
	}
	
	//控制
	caliberList.controller={
			init:function(){
				/**
				 * 查询
				 */
			    jQuery("#search").on("click", function() {
			    	var caliberName = $("#listCaliberName").val();
			    	var caliberDesc = $("#listCaliberDesc").val();
			    	var postData = {};
			    	postData.caliberName = caliberName;
			    	postData.caliberDesc = caliberDesc;
			    	jQuery("#caliberDateList").jqGrid("setGridParam", {
						postData: postData
					}).trigger("reloadGrid");
			    });
			    //初始化数据
				caliberList.view.caliberDateList();
				
				/**
				 * 有效期增加
				 */
				$('#add').on("click", function() {
					caliberList.view.caliberDateAdd();
				     });
				
				/**
				 * 有效期修改
				 */
				$('#edit').on("click", function() {
					caliberList.view.caliberDateEdit();
				     });
				
				/**
				 * 有效期删除
				 */
				$('#delete').on("click", function() {
					caliberList.view.caliberDateDel();
				     });
				
				//jqGrid自适应
				jQuery(window).resize(function() {
					$("#caliberDateList").setGridWidth($("#caliberListPanel").width() - 20);
				});
			}
		}
	return caliberList.controller
});