<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/caliber/css/caliber-list.css${css_version}" />
	
<!--start-->
<div class="panel">
	<span class="f16"><@spring.message code="caliber.label.calibermanage"/></span>
</div>

<div class="panel">
	<div class="tab-content">
		<ul role="tabpanel" class="tab-pane active ">
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="caliber.label.calibername"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="listCaliberName" value="" class="form-control" />
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="caliber.label.caliberdesc"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="listCaliberDesc" value="" class="form-control" />
				</div>
				
				<div class="button-class">
					<button id="search" type="button" class="btn btn-sm btn-info button-middle"><@spring.message code="caliber.button.search"/></button>
				</div>
			</li>
			<HR/>
			<li class="form-group form-group">
				<div class="oper-button">
					<button id="add" type="button" class="btn btn-info btn-sm button-middle"><@spring.message code="caliber.button.add"/></button>
					<button id="edit" type="button" class="btn btn-info btn-sm button-middle"><@spring.message code="caliber.button.edit"/></button>
					<button id="delete" type="button" class="btn btn-danger btn-sm button-middle"><@spring.message code="caliber.button.del"/></button>
				</div>
			</li>
		</ul>
		<ul id="caliberListPanel" class="caliber-list">
			<li id="caliberList">
				<table id="caliberDateList" style="width:100%;overflow: hidden"></table>
				<div id="caliberListGridPager"></div>
			</li>
		</ul>
	</div>
</div>

<div style="display:none">
	<div id="add-page" class="validationEngineContainer">
        <div class="add-group-dialog">
            <label class="col-xs-3 control-label">
			<@spring.message code="group.label.projectName" />
            </label>
            <div class="add-group-list-div col-xs-6">
                <select class="chosen-select form-control" id="caliberProjectId">
                    <option value="">请选择租户</option>
				<#list projectLabelBeanList as labelBean>
                    <option value="${labelBean.labelCode}">${labelBean.labelName}</option>
				</#list>
                </select>
            </div>
            <div style="clear:both;"></div>
        </div>
		<div class="add-group-dialog">
			<label class="col-xs-3 control-label">
				<@spring.message code="caliber.label.calibername"/>
			</label>
			<div class="add-group-list-div col-xs-6">
				<input id="caliberName" type="text" class="form-control validate[required,len[0,95]]">
			</div>
			<div style="clear:both;"></div>
		</div>
		<div class="add-group-dialog">
			<label class="col-xs-3 control-label">
				<@spring.message code="caliber.label.caliberdesc"/>
			</label>
			<div class="add-group-list-div col-xs-8">
				<textarea id="caliberDesc" class="form-control validate[required,len[0,395]]" rows="3"></textarea>
			</div>
			<div style="clear:both;"></div>
		</div>
	</div>
</div>


<#include "view/platform/frame/bace/bottom.ftl">

<script type="text/ecmascript" src="${resPath}/bace/js/jqGrid/js/i18n/grid.locale-cn.js"></script>
<script> 
_require({
				paths: {
					'resmanage/caliberData': '${resPath}/resources/platform/resmanage/caliber/js/caliber-list',
					'caliber/message': '${resPath}/resources/platform/resmanage/caliber/js/message'
				}
			});
			require(['resmanage/caliberData'], function(caliberData) {
				caliberData.init();
			}
		);
</script>