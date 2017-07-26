define(['sabace'], function(sabace) {
	
	var ProviceOrCitySelect = {};
	var selectObj = {};
	
	ProviceOrCitySelect.view = {
		init:function(){
			// 省份
			jQuery('#provice').ajaxChosen({
				fields: ['code','label'],
				findPage: true,
				disabled: true,
				url : sabace.handleUrlParam('/platform/resmanage/data/data-query-province')
			});
			
			// 地市
			jQuery('#city').ajaxChosen({
				fields: ['code','label'],
				upperChosenId: 'provice',
				findPage: true,
				disabled: true,
				url : sabace.handleUrlParam('/platform/resmanage/data/data-query-city')
			});
		},
		saveSelect:function(){
			var provice = jQuery('#provice').val();
			var city = jQuery('#city').val();
			if(provice == "" && city == ""){
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.db.title.tips'),
					message: sabace.getMessage('data.provice.message.proviceAndCity')
				});
				selectObj.flag = false;
			}else if(provice != "" && city == ""){
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.db.title.tips'),
					message: sabace.getMessage('data.provice.message.city')
				});
				selectObj.flag = false;
			}else{
				selectObj.flag = true;
				if(provice == "" && city != ""){
					selectObj.selectValue = "B-" + city;
				}else{
					selectObj.selectValue = "A-" + provice  + "," + "B-" + city;
				}
			}
			return selectObj;
		}
	}
	
	ProviceOrCitySelect.control = { 
		init:function(){
			ProviceOrCitySelect.view.init();
		},
		saveSelect: function(){
			return ProviceOrCitySelect.view.saveSelect();
		}
	};
		
	//返回页面所需方法
	return ProviceOrCitySelect.control;
});
