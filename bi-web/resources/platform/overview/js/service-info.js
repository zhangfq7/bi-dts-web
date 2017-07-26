define(['sabace'], function(sabace) {
var serviceInfo = {} 

serviceInfo.controller={

		init:function(){
			
			var postData = {
					state:state
			};
			$("#serviceInfoListGrid").jqGrid({
				url: sabace.handleUrlParam('/platform/overview/sysGlobal/query-serviceInfo-list'),
				styleUI: 'Bootstrap',
				datatype: "json",
				postData: postData,
				mtype: 'post',
				forceFit: true,
				regional: 'cn',
				colModel: [{
					label: "数据源",
					name: 'datatype',
					width: 160,
					align: 'left',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						if (cellvalue == 1) {
							return '导入文件信息表';
						} else if (cellvalue == 2) {
							return '导入数据表信息表';
						} else {
							return '数据连接信息表';
						}
					}
				}, {
					label: "数据表",
					name: 'dataName',
					width: 190,
					align: 'left',
					hlign: 'center',
					sortable: false

				}, {
					label: "当前状态",
					name: 'state',
					width: 120,
					align: 'left',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						if (cellvalue == 9) {
							return '成功';
						} else {
							return '失败';
						}
					}
				}, {
					label: "失败原因",
					name: 'taskRemark',
					width: 120,
					align: 'left',
					hlign: 'center',
					sortable: false,
					hidden : (postData.state==9)
				}, {
					label: "拥有者",
					name: 'userName',
					width: 120,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: "更新周期",
					name: 'updatePeriod',
					width: 120,
					align: 'left',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						if (cellvalue == "I") {
							return '立即更新';
						} else if(cellvalue == "S"){
							return '只更新一次';
						}else if(cellvalue == "D"){
							return '每日更新';
						}else if(cellvalue == "W"){
							return '每周更新';
						}else if(cellvalue == "M"){
							return '每月更新';
						}else {
						return '';
						}
					}
				}, {
					label: "最近更新时间",
					name: 'lastUpdateTime',
					width: 180,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: "下次更新时间",
					name: 'nextUpdateTime',
					width: 180,
					align: 'left',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue) {
						if(cellvalue == "-1"){
							return '';
						}else{
							return cellvalue;
						}
					}
				}, {
					label: "引用次数",
					name: 'tableReportNum',
					width: 120,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: "共享人数",
					name: 'shareReportNum',
					width: 150,
					align: 'left',
					hlign: 'center',
					sortable: false
				}],
				viewrecords: true, // show the current page, data rang and total records on the toolbar
				autowidth: true,
				height: 375,
				rowNum: 10,
				rowList: [10, 20, 30],
				rownumbers: true, //show row number	
				pager: "#serviceInfoListGridPager",
				jsonReader: {
					records: "total",
					total: "totalPages"
				},

			});

		}
		
}

return serviceInfo.controller
})