<#include "view/platform/frame/bace/top.ftl">

<link rel="stylesheet" href="${resPath}/bace/js/webuploader/css/webuploader.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-manage.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/user-select.css${css_version}" />
<!--start-->
<div class="panel">
	<span class="f16">数据源管理</span>
</div>

<div class="panel mypanel">
	<ul id="searchPanel" class="tab-pane">
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14">数据名称：</span>
			</div>
	    	 <div class="col-xs-3 input-group input-group-sm">
				      <input type="text" class="form-control input-sm" id="dbNameText">
				      <span class="input-group-btn input-group-sm">
				        <button class="btn btn-default btn-sm theme-background theme-border-color" type="button" id="searchButton">搜索</button>
				      </span>
	    	 </div>  
		</li>
		</ul>
		<HR/>
			<ul class="tab-pane">
				<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14">数据来源：</span>
			</div>
					<div class="btn-group search-btn-group data-manage-btn">
						<button type="button" class="btn btn-sm btn-default clickedButton theme-background" flag="">
							全部
						</button>
						<button type="button" class="btn btn-sm btn-default normal-button" flag="oracle">
							oracle
						</button>
						<button type="button" class="btn btn-sm btn-default normal-button" flag="db2">
							db2
						</button>
						<button type="button" class="btn btn-sm btn-default normal-button" flag="mysql">
							mysql
						</button>
						<button type="button" class="btn btn-sm btn-default normal-button last-button" flag="postgresql">
							postgresql
						</button>
						<button type="button" class="btn btn-sm btn-default normal-button last-button" flag="spark">
							spark
						</button>
					</div>
		</li>
		</ul>
	<HR/>
	<ul id="operPanel" class="oper-pane">
		<li class="form-group form-group-sm">
				<#--<button id="selectDatabase" type="button" class="btn btn-info btn-sm button-class">选择数据库</button>-->
				<button id="addDMButton" type="button" class="btn btn-info btn-sm button-class">手工添加数据库</button>
		</li>
	</ul>
	<ul id="listPanel" class="list-pane">
		<li id="dataList">
			<table id="dataListGrid" style="width:100%"></table>
			<div id="dataListGridPager"></div>
    	</li>
	</ul>
</div>


<#include "view/platform/frame/bace/bottom.ftl">
<script>
	_require({
			paths: {
				'data-manage':'${resPath}/resources/platform/resmanage/data/js/data-manage',
				'upload':'${resPath}/bace/js/webuploader/js/webuploader',
				'dbSource':'${resPath}/resources/platform/resmanage/data/js/data-db',				
				'data-message':'${resPath}/resources/platform/resmanage/data/js/message',	
				'userSelect':'${resPath}/resources/platform/resmanage/data/js/user-select',	
				'radialIndicator':'${resPath}/resources/platform/resmanage/data/js/radialIndicator',
										
												
			}
		},
		'data-manage', function(list) {
			list.init();
		}
	);
</script>
