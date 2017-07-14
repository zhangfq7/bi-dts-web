<#include "view/platform/frame/bace/top.ftl">
  <link rel="stylesheet" href="${resPath}/resources/platform/overview/css/system-global.css${css_version}" />
  <input type="hidden" id="wechatValue" value="${sysGlobalBean.openWechatFlag}"/>
  <input type="hidden" id="smsValue" value="${sysGlobalBean.openSmsFlag}"/>
  <input type="hidden" id="emailValue" value="${sysGlobalBean.openEmailFlag}"/>
  <input type="hidden" id="logoValue" value="${sysGlobalBean.openLogoFlag}"/>
  <div class="main-panel">
	<ul>
		<li>
			<ul class='user-panel info'>
				<li> 
					<div class='user-head-class'>
						<img class='theme-border-color' src="${webpath}/platform/readUserImg/${funcId}?t=${date}">
					</div>
					<div class='company-info'>
						<div class="f14 font-bolder"><@spring.message code="system.label.company"/></div>
						<div class="f14">
						   <#if sysGlobalBean.companyFlag==0>
						         <@spring.message code="system.label.noCompany.user"/>
						   </#if>
						   <#if sysGlobalBean.companyFlag==1>
						      <a tag target="_blank" href="${webpath}/platform/sysmanage/company/info/${funcId}">
						         <div class="nameDiv">${sysGlobalBean.companyName}</div>
						      </a>  
						   </#if>
						</div>
						<#if sysGlobalBean.companyFlag==1>
						<div class="f14">（${sysGlobalBean.userCount} <@spring.message code="system.label.people"/>）</div>
						</#if>
					</div>
				</li>
				<li class='user-detail'>
					<div class='user-name'>
						<div class="f12" title="${sysGlobalBean.userName}">
						   <a tag target="_blank" href="${webpath}/platform/sysmanage/user/info/${funcId}">
						        <div class="nameDiv">${sysGlobalBean.userName}</div>
						   </a>
						</div>
					</div>
					<!--<div class='bind-service'>
						<i class="fa fa-weixin f12 flag${sysGlobalBean.openWechatFlag} <#if sysGlobalBean.openWechatFlag==1> theme-background  </#if>"></i>
					</div>
					<div class='bind-service'>
						<i class="fa fa-mobile-phone f15 flag${sysGlobalBean.openSmsFlag} <#if sysGlobalBean.openSmsFlag==1> theme-background  </#if>" style="padding: 3px 7px 0px 7px; vertical-align: middle;height:21px;"></i>
					</div>-->
					<div class='bind-service'>
						<i class="fa fa-envelope f12 flag${sysGlobalBean.openEmailFlag} <#if sysGlobalBean.openEmailFlag==1> theme-background  </#if>"></i>
					</div>
					<div class='bind-service'>
						<i class="fa fa-flag f12 flag${sysGlobalBean.openLogoFlag} <#if sysGlobalBean.openLogoFlag==1> theme-background  </#if>"></i>
					</div>
				</li>
				
				<li class='user-integral'>
					<div><span class="f14 font-bolder"><@spring.message code="system.label.avaliable.points"/></span></div>
					<div>
						<span class="f20 font-bolder font-orange">${sysGlobalBean.vantages}</span>
					</div>
					<div class='user-integral-oper'>
						<span class="f12 integral-oper">
							<a tag target="_blank" href="${webpath}/platform/sysmanage/finance/recharge/${funcId}"><@spring.message code="system.label.recharge"/></a>
						</span>
						<span class="f12 integral-oper">
							<a tag target="_blank" href="${webpath}/platform/sysmanage/finance/detail/${funcId}"><@spring.message code="system.label.details"/></a>
						</span>
					</div>
				</li>
				
				<li class='user-storage'>
					<div><span class="f14 font-bolder"><@spring.message code="system.label.saving.space"/></span></div>
					<div id="storageDiv">
						<div id="allStorage" class="progress">
							<div id="usedStorage" class="progress-bar theme-background"><span class='hide'>${sysGlobalBean.usedSpace}M</span></div>
						</div>
					</div>
					<div><span class="f14 font-bolder allSpace"><span class='hide'>${sysGlobalBean.allSpace}M</span></span></div>
				</li>
				
				<li class='user-report'>
					<div>
						<i class="fa fa-bar-chart-o f14"></i>
						<span class="f14"><@spring.message code="system.label.analyse.report"/></span>
						<span class="f16 font-bolder font-orange" id="reportCount">${sysGlobalBean.reportCount}</span>
						<span class="f14"><@spring.message code="system.label.amount"/></span>
					</div>
					<div>
						<i class="fa fa-paw f14"></i>
						<span class="f14"><@spring.message code="system.label.login.system"/></span>
						<span class="f16 font-bolder font-orange">${sysGlobalBean.visitCount}</span>
						<span class="f14"><@spring.message code="system.label.count"/></span>
					</div>
				</li>
			</ul>
		</li>
		<li>
			<ul class='user-panel bill'>
				<li class='select-acyc'>
					<div>
						<span class="f14 font-bolder"><@spring.message code="system.label.bill.search"/></span>
					</div>
					<div class='input-group input-group-sm' style="position:relative;width:215px;">
						<input type='text' class="form-control" id="time-picker" readOnly />
						<span class="input-group-addon acyc-icon" id="time-icon">
							<i class="fa fa-clock-o"></i>
						</span>
					</div> 
				</li>
				<li>
					<div id="acycBillChart"></div>
					<div id="noBillData" class="noData" style="display:none">
					    <div class='icon'>!</div>
					    <div class='text'><@spring.message code="system.label.noData"/></div>
					</div>
				</li>
			</ul>
		</li>
		<li>
			<ul class='user-panel visit'>
				<li>
					<div style="width: 100%; height: 33px; text-align: center;">
						<span class="f14 font-bolder"><@spring.message code="system.label.report.rank"/></span>
					</div>
				</li>
				<li>
					<div id="visitRankChart"></div>
					<div id="noRankData" class="noData rankDiv" style="display:none">
					    <div class='icon'>!</div>
					    <div class='text'><@spring.message code="system.label.noData"/></div>
					</div>
				</li>
			</ul>
		</li>
	</ul>
	
	<ul>
		<li class="service-name-panel">
			<i class="fa fa-info-circle f16 service-info-icon"></i><span class="title-str f14" ><@spring.message code="system.label.openService"/></span>
		</li>
		<li class="open-service-panel">
			<ul>
				<li class="service-info">
					<ul>
						<li>
							<span class="f12 font-bolder"><@spring.message code="system.label.compuandstorage"/></span>
						</li>
						<li>
							<div class="service-info-name">
								<i class="fa fa-database f14 service-info-icon"></i>
								<span class="f12"><@spring.message code="system.label.space.expend"/></span>
								<span class="f12">（<span class="f14 font-bolder font-orange" id="allspace"></span>）</span>
							</div>
							<div class="service-info-oper">
								<i class="fa fa-cart-plus f14 font-orange"></i>
								<span id="extendStorage" class="f12 spaceDetails"><@spring.message code="system.label.expend"/></span>
								<!--<span class="f12">|</span>
								<span class="f12 spaceDetails"><@spring.message code="system.label.detail"/></span>-->
							</div>
						</li>
						<li class="hide">
							<div class="service-info-name">
								<i class="fa fa-cubes f14 service-info-icon"></i>
								<span class="f12"><@spring.message code="system.label.distridata.computing"/></span>
								<span class="f12">（<span class="f14 font-bolder font-orange">${sysGlobalBean.calcNodeNum}</span>&nbsp;<@spring.message code="system.label.amount"/>）</span>
							</div>
							<div class="service-info-oper">
								<i class="fa fa-cart-plus f14 font-orange"></i>
								<span class="f12"><@spring.message code="system.label.add"/></span>
							</div>
						</li>
						<li class="hide">
							<div class="service-info-name">
								<i class="fa fa-object-group f14 service-info-icon"></i>
								<span class="f12"><@spring.message code="system.label.data.contacat"/></span>
								<span class="f12">（<span class="f14 font-bolder font-orange">${sysGlobalBean.linkDataNum}</span>&nbsp;<@spring.message code="system.label.amount"/>）</span>
							</div>
							<div class="service-info-oper">
								<i class="fa fa-cart-plus f14 font-orange"></i>
								<span class="f12"><@spring.message code="system.label.add"/></span>
							</div>
						</li>
					</ul>
				</li>
				<li class="service-info">
					<ul>
						<li>
							<span class="f12 font-bolder"><@spring.message code="system.label.visit.control"/></span>
						</li>
						<#if job != 'C' && companyFlag !=0>
							<li class="">
								<div class="service-info-name">
									<i class="fa fa-users f14 service-info-icon"></i>
									<span class="f12"><@spring.message code="system.label.company.num"/></span>
									<span class="f12">（<span class="f14 font-bolder font-orange">${sysGlobalBean.userCount}/${sysGlobalBean.maxUserNum}</span>&nbsp;<@spring.message code="system.label.people"/>）</span>
								</div>
								<div class="service-info-oper">
									<i class="fa fa-cart-plus f14 font-orange"></i>
									<span class="f12 cursor-pointer" id="extendUserNum"><@spring.message code="system.label.expend"/></span>
								</div>
							</li>
						<#else>
							<li>
								<div class="noData" style="display:block">
								    <div class='icon'>!</div>
								    <div class='text'><@spring.message code="system.label.noVisitInfo"/></div>
								</div>
							</li>
						</#if>
						
						<li class="hide">
							<div class="service-info-name">
								<i class="fa fa-sitemap f14 service-info-icon"></i>
								<span class="f12"><@spring.message code="system.label.sameTime.people"/></span>
								<span class="f12">（<span class="f14 font-bolder font-orange">${sysGlobalBean.maxVisitNum}</span>&nbsp;<@spring.message code="system.label.people"/>）</span>
							</div>
							<div class="service-info-oper">
								<i class="fa fa-cart-plus f14 font-orange"></i>
								<span class="f12"><@spring.message code="system.label.expend"/></span>
							</div>
						</li>
					</ul>
				</li>
				<li class="service-info">
					<ul>
						<li>
							<span class="f12 font-bolder"><@spring.message code="system.label.application.service"/></span>
						</li>
						<li class="hide">
							<div class="service-open-name">
								<i class="fa fa-weixin f14 service-info-icon"></i>
								<span class="f12"><@spring.message code="system.label.wechatData.subscribe"/></span>
							</div>
							<div class="service-open-oper">
								<input type="checkbox" id="openWeiChat" checked data-toggle="switch" data-size="mini" data-on-color="success" data-label-width="10" data-on-color="danger" data-on-text=<@spring.message code="system.label.open"/> data-off-text=<@spring.message code="system.label.close"/>>
								
							</div>
						</li>
						<li class="hide">
							<div class="service-open-name">
								<i class="fa fa-mobile-phone f30 service-info-icon"></i>
								<span class="f12"><@spring.message code="system.label.sms.warning"/></span>
							</div>
							<div class="service-open-oper">
								<input type="checkbox" id="openSms" checked data-toggle="switch" data-size="mini" data-on-color="success" data-label-width="10" data-on-color="danger" data-on-text=<@spring.message code="system.label.open"/> data-off-text=<@spring.message code="system.label.close"/>>
								
							</div>
						</li>
						<li>
							<div class="service-open-name">
								<i class="fa fa-envelope f14 service-info-icon"></i>
								<span id="emailInfo" class="f12 cursor-pointer"><@spring.message code="system.label.email.service"/></span>
							</div>
							<div class="service-open-oper">
								<input type="checkbox" id="openEmail" checked data-toggle="switch" data-size="mini" data-on-color="success" data-label-width="10" data-on-color="danger" data-on-text=<@spring.message code="system.label.open"/> data-off-text=<@spring.message code="system.label.close"/>>
								
							</div>
						</li>
						<li>
							<div class="service-open-name">
								<i class="fa fa-flag f14 service-info-icon"></i>
								<span id="logoInfo" class="f12 cursor-pointer"><@spring.message code="system.label.logo.service" /></span>
							</div>
							<div class="service-open-oper">
								<input type="checkbox" id="openLogo" checked data-toggle="switch" data-size="mini" data-on-color="success" data-label-width="10" data-on-color="danger" data-on-text=<@spring.message code="system.label.open"/> data-off-text=<@spring.message code="system.label.close"/>>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
</div>

<#include "view/platform/frame/bace/bottom.ftl">

<script>
_require(
	{
		paths : {
			'system-global/info': '${resPath}/resources/platform/overview/js/system-global',
			"ECharts/AMD": '${resPath}/bace/js/echarts/echarts.amd',
			"EBuilder": '${resPath}/bace/js/echarts/jquery.echarts.template',
			'glober/message': '${resPath}/resources/platform/overview/js/message'
		}
	},
	'system-global/info',function(global){
		global.init();
	}
);
</script>

