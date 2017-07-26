/**
 * 文件描述:
 * 数据可视化查看入口
 * 功能描述：报表查看页面
 */
define([
        'bace', 'view/layout', 'view/pc/contanier','view/pc/serach', 'view/box','view/pc/share',
        'layout', 'poshytip', 'grid', 'date', 'switchButton', 'dialog', 'colpick', 'chosen','ztree','placeholder','dotdotdot','validation'
    ],
    function(Bace, Layout,Contanier,Serach,Box,Share) {
    //穿透参数赋值后清除sessionStorage.goal
        goal=JSON.parse(sessionStorage.goal);
        sessionStorage.removeItem("goal");
        var DataView = {};
        DataView.control = {
            init: function() {
                // alert(JSON.stringify(Bace.getBV()));
                //主题切换
                themeNav(JSON.parse(goal.goalChoose));
                function themeNav(themeData){
                    for(var i=0;i<themeData.length;i++){
                         $("#themeHead").append('<li code='+themeData[i].reportId+'>'+themeData[i].reportName+'</li>');
                    }
                    $("#themeHead li:first").addClass("chooseTheme");

                }
                $("#themeHead").on("click","li",function(){
                    if(!$(this).hasClass("chooseTheme")){
                        $(this).addClass("chooseTheme").siblings().removeClass("chooseTheme");
                        var reportId = $(".chooseTheme").attr("code");
                        $("#tableChartPanel").empty();
                        $("#layout_body_title_panel").empty().append('<div class="layout_title_panel full" style="padding-left:22px">'+
                            '<div style="position: absolute;">'+
                            '<span id="filterPanelTag" class="hide">筛选条件</span>'+
                            '<span id="containerTag">图形区域</span>'+
                            '</div>'+
                            '<div id="closeFilter" class="closeFilter hide">'+
                            '<div class="fa fa-caret-up cursor-pointer optIcon"></div> </div> </div>');

                        $("#filterPanel").empty().css({"display":"none"}).append('<table> <tr><td class="attr"> <div class="filter-panel"></div></td><td class="search"><i class="fa fa-search"></i></td> </tr>  </table>');
                        $("#centerPanel").css({"top":"0px"});
                        DataView.control.ajaxCharts(reportId);
                        setTimeout(function(){ console.log($("#centerPanel").css("top")!="0px");
                        if($("#centerPanel").css("top")!="0px"){
                            $("#filterPanel").show();
                        }},300);

                    }

                });
                //挂载可视化编码
                var reportId = $(".chooseTheme").attr("code");
                if(previewKey){
                    var config = $.evalJSON(window.sessionStorage.getItem(previewKey));
                    if(!config){
                        alert("链接已失效");
                        return;
                    }
                    Box.main.dataId = config.dataId;
                    Box.main.reportName = config.reportName;
                    Box.main.reportId = config.reportId;
                    Box.main.allowComment = 0;
                    //装载所有面板
                    Layout.init();
                    jQuery("#layout_body_title_panel").hide();
                    //初始化图表区域
                    Contanier.init();
                    //根据插入的可视化编码，渲染容器
                    var reportConfig = $.evalJSON(config.resportConfig);
                    Contanier.start('render',reportConfig);
                    return;
                }

                if(reportId){
                    DataView.control.ajaxCharts(reportId);

                }

            },
            ajaxCharts : function(reportId){
                $.ajax({
                    type: "POST",
                    url: Bace.handleUrlParam('/platform/dataview/queryViewInfo'),
                    dataType: 'json',
                    async:false,
                    data:{
                        reportId:reportId
                    },
                    success: function(config) {
                        //判断数据源是否删除，0删除，1未删除
                        if(config.dataDeletaFlag==0){
                            alert("数据源已删除！");
                        }
                        Box.main.dataId = config.dataId;
                        Box.main.reportName = config.reportName;
                        Box.main.reportId = config.reportId;
                        Box.main.allowComment = config.allowComment;

                        if($.evalJSON(config.urlMenuInfo).length>0){
                            Box.main.urlMenuInfo=$.evalJSON(config.urlMenuInfo);//gaoya
                        }
                        //判断是否有filter,在布局之前,修改布局配置,为分享面板留位置
                        var reportConfig = $.evalJSON(config.resportConfig);
                        var filters = reportConfig.filters;
                        var hasFilter = (filters && filters.length > 0 );
                        Layout.setShareLayout(hasFilter);
                        //装载所有面板
                        Layout.init();
                        jQuery("#layout_body_title_panel").hide();
                        //初始化图表区域
                        Contanier.init();
                        //根据插入的可视化编码，渲染容器
                        Contanier.start('render',reportConfig);

                        // 报表分享,初始化分享工具栏
                         // Share.init(reportConfig);
                        //绑定下载和推送功能
                         // Contanier.bindEmailAndDownload();
                        $("#shareAndDownload").remove();
                        $("#commentIframe").css({"visibility":"hidden"});
                        $("#layout_body_panel").css({"position":"relative" });
                        $("#tableChartPanel").css({"top":"30px"});
                        $("#layout_body_content_panel").css({"margin-top":"28px"});
                        $("#headName span").click(function(){
                            window.parent.document.getElementById("penetrateShow").style.display="none";
                        });
                        //隐藏工具栏--小面板和探索
                        $(".tools").hide();
                    },
                    error: function() {
                        alert(JSON.stringify(arguments));
                        alert('没有查询到数据源，自动跳转到可视化新建页面');
                    }
                });
            }

        };
        DataView.module = {};
        DataView.view = {};

        return DataView.control;
    });