<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-list.css${css_version}" />
<div class="data-link-show">
	<div class="link-div">
		<table class="link-table" cellpadding="0" cellspacing="0">
			<tbody>
				<tr>
					<td class="title-td"><@spring.message code="data.dataLink.label.dataName"/></td>
					<td class="content-td name-td"></td>
					<td class="title-td"><@spring.message code="data.dataLink.label.isUpdate"/></td>
					<td class="content-td update-td"></td>
				</tr>
				<tr>
					<td class="title-td"><@spring.message code="group.label.creater"/></td>
					<td class="content-td create-td"></td>
					<td class="title-td"><@spring.message code="data.link.show.createTime"/></td>
					<td class="content-td create-time-td"></td>
				</tr>
				<tr>
					<td class="title-td"><@spring.message code="data.link.show.dataNum"/></td>
					<td class="content-td num-td"></td>
					<td class="title-td"><@spring.message code="data.link.show.dataUpdateTime"/></td>
					<td class="content-td data-update-td"></td>
				</tr>
				<tr>
					<td class="title-td"><@spring.message code="data.link.show.dataLink"/></td>
					<td colspan="3" class="desc-td datalink-td"></td>
				</tr>
				<tr>
					<td class="title-td"><@spring.message code="data.link.show.dataDesc"/></td>
					<td colspan="3" class="desc-td desc-content"></td>
				</tr>
			</tbody>
		</table>
	</div>
	<ul id="operPanel" class="oper-pane">
		<li class="form-group form-group-sm">
			<div>
				<button id="downFileButton" type="button" class="btn btn-info btn-sm button-class">
				下载
				</button>
			</div>
		</li>
	</ul>
	<div class="r-grid">
		<table id="resultShowDataGrid"></table>
		<div id="jqGridPagerTempShow"></div>
	</div>
	<input type="hidden" id="downType" value="3">
<div>
<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/data/js/message.js"></script>
<script>
var dataLinkId = '${dataLinkId}';
_require(
{
	paths : {
		'dataLinkShow':'${resPath}/resources/platform/resmanage/data/js/data-link-show'
	}
},
'dataLinkShow',function(linkshow){
	linkshow.setDataId(dataLinkId);
	linkshow.init();
});
</script>