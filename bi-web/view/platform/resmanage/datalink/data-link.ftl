<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/bace/js/jsplumb/css/jsplumb.css" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-contcat.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-ztree.css"/>
<div class="file-step-container f12">
	<div id="fileTab" class="step-tab">
		<div id="step1" class="step-tab-select">
			<div class="step-title-num" id="oneStep">1</div>
			<strong id="step-title-label-first" class="step-title-label"><@spring.message code="data.dataLink.label.firstStep"/></strong>
		</div>
	</div>
	<div id="dataTab" class="step-tab">
		<div id="step2" class="step-tab-unselect">
			<div class="step-title-num active-notFinished" id="twoStep">2</div>
			<strong id="step-title-label-second" class="step-title-label"><@spring.message code="data.dataLink.label.secondStep"/></strong>
		</div>
	</div>
	<div id="fieldTab" class="step-tab">
		<div id="step3" class="step-tab-unselect">
			<div class="step-title-num active-notFinished" id="thirdStep">3</div>
			<strong id="step-title-label-third" class="step-title-label"><@spring.message code="data.dataLink.label.thirdStep"/></strong>
		</div>
	</div>
	<div style="clear:both"></div>
</div>
<div class="step-line"></div>
<div id="plumbContent" class="pcontent f12">
	<div id="plumblabel" class="plumblabelTemp">
		<div class="ptop">
			<div class="con-icon con-icon-style"></div>
			<div class="label-style"><@spring.message code="data.dataLink.label.cSetup"/></div>
			<div id="clearNodeLabel" class="label-style-plus"><@spring.message code="data.dataLink.label.clear"/></div>
			<div id="clearNode" class="dustbin-icon dustbin-icon-style"></div>
			<div id="addNodeLabel" class="label-style-plus"><@spring.message code="data.dataLink.label.add"/></div>
			<div id="addNode" class="plus-icon plus-icon-style"></div>
		</div>
		<div class="statemachine-demo dpanelTemp" id="statemachine-demo">
			
        </div>
	</div>
	<div id="conditionlabel" class="conditionlabelTemp">
		<div class="ptop">
			<div class="up-no-icon up-no-icon-style"></div>
			<div class="label-style"><@spring.message code="data.dataLink.label.celection"/></div>
			<div id="updown" class="upshow-icon upshow-icon-style"></div>
		</div>
		<div class="containerDiv dis-none">
			<div id="con-container" class="con-container">
			</div>
		</div>
	</div>
	<div id="datafoot" class="dfoot">
		<div>
			<button type="button" id="nextbth1" class="btn btn-info nextbtn1 btn-sm"><@spring.message code="data.dataLink.label.nextStep"/></button>
		</div>
	<div class="clear:both"></div>
	</div>
</div>
<div id="plumbContent2" class="pcontent dis-none f12">
	<div class="mess-content">
		<div class="data-concat-grid validationEngineContainer">
			<table id="dtable"cellpadding="0" cellspacing="0" width="98%" height="auto" >
				<tbody>
					<tr id="headTr">
						<th class="t-width tbackg"></th>
						<th class="t-width2 tbackg"><@spring.message code="data.dataLink.label.fieldSource"/></th>
						<th class="t-width2 tbackg"><@spring.message code="data.dataLink.label.fieldName"/></th>
						<th class="t-width3 tbackg"><@spring.message code="data.dataLink.label.isUse"/><input title="全选" style="margin-left:5px" type="checkbox" name="allAttrId" id="allAttrId" /></th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<div id="datafoot2" class="dfoot">
		<div>
			<button type="button" id="lastbth1" class="btn btn-info nextbtn1 btn-sm"><@spring.message code="data.dataLink.label.lastStep"/></button>
			<button type="button" id="nextbth2" class="btn btn-info nextbtn1 btn-sm"><@spring.message code="data.dataLink.label.nextStep"/></button>
		</div>
	<div class="clear:both"></div>
	</div>
</div>
<div id="plumbContent3" class="pcontent dis-none f12">
	<div class="complete-content">
		<div class="complete-content-text">
			<form class="form-inline" id="validateForm">
				<div style="width:100%" class="form-group form-group-sm">
					<label for="dataName" class="dataNameLabel control-label f12"><@spring.message code="data.dataLink.label.dataName"/></label>
					<input id="dataName" class="dataNameInput form-control typeahead-only input-sm validate[required,sp,len[1,100]"  placeholder="<@spring.message code="data.dataLink.label.dataName"/>" type="text"/>
					<label style="margin-left:13%" class="isUpdateLabel control-label radio-mar f12"><@spring.message code="data.dataLink.label.isUpdate"/></label>
					<label class="radioLabel radio f12" style="margin:auto 0">
		            	<input type="radio" data-toggle="radio" name="followOrigin" id="optionsRadios1" value="1" data-radiocheck-toggle="radio" required>
						<@spring.message code="data.dataLink.label.yes"/>
					</label>
					<label class="radioLabel radio radio-mar f12" style="margin:auto 0">
		            	<input type="radio" data-toggle="radio" name="followOrigin" id="optionsRadios2" value="0" data-radiocheck-toggle="radio" checked="">
						<@spring.message code="data.dataLink.label.no"/>
					</label>
					<label style="margin-left:13%" class="dataNameLabel control-label f12">业务分类：</label>
					<div class="select-classify-class">
						<select class="form-control chosen-select" data-placeholder="请选择业务分类" id="classifySel">
						</select>
					</div>
					<div style="clear:both"></div>
				</div>
			</form>
		</div>
		<div class="complete-content-text">
			<form class="form-inline" id="validateForm2">
				<label for="dataDesc" class="descLabel control-label label-desc f12"><@spring.message code="data.dataLink.label.dataDesc"/></label>
				<textarea style="width:88%" class="descText form-control validate[required,len[0,400,sp]]" id="dataDescText" placeholder="<@spring.message code="data.dataLink.label.dataDesc"/>" rows="3"></textarea>
				<div style="clear:both"></div>
			</form>
		</div>
		<div class="r-grid">
			<table id="dataResultGrid"></table> 
		</div>
	</div>
	<div id="datafoot3" class="dfoot">
		<div>
			<button type="button" id="lastbth2" class="btn btn-info nextbtn1 btn-sm"><@spring.message code="data.dataLink.label.lastStep"/></button>
			<button type="button" id="completeBtn" style="letter-spacing:6px;" class="btn btn-info nextbtn1 btn-sm"><@spring.message code="data.dataLink.label.thirdStep"/></button>
		</div>
		<div class="clear:both"></div>
	</div>
</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/data/js/message.js"></script>
<script>
var MdataId = '${MdataId}';
var linkModifyFlag = '${linkModifyFlag}';
_require(
{
	paths : {
		'plumb':'${resPath}/bace/js/jsplumb/js/dom.jsPlumb-1.7.6',
		'datalink/data-link':'${resPath}/resources/platform/resmanage/data/js/data-link',
		'dataLinkChoose':'${resPath}/resources/platform/resmanage/data/js/data-link-choose',
		'dataLinkFilter':'${resPath}/resources/platform/resmanage/data/js/data-link-filter',
		'dataDimensionFilter':'${resPath}/resources/platform/resmanage/data/js/data-dimension-filter',
		'dztree':'${resPath}/resources/platform/resmanage/data/js/data-ztree'
	}
},
'datalink/data-link',function(){}
);
</script>
