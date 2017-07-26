define(['bace'], function(Bace) {
	var generator = {
		//不同图形 类型，收集骨架不一样
		collectBaseTemplate:function(type){
			var bi = {
				"style":{
					border:{
						have:'',
						color:'1px solid rgba(170, 170, 170,.99)',
						shadow:false,
						radius:false
					},
					background:'rgba(255,255,255,0.6)',
				}
			};
			var title = {
				text:'',
				subtext:'',
				left:'center',
				top:'top',
				textStyle:{
					color:'rgba(0,0,0,1)',
					fontSize:'22'
				}
			};

			var legend = {
				show:true,
				orient:'horizontal',
				top:'bottom',
				left:'center',
				itemGap:'5'
			};

			var xAxis = [{
				show:true,
				inverse:false,
				name:'',
				nameLocation:'end',
				axisLabel:{
					interval:'auto',
					rotate:'0'
				},
				position:"bottom",
				axisLine : {    // 轴线
	                lineStyle: {
	                    color: 'rgba(0,0,0,.8)'
	                }
	           },
				axisTick:{
					show:true,
				},
				splitLine:{
					show:false
				},
				splitArea:{
					show:false
				}
			}];

			var dataZoom=[
				{
					show:false
				},
				{
					type:'inside'
				}
			];

			var  yAxis= [{
				show:true,
				name:'',
				position:"left",
				max:'',
				min:'',
				type:'value',
				inverse:false,
				axisLine : {    // 轴线
	                lineStyle: {
	                    color: 'rgba(0,0,0,.8)',
	                }
	            },
				splitLine:{
					show:false
				},
				splitArea:{
					show:false
				}
			}];

			var grid = {
				top:60,
				bottom:35,
				left:15,
				right:35
			};
			var tooltip = {
				show:true
			}
			var toolbox = {
				show:true,
			};

			//通用配置
			_prop = {
				bi:bi,
				title:title,
				legend:legend,
				tooltip:tooltip,
				toolbox:toolbox
			};

			//判断图形类型
			if(type.indexOf('grid')>-1 || type.indexOf('public')>-1){
				_prop.xAxis = xAxis;
				_prop.yAxis = yAxis,
				_prop.grid = grid;
				_prop.dataZoom = dataZoom;

				_prop.bi.grid = {
					yx:false,
					xUnit:'',
					yUnit:'',
				}
			}
			if(type.indexOf('radar')>-1){
				_prop.radar = [{
					radius:'',
					name: {
						dataUnit:'',
		                textStyle: {
		                    color:'',
		                    fontSize:'12'
		                }
		            }
				}]
			}

			if(type.indexOf('map')>-1){
				_prop.visualMap = {
					show:true
				}
			}
			if(type.indexOf('heatmap1')>-1){
				_prop.visualMap = {

				}
				_prop.geo={
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
				}
			}
            if(type.indexOf('effectScatter')>-1){
				_prop.tooltip={
					trigger: 'item'
				}
                _prop.geo={
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
                }
            }

			return _prop;
		},
		//不同图形类型，会产生一些额外的骨架
		renderTemplate:function(type,prop){
			var bi_handle={};
			if(type=='grid' || type.indexOf('grid')>-1){
				var grid = prop.bi.grid;
				if(!prop.yAxis || !grid ||!prop.dataZoom )return;
				bi_handle = {
					xAxis: [{
						axisLabel: {
							 formatter:  '{value}'+ grid.xUnit
						},
						axisTick:{
							lineStyle: {
								color:prop.xAxis[0].axisLine.lineStyle.color
							}
						}
					}],
					yAxis: [{
						axisLabel: {
							 formatter:  '{value}'+ grid.yUnit
						},
						axisTick:{
							lineStyle: {
								color:prop.yAxis[0].axisLine.lineStyle.color
							}
						},
						max:prop.yAxis[0].max||null,
						min:prop.yAxis[0].min||null
					}],
					grid:{
						//直角系的线
						borderWidth:(grid.yColor == false && grid.xColor == false)?0:1
					}
				};
				if(prop.dataZoom[1].type){
					prop.dataZoom[1].type = 'inside'
				}
			}

			if(type.indexOf('radar')>-1 && prop !==undefined){
				var obj = prop["radar"];
				if(obj){
					bi_handle = {
						radar:[{
							radius:obj[0].radius + "%",
							name: {
				                formatter: '{value}'+ obj[0].name.dataUnit,
				                textStyle: {
				                    color:obj[0].name.textStyle.color,
				                    fontSize:obj[0].name.textStyle.fontSize
				                }
				            }
						}]
					}
				}

			}
			return  $.extend(true, {}, prop, bi_handle);
		},
		collectSeriesTemplate:function(type){
			//判断图形类型
			if(type == 'line' ){
				return {
					line:{
						type:'line',
						symbol:'emptyCircle',
						symbolRotate:'0',
						symbolSize:'4',
						labelPosition:'none',
						markFuncAvg:'none',
						markFuncMax:'none',
						markFuncMin:'none',
						smooth:false,
						stack:false,
						fill:false
					}
				}
			}
			if(type == 'bar' || type == 'barMix'){
				return {
					bar:{
						type:'bar',
						color:'',
						width:'',
						stack:false,
						labelPosition:'none',
						markFuncAvg:'none',
						markFuncMax:'none',
						markFuncMin:'none',
					}
				}
			}
			if(type == 'pie' ){
				return {
					pie:{
						type:'pie',
						radius:'50',
						ringSize:'0',
						centerX:'50',
						centerY:'50',
						showLabel:'outer',
						chartType:'pie'
					}
				}
			}
			if(type == 'map' ){
				return {
					map:{
						type:'map',
						chartType:'',
						top:10,
						left:12,
						width:'',
						roam:false,
						dataRange:true,
						dataUnit:'',
						showLabel:true
					}
				}
			}

			if(type == 'treemap' ){
				return {
					treemap: {
						type:'treemap',
						visibleMin: 300,
						label: {
							show: true,
							formatter: '{b}'
						},
						itemStyle: {
							normal: {
								borderColor: '#fff'
							}
						}
					}
				}
			}
			if(type == 'heatmap1' ){
				return {
					heatmap:{
						type:'heatmap1',
						chartType:'',
						top:10,
						left:12,
						width:'',
						roam:false,
						dataRange:true,
						showLabel:true
					}
				}
			}
            if(type == 'effectScatter' ){
                return {
                    effectScatter:{
                        type:'effectScatter',
                        chartType:'',
                        top:10,
                        left:12,
                        width:'',
                        roam:false,
                        dataRange:true,
                        showLabel:true
                    }
                }
            }
			if(type == 'funnel' ){
				var obj = {
					type:'funnel',
					labelPosition:'right',
					sort:'descending',
					gap:0,
					width:50,
					height:50,
					left:30,
					top:30,
					funnelAlign:'center'
				};
				return {
					funnel:obj
				}
			}
			if(type == 'scatter' ){
				return {
					scatter:{
						type:'scatter',
						symbol:'circle',
						symbolRotate:'none',
						markFuncAvg:'none',
						markFuncMax:'none',
						markFuncMin:'none'
					}
				}
			}
			if(type == 'radar' || type == 'radar2' ){
				return {
					radar2:{
						type:'radar',
						fill:false,
					}
				}
			}
			if(type == 'gauge' ){
				return {
					gauge:{
						type:'gauge',
						radius:'85',
						centerX:'50',
						centerY:'55',
						startAngle:'225',
						endAngle:'-45',
						dataUnit:'',
						max:100,
						min:0,
						axisLine: {            // 坐标轴线
							lineStyle: {       // 属性lineStyle控制线条样式
								width: 10,
								color: {
									panelCloAPP:'20',
									panelCloA:'',
									panelCloBPP:'80',
									panelCloB:'',
									panelCloCPP:'100',
									panelCloC:'',
								}
							}
							}

					}
				}
			}
			if(type == 'heatmap' ){
				return {
					heatmap:{
						type:'heatmap'
					}
				}
			}
		},
		renderSeries:function(type,seriesObj){
			var _series = {};
			var mapType = arguments[2] || "china";
			var obj = seriesObj[type=="radar"?"radar2":type];
			if(type == 'pie'){
				_series = {
					type:'pie',
					radius:obj.radius+"%",
				};
				var showLabel = obj.showLabel;
				var labelObj = {};
				switch (showLabel){
					case "none":
						labelObj = {
							label : {
								normal: {
				                   show: false
				                }
		                    },
		                    labelLine : {
		                        normal: {
				                   show: false
				                }
		                    }
						};
						break;
					case "outer":
						labelObj = {
							label : {
								normal: {
				                   show: true,
				                   position : 'outer',
				                   formatter: "{b}:{c}\n({d}%)"
				                }
		                    },
		                    labelLine : {
		                        normal: {
				                   show: true
				                }
		                    }
						};
						break;
					case "inner":
						labelObj = {
							label : {
		                       normal: {
				                   show: true,
				                   position : 'inner',
				                   formatter: "{b}:{c}\n({d}%)"
				                }
		                    },
		                    labelLine : {
		                        normal: {
				                   show: false
				                }
		                    }
						};
						break;
					default:
						break;
				}
				_series.label= labelObj.label;
				_series.labelLine= labelObj.labelLine;

				var chartType = obj.chartType;
				if(chartType == 'rose'){
					_series.roseType = 'radius'
				}else{
					_series.roseType = false
				}
				var ringSize = obj.ringSize;
				if(ringSize){
					_series.radius = [ringSize+"%", obj.radius+"%"];
				}
				_series.center=[obj.centerX+"%",obj.centerY+"%"];

				if(showLabel == "inner"){
					_series.label.emphasis = {
                        show : true,
                        textStyle : {
                          	color:'#fff',
                        }
					}
				}
				_series.tooltip = {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				}
			}else if(type == 'bar' || type == 'barMix'){
				_series = {
					type:'bar',
					stack:obj.stack,
					barWidth:obj.width,
					label:{
					 	normal:{
					 		show: (obj.labelPosition=='none'?false:true),
					 		position: obj.labelPosition
					 	},
					 	emphasis:{
					 		show: (obj.labelPosition=='none'?false:true),
					 		position: obj.labelPosition
					 	}
					}
				}
				var mark = LineAndPoint(type,obj.markFuncMax,obj.markFuncMin,obj.markFuncAvg)
				_series.markPoint = mark.markPoint;
				_series.markLine = mark.markLine;

			}else if(type == 'line'){
				_series = {
					type:'line',
					stack:obj.stack,
					"symbol":obj.symbol,
					symbolSize:obj.symbolSize,
					symbolRotate:obj.symbolRotate,
					smooth:obj.smooth,
					label:{
					 	normal:{
					 		show: (obj.labelPosition=='none'?false:true), position: obj.labelPosition
					 	},
					 	emphasis:{
					 		show: (obj.labelPosition=='none'?false:true),
					 		position: obj.labelPosition
					 	}
					}
				};
				if(obj.fill){
					_series.areaStyle = {normal:{}};
				}else{
					_series.areaStyle = {normal:null};
				}

				var mark = LineAndPoint(type,obj.markFuncMax,obj.markFuncMin,obj.markFuncAvg);
				_series.markPoint = mark.markPoint;
				_series.markLine = mark.markLine;
			}else if(type == 'scatter'){
				_series = {
					type:'scatter',
					"symbol":obj.symbol,
				};
				var mark = LineAndPoint(type,obj.markFuncMax,obj.markFuncMin,obj.markFuncAvg)
				_series.markPoint = mark.markPoint;
				_series.markLine = mark.markLine;
			}else if(type == 'radar' || type == 'radar2'){
				_series = {
					type:'radar',
				};
				if(obj.fill){
					_series.areaStyle = {normal:{}};
				}else{
					_series.areaStyle = {normal:null};
				}
			}else if(type == 'funnel'){
				_series = {
					type:'funnel',
					gap:obj.gap,
					width:obj.width+"%",
					height:obj.height+"%",
					top:obj.top+"%",
					left:obj.left+"%",
					sort:obj.sort,
					funnelAlign:obj.funnelAlign
				};
				switch (obj.labelPosition){
					case "none":
						_series.label = {
							normal: {
								show: false
							}
		                };
						_series.labelLine = {
							normal: {
								show: false
							}
		                };
						break;
					case "left":
						_series.label = {
							normal: {
								show: true,
								position: 'left',
								formatter: "{b}:{c}"
							}
		                };
						_series.labelLine = {
							normal: {
								show: true,
								formatter: "{b}:{c}"
							}
		                };
						break;
					case "right":
						_series.label = {
							normal: {
								show: true,
								position: 'right',
								formatter: "{b}:{c}"
							}
		                };
						_series.labelLine = {
							normal: {
								show: true
							}
		                };
						break;
					case "inside":
						_series.label = {
							normal: {
								position: 'inside',
								formatter: "{b}:{c}"
							}
		                };
						_series.labelLine = {
							normal: {
								show: false
							}
		                };
						break;
					default:
						break;
				}
			}
			if(type == "map"){
				_series = {
					type:'map',
					top:obj.top+"%",
					left:obj.left+"%",
					width:obj.width||'auto',
					roam:obj.roam,
					mapType: mapType || "",
					dataUnit:obj.dataUnit||""
			};
				var labelObj = {};
				if(obj.showLabel){
					labelObj = {
						label:{
							normal:{show:true},
							emphasis:{show:true}
						}
					}
				}else{
					labelObj = {
						label:{
							normal:{show:false},
							emphasis:{show:false}
						}
					}
				}
				_series.label= labelObj.label;
			}

			if(type == "treemap"){
				_series = {
					name: '维度',
					type: 'treemap',
					visibleMin: 300,
					// data: data.children,
					leafDepth: 2,
					levels: [
						{
							itemStyle: {
									normal: {
									borderColor: '#555',
									borderWidth: 4,
									gapWidth: 4
								}
							}
						},
						{
							colorSaturation: [0.3, 0.6],
							itemStyle: {
								normal: {
									borderColorSaturation: 0.7,
									gapWidth: 2,
									borderWidth: 2
								}
							}
						},
						{
							colorSaturation: [0.3, 0.5],
							itemStyle: {
								normal: {
									borderColorSaturation: 0.6,
									gapWidth: 1
								}
							}
						},
						{
							colorSaturation: [0.3, 0.5]
						}
					]
				};
			}

			if(type == "heatmap1"){
				_series = {
					name: 'AQI',
					type: 'heatmap1',
					coordinateSystem: 'geo',
				}
			}
            if(type == "effectScatter"){
                _series =
                    {
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#f4e925',
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        zlevel: 1
                    }
            }
			if(type == "gauge"){
				_series = {
					type:'gauge',
					radius: (obj.radius||85)+'%',
					max:obj.max||100,
					min:obj.min||0,
					startAngle:obj.startAngle||225,
					endAngle:obj.endAngle||-45,
					center:[obj.centerX+"%",obj.centerY+"%"],
					axisLine: {            // 坐标轴线
		                lineStyle: {       // 属性lineStyle控制线条样式
		                    width: 10,
							color: [[obj.axisLine.lineStyle.color.panelCloAPP/100,obj.axisLine.lineStyle.color.panelCloA],[obj.axisLine.lineStyle.color.panelCloBPP/100,obj.axisLine.lineStyle.color.panelCloB],[obj.axisLine.lineStyle.color.panelCloCPP/100,obj.axisLine.lineStyle.color.panelCloC]]
		                }
		            },
		            title:{
		                 textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    fontWeight: 'bolder',
		                    fontSize:'14'
		                }
		            },
		            axisTick: {            // 坐标轴小标记
		                length :15,        // 属性length控制线长
		                lineStyle: {       // 属性lineStyle控制线条样式
		                    color: 'auto'
		                }
		            },
		            splitLine: {           // 分隔线
		                length :20,         // 属性length控制线长
		                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
		                    color: 'auto'
		                }
		            },
		            detail : {
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    fontWeight: 'bolder'
		                },
		                formatter:'{value}'+obj.dataUnit
		            }
				}
			}
			if(type == "heatmap"){
				_series = {
					type:'heatmap'
				}
			}

			return _series;
		}
	};

	function LineAndPoint(chartType,markFuncMax,markFuncMin,markFuncAvg){

		var markLine = {
			data:[
				{type : 'max', name : '最大值'},
				{type : 'min', name : '最小值'}
			]
		};
		var markPoint = {
			data:[
				{type : 'max', name : '最大值'},
				{type : 'min', name : '最小值'}
			]
		};
		if(chartType == 'line' || chartType == 'scatter' || chartType == 'bar' || chartType == 'barMix'){
			markLine.data.push({type : 'average', name : '平均值'});
		}

		if(markFuncMax == 'line'){
			//则删除 point中的 max data
			markPoint.data = _.without(markPoint.data, _.findWhere(markPoint.data, {type:'max'}));
		}
		if(markFuncMax == 'point'){
			//则删除 point中的 max data
			markLine.data = _.without(markLine.data, _.findWhere(markLine.data, {type:'max'}));
		}

		if(markFuncMax == 'none'){
			//则删除 point中的 max data
			markPoint.data = _.without(markPoint.data, _.findWhere(markPoint.data, {type:'max'}));
			markLine.data = _.without(markLine.data, _.findWhere(markLine.data, {type:'max'}));
		}

		if(markFuncMin == 'line'){
			//则删除 point中的 max data
			markPoint.data = _.without(markPoint.data, _.findWhere(markPoint.data, {type:'min'}));
		}
		if(markFuncMin == 'point'){
			//则删除 point中的 max data
			markLine.data = _.without(markLine.data, _.findWhere(markLine.data, {type:'min'}));
		}

		if(markFuncMin == 'none'){
			//则删除 point中的 max data
			markPoint.data = _.without(markPoint.data, _.findWhere(markPoint.data, {type:'min'}));
			markLine.data = _.without(markLine.data, _.findWhere(markLine.data, {type:'min'}));
		}

		if(markFuncAvg == 'line'){
			//则删除 point中的 max data
			markPoint.data = _.without(markPoint.data, _.findWhere(markPoint.data, {type:'average'}));
		}
		if(markFuncAvg == 'point'){
			//则删除 point中的 max data
			markLine.data = _.without(markLine.data, _.findWhere(markLine.data, {type:'average'}));
		}

		if(markFuncAvg == 'none'){
			//则删除 point中的 max data
			markPoint.data = _.without(markPoint.data, _.findWhere(markPoint.data, {type:'average'}));
			markLine.data = _.without(markLine.data, _.findWhere(markLine.data, {type:'average'}));
		}
		if(markLine.data.length ==0){
			markLine = null;
		};
		if(markPoint.data.length ==0){
			markPoint = null;
		};
		return {
			markLine:markLine,
			markPoint:markPoint
		}
	}

	return generator;
});
