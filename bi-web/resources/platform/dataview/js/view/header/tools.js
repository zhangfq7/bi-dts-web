define(['view/box','bace','view/component/BgUtil'],function(Box,Bace,BgUtil) {
	var Tools = {};
	Tools.control = {};
	Tools.view = {
		toggleFilter: function() {
	            var state,way;
	            if(jQuery("#openFilter")[0]) {
	                state = jQuery("#openFilter").prop('checked');
	            }
	            way = state?"open":"close";
			Box.Layout.toggleFilterPanel(way);
		},
		openOpera: function() {
			//不调用展示隐藏方法  modify  by wangle
			//Box.Layout.toggleOperaPanel();

			//myLayout.center.children.layout1.center.children.layout1.center.children.layout1.toggle('north');
//			if ($(this).prop("checked")) {
//				$("#autoUpdate").switchbutton({
//					classes: 'ui-switchbutton-ios5 ui-switchbutton-thin',
//					checkedLabel: '   开启预警 ',
//					uncheckedLabel: '  关闭预警 '
//				});
//			}
		},
		openGird: function() {
			jQuery('.grid-bg').toggleClass('no-bg');
//			if ($(this).prop("checked")) {
//				$("div.container").draggable("option", "grid", null);
//			} else {
//				$("div.container").draggable("option", "grid", [20, 20]);
//			}
		},
		openURL:function(){
			var stateUrl,method;
			if($("#openURL")[0]){
					stateUrl=$("#openURL").prop("checked");
			}
			method=stateUrl?"open":"close";
			Box.Widgets.openUrlPanel(method);
		},
		buildThemeMenu: function() {
			var themes = [{
				name: '默认',
				themeName:'macarons',
				colors: ['#D76E73', '#FFB778', '#48AAF1', '#B6A2E0', '#00C3C6']
			}, {
				name: '经典',
				themeName:'vintage',
				colors: ['#0E727D', '#EC8A32', '#FDCD00', '#B0C100', '#D0585C']
			}, {
				name: '致青春',
				themeName:'roma',
				colors: ['#005CAD', '#268312', '#0097DC', '#E7B600', '#C32C2F']
			},{
				name: '七色时光',
				themeName:'shine',
				colors: ['#146F9B', '#00B2DA', '#00B2DA', '#87B0BC', '#97D2DE']
			}, {
				name: '五彩斑斓',
				themeName:'infographic',
				colors: ['#3DB7D5', '#E7256C', '#F5E43D', '#FF9700', '#87EF18']
			},{
				name: '暗夜精灵',
				themeName:'dark',
				colors: ['#0E727D', '#EC8A32', '#FDCD00', '#B0C100', '#D0585C']
			}]

//		   {
//				name: '抹茶',
//				themeName:'mint',
//				colors: ['#367C23', '#3D8921', '#85B477', '#85B477', '#A8CCA0']
//			},
//			{
//				name: '奥利奥',
//				themeName:'gray',
//				colors: ['#595959', '#757575', '#8B8B8B', '#C0C0C0', '#DCD9D1']
//			},
//			 {
//				name: '蔓越莓',
//				themeName:'red',
//				colors: ['#9B3015', '#DA3407', '#D46564', '#85B477', '#F18E5E']
//			},  {
//				name: '浪漫樱花',
//				themeName:'sakura',
//				colors: ['#E82936', '#FD4E69', '#F79286', '#F9B1AA', '#F9C3D8']
//			},

			var borderSettingHTML = '<div id="themeMenu" class="menu-content" style="width: 200px;">' + '	<div class="menuTitle" >' + '		皮肤设置' + '	</div>' + '	<div class="menuContent theme">';
			var colorHTML = '';
			for (var i = 0; i < themes.length; i++) {
				var theme = themes[i];
				var name = theme.name;
				var colors = theme.colors;
				var themeName = theme.themeName;
				colorHTML += '<div data-theme="'+themeName+'" class="' + (i == 0 ? "theme-check" : "") + '"><i class="fa fa-check"></i>' + name + ' <div class="example">';
				for (var k = 0; k < colors.length; k++) {
					var color = colors[k];
					colorHTML += '<div class="colorborder" style="background:' + color + '"></div>';
				}
				colorHTML += '</div></div>';
			}
			borderSettingHTML += colorHTML;
			borderSettingHTML += '</div>';
			return borderSettingHTML;
		},
		setTheme:function(){
			$(this).addClass("theme-check").siblings().removeClass('theme-check');
			Box.Header.tools.themeName = $(this).attr("data-theme");
			sessionStorage.setItem("themeName", Box.Header.tools.themeName);
			Box.Widgets.plugins["echarts"].setTheme(Box.Header.tools.themeName);
		},
		openBgDialog:function(){
			BgUtil.show();
		}
	};
	Tools.model = {
		configData: {
			id: 'tabs_tools',
			groups: [{
				title:'操作工具',
				tools: [{
					panel: [{
						id: 'openFilter',
						text: '查询框',
						title: '查询框',
						type: 'switchbutton',
						iconCls: 'icon tools-serach',
						option: {
							classes: 'ui-switchbutton-thin',
							checkedLabel: '打 开',
							uncheckedLabel: '关 闭'
						},
						change: Tools.view.toggleFilter
					},{
							id: 'openDownload',
							text: '下&nbsp;&nbsp;&nbsp;&nbsp;载',
							title: '下&nbsp;&nbsp;&nbsp;&nbsp;载',
							type: 'switchbutton',
							iconCls: 'icon tools-download',
							option: {
								classes: 'ui-switchbutton-thin',
								checkedLabel: '打 开',
								uncheckedLabel: '关 闭'
							},
							change: Tools.view.openOpera
					}, {
						id: 'openGird',
						text: '背&nbsp;&nbsp;&nbsp;&nbsp;景',
						title: '背&nbsp;&nbsp;&nbsp;&nbsp;景',
						type: 'switchbutton',
						checked: 'checked',
						iconCls: 'icon tools-grid',
						option: {
							classes: 'ui-switchbutton-thin',
							checkedLabel: '打 开',
							uncheckedLabel: '关 闭'
						},
						change: Tools.view.openGird
					},{//url导航开关 gaoya 20160908
						id: 'openURL',
						text: 'URL导航',
						title: 'URL导航',
						type: 'switchbutton',
						// checked:'checked',
						iconCls: 'icon tools-url',
						option: {
							classes: 'ui-switchbutton-thin',
							checkedLabel: '打 开',
							uncheckedLabel: '关 闭'
						},
						change: Tools.view.openURL
					}]
				}],
			   style: 'width:300px;'
			},
			{
				title:'设置工具',
				tools: [{
					id: 'themeSetting',
					text: '主题设置',
					iconCls: 'icon-tools-theme',
					menu: {
						id: 'themeMenu',
						html: Tools.view.buildThemeMenu()
					},
					click: Tools.view.setTheme
				}, {
					id: 'bgSetting',
					text: '背景设置',
					iconCls: 'icon-tools-bg',
					click: Tools.view.openBgDialog
				}],
				/*style: 'width:130px'*/
			}
			]
		}
	};
	return {
		config: Tools.model.configData,
		discoveryUrlLayout:function(){
			Tools.model.configData.groups[0].tools[0].panel.pop();
		},
		openSendEmail:function(){
			var email = {
					id: 'openSendEmail',
					text: '邮件推送',
					title:'邮件推送',
					type: 'switchbutton',
					iconCls: 'icon tools-email',
					option: {
						classes: 'ui-switchbutton-thin',
						checkedLabel: '打 开',
						uncheckedLabel: '关 闭'
					},
					change: Tools.view.openOpera
			};
		    Tools.model.configData.groups[0].tools[0].panel.splice(1,0,email);
		    Tools.model.configData.groups[0].style = "width:" +　(150 * Math.ceil(Tools.model.configData.groups[0].tools[0].panel.length / 2)) + "px;";
		},
		openWaterflag:function(){
			var waterFlag = {
					id: 'openWaterflag',
					text: '水&nbsp;&nbsp;&nbsp;&nbsp;印',
					title:'水&nbsp;&nbsp;&nbsp;&nbsp;印',
					type: 'switchbutton',
					checked: 'checked',
					iconCls: 'icon tools-waterflag',
					option: {
						classes: 'ui-switchbutton-thin',
						checkedLabel: '打 开',
						uncheckedLabel: '关 闭'
					},
				change: function(){/*noop*/}
			};
		    Tools.model.configData.groups[0].tools[0].panel.push(waterFlag);
		    Tools.model.configData.groups[0].style = "width:" +　(150 * Math.ceil(Tools.model.configData.groups[0].tools[0].panel.length / 2)) + "px;";
		}
	}
});
