<#include "view/platform/frame/bace/top.ftl">

		<link rel="stylesheet" href="${resPath}/resources/platform/myreport/css/report_expiredate.css" />
		<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/js/jquery/ui/jquery.ui.css" />

<div class="panel">
	<span class="f16"><@spring.message code="company.detp.lebel.topTlitle"/>&nbsp;&nbsp;/&nbsp;&nbsp;<@spring.message code="report.reportlist.label.expiredatemanage"/></span>
</div>
<div class="panel">
	<ul id="searchPanel" class="tab-pane">
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14"><@spring.message code="report.reportlist.label.reportName" /></span>
			</div>
			<div class="search-class">
				<input type="text" class="form-control" id="queryReportName" />
			</div>
			
			<div class="label-class">
			<input type="hidden" id="datepickerTest" />
			</div>
			<div class="search-class">
				<button id="searchButton" type="button" class="btn btn-info btn-sm button-class"><@spring.message code="report.reportlist.button.search"/></button>
			</div>
		</li>
	</ul>
	<ul id="reportListPanel" class="report-list">
		<li id="reportList">
			<table id="reportListGrid" style="width:100%"></table>
			<div id="reportListGridPager"></div>
		</li>
	</ul>
</div>


<#include "view/platform/frame/bace/bottom.ftl">
<script type="text/ecmascript" src="${resPath}/bace/js/jqGrid/js/i18n/grid.locale-cn.js"></script>
<script src="${resPath}/resources/platform/myhome/js/message.js"></script>
<script>
 require.config({
                paths: {
                    'data/reportExpireDate': '${resPath}/resources/platform/myreport/js/report-expiredate'
                    
				}
			});
			require(['data/reportExpireDate'], function(reportExpireDate) {
				reportExpireDate.init();
			}
		);
		
</script>