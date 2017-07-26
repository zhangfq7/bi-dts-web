define(['sabace'], function(sabace) {
	var LinkDataFilter = {};
	LinkDataFilter.module = {
			mFlag:'',
			paramObj:{},
			ziduanId:'',
			changeBg:function(str,obj){
				var headArray = jQuery(str);
				for(var i = 0;i < headArray.length; i++){
					if(jQuery(headArray[i]).hasClass('filterText-bg')){
						jQuery(headArray[i]).removeClass('filterText-bg');
					}
				}
				jQuery(obj).addClass('filterText-bg');
			},
			changeBgColor:function(str,obj){
				str = str+' div';
				LinkDataFilter.module.changeBg(str, obj);
			},
			changeTab:function(divId){
				var divId = divId+"Div";
				var tabDivArr = jQuery('.dataTabDiv');
				for(var i = 0;i<tabDivArr.length;i++){
					var tempId = jQuery(tabDivArr[i]).attr('id');
					if(divId == tempId){
						if(jQuery(tabDivArr[i]).hasClass('dis-none')){
							jQuery(tabDivArr[i]).removeClass('dis-none');
						}
					}else{
						if(!jQuery(tabDivArr[i]).hasClass('dis-none')){
							jQuery(tabDivArr[i]).addClass('dis-none');
						}
					}
				}
			},
			//修改筛选的时候赋值
			initTabForModify:function(divFlag){
				var fType = LinkDataFilter.module.paramObj.filterType;
				log(LinkDataFilter.module.paramObj)
				if('2' == fType){
					if('8' == divFlag){
						jQuery('.numberFilterDiv').removeClass('dis-none');
						//intervalDiv
						LinkDataFilter.module.changeBgColor('.numberFilterDiv','.numberFilterDiv #interval');
						jQuery('.numberFilterDiv div').on('click',function(){
							LinkDataFilter.module.changeBgColor('.numberFilterDiv',this);
							LinkDataFilter.module.changeSelect(this);
						});
					}else{
						jQuery('.headFilterDiv').removeClass('dis-none');
						//intervalDiv
						LinkDataFilter.module.changeBgColor('.headFilterDiv','.headFilterDiv #interval');
						jQuery('.headFilterDiv div').on('click',function(){
							LinkDataFilter.module.changeBgColor('.headFilterDiv',this);
							LinkDataFilter.module.changeSelect(this);
						});
					}
					LinkDataFilter.module.changeTab('interval');
					var valArr = [];
					var value = LinkDataFilter.module.paramObj.whereValue;
					//将value值进行分割
					if(!sabace.IsEmpty(value)){
						var valueArr = value.split(',');
						if(valueArr.length==2){
							if(valueArr[0].startWith('>=')){
								valArr.push('>=');
								if(valueArr[0].length>2){
									valArr.push(valueArr[0].substring(2));
								}else{
									valArr.push("");
								}
							}else{
								valArr.push('>');
								if(valueArr[0].length>1){
									valArr.push(valueArr[0].substring(1));
								}else{
									valArr.push("");
								}
							}
							
							if(valueArr[1].startWith('<=')){
								valArr.push('<=');
								if(valueArr[1].length>2){
									valArr.push(valueArr[1].substring(2));
								}else{
									valArr.push("");
								}
							}else{
								valArr.push('<');
								if(valueArr[1].length>1){
									valArr.push(valueArr[1].substring(1));
								}else{
									valArr.push("");
								}
							}
							jQuery('#minValue').val(valArr[0]);
							jQuery("#minValue").trigger("chosen:updated");
							jQuery('#minValueText').val(valArr[1]);
							jQuery('#maxValue').val(valArr[2]);
							jQuery("#maxValue").trigger("chosen:updated");
							jQuery('#maxValueText').val(valArr[3]);
						}
					}
				}else if('3' == fType){
					if('8' == divFlag){
						jQuery('.numberFilterDiv').removeClass('dis-none');
						//intervalDiv
						LinkDataFilter.module.changeBgColor('.numberFilterDiv','.numberFilterDiv #precise');
						jQuery('.numberFilterDiv div').on('click',function(){
							LinkDataFilter.module.changeBgColor('.numberFilterDiv',this);
							LinkDataFilter.module.changeSelect(this);
						});
					}else{
						jQuery('.headFilterDiv').removeClass('dis-none');
						//precise
						LinkDataFilter.module.changeBgColor('.headFilterDiv','.headFilterDiv #precise');
						jQuery('.headFilterDiv div').on('click',function(){
							LinkDataFilter.module.changeBgColor('.headFilterDiv',this);
							LinkDataFilter.module.changeSelect(this);
						});
					}
					LinkDataFilter.module.changeTab('precise');
					jQuery('#preciseSelect').val(LinkDataFilter.module.paramObj.isExclude);
					$("#preciseSelect").trigger("chosen:updated");
					//jQuery("#preciseSelect").chosen();
					jQuery('#preciseSelectText').val(LinkDataFilter.module.paramObj.whereValue);
				}else if('9' == fType){
					jQuery('.headFilterDiv').removeClass('dis-none');
					//fuzzy
					LinkDataFilter.module.changeBgColor('.headFilterDiv','#fuzzy');
					LinkDataFilter.module.changeTab('fuzzy');
					
					jQuery('#fuzzySelect').val(LinkDataFilter.module.paramObj.isExclude);
					jQuery("#fuzzySelect").trigger("chosen:updated");
					jQuery('#fuzzySelectText').val(LinkDataFilter.module.paramObj.whereValue);
					jQuery('.headFilterDiv div').on('click',function(){
						LinkDataFilter.module.changeBgColor('.headFilterDiv',this);
						LinkDataFilter.module.changeSelect(this);
					});
				}else if('8' == fType){
					if('8' == divFlag){
						jQuery('.numberFilterDiv').removeClass('dis-none');
						//intervalDiv
						LinkDataFilter.module.changeBgColor('.numberFilterDiv','.numberFilterDiv #isEmpty');
						jQuery('.numberFilterDiv div').on('click',function(){
							LinkDataFilter.module.changeBgColor('.numberFilterDiv',this);
							LinkDataFilter.module.changeSelect(this);
						});
					}else{
						jQuery('.headFilterDiv').removeClass('dis-none');
						//isEmpty
						LinkDataFilter.module.changeBgColor('.headFilterDiv','.headFilterDiv #isEmpty');
						jQuery('.headFilterDiv div').on('click',function(){
							LinkDataFilter.module.changeBgColor('.headFilterDiv',this);
							LinkDataFilter.module.changeSelect(this);
						});
					}
					LinkDataFilter.module.changeTab('isEmpty');
					jQuery("input[name='relRadio'][value="+LinkDataFilter.module.paramObj.whereValue+"]").attr('checked',true);
				}else if('4' == fType){
					//月份
					var obj = LinkDataFilter.module.paramObj;
					var whereValue = obj.whereValue;
					jQuery('.monthFilterDiv').removeClass('dis-none');
					var fmtTemp = "YYYY-MM";
					jQuery('#month_input').datetimepicker({
					 	format: fmtTemp,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#month_section_input_from').datetimepicker({
					 	format: fmtTemp,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#month_section_input_to').datetimepicker({
					 	format: fmtTemp,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('.monthFilterDiv div').on('click',function(){
						LinkDataFilter.module.changeBgColor('.monthFilterDiv',this);
						LinkDataFilter.module.changeSelect(this);
					});
					if(-1 == whereValue.indexOf(',')){
						LinkDataFilter.module.changeBgColor('.monthFilterDiv','#month');
						LinkDataFilter.module.changeTab('month');
						jQuery('#month_input').val(whereValue);
					}else{
						var whereArray = whereValue.split(",");
						LinkDataFilter.module.changeBgColor('.monthFilterDiv','#monthSection');
						LinkDataFilter.module.changeTab('monthSection');
						jQuery('#month_section_input_from').val(whereArray[0].substring(2));
						jQuery('#month_section_input_to').val(whereArray[1].substring(2));
					}
				}else if('6' == fType){
					//日期
					var obj = LinkDataFilter.module.paramObj;
					var whereValue = obj.whereValue;
					jQuery('.dateFilterDiv').removeClass('dis-none');
					var fmtTemp = "YYYY-MM-DD";
					jQuery('#date_input').datetimepicker({
					 	format: fmtTemp,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#date_section_input_from').datetimepicker({
					 	format: fmtTemp,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#date_section_input_to').datetimepicker({
					 	format: fmtTemp,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					if(-1 == whereValue.indexOf(',')){
						LinkDataFilter.module.changeBgColor('.dateFilterDiv','#date');
						LinkDataFilter.module.changeTab('date');
						jQuery('#date_input').val(whereValue);
					}else{
						var whereArray = whereValue.split(",");
						LinkDataFilter.module.changeBgColor('.dateFilterDiv','#dateSection');
						LinkDataFilter.module.changeTab('dateSection');
						jQuery('#date_section_input_from').val(whereArray[0].substring(2));
						jQuery('#date_section_input_to').val(whereArray[1].substring(2));
					}
					jQuery('.dateFilterDiv div').on('click',function(){
						LinkDataFilter.module.changeBgColor('.dateFilterDiv',this);
						LinkDataFilter.module.changeSelect(this);
					});
				}else if('7' == fType){
					//时间	
					var obj = LinkDataFilter.module.paramObj;
					var whereValue = obj.whereValue;
					jQuery('.timeFilterDiv').removeClass('dis-none');
					var fmtTemp = "YYYY-MM-DD HH:mm:ss";
					jQuery('#time_input').datetimepicker({
					 	format: fmtTemp,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#time_section_input_from').datetimepicker({
					 	format: fmtTemp,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#time_section_input_to').datetimepicker({
					 	format: fmtTemp,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('.timeFilterDiv div').on('click',function(){
						LinkDataFilter.module.changeBgColor('.timeFilterDiv',this);
						LinkDataFilter.module.changeSelect(this);
					});
					if(-1 == whereValue.indexOf(',')){
						LinkDataFilter.module.changeBgColor('.timeFilterDiv','#time');
						LinkDataFilter.module.changeTab('time');
						jQuery('#time_input').val(whereValue);
					}else{
						var whereArray = whereValue.split(",");
						LinkDataFilter.module.changeBgColor('.timeFilterDiv','#timeSection');
						LinkDataFilter.module.changeTab('timeSection');
						jQuery('#time_section_input_from').val(whereArray[0].substring(2));
						jQuery('#time_section_input_to').val(whereArray[1].substring(2));
					}
				}
			},
			getSelectData:function(obj){
				var selectDIvId = jQuery(obj).attr('id')+"Div";
				var paramObj = {};
				if('intervalDiv' == selectDIvId){
					var minValue = jQuery('#minValue').val();
					var minValueText = jQuery('#minValueText').val();
					var maxValue = jQuery('#maxValue').val();
					var maxValueText = jQuery('#maxValueText').val();
					/*var filterType = '2';*/
					if(sabace.IsEmpty(minValueText)){
						paramObj.whereValue =minValue+","+maxValue+maxValueText;
					}else if(sabace.IsEmpty(maxValueText)){
						paramObj.whereValue =minValue+minValueText+","+maxValue;
					}else{
						paramObj.whereValue =minValue+minValueText+","+maxValue+maxValueText;
					}
					paramObj.whereText =minValue+minValueText+','+maxValue+maxValueText;
					paramObj.trueText = minValue+minValueText+','+maxValue+maxValueText;
					//2：数值间隔
					paramObj.filterType = '2';
					paramObj.isExclude = '0';
				}else if('preciseDiv' == selectDIvId){
					var preciseSelect =jQuery('#preciseSelect').val();
					var preciseSelectText =jQuery('#preciseSelectText').val();
					paramObj.whereValue = preciseSelectText;
					paramObj.whereText =preciseSelect + preciseSelectText;
					if('0' == preciseSelect){
						paramObj.trueText = sabace.getMessage('data.dataLink.label.Contains') + preciseSelectText;
					}else{
						paramObj.trueText = sabace.getMessage('data.dataLink.label.Exclude') + preciseSelectText;
					}
					//3：精确查询
					paramObj.filterType = '3';
					paramObj.isExclude = preciseSelect;
				} else if('fuzzyDiv' == selectDIvId){
					var fuzzySelect =jQuery('#fuzzySelect').val();
					var fuzzySelectText =jQuery('#fuzzySelectText').val();
					paramObj.whereValue = fuzzySelectText;
					paramObj.whereText =fuzzySelect + fuzzySelectText;
					if('0' == fuzzySelect){
						paramObj.trueText = sabace.getMessage('data.dataLink.label.Contains') + fuzzySelectText;
					}else{
						paramObj.trueText = sabace.getMessage('data.dataLink.label.Exclude') + fuzzySelectText;
					}
					//3：模糊查询
					paramObj.filterType = '9';
					paramObj.isExclude =fuzzySelect;
				}else if('isEmptyDiv' == selectDIvId){
					var relRadio =  jQuery("input[name='relRadio']:checked").val();
					if('0' == relRadio){
						paramObj.whereText = sabace.getMessage('data.dataLink.label.noLabel');
						paramObj.trueText = sabace.getMessage('data.dataLink.label.IsNotEmpty');
					}else{
						paramObj.whereText = sabace.getMessage('data.dataLink.label.yesLabel');
						paramObj.trueText = sabace.getMessage('data.dataLink.label.IsEmpty');
					}
					paramObj.whereValue = relRadio;
					//3：模糊查询
					paramObj.filterType = '8';
					paramObj.isExclude = '0';
				}else if('monthDiv' == selectDIvId){
					var monthInput = jQuery('#month_input').val();
					paramObj.whereValue = monthInput;
					paramObj.whereText = monthInput;
					paramObj.trueText = sabace.getMessage('data.dataLink.label.equalTemp')+monthInput;
					//月份
					paramObj.filterType = '4';
					paramObj.isExclude = '0';
				}else if('monthSectionDiv' == selectDIvId){
					var monthInputFrom = jQuery('#month_section_input_from').val();
					var monthInputTo = jQuery('#month_section_input_to').val();
					paramObj.whereValue = '>='+monthInputFrom+",<="+monthInputTo;
					paramObj.whereText = monthInputFrom+","+monthInputTo;
					paramObj.trueText = monthInputFrom+","+monthInputTo;
					//月份
					paramObj.filterType = '4';
					paramObj.isExclude = '0';
				}else if('dateDiv' == selectDIvId){
					var dateInput = jQuery('#date_input').val();
					paramObj.whereValue = dateInput;
					paramObj.whereText = dateInput;
					paramObj.trueText = sabace.getMessage('data.dataLink.label.equalTemp')+dateInput;
					//月份
					paramObj.filterType = '6';
					paramObj.isExclude = '0';
				}else if('dateSectionDiv' == selectDIvId){
					var dateInputFrom = jQuery('#date_section_input_from').val();
					var dateInputTo = jQuery('#date_section_input_to').val();
					paramObj.whereValue = '>='+dateInputFrom+",<="+dateInputTo;
					paramObj.whereText = dateInputFrom+","+dateInputTo;
					paramObj.trueText = dateInputFrom+","+dateInputTo;
					//月份
					paramObj.filterType = '6';
					paramObj.isExclude = '0';
				}else if('timeDiv' == selectDIvId){
					var timeInput = jQuery('#time_input').val();
					paramObj.whereValue = timeInput;
					paramObj.whereText = timeInput;
					paramObj.trueText = sabace.getMessage('data.dataLink.label.equalTemp')+timeInput;
					//月份
					paramObj.filterType = '7';
					paramObj.isExclude = '0';
				}else if('timeSectionDiv' == selectDIvId){
					var timeInputFrom = jQuery('#time_section_input_from').val();
					var timeInputTo = jQuery('#time_section_input_to').val();
					paramObj.whereValue = '>='+timeInputFrom+",<="+timeInputTo;
					paramObj.whereText = timeInputFrom+","+timeInputTo;
					paramObj.trueText = timeInputFrom+","+timeInputTo;
					//月份
					paramObj.filterType = '7';
					paramObj.isExclude = '0';
				}
				return paramObj;
			},changeSelect:function(obj){
				var divId = jQuery(obj).attr('id')+"Div";
				var tabDivArr = jQuery('.dataTabDiv');
				for(var i = 0;i<tabDivArr.length;i++){
					var tempId = jQuery(tabDivArr[i]).attr('id');
					if(divId == tempId){
						if(jQuery(tabDivArr[i]).hasClass('dis-none')){
							jQuery(tabDivArr[i]).removeClass('dis-none');
						}
					}else{
						if(!jQuery(tabDivArr[i]).hasClass('dis-none')){
							jQuery(tabDivArr[i]).addClass('dis-none');
						}
					}
				}
			},setfilterTextBg:function(obj){
				jQuery(obj).addClass('filterText-bg');
			}
	};
	LinkDataFilter.view = {
		initTabClick:function(divFlag,str){
			var fmt = "";
			//divFlag 9是字符类型 1 月份 2日期 3时间
			if('modify' == str){
				//jQuery('.headFilterDiv').removeClass('dis-none');
				LinkDataFilter.module.initTabForModify(divFlag);
			}else{
				if('1' == divFlag){
					fmt = "YYYY-MM";
					jQuery('.monthFilterDiv').removeClass('dis-none');
					jQuery('#monthDiv').removeClass('dis-none');
					jQuery('#month_input').datetimepicker({
					 	format: fmt,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#month_section_input_from').datetimepicker({
					 	format: fmt,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#month_section_input_to').datetimepicker({
					 	format: fmt,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					LinkDataFilter.module.setfilterTextBg('#month');
					jQuery('.monthFilterDiv div').on('click',function(){
						LinkDataFilter.module.changeBgColor('.monthFilterDiv',this);
						LinkDataFilter.module.changeSelect(this);
					});
				}else if('2' == divFlag){
					fmt = "YYYY-MM-DD";
					jQuery('.dateFilterDiv').removeClass('dis-none');
					jQuery('#dateDiv').removeClass('dis-none');
					jQuery('#date_input').datetimepicker({
					 	format: fmt,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#date_section_input_from').datetimepicker({
					 	format: fmt,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#date_section_input_to').datetimepicker({
					 	format: fmt,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					LinkDataFilter.module.setfilterTextBg('#date');
					jQuery('.dateFilterDiv div').on('click',function(){
						LinkDataFilter.module.changeBgColor('.dateFilterDiv',this);
						LinkDataFilter.module.changeSelect(this);
					});
				}else if('3' == divFlag){
					fmt = "YYYY-MM-DD HH:mm:ss";
					jQuery('.timeFilterDiv').removeClass('dis-none');
					jQuery('#timeDiv').removeClass('dis-none');
					jQuery('#time_input').datetimepicker({
					 	format: fmt,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#time_section_input_from').datetimepicker({
					 	format: fmt,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					jQuery('#time_section_input_to').datetimepicker({
					 	format: fmt,
					 	showClose:true,
						showClear:true,
						showTodayButton:true,
						keepOpen:true
		             });
					LinkDataFilter.module.setfilterTextBg('#time');
					jQuery('.timeFilterDiv div').on('click',function(){
						LinkDataFilter.module.changeBgColor('.timeFilterDiv',this);
						LinkDataFilter.module.changeSelect(this);
					});
				}else if('8' == divFlag){
					LinkDataFilter.module.setfilterTextBg('.numberFilterDiv #interval');
					jQuery('.numberFilterDiv').removeClass('dis-none');
					jQuery('#intervalDiv').removeClass('dis-none');
					jQuery('.numberFilterDiv div').on('click',function(){
						LinkDataFilter.module.changeBgColor('.numberFilterDiv',this);
						LinkDataFilter.module.changeSelect(this);
					});
				}else if('9' == divFlag){
					LinkDataFilter.module.setfilterTextBg('.headFilterDiv #interval');
					jQuery('.headFilterDiv').removeClass('dis-none');
					jQuery('#intervalDiv').removeClass('dis-none');
					jQuery('.headFilterDiv div').on('click',function(){
						LinkDataFilter.module.changeBgColor('.headFilterDiv',this);
						LinkDataFilter.module.changeSelect(this);
					});
				}
			}
		}
	};
	LinkDataFilter.controller = {
		init:function(divFlag,str){
			jQuery('.chosen-select').chosen();
			jQuery('[data-toggle="radio"]').iCheck({
				checkboxClass: 'icheckbox_minimal',
				radioClass: 'iradio_minimal'
			});
			if("modify" == str){
				LinkDataFilter.view.initTabClick(divFlag,str);
			}else{
				LinkDataFilter.view.initTabClick(divFlag);
			}
			//间隔查询
			jQuery('#intervalForm').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'bottomLeft',
				showOneMessage: true
			});
			jQuery('#preciseForm').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'topLeft',
				showOneMessage: true
			});
			jQuery('#fuzzyForm').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'topLeft',
				showOneMessage: true
			});
			jQuery('#monthDiv').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'topLeft',
				showOneMessage: true
			});
			jQuery('#monthSectionForm').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'topLeft',
				showOneMessage: true
			});
			jQuery('#dateForm').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'topLeft',
				showOneMessage: true
			});
			jQuery('#dateSectionForm').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'topLeft',
				showOneMessage: true
			});
			jQuery('#timeForm').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'topLeft',
				showOneMessage: true
			});
			jQuery('#timeSectionForm').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'topLeft',
				showOneMessage: true
			});
		},
		getSelectQuery:function(){
			//获取被选择
			var selectDiv = jQuery('.filterText-bg');
			var selectDIvId = jQuery(selectDiv).attr('id')+"Form";
			var isPass = jQuery('#'+selectDIvId).validationEngine('validate');
			if(!isPass){
				return false;
			}
			return LinkDataFilter.module.getSelectData(selectDiv);
		},
		setModifyObj:function(obj){
			LinkDataFilter.module.paramObj = obj;
		},
		setModifyFlag:function(obj){
			LinkDataFilter.module.mFlag = obj;
		}
	};
	return LinkDataFilter.controller;
});
