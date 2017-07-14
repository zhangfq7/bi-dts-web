<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.lang.Exception" %>
<% String path=request.getContextPath(); String exception=request.getParameter("ex"); if (null==exception) { exception=(String)request.getAttribute( "ex"); } %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>501</title>
<link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
<style>
body {
	font-family: "微软雅黑";
	overflow: hidden;
}
.img-501 {
	width: 337px;
	height: 500px;
	background-image: url(${resPath}/bace/img/error/501.png);
	background-size: 337px 500px;
    background-repeat: no-repeat;
}
.box {
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -250px;
	width:786px;
	margin-left:-393px;
}
.box>div {
	float:left;
}
.text-501 {
	text-align: center;
	color: #4F4F4F;
	font-size: 28px;
	font-weight: bolder;
	margin-top: 154px;
    padding-right: 20px;
}

.text-501>div:nth-child(2){
   margin-top:20px;
}

.button-501 {
	color: #fff;
    background: #6EACF9;
    font-size: 17px;
    padding: 8px 19px 10px 20px;
    margin: 21px 111px;
    letter-spacing: 1px;
    border-radius: 5px;
    cursor: pointer;
	
}
.button-501:hover {
	background: #3388F3;
}
</style>
</head>

<body>
<div class="box">
		<div class='text-501'>
			<div >对不起，您没有访问权限！</div>
			<div >Sorry, you do not have access!</div>
		</div>
		<div class='img-501' ></div>
</div>
</body>
<script>



</script>

</html>