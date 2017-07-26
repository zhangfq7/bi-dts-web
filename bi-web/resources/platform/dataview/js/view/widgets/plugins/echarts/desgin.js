define(['bace', 'view/box', 'underscore', 'view/widgets/plugins/echarts/series', 'view/widgets/plugins/echarts/collect'], function(Bace, Box, _, series, Collect) {

	var Desgin = {
		//是否绑定过私有事件标识(事件只绑定一次)
		isInit: false
	};

	Desgin.control = {
		/**
		 * 描述：返回普通配置项和系列配置项的合体
		 */
		getConfig:function(){
			return $.extend(true,Desgin.module.config, series.seriesData)
		},
		/**
		 * 描述：根据传入的容器对象渲染设计面板，并挂载相应的方法
		 * @param {Object} option	容器对象的配置信息
		 */
		render:function(option){
			var chartType = option.chartType;

			//当前设计面板的图形类型
			Desgin.module.chartType = chartType;
			//当前设计面板的容器编码
			Desgin.module.el = option.el;

			var attrData = option.config.dataPanel.attrData||[];

			//更新系列指标选择框,并赋值config.designPanel.seriesPanel
			Desgin.view.updateSeriesPanel(attrData);

			//如果容器已经初始化
			if(option.isInit || option.tplCount >0){
				//则渲染设计配置
				var initOption =  eval( "(" + $.toJSON(option.config.designPanel) + ")" );
				delete initOption.seriesPanel;
				Box.Property.dataStart(initOption);
				//渲染系列
				var seriesPanel = option.config.designPanel.seriesPanel;

				//默认渲染第一个系列
				var seriesData = _.indexObj(seriesPanel.seriesData,0);
				//渲染firstChartType类型图形系列面板
				Box.Property.dataStart(seriesData);



				//渲染后，需要选中系列下拉框
				var firstChartType = _.keys(seriesData)[0];
					firstChartType = firstChartType=="radar2"?"radar":firstChartType;
				$("#series-charts").val(firstChartType).trigger("chosen:updated");

				//根据firstChartType类型图形系列面板
				Desgin.view.showSeriesChartPanelByType(firstChartType);
				//如果是单系列，则设置系列下拉灰置
				if(seriesPanel.seriesAuto){
					Desgin.view.setSeriseState(true);
				}else{
					Desgin.view.setSeriseState(false);
				}
			}else{
				//渲染初始化配置值
				Box.Property.dataStart(Collect.collectBaseTemplate('public'));
				var initBuild  = Collect.collectSeriesTemplate(chartType);
				Box.Property.dataStart(initBuild);
				if(option.config.designPanel !== undefined){
					//默认都是单系列
					option.config.designPanel.seriesPanel.seriesData['single'] = initBuild;
				}
				//根据图形类型显示不同的图形系列面板
				Desgin.view.showSeriesChartPanelByType(chartType);
			}




			//隐藏直角系的设置
			if(['pie','funnel','map','radar','gauge','heatmap'].indexOf(chartType)>-1){
				$("#chart-property").find('div[proptype="xy"]').hide();
			}

			//maoww
			//如果类型为散点图，则隐藏【XY轴互换】，反之显示
			$("#bi-grid-yx").parents(".items")[chartType=="scatter"?"hide":"show"]();

			if(!Desgin.isInit){
				//挂在更新系列方法
				Box.Design.updateSeriesPanel = Desgin.view.updateSeriesPanel;
				//绑定更换系列/默认系列/切换指标/切换图形按钮时间
				for (var event in Desgin.view.bindEvent) {
					Desgin.view.bindEvent[event]();
				}
				//标识已经初始化
				Desgin.isInit = true;
			}

		},
		apply:function(option,isReal,map_convert){
			var build = {
				type:[]
			};
			//容器系列对象
			var seriesPanel = option.config.designPanel.seriesPanel;
			var collectSeriesData =Desgin.control.renderSeriesArray(seriesPanel.seriesData,option.mapType);
			var collectBaseType = [];
			var typeArray = _.pluck(collectSeriesData, 'type');
			if (_.intersection(typeArray, ['line', 'bar', 'scatter']).length > 0) {
				collectBaseType.push("grid");
			}
			if(typeArray.indexOf('radar')>-1){
				collectBaseType.push("radar");
			}
			if(typeArray.indexOf('map')>-1){
				collectBaseType.push("map");
			}
			//build->option准备
			var baseOption = Desgin.control.collectBase(collectBaseType,'convert');
			var _option = baseOption.data;
			var _config = baseOption.config;
			_config.seriesPanel = seriesPanel;
			//build对象
			build.option = _option;
			build.seriesAuto = seriesPanel.seriesAuto;
			build.series = collectSeriesData;
			if(collectBaseType.indexOf("grid")>-1){
				build.yx = _option.bi.grid.yx;
			}
			//缩起容器小面板
			$("#"+option.el+" .dimAttrSettingPanel").hide('slide');
			if(isReal === false){
				var $el = $("#"+option.el );
				build.seriseIndex = $el.data('option').config.build.seriseIndex;
				build.ajaxURL = $el.data('option').config.build.ajaxURL;
				build.dataParams = $el.data('option').config.build.dataParams;
				//只更新设计信息
				var byDesgin = map_convert?true:false;
				$(".chart",$el).EBuilder(build,byDesgin);
				//更新option的build
				option.config.build = build;
				//更新option的designPanel
				option.config.designPanel = _config;
				return;
			}

			return {
				designPanel:_config,
				build:build
			}
		},
		/**
		 * 描述：设计面板组件发生变化，会触发此方法
		 * @param {String} $el	容器对象
		 * @param {String} id	发生变化的组件ID
		 * @param {String} val  发生变化所产生的值
		 * @param {Object} prop 基于id-val生成的对象，如果line-color:red=>{line:{color:red}}
		 */
		change:function($el,id,val,prop){
			//配置项的类型
			var type = id.split('-')[0];
			if(type == 'series'){
				//系列下拉框的切换不在此处理
				return;
			}
			//当前发生变化容器的实例
			var echartsInstance = $(".chart",$el).EBuilder('getInstanceByDom');
			//判断是否是系列发生变换
			if(['pie','bar','line','scatter','funnel','map','gauge', 'heatmap'].indexOf(type)>-1 || id == 'radar2-fill'){
				//如果是系列类型发生变化，是得重新收集配置进行渲染的
				Desgin.view.changeSeriesProp($el,id,val,prop,type,echartsInstance);
				return;
			}

			var option = $el.data("option");
			//将最新配置规整到 config.designPanel中
			$.extend(true,option.config.designPanel, prop);
			//维护build的option,相当于点了一次应用
			option.config.build.option = Collect.renderTemplate( ['line','bar','grid'].indexOf(option.chartType)>-1?'grid':option.chartType,option.config.designPanel);
			if(echartsInstance){
				//如果是综合属性(option)，则转换成echart配置项
				if(id=="bi-grid-xUnit"){//X轴单位
					prop = {
						xAxis: [{
							axisLabel: {
								formatter:  '{value}'+ val
							}
						}]
					}
				}else if(id=="bi-grid-yUnit"){//Y轴单位
					prop = {
						yAxis: [{
							axisLabel: {
								formatter:  '{value}'+ val
							}
						}]
					}
				}else if(id=="radar-0-name-dataUnit"){
					prop = {
						radar: [{
							name: {
								formatter:  '{value}'+ val
							}
						}]
					}
				}else if(id=="radar-0-radius"){
					prop = {
						radar: [{
							radius:val+"%"
						}]
					}
				}else if(id=="bi-grid-yx"){//X轴互换
					var option = echartsInstance.getOption();

					var temp= option.xAxis;
				    option.xAxis =  option.yAxis;
				    option.yAxis = temp;
				    $el.data("option").config.build.yx = val;
					echartsInstance.setOption(option);
					return;//此处终端逻辑
				}else if(id=="dataZoom-1-type"){
					var option = echartsInstance.getOption();
					if(val){
						option.dataZoom[1].type = 'inside';
					}else{
						delete option.dataZoom[1];
					}
					echartsInstance.setOption(option);
					return;//此处终端逻辑
				}else if(id=="xAxis-0-position"){ //Y轴刻度最大值
					if(val == "top"){
						prop = {
							xAxis: [{
								position:"top",
								axisLine:{
						          onZero:  false
						        }
							}]
						}
					}else{
						prop = {
							xAxis: [{
								position:"bottom",
								axisLine:{
						          onZero: true
						        }
							}]
						}
					}
				}else if(id=="yAxis-0-max"){ //Y轴刻度最大值
					if(!val){
						prop = {
							yAxis: [{
								max:null
							}]
						}
					}
				}else if(id=="yAxis-0-min"){//Y轴刻度最小值
					if(!val){
						prop = {
							yAxis: [{
								min:null
							}]
						}
					}
				}else if(id=="yAxis-0-type"){//Y轴刻度最小值
					$("#yAxis-0-splitLine-show").prop('checked',true).change();
				}
				echartsInstance.setOption(prop);
			}
		},
		/**
		 * 描述：收集基本配置项，如果传入isConvert，将会返回真正的echarts-option
		 * @param {String} chartType 当前图形类型
		 * @param {String} isConvert 是否返回echartOption
		 * @return config:设计面板的数据
		 * 			data:echart的option
		 */
		collectBase:function(chartType,isConvert){
			var collectData = Collect.collectBaseTemplate(chartType);
			Box.Property.dataStart('collect',collectData);
			if(isConvert){
				return {
					data: Collect.renderTemplate(chartType,collectData),
					config:collectData
				};
			}
			return collectData;
		},
		/**
		 * 描述：收集系列配置项，如果传入isConvert，将会返回真正的echarts-series配置
		 * @param {Object} chartType	当前图形类型
		 * @param {Object} isConvert	是否返回echart-series配置
		 * @return config:设计面板的数据
		 * 			data:echart-series配置
		 */
		collectSeries:function(chartType,isConvert){
			var series_temp = Collect.collectSeriesTemplate(chartType);
			var chartChild = arguments[2]; //添加一个chartChild参数,用于设置地图类型的mapType属性,兼容之前的方法
			Box.Property.dataStart('collect',series_temp);
			if(isConvert){
				return {
					data: Collect.renderSeries(chartType,series_temp,chartChild),
					config:series_temp
				};
			}
			return series_temp;
		},
		/**
		 * 描述：这个方法会根据系列配置生成真正的series配置数组
		 * @param {Object} seriesArray	设计面板的系列配置数组
		 */
		renderSeriesArray:function(seriesArray){
			var series = [];
			var chartChild = arguments[1];
			_.each(seriesArray,function(obj){
				var attrObj = _.indexObj(obj,0);
				series.push(Collect.renderSeries(attrObj.type,obj,chartChild));
			})
			return series;
		}
	}

	Desgin.view = {

		/**
		 * 描述：根据不同的系列类型，显示不同系列的图形面板
		 * @param {String} chartType	图形类型
		 * @param {Object} config		系列配置
		 * @param {String} isApply		是否即时渲染图形
		 */
		showSeriesChartPanelByType:function(chartType,config,isApply,map_convert){
			//容器对象
			var $el = $("#"+Desgin.module.el);

			var $desginPanel = $("#chart-property");
			//隐藏所有的系列图形
			$(".seriesType",$desginPanel).hide();
			//显示对应图形的系列面板
			$('div[proptype="'+chartType+'"]',$desginPanel).show();

			//选中相应的图形
			$("#series-charts").val(chartType).trigger("chosen:updated");

			//切换图形后，需要将当前arrt的名称更新过来
			var $seriesAttrs = $("#series-attrs");
			var $selecedOption = $("option:selected",$seriesAttrs);
			$selecedOption.attr("chartType",chartType).text(Desgin.module.getNameByType(chartType) +" - "+ $selecedOption.attr("modifyName"));
			$seriesAttrs.trigger("chosen:updated");

			var seriesPanel = $el.data("option").config.designPanel.seriesPanel;

			//如果有对象，切换时需要渲染
			if(config){
				Box.Property.dataStart(config);
			}

			setTimeout(function(){

				var seriesNum = $seriesAttrs.find("option:selected").index();
				//并且需要更新attr的seriesType
				if($("#attrPanel .dimAttrField").length > 0){
					$("#attrPanel .dimAttrField").eq(seriesNum).data("dimAttrData").seriesType = chartType;
					//实时更新容器上的图形类型，否则验证会出问题
					if($el.data("option").isInit){
						$el.data("option").config.dataPanel.attrData[seriesNum].seriesType = chartType;
					}
					//当前系列的对象
					var seriesObj = Desgin.control.collectSeries(chartType,'isConvert',$el.data("option").mapType);
					//选中的系列ID
					var selectSeriesValue =  $seriesAttrs.find("option:selected").val();
					//即时渲染容器seriesPanel的值
					if(seriesPanel.seriesData["single"]){
						seriesPanel.seriesData["single"] = seriesObj.config;
					}else{
						seriesPanel.seriesData[selectSeriesValue] = seriesObj.config;
					}

				}

				//如果用户切换的类型是 gird类型，且之前没有grid坐标轴，则展开xy面板
				var $xyPanel =  $desginPanel.find('div[proptype="xy"]:eq(0)');
				if(['line','bar','scatter'].indexOf(chartType) > -1){
					//显示xy面板
					$xyPanel.show();
				}else{
					//如果不是grid，则判断当前系列是否还需要xy
					var typeArray = _.map(seriesPanel.seriesData,function(obj){
						return _.indexObj(obj,0).type
					})
					if(_.intersection(typeArray, ['line','bar','scatter']).length == 0){
						//隐藏xy面板
						$xyPanel.hide();
					}
					if(typeArray.indexOf('gauge')>-1){
						//隐藏xy面板
						$desginPanel.find('div[proptype="legend"]:eq(0)').hide();
					}else{
						$desginPanel.find('div[proptype="legend"]:eq(0)').show();
					}
				}

				//是否即时渲染
				if(isApply){
					Desgin.control.apply($el.data("option"),false,map_convert);
				}


			},100)



		},
		/**
		 * 根据传入的指标数据，生成指标切换的下拉选择项
		 * 判断当前容器是否具备系列对象，如果没有则生成初始的系列对象挂载容器上
		 * @param {Object} _attrData
		 */
		updateSeriesPanel:function(_attrData){
			//复制对象，以防引用类型
			var attrData = eval( "(" + $.toJSON(_attrData) + ")" );

			var $desginPanel = $("#chart-property");

			//系列切换面板
			var $seriesPanel = $('div[proptype="series"]',$desginPanel);

			//系列指标
			var $seriesAttrs = $("#series-attrs");

			_.map(attrData,function(obj,n){
				obj.label = Desgin.module.getNameByType(obj.seriesType) +" - "+ obj.modifyName;
			})

			//生成指标选择框
			$seriesAttrs.html($.tmpl('<option  chartType=${seriesType} modifyName="${modifyName}" value="${seriesId}">${label}</option>',attrData)).trigger("chosen:updated");
			//判断图形是否为仪表盘，仪表盘不能切换成其他图形
			var $seriesCharts = $("#series-charts");
			//仪表盘只允许切换仪表盘
			if(Desgin.module.chartType == 'gauge'){
				$seriesCharts.html('<option value= "gauge" selected>仪表盘</option>').trigger("chosen:updated");
			}else if(Desgin.module.chartType == 'radar'){
				$seriesCharts.html('<option value= "radar" selected>雷达图</option>').trigger("chosen:updated");
			}else{
				$seriesCharts.html("<option  value= 'pie'>饼图</option><option value='bar'>柱图</option><option value='line'>线图</option><option value='funnel'>漏斗图</option><option value='map'>地图</option><option value='heatmap'>热力图</option>").trigger("chosen:updated");
			}
			$seriesCharts.val(Desgin.module.chartType).trigger("chosen:updated");
			var $el = $("#"+Desgin.module.el);

			//容器所具备的系列对象
			var seriesPanel = $el.data("option").config.designPanel.seriesPanel;
			if(seriesPanel==undefined||seriesPanel.seriesAuto){
				Desgin.view.setSeriseState(true);
				if(Desgin.module.chartType == 'pie'){
					$("#pie-centerX,#pie-centerY").parents(".items").hide();
				}else if(Desgin.module.chartType == 'funnel'){
					$("#funnel-left,#funnel-top").parents(".items").hide();
				}else if(Desgin.module.chartType == 'map'){
					$("#map-left,#map-top,#map-width").parents(".items").hide();
				}else if(Desgin.module.chartType == 'gauge'){
					$("#gauge-centerX,#gauge-centerY").parents(".items").hide();
				}
			}
			//如果当前对象没有系列
			if(_.keys(seriesPanel).length == 0){

				//生成最新的seriesPanel对象
				var seriesProp =  Desgin.control.collectSeries(Desgin.module.chartType);

				$el.data("option").config.designPanel.seriesPanel = {
					seriesAuto:true,
					seriesData:{
						'single':seriesProp
					}
				};
			}else{
				//如果是多系列，则需要根据attrData合并/填补seriesPanel
				if(!seriesPanel.seriesAuto){
					var seriesData = {};
					var keys = _.keys(seriesPanel.seriesData);
					_.each(_attrData,function(obj,index){
						var seriesId = obj.seriesId;
						var series = seriesPanel.seriesData[seriesId];
						if(series){
							seriesData[seriesId] = series;
						}else{
							seriesData[seriesId] = Collect.collectSeriesTemplate($el.data("option").chartType);
						}
						if(index == 0){
							var _temp = seriesData[seriesId];
							Desgin.view.showSeriesChartPanelByType(_.keys(_temp)[0],_temp);
						}
					})
					$el.data("option").config.designPanel.seriesPanel.seriesData = seriesData;
				}
			}
			//如果没有指标或图形类型为散点图，则隐藏系列切换面板
			$seriesPanel[attrData.length  ==  0 || Desgin.module.chartType == 'scatter' ? 'hide':'show']();
			if(Desgin.module.chartType == 'radar'){
				$seriesPanel.hide();
			}
		},
		/**
		 *
		 * @param {Object} $el
		 * @param {Object} id
		 * @param {Object} val
		 * @param {Object} prop
		 * @param {Object} type
		 * @param {Object} echartsInstance
		 */
		changeSeriesProp:function($el,id,val,prop,type,echartsInstance){

			//获取当前series对象
			var $seriesAttrs=  $("#series-attrs");

			//选中的系列的编码
			var $selectSeries =  $seriesAttrs.find("option:selected");

			var selectSeriesValue = $selectSeries.val();

			var seriesPanel = $("#"+Desgin.module.el).data("option").config.designPanel.seriesPanel;

			var seriesObj = Desgin.control.collectSeries(type,'isConvert',$el.data("option").mapType);

			//设计面板数据
			var seriesConfig = seriesObj.config;

			//真实的配置数据
			var serie =  seriesObj.data;

			//单系列
			if(seriesPanel.seriesAuto){
				if( type =='pie'){
					//饼图单系列时，位置是自动计算
					delete serie.center;
				}else if(type == 'funnel'  ){
					delete serie.top;
					delete serie.left;
				}else if(type == 'map'){
					delete serie.width;
					delete serie.left;
					delete serie.top;
				}else if(type == 'gauge'){
					delete serie.center;
				}

				//更新容器的seriesConfig
				seriesPanel.seriesData = {
					"single":seriesConfig
				};
				$("#"+Desgin.module.el).data("option").config.build.series = [serie];
				//根据传入的配置生成图形
				Desgin.view.updateSeriesChart({
					updateNum:"all",
					updateObj:serie,
					echartsInstance:echartsInstance
				})

			}else{

				//attrPanel取消寻找当前改变的指标系列是否被选中
				var seriesNum = $selectSeries.index();
				//更新面板
				seriesPanel.seriesData[selectSeriesValue] = seriesConfig;
				//attrPanel取消寻找当前改变的指标系列是否被选中
				var checkArray = [];
				$("#attrPanel .icon-checkbox.checked").each(function(){
					checkArray.push($(this).parents(".dimAttrField").data("dimAttrData").seriesId);
				})
				$("#"+Desgin.module.el).data("option").config.build.series[seriesNum] = serie;

				//获得选中的指标真正的serise值
				var index = checkArray.indexOf(selectSeriesValue);
				if(index>-1){
					//根据传入的配置生成图形
					Desgin.view.updateSeriesChart({
						updateNum:index,
						updateObj:serie,
						echartsInstance:echartsInstance
					})
				}
			}
		},
		/**
		 * 设置系列选择面板的状态
		 * @param {Object} disabled	为true则会禁止系列指标，系列图形选择功能
		 * 							为false则会开放选择
		 */
		setSeriseState:function(disabled){

			var $chartProperty = $("#chart-property");
			var $seriesAttr = $("#series-attrs");
			var $seriesCharts = $("#series-charts");

			if(disabled === true) {
				$(".cs-button.update",$chartProperty).addClass('active');
				$(".cs-button.makeSure",$chartProperty).removeClass('active');
				$seriesCharts.setDisabled(true);
				$seriesAttr.setDisabled(true);
			}else{
				$(".cs-button.update",$chartProperty).removeClass('active');
				$(".cs-button.makeSure",$chartProperty).addClass('active');
				$seriesCharts.setDisabled(false);
				$seriesAttr.setDisabled(false);
			}
		},
		/**
		 * updateNum:更新的第几个系列,如果为all则更新的是单系列全部
		 * updateObj:更新的配置
		 * =========================
		 */
		updateSeriesChart:function(config){
			var $el = $("#"+Desgin.module.el);
			if(config.echartsInstance){
				var option = config.echartsInstance.getOption();
				if(config.updateNum == "all"){
					var series = [];
					_.each(option.series,function(obj){
						series.push(config.updateObj)
					})
					//合并单系列配置
					$.extend(true,option.series,series);
				}else{
					$.extend(true,option.series[config.updateNum],config.updateObj);
				}
				config.echartsInstance.setOption(option);
			}
		},
		bindEvent:{
			changeAttr:function(){
				$("#series-attrs").change(function(event,obj){
					var $this = $(this);
					var chartType =$("option:selected",$this).attr("chartType");
					$("#series-charts").val(chartType).trigger("chosen:updated");

					var seriesId = obj.selected;
					var seriesConfig = $("#"+Desgin.module.el).data("option").config.designPanel.seriesPanel.seriesData[seriesId];
					Desgin.view.showSeriesChartPanelByType(chartType,seriesConfig);
				});
			},
			changeChartType:function(){
				$("#series-charts").change(function(event,obj){
					var $this = $(this);
					var isInit = $("#"+Desgin.module.el).data("option").isInit;
					//如果没有初始画，则终止渲染，直接显示对应面板
					if(!isInit){
						Desgin.view.showSeriesChartPanelByType(obj.selected);
						return;
					}

					Box.Property.showTip({
						_id:"cseries",
						msg: '<br/>切换当前指标的系列图形将会丢失设计配置！您确定切换当前指标的系列吗？',
						button: '<div class="btn changeChart" style="width: 196px;">更换</div>' + '<div class="btn cancelChange" style="width: 196px;">取消</div>'
					});
					$("#cseries .changeChart").click(function(){
						Box.Property.hideTip("cseries");
						Desgin.view.showSeriesChartPanelByType(obj.selected,null,"isApply",obj.beforeSelected == 'map'?"map_convert":null);
					})
					$("#cseries .cancelChange").click(function(){
						Box.Property.hideTip("cseries");
						$this.val(obj.beforeSelected).trigger("chosen:updated");
					})

				});
			},
			startChange:function(){
				$("#chart-property .cs-button.update").click(function(){
					if($(this).hasClass('active')){
						Desgin.view.setSeriseState(false);
						//一旦点击更改，就像生成多份系列配置
						var config = $("#"+Desgin.module.el).data("option").config;
						var seriesPanel = config.designPanel.seriesPanel;
						seriesPanel.seriesAuto = false;
						var seriesData  =_.indexObj(seriesPanel.seriesData,0);
						var newData = {};
						var series = [];
						$("#series-attrs option").each(function(n,obj){
							newData[obj.value] = seriesData;
							series.push(Collect.renderSeries($(obj).attr("chartType"),seriesData,$(obj).attr("chartChild")));
						})
						seriesPanel.seriesData = newData;
						config.build.series = series;
						config.build.seriesAuto = false;
						//多系列时放开饼图/漏斗的位置
						$("#gauge-centerX,#gauge-centerY,#pie-centerX,#pie-centerY,#funnel-left,#funnel-top,#map-left,#map-top,#map-width").parents(".items").show()

					}
				})
			},
			startDefault:function(){
				$("#chart-property .cs-button.makeSure").click(function(){
					if($(this).hasClass('active')){
						Desgin.view.setSeriseState(true);
						//一旦点击默认，就生成单系列配置
						var chartType = $("#series-charts").val();
						var $changeSeriesAttr = $("#series-attrs");
						//当前选中的系列面板
						var selectedPanelIndex = $changeSeriesAttr.find("option:selected").index();
						var $el = $("#"+Desgin.module.el);
						var seriesPanel = $el.data("option").config.designPanel.seriesPanel;
						var singleSeries = _.indexObj(seriesPanel.seriesData,selectedPanelIndex);
						seriesPanel.seriesAuto = true;
						seriesPanel.seriesData = {
							"single":singleSeries
						}

						//并且需要更新attr的seriesType
						$("#attrPanel .dimAttrField").each(function(){
							$(this).data("dimAttrData").seriesType = chartType;
						})
						$("option",$changeSeriesAttr).each(function(){
							$(this).attr("chartType",chartType).text(Desgin.module.getNameByType(chartType) +" - "+ $(this).attr("modifyName"));
						})

						$changeSeriesAttr.trigger("chosen:updated");

						var $gridPanel =  $("#chart-property").find('div[proptype="xy"]:eq(0)');
						if(['line','bar','scatter'].indexOf(chartType) > -1){
							$gridPanel.show();
						}else{
							$gridPanel.hide();
						}
						if( $el.data("option").isInit){
							Desgin.control.apply($el.data("option"),false);
						}
						//单系列时隐藏饼图/漏斗的位置
						$("#gauge-centerX,#gauge-centerY,#pie-centerX,#pie-centerY,#funnel-left,#funnel-top,#map-left,#map-top,#map-width").parents(".items").hide()
					}
				})
			}
		}
	}

	Desgin.module ={
		el:'',
		chartType:'',
		config:{
			title:{
				"title":"标题",
				state:"close",
				items:[
					{id:"title-text",	lable:"主标题:", 	type:"input", value:""},
					{id:"title-subtext",lable:"副标题:", 	type:"input", value:""},
					{id:"title-textStyle-color",	lable:"颜色:",type:"color",value:"rgba(0,0,0,1)",position:"bottom left-30"},
					{id:"title-left",		lable:"水平:", 	type:"select",width:'70px',selectHTML:"<option value='left' >居左</option><option value='center' selected>居中</option><option value='right'>居右</option>","style":"position:absolute;top:60px;right:2px"},
					{id:"title-textStyle-fontSize", lable:"大小:", 	type:"spaceInput",value:22,width:"13px"},
					{id:"title-top",		lable:"垂直:", 	type:"select",width:'70px',selectHTML:"<option value= 'top' selected>顶部</option><option value='middle' >中间</option><option value='bottom' >置底</option>","style":"position:absolute;top:90px;right:2px"},
				]
			},
			legend:{
				"title":"图例",
				state:"close",
				items:[
					{id:"legend-show",	lable:"标签:", 	type:"switchbutton", value:true},
					{id:"legend-orient",lable:"排版:", 	type:"select",width:"65px",selectHTML:"<option value='horizontal' selected>横排</option><option value='vertical' >竖排</option>"},
					{id:"legend-itemGap",	lable:"间隔:", 	type:"spaceInput",value:"5",width:"30px","style":"position:absolute;top:30px;right:-7px"},
					{id:"legend-top",		lable:"垂直:", 	type:"select",width:"65px",selectHTML:"<option value='top'  >顶部</option><option value='middle' >中间</option><option value='bottom' selected>置底</option>"},
					{id:"legend-left",		lable:"水平:", 	type:"select",width:"63px",selectHTML:"<option value='left' >居左</option><option value='center' selected>居中</option><option value='right' >居右</option>","style":"position:absolute;top:60px;right:-8px"},
                  //需求说不要了！  {id:"legend-limite",		lable:"默认显示图例个数:", 	type:"spaceInput",value:"3",width:"30px"},

                ]
			},
			colorSet:{
				//空，用于图例颜色设置，受制于echarts
				"title":"图例颜色",
				 state:"close"
			},
			xy:{
				"title":"X轴 <span class='circle'>●</span> Y轴",
				state:"close",
				items:[
					{id:"xAxis-0-show",	lable:"<strong style='color:#508FC5'>X轴:</strong>",type:"switchbutton", value:true,"style":"margin-left:1px"},
					{id:"xAxis-unit-switch",	lable:"<strong id='xUnit-switch' style='color:#508FC5'>X轴单位换算:</strong>",type:"switchbutton", value:true,"style":"margin-left:1px"},
					{id:"bi-grid-xUnit",lable:"X轴单位:",	type:"input",width:"136px"},
					{id:"xAxis-0-name",				lable:"X轴名称:", 	type:"input",width:"136px"},
					{id:"xAxis-0-axisLabel-interval",lable:"X值展示:", 	type:"select",width:"136px",selectHTML:"<option  value='auto'  selected>自适应展示</option><option value=0>全部展示</option>"},
					{id:"xAxis-0-position",	lable:"X轴位置:", 	type:"select",width:"134px",selectHTML:"<option  value='top' >顶部</option><option value='bottom' selected>底部</option>"},
					{id:"xAxis-0-nameLocation",lable:"名称位置:", 	type:"select",width:"134px",selectHTML:"<option  value='start'  selected>起始位置</option><option value='selected'>中间</option><option value='end' selected>结束位置</option>"},
					{id:"xAxis-0-inverse",			lable:"X轴反转:", 	type:"switchbutton", value:false},
					{id:"xAxis-0-axisLine-lineStyle-color",  lable:"X轴颜色:", 	type:"color", value:"rgba(0,0,0,.8)",position:"bottom left-40"},
					{id:"xAxis-0-axisLabel-rotate",			lable:"X轴值旋转角度：<span>0</span>度",value:0, type:"slider",width:"190px",min:0,max:90},
					{id:"xAxis-0-axisTick-show",  lable:"X轴刻度:", 	type:"switchbutton", value:true},
					{id:"xAxis-0-splitArea-show",  lable:"X分割色:", type:"switchbutton", value:false},
					{id:"xAxis-0-splitLine-show",  lable:"X分割线:", type:"switchbutton", value:false},

					{id:"dataZoom-0-show",  lable:"X轴数值缩放轴:", type:"switchbutton", value:false},
					{id:"dataZoom-1-type",  lable:"使用滚轮缩放:", type:"switchbutton", value:true,style:"display:none"},

					{id:"yAxis-0-show",			  lable:"<strong style='color:#508FC5'>Y轴:</strong>",type:"switchbutton", value:true,"style":"margin-left:1px;margin-top: 9px;padding-top: 9px;border-top:1px solid #ddd"},
					{id:"yAxis-unit-switch",	lable:"<strong id='yUnit-switch' style='color:#508FC5'>Y轴单位换算:</strong>",type:"switchbutton", value:true,"style":"margin-left:1px"},
					{id:"bi-grid-yUnit",lable:" Y轴单位:",	type:"input",width:"136px"},
					{id:"yAxis-0-name",				lable:" Y轴名称:", 	type:"input",width:"136px"},
					{id:"yAxis-0-type",			lable:" Y轴类型:", 	type:"select",width:"136px",selectHTML:"<option  value='value' selected>数值</option><option value='time'>时间</option>"},
					{id:"yAxis-0-position",			lable:"Y轴位置:", 	type:"select",width:"136px",selectHTML:"<option  value='right'>右侧</option><option value='left' selected>默认左侧</option>"},
					{id:"yAxis-0-max",				lable:"最大刻度:",type:"spaceInput",width:"103px"},
					{id:"yAxis-0-min",				lable:"最小刻度:",type:"spaceInput",width:"103px"},
					{id:"yAxis-0-inverse",			lable:"Y轴反转:", 	type:"switchbutton", value:false},
					{id:"yAxis-0-axisLine-lineStyle-color",  lable:"Y轴颜色:", type:"color", value:"rgba(0,0,0,.8)",position:"bottom left-40"},
					{id:"yAxis-0-axisTick-show",  lable:"Y轴刻度:", 	type:"switchbutton", value:true},
					//{id:"bi-style-background",  lable:"Y轴数值缩放轴:", type:"switchbutton", value:true},
					{id:"yAxis-0-splitArea-show",  lable:"Y分割色:", type:"switchbutton", value:false},
					{id:"yAxis-0-splitLine-show",  lable:"Y分割线:", type:"switchbutton", value:false},

					{id:"",lable:"图形与画布的间距",style:"height:26px;line-height:26px"},
					{id:"grid-top",lable:"上:", type:"spaceInput",value:48,width:"36px"},
					{id:"grid-bottom",lable:"下:", type:"spaceInput",value:35,width:"36px","style":"position:absolute;bottom:80px;right:2px"},
					{id:"grid-left",lable:"左:", type:"spaceInput",value:15,width:"36px"},
					{id:"grid-right",lable:"右:", type:"spaceInput",value:35,width:"36px","style":"position:absolute;bottom:50px;right:2px"},
					{id:"bi-grid-yx",  lable:" X | Y轴互换:", type:"switchbutton", value:false,"style":"margin-left:1px;margin-top: 9px;padding-top: 9px;border-top:1px solid #ddd"},

				]
			},
			help:{
				"title":"辅助",
				state:"close",
				items:[
					//{id:"calculable",  lable:"拖动计算:", type:"switchbutton", value:true},
					{id:"tooltip-showContent",  lable:"悬浮提示:", type:"switchbutton", value:true,},
					{id:"toolbox-show",  lable:"辅助工具栏:", type:"switchbutton", value:true},
				]
			},
			penetrate:{
				//空，用于补丁面板全局空值
			}
		},
		getNameByType:function(chartType){
			switch (chartType){
				case "pie":
					return "饼图"
					break;
				case "bar":
					return "柱图"
					break;
				case "line":
					return "线图"
					break;
				case "scatter":
					return "散点图"
					break;
				case "funnel":
					return "漏斗图"
					break;
				case "radar":
					return "雷达图"
					break;
				case "gauge":
					return "仪表盘"
					break;
				case "map":
					return "地图"
					break;
				case "treemap":
					return "矩形树图"
					break;				
				case "heatmap":
					return "热力图"
					break;				
				default:
					return "图形"
					break;
			}
		}
	};
	return Desgin.control;
})