/**
 * Created by gaoya on 2016/11/14.
 */
define(['bace', 'view/box','underscore','view/widgets/plugins/indicator/indiFilter'], function(Bace, Box,_,IndiFilter) {
    var DimAttr = {};
    DimAttr.module = {
        chartType: '',
        el:'',
        mapType:'',
        chartChild:''
    };
    DimAttr.control = {
        init: function(option) {
            DimAttr.view.initDimAttrPanel();
        },
        collect:function(){
            var attrData = [];
            $("#indicatorPanel .dimAttrField").each(function(){
                attrData.push($(this).data("dimAttrData"));
            });
            var dimAttrData = {
                attrData:attrData
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
            DimAttr.module.chartChild=option.chartChild;//判断图形chartChild gaoya 20160826
            //reset
            $("#indicatorPanel .select").chosen("destroy");
            $("#indicatorPanel .dimAttrField").remove();

            var attrData = handle["attrData"]||[];
            for(var i = 0,n=attrData.length;i<n;i++){
                $("#indicatorPanel").append( DimAttr.view.packDimAttr("indicatorPanel", attrData[i]));
            }

            $("#indicatorPanel .funcSelect").chosen({
                width: "100%",
                disable_search:true
            });
            $("#indicatorPanel .formatSelect").chosen({
                width: "100%",
                disable_search:true
            });

            // DimAttr.view.updateTplAttrPanel();模板部分 待改
        },
        getCheckedDimAttr:function(dimAttr){

            var indexArray = [];
            var attrData =  $.map(dimAttr.attrData, function(obj,num) {
                if(obj.isChecked){
                    indexArray.push(num);
                    return  obj;
                }
            });
            return {
                data:{
                    attrData:attrData
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
            if(new_dimAttr.attrData.length == 0 ){
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
            var attrData = dimAttr.attrData;

            if($("#indicatorPanel .attrDimText.vr").length > 0 ){
                return "请设置模板位指标！"
            }
            if($("#indicatorPanel .checked").length==0){
                return "请设置指标！"
            }else if(DimAttr.module.chartChild==="single"&&$("#indicatorPanel .checked").length!=1){
                return "此类型指标卡只可以设定一个指标！";
            }else if(DimAttr.module.chartChild==="two"&&$("#indicatorPanel .checked").length!=2){
                return "此类型指标卡需设定两个指标！";
            }else if(DimAttr.module.chartChild==="three"&&$("#indicatorPanel .checked").length!=3){
                return "此类型指标卡需设定3个指标！";
            }else if(DimAttr.module.chartChild==="four"&&$("#indicatorPanel .checked").length!=4){
                return "此类型指标卡需设定4个指标！";
            }
        }
    };
    DimAttr.view = {
        initDimAttrPanel: function() {
            //shaojs 20160823 组合维度改造,提取sortable参数,两个面板分别初始化
            var sortableConfig = {
                connectWith: "#indicatorPanel",
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
                        'data-filtercontent':[]||'',
                        'data-attrpostfix':dimAttrData.attrPostfix||'',
                        'data-attrformat':dimAttrData.attrFormat||'',
                        'style': 'z-index:9999999;height:30px',
                        'html': dimAttrData.modifyName || dimAttrData.attrName,
                        'data-diyRelation': dimAttrData.diyRelation
                    }).addClass('attr-helper').appendTo('body');
                },
                over: function(event, ui) {

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
                            attrClass:$item.attr("data-attrclass"),
                            fieldName:$item.attr("data-fieldname"),
                            columnScale:$item.attr("data-columnscale"),
                            filterType: $item.attr("data-filterType"),
                            dimId: $item.attr("data-dimId"),
                            filterContent:[]/*$item.attr("data-filtercontent")*/,
                            attrPostfix:($item.attr("data-attrpostfix")==("undefined"||"null"||undefined||null||"NaN"||"")?"":$item.attr("data-attrpostfix")),
                            attrFormat:($item.attr("data-attrformat")==("undefined"||"null"||undefined||null||"NaN"||"")?"1":$item.attr("data-attrformat")),
                            diyRelation: $item.attr("data-diyRelation"),
                            isChecked: true,
                            fanyi: true,
                            order:''
                            //attrFrom:$item.attr("data-attrfrom")
                        }
                    } else {
                        dimAttrData = $item.data("dimAttrData");
                    }
                    var $attr = DimAttr.view.packDimAttr(parentPanel, dimAttrData ,"isDray");

                    ui.item.replaceWith($attr);
                    setTimeout(function() {
                        if (ui.helper) {
                            ui.helper.remove();
                        }
                    }, 0);
                    //指标面板初始化下拉框组件
                    $("#indicatorPanel .funcSelect").chosen({
                        width: "100%",
                        disable_search:true
                    });
                    $("#indicatorPanel .formatSelect").chosen({
                        width: "100%",
                        disable_search:true
                    });
                    //检查是否有重复指标名称
                    DimAttr.view.checkAttrName();
                    //更新系列(图形种类切换)
                    DimAttr.view.updateDesginAttr();
                    //更新模板指标占位符
                    // DimAttr.view.updateTplAttrPanel($attr);模板部分 待改

                }
            };
            //两个面板分别初始化 (disableSelection方法,禁止鼠标选择)
            //shaojs 20160829 分开初始化暂时用不上了,保留在这里,以便以后扩展
            $("#indicatorPanel").sortable(sortableConfig).disableSelection();
            var bindEvent = DimAttr.view.bindDimAttrEvent;
            //初始化指标维度面板所有绑定事件
            for (var event in bindEvent) {
                bindEvent[event]();
            }
            //美化滚动条(#graphPanel的美化不在这里,需要显示之后再美化)
            Bace.autoScroll($("#indicatorPanel"));
        },
        checkAttrName: function() {
            var attrNameArray = [];
            $("#indicatorPanel .dimAttrField").each(function(i) {
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
            $("#indicatorPanel .dimAttrField").each(function(){
                attrData.push($(this).data("dimAttrData"));
            });
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
            var dimAttrData = $.extend(true, {}, _dimAttrData),
                setting = $.extend(true, {}, _dimAttrData);
                setting.chartType = DimAttr.module.chartType;

            if(!dimAttrData.id){
                dimAttrData.id = dimAttrData.attrId + (new Date()).getTime();
            }

            //挂载父面板的ID;
            setting.parentPanel = parentPanel;
            var html = '';
            //如果是指标项
            if (parentPanel == 'indicatorPanel') {
                //加工函数
                //指标判断是否设置过函数
                //没有，则设置默认计算个数
                var funcName = setting.funcName;
                if (!funcName) {
                    if(dimAttrData.modifyName.indexOf("默认") > -1){
                        dimAttrData.funcName = setting.funcName = '';
                        dimAttrData.modifyName = dimAttrData.attrName = setting.modifyName;
                    }else{
                        //纠正数据载体的函数
                        dimAttrData.funcName = setting.funcName = 'count';
                        dimAttrData.modifyName = dimAttrData.attrName = setting.modifyName = "[ 计数 ] " + setting.modifyName;
                    }
                }
                if(isDray) {
                    //不同的指标卡组件设定所允许添加的指标数量
                    switch (DimAttr.module.chartChild) {
                        case "single":
                            setting.isChecked = dimAttrData.isChecked = $("#indicatorPanel .checked").length > 0 ? false : true;
                            break;
                        case "two":
                            setting.isChecked = dimAttrData.isChecked = $("#indicatorPanel .checked").length > 1 ? false : true;
                            break;
                        case "three":
                            setting.isChecked = dimAttrData.isChecked = $("#indicatorPanel .checked").length > 2 ? false : true;
                            break;
                        case "four":
                            setting.isChecked = dimAttrData.isChecked = $("#indicatorPanel .checked").length > 3 ? false : true;
                            break;
                    }
                }

                /*if(setting.isTpl === true){模板部分 待改
                    html = '<div class="dimAttrField ${order}" >' +
                        '<div class="attrDimPanel vr">' +
                        '<div class="icon-vr"></div>' +
                        '<div class="attrDimText vr">${attrName}</div>' +
                        '</div>'+
                        '</div>';
                }else{*/
                    html = '<div class="dimAttrField ${order}" >' +
                        '<div class="attrDimPanel">' +
                        '	<div class="icon-checkbox {{if isChecked==true}} checked {{/if}}"></div>' +
                        '	<div class="attrDimText" title="${modifyName}">${modifyName}</div>' +
                        '   <div class="delAttrDim" deltag="attr" title="移除该指标"></div>' +
                        '</div>' +
                        '<div class="attrDimTools">' +
                        '      <div {{if attrClass=="0"}} style="width:40%;text-align:left;padding:0 3px;" {{else}} style="width:50%;text-align:left;padding:0 3px;" {{/if}}>' +
                        '			<select class="select funcSelect">' +
                        '			{{if attrType=="1"}}' +
                        '				<option  {{if funcName=="sum"}} selected {{/if}}value="sum">求和</option>' +
                        '				<option  {{if funcName=="avg"}} selected {{/if}}value="avg">平均值</option>' +
                        '			{{/if}}' +
                        //时间格式化没有最大值和最小值选项 addby shaojs 20161018 "attrClass" 0：普通字段；1：自定义字段；2：报表自定义字段；3：日期格式化自定义字段
                        '           {{if attrClass != "3"}}'+
                        '				<option  {{if funcName=="max"}} selected {{/if}}value="max">最大值</option>' +
                        '				<option  {{if funcName=="min"}} selected {{/if}}value="min">最小值</option>' +
                        '			{{/if}}' +
                        '				<option  {{if funcName=="count"}} selected {{/if}}value="count">计数</option>' +
                        '			</select>' +
                        '		</div>'+
                        '       {{if attrClass=="0"}}'+
                        '       <div class="indicator-filter">' +
                        '           <span>过滤</span>' +
                        '           <i>+</i>' +
                        '       </div>'+
                        '       {{/if}}'+
                        '		<div class="modifyName" {{if attrClass=="0"}} style="width:30%";{{else}}style="width:50%";{{/if}}>' +
                        '			<div >重命名</div>' +
                        '		</div>'+
                        '       <div class="displaySuffix"><div>后缀单位：</div><input class="bi-input postfix-input" style="width:60%;margin:3px 0;float:left;" value="${attrPostfix}"/></div>'+
                        '       <div class="figureFormat">' +
                        '           <div class="figureText">数字格式：</div>' +
                        '           <div class="figureSelect" style="">' +
                        '               <select class="select formatSelect">' +
                        '                   <option {{if attrFormat=="1"}} selected {{/if}} value="1">整数&nbsp;&nbsp;&nbsp;1234</option>' +
                        '                   <option {{if attrFormat=="2"}} selected {{/if}} value="2">千分数&nbsp;&nbsp;&nbsp;1,234</option>' +
                        '                   <option {{if attrFormat=="3"}} selected {{/if}} value="3">百分比&nbsp;&nbsp;&nbsp;1234%</option>' +
                        '                   <option {{if attrFormat=="4"}} selected {{/if}} value="4">百分比千分位&nbsp;&nbsp;&nbsp;1,234%</option>' +
                        '                   <option {{if attrFormat=="5"}} selected {{/if}} value="5">百分比小数&nbsp;&nbsp;&nbsp;1234.00%</option>' +
                        '                   <option {{if attrFormat=="6"}} selected {{/if}} value="6">百分比全部&nbsp;&nbsp;&nbsp;1,234.00%</option>' +
                        '               </select>' +
                        '           </div>' +
                        '       </div></div>'
                        + '</div>'
                        + '</div>';
                }
            //}
            return $.tmpl(html, setting).data("dimAttrData", dimAttrData);
        },
        /**
         * isDray:是否是拖动触发方法
         * 更新模板指标占位
         */
        /*updateTplAttrPanel:function($attr){模板部分 待改

            var option = $("#"+DimAttr.module.el).data("option");
            var tplCount = option.tplCount;
            var $indicatorPanel = $("#indicatorPanel");
            var $vr_dimAttrField = $(".attrDimPanel.vr",$indicatorPanel);
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
                var $dimAttrField = $(".dimAttrField",$indicatorPanel);
                $dimAttrField.each(function(n){
                    var $this = $(this);
                    if(n<tplCount){
                        $this.addClass("tplAttrBg");
                    }else{
                        $this.removeClass("tplAttrBg");
                    }
                })
            }
        },*/
        bindDimAttrEvent: {
            bindDelAttrDim: function() {
                $("#propertyTabs").on("click", "div[proptype='indicator'] div.delAttrDim", function() {
                    var $this = $(this);
                    var type = $this.attr("deltag");
                    $this.parents(".dimAttrField").fadeOut(200, function() {
                        var $this = $(this);
                        if (type == "attr") {
                            //维护模版指标个数 模板部分 待改
                            /*if($this.hasClass("tplAttrBg")){
                                var option = $("#"+DimAttr.module.el).data("option");
                                option.tplCount--;
                            }*/
                            $this.remove();
                            //更新系列
                            DimAttr.view.updateDesginAttr();
                        }else{
                            $this.remove();
                        }

                    });
                })
            },
            bindOpenDimAttrOpt: function() {
                $("#indicatorPanel").on('click', '.attrDimText', function() {
                    var $this = $(this);
                    if($this.hasClass('vr')){
                        return;
                    }

                    var dimAttrField = $this.parents('.dimAttrField');
                    var dimAttrData = dimAttrField.data("dimAttrData");
                    dimAttrField.siblings()
                        .removeClass('open')
                        .animate({
                            "height": "30px"
                        }, 200);
                    (dimAttrField.hasClass('open') ? dimAttrField.animate({
                        "height": "30px"
                    }, 200) : dimAttrField.animate({
                        "height": (dimAttrData.filterContent.length>0)?((122+dimAttrData.filterContent.length*30)+"px"):"122px"
                    }, 200)).toggleClass('open');
                    $("#indicatorPanel input").blur();

                    //修改页面，包含有过滤筛选器的内容，点击指标title展示出筛选器内容
                    if(dimAttrData.filterContent&&dimAttrData.filterContent.length>0){
                        $("#indicatorPanel .filter-attr").remove();
                        Box.IndiFilter.dataStart(dimAttrData.filterContent,"isRender");
                    }
                });
            },
            bindCheckBox: function() {
                //点击指标面板复选框
                $("#indicatorPanel").on('click', '.dimAttrField .icon-checkbox',function() {
                    var $this = $(this);
                    var $dimAttrField = $this.parents('.dimAttrField');
                    var dimAttrData = $dimAttrField.data("dimAttrData");
                    if ($this.hasClass('checked')) {
                        //确保有一个被选中
                        if ($("#indicatorPanel").find(".checked").length == 1) {
                            return;
                        }

                        $this.removeClass('checked');
                        dimAttrData.isChecked = false;
                    } else {
                        $this.addClass('checked');
                        dimAttrData.isChecked = true;
                    }
                });

                //点击重命名按钮
                $("#indicatorPanel").on('click', '.modifyName', function() {
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

                //切换设置函数
                $("#indicatorPanel").on('change', '.funcSelect', function() {
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

                //设置过滤函数
                $("#indicatorPanel").on('click', '.indicator-filter', function() {
                    var $this=$(this);
                    var $dimAttrField=$this.parents(".dimAttrField");
                    var dimAttrData=$dimAttrField.data("dimAttrData");

                    if(!$("#urlSettingsPanel")[0]){
                        jQuery("body").append("<div id='indicatorFilterPanel' style='display:none;position: relative;'></div>");
                    }
                    jQuery("#indicatorFilterPanel").load(Bace.handleUrlParam('/platform/dataview/indicator-filter'), function () {
                        //隐藏属性面板，以免拖拽过程中属性面板会接受拖动的指标
                        $("#propertyPanel").css("display","none");
                        //弹出框提示指标名称
                        $(".filterTop span").html($this.parentsUntil("#indicatorPanel").find(".attrDimText").html());

                        IndiFilter.init($dimAttrField,DimAttr.module.el);

                        if(dimAttrData.filterContent && dimAttrData.filterContent.length>0){

                            Box.IndiFilter.dataStart(dimAttrData.filterContent);
                        }

                    });

                });

                //切换数字格式
                $("#indicatorPanel").on('change', '.figureSelect .formatSelect', function() {
                    var $this = $(this);
                    var $dimAttrField = $this.parents('.dimAttrField');
                    var dimAttrData = $dimAttrField.data("dimAttrData");
                    var attrFormat = $this.val();

                    dimAttrData.attrFormat = attrFormat;
                    DimAttr.view.updateDesginAttr();

                });

                //获取后缀单位
                $("#indicatorPanel").on('change', '.postfix-input', function() {
                    var $this = $(this);
                    var $dimAttrField = $this.parents('.dimAttrField');
                    var dimAttrData = $dimAttrField.data("dimAttrData");

                    dimAttrData.attrPostfix=$this.val();
                    DimAttr.view.updateDesginAttr();
                });

                //过滤筛选器中指标点击删除，选择器需修改
                $("#indicatorPanel").on('click','.filter-attr .filter-attrDelete',function(){
                    var $this=$(this);
                    var $filterAttr=$this.parents(".filter-attr");
                    var $dimAttrField=$this.parents(".dimAttrField");
                    var dimAttrData = $dimAttrField.data("dimAttrData");
                    var dimAttrFilterContent=dimAttrData.filterContent;
                    //获取所删除指标的filterId
                    var dataFilterId=$filterAttr.attr("data-filterid");
                    //删除选中的指标行
                    $filterAttr.remove();
                    //删除dimAttrData中所对应的过滤指标
                    _.each(dimAttrFilterContent,function(e,v){
                        if(e.filterId==dataFilterId){
                            dimAttrFilterContent.splice(v,1);
                        }
                    });
                    $dimAttrField.css({"height":(122+dimAttrFilterContent.length*30)+"px"});
                })

            }
        }
    };
    return DimAttr.control;
});
