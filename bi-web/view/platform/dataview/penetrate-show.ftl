<!--
   面板穿透展示页
-->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>欢迎使用数据可视化</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta http-equiv="cache-control" content="public">
    <meta http-equiv="pragma" content="Pragma">
    <script>
        var webpath = '${webpath}';
        var resPath = '${resPath}';
        var js_version = '${js_version}';
        var funcId= '${funcId}';
        var _DCVBNMMMM = '${dataId}';
        var _RSDFGHJJKK;
        //穿透参数goal
        var goal;
        var report_config={
            copyFlag :'${copyFlag}',
            waterFlag : '${waterFlag}',
            mobileNum : '${mobileNum}',
            smsCaptcha : '${smsCaptcha}'
        }

        var previewKey = '${previewKey}'
        <#if reportId??>
        _RSDFGHJJKK = '${reportId}';
        </#if>
        window._T = new function() {
            return {
                array: [],
                set: function(id) {
                    this.array.push({
                        time: new Date().getTime(),
                        id: id
                    });
                },
                get: function(id, callback) {
                    var _array = this.array,
                            difTime = '';
                    for (var i = 0, n = _array.length; i < n; i++) {
                        if (_array[i] && _array[i].id == id) {
                            difTime = (new Date().getTime() - _array[i].time) / 1000;
                            console.log("响应时间：" + difTime + " 秒");
                            delete _array[i];
                        }
                    }
                    return callback ? callback(difTime) : '';
                }
            }
        };
        _T.set('x');
    </script>
    <link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/bace/bace.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/layout/jquery.layout.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/ligerBaseGrid.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ui/jquery.ui.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/bace/ui/fonts/awesome/css/font-awesome.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/bace/ui/fonts/awesome/css/font-awesome-animation.min.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/bace/ui/fonts/sa/iconfont.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/dialog/skins/blue2.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/chosen/chosen.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/validation/validationEngine.jquery.css"/>

    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.layout.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.header.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.attr.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.filter.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.property.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.widgets.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.opera.css"/>
<#--
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.share.css"/>
-->
    <link rel="stylesheet" type="text/css" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.main.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.penetrate.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/bace/ui.switchbutton.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/colpick/jquery.minicolors.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/date/bootstrap-datetimepicker.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ztree/zTreeStyle/zTreeStyle.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ztree/jquery.ztree.event.css"/>

    <!--之后会整合主题-->
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/theme/gray.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/theme/red.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/theme/blue.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/datagrid/datagrid.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.pp.css" />
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/umeditor/themes/default/_css/umeditor.css">

    <style>
    </style>
</head>

<body class="invisible dataview">
<div id="headName">目标仪表板
    <span style="">X</span>
</div>
<ul id="themeHead" >
  <#--  <li class="chooseTheme">测试1</li>
    <li>测试1</li>
    <li>测试1</li>-->
</ul>
<div class="ui-layout-center" id="layout_body_panel">
    <div id="layout_body_title_panel" >
        <div class="layout_title_panel full" style='padding-left:22px'>
            <div style="position: absolute;">
                <span id="filterPanelTag" class="hide">筛选条件</span>
                <span id="containerTag">图形区域</span>
            </div>
            <div id="closeFilter" class="closeFilter hide">
                <div class='fa fa-caret-up cursor-pointer optIcon'></div>
            </div>
        </div>
    </div>
    <div id="layout_body_content_panel">
        <div id="filterPanel">
            <table>
                <tr>
                    <td class="attr">
                        <div class="filter-panel">
                        </div>
                    </td>
                    <td class="search"><i class="fa fa-search"></i></td>
                </tr>
            </table>
        </div>
        <div id="centerPanel">
            <div id="handlePanel">
                <div id="operaPanel">
                    <span>操作区 </span>
                    <div class='operaButtonPanel'>
                    <#if openEmailFlag==1>
                        <div id="Email" class='operaDownBotton'>
                            <div>邮件推送</div>
                        </div>
                    </#if>
                        <div id="download" class='operaDownBotton'>
                            <div>下载</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="tableChartPanel">
            </div>
        </div>
    </div>
</div>
<!-- 返回顶部-->
<div class="actGotop"><a href="javascript:;" title="返回顶部"></a></div>


<#--<script src="${resPath}/resources/platform/dataview/data/data.js" ></script>-->
<script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.min.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.json.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/ui/jquery.ui.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/ui/jquery.ui.touch-punch.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.tmpl.min.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/html2Pic/html2canvas.js" type="text/javascript" charset="utf-8"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/ztree/jquery.ztree.event.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/spin/spin.js" type="text/javascript" charset="utf-8"></script>
<script src="${resPath}/resources/platform/dataview/js/bace/require.js"></script>
<script src="${resPath}/resources/platform/dataview/js/bace/config.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/datagrid/datagrid.js"></script>

<script src="${resPath}/resources/platform/dataview/js/jquery/umeditor/umeditor.config.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/umeditor/_src/core.js"></script>
<script type="text/javascript">
    var reportUrl = this.location.href;
    require(['view/penetrateShow'], function(main) {
        main.init();
    });
</script>
</body>

</html>