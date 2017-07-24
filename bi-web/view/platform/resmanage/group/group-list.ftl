<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/group/css/group-list.css${css_version}" />
	
<!--start-->
<div class="panel">
	<span class="f16"><@spring.message code="group.label.title"/></span>
</div>

<div class="panel">
	<div class="tab-content">
		<ul role="tabpanel" class="tab-pane active ">
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="group.label.groupName"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="listGroupName" value="" class="form-control" />
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="group.label.groupDesc"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="listDescription" value="" class="form-control" />
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="group.label.creater"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="creater" value="" class="form-control" />
				</div>
				<div class="button-class">
					<button id="search" type="button" class="btn btn-sm btn-info button-middle"><@spring.message code="group.button.search"/></button>
				</div>
			</li>
			<HR/>
			<li class="form-group form-group">
				<div class="oper-button">
					<button id="add" type="button" class="btn btn-info btn-sm button-middle"><@spring.message code="group.button.add"/></button>
					<button id="edit" type="button" class="btn btn-info btn-sm button-middle"><@spring.message code="group.button.edit"/></button>
					<button id="delete" type="button" class="btn btn-danger btn-sm button-middle"><@spring.message code="group.button.delete"/></button>
				</div>
			</li>
		</ul>
		<ul id="groupListPanel" class="group-list">
			<li id="groupList">
				<table id="groupTree" style="width:100%"></table>
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
                <select class="chosen-select form-control" id="groupProjectId">
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
				<@spring.message code="group.label.parentGroupName" />
			</label>
			<div class="add-group-list-div col-xs-6">
				<input id="parentGroupName" type="text" class="form-control" disabled="disabled" id="userName" value="">
			</div>
			<div style="clear:both;"></div>
		</div>
		<div class="add-group-dialog">
			<label class="col-xs-3 control-label">
				<@spring.message code="group.label.groupName" />
			</label>
			<div class="add-group-list-div col-xs-6">
				<input id="groupName" type="text" class="form-control validate[required,sp,len[0,95]]">
			</div>
			<div style="clear:both;"></div>
		</div>
		<div class="add-group-dialog">
			<label class="col-xs-3 control-label">
				<@spring.message code="group.label.groupDesc" />
			</label>
			<div class="add-group-list-div col-xs-8">
				<textarea id="description" class="form-control validate[required,len[0,395]]" rows="3"></textarea>
			</div>
			<div style="clear:both;"></div>
		</div>
	</div>
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script> 
	_require({
			paths: {
				'resmanage/group/groupInfo': '${resPath}/resources/platform/resmanage/group/js/group-list',
				'group/message':'${resPath}/resources/platform/resmanage/group/js/message'
			}
		},
		'resmanage/group/groupInfo', function() {}
	);
</script>