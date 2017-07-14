<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-file-import.css${css_version}" />
<link rel="stylesheet" href="${resPath}/bace/js/webuploader/css/webuploader.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-select-proviceOrCity.css${css_version}" />

<#if type=="add">
<div class="main-panel">
<#else>
<div class="main-panel hide">
</#if>
	<div class="well well-lg step-container">
		<div class="step-tab" id="fileTab">
			<span class="step-title-num" id="oneStep">1</span>
			<span class="step-title-span f14"><@spring.message code="data.import.selectFile"/></span>
		</div>
		<div class="step-tab" id="dataTab">
			<span class="step-title-num active-notFinished" id="twoStep">2</span>
			<span class="step-title-span f14"><@spring.message code="data.import.twoStep"/></span>
		</div>
		<div class="step-tab" id="fieldTab">
			<span class="step-title-num active-notFinished" id="thirdStep">3</span>
			<span class="step-title-span f14"><@spring.message code="data.import.thirdStep"/></span>
		</div>
		<div class="step-tab" id="completeTab">
			<span class="step-title-num active-notFinished" id="fourStep">4</span>
			<span class="step-title-span f14"><@spring.message code="data.import.fourStep"/></span>
		</div>
	</div>
	<div class="step-line" id="stepLine"></div>
	<div class="file-info" id="fileInfo">
		<div class="file-block">
			<div class="file-uploader-text">
				<div class="file-block-span1">
					<span><@spring.message code="data.import.selectFileType"/></span>
				</div>
			</div>
			<div class="file-upload-pic" id="fileUploadType">
				<div class="data-file-type txt">
					<div class="txt-icon"></div>
				</div>
				<div class="data-file-type excel">
					<div class="excel-icon"></div>
				</div>
				<div class="data-file-type csv">
					<div class="csv-icon"></div>
				</div>
			</div>
			<div class="import-file hide">
				<div id="txtType" class="import-type-pic hide">
					<div class="import-txt-icon"></div>
				</div>
				<div id="excelType" class="import-type-pic hide">
					<div class="import-excel-icon"></div>
				</div>
				<div id="csvType" class="import-type-pic hide">
					<div class="import-csv-icon"></div>
				</div>
				<div class="import-file-info">
					<label id="importFileName" class="import-label f14"></label>
					<label id="importFileType" class="import-label f14"></label>
					<label id="importFileSize" class="import-label f14"></label>
				</div>
			</div>
			<div class="file-info-label hide">
				<label class="file-info-inputLabel f16"><@spring.message code="data.import.firstline"/></label> : 
				<label class="radio file-info-radio">
					<input name="optionsRadio" type="radio" data-toggle="radio" id="titleOption" value="1"/> <@spring.message code="data.import.yes"/>
				</label>
				<label class="radio file-info-radio">
					<input name="optionsRadio" type="radio" data-toggle="radio" id="titleOption" checked value="0"/> <@spring.message code="data.import.no"/>
				</label>
			</div>
			<div class="file-info-title hide">
				<label class="f16"><@spring.message code="data.import.replaceTitle"/></label> : 
				<label class="radio file-info-radio">
					<input name="titleRadio" type="radio" data-toggle="radio" id="tiltleInfoOption" value="1"/> <@spring.message code="data.import.yes"/>
				</label>
				<label class="radio file-info-radio">
					<input name="titleRadio" type="radio" data-toggle="radio" id="tiltleInfoOption" checked value="0"/> <@spring.message code="data.import.no"/>
				</label>
			</div>
			<div class="progress file-progress hide">
			</div>
			<div class="upload-button hide">
				<button id="uploadFile" class="btn btn-info">上传</button>
				<button id="uploadCancel" class="btn btn-default upload-cancel">重选</button>
			</div>
			<button id="reUploadFile" class="btn btn-info hide">重新上传</button>
			<div class="file-block-button hide">
				<div id="filePicker"></div>
			</div>
		</div>
		<button class="btn btn-info nextButton hide" id="fileButton"><@spring.message code="data.import.nextStep"/></button>
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
	    	<button class="btn btn-default" id="cancelButton"><@spring.message code="data.import.previousStep"/></button>
			<button class="btn btn-info" id="saveButton"><@spring.message code="data.import.nextStep"/></button>
		</div>
	</div>
	
	<div class="field-info hide" id="fieldInfo">
		<ul id="fileForm" class="field-info-pane validationEngineContainer">
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.fileName"/></span>
				</div>
				<div class="input-class">
					<input type="text" class="form-control validate[required,len[0,100]]" id="dataName" placeholder="<@spring.message code="data.import.inputFileName"/>"  data-errormessage-value-missing="<@spring.message code="data.import.inputFileName"/>" />
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.fileDataNum"/></span>
				</div>
				<div class="input-class">
					<input type="text" class="form-control" id="dataNum" disabled />
				</div>
			<li>
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14">业务分类：</span>
				</div>
				<div class="input-class">
					<select class="form-control chosen-select" data-placeholder="请选择业务分类" id="classifySel">
					</select>
				</div>
			</li>
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.fileDesc"/></span>
				</div>
				<div class="desc-class">
					<textarea class="form-control validate[required,len[0,1000]]" rows="3" id="dataDesc" placeholder="<@spring.message code="data.import.inputFileDesc"/>" data-errormessage-value-missing="<@spring.message code="data.import.inputFileDesc"/>"></textarea>
				</div>
			<li>
			
			<li>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.fileField"/></span>
				</div>
				<div class="field-info-grid">
					<table id="fieldGrid"></table> 
				</div>
			<li>
		</ul>

		<div class="bottom-button-common field-button">
			<button class="btn btn-default btn-range" id="fieldCanButton"><@spring.message code="data.import.previousStep"/></button>
			<button class="btn btn-info" id="fieldSaveButton"><@spring.message code="data.import.nextStep"/></button>
		</div>
	</div>
	
	<div class="complete-info hide" id="completeInfo">
		<ul>
			<li>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.fileName"/></span>
				</div>
				<div class="content-class">
					<label class="labelTextLong" id="dataName_finish"></label>
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.fileDataNum"/></span>
				</div>
				<div class="content-class">
					<label class="labelTextLong" id="dataNum_finish"></label>
				</div>
			</li>
			<li>
				<div class="label-class">
					<span class="f14">业务分类：</span>
				</div>
				<div class="content-class">
					<label class="labelTextLong" id="classify_finish"></label>
				</div>
			</li>
			<li>
				<div class="label-class">
					<span class="f14"><@spring.message code="data.import.fileDesc"/></span>
				</div>
				<div class="desc-class">
					<label class="labelTextLong" id="dataDesc_finish"></label>
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
		<div class="sure-button">
			<button class="btn btn-info completeButton" id="completeSaveButton"><@spring.message code="data.import.validationData"/></button>
		</div>
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
		<li class="delTheColumn">
			<div class="delColumn"></div>
			<span><@spring.message code="data.import.delTheColumn"/></span>
		</li>
	</ul>
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/data/js/message.js"></script>
<script>
var dataId = '${dataId}';
var opType = '${type}';
_require(
{
	paths : {
		'platform/resmanage/data/data-file-import':'${resPath}/resources/platform/resmanage/data/js/data-file-import',
		'upload':'${resPath}/bace/js/webuploader/js/webuploader',
		'proviceOrCitySelect':'${resPath}/resources/platform/resmanage/data/js/data-select-proviceOrCity'
	}
},
'platform/resmanage/data/data-file-import',function(){}
);
</script>
