define(['bace','view/box','view/component/reportUtil','view/widgets/plugins/echarts/tpl'],function(Bace,Box,ReportUtil,Tpl) {
	var Save = {};
	Save.control = {};
	Save.view = {
		saveReport: function(previewCallBack) {
			var isPass = true;
			//判断用户是否应用
			if(Box.Property.close && Box.Property.close() === false){
				return;
			}
			
			if($("#tableChartPanel .container").length == 0){
				$.dialog({
				    lock: true,
				    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">请从图表区域选择有效的图形仪表板！</div>',
				    icon: 'warning',
				    ok: true
				});
				return;
			}
			$("#tableChartPanel .container").each(function(){
				var $this = $(this);
				var option = $this.data("option");
				if(option === undefined || option.isInit === false){
					$("#tableChartPanel").animate({
						scrollTop: $this.css("top")
					}, 500);
					$.dialog({
					    lock: true,
					    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">该仪表板不可用，请添加有效的指标维度或移除，再继续保存！</div>',
					    icon: 'warning',
					    ok: true
					});
					isPass = false;
					return false;
				}
			});
			if(previewCallBack && isPass){
				previewCallBack();
				return;
			}
			if(isPass){
				ReportUtil.show();
			}
		},
		publishReport: function(){
			Save.view.saveReport(function(){
				var config = Box.Widgets.start('collect');
				//收集参数
				var param = {
					reportId: Box.main.reportId || "",
					dataId: Box.main.dataId,
					reportName: "预览",
					reportDesc: "",
					labelId: "",
					resportConfig: $.toJSON(config),
					//收集页面url菜单 gaoya 20160929
					// reportUrlMenuInfo:"",
					thumbURL:""
				};
				var pKey = (new Date()).getTime();
				window.sessionStorage.setItem(pKey,$.toJSON(param));
				window.open(Bace.handleUrlParam("/platform/dataview/view")+"?previewKey="+pKey);
			})
		},
		saveLayout: function() {
			Tpl.show(null,'save');
		},
	};
	Save.model = {
		configData: {
			id: 'tabs_save',
			groups: [{
				title: '任务面板',
				tools: [{
					id: 'saveReport',
					text: '保存为仪表板',
					iconCls: 'icon-start-saveReport',
					click: Save.view.saveReport
				},{
						id: 'saveLayout',
						text: '保存为模版',
						iconCls: 'icon-start-saveLayout',
						click: Save.view.saveLayout
					}
				/*,{
					id: 'publishReport',
					text: '预览报表',
					iconCls: 'icon-start-publishReport',
					click: Save.view.publishReport
				}*/
				]
			}]
		}
	};

	return {
		saveReport:Save.view.saveReport,
		config:Save.model.configData,
//		取消向"header"中输出"布局管理"&&修改"另存为"图标与文字 gaoya 20160817
		 changeLayoutManage:function () {
			 //Save.model.configData.groups.pop();
			 Save.model.configData.groups[0].tools.pop();
			 Save.model.configData.groups[0].tools[0].text="另存为";
			 Save.model.configData.groups[0].tools[0].iconCls="icon-discovery-saveReport";
		 }
	}
});