define(['sabace', 'batchConfig', 'authorityEdit'], function(sabace, batchConfig, authorityEdit) {
 
	var authorityList = {};
	
	jQuery(function(){
		// 初始化订购记录列表
		initAuthorityList();
		
		// 绑定按钮事件
		jQuery('#search').on("click", queryAuthorityList);
		jQuery('#batchConfigBtn').on("click", batchConfigAuthority);
			
		
		jQuery("#authorityListPanel").on("click", '.addDim', function(){
			addDim(this);
		});
		jQuery("#authorityListPanel").on("click", '.editAuthority', function(){
			modifyAuthority(this);
		});
		jQuery("#authorityListPanel").on("click", '.deleteAuthority', function(){
			deleteAuthority(this);
		});
		
	});
	
	function deleteAuthority(obj){
		var userId = $(obj).attr("userId");
		var dimId = $(obj).attr("dimId");
		
		bi.dialog.confirm({
			title: sabace.getMessage("authority.title.tips"),
			message: sabace.getMessage("authority.message.delete.confirm"),
			callback: function(result) {
				if (result) {
					sabace.ajax({
						type: "post",
						cache: false,
						dataType: "json",
						url: sabace.handleUrlParam("/platform/resmanage/authority/user-dim-delete"),
						data: {
							userIds: userId,
							dimId: dimId
						},
						loading: {
							title: sabace.getMessage('authority.title.tips'),
							text: sabace.getMessage('authority.message.delete.loading')
						},
						success: function(req) {
							bi.dialog.show({
								title: sabace.getMessage('authority.title.delete.success'),
								message: sabace.getMessage("authority.message.delete.success"),
								nl2br: false,
								closable: true,
								closeByBackdrop: false,
								closeByKeyboard: false,
								buttons: [{
									label: sabace.getMessage('authority.button.confirm'),
									cssClass: 'btn-info',
									action: function(dialogItself) {
										jQuery("#search").trigger("click");
										dialogItself.close();
									}
								}]
							});
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('authority.title.delete.failure'),
								message: req.responseText || sabace.getMessage('authority.message.delete.failure')
							});
						}
					});
				}
			}
		});
	}
	
	function modifyAuthority(obj){
		var userId = $(obj).attr("userId");
		var userName = $(obj).attr("userName");
		var dimId = $(obj).attr("dimId");
		var dimName = $(obj).attr("dimName");
		var url = sabace.handleUrlParam('/platform/resmanage/authority/dim-edit') + '?userId=' + userId + '&userName=' + encodeURI(encodeURI(userName)) + '&dimId=' + dimId + '&dimName=' + encodeURI(encodeURI(dimName));
		bi.dialog.show({
			title: sabace.getMessage("authority.title.authority"),
			message: $('<div id="user-dim-config"></div>').load(url),
			spinicon: 'glyphicon glyphicon-refresh',
			cssClass: 'dim-user-dialog',
			closeByBackdrop: false,
			closeByKeyboard: false,
			onshown: function() {
				authorityEdit.init();
			},
			buttons: [{
				label: sabace.getMessage("authority.button.cancel"),
				//hotkey: 13, // Enter  让键盘回车直接出发此按钮
				cssClass: 'btn-default',
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: sabace.getMessage("authority.button.save"),
				//hotkey: 13, // Enter  让键盘回车直接出发此按钮
				cssClass: 'btn-info',
				action: function(dialog) {
					authorityEdit.saveUserDimConfig(dialog);
				}
			}]
		});
	}
	
	function addDim(obj){
		var userId = $(obj).attr("userId");
		var userName = $(obj).attr("userName");
		var url = sabace.handleUrlParam('/platform/resmanage/authority/dim-edit') + '?userId=' + userId + '&userName=' + encodeURI(encodeURI(userName));
		bi.dialog.show({
			title: sabace.getMessage("authority.title.authority"),
			message: $('<div id="user-dim-config"></div>').load(url),
			spinicon: 'glyphicon glyphicon-refresh',
			cssClass: 'dim-user-dialog',
			closeByBackdrop: false,
			closeByKeyboard: false,
			onshown: function() {
				authorityEdit.init();
			},
			buttons: [{
				label: sabace.getMessage("authority.button.cancel"),
				//hotkey: 13, // Enter  让键盘回车直接出发此按钮
				cssClass: 'btn-default',
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: sabace.getMessage("authority.button.save"),
				//hotkey: 13, // Enter  让键盘回车直接出发此按钮
				cssClass: 'btn-info',
				action: function(dialog) {
					authorityEdit.saveUserDimConfig(dialog);
				}
			}]
		});
	}
	
	function batchConfigAuthority(){
		var url = sabace.handleUrlParam('/platform/resmanage/authority/batch-add');
		bi.dialog.show({
			title: sabace.getMessage("authority.title.authority"),
			message: $('<div id="user-dim-config"></div>').load(url),
			spinicon: 'glyphicon glyphicon-refresh',
			cssClass: 'dim-user-dialog',
			closeByBackdrop: false,
			closeByKeyboard: false,
			onshown: function() {
				batchConfig.init();
			},
			buttons: [{
				label: sabace.getMessage("authority.button.cancel"),
				//hotkey: 13, // Enter  让键盘回车直接出发此按钮
				cssClass: 'btn-default',
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: sabace.getMessage("authority.button.save"),
				//hotkey: 13, // Enter  让键盘回车直接出发此按钮
				cssClass: 'btn-info',
				action: function(dialog) {
					batchConfig.saveUserDimConfig(dialog);
				}
			}]
		});
	}
	
	function queryAuthorityList(){
		var postData = {};
		var userName = jQuery("#userName").val();
		var dimName = jQuery("#dimName").val();
		postData.userName = userName;
		postData.dimName = dimName;
		jQuery("#authorityListGrid").jqGrid('setGridParam', {
			postData: postData
		}).trigger("reloadGrid");
	}

	function initAuthorityList(){
		var postData = {};
		$("#authorityListGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/resmanage/authority/authority-list'),
			styleUI: 'Bootstrap',
			rownumbers: true,
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
				label: sabace.getMessage("authority.label.user.code"),
				name: 'userId',
				width: 80,
				hlign: 'center',
				sortable: false,
                cellattr: function(rowId, tv, rawObject, cm, rdata) {
                    //合并单元格
                    return 'id=\'userId' + rowId + "\'";
                }
			}, {
				label: sabace.getMessage("authority.label.user.name"),
				name: 'userName',
				width: 100,
				align: 'left',
				hlign: 'center',
				sortable: false,
                cellattr: function(rowId, tv, rawObject, cm, rdata) {
                    //合并单元格
                    return 'id=\'userName' + rowId + "\'";
                }
			}, {
				label: sabace.getMessage("authority.label.dimId"),
				name: 'dimId',
				width: 80,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage('authority.label.dimName'),
				name: 'dimName',
				width: 150,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("authority.label.dimValues"),
				name: 'dimValueNames',
				width: 230,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("authority.label.opt"),
				name: 'opt',
				width: 100,
				align: 'center',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					var userId = rowObject.userId;
					var userName = rowObject.userName;
					var dimId = rowObject.dimId;
					var dimName = rowObject.dimName;
					return "<a href='javascript:void(0)' class='editAuthority' userId='" + userId + "' userName='" + userName + "' dimId='" + dimId + "' dimName='" + dimName + "'>"+sabace.getMessage("authority.label.modify")+"</a> / " +
						   "<a href='javascript:void(0)' class='deleteAuthority' userId='" + userId + "' dimId='" + dimId + "'>"+sabace.getMessage("authority.label.delete")+"</a>";
				}
			}, {
				label: sabace.getMessage("authority.label.opt"),
				name: 'operate',
				width: 100,
				align: 'center',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					var userId = rowObject.userId;
					var userName = rowObject.userName;
					var dimId = rowObject.dimId;
					var dimName = rowObject.dimName;
					return "<a href='javascript:void(0)' class='addDim' userId='" + userId + "' userName='" + userName + "'>"+sabace.getMessage("authority.label.add")+"</a> ";
				},
                cellattr: function(rowId, tv, rawObject, cm, rdata) {
                    //合并单元格
                    return 'id=\'operate' + rowId + "\'";
                }
			}],
			rowNum: 10,
			rowList: [10, 20, 30],
			pager: "#authorityListGridPager",
			jsonReader: {
				records: "total",
				total: "totalPages"
			},
			gridComplete: function() {
	            //②在gridComplete调用合并方法
	            var gridName = "authorityListGrid";
	            Merger(gridName, "userId");
	        },
			afterInsertRow: function(rowId, data) {
				jQuery(this).jqGrid('setCell', rowid, 'operate', '<a>'+sabace.getMessage('authority.label.opt')+'</a>');
			}
		});
	}
	
	function Merger(gridName, CellName) {
	    //得到显示到界面的id集合
	    var mya = $("#" + gridName + "").getDataIDs();
	    //当前显示多少条
	    var length = mya.length;
	    for (var i = 0; i < length; i++) {
	        //从上到下获取一条信息
	        var before = $("#" + gridName + "").jqGrid('getRowData', mya[i]);
	        //定义合并行数
	        var rowSpanTaxCount = 1;
	        for (j = i + 1; j <= length; j++) {
	            //和上边的信息对比 如果值一样就合并行数+1 然后设置rowspan 让当前单元格隐藏
	            var end = $("#" + gridName + "").jqGrid('getRowData', mya[j]);
	            if (before[CellName] == end[CellName]) {
	                rowSpanTaxCount++;
	                $("#" + gridName + "").setCell(mya[j], "userId", '', { display: 'none' });
	                $("#" + gridName + "").setCell(mya[j], "userName", '', { display: 'none' });
	                $("#" + gridName + "").setCell(mya[j], "operate", '', { display: 'none' });
	            } else {
	                rowSpanTaxCount = 1;
	                break;
	            }
	            $("#userId" + mya[i] + "").attr("rowspan", rowSpanTaxCount);
	            $("#userId" + mya[i] + "").css("vertical-align", "middle");
	            $("#userName" + mya[i] + "").attr("rowspan", rowSpanTaxCount);
	            $("#userName" + mya[i] + "").css("vertical-align", "middle");
	            $("#operate" + mya[i] + "").attr("rowspan", rowSpanTaxCount);
	            $("#operate" + mya[i] + "").css("vertical-align", "middle");
	        }
	    }
	}
	
});
