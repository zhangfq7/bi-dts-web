<!--start-->
<div class="validationEngineContainer" style="padding: 10px;">
	<form class="form-horizontal">
		<fieldset>
		   <div class="form-group form-group-sm user-info-pl25 user-info-lft ">
				<table>
				 	<tr>
				 		<td class="avatar-content">
				 			 <div id="cropImageDiv">
								 	<img class="avatar"/>
							 </div>
							 <div id="uploadProgress">50%</div>
				 		</td>
				 	</tr>
				 	<tr>
				 		<td >
							<div id="picker" ><@spring.message code="user.useredit.button.changeImg"/></div>
				 		</td>				 	
				 	</tr>
				 	<tr>
				 		<td class="avatar-content"  id="preview-td">
						      <div class="preview-container">
							      	<img id="preview" style="width:70px;" />
						      </div>
				 		</td>
				 	</tr>
				</table>
				
				
			</div>
			
			<div class="user-info-rgt validationEngineContainer">
			   <#if userInfoBean?exists>
					<div class="form-group form-group-sm">
						<label for="userName" class="col-sm-3 control-label1"><@spring.message code="user.label.userId"/></label>
						<div class="col-sm-5 infoRow">
							
								<input type="text" disabled="disabled" value="${userInfoBean.userId}" class="form-control" id="paneluserId">
								
						</div>
					</div>
				</#if>
				<div class="form-group form-group-sm" >
					<label for="userName" class="col-sm-3 control-label1"><@spring.message code="user.label.userName"/></label>
					<div class="col-sm-5 infoRow">
						<#if userInfoBean?exists>
							<input type="text" class="form-control validate[required,len[1,75]] " id="paneluserName" value="${userInfoBean.userName}"  placeholder="<@spring.message code="user.useredit.label.userName"/>"><span  class="span-redstart">*</span>
							<#else>
							<input type="text" class="form-control validate[required,len[1,75]]" id="paneluserName" placeholder="<@spring.message code="user.useredit.label.userName"/>"><span  class="span-redstart">*</span>
						</#if>
					</div>
				</div>
				<div class="form-group form-group-sm" >
					<label for="userName" class="col-sm-3 control-label1"><@spring.message code="user.useredit.label.birthday"/></label>
					<div class="col-sm-5 birDiv">
						
						
						<div class="parent-select search-class">
							<select id="select-year" class="birthday-select">
							</select>	
						</div>
						<div class="parent-date"><label class="control-label-birth f14"><@spring.message code="user.label.year"/></label></div>
						<div class="parent-select search-class">
							<select id="select-month" class="birthday-select">
							</select>
						</div>
						<div class="parent-date"><label class="control-label-birth f14"><@spring.message code="user.label.month"/></label></div>
						<div class="parent-select search-class" id="select-day-parent">
							<select id="select-day" class="birthday-select">
							</select>	
						</div>	
						<div class="parent-date"><label class="control-label-birth f14"><@spring.message code="user.label.day"/></label></div>
						
						
					</div>
				</div>
				<div class="form-group form-group-sm" >
					<#if userInfoBean?exists>
						<input type="hidden" id="depIdShow" value="${userInfoBean.depId}">
						<input type="hidden" id="depName" value="${userInfoBean.depName}">
					</#if>
					<label for="add-dep" class="col-sm-3 control-label1"><@spring.message code="user.userlist.label.deptName"/></label>
					<div class="col-sm-5 infoRow">
						<input id="add-dep" value="" type="text" class="form-control validate[required]" /><span  class="span-redstart">*</span>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="gender" class="col-sm-3 control-label1"><@spring.message code="user.userlist.button.sex"/></label>
					<div class="col-sm-5" style="width: 300px;">
					
						<label class="control-label-gender">
							<i class="fa fa-square-o checkBox" id="mail" sex2="1"></i><span class="radio-label"> <@spring.message code="user.useredit.label.male"/></span>&nbsp;&nbsp;
							<i class="fa fa-square-o checkBox" id="femail" sex2="0"></i><span class="radio-label"> <@spring.message code="user.useredit.label.female"/></span> &nbsp;&nbsp;
							<i class="fa fa-square-o checkBox" id="unknown" sex2="9"></i><span class="radio-label"> <@spring.message code="user.useredit.label.unknown"/></span> 
						</label>
					
						
					</div>
				</div>
				<#if !userInfoBean?exists || isSuper == -1>
				<div class="form-group form-group-sm add-job" >
					<label for="role" class="col-sm-3 control-label1"><@spring.message code="user.userlist.label.job"/></label>
					<div class="col-sm-5">
						<select class="chosen-select chosen-width" id="add-job-id">
							<#list jobInfoList as JobInfoBean>
								<#if userInfoBean ?? &&  userInfoBean.jobIds==JobInfoBean.jobId>
					            	<option selected="selected" value="${JobInfoBean.jobId}">${JobInfoBean.jobName}</option>
					            <#else>
					            	<option value="${JobInfoBean.jobId}">${JobInfoBean.jobName}</option>
								</#if>
			            	</#list> 
		             	</select>
					</div>
				</div>
				</#if>
				<div class="form-group form-group-sm">
					<label for="phone" class="col-sm-3 control-label1"><@spring.message code="user.userlist.label.mobile"/></label>
					<div class="col-sm-5 infoRow">
					   <#if !userInfoBean?exists || isSuper == -1>
							<#if userInfoBean?exists>
								<input type="text" class="form-control validate[required,custom[phone]]" id="panelmobile_num"  value="${userInfoBean.mobileNum}" placeholder="<@spring.message code="user.useredit.enterMobileNum"/>"><span  class="span-redstart">*</span>
								<#else>
								<input type="text" class="form-control validate[required,custom[phone]]" id="panelmobile_num"  placeholder="<@spring.message code="user.useredit.enterMobileNum"/>"><span  class="span-redstart">*</span>
							</#if>
						 <#else>
						 <input type="text" disabled class="form-control validate[required,custom[phone]]" id="panelmobile_num"  value="${userInfoBean.mobileNum}" placeholder="<@spring.message code="user.useredit.enterMobileNum"/>"><span  class="span-redstart">*</span>
					   </#if>
					</div>
				</div>
				
				<div class="form-group form-group-sm">
					<label for="email" class="col-sm-3 control-label1"><@spring.message code="user.userlist.button.email"/></label>
					<div class="col-sm-5 infoRow">
					     <#if !userInfoBean?exists || isSuper == -1>
							<#if  userInfoBean?exists>
								<input type="email" class="form-control validate[required,custom[email],maxSize[30]]" id="panelemail" value="${userInfoBean.email}" placeholder="<@spring.message code="user.useredit.label.emali"/>"><span  class="span-redstart">*</span>
								<#else>
								<input type="email" class="form-control validate[required,custom[email],maxSize[30]]" id="panelemail" placeholder="<@spring.message code="user.useredit.label.emali"/>"><span  class="span-redstart">*</span>
							</#if>
						   <#else>
						 <input type="email" disabled class="form-control validate[required,custom[email],maxSize[30]]" id="panelemail" value="${userInfoBean.email}" placeholder="<@spring.message code="user.useredit.label.emali"/>"><span  class="span-redstart">*</span>
					   </#if>
					</div>
				</div>
				
				<div class="form-group form-group-sm signRow">
					<label for="sign" class="col-sm-3 control-label1"><@spring.message code="user.label.signature"/></label>
					<div class="col-sm-5 infoRow">
						<#if userInfoBean?exists>
							<textarea class="form-control validate[maxSize[1500]]" rows="4" id="sign" placeholder="<@spring.message code="user.useredit.label.signature"/>">${userInfoBean.bardianSign}</textarea>
							<#else>
							<textarea class="form-control validate[maxSize[1500]]" rows="4" id="sign" placeholder="<@spring.message code="user.useredit.label.signature"/>"></textarea>
						</#if>
					</div>
				</div>
				
				 <#if userInfoBean?exists && isSuper != -1>
				  <div style="margin-top:10px">
				   <@spring.message code="user.label.tip"/>  <a style="text-decoration:underline" target="_blank"  href="${webpath}/platform/sysmanage/user/safety/manage_user"><span><@spring.message code="user.label.accountSecurity"/></span></a>
				  </div>
				 </#if>
			</div>
			
		</fieldset>
		
	</form>
</div>
<script>
   <#if userInfoBean?exists>
	var birthday2='${userInfoBean.birthday}';
	var sex2='${userInfoBean.sex}';
	var userInfoBeanId = '${userInfoBean.userId}';
    <#else>
	var birthday2='';
	var sex2='';
	var userInfoBeanId = '';
    </#if>
</script>
