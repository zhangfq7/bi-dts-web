<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/company/css/company-approve.css${css_version}" />
<!--start-->
<div class="panel">
	<span class="f16"><@spring.message code="company.approve.label.title"/></span>
</div>
<div class="panel">
	<!-- Nav tabs -->
	<ul class="nav nav-tabs">
		<li class="active f16"><a href="#create" aria-controls="create" role="tab" data-toggle="tab"><@spring.message code="company.approve.label.createCompany"/></a></li>
	  <#if companyInfo.companyId == null>
		<li class="f16"><a href="#join" aria-controls="join" role="tab" data-toggle="tab"><@spring.message code="company.approve.label.joinCompany"/></a></li>
	  </#if>
	</ul>
	
	<div class="tab-content">
		<ul id="create" role="tabpanel" class="tab-pane active validationEngineContainer">
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="company.approve.label.companyName"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="companyName" value="${companyInfo.companyName}" placeholder='<@spring.message code="company.approve.placeholder.companyName"/>' class="form-control validate[required,len[1,120]]" data-errormessage-value-missing='<@spring.message code="company.approve.msg.companyName"/>'/>
				</div>
			</li>
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="company.approve.label.companyType"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="companyType" value="${companyInfo.companyTypeName}" truevalue="${companyInfo.companyType}" placeholder='<@spring.message code="company.approve.placeholder.companyType"/>' class="form-control validate[required]" readOnly data-errormessage-value-missing='<@spring.message code="company.approve.msg.companyType"/>'/>
				</div>
			</li>
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="company.approve.label.companyDesc"/></span>
				</div>
				<div class="input-class">
					<textarea id='companyDesc' class="form-control validate[len[1,400]]" rows="5" data-errormessage-value-missing='<@spring.message code="company.approve.msg.companyDesc"/>' >${companyInfo.companyRemark}</textarea>
				</div>
			</li>
			<HR/>
			<li class="form-group form-group-sm">
				<div class="label-class" style="width:100%;text-align: center;">
					<button id="createCompanyButton" type="button" class="btn btn-info"><@spring.message code="company.approve.button.saveSet"/></button>
				</div>
			</li>
		</ul>
		
		<ul id="join" role="tabpanel" class="tab-pane validationEngineContainer">
		  <#if companyInfo.companyId == null>
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="company.approve.label.companyId"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="companyId" placeholder='<@spring.message code="company.approve.placeholder.companyId"/>' class="form-control validate[required]" data-errormessage-value-missing='<@spring.message code="company.approve.msg.companyId"/>'/>
				</div>
				<div class="tip-class"></div>
			</li>
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="company.approve.label.authMsg"/></span>
				</div>
				<div class="input-class">
					<textarea id='authMsg' class="form-control validate[required,len[1,900]]" placeholder='<@spring.message code="company.approve.placeholder.authMsg"/>' rows="5" data-errormessage-value-missing='<@spring.message code="company.approve.msg.authMsg"/>'></textarea>
				</div>
			</li>
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f12 red"><@spring.message code="company.approve.label.explain"/></span>
				</div>
				<div class="text-class">
					<span class="f12 red"><@spring.message code="company.approve.label.explainContent"/></span>
				</div>
			</li>
			<HR/>
			<li class="form-group form-group-sm">
				<div class="label-class" style="width:100%;text-align: center;">
					<button id="joinCompanyButton" type="button" class="btn btn-info"><@spring.message code="company.approve.button.sendApplication"/></button>
				</div>
			</li>
		  </#if>
		</ul>
	</div>

</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
{
	paths : {
		'message': '${resPath}/resources/platform/sysmanage/company/js/message',
		'company/approve':'${resPath}/resources/platform/sysmanage/company/js/company-approve'
	}
},
'company/approve',function(approve){
	approve.init();
}
);
</script>