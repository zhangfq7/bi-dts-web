define(['sabace'], function(sabace) {
	
	// jqGrid信息
	var gridInfo = {};
	var fileName;
	var loddingDailog;
	jQuery(function(){
		// 初始化上方表格及获取数据表格的ColModel
		initData();
	});
	
	// 初始化数据
	function initData(){
		sabace.ajax({
			url:sabace.handleUrlParam("/platform/resmanage/data/query-data-common"),
			data: {
				dataId: dataId,
				type: type
			},
			success: function(req) {
				if(req.resFlag == "success"){
					getDataSuccess(req);
				}else{
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
			            title: sabace.getMessage('data.db.title.tips'),
			            message: req.msg
				    });
					return false;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.db.title.tips'),
					message: sabace.getMessage('data.view.message.dataError')
				});
			}
		});
		
		jQuery("#downFileButton").on("click", function() {
			bi.dialog.confirm({
				title: '提示',
				message: '确定下载该数据？',
				callback: function(result) {
					if (result) {
						sabace.ajax({
							type: "post",
							cache: false,
							dataType: "json",
							url: sabace.handleUrlParam("/platform/resmanage/db/down-file"),
							data: {
								"dataId": dataId,
								"fileName":fileName,
								"downType":jQuery("#downType").val()
							},
							loading: {
								title: '提示',
								text: '正在生成文件，请稍后...'
							},
							success: function(req) {
								loddingDailog = bi.dialog.show({
									title: '提示',
									message: '文件正在生成中，请稍候！',
									nl2br: false,
									closable: false,
									closeByBackdrop: false,
									closeByKeyboard: false
								});
								sendMsgTrue(req);
							},
							error: function(req) {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('user.label.error'),
									message: req.responseText || sabace.getMessage('user.label.delError')
								});
							}
						});
					}
				}
			});
		});
		
		/**
		 * 过5秒查询文件生成情况
		 */
		function ajaxQueryLog(paramData) {
			sabace.ajax({
				type: 'post',
				cache: false,
				dataType: "json",
				url: sabace.handleUrlParam("/platform/resmanage/db/ajax-query-log"),
				data: {logId:paramData},
				success: function(req) {
					req = req[0];
					if ('1' == req.fileState) {
						bi.dialog.show({
							title: '提示',
							message: '是否转离线下载！',
							nl2br: false,
							closable: true,
							closeByBackdrop: false,
							closeByKeyboard: false,
							buttons: [{
								label: '是',
								cssClass: 'btn-info',
								action: function(dialogItself) {
									loddingDailog.close();
									modifyDownloadoffLine(paramData);
									dialogItself.close();
								}
							},{
								label: '否',
								cssClass: 'btn-info',
								action: function(dialogItself) {	
									timer1=setInterval(function() {
										ajaxQueryLogEx(paramData);
									}, 5000);
									dialogItself.close();
								}
							}]
						});
					} else if ('2' == req.fileState) { 
						bi.dialog.show({
							title: '提示',
							message: '文件生成成功,请点击确认进行下载！',
							nl2br: false,
							closable: true,
							closeByBackdrop: false,
							closeByKeyboard: false,
							buttons: [{
								label: '确定',
								cssClass: 'btn-info',
								action: function(dialogItself) {
									loddingDailog.close();
									doDownFile(req);
									dialogItself.close();
								}
							}]
						});
					} else if ('4' == req.fileState) { //生成失败
						bi.dialog.show({
							title: '提示',
							message: '文件生成失败！',
							nl2br: false,
							closable: true,
							closeByBackdrop: false,
							closeByKeyboard: false,
							buttons: [{
								label: '确定',
								cssClass: 'btn-info',
								action: function(dialogItself) {
									loddingDailog.close();
									dialogItself.close();
								}
							}]
						});
					} else if ('7' == req.fileState) { //文件已删除
						bi.dialog.show({
							title: '提示',
							message: '文件已删除！',
							nl2br: false,
							closable: true,
							closeByBackdrop: false,
							closeByKeyboard: false,
							buttons: [{
								label: '确定',
								cssClass: 'btn-info',
								action: function(dialogItself) {
									loddingDailog.close();
									dialogItself.close();
								}
							}]
						});
					}
				},
				error: function(req) {

				}
			});
		}
		
		/**
		 * 过5秒查询文件生成情况
		 */
		function ajaxQueryLogEx(paramData) {
			sabace.ajax({
				type: 'post',
				cache: false,
				dataType: "json",
				url: sabace.handleUrlParam("/platform/resmanage/db/ajax-query-log"),
				data: {logId:paramData},
				success: function(req) {
					req = req[0];
				 if ('2' == req.fileState) { 
						bi.dialog.show({
							title: '提示',
							message: '文件生成成功，请点击确认进行下载！',
							nl2br: false,
							closable: true,
							closeByBackdrop: false,
							closeByKeyboard: false,
							buttons: [{
								label: '确定',
								cssClass: 'btn-info',
								action: function(dialogItself) {
									loddingDailog.close();
									doDownFile(req);
									dialogItself.close();
								}
							}]
						});
						clearInterval(timer1);//取消第一个
					} else if ('4' == req.fileState) { //生成失败
						bi.dialog.show({
							title: '提示',
							message: '文件生成失败！',
							nl2br: false,
							closable: true,
							closeByBackdrop: false,
							closeByKeyboard: false,
							buttons: [{
								label: '确定',
								cssClass: 'btn-info',
								action: function(dialogItself) {
									loddingDailog.close();
									dialogItself.close();
								}
							}]
						});
					} else if ('7' == req.fileState) { //文件已删除
						bi.dialog.show({
							title: '提示',
							message: '文件已删除！',
							nl2br: false,
							closable: true,
							closeByBackdrop: false,
							closeByKeyboard: false,
							buttons: [{
								label: '确定',
								cssClass: 'btn-info',
								action: function(dialogItself) {
									loddingDailog.close();
									dialogItself.close();
								}
							}]
						});
					}
				},
				error: function(req) {

				}
			});
		}
		
		/**
		 * 修改离线文件生成状态
		 */
		function modifyDownloadoffLine(paramData) {
			sabace.ajax({
				type: 'post',
				cache: false,
				dataType: "json",
				url: sabace.handleUrlParam("/platform/resmanage/db/modify-download"),
				data: {
					logId:paramData,
					fileName:fileName
				},
				loading: {
					title: '提示',
					text: '正在生成文件，请稍后...'
				},
				success: function(req) {
					bi.dialog.show({
						title: '提示',
						message: '文件已转离线，请到文件下载页面查询！',
						nl2br: false,
						closable: true,
						closeByBackdrop: false,
						closeByKeyboard: false,
						buttons: [{
							label: '确定',
							cssClass: 'btn-info',
							action: function(dialogItself) {
								dialogItself.close();
							}
						}]
					});
				},
				error: function(req) {

				}
			});
		}
		
		/**
		 * 五秒查询
		 */
		function sendMsgTrue(paramData) {
			logId = paramData.logId;
			interval = setTimeout(function() {
				ajaxQueryLog(paramData.logId);
			}, 5000);
		}
		
		/**
		 * 下载文件
		 */
		function doDownFile(paramData) {
			jQuery("#downData").remove();
			jQuery("<form>",{
				"id":"downData",
				"method":"post",
				"action":sabace.handleUrlParam("/platform/resmanage/db/download-file"),
				"target":"_self",
				"html":"<input name='fileName' type='hidden' value='"+fileName+"'/><input name='logId' type='hidden' value='"+paramData.logId+"'/>"

			}).appendTo("body");
			jQuery("#downData").submit();
		}
	}
	
	
	// 初始化Grid
	function initGrid(){
		var colModel = [];
		var colModelList = gridInfo.colModelList;
		var length = colModelList.length;
		var jqWidth = jQuery(".data-grid-info").width() - 68;
		var width = 180;
		if (length * width < jqWidth) {
			width = Math.floor(jqWidth / length);
		}
		var _label = null;
		var _name = null;
		var _filter = null;
		var colObj = {
            hidden: true,
            name: 'jqGridError'
        };
		colModel.push(colObj);
		for(var i = 0; i < length; i++){
			_label = colModelList[i].label;
			_name = colModelList[i].name;
			_filter = colModelList[i].filter;
			if (_filter == "2") {
				_align = 'right';
			}else{
				_align = 'left';
			}
			colModel.push({
				label: _label,
				name:  _name,
				align: _align,
				hlign:'center',
				sortable:false,
				width:width
			})
		}
		
		jQuery("#dataGrid").jqGrid({
			url: sabace.handleUrlParam("/platform/resmanage/data/query-column-data"),
			datatype: "json",
			styleUI: 'Bootstrap',
			postData: {
				dataId: dataId,
				type: type,
				zsCount: gridInfo.zsCount
			},
	        colModel: colModel,
	        rownumbers: true,
	        rownumWidth: '60px',
	        shrinkToFit: false,
	        autowidth: true,
			height: 'auto',
	        viewrecords: true,
	        rowNum:10,
	        rowList:[10,20,30],
	        pager:"#dataGridPager",
	        regional:'cn',
	        jsonReader: {
				records: "total",
				total: "totalPages"
			}, 
			loadComplete: function () {
                var table = jQuery(this);
                var ret = table.jqGrid('getRowData');
                if (ret.length == 1) {
                    var tmpObj = ret[0];
                    if ("true" == tmpObj.jqGridError) {
                        table.find("#1").remove();
                        jQuery(".ui-jqgrid-bdiv").append('<div class="noResult" style="font-size:12px;height:28px;line-height:35px;text-align:center;">' + '数据还未生成，请稍后再试！' + '</div>');
                    }else if("noData" == tmpObj.jqGridError){
                    	table.find("#1").remove();
                        jQuery(".ui-jqgrid-bdiv").append('<div class="noResult" style="font-size:12px;height:28px;line-height:35px;text-align:center;">' + '没有查询到结果数据！' + '</div>');
                    }
                }
                //在回调函数里给fileName赋值
                fileName = $("#dataName").text();
            }
		})
		
		resizeGrid();
		$(window).resize(function() {
			resizeGrid();
		});
	}
	
	// 数据成功获取
	function getDataSuccess(req){
		var configBean = req.configBean;
		gridInfo.colModelList = req.colModelList;
		gridInfo.zsCount = configBean.dataNum;
		if(type == "1"){
			jQuery('#dataName').html(configBean.dataName);
			jQuery('#dataType').html(sabace.getMessage('data.view.message.file'));
			jQuery('#dataDesc').html(configBean.dataDesc);
			jQuery('#dataNum').html(configBean.dataNum);
			jQuery('#adminName').html(configBean.createName);
			jQuery('#adminTime').html(configBean.createTime);
			jQuery('#lastUpdateTime').html(configBean.lastUpdateTime);
		}else if(type == "2"){
			jQuery('#dataName').html(configBean.dataName);
			jQuery('#dataType').html(sabace.getMessage('data.view.message.table'));
			jQuery('#dataDesc').html(configBean.tableDesc);
			jQuery('#dbName').html(configBean.dbName);
			jQuery('#dataTable').html(configBean.dataTable);
			jQuery('#splitType').html(configBean.splitType);
			jQuery('#updatePeriod').html(configBean.updatePeriod);
			jQuery('#nextUpdateTime').html(configBean.nextUpdateTime);
			jQuery('#storageType').html(configBean.storageType);
			jQuery('#dataNum').html(configBean.dataNum);
			jQuery('#adminName').html(configBean.createName);
			jQuery('#adminTime').html(configBean.createTime);
			jQuery('#lastUpdateTime').html(configBean.lastUpdateTime);
		}
		else if(type == "4"){
			jQuery('#dataType').html("openAPI");
			jQuery('#serviceName').html(configBean.serviceName);
			jQuery('#methodName').html(configBean.methodName);
			jQuery('#serviceUrl').html(configBean.serviceUrl);
			jQuery('#paramStr').html(configBean.paramStr);
			jQuery('#dataDesc').html(configBean.tableDesc);
			jQuery('#dataName').html(configBean.dataTable);
			jQuery('#updatePeriod').html(configBean.updatePeriod);
			jQuery('#nextUpdateTime').html(configBean.nextUpdateTime);
			jQuery('#storageType').html(configBean.storageType);
			jQuery('#dataNum').html(configBean.dataNum);
			jQuery('#adminName').html(configBean.createName);
			jQuery('#adminTime').html(configBean.createTime);
			jQuery('#lastUpdateTime').html(configBean.lastUpdateTime);
		}else if(type == "5"){
			jQuery('#dataName').html(configBean.dataName);
			jQuery('#dataType').html("数据库直连");
			jQuery('#dataDesc').html(configBean.tableDesc);
			jQuery('#dbName').html(configBean.dbName);
			jQuery('#dataTable').html(configBean.dataTable);
			jQuery('#tableAlias').html(configBean.tableAlias);
			jQuery('#dateFieldId').html(configBean.dateFieldId);
			jQuery('#tableType').html(configBean.tableType);
			jQuery('#tablesStorage').html(configBean.tablesStorage);
			jQuery('#storageField').html(configBean.storageField);
			jQuery('#tableTime').html(configBean.tableTime);
		}else if(type == "7"){
			jQuery('#dataType').html("视图");
			jQuery('#dbName').html(configBean.dbName);
			jQuery('#viewTable').html(configBean.viewTable);
			jQuery('#viewJoin').html(configBean.viewJoin);
			jQuery('#viewName').html(configBean.viewName);
			jQuery('#dataDesc').html(configBean.viewDesc);
		}
		
		// 初始化Grid
		initGrid();
	}
	
	// 设置完成界面表格的宽度
	function resizeGrid() {
		jQuery("#dataGrid").setGridWidth(jQuery(".data-grid-info").width() - 5);
	}
});
