<#if pjax == "">
<!DOCTYPE html>
<html lang="zh">
<head>
<title><@spring.message code="top.label.title"/></title>
<meta charset="UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="${author}"/>
<meta name="keywords" content="${keywords}"/>
<meta name="description" content="${description}"/>
<meta http-equiv="cache-control" content="must-revalidate">
<meta http-equiv="pragma" content="Pragma">

<link rel="stylesheet" href="${resPath}/bace/plugins/sa-plugins.css" />
<link id="top-theme" rel="stylesheet" href="${resPath}/bace/ui/css/flat-ui-blue.css" />
<link rel="stylesheet" href="${resPath}/bace/css/loadingbar.css" />
<link rel="stylesheet" href="${resPath}/resources/manage/frame/bace/css/top.css${css_version}" />
<link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
<!--[if lt IE 9]>
<script src="${resPath}/bace/ui/css/vendor/html5shiv.js"></script>
<script src="${resPath}/bace/ui/css/vendor/respond.min.js"></script>
<![endif]-->
</head>
<body>
<div class="container">
<nav class="navbar navbar-inverse navbar-embossed navbar-fixed-top" role="navigation">
	<div class="container-fluid">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<div class='logo'>
				<img src="${resPath}/resources/manage/frame/bace/img/logo.png" />
			</div>
		</div>
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav">
				<#list Session.ManageSessBean.sysMenuList as sysMenu>
				    ${sysMenu}
				</#list>
			</ul>
			<ul class="nav navbar-nav navbar-right" role="search">
				<li class="head-msg">
				    <img src="${webpath}/manage/readUserImg/${funcId}?t=${date}" class='head-img'>
				</li>
				<li class='head-font f14 disabled-select'>
				   <@spring.message code="top.label.welcome"/>${Session.ManageSessBean.userName}&nbsp;<i class='fa fa-caret-down'></i>
				</li>
			</ul>
		</div>
</nav>
</div>

<div class='hide'>
	<ul class='tooltip-menu'>
		<li class="userInfo"><i class="fa fa-cogs" style='padding-right:8px;'></i><@spring.message code="top.label.userInfo"/></li>
		<li class="safety"><i class="fa fa-question" style='padding-right:15px;'></i><@spring.message code="top.label.safety"/></li>
		<li class="help"><i class="fa fa-question" style='padding-right:15px;'></i><@spring.message code="top.label.help"/></li>
		<li class='out'><i class="fa fa-sign-out" style='padding-right:10px;'></i><@spring.message code="top.label.logout"/></li>
	</ul>
</div>

<div class="container-fluid">
	<div class="main" id="pjax-container">
</#if>

