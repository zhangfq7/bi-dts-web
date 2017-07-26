define(['bace','view/box'],
	function(Bace,Box) {
		var Filter = {

		};
		// 全局筛选配置参数
		var globalConfig = {};
		Filter.control = {
			//初始化方法
			init: function() {
				Filter.view.init();
				//挂载筛选条件收集方法
				Box.Filter.dataStart = Filter.control.dataStart;

			},
			openFilter:function(){
				Filter.view.openFilter();
			},
			closeFilter:function(){
				Filter.view.closeFilter();
			},
			dataStart:function(handle){
				//多功能函数,如果参数是 colect 则收集过滤条件,否则构建过滤组件
				if(handle === 'collect'){
					var _filters = [];
					jQuery("#filterPanel .filter-attr").each(function(){
						var $this = $(this);
						var filterAttrData = $this.data("filterAttrData");
						var filterValue = "";
						log(filterAttrData);
						//如果是维度，则获取data里code值
						if(!Bace.IsEmpty(filterAttrData.dimId) || ['A','B','C'].indexOf(filterAttrData.filterType)>-1){
							var code = $this.find(".bi-input").data('code');
							filterAttrData.filterValue = code?code.join(','):''
							//存入展示的值
							filterAttrData.filterLabelValue = JSON.stringify([$this.find(".bi-input").val(),'']);
						}else{
							var startValue = $this.find(".intervalInput.start").val();
							var startType =  $this.find(".chooseType.start >select").val();
							var valArray = startType.split('_');
							var _filterType = valArray[0];
							//如果是大于或者大于等于类型,则还需要收集一个结束值
							if(_filterType == "more" || _filterType == "moreEq"){
								var filterStr = '';
								var endType = $this.find(".chooseType.end >select").val();

								//针对用户发的符号进行转义
								startValue =  encodeURIComponent(startValue);
								var endValue =   encodeURIComponent($this.find(".intervalInput.end").val());
								var startSign = _filterType=="more"?">":">=";
								var endSign = endType=="less"?"<":"<=";

								//如果起始数据为空(设置查询参数,保存查询框的值)
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
								//构建左右匹配,全匹配参数
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
			},
			getPluginByType:function(type){
				if (['pie', 'bar', 'line', 'radar', 'funnel', 'gauge', 'map', 'scatter', 'heatmap'].indexOf(type) > -1) {
					return Box.Widgets.plugins["echarts"];
				} else {
					return  Box.Widgets.plugins[type];
				}
			},
			setGlobalFilter: function(type){
				Filter.view.initFilter(type);
			},
			reomveGlobalFilter: function(dataId){
				Filter.view.reomveGlobalFilter(dataId);
			}
		}

		Filter.view = {
			init: function() {
				//装载筛选区，筛选条件拖拽动作
				Filter.view.installFilterSortable();

				//初始化指标维度面板所有绑定事件
				var bindEvent = Filter.view.bindFilterEvent;
				for (var event in bindEvent) {
					bindEvent[event]();
				}
			},
			installFilterSortable:function(){
				$( "#filterPanel .filter-panel,.filterarea" ).sortable({
					items: 'div.filter-attr',
					revert: false,
					scroll:false,
					delay:200,
					cancel:'.bi-input,.intervalInput',
					//cursorAt: { top: 10, left: 56 },
					placeholder:"filter-placeholder",
					containment:'parent',
					over:function(event, ui){
						setTimeout(function(){
							myLayout.center.children.layout1.resizeAll()
						},0)
					},
					out:function(event, ui){
						setTimeout(function(){
							myLayout.center.children.layout1.resizeAll()
						},0)
					},
					start: function( event, ui ) {
						ui.item.css({
							'cursor':'move'
						})
					},
					stop:function( event, ui ) {
						var $item = ui.item;
						//筛选条件容器中，自己拖动自己不做处理(从指标面板拖过来的需要构造成筛选条件)
						if(!$item.hasClass('filter-attr')){
							var filterAttrData = {
								attrId:$item.attr("data-attrid"),
								attrName:$item.attr("data-attrname"),
								attrType:$item.attr("data-attrtype"),
								filterType:$item.attr("data-filterType"),
								dimId:$item.attr("data-dimId"),
								attrClass:$item.attr("data-attrclass"),
								filterLabelValue:"",//只有提交查询的时候才启用，
								filterValue:""
							}
							var $filterItem = Filter.view._packFilter(filterAttrData);

							$item.replaceWith($filterItem);

							var multiples = parseInt(jQuery(".filter-panel").height()/45);
							if(multiples>1&&multiples<4){
								jQuery(".search .fa-search").css({
									"font-size":15*multiples*0.6
								})
							}
						}
					}
				}).disableSelection().off("mousedown.ui-disableSelection"); //停止冒泡(firefox下会不能选中input,需要off一下)
			},
			_packFilter:function(filterAttrData){
				filterAttrData.filterId = filterAttrData.attrId +"_"+new Date().getTime();
				var whereItem = '';
				whereItem +='<div id="${filterId}" class="filter-attr cursor-pointer">';
				whereItem +='   	<span class="label">';
				// 探索
				if(discovery == "1"){
					whereItem +='   		<label>${attrName}</label><span>：</span>';
				}else{
					whereItem +='   		<label class="label-global">${attrName}</label><span>：</span>';
				}
				whereItem +='   		<input id="${filterId}_input" type="text" class="bi-input target" />';
				whereItem +='   	</span>';
				// 探索
				if(discovery == "1"){
					whereItem +='   	<span class="icon-filter-tools">';
					whereItem +='   		<i class="fa fa-remove icon-filter-hover" style="margin-left:1px" title="删除"></i>';
					whereItem +='   	</span>';
				}else{
					whereItem +='   	<span class="icon-filter-tools icon-filter-tools-global">';
					whereItem +='   		<i class="fa fa-cog icon-filter-hover" style="margin-left:2px" title="修改"></i>';
					whereItem +='   		<i class="fa fa-remove icon-filter-hover" style="margin-left:2px" title="删除"></i>';
					whereItem +='   	</span>';
				}
				whereItem +='</div>';
				
				
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
													//时间类型和数值类型没有模糊查询   (数据库直连是有可能是字符类型但是筛选类型是月份、日期、时间的，这类是不需要模糊查询的)
													'{{if attrType != 1 && attrType != 2 && filterType != 4 && filterType != 6 && filterType != 7}}'+
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
							filterType: type,
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
					if(filterAttrData.filterType == Filter.module.filterType.MONTH || filterAttrData.filterType == Filter.module.filterType.DAY || filterAttrData.filterType == Filter.module.filterType.TIME){
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
							if(option && option.isInit){
								(function(option){
									if(option.config.build.dataParams){
										option.config.build.dataParams.filterJsonStr = $.toJSON(Filter.control.dataStart("collect"))
									}
									//不同组件调用不同apply方法
									Filter.control.getPluginByType(option.chartType).apply(option,true);
								})(option);
							}else{
								$.dialog.alert('该图形未初始化！');
							}
						});
					});
				},
				//删除指标
				removeFilter:function(){
					jQuery("#filterPanel").on('click ','.fa-remove',function(){
						jQuery(this).parents('.filter-attr').fadeOut(200,function(){
							this.remove();
						});
						
						setTimeout(function(){
							myLayout.resizeAll();
							
							jQuery("#tableChartPanel >.container[charttype]").each(function(){
								var option = $(this).data("option");
								if(option && option.isInit){
									(function(option){
										if(option.config.build.dataParams){
											option.config.build.dataParams.filterJsonStr = $.toJSON(Filter.control.dataStart("collect"))
										}
										//不同组件调用不同apply方法
										Filter.control.getPluginByType(option.chartType).apply(option,true);
									})(option);
								}
							});
							
						},300)

					});
				},
				//修改指标
				modifyFilter:function(){
					jQuery("#filterPanel").on('click ','.fa-cog',function(){
						// 获取修改指标
						globalConfig.editFilterData = jQuery(this).parent().parent().data("filterAttrData");
						globalConfig.editFilterId = jQuery(this).parent().parent().attr("id");
						Filter.view.initFilter("edit");

						setTimeout(function(){
							myLayout.resizeAll()
						},300);
					});
				},
				//弹出设置
				settingFilter:function(){
					jQuery("#filterPanel").on('click','span.icon-filter-tools.cog',function(){
						var $this = jQuery(this);
						if(jQuery(".fliterMenu").is(":visible")){
							//$this.poshytip('hide');
						}else{
							 $this.poshytip('show');
						}
					})
				},
				hoverAttr:function(){
					jQuery("#filterPanel").on('mouseover','.filter-attr',function(){
						$(this).addClass('hover');
					})
					jQuery("#filterPanel").on('mouseout','.filter-attr',function(event){
						var $this =  jQuery(this);
						var id =$this.attr("id");
						if(jQuery(".fliterMenu[fid='"+id+"']").is(":visible")){
							//$this.poshytip('hide');
						}else{
							$this.removeClass('hover');
						}
					});

					//兼容手机 待定
					jQuery("#filterPanel").on('touchend','.filter-attr',function(){
						$(this).find(".bi-input").focus()
						$(this).addClass('hover');
					})
					jQuery("#filterPanel").on('touchmove','.filter-attr',function(event){
						var $this = jQuery(this);
						var $poshytip = $this.find("span.icon-filter-tools.cog");
						 $poshytip.poshytip('show');
						 setTimeout(function(){
						 	$this.find(".bi-input").blur()
						 },10)
					})
					jQuery("body").on("touchstart",function(event){
						jQuery("span.icon-filter-tools.cog").poshytip('hide');
					})
				}
			},
			initFilter: function(type) {
				// 获取数据源数量
				var config = Box.Widgets.start('collect');
				var collectWidgets = config.widgets;
				var length = collectWidgets.length;
				if(length == 0){
					$.dialog({
					    lock: true,
					    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">请先设置图表！</div>',
					    icon: 'warning',
					    width: '200px',
						height: '70px',
					    resize: false,
					    ok: true
					});
					return;
				} else {
					var dataIds = "";
					var dataIdArr = [];
					var dataNames = [];
					var widgetsObject = null;
					var dataId = null;
					var dataName = null;
					var index = -1;
					// 获取所有的数据源的dataId
					for(var i = 0; i < length; i++){
						widgetsObject = collectWidgets[i];
						if(typeof(widgetsObject.option.config.build.dataParams) != "undefined"){
							dataId = widgetsObject.option.config.build.dataParams.dataId;
							dataName = widgetsObject.option.config.build.dataParams.dataName;
							index = jQuery.inArray(dataId, dataIdArr);
							// 首先判断该数据源数组中该id是否已经存在
							if(index == -1){
								if(i == 0){
									dataIds += dataId;
								} else {
									dataIds += "," + dataId;
								}
								dataIdArr.push(dataId);
								dataNames.push(dataName);
							}
						}
					}
					if(dataIdArr.length > 0){
						//弹出全局筛选弹出框
						$("<div></div>",{
							"id":'globalFilterPanel',
							"style":'display:none'
						}).appendTo("body");
						var pageURL = Bace.handleUrlParam("/platform/dataview/set-global-filter") + "?type=" + type + "&_t=" + (new Date()).getTime();
						jQuery("#globalFilterPanel").load(pageURL, function() {
							Filter.view.setGlobalFilter(dataIdArr, dataIds, dataNames, type);
						})
					}
				}
			},
			setGlobalFilter: function(dataIdArr, dataIds, dataNames, type) {
				globalConfig.type = type;
				globalConfig.dataIdArr = dataIdArr;
				globalConfig.scount = dataIdArr.length;
				globalConfig.dataIds = dataIds;
				globalConfig.dataNames = dataNames;
				// 根据数据源数据控制页面大小
				globalConfig.width = 930;
				if(globalConfig.scount == 1) {
					globalConfig.width = 460;
				}else if(1< globalConfig.scount <= 5 ){
					globalConfig.width = 930 - (5 - globalConfig.scount) * 100;
				}console.log(1);
				$.dialog({
					id: 'globalFilterDialog',
					title: '设置筛选条件',
					padding: '0',
					width: globalConfig.width + 'px',
					lock: true,
					resize: false,
					content: $("#globalFilterPanel")[0],
					init: function(){
						// 获取数据源基本信息
						Filter.view.getDataInfo();
					},
					ok: function() {
						// 校验用户是否有选择
						Filter.view.saveFilterColumn();
						return false;
					},
					okVal: '保存',
					cancelVal: '关闭',
					cancel: function() {
						return true;
					}
				});
			},
			initGlobalFilter: function() {
				// 根据数据源数量添加对应字段div
				Filter.view.addColumn("init");
				// 如果是修改，将当前已设置的展示出来
				if(globalConfig.type == "edit"){
					// 获取页面上的init-class将过滤名称展示出来
					var initObj = jQuery("#globalFilterPanel .init-class");
					// .filter-input
					initObj.find(".filter-input").val(globalConfig.editFilterData.attrName);
					// 遍历所有的filter-chosen-select
					var colIndex = null;
					var optionHtml = null;
					var dataId = null;
					var attrId = null;
					var index = null;
					initObj.find(".filter-chosen-select").each(function(){
						// 如果当前数据源只有一个
						if(globalConfig.scount == 1){
							// 指标类型
							globalConfig.editFilterData.attrType = null;
							globalConfig.editFilterData.filterType = null;
							globalConfig.editFilterData.dimId = null;
							globalConfig.editFilterData.attrClass = null;
						}
						jQuery(this).find("[value!='']option").remove();
						// 获取当前colIndex
						colIndex = jQuery(this).parent().parent().attr("colIndex");
						dataId = globalConfig.dataIdArr[colIndex];
						// 判断该id是否在dataArr里面
						index = jQuery.inArray(dataId, globalConfig.editFilterData.dataArr);
						// 重新设置option
						optionHtml = Filter.view.getAttrItems(colIndex, globalConfig.editFilterData.attrType, globalConfig.editFilterData.filterType, globalConfig.editFilterData.dimId);
						jQuery(this).append(optionHtml);
						if(index > -1){ // 说明已经配置过的
							attrId = globalConfig.editFilterData.attrArr[index];
							jQuery(this).find("[attrId='" + attrId + "']").prop("selected", true);
						};
						jQuery(this).trigger("chosen:updated");
						// 没有配置过,可能是又开始就没有配置，也可能是后来又新增的数据源
						if(globalConfig.editFilterData.attrType == null || globalConfig.editFilterData.attrType == ""){
							// 指标类型
							globalConfig.editFilterData.attrType = jQuery(this).find("option:selected").attr("attrType");
							// 筛选类型
							globalConfig.editFilterData.filterType = jQuery(this).find("option:selected").attr("filterType");
							// 维度Id
							globalConfig.editFilterData.dimId = jQuery(this).find("option:selected").attr("dimId");
							// 指标分类
							globalConfig.editFilterData.attrClass = jQuery(this).find("option:selected").attr("attrClass");
						}
					});
					
				}
				// 新增图标hover事件
				jQuery("#globalFilterPanel .filter-add").hover(function(){
				    // 移进方法
					jQuery("#globalFilterPanel .filter-add .filter-add-icon-white").addClass("hide");
					jQuery("#globalFilterPanel .filter-add .filter-add-icon-blue").removeClass("hide");
				},function(){
					// 移出方法
					jQuery("#globalFilterPanel .filter-add .filter-add-icon-blue").addClass("hide");
					jQuery("#globalFilterPanel .filter-add .filter-add-icon-white").removeClass("hide");
				});
				// 点击新增图标事件
				jQuery("#globalFilterPanel .filter-add").on("click", function() {
					// 添加一行
					Filter.view.addColumn("add");
				});
			},
			getDataInfo: function() {
				$.ajax({
					type: "POST",
					url: Bace.handleUrlParam("/platform/dataview/get-column-info"),
					dataType: 'json',
					data: {
						dataIds: globalConfig.dataIds
					},
					success: function(req) {
						if(req.resFlag == "success"){
							globalConfig.attrList = req.attrList;
							// 初始化数据
							Filter.view.initGlobalFilter();
						}else{
							$.dialog({
							    lock: true,
							    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">获取数据源字段信息失败！</div>',
							    icon: 'warning',
							    width: '200px',
								height: '70px',
							    resize: false,
							    ok: true
							});
							return false;
						}
					},
					error: function(req) {
						$.dialog({
						    lock: true,
						    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">获取数据源字段信息异常！</div>',
						    icon: 'warning',
						    width: '200px',
							height: '70px',
						    resize: false,
						    ok: true
						});
						return false;
					}
				});
			},
			addColumn: function(type) {
				var selWidth = 120;
				if(globalConfig.scount == 1){
					selWidth = 220;
				}else if(globalConfig.scount == 2){
					selWidth = 180;
				}else if(globalConfig.scount == 3){
					selWidth = 150;
				}else if(globalConfig.scount == 4){
					selWidth = 140;
				}
				var colWidth = globalConfig.width - 220;
				if(globalConfig.scount > 5){
					colWidth = (colWidth / 5) - 2;
				}else{
					colWidth = (colWidth / globalConfig.scount) - 2;
				}
				
				if(globalConfig.scount > 5){
					var html = '<li class="init-class" style="width:' + globalConfig.width + 'px;">';
					if(type == "add"){
						html = '<li class="add-line" style="width:' + globalConfig.width + 'px;">';
					}
				}else{
					var html = '<li class="init-class filter-li">';
					if(type == "add"){
						html = '<li class="add-line filter-li">';
					}
				}
				
				var liItems = "";
				// 左边筛选名称
				liItems += '<div class="filter-name">';
				if(type == "init"){
					liItems += '	<div class="filter-name-title">';
					liItems += ' 		<span class="f14">筛选名称</span>';
					liItems += '	</div>';
				}
				liItems += '	<div class="filter-name-input">';
				liItems += ' 		<input type="text" class="filter-input" placeholder="请输入名称"/>  ：';
				liItems += '	</div>';
				liItems += '</div>';
				liItems += '<div class="filter-column">';
				var colItems = "";
				for(var i=1; i <= globalConfig.scount; i++){
					// 右边指标信息
					colItems += '<div class="filter-column-attr" style="width: '+ colWidth + 'px;" colIndex=' + (i-1) + '>';
					if(type == "init"){
						colItems += '	<div class="filter-column-span" style="width: '+ colWidth +'px;" title="' + globalConfig.dataNames[i-1] + '对应字段"><span>' + globalConfig.dataNames[i-1] + '对应字段</span></div>';
					}
					colItems += '	<div class="filter-column-select">';
					colItems += '		<select class="filter-chosen-select" style="width: '+ selWidth +'px;" data-placeholder="请选择字段">';
					colItems += '			<option value="" selected></option>';
					colItems += Filter.view.getAttrItems(i-1, null, null,null);
					colItems += '		</select>';
					colItems += '	</div>';
					colItems += '</div>';
				}
				liItems += colItems;
				liItems += '</div>';
				html += liItems;
				html += "</li>";
				jQuery("#filterColumn").append(html);
				
				// 初始化select
				jQuery(".filter-chosen-select").chosen({
					allow_single_deselect: true
				});
				
				// 绑定下拉change事件
				jQuery("#globalFilterPanel").on('change','.filter-chosen-select',function(){
					// 如果当前值为空，说明点击了"X"清除按钮，这时候先判断
					var curObjVal = jQuery(this).val();
					// 兄弟对象
					var selObj = null;
					// 指标类型
					var attrTypeVal = null;
					// 筛选类型
					var filterTypeVal = null;
					// 维度Id
					var dimIdVal = null;
					// 判断所有的兄弟是否有选择
					jQuery(this).parent().parent().siblings().each(function(){
						selObj = jQuery(this).find("select [value!='']option:selected");
						if(selObj){
							attrTypeVal = selObj.attr("attrType");
							filterTypeVal = selObj.attr("filterType");
							dimIdVal = selObj.attr("dimId");
							return false;
						}
					});
					
					// 所有的兄弟都没有选择
					if(attrTypeVal == null){
						// attrTypeVal为空时，选取当前的attrType、filterType、dimId
						// 指标类型
						attrTypeVal = jQuery(this).find("option:selected").attr("attrType");
						// 筛选类型
						filterTypeVal = jQuery(this).find("option:selected").attr("filterType");
						// 维度Id
						dimIdVal = jQuery(this).find("option:selected").attr("dimId");
					}
					
					// 当前切换回空了，那么根据兄弟的选择重新加载当前切换的下拉框
					if(curObjVal == ""){
						// 删除所有的option
						jQuery(this).find("[value!='']option").remove();
						// 获取当前colIndex
						var colIndex = jQuery(this).parent().parent().attr("colIndex");
						// 重新设置option
						var optionHtml = Filter.view.getAttrItems(colIndex, attrTypeVal, filterTypeVal, dimIdVal);
						jQuery(this).append(optionHtml);
						jQuery(this).trigger("chosen:updated");
						// 当只有一个兄弟有选择的时候，则该兄弟可以看到所有的
						if(jQuery(this).parent().parent().siblings().length == 1){
							attrTypeVal = null;
						}
					}
					
					// 根据筛选类型、筛选类型、维度Id来改变除该列之外的所有下拉框
					// 遍历parent().parent()所有的兄弟
					jQuery(this).parent().parent().siblings().each(function(){
						var selectValue = jQuery(this).find(".filter-chosen-select option:selected").val();
						// 删除所有的option
						jQuery(this).find(".filter-chosen-select [value!='']option").remove();
						// 获取当前colIndex
						var colIndex = jQuery(this).attr("colIndex");
						// 重新设置option
						var optionHtml = Filter.view.getAttrItems(colIndex, attrTypeVal, filterTypeVal, dimIdVal);
						jQuery(this).find(".filter-chosen-select").append(optionHtml);
						// 设置选择项
						if(selectValue != ""){
							jQuery(this).find(".filter-chosen-select").val(selectValue);
						}
						jQuery(this).find(".filter-chosen-select").trigger("chosen:updated");
					});
					
				});
			},
			getAttrItems: function(colIndex, attrTypeVal, filterTypeVal, dimIdVal){
				var attr = globalConfig.attrList[colIndex];
				var dataId = globalConfig.dataIdArr[colIndex];
				var html = '';
				var attrObj = null;
				var attrId = null;
				var attrName = null;
				var attrField = null;
				var attrType = null;
				var filterType = null; 
				var dimId = null;
				var attrClass = null;
				for(var j=0; j<attr.insertList.length; j++){
					attrObj = attr.insertList[j];
					attrId = attrObj.attrId;
					attrName = attrObj.attrName;
					attrField = attrObj.fieldName;
					attrType = attrObj.attrType;
					filterType = attrObj.filterType;
					dimId = attrObj.dimId;
					attrClass = attrObj.attrClass;
					// 判断类型、筛选类型、维度id
					if(attrTypeVal == null){
						html += '<option value=' + attrField + ' attrType=' + attrType +' filterType=' + filterType + ' attrId=' + attrId + ' dataId = ' + dataId + ' attrClass = ' + attrClass + ' dimId=' + dimId +'>' + attrName + '</option>';
					} else if(attrTypeVal == attrType && filterTypeVal == filterType && dimIdVal == dimId){
						html += '<option value=' + attrField + ' attrType=' + attrType +' filterType=' + filterType + ' attrId=' + attrId + ' dataId = ' + dataId + ' attrClass = ' + attrClass + ' dimId=' + dimId +'>' + attrName + '</option>';
					}
				}
				return html;
			},
			saveFilterColumn: function() {
				// 判断用户是有有设置,遍历所有的li中的name和column,将每行都单独拼装成一个过滤对象,确保name和column中都是有值的
				var setObj = {};
				var setArr = [];
				var i = 0;
				var attrId = null;
				var attrArr = [];
				var dataId = null;
				var dataArr = [];
				jQuery("#filterColumn .filter-li").each(function(){
					setObj = {};
					i = 0;
					attrId = null;
					attrArr = [];
					dataId = null;
					dataArr = [];
					setObj.filterName = jQuery.trim(jQuery(this).find(".filter-input").val());
					// 遍历所有的column
					jQuery(this).find(".filter-chosen-select").each(function(){
						if(jQuery(this).val() != ""){
							if(i == 0){
								setObj.attrType = jQuery(this).find("option:selected").attr("attrType");
								setObj.filterType = jQuery(this).find("option:selected").attr("filterType");
								setObj.dimId = jQuery(this).find("option:selected").attr("dimId");
								setObj.attrClass = jQuery(this).find("option:selected").attr("attrClass");
							}
							attrId = jQuery(this).find("option:selected").attr("attrId");
							dataId = jQuery(this).find("option:selected").attr("dataId");
							attrArr.push(attrId);
							dataArr.push(dataId);
							i++;
						}
					});
					setObj.attrArr = attrArr;
					setObj.dataArr = dataArr;
					// 将filterName不为空且column不为空的加入到数组中
					if((typeof(setObj.filterName) != "undefined" && setObj.filterName != "") && (typeof(setObj.attrArr) != "undefined" && setObj.attrArr.length > 0)){
						setArr.push(setObj);
					}
				})
				if(setArr.length > 0){
					var filterObj = null;
					var filterAttrData = null;
					var $filterItem = null;
					$.dialog.confirm("您确定保存该设置吗？", function () {
						// 解析数组拼装查询条件
						for(var i = 0; i < setArr.length; i++){
							filterObj = setArr[i];
							filterAttrData = {
								attrId: "attrId" + i,
								attrName: filterObj.filterName,
								attrType: filterObj.attrType,
								filterType: filterObj.filterType,
								attrClass: filterObj.attrClass,
								dimId: filterObj.dimId,
								filterLabelValue: "",//只有提交查询的时候才启用，
								filterValue: "",
								attrArr: filterObj.attrArr, // 全局筛选
								dataArr: filterObj.dataArr // 全局筛选
							}
							$filterItem = Filter.view._packFilter(filterAttrData);
							if(globalConfig.type == "edit"){
								jQuery("#filterPanel .filter-panel #" + globalConfig.editFilterId + "").replaceWith($filterItem);
							}else{
								jQuery("#filterPanel .filter-panel").append($filterItem);	
							}
						}
						$.dialog.closeAll();
					});
				} else{
					$.dialog({
					    lock: true,
					    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">请检查设置的查询条件，筛选名称和关联字段都需要设置！</div>',
					    icon: 'warning',
					    width: '200px',
						height: '70px',
					    resize: false,
					    ok: true
					});
					return false;
				}
			},
			reomveGlobalFilter: function(dataId) {
				// 首先，收集一下是否有图表
				var config = Box.Widgets.start('collect');
				var collectWidgets = config.widgets;
				var length = collectWidgets.length;
				if(length == 1){ // 说明图表已经全部被删除了，判断是否有过滤条件，如果有过滤条件，移除所有的过滤条件
					jQuery("#filterPanel .filter-attr").each(function(){
						jQuery(this).remove();
					});
				} else {
					// 移除所有的过滤条件中的dataArr中dataId,attrArr中的arrId
					var filterData = null;
					var attrArr = null;
					var dataArr = null;
					var index = null;
					jQuery("#filterPanel .filter-attr").each(function(){
						filterData = jQuery(this).data("filterAttrData");
						attrArr = filterData.attrArr;
						index = filterData.dataArr.indexOf(dataId);
						if(index > -1){
							// 判断当前dataId是否有多个图表
							var widgetsObject = null;
							var paramDataId = null;
							var dataIdArr = [];
							var count = 0;
							for(var i = 0; i < length; i++){
								widgetsObject = collectWidgets[i];
								if(typeof(widgetsObject.option.config.build.dataParams) != "undefined"){
									paramDataId = widgetsObject.option.config.build.dataParams.dataId;
									if(dataId == paramDataId){
										count += 1;
									}
								}
							}
							if(count == 1){
								filterData.dataArr.splice(index, 1);
								filterData.attrArr.splice(index, 1);
							}
						}
						if(filterData.dataArr.length == 0) {
							jQuery(this).remove();
						}
					});
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