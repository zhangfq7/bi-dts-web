/**
 * 事件绑定模块
 * 在window上绑定自定义事件,在需要的时候触发
 * author: shaojs
 * date:2016-07-08
 * version:0.0.1
 */
require(['view/box',"underscore","EBuilder"],function(Box,_){
    //绑定图表渲染完成事件,图表渲染结束之后触发
    //这里是在EBuilder插件的install方法结束时触发,该方法每次都返回一个新的echarts实例,所以不会造成重复绑定
    $(window).on("chart.rander.complete",function(event,chart,setting){
        //定时器,用来避免双击时触发点击
        var clickTimer;
        //渲染结束后为图表绑定点击事件 图表联动
        $(chart).EBuilder("_on","click",function(e,s){
            window.clearTimeout(clickTimer);
            clickTimer = window.setTimeout(function(){
                //log("chart点击事件触发!",e,s);
                //TODO 获取页面联动开关
                var goalParam =buildChainParam.buildChainParam4chart(s,e,chart);
                var chainSwitch = !(goalParam.goalChoose && goalParam.goalChoose.length > 2); //联动开关
                //处理表连接
                if(chainSwitch){
                    //如果点击的维度名称中包含"||"则说明是组合维度,也不联动(雷达和散点图暂时不支持联动)
                    if(!!~"scatter,radar".indexOf(s.dataParams.chartType) || !!~e.name.indexOf("||")) return false;
                    //图表联动
                    var chainParam = buildChainParam.buildChainParam4chart(s,e,chart);
                    $(chart).EBuilder("chainChart",chainParam);
                }else{
                    sessionStorage.goal=JSON.stringify(goalParam);
                    $("#penetrateShow").attr("src",resPath+"/platform/dataview/penetrate-show/manage_report?reportId=REPDACBF17E5E6D48F7AC08E41F85CC1426&appType=undefined&new="+Math.random());
                    setTimeout( '$("#penetrateShow").show()',500);
                }
            },300);
        },setting);

        //绑定双击事件 图表下钻
        $(chart).EBuilder("_on","dblclick",function(e,s){
            window.clearTimeout(clickTimer);
            log("chart双击事件触发!",e,s);
            //地图不下钻 如果点击的维度名称中包含"||"则说明是组合维度,也不下钻(雷达和散点图暂时不支持下钻)
            if(!!~"scatter,radar".indexOf(s.dataParams.chartType) || !!~e.name.indexOf("||")) return false;
            //图表下钻
            $(chart).EBuilder("drill",s,e);
        },setting);
    });

    //表格主动关联时间挂载,让表格主动关联分离到这里,方便代码统一
    $(window).on("table.mainchain",function (event, row, cotainer) {
        //TODO 获取页面联动开关
        var goalParam =buildChainParam.buildChainParam4table(row, cotainer);
        var chainSwitch = !(goalParam.goalChoose && goalParam.goalChoose.length > 2); //联动开关
        //处理表连接
        if(chainSwitch){
            //图表联动
            var chainParam = buildChainParam.buildChainParam4table(row, cotainer);
            cotainer.EBuilder("chainChart",chainParam);
        }else{
            sessionStorage.goal=JSON.stringify(goalParam);
            $("#penetrateShow").attr("src",resPath+"/platform/dataview/penetrate-show/manage_report?reportId=REPDACBF17E5E6D48F7AC08E41F85CC1426&appType=undefined&new="+Math.random());
           setTimeout( '$("#penetrateShow").show()',500);
        }
    });

    //将表格的被动关联事件挂载到这里,不在EBuilder里面做表格关联
    $(window).on("table.chain",function(event,setting,option){
        var table = Box.Widgets.plugins.table;
        //这里的setting已经是table的setting挂载了连接条件之后的setting了,option也是table自己的option,所以setting直接丢到option上加载一下就好了
        option.config.build = setting;
        table.apply(option,true);
        //console.log(setting,option);
    });

    /**
     * desc : 组装一个图表联查的参数(多个方法复合)
     * @param container 容器对象
     * @param setting 构建图形时的setting
     * @returns {{dimKey, attrType: *, queryChainParam: {dataId: *, dimId: *, attrId: *, attrClass, otherChart: *}}}
     */
    var buildChainParam =  {
        buildChainParam4chart:function(setting,event,chart){
            var container = $(chart).parent("div");
            var setting = $.extend(true, {}, setting); //复制参数

            var otherContainer = container.siblings("div[id^='container_']");
            var option = $.extend(true, {}, container.data("option"));
            var goalFlag= !(option.goalChoose && option.goalChoose.length>2)//增加穿透关联判断，只有关联才考虑兄弟图表加载问题
            //已经做了连接的表不能联动
            if(!!container.data("isLinked")&&goalFlag) return;
            //TODO 雷达和散点图获取dimkey的时候找不到东西,暂时屏蔽
            //从setting.data获取查询参数的真实字段名(dimKey),防止翻译过后查询条件无效
            //此处与setting.data的数据结构耦合,data是后台返回的
            var currentData = _.find(setting.data, {name:event.name});

            if(!currentData&&goalFlag) return false; //如果
            var dimKey;
            if(currentData.dimKey){
                dimKey = [currentData.dimKey];
            }else{
                dimKey = [event.name];
            }

            //如果没有其他图则直接退出
            if (otherContainer.length == 0 && goalFlag ) return false;

            var otherChart = $.map(otherContainer,function(e,i){
                var cOption = $(e).data("option");
                if(cOption.isInit){
                    return {
                        chartId:cOption.el,
                        dataId:cOption.config.build.dataParams.dataId
                    };
                }
            });
            //如果其他图都没有初始化,则直接退出
            if(otherChart.length == 0 && goalFlag) return false;

            var currentDimAttrData = $.parseJSON(setting.dataParams.dimAttrJsonStr);

            //attrClass==0 是普通维度,3是计算维度,只有这两种维度可以联动和下钻
            if(!(currentDimAttrData.dimData[0].attrClass == "0" || currentDimAttrData.dimData[0].attrClass == "3")) return false;
            //有 levelId 说明引用了分档,不能联动
            if(currentDimAttrData.dimData[0].levelId) return false;

            var currentDimId = currentDimAttrData.dimData[0].dimId;
            var currentDataId = setting.dataParams.dataId;
            var currentAttrID = currentDimAttrData.dimData[0].attrId;
            var currentAttrClass = currentDimAttrData.dimData[0].attrClass;
            var currentAttrType = currentDimAttrData.dimData[0].attrType;
            //收集查询表关联的参数,从后台查询哪些表需要关联
            var queryChainParam = {
                dataId:currentDataId,
                dimId:[currentDimId],
                attrId:[currentAttrID],
                attrClass:[currentAttrClass],
                otherChart:otherChart
            };
            var chartLinkData = {
                "attrId"     : queryChainParam.attrId,
                "dimId"      : queryChainParam.dimId,
                "dataId"     : queryChainParam.dataId,
                "attrClass"  : queryChainParam.attrClass,
                "attrType"   : [currentAttrType],
                "filterType" : [currentDimAttrData.dimData[0].filterType],
                "attrValue"  : dimKey //查询参数优先选择dimKey
            };
            return {
                chartLinkData:chartLinkData,
                queryChainParam :queryChainParam,
                name:event.name,
                goalChoose:option.goalChoose
            }
        },
        buildChainParam4table:function (row,container) {
            var otherContainer = container.siblings("div[id^='container_']");
            var option = $.extend(true, {}, container.data("option"));
            var goalFlag= !(option.goalChoose && option.goalChoose.length>2);//增加穿透关联判断，只有关联才考虑兄弟图表加载问题
            //已经做了连接的表不能联动
            if(!!container.data("isLinked") && goalFlag) return false;
            //如果没有其他图则直接退出
           if (otherContainer.length == 0 && goalFlag ) return false;

            var otherChart = $.map(otherContainer,function(e,i){
                var cOption = $(e).data("option");
                if(cOption.isInit){
                    return {
                        chartId:cOption.el,
                        dataId:cOption.config.build.dataParams.dataId
                    };
                }
            });
            //如果其他图都没有初始化,则直接退出
           if(otherChart.length == 0 && goalFlag ) return false;

            //获取材料
            var rowsData  = option.config.dataPanel.rowsData;
            var checkedrowsData = _.filter(rowsData,function(e){
                return e.isChecked;
            });

            var dataId = option.config.build.dataParams.dataId;
            var dimCodeList = row.dimCode.split("---");
            var length = dimCodeList.length;

            //组装查询参数
            var  queryChainParam = {
                dataId:dataId,
                dimId:(_.map(checkedrowsData,function(e){
                    return e.dimId;
                })).slice(0,length),
                attrId:(_.map(checkedrowsData,function(e){
                    return e.attrId;
                })).slice(0,length),
                attrClass:(_.map(checkedrowsData,function(e){
                    return e.attrClass;
                })).slice(0,length),
                otherChart:otherChart
            };

            //addby shaojs 20170110 attrClass==0 是普通维度,3是计算维度,只有这两种维度可以联动和下钻
            if(! _.every(queryChainParam.attrClass,function(e){return !(e == "0" && e == "3");})){
                return false;
            }

            var chartLinkData = {
                "attrId"     : queryChainParam.attrId,
                "dimId"      : queryChainParam.dimId,
                "dataId"     : queryChainParam.dataId,
                "attrClass"  : queryChainParam.attrClass,
                "attrType"   : (_.map(checkedrowsData,function(e){
                    return e.attrType
                })).slice(0,length),
                "filterType" : (_.map(checkedrowsData,function(e){
                    return e.filterType;
                })).slice(0,length),
                "attrValue"  : dimCodeList //查询参数优先选择dimKey
            };
            return {
                chartLinkData:chartLinkData,
                queryChainParam :queryChainParam,
                name:row.dimCode,
                goalChoose:option.goalChoose
            }
        }
    };

    //绑定resize事件,窗口大小变化时,重新绘制所有的图和表
    var tableResize = true;//防止事件循环
    $(window).on("resize",function(e){
        //延迟300毫秒,否则宽度计算不准确
        setTimeout(function(){
            $(".chart[_echarts_instance_]").each(function(i,e){
                $(e).EBuilder('getInstanceByDom').resize();
            });
        },300);
        //重新计算图表宽度,延迟500毫秒触发window的resize,利用tableResize防止事件循环
        setTimeout(function(){
            if(tableResize){
                tableResize = false;
                $(window).trigger("resize");
            }else{
                tableResize = true;
            }
        },500)
    })


});