define(['sabace','validation'], function(sabace,validation) {
	var Share = {};
	Share.module = {
		//生成待选人员列表
		selectList: function(obj, prop) {
			obj.find(".selectList").html('<table id="' + prop + 'userTable"></table>');
			obj.find('#' + prop + 'userTable').jqGrid({
				url: sabace.handleUrlParam('/platform/myreport/manage/user-list'),
				datatype: "json",
				postData: {
					userName: jQuery(".sys .searchInput").val(),
					createId: jQuery("#createId").val()
				},
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

				},
				styleUI: 'Bootstrap',
				colModel: [{
					label: '用户编码',
					width: 75,
					name: 'userID',
					align: 'center',
					hidden: true
				}, {
					label: sabace.getMessage('report.share.userName'),
					width: 135,
					name: 'userName',
					align: 'left',
					sortable: false
				}],
				shrinkToFit: false,
				width: 225,
				height: 200,
				viewrecords: true, // show the current page, data rang and total records on the toolbar

				multiselect: true,
				loadtext: "",
				rowNum: 100000,
				rownumbers: true,
				/* jsonReader:{records:"total",total:"totalPages"},*/
				/*pager: "#"+prop+"jqGridPagerTemp",*/
				regional: 'cn'
			});

		},
		//生成已分享人员列表
		selectedList: function(obj, prop) {
			obj.find(".selectedList").html('<table id="' + prop + 'shareuserTable"></table>');
			obj.find('#' + prop + 'shareuserTable').jqGrid({
				url: sabace.handleUrlParam('/platform/myreport/manage/share-user-list'),
				datatype: "json",
				postData: {
					reportId: jQuery("#reportId").val(),
					type: prop
				},
				loadComplete: function(rowId) {
					Share.module.selectList(jQuery("." + prop), prop);
					if (rowId.length > 0) {
						jQuery("." + prop).find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left", "none");
					} else {
						jQuery("." + prop).find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left", "1px solid #ddd");
					}
				},
				styleUI: 'Bootstrap',
				colNames: ['用户编码', sabace.getMessage('report.share.userName')],
				colModel: [{
					label: '用户编码',
					width: 75,
					name: 'userID',
					align: 'center',
					hidden: true
				}, {
					label: sabace.getMessage('report.share.userName'),
					width: 135,
					name: 'userName',
					align: 'left',
					sortable: false
				}],
				shrinkToFit: false,
				width: 225,
				height: 200,
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
	}

	Share.controller = {
		init: function() {
			//渲染checkbox
			$('[data-toggle="checkbox"]').iCheck({
				checkboxClass: 'icheckbox_minimal',
				radioClass: 'iradio_minimal'
			});

			jQuery(".mytable .head .tab").bind("click", function() {
				jQuery(".mytable .head .tab").removeClass("checkTab");
				jQuery(this).addClass("checkTab");
				var pro = jQuery(this).attr("pro");
				jQuery(".tableBody").hide();
				jQuery("." + pro).show();
			})

			jQuery(".mytable .head .tab").eq(0).trigger("click");

			jQuery(".mytable .head .tab").bind("click", function() {
				jQuery(".mytable .head .tab").removeClass("checkTab");
				jQuery(this).addClass("checkTab");
				var pro = jQuery(this).attr("pro");
				jQuery(".tableBody").hide();
				jQuery("." + pro).show();
			})


			Share.module.selectedList(jQuery(".app"), 'app');
			Share.module.selectedList(jQuery(".sys"), 'sys');

			//				jQuery(".modal-body").height(485).niceScroll();
			jQuery(".sys .userNameBtn").bind("click", function() {
				jQuery("#sysuserTable").jqGrid("setGridParam", {
					postData: {
						"userName": jQuery(".sys .searchInput").val()
					}
				}).trigger("reloadGrid", [{
					page: 1
				}]); //[]数组参数可以省略
			})
			jQuery(".app .userNameBtn").bind("click", function() {
				jQuery("#appuserTable").jqGrid("setGridParam", {
					postData: {
						"userName": jQuery(".app .searchInput").val()
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
				jQuery(".sys").find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left", "none");
				if (jQuery('#sysuserTable').jqGrid('getDataIDs').length == 0) {
					jQuery(".sys").find(".selectList").find(".ui-jqgrid-bdiv>div").css("border-left", "1px solid #ddd");
				}
			})

			jQuery(".app .right").bind("click", function() {
				var selids = jQuery('#appuserTable').jqGrid('getGridParam', 'selarrrow');
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
				jQuery(".app .ui-jqgrid-bdiv>div").show();
				jQuery(".app .ui-jqgrid-bdiv .noResult").hide();
				var ids = jQuery('#appshareuserTable').jqGrid('getDataIDs');
				var id = 0;
				if (ids.length > 0) {
					id = ids[ids.length - 1];
				}
				var len = selids.length;
				for (var i = 0; i < len; i++) {
					var data = jQuery('#appuserTable').jqGrid('getRowData', selids[0]);
					jQuery('#appshareuserTable').jqGrid('addRowData', Number(id) + i + 1, data);
					jQuery('#appuserTable').jqGrid('delRowData', selids[0]);
				}
				jQuery(".app").find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left", "none");
				if (jQuery('#appuserTable').jqGrid('getDataIDs').length == 0) {
					jQuery(".app").find(".selectList").find(".ui-jqgrid-bdiv>div").css("border-left", "1px solid #ddd");
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
				jQuery(".sys").find(".selectList").find(".ui-jqgrid-bdiv>div").css("border-left", "none");
				if (jQuery('#sysshareuserTable').jqGrid('getDataIDs').length == 0) {
					jQuery(".sys").find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left", "1px solid #ddd");
				}

			})
			jQuery(".app .left").bind("click", function() {
				var selids = jQuery('#appshareuserTable').jqGrid('getGridParam', 'selarrrow');
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
				var ids = jQuery('#appuserTable').jqGrid('getDataIDs');
				var id = 0;
				if (ids.length > 0) {
					id = ids[ids.length - 1];
				}
				var len = selids.length;
				for (var i = 0; i < len; i++) {
					var data = jQuery('#appshareuserTable').jqGrid('getRowData', selids[0]);
					jQuery('#appuserTable').jqGrid('addRowData', Number(id) + i + 1, data);
					jQuery('#appshareuserTable').jqGrid('delRowData', selids[0]);
				}
				jQuery(".app").find(".selectList").find(".ui-jqgrid-bdiv>div").css("border-left", "none");
				if (jQuery('#appshareuserTable').jqGrid('getDataIDs').length == 0) {
					jQuery(".app").find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left", "1px solid #ddd");
				}

			})
		},

		sure: function(dialog) {
			var $obj = jQuery(".tab input:checked").parents(".tab");
			if ($obj.length == 0) {
				bi.dialog.show({
					title: sabace.getMessage('home.label.TipBox'),
					message: sabace.getMessage('report.share.select'),
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
			var wayArry = [];
			var userArry = {};
			jQuery.each($obj, function(i, v) {
				var prop = jQuery(v).attr("pro");
				wayArry.push(prop)
				var user = jQuery("." + prop).find('#' + prop + 'shareuserTable');
				var userArr = user.getCol("userID", true);
				var arry = [];
				for (var i = 0; i < userArr.length; i++) {
					arry.push(userArr[i].value);
				}

                var myUsers =  jQuery("#"+prop+"myUser").val();
				var myUserArray = myUsers.split(",");
				for(var x=0;x<myUserArray.length;x++)
				{
					if(arry.join(",").indexOf(myUserArray[x])<0)
					{
                        arry.push(myUserArray[x]);
					}

				}
				userArry[prop] = arry;
			})

			sabace.ajax({
				data: {
					reportId: jQuery("#reportId").val(),
					wayArry: wayArry.toString(),
					userArry: JSON.stringify(userArry)
				},
				url: sabace.handleUrlParam('/platform/myreport/manage/share'),
				success: function(req) {
					bi.dialog.show({
						title: sabace.getMessage('home.label.TipBox'),
						message: sabace.getMessage('report.share.successShare'),
						cssClass: 'register-dialog',
						nl2br: false,
						closable: true,
						closeByBackdrop: false,
						closeByKeyboard: false,
						buttons: [{
							label: sabace.getMessage('home.button.sure'),
							action: function(dialogItself) {
								dialogItself.close();
								dialog.close();
							}
						}]
					});
				},
				error: function(req) {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('top.label.fail'),
						message: req.responseText
					});
				}
			});
		},
		
		publish:function(dialog){
			var isPass = $('#appDesc-div,#type-div').validationEngine('validate');
			if(!isPass){
				return;
			}
			sabace.ajax({
				data: {
					reportId: jQuery("#reportId").val(),
					appDesc: jQuery("#appDesc").val(),
					portalType: jQuery("#portalType option:selected").val(),
					appType:jQuery("#appType").val(),
					requireApp:jQuery("#requireApp").val(),
					requireDept: jQuery("#requireDept").val(),
					requireRegion:jQuery("#requireRegion").val(),
					appDesc:jQuery("#appDesc").val()
				},
				url: sabace.handleUrlParam('/third-party/publish'),
				success: function(resp) {
					bi.dialog.show({
						title: sabace.getMessage('home.label.TipBox'),
						message: resp.resFlag == "success" ? sabace.getMessage('report.share.successShare') : resp.resFlag,
						cssClass: 'register-dialog',
						nl2br: false,
						closable: true,
						closeByBackdrop: false,
						closeByKeyboard: false,
						buttons: [{
							label: sabace.getMessage('home.button.sure'),
							action: function(dialogItself) {
								dialogItself.close();
								dialog.close();
							}
						}]
					});
				},
				error: function(req) {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('top.label.fail'),
						message: req.responseText||"报表发布异常"
					});
				}
			});
		
		}
	}

	return Share.controller;
});