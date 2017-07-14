<#include "/view/platform/frame/bace/top.ftl">
	<link rel="stylesheet" href="${resPath}/resources/platform/openapi/css/openapi-list.css${css_version}" />
	<!--start-->
	<div class="panel f16" style="padding: 10px;">
		Open API
	</div>
	<div class="panel data-grid-info">
		<table id="openApiList"></table>
	</div>
	<div id="dialogContent" style="width:100%;display: none ">
		<table style="width:100%">
			<tr>
				<td class="dialog-content-label"><label class="control-label f14">接口名称：</label></td>
				<td colspan="3"><label class="control-label f14" id="apiName"></label></td>
			</tr>
			<tr>
				<td class="dialog-content-label"><label class="control-label f14">请求参数：</label></td>
				<td colspan="3">
					<div id="param-div">
						<table style="width:100%" id="param-table">
						</table>
					<div>
				</td>
			</tr>
			<tr>
				<td class="dialog-content-label"><label class="control-label f14">返回结果：</label></td>
				<td colspan="3">
					<div class="result-div" style="height:100%" id="resultDiv">
					<div>
				</td>
			</tr>
			<tr>
				<td class="dialog-content-label"><label class="control-label f14">表名称：</label></td><td colspan="3"><input id="tableName" type="text" class="form-control" /></td>
			</tr>
			<tr>
				<td class="dialog-content-label"><label class="control-label f14">更新周期：</label></td>
				<td style="width:25%;padding:4px 0px;">
					<select id="updateType" class="chosen-select">
						<option value="I">立即更新</option>
						<option value="S">更新一次</option>
						<option value="D">每日更新</option>
						<option value="W">每周更新</option>
						<option value="M">每月更新</option>
					</select>
				</td>
				<td class="dialog-content-label"><label class="control-label f14 first-update-time">下次更新时间：</label></td>
				<td style="width:20%">
					<div style="position:relative" class="first-update-time">
						<input type='text' style="cursor:pointer" class="form-control" id='firstUpdateTime' />
					</div>
				</td>
			</tr>		
			<tr>
				<td class="dialog-content-label"><label class="control-label f14">业务分类：</label></td>
				<td style="width:25%">
					<select id="businessType" class="chosen-select">
					</select>
				</td>
				<td class="dialog-content-label"><label class="control-label f14 storage-type">存储方式：</label></td>
				<td style="width:20%;" class="storage-type">
					<select id="storageType" data-placeholder="请选择存储方式" class="chosen-select">
						<option value="" selected></option>
						<option value="1">存入前删除历史数据</option>
						<option value="2">存入前保留历史数据</option>
					</select>
				</td>
			</tr>
			<tr>
				<td class="dialog-content-label"><label class="control-label f14">描述：</label></td>
				<td colspan="3">
					<textarea id="description" class="form-control f14" style="width:100%" rows="3"></textarea>
				</td>
			</tr>
			<tr>
				<td colspan="4" style="text-align:right">
					<label id="tip" class="control-label f14" style="color:red;display:none"></label>
				</td>
			</tr>
		</table>
	</div>
	<input type="hidden" id="ApiCode" value="${ApiCode}">
	<#include "view/platform/frame/bace/bottom.ftl">
<script>

	var ApiCode = '${ApiCode}';
	
	_require({
			paths: {
				'openapi-list': '${resPath}/resources/platform/openapi/js/openapi-list'
			}
		},'openapi-list',function(openapiList) {
		
		});
</script>