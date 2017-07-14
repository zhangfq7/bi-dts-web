<#if pjax == "">
<!DOCTYPE html>
<html lang="zh">
<head>
<title>欢迎使用自助分析产品</title>
<meta charset="UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="${author}"/>
<meta name="keywords" content="${keywords}"/>
<meta name="description" content="${description}"/>
<meta http-equiv="cache-control" content="must-revalidate">
<meta http-equiv="pragma" content="Pragma">

<link id="top-theme" rel="stylesheet" href="${resPath}/bace/ui/css/flat-ui-blue.css" />
<link rel="stylesheet" href="${resPath}/bace/css/loadingbar.css" />
<link rel="stylesheet" href="${resPath}/resources/platform/frame/retripsd/css/retop.css" />
<!--[if lt IE 9]>
<script src="${resPath}/bace/ui/css/vendor/html5shiv.js"></script>
<script src="${resPath}/bace/ui/css/vendor/respond.min.js"></script>
<![endif]-->
</head>
<body>
		<div class="head">
			<div class="head-image"></div>
			<#if company == 0>
				<div class="verticalline"></div>
				<label class="left-text"><@spring.message code="retop.label.title"/></label>
			</#if>
			<div class="right">
				<#if company == 0>
					<label class="right-text"><@spring.message code="retop.label.tipMsg"/></label>
				</#if>
				<a href="${webpath}/platform/login/page" class="btn btn-sm btn-info btn-login"><@spring.message code="retop.button.login"/></a>
			</div>
		</div>
		</#if>