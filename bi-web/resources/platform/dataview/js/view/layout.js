define(['view/box'],
	function(Box) {
		var Layout = {};

		Layout.control = {
			init: function() {
				log('初始话布局');
				Layout.view.init();

				Box.Layout.toggleFilterPanel = Layout.control.toggleFilterPanel;
				Box.Layout.toggleOperaPanel =  Layout.control.toggleOperaPanel;
			},
			toggleAllPanel:function(way){
				Layout.control.toggleHeaderPanel(way);
//				var state = myLayout.center.children.layout1.center.children.layout1.center.children.layout1.north.state.isClosed;
				/*if(way == 'open'){
//					if(!state){
						Layout.control.toggleOperaPanel(way);
//					}
				}
				if(way == 'close'){
					Layout.control.toggleOperaPanel(way);
				}*/
			},
			//打开/关闭属性框
			togglePropPanel: function(way) {
				var propPanel = myLayout.center.children.layout1.center.children.layout1;
				if (way == "open") {
					propPanel.slideOpen('west');
				} else if (way == "close") {
					propPanel.slideClose('west');
				} else {
					propPanel.slideToggle('west');
				}
			},
			//打开/关闭指标面板框
			toggleAttrPanel: function(way) {
				if (way == "open") {
					myLayout.open('west');
				} else if (way == "close") {
					myLayout.close('west');
				} else {
					myLayout.toggle('west');
				}
			},
			//打开/关闭筛选面板
			toggleFilterPanel: function(way) {
				var filterPanel = myLayout.center.children.layout1.center.children.layout1;
				if (way == "open") {
					filterPanel.open('north');
				} else if (way == "close") {
					filterPanel.close('north');
				} else {
					filterPanel.toggle('north');
				}
				// 筛选条件全局设置
				if(typeof(discovery) != "undefined" && discovery == "0"){
					jQuery("#setGlobalFilter").toggleClass('hide');
				}
				jQuery("#filterPanelTag,#closeFilter,#containerTag").toggleClass('hide');
			},
			//打开/关闭头部面板
			toggleHeaderPanel: function(way) {
				if (way == "expand") {
					myLayout.sizePane('north', 120);
				} else if (way == "compress") {
					myLayout.sizePane('north', 33);
				} else if (way == "open"){
					myLayout.open('north');
				}
				else if (way == "close"){
					myLayout.close('north');
				}
			},
			//打开/关闭操作面板
			toggleOperaPanel: function(way) {
				var operaPanel = myLayout.center.children.layout1.center.children.layout1.center.children.layout1;
				if (way == "open") {
					operaPanel.open('north');

				} else if (way == "close") {
					operaPanel.close('north');
				} else {
					operaPanel.toggle('north');
				}
			},
			//设置分享面板布局
			setShareLayout: function(hasFilter){
				if(hasFilter){
					Layout.module.config.center.children.inset.top = 50;
				}else{
					Layout.module.config.center.children.center.children.center.children.inset.top = 50;
				}
			}
		};

		Layout.view = {
			init: function() {
				//初始化布局,将布局对象挂载到全局上
				window.myLayout = jQuery('body').layout(Layout.module.config);
				myLayout.center.children.layout1.center.children.layout1.allowOverflow("north");
				log('==布局结束==');
			}
		};

		Layout.module = {
			isClose:function(){

			},
			config: {
				north: {
					size: 120,
					spacing_open: 0,
					spacing_closed: 0,
					//showOverflowOnHover:true
					//initHidden: true
				},
				center: {
					paneSelector: "#layout_body_panel",
					children: {
						inset: {
							top: 0,
							bottom: 0,
							left: 0,
							right: 0
						},
						center: {
							paneSelector: "#layout_body_content_panel",
							children: {
								inset: {
									top: 0,
									bottom: 0,
									left: 0,
									right: 0
								},
								center: {
									paneSelector: "#centerPanel",
									children: {
										inset: {
											top:  0,
											bottom: 0,
											left: 0,
											right: 0
										},
										north: {
											paneSelector: "#handlePanel",
											spacing_open: 0,
											spacing_closed: 0,
											initClosed: true
										},
										center: {
											paneSelector: "#tableChartPanel",
											spacing_open: 0,
											spacing_closed: 0,
											onresize_end:function(){
												Box.Widgets.updateGridGraph && Box.Widgets.updateGridGraph();
											}
										}
									}
								},
								north: {
									paneSelector: "#filterPanel",
									spacing_open: 0,
									spacing_closed: 0,
									showOverflowOnHover:true,
									bi_hoverAuto:true,
									initClosed: true
								},
								west: {
									paneSelector: "#propertyPanel",
									size: 230,
									minSize: 220,
									spacing_open: 4,
									spacing_closed: 0,
									initClosed: true,
									slideTrigger_close: "click"
								}
							}
						},
						north: {
							paneSelector: "#layout_body_title_panel",
							spacing_open: 0,
							spacing_closed: 0,
//							 initHidden: true
						}
					}
				},
				west: {
					spacing_open: 4,
					spacing_closed: 0,
					initClosed: true,
					//fxSpeed_open:	1000,
					//fxSettings_open:{ easing: "easeOutBounce" },
					minSize: 150,
					onresize_end: function() {
						//让指标树的指标自适应左边容器
						jQuery("#layout_attr_panel .l-grid-row-cell-inner").width(jQuery("#layout_attr_panel .l-panel-header").width() - 10);
					}
				}
			}
		};
		return Layout.control;
	});