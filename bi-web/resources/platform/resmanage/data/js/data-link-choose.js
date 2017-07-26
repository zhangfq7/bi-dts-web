define(['sabace'], function(sabace) {
	var LinkData = {};
	LinkData.module = {
		nodeIdArray:[]
	};
	LinkData.view = {
		initChooseNodejGrid:function(){
			jQuery('#dataGrid').jqGrid({
				 url: sabace.handleUrlParam("/platform/resmanage/datalink/query-data-node"),
				 datatype: "json",
				 postData: {
					 dataId:LinkData.module.nodeIdArray.toString()
				 },
				 styleUI : 'Bootstrap',
			     colModel: [ 
			                  {label: sabace.getMessage('data.dataLink.label.dtcoding'),width: 75 , name : 'dataId', align : 'left',hlign:'center',hidden:true}, 
			                  {label: sabace.getMessage('data.dataLink.label.dcode'), width: 75 ,name : 'dataName', align : 'left',hlign:'center'}, 
			                  {label: sabace.getMessage('data.dataLink.label.Rupdatetime'),width: 75 , name : 'lastUpdateTime', align : 'left',hlign:'center'},
			                  {label: sabace.getMessage('data.dataLink.label.importState'),width: 75 , name : 'importState', align : 'left',hlign:'center',hidden:true},
			                  {label: sabace.getMessage('data.dataLink.label.createPersonID'),width: 75 , name : 'createId', align : 'left',hidden:true},
			                  {label: sabace.getMessage('data.dataLink.label.createPerson'),width: 75 , name : 'createName', align : 'left',hlign:'center'}
			                ],
			     width: 890,
			     height: 285,
			     multiselect: true,
			     multiboxonly:true,
			     rowNum: 10,
				 rownumbers: true,
				 jsonReader:{records:"total",total:"totalPages"},
				 pager: "#jqGridPagerTemp",
				 regional:'cn',
				 loadComplete: function(){
					 jQuery('#cb_dataGrid').css('display','none');
				 }
			});
		},
		initDataListSearch:function(){
			jQuery('#searchDL').on('click',function(){
				var dataName = jQuery('#dataNameSearch').val();
				var dataTypeSelect = jQuery('#dataTypeSelect').val();
				var postData = {
					'nodeDataName':dataName,
					'dataId':LinkData.module.nodeIdArray.toString(),
					'dataType':dataTypeSelect
				};
				jQuery("#dataGrid").jqGrid("setGridParam", {
					postData: postData
				}).trigger("reloadGrid");
			});
			jQuery('#dataseachForLink').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'bottomLeft',
				showOneMessage: true
			});
		}
	};
	LinkData.controller = {
		init:function(){
			//初始化界面
			jQuery('.chosen-select').chosen();
			//初始化jGrid
			LinkData.view.initChooseNodejGrid();
			LinkData.view.initDataListSearch();
		},
		setNodeIdArray:function(param){
			LinkData.module.nodeIdArray = param;
		},
		getCheckedNode:function(){
			var selectedRowIds = jQuery("#dataGrid").jqGrid('getGridParam','selarrrow');
			var nodeObjArr = [];
			var nodeObj;
			for(var i = 0 ; i < selectedRowIds.length;i++){
				var dataId = $("#dataGrid").getCell(selectedRowIds[i],"dataId");
				nodeObj = {};
				nodeObj.dataId = dataId;
				nodeObjArr.push(nodeObj);
			}
			return nodeObjArr;
		}
	};
	return LinkData.controller;
});
