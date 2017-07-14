<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/company/css/company-info.css${css_version}" />

<div class="panel">
	<span class="f16">我的企业&nbsp;&nbsp;/&nbsp;&nbsp;基本信息</span>
</div>

<div class="panel">
	<ul id="savePanel" role="tabpanel" class="tab-pane active validationEngineContainer">
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14"><@spring.message code="company.approve.label.companyNum"/></span>
			</div>
			<div class="input-class">
				<input type="text" id="companyId" readonly value="${companyInfo.companyId}" class="form-control" />
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14"><@spring.message code="company.approve.label.companyName"/></span>
			</div>
			<div class="input-class">
				<input type="text" id="companyName" value="${companyInfo.companyName}" placeholder='<@spring.message code="company.approve.placeholder.companyName"/>' class="form-control validate[required,len[1,110]]]]" data-errormessage-value-missing='<@spring.message code="company.approve.msg.companyName"/>'/>
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
				<textarea id='companyDesc' class="form-control validate[maxSize[400]]" rows="5" data-errormessage-value-missing='<@spring.message code="company.approve.msg.companyDesc"/>' >${companyInfo.companyRemark}</textarea>
			</div>
		</li>
		<HR/>
		<li class="form-group form-group-sm">
			<div class="label-class" style="width:100%;text-align: center;">
				<button id="saveCompanyButton" type="button" class="btn btn-info"><@spring.message code="company.approve.button.saveSet"/></button>
			</div>
		</li>
	</ul>

</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
{
	paths : {
		'company/info':'${resPath}/resources/platform/sysmanage/company/js/company-info',
		'company/message': '${resPath}/resources/platform/sysmanage/company/js/message'
	}
},
'company/info',function(info){
	info.init();
}
);
</script>
