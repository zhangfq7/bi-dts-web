<div class="hide" id="dataSource">

	<div class="db-type-project">
        <span class="db-type-span f16">选择对应的租户</span>
		<br/>
		<div class="select-width" >
        <select id="projectId">
		<#list projectList as projectBean>
            <option value="${projectBean.labelCode}">${projectBean.labelName}</option>
		</#list>
        </select>
        </div>
	</div>

	<span class="db-type-span f16"><@spring.message code="data.db.dbSelect"/></span>
	<div class="db-type-pic" id="dbSelect">
		<div class="db-type-border pic" id="postgresql">
			<div class="postgresql-icon"></div>
			<div class="dbCheck hide">
				<i class="fa fa-check"></i>
			</div>
		</div>
		<div class="db-type-border pic" id="db2">
			<div class="db2-icon"></div>
			<div class="dbCheck hide">
				<i class="fa fa-check"></i>
			</div>
		</div>
		<div class="db-type-border pic" id="oracle">
			<div class="oracle-icon"></div>
			<div class="dbCheck hide">
				<i class="fa fa-check"></i>
			</div>
		</div>
		<div class="db-type-border pic" id="mysql">
			<div class="mysql-icon"></div>
			<div class="dbCheck hide">
				<i class="fa fa-check"></i>
			</div>
		</div>
		<div class="db-type-border pic" id="spark">
			<div class="spark-icon"></div>
			<div class="dbCheck hide">
				<i class="fa fa-check"></i>
			</div>
		</div>
	</div>
	<span class="db-type-span f16"><@spring.message code="data.db.dbSoon"/></span>
	<div class="db-type-soon">
		
	</div>
</div>

<div class="hide" id="dbInfo">
	<div class="col-xs-3">
		<div class="icon-div">
			<div id="icon-database" style="margin: 20px 14px;"></div>
		</div>
	</div>
	<div class="col-xs-9" style="border-left: 1px solid #EEEEEE;">
		<form class="form-horizontal validationEngineContainer" role="form" id="dbForm">
			<div class="form-group  form-group-sm">
				<label class="control-label label-left"><@spring.message code="data.db.dbName"/></label>
				<div class="database-name div-left dbName-div">
					<input type="text" class="form-control validate[required,len[0,100],sp[{me:'#|%|<|>|?|$|&|/|\'|\\\\'}]]" id="dbName">
					<input type="hidden" id="dbType" />
				</div>
			</div>
			<div class="form-group  form-group-sm">
				<label class="control-label label-left"><@spring.message code="data.db.dbURL"/></label>
				<div class="div-left dbURL-div">
					<input type="text" class="form-control validate[required,len[0,400]]" id="dbURL">
				</div>
			</div>
			<div class="form-group  form-group-sm">
				<label class="control-label label-left"><@spring.message code="data.db.dbDriver"/></label>
				<div class="div-left dbDriver-div">
					<input type="text" class="form-control validate[required,len[0,100]]" id="dbDriver">
				</div>
			</div>
			<div class="form-group  form-group-sm">
				<label class="control-label label-left"><@spring.message code="data.db.dbUser"/></label>
				<div class="div-left dbUser-div">
					<input type="text" class="form-control validate[required,len[0,40]]" id="dbUser">
				</div>
			</div>
			<div class="form-group  form-group-sm">
				<label class="control-label  label-left"><@spring.message code="data.db.dbPassword"/></label>
				<div class="div-left dbPassword-div">
					<input type="password" class="form-control validate[required,len[0,40]]" id="dbPassword">
				</div>
			</div>
			<div class="form-group  form-group-sm" hidden>
				<label class="control-label  label-left"><@spring.message code="data.db.dbSchema"/></label>
				<div class="div-left dbSchema-div">
					<input type="text" class="form-control validate[required,len[0,40]]" id="dbSchema">
				</div>
			</div>
			<div class="form-group  form-group-sm" hidden>
				<label class="control-label  label-left"><@spring.message code="data.db.dbSpace"/></label>
				<div class="div-left dbSpace-div">
					<input type="text" class="form-control validate[required,len[0,40]]" id="dbSpace">
				</div>
			</div>
			<div class="form-group  form-group-sm" hidden>
				<label class="control-label  label-left"><@spring.message code="data.db.dbAlias"/></label>
				<div class="div-left dbAlias-div">
					<input type="text" class="form-control validate[required,len[0,40]]" id="dbAlias">
				</div>
			</div>
			<div class="form-group  form-group-sm">
				<label class="control-label  label-left"><@spring.message code="data.db.dbInterfaceFlag"/></label>
				<div class="div-left dbInterfaceFlag-div">
					<select type="text" class="form-control validate[required,len[0,40]]" id="dbInterfaceFlag">
						<option value="" selected>请选择</option>
						<option value="0"><@spring.message code="data.db.interface_common"/></option>
						<option value="2"><@spring.message code="data.db.interface_connect"/></option>
					</select>
				</div>
			</div>
			<div class="form-group  form-group-sm">
				<label class="control-label  label-left"><@spring.message code="data.db.dbDesc"/></label>
				<div class="div-left dbDesc-div">
					<textarea id="dbDesc" style="height:80px;" class="form-control validate[required,len[0,400]]"></textarea>
				</div>
			</div>
			<div class="form-group  form-group-sm">
 				<label class="control-label  label-left"><@spring.message code="data.db.isDurable"/></label>
 				<div class="div-left isDurable-div">
					<select type="text" class="form-control validate[required,len[0,40]]" id="isDurable">
 						<option value="" selected>请选择</option>
						<option value="0"><@spring.message code="data.db.isDurable_0"/></option>
						<option value="1"><@spring.message code="data.db.isDurable_1"/></option>
					</select>
				</div>
			</div>
 
			
		</form>
	</div>
</div>
