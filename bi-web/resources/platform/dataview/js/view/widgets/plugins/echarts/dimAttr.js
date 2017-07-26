define(['bace', 'view/box','view/component/levelUtil','underscore'], function(Bace, Box,LevelUtil,_) {
	var DimAttr = {};
	DimAttr.module = {
		chartType: '',
		el:'',
		mapType:''
	};
	DimAttr.control = {
		init: function(option) {
			DimAttr.view.initDimAttrPanel();
		},
		collect:function(){
			var dimData = [];
			$("#dimPanel .dimAttrField").each(function(){
				dimData.push($(this).data("dimAttrData"));
			});
			var attrData = [];
			$("#attrPanel .dimAttrField").each(function(){
				attrData.push($(this).data("dimAttrData"));
			});
			//二维柱图第二个维度数据收集 gaoya 20160829
			var graphData = [];
			$("#graphPanel .dimAttrField").each(function(){
				graphData.push($(this).data("dimAttrData"));
			})

			var dimAttrData = {
				dimData:dimData,
				attrData:attrData,
				graphData:graphData
			};
			//if(type=="checked"){
				//DimAttr.control.getCheckedDimAttr(dimAttrData);
			//}
			return dimAttrData;
		},
		render:function(option){

			var handle = option.config.dataPanel;
			DimAttr.module.chartType = option.chartType;
			DimAttr.module.el = option.el;
			DimAttr.module.mapType=option.mapType;//判断图形mapType gaoya 20160826
			//reset
			$("#attrPanel .select").chosen("destroy");
			$("#dimPanel .dimAttrField").remove();
			$("#attrPanel .dimAttrField").remove();
			$("#graphPanel .dimAttrField").remove();

			var attrData = handle["attrData"]||[];
			for(var i = 0,n=attrData.length;i<n;i++){
				 $("#attrPanel").append( DimAttr.view.packDimAttr("attrPanel", attrData[i]));
			}

			if(DimAttr.module.chartType == 'gauge'){
				//增加gaugePanel样式
				//在仪表盘数据面板中隐藏维度面板
				//并且将指标面板提升
				$("#data-property").addClass("gaguePanel");

			}else{
				//移除gaugePanel样式
				$("#data-property").removeClass("gaguePanel");
				var dimData = handle["dimData"]||[];
				for(var i = 0,n=dimData.length;i<n;i++){
					$("#dimPanel").append( DimAttr.view.packDimAttr("dimPanel", dimData[i]))
				}
			}
			//二维柱图初始化、打开属性面板时加载所有维度和指标 gaoya 20160826
			if(option.mapType==="twoDimension"){
				$("#data-property .graphTitle,#data-property .graphPanel").css("display","inline-block");
				$("#data-property").find("div.dimPanel:first").addClass("addDimPanel")
					.parent().find(".attrTitle").addClass("addAttrTitle")
					.parent().find(".attrPanel").addClass("addAttrPanel");
				Bace.autoScroll($("#graphPanel"));
				$("#attrPanel").off('click','.dimAttrField .icon-checkbox');
				$("#attrPanel").on('click', '.dimAttrField .icon-checkbox',function(){
					var $this = $(this);
					var $attrPanel=$this.parents("#attrPanel");
					$attrPanel.find(".dimAttrField").each(function() {
						var $that = $(this);
						$that.data("dimAttrData").isChecked = false;
						$that.find(".icon-checkbox").removeClass('checked');
					})
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
				var graphData = handle["graphData"]||[];
				for(var i = 0,n=graphData.length;i<n;i++){
					$("#graphPanel").append( DimAttr.view.packDimAttr("graphPanel", graphData[i]))
				}
			}else if(option.mapType!=="twoDimension"){
				$("#data-property .graphTitle,#data-property .graphPanel").css("display","none");
				$("#data-property").find("div.dimPanel:first").removeClass("addDimPanel")
					.parent().find(".attrTitle").removeClass("addAttrTitle")
					.parent().find(".attrPanel").removeClass("addAttrPanel");
				$("#attrPanel").off('click','.dimAttrField .icon-checkbox');
				$("#attrPanel").on('click', '.dimAttrField .icon-checkbox', function() {
					var $this = $(this);console.log($this);
					var $dimAttrField = $(this).parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					if ($this.hasClass('checked')) {
						//确保有一个被选中
						if ($("#attrPanel").find(".checked").length == 1) {
							return;
						}

						$this.removeClass('checked');
						dimAttrData.isChecked = false;
					} else {
						$this.addClass('checked');
						dimAttrData.isChecked = true;
					}
				});
			}
			$("#attrPanel .select").chosen({
				width: "100%",
				disable_search:true
			});

			DimAttr.view.updateTplAttrPanel();
		},
		getCheckedDimAttr:function(dimAttr){
			var dimData =  $.map(dimAttr.dimData, function(obj) {
				if(obj.isChecked){
					return obj;
				}
			});
			//gaoya  20160830
			var graphData =  $.map(dimAttr.graphData, function(obj) {
				if(obj.isChecked){
					return obj;
				}
			});
			var indexArray = [];
			var attrData =  $.map(dimAttr.attrData, function(obj,num) {
				if(obj.isChecked){
					indexArray.push(num);
					return  obj;
				}
			});
			return {
				data:{
					dimData:dimData,
					attrData:attrData,
					graphData:graphData
				},
				indexArray:indexArray
			}
		},
		checkDiff:function(passInit){
			var option  = $("#"+DimAttr.module.el).data("option");
			if(option.isInit === false && passInit){
				return true;
			}
			var new_dimAttr = DimAttr.control.collect();
			if(new_dimAttr.dimData.length == 0 && new_dimAttr.attrData.length == 0){
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
		checkValidity:function(dimAttr){
			var dimData = dimAttr.dimData;
			var graphData = dimAttr.graphData;
			var attrData = dimAttr.attrData;

			if($("#attrPanel .attrDimText.vr").length > 0 ){
				return "请设置模板位指标！"
			}

			if(DimAttr.module.chartType == 'gauge'){
				if(attrData.length == 0){
					return "仪表盘需要设置指标数据！"
				}
			}
			else if(DimAttr.module.chartType == 'scatter'){
				if(dimData.length == 0){
					return "该图形需要设置维度数据！"
				}
				if(attrData.length < 2 ){
					return "散点图最少需要设置2个指标数据！"
				}
			}else if(DimAttr.module.chartType=="bar"){//检验多维柱图的图形维度数据是否合法 gaoya 20160826
				if(DimAttr.module.mapType==="twoDimension"){
					if(graphData.length===0){
						return "二维柱图需要设置图形维度数据!"
					}
				}
			}else if(DimAttr.module.chartType == 'heatmap') {
				var dimFlag = false;
				for(var i=0; i<dimData.length; i++) {
					var dimInfo = dimData[i];
					var isChecked = dimInfo.isChecked;
					var dimType = dimInfo.dimType;
					if(isChecked && "complex" == dimType) {
						dimFlag = true;
						break;
					}
				}
				if(!dimFlag) {
					return "请设置并选择组合维度！";
				}
				if(attrData.length == 0 ){
					return "请设置指标！"
				}
				
				var attrCount = 0;
				for(var i=0; i<attrData.length; i++) {
					var attrInfo = attrData[i];
					var isChecked = attrInfo.isChecked;
					if(isChecked) {
						attrCount ++;
					}
				}
				if(attrCount > 1 ){
					return "此类型热力图只可以设定一个指标！"
				}
			}else{
				var errorText = '';
				if(dimData.length == 0){
					errorText += "该图形需要设置维度数据！<br/>"
				}
				if(attrData.length == 0){
					errorText += "该图形需要设置指标数据！"
				}
				return errorText;
			}

		}
	};
	DimAttr.view = {
		initDimAttrPanel: function() {
			//shaojs 20160823 组合维度改造,提取sortable参数,两个面板分别初始化
			var sortableConfig = {
				connectWith: "#attrPanel,#dimPanel,#graphPanel",
				appendTo: 'body',
				delay: 200,
				handle: ".attrDimText",
				containment: '#propertyPanel',
				cancel: ".attrDimText.vr",//模板指标位不可拖动
				placeholder: "dimAttr-placeholder",
				scroll: true,
				helper: function(event, ui) {
					var $ui = $(ui);
					var dimAttrData = $ui.data("dimAttrData");
					return $('<div>', {
						'data-attrid': dimAttrData.attrId,
						'data-attrtype': dimAttrData.attrType,
						'data-attrclass': dimAttrData.attrClass,
						'data-fieldname': dimAttrData.fieldName,
						'data-columnscale': dimAttrData.columnScale,
						'data-filtertype': dimAttrData.filterType,
						'data-attrname': dimAttrData.attrName,
						'data-dimId': dimAttrData.dimId,
						//'data-attrfrom':$ui.parent().attr("id"),
						'data-modifyname': dimAttrData.modifyName || dimAttrData.attrName,
                        // 'data-attrfieldid' :dimAttrData.attrFieldId,
						'style': 'z-index:9999999;height:30px',
						'html': dimAttrData.modifyName || dimAttrData.attrName,
						'data-diyRelation': dimAttrData.diyRelation
					}).addClass('attr-helper').appendTo('body');
				},
				over: function(event, ui) {
					/*var $helper = ui.helper;
					var attrFrom = $helper.attr("data-from");
					if (attrFrom != 'attrTree') {

					}*/
				},
				stop: function(event, ui) {
					var $item = ui.item;
					var parentPanel = $item.parent().attr("id"),
						dimAttrData = {};

                    //shaojs 20160829 如果像指标面板中拖入符合维度,则不作处理
                    if("attrPanel" === parentPanel && $item.find(".attrDimText").hasClass("complex")){
                        return false;
                    }


					if ($item.attr("data-attrid")) {
						var attrName = $item.attr("data-attrname");
						dimAttrData = {
							attrId: $item.attr("data-attrid"),
							attrName: attrName,
							modifyName: $item.attr("data-modifyname") || $item.attr("data-attrname"),
							attrType: $item.attr("data-attrtype"),
							attrClass:$item.attr("data-attrclass"),
							fieldName:$item.attr("data-fieldname"),
							columnScale:$item.attr("data-columnscale"),
							filterType: $item.attr("data-filterType"),
							dimId: $item.attr("data-dimId"),
                            // attrFieldId :$item.attr("data-attrfieldid"),
							diyRelation: $item.attr("data-diyRelation"),
							isChecked: true,
							fanyi: true
							//attrFrom:$item.attr("data-attrfrom")
						}
					} else {
						dimAttrData = $item.data("dimAttrData");

                        if(dimAttrData.fanyi === undefined){
                            dimAttrData.fanyi = true;
                        }
					}

					var $attr = DimAttr.view.packDimAttr(parentPanel, dimAttrData ,"isDray");


					ui.item.replaceWith($attr);
					setTimeout(function() {
						if (ui.helper) {
							ui.helper.remove();
						}
					}, 0);
					//指标面板初始化下拉框组件
					if (parentPanel == 'attrPanel') {
						$("#attrPanel .select").chosen({
							width: "100%",
							disable_search: true
						});
						//检查是否有重复指标名称
						DimAttr.view.checkAttrName();
						//更新系列(图形种类切换)
						DimAttr.view.updateDesginAttr();
                        //更新模板指标占位符
						DimAttr.view.updateTplAttrPanel($attr);
					}else if(parentPanel == 'dimPanel'){  //维度面板
						DimAttr.view.updateDesginAttr();
					}
                    //shaojs 20160918 最后确认各个面板应该有一个选中,解决将已选中的指标拖出去后,剩下的指标不自动选中的bug
                    $("#dimPanel .checked").length == 0 && $("#dimPanel .dimAttrField").eq(0).find(".icon-checkbox").click();
                    $("#attrPanel .checked").length == 0 && $("#attrPanel .dimAttrField").eq(0).find(".icon-checkbox").click();
                    $("#graphPanel .checked").length == 0 && $("#graphPanel .dimAttrField").eq(0).find(".icon-checkbox").click();
				}
			};
			//两个面板分别初始化 (disableSelection方法,禁止鼠标选择)
            //shaojs 20160829 分开初始化暂时用不上了,保留在这里,以便以后扩展
			$("#dimPanel").sortable(sortableConfig).disableSelection();
			$("#attrPanel").sortable(sortableConfig).disableSelection();
			$("#graphPanel").sortable(sortableConfig).disableSelection();
			var bindEvent = DimAttr.view.bindDimAttrEvent;
			//初始化指标维度面板所有绑定事件
			for (var event in bindEvent) {
				bindEvent[event]();
			}
			//美化滚动条(#graphPanel的美化不在这里,需要显示之后再美化)
			Bace.autoScroll($("#dimPanel"));
			Bace.autoScroll($("#attrPanel"));
		},
		checkAttrName: function() {
			var attrNameArray = [];
			$("#attrPanel .dimAttrField").each(function(i) {
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
		updateDesginAttr:function(){
			var attrData = [];
			$("#attrPanel .dimAttrField").each(function(){
				attrData.push($(this).data("dimAttrData"));
			});
			Box.Design.updateSeriesPanel(attrData);
		},
		/**
		 *描述：生成指标和维度对象
         *指标默认勾选
         *维度默认勾选中一个
         *参数：parentPanel：指标的类型
         *	   dimAttrData:指标配置信息 ( 如果dimType属性的值为complex,则表示是组合维度 addby shaojs 20160826)
         *	   isDray:是否是从 指标/维度面板 拖来的
         *返回：带有指标配置信息的$对象
         */
		packDimAttr: function(parentPanel, _dimAttrData,isDray) {
            var dimAttrData,setting;
            if(!(_dimAttrData.dimType && "complex" == _dimAttrData.dimType)){
                //纯净的数据不能满足实体填充
                //加工数据
                //快速复制对象,断绝血缘
                dimAttrData = $.extend(true, {}, _dimAttrData);
                setting = $.extend(true, {}, _dimAttrData);
                setting.chartType = DimAttr.module.chartType;
                setting.mapType = DimAttr.module.mapType;

                if(!dimAttrData.id){
                    dimAttrData.id = dimAttrData.attrId + (new Date()).getTime();
                }
                //加工排序
                switch (setting.order) {
                    case "desc":
                        setting.orderText = "降序";
                        break;
                    case "asc":
                        setting.orderText = "升序";
                        break;
                    default:
                        setting.orderText = "排序";
                        break;
                }
                //加工翻译
                setting.fanyiText = setting.fanyi ? "取消翻译" : "翻译";
            }else{
                //如果_dimAttrData.dimType为complex,表示是个组合维度需要特殊处理
                dimAttrData = JSON.parse(JSON.stringify(_dimAttrData));
                setting={
                    modifyName:_.pluck(dimAttrData.dimList,"modifyName").join(" + "),
					attrId:_.pluck(dimAttrData.dimList,"attrId").join("||"),
					attrName:_.pluck(dimAttrData.dimList,"attrName").join("||"),
					attrType:_.pluck(dimAttrData.dimList,"attrType").join("||"),
					attrClass:_.pluck(dimAttrData.dimList,"attrClass").join("||"),
					fieldName:_.pluck(dimAttrData.dimList,"fieldName").join("||"),
					columnScale:_.pluck(dimAttrData.dimList,"columnScale").join("||"),
					filterType:_.pluck(dimAttrData.dimList,"filterType").join("||"),
					dimId:_.pluck(dimAttrData.dimList,"dimId").join("||"),
					isChecked:_.some(dimAttrData.dimList,function(e){return !!e.isChecked}),
					fanyi:_.some(dimAttrData.dimList,function(e){return !!e.fanyi}),
                    order:dimAttrData.dimList[0].order || ""
                };console.log(dimAttrData);
                //修正dimAttrData.dimList
                dimAttrData.dimList = _.map(dimAttrData.dimList,function(e){ return _.extend(e,{isChecked:setting.isChecked,fanyi:setting.fanyi})});
                //将setting的值挂载到dimAttrData上
                _.extend(dimAttrData,setting);
                //加工翻译
                setting.fanyiText = setting.fanyi ? "取消翻译" : "翻译";
                setting.chartType = DimAttr.module.chartType;
                //加工排序
                switch (setting.order) {
                    case "desc":
                        setting.orderText = "降序";
                        break;
                    case "asc":
                        setting.orderText = "升序";
                        break;
                    default:
                        setting.orderText = "排序";
                        break;
                }
            }
            //挂载父面板的ID;
            setting.parentPanel = parentPanel;
			var html = '';
            //如果是指标项
			if (parentPanel == 'attrPanel') {
				//断绝与维度的关系
				delete dimAttrData.levelId;
				delete dimAttrData.fanyi;

				delete setting.levelId;
				delete setting.fanyi;

				//加工函数
				//指标判断是否设置过函数
				//没有，则设置默认计算个数
				var funcName = setting.funcName;
				if (!funcName) {
					if (DimAttr.module.chartType == 'scatter' && dimAttrData.attrType == "1") { //int 类型
						dimAttrData.funcName = setting.funcName = '';
						if(dimAttrData.modifyName.indexOf("默认") == -1){
							dimAttrData.modifyName = dimAttrData.attrName = setting.modifyName = "[ 默认 ] " + setting.modifyName;
						}else{
							dimAttrData.modifyName = dimAttrData.attrName = setting.modifyName;
						}

					} else {
						if(dimAttrData.modifyName.indexOf("默认") > -1){
							dimAttrData.funcName = setting.funcName = '';
							dimAttrData.modifyName = dimAttrData.attrName = setting.modifyName;
						}else{
							//纠正数据载体的函数
							dimAttrData.funcName = setting.funcName = 'count';
							dimAttrData.modifyName = dimAttrData.attrName = setting.modifyName = "[ 计数 ] " + setting.modifyName;
						}
					}

				}
				if (!dimAttrData.seriesId) {
					dimAttrData.seriesId = dimAttrData.attrId + (new Date()).getTime();
					dimAttrData.seriesType = DimAttr.module.chartType;
				}

				//设置二维柱图的指标同时只有一个选中项 gaoya 20160906
				if(DimAttr.module.mapType==="twoDimension"){
					if(isDray){
						var checkObj = $("#attrPanel .checked").eq(0);
						DimAttr.view.dimGraphIsChecked(checkObj,setting,dimAttrData);
					}else{
						//渲染时默认只选中一个
						if($("#attrPanel .checked").length > 0 ){
							setting.isChecked = dimAttrData.isChecked = false;
						}
					}
				}else{
					if(isDray) {
					setting.isChecked = dimAttrData.isChecked = true;
					}
				}

				if(setting.isTpl === true){
					html = '<div class="dimAttrField ${order}" >' +
							'<div class="attrDimPanel vr">' +
								'<div class="icon-vr"></div>' +
								'<div class="attrDimText vr">${attrName}</div>' +
							'</div>'+
						'</div>';
				}else{
					html = '<div class="dimAttrField ${order}" >' +
					'<div class="attrDimPanel">' +
					'	<div class="icon-checkbox {{if isChecked==true}} checked {{/if}}"></div>' +
					'	<div class="attrDimText" title="${modifyName}">${modifyName}</div>' +
					'<div class="delAttrDim" deltag="attr" title="移除该指标"></div>' +
					'</div>' +
					'<div class="attrDimTools">' +
					'		<div style="width:50%;text-align:left;padding:0 3px;">' +
					'			<select class="select">' +
					'			{{if chartType == "scatter"}}	<option  {{if funcName=="" }} selected {{/if}}value="">无</option>{{/if}}' +
					'			{{if attrType=="1"}}' +
					'				<option  {{if funcName=="sum"}} selected {{/if}}value="sum">求和</option>' +
					'				<option  {{if funcName=="avg"}} selected {{/if}}value="avg">平均值</option>' +
					'			{{/if}}' +
					//'			{{if chartType == "pie" && filterType != 4 && filterType != 6 && filterType != 7  }}'+
                    //时间格式化没有最大值和最小值选项 addby shaojs 20161018 "attrClass" 0：普通字段；1：自定义字段；2：报表自定义字段；3：日期格式化自定义字段
                    '           {{if attrClass != "3"}}'+
					'				<option  {{if funcName=="max"}} selected {{/if}}value="max">最大值</option>' +
					'				<option  {{if funcName=="min"}} selected {{/if}}value="min">最小值</option>' +
					'			{{/if}}' +
					'				<option  {{if funcName=="count"}} selected {{/if}}value="count">计数</option>' +
					'			</select>' +
					'		</div>'+
					'		{{if ["map","funnel"].indexOf(chartType) == -1 }} <div class="order">' +
					'			<div>${orderText}</div>' +
					'		</div>{{/if}}' +
					'		<div class="modifyName" {{if chartType == "funnel" ||  chartType=="map" }} style="width:50%" {{/if}} >' +
					'			<div >重命名</div>' +
					'		</div>'
					+ '</div>'
					+ '</div>';
				}
			} else if (parentPanel == 'dimPanel'||parentPanel=='graphPanel') {
                var rep = /\[ 求和 \]|\[ 平均值 \]|\[ 最大值 \]|\[ 最小值 \]|\[ 计数 \]|\[ 默认 \]/g;
			    //为组合维度添加分支 shaojs 20160826
                if(_dimAttrData.dimType && "complex" == _dimAttrData.dimType){
			        _.each(dimAttrData.dimList,function(e){
			            delete e.funcName;
                        e.modifyName && (e.modifyName = e.modifyName.replace(rep, ''));
                        e.attrName && (e.modifyName = e.attrName.replace(rep, ''));
                    });
                    setting.modifyName = setting.modifyName.replace(rep, '');
                    setting.attrName = setting.attrName.replace(rep, '');
                    setting.dimType = "complex";
                }else{
                    //这里处理维度项
                    //断绝跟attr的关系
                    delete dimAttrData.funcName;
                    delete setting.funcName;
                    //加工分档
                    setting.fendangText = setting.levelId  ? "已分档" : "分档";
                    setting.modifyName = dimAttrData.modifyName = dimAttrData.modifyName.replace(rep, '');
                    //因为用户删除指标重命名内容，attrName将会填入
                    //此处是防止指标设置过函数拖入维度中
                    dimAttrData.attrName = dimAttrData.attrName.replace(rep, '');
                    setting.dimType = "single";
                    if(parentPanel=="dimPanel"){
                        if(isDray){
                            var checkObj = $("#dimPanel .checked").eq(0);
                            DimAttr.view.dimGraphIsChecked(checkObj,setting,dimAttrData);
                        }else{
                            //渲染时默认只选中一个
                            if($("#dimPanel .checked").length > 0 ){
                                setting.isChecked = dimAttrData.isChecked = false;
                            }
                        }
                    }else if(parentPanel=='graphPanel'){//二维柱图图形维度面板 gaoya 20160830
                        if(isDray){
                            var checkObj = $("#graphPanel .checked").eq(0);
                            DimAttr.view.dimGraphIsChecked(checkObj,setting,dimAttrData);
                        }else{
                            //渲染时默认只选中一个
                            if($("#graphPanel .checked").length > 0 ){
                                setting.isChecked = dimAttrData.isChecked = false;
                            }
                        }
                    }
			    }
				html = '<div class="dimAttrField ${order}">'
					+ '<div class="attrDimPanel">'
					+ '	<div class="icon-checkbox {{if isChecked==true}} checked {{/if}}"></div>'
					+ '	<div class={{if dimType=="complex"}}"attrDimText complex"{{else}}"attrDimText"{{/if}}  title="${modifyName}">${modifyName}</div>'  //组合维度不可以移动
					+ ' {{if dimType!="complex" && chartType!="map" && mapType!="twoDimension" && parentPanel=="dimPanel" }} <div class="complexDim" title="维度组合"></div> {{/if}}'      //增加组合维度开关
					+ ' <div class="delAttrDim" deltag="dim" title="移除该维度"></div>'
					+ '</div>' + '<div class="attrDimTools">'
					+ '		{{if chartType!="map" && dimType!="complex" && attrClass == "0"}}<div class="fendang"  {{if   dimId=="" && chartType=="funnel" || attrClass !="0"}} style="width:50%" {{/if}} >'
					+ '			<div >${fendangText}</div>'
					+ '		</div>{{/if}}'
					+ '		{{if dimId!="" && dimId!="||"}} <div class="fanyi"  {{if  chartType=="map" &&   dimId!="" &&  dimId!="||" || attrClass !="0" }} style="width:50%" {{/if}}>'
					+ '			<div >${fanyiText}</div>'
					+ '		</div>{{/if}}'
					+ '		{{if ["map","funnel"].indexOf(chartType) == -1  }}<div class="order" {{if  dimId=="||" || attrClass !="0" }} style="width:50%" {{/if}} >'
					+ '			<div >${orderText}</div>'
					+ '		</div>{{/if}}'
					+ '		<div class="modifyName" {{if  chartType=="map"  &&   dimId =="" }}  style="width:100%"  {{else  dimId=="" || (chartType=="map"  &&   dimId !="") || dimType=="complex" || attrClass !="0"}}  style="width:50%" {{/if}} >'
					+ '			<div>重命名</div>'
					+ '		</div>'
					+ '</div>'
					+ '</div>';
		    }
            return $.tmpl(html, setting).data("dimAttrData", dimAttrData);
		},
		//维度指标拖拽时检测对应的面板中是否有已勾选的指标  gaoya 20160830
		dimGraphIsChecked:function(checkObj,setting,dimAttrData){
            //如果维度框存在已勾选的指标
            if(checkObj.outerHTML()){
                //判断勾选的指标和拖动的是否是同一个指标
                //如果是同一个
                if(checkObj.parents(".dimAttrField").data("dimAttrData").id ==  dimAttrData.id){
                    setting.isChecked = dimAttrData.isChecked = true;
                }else{
                    setting.isChecked = dimAttrData.isChecked = false;
                }
            }else{
                //不存在已勾选的指标
                //就选中
                setting.isChecked = dimAttrData.isChecked = true;
            }
		},
		/**
		 * isDray:是否是拖动触发方法
         * 更新模板指标占位
		 */
		updateTplAttrPanel:function($attr){

			var option = $("#"+DimAttr.module.el).data("option");
			var tplCount = option.tplCount;
			var $attrPanel = $("#attrPanel");
			var $vr_dimAttrField = $(".attrDimPanel.vr",$attrPanel);
			if($attr && $vr_dimAttrField.length > 0){
				var $vr_this = $vr_dimAttrField.eq(0).parent();
				var $vr_this_attr_data = $vr_this.data("dimAttrData");
				var $attr_data = $attr.data("dimAttrData");

				//单系列不用更新
				if( option.config.designPanel.seriesPanel.seriesAuto === false){
					//取出删除模版指标位的对应的系列对象
					var $vr_this_series_data = option.config.designPanel.seriesPanel.seriesData[$vr_this_attr_data.seriesId];

					//将该系列对象赋值给当前拖拽对象
					option.config.designPanel.seriesPanel.seriesData[$attr_data.seriesId] = $vr_this_series_data;

					 //更新当前指标的seriesType
					$attr_data.seriesType =  $vr_this_attr_data.seriesType;

					//移除模板指标
					delete option.config.designPanel.seriesPanel.seriesData[$vr_this_attr_data.seriesId];
				}

				$vr_dimAttrField.eq(0).parent().remove();

				//这个方法在有模板标识位时，一共掉了2次，后期优化
				DimAttr.view.updateDesginAttr();
			}

			//标识模版指标
			if(tplCount>0){
				var $dimAttrField = $(".dimAttrField",$attrPanel);
				$dimAttrField.each(function(n){
					var $this = $(this);
					if(n<tplCount){
						$this.addClass("tplAttrBg");
					}else{
						$this.removeClass("tplAttrBg");
					}
				})
			}
		},
		bindDimAttrEvent: {
			bindDelAttrDim: function() {
				$("#propertyTabs").on("click", "div[proptype='echarts'] div.delAttrDim", function() {
					var $this = $(this);
					var type = $this.attr("deltag");
					$this.parents(".dimAttrField").fadeOut(200, function() {
						var $this = $(this);
						if (type == "attr") {
							//维护模版指标个数
							if($this.hasClass("tplAttrBg")){
								var option = $("#"+DimAttr.module.el).data("option");
								option.tplCount--;
							}
							$this.remove();
							//更新系列
							DimAttr.view.updateDesginAttr();
						}else{
							$this.remove();
						}

					});
				})
			},
            /**
             * author:shaojs
             * date:20160825
             * desc:绑定维度指标上,开启多度组合的功能
             * */
            bindComplexDim:function(){
                $("#propertyPanel").on("click","div.complexDim",function(){
                    var $attrDimPanel = $(this).closest(".attrDimPanel");
                    var $dimAttrField = $attrDimPanel.parent();
                    //如果是开启状态,则关闭组合模式
                    if($attrDimPanel.hasClass("complexActive")){
                        $attrDimPanel.removeClass("complexActive");
                        $dimAttrField.siblings().show();
                        $("#dimPanel").sortable("enable");
                        //
                        $attrDimPanel.hasClass("ui-droppable") && $attrDimPanel.droppable("destroy");
                    }else{  //否则开启组合模式
                        $attrDimPanel.addClass("complexActive");
                        //把其他维度隐藏
                        $dimAttrField.siblings().hide();
                        //关闭自身的opt
                        $dimAttrField.hasClass("open") && $dimAttrField.animate({
                            "height": "30px"
                        }, 200).removeClass("open");
                        $("#dimPanel").sortable("disable");
                        $attrDimPanel.droppable({
                            hoverClass:"onDrop",
                            drop:function(event,ui){
                                var $this = $(this);
                                var $helper = $(ui.helper);

                                //这里helper上的属性名字都是小写的,所以不可以用data()一次取出来,要不然后面还要转一次
                                var heplerData = {
                                    attrId: $helper.data("attrid"),
                                    attrName: $helper.data("attrname"),
                                    modifyName: $helper.data("modifyname") || $helper.data("attrname"),
                                    attrType: $helper.data("attrtype"),
                                    attrClass:$helper.data("attrclass"),
                                    fieldName:$helper.data("fieldname"),
                                    columnScale:$helper.data("columnscale"),
                                    filterType: $helper.data("filtertype"),
                                    dimId: $helper.data("dimid"),
                                    isChecked: false,
                                    fanyi: true
                                };
                                var selfData = $this.parent(".dimAttrField").data("dimAttrData");

                                //如果是自己组合自己,则不做处理
                                if(selfData.attrId === heplerData.attrId){
                                    return false;
                                }

                                //构建新的节点
                                var $item = DimAttr.view.packDimAttr("dimPanel",{
                                    dimList:[selfData,heplerData],
                                    dimType:"complex"
                                });
                                //替换当前节点(替换节点后,dropable也被丢弃了)
                                $this.parent(".dimAttrField").replaceWith($item);
                                //恢复现场
                                $(".dimAttrField","#dimPanel").show();
                                $("#dimPanel").sortable("enable");
                            }
                        });
                    }
                });
            },
			bindOpenDimAttrOpt: function() {
				$("#dimPanel,#attrPanel,#graphPanel").on('click', '.attrDimText', function() {
					var $this = $(this);
					if($this.hasClass('vr')){
						return;
					}
					//shaojs 20160825 如果组合模式开始,则不打开opt
					if($this.parent().hasClass("complexActive")){
					    return;
                    }
					var dimAttrField = $this.parents('.dimAttrField');
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
					$("#dimPanel input,#attrPanel input").blur();
				})
			},
			bindCheckBox: function() {
				//点击指标面板复选框
					$("#attrPanel").on('click', '.dimAttrField .icon-checkbox',function() {
						var $this = $(this);
						var $dimAttrField = $(this).parents('.dimAttrField');
						var dimAttrData = $dimAttrField.data("dimAttrData");
						if ($this.hasClass('checked')) {
							//确保有一个被选中
							if ($("#attrPanel").find(".checked").length == 1) {
								return;
							}

							$this.removeClass('checked');
							dimAttrData.isChecked = false;
						} else {
							$this.addClass('checked');
							dimAttrData.isChecked = true;
						}
					});

				$("#dimPanel,#graphPanel").on('click', '.dimAttrField .icon-checkbox', function() {
					//暂时关闭维度单选
					var $this = $(this);
					var $dimPanel = $this.parents("#dimPanel");
					var $graphPanel=$this.parents("#graphPanel");
					$dimPanel.find(".dimAttrField").each(function() {
						var $that = $(this);
                        var dimAttrData = $that.data("dimAttrData");
                        dimAttrData.isChecked = false;
						$that.find(".icon-checkbox").removeClass('checked');

                        //shaojs 20161208 将isChecked属性更新到复合维度中
                        if(dimAttrData.dimType && "complex" === dimAttrData.dimType){
                            _.each(dimAttrData.dimList,function(e,i){
                                _.extend(e,{isChecked:dimAttrData.isChecked})
                            });
                        }
					});
					$graphPanel.find(".dimAttrField").each(function() {
						var $that = $(this);
						$that.data("dimAttrData").isChecked = false;
						$that.find(".icon-checkbox").removeClass('checked');
					});

					//暂时打开多选,测试数据
					//var $this = $(this);

					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					if ($this.hasClass('checked')) {
						$this.removeClass('checked');
						dimAttrData.isChecked = false;
					} else {
						$this.addClass('checked');
						dimAttrData.isChecked = true;
					}

                    //shaojs 20161208 将isChecked属性更新到复合维度中
                    if(dimAttrData.dimType && "complex" === dimAttrData.dimType){
                        _.each(dimAttrData.dimList,function(e,i){
                            _.extend(e,{isChecked:dimAttrData.isChecked})
                        });
                    }

				});

				//点击重命名按钮
				$("#dimPanel,#attrPanel,#graphPanel").on('click', '.modifyName', function() {
					var $this = $(this);
					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					var $attrDimText = $dimAttrField.find(".attrDimText");

					$attrDimText.hide().after($("<input />", {
						value: dimAttrData.modifyName,
						"class": "input"
					}).on("blur keypress", function(event) {
						if (event.keyCode == "13" || event.type === 'blur') {
							var name = $(this).val() || dimAttrData.attrName;
							dimAttrData.modifyName = name;
							$attrDimText.text(name).show().next().remove();

							//只有指标才有funcName，更新系列
							if (dimAttrData.funcName) {
								//检查是否有重复指标名称
								DimAttr.view.checkAttrName();
								DimAttr.view.updateDesginAttr();
							}
						}
					})).next().focus().select();
				});

				//点击排序按钮
				$("#dimPanel,#attrPanel,#graphPanel").on('click', '.order', function() {
					var $this = $(this);
					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					var order = dimAttrData.order || '';
					if (order == 'desc') {
						$dimAttrField.addClass('asc');
						dimAttrData.order = 'asc';
						$this.text('升序');
					} else if (order == 'asc') {
						$dimAttrField.removeClass('asc desc');
						dimAttrData.order = '';
						$this.text('排序');
					} else {
						$dimAttrField.addClass('desc');
						dimAttrData.order = 'desc';
						$this.text('降序');
					}

					//shaojs 20160829 将order属性更新到复合维度中
                    if(dimAttrData.dimType && "complex" === dimAttrData.dimType){
                        _.each(dimAttrData.dimList,function(e,i){
                            _.extend(e,{order:dimAttrData.order})
                        });
                    }
				});

				//点击翻译按钮
				$("#dimPanel,#graphPanel").on('click', '.fanyi', function() {
					var $this = $(this);
					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					var fanyi = dimAttrData.fanyi || false;
					$this.text(!fanyi ? "取消翻译" : "翻译");
					dimAttrData.fanyi = !fanyi;

                    //shaojs 20160829 将fanyi属性更新到复合维度中
                    if(dimAttrData.dimType && "complex" === dimAttrData.dimType){
                        _.each(dimAttrData.dimList,function(e,i){
                            _.extend(e,{fanyi:dimAttrData.fanyi})
                        });
                    }
				});

				//点击分档按钮
				$("#dimPanel,#graphPanel").on('click', '.fendang', function() {
					var $this = $(this);
					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					var levelId = dimAttrData.levelId || '';
					var attrId = dimAttrData.attrId || '';
					var filterType = dimAttrData.filterType || '';
					var attrName = dimAttrData.attrName || '';
					var enterType = '0';//入口方式 0表示从点击分档按钮进入
					LevelUtil.show($dimAttrField,attrId, levelId,dimAttrData.dimId,filterType,attrName,enterType);
				});

				//切换设置函数
				$("#attrPanel").on('change', '.select', function() {
					var $this = $(this);
					var $dimAttrField = $this.parents('.dimAttrField');
					var dimAttrData = $dimAttrField.data("dimAttrData");
					var funcName = $this.val(),
						attrEndText = '';
					switch (funcName) {
						case "":
							attrEndText = "默认";
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
					var modifyName = dimAttrData.modifyName.replace(/\求和|\平均值|\最大值|\最小值|\计数|\默认/g, attrEndText);
					dimAttrData.attrName = dimAttrData.attrName.replace(/\求和|\平均值|\最大值|\最小值|\计数|\默认/g, attrEndText);

					dimAttrData.modifyName = modifyName;
					dimAttrData.funcName = funcName;
					var $attrDimText = $dimAttrField.find(".attrDimText");
					$attrDimText.text(modifyName);
					DimAttr.view.updateDesginAttr();
				});
			}
		}
	};
	return DimAttr.control;
});