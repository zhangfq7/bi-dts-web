<!DOCTYPE html>
<html lang="zh">
<head>
<title><@spring.message code="login.label.title"/></title> 
<meta charset="UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<meta name="author" content="${author}"/>
<meta name="keywords" content="${keywords}"/>
<meta name="description" content="${description}"/>
<meta http-equiv="cache-control" content="must-revalidate">
<meta http-equiv="pragma" content="Pragma">
<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/frame/login/css/login.css${css_version}"/>
<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/frame/login/js/sa_ceshi.css${css_version}"/>
<link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
<script>
var webpath = '${webpath}';
var resPath = '${resPath}';
</script>
<script>
  eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('l x(){8 f=D.f,g=/(J\\s|H.*o:)([\\w.]+)/,p=/(z)\\/([\\w.]+)/,u=/(G).+6\\/([\\w.]+)/,q=/(F)\\/([\\w.]+)/,r=/6\\/([\\w.]+).*(E)/,m=/K/,j=/I y/,C=/B/,A=/o:1.2.3.4/,i=/S/,n=/U/,W=/k V/,h=/k R/;8 7=0,6=0;l t(c){8 5=m.d(c);9(5!=b){a{7:"N",6:5[2]||"0"}}8 5=n.d(c);9(5!=b){a{7:"M",6:5}}8 5=j.d(c);9(5!=b){a{7:"T",6:5}}8 5=i.d(c);9(5!=b){a{7:"Q",6:5}}8 5=h.d(c);9(5!=b){a{7:"P",6:5}}8 5=g.d(c);9(5!=b){a{7:"O",6:5[2]||"0"}}8 5=p.d(c);9(5!=b){a{7:5[1]||"",6:5[2]||"0"}}8 5=u.d(c);9(5!=b){a{7:5[1]||"",6:5[2]||"0"}}8 5=q.d(c);9(5!=b){a{7:5[1]||"",6:5[2]||"0"}}8 5=r.d(c);9(5!=b){a{7:5[2]||"",6:5[1]||"0"}}9(5!=b){a{7:"",6:"0"}}}8 e=t(f.v());9(e.7){7=e.7;6=e.6}a{L:7.v(),6:6}}',59,59,'|||||match|version|browser|var|if|return|null|ua|exec|browserMatch|userAgent|rMsie|rIsWM|rIsUc|rIphoneOs|windows|function|rIpad|rIsAndroid|rv|rFirefox|rChrome|rSafari||uaMatch|rOpera|toLowerCase||BrowserVersion|os|firefox|rIsUc7|midp|rIsMidp|navigator|safari|chrome|opera|trident|iphone|msie|ipad|type|ANDROID|IPAD|IE|WINDOWSMOBILE|UC|mobile|ucweb|IPHONE|android|ce|rIsCE'.split('|'),0,{}))
  var browserInfo = BrowserVersion();
  if(browserInfo.type =='ie' && browserInfo.version < 9){
        window.location.href = webpath + '/browser.jsp'
  }
</script>
</head>
<body class="hidden">
<div class="contanier reg">
	<div class="login-logo">
		<div class="img"></div>
	</div>
	<div class="login-text"><span id="opt-type"></span><span> ViVa-Analysis</span></div>
	<div class="loginPanel hidden">	
		<div class="login-form">
			<div class="form-input">
				<div class="placeholder "><@spring.message code="login.label.userName"/></div>
				<input id="username" autocomplete="off"/>
			</div>
			<input type='hidden' value="${Session.errorCount}" id="errorCount" />
			<div class="form-input validatePanel <#if Session.errorCount < 3>hidden</#if>" id="login_picCodePanel">
				<div class="placeholder"><@spring.message code="login.label.captcha"/></div>
				<input id="login_picCode" autocomplete="off"/>
				<div class="codePanel">
					<img src="${webpath}/ImageServlet" />
				</div>
			</div>
			<div class="form-input passwordPanel">
				<div class="placeholder"><@spring.message code="login.label.password"/></div>
				<input id="pswd" type="password" autocomplete="off"/>
				<div class="login-button"></div>
				<div class="load">
		        	<img class="loading" src="data:image/png;base64,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">
		        </div>
			</div>
			<div class="check-input">
				<div id="rememberCode" class="icon-checkbox checked"><@spring.message code="login.label.remember"/></div>
			</div>
			<div class="split">
				<div class="forgetPanel">
					<@spring.message code="login.label.forgetPassword"/>	
				</div>
				<#if company == 0>
					<div class="regPanel">
						<@spring.message code="login.label.register"/>
					</div>
				</#if>
			</div>
		</div>
	</div>
	<div class="registerPanel">	
		<div class="login-form">
			<div class="form-input">	
				<div class="placeholder "><@spring.message code="register.label.user"/></div>
				<input id="reg_username" autocomplete="off"/>
			</div>
			<div class="form-input">
				<div class="placeholder"><@spring.message code="register.label.password"/></div>
				<input id="reg_pswd1" type="password" autocomplete="off"/>
			</div>
			<div class="form-input">
				<div class="placeholder"><@spring.message code="register.label.repassword"/></div>
				<input id="reg_pswd2" type="password" autocomplete="off"/>
			</div>
			<div class="form-input hidden validatePanel" id="validateCodePanel">
				<div class="placeholder"><@spring.message code="register.label.phoneCode"/></div>
				<input id="validateCode" autocomplete="off"/>
				<div class="codePanel">
					<div id="time" class="hidden"><span></span><@spring.message code="register.label.tip"/></div>
					<div id="sendValidateCode"><@spring.message code="register.button.sendCode"/></div>
				</div>
			</div>
			<div class="check-input readAndConfirm">
				<div class="icon-checkbox checked"><@spring.message code="register.label.readAndConfirm"/></div><a href="${webpath}/platform/login/user-agreement"><@spring.message code="register.label.userProtocol"/></a>
			</div>
			<div class="register-button">
				<span><@spring.message code="register.button.register"/></span>
				<div class="load">
		        	<img class="loading" src="data:image/png;base64,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">
		        </div>
			</div>
			<div class="goLoginPanel">
				<@spring.message code="register.label.haveAccount"/> 
			</div>
		</div>
	</div>
</div>
<div class="footer">
	<div>
		<div class='chinese'>中文</div>
		<div class="footer-link-separator"></div>
		<div class="english">ENGLISH</div>
		<div class="footer-link-separator"></div>
		<div class="record">苏ICP备15027026号-1</div>
	</div>
</div>
<div class="bg"><div class="warning"></div></div>
<ul class="bg-bubbles blur"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>
<script src="${resPath}/bace/js/jquery/jquery-1.11.2.min.js"></script>
<script src="${resPath}/bace/js/require.js"></script>
<script src="${resPath}/resources/platform/frame/login/js/message.js"></script>
<script src="${resPath}/resources/platform/frame/login/js/sa_ceshi.js"></script>
<script>
var respath_js = '${resPath}';
var config = {
	urlArgs :'c='+(new Date().getTime()),
	baseUrl : resPath + '/bace/js',
	waitSeconds : 60,
	paths : {
		"sabace" : "tools/sa-bace",
		'cookie' : 'jquery-cookie/jquery.cookie',
		'login': '${resPath}/resources/platform/frame/login/js/login'
	}
};
require.config(config);
require(['login']);
</script>
</body>
</html>