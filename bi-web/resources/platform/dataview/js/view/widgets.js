define(['bace', 'view/box', 'view/layout', 'view/widgets/filter', 'view/widgets/property', 'view/widgets/urlPathPanel','view/widgets/plugins/table/table', 'view/widgets/plugins/echarts/echarts','view/widgets/plugins/text/text','view/widgets/plugins/indicator/indicator','view/widgets/plugins/echarts/tpl','view/widgets/plugins/default','view/component/DataInfoUtil','view/eventBinder'],
	function(Bace, Box, Layout, Filter, Property, UrlPathPanel, TablePlugin, EChartsPlugin,TextPlugin,IndicatorPlugin,Tpl,Deftpl,DataInfoUtil) {
		var Widgets = {
			//当前图形的类型的组件对象
			currentPlugin: ''
		};
		Widgets.module = {

		};
		var loadingOption = {
			  lines: 13, // The number of lines to draw
			  length: 7, // The length of each line
			  width: 4, // The line thickness
			  radius: 10, // The radius of the inner circle
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
				log('初始化图表区域')
				Widgets.view.init();
				Filter.init();
				//打开筛选面板
				//Layout.toggleFilterPanel('open');
				//更新画布尺寸
				Box.Widgets.updateGridGraph = Widgets.view.updateGridGraph;
				Box.Widgets.showLoading = Widgets.view.showLoading;
				Box.Widgets.hideLoading = Widgets.view.hideLoading;
				//挂载显示提示框方法
				Box.Widgets.showTip = Widgets.view.showTip;
				//挂载隐藏提示框方法
				Box.Widgets.hideTip = Widgets.view.hideTip;
				Box.Widgets.start = Widgets.control.start;

				//挂载生成单图缩略图方法
				Box.Widgets.getThumbSingleURL = Widgets.view.getThumbSingleURL;
				//挂载获得全图缩略图方法
				Box.Widgets.getThumbURL = Widgets.view.getThumbURL;
				//挂载作图区域的url导航条 gaoya 20160910
				Box.Widgets.openUrlPanel = Widgets.view.openUrlPanel;
			},
			getPluginByType:function(type){
				if (['pie', 'bar', 'barMix', 'line', 'radar', 'funnel', 'gauge', 'map','treemap', 'scatter','heatmap','heatmap1','effectScatter'].indexOf(type) > -1) {
					return Box.Widgets.plugins["echarts"];
				} else {
					return  Box.Widgets.plugins[type];
				}
			},
			start:function(type){
				//收集页面控件的布局参数
				if(type == 'collect'){
					var _contaniers = [];
					var firstLeft = Widgets.view.getFirstLeft()-10;
					var totalWidth = Widgets.view.getLastRight()-firstLeft;

					jQuery("#tableChartPanel .container").each(function(){
						var $this = $(this);
                        var option = $this.data("option");
                        var menudata = $this.data("menuData");
                        //mapType 不能为undefined 否则后台保存的json有问题,修复一下 shaojs 201612131505
                        option.mapType = option.mapType || "";

                        if($(".chart.text",this)[0]){
                            var textStr=$(".text-editor.edui-body-container",this).html();
                            option.config.build.textStr = textStr;
							$(".edui-toolbar",this).css("display","none");
                        }
						//log(option);
						if(option){
							var firstTop = Widgets.view.getLastTop();
                            var __container = {
                                option:option,
                                layout:{
                                    "top":$this.css("top"),
                                        "left":$this.css("left"),
                                        "width":$this.css("width"),
                                        "height":$this.css("height"),
                                        "_left":($this.css("left").replace('px','')-firstLeft)/totalWidth *100+ "%",
                                        "_width":(/*option.chartType=="indicator"||*/option.chartType=="text")?$this.css("width"):$this.css("width").replace('px','')/totalWidth *100+ "%",
                                        "border-width":$this.css("border-width"),
                                        "border-color":$this.css("border-color"),
                                        "background":$this.css("background"),
                                        "box-shadow":$this.css("box-shadow"),
                                        "border-radius":$this.css("border-radius")
                                }
                            };
                            if(menudata){
                                __container.menuData = menudata;
                            }
							_contaniers.push(__container);
						}
					});

					var _filters = Filter.dataStart("collect");
					// add by wangle 20160810 start
					var config = {
						widgets:_contaniers,
						filters:_filters,
						//opers:jQuery("#openOpera").prop('checked'),
						openDownload:jQuery("#openDownload").prop('checked'),
						tplId:Box.main.tplId||"",
					};
					if(jQuery("#openSendEmail")[0]){
						config.openSendEmail=jQuery("#openSendEmail").prop('checked');
					}
					// add by wangle 20160810 end

					//收集模板水印开关 shaojs 20160817
					if(jQuery("#openWaterflag")[0]){
						config.openWaterflag= !jQuery("#openWaterflag").prop('checked');
					}

					//探索图表保存的时候不需要保存筛选条件
					if(discovery == '1'){
						config.filters=[];
                        config.widgets[0].option.config.build.dataParams.filterJsonStr="";
					}
					return config;
				}else if(type == 'render'){
					var config = arguments[1];
					var widgets = config.widgets;
					var filters = config.filters;
					//var opers = config.opers;
					// add by wangle 20160810 start
					var openSendEmail = config.openSendEmail;
					var openDownload = config.openDownload;
					// add by wangle 20160810 end
					// 水印开关
					var openWaterflag = !config.openWaterflag;

					//初始化查询条件 shaojs 20160817
					var filterJsonStr = $.toJSON(filters);

					Filter.dataStart(filters);

					/*//初始化操作面板
					if(opers){
						jQuery("#openOpera").prop('checked',true).change();
					}*/
					for(var i = 0,n= widgets.length;i<n;i++){
						var widget = widgets[i];
						var option = widget.option;
						var layout = widget.layout;

						var chartId = widget.chartId;

                        //表格菜单数据挂载 addby shaojs 20161208
                        var menuData = widget.menuData;

						var $contanier = Widgets.view.packageContainer($("#tableChartPanel"), {
							top:layout["top"],
							left:layout["left"]
						}, option.chartType,option.el);

						$contanier.css({
							"width":layout["width"],
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
								Widgets.control.getPluginByType(option.chartType).apply(option,true,true);
							},0)
						})(option);

					}
					setTimeout(function(){
						//为容器添加拖动和改变大小的特效
						Widgets.view.installWidgetsDraggableAndResize();
						Widgets.view.updateGridGraph($("#tableChartPanel"));
						//初始化查询面板
						if(filters){
							jQuery("#openFilter").prop('checked',true).change();
						}
						//add by wangle  20160810 start
						//初始化邮件推送面板
						if(openSendEmail){
							jQuery("#openSendEmail").prop('checked',true).change();
						}
						//初始化下载面板
						if(openDownload){
							jQuery("#openDownload").prop('checked',true).change();
						}
						// add by wangle 20160810 end
						// 初始化水印开关 shaojs 20160817
						jQuery("#openWaterflag").prop('checked',openWaterflag).change();

					},10)

				}else if(type == 'renderTpl'){
					var tplJSONArray = arguments[1];
					for(var i = 0,n= tplJSONArray.length;i<n;i++){
						var tpl = tplJSONArray[i];
						var layout = tpl.layout;
						var config = tpl.config;
						var $contanier = Widgets.view.packageContainer($("#tableChartPanel"), {
							top:layout["top"],
							left:layout["left"]
						}, config.chartType);

						$contanier.css({
							"width":layout["width"],
							"height":layout["height"],
						});
						Tpl.rendTpl($contanier,config);
						setTimeout(function(){
							//为容器添加拖动和改变大小的特效
							Widgets.view.installWidgetsDraggableAndResize();
							Widgets.view.updateGridGraph($("#tableChartPanel"));
						},10)
					}
				}
				if(!!sessionStorage.imgSrc){
					$(".container").css({"background-image":"url("+sessionStorage.imgSrc+")","background-size":"100% 100%","background-repeat":"no-repeat"})
				}
			}

		};

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

						//如果不是从头部拖拽下来，则中断逻辑(头部拖拽的helper有hp-container这个class)
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

						var defTpl = Deftpl[chartType];
						if(_.keys(defTpl).length > 0){
                            Tpl.rendTpl($oneself,defTpl);
                        }

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
								}, 500);
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
			packageContainer: function($this, _position, chartType, contanierId) {
				var id = contanierId || 'container_' + (new Date()).getTime();
				var chartClassType = chartType.split('-')[0];
				var chartChild = chartType.split('-')[1]||'';
				var mapType = chartType.split('-')[2]||'';
				$this.append($('<div></div>', {
					'id': id,
					'chartType': chartType,
					'class':contianerClass(chartClassType),
					'css': {
						position: 'absolute',
						left: _position.left,
						top: _position.top
					},
					'html':containerTools(chartClassType),
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

				function containerTools(chartClassType) {//更改文本、指标卡对应工具栏等  gaoya 20161117
					switch(chartClassType){
						case "text":
							return '<div class="tools"></div><div class="chart '+chartClassType+'"><i class="iconfont icon-' + chartClassType + ' exp"></i></div>';
							break;
						case "indicator":
							return '<div class="tools"></div><div class="dimAttrSettingPanel" style="display:none"></div><div class="chart"><i class="iconfont icon-' + chartClassType + ' exp"></i></div>';
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
                    var tableType = $container.attr("charttype");
                    if("table-detail" == tableType){
                        tableType = 0;
                    }else if("table-pivot" == tableType){
                        tableType = 1;
                    }else{
                        tableType = 0;  //默认值
                    }
					$(".tools", $container).append(Widgets.currentPlugin.contanier.getTools("main",tableType));
					//悬浮提示
					$container.find('.tools .chart-icon').poshytip({
						className: 'tip-twitter',
						showTimeout: 100,
						alignTo: 'target',
						offsetY: -28,
						offsetX: 12,
						alignX: 'left'
					});

					var $dimAttrSettingPanel = $(Widgets.currentPlugin.contanier.settingPanel);
					$(".dimAttrSettingPanel", $container).append($dimAttrSettingPanel);

					//更改指标卡组件大小 gaoya 20161117
					if(chartClassType=="indicator"){
						$container.css({"width":"259px","height":"179px"});
					}

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
					//容器是否初始化(在调用组件各自的apply方法成功时会设置isInit为true)
					isInit: false,
					//容器类型
					chartType: chartClassType,
					//小分类
					chartChild:chartChild,
					//地图类型
					mapType:mapType || "",
					config: {
						plugins: Widgets.currentPlugin.type,
						build: {},
						designPanel:{},
						dataPanel: {}
					}
				});

				return $container;
			},
			//装载容器拖动和调整大小事件
			installWidgetsDraggableAndResize: function() {
				jQuery("div.container").draggable({
					containment: "parent",
					handle: '.move',
					scroll: true,
					scrollSensitivity: 20,
					delay: 1,
					scrollSpeed: 20,
					grid: [20, 20],
					drag: function(event, ui) {

						//位置发生改变时，检测是否容器是否发生重叠
						Widgets.view.checkContainerOverlap($(this));
					},
					start: function(event, ui) {
						//开始拖动的时候将这个元素的z-index设置最高，防止拖拽的时候被覆盖
						ui.helper.addClass("ui-start-active-zindex");
						$(this).find('.tools .chart-icon').poshytip('disable');

					},
					stop: function(event, ui) {
						//检测容器中是否有不合法的元素，有则还原位置
						var $this = $(this),
							$siblings = $this.siblings("div[id!='gridBg']");
						if ($siblings.hasClass("container-error")) {
							$this.animate(ui.originalPosition, 300);
							$siblings.removeClass("container-error");
						}
						//还原z-index
						ui.helper.removeClass("ui-start-active-zindex");

						//容错机制
						var left = Math.round(parseInt($this.css("left").replace('px', '')) / 20) * 20 - 10;
						var top = Math.round(parseInt($this.css("top").replace('px', '')) / 20) * 20 - 10;
						$this.css({
							left: left,
							top: top
						});
						$this.find('.tools .chart-icon').poshytip('enable');
					}
				}).resizable({
					/*start: function(event, ui) {
						//每个组件的自适应大小方法不同，掉各组件的方法
						var chartType = $(this).attr("chartType");
						var option = $(this).data("option");
						if (option.isInit) {
							//表格拖拽的时候，需要将表格隐藏
						}
						ui.helper.addClass("ui-start-active-zindex").removeClass("allow");
					},*/
					grid: [20, 20],
					//delay:200,
					autoHide: true,
					containment: "parent",
					minWidth: 319,
					minHeight: 239,
					handles: 'all',
					start:function(event, ui){
						var $helper = jQuery(ui.helper);
						var option = $helper.data('option');
						var isInit = option.isInit;
						if (isInit) {
							Widgets.control.getPluginByType(option.chartType).contanier.resize.start(option.el);
						}
						ui.helper.addClass("ui-start-active-zindex").removeClass("allow");
					},
					resize: function(event, ui) {
						var $helper = jQuery(ui.helper);
						var option = $helper.data('option');
						var isInit = option.isInit;
						if (isInit) {
							//防止浏览器卡死
							//开始执行组件变大变小事件
							Widgets.view.resizeContainer(option);
						} else {
							Widgets.view.resizeTempCharts($helper);
						}
						//大小发生改变时，检测是否容器是否发生重叠
						Widgets.view.checkContainerOverlap($(this));
						//检测是否超过边界，容错机制
						//.....

						//指标卡组件拖拽样式重定义 gaoya 20161116
						if(option.chartType=="indicator"){
							$(this).resizable({
								minWidth:259,
								minHeight:139,
								/*maxWidth:319,
								maxHeight:239*/
							});
						};
					},
					//helper: "ui-resizable-helper",
					stop: function(event, ui) {
						//检测容器中是否有不合法的元素，有则还原大小(非法元素指和其他元素重叠的元素)
						var $this = $(this),
							$siblings = $this.siblings("div[id!='gridBg']");
						var $helper = jQuery(ui.helper);
						var option = $helper.data('option');
						var isInit = option.isInit;
						if ($siblings.hasClass("container-error")) {
							$this.animate(ui.originalSize, 50, function() {
								$this.animate(ui.originalPosition, 50);
								if (isInit) {
									//组件的自适应方法
									Widgets.view.resizeContainer(option);
								} else {
									Widgets.view.resizeTempCharts($helper);
								}
							});
							$siblings.removeClass("container-error");
						}
						if (isInit) {
							Widgets.control.getPluginByType(option.chartType).contanier.resize.stop(option.el);
						}
						//还原z-index
						$helper.removeClass("ui-start-active-zindex").addClass("allow");
						Widgets.view.updateGridGraph();
					}
				});
                //文本组件拖拽样式重定义
                if($("div.container").find("div.chart").hasClass("text")){
                    $("div.chart.text").parent().resizable({
                        minWidth: 420,
                        minHeight: 75
                    })
                };

			},
			//放下容器时，获得容器自动对齐的坐标
			autoPositionGrid: function(event, $this) {
				var left = event.pageX + $this.scrollLeft() - $this.offset().left - 76; //(76,76)鼠标的相对于容器的坐标
				var top = event.pageY + $this.scrollTop() - $this.offset().top - 76;
				left = left < 10 ? 10 : left;
				top = top < 10 ? 10 : top;
				return {
					left: Math.round(left / 20) * 20 - 10,
					top: Math.round(top / 20) * 20 - 10
				}
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
			//自适应容器的插件
			//调用各自的自适应方法
			resizeContainer: function(option) {
				Widgets.control.getPluginByType(option.chartType).contanier.resize.reisze(option.el);
			},
			//检测容器是否相交
			checkContainerOverlap: function($this) {
				//获得所有兄弟节点
				var $siblings = $this.siblings("div[id!='gridBg']");
				//获得当前拖动元素的4个点
				var _position = $this.position();
				var _x1 = _position.left,
					_y1 = _position.top,
					_x2 = _x1 + $this.width(),
					_y2 = _y1 + $this.height();

				$siblings.each(function() {
					var brother = $(this);
					var brother_position = brother.position();
					var x1 = brother_position.left,
						y1 = brother_position.top,
						x2 = x1 + brother.width(),
						y2 = y1 + brother.height();
					//检测容器是否相交
					if (((_x1 > x1 && _x1 < x2) || (_x2 > x1 && _x2 < x2)) && ((_y1 > y1 && _y1 < y2) || (_y2 > y1 && _y2 < y2)) ||
						(((x1 > _x1 && x1 < _x2) || (x2 > _x1 && x2 < _x2)) && ((y1 > _y1 && y1 < _y2) || (y2 > _y1 && y2 < _y2)))
					) {
						brother.addClass("container-error");
					} else {
						brother.removeClass("container-error");
					}
				});
			},
			getLastBottom: function($oneself) {
				var top = 0;
				jQuery("#tableChartPanel .container").not("#" + $oneself.attr("id")).each(function() {
					var _top = $(this).position().top + $(this).parent().scrollTop() + $(this).height() + 20;
					if (top < _top) {
						top = _top;
					}
				});
				return Math.round(top / 20) * 20 + 10;
			},
			getLastTop: function($oneself) {
				var topArray = [];
				var $compare = $oneself ? jQuery("#tableChartPanel .container").not("#" + $oneself.attr("id")) : jQuery("#tableChartPanel .container");
				$compare.each(function() {
					var _top = $(this).position().top + $(this).parent().scrollTop() + 20;
					topArray.push(_top)
				});
				return Math.min.apply(null, topArray);
			},
			getFirstLeft: function() {
				var leftArray = [];
				var $compare = jQuery("#tableChartPanel .container");
				$compare.each(function() {
					leftArray.push($(this).position().left + $(this).parent().scrollLeft())
				});
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
				});
				return Math.round(right / 20) * 20 + 10;
			},
			bindEvent: {

				togglePanel: function() {

					//绑定关闭指标面板
					jQuery("#layout_body_title_panel .closeAttr").on('click', function() {
						myLayout.toggle('west');
						jQuery(this).find("div:eq(0)").toggleClass('fa-caret-left').toggleClass('fa-caret-right');
					});

					//绑定全屏按钮
					jQuery("#layout_body_title_panel .fullScreen").on('click', function() {
						var $this = jQuery(this).find("div:eq(0)");
						if ($this.hasClass('fa-caret-down')) {
							Layout.toggleAllPanel('open');
						} else {
							Layout.toggleAllPanel('close');
						}
						$this.toggleClass('fa-caret-down').toggleClass('fa-caret-up');
					});

					//未完成，当容器所在画布区域滚动条到底，就自动增加画布高度
					$('#tableChartPanel').bind('scroll', function() {

					});

					//绑定关闭/打开筛选区域
					jQuery("#layout_body_title_panel  .closeFilter").on('click', function() {
						myLayout.center.children.layout1.center.children.layout1.toggle('north');
						jQuery(this).find("div:eq(0)").toggleClass('fa-caret-up').toggleClass('fa-caret-down');
					});

					//绑定全局筛选条件设置
					jQuery("#layout_body_title_panel #setGlobalFilter").on('click', function() {
						Filter.setGlobalFilter("add");
					});

				},
				contanierTools: function() {

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

					//点击画布，自动关闭属性框
					jQuery("#gridBg").click(function() {
						Property.close();
					});

					//点击容器内属性按钮，弹出属性框
					jQuery("#tableChartPanel").on('click', '.chart-icon.setting', function() {
						var option = jQuery(this).parents('.container').data('option');
						Property.toggle(option);
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

					//删除容器按钮
					jQuery("#tableChartPanel").on('click', '.chart-icon.removeSelfChart', function() {
						var $this = $(this);
						var $container = $this.parents('.container');
						Widgets.view.showTip({
							_id:"delPanel",
							titleShow:"false",
							msg: '确定删除？',
							button: '<div class="btn delChartTrue">确定</div><div class="btn delChartCanel">取消</div>'
						},$container);

						$("#delPanel .delChartCanel").click(function(){
							Widgets.view.hideTip("delPanel");
						});
						$("#delPanel .delChartTrue").click(function(){
							var $this = jQuery(this);
							var $container = $this.parents('.container');
							var id = $container.attr("id");
							var chartType = $container.data("option").chartType;
                            var dataParams = $container.data("option").config.build.dataParams;
							//dataParams为undefined的时候,dataId也是undefined
                            var dataId = dataParams && dataParams.dataId;
							Widgets.control.getPluginByType(chartType).destory(id);
							// 删除数据源时同步删除过滤条件(dataId不为undefined的时候才删除)
                            dataId && Filter.reomveGlobalFilter(dataId);

							$container.hide("fade", 500, function() {
								jQuery(this).remove();
							});
							//如果当前打开的面板是删除容器的，将之关闭
							if(Box.Property.isMyProperty && Box.Property.isMyProperty(id)){
								Property.close(true);
							}
						})
					});

                    /**
                     * author: zhull
                     * mby:shaojs 20161009
                     * desc:查看数据源按鈕功能,优先查看容器挂载的数据源,如果没有则查看当前全局数据源,如果都没有,则不动作
                    */
					jQuery("#tableChartPanel").on('click', '.chart-icon.viewdata', function() {
                        var $this = jQuery(this);
                        var $container = $this.parents('.container');
                        var dataParams = $container.data("option").config.build.dataParams;
                        //dataParams为undefined的时候,dataId也是undefined
                        var dataId = dataParams && dataParams.dataId;
                        var type = dataParams && dataParams.dataType;
                        //如果没有挂载到container上,则预览全局的工作表
                        dataId = dataId ||Box.main.dataId;
                        type = type || Box.main.dataType;
                        //如果没有数据源可以预览,则不动作
                        if(!dataId) return;
                        //采用统一的数据源查看接口
                        DataInfoUtil.show(dataId);

                        //采用了统一的数据源查看方式,下面的就不要了

                        /*var url = Bace.handleUrlParam("/platform/resmanage/data/data-common-view");
						var params = {
							dataId: dataId,
							type: type
						};
						if(type == "1"){
							url = Bace.handleUrlParam("/platform/resmanage/datalink/data-link-show");
							 params = {
								dataLinkId: dataId
							};
						}
						//页面跳转
						Widgets.view.redirecPage(url,params);*/
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
			// 页面跳转方法
			redirecPage:function(url,params){
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
				var confirm = '<div id="${_id}" failType="${failType}" class="bi-confirm ${className}">' + '	<div class="confrim-text" style="letter-spacing: 1px;text-align:center">' + '  {{if titleShow==true}} <span style="font-size: 26px;">提示 </span>{{/if}}{{html msg}}' + '	</div>' + '	<div class="btn-group">{{html button}}' + '	</div>' + '</div>';
				$.tmpl(confirm, tipData).appendTo($container);
			},
			hideTip:function(id){
				jQuery("#"+id).remove();
			},
			//获得单图缩略图
			//目前只支持ECharts,后续扩展到每个组件中
			getThumbSingleURL:function($el){
				return $(".chart",$el).EBuilder('getInstanceByDom').getDataURL({
					backgroundColor:$el.css("backgroundColor")
				})
			},
			//获得全图缩略图
			//$.Deferred(Box.Widgets.getThumbURL).done(function(data){
			//	window.open(data);
			//})
			getThumbURL:function(dtd){
				jQuery("#gridBg,#tableChartPanel").removeClass("grid-bg");
				//布局面板
				var $tableChartPanel = jQuery("#tableChartPanel");
				$tableChartPanel.animate({
					scrollTop: 0
				}, 0);
				jQuery("#thumb_canvas").remove();
				var firstTopArray = [];
				var lastBottomArray = [];
				var firstLeftArray = [];
				var lastRightArray = [];

				jQuery("#tableChartPanel .container").each(function() {
					var $this = $(this);
					firstTopArray.push($this.position().top);
					lastBottomArray.push($this.position().top + $this.parent().scrollTop() + $this.height() + 20);
					firstLeftArray.push($this.position().left + $this.parent().scrollLeft());
					lastRightArray.push($this.position().left + $this.parent().scrollLeft() + $this.width() );
				});

				//从画板中获得第一个图形的纵向起始位置=》firstTop
				var firstTop = Math.min.apply({},firstTopArray) - 20  ;
				firstTop = firstTop<0?0:firstTop;
				//从画板中获得最后一个图形的纵向结束位置=》lastBottom
				var lastBottom = Math.max.apply({},lastBottomArray) + 20;

				//从画板中获得第一个图形的横向起始位置=》firstTop
				var firstLeft = Math.min.apply({},firstLeftArray)-20;

				//从画板中获得最后一个图形的横向结束位置=》lastBottom
				var lastRight = Math.max.apply({},lastRightArray)+20;

				html2canvas(document.getElementById("tableChartPanel"), {
					onrendered: function(canvas) {
						 var sourceX = 0;
						 var sourceY =  0;
						 var sourceWidth = lastRight + 400;
						 var sourceHeight = lastBottom + 400;
						 var destWidth = sourceWidth;
						 var destHeight = sourceHeight;
						 var destX =-firstLeft;
						 var destY = -firstTop;

						 var image = new Image();
							 image.src = canvas.toDataURL("image/png");

							image.onload = function(){
								//log(image.src)
								var width = lastRight-firstLeft;
								var height = lastBottom-firstTop;

								var newCnvs= document.createElement('canvas');
									newCnvs.setAttribute("id","thumb_canvas");
									newCnvs.style.display = "none"
									newCnvs.width=width;
									newCnvs.height=height;
									document.body.appendChild(newCnvs);

								var canvas2 = document.getElementById('thumb_canvas');
								var context = canvas2.getContext('2d');
								context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
								document.body.appendChild(canvas2);
								log("图形生成完毕");
								jQuery("#gridBg,#tableChartPanel").addClass("grid-bg");
								dtd.resolve(canvas2.toDataURL("image/png"));
							}
					},
					width:lastRight + 500,
					height:lastBottom + 500
				});
				return dtd;
			},
			//加载页面页面底部的url导航条 gaoya 20160914
			openUrlPanel:function(method){
				UrlPathPanel.init();
				if(method==="close"){
					$("#layout_body_url_panel").css("display","none");
				}else if(method==="open"){
					$("#layout_body_url_panel").css("display","block");
					$("#setUrlPath").click(UrlPathPanel.show);
				}

			}
		};
		return Widgets.control;
	});
