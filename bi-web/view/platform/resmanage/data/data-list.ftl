<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-list.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/user-select.css${css_version}" />

<div class="data-top">
	<div class="data-search">
		<div class="data-search-wraper">
			<div class="data-search-title">
				<span class="search-name f14">工作表名称：</span>
			</div>
			<div class="div-search-input">
				<input id="dataName" class="form-control input-sm f12" type="text"/>
			</div>
			<button type="button" id="dataSearch" class="btn btn-info btn-sm f12">搜索</button>
		</div>
		<div id="addSource" class="data-add-source theme-background theme-border-color" title="添加数据源">
			<div class="data-add-icon"></div>
		</div>
	</div>
	
	<div class="data-classify-all">
		<div class="data-all-title f14">
			<span>过滤条件</span>
			<i class="fa fa-angle-right"></i>
		</div>
		<div class="data-condition f14"></div>
		<div id="searchFilter" class="data-search-filter">
			<span id="filterText" class="f14">收起筛选</span>
			<i id="filterIcon" class="fa fa-angle-up f14"></i>
		</div>
	</div>
	
	<div id="dataFilter">
		<div class="data-service-type f14">
			<div class="data-classify-title">
				<span>业务类型：</span>
			</div>
			<div class="data-items data-items-address" name="dataService">
			</div>
			<div class="data-multi-select f14" name="data-service-type">
				<span>多选</span>
			</div>
			<div class="data-items-more f14 hide">
				<span id="moreText">更多</span>
				<i id="moreIcon" class="fa fa-caret-down"></i>
			</div>
			<div class="data-select-button hide">
				<button class="btn btn-info f14 data-multi-submit">提交</button>
				<button class="btn btn-default f14 data-multi-cancel">取消</button>
			</div>
		</div>
		
		<div class="data-source-type f14">
			<div class="data-classify-title">
				<span>数据来源类型：</span>
			</div>
			<div class="data-items" name="dataSource">
				<div class="condition-items" value="1">
					<div class="data-select-check hide">
						<i class="fa fa-square-o"></i>
					</div>
					<span>上传文件</span>
				</div>
				<div class="condition-items" value="2">
					<div class="data-select-check hide">
						<i class="fa fa-square-o"></i>
					</div>
					<span>数据库</span>
				</div>
				<div class="condition-items" value="4">
					<div class="data-select-check hide">
						<i class="fa fa-square-o"></i>
					</div>
					<span>OpenApi</span>
				</div>
				<div class="condition-items" value="3">
					<div class="data-select-check hide">
						<i class="fa fa-square-o"></i>
					</div>
					<span>数据关联</span>
				</div>
			</div>
			<div class="data-multi-select f14" name="data-source-type">
				<span>多选</span>
			</div>
			<div class="data-select-button hide">
				<button class="btn btn-info f14 data-multi-submit">提交</button>
				<button class="btn btn-default f14 data-multi-cancel">取消</button>
			</div>
		</div>
		
		<div class="data-update-type f14">
			<div class="data-classify-title">
				<span>更新周期：</span>
			</div>
			<div class="data-items data-items-address" name="dataUpdate">
				<div class="condition-items" value="1">
					<div class="data-select-check hide">
						<i class="fa fa-square-o"></i>
					</div>
					<span>不更新</span>
				</div>
				<div class="condition-items" value="D">
					<div class="data-select-check hide">
						<i class="fa fa-square-o"></i>
					</div>
					<span>按日</span>
				</div>
				<div class="condition-items" value="W">
					<div class="data-select-check hide">
						<i class="fa fa-square-o"></i>
					</div>
					<span>按周</span>
				</div>
				<div class="condition-items" value="M">
					<div class="data-select-check hide">
						<i class="fa fa-square-o"></i>
					</div>
					<span>按月</span>
				</div>
			</div>
			<div class="data-multi-select f14"  name="data-update-type">
				<span>多选</span>
			</div>
			<div class="data-select-button hide">
				<button class="btn btn-info f14 data-multi-submit">提交</button>
				<button class="btn btn-default f14 data-multi-cancel">取消</button>
			</div>
		</div>
		
		<div class="data-order-type f14">
			<div class="data-classify-title">
				<span>升降排序：</span>
			</div>
			<div id="orderType" class="data-items data-items-address">
				<span name="lastUpdate">最近更新时间</span>
				<span name="hotRank">热度等级</span>
				<span name="createTime">创建时间</span>
			</div>
		</div>
	</div>
</div>

<!--loading-->
<div class="data-list-loading"></div>

<!--数据-->
<div class="data-list">
	<div id="dataList">
		<ul class="list-unstyled data-list" id="dataUl">
		</ul>
	</div>
	<div class="row page">
	     <div id="page" class="m-pagination"></div>
	</div>
</div>

<!--返回订部-->
<div class="actGotop"><a href="javascript:;" title="返回顶部"></a></div>

<!--添加按钮-->
<div class="hide">
	<div id="sourceDialog" class="f14">
		<div class="data-file">
			<div class="data-file-hide data-hide"></div>
			<div class="data-file-show data-show hide"></div>
			<span>本地数据文件</span>
		</div>
		<div class="data-openapi">
			<div class="data-openapi-hide data-hide"></div>
			<div class="data-openapi-show data-show hide"></div>
			<span>OpenApi</span>
		</div>
		<div class="data-table">
			<div class="data-table-hide data-hide"></div>
			<div class="data-table-show data-show hide"></div>
			<span>抽取表</span>
		</div>
        <div class="data-table-direct">
            <div class="data-table-direct-hide data-hide"></div>
            <div class="data-table-direct-show data-show hide"></div>
            <span>直连表</span>
        </div>
		<div class="data-dacp">
			<div class="data-dacp-hide data-hide"></div>
			<div class="data-dacp-show data-show hide"></div>
			<span>PaaS</span>
		</div>
		<div class="table-view">
			<div class="table-view-hide data-hide"></div>
			<div class="table-view-show data-show hide"></div>
			<span>视图</span>
		</div>
	</div>
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/data/js/message.js"></script>
<script>
_require(
{
	paths : {
		'platform/resmanage/data/data-list':'${resPath}/resources/platform/resmanage/data/js/data-list',
		'radialIndicator':'${resPath}/resources/platform/resmanage/data/js/radialIndicator',
		'userSelect':'${resPath}/resources/platform/resmanage/data/js/user-select'
	}
},'platform/resmanage/data/data-list',function(){}
);
</script>