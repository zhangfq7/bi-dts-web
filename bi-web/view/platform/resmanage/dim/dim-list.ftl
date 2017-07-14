<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/dim/css/dim-list.css${css_version}" />

<!--start-->
<div class="panel f16" style="padding: 10px;">
	<@spring.message code="dim.list.title"/>
</div>
<div class="panel minback">
	<form class="form-horizontal registerForm">	
		<fieldset>
			<div class="form-group-sm">
				<label for="selDimName" class="my-label f14"><@spring.message code="dim.list.label.dimName"/></label>
				<div class="my-text">
					<input type="text" class="form-control" id="selDimName" placeholder="<@spring.message code='dim.list.message.placeholder.dimName'/>">
				</div>
				<label for="selCreateType" class="my-label f14"><@spring.message code="dim.list.label.createType"/></label>
				<div class="div-select">
					<select id="selCreateType" class="chosen-select">
						<option value=""><@spring.message code="dim.list.label.createType.all"/></option>
						<option value="1"><@spring.message code="dim.list.label.createType.text"/></option>
						<option value="2"><@spring.message code="dim.list.label.createType.import"/></option>
						<option value="3"><@spring.message code="dim.list.label.createType.sql"/></option>
					</select>
				</div>
				<label for="selDimDesc" class="my-label f14"><@spring.message code="dim.list.label.dimDesc"/></label>
				<div class="my-text">
					<input type="text" class="form-control" id="selDimDesc" placeholder="<@spring.message code='dim.list.message.placeholder.dimDesc'/>">
				</div>
				<div class="my-button search-button">					
					<a href="#fakelink" id="search-btn" class="btn btn-block btn-sm btn-info mybtn"><@spring.message code="dim.list.button.search"/></a>
				</div>
			</div>
		</fieldset>
	</form>
	<div class="lineborder"></div>
	<form class="form-horizontal registerForm">	
		<fieldset class="pos">
				<div class="form-group">
					<div class="my-button">
						<a href="#fakelink" id="add-btn" class="btn btn-block btn-info btn-sm btn-register mybtn"><@spring.message code="dim.list.button.add"/></a>
					</div>
				</div>
		</fieldset>
	</form>
	<div class="dim-list">
	     <table id="dimGrid"></table>
	     <div id="dimGridPager"></div>
	</div>	
</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
var dimList = {};
_require({
		paths : {
			'dim/dim-list':'${resPath}/resources/platform/resmanage/dim/js/dim-list',
			'dimList/message': '${resPath}/resources/platform/resmanage/dim/js/message'
		}
	},
	'dim/dim-list',function(dimListObj){
		dimList.searchTable = dimListObj.searchTable;
	}
);
</script>
