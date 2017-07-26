define(['bace','view/box'],
	function(Bace,Box) {
		var Filter = {

		};
		Filter.control = {
			openFilter:function(){
				Filter.view.openFilter();
			},
			closeFilter:function(){
				Filter.view.closeFilter();
			},
			dataStart:function(handle){
				if(handle === 'collect'){
					var _filters = [];
					jQuery("#filterPanel .filter-attr").each(function(){
						var $this = $(this);
						var filterAttrData = $this.data("filterAttrData");
						var filterValue = "";
						//如果是维度，则获取data里code值
						if(filterAttrData.dimId || ['A','B','C'].indexOf(filterAttrData.filterType)>-1){
							var code = $this.find(".bi-input").data('code');
							filterAttrData.filterValue = code?code.join(','):''
							//存入展示的值
							filterAttrData.filterLabelValue = JSON.stringify([$this.find(".bi-input").val(),'']);
						}else{
							var startValue = $this.find(".intervalInput.start").val();
							var startType =  $this.find(".chooseType.start >select").val();
							var valArray = startType.split('_');
							var _filterType = valArray[0];
							if(_filterType == "more" || _filterType == "moreEq"){
								var filterStr = '';
								var endType = $this.find(".chooseType.end >select").val();
								
								//针对用户发的符号进行转义
								startValue =  encodeURIComponent(startValue);
								var endValue =   encodeURIComponent($this.find(".intervalInput.end").val());
								var startSign = _filterType=="more"?">":">=";
								var endSign = endType=="less"?"<":"<=";
								
								//如果起始数据为空
								if(startValue && endValue){
									filterValue = startSign+startValue +","+ endSign+endValue;
									filterAttrData.filterLabelValue = JSON.stringify([startValue,endValue])
								}else{
									if(startValue){
										filterValue = startSign+startValue;
										filterAttrData.filterLabelValue = JSON.stringify([startValue,''])
									}
									if(endValue){
										filterValue = endSign+endValue;
										filterAttrData.filterLabelValue = JSON.stringify(['',endValue]);
									}
									if(startValue == '' && endValue == ''){
										filterAttrData.filterLabelValue = JSON.stringify(['','']);
									}
								}
								filterAttrData.filterSelectValue = JSON.stringify([startType,endType]);
							}else{
								
								if(_filterType == "like"){
									filterValue = "%"+startValue+"%"
								}
								if(_filterType == "leftLike"){
									filterValue = startValue + "%";
								}
								if(_filterType == "rightLike"){
									filterValue = "%" + startValue;
								}
								if(_filterType == "eq"){
									filterValue = startValue;
								}
								filterAttrData.filterSelectValue = JSON.stringify([startType,'']);
								filterAttrData.	filterLabelValue =  JSON.stringify([startValue,'']);
							}
							
							filterAttrData.filterValue = filterValue;
							//filterAttrData.filterType = valArray[1];
						}
						_filters.push(filterAttrData)
					})
					return _filters;
				}else{
					for(var i = 0 ,n=handle.length;i<n;i++){
						var $filterItem = Filter.view._packFilter(handle[i]);
						jQuery(".filter-panel").append($filterItem)
						var labelValueArray = $.evalJSON(handle[i].filterLabelValue);
						(function(array,$filterItem){
							setTimeout(function(){
								$filterItem.find(".intervalInput.start").val(decodeURIComponent(array[0]))
								$filterItem.find(".intervalInput.end").val(decodeURIComponent(array[1]))
							},100)
							
						})(labelValueArray,$filterItem)
						
					}
				}
				Filter.view.init();
			},
			getPluginByType:function(type){
				if (['pie', 'bar', 'barMix', 'line', 'radar', 'funnel', 'gauge', 'map', 'treemap', 'scatter'].indexOf(type) > -1) {
					return Box.Widgets.plugins["echarts"];
				} else {
					return  Box.Widgets.plugins[type];
				}
			}
		}
		
		Filter.view = {
			init: function() {
				//初始化指标维度面板所有绑定事件
				//挂载筛选条件收集方法
				Box.Filter.dataStart = Filter.control.dataStart;
				var bindEvent = Filter.view.bindFilterEvent;
				for (var event in bindEvent) {
					bindEvent[event]();
				}
			},
			_packFilter:function(filterAttrData){
				filterAttrData.filterId = filterAttrData.attrId +"_"+new Date().getTime();
				var whereItem='<div id="${filterId}" class="filter-attr cursor-pointer">'
								+'   	<span class="label">'
								+'   		<label>${attrName}</label><span>：</span>'
								+'   		<input id="${filterId}_input" type="text" class="bi-input target" />'
								+'   	</span>'
								+'   	<span class="icon-filter-tools">'
								+'   		<i class="fa fa-remove icon-filter-hover" style="margin-left:1px"></i>'
								+'   	</span>'
								+'</div>';
				var filterAttrObj = $.tmpl(whereItem, filterAttrData).data("filterAttrData",filterAttrData);		
				
				setTimeout(function(){
					//根据当前指标类型，和筛选类型生成搜索输入框,并绑定各自相应的事件
					Filter.view.translate(filterAttrData);
				},0)
				
				return filterAttrObj;
			},
			translate:function(filterAttrData,type){
				//当前筛选对象
				var $filterAttrObj = $("#"+filterAttrData.filterId);
				
				//默认input
				var $input = $filterAttrObj.find("input.target");
				
				//先销毁除了input之外的筛选元素
				$filterAttrObj.find('select').chosen("destroy");
				$filterAttrObj.find('.bi-filter').remove();
				
				var type = filterAttrData.filterType;
				//维度查询
				if([Filter.module.filterType.DIM,'A','B','C'].indexOf(type) > -1){
					var dimId = $filterAttrObj.data("filterAttrData").dimId;
					var filterType = $filterAttrObj.data("filterAttrData").filterType;
					function ajaxDataFilter(treeId, parentNode, responseData){
//						log(JSON.stringify(responseData))
						//$("#"+treeId).slibings(".treeNoResultPanel").show();
						return responseData.RES_DATA;
					}
					
					var label = filterAttrData.filterLabelValue?$.evalJSON(filterAttrData.filterLabelValue)[0]:'';
					$filterAttrObj.find(".bi-input").bzTree({
						async:{ 
							 label:label,
							 code:filterAttrData.filterValue,
							 enable: true,
							 autoParam: ["id=clickCode","dimId=clickDimId"],
							 url:Bace.handleUrlParam(Filter.module.ajaxURL),
							 dataType:'json',
							 otherParam: {"dimId":dimId,"filterType":filterType},
							 dataFilter: ajaxDataFilter
						}
					});
				}else{
					var selectType =filterAttrData.filterSelectValue?$.evalJSON(filterAttrData.filterSelectValue):null;
					
					//构建筛选类型框
					var selectTypeHTML = '<div class="intervalGroup {{if endType != "less" && endType != "lessEq" }} like {{/if}} bi-filter">'+
											'<div class="chooseType start">'+
												'<select>'+
													//时间类型和数值类型没有模糊查询
													'{{if attrType != 1 && attrType != 2}}'+
														'<option {{if startType == "like_9" }} selected {{/if}}value="like_9" >全匹配</option>'+
														'<option {{if startType == "leftLike_9" }} selected {{/if}} value="leftLike_9" >左匹配</option>'+
														'<option {{if startType == "rightLike_9" }} selected {{/if}} value="rightLike_9" >右匹配</option>'+
													'{{/if}}'+
													'<option {{if startType == "eq_3" }} selected {{/if}}value="eq_3" >精确</option>'+
													'<option {{if startType == "more_2" }} selected {{/if}}value="more_2" >&gt;</option>'+
													'<option {{if startType == "moreEq_2" }} selected {{/if}} value="moreEq_2" >&gt;=</option>'+
												'</select>'+
											'</div>'+
											'<div><input class="intervalInput start"/></div>'+
											'<div class="chooseType end"  {{if endType != "less" && endType != "lessEq" }}  style="display:none" {{/if}} >'+
												'<select>'+
													'<option {{if endType == "less" }} selected {{/if}} value="less" >&lt;</option>'+
													'<option {{if endType == "lessEq" }} selected {{/if}} value="lessEq" >&lt;=</option>'+
												'</select>'+
											'</div>'+
											'<div class="endInput" {{if endType != "less" && endType != "lessEq" }}  style="display:none" {{/if}}><input class="intervalInput end"/></div>'+
										'</div>';
					$input.hide().after(
						$.tmpl(selectTypeHTML, {
							attrType:filterAttrData.attrType,
							startType:selectType?selectType[0]:'',
							endType:selectType?selectType[1]:''
						}
					));
					
					$filterAttrObj.find(".chooseType.start select").chosen({
						width: "54px",
						disable_search: true
					});
					
					$filterAttrObj.find(".chooseType.end select").chosen({
						width: "32px",
						disable_search: true
					});
					
					//时间查询
					if(filterAttrData.attrType == Filter.module.attrType.DATE){
						//如果是时间切换，销毁时间组件
						var $startDate = $filterAttrObj.find("input.start");
						var $endDate = $filterAttrObj.find("input.end");
						
						
						if($startDate.data("DateTimePicker")){
							$startDate.data("DateTimePicker").destroy();
							$endDate.data("DateTimePicker").destroy();
						}
						var fmt = "";
						var showChangeType = "";
						if(type == Filter.module.filterType.MONTH){
							fmt = "YYYY-MM";
						}
						if(type == Filter.module.filterType.DAY){
							fmt = "YYYY-MM-DD"
							showChangeType += "months,days"
						}
						if(type == Filter.module.filterType.TIME){
							fmt = "YYYY-MM-DD HH:mm:ss"
							showChangeType += "months,days,times"
						}
						//默认当前筛选时间值的类型跟本身类型相同
						filterAttrData.filterValueType = type;
						
						$filterAttrObj.find("input.start,input.end").datetimepicker({
							format: fmt,
							showClear:true,
							showTodayButton:true,
							showChangeType:showChangeType,
							keepOpen:false,
							onhide:function(){
								jQuery(this).attr("title",$(this).val()).parents(".filter-attr").removeClass("hover");
							},
							onChangeType:function(format,type){
								var $startDatePicker = $filterAttrObj.find("input.start").data("DateTimePicker");
								var $endDatePicker = $filterAttrObj.find("input.end").data("DateTimePicker");
								
								$startDatePicker.viewMode(type);
								$startDatePicker.format(format);
								$endDatePicker.viewMode(type);
								$endDatePicker.format(format);
								//更滑默认当前筛选时间值的类型
								switch (type) {
									case 'months':
										filterAttrData.filterValueType = Filter.module.filterType.MONTH;
										break;
									case 'times':
										filterAttrData.filterValueType = Filter.module.filterType.TIME;
										break;
									case 'days':
										filterAttrData.filterValueType = Filter.module.filterType.DAY;
										break;
									default:
										break;
								}
							}
						});
					
						$filterAttrObj.find("input.startDate").on("dp.change", function (e) {
							$filterAttrObj.find("input.endDate").data("DateTimePicker").minDate(e.date);
				   		});
					}
				}
				setTimeout(function(){
					myLayout.center.children.layout1.resizeAll()
				},0)
			},
			bindFilterEvent:{
				//切换不同的筛选面板
				changeFilterSelect:function(){
					jQuery("#filterPanel").on('change','.chooseType.start select',function(){
						var $this = jQuery(this);
						var val = $this.val();
						if(["moreEq_2","more_2","less","lessEq"].indexOf(val)>-1){
							$this.parents(".filter-attr .intervalGroup").removeClass("like")
							$this.parents(".filter-attr").find(".end,.endInput").show();
						}else{
							$this.parents(".filter-attr .intervalGroup").addClass("like")
							$this.parents(".filter-attr").find(".end,.endInput").hide();
						}
						setTimeout(function(){
							myLayout.center.children.layout1.resizeAll()
						},0)
					})
					
				},
				//查询
				search:function(){
					jQuery("#filterPanel .search ").on('click',function(){
						jQuery("#tableChartPanel >.container[charttype]").each(function(){
							var option = $(this).data("option");
							if(option){
								(function(option){
									option.config.build.dataParams.filterJsonStr = $.toJSON(Filter.control.dataStart("collect"))
									//不同组件调用不同apply方法
									Filter.control.getPluginByType(option.chartType).apply(option,true);
								})(option);
							}
						}); 
					});
				},
				hoverAttr:function(){
				
				}
			}
			
		}
		
		Filter.module = {
			ajaxURL:'/platform/dataview/query-tree-data',
			attrType:{
				INT:"1",
				DATE:"2",
				STRING:"3"
			},
			filterType:{
				DIM:"1",//维度
				INTERVAL:'2',//间隔
				EQUAL:'3',//精确
				LIKE:'9',//模糊
				MONTH:'4',//月份
				DAY:'6',//日期
				TIME:'7'//时间
			},
			
			
		};
		return Filter.control;
	}
)		