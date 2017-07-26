/*!
 *
 * @author zhump
EBuilder, According to the incoming data and configuration items, build ECharts.
Runing environment ECMAScript 5

By ECharts 3.1.6
   jQuery 1.4+
   underscore

Version 3.1
If you have questions, please email me at 695004175@qq.com
2016-07-18 添加注释 by shaojs
*/
;(function(factory) {
	//兼容AMD模块化
	if (typeof define === 'function' && define.amd) {
		var defineArry = ['echarts', 'underscore','colpick','view/widgets/property','cityMap']
		if (!jQuery) {
			defineArry.push('jquery');
		}
		define(defineArry, factory);
	}else if (typeof exports === 'object') {    //兼容CMD模块化
		factory(require('echarts', 'underscore','colpick','view/widgets/property','cityMap', 'jquery'));
	}else {
		factory(echarts, _, jQuery);  //非模块化
	}
})(function(echarts, _,cityMap, $){
	//处理一下jQuery
	if (!$) {
		$ = jQuery;
	}
	//默认参数
	var generalOption = {
		title: {
			itemGap: 5,
			padding: [9, 7]
		},
		legend: {
			padding: [8, 10]
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			textStyle:{
				fontSize:12
			}
		},
		toolbox: {
			show: true,
			padding: [5, 35],
			feature: {
				//dataZoom: [],
				restore: {}
			}
		}
	};
	var curTheme;
//	var chart;
//	var option;
//	var $this;
	//方法集合
	var methods = {
		//初始化方法(入口方法,扩展到jQuery对象上为EBuilder方法,当第一个参数为对象或者空时调用init方法.)
		init:function(){
			var $this = this;
			if ($this.length > 1) {
				console.warn('注意：EBuilder只会加载jQuery选择器匹配到的第一个元素');
			}
			var setting = {
				type: [], //grid:直角系  map:地图，gauge：仪表盘
				yx: false,
				ajaxURL: '',
				dataParams: '',
				series: [],
				seriesAuto: true
			};
			//获取配置(第一个参数)
			setting = $.extend(true, {}, setting, arguments[0]);

			var $container = $this.parents(".container");
			//获取主题名称 shaojs 201612131042
            var themeName = $container.data("option").config.build.theme;
			//获取第二个参数(从数据库读取数据)
			var isReal = arguments[1];
			//萃取type数组
			var typeArray = _.uniq(_.pluck(setting.series, 'type'));
			//请求数据库读取数据(异步画图)
			if(isReal === true){
				showLoading($container);
                //穿透展示判断参数goal是否为空

               if(typeof(goal)!="undefined"&&goal!=""){
                    data:setting.dataParams.chartLinkJsonStr=JSON.stringify(goal.chartLinkData);
                }
				if (setting.ajaxURL && !setting.data) {
					$.ajax({
						type: "POST",
						url: setting.ajaxURL,
						dataType: 'json',
						data:setting.dataParams,
						success: function(data) {
							setting.data = data;
							if(!data || data.length == 0 ){
								showNoData($this);
							}else{
								hideNoData($this);
								//加载主题插件js
                                var chart;
								require(['echarts', themeName], function(tarTheme){
									chart = install(typeArray,setting,undefined,undefined,undefined,themeName);
								});
								return chart;
							}
						},
						error: function() {
							log(JSON.stringify(arguments));
							closeLoading($container);
						}
					});
				}
			}else{   //更新图
				var source = echarts.getInstanceByDom($this[0]).getOption();
				var legendData = source.legend[0].data;
				var xAxisData;

				//XY轴是否互换(横向图),先换回来,在buildChartOption才能统一处理,之后在install中再次交换
				if(setting.yx){
					xAxisData = source.xAxis?source.yAxis[0].data:[];
				}else{
					xAxisData = source.xAxis?source.xAxis[0].data:[];
				}

				var series = [];
				_.mapObject(source.series, function(obj) {
					series.push({
						"name": obj.name,
						"data": obj.data
					})
				});
				return install(typeArray,setting,legendData,xAxisData,series,themeName);
			}

			//新建和更新chart方法
			function install(typeArray,setting,legendData,xAxisData,series,themeName) {
				//组装option
				var option = $.extend(true, {}, buildChartOption(typeArray,setting,legendData,xAxisData,series), setting.option);
				//根据坐标轴的数值大小进行单位换算
				if(setting.xIsSwitch == 1 && !!option.xAxis && _.indexOf(typeArray, 'heatmap') <= -1){//如果X轴单位换算开关开启
					option.xAxis[0].axisLabel.formatter = function(value){
						return unitSwitch(value);
					}
				}

				if(setting.yIsSwitch == 1 && !!option.yAxis && _.indexOf(typeArray, 'heatmap') <= -1){//如果Y轴单位换算开关开启
					option.yAxis[0].axisLabel.formatter = function(value){
						return unitSwitch(value);
					}
				}
				
				//y轴最大值设置(在类目类型的轴中无效)
				if(option.yAxis && option.yAxis[0].max == 0){
					option.yAxis[0].max = null
				}

				//XY轴是否互换(横向图需要交换XY轴)
				if (setting.yx) {
					var temp = option.xAxis;
					option.xAxis = option.yAxis;
					option.yAxis = temp;
				}

				var build_series = option.series;
				var custom_series = setting.series;
				var new_series = [];
				//仪表盘图需要特殊处理
				if(['gauge'].indexOf(setting.type) > -1){
					option.series = build_series;
				}else{
					//将series分成
					if (setting.seriesAuto) {
						//单例就自动规整不同图形(单例就是只有一种图表类型的图)
						new_series = autoSeries(custom_series, build_series.length);
					} else {
						var seriseIndex = setting.seriseIndex;
						_.each(seriseIndex,function(num){
							new_series.push(custom_series[num])
						})
					}
					//合并最终series配置项
					if(new_series.type == 'radar'){
						option.series = $.extend(true, {}, build_series, new_series);
						option.series.name = _.pluck(build_series.data,"name").join("&");
						//option.radar[0].indicator = se
					}else{
						option.series = _.toArray($.extend(true, {}, build_series, new_series));
					}
				}

				if(setting.dataParams.chartType == 'barMix'){
					option.series = buildMixChartSeries(option, setting);
				}
				//添加主题配置 shaojs 201612131034
				//单个主题优先于全局主题 yetf 2017/5/12
				if(!!$container.data('option').config.build.theme){
					themeName=$container.data('option').config.build.theme;
				}

				var _echarts = echarts.init($this[0],themeName);
				//log("最终echarts生成配置项");
				//log(option);
				//热力地图数据拼接
				function convertData(option,map){
					var res = [];
					var data=option.series[0].data;
					var map=map.features;
					var dataLen=data.length;
					var mapLen=map.length;
					var symbolSize1=function (val) {
						return val[2] / 30;
					};
					if(option.series[0].type=="effectScatter"){
						//为气泡统计地图添加全图气泡点
						option.series[1]= {
							name:option.series[0].name,
							type: 'scatter',
							coordinateSystem: 'geo',
							data: data,
							symbolSize: symbolSize1,
							label: {
								normal: {
									formatter: '{b}',
									position: 'right',
									show: false
								},
								emphasis: {
									show: true
								}
							},
							itemStyle: {
								normal: {
									color: '#ddb926'
								}
							}
						}
						for (var i = 0; i < dataLen; i++) {
							for(var j=0;j<mapLen;j++){
								var tempRes=[];
								if(data[i].name==map[j].properties.name){
									var valueTemp=parseInt(data[i].value);
									option.series[1].data[i].value=[];
									option.series[1].data[i].value.push(map[j].properties.cp[0]);
									option.series[1].data[i].value.push(map[j].properties.cp[1]);
									option.series[1].data[i].value.push(valueTemp);
								}
							}
						}
						//为气泡统计地图添加全图气泡点
						var res1=[];
						var data1=option.series[0].data.sort(function (a, b) {
							return b.value[2] - a.value[2];
						}).slice(0,5);
						option.series[0].data=data1;
					}else{
						for (var i = 0; i < dataLen; i++) {
							for(var j=0;j<mapLen;j++){
								var tempRes=[];
								if(data[i].name==map[j].properties.name){
									var valueTemp=parseInt(data[i].value);
									option.series[0].data[i].value=[];
									option.series[0].data[i].value.push(map[j].properties.cp[0]);
									option.series[0].data[i].value.push(map[j].properties.cp[1]);
									option.series[0].data[i].value.push(valueTemp);
								}
							}
						}
					}
				}

				/*对legend个数进行限制，默认显示3个，如果以后有需要在desgin.js中也要处理
				* legendLimite函数，
				* 图例颜色
				* yetf
				* */
				function legendLimite(){
					//取全局主题
					if(!$container.data('option').config.build.theme){
						if(!!$container.data('option').themeName&&!sessionStorage.themeName){
							themeName=$container.data('option').themeName;
						}else if(!!$container.data('option').themeName&&!!sessionStorage.themeName){
							themeName=sessionStorage.themeName;
							$container.data('option').themeName=themeName;
						}else if(!$container.data('option').themeName&&!!sessionStorage.themeName){
							themeName=sessionStorage.themeName;
							$container.data('option').themeName=themeName;
						}
					}
                    //var limiteNum=$("#legend-limite").val();
                    //if条件之一&&(!!$container.data("colorTemp"))==false
					if((!!$container.data('option').colorTemp)==true) {
						$container.data("colorTemp", $container.data('option').colorTemp);
						$container.data("legendData", $container.data('option').legendData);
					}else{
						var colorDefault = [];
                        switch(themeName){
                            case 'macarons':colorDefault=['#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80','#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa','#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050','#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'];break;
                            case 'roma':colorDefault=['#E01F54','#001852','#f5e8c8','#b8d2c7','#c6b38e','#a4d8c2','#f3d999','#d3758f','#dcc392','#2e4783','#82b6e9','#ff6347','#a092f1','#0a915d','#eaf889','#6699FF','#ff6666','#3cb371','#d5b158','#38b6b6'];break;
                            case 'vintage':colorDefault=['#d87c7c','#919e8b','#d7ab82','#6e7074','#61a0a8','#efa18d','#787464','#cc7e63','#724e58','#4b565b'];break;
                            case 'infographic':colorDefault=['#C1232B','#27727B','#FCCE10','#E87C25','#B5C334','#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD','#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'];break;
                            case 'shine':colorDefault=['#c12e34','#e6b600','#0098d9','#2b821d','#005eaa','#339ca8','#cda819','#32a487'];break;
                            case 'dark':colorDefault=['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab','#91ca8c','#f49f42'];break;
                            default: colorDefault = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];

                        }
						$("[proptype=colorSet] .propContanier").empty();
						if (!!option.legend && !!option.legend.data) {
							var colorTemp = [];
							var flagLen = option.legend.data.length
							var i = 0;
							var a = 0;
							while (i < flagLen) {
								if (a >= 11) {
									a = 0;
								}
								methods.buildColor(option.legend.data[i], colorDefault[a]);
								colorTemp.push(colorDefault[a]);
								i++;
								a++;
							}
							//installPropWidgets();
							$container.data("colorTemp", colorTemp);
							$container.data("legendData", option.legend.data);
						}
					}
					if(!!$container.data("colorTemp")){
						option.color=$container.data("colorTemp");
					}
                    //delete option.color;
					_echarts.setOption(option);
					/*需求说先不要了，
					if(!!option.legend&&!!option.legend.data&&option.legend.data.length>limiteNum){
						option.legendOld=option.legend.data;
						var optionShow=option;
						optionShow.legend.data=option.legend.data.slice(0,limiteNum);
						_echarts.setOption(optionShow);
                        $("[_echarts_instance_="+_echarts.id+"]").next(".moreLeg").remove();
						$("[_echarts_instance_="+_echarts.id+"]").after('<div class="moreLeg">+</div>');
						$(".moreLeg").click(function(){
							var myChart1 = echarts.getInstanceByDom($(this).prev()[0]);
                            var legendChange=myChart1.getOption().legendOld;
							myChart1.setOption({
								legend: {
									data:legendChange
								}
							});
							$(this).hide();
						});
					}else{
						_echarts.setOption(option);
					}*/
				}
				//如果有地图,则注册地图
				if(_.indexOf(typeArray, "map") > -1){
					var mapType = option.series[0].mapType || "china";
					var mapLocal = mapType.replace("_","/");
					$.get(resPath+'/resources/platform/dataview/js/jquery/echarts/map/'+ mapLocal +'.json', function(map) {
						echarts.registerMap(mapType, map);
						option.tooltip={
							trigger: 'item',
							formatter:function(params){//新增地图单位改变 gaoya 20170531
								var res = params.name+'<br/>';
								var myseries = option.series;
								for (var i = 0; i < myseries.length; i++) {
									for(var j=0;j<myseries[i].data.length;j++){
										if(myseries[i].data[j].name==params.name){
											res+=myseries[i].name +' : '+myseries[i].data[j].value+myseries[i].dataUnit;
										}
									}
								}
								return res;
							}
						};
						//_echarts.setOption(option);
						legendLimite();
					})
				}else if(_.indexOf(typeArray, "heatmap1") > -1||_.indexOf(typeArray, "effectScatter")>-1 ){
					var mapType = option.series[0].mapType || "china";
					var mapLocal = mapType.replace("_","/");
					$.get(resPath+'/resources/platform/dataview/js/jquery/echarts/map/'+ mapLocal +'.json', function(map) {
						echarts.registerMap(mapType, map);
						convertData(option,map);//拼接热力地图数据，根据名称匹配经纬度
						if(_.indexOf(typeArray, "heatmap1") > -1){
							option.series[0].type="heatmap";
						}else{
							option.tooltip={trigger: 'item'};
							option.series[0].symbolSize=function (val) {
								return val[2] / 30;
							};
						}
						//_echarts.setOption(option);
						legendLimite();
					})
				} else {
					//直接画图
					legendLimite();
				}
				if(isReal === true){
					//实时加载的话,在加载结束之后关闭"正在加载"提示
					closeLoading($container);
				}
				//触发完成事件 add by shaojs
				$(window).trigger("chart.rander.complete",[$this[0],setting]);

				return _echarts;
			}

			/**
			 * 坐标轴数值单位换算
			 * @param value
			 * @returns {String}
			 */
			function unitSwitch(val){
				var value = val + "";
				if(!isNaN(val)){//数值
					if(val%1 === 0){//整数
						if(val.toString().length <= 6 && val.toString().length > 4){//万-十万
							value = val/1000 + "K";
						}else if(val.toString().length <= 9 && val.toString().length > 6){//百万-亿
							value = val/1000000 + "M";
						}else if(val.toString().length <= 12 && val.toString().length > 9){//十亿-千亿
							value = val/1000000000 + "B";
						}
					}
				}
				return value;
			}

			//增加混搭图 add by lifeilong
			function buildMixChartSeries(option, setting){
				var series = option.series||[];
				//创建两个Y轴
				option.yAxis.push(option.yAxis[0]);
				//分别构造柱图和线图的数据并加入到option.series
				var mixSeries = [];
				$.each(series,function(index,value){
					var lineObj = $.extend(true, {}, value);
					var barObj = $.extend(true, {}, value);
					lineObj.type = "line";
					barObj.type = "bar";
					lineObj.yAxisIndex = 1;
					mixSeries.push(lineObj);
					mixSeries.push(barObj);
				});

				//交换XY轴
				if (setting.yx) {
					var temp = option.xAxis;
					option.xAxis = option.yAxis;
					option.yAxis = temp;
				}
				return mixSeries;
			}
			/*
			 *组装chart的option
			 */
			function buildChartOption(typeArray,setting,legendData,xAxisData,series){
				var legendData = legendData;
				var xAxisData = xAxisData;
				var series = series||[];
				var option = {};
				if(legendData === undefined && _.indexOf(typeArray, "gauge") == -1){
					//初步解析维度数据
					if(setting.data[0].group){
					    var names = _.union(_.pluck(setting.data,"name"));
                        var groups =  _.union(_.pluck(setting.data,"group"));
                        if(setting.data.length != (names.length)*(groups.length)){
                            setting.data = fixData(names,groups,setting.data);
                        }
						var groupObject = _.groupBy(setting.data, 'group');
						legendData = _.keys(groupObject);
						//取groupObject的第一个属性,萃取name属性,做x轴的数组数据(_.indexObj方法是自己扩展的)
						//groupObject是分组数据,所有元素结构是一样的,所以随便取一个都可以
						xAxisData = _.pluck(_.indexObj(groupObject, 0), 'name');
						_.mapObject(groupObject, function(val, key) {
							series.push({
								"name": key,
								"data": val
							})
						});
					}
				}

				/**
                 * author:shaojs
                 * date:20160831
                 * desc:当后台数据个数不等于name数*group数的时候,说明有缺失数据,此时需要填充一些空数据
                 * */
				function fixData(names,groups,data){
				    var groupsLength = groups.length;
                    var lostDataCount = (names.length)*(groups.length) - data.length ;
                    var groupedNameList = _.groupBy(data,"name");
				    _.each(names,function(value,index){
				        var currentName = value;
				        var currentList = groupedNameList[currentName];
                        if(!(currentList.length === groupsLength)){
                            groupedNameList[currentName] = _.map(groups,function(value,index){
                                return _.find(currentList,function(e){ return e.group === value}) ||(lostDataCount-- , {
                                    name:currentName,
                                    value:0,
                                    group:value
                                });
                            });
                        }
                        return !!lostDataCount;
                    });
                    return _.flatten(_.values(groupedNameList));
                }

				//以下是根据各个图表类型来组装option选项
				if(_.indexOf(typeArray, "gauge") > -1){
					var _series = [];
					if(setting.data){
						_.each(setting.data,function(obj){
							_series.push({
								data:obj
							})
						})
					}else{
						_.each(series,function(obj){
							_series.push({
								data:obj.data
							})
						})
					}
					option.series = _series;
					option.tooltip = {
						formatter: "{b}:{c} ",
						trigger:'item'
					};

				}
				if(_.indexOf(typeArray, "radar") > -1){
					option.legend = {
						data: legendData
					};

					var indicator = {};
					var name2value = {};
					_.each(series,function(serie){
						name2value[serie.name] = [];
						_.each(serie.data,function(obj){
							var _value =  obj.value;
							name2value[serie.name].push(_value);
							if (indicator.hasOwnProperty(obj.name)) {
								if (parseInt(_value) > parseInt(indicator[obj.name])) {
									indicator[obj.name] = _value;
								}
							}else{
								indicator[obj.name] = _value;
							}
						})
					});
					var array =[];
					_.each(indicator,function(num,key){
						array.push({
							text: key,
							max: Math.ceil(parseInt(num) + (parseInt(1 + (num + "").substr(1).replace(/\d/g, '0')) / 3))
						})
					});
					option.radar =[{"indicator":array}];
					var temp = series[0];
					temp.data = [];
					_.map(name2value,function(value,key){
						temp.data.push({
							name:key,
							value:value
						})
					});
					option.series = temp;
					option.tooltip = {
						trigger: 'item'
					};
				}
				if(_.intersection(typeArray, ['pie','funnel']).length > 0){
					option.tooltip = {
						trigger: 'item'
					};
					option.series = series;
					option.legend = {
						data:_.pluck(series[0].data, 'name')
					};
				}
				if(_.indexOf(typeArray, "map") > -1){
					var valueArray = [];
					_.each(series, function(obj) {
						valueArray.push(_.pluck(obj.data,"value"));
					});
					var _tempArray = _.union.apply({},valueArray).filter(function(obj){
						return obj||0;
					});

                    //如果只有一个值,补充一个值,否则最大值最小值就一样了
                    if(_tempArray.length === 1){
                        _tempArray.push(1 + parseFloat(_tempArray[0]));
                    }

					//值域
					option.visualMap = {
						min: Math.min.apply({}, _tempArray),
						max: Math.max.apply({}, _tempArray),
						left: 'left',
						top: 'bottom',
						text: ['高', '低'],
						calculable: true
					};
					option.series = series;
					option.legend = {
						data: legendData,
					};

					if(_.uniq(typeArray).length > 1){
						option.visualMap.seriesIndex = _.indexOf(typeArray, "map");
					}else{
						option.legend.selectedMode =  'single';
					}
					option.tooltip = {
						trigger: 'item'
					};
				}

				//新增矩形树图
				if(_.indexOf(typeArray, "treemap") > -1){
					option.tooltip = {
						trigger: 'item'
						// ,formatter: function (info) {
						// 	var name = info.name;
						// 	var value = info.value;
						// 	return [
						// 		'<div class="tooltip-title">' +info.name + '</div>',
						// 		name + " : " + value,
						// 	].join('');
						// }
					};

					function convert(source, target, basePath) {
						for (var key in source) {
							var path = basePath ? (basePath + '.' + key) : key;
							if (key.match(/^\$/)) {

							}
							else {
								target.children = target.children || [];
								var child = {
									name: path,
									idx : 'test'
								};
								target.children.push(child);
								convert(source[key], child, path);
							}
						}

						if (!target.children) {
							target.value = source.$count || 1;
							target.idx = "test";
						}
						else {
							target.children.push({
								name: basePath,
								value: source.$count,
								idx : 'test'
							});
						}
					}

					var ndata = [];
					var rawData = setting.data;
					//convert(rawData,ndata,'');
					var _series = [];
					var op = setting.series[0];
					//op.data = ndata.children;
					op.data = rawData;
					_series.push(op);
					option.series = _series;
				}

				//新增热力统计地图
				if(_.indexOf(typeArray, "heatmap1") > -1){

					option.visualMap = {
						inRange: {
							color: ['#d94e5d','#eac736','#50a3ba'].reverse()
						},
						textStyle: {
							color: '#fff'
						}
					};
					option.backgroundColor= '#404a59';
					option.geo= {
						map: 'china',
						label: {
							emphasis: {
								show: false
							}
						},
						roam: true,
						itemStyle: {
							normal: {
								areaColor: '#323c48',
								borderColor: '#111'
							},
							emphasis: {
								areaColor: '#2a333d'
							}
						}
					};
					option.series = series;

				}
				//新增气泡统计地图
				if(_.indexOf(typeArray, "effectScatter") > -1){
					option.backgroundColor='#404a59';
					option.geo= {
						map: 'china',
						label: {
							emphasis: {
								show: false
							}
						},
						roam: true,
						itemStyle: {
							normal: {
								areaColor: '#323c48',
								borderColor: '#111'
							},
							emphasis: {
								areaColor: '#2a333d'
							}
						}
					};
					option.series =series;
				}

				if(_.indexOf(typeArray, "scatter") > -1){
					//获得横纵相对应的值
					var xyData = series[0].data[0],
						xyNameAarry = xyData.name;
					option.tooltip = {
				        trigger: 'axis',
				        formatter : function (params) {
				            if (params.value.length > 1) {
				            	var html = params.seriesName;
				            	_.each(xyNameAarry,function(val,index){
				            		html += '<br/>'  + xyNameAarry[index]+ ':' + params.value[index];
				            	});
				                return html;
				            }
				            else {
				                return params.seriesName + ' :<br/>'
				                   + params.name + ' : '
				                   + params.value + ' ';
				            }
				        },
				        axisPointer:{
				            show: true,
				            type : 'cross',
				            lineStyle: {
				                type : 'dashed',
				                width : 1
				            }
				        }
				    };
					option.legend = {
						data:  legendData
					};
					var xyValue = xyData.value;
					if(typeof(xyValue[0]) == 'number'){
						option.xAxis = [{
							type:'value',
							boundaryGap: true,
							splitLine: {
								show: false
							}
						}];
					}else{
						var keys = {};
						_.each(series[0].data,function(data){
							keys[data.value[0]] = "";
						});
						option.xAxis = [{
							type: 'category',
							data:_.keys(keys),
							boundaryGap: true,
							splitLine: {
								show: false
							}
						}];
					}
					//Y轴
					option.yAxis = [{
						type: 'value',
						max:null,
						splitLine: {
							show: false
						}
					}];
					option.grid = {
						containLabel: true
					};
					//交换XY轴
//					if (setting.yx) {
//						var temp = option.xAxis;
//						option.xAxis = option.yAxis;
//						option.yAxis = temp;
//					}
					_.each(series,function(serie){
						serie.symbolSize = function(vals){
							return vals[2]||8;
						};
					});
					option.series = series;
				}

				if(_.intersection(typeArray, ['line','bar']).length > 0){
					option.legend = {
						data:  _.pluck(series,'name')
					};

					var xAxis = _.pluck(series[0].data,'name');
//					if(_.indexOf(typeArray, "scatter") > -1){
//						_.each(series,function(serie){
//							var temp = _.pluck(serie.data,'name');
//							if(xAxis.length < temp.length){
//								xAxis = temp;
//							}
//						})
//					}
					//X轴
					option.xAxis = [{
						type: 'category',
						boundaryGap: true,
						splitLine: {
							show: false
						},
						data:xAxis
					}];
					option.series = series;
					if(_.indexOf(typeArray, "map") > -1){
						var mapxAxisData = [];
						_.each(series[0].data,function(obj){
							if(obj.value){
								mapxAxisData.push(obj.name)
							}
						});
						option.xAxis[0].data = mapxAxisData;
						_.map(series,function(obj){
							obj.data = obj.data.slice(0,mapxAxisData.length);
						});
						option.series = series;
					}

					//Y轴
					option.yAxis = [{
						type: 'value',
						splitLine: {
							show: false
						}
					}];
					option.grid = {
						containLabel: true
					};
					//交换XY轴
//					if (setting.yx) {
//						var temp = option.xAxis;
//						option.xAxis = option.yAxis;
//						option.yAxis = temp;
//					}
					//柱状图单根柱子显示 gaoya 20161009
					if(_.indexOf(typeArray,"bar")>-1){
						option.tooltip = {
							trigger: 'item'
						}
					};
					//判断boundaryGap为true,如果类型只为line，就为false
					if(typeArray.length==1 && typeArray[0]=='line'){
						option.xAxis[0].boundaryGap = false;
						option.tooltip = {
							axisPointer:{
								type:'line'
							}
						}
					}
				}

				if(_.indexOf(typeArray, 'heatmap') > -1){

					var xAxis = _.pluck(series[0].data,'xname');

					var yData = _.pluck(series[0].data,'yname');

					var uniqueX = new Array();
					var uniqueY = new Array();

					for(var i=0; i<xAxis.length; i++)
					{
						if(uniqueX.indexOf(xAxis[i]) == -1)
						{
							uniqueX.push(xAxis[i]);
						}
					}

					for(var i=0; i<yData.length; i++)
					{
						if(uniqueY.indexOf(yData[i]) == -1)
						{
							uniqueY.push(yData[i]);
						}
					}


					//X轴
					option.xAxis = [{
						type: 'category',
						data:uniqueX,
						splitArea: {
							show: true
						}
					}];

					//Y轴
					option.yAxis = [{
						type: 'category',
						data: uniqueY,
						splitArea: {
							show: true
						}
					}];

					option.tooltip = {};

					option.visualMap = {
						min: 0,
						max: 1,
						calculable: true,
						realtime: false,
						orient: 'horizontal',
						left: 'center',
						bottom: '0%',
						inRange: {
							color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
						}
					};

					option.series = series;
					//option.series = seriesData;
				}
				return $.extend(true, {}, generalOption, option);
			}
			/**
			 * 根据不同的图形类型，自动规整series属性
			 * @param {Object} custom_series
			 * @param {Object} series_count
			 */
			function autoSeries(custom_series, series_count) {
				var new_series = [];
				var custom_serie = custom_series[0];
				var type = custom_serie.type;
				if (type == 'pie' ) {
					var coordinate = [];
					for (var len = series_count + 1, i = len, index = 0; i > 0; i--, index++) {
						coordinate.push(parseInt(110 / len) + parseInt(coordinate[index - 1] || 1));
					}
					for (var j = 0; j < series_count; j++) {
						var pieSerie = {
							type: 'pie',
							name:custom_serie.name,
							radius: custom_serie.radius || '45%'
						};
						custom_serie.center = [coordinate[j] - 5 + '%', '50%'];
						new_series.push($.extend(true, {}, pieSerie, custom_serie));
					}
				} else if (type == 'funnel') {
					var coordinate = [];
					for (var len = series_count + 1, i = len, index = 0; i > 0; i--, index++) {
						coordinate.push(parseInt(100 / len) + parseInt(coordinate[index - 1] || 1));
					}
					var left = [0,22,15,10,7][series_count.length>5?5:series_count]||5;
					for (var j = 0; j < series_count; j++) {
						var funnelSerie = {
							type: 'funnel',
							name:custom_serie.name
						};
						custom_serie.left = coordinate[j] - left  + '%';
						custom_serie.width = 40 / series_count + '%';
						new_series.push($.extend(true, {}, funnelSerie, custom_serie));
					}
				} else if (type == 'gauge') {
					var coordinate = [];
					for (var len = series_count + 1, i = len, index = 0; i > 0; i--, index++) {
						coordinate.push(parseInt(110 / len) + parseInt(coordinate[index - 1] || 1));
					}
					for (var j = 0; j < series_count; j++) {
						var pieSerie = {
							type: 'gauge',
							name:custom_serie.name,
							radius: custom_serie.radius || '45%'
						};
						custom_serie.center = [coordinate[j] - 5 + '%', '55%'];
						new_series.push($.extend(true, {}, pieSerie, custom_serie));
					}
				} else if (type == 'map') {
					custom_serie.left = 'center';
					custom_serie.top = 'middle';
					custom_serie.width = 'auto';
					for (var j = 0; j < series_count; j++) {
						new_series.push($.extend(true, {}, custom_serie));
					}

				}else if (type == 'radar') {
					new_series = custom_serie;
				}else if(type=="heatmap1"){
					for (var j = 0; j < series_count; j++) {
						new_series.push($.extend(true, {}, custom_serie));
					}
				}else if(type=="effectScatter"){
					for (var j = 0; j < series_count; j++) {
						new_series.push($.extend(true, {}, custom_serie));
					}
				}else {
					for (var j = 0; j < series_count; j++) {
						new_series.push(custom_serie)
					}
				}
				return new_series;
			}
		},
		//图例canvas颜色动态变化
		echartsColor:function(ids,colorData){
			var $dom=$("#"+ids+" [_echarts_instance_]");
			var myChart1 = echarts.getInstanceByDom($dom[0]);
			myChart1.setOption({
					color:colorData
			});
		},
		//构建颜色图例面板
		buildColor : function(legendData,colorData){
			var item={id:"title-textStyle-color",	lable:legendData,type:"color",value:colorData,position:"bottom left-60"};
			function _buildProp(item){
				var type = item.type;
				if(type == 'color'){
					return '<div class="chooseTool">'+
						'<div class="choose-color"></div>'+
						'<input id="'+item.id+'" collect-special="color" data-position="'+item.position+'" data-format="rgb"  type="hidden" value="'+item.value+'" />'+
						'<div class="chooseToolDown">'+
						'<i class="fa fa-caret-down"></i>'+
						'</div>' +
						'</div>';
				}else if(type== 'select'){
					return '<select id="'+item.id+'" collect-special="select" style="width:'+item.width+'">'+item.selectHTML+'</select>';
				}else if(type== 'switchbutton'){
					return '<input id="'+item.id+'" '+(item.value?"checked":"")+'  collect-special="checkbox" type="checkbox" class="switchbutton" style="width: 48px;" />'
				}else if(type== 'input'){
					return '<input type="text" id="'+item.id+'" style="width:'+(item.width||"143px")+'" class="input" />';
				}else if(type== 'spaceInput'){
					return '<input class="spaceInput" data-max="'+item.max+'" data-max="'+item.min+'" collect-special="int" id="'+item.id+'" type="text"  style="width:'+item.width+'" value="'+(item.value||0)+'"/>';
				}else if(type== 'slider'){
					return '<div id="'+item.id+'"data-value="'+item.value+'" data-max="'+item.max+'" data-min="'+item.min+'" collect-special="slider"  class="slider" style="width:'+item.width+'"></div>'
				}else if(type == 'selectcolor'){
					return '<div class="chooseTool chooseAdd">'+
						'<div class="indicator-color">' +
						// '<input id="'+item.id+'" collect-special="indicatorColor" data-position="'+item.position+'" data-format="rgb"  type="hidden" value="'+item.value+'" />' +
						'<div  id="'+item.id+'"data-value="'+item.value+'" collect-special="selectcolor" class="colorContainer"'+'><span></span><b></b></div>' +
						'<div class="chooseToolDown"><i class="fa fa-caret-down"></i></div>' +
						'</div>'+
						'<ul>' +
						'<li><span>红色</span><b></b></li>' +
						'<li><span>蓝绿色</span><b></b></li>' +
						'<li><span>蓝色</span><b></b></li>' +
						'<li><span>黄色</span><b></b></li>' +
						'<li><span>橘色</span><b></b></li>' +
						'<li><span>紫色</span><b></b></li>' +
						'<li><span>玫红色</span><b></b></li>' +
						'<li><span>绿色</span><b></b></li>' +
						'</ul>'+
						'</div>'
				}

			}
			//颜色选择
			function installPropWidgets(){
				var $propPanel = jQuery("#chart-property>.propPanel");
				//颜色选择器触发事件
				$(".chooseTool",$propPanel).click(function() {
					$("input", this).minicolors('show');
				})

				//颜色选择器
				$('.chooseTool input[collect-special="color"]', $propPanel).minicolors({
					opacity: false,
					change: function(hex, opacity) {
						var log;
						try {
							log = hex ? hex : 'transparent';
							if( opacity ) log += ', ' + opacity;
						} catch(e) {}
					},
					colorSelectors: {
						'#777777': '#777777',
						'#337ab7': '#337ab7',
						'#5cb85c': '#5cb85c',
						'#5bc0de': '#5bc0de',
						'#f0ad4e': '#f0ad4e',
						'#d9534f': '#d9534f'
					}
				});


			}
			$("[proptype=colorSet] .propContanier" ).append('<div class="items"><div class="label" style="width:60px;overflow: hidden;height:20px' +
				'">'+legendData+':</div><div class="config">'+_buildProp(item)+'</div></div>');
			installPropWidgets();

		},
		getInstanceByDom:function(){
			return echarts.getInstanceByDom($(this)[0]);
		},
		getSeriesByName:function(){
			return _.findWhere(echarts.getInstanceByDom($(this)[0]).getOption.series, {
				name: name
			});
		},
		setTheme:function(themeName){
			var $this = $(this);
			require(['echarts', themeName], function(tarTheme){
				var container = $this.parent("div");
                //挂载主题信息
                container.data("option").config.build = container.data("option").config.build || {};
                container.data("option").config.build.theme  = themeName;

                //清除连接信息
                container.find(".chainInfo").empty().hide();
                container.data("isLinked",false);
                //清除下钻信息
                container.data("drillSettingList",[]);
                container.find(".breadcrumbs").hide();

                var option = $.extend(true, {}, container.data("option"));
                $this.EBuilder(option.config.build,true);
            });
			//jQuery("#"+n).data("option").build.theme  = Box.Header.tools.themeName;
		},
		
		_on:function(event,callback){  //绑定事件
			if(!event || (typeof event) != 'string'){
				log("无法绑定事件:无效的事件类型!");
				return false;
			}
			if(!callback || !$.isFunction(callback)){
				log("无法绑定事件:无效的回调函数!");
				return false;
			}
			var $this = $(this);
			var chart = echarts.getInstanceByDom($this[0]);
			//这里的this是将echarts对象用$包装起来的,所以直接取出来就可以用了

			if(!chart){
				log("无法绑定事件:找不到echarts实例!");
				return;
			}
			var args = Array.prototype.slice.call(arguments, 2);
			chart.on(event,function(event){
				var arg = $.merge([event],args);
				callback.apply(this,arg);
			});
		},
		_off:function(event){  //解除绑定事件,由于上面的绑定是匿名函数所以根据event干掉所有的函数
			if(!event || (typeof event) != 'string'){
				log("无法解绑事件:无效的事件类型!");
				return false;
			}

			var $this = $(this);
			var chart = echarts.getInstanceByDom($this[0]);

			//如果没有获得echarts实例,直接返回
			if(!chart) return;
			chart.off(event);
		},
		drill:function(s,e){  //数据下钻
			var setting = $.extend(true, {}, s); //复制参数
			var container = $(this).parent("div");

            //已经做了连接的表不能下钻
            if(!!container.data("isLinked")) return;

			var option = $.extend(true, {}, container.data("option"));

            //从setting.data获取查询参数的真实字段名(dimKey),防止翻译过后查询条件无效
            var dimKey = (_.find(setting.data, {name:e.name})) && (_.find(setting.data, {name:e.name})).dimKey;

			setting.data = null; //清空data(否则无法重新发送请求到后台)

			//挂载下钻参数到container
			var drillSettingList = container.data("drillSettingList") || [];
			drillSettingList.push($.extend(true, {}, setting));
			container.data("drillSettingList",drillSettingList);

            //地图下钻,需要设置新的mapType
            if(option.chartType == "map"){
                var chartChild = (setting.series[0].mapType || "china").split("_");
                chartChild = chartChild[chartChild.length -1];
                var mapObjectList = cityMap[chartChild];

                //如果没有找到对应的地图列表就结束
                if(!mapObjectList) return;
                var mapObject = mapObjectList[e.name];
                //如果没有找到对应的地图就结束
                if(!mapObject) return;
                var mapType = mapObject.parent + "_" + mapObject.name;
                setting.series[0].mapType = mapType;
            }

			//设置下钻参数
			var dimAttrData = $.parseJSON(setting.dataParams.dimAttrJsonStr);
			var currentDim = dimAttrData.dimData[0];

            //attrClass 0：普通字段；1：自定义字段；2：报表自定义字段；3：日期格式化自定义字段,只有这两种维度可以联动和下钻
            if(!(currentDim.attrClass == "0" || currentDim.attrClass == '2' || currentDim.attrClass == "3")) return;
            //有 levelId 说明引用了分档,不能下钻
            if(currentDim.levelId) return ;

			var dimArr = option.config.dataPanel.dimData;
			//如果只有一个维度
			if(dimArr.length <=1 ) return;
			//查询当前维度的位置
			var dimIndex = _.findIndex(dimArr,{attrId: currentDim.attrId});

			//搜索下一个非checked的维度
			var i = 1,nextDim = dimArr[dimIndex+i];
			while(nextDim && nextDim.isChecked){
				i++;
				nextDim = dimArr[dimIndex+i];
			}
			//如果木有下一个维度则退出
			if(!nextDim) return;

			//组装下钻参数
			var parentDimInfo = currentDim.parentDimInfo || [];

			parentDimInfo.push({
				"attrId"     : currentDim.attrId,
                "attrClass"  : currentDim.attrClass,
				"attrName"   : currentDim.attrName,
				"attrType"   : currentDim.attrType,
				"filterType" : currentDim.filterType,
				"attrValue"  : dimKey || e.name,  //查询参数优先选择dimKey
                "breadcrumbsName":e.name
			}); //将参数入栈
			//将参数加入查询参数,并序列化
			nextDim.isdrill = true;
			nextDim.parentDimInfo = parentDimInfo;
			dimAttrData.dimData[0] = nextDim;
			setting.dataParams.dimAttrJsonStr = JSON.stringify(dimAttrData);

			//log("后台接受的数据:",dimAttrData,setting,option);
			//刷新图表
			$(this).EBuilder(setting,true);
			setBreadcrumbs(container,setting,nextDim);
		},
		undrill:function(level){
			var container = $(this).parent("div");
			var drillSettingList = container.data("drillSettingList") || [];
			//点击的是最后一个面包屑,不做处理
			if(level === drillSettingList.length) return;

			var setting = drillSettingList[level];

			//切割下钻参数,重新挂载
			drillSettingList = drillSettingList.slice(0,level);
			container.data("drillSettingList",drillSettingList);
			//刷新图表
			$(this).EBuilder(setting,true);
			setBreadcrumbs(container,setting);
		},
        /**
         * 图表关联方法,抽离了参数组装到buildChainParam的方法中,可以指定参数组装方法,方便复用
         * @param setting  从图触发的关联,这里是图的setting,从别的地方触发的关联,这里可能是别的参数
         * @param event   从图触发的关联,这里是echarts的点击event,从别的地方触发的关联,这里可能是别的参数
         * @param method  参数组装方法名称,默认是"buildChainParam4chart"
         */
        chainChart:function(chainParam){
            //如果chainParam为false值,表示不符合表连接条件,直接退出
            if (!chainParam) return;
            //处理url
            var url = handleUrlParam("/platform/dataview/get-chart-link");
            //查询关联的图表列表
            $.ajax({
                url: url,
                method:"POST",
                data: {linkJsonStr:JSON.stringify(chainParam.queryChainParam)},
                dataType: "json",
                success:function(data){
                    data = data.chartIds;
                    //根据列表,依次刷新图表
                    if(data.length){
                        $.each(data,function(i,e){
                            var container = $("#"+e);
                            var option = $.extend(true, {}, container.data("option"));
                            //log(e+"的option:",option);
                            var setting = option.config.build;
                            var chartLinkData = chainParam.chartLinkData;
                            setting.dataParams.chartLinkJsonStr = JSON.stringify(chartLinkData);
                            //如果有下钻的图表,先清空下钻参数隐藏下钻导航再进行关联
                            container.data("drillSettingList",[]);
                            container.find(".breadcrumbs").hide();

                            //这里只能处理图表,表格需要触发挂载在window上的"table.chain"事件,让表格动作
                            container.data("isLinked",true);
                            setLinkInfo(container,chainParam.name);
                            if(container.find(".chart:visible").length){
                                container.find(".chart:visible").EBuilder(setting,true);
                            }else{
                                $(window).trigger("table.chain",[setting,option]);
                            }
                        });
                    }
                },
                error:function(data){
                    console.log(data);
                }
            });

        },
        unchainChart:function(){
            var $this = $(this);
            var container = $this.parent("div");
            var option = $.extend(true, {}, container.data("option"));
            container.find(".chainInfo").empty().hide();
            container.data("isLinked",false);
            $this.EBuilder(option.config.build,true);
        }
	};

	/**
	 * 扩展到jQuery实例上
	 * 用方法名称来调用method对象中的方法,第一个参数为方法名,后面的参数将会传入该方法
	 * 如果第一个参数是对象,则调用init方法
	 */
	$.fn.EBuilder = function() {
		var method = arguments[0];
		if (methods[method]) {
			method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
		} else if (typeof(method) == 'object' || !method) {
			method = methods.init;
		} else {
			console.error('Method ' + method + ' does not exist on jQuery.EBuilder');
			return this;
		}
		return method.apply(this, arguments);
	};

	//加载数据时的遮罩层方法
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
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
	};

	function showLoading($container){
		if(typeof(Spinner2)!=='undefined'){
			var $load = jQuery('<div></div>',{
				"class":"bi-confirm loadingBg"
			});
			$container.spin(loadingOption);
			$container.append($load);
		}
		$container.data("isLoading",true);
	}
	function closeLoading($container){
		if(typeof(Spinner2)!=='undefined'){
			$container.spin('close');
			$container.find(".loadingBg").remove();
		}
		$container.data("isLoading",false);
	}
	function hideNoData($dom){
		var  $container  = $dom.parents('.container');
			 $container.find('.chart').show();
			 $container.find('.noData').hide();
	}
	function showNoData($dom){
		var  $container  = $dom.parents('.container');
			 closeLoading($container);
			 $container.find('.chart').hide();
		if($container.find('.noData').length == 0){
			$dom.after(jQuery('<div>',{
				"class":"noData",
				html:'无数据！'
			}))
		}else{
			$container.find('.noData').show();
		}
	}
    /**
     * author : shaojs
     * desc : 设置下钻的面包屑导航条
     * @param container 容器id
     * @param setting 渲染设置,从setting中获取面包屑的材料
     * @param nextDim 快捷参数,从nextDim中获取材料比较快,如果没有该参数,则从setting中取
     * */
	function setBreadcrumbs(container,setting,nextDim){
		//设置面包屑
		var $breadcrumbs = container.find(".breadcrumbs");
        nextDim = nextDim || ($.parseJSON(setting.dataParams.dimAttrJsonStr)).dimData[0];
		var parentDimInfo = nextDim.parentDimInfo || [];

		var breadcrumbsList = $.map(parentDimInfo,function(e,i){
			return "<a>"+e.breadcrumbsName+"</a>";
		});
		breadcrumbsList.push("<a>"+nextDim.attrName+"</a>");

		$breadcrumbs.empty().append($(breadcrumbsList.join("<span class='gtgt_icon'></span>")));
		if(breadcrumbsList.length <= 1){
			$breadcrumbs.hide();
		}else{
			$breadcrumbs.show();
		}
	}

    /**
     * author : shaojs
     * desc : 设置关联标签
     * @param container  容器
     * @param linkName  关联名字
     */
	function setLinkInfo(container,linkName){
        var infoStr = "<span class='chain_icon'></span>" + linkName + "<span class='cansole_icon j_unchainChart'></span>";
        container.find(".chainInfo").html(infoStr).show();
    }

    //请求的URL处理函数(从base.js里面拷来的,这个插件不引用base,所以只好拷一个)
    //webpath已经写在了各个ftl里面,是全局变量,可以使用
    function handleUrlParam(url){
        // 在url的前面需要加入webpath
        if (url.indexOf(webpath) != 0) {
            url = webpath + url;
        }

        var start = url.indexOf('funcId=');
        if (start > -1) {
            var tempFunc = "";
            var end = url.substring(start + 7).indexOf("&");
            if (end > -1) {
                tempFunc = start.substring(start + 7, start + end + 7);
                url = url.substring(0, start) + "/" + tempFunc.toLowerCase() + url.substring(start + end + 8);
            } else {
                tempFunc = url.substring(start + 7);
                url = url.substring(0, start) + "/" + tempFunc.toLowerCase();
            }
        } else if (!IsEmpty(funcId)){
            url = url + "/" + funcId.toLowerCase();
        }

        return url;
    }

    /**
     * 判断是否为空函数
     * @return {boolean}
     */
    function IsEmpty(xValue) {
        return !!(xValue == null || xValue == "null" || xValue == "undefined" || xValue == "NaN" || xValue == "" || xValue == undefined);
    }
});
