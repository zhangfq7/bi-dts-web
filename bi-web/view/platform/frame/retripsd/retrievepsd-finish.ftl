<#include "view/platform/frame/retop.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/frame/retripsd/css/retrievepsd.css" />


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
						<div class="circle circle-color" id="circle2">
							<span><@spring.message code="retripsd.label.secondStep"/></span>
						</div>
						<p id="message2" class="message"><@spring.message code="retripsd.label.securityVerification"/></p>
					</div>
					<div class="line line-color" id="line2"></div>

					<div class="step " id="step3">
						<div class="circle circle-color" id="circle3">
							<span><@spring.message code="retripsd.label.thirdStep"/></span>
						</div>
						<p id="message3" class="message"><@spring.message code="retripsd.label.enterNewPassword"/></p>
					</div>
					<div class="line line-color" id="line3"></div>

					<div class="step step-finish" id="step4">
						<div class="circle circle-color" id="circle4">
							<span class="fui-check"></span>
						</div>
						<p id="message4" class="message"><@spring.message code="retripsd.label.finish"/></p>
					</div>
				</div>
			</div>
            
            
			<div class="row" style="text-align:center; ">
				<div class="panel panel-info panel-success">
					<div class="panel-heading">
						<div class="circle step4-ok">
							<span class="fui-check"></span>
						</div>
					</div>
					<div class="panel-title">
						<label><@spring.message code="retripsd.label.fourthStep.firstTipMsg"/></label>
					</div>
					<div class="panel-body">
						<a id="back-mysys" href="${webpath}/platform/login/page"><@spring.message code="retripsd.label.fourthStep.returnMySystem"/></a>
					</div>
				</div>

			</div>
		</div>

<#include "view/platform/frame/rebottom.ftl">

