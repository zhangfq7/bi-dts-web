define(['sabace'], function(sabace) {
	var LinkShow = {};
	var interval;
	var timer1;
	var logId;
	var fileName = $(".name-td").text();
	var loddingDailog;

	LinkShow.module = {
		dataId:''
	};
	LinkShow.view = {
		initresultShowDataGrid:function(datalinkId,selectParamArray){
			var tempI = 0;
			for(var i = 0; i<selectParamArray.length;i++){
				/*if('0' == selectParamArray[i].isUsed){
					continue;
				}*/
				tempI++;
			}
			var length = tempI;
			var jqWidth = jQuery(".data-link-show").width() - 45;
			var width = 180;
			if (length * width < jqWidth) {
				width = Math.floor(jqWidth / length);
			}
			
			var colModelArray = new Array;
			var colModelObject;
			for(var i = 0; i<selectParamArray.length;i++){
				/*if('0' == selectParamArray[i].isUsed){
					continue;
				}*/
				colModelObject = {};
				colModelObject.label = selectParamArray[i].attrName;
				colModelObject.name = selectParamArray[i].attrId;
				colModelObject.align = 'left';
				colModelObject.hlign = 'left';
				colModelObject.width = width;
				colModelArray.push(colModelObject);
			}
			
			//点击下载按钮的操作
			jQuery("#downFileButton").on("click", function() {
				var dataId = datalinkId;
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
										message: '文件正在生成，请稍候！',
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
								closable: false,
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
						text: '正在下载，请稍后...'
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
			
			
			jQuery('#resultShowDataGrid').jqGrid({
				 url: sabace.handleUrlParam("/platform/resmanage/datalink/query-show-result"),
				 datatype: "json",
				 postData: {
					 dataId:datalinkId
				 },
				 styleUI : 'Bootstrap',
			     colModel: colModelArray,
			     height: 280,
				 jsonReader:{records:"total",total:"totalPages"},
				 rowNum: 10,
				 rownumbers: true,
				 pager: "#jqGridPagerTempShow",
				 regional:'cn',
				 shrinkToFit: false,
			     autowidth: true,
			     rownumWidth: '60px'
			});
			LinkShow.view.resizeGrid();
		},
		initDataResultShow:function(){
			var paramData = {
				"dataId":LinkShow.module.dataId
			};
			sabace.ajax({
				url: sabace.handleUrlParam("/platform/resmanage/datalink/query-show-param"),
				data: paramData,
				success: function(req){
					LinkShow.view.initresultShowDataGrid(LinkShow.module.dataId,req.selectParamArray);
					LinkShow.view.initDataLinkShow(req.dataLinkBean);
				},
				error: function(req){
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.db.title.tips'),
						message: req.responseText || sabace.getMessage('data.import.message.sysAbnormal')
					});
				}
			});
		},
		resizeGrid:function(){
			jQuery("#resultShowDataGrid").setGridWidth(jQuery(".data-link-show").width() - 40);
		},
		initDataLinkShow:function(dataLinkBean){
			jQuery('.link-table .name-td').html(dataLinkBean.dataName);
			fileName = $(".name-td").text();
			if('1' == dataLinkBean.followOrigin){
				jQuery('.link-table .update-td').html(sabace.getMessage('data.dataLink.label.yesLabel'));
			}else{
				jQuery('.link-table .update-td').html(sabace.getMessage('data.dataLink.label.noLabel'));
			}
			jQuery('.link-table .create-td').html(dataLinkBean.createName);
			jQuery('.link-table .create-time-td').html(dataLinkBean.createTime);
			jQuery('.link-table .num-td').html(dataLinkBean.dataNum);
			jQuery('.link-table .data-update-td').html(dataLinkBean.updateTime);
			jQuery('.link-table .desc-content').html(dataLinkBean.dataDesc);
			log(dataLinkBean)
			var nodeArr = dataLinkBean.nodeDataArray;
			var nodeStr = "";
			for(var i = 0;i < nodeArr.length;i++){
				nodeStr += nodeArr[i].nodeDataName;
				if(i < nodeArr.length-1){
					nodeStr += ",";
				}
			}
			jQuery('.link-table .datalink-td').html(nodeStr);
		}
	};
	LinkShow.controller = {
		init:function(){
			//初始化jGrid
			LinkShow.view.initDataResultShow();
		},setDataId:function(obj){
			LinkShow.module.dataId = obj; 
		}
	};
	return LinkShow.controller;
});
