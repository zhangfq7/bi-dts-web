<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/user/css/user-safety.css" />

<!--start-->
<div class="panel f16 main-title">
	<@spring.message code="user.label.accountSecurity"/>
</div>

<div class="panel main-container">
	<div class="safety-photo">
		<img src="${resPath}/resources/platform/sysmanage/user/img/safety.png">
	</div>
	
	<div class="safety-content">
		<!--   
		<ul>
			<li class="entry-img">
				<img src="${resPath}/resources/platform/sysmanage/user/img/dot.png">
			</li>
			<li class="entry-content f14">
				<div class="title"><@spring.message code="user.label.risk.record"/></div>
				<#if ipFlag>
				<div class="explain"><@spring.message code="user.label.operation"/><span id='loginTime'>${ipAddress.adminTime}</span> <span id='loginAddress'>  ${ipAddress.address}</span></div>
				<#else>
				<div class="explain"><@spring.message code="user.label.operation"/><span><@spring.message code="user.label.getIpError"/></span></div>
				</#if>
			</li>
			<li class="entry-oper f14 oper-detail theme-color"><@spring.message code="user.label.detail"/></li>
		</ul>
		-->
		<ul>
			<li class="entry-img">
				<img src="${resPath}/resources/platform/sysmanage/user/img/dot.png">
			</li>
			<li class="entry-content f14">
				<div class="title"><@spring.message code="user.label.changePsd"/></div>
				<div class="explain"><@spring.message code="user.label.changePsd.tip"/></div>
			</li>
			<li class="entry-oper f14 modify-pwd theme-color"><@spring.message code="user.label.change"/></li>
		</ul>
		<#if emailFlag>
		<ul id="changeEmial" class="">
			<li class="entry-img">
				<img src="${resPath}/resources/platform/sysmanage/user/img/dot.png">
			</li>
			<li class="entry-content f14">
				<div class="title"><@spring.message code="user.label.change.email"/></div>
				<div class="explain"><span id="email">${email}</span><@spring.message code="user.label.change.email.tip"/></div>
			</li>
			<li class="entry-oper f14 modify-email theme-color"><@spring.message code="user.label.change"/></li>
		</ul>
		<#else>
		<ul id="bindEmail" >
			<li class="entry-img">
				<img src="${resPath}/resources/platform/sysmanage/user/img/dot.png">
			</li>
			<li class="entry-content f14">
				<div class="title"><@spring.message code="user.label.bind.email"/></div>
				<div class="explain"><@spring.message code="user.label.bind.email.tip"/></div>
			</li>
			<li class="entry-oper f14 bind-email theme-color"><@spring.message code="user.label.bind"/></li>
		</ul>
        </#if>
        <#if mobileNumFlag>
		<ul id="changeMobileNum" >
			<li class="entry-img">
				<img src="${resPath}/resources/platform/sysmanage/user/img/dot.png">
			</li>
			<li class="entry-content f14">
				<div class="title"><@spring.message code="user.label.change.mobile"/></div>
				<div class="explain"><span id="mobileNum">${mobileNum}</span><@spring.message code="user.label.change.mobile.tip"/></div>
			</li>
			<li class="entry-oper f14 modify-phone theme-color"><@spring.message code="user.label.change"/></li>
		</ul>
		<#else>
		<ul id="bindMobileNum" >
			<li class="entry-img">
				<img src="${resPath}/resources/platform/sysmanage/user/img/dot.png">
			</li>
			<li class="entry-content f14">
				<div class="title"><@spring.message code="user.label.bind.mobile"/></div>
				<div class="explain"><@spring.message code="user.label.bind.mobile.tip"/></div>
			</li>
			<li class="entry-oper f14 bind-phone theme-color"><@spring.message code="user.label.bind"/></li>
		</ul>
		</#if>
		<#if transAuthFlag>
		<ul id="transAuth" >
			<li class="entry-img">
				<img src="${resPath}/resources/platform/sysmanage/user/img/dot.png">
			</li>
			<li class="entry-content f14">
				<div class="title"><@spring.message code="user.label.transfer.right"/></div>
				<div class="explain"><@spring.message code="user.label.transfer.right.tip"/></div>
			</li>
			<li class="entry-oper f14 transfer-right theme-color"><@spring.message code="user.label.change"/></li>
		</ul>
		</#if>
	</div>
</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
	{
		paths : {
			'user/safety':'${resPath}/resources/platform/sysmanage/user/js/user-safety',
			'user/message':'${resPath}/resources/platform/sysmanage/user/js/message'
		}
	},
	'user/safety',function(safety){
		safety.init();
	}
);
</script>