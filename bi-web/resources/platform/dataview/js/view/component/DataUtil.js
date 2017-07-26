define(['view/box', 'bace','view/attr'],
	function(Box, Bace,Attr) {
		var DataUtil = {};
		DataUtil.module = {
			
		};
		DataUtil.control = {
			init:function(){
				DataUtil.control.findDataByName();
			},
			show: function() {
				if (!jQuery("#chooseDataPanel").length) {
                    jQuery("body").append("<div id='chooseDataPanel' style='display:none;position: relative'></div>");
                    jQuery("#chooseDataPanel").load(Bace.handleUrlParam('/platform/dataview/chooseDataPage'), function() {
                        DataUtil.control.init();
                        DataUtil.view.bindEvent();
                        DataUtil.view.show();
                        Bace.autoScroll(jQuery("#chooseDataPanel .list"));
                    });
				} else {
					DataUtil.view.show();
                    //mby shaojs 20161010 每次打开都重新查询一下
                    DataUtil.control.findDataByName("");
				}
			},
			findDataByName:function(dataName){
				
				jQuery("#chooseDataPanel .data-loading").css({
					"display":"inline-block"
				}).spin({
					  lines: 9, 	
					  length: 3,
					  width: 2,
					  radius: 4,
					  corners: 0,
					  rotate: 11,
					  color: '#000',
					  speed: 1.2,
					  trail: 50, 
					  shadow: false,
					  hwaccel: false,
					  className: 'spinner',
					  zIndex: 2e9, 
					  top: 'auto', 
					  left: 'auto' 
					});
				
				$.ajax({
					type: "POST",
					url:Bace.handleUrlParam("/platform/dataview/findData"),
					dataType: 'json',
					data:{dataName:dataName||''},
					success: function(result) {
						jQuery("#chooseDbs .list,#chooseFiles .list,#chooseLinks .list").html('');
						var importList = result.importList;
						jQuery("#fileNum").text(importList.length);
						var dbList = result.dbList;
						jQuery("#dbNum").text(dbList.length);
						var linkList = result.linkList;
						jQuery("#dbLinkNum").text(linkList.length);
						
						rendImport(importList);
						rendDb(dbList);
						rendLink(linkList);
						
						$("#chooseDataPanel .dataInfo").dotdotdot()
						jQuery("#chooseDataPanel .data-loading").hide().spin('close');

                        //addby shaojs 20161010 如果有数据源,则选中该数据源
                        if(Box.main.dataId){
                            jQuery("#chooseDataPanel").find("[data-id='"+ Box.main.dataId +"']").addClass("checked");
                        }
						
					},
					error: function() {
						alert(JSON.stringify(arguments));
					}
				});
				
				function rendImport(importList){
					var importTemp = '<div data-id="${dataId}" data-name="${dataName}" class="data">'+
					 '<div class="choose-data file-icon"></div>'+
					 '<div class="dataInfo">${dataName}</div>'+
					 '<div class="state"><i class="fa fa-check"></i></div>'+
					'</div>';
					$.tmpl(importTemp,importList).appendTo("#chooseFiles .list");
				}
				function rendDb(dbList){
					var dbTemp = '<div data-id="${dataId}" data-name="${dataName}" class="data">' +
					 '<div class="choose-data {{if dataType == "2" && interfaceFlag == "0" }}db-icon{{/if}}' +
					 						 '{{if dataType == "2" && interfaceFlag == "1" }}dacp-icon{{/if}}' +
					 						 '{{if dataType == "4"}}openapi-icon{{/if}}' +
					 						 '{{if dataType == "5"}}connect-db-icon{{/if}}' +
					 						 '{{if dataType == "7"}}table-view-icon{{/if}}">'+
					 '</div>'+
					 '<div class="dataInfo">${dataName}</div>'+
					 '<div class="state"><i class="fa fa-check"></i></div>'+
					'</div>';
					$.tmpl(dbTemp,dbList).appendTo("#chooseDbs .list");
				}
				function rendLink(linkList){
					var linkTemp = '<div data-id="${dataId}" data-name="${dataName}" class="data" style="width: 103px;">'+
					 '<div class="choose-data link-icon"></div>'+
					 '<div class="dataInfo">${dataName}</div>'+
					 '<div class="state"><i class="fa fa-check"></i></div>'+
					'</div>';
					$.tmpl(linkTemp,linkList).appendTo("#chooseLinks .list");
				}
				
			},
		};
		DataUtil.view = {
			show:function(){
				$.dialog({
					title:'选择数据可视化数据源',
					padding:'0',
					width:'1000px',
					height:'500px',
					lock: true,
					content:jQuery("#chooseDataPanel")[0],
					ok: function () {
//						Box.main.dataId =  "T10836";
						var dataId = jQuery("#chooseDataPanel .data.checked").attr("data-id");
						//挂载数据源名称 shaojs 20160823
						var dataName = jQuery("#chooseDataPanel .data.checked").attr("data-name");
						//增加热度
						var dataType = jQuery("#chooseDataPanel .data.checked .choose-data").attr("class").replace("choose-data ","");
						var postdata = {
								dataId:	dataId
						};
						if(dataType == 'file-icon'){
							postdata.type= '1';
						}else if(dataType == 'db-icon' || dataType == 'dacp-icon'){
							postdata.type= '2';
						}else if(dataType == 'openapi-icon'){
							postdata.type= '4';
						}else if(dataType == 'link-icon'){
							postdata.type= '3';
						}else if(dataType == 'connect-db-icon'){
							postdata.type= '5';
						}else if(dataType == 'table-view-icon'){
							postdata.type= '7';
						}
						$.ajax({
							type: "POST",
							url:Bace.handleUrlParam("/platform/resmanage/data/set-hit-count"),
							dataType: 'json',
							data:postdata,
							success: function(result) {
								
							},
							error: function() {
								alert(JSON.stringify(arguments));
							}
						});
						
						//多数据源改造
//						if(Box.main.dataId){ 
//							$.dialog.confirm("页面即将刷新到新的数据源!您确定要切换数据源吗？",function(){
//								location.href = Bace.handleUrlParam("/platform/dataview/create")+"?dataId="+dataId
//							});
//						}else{
//							Box.main.dataId = dataId
//							Attr.init();
//							Attr.openAttrPanel('open');
//					        return true;
//						}
						Box.main.dataId = dataId;
						//挂载数据源名称 shaojs 20160823
						Box.main.dataName = dataName;
						Box.main.dataType = postdata.type;
						Attr.init();
						Attr.openAttrPanel('open');
						//关闭属性面板
						if(Box.Property.close != null){
							Box.Property.close(true);
							Box.Property.hideTip("error");
						}
				        return true;
					//	return false;
						
				    },
				    okVal:'引用',
				    cancelVal: '关闭',
				    cancel: function(){
				    	return true;
				    }
				});
			},
			bindEvent:function(){
				jQuery("#chooseDataPanel").on('click','.data',function(){
					jQuery("#chooseDataPanel .data").removeClass('checked');
					jQuery(this).addClass('checked');
				});
				jQuery("#chooseDataPanel").on('click','.searchButon',function(){
					DataUtil.control.findDataByName(jQuery("#dataName").val());
				})
			}
		};
		return DataUtil.control;
	});