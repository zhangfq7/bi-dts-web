define(['EBuilder', 'sabace', 'glober/message'], function(EBuilder, sabace, message) {
	var global = {};
	global.modal = {
		echartsObj: {} //存放页面图像对象
	}

	var themeColor = jQuery("#bi-nav").css("backgroundColor") || "#87cefa"; //主题颜色

	global.view = {
		initSpace: function() {
			function bytesToSize(bytes) {
				if (bytes === 0) return '0 B';
				var k = 1024,
					sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
					i = Math.floor(Math.log(bytes) / Math.log(k));
					return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + '<span>'+sizes[i]+'</span>';
			}
			function bytesToSizeNounit(bytes) {
				if (bytes === 0) return '0 B';
				var k = 1024,
					sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
					i = Math.floor(Math.log(bytes) / Math.log(k));
				return (bytes / Math.pow(k, i)).toFixed(1);
			}

			//计算存储空间比例
			var usedSpace = jQuery("#usedStorage>span").html().replace("M", ""); //已用的空间M单位
			var allSpace = jQuery(".allSpace>span").html().replace("M", ""); //全部空间M单位
			usedSpace = parseInt(usedSpace)<0?0:parseInt(usedSpace);
			allSpace = parseInt(allSpace)<0?0:parseInt(allSpace);
			if(usedSpace > allSpace){
				usedSpace = allSpace;
			}
			var allSpaceTemp = bytesToSizeNounit(allSpace * 1024 * 1024);
			var usedSpaceTemp = parseFloat(usedSpace/(allSpace/allSpaceTemp)).toFixed(1);
			var usedStorage = jQuery("#usedStorage");
			usedStorage.html(bytesToSize(usedSpace * 1024 * 1024));
			jQuery(".allSpace").html(bytesToSize(allSpace * 1024 * 1024));
			jQuery("#allspace").html(usedSpaceTemp+"/"+bytesToSize(allSpace * 1024 * 1024));
			jQuery("#allspace span").css({
				'color':'#34495e',
				'font-weight':'normal',
				'font-size':'13px'
			});
			var per = usedSpace / allSpace * 100;
			if (per > 80) {
				usedStorage.removeClass('theme-background');
				usedStorage.css('background', 'orange');
			}
			if (per > 90) {
				usedStorage.removeClass('theme-background');
				usedStorage.css('background', 'red');
			}
			usedStorage.css({
				"width": per + "%"
			});
		},

		initTimePicker: function() {
			/*({startDate:startDate,endDate:endDate},function(start, end){
	             $('#time-picker input').val(startDate + '~' + endDate);
	        });*/
			//渲染datetimepicker		
			
			var date = new Date();
			var endMonth = date.getMonth() + 1;
			var endYear = date.getFullYear();
			var startYear;
			var startMonth;
			if ((endMonth - 1) <= 0) {
				endYear = endYear - 1;
				endMonth = endMonth + 11;
			}else{
				endMonth = endMonth - 1;
			}
			if ((endMonth - 5) <= 0) {
				startYear = endYear - 1;
				startMonth = endMonth + 7;
			} else {
				startYear = endYear;
				startMonth = endMonth - 5;
			}

			if(startMonth < 10){
				startMonth = "0" + startMonth;
			}
			if(endMonth < 10){
				endMonth = "0" + endMonth;
			}
			var oldstartDate = startYear + "/" + startMonth;
			var oldendDate = endYear + "/" + endMonth;
			
			jQuery("#time-picker").dateRange({
				format: 'YYYY/MM',
//				start:{
//					maxDate:oldendDate
//				},
//				end:{
//					maxDate:oldendDate
//				},
				onhide: function() {
					var Dates = jQuery(this).dateRange("getDate");
					//获取账单信息
					var startDate = Dates.startDate;
					var endDate = Dates.endDate;
					sabace.ajax({
						type: "post",
						cache: false,
						data: {
							startDate: startDate,
							endDate: endDate
						},
						dataType: "json",
						url: sabace.handleUrlParam('/platform/overview/sysGlobal/get-bill'),
						success: function(req) {
							var billData = [];
							jQuery.each(req, function(i, v) {
								var obj = {};
								obj['group'] = sabace.getMessage("overview.label.cost");
								obj['name'] = v.acycId;
								obj['value'] = v.serviceFee;
								billData.push(obj);
							})
							if (sabace.IsEmpty(billData)) {
								$('#acycBillChart').hide();
								$('#noBillData').show();
								return;
							} else {
								$('#acycBillChart').show();
								$('#noBillData').hide();
							}
							global.view.innitBill(billData);

						},
						error: function(req) {}
					});
				},
				changeStart: function(start, end, endPanel, startPanel) {
					var format = "YYYY/MM"
					var startTime = start.date.format(format);
					var dates = startTime.split("/");
					var year = parseInt(dates[0]);
					var month = parseInt(dates[1]);
					if ((month + 5) > 12) {
						year = year + 1;
						month = month - 7;
					} else {
						month = month + 5;
					}
					var endDate = year + "/" + month
					if(endDate>oldendDate){
						endDate = oldendDate;
					}
					endTime = moment(end, format).format('x');
					maxTime = moment(endDate, format).format('x');
					if (endTime > maxTime) {
						endPanel.date(endDate);
						startPanel.date(startTime);
					}
					endPanel.maxDate(endDate);
				},
				startValue:oldstartDate,
				endValue:oldendDate
			});

			//绑定time-icon事件
			jQuery("#time-icon").on("click", function() {
				jQuery("#time-picker").focus();
			});
		},

		initSwitch: function() {
			//渲染checkbox
			$('#openWeiChat').bootstrapSwitch();
			$('#openSms').bootstrapSwitch();
			$('#openEmail').bootstrapSwitch();
			$('#openLogo').bootstrapSwitch();
			if (jQuery("#wechatValue").val() == 0) {
				$('#openWeiChat').trigger("click");
			}
			if (jQuery("#smsValue").val() == 0) {
				$('#openSms').trigger("click");
			}
			if (jQuery("#emailValue").val() == 0) {
				$('#openEmail').trigger("click");
			}
			if (jQuery("#logoValue").val() == 0) {
				$('#openLogo').trigger("click");
			}


			//开通关闭微信提醒功能
			var wechatflag = 0;
			jQuery("#openWeiChat").on({
				'switchChange.bootstrapSwitch': function(event, state) {

					if (wechatflag == 1) {
						return;
					}
					wechatflag = 1;
					if (state == true) {
						$("#openWeiChat").bootstrapSwitch("state", false);
						bi.dialog.confirm({
							title: sabace.getMessage("overview.label.confirm"),
							message: sabace.getMessage("overview.label.open.WeChat"),
							callback: function(result) {
								if (result) {
									//修改开关状态
									sabace.ajax({
										type: "post",
										cache: false,
										dataType: "json",
										data: {
											type: 'wechat',
											state: '1'
										},
										url: sabace.handleUrlParam('/platform/overview/sysGlobal/set-open-state'),
										success: function(req) {
											if (req == '1') {
												wechatflag = 1;
												$("#openWeiChat").bootstrapSwitch("state", true);
												wechatflag = 0;
												jQuery(".bind-service .fa-weixin").removeClass('flag0').addClass('flag1 theme-background');
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('global.tip.error'),
												message: req.responseText || sabace.getMessage('global.msg.error')
											});
										}
									});
								}
							}
						});

					} else {
						$("#openWeiChat").bootstrapSwitch("state", true);
						bi.dialog.confirm({
							title: sabace.getMessage("overview.label.confirm"),
							message: sabace.getMessage("overview.label.close.WeChat"),
							callback: function(result) {
								if (result) {
									//修改开关状态
									sabace.ajax({
										type: "post",
										cache: false,
										dataType: "json",
										data: {
											type: 'wechat',
											state: '0'
										},
										url: sabace.handleUrlParam('/platform/overview/sysGlobal/set-open-state'),
										success: function(req) {
											if (req == '1') {
												wechatflag = 1;
												$("#openWeiChat").bootstrapSwitch("state", false);
												wechatflag = 0;
												jQuery(".bind-service .fa-weixin").removeClass('flag1 theme-background').addClass('flag0');
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('global.tip.error'),
												message: req.responseText || sabace.getMessage('global.msg.error')
											});
										}
									});

								}
							}
						});
					}
					wechatflag = 0;
				}
			})

			//开通关闭短信提醒功能
			var smsflag = 0;
			jQuery("#openSms").on({
				'switchChange.bootstrapSwitch': function(event, state) {
					if (smsflag == 1) {
						return;
					}
					smsflag = 1;
					if (state == true) {
						$("#openSms").bootstrapSwitch("state", false);
						bi.dialog.confirm({
							title: sabace.getMessage("overview.label.confirm"),
							message: sabace.getMessage("overview.label.open.SMS"),
							callback: function(result) {
								if (result) {
									sabace.ajax({
										type: "post",
										cache: false,
										dataType: "json",
										data: {
											type: 'sms',
											state: '1'
										},
										url: sabace.handleUrlParam('/platform/overview/sysGlobal/set-open-state'),
										success: function(req) {
											if (req == '1') {
												smsflag = 1;
												$("#openSms").bootstrapSwitch("state", true);
												smsflag = 0;
												jQuery(".bind-service .fa-mobile-phone").removeClass('flag0').addClass('flag1 theme-background');
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('global.tip.error'),
												message: req.responseText || sabace.getMessage('global.msg.error')
											});
										}
									});
								}
							}
						});

					} else {
						$("#openSms").bootstrapSwitch("state", true);
						bi.dialog.confirm({
							title: sabace.getMessage("overview.label.confirm"),
							message: sabace.getMessage("overview.label.close.SMS"),
							callback: function(result) {
								if (result) {
									sabace.ajax({
										type: "post",
										cache: false,
										dataType: "json",
										data: {
											type: 'sms',
											state: '0'
										},
										url: sabace.handleUrlParam('/platform/overview/sysGlobal/set-open-state'),
										success: function(req) {
											if (req == '1') {
												smsflag = 1;
												$("#openSms").bootstrapSwitch("state", false);
												smsflag = 0;
												jQuery(".bind-service .fa-mobile-phone").removeClass('flag1 theme-background').addClass('flag0');
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('global.tip.error'),
												message: req.responseText || sabace.getMessage('global.msg.error')
											});
										}
									});

								}
							}
						});
					}
					smsflag = 0;
				}
			})

			//开通关闭邮件提醒功能
			var emailflag = 0;
			jQuery("#openEmail").on({
				'switchChange.bootstrapSwitch': function(event, state) {
					if (emailflag == 1) {
						return;
					}
					emailflag = 1;
					if (state == true) {
						$("#openEmail").bootstrapSwitch("state", false);
						bi.dialog.confirm({
							title: sabace.getMessage("overview.label.confirm"),
							message: sabace.getMessage("overview.label.open.email"),
							callback: function(result) {
								if (result) {
									sabace.ajax({
										type: "post",
										cache: false,
										dataType: "json",
										data: {
											type: 'email',
											state: '1'
										},
										url: sabace.handleUrlParam('/platform/overview/sysGlobal/set-open-state'),
										success: function(req) {
											if (req == '1') {
												emailflag = 1;
												$("#openEmail").bootstrapSwitch("state", true);
												emailflag = 0;
												jQuery(".bind-service .fa-envelope").removeClass('flag0').addClass('flag1 theme-background');
												jQuery("#emailValue").val("1");
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('global.tip.error'),
												message: req.responseText || sabace.getMessage('global.msg.error')
											});
										}
									});
									
								}
							}
						});
						
					} else {
						$("#openEmail").bootstrapSwitch("state", true);
						bi.dialog.confirm({
							title: sabace.getMessage("overview.label.confirm"),
							message: sabace.getMessage("overview.label.close.email"),
							callback: function(result) {
								if (result) {
									sabace.ajax({
										type: "post",
										cache: false,
										dataType: "json",
										data: {
											type: 'email',
											state: '0'
										},
										url: sabace.handleUrlParam('/platform/overview/sysGlobal/set-open-state'),
										success: function(req) {
											if (req == '1') {
												emailflag = 1;
												$("#openEmail").bootstrapSwitch("state", false);
												emailflag = 0;
												jQuery(".bind-service .fa-envelope").removeClass('flag1 theme-background').addClass('flag0');
												jQuery("#emailValue").val("0");
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('global.tip.error'),
												message: req.responseText || sabace.getMessage('global.msg.error')
											});
										}
									});
								}
							}
						});
					}
					emailflag = 0;
				}
			})
			
			//开通关闭logo定制功能
			var logoflag = 0;
			jQuery("#openLogo").on({
				'switchChange.bootstrapSwitch': function(event, state) {
					if (logoflag == 1) {
						return;
					}
					logoflag = 1;
					if (state == true) {
						$("#openLogo").bootstrapSwitch("state", false);
						bi.dialog.confirm({
							title: sabace.getMessage("overview.label.confirm"),
							message: sabace.getMessage("overview.label.open.logo"),
							callback: function(result) {
								if (result) {
									sabace.ajax({
										type: "post",
										cache: false,
										dataType: "json",
										data: {
											type: 'logo',
											state: '1'
										},
										url: sabace.handleUrlParam('/platform/overview/sysGlobal/set-open-state'),
										success: function(req) {
											if (req == '1') {
												logoflag = 1;
												$("#openLogo").bootstrapSwitch("state", true);
												logoflag = 0;
												jQuery(".bind-service .fa-flag").removeClass('flag0').addClass('flag1 theme-background');
												jQuery("#logoValue").val("1");
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('global.tip.error'),
												message: req.responseText || sabace.getMessage('global.msg.error')
											});
										}
									});

								}
							}
						});

					} else {
						$("#openLogo").bootstrapSwitch("state", true);
						bi.dialog.confirm({
							title: sabace.getMessage("overview.label.confirm"),
							message: sabace.getMessage("overview.label.close.logo"),
							callback: function(result) {
								if (result) {
									sabace.ajax({
										type: "post",
										cache: false,
										dataType: "json",
										data: {
											type: 'logo',
											state: '0'
										},
										url: sabace.handleUrlParam('/platform/overview/sysGlobal/set-open-state'),
										success: function(req) {
											if (req == '1') {
												logoflag = 1;
												$("#openLogo").bootstrapSwitch("state", false);
												logoflag = 0;
												jQuery(".bind-service .fa-flag").removeClass('flag1 theme-background').addClass('flag0');
												jQuery("#logoValue").val("0");
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: sabace.getMessage('global.tip.error'),
												message: req.responseText || sabace.getMessage('global.msg.error')
											});
										}
									});
								}
							}
						});
					}
					logoflag = 0;
				}
			})
		},

		innitBill: function(data) {

			$('#acycBillChart').EBuilder({
				data: data,
				type: ['bar'],
				option: {
					legend: {
						show: false
					},
					color: [themeColor], //取系统的主题色(top的导航)
					"toolbox": {
						"show": false
					},
					grid: {
						x: 50,
						x2: 30,
						y: 8,
						y2: 40
					},
					series: [{
						barWidth: 40
					}],
					yAxis: [{
						axisLabel: {
							formatter: '{value}元'
						},
						axisLine: {
							lineStyle: {
								color: themeColor
							}
						}
					}],
					xAxis: [{
						axisLine: {
							lineStyle: {
								color: themeColor
							}
						}
					}]
				},
				theme: ['echarts/theme/blue'],
				callback: function() {
					global.modal.echartsObj["bill"] = this;
				}
			});
		},

		getBillData: function() {
			//进入页面加载上六个月信息
			var date = new Date();
			var endMonth = date.getMonth() + 1;
			var endYear = date.getFullYear();
			var startYear;
			var startMonth;
			if ((endMonth - 1) <= 0) {
				endYear = endYear - 1;
				endMonth = endMonth + 11;
			}else{
				endMonth = endMonth - 1;
			}
			if ((endMonth - 5) <= 0) {
				startYear = endYear - 1;
				startMonth = endMonth + 7;
			} else {
				startYear = endYear;
				startMonth = endMonth - 5;
			}
			if(startMonth < 10){
				startMonth = "0" + startMonth;
			}
			if(endMonth < 10){
				endMonth = "0" + endMonth;
			}
			var startDate = startYear + "/" + startMonth;
			var endDate = endYear + "/" + endMonth;
			jQuery("#time-picker").val(startDate+"   ~   "+endDate);
			
			sabace.ajax({
				type: "post",
				cache: false,
				data: {
					startDate: startDate,
					endDate: endDate,
				},
				dataType: "json",
				url: sabace.handleUrlParam('/platform/overview/sysGlobal/get-bill'),
				success: function(req) {
					var billData = [];
					jQuery.each(req, function(i, v) {
						var obj = {};
						obj['group'] = sabace.getMessage("overview.label.cost");
						obj['name'] = v.acycId;
						obj['value'] = v.serviceFee;
						billData.push(obj);
					})
					if (sabace.IsEmpty(billData)) {
						$('#acycBillChart').hide();
						$('#noBillData').show();
						return;
					} else {
						$('#acycBillChart').show();
						$('#noBillData').hide();
					}
					global.view.innitBill(billData);
				},
				error: function(req) {
					$('#noBillData .text').html(req.responseText || sabace.getMessage("global.msg.error"));
					$('#acycBillChart').hide();
					$('#noBillData').show();
				}
			});
		},

		getReportData: function() {
			//获取报表排行信息
			sabace.ajax({
				type: "post",
				cache: false,
				dataType: "json",
				url: sabace.handleUrlParam('/platform/overview/sysGlobal/get-report'),
				success: function(req) {
					var visitData = [];
					jQuery.each(req, function(i, v) {
						var obj = {};
						obj['group'] = '访问量';
						obj['name'] = '第' + (i + 1);
						obj['value'] = v.visitCount;
						obj['reportName'] = v.reportName;
						obj['reportId'] = v.reportId;
						visitData.push(obj);
					})
					if (sabace.IsEmpty(visitData)) {
						$('#visitRankChart').hide();
						$('#noRankData').show();
						return;
					} else {
						$('#visitRankChart').show();
						$('#noRankData').hide();
					}
					visitData.reverse();

					$('#visitRankChart').EBuilder({
						data: visitData,
						type: ['bar'],
						yx: true,
						option: {
							tooltip: {
								formatter: function() {
									var showName = arguments[0][0].data.reportName + ": " + arguments[0][0].data.value + "次";
									return showName;
								}
							},
							legend: {
								show: false
							},
							color: [themeColor], //取系统的主题色(top的导航)
							toolbox: {
								show: false
							},
							grid: {
								x: 43,
								x2: 30,
								y: 0,
								y2: 40
							},
							series: [{
								barWidth: 15
							}],
							xAxis: [{
								axisLabel: {
									formatter: '{value}次'
								},
								axisLine: {
									lineStyle: {
										color: themeColor
									}
								}
							}],
							yAxis: [{
								axisLine: {
									lineStyle: {
										color: themeColor
									}
								}
							}],

						},
						theme: ['echarts/theme/blue'],
						callback: function() {
							global.modal.echartsObj["visit"] = this;
							var ecConfig = require('echarts/config');
							this.on(ecConfig.EVENT.CLICK, function(){
							  window.open(sabace.handleUrlParam('/platform/dataview/view') + '?reportId=' + arguments[0].data.reportId);
							});
						}
					});
				},
				error: function(req) {
					$('#noRankData .text').html(req.responseText);
					$('#visitRankChart').hide();
					$('#noRankData').show();
				}
			});
		}
	}

	global.controller = {
		init: function() {

			global.view.initSpace();

			global.view.initTimePicker();

			global.view.initSwitch();

			global.view.getBillData();

			global.view.getReportData();

			//给存储空间详情加事件
			jQuery("#extendStorage").bind("click", function() {
				window.open(sabace.handleUrlParam('/platform/serviceopen/extend-storage'));
			})

			window.onresize = function() {
				$.each(global.modal.echartsObj, function(i, v) {
					global.modal.echartsObj[i].resize && global.modal.echartsObj[i].resize();
				})
			}
			
			//给报表个数加点击事件
			jQuery("#reportCount").bind("click",function(){
				window.open(sabace.handleUrlParam('/platform/myreport/view/report-list'));
			})
			
			//给报表个数加点击事件
			jQuery("#extendUserNum").bind("click",function(){
				window.open(sabace.handleUrlParam('/platform/serviceopen/order-usernum'));
			});
			
			// 邮件推送介绍
			jQuery("#emailInfo").bind("click",function(){
				window.open(sabace.handleUrlParam('/platform/overview/sysGlobal/email-details')+'?serviceCode=email&openFlag='+jQuery("#emailValue").val());
			});
			
			// 邮件推送介绍
			jQuery("#logoInfo").bind("click",function(){
				window.open(sabace.handleUrlParam('/platform/overview/sysGlobal/email-details')+'?serviceCode=logo&openFlag='+jQuery("#logoValue").val());
			});
			

		}
	}

	// 返回页面所需方法
	return global.controller
});