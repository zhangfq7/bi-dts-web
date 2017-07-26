define(['bace', 'view/box', 'view/realtimeapp/realtimeapp_layout','view/realtimeapp/realtimeapp_datagrid','view/realtimeapp/realtimeapp_filters','view/component/OpenApiGridUtil','view/component/reportUtil','underscore','layout',"grid","validation",'dialog'],
    function(Bace, Box, Layout,grid,filters,OpenApiGridUtil,reportUtil,_) {
        var Widgets = {
        };
        Widgets.module = {

        };
        var loadingOption = {
            lines: 13, // The number of lines to draw
            length: 7, // The length of each line
            width: 4, // The line thickness
            radius: 10, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#fff', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9 // The z-index (defaults to 2000000000)
        };

        //是否已经加载过数据源
        var dataLoaded = false;
        //挂载数据源信息,保存的时候用
        var global_apiBaseInfo = null;
        var global_paramInfoStr = null;

        Widgets.control = {
            init: function() {
                //全局标识为实时应用
                Box.flags.isRealtimeapp = true;

                //挂载可视化编码
                Box.main.reportId = _RSDFGHJJKK;
                //挂载应用类型
                Box.main.appType = appType;

                //如果reportId 不为空,则是修改页面
                if(Box.main.reportId){
                    //根据reportId查询配置并初始化页面(参考main.js)
                    $.ajax({
                        type: "POST",
                        url: Bace.handleUrlParam('/platform/dataview/queryViewInfo'),
                        dataType: 'json',
                        data: {
                            reportId: Box.main.reportId,
                            appType: Box.main.appType
                        },
                        success: function (config) {
                            //挂载报表基本信息
                            Box.main.reportName = config.reportName;console.log(config);
                            Box.main.reportDesc = config.reportDesc;
                            Box.main.labelId = $.evalJSON(config.labelId);

                            //解析报表配置
                            var resportConfig = JSON.parse(config.resportConfig);

                            Widgets.view.init();
                            Widgets.view.bindEvents();
                            //渲染指标和过滤条件
                            var rows = resportConfig.properties;
                            //如果是查看页面,则只涨势已近选中的指标
                            if("1" == isView){
                                rows = _.filter(rows,function (e,i) {
                                    return e.checked;
                                })
                            }
                            Widgets.view.rander(resportConfig.apiBaseInfo,resportConfig.paramInfoStr,rows);
                            buildGrid("exec");

                            //页面加载完成之后再显示
                            setTimeout(function () {
                                jQuery('body').removeClass('invisible');
                            },850);
                        }
                    });
                }else{
                    Widgets.view.init();
                    Widgets.view.bindEvents();

                    //页面加载完成之后再显示
                    setTimeout(function () {
                        jQuery('body').removeClass('invisible');
                    },850);
                }
            }
        };

        Widgets.view = {
            init: function() {
                //初始化布局
                Layout.init();

                //初始化头部选项卡(jquery ui 的tabs组件)
                jQuery("#tabs").tabs({
                    active: function(event, ui) {},
                    beforeActivate: function(event, ui) {}
                }).disableSelection();

                //如果是查看页面,则关闭工具栏,并移除工具元素
                if("1" == isView){
                    //myLayout 布局初始化时注入到window的布局变量
                    window.myLayout.sizePane('north', 33);
                    $("#tabs_data").empty();
                }

                //为头部选项卡增加LOGO
                jQuery("#tabs").append($("<div></div>", {
                    "class": "tabs-logo",
                    html: "<div class='icon-logo'></div>"
                }).on('click', function() {
                    //alert(); //绑定事件
                }));
            },
            bindEvents:function () {
                //浏览器大小变化时重新刷新表格大小
                $(window).resize(function(e){
                    if(!$("#table_container").is(":empty")){
                        setTimeout(function(){
                            $("#table_container").datagrid("resize");
                        },400);
                    }
                });

                //选择数据源按钮
                jQuery("#existData").click(function(){
                    OpenApiGridUtil.show(Widgets.view.rander);
                });

                //应用按钮(作用和查询按钮一样)
                $(".j_exec").click(function(event){
                    event.stopPropagation();
                    buildGrid("query");
                });

                //查询按钮
                $(".search .fa-search").click(function(event){
                    event.stopPropagation();
                    buildGrid("query");
                });

                //保存
                $("#saveReport").click(function(event){
                    event.stopPropagation();
                    if(!dataLoaded){
                        $.dialog({
                            lock: true,
                            content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">请加载数据源</div>',
                            icon: 'warning',
                            ok: true
                        });
                        return false;
                    }else if(!$("#table_container").hasClass("datagrid-f")){
                        //表格没有初始化
                        $.dialog({
                            lock: true,
                            content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">请先初始化表格</div>',
                            icon: 'warning',
                            ok: true
                        });
                        return false;
                    }
                    else{
                        //收集页面config并挂载到 Box.main.realTimeappConfig 上
                        Box.main.realTimeappConfig = {
                            properties:Properties.view.collect("save"),
                            apiBaseInfo:global_apiBaseInfo,
                            paramInfoStr:global_paramInfoStr
                        };
                        reportUtil.show();
                    }
                });


            },
            rander:function(apiBaseInfo,paramInfoStr,rows){
                console.log(paramInfoStr,apiBaseInfo);
                //挂载全局的数据源信息,保存的时候要用
                global_apiBaseInfo = apiBaseInfo;
                global_paramInfoStr = paramInfoStr;
                //数据源已近加载,设置标识位
                dataLoaded = true;
                //处理指标信息
                //apiBaseInfo.resultType 1:String 2：Integer 3：Decimal 4:Date
                var iconClassList = ["","icon-attr-str","icon-attr-num","icon-attr-num","icon-attr-date"];
                //修改和查看页面会传入一个已经处理好的rows,如果不是修改页面则需要从apiBaseInfo中解析rows
                rows =rows ||JSON.parse(apiBaseInfo.resultInfoStr);

                //添加 iconClass spinClass checkClass 属性
                rows = $.map(rows,function(e,i){
                    e.iconClass = iconClassList[e.resultType];
                    e.spin = !!e.spin ;
                    e.spinClass = !e.spin ? "":"spin";
                    e.checked = !!e.checked;
                    e.checkClass = !e.checked ? "":"checked";
                    return e;
                });
                //初始化指标
                Properties.view.init(rows);
                //绑定指标事件
                Properties.view.bindEvents();

                //处理过滤条件
                var filterList = JSON.parse(paramInfoStr);
                filters.init(filterList,apiBaseInfo);
            },
            showLoading:function($container){
                if(typeof(Spinner2)!=='undefined'){
                    var $load = jQuery('<div></div>',{
                        "class":"bi-confirm loadingBg"
                    });
                    $container.spin(loadingOption);
                    $container.append($load);
                }
                $container.data("isLoading",true);
            },
            hideLoading:function($container){
                var $bg = $container.find(".loadingBg");
                if($bg.length == 0)return;
                if(typeof(Spinner2)!=='undefined'){
                    $container.spin('close');
                    $bg.remove();
                }
                $container.data("isLoading",false);
            }
        };

        function buildGrid(mode){
            //根据 dataLoaded 做提示
            if(!dataLoaded){
                $.dialog({
                    lock: true,
                    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">请加载数据源！</div>',
                    icon: 'warning',
                    ok: true
                });
                return false;
            }
            //获取列信息
            var prop = Properties.view.collect("colum");
            if(prop.columns[0].length + prop.frozenColumns[0].length == 0){
                $.dialog({
                    lock: true,
                    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">请选择展示指标！</div>',
                    icon: 'warning',
                    ok: true
                });
                return false;
            }
            //收集filter参数,加入到prop中
            var __apiBaseInfo = $.extend(true,{},global_apiBaseInfo);

            __apiBaseInfo.resultInfoStr=Properties.view.collect("query");
            __apiBaseInfo.paramInfoStr=filters.collect(mode);
            prop.queryParams = __apiBaseInfo;
            //初始化表格
            grid.init(prop);
        }

        var attrTreeGrid = null;
        var searchTimeout;
        var Properties = {
            view:{
                init:function (rows,isModify) {
                    //如果已经有指标树则直接加载数据
                    if(attrTreeGrid){
                        var grid = $("#layout_attr_panel").ligerGetGridManager();
                        if (!grid) return;
                        grid.loadData({Rows:rows});
                    }
                    //否则初始化指标树
                    attrTreeGrid = $("#layout_attr_panel").ligerGrid({
                        columns: [{
                            name: 'attrClass',
                            width: '100%',
                            align: 'left',
                            render: function(rowdata, rowindex, value) {
                                var resultName = rowdata.resultName;
                                var html = "<span class='attrname' title='{{resultName}}' data-result_name='{{resultName}}' data-result_code='{{resultCode}}' data-result_lenght='{{resultLength}}' data-result_type='{{resultType}}' data-spin='{{spin}}' data-checked='{{checked}}'>{{resultName}}</span><span class='spin-icon {{spinClass}}' title='固定列'></span><span class='check-icon {{checkClass}}' title='选择列'></span>";
                                return Bace.buildString(html,rowdata);
                            }
                        }],
                        width: '100%',
                        height: '100%',
                        heightDiff: 25, //高度误差
                        title: function() {
                            return '<span class="filter-span">' + '	<input id="filterInput" class="filter-text"  placeholder="输入指标关键字"/>' + '	<span class="filter-icon"></span>' + '</span>';
                        }(),
                        data: {Rows:rows},
                        alternatingRow: false,
                        selectRow: false,
                        usePager: false,
                        tree: {
                            columnName: 'attrClass',
                            isParent:$.noop
                        },
                        onClickRow: function(rowdata, rowid, rowobj, event) {
                            //暂时不用单击行事件,用dom事件比较方便
                            //Bace.stopBubble(event);
                        },
                        onAfterShowData: function() {
                            //指标搜索(绑定输入框回车到搜索按钮)
                            $(".filter-span .filter-icon").off("click");
                            $(".filter-span .filter-icon").click(function(){
                                var filterStr = $("#filterInput").val().trim();
                                var domList = $("#layout_attr_panel .l-grid-row");
                                domList.show();
                                //如果没有填就啥事不干
                                if(!filterStr) return;
                                //多关键字使用空格分割
                                var filterList = filterStr.split(" ");
                                //多关键字搜索,只要满足其中一个就展示
                                $.each(filterList,function(i,e){
                                    domList = domList.filter(function(){
                                        return !$(this).is(":contains('"+e+"')");
                                    });
                                });
                                domList.hide();

                            });
                            //绑定搜索到回车,输入后400毫秒自动搜索
                            $("#filterInput").off("keydown");
                            $("#filterInput").keydown(function(e){
                                if(e.keyCode == "13"){
                                    $(".filter-span .filter-icon").click();
                                }else{
                                    clearTimeout(searchTimeout);
                                    searchTimeout = setTimeout(function(){
                                        $(".filter-span .filter-icon").click();
                                    },400);
                                }
                            });
                            //美化滚动条
                            Bace.autoScroll($('#layout_attr_panel .l-grid-body2'));
                        }
                    });
                },
                /**
                 * 收集指标信息
                 * @param mode "save" 返回保存需要的信息,"colum"返回colum对象,"query"返回查询参数
                 */
                collect:function(mode){
                    var properties = _.map($("#layout_attr_panel .attrname"),function(e,i){
                        var $this = $(e);
                        var data = $this.data();
                        //把属性名字转成驼峰(html的属性都是小写的,但是后来来的数据是驼峰的,为了保持一致)
                        data = Bace.coverObj2Camel(data);
                        return data;
                    });

                    //console.log(properties);
                    switch (mode){
                        case "colum":
                            var columns = _.map(_.filter(properties,function(e,i){
                                return e.checked && !e.spin;
                            }),function(e,i){
                                return {field:e.resultCode,title:e.resultName,width:100};
                            });
                            var frozenColumns = _.map(_.filter(properties,function(e,i){
                                return e.checked && e.spin;
                            }),function(e,i){
                                return {field:e.resultCode,title:e.resultName,width:100};
                            });
                            //小于15列则启用全屏适配,否则开启滚动条(暂时弃用)
                            var fitColumns = (columns.length + frozenColumns.length) <= 15;
                            return {
                                columns:[columns],
                                frozenColumns:[frozenColumns],
                                fitColumns:false
                            };
                            break;
                        case "save":
                            //查询数据时用的参数
                            return properties;
                            break;
                        case "query":
                            //保存时的参数 收集选中的properties的resultCode,用逗号拼成字符串
                            return _.map(properties,function(e,i){
                                if(e.checked){
                                    return e.resultCode;
                                }
                            }).join(",");
                            break;
                        default :
                            break;
                    }

                },
                bindEvents:function () {
                    $("#layout_attr_panel").off("click");
                    $("#layout_attr_panel").on("click",".l-grid-row-cell-inner",function (event) {
                        var isChecked = Properties.control.isChecked(this);
                        var isSpin = Properties.control.isSpin(this);
                        //点一下选中,选中再点一下固定,再点一下取消固定和选中
                        if(!isChecked){
                            Properties.control.checkProperties(this);
                        }
                        else if(isChecked && !isSpin){
                            Properties.control.spinProperties(this);
                        }else{
                            Properties.control.unCheckProperties(this);
                            Properties.control.unSpinProperties(this);
                        }
                    });

                    //点击固定按钮,如果没有选中则选中并固定,如果已经固定,则取消固定
                    $("#layout_attr_panel").on("click",".spin-icon",function (event) {
                        var $node = $(this).parents(".l-grid-row-cell-inner")[0];
                        var isChecked = Properties.control.isChecked($node);
                        if(!isChecked){
                            Properties.control.checkProperties($node);
                            Properties.control.spinProperties($node);
                        }else{
                            Properties.control.toggleSpin($node);
                        }
                        event.stopPropagation();
                    });
                    //点击选择按钮,如果没有选中则选中,如果已经固定,则取消固定和选中
                    $("#layout_attr_panel").on("click",".check-icon",function (event) {
                        var $node = $(this).parents(".l-grid-row-cell-inner")[0];
                        var isSpin = Properties.control.isSpin($node);
                        if(isSpin){
                            Properties.control.unSpinProperties($node);
                            Properties.control.unCheckProperties($node);
                        }else{
                            Properties.control.toggleCheck($node);
                        }
                        event.stopPropagation();
                    });
                }
            },
            control:{
                toggleCheck:function(node){
                    if(Properties.control.isChecked(node)){
                        Properties.control.unCheckProperties(node);
                    }else{
                        Properties.control.checkProperties(node);
                    }
                },
                checkProperties:function (node) {
                    var checkNode = $(node).find(".check-icon");
                    var dataNode = $(node).find(".attrname");
                    dataNode.data("checked",true);
                    checkNode.addClass("checked");
                },
                unCheckProperties:function(node){
                    var checkNode = $(node).find(".check-icon");
                    var dataNode = $(node).find(".attrname");
                    dataNode.data("checked",false);
                    checkNode.removeClass("checked");
                },
                isChecked:function(node){
                    var checkNode = $(node).find(".check-icon");
                    return checkNode.hasClass("checked");
                },
                toggleSpin:function(node){
                    if(Properties.control.isSpin(node)){
                        Properties.control.unSpinProperties(node);
                    }else{
                        Properties.control.spinProperties(node);
                    }
                },
                spinProperties:function (node) {
                    var spinNode = $(node).find(".spin-icon");
                    var dataNode = $(node).find(".attrname");
                    dataNode.data("spin",true);
                    spinNode.addClass("spin");
                },
                unSpinProperties:function(node){
                    var spinNode = $(node).find(".spin-icon");
                    var dataNode = $(node).find(".attrname");
                    dataNode.data("spin",false);
                    spinNode.removeClass("spin")
                },
                isSpin:function(node){
                    var spinNode = $(node).find(".spin-icon");
                    return spinNode.hasClass("spin");
                }
            }
        };

        return Widgets.control;
    });