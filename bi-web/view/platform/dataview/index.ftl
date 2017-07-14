<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>欢迎使用数据可视化</title>
		<meta name="renderer" content="webkit">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta http-equiv="cache-control" content="public">
		<meta http-equiv="pragma" content="Pragma">
				<script>
				//discovery为1的时候，代表是探索页面
				var discovery='0';
				var chartIdInDiscovery='${chartId}';
				if(chartIdInDiscovery != ''){
					discovery='1';
				}
				//tplUrlChange为1的时候，代表是模板页面
				var tplUrlChange="0";
				var tplIdInUrlChange='${tplId}';
				if(tplIdInUrlChange!=""){
                    tplUrlChange="1";
				}

				//水印全局开关(0:关闭,1:打开)
				var waterFlag = '${waterFlag}';

				var emotionUrl='${resPath}';
				//数据可视化参数,在main.js中会使用到
				var webpath = '${webpath}';
				var resPath = '${resPath}';
				var js_version = '${js_version}';
				var funcId= '${funcId}';
				var _DCVBNMMMM = '${dataId}';
				var _ELKJHGFFF = '${dataName}';
				var _ASWDFAFSS = '${dataType}';
				var _MFUJNNGJLL = '${tplId}';
				var _RSDFGHJJKK;
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
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/jcrop/jquery.Jcrop.css"/>

		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.layout.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.header.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.attr.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.filter.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.property.css"/>
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.widgets.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.opera.css"/>
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.main.css"/>

		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/bace/ui.switchbutton.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/colpick/jquery.minicolors.css"/>
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/date/bootstrap-datetimepicker.css"/>
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ztree/zTreeStyle/zTreeStyle.css"/>
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ztree/jquery.ztree.event.css"/>

		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/save.report.css"/>
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/save.level.css"/>
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/choose.data.css" />
		<!--时间格式化-->
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/date.format.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/calc.panel.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/personalized-choose.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/personal-attr.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/condition-set.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/data.info.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/tpl.css" />

		<!--之后会整合主题-->
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/theme/gray.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/theme/red.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ligerui/css/theme/blue.css" />

		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/datagrid/datagrid.css"/>
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/view/data.pp.css" />
		<!--全局筛选-->
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/set.global.filter.css" />

        <link rel="stylesheet" type="text/css" href="${resPath}/bace/js/webuploader/css/webuploader.css">
        <link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/umeditor/themes/default/_css/umeditor.css">

	</head>
	</head>

	<body class="invisible dataview">
		<div class="ui-layout-north" id="layout_header_panel">
			<div id="tabs" class="tabs" data-toggle="open">
				<ul>
                     <li><a shref="#tabs_data">数据</a></li>
					<li><a shref="#tabs_widgets" style="padding:0.5em 2em;font-weight:bold;">图表</a></li>
                    <li><a shref="#tabs_tools" style="padding:0.5em 2em;font-weight:bold;">工具</a></li>
					<#--<li><a shref="#tabs_start">开始</a></li>-->
                     <li><a shref="#tabs_template" style="padding:0.5em 2em;font-weight:bold;">模板</a></li>
                     <li><a shref="#tabs_preview" style="padding:0.5em 2em;font-weight:bold;">预览</a></li>
                     <li><a shref="#tabs_save" style="padding:0.5em 2em;font-weight:bold;">保存</a></li>
                 </ul>
                <div id="tabs_data"></div>
				<div id="tabs_widgets"></div>
                <div id="tabs_tools"></div>
                <#--<div id="tabs_start"></div>-->
                <div id="tabs_template"></div>
                <div id="tabs_preview"></div>
                <div id="tabs_save"></div>
			</div>
		</div>

		<div class="ui-layout-center" id="layout_body_panel">
			<div id="layout_body_title_panel">
				<div class="closeAttr hide">
					<div class='fa fa-caret-left cursor-pointer optIcon'></div>
				</div>
				<div class="fullScreen">
					<div class='fa fa-caret-up cursor-pointer optIcon'></div>
				</div>
				<div class="layout_title_panel full">
					<div style="position: absolute;">
						<span id="filterPanelTag" class="hide">筛选条件</span>
						<span id="containerTag">图形区域</span>
					</div>
					<div id="setGlobalFilter" class="hide">设置</div>
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
							<td class="search "><i class="fa fa-search"></i></td>
						</tr>
					</table>
				</div>
				<div id="centerPanel">
					<div id="handlePanel">
						<div id="operaPanel">
							<span>操作区
								<i class="fa fa-cog faa-spin animated-hover setting cursor-pointer"></i>
							</span>
							<div class='operaButtonPanel'>

							<#if openEmailFlag==1>
								<div id="Email" class="operaDownBotton">
									<div>邮件推送</div>
								</div>
							</#if>

								<div class='operaDownBotton'>
									<div>下载</div>
								</div>
							</div>
						</div>
					</div>
					<div id="tableChartPanel">
						<div id="gridBg" class="grid-bg"></div>
					</div>
				</div>
				<div id="propertyPanel">
					<div class="layout_title_panel">
						<div style="position: absolute;">属性</div>
						<div class="fixedProperty propertyButton" style="display:none">
							固定
						</div>
						<div class="applyProperty propertyButton">
							应用
						</div>
						<div class="closeProperty propertyButton">
							关闭
						</div>
					</div>
					<div id="propertyTabs" style="">
						<ul>
							<li><a shref="#data-property">图 形 数 据</a></li>
							<li class='gary'><a shref="#chart-property">图 形 设 计</a></li>
						</ul>
						<div id="data-property" class="dimAttrPanel"></div>
						<div id="chart-property" style="width: 100%;"><div class="propPanel"></div></div>
					</div>
				</div>
			</div>
		</div>

		<div class="ui-layout-west" id="layout_attr_panel">
			<div class="layout_title_panel">
			   <div style="position: absolute;">指标库</div>
			</div>
			<div id="layout_attr_treeGrid_panel"></div>
			<div class="attrButtonbar">
				<div class="calcPanel calcButton">衍生指标</div><div class="dateFormatPanel calcButton" id="derive-dim">衍生维度</div>
			</div>
		</div>
		<iframe id="goalPanel" name="goalPanel"  frameborder="no" border="0"></iframe>
        <iframe id="penetrateShow" name="penetrateShow" frameborder="no" border="0"></iframe>
		<script src="${resPath}/resources/platform/dataview/data/data.js" ></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.min.js"></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.json.js"></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/ui/jquery.ui.js"></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/ui/jquery.ui.touch-punch.js"></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.tmpl.min.js"></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/html2Pic/html2canvas.js" type="text/javascript" charset="utf-8"></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/ztree/jquery.ztree.event.js"></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/ztree/jquery.ztree.all-3.5.js"></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/spin/spin.js" type="text/javascript" charset="utf-8"></script>
		<script src="${resPath}/resources/platform/dataview/js/bace/require.js"></script>
		<script src="${resPath}/resources/platform/dataview/js/bace/config.js"></script>
		<script src="${resPath}/resources/platform/dataview/js/jquery/datagrid/datagrid.js"></script>

        <script src="${resPath}/resources/platform/dataview/js/jquery/umeditor/umeditor.config.js"></script>
        <script src="${resPath}/resources/platform/dataview/js/jquery/umeditor/_src/core.js"></script>


		<script type="text/javascript">
            require.config({
                paths: {
                    'upload':'${resPath}/bace/js/webuploader/js/webuploader'
				}
			});
			require(['view/main'], function(main) {
				main.init();
			});
		</script>
	</body>

</html>