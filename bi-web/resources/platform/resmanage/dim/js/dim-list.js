define(['sabace', 'dimList/message'], function(sabace, message) {

	jQuery(function() {

		//下拉框初始化
		jQuery('#selCreateType').chosen({
			disable_search: true
		});

		// 加载数据列表信息
		initDimInfoList();

		// 绑定按钮事件
		bindBtn();
	});

	/**
	 * 维度信息列表
	 */
	function initDimInfoList() {
		jQuery('#dimGrid').jqGrid({
			url: sabace.handleUrlParam("/platform/resmanage/dim/query-dim-list"),
			styleUI: 'Bootstrap',
			autowidth: true,
			postData: {},
			height: "auto",
			mtype: 'post',
			regional: 'cn',
			datatype: "json",
			viewrecords: true,
			rownumbers: true,
			colModel: [{
                label: '租户名称',
                name: 'proId',
                index: 'proId',
                hlign: 'center',
                width: 100
            },
				{
				label: sabace.getMessage('dim.label.dimName'),
				name: 'dimName',
				index: 'dimName',
				hlign: 'center',
				width: 100
			}, {
				label: sabace.getMessage('dim.label.createType'),
				name: 'createType',
				index: 'createType',
				hlign: 'center',
				width: 80,
				formatter: function(cellvalue, options, rowObject) {
					if (cellvalue == "1") {
						return sabace.getMessage('dim.label.createType.text');
					} else if (cellvalue == "2") {
						return sabace.getMessage('dim.label.createType.import');
					} else if (cellvalue == "3"){
						return sabace.getMessage('dim.label.createType.sql');
					} else {
						return "";
					}
				}
			}, {
				label: sabace.getMessage('dim.label.parentDimName'),
				name: 'parentDimName',
				index: 'parentDimName',
				hlign: 'center',
				width: 120
			}, {
				label: sabace.getMessage('dim.label.count'),
				name: 'dimRecordNum',
				index: 'dimRecordNum',
				hlign: 'center',
				align: 'right',
				width: 60
			}, {
				label: sabace.getMessage('dim.label.desc'),
				name: 'dimDesc',
				index: 'dimDesc',
				hlign: 'center',
				width: 150
			}, {
				label: sabace.getMessage('dim.label.createTime'),
				name: 'createTime',
				index: 'createTime',
				hlign: 'center',
				width: 70
			}, {
				label: sabace.getMessage('dim.label.opt'),
				name: 'dimId',
				index: 'dimId',
				align: 'center',
				hlign: 'center',
				width: 80,
				formatter: function(cellvalue, options, rowObject) {
					if ("1" == rowObject.operFlag)
					{
						var dimId = rowObject.dimId;
						return "<a href='javascript:void(0)' class='dim-edit' dimId='" + dimId + "'>" + sabace.getMessage('dim.buttom.opt.update') + "</a> /  " +
						"<a href='javascript:void(0)' class='dim-del' dimId='" + dimId + "'>" + sabace.getMessage('dim.buttom.opt.delete') + "</a> ";
					}
					else
					{
						return "";
					}
				}
			}],
			pager: "#dimGridPager",
			rowNum: 10,
			rowList: [10, 20, 30],
			jsonReader: {
				records: "total",
				total: "totalPages"
			},
			afterInsertRow: function(rowId, data) {
				jQuery(this).jqGrid('setCell', rowid, 'operate', '<a>' + sabace.getMessage('dim.label.opt') + '</a>');
			}
		});
	}

	/**
	 * 绑定按钮
	 */
	function bindBtn() {
		// 条件查询
		jQuery("#search-btn").on("click", function() {
			searchTable();
		});

		// 新增
		jQuery("#add-btn").on("click", function() {
			window.open(sabace.handleUrlParam("/platform/resmanage/dim/dim-page"));
		});

		// 修改
		jQuery(".dim-list").on("click", '.dim-edit', function() {
			var dimId = jQuery(this).attr("dimId");
			window.open(sabace.handleUrlParam("/platform/resmanage/dim/dim-page") + "?dimId=" + dimId);
		});

		// 删除
		jQuery(".dim-list").on("click", '.dim-del', function() {
			var dimId = jQuery(this).attr("dimId");
			deleteDim(dimId);
		});
	}

	/**
	 * 删除维度信息
	 */
	function deleteDim(dimId) {
		var paramData = {
			"dimId": dimId
		}

		bi.dialog.confirm({
			title: sabace.getMessage('dim.title.confirm'),
			message: sabace.getMessage('dim.message.delete.confirm'),
			callback: function(result) {
				if (result) {
					sabace.ajax({
						type: 'post',
						cache: false,
						dataType: "json",
						url: sabace.handleUrlParam("/platform/resmanage/dim/del-dim-info"),
						data: paramData,
						loading: {
							title: sabace.getMessage('dim.title.tips'),
							text: sabace.getMessage('dim.message.delete.doing')
						},
						success: function(req) {
							if ("succeed" == req.result) {
								bi.dialog.show({
									title: sabace.getMessage('dim.title.succeed'),
									message: sabace.getMessage('dim.message.delete.succeed'),
									onhidden: function() {
										searchTable();
									}
								});
							} else if ("disable" == req.result){
								var dataList = req.dataList;
								var msg = "";
								for ( var i = 0; i < dataList.length; i++) {
									var dataInfo = dataList[i];
									msg += "【" + dataInfo.dataName + "】";
									
									if (i > 1) {
										msg += "...";
										break;
									}
									
									if (i < dataList.length-1) {
										msg +=",";
									}
								}
								
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('dim.title.error'),
									message: sabace.getMessage('dim.message.delete.disable',msg)
								});
							} else {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('dim.title.error'),
									message: sabace.getMessage('dim.message.delete.error')
								});
							}
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('dim.title.error'),
								message: sabace.getMessage('dim.message.delete.error')
							});
						}
					});
				}
			}
		});
	}

	/**
	 * 条件查询
	 */
	function searchTable() {
		var paramData = {};
		paramData.dimName = $("#selDimName").val();
		paramData.createType = $("#selCreateType").val();
		paramData.dimDesc = $("#selDimDesc").val();

		// 重新加载数据
		jQuery("#dimGrid").jqGrid('setGridParam', {
			postData: paramData
		}).trigger("reloadGrid");
	}

	$(window).resize(function() {
		$("#dimGrid").setGridWidth($(".dim-list").width() - 5);
	});


	return {
		searchTable: searchTable
	}

});