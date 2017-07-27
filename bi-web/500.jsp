<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.lang.Exception" %>
<% String path=request.getContextPath(); String exception=request.getParameter("ex"); if (null==exception) { exception=(String)request.getAttribute( "ex"); } request.setAttribute("ex",exception); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>500</title>
<link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
<style>
body {
	font-family: "微软雅黑";
	overflow: hidden;
}
.img-500 {
	width: 396px;
	height: 324px;
	background-image: url(${resPath}/bace/img/error/500.png);
}
.box {
	position: absolute;
	top: 40%;
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
.disabled-select {
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	-khtml-user-select: none;
	user-select: none;
}
.button {
	margin: 30px 40px;
}
.button>div {
	display: inline-block;
	margin-right: 25px;
	text-align: center;
	width: 150px;
	height: 38px;
	line-height: 38px;
	color: #fff;
	font-weight: bold;
	font-size: 16px;
	cursor: pointer;
	border-radius: 3px;
	letter-spacing: 1px;
}
.button-500 {
	background: #DCA23C;
}
.button-500:hover {
	background: #E1B640;
	box-shadow: 0 5px 0px #DCA23C;
}
.button-500:active {
	background: #f4ab38;
	box-shadow: 0 5px 0px #e5910c;
}
.button-500-back {
	background: #248CBE;
}
.button-500-back:hover {
	background: #1697d5;
	box-shadow: 0 5px 0px #1284bb;
}
.button-500-back:active {
	background: #086795;
	box-shadow: 0 5px 0px #085980;
}
.text-500 {
	margin-bottom: 20px;
	margin-left: -30px;
	text-align: center;
	color: #4F4F4F;
	font-size: 25px;
	font-weight: bolder;
}
.error {
	font-size: 14px;
	color: red
}
</style>
</head>

<body>
<div class="box">
	<div class="content">
		<div class='text-500'>
			<div id='text'></div>
			<div class='error'>${requestScope.ex}</div>
		</div>
		<div class='img-500'></div>
		<div class='button'>
			<div id='button' class='button-500 disabled-select' onclick='goLoginPage()'></div>
		</div>
	</div>
</div>
</body>
<script>
(function() {
var msgMap = {
	"text": {
		zh: "页面出现系统误错，请联系管理员！",
		en: "The page error, Where is your admin ?"
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
		//top.document.location.href ="${webpath}/";
	// 测试
	top.document.location.href ="http://portal.dev-citic.dataos.io/dts/sso/union-entry";
  // 生产
  // top.document.location.href ="http://data.c.citic/dts/sso/union-entry";
}
</script>

</html>