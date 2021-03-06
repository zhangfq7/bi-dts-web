define(function() {
	var Widget = {};
	Widget.control = {};
	Widget.model = {
		configData: {
			id: 'tabs_widgets',
			groups: [{
				title: '推荐的图表',
				tools: [{
					menu: {
						id: "tableMenu",
						items: [
						{
							title: '明细表格',
							contents: ['table-detail']
						},
						{
							title: '透视表格',
							contents: ['table-pivot']
						}]
					},
					text: '表格',
					//hidden: true,
					iconCls: 'icon-chart-table'
				}, {
					menu: {
						id: "pieMenu",
						items: [{
							title: '普通饼图',
							contents: ['pie-normal', 'pie-ring']
						}, {
							title: '南丁格尔玫瑰图',
							contents: ['pie-rose']
						}]
					},
					text: '饼图',
					iconCls: 'icon-chart-pie'
				}, {
					menu: {
						id: "barMenu",
						items: [{
							title: '普通柱形图',
							contents: ['bar-xy', 'bar-yx']
						}, {
							title: '堆积柱形图',
							contents: ['bar-xy-stack', 'bar-yx-stack']
						},{//添加"二维柱形图"图标 gaoya 20160818
							title: '二维柱形图',
							contents: ['bar-xy-twoDimension', 'bar-yx-twoDimension']
						}]
					},
					text: '柱图',
					iconCls: 'icon-chart-bar'
				}, {
					menu: {
                        id: "lineMenu",
                        items: [{
                            title: '普通折线图',
                            contents: ['line-xy', 'line-yx']
                        }, {
                            title: '堆积折线图',
                            contents: ['line-xy-stack', 'line-yx-stack']
                        }]
                    },
                    text: '折线图',
                    iconCls: 'icon-chart-line'
				}, {
					menu: {
						id: "scatterMenu",
						items: [{
							title: '散点气泡图',
							contents: ['scatter-normal']
						}
//						, {
//							title: '气泡图',
//							contents: ['scatter-symbolSize']
//						}
						]
					},
					text: '散点图',
					iconCls: 'icon-chart-scatter'
				}, {
					menu: {
						id: "radarMenu",
						items: [{
							title: '普通雷达图',
							contents: ['radar-normal']
						}, {
							title: '雷达面积图',
							contents: ['radar-area']
						}]
					},
					text: '雷达图',
					iconCls: 'icon-chart-radar'
				}, {
					menu: {
						id: "funnelMenu",
						items: [{
							title: '漏斗图',
							contents: ['funnel-normal']
						}, {
							title: '金字塔图',
							contents: ['funnel-sort']
						}]
					},
					text: '漏斗图',
					iconCls: 'icon-chart-funnel'
				}, {
					menu: {
						id: "gaugeMenu",
						items: [{
							title: '普通仪表盘',
							contents: ['gauge-normal']
						}
//						, {
//							title: '个性化仪表盘',
//							contents: ['gauge-ring']
//						}
						]
					},
					text: '仪表盘',
					iconCls: 'icon-chart-gauge'
				}, {
					menu: {
						id: "progressbarMenu",
						items: [{
							title: '普通进度条',
							contents: ['progress-normal']
						}, {
							title: '环形进度条',
							contents: ['progress-ring']
						}]
					},
					hidden: true,
					text: '进度条',
					iconCls: 'icon-chart-progress marginTop'
				}, {
					menu: {
						id: "forceMenu",
						items: [{
							title: '关系网络图',
							contents: ['force-normal']
						}, {
							title: '树状网络图',
							contents: ['force-tree']
						}]
					},
					hidden: true,
					text: '脑图',
					iconCls: 'icon-chart-force'
				}, {
					menu: {
						id: "chordMenu",
						items: [{
							title: '普通和弦图',
							contents: ['chord-normal']
						}, {
							title: '非缎带和弦图',
							contents: ['chord-nonRibbon']
						}]
					},
					text: '和弦图',
					hidden: true,
					iconCls: 'icon-chart-chord'
				}, {
					menu: {
						id: "mapMenu",
						items: [{
							title: '普通地图',
							contents: ['map-china','map-china-guangdong_guangdong','map-china-beijing_beijing','map-china-shanghai_shanghai','map-china-tianjin_tianjin','map-china-chongqing_chongqing',
								'map-china-xianggang_xianggang','map-china-aomen_aomen','map-china-anhui_anhui','map-china-fujian_fujian','map-china-guangxizhuangzu_guangxizhuangzu','map-china-guizhou_guizhou',
								'map-china-gansu_gansu','map-china-hainan_hainan','map-china-hebei_hebei','map-china-henan_henna','map-china-heilongjiang_heilongjiang','map-china-hubei_hubei','map-china-hunan_hunan',
								'map-china-jilin_jilin1','map-china-jiangsu_jiangsu','map-china-jiangxi_jiangxi','map-china-liaoning_liaoning','map-china-neimenggu_neimenggu','map-china-ningxiahuizu_ningxiahuizu',
								'map-china-qinghai_qinghai','map-china-shanxi1_shanxi1','map-china-shanxi_shanxi','map-china-shandong_shandong','map-china-sichuan_sichuan','map-china-taiwan_taiwan','map-china-xinjiangweiwuer_xinjiangweiwuer',
								'map-china-yunnan_yunnan','map-china-zhejiang_zhejiang']//, 'map-point-china'
						}
//						,{
//							title: '线路地图',
//							contents: ['map-line-china']
//						}
						]
					},
					text: '地图',
					iconCls: 'icon-chart-map'
				},{
					menu: {
						id: "treemapMenu",
						items: [{
							title: '基本矩形树图',
							contents: ['treemap-normal']//,
						}]
					},
					text: '矩形树图',
					iconCls: 'icon-chart-treemap'
				}, {
					menu: {
						id: "txtMenu",
						items: [{
							title: '普通文本框',
							contents: ['text-normal']
						}/*, {
							title: '富文本框',
							contents: ['text-fu']
						}*/]
					},
					// hidden: false,
					text: '文本框',
					iconCls: 'icon-chart-text'
				}, {//新增指标卡组件  gaoya 20161108
					menu: {
						id: "indicatorMenu",
						items: [{
							title: '指标卡',
							contents: ['indicator-single', 'indicator-two','indicator-three','indicator-four']
						}]
					},
					text: '指标卡',
					iconCls: 'icon-chart-indicator'
				}, {
					menu: {
						id: "heatmapMenu",
						items: [{
							title: '二维热力图',
							contents: ['heatmap-normal']
						}
						]
					},
					text: '热力图',
					iconCls: 'icon-chart-heatmap'
				}, {
					menu: {
						id: "statMap",
						items: [{
							title: '热力统计地图',
							contents: ['heatmap1-normal']
						}, {
							title: '气泡统计地图',
							contents: ['effectScatter-normal']
						}]
					},
					text: '统计地图',
					iconCls: 'icon-chart-funnel'
				}, {//混搭图
                        menu: {
                            id: "mixingMenu",
                            items: [{
                                title: '悬浮柱图折线组合图',
                                contents: ['barMix']
                            }]
                        },
                        text: '混搭图',
                        iconCls: ['icon-chart-barMix']
                    }]
			}]
		}
	};
	Widget.view = {};
	return {
		config: Widget.model.configData
	}
});