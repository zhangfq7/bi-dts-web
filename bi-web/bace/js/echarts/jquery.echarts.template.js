/*!
 * 
 * @author zhump
EBuilder, According to the incoming data and configuration items, build ECharts.
Runing environment ECMAScript 5

By ECharts 2.2.7
   jQuery 1.4+

Version 1.0.0
If you have questions, please email me at 695004175@qq.com
*/
;
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		var defineArry = ['ECharts/AMD'];
		if (!jQuery) {
			defineArry.push('jquery');
		}
		define(defineArry, factory);

	} else if (typeof exports === 'object') {

		factory(require('jquery', 'ECharts/amd'));

	} else {

		factory(echarts,jQuery);

	}
}(function(ECharts, $) {
	if (!$) {
		$ = jQuery;
	}
	var methods = {
		init: function() {
			var $this = this;
			if ($this.length > 1) {
				console.warn('注意：EBuilder只会加载jQuery选择器匹配到的第一个元素');
			}
			var setting = {
				theme: 'infographic',
				stack: false,
				themeUrl: 'jquery/echarts/theme/',
				map: {
					mapUrl: 'js/jquery/echarts/geoJson/',
					mark: null
				}
			};
			setting = $.extend(true, {}, setting, arguments[0]);
			//拼接ECharts模块化所用到的对象数组
			//var sysFolder = setting.sysFolder || '';
			var chartModule = $.map((setting.type || []).concat(setting.magicType || []), function(value) {
				return 'echarts/chart/' + value;
			})
			var theme = setting.theme,
				themeUrl = setting.themeUrl || 'echarts/theme';
			if (!$.isArray(theme || [])) {
				theme = [themeUrl + theme];
			}
			chartModule = ['echarts'].concat(theme, chartModule);
			var option = $.extend(true, {}, buildChartOption(setting), setting.option);
			require(chartModule, function(ec, theme) {
				initGeoJSONByMapType(setting);
				var echarts = ec.init($this[0], theme).setOption(option);
				$this.data({
					"echarts": echarts
				})
				setting.callback ? setting.callback.call(echarts, option) : null;
			});
			$this.data({
				"option": option
			})
			return $this;
		},
		setOption: function() {
			var echarts = this.data('echarts');
			if (this.data('echarts')) {
				var newOption = $.extend(true, {}, $(this).data('option'), arguments[0]);
				$(this).data('option', newOption);
				echarts.setOption(newOption, true);
			}
			return this;
		},
		getOption: function() {
			return $(this).data('option') || {};
		},
		getConfigOption: function() {
			var option = $(this).data('option') || {};
			delete option.legend;
			delete option.xAxis;
			delete option.yAxis;
			delete option.series;
			return option;
		}
	};

	//通用配置项
	var generalOption = {

		tooltip: {
			axisPointer: {
				lineStyle: {
					color: '#1E90FF',
					width: 3,
					type: 'solid'
				}
			}
		},
		title: {
			x: 'center'
		},
		legend: {
			x: 'center',
			y: 'bottom'
		},
		calculable: false,
		toolbox: {
			show: true,
			feature: {
				mark: {
					show: true
				},
				dataZoom: {
					show: false
				},
				dataView: {
					show: false
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: false
				}
			}
		}
	};

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
	}

	function initGeoJSONByMapType(setting) {
		var mapType = setting.map.mapType || null;
		if (mapType) {
			$.each(mapType, function(i, value) {
				var MapUtil = require('echarts/util/mapData/params');
				MapUtil.params[value] = {
					getGeoJson: function(callback) {
						var url = setting.map.mapUrl + value + '.json';
						$.ajax({
							url: url,
							dataType: 'json',
							success: function(data) {
								if (data.UTF8Encoding) {
									callback(MapUtil.decode(data));
								} else {
									callback(data);
								}
							},
							error: function() {
								alert(arguments[2] + " [" + url + "]");
							}
						});
					}
				}
			});
		}

	}

	function buildChartOption(setting, type) {
		//获取图形类型
		var type = type || setting.type[0];
		var option = {};
		if (type == 'bar' || type == 'line') {
			var groupData = getOptionByGroupData(setting);
			option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: type == 'bar' ? 'shadow' : 'line'
					}
				},
				grid: {
					x: 50,
					y: 50,
					x2: 50,
					y2: 60
				},
				toolbox: {
					feature: {
						dataZoom: {
							show: true
						}
					}
				},
				legend: {
					data: groupData.legend_data
				},
				xAxis: [{
					type: 'category',
					data: groupData.xAxis_data
				}],
				yAxis: [{
					type: 'value'
				}],
				series: groupData.series
			}
			if(setting.yx){
				var temp = option.xAxis;
				option.xAxis = option.yAxis;
				option.yAxis = temp;
			}
		} else if (type == 'pie') {
			var groupData = {};
			if (setting.data[0].group) {
				groupData = getOptionByGroupData(setting);
				var ringItemStyle = {
					normal: {
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},

					emphasis: {
						label: {
							show: true,
							position: 'center',
							textStyle: {
								fontSize: '20',
								fontWeight: 'bold'
							}
						}
					}
				};
				var coordinate = [];
				for (var len = groupData.series.length + 1, i = len, index = 0; i > 0; i--, index++) {
					coordinate.push(parseInt(100 / len) + parseInt(coordinate[index - 1] || 1));
				}

				$.map(groupData.series, function(data, n) {
					data.itemStyle = ringItemStyle;
					data.radius = ['45%', '58%'];
					data.center = [coordinate[n] + '%', '50%'];
				});
			} else {
				groupData = getOptionByNoGroupData(setting);
			}
			option = {
				legend: {
					data: groupData.legend_data
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} (占比：{d}%)"
				},
				series: groupData.series
			}
		} else if (type == 'funnel') {
			var groupData = {};
			if (setting.data[0].group) {
				groupData = getOptionByGroupData(setting);
				var coordinate = [];
				for (var len = groupData.series.length + 1, i = len, index = 0; i > 0; i--, index++) {
					coordinate.push(parseInt(100 / len) + parseInt(coordinate[index - 1] || 1));
				}
				$.map(groupData.series, function(data, n) {
					data.x = coordinate[n] - 20 + '%';
					data.width = 100 / groupData.series.length + '%';
				});
			} else {
				groupData = getOptionByNoGroupData(setting);
				$.map(groupData.series, function(data, n) {
					data.max = groupData.max;
					data.min = groupData.min;
				});
			}
			option = {
				legend: {
					data: groupData.legend_data
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c}"
				},
				series: groupData.series
			}
		} else if (type == 'scatter') {
			var groupData = getOptionByGroupData(setting);
			option = {
				legend: {
					data: groupData.legend_data
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						lineStyle: {
							type: 'dashed',
							width: 1
						}
					}
				},
				toolbox: {
					feature: {
						dataZoom: {
							show: true
						}
					}
				},
				xAxis: [{
					type: 'value',
					data: groupData.xAxis_data
				}],
				yAxis: [{
					type: 'value'
				}],
				series: groupData.series
			}
		} else if (type == 'radar') {
			var groupData = getOptionByGroupData(setting);
			option = {
				legend: {
					data: groupData.legend_data
				},
				tooltip: {
					formatter: function(params) {
						var res = params.data.name;
						var values = params.data.value;
						for (var i = 0, l = values.length; i < l; i++) {
							res += '<br/>' + values[i].name + ' : ' + values[i].value;
						}
						return res;
					}
				},
				polar: groupData.xAxis_data,
				series: groupData.series
			}
		} else if (type == 'gauge') {
			option = {
				legend: null,
				series: [{
					name: '业务指标',
					type: 'gauge',
					radius: '100%',
					detail: {
						formatter: '{value}%'
					},
					data: setting.data
				}]
			}
		} else if (type == 'map') {
			var groupData = getOptionByGroupData(setting);
			option = {
				legend: {
					data: groupData.legend_data
				},
				dataRange: {
					min: groupData.min || 0,
					max: groupData.max || 1000,
					x: 'left',
					y: 'bottom',
					text: ['高', '低'],
					calculable: true,
					realtime: false,
					calculable: true
				},
				tooltip: {
					trigger: 'item',
					formatter: function(params) {

						var res = '';
						if (params[2] == '-') {
							res += params[1];
						} else {
							var values = $.trim(params[0]).split(' ');
							var seriesIndex = params.data.seriesIndex || [];
							var valueMap = params.data.valueMap;
							res += params[1] + "<br/>";
							for (var i = 0, l = seriesIndex.length; i < l; i++) {
								res += values[i] + ' : ' + (valueMap[seriesIndex[i]] || 0) + ' <br/>';
							}
							res += "合计：" + params[2];
						}
						return res;
					}
				},
				series: groupData.series
			}
			if (setting.type.indexOf('line') > -1) {
				var LineAndbar = buildChartOption(setting, 'line');
				option.yAxis = LineAndbar.yAxis
				option.xAxis = LineAndbar.xAxis
			}
			var mark = setting.map.mark || {};
			if (mark.type == 'line') {
				option.backgroundColor = '#1b1b1b';
				option.legend.textStyle = {
					color: '#fff'
				};
				option.legend.selectedMode = 'single';

				var o = {};
				$.map(option.series, function(obj, n) {
					obj.hoverable = false;
					obj.itemStyle = {
						normal: {
							borderColor: 'rgba(100,149,237,1)',
							areaStyle: {
								color: '#1b1b1b'
							}
						}
					};
					if (n == 0) return;
					o[obj.name] = false;
				})
				option.legend.selected = o;
			}

		}
		return $.extend(true, {}, generalOption, option);
	}

	function getOptionByGroupData(setting) {

		var xAxis_data = {},
			series = [],
			series_data = {},
			legend_data = [],
			type = setting.type,
			data = setting.data;

		//雷达的图的数据跟传统图的数据 不一样，还要计算极坐标的值，走了一个分支
		if (type == 'radar') {
			var indicator = {};
			$.each(setting.data, function(n, object) {
				xAxis_data[object.name] = object.name;
				var groupName = $.trim(object.group);
				series_data[groupName] = series_data[groupName] || [];
				series_data[groupName].push(object);

				if (indicator.hasOwnProperty(object.name)) {
					var a = object.value;
					if (a > indicator[object.name]) {
						indicator[object.name] = a;
					}
				} else {
					indicator[object.name] = object.value;
				}
			});

			var seriesArray = [];
			$.each(series_data, function(n, object) {
				seriesArray.push({
					value: object,
					name: n
				})
			})
			series = [{
				name: '',
				type: 'radar',
				data: seriesArray
			}];
			var radar_self = [{
				indicator: function() {
					var array = [];
					$.each(indicator, function(n, object) {
						array.push({
							text: n,
							max: object + (parseInt(1 + (object + "").substr(1).replace(/\d/g, '0')) / 3)
						})
					})
					return array;
				}()
			}]
			xAxis_data = radar_self;
			legend_data = Object.keys(series_data);

		} else if (type == 'map') { //map要计算值域的最大值和最小值，走一个分支
			var maxArray = [];
			var mark = setting.map.mark || {};
			$.each(setting.data, function(n, object) {
				xAxis_data[object.name] = object.name;
				var groupName = $.trim(object.group) || object.name;
				series_data[groupName] = series_data[groupName] || [];
				maxArray.push(object.value);
				if (mark.type === 'line') {
					if (mark.direction == 1) {
						series_data[groupName].push([{
								name: groupName
							},
							object
						]);
					} else {
						series_data[groupName].push([object, {
							name: groupName
						}]);
					}
				} else {
					series_data[groupName].push(object);
				}
			});
			var index = 0;
			$.each(series_data, function(n, object) {
				series.push({
					name: n,
					type: 'map',
					mapType: function() {
						var mapType = setting.map.mapType;
						if (mapType) {
							return mapType[index] || mapType[0];
						}
					}(),
					itemStyle: {
						emphasis: {
							label: {
								show: true
							}
						},
						normal: {
							borderColor: 'rgba(100,149,237,1)',
							borderWidth: 0.5,
						}
					},
					mapLocation: {
						height: '80%'
					},
					data: object
				});
				legend_data.push(n);
				index++;
			});

			if (mark.type === 'point') {
				$.map(series, function(object) {
					object.markPoint = {
						data: object.data,
						symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
						itemStyle: {
							normal: {
								borderColor: '#87cefa',
								borderWidth: 1, // 标注边线线宽，单位px，默认为1
								label: {
									show: false
								}
							},
							emphasis: {
								borderColor: '#1e90ff',
								borderWidth: 5,
								label: {
									show: false
								}
							}
						}
					}
					object.data = [];
					object.geoCoord = geoCoord;
				})
			} else if (mark.type === 'line') {
				$.map(series, function(object) {
					object.markLine = {
						smooth: true,
						data: object.data,
						effect: {
							show: true,
							scaleSize: 1,
							period: 20,
							color: '#fff',
							shadowBlur: 10
						},
						itemStyle: {
							normal: {
								borderWidth: 1,
								lineStyle: {
									type: 'solid',
									shadowBlur: 10
								}
							}
						}
					}
					object.data = [];
					object.geoCoord = geoCoord;
				})
			}
			xAxis_data = Object.keys(xAxis_data);

			return {
				xAxis_data: xAxis_data,
				legend_data: legend_data,
				series: series,
				max: Math.max.apply({}, maxArray),
				min: Math.min.apply({}, maxArray)
			}


		} else if (type == 'funnel') { //漏斗图得计算每一组的最大值
			var maxminObject = {};
			$.each(setting.data, function(n, object) {
				xAxis_data[object.name] = object.name;
				var groupName = $.trim(object.group) || object.name;
				series_data[groupName] = series_data[groupName] || [];
				series_data[groupName].push(object);
				maxminObject[groupName] = maxminObject[groupName] || [];
				maxminObject[groupName].push(object.value);
			});
			var maxArray = [];
			var minArray = [];
			$.each(maxminObject, function(n, object) {
				maxArray.push(Math.max.apply({}, maxminObject[n]));
				minArray.push(Math.min.apply({}, maxminObject[n]));
			});

			var index = 0;
			var stack = setting.stack;
			$.each(series_data, function(n, object) {
				series.push({
					name: n,
					type: type[index] || type[0],
					stack: stack || false,
					data: object,
					x: function() {

					},
					max: maxArray[index] * 3,
					min: minArray[index] / 3
				});
				legend_data.push(n);
				index++;
			});
			xAxis_data = Object.keys(xAxis_data);
		} else {
			$.each(setting.data, function(n, object) {
				xAxis_data[object.name] = object.name;
				var groupName = $.trim(object.group) || object.name;
				series_data[groupName] = series_data[groupName] || [];
				series_data[groupName].push(object);
			});

			var index = 0;
			var stack = setting.stack;
			$.each(series_data, function(n, object) {
				series.push({
					name: n,
					type: type[index] || type[0],
					stack: stack || false,
					data: object
				});
				legend_data.push(n);
				index++;
			});
			xAxis_data = Object.keys(xAxis_data);
		}

		return {
			xAxis_data: xAxis_data,
			legend_data: legend_data,
			series: series
		}
	}

	function getOptionByNoGroupData(setting) {
		var legend_data = [],
			series = [{
				type: setting.type[0],
				name: '您关注的',
				data: []
			}];
		if (setting.type == 'pie') {
			series[0].itemStyle = {
				normal: {
					label: {
						formatter: "{b}:{c}\n({d}%)"
					}
				}
			}
			series[0].radius = '50%';
			series[0].center =  ['50%', '55%'];
		}

		var maxArray = [];
		$.each(setting.data, function(n, object) {
			legend_data.push(object.name);
			series[0].data.push(object);
			if (setting.type == 'funnel') {
				maxArray.push(object.value)
			}
		});

		return {
			legend_data: legend_data,
			series: series,
			max: Math.max.apply({}, maxArray),
			min: Math.min.apply({}, maxArray)
		};
	}
}));