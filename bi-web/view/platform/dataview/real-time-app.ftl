<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>欢迎使用数据可视化</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta http-equiv="cache-control" content="public">
    <meta http-equiv="pragma" content="Pragma">
    <script>

        //数据可视化参数,在main.js中会使用到
        var webpath = '${webpath}';
        var resPath = '${resPath}';
        var js_version = '${js_version}';
        var funcId = '${funcId}';
        var _RSDFGHJJKK;
        <#if reportId??>
        _RSDFGHJJKK = '${reportId}';
        </#if>
        var appType = '${appType}';  //0:普通应用 1:实时应用
        var isView = '${isView}';   //0:修改 1:查看
        window._T = new function () {
            return {
                array: [],
                set: function (id) {
                    this.array.push({
                        time: new Date().getTime(),
                        id: id
                    });
                },
                get: function (id, callback) {
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
    </script>
    <link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/bace/bace.css"/>
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/layout/jquery.layout.css"/>
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/ligerBaseGrid.css"/>

    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/jqGrid/css/ui.jqgrid-bootstrap.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/bace/ui/fonts/awesome/css/font-awesome.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/bace/ui/fonts/awesome/css/font-awesome-animation.min.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/bace/ui/fonts/sa/iconfont.css"/>
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/dialog/skins/blue2.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ui/jquery.ui.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/chosen/chosen.css"/>
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/validation/validationEngine.jquery.css"/>
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/jcrop/jquery.Jcrop.css"/>

    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.layout.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.header.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.attr.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.filter.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.property.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.widgets.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.opera.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.main.css"/>

    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/bace/ui.switchbutton.css"/>
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/colpick/jquery.minicolors.css"/>
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/date/bootstrap-datetimepicker.css"/>
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/ztree/zTreeStyle/zTreeStyle.css"/>
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/ztree/jquery.ztree.event.css"/>

    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/save.report.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/save.level.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/choose.data.css"/>
    <!--时间格式化-->
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/date.format.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/calc.panel.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/data.info.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/tpl.css"/>


    <!--之后会整合主题-->
<#--		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/theme/gray.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/theme/red.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/theme/blue.css" />-->

    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/js/jquery/datagrid/datagrid.css"/>
    <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.pp.css"/>
    <!--全局筛选-->
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/css/component/set.global.filter.css"/>
    <!-- 实时APP页面自定义样式 -->
    <link rel="stylesheet" type="text/css"
          href="${resPath}/resources/platform/dataview/css/view/data.realtimeapp.css"/>

</head>


<body class="invisible dataview">
<div class="ui-layout-north" id="layout_header_panel">
    <div id="tabs" class="tabs" data-toggle="open">
        <ul>
            <li><a shref="#tabs_data">实时数据</a></li>
        </ul>
        <div id="tabs_data">
            <div class="group" style="margin-top: 13px;">
                <ul>
                    <li id="existData">
                        <div class="bi-icon icon-data-existData"></div>
                        <div>已有数据</div>
                    </li>
                </ul>
            </div>
            <div class="group">
                <ul>
                    <li id="saveReport">
                        <div class="bi-icon icon-start-saveReport"></div>
                        <div>保存</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

<div class="ui-layout-center" id="layout_body_panel">
    <div class="ui-layout-north" id="filterPanel">
        <div class="layout_title_panel">
            <div style="position: absolute;">
                <span id="filterPanelTag">筛选条件</span>
            </div>
        </div>
        <table>
            <tbody>
            <tr>
                <td class="attr">
                    <div class="filter-panel">

                    </div>
                </td>
                <td class="search"><i class="fa fa-search"></i></td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="ui-layout-center" id="layout_table_panel" style="overflow: hidden">
        <div id="table_container" style="height: 100%;width: 100%;border-color: #dddddd">

        </div>
    </div>
</div>
<div class="ui-layout-west" id="layout_property_panel">
    <div id="propertyPanel" data-toggle="open">
        <div class="layout_title_panel">
            <div style="position: absolute;">指标</div>
            <div class="exec_btn j_exec">应用</div>
        </div>
    </div>
    <div id="layout_attr_panel" style="height: calc(100% - 25px);border-top: none;overflow-x: hidden;">

    </div>
</div>
<#--<script src="${resPath}/resources/platform/dataview/data/data.js" ></script>-->
<script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.min.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.json.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/ui/jquery.ui.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/ui/jquery.ui.touch-punch.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.tmpl.min.js"></script>
<#--<script src="${resPath}/resources/platform/dataview/js/jquery/html2Pic/html2canvas.js" type="text/javascript" charset="utf-8"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/ztree/jquery.ztree.event.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/ztree/jquery.ztree.all-3.5.js"></script>-->
<script src="${resPath}/resources/platform/dataview/js/jquery/spin/spin.js" type="text/javascript"
        charset="utf-8"></script>
<script src="${resPath}/resources/platform/dataview/js/bace/require.js"></script>
<script src="${resPath}/resources/platform/dataview/js/bace/config.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/datagrid/datagrid.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/jqGrid/js/jquery.jqGrid.js"></script>
<script type="text/javascript">
    require(['view/realtimeapp/realtimeapp'], function (main) {
        main.init();
    });
</script>
</body>

</html>