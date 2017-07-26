<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/bace/js/webuploader/css/webuploader.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/user/css/user-info.css${css_version}" />

<ol class="breadcrumb panel" style="padding: 10px;">
  <li class="active f16"><@spring.message code="top.label.userInfo"/></li>
</ol>
<div class="panel" style="padding: 10px;">
	<div class="div-container">
			<div class="div-left validationEngineContainer">
				<table>
					<tr>
						<td class="table-label"><label class="control-label f14"><@spring.message code="user.label.userId"/></label></td>
						<td><label class="control-label f14">${userBean.userID}</label></td>
					</tr>		
					<tr>
						<td class="table-label"><label class="control-label f14"><@spring.message code="user.label.userName"/></label></td>
						<td><input type="text" class="form-control validate[required,len[1,30]]" id="userName" value="${userBean.userName}"></td>
					</tr>
					<tr style="display: none;">
						<td class="table-label"><label class="control-label f14"><@spring.message code="user.label.sex"/></label></td>
						<td style="padding-top:5px">
							<label class="control-label f14">
								<i class="fa fa-square-o checkBox" id="male"></i><span class="radio-label"> <@spring.message code="user.label.male"/></span>  &nbsp;&nbsp;
								<i class="fa fa-square-o checkBox" id="female"></i><span class="radio-label"> <@spring.message code="user.label.female"/></span> &nbsp;&nbsp;
								<i class="fa fa-square-o checkBox" id="unknown"></i><span class="radio-label"> <@spring.message code="user.label.unknown"/></span> 
							</label>
						</td>
					</tr>
					<tr style="display: none;">
						<td class="table-label"><label class="control-label f14"><@spring.message code="user.label.birthday"/></label></td>
						<td>
							<div class="parent-select">
								<select id="select-year" class="birthday-select">
								</select>	
							</div>
							<div class="parent-date"><label class="control-label f14"><@spring.message code="user.label.year"/></label></div>
							<div class="parent-select">
								<select id="select-month" class="birthday-select">
								</select>
							</div>
							<div class="parent-date"><label class="control-label f14"><@spring.message code="user.label.month"/></label></div>
							<div class="parent-select" id="select-day-parent">
								<select id="select-day" class="birthday-select">
								</select>	
							</div>	
							<div class="parent-date"><label class="control-label f14"><@spring.message code="user.label.day"/></label></div>												
						</td>
					</tr>
					<#if userBean.companyFlag == "1">
						<tr style="display: none;">
							<td class="table-label"><label class="control-label f14"><@spring.message code="user.label.companyName"/></label></td>
							<td><label class="overdisplay control-label f14 ">${userBean.companyName}</label></td>
						</tr>
						<tr style="display: none;">
							<td class="table-label"><label class="control-label f14"><@spring.message code="user.label.dep"/></label></td>
							<td><label class="overdisplay control-label f14">${userBean.depName}</label></td>
						</tr>
						<tr style="display: none;">
							<td class="table-label"><label class="control-label f14"><@spring.message code="user.label.job"/></label></td>
							<td>
								<label class="control-label f14">
									<#list userJobList as job>
										${job.jobName}
										<#if job_has_next>
											，
										</#if>
									</#list>
								</label>
							</td>
						</tr>					
					</#if>
					<tr>
						<td class="table-label" style="vertical-align: top;"><label class="control-label f14"><@spring.message code="user.label.signature"/></label></td>
						<td style="padding-top:13px;"><textarea id="bardianSign" class="form-control f14 validate[len[0,666]]" style="width:500px" rows="3">${userBean.bardianSign}</textarea></td>
					</tr>
					<tr>
						<td colspan="2" class="table-label">
								<label class="control-label f14"><@spring.message code="user.label.tip"/>  <a style="text-decoration:underline" tag href="${webpath}/platform/sysmanage/user/safety/manage_user"><span><@spring.message code="user.label.accountSecurity"/></span></a></label>
						</td>
					
					</tr>
				</table>
			</div>
			<div class="div-right">
				<table>
				 	<tr>
				 		<td class="avatar-label"><label class="control-label  f14"><@spring.message code="user.label.avatar"/></label></td>
				 		<td class="avatar-content" style="position:relative">
				 			 <div id="cropImageDiv">
							 	<img class="avatar" src="${webpath}/platform/readUserImg/OVERVIEW_SYS"/>
							 </div>
							 <div id="uploadProgress">50%</div>
				 		</td>
				 	</tr>
				 	<tr>
				 		<td></td>
				 		<td style="text-align:center;padding-top:5px;">
							<div id="picker" style="font-size:15px;padding:0px"><@spring.message code="user.label.changeAvatar"/></div>
				 		</td>				 	
				 	</tr>
				 	<tr>
				 		<td class="avatar-label"><label class="control-label  f14"><@spring.message code="user.label.preview"/></label></td>
				 		<td class="avatar-content" style="vertical-align: top;" id="preview-td">
						      <div class="preview-container">
						      	<img id="preview" style="width:70px;" src="${webpath}/platform/readUserImg/OVERVIEW_SYS" />
						      </div>
				 		</td>
				 	</tr>
				</table>
			</div>
			<div style="clear:both"></div>
	</div>
	<hr/>
	<button type="button" id='saveUserInfoBtn' class="btn btn-info center" style="width:100px;margin:0px auto"><@spring.message code="user.label.save"/> </button>
	<div style="clear:both"></div>
</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
var birthday2='${userBean.birthday}';
var sex2='${userBean.sex}';
_require(
{
	paths : {
		'upload':'${resPath}/bace/js/webuploader/js/webuploader',
		'user/info':'${resPath}/resources/platform/sysmanage/user/js/user-info',
		'user/message': '${resPath}/resources/platform/sysmanage/user/js/message'
	}
},
'user/info'
);
</script>
