define(['sabace', 'message'], function(sabace, message) {

	function init() {
		jQuery('#depTree').jqGrid({
			url: sabace.handleUrlParam("/platform/sysmanage/dept/dept-list"),
			styleUI: 'Bootstrap',
			postData: '',
			datatype: "json",
			height: "auto",
			autowidth: true,
			treeGrid: true,
			ExpandColumn: "depName",
			treeGridModel: "adjacency",
			regional: 'cn',
			mtype: 'post',
			forceFit: true,
			loadComplete: function() {
				// 修改表格树状组件前边按钮的宽度
				$(".tree-wrap").width(function() {
					return $(this).width() + 14;
				});
			},
			colModel: [{
				index: 'depId',
				label: sabace.getMessage('company.dept.label.select'),
				formatter: function(cellvalue, options, rowObject) {
					var html = '<input type="checkbox" id="selectDepId" value="' + rowObject.depId + '" name="' + rowObject.depName + '" depDegree="' + rowObject.depDegree + '" allUserCount="' + rowObject.allUserCount + '" parentId="' + rowObject.parent + '" parentName="' + rowObject.parentName + '"/>';
					html += '<div style="display:none">' + rowObject.depDesc + '</div>';
					return html;
				},
				cellattr: function(rowId, tv, rawObject, cm, rdat) {
					if (!rawObject.depId) {
						var colModel = jQuery(this).jqGrid('getGridParam', 'colModel');
						return 'colspan=' + colModel.length;
					}
				},
				hlign: "center",
				align: "center",
				sortable: false,
				width: 50,
				title:false
			}, {
				name: "depId",
				key: true,
				hidden: true,
				sortable: false
			}, {
				name: "depName",
				index: "depName",
				label: sabace.getMessage('company.dept.label.depName'),
				hlign: "center",
				sortable: false,
				width: 300
			}, {
				name: "userCount",
				index: "userCount",
				label: sabace.getMessage('company.dept.label.userCount'),
				hlign: "center",
				align: "right",
				sortable: false,
				width: 90
			}, {
				name: "allUserCount",
				index: "allUserCount",
				label: sabace.getMessage('company.dept.label.allUserCount'),
				hlign: "center",
				align: "right",
				sortable: false,
				width: 90
			}, {
				name: "depDesc",
				index: "depDesc",
				label: sabace.getMessage('company.dept.label.depDesc'),
				hlign: "center",
				sortable: false,
				width: 240
			}, {
				name: "adminId",
				index: "adminId",
				label: sabace.getMessage('company.dept.label.adminName'),
				hlign: "center",
				sortable: false,
				width: 100
			}, {
				name: "adminTime",
				index: "adminTime",
				label: sabace.getMessage('company.dept.label.adminTime'),
				hlign: "center",
				sortable: false,
				width: 130
			}]
		});

		// 点击查询的操作
		jQuery("#searchButton").on("click", function() {
			queryCompanyDepList();
		});

		// 点击新增的操作
		jQuery("#addDepButton").on("click", function() {
			operAddDepDialog();
		});

		// 点击修改的操作
		jQuery("#modifyDepButton").on("click", function() {
			operModifyDepDialog();
		});

		// 点击删除的操作
		jQuery("#delDepButton").on("click", function() {
			operDelDepDialog();
		});

		// 监控页面的宽度变化，并修改部门表格的宽度
		$(window).resize(function() {
			$("#depTree").setGridWidth($("#depListPanel").width() - 5);
		});
	}

	// 根据录入的查询条件，查询部门信息
	function queryCompanyDepList() {
		var postData = {};
		postData.depName = $("#queryDepName").val();
		postData.depDesc = $("#queryDepDesc").val();

		jQuery("#depTree").jqGrid("setGridParam", {
			postData: postData
		}).trigger("reloadGrid");
	}

	// 打开部门信息的新增窗口
	function operAddDepDialog() {
		var checkArray = $("#selectDepId:checked");
		if (checkArray.length != 1) {
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('company.label.tip'),
				message: sabace.getMessage('company.dept.mag.supper.noselect'),
			});
			return;
		}

		// 新增框
		var addDialog = bi.dialog.show({
			title: sabace.getMessage('company.dept.label.deptAdd'),
			message: jQuery("#depInfoPanel").outerHTML(),
			nl2br: false,
			closable: true,
			cssClass: 'open-dialog',
			closeByBackdrop: false,
			closeByKeyboard: false,
			buttons: [{
				label: sabace.getMessage('company.button.cancel'),
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: sabace.getMessage('company.button.save'),
				cssClass: 'btn-info',
				action: function(dialog) {
					var isPass = dialog.getModalBody().find("#depInfoPanel").validationEngine('validate');
					if (!isPass) {
						return false;
					}
					bi.dialog.confirm({
						title: sabace.getMessage('company.label.confirm'),
						message: sabace.getMessage('company.dept.msg.saveConfirm'),
						callback: function(result) {
							if (!result) {
								return;
							}
							saveCompanyDepInfo(addDialog, 'add');
						}
					});
				}
			}]
		});

		var selectDepId = jQuery(checkArray[0]).val();
		var selectDepName = jQuery(checkArray[0]).attr("name");
		addDialog.getModalBody().find("#parentDepName").val(selectDepName);
		addDialog.getModalBody().find("#parentDepId").val(selectDepId);
		

		addDialog.getModalBody().find("#depInfoPanel").validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
		
		setTimeout(function(){
			addDialog.getModalBody().find("#depDesc").html("").focus().blur();
		},150)
		
	}

	// 打开部门信息的修改窗口
	function operModifyDepDialog() {
		var checkArray = $("#selectDepId:checked");
		if (checkArray.length != 1) {
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('company.label.tip'),
				message: sabace.getMessage('company.dept.msg.edit.noselect'),
			});
			return;
		}

		// 如果部门层级为1，则说明是跟节点，不能编辑
		var selectDepDegree = jQuery(checkArray[0]).attr("depDegree");
		if (selectDepDegree == 1) {
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('company.label.tip'),
				message: sabace.getMessage('company.dept.msg.editRoot'),
			});
			return;
		}

		// 修改框
		var modifyDialog = bi.dialog.show({
			title: sabace.getMessage('company.dept.label.deptEdit'),
			message: jQuery("#depInfoPanel").outerHTML(),
			nl2br: false,
			closable: true,
			cssClass: 'open-dialog',
			closeByBackdrop: false,
			closeByKeyboard: false,
			buttons: [{
				label: sabace.getMessage('company.button.cancel'),
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: sabace.getMessage('company.button.save'),
				cssClass: 'btn-info',
				action: function(dialog) {
					var isPass = dialog.getModalBody().find("#depInfoPanel").validationEngine('validate');
					if (!isPass) {
						return false;
					}
					bi.dialog.confirm({
						title: sabace.getMessage('company.label.confirm'),
						message: sabace.getMessage('company.dept.msg.saveConfirm'),
						callback: function(result) {
							if (!result) {
								return;
							}
							saveCompanyDepInfo(modifyDialog, 'modify');
						}
					});
				}
			}]
		});

		var selectDepId = jQuery(checkArray[0]).val();
		var selectDepName = jQuery(checkArray[0]).attr("name");
		var selectParentDepId = jQuery(checkArray[0]).attr("parentId");
		var selectParentDepName = jQuery(checkArray[0]).attr("parentName");
		var selectDepDesc = jQuery(checkArray[0]).next().html();
		modifyDialog.getModalBody().find("#parentDepId").val(selectParentDepId);
		modifyDialog.getModalBody().find("#parentDepName").val(selectParentDepName);
		modifyDialog.getModalBody().find("#depId").val(selectDepId);
		modifyDialog.getModalBody().find("#depName").val(selectDepName);
		modifyDialog.getModalBody().find("#depDesc").val(selectDepDesc);

		modifyDialog.getModalBody().find("#depInfoPanel").validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
	}

	// 做部门信息删除前的确认
	function operDelDepDialog() {
		var checkArray = $("#selectDepId:checked");
		if (checkArray.length < 1) {
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('company.label.tip'),
				message: sabace.getMessage('company.dept.msg.del.noselect'),
			});
			return;
		}

		var depIdArray = [];
		for (var i = 0; i < checkArray.length; i++) {
			depIdArray[i] = jQuery(checkArray[i]).val();
			var depName = jQuery(checkArray[i]).attr("name");
			var allUserCount = jQuery(checkArray[i]).attr("allUserCount");
			var depDegree = jQuery(checkArray[i]).attr("depDegree");
			if (parseInt(depDegree) == 1) {
				bi.dialog.show({
					type: 'type-warning',
					title: sabace.getMessage('company.label.tip'),
					message: sabace.getMessage('company.dept.msg.delRoot'),
				});
				return;
			}

			if (parseInt(allUserCount) > 0) {
				bi.dialog.show({
					type: 'type-warning',
					title: sabace.getMessage('company.label.tip'),
					message: sabace.getMessage('company.dept.msg.del.hasUser', depName),
				});
				return;
			}
		}

		bi.dialog.confirm({
			title: sabace.getMessage('company.label.confirm'),
			message: sabace.getMessage('company.dept.msg.delConfirm'),
			callback: function(result) {
				if (!result) {
					return;
				}
				delCompanyDepInfo(depIdArray);
			}
		});
	}

	// 执行部门信息保存处理操作
	function saveCompanyDepInfo(dialog, type) {
		var paramData = {};
		paramData.depId = dialog.getModalBody().find("#depId").val();
		paramData.depName = dialog.getModalBody().find("#depName").val().trim();
		paramData.parentDepId = dialog.getModalBody().find("#parentDepId").val();
		paramData.depDesc = dialog.getModalBody().find("#depDesc").val();
		paramData.type = type;

		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/dept/check-dept-name"),
			data: paramData,
			loading: {
				title: sabace.getMessage('company.label.tip'),
				text: sabace.getMessage('company.label.pleaseWait')
			},
			success: function(req) {
				var flag = req.flag;
				if (req.flag == "1") {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('company.label.tip'),
						message: sabace.getMessage('company.dept.msg.checkDeptName'),
						buttons: [{
							label: sabace.getMessage('company.label.confirm'),
							cssClass: 'btn-info',
							action: function(dialogItself) {
								dialogItself.close();
							}
						}]
					});
				}
				if (req.flag == "0") {
					sabace.ajax({
						url: sabace.handleUrlParam("/platform/sysmanage/dept/save-dept"),
						data: paramData,
						success: function(req) {
							if (req.saveFlag == "true") {
								bi.dialog.show({
									title: sabace.getMessage('company.label.succeed'),
									message: sabace.getMessage(req.retMsg),
									buttons: [{
										label: sabace.getMessage('company.label.confirm'),
										cssClass: 'btn-info',
										action: function(dialogItself) {
											queryCompanyDepList();
											dialogItself.close();
											dialog.close();

										}
									}]
								});
							} else {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('company.label.error'),
									message: sabace.getMessage(req.retMsg)
								});
							}
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('company.label.error'),
								message: sabace.getMessage('company.dept.msg.save.error')
							});
						}
					});
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('company.label.error'),
					message: req.responseText || sabace.getMessage('company.dept.msg.save.error')
				});
			}
		});
	}

	// 执行部门信息删除处理操作
	function delCompanyDepInfo(depIdArray) {
		var paramData = {};
		paramData.depIdArray = depIdArray;

		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/dept/delete-dep-list"),
			data: paramData,
			loading: {
				title: sabace.getMessage('company.label.tip'),
				text: sabace.getMessage('company.label.pleaseWait')
			},
			success: function(req) {
				if (req.delFlag == "true") {
					bi.dialog.show({
						title: sabace.getMessage('company.label.succeed'),
						message: sabace.getMessage(req.retMsg),
						onhide: function() {
							queryCompanyDepList();
						}
					});
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('company.label.error'),
						message: sabace.getMessage(req.retMsg, req.depName)
					});
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('company.label.error'),
					message: req.responseText || sabace.getMessage('company.dept.msg.del.error')
				});
			}
		});
	}

	//返回页面所需方法
	return {
		init: init
	}
});