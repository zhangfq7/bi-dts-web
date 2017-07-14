<#include "view/platform/frame/retop.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/frame/retripsd/css/retrievepsd.css" />
<link rel="stylesheet" href="${resPath}/bace/js/font-awesome/css/font-awesome.min.css">
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
				<form class="form-horizontal form-step3" role="form">
					<div class="form-group form-group-sm ">
						<label class="col-xs-5  control-label"><@spring.message code="retripsd.label.userName"/></label>
						<label class="col-xs-3" id="userId" >${Session["userId"]}</label>
					</div>
					<div class="form-group  form-group-sm">
						<label class="col-xs-5  control-label"><@spring.message code="retripsd.label.newPassword"/></label>
						<div class="col-xs-3">
							<input type="password" class="form-control" id="newPassword">
							<div class="clearfix"></div>
						</div>
						<div class="clearfix"></div>
						<small class="tip-step3 text-muted" id="psdLevel" value=${psdLevel}>
						<div  id="psdLevel1" class="tipdisplay" ><@spring.message code="retripsd.label.thirdStep.firstTipMsg"/></div>
						<div  id="psdLevel2" class="tipdisplay" ><@spring.message code="retripsd.label.thirdStep.secondTipMsg"/></div>
						<div  id="psdLevel3" class="tipdisplay" ><@spring.message code="retripsd.label.thirdStep.thirdTipMsg"/></div>
						<div  id="psdLevel4" class="tipdisplay" ><@spring.message code="retripsd.label.thirdStep.forthTipMsg"/></div>
						</small>
					</div>
					<div class="form-group  form-group-sm">
							<label class="col-xs-5  control-label"><@spring.message code="retripsd.label.reenterNewPassword"/></label>
							<div class="col-xs-3">
								<input type="password" id="renewPassword" class="form-control" value="">
							</div>
					</div>
					<div class="form-group">						
				         <div class="col-xs-1 col-xs-offset-5 ">
					        <a id="cgpsd-next"  class="btn btn-sm btn-info btn-next-step3"><@spring.message code="retripsd.label.nextStep"/></a>
				         </div>			
					</div>
				</form>
			</div>
		</div>

<#include "view/platform/frame/rebottom.ftl">
<script>
_require(
{
	paths : {
	    'dialog':'${resPath}/bace/js/dialog/js/bootstrap-dialog',
	    'retrievepsd/message':'${resPath}/resources/platform/frame/retripsd/js/message',
		'retripsd/forgetpsd/changePsd':'${resPath}/resources/platform/frame/retripsd/js/retrievepsd-cgpsd'
	}
},
'retripsd/forgetpsd/changePsd'
);
</script>
