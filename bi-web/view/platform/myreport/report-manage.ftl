<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/myreport/css/report-manage.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/myreport/css/share.css${css_version}" />

<input type='hidden' value='${Session.UserSessBean.companyFlag}' id="companyFlag">
<div class="panel report-panel">
	<div class="top">
	  <div class="row">
	            <div class="col-xs-2 tags">
		            <span class="glyphicon glyphicon-tags tag theme-color"></span>
		            <span class="tagtxt"><@spring.message code="report.label.reportLabel"/></span>
	            </div>
	            <div class="col-xs-10 tag">
		            
					<span class="col-xs-1 more" >
					<a class="btn btn-link" href="#"><strong><@spring.message code="report.label.more"/></strong></a>
					</span>
				</div>
	           
	  </div><!--row-->
	  <hr/>
	  <div class="row butRow">
	         <div class="col-xs-7">
			      <div class="btn-group search-btn-group">
	    	   	    <button type="button" class="btn btn-default btn-sm" id="firstbutton" value="all">&nbsp;&nbsp;<@spring.message code="home.setting.button.all"/>&nbsp;&nbsp;</button>
	    	   	    <button type="button" class="btn btn-default btn-sm" value="date"><@spring.message code="home.setting.button.new"/></button>
	    	   	    <button type="button" class="btn btn-default btn-sm" value="new"><@spring.message code="home.setting.button.visit"/></button>
	    	   	    <button type="button" class="btn btn-default btn-sm" value="visit"><@spring.message code="home.setting.button.most"/></button>
	    	   	    <button type="button" class="btn btn-default btn-sm" id="lastbutton" value="foucs"><@spring.message code="home.setting.button.focus"/></button>
	    	      </div>
	    	 </div>
	    	 
	    	 <div class="col-xs-2 tool">
	    	        <button type="button" class="btn btn-primary btn-sm"><@spring.message code="report.button.reportMake"/></button>
	    	 </div>
	    	 <div class="col-xs-3">
	    	    <div class="input-group input-group-sm searchDiv">
				      <input type="text" class="form-control input-sm" id="searchInput">
				      <span class="input-group-btn input-group-sm">
				        <button class="btn btn-default btn-sm theme-background theme-border-color" type="button" id="search"><@spring.message code="home.setting.button.search"/></button>
				      </span>
	    	    </div>
	    	 </div>  
	  </div>
	</div>
</div>

<div class="content" >
    
	<div class="row" id="content">
	  
	</div>
	<div class="row page">
	     <div id="page" class="m-pagination"></div>
	</div>
</div>
<div id="nav" class="tree-nav">
	<div class="nav-content">
		<div id="tree" class="ztree">
		</div>
	</div>
	<div class="nav-info">
		<span class="nav-arrow fa fa-angle-double-right" status="up"></span>
		<br/>导<br/>航<br/>菜<br/>单
	</div>
</div>
  <!-- 返回顶部-->
  <div class="actGotop"><a href="javascript:;" title="返回顶部"></a></div>
<#include "view/platform/frame/bace/bottom.ftl">

<script>
var publishType = '${publishType}';
var webpath = '${webpath}';
var sessionUserId='${Session.UserSessBean.userID}';
var jobIds='';
var navyMenuShow ='${isNavyShow}';
if(navyMenuShow!="0"){
    $("#nav").show();
}else{
    $("#nav").hide();
}

<#list Session.UserSessBean.jobIdArray as jobId>
	jobIds +='${jobId}';
</#list>
_require(
{
	paths : {
	    'mymessage':'${resPath}/resources/platform/myhome/js/message',
		'reportManage':'${resPath}/resources/platform/myreport/js/report-manage',
		'share':'${resPath}/resources/platform/myreport/js/share'
	}
},
'reportManage'
);

</script>



