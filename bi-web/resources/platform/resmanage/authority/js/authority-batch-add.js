define(['sabace'], function(sabace) {
 
	function init(){
		initInfoList();
		
		$('#dimId').chosen({
			disable_search: false
		});
		
		jQuery('#dimId').on("change",dimChanged);
		
		jQuery('#searchUser').on("click",queryUnSelectUser);
		
		jQuery("#right-arrow").on("click", userToRight);
		jQuery("#left-arrow").on("click", userToLeft);
		
		jQuery("#toRightDim").on("click", dimToRight);
		jQuery("#toLeftDim").on("click", dimToLeft);
	}
	
	function userToLeft(){
		var selectRow = jQuery('#selectUserGrid').jqGrid('getGridParam','selarrrow');
		var len = jQuery(selectRow).length;
		if(len == 0){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('authority.title.tips'),
				message: sabace.getMessage('authority.message.user.select')
			});
			return;
		}else{
			for (i = 0; i < len; i++) {
				jQuery('#selectUserGrid').jqGrid('delRowData',selectRow[0]);
			}
			queryUnSelectUser();
		}
	}
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
	
	function queryUnSelectUser(){
		var userIds = '';
		jQuery.each(jQuery('#selectUserGrid').jqGrid("getRowData"), function(index, user) {
			if (index == 0) {
				userIds += user.userID;
			} else {
				userIds += ',' + user.userID;
			}
		});
		var postData = {};
		var userName = $("#user-name").val();
		postData.userIds = userIds;
		postData.userName = userName;
		jQuery("#unSelectUserGrid").jqGrid("setGridParam", {
			postData:postData
		}).trigger("reloadGrid");
		return false;
	}
	
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
		dimParam.dimValueCodes = dimValueCodes;
		jQuery("#unSelectDimValueGrid").jqGrid("setGridParam", {
			postData:dimParam
		}).trigger("reloadGrid");
		return false;
	}
	
	function userToRight(){
		var selectRow = jQuery('#unSelectUserGrid').jqGrid('getGridParam','selarrrow');
		var len = jQuery(selectRow).length;
		if(len == 0){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('authority.title.tips'),
				message: sabace.getMessage('authority.message.user.unselect')
			});
			return;
		}else{
			var ids = jQuery('#selectUserGrid').jqGrid('getDataIDs');
			var index = 1;
			if(ids.length > 0){
				index = ids.length + 1;
			}else{
				jQuery(".div-right .ui-jqgrid-bdiv>div").show();
				jQuery(".div-right .ui-jqgrid-bdiv .noResult").hide();
			}
			for (i = 0; i < len; i++) {
				var newData = jQuery('#unSelectUserGrid').jqGrid('getRowData',selectRow[i]);
				jQuery('#selectUserGrid').jqGrid('addRowData', index + i, newData);
			}
			queryUnSelectUser();
		}
	}
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
		var userParam = {};
		$("#unSelectUserGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/resmanage/authority/user-list'),
			styleUI: 'Bootstrap',
			autowidth: true,
			postData: userParam,
			height: 'auto',
			mtype: 'post',
			regional: 'cn',
			datatype: "json",
			viewrecords: true, 
			forceFit: true,
			width: 430,
			height: 170,
			caption: sabace.getMessage("authority.label.user.unselect"),
			multiselect: true,
			//rownumbers: true,
			colModel: [{
				label: sabace.getMessage("authority.label.user.code"),
				name: 'userID',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("authority.label.user.name"),
				name: 'userName',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false
			}],
			rowNum: 5,
			rowList: [5],
			pager: "#unSelectUserGridPager",
			jsonReader: {
				records: "total",
				total: "totalPages"
			}
		});
		$("#selectUserGrid").jqGrid({
			url: "",
			styleUI: 'Bootstrap',
			autowidth: true,
			height: 'auto',
			mtype: 'post',
			regional: 'cn',
			viewrecords: true, 
			forceFit: true,
			caption: sabace.getMessage("authority.label.user.select"),
			//rownumbers: true,
			multiselect: true,
			width: 430,
			height: 204,
			rowNum: 10000,
			colModel: [{
				label: sabace.getMessage("authority.label.user.code"),
				name: 'userID',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("authority.label.user.name"),
				name: 'userName',
				width: 200,
				align: 'left',
				hlign: 'center',
				sortable: false
			}]
		});
		var dimParam = {};
		var dimId = jQuery("#dimId").val();
		dimParam.dimId = dimId;
		$("#unSelectDimValueGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/resmanage/authority/dim-value-list'),
			styleUI: 'Bootstrap',
			autowidth: true,
			postData: dimParam,
			height: 'auto',
			mtype: 'post',
			regional: 'cn',
			datatype: "json",
			viewrecords: true, 
			forceFit: true,
			caption: sabace.getMessage("authority.label.dim.unselect"),
			multiselect: true,
			width: 430,
			height: 170,
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
			rowNum: 5,
			rowList: [5],
			pager: "#unSelectDimValueGridPager",
			jsonReader: {
				records: "total",
				total: "totalPages"
			}
		});
		$("#selectDimValueGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/resmanage/authority/selected-dim-value-list'),
			styleUI: 'Bootstrap',
			autowidth: true,
			height: 'auto',
			mtype: 'post',
			regional: 'cn',
			viewrecords: true, 
			forceFit: true,
			caption: sabace.getMessage("authority.label.dim.select"),
			//rownumbers: true,
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
			}]
		});
	}
	
	function saveUserDimConfig(dialog){
		var userIds = '';
		jQuery.each(jQuery('#selectUserGrid').jqGrid("getRowData"), function(index, user) {
			if (index == 0) {
				userIds += user.userID;
			} else {
				userIds += ',' + user.userID;
			}
		});
		
		if('' == userIds){
			bi.dialog.show({
				title: sabace.getMessage("authority.title.tips"),
				message: sabace.getMessage("authority.message.select.user"),
				nl2br: false,
				closable: true
			});
			return;
		}
		
		var dimId = jQuery("#dimId").val();
		var dimValueCodes = '';
		jQuery.each(jQuery('#selectDimValueGrid').jqGrid("getRowData"), function(index, user) {
			if (index == 0) {
				dimValueCodes += user.dimCodeAttr;
			} else {
				dimValueCodes += ',' + user.dimCodeAttr;
			}
		});

		
		if('' == dimValueCodes){
			bi.dialog.show({
				title: sabace.getMessage("authority.title.tips"),
				message: sabace.getMessage("authority.message.select.dim"),
				nl2br: false,
				closable: true
			});
			return;
		}
		var param = {};
		param.dimId = dimId;
		param.userIds = userIds;
		param.dimValueCodes = dimValueCodes;
		bi.dialog.confirm({
			title: sabace.getMessage("authority.title.confirm"),
			message: sabace.getMessage("authority.message.save.confirm"),
			callback: function(result) {
				if (result) {
					var url = sabace.handleUrlParam('/platform/resmanage/authority/save-user-dim');
					//开始执行保存操作
					sabace.ajax({
						data: param,
						url: url,
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
		jQuery("#selectDimValueGrid").jqGrid("clearGridData");
		var dimParam = {};
		var dimId = jQuery("#dimId").val();
		dimParam.dimId = dimId;
		dimParam.dimValueCodes = "";
		jQuery("#unSelectDimValueGrid").jqGrid("setGridParam", {
			postData:dimParam
		}).trigger("reloadGrid");
		jQuery("#selectDimValueGrid").jqGrid("setGridParam").trigger("reloadGrid");
	}
	
	return {
		init: init,
		saveUserDimConfig: saveUserDimConfig
	}
	
});
