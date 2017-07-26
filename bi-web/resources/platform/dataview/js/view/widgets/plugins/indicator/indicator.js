define(['bace','view/box','view/widgets/plugins/indicator/dimAttr','view/widgets/plugins/indicator/desgin','view/attr'],function(Bace,Box,DimAttr,Desgin,Attr){
    Box.Widgets.plugins.indicator = {
        type:'indicator',
        flag:false,
        init:function(){
            //绑定小面板事件
            function settingPanelEvent(){
                /*//echarts图表,点击小面板中的 指标项 动作
                $("#tableChartPanel").on('click', '.dimAttrSettingPanel .attrPanel .dimAttrField', function(event) {
                    var $this  = jQuery(this);
                    var $attrText = $this.find(".attrDimText");
                    //注意：容器的配置项也会随之改变
                    if($attrText.hasClass("checked")){
                        //确保有一个被选中
                        if($this.parents(".attrPanel").find(".attrDimText.checked").length == 1){
                            return;
                        }
                        $this.data("data").isChecked = false;
                        $attrText.removeClass("checked");
                    }else{
                        $this.data("data").isChecked = true;
                        $attrText.addClass("checked");
                    }
                    //如果打开的属性栏是我本身(和属性栏联动)
                    //则更新属性栏数据
                    var $container = $this.parents('.container');
                    var option = $container.data("option");

                    if(Box.Property.isMyProperty && Box.Property.isMyProperty(option.el)){
                        DimAttr.render(option);
                    }
                });*/

                //点击 模板 小按钮 展示模板选择弹出框
                $("#tableChartPanel").on('click', '.chart-icon.tpl', function() {
                    var $container = $(this).parents('.container');
                    //"view/widgets/plugins/echarts/tpl" 模板选择框展示
                    Tpl.show($container);
                })
            }
            //只允许初始化一次(事件只绑定一次)
            if(!Box.Widgets.plugins.indicator.flag){
                settingPanelEvent();
                Box.Widgets.plugins.indicator.flag = true;
            }
        },
        initDataPanel:DimAttr.init,  //图形数据 面板初始化方法
        //配置面板属性的配置信息
        initDesginPanel:{
            //设计面板的配置信息
            config:Desgin.getConfig(),
            //设计面板配置项发生变化时触发的方法
            change:Desgin.change
        },
        contanier:{
            getTools:function(page){
                //shaojs 20160804 改造方法,为不同的页面放回不同的tools集合
                page = page || "main";//默认是主页面
                var tools = {
                    move            : '<div class="chart-icon move" title="按住我，拖动！"><i class="iconfont icon-move" ></i></div>',
                    setting         : '<div class="chart-icon setting" title="打开属性面板"><i class="iconfont icon-setting" ></i></div>',
                    openSelfDimAttr : '<div class="chart-icon openSelfDimAttr" title="打开小面板"><i class="iconfont icon-dim" ></i></div>',
                    tpl             : '<div class="chart-icon tpl " title="模版"><i class="iconfont icon-tpl" style="top: -2px; left: 4px; font-size: 24px;" ></i></div>',
                    removeSelfChart : '<div class="chart-icon removeSelfChart del" title="移除"><i class="iconfont icon-delete" ></i></div>',
                    discovery       : '<div class="chart-icon discovery" title="探索"><i class="iconfont icon-discovery" ></i></div>',
                    viewdata        : '<div class="chart-icon viewdata" title="预览工作表"><i class="iconfont icon-viewdata" ></i></div>'
                };
                switch(page){
                    case "main" :
                        switch(discovery){
                            //预留，以便后期探索页面增加内容
                            case '1':
                            /* return [tools.move, tools.setting, tools.openSelfDimAttr, tools.tpl, tools.removeSelfChart,tools.viewdata ];
                             break;*/
                            default:
                                return [tools.move, tools.setting/*, tools.openSelfDimAttr*/, /*tools.tpl,*/ tools.viewdata, tools.removeSelfChart ];
                                break;
                        }
                        break;
                    case "container" :
                        return [tools.openSelfDimAttr,tools.discovery];
                        break;
                    case "preview" :
                        return [tools.openSelfDimAttr];
                        break;
                    default :
                        return [];
                }
            },
            settingPanel:'<div class="fieldTitle indicatorTitle">指标</div>'+
            '<div class="indicatorPanel panel"></div>',
            renderSettingPanel:function($container){
                //小面板容器
               /* var $dimAttrSettingPanel = $container.find('.dimAttrSettingPanel');
                //清空小面板维度项和指标项
                $dimAttrSettingPanel.find(".dimPanel,.graphPanel,.attrPanel").empty();
                //从option中获取维度项数据
                var dataPanel = $container.data("option").config.dataPanel;

                //疑似重复代码,依然是清空小面板维度项和指标项
                var $attrPanel = $dimAttrSettingPanel.find(".attrPanel");
                $attrPanel.html("");*/


                //渲染指标项,挂载参数
                if(_.keys(dataPanel).length > 0){
                    var attrData = dataPanel.attrData;

                    var html = '<div class="dimAttrField ${order}" title="${attrName}">'
                        +'<div class="attrDimText {{if isChecked==true}} checked {{/if}}">${modifyName}</div>'
                        +'</div>';

                    for(var i =0;i<attrData.length;i++){
                        $attrPanel.append($.tmpl(html,attrData[i]).data("data",attrData[i]));
                    }
                }
                //放回渲染后的小面板
                return $dimAttrSettingPanel;
            },
            resize:{
                start:function(){
                },
                reisze:function(el){
                    Box.Widgets.plugins.indicator.indicatorSizeChange(el);
                },
                stop:function(el){
                    Box.Widgets.plugins.indicator.indicatorSizeChange(el);
                }
            }
        },
        //属性面板
        propPanel:{
            data:{
                html: '<div propType="indicator">'+
                '<div class="fieldTitle indicatorTitle">' +
                '<div style="display: inline-block; vertical-align:top">指标</div>' +
                '</div>' +
                '<div class="indicatorPanel" id="indicatorPanel"></div>' +
                '</div>'

            },
            //面板切换时触发
            tabsChange:function(event,ui){

            },
            //面板打开时，触发的方法
            openRender:function(option){
                //多数据源改造
                if(option.isInit){
                    //当前图形的dataId
                    var currentDataId = option.config.build.dataParams.dataId;
                    var currentDataName = option.config.build.dataParams.dataName;
                    Box.main.dataName = currentDataName;
                    Box.main.dataId = currentDataId;
                    Attr.init();
                    Attr.openAttrPanel('open');
                }
                DimAttr.render(option);
                Desgin.render(option);
            },
            //面板关闭方法
            close:function(){
                if(DimAttr.checkDiff()===false){
                    Box.Property.hideTip("error");
                    Box.Property.showTip({
                        _id:"error",
                        msg: '<br/>系统检测到关闭操作!<br/>但图形指标数据发生变化，<br/>是否应用该数据？',
                        button: '<div class="btn changeChart" style="width: 196px;">应用</div>' + '<div class="btn cancelChange" style="width: 196px;">直接关闭</div>'
                    });

                    $("#error .changeChart").click(function(){
                        Box.Property.apply();
                        Box.Property.hideTip("error");
                    });

                    $("#error .cancelChange").click(function(){
                        Box.Property.close(true);
                        Box.Property.hideTip("error");
                    });
                    return false;
                }else{
                    Box.Property.close(true);
                    return true;
                }
            }
        },
        apply:function(option,isPass){
            if(isPass){
                Box.Widgets.plugins.indicator.indicatorApply(option.config.build,option);
                return;
            }
            //收集指标数据
            var dimAttrData  = DimAttr.collect();
            //检测数据是否合法
            var errorText = DimAttr.checkValidity(dimAttrData);
            if(errorText){
                //如果不合法
                Box.Property.showTip({
                    _id:"error",
                    msg: '<br/>'+errorText,
                    button: '<div class="btn changeChart" style="width: 196px;">确定</div>' + '<div class="btn cancelChange" style="width: 196px;">取消</div>'
                });

                $("#error .changeChart").click(function(){
                    jQuery("#propertyTabs").tabs("option", "active", 0);
                    Box.Property.hideTip("error");
                });

                $("#error .cancelChange").click(function(){
                    jQuery("#propertyTabs").tabs("option", "active", 0);
                    Box.Property.hideTip("error");
                })
            }else{
                //如果不断绝血缘关系，面板上的变化，会实时反馈到容器上(深度复制指标维度数据)
                option.config.dataPanel =  eval( "(" + $.toJSON(dimAttrData) + ")" );
                var checkDimAttr = DimAttr.getCheckedDimAttr(dimAttrData);
                var build={};
                build.dataParams  = {
                    dataId:Box.main.dataId,    //多数据源改造,添加dataId属性
                    dataName:Box.main.dataName, //挂载数据源名称 shaojs 20160823
                    dataType:Box.main.dataType,
                    chartType:option.chartType,
                    dimAttrJsonStr:$.toJSON(checkDimAttr.data),
                    filterJsonStr:$.toJSON(Box.Filter.dataStart('collect'))
                };
                Box.Widgets.plugins.indicator.indicatorApply(build,option);
                //更新option的build
                option.config.build = build;
                option.isInit = true;
            }
        },
        //指标卡构建
        indicatorApply:function(build,option){
            var chartChild=option.chartChild;

            var $el = $("#"+option.el);
            var $grid = $(".chart",$el);
            Box.Widgets.showLoading($el);

            //防止与表格卡死
            setTimeout(function(){
                $(".dimAttrSettingPanel",$el).hide('slide');
            },0);

            build.ajaxURL = Bace.handleUrlParam('/platform/dataview/viewChartData');
            $.ajax({
                type: "POST",
                url:build.ajaxURL,
                dataType: 'json',
                data:build.dataParams,
                success: function(response) {
                    if($grid[0]){
                        $grid.replaceWith('<div class="indicator-display"></div>');
                    }else{
                        $el.find(".indicator-display").children().remove();
                    }
                    Box.Widgets.plugins.indicator.installIndicator($el,option,response);

                    $el.find(".chart i").remove();
                    Box.Widgets.hideLoading($el);
                },
                error: function() {
                    Box.Widgets.showLoading($el);
                }
            });

        },
        //接收后台返回数据，构建指标卡内容
        installIndicator:function($el,option,response) {
            if(response){
                var buildContent=response;
                var designPanel = option.config.designPanel;
                var chartChild=option.chartChild;
                var indicatorStyle = designPanel.indicator.style;
                var $appendHtml="";

                switch(chartChild){
                    case "single" :
                        $appendHtml='<div class="indiSingle"><p class="indiSingle-val fontSizeChangeValue_1" style="font-size:'+indicatorStyle.value_1+'">'+buildContent[0].value+'<span>'+buildContent[0].attrPostfix+'</span></p><p class="indiSingle-content fontSizeChangeContent_1 attr-dot" title="'+buildContent[0].attrName+'" style="font-size:'+indicatorStyle.Content_1+'">'+buildContent[0].attrName+'</p></div>';
                        break;
                    case "two" :
                        $appendHtml='<div class="indiTwo">' +
                            '           <div class="indiTwo-top">' +
                            '               <div class="indiTwo-topname fontSizeChangeContent_1 attr-dot" title="'+buildContent[0].attrName+'" style="font-size:'+indicatorStyle.Content_1+'">'+buildContent[0].attrName+'</div>' +
                            '               <div class="indiTwo-topval fontSizeChangeValue_1" style="font-size:'+indicatorStyle.Value_1+'"><p>'+buildContent[0].value+buildContent[0].attrPostfix+'</p></div>'+
                            '           </div>' +
                            '           <ul class="indiTwo-bottom"><li><span class="attr-dot fontSizeChangeContent_2" title="'+buildContent[1].attrName+'" style="font-size:'+indicatorStyle.Content_2+'">'+buildContent[1].attrName+'</span><span class="fontSizeChangeValue_2" style="font-size:'+indicatorStyle.Value_2+'">'+buildContent[1].value+buildContent[1].attrPostfix+'</span></li></ul>'+
                            '         </div>';
                        break;
                    case "three" :
                        $appendHtml='<div class="indiThree">' +
                            '           <div class="indiThree-top">' +
                            '               <p class="indiThree-topname fontSizeChangeContent_1 attr-dot" title="'+buildContent[0].attrName+'" style="font-size:'+indicatorStyle.Content_1+'">'+buildContent[0].attrName+'</p>' +
                            '               <p class="indiThree-topval fontSizeChangeValue_1" style="font-size:'+indicatorStyle.Value_1+'">'+buildContent[0].value+buildContent[0].attrPostfix+'</p>'+
                            '           </div>'+
                            '           <div class="indiThree-middle"><p class="fontSizeChangeContent_2 attr-dot" title="'+buildContent[1].attrName+'" style="font-size:'+indicatorStyle.Content_2+'">'+buildContent[1].attrName+'</p><p class="fontSizeChangeValue_2" style="font-size:'+indicatorStyle.Value_2+'">'+buildContent[1].value+buildContent[1].attrPostfix+'</p></div>'+
                            '           <div class="indiThree-bottom"><p class="fontSizeChangeContent_3 attr-dot" title="'+buildContent[2].attrName+'" style="font-size:'+indicatorStyle.Content_3+'">'+buildContent[2].attrName+'</p><p class="fontSizeChangeValue_3" style="font-size:'+indicatorStyle.Value_3+'">'+buildContent[2].value+buildContent[2].attrPostfix+'</p></div>'+
                            '        </div>';
                        break;
                    case "four" :
                        $appendHtml='<div class="indiFour">' +
                            '           <div class="indiFour-top">' +
                            '               <div class="indiFour-topname"><p class="fontSizeChangeContent_1 attr-dot" title="'+buildContent[0].attrName+'" style="font-size:'+indicatorStyle.Content_1+'">'+buildContent[0].attrName+'</p></div>'+
                            '               <div class="indiFour-topval"><p class="fontSizeChangeValue_1" style="font-size:'+indicatorStyle.Value_1+'">'+buildContent[0].value+buildContent[0].attrPostfix+'</p><p><span class="fontSizeChangeContent_4 attr-dot" title="'+buildContent[3].attrName+'" style="font-size:'+indicatorStyle.Content_4+'">'+buildContent[3].attrName+'</span><span class="fontSizeChangeValue_4" style="font-size:'+indicatorStyle.Value_4+'">'+buildContent[3].value+buildContent[3].attrPostfix+'</span></p></div>'+
                            '           </div>'+
                            '           <div class="indiFour-middle"><p class="fontSizeChangeContent_2 attr-dot" title="'+buildContent[1].attrName+'" style="font-size:'+indicatorStyle.Content_2+'">'+buildContent[1].attrName+'</p><p class="fontSizeChangeValue_2" style="font-size:'+indicatorStyle.Value_2+'">'+buildContent[1].value+buildContent[1].attrPostfix+'</p></div>'+
                            '           <div class="indiFour-bottom"><p class="fontSizeChangeContent_3 attr-dot" title="'+buildContent[2].attrName+'" style="font-size:'+indicatorStyle.Content_3+'">'+buildContent[2].attrName+'</p><p class="fontSizeChangeValue_3" style="font-size:'+indicatorStyle.Value_3+'">'+buildContent[2].value+buildContent[2].attrPostfix+'</p></div>'+
                            '        </div>';
                }
                $el.css({"background":designPanel.indicator.style.background}).find(".indicator-display").append($appendHtml).find(".attr-dot").dotdotdot();
            }
        },
        //容器大小改变
        indicatorSizeChange:function(el){
            var $el = $("#"+el);
            var $elHeight=parseFloat($el.css("height"))-15+"px";
            $el.find("indicator-container").css("height",$elHeight);
        },
        //销毁
        destory:function(el){
            var $this = $("#"+el);
            $this.remove();
        }
    }
});
