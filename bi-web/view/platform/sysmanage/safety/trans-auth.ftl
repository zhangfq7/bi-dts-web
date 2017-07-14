<#include "view/platform/frame/bace/top.ftl">
	<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/safety/css/trans-auth.css" />
	<!--start-->
	<div class="panel" style="padding: 10px;">
		<@spring.message code="safety.label.transauth.title" />
	</div>

	<div class="panel minback">
		<form class="form-horizontal">
			<fieldset>
				<div class="center">
					<div class="form-group form-group-sm">
						<label class="control-label">
							<@spring.message code="safety.label.current.user" />
						</label>
						<span class="theme-color">${userId}</span>
					</div>
					<div class="form-group form-group-sm">
						<label class="control-label">
							<@spring.message code="safety.label.transauth.user" />
						</label>
						<div class="select">
							<select id="transUser" data-placeholder="<@spring.message code="safety.label.select.user"/>">
							</select>
						</div>
					</div>
					<div class="form-group form-group-sm">
						<button type="button" id='submit' class="btn  btn-sm btn-info">
							<@spring.message code="safety.button.submit" /> </button>
					</div>
				</div>
			</fieldset>
		</form>
	</div>

	<#include "view/platform/frame/bace/bottom.ftl">
		<script>
			_require({
					paths: {
						'safety/transAuth':'${resPath}/resources/platform/sysmanage/safety/js/trans-auth',
						'safety/message': '${resPath}/resources/platform/sysmanage/safety/js/message',
					}
				},
				'safety/transAuth', function(transAuth) {
					transAuth.init();
				}
			);
		</script>
