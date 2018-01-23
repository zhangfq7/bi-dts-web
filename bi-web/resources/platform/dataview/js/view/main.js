/**
 * 文件描述:
 * 数据可视化初始化入口
 * 功能描述：
 */
define([
		'bace', 'view/layout', 'view/attr', 'view/header', 'view/widgets', 'view/box','view/component/keysUtil',
				'layout', 'poshytip', 'grid', 'date', 'switchButton', 'dialog', 'colpick', 'chosen','ztree','placeholder','dotdotdot','validation'
				], 
				function(Bace, Layout, Attr, Header, Widgets, Box,Keys) {
					var DataView = {};
					DataView.control = {
						init: function() {
							// alert(JSON.stringify(Bace.getBV()));
							// 在index.ftl中初始化,这里挂载到全局Box中,方便使用
							//挂载数据源编码
							Box.main.dataId = _DCVBNMMMM;

							//挂载数据源名称
				Box.main.dataName = _ELKJHGFFF;

				//挂载可视化编码
				Box.main.reportId = _RSDFGHJJKK;

				//挂载可视化模版编码
				Box.main.tplId = _MFUJNNGJLL;

				//挂载数据源类型
				Box.main.dataType = _ASWDFAFSS;

				//如果可视化编码不为空，视为修改操作
				if(Box.main.reportId){
					$.ajax({
						type: "POST",
						url: Bace.handleUrlParam('/platform/dataview/queryViewInfo'),
						dataType: 'json',
						data:{
							reportId:Box.main.reportId
						},
						success: function(config) {
                            //判断数据源是否删除，0删除，1未删除
							if(config.dataDeletaFlag==0){
								alert("数据源已删除！");
								window.close();
								return;
							}
							
							var resportConfigObj=$.evalJSON(config.resportConfig);
							if(!!resportConfigObj.imgSrc){
								sessionStorage.imgSrc=resportConfigObj.imgSrc;
							}
							if(discovery == '1'){
								//探索的时候删除过滤条件
								resportConfigObj.filters=[];
								var widgets = resportConfigObj.widgets;
								//保留被探索的图表，其他图表删除
								var widgetInDiscovery;
								for(var i = 0;i< widgets.length ;i++){
									if(widgets[i].option.el==chartIdInDiscovery){
										widgetInDiscovery=widgets[i];
										widgets=[];
										widgets[0]=widgetInDiscovery;
										break;
									}
								}
								resportConfigObj.widgets=widgets;
								//修改探索页面widgets面板中展示的图表位置及宽高  gaoya 20160811
								widgetInDiscovery.layout.width=1000+"px";
								widgetInDiscovery.layout.height=400+"px";
								widgetInDiscovery.layout.left=50+"px";
								widgetInDiscovery.layout.top=30+"px";
								//获取被点击报表的数据源
								Box.main.dataId = widgetInDiscovery.option.config.build.dataParams.dataId;
								Box.main.dataType = widgetInDiscovery.option.config.build.dataParams.dataType;
							}else{
								Box.main.dataId = config.dataId;
							}
							Box.main.reportName = config.reportName;
							Box.main.reportDesc = config.reportDesc;
							Box.main.expireDate = config.expireDate;
							Box.main.labelId = $.evalJSON(config.labelId);
							Box.main.reportId = config.reportId;
							Box.main.allowComment = config.allowComment;
							Box.main.urlMenuInfo=$.evalJSON(config.urlMenuInfo);//gaoya
							//装载所有面板
							intallPanel(function(){
								Attr.openAttrPanel();
							});
							//根据插入的可视化编码，渲染容器
							Widgets.start('render',resportConfigObj);
						},
						error: function() {
							//alert(JSON.stringify(arguments));
							alert('没有查询到数据源，自动跳转到可视化新建页面');
							//装载所有面板
							intallPanel();
						}
					});
				}else if(Box.main.dataId){
					//装载所有面板
					intallPanel(function(){
						Attr.openAttrPanel();
					});
				}else if(Box.main.tplId){
					$.ajax({
						type: "POST",
						url: Bace.handleUrlParam('/platform/dataview/queryTplConfigById'),
						dataType: 'json',
						data:{
							tplId:Box.main.tplId
						},
						success: function(config) {
							//装载所有面板
							intallPanel(function(){
								Widgets.start('renderTpl',$.evalJSON(config.tplConfig));
							});
						},
						error: function() {
							//alert(JSON.stringify(arguments));
							alert('没有查询到模版信息，自动跳转到可视化新建页面')
							//装载所有面板
							intallPanel();
						}
					});
				}else{
					//装载所有面板
					intallPanel();
				}
				function intallPanel(callback){
					//用于计算响应时间的,在index.ftl中定义
					_T.set('x');
					//初始化布局
					Layout.init();

					//初始化头部操作区域
					Header.init();

					//初始化图表区域
					Widgets.init();

					//Keys.init();

					//数据源已具备
					if(Box.main.dataId){
						//初始化指标树
						Attr.init();
					}
					callback?callback():'';
					_T.get('x');
				}
			}
		};

		DataView.module = {};
		DataView.view = {};

		//确认导航弹出框,点击确定后关闭标签
		window.onbeforeunload = function(event) {
			return "您好，检测到您关闭当前设计器！";
		};

		return DataView.control;
	});