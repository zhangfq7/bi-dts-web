/**
 * mby shaojs 20161010
 * 增加了__dataId参数,方便查看不同的数据源,默认值为全局数据源dataId
 */
define(['view/box', 'bace'],
	function(Box, Bace) {
		var DataInfoUtil = {};
		DataInfoUtil.module = {
			type:{
				"1": "文件导入",
				"2": "数据表",
				"3": "工作表链接",
				"4": "openApi",
				"5": "数据库直连",
				"6": "DACP",
				"7": "视图"
			}
		};
		DataInfoUtil.control = {
			show: function(__dataId) {
				if (!jQuery("#dataInfoPanel").length) {
					jQuery("body").append("<div id='dataInfoPanel' style='display:none'></div>");
					var pageURL = Bace.handleUrlParam("/platform/dataview/dataInfoPage");
					jQuery("#dataInfoPanel").load(pageURL, function() {
						DataInfoUtil.view.show(__dataId);
					})
				} else {
					DataInfoUtil.view.show(__dataId);
				}
			},
		};
		DataInfoUtil.view = {
            //增加了__dataId参数,默认值取Box.main.dataId
			show: function(__dataId) {
                __dataId =__dataId || Box.main.dataId;
				var $dataInfoPanel = $("#dataInfoPanel");
				DataInfoUtil.view.getDataInfo(__dataId).then(function(data){
					$dataInfoPanel.find(".dataName").text(data.dataName);
					$dataInfoPanel.find(".dataType").text(DataInfoUtil.module.type[data.dataType]);
					$dataInfoPanel.find(".dataDesc").text(data.dataDesc);
					$dataInfoPanel.find(".adminName").text(data.adminName);
					$dataInfoPanel.find(".adminTime").text(data.adminTime);
					if(data.lastUpdateTime != null && data.lastUpdateTime != ""){
						$dataInfoPanel.find(".lastUpdateTime").text(data.lastUpdateTime);
					}else{
						$dataInfoPanel.find(".lastUpdateTime").text("无");
					}
					var attrList  = data.attrList;
					$.dialog({
						title: '数据源信息浏览',
						padding: '0',
						width: '800px',
						height: '500px',
						lock: true,
						resizable:false,
						content: jQuery("#dataInfoPanel")[0],
						cancelVal: '关闭',
						cancel: true,
						init:function(){
							
							var grid = $("#dataList").ligerGetGridManager();
							if (grid){
								$.ligerui.remove(grid) 
								$("#dataList").remove();
								jQuery("#dataInfoPanel").append("<div id='dataList' class='bi-gray'></div>")
							};
							$("#dataList").ligerGrid({
								url:Bace.handleUrlParam("/platform/dataview/preViewDataSrc"),
								parms:{
									dataId:__dataId,
									dataType: data.dataType
								},
								columns:function(){
									var array = [];
									for(var i = 0,n=attrList.length;i<n;i++){
										array.push({
											display:attrList[i].attrName,
											name:attrList[i].attrId,
											width:110,
											align: 'left'
										})
									}
									return array;
								}(),
								width: '100%', 
								height: '352px',
//								headerRowHeight: "30",
								allowHideColumn: false,
								enabledSort: false,
								alternatingRow: false,
								resizable: false,
								rownumbers: true,
								//checkbox:true,
								inWindow: false,
								onLoaded:function(grid){
									Bace.autoScroll(jQuery("#dataList .l-grid-body2"));
									jQuery("#dataInfoPanel .dataNum").html(grid.currentData.Total);
								}
							})
						}
					});
					
				},function(){
					
				})
			},
            //增加了__dataId参数,默认值取Box.main.dataId
			getDataInfo:function(__dataId){
				return $.ajax({
					type:'post',
					dataType:'json',
					url:Bace.handleUrlParam("/platform/dataview/viewDataSrcInfo"),
					data:{
						dataId: __dataId ||Box.main.dataId
					}
				})
			},
			bindEvent: function() {}
		};
		return DataInfoUtil.control;
	});