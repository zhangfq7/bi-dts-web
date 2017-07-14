<#if pjax == "">
<!DOCTYPE html>
<html lang="zh">
<head>
<title><@spring.message code="top.label.title"/></title>
<meta charset="UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="author" content="${author}"/>
<meta name="keywords" content="${keywords}"/>
<meta name="description" content="${description}"/>
<meta http-equiv="cache-control" content="public">
<meta http-equiv="pragma" content="Pragma">
<meta http-equiv="Expires" content="Mon,12 May 2050 00:20:00 GMT">
<link rel="stylesheet" href="${resPath}/bace/plugins/sa-plugins.css" />
<link id="top-theme" rel="stylesheet" href="${resPath}/bace/ui/css/flat-ui-${Session.UserSessBean.companyTheme}.css" />
<link rel="stylesheet" href="${resPath}/bace/css/loadingbar.css" />
<link rel="stylesheet" href="${resPath}/resources/platform/frame/bace/css/top.css${css_version}" />
<link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
<!--[if lt IE 9]>
<script src="${resPath}/bace/ui/css/vendor/html5shiv.js"></script>
<script src="${resPath}/bace/ui/css/vendor/respond.min.js"></script>
<![endif]-->
</head>
<body>
<div class="container" style="height:60px">
	<div id="bi-nav" class="bi-nav">
			<div class="logo" style="cursor:pointer">
				<img  <#if LOGO_URL != ''> onclick='javascript:window.location.href="${LOGO_URL}"'</#if> src="${webpath}/platform/read-theme/${funcId}?t=${date}" />
			</div>
			<#if forceChangePwd != "1">
				<div class="list">
					<ul>
					<#list Session.UserSessBean.sysMenuList as sysMenu>
					    ${sysMenu}
					</#list>
					</ul>
				</div>
				<div class="user">
					<div class="head-img">
						<span class="navbar-new noreadNum faa-shake animated"></span>
						<img src="${webpath}/platform/readUserImg/${funcId}?t=${date}" />
					</div>
					<div class="head-font">
						<span><@spring.message code="top.label.welcome"/>${Session.UserSessBean.userName}</span>
					</div>
					<div class="head-i">
					    <i class='fa fa-caret-down'></i>
					</div>
				</div>
			</#if>
		</div>
</div>

<div class='hide'>
	<ul class='tooltip-menu'>
		<li class="userInfo"><a tag target="_blank" href="${webpath}/platform/sysmanage/user/info/${funcId}"><i class="fa fa-cogs"></i><span><@spring.message code="top.label.userInfo"/></span></a></li>
		<#if "${runMode}" == "debug">
		  <li class="refresh"><i class="fa fa-refresh"></i><span><@spring.message code="top.label.refresh"/></span></li>
		</#if>
		<li class="safety"><a tag target="_blank" href="${webpath}/platform/sysmanage/user/safety/${funcId}"><i class="fa fa-umbrella"></i><span><@spring.message code="top.label.safety"/></span></a></li>
		<li class="help"><a tag target="_blank" href="${webpath}/platform/msg/msg-list/${funcId}"><i class="fa fa-commenting"></i><span><@spring.message code="top.label.message"/></span></a></li>
		<#if Session.UserSessBean.isSso != "1">
		<li class='out'><i class="fa fa-sign-out"></i><@spring.message code="top.label.logout"/></li>
		</#if>
	</ul>
</div>

<div class='hide'>
	<div class='msg-menu'>
		 <div class="msg-head">
		     <@spring.message code="msg.label.top1"/> <span class="new-message"></span> <@spring.message code="msg.label.top2"/>
		 </div>
		 <div class="msg-content" id="msg-content">
		    
	     </div>
	     <div class="msg-foot">
	            <span><@spring.message code="msg.label.moreMsg"/></span><span class="glyphicon glyphicon-circle-arrow-right"></span>
	     </div>
	</div>
</div>

<div class="container-fluid">
	<div class="main" id="pjax-container">
</#if>

