<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-contcat.css${css_version}" />
<div class="bodyDiv">
	<div class="dimenFilterDiv">
		<div id="interval" class="filterText2 filterText-bg">
			<@spring.message code="data.dim.queryDimFilter"/>
		</div>
		<div style="clear:both;"></div>
	</div>
</div>
<div id="dimenDiv" style="text-align:center;margin-top:10px">
	<input type="text" id="bztree_input" class="bi-input" />
	
	<div id="mDimTree" class="treeMenu" style="position: absolute;left:290px;margin-top:5px">
		<div class="treefilterPanel no-select">
			<div class='group'>
				<input class='filterInput' placeholder='请输入搜索内容' />
			</div>
			<button class='filterButton no-select ladda-button' data-spinner-color='#66afe9' data-style='slide-left'>
				<span class='ladda-label'><@spring.message code="group.button.search"/></span>
			</button>
		</div>
		<ul id="zDimTree" class="ztree no-select" style="margin-top: 0;width: 180px;height: 200px;">
		</ul>
		<div class="treeToolPanel no-select" zTreeId="zDimTree">
			<div class="checkAllNodes"><@spring.message code="data.dim.selectAll"/></div>
			<div class="removeAllNodes"><@spring.message code="data.dim.clearAll"/></div>
		</div>
		<div class="treeNoResultPanel" style="display:none;">
			<@spring.message code="data.dim.noDimensions"/>
		</div>
		<div class="ztree-loading" style="position:absolute;bottom:0;right:0;left:0;top:0;background:rgba(135, 206, 250, .3);z-index:99999999;display:none"></div>
	</div>
</div>