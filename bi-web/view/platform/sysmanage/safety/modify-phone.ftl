<#include "view/platform/frame/bace/top.ftl">
	<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/safety/css/modify.css" />
	<!--start-->
	<div class="my-panel">
		<@spring.message code="safety.label.changeMobile"/>
	</div>
	<div class="my-panel">
		<div class="validate-content">
			<div class="validate-div">
				<div class="label"><@spring.message code="safety.label.oldMobile"/></div>
				<input type="text" class="form-control" id="oldMobile">
				<div style="clear:both;"></div>
			</div>
			<div class="validate-div">
				<div class="label"><@spring.message code="safety.label.newMobile"/></div>
				<input type="text" class="form-control" id="newMobile">
				<div style="clear:both;"></div>
			</div>
			<div class="validate-div">
				<div class="label"><@spring.message code="safety.label.confirmMobile"/></div>
				<input type="text" class="form-control" id="reNewMobile">
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
						'safety/editMobile': '${resPath}/resources/platform/sysmanage/safety/js/modify-mobile',
						'safety/message': '${resPath}/resources/platform/sysmanage/safety/js/message'
					}
				},
				'safety/editMobile', function(editMobile) {
					editMobile.init();
				}
			);
		</script>