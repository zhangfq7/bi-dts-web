<#include "view/platform/frame/bace/top.ftl">
	<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/safety/css/bind-email.css" />

	<!--start-->
	<div class="my-panel">
		<@spring.message code="safety.label.bindEmail"/>
	</div>

	<div class="my-panel">
		<div class="validate-content">
			<div class="validate-div">
				<div class="label"><@spring.message code="safety.label.Email"/></div>
				<input type="text" class="form-control" id="newEmail">
				<div style="clear:both;"></div>
			</div>
			<div class="validate-div">
				<div class="label"><@spring.message code="safety.label.confirmEmail"/></div>
				<input type="text" class="form-control" id="reNewEmail">
				<div style="clear:both;"></div>
			</div>
			<div class="validate-div">
				<button type="button" id="validate-sub" class="btn btn-info btn-sm submit-button"><@spring.message code="safety.button.submit"/></button>
			</div>
		</div>
	</div>

	<#include "view/platform/frame/bace/bottom.ftl">
		<script>
			_require({
					paths: {
						'safety/editEmail': '${resPath}/resources/platform/sysmanage/safety/js/bind-email',
						'safety/message': '${resPath}/resources/platform/sysmanage/safety/js/message'
					}
				},
				'safety/editEmail', function(editEmail) {
					editEmail.init();
				}
			);
		</script>