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
						<div class="circle" id="circle2">
							<span><@spring.message code="retripsd.label.secondStep"/></span>
						</div>
						<p id="message2" class="message"><@spring.message code="retripsd.label.securityVerification"/></p>
					</div>
					<div class="line" id="line2"></div>

					<div class="step" id="step3">
						<div class="circle" id="circle3">
							<span>3</span>
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
				<form class="form-horizontal" role="form">
					<div class="form-group  form-group-sm">
						<label class="col-xs-5  control-label userLabel"><@spring.message code="retripsd.label.userName"/></label>
						<div class="col-xs-3">
							<input class="form-control text-step1" type="text" id="userId" placeholder=<@spring.message code="retripsd.label.userNamePlaceholder"/> class="form-control">
							<input id="hiddenText" type="text" style="display:none" />
						</div>
						<div class="clearfix"></div>  
					</div> 
					<div class="form-group  form-group-sm">
				            <div class="col-xs-1 col-xs-offset-5 ">
					             <a id="first-next" class="btn btn-sm btn-info btn-next-step3"></a>
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
		'retripsd/forgetpsd/enterUserName':'${resPath}/resources/platform/frame/retripsd/js/retrievepsd-enter',
		'retrievepsd/message':'${resPath}/resources/platform/frame/retripsd/js/message'
	}
},
'retripsd/forgetpsd/enterUserName'
);
</script>


