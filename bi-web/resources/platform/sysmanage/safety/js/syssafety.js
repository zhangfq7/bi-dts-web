define(['sabace', 'safety/message'], function(sabace, message) {

	jQuery(function() {
		initPage();
		sabace.timeout(function() {
			$('[data-toggle="switch"]').bootstrapSwitch();
		}, 300);
		jQuery(".btnStylefour button").bind("click", function() {
			jQuery(".btnStylefour button").removeClass("clickedFourButton theme-background").addClass("normalFourButton");
			jQuery(this).addClass("clickedFourButton theme-background").removeClass("normalFourButton");
		});
	})

	function initPage() {
		$('.btnStylefour .normalFourButton').poshytip({
			className: 'systipshow tip-yellowsimple',
			showTimeout: 3,
			alignTo: 'target',
			alignX: 'center',
			alignY: 'bottom',
			offsetY: 10,
			offsetX: 0,
			keepInViewport: false
		});

		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/safety/query-info-value"),
			success: function(req) {
				
				//根据数据库中的值改变页面
				var infoValue = req.infoValue;
				if (infoValue == undefined) {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('safety.msg.error'),
						message: sabace.getMessage('safety.msg.exception')
					});
				}
				
				$('#openwatermark').attr("checked", infoValue.openWatermark == '1' ? true : false);
				$('#openwatermark').val(infoValue.openWatermark);
				$('#smscaptcha').attr("checked", infoValue.smsCaptcha == '1' ? true : false);
				$('#smscaptcha').val(infoValue.smsCaptcha);
				$('#datanocopy').attr("checked", infoValue.dataNoCopy == '1' ? true : false);
				$('#datanocopy').val(infoValue.dataNoCopy);

				$("#psdlevel").val(infoValue.psdLevel);
				var count = infoValue.psdLevel - 1;
				$('.btnStylefour>button:eq(' + count + ')').addClass("clickedFourButton theme-background").removeClass("normalFourButton");
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('safety.msg.error'),
					message: req.responseText || sabace.getMessage('safety.msg.exception')
				});
			}
		});
	}

	// 监控用户点击“使用报表水印值”的开关事件
	$('#openwatermark').on('switchChange.bootstrapSwitch', function(event, state) {
		var paramData = {};
		paramData.openwatermark = state ? '1' : '0';

		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/safety/change-watermark"),
			loading: {
				title: sabace.getMessage('safety.msg.prompt'),
				text: sabace.getMessage('safety.msg.loading')
			},
			data: paramData,
			success: function(req) {
				$('#openwatermark').val(state ? '1' : '0');
			},
			error: function(req) {
				$('#openwatermark').bootstrapSwitch("state", $('#openwatermark').val() == '1' ? true : false, true);
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('safety.msg.error'),
					message: req.responseText || sabace.getMessage('safety.msg.exception')
				});
			}
		});
	});

	// 监控用户点击“数据下载短信验证”的开关事件
	$('#smscaptcha').on('switchChange.bootstrapSwitch', function(event, state) {
		var paramData = {};
		paramData.smscaptcha = state ? '1' : '0';
		
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/safety/change-smscaptcha"),
			loading: {
				title: sabace.getMessage('safety.msg.prompt'),
				text: sabace.getMessage('safety.msg.loading')
			},
			data: paramData,
			success: function(req) {
				$('#smscaptcha').val(state ? '1' : '0');
			},
			error: function(req) {
				$('#smscaptcha').bootstrapSwitch("state", $('#smscaptcha').val() == '1' ? true : false, true);
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('safety.msg.error'),
					message: req.responseText || sabace.getMessage('safety.msg.exception')
				});
			}
		});
	});

	// 监控用户点击“数据防拷贝”的开关事件
	$('#datanocopy').on('switchChange.bootstrapSwitch', function(event, state) {
		var paramData = {};
		paramData.datanocopy = state ? '1' : '0';

		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/safety/change-datanocopy"),
			loading: {
				title: sabace.getMessage('safety.msg.prompt'),
				text: sabace.getMessage('safety.msg.loading')
			},
			data: paramData,
			success: function(req) {
				$('#datanocopy').val(state ? '1' : '0');
			},
			error: function(req) {
				$('#datanocopy').bootstrapSwitch("state", $('#datanocopy').val() == '1' ? true : false, true);
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('safety.msg.error'),
					message: req.responseText || sabace.getMessage('safety.msg.exception')
				});
			}
		});
	});

	// 监控用户点击“密码安全”级别的事件
	$('.btnStylefour button').bind('click', function() {
		var psdId = jQuery('.clickedFourButton').attr('id');
		var newLevel = jQuery('#' + psdId).val();
		var paramData = {};
		paramData.psdlevel = newLevel;

		sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/safety/change-psdlevel"),
			loading: {
				title: sabace.getMessage('safety.msg.prompt'),
				text: sabace.getMessage('safety.msg.loading')
			},
			data: paramData,
			success: function(req) {
				$("#psdlevel").val(newLevel);
			},
			error: function(req) {
				$('.btnStylefour>button:eq(' + (newLevel - 1) + ')').addClass("normalFourButton").removeClass("clickedFourButton theme-background");
				$('.btnStylefour>button:eq(' + ($("#psdlevel").val() - 1) + ')').addClass("clickedFourButton theme-background").removeClass("normalFourButton");
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('safety.msg.error'),
					message: req.responseText || sabace.getMessage('safety.msg.exception')
				});
			}
		});
	})

});