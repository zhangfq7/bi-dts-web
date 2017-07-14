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
				<div class="listMsg">
					<ul class="list-unstyled">
						<li>
							<label><@spring.message code="retripsd.label.secondStep.firstTipMsg"/></label>
						</li>
						<li>
							<label class="col-xs-4 "><@spring.message code="retripsd.label.secondStep.secondTipMsg"/></label>
							<label id="userId">${Session["mobileNum"]}</label>
						</li>
						<li>

							<label class="col-xs-4 "><@spring.message code="retripsd.label.validateCode"/></label>
							<input type="text"  class="validate-number form-control " id="msg" placeholder=<@spring.message code='retripsd.label.fourNumber'/>>
							<button href="#fakelink" id="sendBtn" class="btn btn-sm btn-default "><@spring.message code="retripsd.button.getValidateCode"/></button>				
						</li>
						<li id="tip" style="display:none">
							<small class="text-muted check-code-tip col-xs-offset-4" ><@spring.message code="retripsd.label.secondStep.thirdTipMsg"/></small>
						</li>
						<li>
							<input type="text"  class="code-number form-control col-xs-offset-4 col-xs-3" id="code" placeholder=<@spring.message code='retripsd.label.code'/>>
							<div  class="validate-img col-xs-4">
					           <img  class="cursor-pointer" src="${webpath}/ImageServlet">
					        </div>
					        <div class="clearfix"></div>			
						</li>						
						<li>
						  <div class="col-xs-offset-4 ">
					        <a class="btn btn-sm btn-info btn-next col-xs-offset-"><@spring.message code="retripsd.label.nextStep"/></a>
				          </div>
						</li>
					</ul>
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
		'retripsd/forgetps/mobileValidate':'${resPath}/resources/platform/frame/retripsd/js/retrievepsd-mobile'
	}
},
'retripsd/forgetps/mobileValidate'
);
</script>

