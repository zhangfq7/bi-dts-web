<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>timeout</title>
<link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
<style>
body {
	font-family: "微软雅黑";
	overflow: hidden;
}
.img-timeout {
	margin: 0 auto;
	width: 377px;
	height: 319px;
	background-image: url(${resPath}/bace/img/error/timeout.png);
}
.box {
	position: absolute;
	top: 45%;
	left: 50%;
	width: 480px;
	height: 400px;
}
.content {
	position: relative;
	top: -50%;
	left: -50%;
	width: 100%;
	height: 100%;
}
.button-timeout {
	margin: 30px auto;
	width: 150px;
	height: 38px;
	line-height: 38px;
	background: #DCA23C;
	color: #fff;
	font-weight: bold;
	text-align: center;
	cursor: pointer;
	border-radius: 3px;
	-webkit-transition: box-shadow .3s linear;
	letter-spacing: 1px;
}

.button-timeout:hover {
	background: #E1B640;
	box-shadow: 0 5px 0px #DCA23C;
}

.button-timeout:active {
	background: #f4ab38;
	box-shadow: 0 5px 0px #e5910c;
}

.disabled-select {
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	-khtml-user-select: none;
	user-select: none;
}

.text-timeout {
	margin-bottom: 20px;
	margin-left: 35px;
	text-align: center;
	color: #4F4F4F;
	font-size: 25px;
	font-weight: bolder;
}
</style>
</head>

<body>
	<div class="box">
		<div class="content">
			<div id="text" class='text-timeout'></div>
			<div class='img-timeout'></div>
			<div id="button" class='button-timeout disabled-select' onclick='goLoginPage()'></div>
		</div>
	</div>
</body>
<script type="text/javascript">
(function() {
	var msgMap = {
		"text": {
			zh: "嘿嘿，访问超时,系统都睡着了！",
			en: "Visit the timeout,login again !"
		},
		"button": {
			zh: "返回重新登录",
			en: "Go login page"
		}
	};
	
	function getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg)) return unescape(arr[2]);
		else return "";
	}
	var lang = getCookie('org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE') || 'zh';
	document.getElementById("text").innerText = msgMap.text[lang];
	document.getElementById("button").innerText = msgMap.button[lang];
})();

function goLoginPage() {
	var pathname = location.pathname;
	var url = pathname.substring('${webpath}'.length + 1);
	var platName = (url.substring(0, url.indexOf("/")));
	//top.document.location.href = "${webpath}/" + platName + "/login/page";
	top.document.location.href ="http://portal.dev-citic.dataos.io/dts/sso/union-entry";
}
</script>

</html>