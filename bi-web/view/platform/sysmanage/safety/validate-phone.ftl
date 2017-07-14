<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/safety/css/validate-phone.css" />
<!--start-->
<#if forceChangePwd == "1">
	<div class="alert alert-danger" role="alert">您的密码不符合您所在企业规定的密码等级,请修改密码</div>
</#if>
<div class="panel">
	<span class="f16"><@spring.message code="safety.label.mobile.Verification"/></span>
</div>
<div class="panel">
	<ul class="tab-pane validationEngineContainer">
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span id="mobileNum" class="f14 bolder"><@spring.message code="safety.label.bindMobileNum"/></span>
			</div>
			<div class="content-class">
				<span class="f16 bolder theme-color">${bindMobileNum}</span>
			</div>
		</li>
		<li class="form-group form-group">
			<div class="label-class">
				<span class="f14 bolder"><@spring.message code="safety.label.enterPhoneCode"/></span>
			</div>
			<div class="input-class">
				<input type="text" id="checkCode" value="" placeholder='<@spring.message code="safety.placeholder.checkCode"/>' class="form-control validate[required,len[4,4]]" data-errormessage-value-missing='<@spring.message code="safety.msg.checkCode.empty"/>' data-errormessage-range-underflow='<@spring.message code="safety.msg.captcha.lengthError"/>'/>
			</div>
			<div class="input-class">
				<button type="button" id="sendCodeButton" class="btn  btn-sm btn-info"><@spring.message code="safety.button.sendPhoneCode"/></button>
			</div>
		</li>
		<li id="tip">
			<small class="text-muted tip" ><@spring.message code="retripsd.label.secondStep.thirdTipMsg"/></small>
		</li>
		<li class="form-group form-group">
			<div class="label-class">
				<span class="f14 bolder"><@spring.message code="safety.label.captcha"/></span>
			</div>
			<div class="input-class">
				<input type="text" id="captcha" value="" placeholder='<@spring.message code="safety.placeholder.captcha"/>' class="form-control validate[required,len[4,4]]" data-errormessage-value-missing='<@spring.message code="safety.msg.captcha.empty"/>' data-errormessage-range-underflow='<@spring.message code="safety.msg.captcha.lengthError"/>'/>
				<input id="type" type="text" style="display:none" value=${type} />
			</div>
			<div class="captcha-class theme-background"><img src="${webpath}/ImageServlet"/></div>
		</li>
		<HR/>
		<li class="form-group form-group-sm">
			<div class="button-class">
				<button id="validateButton" type="button" class="btn btn-info"><@spring.message code="safety.button.validate"/></button>
			</div>
		</li>
	</ul>
</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
var forceChangePwd='${forceChangePwd}';
_require(
{
	paths : {
		'safety/validate':'${resPath}/resources/platform/sysmanage/safety/js/validate-phone',
		'safety/message': '${resPath}/resources/platform/sysmanage/safety/js/message'
	}
},
'safety/validate',function(validate){
	validate.init();
}
);
</script>