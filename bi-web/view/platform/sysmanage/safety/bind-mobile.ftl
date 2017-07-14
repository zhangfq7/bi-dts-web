<#include "view/platform/frame/bace/top.ftl">
	<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/safety/css/bind-mobile.css" />

	<!--start-->
	<div class="panel f16 main-title">
		<@spring.message code="safety.label.bindMobile"/>
	</div>

	<div class="panel main-container">
		<div class="validate-content">
			<div>
				<div class="label"><@spring.message code="safety.label.enterMobileNum"/></div>
				<input type="text" class="form-control" style="width:220px" id="mobileNum" />
			</div>
			<div>
				<div class="label"><@spring.message code="safety.label.enterPhoneCode"/></div>
				<input type="text" class="form-control" style="width:220px" id="checkCode" />
				<button type="button" id="getvalidNum" class="btn btn-info btn-sm"><@spring.message code="safety.button.sendPhoneCode"/></button>
			</div>
			<div>
				<div class="label"><@spring.message code="safety.label.captcha"/></div>
				<input type="text" class="form-control" style="width:219px" id="captcha">
				<div class="captcha-pic theme-background"><img src="${webpath}/ImageServlet" /></div>
			</div>
			<div>
				<input id="type" type="text" style="display:none" value=${type} />
			</div>
			<div>
				<button id="comfirm-bind" type="button" class="btn btn-info btn-sm validate-button"><@spring.message code="safety.button.submit"/></button>
			</div>
		</div>
	</div>

	<#include "view/platform/frame/bace/bottom.ftl">
		<script>
			_require({
					paths: {
						'safety/editEmail': '${resPath}/resources/platform/sysmanage/safety/js/bind-mobile',
						'safety/message': '${resPath}/resources/platform/sysmanage/safety/js/message'
					}
				},
				'safety/editEmail', function(editEmail) {
					editEmail.init();
				}
			);
		</script>