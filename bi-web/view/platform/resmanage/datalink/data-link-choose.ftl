<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-link-choose.css${css_version}" />
<div class="panel panel-default">
		<div class="panel-heading col-right-head">
			<form class="form-inline" id="dataseachForLink">
				<div class="form-group form-group-sm" style="float:left">
					<label for="dataNameSearch" class="control-label col-right-label"><@spring.message code="data.dataLink.label.dataName"/></label>
					<input id="dataNameSearch" class="form-control input-sm validate[sp,len[1,100]" type="text"/>
					<label class="control-label col-right-label"><@spring.message code="data.dataLink.label.fieldSource"/></label>
				</div>
				<div class="col-chosen">
					<select class="chosen-select" id="dataTypeSelect">
						<option value=""><@spring.message code="home.setting.button.all"/></option>
						<option value="0"><@spring.message code="data.dataLink.label.file"/></option>
						<option value="1"><@spring.message code="data.dataLink.label.datatable"/></option>
					</select>
				</div>
				<button type="button" id="searchDL" class="btn btn-info col-right-button btn-sm"><@spring.message code="home.setting.button.search"/></button>
				<div class="col-left-clear"></div>
			</form>
		</div>
		<div class="r-grid">
			<table id="dataGrid"></table> 
			<div id="jqGridPagerTemp"></div>
		</div>
</div>
