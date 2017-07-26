<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
<link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>404</title>
<style>
body {
	font-family: "微软雅黑";
	overflow: hidden;
}
.img-404 {
	width: 480px;
	height: 324px;
	background-image: url(${resPath}/bace/img/error/404.png);
}
.box {
	position: absolute;
	top: 39%;
	left: 50%;
	width: 480px;
	height: 327px;
}
.content {
	position: relative;
	top: -50%;
	left: -50%;
	width: 100%;
	height: 100%;
}
.button-404 {
	margin: 30px auto;
	text-align: center;
	width: 150px;
	height: 38px;
	line-height: 38px;
	background: #DCA23C;
	color: #fff;
	font-weight: bold;
	cursor: pointer;
	border-radius: 3px;
	-webkit-transition: box-shadow .3s linear;
}
.button-404:hover {
	background: #E1B640;
	box-shadow: 0 5px 0px #DCA23C;
}
.button-404:active {
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
.text-404 {
	margin-bottom: 20px;
	text-align: center;
	font-size: 25px;
	font-weight: bolder;
	color: #4F4F4F;
}
</style>
</head>

<body>
	<div class="box">
		<div class="content">
			<div id="text" class='text-404'></div>
			<div class='img-404'></div>
			<div id='button' class='button-404 disabled-select' onclick='goLoginPage()'></div>
		</div>
	</div>
</body>
<script type="text/javascript">
(function() {
var msgMap = {
	"text": {
		zh: "您访问的页面被外星人偷走啦.....",
		en: "The page should be on Mars !"
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
	//top.document.location.href = "${webpath}/";
	top.document.location.href ="http://portal.dev-citic.dataos.io/dts/sso/union-entry";
}
</script>
</html>