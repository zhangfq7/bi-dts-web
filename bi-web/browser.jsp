<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
<link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>browser</title>
<style>
body {
	font-family: "微软雅黑";
	overflow: hidden;
	
}

.browser-content{
    background : #686868;
    position : absolute;
    top : 0px;
    bottom : 0px;
    left :0px;
    right : 0px;
}

.browser-img{
    background-image: url(${resPath}/bace/img/error/browser.png);
    height:173px;
    width : 162px;
    position:absolute;
    left:50%;
    margin-left:-81px;
    top:20%;
}

.browser-txt{
   position:absolute;
   top:20%;
   left:50%;
   margin-top:200px;
   margin-left:-265px;
   color : #fff;
   width:550px;
   text-align:center;
}

.span1{
    font-size:35px;
    letter-spacing:4px;
    margin-bottom:25px;
}

.span2{
    font-size:15px;
    letter-spacing:2px;
    margin-bottom:25px;
}

.span3{
    font-size:13px;
    opacity: .8;
}

.span3 span{
    margin-left:20px;
}

</style>
</head>

<body>
	<div class="browser-content">
	       <div class="browser-img">
	       </div>
	       <div class="browser-txt">
	          <div class="span1">您的浏览器不受支持。</div>
	          <div class="span2">若要使用SAAS-BI，我们建议你使用最新版的谷歌、火狐或IE浏览器。</div>
	          <div class="span3">Smart Analysis    <span>保留所有权利。</span></div>
	       </div>
	       
	</div>
</body>
<script type="text/javascript">
     
</script>
</html>