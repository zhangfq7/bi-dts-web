define(['sabace','dztree'], function(sabace,dztree) {
	var LinkDimFilter = {};
	LinkDimFilter.module={
		ajaxURL:'/platform/resmanage/datalink/query-tree-data',
		dimId:'',
		paramObj:{}
	}
	LinkDimFilter.view={
		init:function(){
			function ajaxDataFilter(treeId, parentNode, responseData){
				return responseData.RES_DATA;
			}
			jQuery('#bztree_input').dzTree({
				async:{
					 enable: true,
					 autoParam: ["id=clickCode","dimId=clickDimId"],
					 url:sabace.handleUrlParam(LinkDimFilter.module.ajaxURL),
					 dataType:'json',
					 otherParam: {"dimId":LinkDimFilter.module.dimId},
					 dataFilter: ajaxDataFilter,
					 treeId:"zDimTree",
					 zTreeId:"zDimTree",
					 mTreeId:"mDimTree"
				},
			});
		},
		initForModify:function(){
			var tmpObj  = LinkDimFilter.module.paramObj;
			function ajaxDataFilter(treeId, parentNode, responseData){
				return responseData.RES_DATA;
			}
			jQuery('#bztree_input').dzTree({
				async:{
					 label:tmpObj.whereText,
					 code:tmpObj.whereValue,
					 enable: true,
					 autoParam: ["id=clickCode","dimId=clickDimId"],
					 url:sabace.handleUrlParam(LinkDimFilter.module.ajaxURL),
					 dataType:'json',
					 otherParam: {"dimId":LinkDimFilter.module.dimId},
					 dataFilter: ajaxDataFilter,
					 treeId:"zDimTree",
					 zTreeId:"zDimTree",
					 mTreeId:"mDimTree"
				},
			});
		//	jQuery('#bztree_input').val(LinkDimFilter.module.paramObj.whereText);
		},
		getSelectData:function(){
			var dimNameArr = jQuery('#bztree_input').val();
			var dimCodeArr = jQuery('#bztree_input').dzTree('getCheckCode','#bztree_input');
			var paramObj = {};
			paramObj.whereValue =dimCodeArr;
			paramObj.whereText =dimNameArr;
			paramObj.trueText = dimNameArr;
			//2：数值间隔
			paramObj.filterType = '1';
			paramObj.isExclude = '0';
			return paramObj;
		}
	};
	LinkDimFilter.controller = {
		init:function(mFlag){
			if('modify' == mFlag){
				LinkDimFilter.view.initForModify();
			}else{
				LinkDimFilter.view.init();
			}
		},
		setDimId:function(dimIdTemp){
			LinkDimFilter.module.dimId = dimIdTemp;
		},
		//获取维度选择的值
		getDimCode:function(){
			return LinkDimFilter.view.getSelectData();
		},
		setModifyObj:function(obj){
			LinkDimFilter.module.paramObj = obj;
		}
	};
	return LinkDimFilter.controller;
});
