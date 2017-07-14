<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/overview/css/system-global-company.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/overview/css/service-info.css${css_version}" />
<input type="hidden" id="wechatValue" value="${sysGlobalBean.openWechatFlag}"/>
<input type="hidden" id="smsValue" value="${sysGlobalBean.openSmsFlag}"/>
<input type="hidden" id="emailValue" value="${sysGlobalBean.openEmailFlag}"/>
<input type="hidden" id="logoValue" value="${sysGlobalBean.openLogoFlag}"/>
  
  <div class="main-panel">
	<ul>
		<!--信息概览-->
		<li>
			<ul class='user-panel info'>
				<!--企业信息-->
				<li>
					<div class='user-head-class'>
						<img class='theme-border-color' src="${webpath}/platform/readUserImg/${funcId}?t=${date}">
					</div>
					<#--<div class='company-info'>
						<div class="f14 font-bolder"><@spring.message code="system.label.company"/></div>
						<div class="f14">
						 	<div class="nameDiv theme-color">${sysGlobalBean.companyName}</div>
						</div>
					</div>-->
				</li>
				
				<!--用户名及开通服务-->
				<li class='user-detail'>
					<div class='user-name'>
						<div class="f12" title="${sysGlobalBean.userName}">
						   <a tag target="_blank" href="${webpath}/platform/sysmanage/user/info/${funcId}">
						        <div class="nameDiv">${sysGlobalBean.userName}</div>
						   </a>
						</div>
					</div>
				</li>
				
				<!--总用户-->
				<li class="user-num all-user-Num">
					<div><span class="f14 font-bolder"><@spring.message code="system.label.allUser.count"/></span></div>
					<div>
						<span class="f20 font-bolder font-orange">${sysGlobalBean.userCount}</span><span class="f14 font-bolder userPeople">人</span>
					</div>
				</li>
				<!--在线用户-->
				<li class="user-num online-user-num">
					<div><span class="f14 font-bolder"><@spring.message code="system.label.onlineUser.count"/></span></div>
					<div>
						<span class="f20 font-bolder font-orange">${sysGlobalBean.onlineCount}</span><span class="f14 font-bolder userPeople">人</span>
					</div>
				</li>
				
				<!--用户存储空间-->
				<li class='user-storage'>
					<div><span class="f14 font-bolder"><@spring.message code="system.label.saving.space"/></span></div>
					<div id="storageDiv">
						<div id="allStorage" class="progress">
							<div id="usedStorage" class="progress-bar theme-background"><span class='hide'>${sysGlobalBean.usedSpace}M</span></div>
						</div>
					</div>
					<div><span class="f14 font-bolder allSpace"><span class='hide'>${sysGlobalBean.allSpace}M</span></span></div>
				</li>
				
				<!--用户报表数及登录系统次数-->
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
		
		<!--仪表板排名-->
		<li>
			<ul class='user-panel'>
				<li>
					<div style="height: 33px; margin-left: 180px;" class="div-inline">
						<span class="f14 font-bolder"><@spring.message code="system.label.dashboard.rank"/></span>
					</div>
					<div class="rank-select div-inline f12">
						<select class="chosen-select" id="selectRank">
							<option value="visit" selected><@spring.message code="system.label.select.visit"/></option>
							<option value="share"><@spring.message code="system.label.select.share"/></option>
							<!--<option value="email"><@spring.message code="system.label.select.email"/></option>-->
						</select>
					</div>
				</li>
				<li>
					<div id="dashboardChart"></div>
					<div id="noDashboardData" class="noData" style="display:none">
					    <div class='icon'>!</div>
					    <div class='text'><@spring.message code="system.label.noData"/></div>
					</div>
				</li>
			</ul>
		</li>
		
		<!--模板排名-->
		<li>
			<ul class='user-panel'>
				<li>
					<div style="width: 100%; height: 33px; text-align: center;">
						<span class="f14 font-bolder"><@spring.message code="system.label.tpl.rank"/></span>
					</div>
				</li>
				<li>
					<div id="tplRankChart"></div>
					<div id="noTplRankData" class="noData" style="display:none">
					    <div class='icon'>!</div>
					    <div class='text'><@spring.message code="system.label.noData"/></div>
					</div>
				</li>
			</ul>
		</li>
		
		<!--七日内数据更新监控-->
		<li>
			<ul class='user-panel top-range'>
				<li>
					<div style="width: 100%; height: 33px; text-align: center;">
						<span class="f14 font-bolder"><@spring.message code="system.label.data.monitor"/></span>
					</div>
				</li>
				<li>
					<div class="data-tip-div">
						<span class="data-tip-title"><@spring.message code="system.label.data.tips"/></span>
						<div class="data-result">
							<span class="f14 font-bolder"><@spring.message code="system.label.data.successCount"/></span><span id="dataSuccNum" class="f20 font-bolder font-orange data-num-span"></span><br>
							<span class="f14 font-bolder"><@spring.message code="system.label.data.failCount"/></span><span id="dataFailNum" class="f20 font-bolder font-red data-num-span"></span>
						</div>
					</div>
					<div class="data-chart-div">
						<div id="dataChart"></div>
						<div id="noDataData" class="noData" style="display:none">
						    <div class='icon'>!</div>
						    <div class='text'><@spring.message code="system.label.noData"/></div>
						</div>
					</div>
				</li>
			</ul>
		</li>
		
		<!--数据源监控-->
		<li>
			<ul class='user-panel top-range'>
				<li>
					<div style="width: 100%; height: 33px; text-align: center;">
						<span class="f14 font-bolder"><@spring.message code="system.label.dataSource.monitor"/></span>
					</div>
				</li>
				<li>
					<div id="dataSourceChart"></div>
					<div id="noDataSourceData" class="noData" style="display:none">
					    <div class='icon'>!</div>
					    <div class='text'><@spring.message code="system.label.noData"/></div>
					</div>
				</li>
			</ul>
		</li>
		
		<!--数据耗时-->
		<li>
			<ul class='user-panel top-range'>
				<li>
					<div style="width: 100%; height: 33px; text-align: center;">
						<span class="f14 font-bolder"><@spring.message code="system.label.time.rank"/></span>
					</div>
				</li>
				<li>
					<div id="dataTimeChart"></div>
					<div id="noDataTimeData" class="noData" style="display:none">
					    <div class='icon'>!</div>
					    <div class='text'><@spring.message code="system.label.noData"/></div>
					</div>
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
			'system-global/info': '${resPath}/resources/platform/overview/js/system-global-company',
			"ECharts/AMD": '${resPath}/bace/js/echarts/echarts.amd',
			"EBuilder": '${resPath}/bace/js/echarts/jquery.echarts.template',
			'glober/message': '${resPath}/resources/platform/overview/js/message',
			'system/serviceInfo':'${resPath}/resources/platform/overview/js/service-info'
		}
	},
	'system-global/info',function(global){
		global.init();
	}
);
</script>

