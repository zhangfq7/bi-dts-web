<!DOCTYPE html>
<html lang="zh">

<head>
<title><@spring.message code="manage.login.label.title"/></title>
<meta charset="UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="${author}"/>
<meta name="keywords" content="${keywords}"/>
<meta name="description" content="${description}"/>
<meta http-equiv="cache-control" content="must-revalidate">
<meta http-equiv="pragma" content="Pragma">
<link rel="stylesheet" href="${resPath}/resources/manage/frame/login/css/login-manage.css${css_version}" />
<link rel="stylesheet" href="${resPath}/bace/js/font-awesome/css/font-awesome.min.css" />
</head>
<body>
	<div class="header">
		<img src="${resPath}/resources/manage/frame/login/img/LOGO.png" />
	</div>
	<div class="login-form">
		<div class="leftpic">
		</div>
		<div class="login-div">
		    <div class="login-title">
		        <span class='userlogin'><@spring.message code="manage.login.label.userLogin"/></span>
		        <span class='langPanel'>
		            <span class='zh active'>中文</span>
		            <span class='en'>English</span>
		        </span>
			</div>					
			<div class="form-group">
				<input type="text" id="userID" class="form-input login-user" placeholder='<@spring.message code="manage.login.label.userName"/>' />
				<input type="password" id="userPassword" class="form-input login-psd" placeholder='<@spring.message code="manage.login.label.password"/>' />
				<input type="text" id="captcha" class="form-input login-validate" placeholder='<@spring.message code="manage.login.label.captcha"/>' />
				<div class="captcha-pic">
					<img src="${webpath}/ImageServlet" class="cursor-pointer">
				</div>
				<div class='login-error'>
					<i class='fa fa-warning tip'></i><span class='error-str'></span>
				</div>
				<div class="login-button disabled-select"></div>
				
				<div class="astyle disabled-select">
					<a class="remember-user cursor-pointer">
					    <i class="fa fa-square-o chechBox"></i>
						<span><@spring.message code="login.label.remember"/></span>
					</a>
					<a class="forget-pwd" href="${webpath}/manage/retripsd/enter-page/forgetpwd"><@spring.message code="manage.login.label.forgetPassword"/></a>
				</div>
				<div class="lineborder">
					<p class="tip"><@spring.message code="manage.login.label.reminder"/></p>
					<p class="tip-con"><@spring.message code="manage.login.label.reminderMsg"/></p>
				</div>
				<//div>
			</div>
		</div>
</body>
</html>
<script src="${resPath}/bace/js/jquery/jquery-1.11.2.min.js"></script>
<script src="${resPath}/bace/js/require.js"></script>
<script src="${resPath}/resources/manage/frame/login/js/message.js"></script>
<script>
var runMode = '${runMode}';
var webpath = '${webpath}';
var config = {
	urlArgs :'c='+(new Date().getTime()),
	baseUrl : '${resPath}/bace/js',
	waitSeconds : 60,
	paths : {
		"sabace" : "tools/sa-bace",
		'cookie' : 'jquery-cookie/jquery.cookie',
		'login/page': '${resPath}/resources/manage/frame/login/js/login-manage'
	}
};
require.config(config);
require(['login/page']);
</script>