define(['sabace', 'group/message'], function(sabace, message) {
	var projectId;
	jQuery(function() {
		//初始化表格
		groupInit()
			// 绑定查询事件
		jQuery('#search').on("click", groupSearch);
		// 绑定新增按钮事件
		jQuery('#add').on("click", groupAdd);
		// 绑定修改事件
		jQuery('#edit').on("click", groupEdit);
		// 绑定删除事件
		jQuery('#delete').on("click", groupDelete);

		//jqGrid自适应
		jQuery(window).resize(function() {
			$("#groupTree").setGridWidth($("#groupListPanel").width() - 20);
		});

		jQuery("body").on("change","#groupProjectId",function(){
			projectId = $(this).val();
			console.log(projectId);
		})
	});
	//初始化表格事件
	function groupInit() {
		var groupName = jQuery('#listGroupName').val();
		var description = jQuery('#listDescription').val();
		var creater = jQuery('#creater').val();
		postData = {
			groupName: encodeURI(groupName),
			description: encodeURI(description),
			creater: creater
		};

		jQuery('#groupTree').jqGrid({
			url: sabace.handleUrlParam("/platform/resmanage/group/search"),
			styleUI: 'Bootstrap',
			postData: postData,
			regional: 'cn',
			loadtext: sabace.getMessage('group.msg.loading'),
			gridComplete: function() {
				jQuery("input[type=checkbox]").on("click", selectRow);
			},
			onSelectRow: function(rowid) {
				var checkFlag = jQuery('tr[id=' + rowid + ']>td>input').prop("checked");
				jQuery("input[type=checkbox]").prop("checked", false);
				jQuery('tr[id=' + rowid + ']>td>input').prop("checked", !checkFlag);
				if(checkFlag){
					$("#groupTree").trigger("reloadGrid");
					
				};
				var selRow = $('#groupTree').jqGrid('getRowData', rowid);
				
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
			loadComplete: function() {
				$(".tree-wrap").width(function() {
					return $(this).width() + 14;
				});
			},
			colModel: [{
				"name": '',
				"index": 'group_id',
				"formatter": "checkbox",
				"formatoptions": {
					disabled: false
				},
				"width": 30
			}, {
				"name": "group_id",
				"index": "group_id",
				"sorttype": "int",
				"key": true,
				"hidden": true
			},{
                "name": "proName",
                "index": "proName",
                "sorttype": "string",
                "label": '租户名称',
                "width": 100,
                "sortable": false
            },
				{
				"name": "group_name",
				"index": "groupName",
				"sorttype": "string",
				"label": sabace.getMessage('group.label.group.Name'),
				"width": 100,
				"sortable": false
			}, {
				"name": "description",
				"index": "description",
				"sorttype": "numeric",
				"label": sabace.getMessage('group.label.group.Dec'),
				"align": "left",
				"width": 150,
				"sortable": false
			}, {
				"name": "user_name",
				"index": "user_name",
				"sorttype": "numeric",
				"label": sabace.getMessage('group.label.group.Creater'),
				"align": "left",
				"width": 90,
				"sortable": false
			}, {
				"name": "createTime",
				"index": "createTime",
				"sorttype": "numeric",
				"label": sabace.getMessage('group.label.group.Time'),
				"align": "left",
				"width": 120,
				"sortable": false
			}, {
				"name": "boss_id",
				"hidden": true
			}, {
				"name": "optFlag",
				"hidden": true
			}, {
				"name": "proId",
				"hidden": true
			}],
			forceFit: true,
			height: "auto",
			autowidth: true,
			sortname: "group_id",
			scrollrows: true,
			treeGrid: true,
			ExpandColumn: "group_name",
			treedatatype: "json",
			treeGridModel: "adjacency",
			treeReader: {
				"parent_id_field": "boss_id",
				"level_field": "level",
				"leaf_field": "isLeaf",
				"expanded_field": "expanded",
				"loaded": "loaded",
				"icon_field": "icon"
			},
			columnsResize: true,
			sortorder: "asc",
			datatype: "json",
			pager: "#pager",
		});
	}
	//新增指标事件
	function groupAdd() {
		jQuery("#parentGroupName").attr("value", "");
		jQuery("#groupName").attr("value", "");
		jQuery("#description").html("");
		var id = $('#groupTree').jqGrid('getGridParam', "selrow");
		
		var sleRow = $('#groupTree').jqGrid('getRowData', id);
		var groupName = sleRow["group_name"];
		var groupId = sleRow["group_id"];
		
		//如果没有选择
		var checkFlag =jQuery("#"+id).find("input[type='checkbox']").prop("checked");
		if(!checkFlag){
			groupId=undefined;
			groupName = '最上级指标';
		}
		if (sabace.IsEmpty(groupName)) {
			groupName = '最上级指标'
		}
		jQuery("#parentGroupName").attr("value", groupName);
		// 字段新增对话框
		var dialog = bi.dialog.show({
			title: sabace.getMessage('group.label.addGroup'),
			message: jQuery("#add-page").outerHTML(),
			nl2br: false,
			closable: true,
			closeByBackdrop: false,
			closeByKeyboard: false,
			cssClass: 'group-add-dialog',
			buttons: [{
				label: sabace.getMessage('group.button.cancel'),
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: sabace.getMessage('group.button.save'),
				cssClass: 'btn-info',
				action: function(dialogItself) {
					// 判断验证
					if(projectId == "" || null == projectId){
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('group.label.tip'),
							message:sabace.getMessage('group.msg.chooseProjectName')
						});
						return false;
					}
					var isPass = dialog.getModalBody().find("#add-page").validationEngine('validate');
					if (!isPass) {
						return false;
					}
					bi.dialog.confirm({
						title: sabace.getMessage('group.msg.confirm'),
						message: sabace.getMessage('group.msg.saveConfirm'),
						callback: function(result) {
							if (!result) {
								return;
							}

							var parentGroupId = groupId
							var groupName = dialog.getModalBody().find("#groupName").val();
							var description = dialog.getModalBody().find("#description").val();
							var dataParams = {
								parentGroupId: parentGroupId,
								groupName: groupName,
								groupDesc: description,
								proId: projectId
							};
							sabace.ajax({
								data: dataParams,
								loading: {
									title: sabace.getMessage('group.label.tip'),
									text: sabace.getMessage('group.label.pleaseWait')
								},
								url: sabace.handleUrlParam("/platform/resmanage/group/add-group"),
								success: function(req) {
									if(!req.flag){
										bi.dialog.show({
											type: bi.dialog.TYPE_WARNING,
											title: sabace.getMessage('group.label.warn'),
											message:sabace.getMessage('group.msg.group.name.Repetition')
										});
									}
									jQuery('#groupTree').trigger("reloadGrid");
									dialog.close();
								},
								error: function(req) {
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: sabace.getMessage('group.label.tip'),
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
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
	}
	//修改指标事件
	function groupEdit() {
		if (jQuery("#edit").hasClass("disabled"))
		{
			return;
		}	
		jQuery("#parentGroupName").attr("value", "");
		jQuery("#groupName").attr("value", "");
		jQuery("#description").html("");
		var id = $('#groupTree').jqGrid('getGridParam', "selrow");
		var sleRow = $('#groupTree').jqGrid('getRowData', id);
		var groupName = sleRow["group_name"];
		var groupId = sleRow["group_id"];
		var groupDesc = sleRow["description"];
		var parentGroupId = sleRow["boss_id"];
		var projectIdOrigin = sleRow["proId"];
		console.log(projectIdOrigin);
		//判断是否为顶级字段
		if (sabace.IsEmpty(parentGroupId)) {
			var parentGroupName = "最上级字段";
		} else {
			var sleRow = $('#groupTree').jqGrid('getRowData', parentGroupId);
			var parentGroupName = sleRow["group_name"];
		}
		
		//如果没有选择
		var checkFlag =jQuery("#"+id).find("input[type='checkbox']").prop("checked");
		if (sabace.IsEmpty(id) || !checkFlag) {
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('group.msg.prompt'),
				message: sabace.getMessage('group.msg.empty'),
			});
			return;
		}
		jQuery("#parentGroupName").attr("value", parentGroupName);
		jQuery("#groupName").attr("value", groupName);
		jQuery("#description").html(groupDesc);
		console.log(jQuery("#groupProjectId").find("option[value="+projectIdOrigin+"]").val());
		jQuery("#groupProjectId").find("option[value="+projectIdOrigin+"]").attr("selected",true);
		// 字段编辑对话框
		var dialog = bi.dialog.show({
			title: sabace.getMessage('group.label.editGroup'),
			message: jQuery("#add-page").outerHTML(),
			nl2br: false,
			closable: true,
			closeByBackdrop: false,
			closeByKeyboard: false,
			cssClass: 'group-add-dialog',
			buttons: [{
				label: sabace.getMessage('group.button.cancel'),
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: sabace.getMessage('group.button.save'),
				cssClass: 'btn-info',
				action: function(dialogItself) {

					// 判断验证
					if(projectId == "" || null == projectId){
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('group.label.tip'),
							message:sabace.getMessage('group.msg.chooseProjectName')
						});
						return false;
					}
					var isPass = dialog.getModalBody().find("#add-page").validationEngine('validate');
					if (!isPass) {
						return false;
					}
					bi.dialog.confirm({
						title: sabace.getMessage('group.msg.confirm'),
						message: sabace.getMessage('group.msg.saveConfirm'),
						callback: function(result) {
							if (!result) {
								return;
							}
							var groupName = dialog.getModalBody().find("#groupName").val();
							var description = dialog.getModalBody().find("#description").val();
							var dataParams = {
								groupId: groupId,
								groupName: groupName,
								groupDesc: description,
								parentGroupId:parentGroupId,
								proId:projectId
							};
							sabace.ajax({
								loading: {
									title: sabace.getMessage('group.label.tip'),
									text: sabace.getMessage('group.label.pleaseWait')
								},
								url: sabace.handleUrlParam("/platform/resmanage/group/edit-group"),
								data: dataParams,
								success: function(req) {
									if(!req.flag){
										bi.dialog.show({
											type: bi.dialog.TYPE_WARNING,
											title: sabace.getMessage('group.label.warn'),
											message:sabace.getMessage('group.msg.group.edit.name.Repetition')
										});
									}
									dialog.close();
									jQuery('#groupTree').trigger("reloadGrid");
								},
								error: function(req) {
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: sabace.getMessage('group.label.tip'),
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
	//删除指标事件
	function groupDelete() {
		if (jQuery("#delete").hasClass("disabled"))
		{
			return;
		}	
		var id = $('#groupTree').jqGrid('getGridParam', "selrow");
		var sleRow = $('#groupTree').jqGrid('getRowData', id);
		var groupId = sleRow["group_id"];
		var parentGroupId = sleRow["boss_id"];
		
		//如果没有选择
		var checkFlag =jQuery("#"+id).find("input[type='checkbox']").prop("checked");
		if (sabace.IsEmpty(id) || !checkFlag) {
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('group.msg.prompt'),
				message: sabace.getMessage('group.msg.choose.group'),
			});
			return;
		} else {
			bi.dialog.confirm({
				title: sabace.getMessage('group.msg.prompt'),
				message: sabace.getMessage('group.msg.confirm.delete'),
				callback: function(result) {
					if (result) {
						sabace.ajax({
							type: "post",
							cache: false,
							dataType: "json",
							data: {
								groupId: groupId
							},
							url: sabace.handleUrlParam("/platform/resmanage/group/delete-group"),
							success: function(req) {
								jQuery('#groupTree').trigger("reloadGrid");
								bi.dialog.show({
									title: sabace.getMessage('group.msg.prompt'),
									message: req.responseText || sabace.getMessage('group.msg.success')
								});
							},
							error: function(req) {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('group.msg.prompt'),
									message: req.responseText || sabace.getMessage('group.msg.save.exception')
								});
							}
						});
					}
				}
			});
		}
	}
	//查询事件
	function groupSearch() {
		var groupName = jQuery('#listGroupName').val();
		var description = jQuery('#listDescription').val();
		var creater = jQuery('#creater').val();
		postData = {
			groupName: encodeURI(groupName),
			description: encodeURI(description),
			creater: encodeURI(creater)
		};
		jQuery("#groupTree").clearGridData();
		jQuery("#groupTree").jqGrid('setGridParam', {
			postData: postData
		}).trigger("reloadGrid"); //[]数组参数可以省略		
	}

	// 点击复选框按钮事件
	function selectRow() {
		var flag = jQuery(this).prop("checked");
		jQuery("input[type=checkbox]").prop("checked", false);
		jQuery(this).prop("checked", !flag);
		jQuery("#groupTree").jqGrid('setSelection', jQuery(this).parent().next().text());
	}
});