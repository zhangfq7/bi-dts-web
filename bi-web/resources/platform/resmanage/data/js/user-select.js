define(['sabace'], function(sabace) {
	
	var UserSelect = {};
	var data = {};
	
	UserSelect.view = {
		init:function(){
			// 根据传递的type来区分数据库源的赋权还是数据文件的分享
			if(data.type == "1"){
				data.postData = {
					dbId : data.dataId
				};
				data.ajaxData = {
					dbId : data.dataId
				};
				//两个URL类似，只是中间一个是db代表数据库源的，一个是data代表数据的
				data.rightUserUrl = "/platform/resmanage/db/query-right-user";
				data.userUrl = "/platform/resmanage/db/query-unright-user";
				data.saveUrl = "/platform/resmanage/db/save-user-right";
			}else if(data.type == "2"){
				data.postData = {
					dataId : data.dataId
				};
				data.ajaxData = {
					dataId : data.dataId	
				}
				data.rightUserUrl = "/platform/resmanage/data/query-right-user";
				data.userUrl = "/platform/resmanage/data/query-unright-user";
				data.saveUrl = "/platform/resmanage/data/save-user-right";
			}else if(data.type == "3"){
				data.postData = {
					tplId : data.dataId
				};
				data.ajaxData = {
					tplId : data.dataId
				}
				data.rightUserUrl = "/platform/myreport/tpl/query-right-user";
				data.userUrl = "/platform/myreport/tpl/query-unright-user";
				data.saveUrl = "/platform/myreport/tpl/save-user-right";
			}
			// 初始化已选择用户
			initSelectUser();
			// 初始化页面事件
			initPageEvent();
		},
		saveUserSelect: function(){
			bi.dialog.confirm({
	            title: sabace.getMessage('data.user.title.selectSave'),
	            message: sabace.getMessage('data.user.message.confirmSave'),
	            callback: function(result) {
	                if(result) {
	                	saveUser();
	                }
	            }
		    });
		}
	};
	
	// 初始化已选择的用户列表
	function initSelectUser(){
		// 右边已赋权用户信息
		jQuery("#rightListGrid").jqGrid({
			url: sabace.handleUrlParam(data.rightUserUrl),
			postData: data.postData,
			styleUI: 'Bootstrap',
			datatype: "json",
			mtype: 'post',
			caption: sabace.getMessage('data.user.caption.power'),
			colModel: [{
				label: sabace.getMessage('data.user.label.userID'),
				name: 'userID',
				align: 'left',
				hlign: 'center',
				hidden: true
			}, {
				label: sabace.getMessage('data.user.label.userName'),
				name: 'userName',
				align: 'left',
				hlign: 'center'
			}
			, {
				label: sabace.getMessage('data.user.label.depName'),
				name: 'depName',
				align: 'left',
				hlign: 'center',
				width: 153
			}
			],
			multiselect: true,
			autowidth: true,
			shrinkToFit: false,
			rowNum: 10000,
			width: 380,
			height: 294,
			rownumbers: true, 
			regional: 'cn',
			loadComplete: function(){
				initUnSelectUser();
			}
		});
	}
	
	// 初始化页面所需事件
	function initPageEvent(){
		jQuery("#userSearchForm .searchButton").on("click", function() {
			var userName = jQuery("#userSearchForm #userName").val();
			data.postData.userName = userName;
			jQuery("#leftListGrid").jqGrid("setGridParam", {
				postData: data.postData
			}).trigger("reloadGrid");
			return false;
		})
		
		// 向右箭头
		jQuery("#right-arrow").on("click", function() {
			var selectRow = jQuery('#leftListGrid').jqGrid('getGridParam','selarrrow');
			var len = jQuery(selectRow).length;
			if(len == 0){
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.db.title.tips'),
					message: sabace.getMessage('data.user.message.selectNotPower')
				});
				return;
			}else{
				var ids = jQuery('#rightListGrid').jqGrid('getDataIDs');
				var index = 1;
				if(ids.length > 0){
					index = ids.length + 1;
				}else{
					jQuery(".div-right .ui-jqgrid-bdiv>div").show();
					jQuery(".div-right .ui-jqgrid-bdiv .noResult").hide();
				}
				for (i = 0; i < len; i++) {
					var newData = jQuery('#leftListGrid').jqGrid('getRowData',selectRow[i]);
					jQuery('#rightListGrid').jqGrid('addRowData', index + i, newData);
				}
				queryUnSelUser();
			}
		});
		
		// 向左箭头
		jQuery("#left-arrow").on("click", function() {
			var selectRow = jQuery('#rightListGrid').jqGrid('getGridParam','selarrrow');
			var len = jQuery(selectRow).length;
			if(len == 0){
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.db.title.tips'),
					message: sabace.getMessage('data.user.message.selectPower')
				});
				return;
			}else{
				for (i = 0; i < len; i++) {
					jQuery('#rightListGrid').jqGrid('delRowData',selectRow[0]);
				}
				queryUnSelUser();
			}
		})
	}
	
	// 初始化未选择用户
	function initUnSelectUser(){
		var userIds = '';
		jQuery.each(jQuery('#rightListGrid').jqGrid("getRowData"), function(index, user) {
			if (index == 0) {
				userIds += user.userID;
			} else {
				userIds += ',' + user.userID;
			}
		});
		
		data.postData.userIds = userIds;
		// 左边未赋权与用户信息
		jQuery("#leftListGrid").jqGrid({
			url: sabace.handleUrlParam(data.userUrl),
			mtype: 'post',
			postData: data.postData,
			styleUI: 'Bootstrap',
			datatype: "json",
			caption: sabace.getMessage('data.user.caption.notPower'),
			colModel: [{
				label: sabace.getMessage('data.user.label.userID'),
				name: 'userID',
				align: 'left',
				hlign: 'center',
				hidden: true
			}, {
				label: sabace.getMessage('data.user.label.userName'),
				name: 'userName',
				align: 'left',
				hlign: 'center'
			}
			, {
				label: sabace.getMessage('data.user.label.depName'),
				name: 'depName',
				align: 'left',
				hlign: 'center',
				width: 153
			}
			],
			viewrecords: true,
			multiselect: true,
			autowidth: true,
			shrinkToFit: false,
			rowNum: 10,
			width: 380,
			height: 260,
			rownumbers: true, 
			pager: "#leftListGridPager",
			jsonReader: {
				records: "total",
				total: "totalPages"
			},
			regional: 'cn'
		});
	}
	
	// 选择之后查询左侧未选择的用户
	function queryUnSelUser(){
		var userIds = '';
		jQuery.each(jQuery('#rightListGrid').jqGrid("getRowData"), function(index, user) {
			if (index == 0) {
				userIds += user.userID;
			} else {
				userIds += ',' + user.userID;
			}
		});
		
		var userName = jQuery("#userSearchForm #userName").val();
		data.postData.userName = userName;
		data.postData.userIds = userIds;
		jQuery("#leftListGrid").jqGrid("setGridParam", {
			postData:data.postData
		}).trigger("reloadGrid");
		return false;
	}
	
	// 保存已选择用户
	function saveUser(){
		var userIds = '';
		jQuery.each(jQuery('#rightListGrid').jqGrid("getRowData"), function(index, user) {
			if (index == 0) {
				userIds += user.userID;
			} else {
				userIds += ',' + user.userID;
			}
		});
		
		data.ajaxData.userIds = userIds;
		
		// 向后台发送请求保存用户信息
		sabace.ajax({
			url: sabace.handleUrlParam(data.saveUrl),
			data: data.ajaxData,
			loading: {
				title: sabace.getMessage('data.db.title.execute'),
				text: sabace.getMessage('data.user.loading.submit')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					saveSuccess();
				} 
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.db.title.tips'),
					message: req.responseText || sabace.getMessage('data.user.message.setFailed')
				});
			}
		});
	}
	
	// 保存成功后的处理
	function saveSuccess(){
		bi.dialog.show({
			type: bi.dialog.TYPE_INFO,
			title: sabace.getMessage('data.db.title.tips'),
			message: sabace.getMessage('data.user.message.setSuccess'),
			closeByBackdrop: false,
			closeByKeyboard: false,
			buttons: [{
				label: sabace.getMessage('data.user.label.sure'),
				cssClass: 'btn-success',
				action: function(dialog) {
					window.parent.bi.dialog.closeAll();
				}
			}]
		});
	}
	
	UserSelect.control = { 
		init:function(type,dataId){
			data.type = type
			data.dataId = dataId;
			UserSelect.view.init();
		},
		saveUserSelect: function(){
			UserSelect.view.saveUserSelect();
		}
	};
	
	//返回页面所需方法
	return UserSelect.control;
});
