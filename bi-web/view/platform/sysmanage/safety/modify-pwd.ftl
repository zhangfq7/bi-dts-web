<#include "view/platform/frame/bace/top.ftl">
	<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/safety/css/modify.css" />
	<!--start-->
	<div class="my-panel"><@spring.message code="safety.label.changePsd"/></div>
	<#if pwdLevel == "1">
		<div class="alert alert-danger" role="alert">密码长度大于等于六位</div>
	</#if>
	<#if pwdLevel == "2">
		<div class="alert alert-danger" role="alert">密码为数字字母混合并且长度大于等于六位</div>
	</#if>
	<#if pwdLevel == "3">
		<div class="alert alert-danger" role="alert">密码为数字字母特殊字符混合并且长度大于等于六位</div>
	</#if>		
	<#if pwdLevel == "4">
		<div class="alert alert-danger" role="alert">密码为数字字母特殊字符混合并且长度大于等于六位且不与前两次密码相同</div>
	</#if>	
	<div class="my-panel">
		<div class="validate-content">
			<div class="validate-div">
				<div class="label"><@spring.message code="safety.label.oldPsd"/></div>
				<input type="password" class="form-control" id="oldPsd">
				<div style="clear:both;">
				</div>
			</div>
			<div class="validate-div">
				<div class="label"><@spring.message code="safety.label.newPsd"/></div>
				<input type="password" class="form-control" id="newPsd">
				<div style="clear:both;"></div>
			</div>
			<div class="validate-div">
				<div class="label"><@spring.message code="safety.label.confirmPsd"/></div>
				<input type="password" class="form-control" id="reNewPsd">
				<div style="clear:both;"></div>
			</div>
			<div class="validate-div">
				<button type="button" id="validate-sub" class="btn btn-info btn-sm submit-button"> <@spring.message code="safety.button.submit"/></button>
			</div>
		</div>
	</div>

	<#include "view/platform/frame/bace/bottom.ftl">
		<script>
			var forceChangePwd='${forceChangePwd}';
			_require({
					paths: {
						'safety/editPswd': '${resPath}/resources/platform/sysmanage/safety/js/modify-pwd',
						'safety/message': '${resPath}/resources/platform/sysmanage/safety/js/message'
					}
				}, 
				'safety/editPswd',function(editPswd) {
					editPswd.init();
				});
		</script>