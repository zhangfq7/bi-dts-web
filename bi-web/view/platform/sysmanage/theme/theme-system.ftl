<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/bace/js/webuploader/css/webuploader.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/theme/css/theme-system.css${css_version}" />

<div class="panel">
	<span class="f16"><@spring.message code="system.theme.set"/></span>
</div>

<div class="panel">
	<ul id="savePanel" role="tabpanel" class="tab-pane">
	<#if openLogoFlag==1>
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14"><@spring.message code="system.theme.avatar"/></span>
			</div>
			<div class="img-class">
				<div class="avatar-content">
					<div id="cropImageDiv">
						<img class="avatar" src="${webpath}/platform/read-theme/${funcId}?t=${date}"/>
					</div>
				</div>
			</div>
			<div class="label-class">
				<span class="f14"><@spring.message code="system.theme.preview"/></span>
			</div>
			<div class="img-class">
				<div class="avatar-content" id="preview-td">
					<div class="preview-container">
						<img id="preview" style="width:250px;" src="${webpath}/platform/read-theme/${funcId}?t=${date}" />
					</div>
				</div>
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class"></div>
			<div class="img-class">
				<span class="f14"><@spring.message code="system.theme.tip"/></span>
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class"></div>
			<div class="img-class">
				<span class="f14"><div id="picker"><@spring.message code="system.theme.changeAvatar"/></div></span>
			</div>
		</li>
	</#if>
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14"><@spring.message code="system.theme.changeSkin"/>
			</div>
			<div class="theme-class">
				<div class="theme-system-bg-border">
					<div id="red"></div>
				</div>
				<div class="theme-system-bg-border">
					<div id="yellow"></div>
				</div>
				<div class="theme-system-bg-border">
					<div id="green"></div>
				</div>
				<div class="theme-system-bg-border">
					<div id="blue"></div>
				</div>
				<div class="theme-system-bg-border">
					<div id="purple"></div>
				</div>
				
				<div class="theme-system-bg-border">
					<div id="grey"></div>
				</div>
				<div class="theme-system-bg-border">
					<div id="black"></div>
				</div>
			</div>
		</li>
		<HR/>
		<li class="form-group form-group-sm">
			<div class="label-class" style="width:100%;text-align: center;">
				<button type="button" id='recoverThemeBtn' class="btn btn-info"><@spring.message code="system.theme.recover"/> </button>
				<button type="button" id='saveThemeBtn' class="btn btn-info" style="margin-left: 30px"><@spring.message code="system.theme.save"/> </button>
			</div>
		</li>
	</ul>
</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>

_require(
{
	paths : {
		'upload':'${resPath}/bace/js/webuploader/js/webuploader',
		'theme/system':'${resPath}/resources/platform/sysmanage/theme/js/theme-system',
		'theme/message': '${resPath}/resources/platform/sysmanage/theme/js/message'
	}
},
'theme/system'
);
</script>
