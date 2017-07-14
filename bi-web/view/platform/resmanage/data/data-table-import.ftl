<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-table-import.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-select-proviceOrCity.css${css_version}" />

<#if dataId=="">
<div class="main-panel">
<#else>
<div class="main-panel hide">
</#if>
	<div class="well well-lg step-container">
		<div id="tableTab" class="step-tab">
			<span class="step-title-num" id="oneStep">1</span>
			<span class="step-title-span f14"><@spring.message code="data.import.selectTable"/></span>
		</div>
		<div id="dataTab" class="step-tab">
			<span class="step-title-num active-notFinished" id="twoStep">2</span>
			<span class="step-title-span f14"><@spring.message code="data.import.twoStep"/></span>
		</div>
		<div id="fieldTab" class="step-tab">
			<span class="step-title-num active-notFinished" id="thirdStep">3</span>
			<span class="step-title-span f14"><@spring.message code="data.import.thirdStep"/></span>
		</div>
		<div id="completeTab" class="step-tab">
			<span class="step-title-num active-notFinished" id="fourStep">4</span>
			<span class="step-title-span f14"><@spring.message code="data.import.fourStep"/></span>
		</div>
	</div>
	<div class="step-line" id="stepLine"></div>
	
	<div class="table-info" id="tableInfo">
		<ul id="tableForm" class="table-info-pane validationEngineContainer">
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.import.homeDatabase"/></span>
				</div>
				<div class="input-class divDispaly">
					<#if dbId == "" && dataId == "">
						<select class="form-control chosen-select" data-placeholder="请选择归属数据库" id="selectDB">
						</select>
					<#else>
						<input class="form-control" type="text" id="dbName" disabled/>
					</#if>
				</div>
				<div class="label-class divDispaly">
					<span class="f14"><@spring.message code="data.import.dbName"/></span>
				</div>
				<div class="input-class divDispaly">
					<input class="form-control validate[required,len[0,100]]" type="text" id="dataTable" data-placeholder="<@spring.message code="data.import.inputDBName"/>" data-errormessage-value-missing="<@spring.message code="data.import.inputDBName"/>"/>
				</div>
				<div class="label-class divDispaly">
					<span class="f14"><@spring.message code="data.import.tableName"/></span>
				</div>
				<div class="input-class divDispaly">
					<input class="form-control validate[required,len[0,100]]" type="text" id="dataName" data-placeholder="<@spring.message code="data.import.inputTableName"/>" data-errormessage-value-missing="<@spring.message code="data.import.inputTableName"/>"/>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.import.splitType"/></span>
				</div>
				<div class="input-class divDispaly">
					<select class="form-control chosen-select" data-placeholder="<@spring.message code="data.import.selectSplitType"/>" id="splitType">
						<option value="0" selected><@spring.message code="data.import.noSplit"/></option>
						<option value="4">按月份</option>
						<option value="1"><@spring.message code="data.import.byDate"/></option>
						<option value="2"><@spring.message code="data.import.byNum"/></option>
						<option value="3"><@spring.message code="data.import.byLetter"/></option>
					</select>
				</div>
				<div class="label-class divDispaly">
					<span class="f14">业务分类：</span>
				</div>
				<div class="input-class divDispaly">
					<select class="form-control chosen-select" data-placeholder="请选择业务分类" id="classifySel">
					</select>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.import.updatePeriod"/></span>
				</div>
				<div class="input-class divDispaly">
					<select class="form-control chosen-select" data-placeholder="<@spring.message code="data.import.selectUpdatePeriod"/>" id="updatePeriod">
						<option value="I" selected><@spring.message code="data.import.updateImmediately"/></option>
						<option value="S"><@spring.message code="data.import.updateOnlyOnce"/></option>
						<option value="D"><@spring.message code="data.import.dailyUpdate"/></option>
						<option value="W"><@spring.message code="data.import.weeklyUpdate"/></option>
						<option value="M"><@spring.message code="data.import.monthlyUpdate"/></option>
					</select>
				</div>
				<div class="label-class divDispaly hide" id="xxgxsj">
					<span class="f14"><@spring.message code="data.import.nextUpdateTime"/></span>
				</div>
				<div class="input-class divDispaly hide" id="sjxz">
					 <input type='text' class="form-control" id='nextUpdateTime' />
				</div>
				<div class="label-class divDispaly hide" id="ccfs">
					<span class="f14"><@spring.message code="data.import.storageType"/></span>
				</div>
				<div class="input-class divDispaly hide" id="ccxz">
					<select class="form-control chosen-select" data-placeholder="<@spring.message code="data.import.selectStorageType"/>" id="storageType">
						<option value="" selected></option>
						<option value="1"><@spring.message code="data.import.deleteHistory"/></option>
						<option value="2"><@spring.message code="data.import.retainHistory"/></option>
					</select>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14"><@spring.message code="data.import.tableDesc"/></span>
				</div>
				<div class="desc-class divDispaly">
					<textarea class="form-control validate[required,len[0,1000]]" rows="4" id="tableDesc" data-placeholder="<@spring.message code="data.import.inputTableDesc"/>" data-errormessage-value-missing="<@spring.message code="data.import.inputTableDesc"/>"></textarea>
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class divWidth divDispaly">
					<span class="f14 red"><@spring.message code="data.import.explain"/></span>
				</div>
				<div class="desc-class divDispaly desc-ul">
					<ul class="desc-ul">	
						<li><span class="f14 red"><@spring.message code="data.import.explainOne"/> </span></li>
						<li class="desc-li"><span class="f14 red"><@spring.message code="data.import.explainLineOne"/></span></li>
						<li class="desc-li"><span class="f14 red"><@spring.message code="data.import.explainLineTwo"/></span></li>
						<li class="desc-li"><span class="f14 red"><@spring.message code="data.import.explainLineThree"/></span></li>
						<li><span class="f14 red"><@spring.message code="data.import.explainTwo"/></span></li>
					</ul>
				</div>
			<li>
		</ul>

		<button  class="btn btn-info nextButton" id="tableButton"><@spring.message code="data.import.nextStep"/></button>
	</div>
	
	<div class="data-info hide" id="dataInfo">
		<div class="funcForm">
			<div class="data-info-count-right">
			<input class="form-control" id="funcTxt" type="text" placeholder="$A+$B"/>
			<div class="funcBtn">
				<button class="btn btn-info" id="generateData"><@spring.message code="data.import.generate"/></button>
			</div>
			</div>
			<div class="data-info-count-left">
				<span>=</span><span id="colNameSpan"></span>
			</div>
			<div class="data-tips">
				<span class="f14"><@spring.message code="data.import.dataTips"/></span>
			</div>
		</div>
		<div class="data-info-grid">
			<table id="dataGrid"></table> 
		</div>
	   <div class="bottom-button-common data-button">
	   		<button class="btn btn-default btn-range" id="cancelButton"><@spring.message code="data.import.previousStep"/></button>
			<button class="btn btn-info" id="saveButton"><@spring.message code="data.import.nextStep"/></button>
		</div>
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
	
	<div class="complete-info hide" id="completeInfo">
		<ul>
			<li>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.homeDatabase"/></span>
				</div>
				<div class="content-class">
					<label class="labelTextLong" id="dbName_finish"></label>
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.dbName"/></span>
				</div>
				<div class="content-class">
					<label class="labelTextLong" id="dataTable_finish"></label>
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.tableName"/></span>
				</div>
				<div class="content-class">
					<label class="labelTextLong" id="dataName_finish"></label>
				</div>
			</li>
			<li>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.splitType"/></span>
				</div>
				<div class="content-class">
					<label class="labelTextLong" id="splitType_finish"></label>
				</div>
				<div class="label-class">
					<span class="f14">业务分类：</span>
				</div>
				<div class="content-class">
					<label class="labelTextLong" id="classify_finish"></label>
				</div>
			</li>
			<li>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.updatePeriod"/></span>
				</div>
				<div class="content-class">
					<label class="labelTextLong" id="updatePeriod_finish"></label>
				</div>
				<div class="label-class hide" id='xxgxsj_finish'>
					<span class="f14"><@spring.message code="data.import.nextUpdateTime"/></span>
				</div>
				<div class="content-class hide" id='sjxz_finish'>
					<label class="labelTextLong" id="nextUpdateTime_finish"></label>
				</div>
				<div class="label-class hide" id="ccfs_finish">
					<span class="f14"><@spring.message code="data.import.storageType"/></span>
				</div>
				<div class="content-class hide" id="ccxz_finish">
					<label class="labelTextLong" id="storageType_finish"></label>
				</div>
			</li>
			<li>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.tableDesc"/></span>
				</div>
				<div class="desc-class">
					<label class="labelTextLong" id="tableDesc_finish"></label>
				</div>
			</li>
			<li>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.dataPreview"/></span>
				</div>
				<div class="complete-info-grid">
					<table id="completeGrid"></table> 
				</div>
			</li>
		</ul>
		<button  class="btn btn-info completeButton" id="completeSaveButton"><@spring.message code="data.import.validationData"/></button>
	</div>
</div>


<div class="hide">
	<div id= "dim-select">
		<input type="text" class="dim-input f12" id="dimName" placeholder="<@spring.message code="data.import.inputDimName"/>"/>
		<img class="dim-find" id="dimSearch"/>
		<ul id="dimSelect">
		</ul>
	</div>
</div>

<div class="hide">
	<div id="dim-other-select">
		<input type="text" class="dim-input f12" id="dimNameForOther" placeholder="<@spring.message code="data.import.inputDimName"/>"/>
		<img class="dim-find" id="dimSearchForOther"/>
		<ul id="dimOtherSelect">
		</ul>
	</div>
</div>

<div class="hide">
	<ul id="columnOperMenu">
		<li class="addLeftColumn">
			<div class="addColumn"></div>
			<span><@spring.message code="data.import.addLeftColumn"/></span>
		</li>
		<li class="addRightColumn">
			<div class="addColumn"></div>
			<span><@spring.message code="data.import.addRightColumn"/></span>
		</li>
		<li class="delThecolumn">
			<div class="delColumn"></div>
			<span><@spring.message code="data.import.delTheColumn"/></span>
		</li>
	</ul>
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/data/js/message.js"></script>
<script>
var dataBaseName = '${dataBaseName}';
var dbId = '${dbId}';
var dataId = '${dataId}';
_require(
{
	paths : {
		'platform/resmanage/data/data-table-import':'${resPath}/resources/platform/resmanage/data/js/data-table-import',
		'proviceOrCitySelect':'${resPath}/resources/platform/resmanage/data/js/data-select-proviceOrCity'
	}
},
'platform/resmanage/data/data-table-import',function(){}
);
</script>
