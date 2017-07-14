<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/navi/css/navi-list.css${css_version}" />
	
<!--start-->
<div class="panel">
	<span class="f16"><@spring.message code="navi.label.title"/></span>
</div>

<div class="panel">
	<div class="tab-content">
		<ul role="tabpanel" class="tab-pane active ">
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="navi.label.level3"/></span>
				</div>
				<div class="search-class">
					<input type="text" id="level3" value="" class="form-control" />
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="navi.label.level1"/></span>
				</div>
				<div class="search-class">
					<select id="level1" style="width:100%;font-size:14px;">
					</select>
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="navi.label.level2"/></span>
				</div>
				<div class="search-class">
					<select id="level2" style="width:100%;font-size:14px;">
					</select>
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="navi.label.creater"/></span>
				</div>
				<div class="search-class">
					<input type="text" id="creater" value="" class="form-control" />
				</div>
			</li>
			<li class="form-group form-group-sm">
				<div class="label-class">
				&nbsp;	
				</div>
				<div class="search-class">
					<input type="text" value="" class="form-control" style="visibility:hidden;"/>
				</div>
				<div class="label-class">
				&nbsp;		
				</div>
				<div class="search-class">
					<input type="text" value="" class="form-control" style="visibility:hidden;"/>
				</div>
				<div class="label-class">
				&nbsp;		
				</div>
				<div class="search-class">
					<input type="text" value="" class="form-control" style="visibility:hidden;"/>	
				</div>
				<div class="label-class">
				&nbsp;		
				</div>
				<div class="search-class">
					<button id="search" type="button" class="btn btn-sm btn-info button-middle"><@spring.message code="navi.button.search"/></button>
				</div>
			</li>
			<HR/>
			<li class="form-group form-group">
				<div class="oper-button">
					<button id="add" type="button" class="btn btn-info btn-sm button-middle"><@spring.message code="navi.button.add"/></button>
					<button id="edit" type="button" class="btn btn-info btn-sm button-middle"><@spring.message code="navi.button.edit"/></button>
					<button id="delete" type="button" class="btn btn-danger btn-sm button-middle"><@spring.message code="navi.button.delete"/></button>
				</div>
			</li>
		</ul>
		<ul id="naviListPanel" class="navi-list">
			<li id="naviList">
				<table id="naviTree" style="width:100%"></table>
			</li>
		</ul>
	</div>
</div>
	

<div style="display:none;">
	<div id="add-page" class="validationEngineContainer">
		<div class="add-navi-dialog" id="level1CreateMenu">
			<label class="col-xs-3 control-label">
				<@spring.message code="navi.label.parentNaviName" />
			</label>
			<div class="add-group-list-div col-xs-6">
				<input id="parentNaviName" type="text" class="form-control" disabled="disabled" value="">
			</div>
			<div style="clear:both;"></div>
		</div>
		<div class="add-navi-dialog" id="level1addMenu">
			<label class="col-xs-3 control-label">
				<@spring.message code="navi.label.parentNaviName" />
			</label>
			<div class="add-group-list-div col-xs-6">
				<select id="level1add" class="level1add form-control">
				</select>
			</div>
			<div style="clear:both;"></div>
		</div>
		<div class="add-navi-dialog">
			<label class="col-xs-3 control-label">
				<@spring.message code="navi.label.navi.Name" />
			</label>
			<div class="add-navi-list-div col-xs-6">
				<input id="naviName" type="text" class="form-control validate[required,len[0,95]]">
			</div>
			<div style="clear:both;"></div>
		</div>
		<div class="add-navi-dialog">
			<label class="col-xs-3 control-label">
				<@spring.message code="navi.label.navi.Dec" />
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
				'resmanage/navi/naviInfo': '${resPath}/resources/platform/resmanage/navi/js/navi-list',
				'navi/message':'${resPath}/resources/platform/resmanage/navi/js/message'
			}
		},
		'resmanage/navi/naviInfo', function() {}
	);
</script>