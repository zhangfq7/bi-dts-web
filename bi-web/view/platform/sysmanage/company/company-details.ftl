<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/company/css/company-details.css" />

<!--start-->
<div class="validationEngineContainer" style="padding: 10px;">
	<form class="form-horizontal">
		<fieldset>
			<div class="form-group form-group-sm  user-info-lft ">
				<table class="user-info-pl25">
					<tr>
						<td class="avatar-content">
							<div id="cropImageDiv">
								<#if userInfoBean?exists>
									<img class="avatar" src="${webpath}/platform/readUserImg/OVERVIEW_SYS?userImgId=${userInfoBean.userId}" />
									<#else>
									<img class="avatar" src="${webpath}/platform/readUserImg/OVERVIEW_SYS?userImgId=default" />
								</#if>
							</div>
							<div id="uploadProgress">50%</div>
						</td>
					</tr>
				</table>
			</div>

			<div class="user-info-rgt validationEngineContainer">
				<#if userInfoBean?exists>
					<div class="form-group form-group-sm">
						<label for="userName" class="col-sm-3 control-label1">
							<@spring.message code="user.label.userId" />
						</label>
						<div class="col-sm-5 infoRow">
							<span>${userInfoBean.userId}</span>
						</div>
					</div>
				</#if>
				<div class="form-group form-group-sm">
					<label for="userName" class="col-sm-3 control-label1">
						<@spring.message code="user.label.userName" />
					</label>
					<div class="col-sm-5 infoRow">
						<#if userInfoBean.userName !=''>
							<span>${userInfoBean.userName}</span>
							<#else>
								<span><@spring.message code="company.cisaw.details.none" /></span>
						</#if>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="userName" class="col-sm-3 control-label1">
						<@spring.message code="user.useredit.label.birthday" />
					</label>
					<div class="col-sm-5 infoRow">
						<#if userInfoBean.birthday !=''>
							<span>${userInfoBean.birthday}</span>
							<#else>
								<span><@spring.message code="company.cisaw.details.none" /></span>
						</#if>
					</div>
				</div>

				<div class="form-group form-group-sm">
					<label for="gender" class="col-sm-3 control-label1">
						<@spring.message code="user.userlist.button.sex" />
					</label>
					<div class="col-sm-5 infoRow">
						<#if userInfoBean.sex==1>
							<span><@spring.message code="user.useredit.label.male" /></span>
						</#if>
						<#if userInfoBean.sex==0>
							<span><@spring.message code="user.useredit.label.female" /></span>
						</#if>
						<#if userInfoBean.sex==9>
							<span><@spring.message code="user.useredit.label.unknown" /></span>
						</#if>
					</div>
				</div>

				<div class="form-group form-group-sm">
					<label for="phone" class="col-sm-3 control-label1">
						<@spring.message code="user.userlist.label.mobile" />
					</label>
					<div class="col-sm-5 infoRow">
						<#if userInfoBean.mobileNum !=''>
							<span>${userInfoBean.mobileNum}</span>
							<#else>
								<span><@spring.message code="company.cisaw.details.none" /></span>
						</#if>
					</div>
				</div>

				<div class="form-group form-group-sm">
					<label for="email" class="col-sm-3 control-label1">
						<@spring.message code="user.userlist.button.email" />
					</label>
					<div class="col-sm-5 infoRow">
						<#if userInfoBean.email !=''>
							<span>${userInfoBean.email}</span>
							<#else>
								<span><@spring.message code="company.cisaw.details.none" /></span>
						</#if>
					</div>
				</div>
				
				<div class="form-group form-group-sm signRow">
					<label for="vantages" class="col-sm-3 control-label1">
						可用积分：
					</label>
					<div class="col-sm-3 infoRow font-orange">
							<span>${userInfoBean.vantages}</span>
					</div>
				</div>
				
				<div class="form-group form-group-sm signRow">
					<label for="usedSpace" class="col-sm-3 control-label1">
						存储空间：
					</label>
					<div class="col-sm-3 infoRow font-orange">
							<span id="usedSpace">${userInfoBean.usedSpace}</span>
					</div>
				</div>

				<div class="form-group form-group-sm signRow">
					<label for="sign" class="col-sm-3 control-label1">
						<@spring.message code="user.label.signature" />
					</label>
					<div class="col-sm-3 infoRow">
						<#if userInfoBean.bardianSign !=''>
							<span>${userInfoBean.bardianSign}</span>
							<#else>
								<span><@spring.message code="company.cisaw.details.none" /></span>
						</#if>
					</div>
				</div>

			</div>

		</fieldset>

	</form>
</div>
<script>
   <#if userInfoBean?exists>
	var birthday2='${userInfoBean.birthday}';
	var sex2='${userInfoBean.sex}';
    <#else>
	var birthday2='';
	var sex2='';
    </#if>
    
    _require(
{
	paths: {
		'user/details': '${resPath}/resources/platform/sysmanage/company/js/company-details',
		'message': '${resPath}/resources/platform/sysmanage/company/js/message',
		'upload':'${resPath}/bace/js/webuploader/js/webuploader',
		
	}
},
'user/details',
function(details) {
	details.init();
}
);

</script>
