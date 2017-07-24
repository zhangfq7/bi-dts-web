<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/classify/css/classify-list.css${css_version}" />

<div class="panel">
	<span class="f16">业务分类管理</span>
</div>

<div class="panel">
	<div class="tab-content">
		<ul role="tabpanel" class="tab-pane active ">
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14">业务分类名称：</span>
				</div>
				<div class="input-class">
					<input type="text" id="className" value="" class="form-control" />
				</div>
				<div class="label-class">
					<span class="f14">业务分类描述：</span>
				</div>
				<div class="input-class">
					<input type="text" id="classDesc" value="" class="form-control" />
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="group.label.creater"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="createName" value="" class="form-control" />
				</div>
				<div class="button-class">
					<button id="search" type="button" class="btn btn-sm btn-info button-middle">查询</button>
				</div>
			</li>
			<HR/>
			<li class="form-group form-group">
				<div class="oper-button">
					<button id="order" type="button" class="btn btn-info btn-sm button-middle">排序</button>
					<button id="add" type="button" class="btn btn-info btn-sm button-middle">新增</button>
				</div>
			</li>
		</ul>
		<ul id="claasifyListPanel" class="classify-list">
			<table id="claasifyListGrid" width="100%"></table>
			<div id="claasifyListGridPager"></div>
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
                <select class="chosen-select form-control" id="classifyProjectId">
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
				业务分类名称
			</label>
			<div class="add-group-list-div col-xs-6">
				<input id="classifyName" type="text" class="form-control validate[required,len[0,95]]">
			</div>
			<div style="clear:both;"></div>
		</div>
		<div class="add-group-dialog">
			<label class="col-xs-3 control-label">
				业务分类描述
			</label>
			<div class="add-group-list-div col-xs-8">
				<textarea id="description" class="form-control validate[required,len[0,395]]" rows="3"></textarea>
			</div>
			<div style="clear:both;"></div>
		</div>
	</div>
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/classify/js/message.js"></script>
<script>
_require(
{
	paths : {
		'classify/list':'${resPath}/resources/platform/resmanage/classify/js/classify-list',
		'classify/order':'${resPath}/resources/platform/resmanage/classify/js/classify-order'
	}
},
'classify/list', function() {}
);
</script>
