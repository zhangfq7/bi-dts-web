/**
 * Created by gaoya on 2016/12/5.
 */
define(['bace','view/box'],
    function(Bace,Box) {
        var IndiFilter = {

        };

        IndiFilter.control = {
            //初始化方法
            init: function($this,el) {
                IndiFilter.module.el=el;
                IndiFilter.view.installIndiFilterSortable($this);
            },

            dataStart:function(handle,IsRender){
                //多功能函数,如果参数是 colect 则收集过滤条件,否则构建过滤组件
                //多功能函数,如果参数是 colect 则收集过滤条件,否则构建过滤组件
                if(handle === 'collect'){
                    var _filters = [];
                    jQuery(".filterarea .filter-attr").each(function(){
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
                        _filters.push(filterAttrData);
                    })
                    return _filters;
                }else{
                    if(IsRender){
                        for(var i = 0 ,n=handle.length;i<n;i++){
                            var $filterItem = IndiFilter.view._packIndicatorFilter(handle[i]);
                            var labelValueArray = $.evalJSON(handle[i].filterLabelValue);

                            //属性面板添加过滤指标信息
                            $(".indicatorPanel .dimAttrField.open .modifyName").after($filterItem);

                            if(handle[i].filterSelectValue!=(undefined||""||null)){
                                var selectValue = $.evalJSON(handle[i].filterSelectValue);
                                var startText="";
                                var endText="";

                                switch(selectValue[0]){
                                    case "more_2" : startText="大于";
                                        break;
                                    case "moreEq_2" : startText="大于等于";
                                        break;
                                    case "eq_3" : startText="等于";
                                        break;
                                    case "like_9" : startText="全匹配";
                                        break;
                                    case "leftLike_9" : startText="左匹配";
                                        break;
                                    case "rightLike_9" : startText="右匹配";
                                        break;
                                }
                                switch(selectValue[1]){
                                    case "less" : endText="小于";
                                        break;
                                    case "lessEq" : endText="小于等于";
                                        break;
                                    case "":endText="";
                                        break;
                                }

                                if(!labelValueArray[1]){
                                    $filterItem.find(".filter-attrContent")
                                        .html(startText+decodeURIComponent(labelValueArray[0]))
                                        .attr("title",startText+decodeURIComponent(labelValueArray[0]))
                                        .dotdotdot();
                                }else{
                                    $filterItem.find(".filter-attrContent")
                                        .html(startText+decodeURIComponent(labelValueArray[0])+","+endText+decodeURIComponent(labelValueArray[1]))
                                        .attr("title",startText+decodeURIComponent(labelValueArray[0])+","+endText+decodeURIComponent(labelValueArray[1]))
                                        .dotdotdot();
                                }
                            }else{
                                $filterItem.find(".filter-attrContent")
                                    .html(decodeURIComponent(labelValueArray[0]))
                                    .attr("title",decodeURIComponent(labelValueArray[0]))
                                    .dotdotdot();
                            }
                        }
                    }else{
                        for(var i = 0 ,n=handle.length;i<n;i++){
                            var $filterItem = IndiFilter.view._packFilter(handle[i]);
                            jQuery(".filterarea").append($filterItem);
                            var labelValueArray = $.evalJSON(handle[i].filterLabelValue);
                            (function(array,$filterItem){
                                setTimeout(function(){
                                    $filterItem.find(".intervalInput.start").val(decodeURIComponent(array[0]));
                                    $filterItem.find(".intervalInput.end").val(decodeURIComponent(array[1]));
                                },100)

                            })(labelValueArray,$filterItem)

                        }
                    }

                }
            },
            getPluginByType:function(type){
                if (['pie', 'bar', 'line', 'radar', 'funnel', 'gauge', 'map', 'scatter'].indexOf(type) > -1) {
                    return Box.Widgets.plugins["echarts"];
                } else {
                    return  Box.Widgets.plugins[type];
                }
            },
        }

        IndiFilter.view = {

            //装载筛选区，筛选条件拖拽动作
            installIndiFilterSortable:function($this){
                //定义拖拽的元素
                $("#layout_attr_treeGrid_panel span[file]").parents('td').trigger("draggable");

                $(".filterarea").sortable({
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
                                // filterContent:$item.attr("data-filtercontent"),
                                filterLabelValue:"",
                                filterValue:""
                            };
                            var $filterItem = IndiFilter.view._packFilter(filterAttrData);

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

                //初始化指标维度面板所有绑定事件
                var bindEvent = IndiFilter.view.bindFilterEvent;
                for (var event in bindEvent) {
                    bindEvent[event]();
                }

                $.dialog({
                    id: 'indicatorFilterDialog',
                    title: '指标卡过滤',
                    padding: '0',
                    width: '830px',
                    height: '400px',
                    lock: false,
                    resize: false,
                    content: jQuery("#indicatorFilterPanel")[0],
                    cancelVal: '取消',
                    okVal: '保存',
                    ok: function () {
                        $.dialog.confirm("您确定保存该过滤条件设置吗？", function () {
                            $("#propertyPanel").css({"display":"block"});
                            $(".indicatorPanel .dimAttrField.open .filter-attr").remove();
                            //收集过滤筛选器中的过滤条件
                            var _filters=IndiFilter.control.dataStart("collect");
                            var dimAttrData=$this.data("dimAttrData");
                            //将过滤条件赋值到dimAttrData
                            dimAttrData.filterContent=_filters;

                            //渲染属性面板的过滤内容
                            IndiFilter.control.dataStart(_filters,"IsRender");

                            //过滤名称长度溢出时，采用title指代
                            $this.find(".filter-attrName").dotdotdot();

                            //重新定义指标面板的高度
                            $this.css({"height":(122+30*dimAttrData.filterContent.length)+"px"});
                            return true;
                        });
                    },
                    cancel: function () {
                        $("#propertyPanel").css({"display":"block"});
                        return true;
                    }
                });
                Bace.autoScroll($(".filterarea"));
            },
            _packFilter:function(filterAttrData){
                filterAttrData.filterId = filterAttrData.attrId +"_"+new Date().getTime();
                var whereItem = '';
                whereItem +='<div id="${filterId}" class="filter-attr cursor-pointer">';
                whereItem +='   	<span class="label">';
                whereItem +='   		<label>${attrName}</label><span>：</span>';
                whereItem +='   		<input id="${filterId}_input" type="text" class="bi-input target" />';
                whereItem +='   	</span>';
                whereItem +='   	<span class="icon-filter-tools">';
                whereItem +='   		<i class="fa fa-remove icon-filter-hover" style="margin-left:1px" title="删除"></i>';
                whereItem +='   	</span>';
                whereItem +='</div>';


                var filterAttrObj = $.tmpl(whereItem, filterAttrData).data("filterAttrData",filterAttrData);
                setTimeout(function(){
                    //根据当前指标类型，和筛选类型生成搜索输入框,并绑定各自相应的事件
                    IndiFilter.view.translate(filterAttrData);
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
                if([IndiFilter.module.filterType.DIM,'A','B','C'].indexOf(type) > -1){
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
                            url:Bace.handleUrlParam(IndiFilter.module.ajaxURL),
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
                    if(filterAttrData.filterType == IndiFilter.module.filterType.MONTH || filterAttrData.filterType == IndiFilter.module.filterType.DAY || filterAttrData.filterType == IndiFilter.module.filterType.TIME/*filterAttrData.attrType == IndiFilter.module.attrType.DATE*/){
                        //如果是时间切换，销毁时间组件
                        var $startDate = $filterAttrObj.find("input.start");
                        var $endDate = $filterAttrObj.find("input.end");


                        if($startDate.data("DateTimePicker")){
                            $startDate.data("DateTimePicker").destroy();
                            $endDate.data("DateTimePicker").destroy();
                        }
                        var fmt = "";
                        var showChangeType = "";
                        if(type == IndiFilter.module.filterType.MONTH){
                            fmt = "YYYY-MM";
                        }
                        if(type == IndiFilter.module.filterType.DAY){
                            fmt = "YYYY-MM-DD"
                            showChangeType += "months,days"
                        }
                        if(type == IndiFilter.module.filterType.TIME){
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
                                        filterAttrData.filterValueType = IndiFilter.module.filterType.MONTH;
                                        break;
                                    case 'times':
                                        filterAttrData.filterValueType = IndiFilter.module.filterType.TIME;
                                        break;
                                    case 'days':
                                        filterAttrData.filterValueType = IndiFilter.module.filterType.DAY;
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
            _packIndicatorFilter:function(filterAttrData){
                filterAttrData.filterId = filterAttrData.attrId +"_"+new Date().getTime();
                var whereItem = '';
                whereItem +='<div class="filter-attr" data-filterid="${filterId}">';
                whereItem +='   	<div class="filter-attrName label" title="${attrName}">${attrName}</div><span>:</span>';
                whereItem +='   	<span class="filter-attrContent" ></span>';
                whereItem +='   	<div class="filter-attrDelete"><i class="icon-filter-tools">-</i></div>';
                whereItem +='</div>';


                var filterAttrObj = $.tmpl(whereItem, filterAttrData).data("filterAttrData",filterAttrData);
                return filterAttrObj;
            },
            bindFilterEvent:{
                //切换不同的筛选面板
                changeFilterSelect:function(){
                    jQuery(".filterarea").on('change','.chooseType.start select',function(){
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
                //删除指标
                removeFilter:function(){
                    jQuery(".filterarea").on('click ','.fa-remove',function(){
                        jQuery(this).parents('.filter-attr').fadeOut(200,function(){
                            this.remove();
                        });

                        setTimeout(function(){
                            myLayout.resizeAll();
                        },300)

                    });
                },
                hoverAttr:function(){
                    jQuery(".filterarea").on('mouseover','.filter-attr',function(){
                        $(this).addClass('hover');
                    })
                    jQuery(".filterarea").on('mouseout','.filter-attr',function(event){
                        var $this =  jQuery(this);
                        var id =$this.attr("id");
                        if(jQuery(".fliterMenu[fid='"+id+"']").is(":visible")){
                            //$this.poshytip('hide');
                        }else{
                            $this.removeClass('hover');
                        }
                    });
                }

            }
        };

        IndiFilter.module = {
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
        //挂载筛选条件收集方法
        Box.IndiFilter.dataStart = IndiFilter.control.dataStart;
        return IndiFilter.control;
    }
)