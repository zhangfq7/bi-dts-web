<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/dim/css/dim-opt.css${css_version}" />
<link rel="stylesheet" href="${resPath}/bace/js/handsontable/handsontable.full.min.css" type="text/css" />
<div class="well well-lg step-container">
	<div class="step-tab" id="firstTab">
		<span class="step-title-num" id="firstStep">1</span>
		<span class="step-title-span f14"><@spring.message code="dim.opt.title.basic"/></span>
	</div>
	<div class="step-tab" id="secondTab">
		<span class="step-title-num active-notFinished" id="secondStep">2</span>
		<span class="step-title-span f14"><@spring.message code="dim.opt.title.data"/></span>
	</div>
	<div class="step-tab" id="saveTab">
		<span class="step-title-num active-notFinished" id="saveStep">3</span>
		<span class="step-title-span f14"><@spring.message code="dim.opt.title.save"/></span>
	</div>
</div>
<div class="step-line" id="stepLine"></div>

<div id="firstStep-div" class="step-div">
	<div class="content-div">
	<form class="form-horizontal validationEngineContainer">
	

	 
		<fieldset>
		
	   <div class="form-group form-group-sm" id="div_projectId" style="display:none">
	   <label class="my-label-30">选择对应的租户：</label>
	   		<div class="my-text-40 text-left">
				 <select id="projectId">
			<#list projectList as projectBean>
	            <option value="${projectBean.labelCode}">${projectBean.labelName}</option>
			</#list>
	        </select>
			</div>
	 </div>
	 
			<div class="form-group form-group-sm">
				<label class="my-label-30"><@spring.message code="dim.opt.label.dimName"/></label>
				<div class="my-text-40">
					<input type="text" class="form-control validate[required,sp,len[0,100]" id="dimName" placeholder="<@spring.message code='dim.opt.message.placeholder.dimName'/>" />
				</div>
			</div>
			
			<div id="parentDimNameDivId"  class="form-group form-group-sm">
				<label class="my-label-30"><@spring.message code="dim.opt.label.parentDimName"/></label>
				<div class="my-text-40">
					<input id="parentDimName" type="text" class="form-control" placeholder="<@spring.message code='dim.opt.message.placeholder.parentDim'/>" readOnly/>
				</div>
			</div>
			
			<div class="form-group form-group-sm">
				<label class="my-label-30"><@spring.message code="dim.opt.label.createType"/></label>
				<div class="my-text-40 text-left">
				  <label class="f13 control-label">
					<i class="fa fa-check-square-o checkBox" id="textEdit" value="1"></i><span class="radio-label"> <@spring.message code="dim.opt.label.createType.text"/></span>
					<i class="fa fa-square-o checkBox marginLeft" id="dataImport" value="2"></i><span class="radio-label"> <@spring.message code="dim.opt.label.createType.import"/></span>
					<i class="fa fa-square-o checkBox marginLeft" id="configSql" value="3"></i><span class="radio-label"> <@spring.message code="dim.opt.label.createType.sql"/></span>
				  </label>
				</div>
			</div>
			
			<div class="form-group form-group-sm">
				<label class="my-label-30"><@spring.message code="dim.opt.label.dimDesc"/></label>
				<div class="my-text-40">
					<textarea class="form-control validate[required,sp,len[0,1000]" id="dimDesc" placeholder="<@spring.message code='dim.opt.message.placeholder.dimDesc'/>" rows="5"></textarea>
				</div>
			</div>
		</fieldset>
	</form>
	</div>
			
	<div class="bottom-button-common">
		<button class="btn btn-info" id="first-next"><@spring.message code="dim.opt.button.next"/></button>
	</div>
</div>

<div id="secondStep-div" class="step-div hide">
	<div class="content-div">
	<form class="form-horizontal validationEngineContainer">
		<fieldset>
			<div id="sqlDiv">
				<div class="form-group form-group-sm">
					<label class="my-label-25"><@spring.message code="dim.opt.label.databaseId"/></label>
					<div class="my-text-40 text-left">
						<select class="chosen-select chosen-width" id="dbId">
							<#list dbList as dbBean>
				            	<option value="${dbBean.dbId}">${dbBean.dbName}</option>
			            	</#list> 
			         	</select>
					</div>
				</div>
				
				<div class="form-group form-group-sm">
					<label class="my-label-25"><@spring.message code="dim.opt.label.dataSql"/></label>
					<div class="my-text-40">
						<textarea class="form-control validate[required]" id="dimSqlStr" rows="5"></textarea>
					</div>
				</div>
				
				<div class="form-group form-group-sm">
					<label class="my-label-25"><@spring.message code="dim.opt.label.dimCode"/></label>
					<div class="my-text-20">
						<input type="text" class="form-control validate[required]" id="dimCodeAttrSql" />
					</div>
					
					<label class="my-label-15"><@spring.message code="dim.opt.label.dimLabel"/></label>
					<div class="my-text-20">
						<input type="text" class="form-control validate[required]" id="dimLabelAttrSql" />
					</div>
				</div>
				
				<div class="form-group form-group-sm">
					<label class="my-label-25"><@spring.message code="dim.opt.label.parentCode"/></label>
					<div class="my-text-20">
						<input type="text" class="form-control" id="parentCodeAttrSql" />
					</div>
					
					<label class="my-label-15"><@spring.message code="dim.opt.label.order"/></label>
					<div class="my-text-20">
						<input type="text" class="form-control" id="dimOrderAttrSql" />
					</div>
				</div>
			</div>
			<div id="dataDiv">
				<div class="form-group form-group-sm">
					<label class="my-label-25"><@spring.message code="dim.opt.label.dataId"/></label>
					<div class="my-text-40">
						<input id="dataId" type="text" class="form-control validate[required]" data-errormessage-value-missing="<@spring.message code='dim.opt.message.valid.dataId'/>"  placeholder="<@spring.message code='dim.opt.message.placeholder.dataId'/>" readonly />
					</div>
				</div>
				
				<div class="form-group form-group-sm">
					<label class="my-label-25"><@spring.message code="dim.opt.label.dimCode"/></label>
					<div class="my-text-20">
						<input type="text" class="form-control validate[required]" id="dimCodeAttr" placeholder="<@spring.message code='dim.opt.message.placeholder.dimInfo'/>" readonly />
					</div>
					
					<label class="my-label-15"><@spring.message code="dim.opt.label.dimLabel"/></label>
					<div class="my-text-20">
						<input type="text" class="form-control validate[required]" id="dimLabelAttr" placeholder="<@spring.message code='dim.opt.message.placeholder.dimInfo'/>" readonly />
					</div>
				</div>
				
				<div class="form-group form-group-sm">
					<label class="my-label-25"><@spring.message code="dim.opt.label.parentCode"/></label>
					<div class="my-text-20">
						<input type="text" class="form-control" id="parentCodeAttr" placeholder="<@spring.message code='dim.opt.message.placeholder.dimInfo'/>" readonly />
					</div>
					
					<label class="my-label-15"><@spring.message code="dim.opt.label.order"/></label>
					<div class="my-text-20">
						<input type="text" class="form-control" id="dimOrderAttr" placeholder="<@spring.message code='dim.opt.message.placeholder.dimInfo'/>" readonly />
					</div>
				</div>
			</div>
			<div id="textDiv">
				<div class="form-group form-group-sm">
					<label class="text-div"><@spring.message code="dim.opt.message.text.desc"/></label>
				</div>
			</div>
		</fieldset>
		<div class="hdTable-parent-div" id="dimInfoTable">
			<div class="hdTable-div" id="dimData"></div>
		</div>
		<div class="hide">
			<ul class='opt-menu'>
				<li class="opt-dimId"><@spring.message code="dim.opt.label.table.dimCode"/></li>
				<li class="opt-dimName"><@spring.message code="dim.opt.label.table.dimLabel"/></li>
				<li class="opt-parentId"><@spring.message code="dim.opt.label.table.parentCode"/></li>
				<li class="opt-orderId"><@spring.message code="dim.opt.label.table.order"/></li>
			</ul>
		</div>
	</form>
	</div>		
	<div class="bottom-button-common">
		<button class="btn btn-info" id="second-before"><@spring.message code="dim.opt.button.before"/></button>
		<button class="btn btn-info marginLeft" id="second-next"><@spring.message code="dim.opt.button.next"/></button>
	</div>
</div>

<div id="saveStep-div" class="step-div hide">
	<div class="content-div">
	<form class="form-horizontal">
		<fieldset>
			<div class="form-group form-group-sm">
				<label class="my-label-30"><@spring.message code="dim.opt.label.dimName"/></label>
				<label id="showDimName" class="my-text-20 text-left" ></label>
				
				<label class="my-label-15"><@spring.message code="dim.opt.label.parentDimName"/></label>
				<label id="showParentDim" class="my-text-20 text-left" ></label>
			</div>
			
			<div class="form-group form-group-sm">
				<label class="my-label-30"><@spring.message code="dim.opt.label.createType"/></label>
				<label id="showCreateType" class="my-text-20 text-left" ></label>
				
				<label class="my-label-15"><@spring.message code="dim.opt.label.count"/></label>
				<label id="showDimCount" class="my-text-20 text-left" ></label>
			</div>
			<div class="form-group form-group-sm">
				<label class="my-label-30"><@spring.message code="dim.opt.label.dimDesc"/></label>
				<label id="showDimDesc" class="my-text-40 text-left word-break" ></label>
			</div>
		</fieldset>
		<div class="hdTable-parent-div">
			<div class="hdTable-div" id="showData"></div>
		</div>
	</form>
	</div>
			
	<div class="bottom-button-common">
		<button class="btn btn-info" id="save-before"><@spring.message code="dim.opt.button.before"/></button>
		<button class="btn btn-info marginLeft" id="save-add"><@spring.message code="dim.opt.button.save"/></button>
	</div>
</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
	var dimId = '${dimId}';
	_require({
			paths : {
				'dim/dim-opt':'${resPath}/resources/platform/resmanage/dim/js/dim-opt',
				'handsontable':'${resPath}/bace/js/handsontable/handsontable.full.min',
				'dimOpt/message':'${resPath}/resources/platform/resmanage/dim/js/message',
			}
		},
		'dim/dim-opt',function(){}
	);
</script>
