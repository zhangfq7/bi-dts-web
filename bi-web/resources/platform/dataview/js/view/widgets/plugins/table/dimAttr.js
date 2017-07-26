define(['bace', 'view/box'], function(Bace, Box) {
	
	var DimAttr = {};
	
	DimAttr.module = {
		//容器对象
		el: '',
		drayAttrId:''
	};
	
	DimAttr.control = {
		/**
		 * 表格插件数据面板的初始方法
		 */
		init:function(){
			DimAttr.view.initDimAttrPanel();
		},
		/**
		 * 收集维度指标信息
		 */
		collect:function(){
			var colsData = [];
			jQuery("#colsDimPanel .dimAttrField").each(function(){
				var $this = $(this);
				colsData.push($this.data("dimAttrData"));
			});
			var rowsData = [];
			jQuery("#rowsDimPanel .dimAttrField").each(function(){
				var $this = $(this);
				rowsData.push($this.data("dimAttrData"));
			});
			var attrData = [];
			jQuery("#attrFuncPanel .dimAttrField").each(function(){
				var $this = $(this);
				attrData.push($this.data("dimAttrData"));
			});
			var dimAttrData = {
				rowsData:rowsData,
				colsData:colsData,
				attrData:attrData
			};
			return dimAttrData;	
		},
		getAttrArray:function(){
			var attrData = [];
			jQuery("#colsDimPanel .dimAttrField").each(function(){
				attrData.push($(this).data("dimAttrData").attrId);
			});
			jQuery("#rowsDimPanel .dimAttrField").each(function(){
				attrData.push($(this).data("dimAttrData").attrId);
			});
			return attrData;
		},
		/**
		 * 获得选中的指标维度信息
		 * @param {Object} dimAttr 指标维度信息
		 */
		getCheckedDimAttr:function(dimAttr){
			var rowsData =  $.map(dimAttr.rowsData||[], function(obj) {
				if(obj.isChecked){
					return obj;
				}
			});
			var colsData =  $.map(dimAttr.colsData||[], function(obj) {
				if(obj.isChecked){
					return  obj;
				}
			});
			var attrData =  $.map(dimAttr.attrData||[], function(obj) {
				if(obj.isChecked){
					return obj;
				}
			});
			return {
				rowsData:rowsData,
				colsData:colsData,
				attrData:attrData
			}
		},
		render:function(option){
			var handle = option.config.dataPanel;
			DimAttr.module.chartType = option.chartType;
			DimAttr.module.el = option.el;
			//rest
			$("#attrFuncPanel .select").chosen("destroy");
			$("#colsDimPanel .dimAttrField").remove();
			$("#rowsDimPanel .dimAttrField").remove();
			$("#attrFuncPanel .dimAttrField").remove();
			
			
			if(option.chartChild == 'detail'){
				$("#data-property").addClass("detailTable").find(".rowsTitle >div").text("指标");
				$
			}else{
				$("#data-property").removeClass("detailTable").find(".rowsTitle >div").text("行维度");
			}
			
			
			var attrData = handle["attrData"]||[];
			for(var i = 0,n=attrData.length;i<n;i++){
				 $("#attrFuncPanel").append( DimAttr.view.packDimAttr("attrFuncPanel", attrData[i]))
			}
			
			var colsData = handle["colsData"]||[];
			for(var i = 0,n=colsData.length;i<n;i++){
				$("#colsDimPanel").append( DimAttr.view.packDimAttr("colsDimPanel", colsData[i]))
			}
			
			var rowsData = handle["rowsData"]||[];
			for(var i = 0,n=rowsData.length;i<n;i++){
				$("#rowsDimPanel").append( DimAttr.view.packDimAttr("rowsDimPanel", rowsData[i]))
			}
			
			$("#attrFuncPanel .select").chosen({
				width: "100%",
				disable_search:true
			});
		},
		checkDiff:function(passInit){
			var option  = $("#"+DimAttr.module.el).data("option");
			if(option.isInit === false && passInit){
				return true;
			}
			var new_dimAttr = DimAttr.control.collect();
			if(new_dimAttr.rowsData.length == 0 && new_dimAttr.colsData.length == 0 && new_dimAttr.attrData.length == 0 ){
				new_dimAttr = {};
			}
			var option_dimAttr = option.config.dataPanel;
			/*if(JSON.stringify(new_dimAttr) != JSON.stringify(option_dimAttr)){
				return false;
			}*/
			//修改对象比较方法，转换顺序紊乱问题，yetf，shaojs
			if(!(_.isEqual(new_dimAttr,option_dimAttr))){
				return false;
			}
			return true;
		},
        checkValidity:function(dimAttr,chartChild){
            var rowsData = dimAttr.rowsData;
            var colsData = dimAttr.colsData;
            var attrData = dimAttr.attrData;
            //明细表格
            if(chartChild == 'detail'){
                if(rowsData.length == 0){
                    return "请设置指标";
                }
            }else{
            //透视表格
                if(rowsData.length == 0 && colsData.length == 0 && attrData.length == 0){
                    return "行维度、列维度、指标函数至少设一个!";
                }
            }
            return false;
		}
	};
	
	DimAttr.view = {
		/**
		 * 初始化行维度，列维度，指标函数
		 */
		initDimAttrPanel:function(){
			jQuery("#rowsDimPanel,#colsDimPanel,#attrFuncPanel").sortable({
				//3者之间可以互相交换
				connectWith: "#rowsDimPanel,#colsDimPanel,#attrFuncPanel",
				//cancel: "#attrFuncPanel .attrDimText",
				appendTo: 'body',
				delay: 200,
				handle: ".attrDimText",
				containment: '#propertyPanel',
				placeholder: "dimAttr-placeholder",
				scroll: true,
				helper: function(event, ui) {
					var $ui = jQuery(ui);
					var dimAttrData = $ui.data("dimAttrData");
						
					DimAttr.module.drayAttrId = $ui.parent().attr("id") == "attrFuncPanel" ? "":dimAttrData.attrId;

					//拖动时将data的对象带入
					return jQuery('<div>', {
						'data-attrid': dimAttrData.attrId,
						'data-attrtype': dimAttrData.attrType,
						'data-attrclass': dimAttrData.attrClass,
						'data-fieldname': dimAttrData.fieldName,
						'data-columnscale': dimAttrData.columnScale,
						'data-filtertype': dimAttrData.filterType,
						'data-attrname': dimAttrData.attrName,
						'data-dimId': dimAttrData.dimId,
						'data-modifyname': dimAttrData.modifyName || dimAttrData.attrName,
                        'data-importtype' :dimAttrData.importType,
						'style': 'z-index:9999999;height:30px',
						'html': dimAttrData.modifyName || dimAttrData.attrName,
						'data-diyRelation': dimAttrData.diyRelation
					}).addClass('attr-helper').appendTo('body');
					
					
				},
				stop: function(event, ui) {
					var $item = ui.item;
					var parentPanel = $item.parent().attr("id"),
						dimAttrData = {};
					if ($item.attr("data-attrid")) {
						var attrName = $item.attr("data-attrname");
						dimAttrData = {
							attrId: $item.attr("data-attrid"),
							attrName: attrName,
							modifyName: $item.attr("data-modifyname") || $item.attr("data-attrname"),
							attrType: $item.attr("data-attrtype"),
							attrClass: $item.attr("data-attrclass"),
							fieldName:$item.attr("data-fieldname"),
							columnScale:$item.attr("data-columnscale"),
							filterType: $item.attr("data-filterType"),
							dimId: $item.attr("data-dimId"),
                            importType :$item.attr("data-importtype"),
                            diyRelation: $item.attr("data-diyRelation"),
							isChecked: true,
							fanyi: true
						}
					} else {
						dimAttrData = $item.data("dimAttrData");
					}

					var $attr = DimAttr.view.packDimAttr(parentPanel, dimAttrData);

					ui.item.replaceWith($attr);
					
					setTimeout(function() {
						if (ui.helper) {
							ui.helper.remove();
						}
					}, 0);
						//指标面板初始化下拉框组件
					if (parentPanel == 'attrFuncPanel') {
						$("#attrFuncPanel .select").chosen({
							width: "100%",
							disable_search: true
						});
						//检查是否有重复指标名称
						DimAttr.view.checkAttrName();
					}
					DimAttr.module.drayAttrId = "";
				}
			}).disableSelection();
			$( "#attrFuncPanel" ).sortable({ containment: "#attrFuncPanel" });
			var bindEvent = DimAttr.view.bindDimAttrEvent;
			//初始化指标维度面板所有绑定事件
			for (var event in bindEvent) {
				bindEvent[event]();
			}
			Bace.autoScroll($("#rowsDimPanel"));
			Bace.autoScroll($("#colsDimPanel"));
			Bace.autoScroll($("#attrFuncPanel"));
			
		},
		/**
		 * 检查是否有重复指标名称
		 */
		checkAttrName: function() {
			var attrNameArray = [];
			jQuery("#attrFuncPanel .dimAttrField").each(function(i) {
				var $this = $(this);
				var attrName = $this.data("dimAttrData").modifyName;
				if (attrNameArray.indexOf(attrName) > -1) {
					attrName += i;
					$this.data("dimAttrData").modifyName = attrName;
					$this.attr("title", attrName).find(".attrDimText").text(attrName);
				}
				attrNameArray.push(attrName);
			})
		},
		/**
		 * 生成指标和维度对象
		 * @param {String} parentPanel 指标的类型
		 * @param {Object} _dimAttrData 指标配置信息
		 * return 带有指标配置信息的jQuery对象
		 */
		packDimAttr: function(parentPanel, _dimAttrData) {
			
			var dimAttrData = $.extend(true, {}, _dimAttrData),
				setting = $.extend(true, {}, _dimAttrData);
			
			//加工翻译
			setting.fanyiText = setting.fanyi ? "取消翻译" : "翻译";
			var html = '';
			if (parentPanel == 'attrFuncPanel') {
				//加工函数
				//指标判断是否设置过函数
				//没有，则设置默认计算个数
				var funcName = setting.funcName;
				if (!funcName) {
					//纠正数据载体的函数
					dimAttrData.funcName = setting.funcName = 'count';
					dimAttrData.modifyName = dimAttrData.attrName = setting.modifyName = "[ 计数 ] " + setting.modifyName;
				}
				html = '<div class="dimAttrField" >' 
				+ '<div class="attrDimPanel">' 
				+ '	<div class="icon-checkbox {{if isChecked==true}} checked {{/if}}"></div>' 
				+ '	<div class="attrDimText" title="${modifyName}">${modifyName}</div>' 
				+ '<div class="delAttrDim" deltag="attr" title="移除该指标"></div>' 
				+ '</div>' + '<div class="attrDimTools">' 
				+ '		<div style="width:50%;text-align:left;padding:0 3px;">' 
				+ '			<select class="select">' 
				+ '			{{if attrType=="1"}}' 
				+ '				<option  {{if funcName=="sum"}} selected {{/if}}value="sum">求和</option>' 
				+ '				<option  {{if funcName=="avg"}} selected {{/if}}value="avg">平均值</option>' 
				+ '			{{/if}}' 
				+ '				<option  {{if funcName=="max"}} selected {{/if}}value="max">最大值</option>' 
				+ '				<option  {{if funcName=="min"}} selected {{/if}}value="min">最小值</option>' 
				+ '				<option  {{if funcName=="count"}} selected {{/if}}value="count">计数</option>' 
				+ '			</select>' 
				+ '		</div>' 
				+ '		<div class="modifyName" style="width:50%;">' 
				+ '			<div >重命名</div>' 
				+ '		</div>' 
				+ '</div>' 
				+ '</div>';
			}else if (parentPanel == 'rowsDimPanel' || parentPanel ==  'colsDimPanel') {

				//断绝跟attr的关系
				delete dimAttrData.funcName;
				delete setting.funcName;

				setting.modifyName = dimAttrData.modifyName = dimAttrData.modifyName.replace(/\[ 求和 \]|\[ 平均值 \]|\[ 最大值 \]|\[ 最小值 \]|\[ 计数 \]/g, '');

				//因为用户删除指标重命名内容，attrName将会填入
				//此处是防止指标设置过函数拖入维度中
				dimAttrData.attrName = dimAttrData.attrName.replace(/\[ 求和 \]|\[ 平均值 \]|\[ 最大值 \]|\[ 最小值 \]|\[ 计数 \]/g, '');
				var attrArray = DimAttr.control.getAttrArray();
				if(attrArray.indexOf(dimAttrData.attrId)>-1 && DimAttr.module.drayAttrId != dimAttrData.attrId ){
					DimAttr.view.showDiff(dimAttrData.attrName);
					return false;
				}
				//setting.isChecked = dimAttrData.isChecked = true;
				
				html = '<div class="dimAttrField">' + 
						'<div class="attrDimPanel" >' 
							+ '	<div class="icon-checkbox {{if isChecked==true}} checked {{/if}}"></div>' 
							+ '	<div class="attrDimText"  title="${modifyName}">${modifyName}</div>' 
							+ '<div class="delAttrDim" deltag="dim" title="移除该维度"></div>' 
							+ '</div>' + '<div class="attrDimTools">' 
							+ '		<div class="fanyi" style="width:50%;">' 
							+ '			<div >${fanyiText}</div>' 
							+ '		</div>' 
							+ '		<div class="modifyName" style="width:50%;">' 
							+ '			<div>重命名</div>' 
							+ '		</div>' 
							+ '</div>' 
							+ '</div>';
			}
			return $.tmpl(html, setting).data("dimAttrData", dimAttrData);	
		},
		showDiff:function(attrName){
			Box.Property.showTip({
				_id:"diff", 
				titleShow:"false",
				msg: '<span style="font-weight:bolder;font-size:26px;color:#E45F5A">'+attrName+"</span> 已包含在行维度或列维度中，不能重复选择！",
				button: '<div class="btn cancelChange" style="width: 196px;">关闭</div>'
			});
			
			$("#diff .cancelChange").click(function(){
				Box.Property.hideTip("diff");
			})
		},
		bindDimAttrEvent:{
			/**
			 * 移除维度指标信息
			 */
			bindDelAttrDim: function() {
				jQuery("#propertyTabs").on("click", "div[proptype='table'] div.delAttrDim", function() {
					var $this = jQuery(this);
					var type = $this.attr("deltag");
					$this.parents(".dimAttrField").fadeOut(200, function() {
						jQuery(this).remove();
					});
				})
			},
			/**
			 * 绑定点击维度展开小菜单信息
			 */
			bindOpenDimAttrOpt: function() {
				$("#rowsDimPanel,#colsDimPanel,#attrFuncPanel").on('click', '.attrDimText', function() {
					var dimAttrField = jQuery(this).parents('.dimAttrField');
					dimAttrField.siblings()
						.removeClass('open')
						.animate({
							"height": "30px"
						}, 200);
					(dimAttrField.hasClass('open') ? dimAttrField.animate({
						"height": "30px"
					}, 200) : dimAttrField.animate({
						"height": "62px"
					}, 200)).toggleClass('open');
					$("#attrFuncPanel input,#colsDimPanel input,#rowsDimPanel input").blur();
				})
			},
			bindCheckBox: function() {
				
				//点击指标面板复选框
				jQuery("#attrFuncPanel").on('click', '.dimAttrField .icon-checkbox', function() {
					var $this = jQuery(this);
					var $dimAttrField = jQuery(this).parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					if ($this.hasClass('checked')) {
						//确保有一个被选中
						if ($("#attrFuncPanel").find(".checked").length == 1) {
							return;
						}

						$this.removeClass('checked');
						dimAttrData.isChecked = false;
					} else {
						$this.addClass('checked');
						dimAttrData.isChecked = true;
					}
				});
				
				//点击维度面板复选框
				jQuery("#rowsDimPanel,#colsDimPanel").on('click', '.dimAttrField .icon-checkbox', function() {
					var $this = jQuery(this);
					var $dimPanel = $this.parents("#dimPanel");
					$dimPanel.find(".dimAttrField").each(function() {
						var $that = $(this);
						$that.data("dimAttrData").isChecked = false;
						$that.find(".icon-checkbox").removeClass('checked');
					});

					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					if ($this.hasClass('checked')) {
						$this.removeClass('checked');
						dimAttrData.isChecked = false;
					} else {
						$this.addClass('checked');
						dimAttrData.isChecked = true;
					}
				});
				
				//点击重命名按钮
				jQuery("#colsDimPanel,#attrFuncPanel,#rowsDimPanel").on('click', '.modifyName', function() {
					var $this = jQuery(this);
					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					var $attrDimText = $dimAttrField.find(".attrDimText");

					$attrDimText.hide().after(jQuery("<input />", {
						value: dimAttrData.modifyName,
						"class": "input"
					}).on("blur keypress", function(event) {
						if (event.keyCode == "13" || event.type === 'blur') {
							var name = jQuery(this).val() || dimAttrData.attrName;
							dimAttrData.modifyName = name;
							$attrDimText.text(name).show().next().remove();

							//只有指标才有funcName，更新系列
							if (dimAttrData.funcName) {
								//检查是否有重复指标名称
								DimAttr.view.checkAttrName();
							}
						}
					})).next().focus().select();
				});
				
				//点击翻译按钮
				jQuery("#rowsDimPanel,#colsDimPanel").on('click', '.fanyi', function() {
					var $this = jQuery(this);
					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					var fanyi = dimAttrData.fanyi || false;
					$this.text(!fanyi ? "取消翻译" : "翻译");
					dimAttrData.fanyi = !fanyi;
				});
				
				//切换设置函数
				jQuery("#attrFuncPanel").on('change', '.select', function() {
					var $this = jQuery(this);
					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					var funcName = $this.val(),
						attrEndText = '';
					switch (funcName) {
						case "":
							attrEndText = "";
							break;
						case "sum":
							attrEndText = "求和";
							break;
						case "avg":
							attrEndText = "平均值";
							break;
						case "max":
							attrEndText = "最大值";
							break;
						case "min":
							attrEndText = "最小值";
							break;
						default:
							attrEndText = "计数";
							break;
					};
					var modifyName = dimAttrData.modifyName.replace(/\求和|\平均值|\最大值|\最小值|\计数/g, attrEndText);
					dimAttrData.attrName = dimAttrData.attrName.replace(/\求和|\平均值|\最大值|\最小值|\计数/g, attrEndText);
					dimAttrData.modifyName = modifyName;
					dimAttrData.funcName = funcName;
					var $attrDimText = $dimAttrField.find(".attrDimText");
					$attrDimText.text(modifyName);
				});
				
			}
			
		}
	};
	return DimAttr.control;
});