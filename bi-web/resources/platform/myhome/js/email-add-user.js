define(['sabace'], function(sabace) {

	function init() {

		jQuery('.chosen-select').chosen({
			disable_search: true
		});

		jQuery('.userList').on("click", "a", function() {
			var obj = jQuery(this).find("input[data-toggle='checkbox']");
			obj.prop("checked", !obj.prop("checked"));
		})

		selectedList(jQuery(".sys"), 'sys');

		jQuery(".searchBtn").bind("click", function() {
			jQuery("#sysuserTable").jqGrid("setGridParam", {
				postData: {
					"userName": jQuery("#userName").val(),
					"userId": jQuery("#userId").val(),
					"sex": jQuery('.chosen-select').val()
				}
			}).trigger("reloadGrid", [{
				page: 1
			}]); //[]数组参数可以省略
		})


		jQuery(".sys .right").bind("click", function() {
			var selids = jQuery('#sysuserTable').jqGrid('getGridParam', 'selarrrow');
			if (selids.length == 0) {
				bi.dialog.show({
					title: sabace.getMessage('home.label.TipBox'),
					message: sabace.getMessage('report.share.check'),
					cssClass: 'register-dialog',
					nl2br: false,
					closable: true,
					closeByBackdrop: false,
					closeByKeyboard: false,
					buttons: [{
						label: sabace.getMessage('home.button.sure'),
						action: function(dialogItself) {
							dialogItself.close();
						}
					}]
				});
				return;
			}
			jQuery(".sys .ui-jqgrid-bdiv>div").show();
			jQuery(".sys .ui-jqgrid-bdiv .noResult").hide();
			var ids = jQuery('#sysshareuserTable').jqGrid('getDataIDs');
			var id = 0;
			if (ids.length > 0) {
				id = ids[ids.length - 1];
			}
			var len = selids.length;
			for (var i = 0; i < len; i++) {
				var data = jQuery('#sysuserTable').jqGrid('getRowData', selids[0]);

				jQuery('#sysshareuserTable').jqGrid('addRowData', Number(id) + i + 1, data);
				jQuery('#sysuserTable').jqGrid('delRowData', selids[0]);
			}

		})

		jQuery(".sys .left").bind("click", function() {
			var selids = jQuery('#sysshareuserTable').jqGrid('getGridParam', 'selarrrow');
			if (selids.length == 0) {
				bi.dialog.show({
					title: sabace.getMessage('home.label.TipBox'),
					message: sabace.getMessage('report.share.check'),
					cssClass: 'register-dialog',
					nl2br: false,
					closable: true,
					closeByBackdrop: false,
					closeByKeyboard: false,
					buttons: [{
						label: sabace.getMessage('home.button.sure'),
						action: function(dialogItself) {
							dialogItself.close();
						}
					}]
				});
				return;
			}
			var ids = jQuery('#sysuserTable').jqGrid('getDataIDs');
			var id = 0;
			if (ids.length > 0) {
				id = ids[ids.length - 1];
			}
			var len = selids.length;
			for (var i = 0; i < len; i++) {
				var data = jQuery('#sysshareuserTable').jqGrid('getRowData', selids[0]);
				jQuery('#sysuserTable').jqGrid('addRowData', Number(id) + i + 1, data);
				jQuery('#sysshareuserTable').jqGrid('delRowData', selids[0]);
			}


		})
	}

	//生成待选人员列表
	function selectList(obj, prop) {
		obj.find(".selectList").html('<table id="' + prop + 'userTable"></table>');
		obj.find('#' + prop + 'userTable').jqGrid({
			url: sabace.handleUrlParam('/platform/myreport/manage/user-list')+"?type=2",
			datatype: "json",
			loadComplete: function(rowId) {
				//删除已选表里的人
				var share = jQuery("." + prop).find('#' + prop + 'shareuserTable');
				var user = jQuery("." + prop).find('#' + prop + 'userTable');
				var shareArr = share.jqGrid("getRowData");
				var userArr = user.getCol("userID", true);
				for (var i = 0; i < shareArr.length; i++) {
					for (var j = 0; j < userArr.length; j++) {
						if (userArr[j].value == shareArr[i].userID) {
							user.jqGrid("delRowData", userArr[j].id)
						}
					}
				}
				jQuery(".number").html(rowId.length);
			},
			styleUI: 'Bootstrap',
			colModel: [{
				label: '用户编码',
				width: 75,
				name: 'userID',
				align: 'center'
			}, {
				label: '邮箱',
				width: 130,
				name: 'email',
				align: 'center',
				sortable: false
			}],
			shrinkToFit: false,
			width: 290,
			height: 300,
			viewrecords: true, // show the current page, data rang and total records on the toolbar

			multiselect: true,
			loadtext: "",
			rowNum: 100000,
			rownumbers: true,
			/* jsonReader:{records:"total",total:"totalPages"},*/
			/*pager: "#"+prop+"jqGridPagerTemp",*/
			regional: 'cn'
		});

	}
	//生成已分享人员列表
	function selectedList(obj, prop) {
		obj.find(".selectedList").html('<table id="' + prop + 'shareuserTable"></table>');
		obj.find('#' + prop + 'shareuserTable').jqGrid({
			url: sabace.handleUrlParam('/platform/myreport/manage/share-user-list'),
			datatype: "json",
			loadComplete: function(rowId) {
				selectList(jQuery("." + prop), prop);
				if (rowId.length > 0) {
					jQuery("." + prop).find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left", "none");
				} else {
					jQuery("." + prop).find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left", "1px solid #ddd");
				}
			},
			styleUI: 'Bootstrap',
			colModel: [{
				label: '用户编码',
				width: 75,
				name: 'userID',
				align: 'center'
			}, {
				label: '邮箱',
				width: 130,
				name: 'email',
				align: 'center',
				sortable: false
			}],
			shrinkToFit: false,
			width: 290,
			height: 300,
			viewrecords: true, // show the current page, data rang and total records on the toolbar

			multiselect: true,
			loadtext: "",
			rowNum: 100000,
			rownumbers: true,
			jsonReader: {
				records: "total",
				total: "totalPages"
			},
			regional: 'cn'
		});

	}

	function saveUsers() {
		var arr = jQuery("#sysshareuserTable").jqGrid("getRowData");
		jQuery("#userList").html("");
		var str = $("#sendEmail").val();
		jQuery.each(arr, function(i, v) {
			if(v.email==""){
				return;
			}
			str+=(","+v.email);
		})
		$("#sendEmail").tagsinput('add', str);
	}
	return {
		init: init,
		saveUsers: saveUsers
	}
});