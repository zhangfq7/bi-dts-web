<#include "view/platform/frame/retop.ftl">

<link rel="stylesheet" href="${resPath}/resources/platform/frame/retripsd/css/retrievepsd.css" />
<link rel="stylesheet" href="${resPath}/bace/js/dialog/css/bootstrap-dialog.css">
		<div class="content">

		<div class="row">
			<div class="title-text">
				<@spring.message code="retripsd.label.title"/>
			</div>
		</div>

		<div class="row">
			<div class="flow">
				<div class="step" id="step1">
					<div class="circle circle-color" id="circle1">
						<span><@spring.message code="retripsd.label.firstStep"/></span>
					</div>
					<p id="message1" class="message"><@spring.message code="retripsd.label.enterUserName"/></p>
				</div>
				<div class="line line-color" id="line1"></div>

				<div class="step" id="step2">
					<div class="circle" id="circle2">
						<span><@spring.message code="retripsd.label.secondStep"/></span>
					</div>
					<p id="message2" class="message"><@spring.message code="retripsd.label.securityVerification"/></p>
				</div>
				<div class="line" id="line2"></div>

				<div class="step" id="step3">
					<div class="circle" id="circle3">
						<span><@spring.message code="retripsd.label.thirdStep"/></span>
					</div>
					<p id="message3" class="message"><@spring.message code="retripsd.label.enterNewPassword"/></p>
				</div>
				<div class="line" id="line3"></div>

				<div class="step step-finish" id="step4">
					<div class="circle" id="circle4">
						<span class="fui-check"></span>
					</div>
					<p id="message4" class="message"><@spring.message code="retripsd.label.finish"/></p>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="listmsg">
				<ul class="list-unstyled">
					<li>
						<label  class="text-muted"><@spring.message code="retripsd.label.firstStep.firstTipMsg"/></label>
						<label id="userId" class="text-muted">${Session["userId"]}</label>
					</li>
					<li>
						<label> <@spring.message code="retripsd.label.firstStep.secondTipMsg"/></label>
					</li>
				</ul>
			</div>
		</div>
		<div class="row">
			<div class="way mobile-way">
				<a>
					<div class="circle circle-way mobile-picture"></div>
				</a>
				<p id="text2" class="text"><@spring.message code="retripsd.label.useMobile"/></p>
			</div>
			<div class="way email-way">
				<a>
					<div class="circle circle-way email-picture"></div>
				</a>
				<p id="text2" class="text"><@spring.message code="retripsd.label.useEmail"/></p>
			</div>
		</div>
   </div>
           

<#include "view/platform/frame/rebottom.ftl">

<script>
_require(
{
	paths : {
	    'dialog':'${resPath}/bace/js/dialog/js/bootstrap-dialog',
	    'retrievepsd/message':'${resPath}/resources/platform/frame/retripsd/js/message',
		'retripsd/forgetpsd/chooseWay':'${resPath}/resources/platform/frame/retripsd/js/retrievepsd-chway'
	}
},
'retripsd/forgetpsd/chooseWay'
);
</script>
