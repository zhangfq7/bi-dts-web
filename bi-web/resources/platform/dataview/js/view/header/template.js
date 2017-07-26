define(['bace','view/box','view/component/reportUtil','view/widgets/plugins/echarts/tpl'],function(Bace,Box,ReportUtil,Tpl) {
	var Template = {};
	Template.control = {};
	Template.view = {
		/*saveLayout: function() {
			Tpl.show(null,'save');
		},*/
		importLayout: function() {
			Tpl.show(null,'import');
		}
	};
	Template.model = {
		configData: {
			id: 'tabs_template',
			groups: [
				{
				/*title: '布局管理',*/
				tools: [ {
					id: 'importLayout',
					text: '引用模版',
					iconCls: 'icon-start-importLayout',
					click: Template.view.importLayout
				}]
			}
			]
		}
	};

	return {
		config:Template.model.configData
	}
});