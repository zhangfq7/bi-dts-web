<#include "view/platform/frame/bace/top.ftl">

<link rel="stylesheet" href="${resPath}/bace/js/webuploader/css/webuploader.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-downfile.css${css_version}" />
<!--start-->
<div class="panel">
	<span class="f16">文件下载</span>
</div>

<div class="panel mypanel">
	<ul id="searchPanel" class="tab-pane">
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14">文件名称：</span>
			</div>
	    	 <div class="col-xs-3 input-group input-group-sm">
				      <input type="text" class="form-control input-sm" id="fileName">
				      <span class="input-group-btn input-group-sm">
				        <button class="btn btn-default btn-sm theme-background theme-border-color" type="button" id="searchButton">搜索</button>
				      </span>
	    	 </div>  
		</li>
		</ul>
		<HR/>
			<ul id="operPanel" class="oper-pane">
		<li class="form-group form-group-sm">
			<div>
				<button id="batchDelFile" type="button" class="btn btn-info btn-sm button-class">删除</button>
			</div>
		</li>
	</ul>
	<ul id="listPanel" class="list-pane">
		<li id="downFileList">
			<table id="downFileListGrid" style="width:100%"></table>
			<div id="downFileListGridPager"></div>
    	</li>
	</ul>
</div>


<#include "view/platform/frame/bace/bottom.ftl">
<script>
	_require({
			paths: {
				'data-downfile':'${resPath}/resources/platform/resmanage/data/js/data-downfile',
				'upload':'${resPath}/bace/js/webuploader/js/webuploader',
				'data-message':'${resPath}/resources/platform/resmanage/data/js/message',	
												
			}
		},
		'data-downfile', function(list) {
			list.init();
		}
	);
</script>
