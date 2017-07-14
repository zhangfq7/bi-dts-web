<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-common-view.css${css_version}" />

<div class="data-view-grid">
	<table class="table table-bordered table-width table-align">
      <#if type == "1">
        <tr>
         	<td class="table-title"><@spring.message code="data.view.dataType"/></td>
         	<td id="dataType"></td>
         	<td class="table-title"><@spring.message code="data.view.dataName"/></td>
         	<td id="dataName"></td>
         	<td class="table-title"><@spring.message code="data.view.dataNum"/></td>
         	<td id="dataNum"></td>
      	</tr>
        <tr>
	        <td class="table-title"><@spring.message code="data.view.adminName"/></td>
	        <td id="adminName"></td>
	        <td class="table-title"><@spring.message code="data.view.adminTime"/></td>
	        <td id="adminTime"></td>
	        <td class="table-title"><@spring.message code="data.view.lastUpdateTime"/></td>
	        <td id="lastUpdateTime"></td>
     	</tr>
	  <#elseif type == "2">
	  	<tr>
         	<td class="table-title"><@spring.message code="data.view.dataType"/></td>
         	<td id="dataType"></td>
         	<td class="table-title"><@spring.message code="data.view.dbName"/></td>
         	<td id="dbName"></td>
         	<td class="table-title"><@spring.message code="data.view.dataTable"/></td>
         	<td id="dataTable"></td>
      	</tr>
        <tr>
        	<td class="table-title"><@spring.message code="data.view.tableDataName"/></td>
         	<td id="dataName"></td>
        	<td class="table-title"><@spring.message code="data.view.dataNum"/></td>
         	<td id="dataNum"></td>
	        <td class="table-title"><@spring.message code="data.view.adminName"/></td>
	        <td id="adminName"></td>
     	</tr>
     	<tr>
     	 	<td class="table-title"><@spring.message code="data.view.adminTime"/></td>
	        <td id="adminTime"></td>
     		<td class="table-title"><@spring.message code="data.view.lastUpdateTime"/></td>
	        <td id="lastUpdateTime"></td>
	        <td class="table-title"><@spring.message code="data.view.splitType"/></td>
	        <td id="splitType"></td>
     	</tr>
     	<tr>
     	 	<td class="table-title"><@spring.message code="data.view.updatePeriod"/></td>
	        <td id="updatePeriod"></td>
     		<td class="table-title"><@spring.message code="data.view.nextUpdateTime"/></td>
	        <td id="nextUpdateTime"></td>
	        <td class="table-title"><@spring.message code="data.view.storageType"/></td>
	        <td id="storageType"></td>
     	</tr>
      <#elseif type == "4">
      	<tr>
         	<td class="table-title"><@spring.message code="data.view.dataType"/></td>
         	<td id="dataType"></td>
         	<td class="table-title">接口名称</td>
         	<td id="serviceName"></td>
         	<td class="table-title">方法名称</td>
         	<td id="methodName"></td>
      	</tr>
        <tr>
        	<td class="table-title">接口地址</td>
         	<td id="serviceUrl"></td>
        	<td class="table-title">数据表名</td>
         	<td id="dataName"></td>
        	<td class="table-title"><@spring.message code="data.view.dataNum"/></td>
         	<td id="dataNum"></td>
     	</tr>
     	<tr>
        	<td class="table-title">请求参数</td>
        	<td id="paramStr" class="wrap-line" colspan="5"></td>
      	</tr>
     	<tr>
     		<td class="table-title"><@spring.message code="data.view.adminName"/></td>
	        <td id="adminName"></td>
     	 	<td class="table-title"><@spring.message code="data.view.adminTime"/></td>
	        <td id="adminTime"></td>
     		<td class="table-title"><@spring.message code="data.view.lastUpdateTime"/></td>
	        <td id="lastUpdateTime"></td>
     	</tr>
     	<tr>
     	 	<td class="table-title"><@spring.message code="data.view.updatePeriod"/></td>
	        <td id="updatePeriod"></td>
     		<td class="table-title"><@spring.message code="data.view.nextUpdateTime"/></td>
	        <td id="nextUpdateTime"></td>
	        <td class="table-title"><@spring.message code="data.view.storageType"/></td>
	        <td id="storageType"></td>
     	</tr>
      <#elseif type == "5">
	  	<tr>
         	<td class="table-title"><@spring.message code="data.view.dataType"/></td>
         	<td id="dataType"></td>
         	<td class="table-title"><@spring.message code="data.view.dbName"/></td>
         	<td id="dbName"></td>
         	<td class="table-title"><@spring.message code="data.view.dataTable"/></td>
         	<td id="dataTable"></td>
      	</tr>
      	<tr>
     		<td class="table-title">表别名</td>
	        <td id="tableAlias"></td>
     	 	<td class="table-title">日期字段</td>
	        <td id="dateFieldId"></td>
     		<td class="table-title">表类型</td>
	        <td id="tableType"></td>
     	</tr>
     	<tr>
     		<td class="table-title">分表存储类型</td>
	        <td id="tablesStorage"></td>
     	 	<td class="table-title">分表存储字段</td>
	        <td id="storageField"></td>
     		<td class="table-title">最近更新时间</td>
	        <td id="tableTime"></td>
     	</tr>
     	<#elseif type == "7">
     	<tr>
         	<td class="table-title"><@spring.message code="data.view.dataType"/></td>
         	<td id="dataType"></td>
         	<td class="table-title"><@spring.message code="data.view.dbName"/></td>
         	<td id="dbName"></td>
         	<td class="table-title">视图名称</td>
         	<td id="viewName"></td>
      	</tr>
     	<tr>
        	<td class="table-title">视图表对应关系</td>
        	<td id="viewTable" class="wrap-line" colspan="5"></td>
      	</tr>
      	<tr>
        	<td class="table-title">视图关联字段</td>
        	<td id="viewJoin" class="wrap-line" colspan="5"></td>
      	</tr>
      </#if>
      <#if type == "1" || type == "2" || type == "4" || type == "5" || type == "7">
      <tr>
         <td class="table-title"><@spring.message code="data.view.dataDesc"/></td>
         <td id="dataDesc" class="wrap-line" colspan="5"></td>
      </tr>
       </#if>
	</table>
	<ul id="operPanel" class="oper-pane">
		<li class="form-group form-group-sm">
			<#if type == "1" || type == "2" || type == "4" || type == "7">
				<div>
					<button id="downFileButton" type="button" class="btn btn-info btn-sm button-class">
					下载
					</button>
				</div>
			</#if>
		</li>
	</ul>
	<div class="data-grid-info">
		<table id="dataGrid"></table> 
		<div id="dataGridPager"></div>
	</div>
	<input type="hidden" id="downType" value="${type}">
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script src="${resPath}/resources/platform/resmanage/data/js/message.js"></script>
<script>
var dataId = '${dataId}';
var type = '${type}';
_require(
{
	paths : {
		'platform/resmanage/data/data-common-view':'${resPath}/resources/platform/resmanage/data/js/data-common-view'
	}
},
'platform/resmanage/data/data-common-view',function(){}
);
</script>
