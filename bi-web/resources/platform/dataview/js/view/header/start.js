define(['bace','view/box','view/component/reportUtil','view/widgets/plugins/echarts/tpl'],function(Bace,Box,ReportUtil,Tpl) {
	var Start = {};
	Start.control = {};
	Start.view = {
		startAnalysis: function() {
			//dosomething
			//$.Deferred(Start.view.getThumbURL).done(function(data){ 
			//	log("thumbURL:"+data)
			//	window.open(data);  
			//})
		},
		saveReport: function(previewCallBack) {
			var isPass = true;
			//判断用户是否应用
			if(Box.Property.close && Box.Property.close() === false){
				return;
			}
			
			if($("#tableChartPanel .container").length == 0){
				$.dialog({
				    lock: true,
				    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">请从图表区域选择有效的图形报表！</div>',
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
					    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">该报表不可用，请添加有效的指标维度或移除，再继续保存！</div>',
					    icon: 'warning',
					    ok: true
					});
					isPass = false;
					return false;
				}
			})
			if(previewCallBack && isPass){
				previewCallBack();
				return;
			}
			if(isPass){
				ReportUtil.show();
			}
		},
		publishReport: function(){
			Start.view.saveReport(function(){
				var config = Box.Widgets.start('collect');
				//收集参数
				var param = {
					reportId: Box.main.reportId || "",
					dataId: Box.main.dataId,
					reportName: "预览",
					reportDesc: "",
					labelId: "",
					resportConfig: $.toJSON(config),
					//报表制作页面底部url导航条菜单参数收集 gaoya 20160929
					// reportUrlMenuInfo:"",
					thumbURL:""
				}
				var pKey = (new Date()).getTime();
				window.sessionStorage.setItem(pKey,$.toJSON(param));
				window.open(Bace.handleUrlParam("/platform/dataview/view")+"?previewKey="+pKey);
			})
		},
		saveLayout: function() {
			Tpl.show(null,'save');
		},
		importLayout: function() {
			//dosomething
			Tpl.show(null,'import');
		}
	};
	Start.model = {
		configData: {
			id: 'tabs_start',
			groups: [{
				title: '任务面板',
				tools: [
//				{
//					id: 'startAnalysis',
//					disabeld: true,
//					text: '立即分析',
//					iconCls: 'icon-start-analysis',
//					click: Start.view.startAnalysis
//				}, 
				{
					id: 'saveReport',
					text: '保存',
					iconCls: 'icon-start-saveReport',
					click: Start.view.saveReport
				}
				,{
					id: 'publishReport',
					text: '预览报表',
					iconCls: 'icon-start-publishReport',
					click: Start.view.publishReport
				}
				]
			}
			, {
				title: '布局管理',
				tools: [{
					id: 'saveLayout',
					text: '保存模版',
					iconCls: 'icon-start-saveLayout',
					click: Start.view.saveLayout
				}, {
					id: 'importLayout',
					text: '引用模版',
					iconCls: 'icon-start-importLayout',
					click: Start.view.importLayout
				}]
			}
			]
		}
	};

	return {
		saveReport:Start.view.saveReport,
		config:Start.model.configData,
//		取消向"header"中输出"布局管理"&&修改"另存为"图标与文字 gaoya 20160817
		 changeLayoutManage:function () {
		 	Start.model.configData.groups.pop();
			 Start.model.configData.groups[0].tools.pop();
		 	Start.model.configData.groups[0].tools[0].text="另存为";
		 	Start.model.configData.groups[0].tools[0].iconCls="icon-discovery-saveReport";
		 }
	}
});