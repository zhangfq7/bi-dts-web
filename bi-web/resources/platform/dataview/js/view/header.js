define(['view/box', 'view/header/data', 'view/header/widget', 'view/header/tools','bace','view/header/template','view/header/save','view/header/preview'],
	function(Box, Data, Widget, Tools,Bace,Template,Save,Preview) {
		var Header = {};
		Header.control = {
			init: function() {
				log('初始化头部操作栏');
				Header.view.init();
				Box.Header.save.saveReport = Save.saveReport;
			}
		};
		Header.module = {
			//取出每个选项卡对象的配置
			configDataArray: [
				Data.config,
				Widget.config,
				Tools.config,
				Template.config,
				Save.config,
				Preview.config
			],
			//当前打开的选项卡的index
			selected: 0
		};
		Header.view = {
			init: function() {

				//开始构建头部选项卡
				Header.view.buildTabs();
				//根据用户companyId设置操作工具  modify by wangle  start
				var url=Bace.handleUrlParam("/platform/dataview/is-send-email");
				jQuery.ajax({
					type: "post",
					url: url,
					dataType: "json",
					success:function(req){
						if(req.openEmailFlag!="1"){
							Tools.openSendEmail();
						}

						//如果全局水印开关开启,则显示水印开关 shaojs 20160817
						if(waterFlag == "1"){
							Tools.openWaterflag();
						}
						//修改页面，如果有url信息，打开url导航栏 gaoya 20170505
						if(Box.main.urlMenuInfo.length ){
							Tools.config.groups[0].tools[0].panel[3].checked="checked";
							Box.Widgets.openUrlPanel("open");
						}

						//开始动态生成头部选项卡内容
						Header.view.createGroup();
						//为头部选项卡，绑定菜单下拉
						Header.view.bindMenuHover();
					}
				});
			   //根据用户companyId设置操作工具  modify by wangle  end
			},
			buildTabs: function() {
				//"探索"页面头部隐藏"数据tab" gaoya 20160817
				 if(discovery=="1"){
				 	$('#tabs a[shref="#tabs_data"],#tabs a[shref="#tabs_template"]').parent().remove();
				 	$("#tabs_data,#tabs_template").remove();
				 	Header.module.configDataArray.splice(0,1);
				 	Save.changeLayoutManage();
					 //探索页面取消url开关
					 Tools.discoveryUrlLayout();
				 }
				 //模板页面隐藏url导航开关 gaoya 20161023
				if(tplUrlChange=="1"){
					Tools.discoveryUrlLayout();
				}

				//初始化头部选项卡(jquery ui 的tabs组件)
				jQuery("#tabs").tabs({
					active: Header.module.selected,
					beforeActivate: function(event, ui) {}
				}).disableSelection();


				//为头部选项卡增加LOGO
				jQuery("#tabs").append($("<div></div>", {
					"class": "tabs-logo",
					html: "<div class='icon-logo'></div>"
				}).on('click', function() {
					//alert(); //绑定事件
				}));

				//为header添加双击隐藏头的功能
				jQuery("#tabs .ui-tabs-nav").on('dblclick', function() {
					var toggle = jQuery("#tabs").attr("data-toggle");
					if (toggle == 'open') {
						myLayout.sizePane('north', 33);
						jQuery("#tabs").attr("data-toggle", "close")
					} else {
						myLayout.sizePane('north', 120);
						jQuery("#tabs").attr("data-toggle", "open")
					}
				});
				//shaojs 20160725 选项卡被点击时,如果头被隐藏,则打开头
				jQuery("#tabs .ui-tabs-anchor").on( "click", function( event, ui ) {
					var toggle = jQuery("#tabs").data("toggle");
					if (toggle == 'open') {
						return;
					} else {
						myLayout.sizePane('north', 120);
						jQuery("#tabs").attr("data-toggle", "open")
					}
				} );

				//当页面加载完成后,需要移除invisible
				jQuery('body').removeClass('invisible');

			},

			createGroup: function() {
				var configDataArray = Header.module.configDataArray;
				var menuDiv = jQuery("body").append('<div class="hide" id="menuDiv"></div>');
				var eventArray = [];
				var switchEventArray = [];
				for (var i = 0, n = configDataArray.length; i < n; i++) {
					var configData = configDataArray[i];
					var contanierId = configData.id;
					var $tabs_contanier = jQuery("#" + contanierId);
					var itemHTML = "";
					var groups = configData.groups;
					if (!groups) continue;
					for (var j = 0, k = groups.length; j < k; j++) {
						var group = groups[j];
						var groupTitle = group.title;
						var tools = group.tools;
						itemHTML += "<div class='group' ";
						if (group.style) {
							itemHTML += ' style="' + group.style + '" ';
						}
						itemHTML += '><ul>';
						for (var z = 0, x = tools.length; z < x; z++) {
							var tool = tools[z];
							var menu = tool.menu;
							var panel = tool.panel;
							if (panel) {
								itemHTML += '<li style="margin-top:-2px;margin-left:-10px;">';
								for (var r = 0; r < panel.length; r++) {
									itemHTML += '<div class="tools-panel">';
									itemHTML += '<div class="' + panel[r].iconCls + '"></div>';
									itemHTML += '<div title="'+panel[r].title+'">' + panel[r].text + '</div>';
									itemHTML += '<input id="' + panel[r].id + '" type="checkbox" class="switchbutton" style="width: 64px;"  ';
									if (panel[r].checked) {
										itemHTML += ' checked="checked" />';
									} else {
										itemHTML += '  />';
									}
									itemHTML += '</div>';
									switchEventArray.push({
										id: panel[r].id,
										change: panel[r].change,
										option: panel[r].option
									})
								}
								itemHTML += '</li>';
							} else if (menu) {
								if (tool.hidden) continue;
								itemHTML += '<li data-menu="' + menu.id + '">';
								itemHTML += '<div class="bi-icon ' + tool.iconCls + '"></div>';
								itemHTML += '<div>' + tool.text + '</div>';
								itemHTML += '<div class="down-arrow"></div>';
								itemHTML += '</li>';

								function buildMenuItem(menu) {
									var menuItemHTML = (menu.id=="mapMenu")?'<div id="' + menu.id + '" class="menu-content" style="width:425px;">':'<div id="' + menu.id + '" class="menu-content" style="width:169px;">';
									for (var q = 0, w = menu.items.length; q < w; q++) {
										var item = menu.items[q];
										menuItemHTML += "<div class='menuTitle'>" + item.title + "</div>";
										var contents = item.contents;
										menuItemHTML += "<div class='menuContent'>";
										for (var d = 0, f = contents.length; d < f; d++) {
											var content = contents[d];
											menuItemHTML += "<div bi-draggable='" + content + "'><div class='" + content + "'></div></div>";
										}
										menuItemHTML += "</div>";
									}
									menuItemHTML += "</div>";
									jQuery("#menuDiv").append(menuItemHTML);
								}
								if (menu.html) {
									jQuery("#menuDiv").append(menu.html);
									(function(tool){
										jQuery(document).on('click',"#"+menu.id+" .menuContent>div",function(){
											tool.click.call(this);
										})
									})(tool)
								} else {
									buildMenuItem(menu);
								}
							} else {
								itemHTML += '<li id="' + tool.id + '"';
								if (tool.style) {
									itemHTML += ' style="' + tool.style + '" ';
								}
								if (tool.disabeld) {
									itemHTML += ' class="tabs-menu-disabeld" ';
								}
								itemHTML += '><div class="bi-icon ' + tool.iconCls + '"></div>';
								itemHTML += '<div>' + tool.text + '</div>';
								itemHTML += '</li>';
								eventArray.push({
									id: tool.id,
									click: tool.click
								})
							}
						}
						itemHTML += "</ul>";
						if (groupTitle) {
							itemHTML += "<div class='group-name'>" + groupTitle + "</div>";
						}
						itemHTML += "</div>";
						if (groupTitle) {
							itemHTML += "<div class='group-sep'></div>";
						} else {
							itemHTML += "<div class='tools-group-sep'></div>";
						}
					}
					$tabs_contanier.append(itemHTML);
				}

				//绑定点击事件
				for (var a = 0, b = eventArray.length; a < b; a++) {
					var events = eventArray[a];
					(function(events) {
						jQuery("#" + events.id).on('click', function() {
							if (!jQuery(this).hasClass("tabs-menu-disabeld")) {
								events.click.call(this);
							}
						})
					})(events)
				}
				//绑定开关事件
				for (var a1 = 0, b1 = switchEventArray.length; a1 < b1; a1++) {
					var events = switchEventArray[a1];
					(function(events) {
						$("#" + events.id).switchbutton(events.option).change(function() {
							events.change.call(this);
						})
					})(events)
				}

			},
			bindMenuHover: function() {
				jQuery('#tabs li[data-menu]').poshytip({
					content: function() {
						var dataMenu = jQuery(this).attr("data-menu");
						return jQuery("#" + dataMenu).outerHTML();
					},
					alignTo: 'target',
					alignY: 'bottom',
					alignX: 'right',
					offsetY: 2,
					offsetX: -55,
					showTimeout: 200,
					//hideTimeout:2000000,
					keepInViewport: false,
					show: function() {
						//为图表区域的下拉菜单增加拖拽到内容区域
						Header.view.initWidgetDrag();
					}
				});
			},
			initWidgetDrag: function() {
				//为每个图形控件增加拖拽功能
				jQuery(".menu-content div[bi-draggable]").draggable({
					revert: true,
					scroll: false,
					start: function() {
						//jQuery("#tableChartPanel").addClass("dargPanel-warning");
					},
					stop: function() {
						//jQuery("#tableChartPanel").removeClass("dargPanel-warning");
					},
					appendTo: 'body',
					cursor: "move",
					cursorAt: {
						left: 76,
						top: 76
					},
					drag: function(event, ui) {},
					helper: function(event) {
						return jQuery('<div>', {
							'class': 'container hp-container placeholder',
							'chartType': $(this).attr('bi-draggable')
						}).html('<div style="margin:75px 125px">' + $(this).outerHTML() + '</div>');
					}
				});
			}
		};
		return Header.control;
	});