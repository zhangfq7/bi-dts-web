define(['view/box', 'bace','view/component/dateFormatUtil','view/component/CalcUtil','view/component/PersonalizedChoose'],
	function(Box, Bace,dateFormatUtil,CalcUtil,PersonalizedChoose) {
		var AttrTree = {};
		AttrTree.control = {
			init: function() {
				log("初始化指标树")
				AttrTree.view.init();
				Box.AttrTree.openAttrPanel = AttrTree.control.openAttrPanel;
				Box.AttrTree.findAttrByParam = AttrTree.view.findAttrByParam;
				Box.AttrTree.viewInit = AttrTree.view.init;
			},
			openAttrPanel: function(type) {
				//模拟已经导入数据进入系统
				//放开快捷关闭左侧指标按钮
				jQuery('.closeAttr').removeClass('hide')
					.siblings('.layout_title_panel')
					.addClass('closeTag');
				setTimeout(function() {
					//打开指标树/关闭
					if(type === 'open'){
						myLayout.open('west');
					}else{
						myLayout.toggle('west');
					}
				}, 0);
				//$('#layout_attr_panel .l-grid-body2').height($('#layout_attr_panel').height() - 53);
				Bace.autoScroll($('#layout_attr_panel .l-grid-body2'));

				setTimeout(function(){
					var grid = $("#layout_attr_treeGrid_panel").ligerGetGridManager();
					if (!grid) return;
					grid.setColumnWidth("attrName",jQuery("#layout_attr_treeGrid_panelgrid").width());
				},100)
			}
		};
		var attrTreeGrid;
		AttrTree.view = {
			init: function() {
				AttrTree.view.initTreeGrid();
				//初始化所有绑定事件
				for (var event in AttrTree.view.bindEvent) {
					AttrTree.view.bindEvent[event]();
				}
			},
			initTreeGrid:function(dataId){
				//如果指标库已经存在,则直接根据参数更新指标库
				if(attrTreeGrid){
					AttrTree.view.findAttrByParam({
						attrName:'',
						dataId: dataId || Box.main.dataId  //shaojs 方便更新指标库
					});
					return;
				}
				//初始化指标库
				attrTreeGrid =
				$("#layout_attr_treeGrid_panel").ligerGrid({
					columns: [{
						name: 'attrName',
						width: '100%',
						align: 'left',
						render: function(rowdata, rowindex, value) {
							var attrId = rowdata.attrId;
							var attrName = rowdata.attrName;
							var attrType =  rowdata.attrType;
							var attrClass =  rowdata.attrClass;
							var fieldName =  rowdata.fieldName;
							var columnScale =  rowdata.columnScale;
							var filterType =  rowdata.filterType;
                            var importType = rowdata.importType || "";
							var dimId = rowdata.dimId||'';
							var filterContent = rowdata.filterContent;
							var attrPostfix = rowdata.attrPostfix;
							var attrFormat = rowdata.attrFormat;
							var dataId = rowdata.dataId;
							var diyRelation = rowdata.diyRelation;
                            var classStr = (attrClass == '2' || attrClass == '3')? "custom_dimAttr":"";
							return "<span class='"+classStr+"' data-attrId='"+attrId+"' data-attrName ='"+attrName+"' data-dimId='"+dimId+"' data-filterType='"+filterType+"' data-attrType='"+attrType+"' data-attrClass='"+attrClass+"' data-fieldname='"+fieldName+"' data-columnscale='"+columnScale+"' data-importtype='" + importType +"'data-filterContent='"+filterContent+"'data-attrPostfix='"+attrPostfix+"'data-attrFormat='"+attrFormat+"' data-dataId='"+dataId+"' data-diyRelation='"+diyRelation+"' title='" + attrName + "'>" + attrName + "</span>"
						}
					}],
					width: '101%',
					height: '100%',
					heightDiff: 24, //高度误差
					title: function() {
							return '<span class="filter-span">' + '	<input id="filterInput" class="filter-text"  placeholder="输入指标关键字"/>' + '	<span class="filter-icon"></span>' + '</span>';
					}(),
					url:Bace.handleUrlParam('/platform/dataview/initDataAttr'),
					parms:{
							dataId: dataId || Box.main.dataId
					},
					//data: AttrTreeData,
					alternatingRow: false,
					selectRow: false,
					usePager: false,
					tree: {
						columnName: 'attrName'
					},
					onClickRow: function(rowdata, rowid, rowobj, event) {
						//shaojs 20160804 如果有子指标,则打开子指标
						if(rowdata.__hasChildren){
							attrTreeGrid.toggle(rowid);
						}/*else{
							attrTreeGrid.select(rowid);
						}*/
						Bace.stopBubble(event);
					},
					onAfterShowData: function() {
						//初始化拖拽
						AttrTree.view.installDrayAttr();
						//美化滚动条
						Bace.autoScroll($('#layout_attr_panel .l-grid-body2'));
					}
				});
			},
			bindEvent:{
				//指标搜索功能,并绑定搜索输入框回车到指标搜索
				serachAttrbyName:function(){
					jQuery("#layout_attr_treeGrid_panel").on("click",".filter-icon",function(event){
						AttrTree.view.findAttrByParam({
							attrName:$(this).prev().val(),
							dataId:Box.main.dataId
						});
						Bace.stopBubble(event);
					});
					jQuery("body").on("keypress","#filterInput",function(event){
						if(event.keyCode == "13"){
							AttrTree.view.findAttrByParam({
								attrName:$(this).val(),
								dataId:Box.main.dataId
							});
						}
					});
					//1.2需求新增  计算指标功能  zhull
					jQuery(".calcPanel").unbind("click").on("click",function(){
						// 打开新增计算指标面板时关闭属性面板，否则拖动指标会存在重复生成的问题
						//jQuery("#propertyPanel").hide();
						//CalcUtil.show(Box.main.dataId);
						var type = '0';//衍生指标
						PersonalizedChoose.show(type);
					});
				},
				dateFormat:function(){
                    jQuery("#derive-dim").on("click",function(){
						var type = '1';//衍生维度
						PersonalizedChoose.show(type);
                    })
				}
			},
			//根据参数刷新指标库(从后台刷新,)
			findAttrByParam:function(paramObj){
				var grid = $("#layout_attr_treeGrid_panel").ligerGetGridManager();
				if (!grid) return;
				var parms = $.extend(true,{},grid.options.parms,paramObj);
				grid.loadServerData(parms,undefined,undefined,function(){
					grid.setColumnWidth("attrName",jQuery("#layout_attr_treeGrid_panelgrid").width())
				});
			},
			//初始化指标拖拽(jqueryUI的draggable组件)
			installDrayAttr: function() {//新增指标卡面板接收指标拖拽 gaoya 20161115
				var dragDiv = "#attrPanel,#dimPanel,#graphPanel,#rowsDimPanel,#colsDimPanel,#attrFuncPanel,#indicatorPanel,.filterarea,.conditionArea";
				if(discovery == "1"){
					//原实现方法 dragDiv = "div.filter-panel,#attrPanel,#dimPanel,#rowsDimPanel,#colsDimPanel,#attrFuncPanel";
					//实现探索页面中指标拖拽功能 gaoya 20160823
					dragDiv+=",div.filter-panel";
				}
				$("#layout_attr_treeGrid_panel span[file]").parents('td').draggable({
					delay: 10,
					cursorAt: {
						top: 1,
						left: 56
					},
					addClasses: false,
					//暂时写死
					connectToSortable: dragDiv,
					helper: function(event) {
						var $attr = jQuery(this).find('span[file] >span');
						var attrId = $attr.attr("data-attrId");
						var attrName = $attr.attr("data-attrName");
						var attrType = $attr.attr("data-attrType");
						var attrClass = $attr.attr("data-attrClass");
						var fieldName = $attr.attr("data-fieldName");
						var columnScale = $attr.attr("data-columnScale");
						var filterType = $attr.attr("data-filterType");
						var dimId = $attr.attr("data-dimId");
                        var importType = $attr.attr("data-importtype");
						var attrPostfix=$attr.attr("data-attrPostfix");
						var filterContent=$attr.attr("data-filterContent");
						var attrFormat=$attr.attr("data-attrFormat");
						var dataId=$attr.attr("data-dataId");
						var diyRelation=$attr.attr("data-diyRelation");
						return jQuery('<div>', {
							'style': 'z-index:9999999',
							'data-attrid': attrId,
							'data-attrtype': attrType,
							'data-attrclass': attrClass,
							'data-fieldname': fieldName,
							'data-columnscale': columnScale,
							'data-attrname': attrName,
							'data-filterType': filterType,
							'data-dimId': dimId,
                            'data-importType':importType,
							'data-attrpostfix':attrPostfix,
							'data-filtercontent':filterContent,
							'data-attrformat':attrFormat,
							'data-dataId':dataId,
							'data-diyRelation':diyRelation,
							//'data-attrfrom':'attrTree',
							'html': attrName
						}).addClass('attr-helper').appendTo('body');
					}
				});
			}
		};
		AttrTree.module = {};
		return AttrTree.control;
	});