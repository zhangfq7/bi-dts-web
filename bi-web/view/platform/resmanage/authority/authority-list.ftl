<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/authority/css/authority-list.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/authority/css/authority-edit.css${css_version}" />

<div class="panel">
	<span class="f16"><@spring.message code="authority.title"/></span>
</div>

<div class="panel">
	<div class="tab-content">
		<ul role="tabpanel" class="tab-pane active ">
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="authority.label.userName"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="userName" value="" class="form-control" />
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="authority.label.dimName"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="dimName" value="" class="form-control" />
				</div>
				<div class="button-class">
					<button id="search" type="button" class="btn btn-sm btn-info button-middle"><@spring.message code="authority.button.query"/></button>
				</div>
			</li>
			<HR/>
			<li class="form-group form-group">
				<div class="oper-button">
					<button id="batchConfigBtn" type="button" class="btn btn-info btn-sm button-middle"><@spring.message code="authority.button.batchAdd"/></button>
				</div>
			</li>
		</ul>
		<ul id="authorityListPanel" class="classify-list">
			<table id="authorityListGrid" width="100%"></table>
			<div id="authorityListGridPager"></div>
		</ul>
	</div>
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/authority/js/message.js"></script>
<script>
_require(
{
	paths : {
		'authority/list':'${resPath}/resources/platform/resmanage/authority/js/authority-list',
		'batchConfig':'${resPath}/resources/platform/resmanage/authority/js/authority-batch-add',
		'authorityEdit':'${resPath}/resources/platform/resmanage/authority/js/authority-edit'
	}
},
'authority/list', function() {}
);
</script>
