<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/tableview/css/table-view.css${css_version}" />

<#if viewId=="">
<div class="main-panel">
<#else>
<div class="main-panel hide">
</#if>
	<div class="well well-lg step-container">
		<div id="viewTab" class="step-tab">
			<span class="step-title-num" id="oneStep">1</span>
			<span class="step-title-span f14">定义业务数据视图</span>
		</div>
		<div id="tableTab" class="step-tab">
			<span class="step-title-num active-notFinished" id="twoStep">2</span>
			<span class="step-title-span f14">选择业务数据表</span>
		</div>
		<div id="linkTab" class="step-tab">
			<span class="step-title-num active-notFinished" id="thirdStep">3</span>
			<span class="step-title-span f14">设置业务数据表关系</span>
		</div>
		<div id="fieldTab" class="step-tab">
			<span class="step-title-num active-notFinished" id="fourStep">4</span>
			<span class="step-title-span f14">定义展现字段</span>
		</div>
	</div>
	<div class="step-line" id="stepLine"></div>
	
	<div class="view-info" id="viewInfo">
		<ul id="viewForm" class="view-info-panel validationEngineContainer">
			<li class="form-group form-group-sm">
				<div class="label-class divDispaly">
					<span class="f14"><@spring.message code="data.import.homeDatabase"/></span>
				</div>
				<div class="input-class divDispaly">
					<#if viewId == "">
						<select class="form-control chosen-select" data-placeholder="请选择归属数据库" id="selectDB">
						</select>
					<#else>
						<input class="form-control" type="text" id="dbName" disabled/>
					</#if>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class  divDispaly">
					<span class="f14">视图名称：</span>
				</div>
				<div class="input-class divDispaly">
					<input class="form-control validate[required,len[0,100]]" type="text" id="viewName" data-placeholder="请输入视图名称" data-errormessage-value-missing="请输入视图名称"/>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divDispaly">
					<span class="f14">业务分类：</span>
				</div>
				<div class="input-class divDispaly">
					<select class="form-control chosen-select" data-placeholder="请选择业务分类" id="classifySel">
					</select>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divDispaly">
					<span class="f14"><@spring.message code="data.import.tableDesc"/></span>
				</div>
				<div class="desc-class divDispaly">
					<textarea class="form-control validate[required,len[0,1000]]" rows="4" id="viewDesc" data-placeholder="请输入视图描述" data-errormessage-value-missing="请输入视图描述"></textarea>
				</div>
			<li>
		</ul>
		<button class="btn btn-info nextButton" id="viewButton"><@spring.message code="data.import.nextStep"/></button>
	</div>
	
	<div class="table-info hide" id="tableInfo">
		<div class="table-type">
			<div class="label-class divDispaly">
				<span class="f14">数据表存储类型：</span>
			</div>
			<div class="input-class divDispaly">
				<select class="form-control chosen-select" data-placeholder="请选择数据表存储类型" id="tableType">
					<option value="" selected>全部</option>
					<option value="1">按月存储数据</option>
					<option value="2">按日存储数据</option>
					<option value="0">其他</option>
				</select>
			</div>
		</div>
		<div class="connect-table">
			<span class="connect-table-span f14">选择数据表：</span>
			<div id="tableSelected" class="table-selected f14 divDispaly"></div>
			<div class="table-block" id="tableBlock"></div>
		</div>
		<div class="bottom-button-common table-button">
	   		<button class="btn btn-default btn-range" id="tableCancelButton"><@spring.message code="data.import.previousStep"/></button>
			<button class="btn btn-info" id="tableSaveButton"><@spring.message code="data.import.nextStep"/></button>
		</div>
	</div>
	
	<div class="link-info hide" id="linkInfo">
		<div class="link-info-grid">
			<table id="linkGrid"></table> 
		</div>
		<div class="bottom-button-common link-button">
			<button class="btn btn-default btn-range" id="linkCancelButton"><@spring.message code="data.import.previousStep"/></button>
			<button class="btn btn-info" id="linkSaveButton"><@spring.message code="data.import.nextStep"/></button>
		</div>
	</div>
	
	<div class="field-info hide" id="fieldInfo">
		<div class="field-info-grid">
			<table id="fieldGrid"></table> 
		</div>
		<button  class="btn btn-info field-button" id="fieldSaveButton"><@spring.message code="data.import.validationData"/></button>
	</div>
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/data/js/message.js"></script>
<script>
var viewId = '${viewId}';
_require(
{
	paths : {
		'platform/resmanage/tableview/table-view':'${resPath}/resources/platform/resmanage/tableview/js/table-view',
	}
},
'platform/resmanage/tableview/table-view',function(){}
);
</script>
