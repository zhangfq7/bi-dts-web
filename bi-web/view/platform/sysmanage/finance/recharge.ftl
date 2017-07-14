<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/finance/css/recharge.css${css_version}" />

<div class="panel">
	<span class="f16"><@spring.message code="finance.label.recharge.title" /></span>
</div>

<div class="panel">
	<ul class="tab-pane validationEngineContainer">
		<li class="form-group form-group-sm">
			<div class="title-img-class theme-color"></div>
			<div class="title-span-class">
				<span class="f20 bolder"><@spring.message code="finance.label.recharge" /></span>
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14 blue bolder"><@spring.message code="finance.label.recharge.integral" /></span>
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class">
				<div class="input-class">
					<input type="text" id="integralNumber" maxlength="6" value="" placeholder=<@spring.message code="finance.label.recharge.input" /> class="form-control validate[required,custom[integer],min[1],max[100000]]" data-errormessage-value-missing='充值积分数不能为空！' data-errormessage='请输入大于等于1，小于等于10万的整数！'/>
				</div>
				<div>
					<span class="f14"><@spring.message code="finance.label.recharge.unit" /></span>
					<span class="f14 grey"><@spring.message code="finance.label.recharge.info" /></span>
				</div>
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class explain-class">
				<span class="f12 grey"><@spring.message code="finance.label.recharge.desc" /></span>
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14 bolder blue"><@spring.message code="finance.label.recharge.integral2" /></span>
				<span class="f18 bolder orange" id="rechargeAmount">0.00</span>
				<span class="f14 bolder"><@spring.message code="finance.label.money.unit" /></span>
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14 bolder blue"><@spring.message code="finance.label.recharge.integral3" /></span>
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class">
				<div class="pay-alipay pay-type-select">
					<div class="pay-select"></div>
				</div>
				<div class="pay-wechat">
					<div class="pay-select"></div>
				</div>
				<div class="pay-qq">
					<div class="pay-select"></div>
				</div>
			</div>
		</li>
		<HR/>
		<li class="form-group form-group-sm">
			<div class="label-class" style="width:100%;text-align: center;">
				<button id="submitButton" type="button" class="btn btn-info"><@spring.message code="finance.button.pay" /></button>
			</div>
		</li>
	</ul>

</div>

<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
{
	paths : {
		'recharge/message': '${resPath}/resources/platform/sysmanage/finance/js/message',
		'recharge/info':'${resPath}/resources/platform/sysmanage/finance/js/recharge'
	}
},
'recharge/info',function(recharge){
	recharge.init();
}
);
</script>
