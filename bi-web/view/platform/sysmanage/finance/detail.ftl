<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/finance/css/detail.css${css_version}" />
<!--start-->
<div class="panel">
	<span class="f16"><@spring.message code="finance.label.title"/></span>
</div>

<div class="panel-info">
	<div class="info-img"></div>
	<div><span class="f16"><@spring.message code="finance.label.lastintegral"/><span class="orange bolder">${companyVantages}</span><@spring.message code="finance.label.integralunit"/></span></div>
</div>

<div class="panel">

	<!-- Nav tabs -->
	<ul class="nav nav-tabs">
		<li class="active f16"><a href="#consume" class="theme-color" aria-controls="consume" role="tab" data-toggle="tab"><@spring.message code="finance.label.paymentrecord"/></a></li>
		<li class="f16"><a href="#account" class="theme-color" aria-controls="account" role="tab" data-toggle="tab"><@spring.message code="finance.label.inrecord"/></a></li>
	</ul>
	
	<div class="tab-content">
		<ul id="consume" role="tabpanel" class="tab-pane active validationEngineContainer">
			<li class="form-group form-group-sm">
				<div class="other-label-class">
					<span class="f14"><@spring.message code="finance.label.consumecontent"/></span>
				</div>
				<div class="input-class">
					<input type="text" id="serviceName" value="" class="form-control" />
				</div>
				<div class="other-label-class">
					<span class="f14"><@spring.message code="finance.label.payintegralmonth"/></span>
				</div>
				<div class="input-class input-other">
					<input type="text" id="queryConsumeTime" readOnly  value="" class="form-control kalendar input-time-width" />
					<span class="adder acyc-icon" id="consume-time">
							<span class="glyphicon glyphicon-calendar theme-color"></span>
					</span>
				</div>
				<div class="button-class">
					<button id="consumeSearcheButton" type="button" class="btn btn-info btn-sm"><@spring.message code="finance.button.consumesearch"/></button>
				</div>
			</li>
			<li>
				<div class="consume-list-class">
					<table id="consumeListGrid" style="width:100%"></table>
				</div>
			</li>
			<li>
				<div class="summary-class">
					<span class="f14"><@spring.message code="finance.label.thispage"/><span id="integralsum" class="orange bolder">100</span>）</span>
				</div>
			</li>
		</ul>
		
		<ul id="account" role="tabpanel" class="tab-pane validationEngineContainer">
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code="finance.label.ordertime"/></span>
				</div>
				<div class="input-class input-other">
					<input type="text" id="queryRechargeTime" readOnly class="form-control kalendar ordertime input-time-width"/>
					<span class=" adder acyc-icon" id="recharge-time">
							<span class="glyphicon theme-color glyphicon-calendar"></span>
					</span>
				</div>
				<div class="label-class chosen-container chosen-container-single">
					<span class="f14"><@spring.message code="finance.label.inway"/></span>
					
				</div>
				<div class="input-class">
					<select data-placeholder="请选择入账方式" class="form-control chosen-select f12" id="rechargeType" >
					<option value="" selected><@spring.message code="finance.label.all" /></option>
					<option value="1"><@spring.message code="finance.label.rechargeType.Alipay" /></option>
					<option value="2"><@spring.message code="finance.label.rechargeType.WeChat" /></option>
					<option value="3"><@spring.message code="finance.label.rechargeType.CFT" /></option>
					</select>
				</div>
				<div class="label-class">
					<span class="f14"><@spring.message code="finance.label.instate"/></span>
				</div>
				<div class="input-class">
					<select data-placeholder="请选择入账状态" class="form-control chosen-select f12" id="rechargeState" >
					<option value="" selected><@spring.message code="finance.label.all" /></option>
					<option value="1"><@spring.message code="finance.label.rechargeState.notpay" /></option>
					<option value="4"><@spring.message code="finance.label.rechargeState.failed" /></option>
					<option value="9"><@spring.message code="finance.label.rechargeState.success" /></option>
					</select>
				</div>
				<div class="button-class">
					<button id="rechargeSearcheButton" type="button" class="btn btn-info btn-sm"><@spring.message code="finance.button.recordsearch"/></button>
				</div>
			</li>
			<li>
				<div class="recharge-list-class">
					<table id="rechargeListGrid" style="width:100%"></table>
				</div>
			</li>
			<li>
				<div class="summary-class">
					<span class="f14"><@spring.message code="finance.label.total"/><span class="orange bolder" id="paysucess">100</span><@spring.message code="finance.label.unitandpayfailed"/><span class="orange bolder" id="payfailed">300</span><@spring.message code="finance.label.unitandinintegral"/><span class="orange bolder" id="rechargeIntegral">100</span>）</span>
				</div>
			</li>
		</ul>
	</div>

</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
{
	paths : {
		'detail/message': '${resPath}/resources/platform/sysmanage/finance/js/message',
		'detail/info':'${resPath}/resources/platform/sysmanage/finance/js/detail'
	}
},
'detail/info',function(detail){
	detail.init();
}
);
</script>