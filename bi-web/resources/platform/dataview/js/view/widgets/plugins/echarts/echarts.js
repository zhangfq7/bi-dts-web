define(['bace', 'view/box','EBuilder','view/widgets/plugins/echarts/dimAttr','view/widgets/plugins/echarts/desgin','view/widgets/plugins/echarts/tpl','echarts', 'view/attr'],
        function(Bace, Box,EBuilder, DimAttr,Desgin,Tpl,echarts, Attr){
	Box.Widgets.plugins.echarts = {
		type:'echarts',
		flag:false,
		init:function(){
			//绑定小面板事件
			function settingPanelEvent(){
				//echarts图表,点击小面板中的 指标项 动作
				$("#tableChartPanel").on('click', '.dimAttrSettingPanel .attrPanel .dimAttrField', function(event) {
					var $this  = jQuery(this);
					var $attrText = $this.find(".attrDimText");
					//注意：容器的配置项也会随之改变
					if($attrText.hasClass("checked")){
						//确保有一个被选中
						if($this.parents(".attrPanel").find(".attrDimText.checked").length == 1){
							return;
						}
						$this.data("data").isChecked = false;
						$attrText.removeClass("checked");
					}else{
						$this.data("data").isChecked = true;
						$attrText.addClass("checked");
					}
					//如果打开的属性栏是我本身(和属性栏联动)
					//则更新属性栏数据
					var $container = $this.parents('.container');
					var option = $container.data("option");
					if(option.mapType==="twoDimension"){
						//如果没有选中则先将其他的选项置为未选中(同时只有一个指标可以选中)
						var $attrPanel = $this.parents(".attrPanel");
						$attrPanel.find(".dimAttrField").each(function(){
							var $that = $(this);
							$that.data("data").isChecked = false;
							$that.find(".attrDimText").removeClass('checked');
						});
						//选中当前点击项
						var attrData = $this.data("data");
						$this.find(".attrDimText").addClass('checked');
						attrData.isChecked = true;
					}
					if(Box.Property.isMyProperty && Box.Property.isMyProperty(option.el)){
						DimAttr.render(option);
					}

                    //清空下钻参数,隐藏下钻面包屑
                    $container.data("drillSettingList",[]);
                    $container.find(".breadcrumbs").hide();
                    //清除关联痕迹 shaojs 20160921
                    $container.find(".chainInfo").empty().hide();
                    $container.data("isLinked",false);

					//重新设置build参数
					var build = option.config.build;
					var checkDimAttr = DimAttr.getCheckedDimAttr(option.config.dataPanel);
					build.seriseIndex = checkDimAttr.indexArray;
					build.dataParams.dimAttrJsonStr  = $.toJSON(checkDimAttr.data);
					build.dataParams.filterJsonStr = $.toJSON(Box.Filter.dataStart('collect'));
					//重新绘图
					$("#"+option.el+" .chart").EBuilder(build,true);
				});
				//echarts图表,点击小面板中的 维度项 动作 gaoya 20160830
				$("#tableChartPanel").on('click', '.dimAttrSettingPanel .dimPanel .dimAttrField,.dimAttrSettingPanel .graphPanel .dimAttrField ', function(event) {
					var $this  = jQuery(this);
					//点击已选择的维度,则不动作
					if($this.find(".attrDimText").hasClass('checked')){
						return;
					}
					//如果没有选中则先将其他的选项置为未选中(同时只有一个指标可以选中)
					var $dimPanel = $this.parents(".dimPanel");
					$dimPanel.find(".dimAttrField").each(function(){
						var $that = $(this);
						$that.data("data").isChecked = false;
						$that.find(".attrDimText").removeClass('checked');
					});
					//选中当前点击项
					var dimData = $this.data("data");
					$this.find(".attrDimText").addClass('checked');
					dimData.isChecked = true;

					//二维柱图 图形维度设定只能同时选中一个 gaoya 20160906
					var $graphPanel = $this.parents(".graphPanel");
					$graphPanel.find(".dimAttrField").each(function(){
						var $that = $(this);
						$that.data("data").isChecked = false;
						$that.find(".attrDimText").removeClass('checked');
					});
					//选中当前点击项
					var graphData = $this.data("data");
					$this.find(".attrDimText").addClass('checked');
					graphData.isChecked = true;


					//放开多维度选中,供测试数据用
					/*$(this).data("data").isChecked = !$(this).data("data").isChecked;
					$this.find(".attrDimText").toggleClass('checked');*/

					//如果打开的属性栏是我本身(和属性面板联动)
					//则更新属性栏数据
					var $container = $this.parents('.container');
					var option = $container.data("option");
					if(Box.Property.isMyProperty && Box.Property.isMyProperty(option.el)){
						DimAttr.render(option);
					}

					//清空下钻参数,隐藏下钻面包屑
					$container.data("drillSettingList",[]);
					$container.find(".breadcrumbs").hide();
                    //清除关联痕迹 shaojs 20160921
                    $container.find(".chainInfo").empty().hide();
                    $container.data("isLinked",false);

					//重新设置bulid参数
					var build = option.config.build;
					var checkDimAttr = DimAttr.getCheckedDimAttr(option.config.dataPanel);
					build.seriseIndex = checkDimAttr.indexArray;
					build.dataParams.dimAttrJsonStr  = $.toJSON(checkDimAttr.data);
					build.dataParams.filterJsonStr = $.toJSON(Box.Filter.dataStart('collect'));
					//重新绘图
					$("#"+option.el+" .chart").EBuilder(build,true);

				});

				//点击 模板 小按钮 展示模板选择弹出框
				$("#tableChartPanel").on('click', '.chart-icon.tpl', function() {
					var $container = $(this).parents('.container');
					//"view/widgets/plugins/echarts/tpl" 模板选择框展示
					Tpl.show($container);
				})
			}
			//只允许初始化一次(事件只绑定一次)
			if(!Box.Widgets.plugins.echarts.flag){
				settingPanelEvent();
				Box.Widgets.plugins.echarts.flag = true;
			}
		},
		initDataPanel:DimAttr.init,  //图形数据 面板初始化方法
		initDesginPanel:{            //图形设计 面板方法
			config:Desgin.getConfig(),
			change:Desgin.change
		},
		contanier:{
			getTools:function(page){
                //添加背景图片，yetf 2017/5/22
                if(!!sessionStorage.imgSrc){
                    $(".container").css({"background-image":"url("+sessionStorage.imgSrc+")","background-size":"100% 100%","background-repeat":"no-repeat"})
                }
				//shaojs 20160804 改造方法,为不同的页面放回不同的tools集合
				page = page || "main";//默认是主页面
				var tools = {
					move            : '<div class="chart-icon move" title="按住我，拖动！"><i class="iconfont icon-move" ></i></div>',
					setting         : '<div class="chart-icon setting" title="打开属性面板"><i class="iconfont icon-setting" ></i></div>',
					openSelfDimAttr : '<div class="chart-icon openSelfDimAttr" title="打开小面板"><i class="iconfont icon-dim" ></i></div>',
					tpl             : '<div class="chart-icon tpl " title="模版"><i class="iconfont icon-tpl" style="top: -2px; left: 4px; font-size: 24px;" ></i></div>',
					removeSelfChart : '<div class="chart-icon removeSelfChart del" title="移除"><i class="iconfont icon-delete" ></i></div>',
					discovery       : '<div class="chart-icon discovery" title="探索"><i class="iconfont icon-discovery" ></i></div>',
					viewdata        : '<div class="chart-icon viewdata" title="预览工作表"><i class="iconfont icon-viewdata" ></i></div>'
				};
				switch(page){
					case "main" :
						switch(discovery){
						  //预留，以便后期探索页面增加内容
						  case '1':
							 /* return [tools.move, tools.setting, tools.openSelfDimAttr, tools.tpl, tools.removeSelfChart,tools.viewdata ];
						      break;*/
						  default:
							  return [tools.move, tools.setting, tools.openSelfDimAttr, /*tools.tpl,*/ tools.viewdata, tools.removeSelfChart ];
							  break;
						}
						break;
					case "container" :
						return [tools.openSelfDimAttr,tools.discovery];
						break;
                    case "preview" :
                        return [tools.openSelfDimAttr];
                        break;
					default :
						return [];
				}
			},
			settingPanel:'<div class="fieldTitle">维度</div>'+
				'<div class="dimPanel panel"></div>'+
				//二维柱图小面板增加图形维度 gaoya 20160824
				'<div class="fieldTitle graphTitle" style="display:none;">图形维度</div>'+
				'<div class="graphPanel panel"  style="display:none;"></div>'+
				'<div class="fieldTitle attrTitle">指标</div>'+
				'<div class="attrPanel panel"></div>',
			renderSettingPanel:function($container){
				//小面板容器
				var $dimAttrSettingPanel = $container.find('.dimAttrSettingPanel');
				//清空小面板维度项和指标项
					$dimAttrSettingPanel.find(".dimPanel,.graphPanel,.attrPanel").empty();
				//从option中获取维度项数据
				var dataPanel = $container.data("option").config.dataPanel;

				//疑似重复代码,依然是清空小面板维度项和指标项
				var $dimPanel = $dimAttrSettingPanel.find(".dimPanel");
					$dimPanel.html("");
				var $attrPanel = $dimAttrSettingPanel.find(".attrPanel");
					$attrPanel.html("");
				var $graphPanel = $dimAttrSettingPanel.find(".graphPanel");
                    $graphPanel.html("");


				//仪表盘面板特殊处理
				if ($container.data("option").chartType == 'gauge') {
					$dimAttrSettingPanel.addClass('gaugePanel');
				} else {
					$dimAttrSettingPanel.removeClass('gaugePanel');
				}

				//多维柱图小面板维度、指标重新布局 gaoya 20160825
				if ($container.data("option").mapType ==='twoDimension') {
					$dimAttrSettingPanel.find(".graphTitle,.graphPanel").css("display","inline-block");
					$dimAttrSettingPanel.children("div.dimPanel:first").addClass("addDimPanel")
										.parent().children("div.attrTitle").addClass("addAttrTitle")
										.parent().children("div.attrPanel").addClass("addAttrPanel");
				}

				//渲染指标项,挂载参数
				if(_.keys(dataPanel).length > 0){
					var attrData = dataPanel.attrData;
					var dimData = dataPanel.dimData;
                    var graphData = dataPanel.graphData;
					var html = '<div class="dimAttrField ${order}" title="${attrName}">'
								  +'<div class="attrDimText {{if isChecked==true}} checked {{/if}}">${modifyName}</div>'
							   +'</div>';
					for(var i =0;i<dimData.length;i++){
						$dimPanel.append($.tmpl(html,dimData[i]).data("data",dimData[i]));
					}
					for(var i =0;i<attrData.length;i++){
						$attrPanel.append($.tmpl(html,attrData[i]).data("data",attrData[i]));
					}
					if($container.data("option").mapType ==='twoDimension'){
                    	for(var i =0;i<graphData.length;i++){
                        	$graphPanel.append($.tmpl(html,graphData[i]).data("data",graphData[i]));
                    	}
					}
				}
				//放回渲染后的小面板
				return $dimAttrSettingPanel;
			},
			resize:{
				start:function(){
				},
				reisze:function(el){
					//调用echarts的resize方法
					$(".chart",$("#"+el)).EBuilder('getInstanceByDom').resize();
				},
				stop:function(){
				}
			}
		},
		//属性面板
		propPanel:{
			data:{
				html: '<div propType="echarts">'+
						'<div class="fieldTitle dimTitle">' +
						'<div style="display: inline-block; vertical-align:top">维度</div>' +
						'</div>' +
						'<div class="dimPanel" id="dimPanel"></div>' +
						//属性面板增加图形维度20160824
						'<div class="fieldTitle graphTitle" style="display:none;">'+
						'<div style="display: inline-block; vertical-align:top">图形维度</div>'+
						'</div>'+
						'<div class="graphPanel" id="graphPanel" style="display:none;"></div>'+
						'<div class="fieldTitle attrTitle">' +
						'<div style="display: inline-block; vertical-align:top">指标</div>' +
						'</div>' +
						'<div class="attrPanel" id="attrPanel"></div>' +
						'</div>'

			},
			tabsChange:function(event,ui){
				//#chart-property 图形设计面板,当切换到图形设计面板时先判断指标维度是否改变
				if(ui.newPanel.attr("id") == 'chart-property'){
					//返回指标维度是否发生变化;为false发生变化
					if(DimAttr.checkDiff(true)===false){
						Box.Property.apply();
					}
				}
			},
			openRender:function(option){
				//多数据源改造
				if(option.isInit){
					//当前图形的dataId
					var currentDataId = option.config.build.dataParams.dataId;
					var currentDataName = option.config.build.dataParams.dataName;
					var currentDataType = option.config.build.dataParams.dataType;
					Box.main.dataName = currentDataName;
					Box.main.dataId = currentDataId;
					Box.main.dataType = currentDataType;
					Attr.init();
					Attr.openAttrPanel('open');
				}
				//渲染属性面板和设计面板
				DimAttr.render(option);
				Desgin.render(option);
			},
			//关闭属性面板时动作
			close:function(){
				//检查维度,指标是否改变,如果有改变弹出提示层
				if(DimAttr.checkDiff()===false){
					Box.Property.hideTip("error");
					Box.Property.showTip({
						_id:"error",
						msg: '<br/>系统检测到关闭操作!<br/>但图形指标数据发生变化，<br/>是否应用该数据？',
						button: '<div class="btn changeChart" style="width: 196px;">应用</div>' + '<div class="btn cancelChange" style="width: 196px;">直接关闭</div>'
					});

					$("#error .changeChart").click(function(){
						Box.Property.apply();
						Box.Property.hideTip("error");
					});

					$("#error .cancelChange").click(function(){
						Box.Property.close(true);
						Box.Property.hideTip("error");
					});
					return false;
				}else{
					Box.Property.close(true);
					return true;
				}
			}
		},
		apply:function(option,isPass){
			if(isPass){
				option.config.build.ajaxURL = Bace.handleUrlParam('/platform/dataview/viewChartData');
                //在查看页面,添加containerid和查看页面标识
                if(Box.flags.isVeiwPage){
                    option.config.build.dataParams.containerid = option.el;
                    option.config.build.dataParams.isViewPage = true;
                }

				$("#"+option.el+" .chart").EBuilder(option.config.build,true);
				return;
			}
			//收集维度,指标数据
			var dimAttrData  = DimAttr.collect();
			//检测数据是否合法
			var errorText = DimAttr.checkValidity(dimAttrData);
			if(errorText){
				//如果不合法
				Box.Property.showTip({
					_id:"error",
					msg: '<br/>'+errorText,
					button: '<div class="btn changeChart" style="width: 196px;">确定</div>' + '<div class="btn cancelChange" style="width: 196px;">取消</div>'
				});

				$("#error .changeChart").click(function(){
					jQuery("#propertyTabs").tabs("option", "active", 0);
					Box.Property.hideTip("error");
				});

				$("#error .cancelChange").click(function(){
					jQuery("#propertyTabs").tabs("option", "active", 0);
					Box.Property.hideTip("error");
				})
			}else{
				//如果不断绝血缘关系，面板上的变化，会实时反馈到容器上(深度复制指标维度数据)
				option.config.dataPanel =  eval( "(" + $.toJSON(dimAttrData) + ")" );
				var desginObj = Desgin.apply(option);
				var build = desginObj.build;
				build.ajaxURL = Bace.handleUrlParam('/platform/dataview/viewChartData');
				var checkDimAttr = DimAttr.getCheckedDimAttr(dimAttrData);
				build.seriseIndex = checkDimAttr.indexArray;
				build.dataParams  = {
					dataId:Box.main.dataId,    //多数据源改造,添加dataId属性
					dataName:Box.main.dataName, //挂载数据源名称 shaojs 20160823
					dataType:Box.main.dataType,
					chartType:option.chartType,
					dimAttrJsonStr:$.toJSON(checkDimAttr.data),
					filterJsonStr:$.toJSON(Box.Filter.dataStart('collect'))
				};

				//在查看页面,添加containerid和查看页面标识
                if(Box.flags.isVeiwPage){
                    build.dataParams.containerid = option.el;
                    build.dataParams.isViewPage = true;
                }

				//maoww
				//如果指标都为时间且没有函数，type改为time
				var attrData = option.config.dataPanel.attrData;
				if(attrData.length >= 2 && attrData[0].attrType == 2 && attrData[0].funcName == "" && attrData[1].attrType == 2 && attrData[1].funcName == ""){
					build.option.xAxis[0].type = 'time';
				}
				
				// X/Y轴单位换算开关设置 add by lifeilong
				var xIsSwitch = 0;
				var yIsSwitch = 0;
				if($("#xAxis-unit-switch").parent().hasClass("ui-state-active")){
					xIsSwitch = 1;
				}
				if($("#yAxis-unit-switch").parent().hasClass("ui-state-active")){
					yIsSwitch = 1;
				}
				build.xIsSwitch = xIsSwitch;
				build.yIsSwitch = yIsSwitch;
				//end add lifeilong
				build.chartChild =  option.chartChild;
				
				//只更新设计信息
				var ret = $("#"+option.el+" .chart").EBuilder(build,true);
				
				//更新option的build
				option.config.build = desginObj.build;
				//更新option的designPanel
				option.config.designPanel = desginObj.designPanel;
				option.isInit = true;
				return ret;
			}
		},
		//销毁
		destory:function(el){
			var echartsInstance = $("#"+el+" .chart").EBuilder('getInstanceByDom');
			if(echartsInstance){
				echartsInstance.dispose();
			}
		},
		//设置全局主题
		setTheme:function(themeName){
			$("#tableChartPanel .container").each(function(){
				var $this = $(this);
				var option = $this.data("option");
				if(option.isInit && option.chartType != "table" && option.chartType != "text"){//表格和文本组件不支持主题设置 gaoya 20170504
					$("#"+option.el+" .chart").EBuilder('setTheme',themeName);
				}
			})
		},
		//设置单个echarts图表主题 add by lifeilong
		setSingleTheme:function(themeName, obj){
			var $this = $("#" + obj);
			var option = $this.data("option");
			if(option.isInit && option.chartType != "table" && option.chartType != "text"){//表格和文本组件不支持主题设置 gaoya 20170504
				$("#"+option.el+" .chart").EBuilder('setTheme',themeName);
			}
		}
	}
});
