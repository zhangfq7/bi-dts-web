<div class="formatBox" id="tableTimePanel">
	<table id="tableForm" class="table-info-pane validationEngineContainer">
		<tr class="form-group form-group-sm ">
			<td class="label-class">
				<span class="f14">ETL数据库：</span>
			</td>
		    <td class="input-class">
		    	<select class="display validate[required]" id="etlDbId">
		    		<option value="">请选择 </option>
		    		<#list dbList as db>
		    			<#if etlDbId=="${db.dbId}">
		    				<option value="${db.dbId}" selected>${db.dbName}</option>
		    			<#else>
 							<option value="${db.dbId}">${db.dbName} </option>
 						</#if>
  					</#list>
  				</select>
		    </td>
		 </tr>
		 <tr class="form-group form-group-sm ">
		 	<td class="label-class">
				<span class="f14">数据日期查询SQL：</span>
			</td>
		    <td class="desc-class">
		        <textarea type="text" class="display validate[required,len[1,1000]]" rows="4"  placeholder="请输入数据日期查询SQL" 
		        id="tableTimeSql">${tableTimeSql}</textarea>
		    </td>
		</tr>
	</table>
		
	<div class="formatContent">
		   <ul class="desc-ul">
			       <tr><span class="f10 red">注意：查询SQL语句无需添加分号结尾,查询结果只取第一行第一列</span></tr>
			       <tr><span class="f10 red">列数据(对于oracle,DB2数据库,系统会自动给sql带上取第一行</span></tr>
			       <tr><span class="f10 red">限制条件，无需再增加),数据日期格式为'yyyy-mm'或'yyyy-mm-</span></tr>
			       <tr><span class="f10 red">dd';系统将会定期调用数据日期查询SQL,更新数据日期。</span></tr>
			</ul>
	</div>
</div>



