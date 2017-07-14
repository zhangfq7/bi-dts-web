<#include "/view/platform/frame/retop.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/frame/register/css/register.css" />
<link rel="stylesheet" href="${resPath}/bace/js/font-awesome/css/font-awesome.min.css">
<div class="panel">
	<form class="form-horizontal registerForm">
		<fieldset>
			<div class="col-sm-7">
				<div class="form-group">
					<label for="userName" class="col-sm-3 control-label " ><@spring.message code="register.label.user"/></label>
					<div class="col-md-6">
						<input type="text" class="form-control register-input" id="userName" placeholder="手机号码或邮箱">
					</div>
				</div>
				<div class="form-group">
					<label for="phone" class="col-sm-3 control-label"><@spring.message code="register.label.password"/></label>
					<div class="col-md-6">
						<input type="password" class="form-control register-input" id="userPassword" placeholder="请输入密码">
					</div>
				</div>
				<div class="form-group">
					<label for="phone" class="col-sm-3 control-label"><@spring.message code="register.label.repassword"/></label>
					<div class="col-md-6">
						<input type="password" class="form-control register-input" id="rePassword" placeholder="请再次输入密码">
					</div>
				</div>
				<div class="form-group">
					<label for="email" class="col-sm-3 control-label"><@spring.message code="register.label.validateCode"/></label>
					<div class="col-md-4 captcha-div">
						<input type="email" class="form-control register-input captcha" id="captcha" placeholder="请输入验证码">
					</div>
					<div class="validate-img">
					      <img  class="cursor-pointer" src="${webpath}/ImageServlet">
					</div>
				</div>

				<div class="form-group">
					<div class="col-sm-offset-3 col-sm-6">
						<label class="checkbox" id="check" for="checkbox1">
							<input type="checkbox" value="" id="checkbox1" data-toggle="checkbox" class="custom-checkbox"><span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span>
							<div><@spring.message code="register.label.readAndComfirm"/><a href="#"><@spring.message code="register.label.userProtocol"/></a></div>
						</label>
					</div>
				</div>
				<div class="form-group">
				<div class="col-sm-offset-3 col-sm-6">
                  <div class='error-div'>
						<i class='fa fa-warning tip'></i><span class='error-str'></span>
				  </div>
				</div>
				</div>
				<div class="form-group">
					<div class="col-sm-offset-3 col-sm-6">
						<a  class="btn btn-block btn-lg btn-info btn-register" id="registerButton"></a>
					</div>
				</div>
			</div> 

			<div class="col-sm-5">
				<div class="form-group">
					<div class=" col-sm-offset-3 col-sm-7 tipPanel">
						<div class="text"><@spring.message code="register.label.tipMsgTitle"/></div>
						<span><@spring.message code="register.label.tipMsgFirstLine"/><p><@spring.message code="register.label.tipMsgSecondLine"/></p></span>
						<span><@spring.message code="register.label.tipMsgThirdLine"/><p><@spring.message code="register.label.tipMsgFourthLine"/></p></span>
					</div>
				</div>
			</div>
		</fieldset>
	</form>
</div>
<#include "/view/platform/frame/rebottom.ftl"> 
       <script src="${resPath}/resources/platform/frame/register/js/message.js"></script>   
       <script>
			_require({
					paths: {
						'register/register': '${resPath}/resources/platform/frame/register/js/register',
						'dialog': '${resPath}/bace/js/dialog/js/bootstrap-dialog'
					}
				},
				'register/register', function() {}
			);
		</script>