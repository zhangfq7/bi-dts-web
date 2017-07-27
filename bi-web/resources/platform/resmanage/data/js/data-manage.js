define(['sabace','dbSource','data-message','userSelect'], function(sabace,dbSource,message,userSelect) {

	var dataManageList = {};
	dataManageList.view = {

		initDataManageList: function() {

			var dbId = $("#dbId").val();
			var dbName = $("#dbName").val();
			var dbDesc = $("#dbDesc").val();
			var dbType = $("#dbType").val();
			var createTime = $("#createTime").val();

			var postData = {};
			postData.dbId = dbId;
			postData.dbName = dbName;
			postData.dbDesc = dbDesc;
			postData.dbType = dbType;
			postData.createTime = createTime;

			$("#dataListGrid").jqGrid({
				url: sabace.handleUrlParam('/platform/resmanage/db/data-manage-list'),
				styleUI: 'Bootstrap',
				datatype: "json",
				postData: postData,
				mtype: 'post',
				forceFit: true,
				colModel: [
                    {
                        label: "租户名称",
                        name: 'proId',
                        width: 75,
                        align: 'left',
                        hlign: 'center',
                        sortable: false,
                        formatter: function(cellvalue, options, rowObject) {
                            if(rowObject.addFlag=='9')
                            {
                                return "<span style='color: red'>"+rowObject.proId+"</span>";
                            }
                            return rowObject.proId;
                        }
                    },
					{
					label: "数据名称",
					name: 'dbName',
					width: 75,
					align: 'left',
					hlign: 'center',
					sortable: false,
                    formatter: function(cellvalue, options, rowObject) {
                        if(rowObject.addFlag=='9')
                        {
                            return "<span style='color: red'>"+rowObject.dbName+"</span>";
                        }
                        return rowObject.dbName;
					}
				},{
					label: "获取方式",
					name: 'interfaceFlag',
					width: 40,
					align: 'left',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						if(rowObject.interfaceFlag == '1'){
                            if(rowObject.addFlag=='9')
							{
                                return "<span style='color: red'>接口</span>" ;
							}
							return '接口' ;
						}else if(rowObject.interfaceFlag == '2'){
                            if(rowObject.addFlag=='9')
                            {
                                return "<span style='color: red'>直连</span>" ;
                            }
							 return '直连';
						}else{
                            if(rowObject.addFlag=='9')
                            {
                                return "<span style='color: red'>本地</span>" ;
                            }
							return '本地' ;
						}
					}
				}, {
					label: "数据描述",
					name: 'dbDesc',
					width: 90,
					align: 'left',
					hlign: 'center',
					sortable: false,
                    formatter: function(cellvalue, options, rowObject) {
                        if(rowObject.addFlag=='9')
                        {
                            return "<span style='color: red'>"+rowObject.dbDesc+"</span>";
                        }
                        return rowObject.dbDesc;
                    }

				}, {
					label: "数据库类型",
					name: 'dbType',
					width: 60,
					align: 'left',
					hlign: 'center',
					sortable: false,
                    formatter: function(cellvalue, options, rowObject) {
                        if(rowObject.addFlag=='9')
                        {
                            return "<span style='color: red'>"+rowObject.dbType+"</span>";
                        }
                        return rowObject.dbType;
                    }
				}, {
					label: "创建人",
					name: 'createUserName',
					width: 60,
					align: 'left',
					hlign: 'center',
					sortable: false,
                    formatter: function(cellvalue, options, rowObject) {
                        if(rowObject.addFlag=='9')
                        {
                            return "<span style='color: red'>"+rowObject.createUserName+"</span>";
                        }
                        return rowObject.createUserName;
                    }
				}, {
					label: "创建时间",
					name: 'createTime',
					width: 80,
					align: 'left',
					hlign: 'center',
					sortable: false,
                    formatter: function(cellvalue, options, rowObject) {
                        if(rowObject.addFlag=='9')
                        {
                            return "<span style='color: red'>"+rowObject.createTime+"</span>";
                        }
                        return rowObject.createTime;
                    }
				}, {
					label: "分享",
					name: 'isShare',
					width: 80,
					align: 'left',
					hlign: 'center',
					hidden: true,
					sortable: false
				}, {
					label:"是否手工创建",
					name:'addFlag',
					width:80,
                    ahlign: 'center',
                    hidden: true,
                    sortable: false
				},{
					label: "操作",
					name: 'operate',
					width: 100,
					align: 'center',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						var dbId = rowObject.dbId;
						if(rowObject.interfaceFlag == '1'){
							return "<a href='javascript:void(0)' class='data-query' dbId='" + dbId + "'>查看</a> /  " +
							"<a href='javascript:void(0)' class='data-number' interfaceFlag='"+rowObject.interfaceFlag+"' dbId='" + dbId + "' dbName='"+rowObject.dbName+"'>取数</a> /  " ;
								//+
							// "<a href='javascript:void(0)' class='data-del' interfaceFlag='"+rowObject.interfaceFlag+"' dbId='" + dbId + "'>删除</a> ";
						}else{
							if(rowObject.isShare == '1'){
								// 分享的
								return "<a href='javascript:void(0)' class='data-query' dbId='" + dbId + "'>查看</a> /  " +
								"<a href='javascript:void(0)' class='data-number' interfaceFlag='"+rowObject.interfaceFlag+"' dbId='" + dbId + "'>取数</a> ";
							}else{
								// 自己创建的(interfaceFlag=0或interfaceFlag=2)
								var resHtml =  "<a href='javascript:void(0)' class='data-query' dbId='" + dbId + "'>查看</a> /  " ;
								if(rowObject.addFlag=='1')
								{
									resHtml += "<a href='javascript:void(0)' class='data-edit' dbId='" + dbId + "'>修改</a> /  " ;
								}
								if(!rowObject.addFlag=='9' || rowObject.addFlag==null || rowObject.addFlag==undefined)
								{
                                    resHtml += "<a href='javascript:void(0)' class='data-number' interfaceFlag='"+rowObject.interfaceFlag+"' dbId='" + dbId + "' dbName='"+rowObject.dbName+"'>取数</a> /  ";
								}

                                if(rowObject.addFlag=='1' || rowObject.addFlag=='9')
                                {
                                	resHtml += "<a href='javascript:void(0)' class='data-del' interfaceFlag='"+rowObject.interfaceFlag+"' dbId='" + dbId + "'>删除</a> ";
                                }

								return resHtml;
									// +
								// "<a href='javascript:void(0)' class='data-grant' dbId='" + dbId + "'>赋权</a> /  " +
								// "<a href='javascript:void(0)' class='data-del' interfaceFlag='"+rowObject.interfaceFlag+"' dbId='" + dbId + "'>删除</a> ";
							}
						}

					}
				}],
				viewrecords: true, // show the current page, data rang and total records on the toolbar
				autowidth: true,
				height: 'auto',
				rowNum: 10,
				rowList: [10, 20, 30],
				rownumbers: true, //show row number
				pager: "#dataListGridPager",
				jsonReader: {
					records: "total",
					total: "totalPages"
				},
				afterInsertRow: function(rowId, data) {
					jQuery(this).jqGrid('setCell', rowid, 'operate', '<a>操作</a>');
				},
				regional: 'cn'
			});
		}
	};

	dataManageList.controller = {

		init: function() {
			
			//给按钮组点击样式
			jQuery(".data-manage-btn button").bind("click", function() {
				jQuery(this).removeClass("normal-button").addClass("clicked-button theme-background").siblings().addClass("normal-button").removeClass("clicked-button theme-background");
			});
			jQuery(".data-manage-btn button").on('mouseover', '.normal-button', function() {
				jQuery('.normalButton').removeClass('theme-background');
				jQuery(".data-manage-btn button").addClass('theme-background');
			}).on('mouseleave', '.normal-button', function() {
				jQuery(".data-manage-btn button").removeClass('theme-background');
			});

			//列表自适应
			$(window).resize(function() {
				sabace.timeout(function() {
					$("#dataListGrid").setGridWidth($("#listPanel").width() - 5);
				}, 100);
			});

			//添加数据库
			$("#addDMButton").on("click", function() {
				getDBPage("add");
			});
			
			//选择数据库
			$("#selectDatabase").on("click", function() {
				bi.dialog.show({
					id: 'createOpenApi',
					title: "请选择数据库",
					nl2br: false,
					cssClass: 'dacp-database-list-dialog',
					message: jQuery('<div id="tableContainer" style="padding-right:5px;text-align:center">请稍候...</div>'),
					closable: true,
					closeByBackdrop: false,
					closeByKeyboard: false,
					onshown:function(){
						jQuery("#tableContainer").html('<table style="width:90%" id="dacpDatabaseTable"></table>');
						buildPageList();
					},
					buttons: [{
						label: "取消",
						cssClass: 'btn-default',
						action: function(dialog) {
							dialog.close();
						}
					}]
				});
			});
			
			// 点击查询的操作
			jQuery("#searchButton").on("click", function() {
				queryDMList();
			});
			
			//点击数据来源按钮的操作
			jQuery('.data-manage-btn').on('click', '.btn', function(){
				var dbType = $(this).attr("flag");
				queryDMList(dbType);
			});
			
			/**
			 * 初始化dacp数据库列表页面
			 */
			function buildPageList(){
				jQuery("#dacpDatabaseTable").jqGrid({
					url: sabace.handleUrlParam('/platform/resmanage/db/query-dacp-database-list'),
					styleUI: 'Bootstrap',
					datatype: "json",
					colModel: [{
						label: '数据库名称',
						name: 'dbName',
						width: 30,
						align: 'left',
						sortable: false
					},{
						label: '描述',
						name: 'dbDesc',
						width: 30,
						align: 'left',
						sortable: false
					}, {
						label: '数据库类型',
						name: 'dbType',
						width: 17,
						align: 'left',
						sortable: false
					}, {
						label: '数据库用户名',
						name: 'dbUser',
						width: 20,
						align: 'left',
						sortable: false
					}, {
						label: '数据库密码',
						name: 'dbPassword',
						width: 17,
						align: 'left',
						sortable: false
					}, {
						label: '数据库连接串',
						name: 'dbUrl',
						width: 30,
						align: 'left',
						sortable: false
					}, {
						label: '数据库驱动信息',
						name: 'dbDriver',
						width: 30,
						align: 'left',
						sortable: false
					}, {
						label: '操作',
						name: 'dbType',
						width: 20,
						align: 'center',
						sortable: false,
						formatter: function(cellvalue, options, rowObject) {
							return '<a href="javascript:void(0)" id="' + options.rowId + '" class="dacp-database-select">引用</a>' ;
						}
					}],
					autowidth: true,
					height: 'auto',
					rowNum: 100000,
					regional: 'cn',
					loadComplete:function(data){
						jQuery(".dacp-database-select").on("click",  function() {
							var dataIndex = this.id-1;
							var rowData = data[dataIndex];
							rowData.type="add";
							rowData.interfaceFlag="1";
							console.log(rowData);
							sabace.ajax({
								type: 'post',
								cache: false,
								dataType: "json",
								url: sabace.handleUrlParam("/platform/resmanage/db/data-db-edit"),
								data: rowData,
								loading: {
									title: '请稍后...',
									text: '正在保存，请稍候...'
								},
								success: function(req) {
									if(req.retFlag == "0"){
										bi.dialog.show({
											type: bi.dialog.TYPE_DANGER,
											title: "提示",
											message: "数据库连接信息错误",
											buttons: [{
		            							label: "确定",
		            							cssClass: 'btn-info',
		            							action: function(dialog) {
		            								bi.dialog.closeAll();
		            							}
		            						}]
										});
									} else if(req.retFlag == "3") {
										bi.dialog.show({
											type: bi.dialog.TYPE_INFO,
											title: "提示",
											message: "保存成功",
											buttons: [{
		            							label: "确定",
		            							cssClass: 'btn-info',
		            							action: function(dialog) {
		            								jQuery("#dataListGrid").jqGrid().trigger("reloadGrid");
		            								bi.dialog.closeAll();
		            							}
		            						}]
										});
									} else if(req.retFlag == "4") {
										bi.dialog.show({
											type: bi.dialog.TYPE_INFO,
											title: "提示",
											message: "您已经使用过该数据库了",
											buttons: [{
		            							label: "确定",
		            							cssClass: 'btn-info',
		            							action: function(dialog) {
		            								bi.dialog.closeAll();
		            							}
		            						}]
										});
									} else if(req.retFlag == "2") {
										bi.dialog.show({
											type: bi.dialog.TYPE_INFO,
											title: "提示",
											message: "数据库驱动不匹配",
											buttons: [{
		            							label: "确定",
		            							cssClass: 'btn-info',
		            							action: function(dialog) {
		            								bi.dialog.closeAll();
		            							}
		            						}]
										});
									}
								},
								error: function(req) {
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: "提示",
										message: req.responseText || "设置OpenApi失效异常!"
									});
								}
							});
						});
					}
				});
			};
			
			//数据库源新增、修改和删除后实现页面的数据列表的刷新
			function reloadDB(){
				queryDMList();
			}
			
			dataManageList.view.initDataManageList();

			// 根据录入的查询条件，查询数据信息
			function queryDMList(dbType) {
				var postData = {};
				postData.dbName = $("#dbNameText").val();
				postData.dbType = dbType;

				jQuery("#dataListGrid").jqGrid("setGridParam", {
					postData: postData
				}).trigger("reloadGrid");
			}
			//数据库直连时表及表字段的配置 added by zhangcc
			function tableImportDirect(dbId,dataId){
				var params = {};
				if(dataId == ""){
					params.dbId = dbId;
				}else{
					params.dataId = dataId;
				}
				var url = sabace.handleUrlParam("/platform/resmanage/data/data-table-import-direct");
				//页面跳转
				redirecPage(url,params);
			}
			//数据库表导入
			function tableImport(dbId,dataId){
				var params = {};
				if(dataId == ""){
					params.dbId = dbId;
				}else{
					params.dataId = dataId;
				}
				var url = sabace.handleUrlParam("/platform/resmanage/data/data-table-import");
				//页面跳转
				redirecPage(url,params);
			}
			
			// 从dacp接口中数据库表导入
			function tableImportByDacp(dbId,dataId,dbName){
				var params = {};
				if(dataId == ""){
					params.dbId = dbId;
					params.dbName = dbName;
				}else{
					params.dataId = dataId;
				}
				var url = sabace.handleUrlParam("/platform/resmanage/data/data-table-import-dacp");
				//页面跳转
				redirecPage(url,params);
			}
			
			// 页面跳转方法
			function redirecPage(url,params){
				var html = "";
				// 遍历参数
				for(var name in params){
					html += "<input name='" + name + "' value='" + params[name] + "'/>";
				}
				var formTemp = jQuery("<form></form>",{
					"method":"post",
					"action": url,
					"target": "_blank",
					"html": html
				});
				jQuery('body').append(formTemp);
				formTemp.submit();
				jQuery(formTemp).remove();
			}
			
			// 数据库源赋权及数据分享
			function grantOrShare(type,dbId){
				var url = sabace.handleUrlParam("/platform/resmanage/db/data-user-select");
				bi.dialog.show({
					title: "用户选择",
					message: jQuery('<div id="userList"></div>').load(url),
					spinicon:'glyphicon glyphicon-refresh',
					cssClass: 'data-userList',
					onshown:function(dialog){
						// "1"为数据源赋权 "2"为数据分享
						userSelect.init(type,dbId);
					},
					buttons:[{
				   		label: sabace.getMessage('data.dataLink.label.Sure'),
				   		cssClass: 'btn-info',
				   		action: function(dialog){
				   			userSelect.saveUserSelect();
						}
					},{
						label: sabace.getMessage('data.dataLink.label.Cancel'),
						cssClass: 'btn-default',
						action: function(dialog) {
							dialog.close();
						}
					}
				   ]
				});
			}
			//数据源配置信息新增或修改
			function getDBPage(type,dbId){
				var title = sabace.getMessage('data.datlist.label.addDS');
				if(type == "edit"){
					title = sabace.getMessage('data.datlist.label.modifyDS');
				}else if(type == "view"){
					title = sabace.getMessage('data.datlist.label.viewDS');
				}
				var url = sabace.handleUrlParam("/platform/resmanage/db/data-db");
				var buttons = [{
			   		label:sabace.getMessage('data.datlist.label.nextStep'),
			   		cssClass: 'btn-info',
			   		action: function(dialog){
			   			if(dbSource.next()){
							dialog.setButtons(nextbuttons);
							dialog.updateButtons();
						}
					}
				},{
					label: sabace.getMessage('data.dataLink.label.Cancel'),
					action: function(dialog) {
						dialog.close();
					}
				}
		        ];
				var nextbuttons = [{
					label:sabace.getMessage('data.datlist.label.reselection'),
			   		cssClass: 'btn-info',
			   		action: function(dialog){
			   			dbSource.reSelect();
			   			dialog.setButtons(buttons);
						dialog.updateButtons();
					}
				},{
					label: sabace.getMessage('data.datlist.label.test'), 
					cssClass: 'btn-info',
					action: function(dialog){
						dbSource.test();
					}
				},{
					label: sabace.getMessage('data.dataLink.label.Sure'), 
					cssClass: 'btn-info',
					action: function(dialog){
						dbSource.save(reloadDB);
					}
				},{
					label: sabace.getMessage('data.dataLink.label.Cancel'),
					action: function(dialog) {
						dialog.close();
					}
				}
			   ];
				var viewButtons = [{
					label: "确定",
					cssClass: 'btn-info',
					action: function(dialog) {
						dialog.close();
					}
				}
		        ];
				
			   var editButtons = [{
					label: sabace.getMessage('data.datlist.label.test'), 
					cssClass: 'btn-info',
					action: function(dialog){
						dbSource.test();
					}
				},{
					label: sabace.getMessage('data.dataLink.label.Sure'),  
					cssClass: 'btn-info',
					action: function(dialog){
						dbSource.save(reloadDB);
					}
				},{
					label: sabace.getMessage('data.dataLink.label.Cancel'),
					action: function(dialog) {
						dialog.close();
					}
				}
			   ];
			   bi.dialog.show({
					title: title,
					message: jQuery('<div id="source"></div>').load(url),
					spinicon:'glyphicon glyphicon-refresh',
					cssClass: 'data-source',
					closable:true,
		            closeByBackdrop:false,
		            closeByKeyboard:false,
					onshown:function(dialog){
						if(type == "add"){
							dialog.setButtons(buttons);
						}else if(type == "edit"){
							dialog.setButtons(editButtons);
						}else if(type == "view"){
							dialog.setButtons(viewButtons);
						}
						dbSource.init(type,dbId);
					}
				});
			}
			
			//删除数据库信息
			function deleteDB(dbId,interfaceFlag){
				//向后台发送请求获取数据库信息
				sabace.ajax({
					url: sabace.handleUrlParam("/platform/resmanage/db/data-db-delete"),
					data:{
						dbId: dbId,
						interfaceFlag:interfaceFlag
					},
					success: function(req) {
						if(req.resFlag == "success"){
							bi.dialog.show({
								type: bi.dialog.TYPE_INFO,
					            title: sabace.getMessage('data.dataLink.label.prompt'),
					            message: sabace.getMessage('data.datlist.label.delSuccess')
						    });
							//页面清除
							reloadDB();
						}
					},
					error: function(req) {
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('data.dataLink.label.prompt'),
							message: req.responseText || sabace.getMessage('data.datlist.label.delFail')
						});
					}
				});
			}

			//修改
			$("#dataList").on("click", '.data-edit', function() {
				var dbId = $(this).attr("dbId");
				getDBPage("edit",dbId);
			});
			
			//数据库查看
			$("#dataList").on("click", '.data-query', function(){
				var dbId = $(this).attr("dbId");
				getDBPage("view",dbId);
			});
			
			//数据库取数
			$("#dataList").on("click", '.data-number', function(){
				var dbId = $(this).attr("dbId");
				var dbName = $(this).attr("dbName");
				var interfaceFlag = $(this).attr("interfaceFlag");
				// 如果interfaceFlag为1说明是从接口过来的数据
				if(interfaceFlag == '1'){
					var dbName = $(this).attr("dbName");
					tableImportByDacp(dbId,"",dbName);
				}else if(interfaceFlag == '2'){//直连
					tableImportDirect(dbId,"");
				}else{//直接抽取
					tableImport(dbId,"");
				}
				
			});
			
			//数据库赋权
			$("#dataList").on("click", '.data-grant', function(){
				var dbId = $(this).attr("dbId");
				// "1"为数据库源分享
				grantOrShare("1",dbId);
			});

			//删除
			$("#dataList").on("click", '.data-del', function() {
				var dbId = $(this).attr("dbId");
				var interfaceFlag = $(this).attr("interfaceFlag");
				var msg= "";
				msg = "该数据源删除后，与此数据源相关的工作表、视图、仪表板、维度等都将被删除，是否继续？";
				//if(interfaceFlag=='2'){
				//	 msg= "直连数据源删除后,此数据源下的工作表（包括视图）、工作表（包括视图）下的仪表板以及通过sql配置的维度等都将被删除,是否继续？";
				//}
				//else
				//{
				//	msg="确定要删除该数据源？";
				//}
				
				bi.dialog.confirm({
		            title: "提示",
		            message:msg,
		            callback: function(result) {
		                if(result) {
		        			deleteDB(dbId,interfaceFlag);
		                }
		            }
			    });
			});
		}
	};

	//返回页面所需方法
	return dataManageList.controller;
});