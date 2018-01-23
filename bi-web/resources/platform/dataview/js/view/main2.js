/**
 * 文件描述:
 * 数据可视化查看入口
 * 功能描述：报表查看页面
 */
define([
		'bace', 'view/layout', 'view/pc/contanier','view/pc/serach', 'view/box','view/pc/share',
		'layout', 'poshytip', 'grid', 'date', 'switchButton', 'dialog', 'colpick', 'chosen','ztree','placeholder','dotdotdot','validation'
	],
	function(Bace, Layout,Contanier,Serach,Box,Share,dialog) {
		var DataView = {};
		DataView.control = {
			init: function() {
				// alert(JSON.stringify(Bace.getBV()));

                //全局标记,现在是展示页面 addby shaojs 20170111
                Box.flags.isVeiwPage = true;

				//挂载可视化编码
				var reportId = _RSDFGHJJKK;
				if(previewKey){
					var config = $.evalJSON(window.sessionStorage.getItem(previewKey));console.log(config);
					if(!config){
						alert("链接已失效");
						return;
					}
					Box.main.dataId = config.dataId;
					Box.main.reortName = config.reportName;
					Box.main.reportId = config.reportId;
					Box.main.allowComment = 0;

					if($.evalJSON(config.urlMenuInfo).length>0){
						Box.main.urlMenuInfo=$.evalJSON(config.urlMenuInfo);//gaoya
					}

					//装载所有面板
					Layout.init();
					jQuery("#layout_body_title_panel").hide();
					//初始化图表区域
					Contanier.init();
					//根据插入的可视化编码，渲染容器
					var reportConfig = $.evalJSON(config.resportConfig);
					Contanier.start('render',reportConfig,"isPreview");
					return;
				}

				if(reportId){
					$.ajax({
						type: "POST",
						url: Bace.handleUrlParam('/platform/dataview/queryViewInfo'),
						dataType: 'json',
						data:{
							reportId:reportId
						},
						success: function(config) {
							//判断数据源是否删除，0删除，1未删除
							if(config.dataDeletaFlag==0){
								alert("数据源已删除!");
								window.close();
								return;
							}
							Box.main.dataId = config.dataId;
							Box.main.reportName = config.reportName;
							Box.main.reportId = config.reportId;
							Box.main.allowComment = config.allowComment;

							if($.evalJSON(config.urlMenuInfo).length>0){
								Box.main.urlMenuInfo=$.evalJSON(config.urlMenuInfo);//gaoya
							}
							//判断是否有filter,在布局之前,修改布局配置,为分享面板留位置
							var reportConfig = $.evalJSON(config.resportConfig);
							var filters = reportConfig.filters;
							var hasFilter = (filters && filters.length > 0 );
							Layout.setShareLayout(hasFilter);
							//装载所有面板
							Layout.init();
							jQuery("#layout_body_title_panel").hide();
							//初始化图表区域
							Contanier.init();
							//根据插入的可视化编码，渲染容器
							Contanier.start('render',reportConfig);
							
							// 报表分享,初始化分享工具栏
							Share.init(reportConfig);
                            //绑定下载和推送功能
                            Contanier.bindEmailAndDownload();
						},
						error: function() {
							alert(JSON.stringify(arguments));
							alert('没有查询到数据源，自动跳转到可视化新建页面');
						}
					});
				}
			}
		};

		DataView.module = {};
		DataView.view = {};

		return DataView.control;
	});