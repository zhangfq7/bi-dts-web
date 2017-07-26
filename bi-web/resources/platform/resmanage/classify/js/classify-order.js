define(['sabace'], function(sabace) {
 
	
	var classifyOrder = {}
	var classifyIds;
	
	classifyOrder.controller={
			init: function(){
				initClassifyOrderPage();
//				jQuery("#classifyOrderWindow").niceScroll();
			},
			saveOrder: function(){
				return saveClassifyOrder();
			}
	}
	
	function initClassifyOrderPage(){
		
		initSortable();
		
		queryClassifyList();
	}
	
	function saveClassifyOrder(){
		var classifyIdArr = [];
		jQuery("li.classifyList").each(function(){
		    classifyIdArr.push($(this).attr("classifyId"));
		});
		if(classifyIds == classifyIdArr.join(",")){
			closeOrderDialog();
			return;
		}
		var dataParams = {
				classifyId: classifyIdArr.join(",")
			};
			sabace.ajax({
				data: dataParams,
				loading: {
					title: sabace.getMessage('classify.label.tip'),
					text: sabace.getMessage('classify.label.pleaseWait')
				},
				url: sabace.handleUrlParam("/platform/resmanage/classify/save-order-classify"),
				success: function(req) {
					bi.dialog.show({
						title: "保存成功",
						message: req.responseText || "保存成功",
						buttons:[{
					   		label: "确定",
					   		cssClass: 'btn-info',
					   		action: function(dialog){
					   			dialog.close();
					   			closeOrderDialog();
					   			jQuery('#claasifyListGrid').trigger("reloadGrid");
							}
						}
					   ]
					});
					
				},
				error: function(req) {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: "保存失败",
						message: req.responseText || "保存失败"
					});
					return false;
				}
			});
	}
	
	function queryClassifyList(){
		sabace.ajax({
			type: "post",
			cache: false,
			dataType: "json",
			url: sabace.handleUrlParam("/platform/resmanage/classify/classify-list"),
			data: {
				"pageFlag": "0"
			},
			success: function(req) {
				var classifyList = req;
				setOrderList(classifyList);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: "查询失败",
					message: req.responseText || "查询失败"
				});
			}
		});
	}
	
	function setOrderList(classifyList){
		var classifyIdArr = [];
		var htmlArr = [];
		for(var i=0; i<classifyList.length; i++){
			var adminTimeStr = classifyList[i].adminTime;
			adminTimeStr = adminTimeStr.substr(0, 10);
			classifyIdArr.push(classifyList[i].classifyId);
			htmlArr.push('<li class="classifyList" classifyId="'+ classifyList[i].classifyId +'"><span class="sortIcon"></span><span class="sortName">'+ classifyList[i].classifyName +'</span><span class="sortDesc">'+ classifyList[i].classifyDesc +'</span><span class="sortTime">'+ adminTimeStr +'</span><span class="sortAdmin">'+ classifyList[i].createId +'</span></li>');
		}
		classifyIds = classifyIdArr.join(",");
		jQuery("#sortClassify").html(htmlArr.join(""));
	}
	
	function initSortable(){
		$("#sortClassify").sortable({
			placeholder: "ui-state-highlight"
	    });
	    $("#sortClassify").disableSelection();
	}
	
	return classifyOrder.controller
});
