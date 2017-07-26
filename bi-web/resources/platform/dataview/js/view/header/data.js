define(['view/box', 'bace','view/component/DataUtil','view/component/DataInfoUtil'],function(Box,Bace,DataUtil,DataInfoUtil) {
	var Data = {}; 
	Data.control = {};
	Data.view = {
		importData:function(){
			DataUtil.show();
			return;
		},
		importFile:function(){
			//模拟
			$.dialog.tips('正在导入数据文件....(模拟)！', function() {});
		},
		prewDataInfo:function(){
			DataInfoUtil.show();
		}
	};
	Data.model = {
		configData: {
			id: 'tabs_data',
			groups: [{
				title: '获取外部数据',
				tools: [{
					id: 'existData',
					text: '已有数据',
					iconCls: 'icon-data-existData',
					click: Data.view.importData
				}
//				, {
//					id: 'importData',
//					text: '外部文件',
//					iconCls: 'icon-data-importData',
//					click: Data.view.importFile
//				}
				]
			}, {
				title: '数据源',
				tools: [{
					id: 'prevData',
					text: '预览当前工作表',
					iconCls: 'icon-data-prevData',
					click: Data.view.prewDataInfo
				}]
			}]
		}
	};
	return {
		config: Data.model.configData
	}
});