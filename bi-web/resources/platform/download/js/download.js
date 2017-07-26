define(['sabace'], function(sabace) {
	var phone;
	jQuery(function(){
		jQuery(".download-content>div").bind("click",function(){
			jQuery(this).siblings().find(".check>div").removeClass("checked").addClass("unchecked");
			jQuery(this).find(".check>div").addClass("checked").removeClass("unchecked")
		})
		
		jQuery(".download-content>div:eq(0)").trigger("click");
		
		//检查下载文件是否需要短信验证
		downLoadNeedSMS();
		
		//把号码中间数字隐藏
		phone = jQuery(".phoneNum").val();
		var str='';
		for(var i=0;i<phone.length;i++){
			if(i>2 && i<8){
				str+="*";
			}else{
				str+=phone[i];
			}
		}
		jQuery(".phoneNum").val(str);
		
		jQuery('#sendCaptcha').on('click',bindsendCaptcha);
	});
	var downloadUtil = {
			checkSmsApprove:false,
			gotoDownNumCheck:false,
			isClickSend:false,
			phone:'',
			//true是需要短信验证的，false是不需要短信验证的
			isNeedSMS:false,
			//将页面跳转到数据下载短信验证
			validatePage:function(){
				//选择文件格式页面的确认方法
				jQuery(".download-content").addClass("hide");
				jQuery(".phone-check").removeClass("hide");
			},
			checkSMSForDown:function(smsNumber){
				sabace.ajax({
					url: sabace.handleUrlParam("/platform/download/check-download-sms"),
					data:{
						'smsNumber':smsNumber
					},
					async: false,
					success: function(req) {
						if('success' == req.flag){
							downloadUtil.checkSmsApprove = true;
						}else{
							downloadUtil.checkSmsApprove = false;
							jQuery('#errorInfo').html(req.message);
						}
					},
					error:function(req){
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('safety.msg.error'),
							message: req.responseText || sabace.getMessage('safety.msg.exception')
						});
					}
				});
			}
	};
	
	/**
	 * 点击发送短信
	 */
	function bindsendCaptcha(){
		downloadUtil.isClickSend = true;
		var $this = $(this);
		$this.fadeOut(100, function() {
			jQuery("#scondsReSend").fadeIn();
		});
		jQuery(".msgtr").css("visibility","visible");
		initSeconds();
	}
	
	/**
	 * 初始化60s
	 */
	function initSeconds() {
		var sond = 60;
		var sInterval = setInterval(function() {
			sond--;
			$('#scondsReSend span').text(sond);
			if (sond == 0) {
				initreValue(sInterval);
			}
		}, 1000);
		//向后台发送数据：后台需要向manage_send_sms插入一条数据，并将验证码存入redis
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/download/download-send-sms"),
			data:{
				'receivePhone':phone
			},
			success: function(req) {
				
			},
			error:function(req){
			}
		});
	}

	/**
	 * 初始化发送秒数
	 */
	function initreValue(sInterval) {
		clearInterval(sInterval);
		jQuery("#scondsReSend").fadeOut(100, function() {
			jQuery("#sendCaptcha").fadeIn();
			jQuery(this).children('span').text(45)
		});
	}
	
	//检查下载文件是否需要短信验证
	function downLoadNeedSMS(){
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/safety/query-info-value"),
			success: function(req) {
				var infoValue = req.infoValue;
				if (infoValue == undefined) {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('safety.msg.error'),
						message: sabace.getMessage('safety.msg.exception')
					});
				}
				if('1'==infoValue.smsCaptcha){
					downloadUtil.isNeedSMS = true;
				}else{
					downloadUtil.isNeedSMS = false;
				}
				
				window.sure = function(){
					var result = {};
					if(downloadUtil.isNeedSMS && !downloadUtil.gotoDownNumCheck){
						downloadUtil.validatePage();
						result.flag = false;
						downloadUtil.gotoDownNumCheck = true;
					}else if(jQuery('.download-content').hasClass('hide')){
						if(downloadUtil.isClickSend){
							var smsNumber = jQuery.trim(jQuery('#code').val());
							downloadUtil.checkSMSForDown(smsNumber);
							if(downloadUtil.checkSmsApprove){
								result.flag = true;
								result.type = jQuery(".checked").attr("type");
							}else{
								result.flag = false;
							}
						}else{
							jQuery('#errorInfo').html('请点击发送短信验证码！');
							result.flag = false;
						}
						
					}else{
						result.flag = true;
						result.type = jQuery(".checked").attr("type");
					}
					return result;
				}
				window.cancel = function(){
					if(!jQuery(".download-content").hasClass("hide")){
						//选择文件格式页面的取消方法
						return true;
					}else{
						//短信验证页面的取消方法
						jQuery(".download-content").removeClass("hide");
						jQuery(".phone-check").addClass("hide");
						downloadUtil.gotoDownNumCheck = false;
						return false;
					}
				}
			},
			error:function(req){
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('safety.msg.error'),
					message: req.responseText || sabace.getMessage('safety.msg.exception')
				});
			}
		});
	}
});
