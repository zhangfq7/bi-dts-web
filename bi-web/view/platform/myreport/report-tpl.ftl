<#include "view/platform/frame/bace/top.ftl">   
<link rel="stylesheet" href="${resPath}/resources/platform/myreport/css/report-tpl.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/user-select.css${css_version}" />

<input type='hidden' value='${Session.UserSessBean.companyFlag}' id="companyFlag">
<!--top-->
<div class="panel tpl-top">
	<div class="row">
		<div class="col-xs-3 tpl-title">
			<span class="tpl-ico tpl-ico-show"><i class="fa fa-clone"></i></span>
			<span class="title-span"><@spring.message code="report.tpl.template"/></span>
		</div>
		<hr/>
	</div>
    <!--search-->
    <div class="row tpl-select">
    	<div class="col-xs-9">
			<div class="btn-group" id="searchButton">
    	   		<button type="button" id="0" class="btn btn-default btn-sm clicked-button theme-background">&nbsp;&nbsp;<@spring.message code="report.tpl.searchAll"/>&nbsp;&nbsp;</button>
    	   	    <button type="button" id="1" class="btn btn-default btn-sm normal-button">&nbsp;&nbsp;<@spring.message code="report.tpl.searchSingle"/>&nbsp;&nbsp;</button>
    	   	    <button type="button" id="2" class="btn btn-default btn-sm normal-button">&nbsp;&nbsp;<@spring.message code="report.tpl.searchMuch"/>&nbsp;&nbsp;</button>
    	   	    <button type="button" id="3" class="btn btn-default btn-sm normal-button last-button">&nbsp;&nbsp;<@spring.message code="report.tpl.searchLatest"/>&nbsp;&nbsp;</button>
    	     </div>
    	 </div>
    	 <div class="col-xs-3">
    	 	<div class="input-group input-group-sm search-div">
				<input type="text" class="form-control input-sm" id="searchText"/>
			    <span class="input-group-btn input-group-sm">
			    	<button class="btn btn-default btn-sm theme-background theme-border-color" type="button" id="search"><@spring.message code="report.tpl.search"/></button>
				</span>
    	 	</div>
    	 </div>
    </div>
</div>

<!--data-->
<div class="tpl-list">
	<div class="row" id="tplList">
	</div>
	<div class="row page">
	     <div id="page" class="m-pagination"></div>
	</div>
</div>

<!--返回订部-->
<div class="actGotop"><a href="javascript:;" title="<@spring.message code="report.tpl.ReturnTop"/>"></a></div>

<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/myhome/js/message.js"></script>
<script>
_require(
{
	paths : {
		'platform/myreport/tpl/report-tpl':'${resPath}/resources/platform/myreport/js/report-tpl',
		'userSelect':'${resPath}/resources/platform/resmanage/data/js/user-select'
	}
},
'platform/myreport/tpl/report-tpl',function(){}
);
</script>