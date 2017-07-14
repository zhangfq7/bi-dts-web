<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/myreport/css/report-tpl-view.css${css_version}" />   
<div class="panel tpl-top">
	<div class="row">
		<div class="col-xs-3 tpl-title">
			<span class="tpl-ico tpl-ico-show"><i class="fa fa-clone"></i></span>
			<span class="title-span"><@spring.message code="report.tpl.template.view"/></span>
		</div>
	</div>
</div>
<div class="tpl-view">
	<img src=${thumbImg} />
</div>
<#include "view/platform/frame/bace/bottom.ftl">
