<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-table-import-direct.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/table-date.css${css_version}" />
<link  rel="stylesheet" href="${resPath}/resources/platform/dataview/js/jquery/dialog/skins/blue2.css${css_version}"/>

<div class="main-panel">
	<div class="well well-lg step-container">
		<div id="tableTab" class="step-tab">
			<span class="step-title-num" id="oneStep">1</span>
			<span class="step-title-span f14"><@spring.message code="data.import.selectTableDirect"/></span>
		</div>
		<div id="fieldTab" class="step-tab">
			<span class="step-title-num active-notFinished" id="twoStep">2</span>
			<span class="step-title-span f14"><@spring.message code="data.import.twoStepDirect"/></span>
		</div>
	</div>
	<div class="step-line" id="stepLine"></div>
	
	<div class="table-info" id="tableInfo">
		<ul id="tableForm" class="table-info-pane validationEngineContainer">
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.connect.homeDatabase"/></span>
				</div>
				<div class="input-class divDispaly">
					<#if dbId == "" && dataId == "">
						<select class="form-control chosen-select" data-placeholder="请选择归属数据库" id="selectDB">
						</select>
					<#else>
						<input class="form-control" type="text" id="dbName" disabled/>
					</#if>
				</div>
				<img class="necessary-sign" src='${resPath}/resources/platform/resmanage/data/img/necessary-sign.png' align="absmiddle" title="必填"/>
				<div class="label-class  divWidth divDispaly">
					<span class="f14"><@spring.message code="data.connect.classifyId"/></span>
				</div>
				<div class="input-class divDispaly">
					<select class="form-control chosen-select " data-placeholder="请选择业务分类" id="classifySel">
					</select>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.connect.dbName"/></span>
				</div>
				<div class="input-class divDispaly">
					<#if interfaceTag == true || dataId != "">
						<input class="form-control" type="text" id="dataTable" disabled/>
					<#else>
						<input class="form-control validate[required,len[0,100]]" type="text" id="dataTable" data-placeholder="<@spring.message code="data.connect.inputDBName"/>"/>
					</#if>				
				</div>
				<img class="necessary-sign" src='${resPath}/resources/platform/resmanage/data/img/necessary-sign.png' align="absmiddle" title="必填"/>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.connect.tableName"/></span>
				</div>
				<div class="input-class divDispaly">
					<input class="form-control validate[required,len[0,100]]" type="text" id="dataName" data-placeholder="<@spring.message code="data.connect.inputTableName"/>" data-errormessage-value-missing="<@spring.message code="data.connect.inputTableName"/>"/>
				</div>
				<img class="necessary-sign" src='${resPath}/resources/platform/resmanage/data/img/necessary-sign.png' align="absmiddle" title="必填"/>
				<div class="label-class  divWidth divDispaly">
					<span class="f14"><@spring.message code="data.connect.tableTime"/></span>
				</div>
				<div class="tableTime divDispaly">
					<input class="form-control validate[required,len[0,100]]" type="text" id="tableTime" disabled/>
				</div>
				<img class="necessary-sign" src='${resPath}/resources/platform/resmanage/data/img/necessary-sign.png' align="absmiddle" title="必填"/>
				<div class="tableDateButton" id="setTableTimeSql">
					<img src='${resPath}/resources/platform/resmanage/data/img/time.png' align="absmiddle"/>
					<span><@spring.message code="data.connect.tableTimeSql"/></span>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.connect.splitType"/></span>
				</div>
				<div class="input-class divDispaly">
					<select class="form-control chosen-select" data-placeholder="<@spring.message code="data.connect.selectSplitType"/>" id="tableType">
						<option value="0" selected>其他</option>
						<option value="1">按月存储数据</option>
						<option value="2">按日存储数据</option>
					</select>
				</div>
				<img class="necessary-sign" src='${resPath}/resources/platform/resmanage/data/img/necessary-sign.png' align="absmiddle" title="必填"/>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.connect.storageType"/></span>
				</div>
				<div class="input-class divDispaly">
					<select class="form-control chosen-select" data-placeholder="<@spring.message code="data.connect.selectStorageType"/>" id="tableStorage">
						<option value="0" selected>不是分表</option>
						<option value="2">按其他信息分表</option>
						<option value="A">按其他字段分表</option>
					</select>
				</div>
				<img class="necessary-sign" src='${resPath}/resources/platform/resmanage/data/img/necessary-sign.png' align="absmiddle" title="必填"/>
				<div class="label-class  divWidth divDispaly hide" id="aaa">
					<span class="f14"><@spring.message code="data.connect.storageField"/></span>
				</div>
				<div class="input-class divDispaly storageField  hide" id="bbb">
					<input class="form-control validate[required,len[0,100]]" type="text" id="storageField" data-placeholder="<@spring.message code="data.connect.inputStorageField"/>"/>
					<div class="fieldImg">
						<img class="necessary-sign" src='${resPath}/resources/platform/resmanage/data/img/necessary-sign.png' align="absmiddle" title="必填"/>
					</div>
				</div>
			<li>
			
			<li class="form-group form-group-sm hide" id="ccc">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.connect.storageFieldSQL"/></span>
				</div>
				<div class="desc-class divDispaly ">
					<textarea class="form-control validate[required,len[0,1000]]" rows="2" id="storageSql" data-placeholder="<@spring.message code="data.connect.inputStorageFieldSQL"/>" data-errormessage-value-missing="<@spring.message code="data.import.inputTableSQLDesc"/>"></textarea>
				</div>
				 
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.connect.tableDesc"/></span>
				</div>
				<div class="desc-class divDispaly">
					<textarea class="form-control" rows="4" id="tableDesc" data-placeholder="<@spring.message code="data.import.inputTableDesc"/>" data-errormessage-value-missing="<@spring.message code="data.import.inputTableDesc"/>"></textarea>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14 red"><@spring.message code="data.import.explain"/></span>
				</div>
				<div class="desc-class divDispaly desc-ul">
					<ul class="desc-ul">	
						<li><span class="f14 red"><@spring.message code="data.connect.dbNameDesc"/></span></li>
						<li><span class="f14 red"><@spring.message code="data.connect.storageFieldDesc"/></span></li>
					</ul>
				</div>
			<li>
		</ul>

		<button  class="btn btn-info nextButton" id="nextButton"><@spring.message code="data.import.nextStep"/></button>
	</div>
	
	<div class="field-info hide" id="fieldInfo">
		<div class="field-info-grid">
			<table id="fieldGrid"></table> 
		</div>
		<div class="bottom-button-common field-button">
			<button class="btn btn-default btn-range" id="fieldCanButton"><@spring.message code="data.import.previousStep"/></button>
			<button class="btn btn-info" id="fieldSaveButton"><@spring.message code="data.import.nextStep"/></button>
		</div>
	</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/data/js/message.js"></script>
<script src="${resPath}/resources/platform/dataview/js/jquery/dialog/jquery.artDialog.source.js"></script>

<script>
var dataBaseName = '${dataBaseName}';
var dbId = '${dbId}';
var dataId = '${dataId}';
var interfaceTag = '${interfaceTag}';
var dataTable = '${dataTable}';
var tableName = '${tableName}';
_require(
{
	paths : {
		'platform/resmanage/data/data-table-import-direct':'${resPath}/resources/platform/resmanage/data/js/data-table-import-direct',
		'proviceOrCitySelect':'${resPath}/resources/platform/resmanage/data/js/data-select-proviceOrCity',
	}
},
'platform/resmanage/data/data-table-import-direct',function(){}
);
</script>
