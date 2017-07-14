<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/company/css/company-dept.css" />

<div class="panel">
	<span class="f16"><@spring.message code="company.detp.lebel.topTlitle"/>&nbsp;&nbsp;/&nbsp;&nbsp;<@spring.message code="company.dept.label.title"/></span>
</div>
<div class="panel">
	<ul id="searchPanel" class="tab-pane">
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14"><@spring.message code="company.dept.label.deptName" /></span>
			</div>
			<div class="search-class">
				<input type="text" class="form-control" id="queryDepName" />
			</div>
			<div class="label-class">
				<span class="f14"><@spring.message code="company.dept.label.deptDesc" /></span>
			</div>
			<div class="search-class">
				<input type="text" class="form-control" id="queryDepDesc" />
			</div>
			<div class="label-class"></div>
			<div class="search-class">
				<button id="searchButton" type="button" class="btn btn-info btn-sm button-class"><@spring.message code="company.dept.button.search"/></button>
			</div>
		</li>
	</ul>
	<HR/>
	<ul id="operPanel" class="oper-pane">
		<li class="form-group form-group-sm">
			<div>
				<button id="addDepButton" type="button" class="btn btn-info btn-sm button-class">
				<@spring.message code="company.dept.button.add" />
				</button>
			</div>
			<div>
				<button id="modifyDepButton" type="button" class="btn btn-info btn-sm button-class">
				<@spring.message code="company.dept.button.edit" />
				</button>
			</div>
			<div>
				<button id="delDepButton" type="button" class="btn btn-danger btn-sm button-class">
				<@spring.message code="company.dept.button.delete" />
				</button>
			</div>
		</li>
	</ul>

	<ul id="depListPanel" class="dep-list">
		<li id="deptList">
			<table id="depTree" style="width:100%"></table>
		</li>
	</ul>
</div>

<div style="display:none;">
	<ul id="depInfoPanel" class="dep-info-panel validationEngineContainer">
		<li class="form-group form-group-sm">
			<div class="name-class">
				<span class="f14"><@spring.message code="company.dept.label.parentDeptName" /></span>
			</div>
			<div class="input-class">
				<input type="text" id="parentDepName" readonly value="" class="form-control" />
				<input type="hidden" id="parentDepId" value="" />
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="name-class">
				<span class="f14"><@spring.message code="company.dept.label.deptName" /></span>
			</div>
			<div class="input-class">
				<input type="text" id="depName" value="" placeholder='<@spring.message code="company.dept.msg.deptName.placeholder"/>' class="form-control validate[required,len[1,110]]" data-errormessage-value-missing='<@spring.message code="company.dept.msg.deptName.empty"/>' />
				<input type="hidden" id="depId" value="" />
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="name-class">
				<span class="f14"><@spring.message code="company.dept.label.deptDesc" /></span>
			</div>
			<div class="input-class">
				<textarea class="form-control validate[maxSize[500]]" rows="4" id="depDesc" placeholder='<@spring.message code="company.dept.msg.deptDesc.placeholder"/>'></textarea>			
			</div>
		</li>
	</ul>
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script type="text/ecmascript" src="${resPath}/bace/js/jqGrid/js/i18n/grid.locale-cn.js"></script>

<script>
_require(
{
	paths: {
		'data/companyDept': '${resPath}/resources/platform/sysmanage/company/js/company-dept',
		'message': '${resPath}/resources/platform/sysmanage/company/js/message'
	}
},
'data/companyDept', function(data) {
	data.init();
}
);
</script>