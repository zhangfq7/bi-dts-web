define(['sabace'], function(sabace) {
 
	function init(){
		
		// 初始化维度值列表
		initInfoList();
		
		$('#dimId').chosen({
			disable_search: false
		});
		
		// 维度切换事件
		jQuery('#dimId').on("change",dimChanged);
		
		// 维度值左右移动事件
		jQuery("#toRightDim").on("click", dimToRight);
		jQuery("#toLeftDim").on("click", dimToLeft);
	}
	
	// 查询未选择维度值列表
	function queryUnSelectDimValue(){
		var dimValueCodes = '';
		jQuery.each(jQuery('#selectDimValueGrid').jqGrid("getRowData"), function(index, user) {
			if (index == 0) {
				dimValueCodes += user.dimCodeAttr;
			} else {
				dimValueCodes += ',' + user.dimCodeAttr;
			}
		});
		
		var dimParam = {};
		var dimId = jQuery("#dimId").val();
		dimParam.dimId = dimId;
		dimParam.modifyFlag = "0";
		dimParam.dimValueCodes = dimValueCodes;
		jQuery("#unSelectDimValueGrid").jqGrid("setGridParam", {
			url: sabace.handleUrlParam('/platform/resmanage/authority/dim-value-list'),
			postData:dimParam
		}).trigger("reloadGrid");
	}
	
	// 从已选择列表移至未选择列表
	function dimToLeft(){
		var selectRow = jQuery('#selectDimValueGrid').jqGrid('getGridParam','selarrrow');
		var len = jQuery(selectRow).length;
		if(len == 0){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('authority.title.tips'),
				message: sabace.getMessage('authority.message.dim.select')
			});
			return;
		}else{
			for (i = 0; i < len; i++) {
				jQuery('#selectDimValueGrid').jqGrid('delRowData',selectRow[0]);
			}
			queryUnSelectDimValue();
		}
	}
	
	// 从未选择列表移至已选择列表
	function dimToRight(){
		var selectRow = jQuery('#unSelectDimValueGrid').jqGrid('getGridParam','selarrrow');
		var len = jQuery(selectRow).length;
		if(len == 0){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('authority.title.tips'),
				message: sabace.getMessage('authority.message.dim.unselect')
			});
			return;
		}else{
			var ids = jQuery('#selectDimValueGrid').jqGrid('getDataIDs');
			var index = 1;
			if(ids.length > 0){
				index = ids.length + 1;
			}else{
				jQuery(".div-right .ui-jqgrid-bdiv>div").show();
				jQuery(".div-right .ui-jqgrid-bdiv .noResult").hide();
			}
			for (i = 0; i < len; i++) {
				var newData = jQuery('#unSelectDimValueGrid').jqGrid('getRowData',selectRow[i]);
				jQuery('#selectDimValueGrid').jqGrid('addRowData', index + i, newData);
			}
			queryUnSelectDimValue();
		}
	}

	function initInfoList(){
		var modifyFlag = jQuery("#modifyFlag").val();
		initUnSelectList(modifyFlag);
		if("1" != modifyFlag){
			initSelectList();
		}
	}
	
	function initSelectList(modifyFlag){
		var rightParam = {};
		var dimId = jQuery("#dimId").val();
		var userId = jQuery("#userID").val();
		rightParam.dimId = dimId;
		rightParam.userId = userId;
		rightParam.modifyFlag = modifyFlag;
		$("#selectDimValueGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/resmanage/authority/selected-dim-value-list'),
			styleUI: 'Bootstrap',
			postData: rightParam,
			autowidth: true,
			datatype: "json",
			height: 'auto',
			mtype: 'post',
			regional: 'cn',
			viewrecords: true, 
			forceFit: true,
			caption: sabace.getMessage("authority.label.dim.select"),
			rownumbers: true,
			multiselect: true,
			width: 430,
			height: 204,
			rowNum: 10000,
			colModel: [{
				label: sabace.getMessage("authority.label.dim.code"),
				name: 'dimCodeAttr',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("authority.label.dim.name"),
				name: 'dimCodeName',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false
			}],
			rownumbers: true,
			loadComplete: function(){
				if("1" == modifyFlag){
					queryUnSelectDimValue();
				}
			}
		});
	}
	
	function initUnSelectList(modifyFlag){
		var leftParam = {};
		var dimId = jQuery("#dimId").val();
		leftParam.dimId = dimId;
		leftParam.modifyFlag = modifyFlag;
		$("#unSelectDimValueGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/resmanage/authority/dim-value-list'),
			styleUI: 'Bootstrap',
			autowidth: true,
			postData: leftParam,
			height: 'auto',
			mtype: 'post',
			regional: 'cn',
			datatype: "json",
			viewrecords: true, 
			forceFit: true,
			caption: sabace.getMessage("authority.label.dim.unselect"),
			multiselect: true,
			//rownumbers: true,
			colModel: [{
				label: sabace.getMessage("authority.label.dim.code"),
				name: 'dimCodeAttr',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, { 
				label: sabace.getMessage("authority.label.dim.name"),
				name: 'dimCodeName',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false
			}],
			width: 430,
			height: 170,
			rowNum: 5,
			rowList: [5],
			pager: "#unSelectDimValueGridPager",
			jsonReader: {
				records: "total",
				total: "totalPages"
			},
			loadComplete: function(){
				if("1" == modifyFlag){
					initSelectList(modifyFlag);
				}
			}
		});
	}
	
	function saveUserDimConfig(dialog){
		var userIds = jQuery("#userID").val();
		var dimId = jQuery("#dimId").val();
		var dimValueCodes = '';
		jQuery.each(jQuery('#selectDimValueGrid').jqGrid("getRowData"), function(index, user) {
			if (index == 0) {
				dimValueCodes += user.dimCodeAttr;
			} else {
				dimValueCodes += ',' + user.dimCodeAttr;
			}
		});
		
		var param = {};
		param.dimId = dimId;
		param.userIds = userIds;
		param.dimValueCodes = dimValueCodes;
		bi.dialog.confirm({
			title: sabace.getMessage("authority.title.confirm"),
			message: sabace.getMessage("authority.message.save.confirm"),
			callback: function(result) {
				if (result) {
					//开始执行保存操作
					sabace.ajax({
						data: param,
						url: sabace.handleUrlParam("/platform/resmanage/authority/save-user-dim"),
						success: function(req) {

							var saveFlag = req.saveFlag;
							if ('0' == saveFlag) {
								bi.dialog.show({
									title: sabace.getMessage("authority.title.save.success"),
									message: sabace.getMessage("authority.message.save.success"),
									buttons: [{
										label: sabace.getMessage("authority.button.confirm"),
										cssClass: 'btn-info',
										action: function(dialogItself) {
											jQuery("#search").trigger("click");
											dialogItself.close();
											dialog.close();
										}
									}]
								});

							} else {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('authority.title.save.failure'),
									message: sabace.getMessage('authority.message.save.failure')
								});
							}

						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('authority.title.save.failure'),
								message: req.responseText || sabace.getMessage('authority.message.save.failure')
							});
						}
					});
				}
			}
		});
	}
	
	function dimChanged(){
		var dimParam = {};
		var dimId = jQuery("#dimId").val();
		dimParam.dimId = dimId;
		dimParam.dimValueCodes = "";
		jQuery("#unSelectDimValueGrid").jqGrid("setGridParam", {
			url: sabace.handleUrlParam('/platform/resmanage/authority/dim-value-list'),
			postData:dimParam
		}).trigger("reloadGrid");
		jQuery("#selectDimValueGrid").jqGrid("setGridParam").trigger("reloadGrid");
	}
	
	return {
		init: init,
		saveUserDimConfig: saveUserDimConfig
	}
	
});
