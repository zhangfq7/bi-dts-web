define(['bace', 'view/box', 'view/layout', 'view/pc/serach', 'view/widgets/property', 'view/widgets/plugins/table/table', 'view/widgets/plugins/echarts/echarts','view/widgets/plugins/text/text','view/widgets/plugins/indicator/indicator','view/eventBinder'],
	function(Bace, Box, Layout, Serach, Property, TablePlugin, EChartsPlugin,TextPlugin) {
	var Widgets = {
			//当前图形的类型的组件对象
			currentPlugin: ''
		};
		Widgets.module = {
			isHaveFilter:false,
			isHaveOper:false,
			thumbURLArray:[],
			thumbLen:null
		};
		var loadingOption = {
			  lines: 13, // The number of lines to draw
			  length: 7, // The length of each line
			  width: 4, // The line thickness
			  radius: 10, // Theyy radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  color: '#fff', // #rgb or #rrggbb
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9 // The z-index (defaults to 2000000000)
		};
		Widgets.control = {
			init: function() {
				Widgets.view.init();
				Widgets.view.gotop();//返回顶部

				Box.Widgets.showLoading = Widgets.view.showLoading;
				Box.Widgets.hideLoading = Widgets.view.hideLoading;
				//挂载显示提示框方法
				Box.Widgets.showTip = Widgets.view.showTip;
				//挂载隐藏提示框方法
				Box.Widgets.hideTip = Widgets.view.hideTip;
			},
			getPluginByType:function(type){
				if (['pie', 'bar', 'barMix', 'line', 'radar', 'funnel', 'gauge', 'map','treemap', 'scatter','heatmap','effectScatter','heatmap1'].indexOf(type) > -1) {
					return Box.Widgets.plugins["echarts"];
				} else {
					return  Box.Widgets.plugins[type];
				}
			},
			start:function(type){

				if(type == 'render'){
					var config = arguments[1];
					var isPreview = arguments[2]||"";//判断是否是预览页面 gaoya 20170519
					var widgets = config.widgets;
					var filters = config.filters;

					var filterJsonStr = $.toJSON(filters);
					Serach.dataStart(filters);
					if(filters && filters.length > 0 ){
						jQuery("#layout_body_title_panel").show();
                        //延迟展开查询面板,保证面板高度计算正确
                        setTimeout(function(){
                            Layout.toggleFilterPanel('open');
                        },500);
						Widgets.module.isHaveFilter = true;
					}


					for(var i = 0,n= widgets.length;i<n;i++){
						var widget = widgets[i];
						var option = widget.option;
						var layout = widget.layout;
						//var opers = config.opers;
						var hasRight=option.config.build.dataParams.hasRight;//对特定用户放开数据探索权限 gaoya 20161008

                        //表格菜单数据挂载 addby shaojs 20161208
                        var menuData = widget.menuData;

						var $contanier = Widgets.view.packageContainer($("#tableChartPanel"), {
							top:layout["top"],
							left:layout["_left"]
						}, option.chartType,option.el,hasRight);

						$contanier.css({
							"width":layout["_width"],
							"height":layout["height"],
							"border-width":layout["border-width"],
							"border-color":layout["border-color"],
							"background":layout["background"],
							"box-shadow":layout["box-shadow"],
							"border-radius":layout["border-radius"]
						}).data('option', option);

                        //表格菜单数据挂载 addby shaojs 20161208
                        if(menuData){
                            $contanier.data("__menuData",menuData);
                        }

						(function(option){
							//不同组件调用不同apply方法
							setTimeout(function(){
								var chart = Widgets.control.getPluginByType(option.chartType).apply(option,true);
								//$("#centerPanel").css("top",$("#filterPanel").css('display')=='none'?0:$("#filterPanel").height());
							},500)
						})(option);
					}

					//模板水印开关
					var openWaterflag = !config.openWaterflag;
					Widgets.view.unCopy(openWaterflag);//禁止复制和产生水印

                    //获取最后一个图标的底部位置,方便插入评论和分享
                    var lastTop = Widgets.view.getLastBottom();
                    //增加分享区域(修改,直接写在页面中)
/*                    var sharPanel = jQuery("<div>",{
                        'id':'shareAndDownload',
                        'css':{
                            'height':'120px',
                            'width':'100%',
                            'background':'#F8FCFF',
                            'position':'relative',
                            'top':lastTop+"px"
                        }
                    });
                    jQuery("#tableChartPanel").append(sharPanel);
                    */
					if(Box.main.urlMenuInfo.length>0){
						Widgets.view.containerUlrGroup(lastTop);
					}

					if(!isPreview){//如果是预览页面，取消评论区的所有操作
						//addby shaojs 201701101403 绑定分享和评论的小开关
						$("#toggle_publicpanel").on("click",function(e){
							e.stopPropagation();
							$(".public_container","#public_panel").slideToggle();
							$(this).find(".fa").toggleClass("fa-caret-up").toggleClass("fa-caret-down");
						});
						$("#public_panel .oper_bar").on("click",function(){
							$("#toggle_publicpanel").click();
						});

						//底部留白(设置位置,同时把节点调整到tableChartPanel的最后)
						$("#public_panel").css({position:"absolute",width:"100%",top:(lastTop+29)+"px"}).appendTo($("#tableChartPanel"));
						//评论
						if(Box.main.allowComment==1 && $("#commentIframe")[0]){
							var commentIframe = $("#commentIframe");
							commentIframe[0].onload = function(){};
							commentIframe[0].src = Bace.handleUrlParam("/platform/myreport/comment/report-comment")+"?reportId="+Box.main.reportId;
						}else{
							$("#commentIframe").remove();
						}

						setTimeout(function(){
							if(config.filters.length==0){
								jQuery("#layout_body_content_panel").addClass("toTop")
							}
							//隐藏评论和分享区域（北京要求展开） gaoya 20170518
							//$(".public_container","#public_panel").hide();
							$("#public_panel").removeClass('invisible');
							jQuery('body').removeClass('invisible');
						},800)
					}

				}
			},
            /**
             * author:shaojs
             * date:20160809
             * 绑定下载和推送按钮(这两个按钮在初始化之后生成,所以需要在按钮生成之后再绑定)
             * */
            bindEmailAndDownload:function(){
                //下载
                $("#downloadEx")[0] && $("#downloadEx").on('click', function() {
                    //如果没有手机，进入填写手机的页面(report_config 在pc.ftl中由模板生成)
                    if(report_config.smsCaptcha ==1 &&( report_config.mobileNum=="" || report_config.mobileNum ==null)){
                        window.open(Bace.handleUrlParam('/platform/sysmanage/safety/bind-mobile-page'))
                        return;
                    }
                    $.dialog({
                        title: '下载数据文件',
                        lock: true,
                        resize: true,
                        width: 700,
                        height: 318,
                        padding: '0px 0px',
                        content: '<iframe id="mainfrm" frameBorder="0" width="100%" border="0" height="100%" src="'+Bace.handleUrlParam(webpath+'/platform/download/to-download')+'"></iframe>',
                        cancel: function () {
                            return $("#mainfrm")[0].contentWindow.cancel()
                        },
                        ok: function () {

                            var result =  $("#mainfrm")[0].contentWindow.sure();
                            if(result.flag){
                                jQuery('.actGotop').hide();

                                //设置tabe的宽度
                                var $els = $("#tableChartPanel .container");
                                $els.each(function(i,v){
                                    var $this = $(v);
                                    var option = $this.data("option");
                                    if(option.chartType == 'table'){
                                        $this.find("td[field]>div").each(function(){
                                            $(this).width($(this).width())
                                        })
                                    }
                                });
                                if(result.type=="pic"){
                                    Widgets.view.downPic();
                                }else if(result.type=="ppt"){
                                    Widgets.view.downPPT();
                                }
                            }else{
                                return false;
                            }
                        }

                    });

                });

                //邮件推送功能
                jQuery("#EmailEx")[0] && jQuery("#EmailEx").bind("click",function(){
                    Widgets.view.getThumbURL(function(thumbURL){
                        var formTemp = $("<form></form>",{
                            "method":"post",
                            "action":Bace.handleUrlParam(webpath+'/platform/dataview/to-email'),
                            "target": "_blank",
                            "html": "<input name='reportId' value='" + Box.main.reportId + "'/>"+
                            "<input name='img' value='" + thumbURL + "'/>"
                        });
                        $('body').append(formTemp);
                        formTemp.submit();
                        $(formTemp).remove();
                    });
                });
            }
		} ;

		Widgets.view = {
			init: function() {

				//给网格区域增加承接从头部拖下事件
				Widgets.view.initDroppable();

				//筛选区域初始话
				//Filter.init();

				//初始化所有绑定事件
				for (var event in Widgets.view.bindEvent) {
					Widgets.view.bindEvent[event]();
				}

			},
			initDroppable: function() {
				//为拖拽区域增加容器放置功能
				jQuery("#tableChartPanel").droppable({
					//拖拽容器放下时，触发的事件
					drop: function(event, ui) {

						var helper = ui.helper;
						//$this表示拖拽区域
						var $this = $(this);

						//如果不是从头部拖拽下来，则中断逻辑
						if (!helper.hasClass("hp-container")) {

							//需要将网格补齐
							Widgets.view.updateGridGraph();
							return;
						}
						//放下容器时，容器自动对齐
						var _position = Widgets.view.autoPositionGrid(event, $this);
						var chartType = helper.attr("chartType");
						helper.remove();

						/*
						 * param1：$this 当前容器父对象
						 * param2：_position 当前图形容器将要生成的坐标信息
						 * param3：chartType 当前容器图形类型
						 * param4: contanierId 如果不传，会自动生成
						 *
						 * 自动生成容器
						 *
						 * return 当前容器jQuery对象
						 */
						var $oneself = Widgets.view.packageContainer($this, _position, chartType);

						//检测当前容器是否和已存在的容器发生重叠
						Widgets.view.checkContainerOverlap($oneself);

						//如果发生重叠
						var $siblings = $oneself.siblings("div[id!='gridBg']");
						if ($siblings.hasClass("container-error")) {
							//获得最后一个元素的top，排除自己
							var lastTop = Widgets.view.getLastBottom($oneself);
							//置底
							$oneself.animate({
								top: lastTop
							}, 500, function() {
								Widgets.view.updateGridGraph();
							});
							//去除错误标识
							setTimeout(function() {
									$siblings.removeClass("container-error");
								}, 500)
								//滚动条自动置底
							$this.animate({
								scrollTop: lastTop - 21
							}, 500);
						}

						//调整画布大小
						Widgets.view.updateGridGraph();

						//为容器添加拖动和改变大小的特效
						Widgets.view.installWidgetsDraggableAndResize();
					}
				});
			},
			//包装容器
			packageContainer: function($this, _position, chartType, contanierId,hasRight) {
				var id = contanierId || 'container_' + (new Date()).getTime();
				var chartClassType = chartType.split('-')[0];
				$this.append($('<div></div>', {
					'id': id,
					'chartType': chartType,
					'class': contianerClass(chartClassType),
					'css': {
						position: 'absolute',
						left: _position.left,
						top: _position.top ,
                        transform : 'translateZ(0)'
					},
                    'html': containerTools(chartClassType)
				}));

				//文本、指标卡组件容器class变更 gaoya 20161117
				function contianerClass(chartClassType){
					switch(chartClassType){
						case "text":
							return "container allow editor-container";
							break;
						case "indicator":
							return "container allow indicator-container";
							break;
						default:
							return "container allow";
					}
				};

				function containerTools(chartClassType) {//更改文本、指标卡对应工具栏等  gaoya 20161215
					switch(chartClassType){
						case "text":
							return '<div class="chart '+chartClassType+'"></div>';
							break;
						case "indicator":
							return '<div class="dimAttrSettingPanel" style="display:none"></div><div class="chart"><i class="iconfont icon-' + chartClassType + ' exp"></i></div>';
							break;
						default:
							return '<div class="tools"></div><div class="breadcrumbs"></div><div class="chainInfo"></div><div class="dimAttrSettingPanel" style="display:none"></div><div class="chart"><i class="iconfont icon-' + chartClassType + ' exp"></i></div>';
					};
				}

				var $container = $("#" + id);

				//开始装载目前支持的组件
				//1.echart图形
				//2.表格
				//3.KPI文本
				//4.第三方插件(进度条、水滴图等)
				//Box.Widgets.plugins

				//寻找对应图形的plugin组件
				Widgets.currentPlugin = Widgets.control.getPluginByType(chartClassType);

				if (!Widgets.currentPlugin) {
					log('没有找到 ' + chartClassType + ' 对应的组件,请检查是否注册组件！');
				} else {
					//组件初始话事件
					Widgets.currentPlugin.init();
					//装载对应组件的工具栏
                    var pageType = (typeof _RSDFGHJJKK) === "undefined" ? "preview":"container";
                    var tableType = $container.attr("charttype");
                    if("table-detail" == tableType){
                        tableType = 0;
                    }else if("table-pivot" == tableType){
                        tableType = 1;
                    }else{
                        tableType = 0;  //默认值
                    }
					//log(Widgets.currentPlugin.contanier.getTools(pageType));
					$(".tools", $container).append(Widgets.currentPlugin.contanier.getTools(pageType,tableType));
					//对特定用户放开数据探索权限 gaoya 20161008
					if(!hasRight){
						$("div.tools>div.discovery").remove();
					}

					//悬浮提示
					$container.find('.tools .chart-icon').poshytip({
						className: 'tip-twitter',
						showTimeout: 100,
						alignTo: 'target',
						offsetY: -28,
						offsetX: 12,
						alignX: 'left'
					});

					//装载对应的小面板
					var $dimAttrSettingPanel = $(Widgets.currentPlugin.contanier.settingPanel);
					$(".dimAttrSettingPanel", $container).append($dimAttrSettingPanel);

					Bace.autoScroll($("#" + id + " .panel"), {
						'cursorcolor': '#5489A9'
					});
				}
				//示例图自适应
				setTimeout(function() {
					Widgets.view.resizeTempCharts($container);
				}, 100)

				//初始化 容器配置信息
				$container.data("option", {
					//当前容器的id
					el: id,
					//容器是否初始化
					isInit: false,
					//容器类型
					chartType: chartClassType,
					config: {
						plugins: Widgets.currentPlugin.type,
						build: {},
						designPanel: {},
						dataPanel: {}
					}
				})
				return $container;
			},
			//判断scrollWidth，scrollHeight是否发生变化，如果发生变化，则更改画布大小
			updateGridGraph: function() {
				var $this = jQuery("#tableChartPanel");
				var scrollWidth = $this.get(0).scrollWidth;
				var scrollHeight = $this.get(0).scrollHeight;
				var original_scrollWidth = $this.data("scrollWidth") || $this.width();
				var original_scrollHeight = $this.data("scrollHeight") || $this.height();

				//log("scrollWidth:" + scrollWidth);
				//log("scrollHeight:" + scrollHeight);
				//log("original_scrollWidth:" + original_scrollWidth);
				//log("original_scrollHeight:" + original_scrollHeight);
				//画布
				var $GridGraphBg = $this.find("#gridBg");
				if (scrollWidth > original_scrollWidth) {
					scrollWidth = scrollWidth + 20;
					$GridGraphBg.width(scrollWidth);
					$this.data("scrollWidth", scrollWidth)
				}
				if (scrollHeight > original_scrollHeight) {
					scrollHeight = scrollHeight + 20;
					$GridGraphBg.height(scrollHeight);
					$this.data("scrollHeight", scrollHeight);
				}
			},
			//自适应示例图
			resizeTempCharts: function($helper) {
				var _tempPanel = $helper.find(".iconfont.exp"),
					width = $helper.width(),
					height = $helper.height(),
					svgWidth = _tempPanel.width(),
					svgHeight = _tempPanel.height();
				_tempPanel.css({
					"transform": "scale(" + Math.min((height / 200), (width / 200)) + ")",
					"top": function() {
						return (height - svgHeight) / 2
					},
					"left": function() {
						return (width - svgWidth) / 2
					}
				})
			},
			//调用各自的自适应方法
			resizeContainer: function(option) {
				Widgets.control.getPluginByType(option.chartType).contanier.resize.reisze(option.el);
			},
			getLastBottom: function($oneself) {
				var top = 0;
				if($oneself){
					$("#tableChartPanel .container").not("#" + $oneself.attr("id")).each(function() {
						var _top = $(this).position().top + $(this).parent().scrollTop() + $(this).height() + 20;
						if (top < _top) {
							top = _top;
						}
					})
				}else{
					$("#tableChartPanel .container").each(function() {
						var _top = $(this).position().top + $(this).parent().scrollTop() + $(this).height() + 20;
						if (top < _top) {
							top = _top;
						}
					})
				}
				return Math.round(top / 20) * 20 + 10;
			},
			getLastTop: function($oneself) {
				var topArray = [];
				var $compare = $oneself ? jQuery("#tableChartPanel .container").not("#" + $oneself.attr("id")) : jQuery("#tableChartPanel .container");
				$compare.each(function() {
					var _top = $(this).position().top + $(this).parent().scrollTop() + 20;
					topArray.push(_top)
				})
				return Math.min.apply(null, topArray);
			},
			getFirstLeft: function() {
				var leftArray = [];
				var $compare = jQuery("#tableChartPanel .container");
				$compare.each(function() {
					leftArray.push($(this).position().left + $(this).parent().scrollLeft())
				})
				return Math.min.apply({}, leftArray);
			},
			getLastRight: function($oneself) {
				var right = 0;
				var $compare = $oneself ? jQuery("#tableChartPanel .container").not("#" + $oneself.attr("id")) : jQuery("#tableChartPanel .container");
				$compare.each(function() {
					var _right = $(this).position().left + $(this).parent().scrollLeft() + $(this).width() + 20;
					if (right < _right) {
						right = _right;
					}
				})
				return Math.round(right / 20) * 20 + 10;
			},
			bindEvent: {

				togglePanel: function() {

					//绑定关闭/打开筛选区域
					jQuery("#layout_body_title_panel  .closeFilter").on('click', function() {
						myLayout.center.children.layout1.center.children.layout1.toggle('north');
						jQuery(this).find("div:eq(0)").toggleClass('fa-caret-up').toggleClass('fa-caret-down');
					})

				},
				contanierTools: function() {
					$("#download").on('click', function() {
						//如果没有手机，进入填写手机的页面
						if(report_config.smsCaptcha ==1 &&( report_config.mobileNum=="" || report_config.mobileNum ==null)){
							window.open(Bace.handleUrlParam('/platform/sysmanage/safety/bind-mobile-page'))
							return;
						}
						$.dialog({
							title: '下载数据文件',
							lock: true,
							resize: true,
							width: 700,
							height: 318,
							padding: '0px 0px',
							content: '<iframe id="mainfrm" frameBorder="0" width="100%" border="0" height="100%" src="'+Bace.handleUrlParam(webpath+'/platform/download/to-download')+'"></iframe>',
						    cancel: function () {
						    	return $("#mainfrm")[0].contentWindow.cancel()
						    },
							ok: function () {

								var result =  $("#mainfrm")[0].contentWindow.sure();
								if(result.flag){
									//$("td[field='A0']:eq(0) >div:eq(0)").width($("td[field='A0']:eq(0)").width()-10)
//									$("#tableChartPanel .container .panel.datagrid .datagrid-cell").each(function(){
//										  var $this = $(this);
//										  log($this.width())
//										  $this.css('width',$this.width())
//									})
									jQuery('.actGotop').hide();

									//设置tabe的宽度
									var $els = $("#tableChartPanel .container");
									$els.each(function(i,v){
										var $this = $(v);
										var option = $this.data("option");
										if(option.chartType == 'table'){
											$this.find("td[field]>div").each(function(){
											   $(this).width($(this).width())
										    })
										}
									});
									if(result.type=="pic"){
										Widgets.view.downPic();
									}else if(result.type=="ppt"){
										Widgets.view.downPPT();
									}
								}else{
									return false;
								}
						    }

						});

					});

					//邮件推送功能
					jQuery("#Email").bind("click",function(){
						Widgets.view.getThumbURL(function(thumbURL){
							var formTemp = $("<form></form>",{
								"method":"post",
								"action":Bace.handleUrlParam(webpath+'/platform/dataview/to-email'),
								"target": "_blank",
								"html": "<input name='reportId' value='" + Box.main.reportId + "'/>"+
								        "<input name='img' value='" + thumbURL + "'/>"
							});
							$('body').append(formTemp);
							formTemp.submit();
							$(formTemp).remove();
						});
						//window.open(Bace.handleUrlParam(webpath+'/platform/dataview/to-email')+"?reportId="+Box.main.reportId)
					});

					//关闭指标维度小面板
					//datagrid覆盖了.chart
					jQuery("#tableChartPanel").on('click', '.container .chart,.container .panel.datagrid', function() {
						var $this = jQuery(this);
						var $container = $this.parents('.container');
						var $dimAttrSettingPanel = $container.find(".dimAttrSettingPanel");
						//快捷关闭指标维度小面板
						if ($dimAttrSettingPanel.is(":visible")) {
							$dimAttrSettingPanel.hide('slide');
						}
					});

					//打开本身的指标维度小面板
					jQuery("#tableChartPanel").on('click', '.chart-icon.openSelfDimAttr', function() {
						var $container = jQuery(this).parents('.container');

						var chartType = $container.data("option").chartType;
						//开始渲染小面板
						var $dimAttrSettingPanel = Widgets.control.getPluginByType(chartType).contanier.renderSettingPanel($container);
						if ($dimAttrSettingPanel.is(':hidden')) {
							$dimAttrSettingPanel.show('slide');
						} else {
							$dimAttrSettingPanel.hide('slide');
						}
					});

					//文件探索按鈕功能
					jQuery("#tableChartPanel").on('click', '.chart-icon.discovery', function() {
						var reportId = _RSDFGHJJKK;
						var option = jQuery(this).parents('.container').data("option");
						var el = option.el;
						window.open(Bace.handleUrlParam('/platform/dataview/edit') + '?reportId=' + reportId + "&chartId=" + el);
					});

                    //TODO 表格下载 shaojs 20161114
                    jQuery("#tableChartPanel").on('click', '.chart-icon.tabledownload', function() {
                        var option = jQuery(this).parents('.container').data("option");
                        //console.log(option);
                        if(!option.isInit) return;
                        var url = Bace.handleUrlParam("/platform/dataview/down-table-data");
                        url = url+"?" + $.param(option.config.build.dataParams);
                        Bace.downloadbyfloor(url);
                    });

                    //表格行列互换 shaojs 20161114
                    jQuery("#tableChartPanel").on('click', '.chart-icon.xy2yx', function() {
                        var option = jQuery(this).parents('.container').data("option");
                        //初始化后的表格才可以执行互换
                        if(option.isInit){
                            var dimAttr = JSON.parse(option.config.build.dataParams.dimAttrJsonStr);
                            var exchangeTemp = dimAttr.rowsData;
                            dimAttr.rowsData = dimAttr.colsData;
                            dimAttr.colsData = exchangeTemp;
                            exchangeTemp = null;
                            option.config.build.dataParams.dimAttrJsonStr = JSON.stringify(dimAttr);
                            Widgets.control.getPluginByType(option.chartType).apply(option,true);
                            $(this).toggleClass("checked");
                        }
                    });

                    //分层下钻返回
					jQuery("#tableChartPanel").on('click', '.breadcrumbs>a', function() {
						var level = jQuery(this).parent(".breadcrumbs").find("a").index(this);
						var container = jQuery(this).parents('.container');
						var chartDiv = container.find(".chart")[0];
						jQuery(chartDiv).EBuilder("undrill",level);
					});
                    //图表关联返回
                    jQuery("#tableChartPanel").on('click', '.chainInfo .j_unchainChart', function() {
                        var container = jQuery(this).parents('.container');
                        if(container.find(".chart:visible").length){
                            var chartDiv = container.find(".chart")[0];
                            jQuery(chartDiv).EBuilder("unchainChart");
                        }else{
                            Box.Widgets.plugins.table.unchainChart(container);
                        }
                    });
				}
			},
			showLoading:function($container){
				if(typeof(Spinner2)!=='undefined'){
					var $load = jQuery('<div></div>',{
						"class":"bi-confirm loadingBg"
					});
					$container.spin(loadingOption);
					$container.append($load);
				}
				$container.data("isLoading",true);
			},
			hideLoading:function($container){
				var $bg = $container.find(".loadingBg");
				if($bg.length == 0)return;
				if(typeof(Spinner2)!=='undefined'){
					$container.spin('close');
					$bg.remove();
				}
				$container.data("isLoading",false);
			},
			showTip:function(tipData,$container){
				tipData.titleShow = tipData.titleShow||true;
				var confirm = '<div id="${id}" failType="${failType}" class="bi-confirm ${className}">' + '	<div class="confrim-text" style="letter-spacing: 1px;text-align:center">' + '  {{if titleShow==true}} <span style="font-size: 26px;">提示 </span>{{/if}}<br/>{{html msg}}' + '	</div>' + '	<div class="btn-group">{{html button}}' + '	</div>' + '</div>';
				$.tmpl(confirm, tipData).appendTo($container);
			},
			hideTip:function(id){
				jQuery("#"+id).remove();
			},
			downPic:function(){

				//先把筛选条件打开，防止用户关闭
				jQuery("body").append(jQuery("<div>",{
					'class' : 'screenClass screenCapture ',
					'html':''
				}));
				setTimeout(function(){
					jQuery(".screenClass").removeClass("screenCapture").addClass("screen-img");
					setTimeout(function(){

						//将关闭筛选条件的按钮隐藏
						jQuery("#layout_body_panel .closeFilter,#filterPanel .search").hide();
						jQuery(".screenClass").append(jQuery("<div>",{
							'class' : 'load',
							'html'  : '<img src="data:image/png;base64,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">'
						}));

						//拼接图片
						Widgets.view.getThumbURL(function(thumbURL){
			//				log(thumbURL)
							//将关闭筛选条件的按钮恢复
							jQuery("#layout_body_panel .closeFilter,#filterPanel .search").show();
							jQuery("#downPic,.screenClass").remove();
							var reportId = Box.main.reportId;
							var fileName = Box.main.reportName;
							var imgBaseStr = thumbURL;
							jQuery("<form>",{
								"id":"downPic",
								"method":"post",
								"action":Bace.handleUrlParam("/platform/dataview/downImageFile"),
								"target":"_self",
								"html":"<input name='reportId' type='hidden' value='"+reportId+"'/><input name='fileName' type='hidden' value='"+fileName+"'/><input name='imgBaseStr' type='hidden' value='"+imgBaseStr+"'/>"
							}).appendTo("body");
							jQuery("#downPic").submit();
							var $els = $("#tableChartPanel .container");
							$els.each(function(i,v){
								var $this = $(v);
								var option = $this.data("option");
								if(option.chartType == 'table'){
									$this.find("td[field]>div").each(function(){
									   $(this)[0].style.width='';
								    })
								}
							})
						})

					},2000)
				},600)
			},
			getThumbURL:function(callback){

				//布局面板
				var $tableChartPanel = jQuery("#tableChartPanel");

				jQuery("#thumb_canvas").remove();

				var lastBottomArray = [];

				jQuery("#tableChartPanel .container").each(function() {
					var $this = $(this);
					lastBottomArray.push(($this.position().top>0?$this.position().top:$this.parent().scrollTop()+$this.position().top) + $this.height() + 10);
				})

				//从画板中获得最后一个图形的纵向结束位置=》lastBottom
				var lastBottom = Math.max.apply({},lastBottomArray) + 10;

				//获得筛选面板的高度
				var filterPanel_height = jQuery("#filterPanel").height() + jQuery("#layout_body_title_panel").height()+jQuery('.share-panel').height()+1;
				var body_width = jQuery("body").width();
				if(!(Widgets.module.isHaveFilter && jQuery("#filterPanel").css("display") != "none"))
				{
					filterPanel_height =50;
				}
				html2canvas(document.getElementById("tableChartPanel"), {
					proxy: webpath+"/ImageServlet",
					onrendered: function(canvas) {
						 var sourceX = 0;
						 var sourceY = filterPanel_height;

						 var image = new Image();
							 image.src = canvas.toDataURL("image/png");
							 image.onload = function(){
								var width = body_width;
								var height = lastBottom + filterPanel_height;

								var newCnvs= document.createElement('canvas');
									newCnvs.setAttribute("id","thumb_canvas");
									newCnvs.style.display = "none"
									newCnvs.width=width;
									newCnvs.height=height;
									document.body.appendChild(newCnvs);

								var canvas2 = document.getElementById('thumb_canvas');
								var context = canvas2.getContext('2d');
								context.drawImage(image, sourceX, sourceY);
								jQuery(".screenClass").remove();
								if((Widgets.module.isHaveFilter && jQuery("#filterPanel").css("display") != "none")){
									html2canvas(document.body, {
										onrendered: function(canvas) {
										     var image2 = new Image();
										 	 image2.src = canvas.toDataURL("image/png");
										 	 context.drawImage(image2, sourceX, 0);
										 	 setTimeout(function(){
										 		callback(canvas2.toDataURL("image/png"));
										 	 },200)
										},
										width:body_width,
										height:filterPanel_height
									})
								}
								else if(jQuery('.share-panel').length>0)
								{
									html2canvas(document.body, {
										onrendered: function(canvas) {
										     var image2 = new Image();
										 	 image2.src = canvas.toDataURL("image/png");
										 	 context.drawImage(image2, sourceX, 0);
										 	 setTimeout(function(){
										 		callback(canvas2.toDataURL("image/png"));
										 	 },200)
										},
										width:body_width,
										height:filterPanel_height
									})
								}
								else{
									callback(canvas2.toDataURL("image/png"));
								}
							}
					},
					width:body_width,
					height:lastBottom + filterPanel_height
				})
			},
			downPPT:function(){
				//先把筛选条件打开，防止用户关闭
				jQuery("body").append(jQuery("<div>",{
					'class' : 'screenClass screenCapture ',
					'html':''
				}));
				setTimeout(function(){
					jQuery(".screenClass").removeClass("screenCapture").addClass("screen-img");
					setTimeout(function(){

						//将关闭筛选条件的按钮隐藏
						jQuery("#layout_body_panel .closeFilter,#filterPanel .search").hide();
						jQuery(".screenClass").append(jQuery("<div>",{
							'class' : 'load',
							'html'  : '<img src="data:image/png;base64,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">'
						}));


						Widgets.view.getThumbURL(function(thumbURL){
							var $els = $("#tableChartPanel .container");
							var thumbURLArray = [];
							jQuery("#layout_body_panel .closeFilter,#filterPanel .search").show();
							jQuery(".screenClass").remove();
							$els.each(function(i,v){
								var $this = $(v);
								jQuery("#pptCanvas").remove();

								var option = $this.data("option");

								if(option.chartType == 'table'){
									var newCnvs= document.createElement('canvas');
									newCnvs.setAttribute("id","pptCanvas");
									newCnvs.style.display = "none";
									newCnvs.width=$this.outerWidth();
									newCnvs.height=$this.outerHeight(true);
									document.body.appendChild(newCnvs);
									var canvas = document.getElementById('pptCanvas');
									var context = canvas.getContext('2d');

									var imageObj = new Image();
									var Y = parseInt($this.css("top").replace("px",""));
									//获取$(".filter-panel")的height
									var $filter = jQuery(".filter-panel");
									var filterHeight = $filter.height();
									var filterMinHeight = $filter.css("min-height").replace("px","");
									if(filterHeight == 0){
										// 无筛选条件
										Y = Y + 50;
									}else{
										Y = Y +130+ (filterHeight-filterMinHeight);
									}
									var X = $this.offset().left;
									imageObj.onload = function() {
										  // draw cropped image
										  context.drawImage(imageObj, X,Y,$this.outerWidth(),$this.outerHeight(true),0,0, $this.outerWidth(),$this.outerHeight(true));
										  thumbURLArray.push(canvas.toDataURL("image/png"))
									};
									imageObj.src = thumbURL;
								}else{
									thumbURLArray.push($(".chart",$this).EBuilder('getInstanceByDom').getDataURL({
										backgroundColor:$this.css("backgroundColor")
									}));

								}

							});

							var timer = setInterval(function(){
								$els = $("#tableChartPanel .container");
								if(thumbURLArray.length != 0 && thumbURLArray.length == $els.length){
									var arr = thumbURLArray.join('&&');
									jQuery("#downPPT").remove();
									var reportId = Box.main.reportId;
									var fileName = Box.main.reportName;
									jQuery("<form>",{
										"id":"downPPT",
										"method":"post",
										"action":Bace.handleUrlParam("/platform/dataview/download-ppt-file"),
										"target":"_self",
										"html":"<input name='reportId' type='hidden' value='"+reportId+"'/><input name='fileName' type='hidden' value='"+fileName+"'/><input name='pptStr' type='hidden' value='"+arr.toString()+"'/>"
									}).appendTo("body");
									jQuery("#downPPT").submit();
									clearInterval(timer);
									var $els = $("#tableChartPanel .container");
									$els.each(function(i,v){
										var $this = $(v);
										var option = $this.data("option");
										if(option.chartType == 'table'){
											$this.find("td[field]>div").each(function(){
											   $(this)[0].style.width='';
										    })
										}
									})
								}
							},500)
					   })

					},2000)
				},600)
			},
			gotop:function(){
				//返回顶部
				var $obj = jQuery('#tableChartPanel');
				$obj.scroll(function() {
					if ($obj.scrollTop() >= 100) {
						jQuery('.actGotop').fadeIn(300);
						jQuery(".report-panel").addClass("suspension");
					} else if($obj.scrollTop() < 90) {
						jQuery('.actGotop').fadeOut(300);
						jQuery(".report-panel").removeClass("suspension");
					}
				});
				jQuery('.actGotop').click(function() {
					$obj.animate({
						scrollTop: '0px'
					}, 800);
				});
			},
			//根据全局配置开关复制和水印功能
			unCopy : function(openWaterflag){
				if(report_config.copyFlag == 1){
					jQuery(document).bind("contextmenu",function(e){
				          return false;
				    });
					jQuery(document).bind("copy",function(e){
						return false;
					});
				}
				if(report_config.waterFlag == 1 && openWaterflag){
					var bottom = Widgets.view.getLastBottom();
					jQuery('#tableChartPanel').append(jQuery("<div>",{
						'id' : 'water',
						'css' : {
							'position' : 'absolute',
							'width' : '100%',
							'top' : '0',
							'height' : bottom+"px",
							'background' : 'url('+webpath+'/WaterImageServlet)',
							'opacity':'.3',
							'z-index':'-1'
						}
					}))
				}
			},
			//加载url导航信息
			containerUlrGroup:function(lastTop){
				$("#tableChartPanel").append('<div id="layout_body_url_panel" class="container-url" style="background:rgb(248, 252, 255);position:absolute;top:'+lastTop+'px"><div id="urlPanel" class=" urlpaths_name_left"></div></div>');
				var defaultPicture="data:image/png;base64,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";

				var $urlPanel=$("#urlPanel");
				var urlGroupWidth;
				var urlLength=Box.main.urlMenuInfo.length;
				var $urlPanelPosition=Box.main.urlMenuInfo[urlLength-1].position;
				//  将url菜单放入数组中
				var $urlmenusList='';var $urlmenus=[];var i=0;
				$.map(Box.main.urlMenuInfo,function($e){/*console.log($e);*/
					if($e.reportUrlInfo) {
						if ($e.reportUrlInfo.length != 0) {
							$urlmenusList += '<div class="urlPaths"><div class="urlpaths_name urlnamedefine_' + (++i) + '"><b class="fa fa-bars url_fa"></b><a>' + $e.menuName + '</a></div><ul class="urlmenus">';
							$.map($e.reportUrlInfo, function ($i) {
								$urlmenusList += '<li class="urlmenulist"><a href="' + $i.urlPathDetail + '" target="_blank"><img class="urlpicture" src="' + ($i.urlPathPicture || defaultPicture) + '">' + $i.urlPathName + '</a></li>';
							});
							$urlmenusList += '</ul></div>';
						} else {
							$urlmenusList += '<div class="urlPaths"><div class="urlpaths_name urlnamedefine_' + (++i) + '"><b class="fa fa-bars url_fa"></b><a>' + $e.menuName + '</a></div></div>';
						}
					}
					$urlmenus.push($urlmenusList);
					$urlmenusList="";
				})
				$urlPanel.append($urlmenus.join(""));
				if($urlPanelPosition==="middle"){
					urlGroupWidth=100/(urlLength-1);
					$("#urlPanel>div.urlPaths").css("width",urlGroupWidth+"%");
				}else if($urlPanelPosition=="right"){
					$urlPanel.removeClass("urlpaths_name_left").addClass("urlpaths_name_"+$urlPanelPosition);
					$("#urlPanel>div.urlPaths").css({"float":"right",
						"borderRight":"none",
						"borderLeft":"1px solid #ddd"});
				}

				$("#urlPanel").on("click",".urlpaths_name>a",function(e){
					$(e.target).parent().siblings().toggleClass("active");
				});
				$("body").click(function(e){
					var $e=$(e.target);
					if(!($e.parent().hasClass("urlpaths_name"))){
						$("#urlPanel ul.urlmenus.active").removeClass("active");
					}
				});
			}
		};
		return Widgets.control;
	});