define(['sabace', 'navi/message'], function(sabace, message) {
	
	$(function() {
		//初始化表格
		naviInit();
		
		getLevel1();
		
		// 绑定查询事件
		$('#search').on("click", naviSearch);
		
		// 绑定新增按钮事件
		jQuery('#add').on("click", naviAdd);
		
		// 绑定修改事件
		jQuery('#edit').on("click", naviEdit);
		
		// 绑定删除事件
		jQuery('#delete').on("click", naviDelete);

		//jqGrid自适应
		$(window).resize(function() {
			$("#naviTree").setGridWidth($("#naviListPanel").width() - 20);
		});
		
	});
	
	//初始化表格事件
	function naviInit() {
		
		var level1 = $('#level1').val();
		var level2 = $('#level2').val();
		var level3 = $('#level3').val();
		var creater = $('#creater').val();
		
		var postData = {
			level1: level1,
			level2: level2,
			level3: level3,
			creater:encodeURI(creater)
		};

		$('#naviTree').jqGrid({
			url: sabace.handleUrlParam("/platform/resmanage/navi/search"),
			styleUI: 'Bootstrap',
			postData: postData,
			regional: 'cn',
			loadtext: sabace.getMessage('navi.msg.loading'),
			gridComplete: function() {
				
				$('#naviTree tbody tr.jqgrow').each(function(){
					var $this = $(this);
					
					var level = $this.find('td[aria-describedby="naviTree_level"]').html();
					
					if(level==3){
						$this.find('td[aria-describedby="naviTree_"] input[type="checkbox"]').hide();
					}else{
						$this.find('td[aria-describedby="naviTree_"] input[type="checkbox"]').on("click", selectRow);
					}
					
				});
			},
			onSelectRow: function(rowid) {
				
				var selRow = $('#naviTree').jqGrid('getRowData', rowid);
				
				if(selRow["level"]==3){
					return;
				}
				
				var checkFlag = $('tr[id=' + rowid + ']>td>input').prop("checked");
				$("input[type=checkbox]").prop("checked", false);
				$('tr[id=' + rowid + ']>td>input').prop("checked", !checkFlag);
				if(checkFlag){
					$("#naviTree").trigger("reloadGrid");
					
				};

				if ("false" == selRow["optFlag"])
				{
					$("#edit").addClass("disabled");
					$("#delete").addClass("disabled");
				}
				else
				{
					$("#edit").removeClass("disabled");
					$("#delete").removeClass("disabled");
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
				"index": 'navi_id',
				"formatter": "checkbox",
				"formatoptions": {
					disabled: false
				},
				"width": 30
			}, {
				"name": "navi_id",
				"index": "navi_id",
				"sorttype": "int",
				"key": true,
				"hidden": true
			}, {
				"name": "navi_name",
				"index": "naviName",
				"sorttype": "string",
				"label": sabace.getMessage('navi.label.navi.Name'),
				"width": 150,
				"sortable": false
			}, {
				"name": "description",
				"index": "description",
				"sorttype": "numeric",
				"label": sabace.getMessage('navi.label.navi.Dec'),
				"align": "left",
				"width": 150,
				"sortable": false
			}, {
				"name": "user_name",
				"index": "user_name",
				"sorttype": "numeric",
				"label": sabace.getMessage('navi.label.navi.Creater'),
				"align": "left",
				"width": 90,
				"sortable": false
			}, {
				"name": "createTime",
				"index": "createTime",
				"sorttype": "numeric",
				"label": sabace.getMessage('navi.label.navi.Time'),
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
				"name": "level",
				"hidden": true
			},{
				"name": "naviCode",
				"hidden": true
			}],
			forceFit: true,
			height: "auto",
			autowidth: true,
			sortname: "navi_id",
			scrollrows: true,
			treeGrid: true,
			ExpandColumn: "navi_name",
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
	
	// 点击复选框按钮事件
	function selectRow() {
		var flag = $(this).prop("checked");
		$("input[type=checkbox]").prop("checked", false);
		$(this).prop("checked", !flag);
		$("#naviTree").jqGrid('setSelection', $(this).parent().next().text());
	}
	
	function getLevel1(){
		
		
		$('#level1').append('<option value="">&nbsp</option>');
		$('#level2').append('<option value="">&nbsp</option>');

		$('#level1').chosen({
			disable_search: true
		});
		
		$('#level2').chosen({
			disable_search: true
		});
		
		
		getNaviLevel("1","",function(req){
			
			if(req==null || req.length==0){
				
				$('#level1').empty();
				$('#level1').append('<option value ="">无</option>');
				$('#level1').trigger("chosen:updated");
				
				return;
			}
			
			for(var i=0;i<req.length;i++){
				var option = req[i];
				
				$('#level1').append('<option value ="'+option.naviId+'">'+option.naviName+'</option>');
				
			}
			
			//$('#level1').unbind();
			$('#level1').bind('change',function(){

				var val = $("#level1").val();
				if(val!=''){
					getLevel2(val);
				}else{
					$('#level2').empty();
					$('#level2').append('<option value="">&nbsp</option>');
					$('#level2').trigger("chosen:updated");
				}
			});
			
			$('#level1').trigger("chosen:updated");
			
		});
		
	}
	
	
	function getLevel2(parentNaviId){
		
		$('#level2').empty();
		$('#level2').append('<option value="">&nbsp</option>');
		$('#level2').trigger("chosen:updated");
		
		getNaviLevel("2",parentNaviId,function(req){
			
			if(req==null || req.length==0){
				
				$('#level2').empty();
				$('#level2').append('<option value ="">无</option>');
				$('#level2').trigger("chosen:updated");

				return;
			}
			
			for(var i=0;i<req.length;i++){
				var option = req[i];
				
				$('#level2').append('<option value ="'+option.naviId+'">'+option.naviName+'</option>');
				
			}
			
			$('#level2').trigger("chosen:updated");
			
		});
			
			
	}
	
	function getNaviLevel(level, parentNaviId, func){
		
		sabace.ajax({
			url: sabace.handleUrlParam('/platform/resmanage/navi/level'),
			data: {
				"level": level,
				"parentNaviId": parentNaviId
			},
			success: function(req) {
				func(req);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('navi.msg.prompt'),
					message: req.responseText || sabace.getMessage('navi.label.level.error')
				});
			}
		});
		
	};
	
	//查询事件
	function naviSearch() {
		var level1 = $('#level1').val();
		var level2 = $('#level2').val();
		var level3 = $('#level3').val();
		var creater = $('#creater').val();
		
		var postData = {
			level1: level1,
			level2: level2,
			level3: level3,
			creater:encodeURI(creater)
		};
		
		$("#naviTree").clearGridData();
		$("#naviTree").jqGrid('setGridParam', {
			postData: postData
		}).trigger("reloadGrid"); //[]数组参数可以省略		
	}
	
	//新增导航事件
	function naviAdd() {		
		
		$("#parentNaviName").attr("value", "");
		$("#naviName").attr("value", "");
		$("#description").html("");
		var id = $('#naviTree').jqGrid('getGridParam', "selrow");
		
		var sleRow = $('#naviTree').jqGrid('getRowData', id);
		var naviName = sleRow["navi_name"];
		var naviId = sleRow["navi_id"];
		var level = sleRow["level"]||0;
		
		//如果没有选择
		var checkFlag =$("#"+id).find("input[type='checkbox']").prop("checked");
		
		if(checkFlag && level>1){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('navi.label.tip'),
				message: sabace.getMessage('navi.msg.add.notallowed')
			});
			return;
		}
		
		$('#level1addMenu').hide();
		$('#level1CreateMenu').show();

		if(!checkFlag){
			naviId=undefined;
			naviName = '最上级导航';
		}
		if (sabace.IsEmpty(naviName)) {
			naviName = '最上级导航'
		}
		$("#parentNaviName").attr("value", naviName);
		// 字段新增对话框
		var dialog = bi.dialog.show({
			title: sabace.getMessage('navi.label.addNavi'),
			message: $("#add-page").outerHTML(),
			nl2br: false,
			closable: true,
			closeByBackdrop: false,
			closeByKeyboard: false,
			cssClass: 'navi-add-dialog',
			buttons: [{
				label: sabace.getMessage('navi.button.cancel'),
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: sabace.getMessage('navi.button.save'),
				cssClass: 'btn-info',
				action: function(dialogItself) {
					// 判断验证
					var isPass = dialog.getModalBody().find("#add-page").validationEngine('validate');
					if (!isPass) {
						return false;
					}
					bi.dialog.confirm({
						title: sabace.getMessage('navi.msg.confirm'),
						message: sabace.getMessage('navi.msg.saveConfirm'),
						callback: function(result) {
							if (!result) {
								return;
							}

							var parentNaviId = naviId;
							var naviName = dialog.getModalBody().find("#naviName").val();
							var description = dialog.getModalBody().find("#description").val();
							var dataParams = {
								parentNaviId: parentNaviId,
								naviName: naviName,
								naviDesc: description,
								naviLevel: parseInt(level) + 1
							};
							sabace.ajax({
								data: dataParams,
								loading: {
									title: sabace.getMessage('navi.label.tip'),
									text: sabace.getMessage('navi.label.pleaseWait')
								},
								url: sabace.handleUrlParam("/platform/resmanage/navi/add-navi"),
								success: function(req) {
//									$('#naviTree').trigger("reloadGrid");
									
									if(req.isSame==true){
										bi.dialog.show({
											type: bi.dialog.TYPE_DANGER,
											title: sabace.getMessage('navi.msg.prompt'),
											message: req.responseText || sabace.getMessage('navi.msg.same')
										});
										
										return;
									}
									
									dialog.close();
									window.location.href=sabace.handleUrlParam("/platform/resmanage/navi/list");
								},
								error: function(req) {
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: sabace.getMessage('navi.label.tip'),
										message: req.responseText || sabace.getMessage('navi.msg.save.exception')
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
	
	//修改指标事件
	function naviEdit() {
		if (jQuery("#edit").hasClass("disabled"))
		{
			return;
		}	
		
		jQuery("#parentNaviName").attr("value", "");
		jQuery("#naviName").attr("value", "");
		jQuery("#description").html("");
		var id = $('#naviTree').jqGrid('getGridParam', "selrow");
		var sleRow = $('#naviTree').jqGrid('getRowData', id);
		var naviName = sleRow["navi_name"];
		var naviId = sleRow["navi_id"];
		var naviDesc = sleRow["description"];
		var parentNaviId = sleRow["boss_id"];
		var level = sleRow["level"]||0;
		var naviCode = sleRow["naviCode"];
		
		//判断是否为顶级字段
		if (sabace.IsEmpty(parentNaviId)) {
			var parentNaviName = "最上级字段";
		} else {
			var sleRow = $('#naviTree').jqGrid('getRowData', parentNaviId);
			var parentNaviName = sleRow["navi_name"];
		}
		
		//如果没有选择
		var checkFlag =jQuery("#"+id).find("input[type='checkbox']").prop("checked");
		if (sabace.IsEmpty(id) || !checkFlag) {
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('navi.msg.prompt'),
				message: sabace.getMessage('navi.msg.empty'),
			});
			return;
		}
		
		$('#level1addMenu').show();
		$('#level1CreateMenu').hide();
		
		jQuery("#parentNaviName").attr("value", parentNaviName);
		jQuery("#naviName").attr("value", naviName);
		jQuery("#description").html(naviDesc);
		
		$('#level1add').empty();
		
		if(level==1){
			$('#level1add').append('<option value ="">最上级导航</option>');
			$('#level1add').attr('disabled','disabled');
		}else{
			$('#level1add').attr('disabled',false);
		}
		
		getNaviLevel("1","",function(req){
			
			if(req==null || req.length==0){
				
				$('#level1add').empty();
				$('#level1add').append('<option value ="">最上级导航</option>');
				
				return;
			}
			
			if(level!=1){			
			
				for(var i=0;i<req.length;i++){
					var option = req[i];
					
					$('#level1add').append('<option value ="'+option.naviId+'">'+option.naviName+'</option>');
					
				}
			}
			
			if(level==2){
				
				$("#level1add").find("option[value='" + naviCode.substring(0,6) + "']").attr("selected",true);

			}
			
			// 字段编辑对话框
			var dialog = bi.dialog.show({
				title: sabace.getMessage('navi.label.editNavi'),
				message: $("#add-page").outerHTML(),
				nl2br: false,
				closable: true,
				closeByBackdrop: false,
				closeByKeyboard: false,
				cssClass: 'navi-add-dialog',
				onshown:function(dia){
					
					$('.modal .modal-dialog .modal-content .modal-body select.form-control').chosen({
						disable_search: true
					});

				},
				buttons: [{
					label: sabace.getMessage('navi.button.cancel'),
					action: function(dialog) {
						dialog.close();
					}
				}, {
					label: sabace.getMessage('navi.button.save'),
					cssClass: 'btn-info',
					action: function(dialogItself) {

						// 判断验证
						var isPass = dialog.getModalBody().find("#add-page").validationEngine('validate');
						if (!isPass) {
							return false;
						}
						bi.dialog.confirm({
							title: sabace.getMessage('navi.msg.confirm'),
							message: sabace.getMessage('navi.msg.saveConfirm'),
							callback: function(result) {
								if (!result) {
									return;
								}
								var naviName = dialog.getModalBody().find("#naviName").val();
								var description = dialog.getModalBody().find("#description").val();
								var parentNaviId = dialog.getModalBody().find("#level1add").val();
								
								if(parentNaviId == naviCode.substring(0,6)){
									parentNaviId = "";
								}
								
								var dataParams = {
									naviId: naviId,
									naviCode: naviCode,
									naviName: naviName,
									naviDesc: description,
									naviLevel: level,
									parentNaviId: parentNaviId
								};
								sabace.ajax({
									loading: {
										title: sabace.getMessage('navi.label.tip'),
										text: sabace.getMessage('navi.label.pleaseWait')
									},
									url: sabace.handleUrlParam("/platform/resmanage/navi/edit-navi"),
									data: dataParams,
									success: function(req) {
										
										if(req.isSame==true){
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('navi.msg.prompt'),
												message: req.responseText || sabace.getMessage('navi.msg.same')
											});
											
											return;
										}
										
										dialog.close();
//										jQuery('#naviTree').trigger("reloadGrid");
										window.location.href=sabace.handleUrlParam("/platform/resmanage/navi/list");
									},
									error: function(req) {
										bi.dialog.show({
											type: bi.dialog.TYPE_DANGER,
											title: sabace.getMessage('navi.label.tip'),
											message: req.responseText || sabace.getMessage('navi.msg.save.exception')
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
		});
		
		
		
	}
	
	//删除导航事件
	function naviDelete() {
		if (jQuery("#delete").hasClass("disabled"))
		{
			return;
		}	
		var id = $('#naviTree').jqGrid('getGridParam', "selrow");
		var sleRow = $('#naviTree').jqGrid('getRowData', id);
		var naviId = sleRow["navi_id"];
		var parentNaviId = sleRow["boss_id"];
		var naviCode = sleRow["naviCode"];
		var level = sleRow["level"]||0;
		
		//如果没有选择
		var checkFlag =jQuery("#"+id).find("input[type='checkbox']").prop("checked");
		if (sabace.IsEmpty(id) || !checkFlag) {
			bi.dialog.show({
				type: 'type-warning',
				title: sabace.getMessage('navi.msg.prompt'),
				message: sabace.getMessage('navi.msg.choose.navi'),
			});
			return;
		} else {
			bi.dialog.confirm({
				title: sabace.getMessage('navi.msg.prompt'),
				message: sabace.getMessage('navi.msg.confirm.delete'),
				callback: function(result) {
					if (result) {
						sabace.ajax({
							type: "post",
							cache: false,
							dataType: "json",
							data: {
								naviId: naviId,
								naviCode: naviCode,
								naviLevel: level
							},
							url: sabace.handleUrlParam("/platform/resmanage/navi/delete-navi"),
							success: function(req) {
								
								if(req.isHasChild==true){
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: sabace.getMessage('navi.msg.prompt'),
										message: req.responseText || sabace.getMessage('navi.msg.del.haschild')
									});
									
									return;
								}
								
								
//								jQuery('#naviTree').trigger("reloadGrid");
								bi.dialog.show({
									title: sabace.getMessage('navi.msg.prompt'),
									message: req.responseText || sabace.getMessage('navi.msg.success')
								});
								
								window.location.href=sabace.handleUrlParam("/platform/resmanage/navi/list");
							},
							error: function(req) {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('navi.msg.prompt'),
									message: req.responseText || sabace.getMessage('navi.msg.save.exception')
								});
							}
						});
					}
				}
			});
		}
	}
			

});