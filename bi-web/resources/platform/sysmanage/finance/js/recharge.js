define(['sabace', 'recharge/message'], function(sabace, message) {
	function init() {
		jQuery(".pay-wechat, .pay-alipay, .pay-qq").on("click", function() {
			jQuery(".pay-type-select").removeClass("pay-type-select");
			jQuery(this).addClass("pay-type-select");
		});
		
		jQuery('.tab-pane').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2500,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
		
		jQuery("#integralNumber").on("keyup", function() {
			/*var isPass = jQuery('.tab-pane').validationEngine('validate');
			if(!isPass){
				jQuery("#rechargeAmount").html("0.00");
				return false;
			}*/
			var integralNumber = jQuery(this).val();
			if(integralNumber>=100000){
				jQuery(this).val(100000);
				jQuery("#rechargeAmount").html("10000.00");
				return;
			}
			if(sabace.IsEmpty(integralNumber)){
				jQuery("#rechargeAmount").html("0.00");
				return;
			}
			jQuery("#rechargeAmount").html(parseFloat(integralNumber)/10);
		});
		
		jQuery("#submitButton").on("click", function() {
			var isPass = jQuery('.tab-pane').validationEngine('validate');
			if(!isPass){
				return false;
			}
			//积分
			var integralNumber = jQuery("#integralNumber").val();
			//money
			var rechargeAmount = parseFloat(integralNumber)/10;
			//支付方式
			var rechargeTypeDom = jQuery('.pay-type-select');
			//入账方式（1：支付宝  2：微信支付  3：财付通）
			var rechargeType;
			if(jQuery(rechargeTypeDom).hasClass('pay-alipay')){
				rechargeType = '1';
			}else if(jQuery(rechargeTypeDom).hasClass('pay-wechat')){
				rechargeType = '2';
			}else if(jQuery(rechargeTypeDom).hasClass('pay-qq')){
				rechargeType = '3';
			}else{
				return false;
			}
			var rechargeState = '1';
			var paramData = {
				'rechargeType':rechargeType,
				'rechargeIntegral':integralNumber,
				'rechargeState':rechargeState,
				'payMoneyStr':rechargeAmount
			};
			bi.dialog.confirm({
	            title: sabace.getMessage('finance.label.confirm'),
	            message: sabace.getMessage('finance.msg.submit.confirm', [integralNumber, rechargeAmount]),
	            callback: function(result) {
	            	if (!result) {
	            		return;
	            	}else{
	            		gotoPay(paramData);
	            	}
	            }
			});
		});
	}
	
	/**
	 * 先选择支付页面支付
	 */
	function gotoPay(paramData){
		//先将支付状态变成9
		paramData.rechargeState = '9';
		//先去支付页面支付页面成功之后再返回到保存充值记录页面
		saveRecharge(paramData);
	}
	
	/**
	 * 保存用户充值记录
	 */
	function saveRecharge(paramData){
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/finance/save-company-recharge"),
            data: paramData,
            loading: {
                title: sabace.getMessage("finance.label.tip"),
                text: sabace.getMessage("finance.label.saving")
            },
            success: function (req) {
            	bi.dialog.show({
                    title: sabace.getMessage("finance.label.tip"),
                    message: sabace.getMessage("finance.label.recharge.success")
                });
            },
            error: function (req) {
            	bi.dialog.show({
                    type: bi.dialog.TYPE_DANGER,
                    title: sabace.getMessage("finance.label.tip"),
                    message: req.responseText || sabace.getMessage("finance.label.recharge.failed")
                });
            }
		});
	}
	
	//返回页面所需方法
	return {
		init: init
	}
});
