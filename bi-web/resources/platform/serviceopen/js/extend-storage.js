define(['sabace', 'slider','order/message'], function(sabace, slider, message) {

	var tempStorValue;

	// 初始化订购编码
	var initOrderId;

	// 初始化组件
	initWigit();

	// 绑定按钮事件
	bindBtnEvent();

	// 初始化订购列表信息
	initOrderStorageList();

	// 服务总量
	setTotalNum();
	
	$(window).resize(function() {
		jQuery("#orderGrid").setGridWidth(jQuery("#order-list").width());
	});

	/**
	 * 绑定按钮事件
	 */
	function bindBtnEvent() {
		// 订购按钮
		jQuery(".buttons").on("click", ".buy", function() {
			if (jQuery(".order-div").hasClass("hide")) {
				jQuery(".order-div").removeClass("hide");

				if (jQuery(".order-list-div").hasClass("hide")) {
//					jQuery(".head").removeClass("head-basic-height").addClass("head-extent-height");
				} else {
					jQuery(".order-list-div").addClass("hide");
				}
			} else {
				jQuery(".order-div").addClass("hide");
//				jQuery(".head").removeClass("head-extent-height").addClass("head-basic-height");
			}
		})

		// 开通记录
		jQuery(".buttons").on("click", ".calc", function() {
			if (jQuery(".order-list-div").hasClass("hide")) {
				jQuery(".order-list-div").removeClass("hide");
				jQuery("#orderGrid").setGridWidth(jQuery("#order-list").width());
				if (jQuery(".order-div").hasClass("hide")) {
//					jQuery(".head").removeClass("head-basic-height").addClass("head-extent-height");
				} else {
					jQuery(".order-div").addClass("hide");
				}
			} else {
				jQuery(".order-list-div").addClass("hide");
//				jQuery(".head").removeClass("head-extent-height").addClass("head-basic-height");
			}
		})

		// 存储空间扩容输入框值变更
		jQuery("#storageValue").on("change", function() {
			var storVal = jQuery("#storageValue").val();

			// 输入的是数字才有效，否则恢复原值
			if (!isNaN(storVal)) {
				if (storVal > 10) {
					storVal = 10;
				} else if (storVal < 0) {
					storVal = 0;
				} else {
					// 值只保留1位小数
					storVal = Math.floor(storVal / 0.1) / 10;
				}

				changeOrderStorage(storVal, false);
			} else {
				jQuery("#storageValue").val(tempStorValue);
				jQuery("#storageValue").attr("numVal", Math.floor(tempStorValue*1024));
			}
		});

		// 月份按钮组点击样式
		jQuery(".btn-group button").bind("click", function() {
			jQuery(".btn-group button").removeClass("clickedButton theme-background").addClass("normalButton");
			jQuery(this).addClass("clickedButton theme-background").removeClass("normalButton");

			var orderMonth = jQuery(this).val();
			changeOrderEnderDay(orderMonth);
		});

		// 月份按钮组滑动样式
		jQuery(".btn-group").on('mouseover', '.normalButton', function() {
			jQuery('.normalButton').removeClass('theme-background');
			jQuery(this).addClass('theme-background');
		}).on('mouseleave', '.normalButton', function() {
			jQuery(this).removeClass('theme-background');
		})

		// 加载月份选择按钮
		initOrderMonth();

		// 默认选择为第一个按钮
		jQuery("#lastbutton").click();

		// 确定按钮
		jQuery("#confirm").on("click", function() {
			saveOrderInfo();
		})

		// 变更服务
		jQuery(".order-list").on("click", '.orderEdit', function() {
			initOrderId = jQuery(this).attr("orderId");

			var orderEndDate = jQuery(this).attr("orderEndDate");
			if (sabace.IsEmpty(orderEndDate)) {
				jQuery("#lastbutton").click();
			} else {
				orderEndDate = orderEndDate.substr(0, 7);
			}

			var orderNum = jQuery(this).attr("orderNum");
			orderNum = Math.round(orderNum / 102.4);
			
			// 显示滑块的值
			orderNum = Number(orderNum) / 10;
			changeOrderStorage(orderNum, false);

			// 禁用滑块组件以及输入框
			jQuery("#stoageSlider").slider("disable");

			// 存储空间输入框禁用
			jQuery("#storageValue").prop("disabled", true);

			// 显示订购月份
			jQuery(".btn-group button").each(function(i) {
				var showMonthValue = jQuery(this).html();
				if (showMonthValue === orderEndDate) {
					jQuery(this).click();
				}
			});

			jQuery(".order-list-div").addClass("hide");
			jQuery(".order-div").removeClass("hide");

			jQuery(".buttons button").prop("disabled", true);
			jQuery("#back").removeClass("hide");
		});

		// 变更操作的返回按钮
		jQuery("#back").on("click", function() {
			jQuery(".order-div").addClass("hide");
			jQuery(".order-list-div").removeClass("hide");
			jQuery("#orderGrid").setGridWidth(jQuery("#order-list").width());
			jQuery("#back").addClass("hide");

			initOrderInfo();
		});

		// 关闭服务
		jQuery(".order-list").on("click", '.orderClose', function() {
			closeOrderInfo(jQuery(this).attr("orderId"));
		});
		
		jQuery("#changeOrderDate").on("click",function(){
			jQuery('#queryOrderDate').focus();	
		});

		jQuery("#queryOrderListBtn").on("click",function(){
			queryOrderList();	
		});
	}

	/**
	 * 初始化插件
	 */
	function initWigit() {
		// 滑块插件
		jQuery("#stoageSlider")
			.slider({
				min: 0,
				max: 10,
				range: "min",
				step: 0.1,
				slide: function(event, ui) {
					changeOrderStorage(ui.value, true);
				}
			})
			.slider("pips", {
				rest: "label",
				step: 20,
				suffix: "GB",
				click: false
			})
			.slider("float", {
				handle: true,
				pips: true,
				suffix: "GB"
			});
		jQuery("#stoageSlider .ui-widget-header").addClass("theme-background");
		
		jQuery("#stoageSlider .ui-slider-handle")
			.unbind('focusin')
			.on('mouseover', function() {
				jQuery(this).addClass('theme-border-color');
			}).on('mouseleave', function() {
			jQuery(this).removeClass('theme-border-color');
		});
	}

	/**
	 * 修改消费的积分值
	 */
	function changeCostValue(obj) {
		var orderNums = jQuery("#storageValue").attr("numVal");
		var costValue = Math.floor(orderNums) * servicePrice;
		jQuery("#costPerMon").html(costValue);
	}

	/**
	 * 判断确定按钮是否可以点击
	 */
	function isShowConfirm() {
		var result = false;
		var storValue = jQuery("#storageValue").val();
		if (storValue > 0) {
			result = true;
		}

		if (result) {
			jQuery("#confirm").prop("disabled", "");
		} else {
			jQuery("#confirm").prop("disabled", true);
		}
	}

	/**
	 * 修改服务截止时间
	 */
	function changeOrderEnderDay(obj) {
		if ("--" == obj) {
			orderEnderDay = obj;
			jQuery("#orderEnderDay").html(orderEnderDay);
			jQuery("#orderEnderDay").attr("endDate", obj);
		} else {
			// 获取截止时间，月份的最后一天
			var dt = new Date();
			dt.setDate(1);
			dt.setMonth(dt.getMonth() + 1 + Number(obj));
			cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);

			var yearValue = cdt.getFullYear();
			var monthValue = (cdt.getMonth() + 1) + "";
			var dayValue = cdt.getDate() + "";

			if (monthValue.length == 1) {
				monthValue = "0" + monthValue;
			}

			if (dayValue.length == 1) {
				dayValue = "0" + dayValue;
			}

			orderEndDate = yearValue + "-" + monthValue + "-" + dayValue;
			var endDateStr = '<span class="font-orange dateNum">'+yearValue+'</span>'+sabace.getMessage("order.label.year")+'<span class="font-orange dateNum">'+monthValue+'</span>'+sabace.getMessage("order.label.month")+'<span class="font-orange dateNum">'+dayValue+'</span>'+sabace.getMessage("order.label.day");
			jQuery("#orderEnderDay").html(endDateStr);
			jQuery("#orderEnderDay").attr("endDate", orderEndDate);
		}

	}

	/**
	 * 保存订购信息
	 */
	function saveOrderInfo() {
//		var orderNum = Number(jQuery("#storageValue").val() / 0.1);
		var orderNum = Number(jQuery("#storageValue").attr("numVal"));
//		var orderEndDate = jQuery("#orderEnderDay").html();
		var orderEndDate = jQuery("#orderEnderDay").attr("endDate");
		if (orderEndDate == "--") {
			orderEndDate = "";
		}
		var costNum = Number(jQuery("#costPerMon").html());

		var paramData = {
			"orderId": initOrderId,
			"serviceId": serviceId,
			"orderNum": orderNum,
			"orderEndDate": orderEndDate,
			sumConstIntegral: costNum
		}

		bi.dialog.confirm({
			title: sabace.getMessage("order.label.sure"),
			message: sabace.getMessage("order.label.sure.save"),
			callback: function(result) {
				if (result) {
					sabace.ajax({
						type: 'post',
						cache: false,
						dataType: "json",
						url: sabace.handleUrlParam("/platform/serviceopen/save-order"),
						data: paramData,
						loading: {
							title: sabace.getMessage("order.label.save"),
							text: sabace.getMessage("order.label.saveing")
						},
						success: function(req) {
							if ("true" == req.saveFlag) {
								if(sabace.IsEmpty(initOrderId)){
									totalNum = Number(totalNum) + Number(orderNum);
									setTotalNum();
								}
								
								bi.dialog.show({
									title: sabace.getMessage("order.label.save.succeed"),
									message: sabace.getMessage("order.storage.msg.succeed"),
									onhidden: function() {

										// 订购成功后展示订购列表页面，刷新列表内容
										jQuery(".order-div").addClass("hide");
										jQuery(".order-list-div").removeClass("hide");
										jQuery("#orderGrid").setGridWidth(jQuery("#order-list").width());
										jQuery("#orderGrid").trigger("reloadGrid");

										// 订购成功后初始化订购信息
										initOrderInfo();
									}
								});
							} else {
								var integralNum = req.integralNum;
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage("order.label.save.failed"),
									message: sabace.getMessage("order.msg.tooLarge",integralNum)
								});
							}
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('order.label.save.failed'),
								message: sabace.getMessage("order.storage.msg.failed")
							});
						}
					});
				}
			}
		});
	}

	/**
	 * 初始化存储订购信息列表
	 */
	function initOrderStorageList() {
		
		jQuery("#queryOrderDate").dateRange({
			format:'YYYY-MM-DD',
			startValue:"",		
			start:{
				maxDate:moment().format('YYYY-MM-DD'),
			},
			end:{
				maxDate:moment().format('YYYY-MM-DD'),
			},
			onhide:function(){
				var rechargeTime=jQuery(this).dateRange("getDate");
				
			}
		});
		
		var paramData = {
			"serviceId": serviceId
		}

		jQuery('#orderGrid').jqGrid({
			url: sabace.handleUrlParam("/platform/serviceopen/order-list"),
			styleUI: 'Bootstrap',
			autowidth: true,
			postData: paramData,
			height: "auto",
			mtype: 'post',
			regional: 'cn',
			datatype: "json",
			viewrecords: true,
			rownumbers: true,
			colModel: [{
				label: "订购编码",
				name: 'orderId',
				index: 'orderId',
				hlign: 'center',
				hidden: true
			}, {
				label: "订购数量",
				name: 'orderNum',
				index: 'orderNum',
				hlign: 'center',
				hidden: true
			}, {
				label: sabace.getMessage("order.label.serviceName"),
				name: 'serviceShowName',
				index: 'serviceShowName',
				hlign: 'center',
				width: 250,
				sortable: false
			}, {
				label: sabace.getMessage("order.label.storageSize"),
				name: 'orderCount',
				index: 'orderCount',
				hlign: 'center',
				width: 180,
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					if (cellvalue > 1000) {
						return (Math.round(cellvalue / 102.4)/10) + "GB";
					} else {
						return cellvalue + "MB";
					}
				}
			}, {
				label: sabace.getMessage("order.label.orderCost"),
				name: 'sumConstIntegral',
				index: 'sumConstIntegral',
				hlign: 'center',
				width: 180,
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					return cellvalue + sabace.getMessage("order.label.costUnit");
				}
			}, {
				label: sabace.getMessage('order.label.orderStartDate'),
				name: 'orderStartDate',
				index: 'orderStartDate',
				hlign: 'center',
				width: 200,
				sortable: false
			}, {
				label: sabace.getMessage('order.label.orderEndDate'),
				name: 'orderEndDate',
				index: 'orderEndDate',
				hlign: 'center',
				width: 200,
				sortable: false
			}, {
				label: sabace.getMessage('order.label.operation'),
				name: 'dimId',
				index: 'dimId',
				align: 'center',
				hlign: 'center',
				width: 180,
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					var orderId = rowObject.orderId;
//					if ("1" == rowObject.valid) {
//						return "<a href='javascript:void(0)' class='orderEdit' orderId='" + orderId + "' orderEndDate='" + rowObject.orderEndDate + "' orderNum='" + rowObject.orderNum + "'>" + "变更" + "</a> /  " +
//						"<a href='javascript:void(0)' class='orderClose' orderId='" + orderId + "'>" + "关闭" + "</a> ";
//					} else {
//						return "";
//					}
					return "<a href='javascript:void(0)' class='orderEdit' orderId='" + orderId + "' orderEndDate='" + rowObject.orderEndDate + "' orderNum='" + rowObject.orderNum + "'>" + sabace.getMessage('order.label.modify') + "</a>";

				}
			}],
			pager: "#orderGridPager",
			rowNum: 5,
			rowList: [5],
			jsonReader: {
				records: "total",
				total: "totalPages"
			},
			afterInsertRow: function(rowId, data) {
				//jQuery(this).jqGrid('setCell', rowid, 'operate', '<a>' + sabace.getMessage('dim.label.opt') + '</a>');
			}
		});
	}

	/**
	 * 初始化订购月份的显示时间
	 */
	function initOrderMonth() {
		var dt = new Date();
		dt.setDate(1);

		var currentDate = new Date();
		jQuery(".btn-group button").each(function(i) {
			if (i == 0) {
				dt.setMonth(dt.getMonth());
			} else if (i < 9) {
				dt.setMonth(dt.getMonth() + 1);
			} else if (i < 11) {
				dt.setMonth(currentDate.getMonth() + 12);
			} else {
				return;
			}

			var monthValue = (dt.getMonth() + 1);
			if (monthValue < 10) {
				monthValue = "0" + monthValue;
			}

			jQuery(this).html(dt.getFullYear() + "-" + monthValue);
		});
	}

	/**
	 * 修改存储容量
	 */
	function changeOrderStorage(value, isSlider) {
		// 非滑块操作，还需要修改滑块的值
		if (!isSlider) {
			jQuery("#stoageSlider").slider("value", value);
		}

		// 修改输入框内容值
		jQuery("#storageValue").val(value);
		jQuery("#storageValue").attr("numVal", Math.floor(value*1024));

		// 有效值需要赋给临时值,无效输入时还原
		tempStorValue = value;

		// 修改消费值
		changeCostValue(value);

		// 判断“确定”按钮是否可以点击
		isShowConfirm();
	}

	/**
	 * 初始化订购信息
	 */
	function initOrderInfo() {
		// 初始化存储容量信息为0
		changeOrderStorage(0, false);

		// 初始化月份截止为第一个
		jQuery("#lastbutton").click();

		// 初始化订购编码为空
		initOrderId = "";

		// 购买和开通记录按钮变为有效
		if (jQuery(".buttons button").prop("disabled")) {
			jQuery(".buttons button").prop("disabled", "");
		}

		// 滑块组件生效
		if (jQuery("#stoageSlider").slider("option", "disabled")) {
			jQuery("#stoageSlider").slider("enable");
		}

		// 存储输入框有效
		if (jQuery("#storageValue").prop("disabled")) {
			jQuery("#storageValue").prop("disabled", "");
		}
	}

	/**
	 * 关闭服务
	 */
	function closeOrderInfo(obj) {
		var paramData = {
			"orderId": obj
		}

		bi.dialog.confirm({
			title: "确认",
			message: "您是否确定要关闭该服务？ 注意：服务关闭次月生效",
			callback: function(result) {
				if (result) {
					sabace.ajax({
						type: 'post',
						cache: false,
						dataType: "json",
						url: sabace.handleUrlParam("/platform/serviceopen/close-order"),
						data: paramData,
						loading: {
							title: "关闭",
							text: "正在为您关闭该服务！"
						},
						success: function(req) {
							if ("true" == req.saveFlag) {
								bi.dialog.show({
									title: "成功",
									message: "服务关闭成功，次月生效！",
									onhidden: function() {

										// 订购成功后展示订购列表页面，刷新列表内容
										jQuery("#orderGrid").trigger("reloadGrid");
									}
								});
							} else {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: "失败",
									message: "服务关闭失败！"
								});
							}
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: "失败",
								message: "服务关闭失败！"
							});
						}
					});
				}
			}
		});
	}
	
	/**
	 * 服务总量
	 */
	function setTotalNum(){
		jQuery("#totalNum").empty();
		var totalNumStr = bytesToSize(totalNum);
		var unitStr = totalNumStr.substring(totalNumStr.length-2, totalNumStr.length);
		jQuery("#totalUnitStr").html(unitStr);
		var totalNumNew = parseFloat(totalNumStr.substring(0, totalNumStr.length-2));
		// 小数部分
		var pointNum = Math.floor(totalNumNew*100%100);
		jQuery("#totalNum").append(".").append('<span class="numSpan">' + Math.floor(pointNum/10)%10 + '</span>');
		jQuery("#totalNum").append('<span class="numSpan">' + pointNum%10 + '</span>');

		// 整数部分
		var intNum = Math.floor(totalNumNew);
		for(i=intNum; i>0; i=parseInt(Number(i)/10)){
			var numStr = '<span class="numSpan">' + Number(i)%10 + '</span>';
			jQuery("#totalNum").prepend(numStr);
		}
	}
	
	function bytesToSize(bytes) {
		if (bytes === 0) return '0 B';
		var k = 1024,
		sizes = ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toFixed(2) + '' + sizes[i];
	}
	
	/**
	 * 订购记录查询
	 */
	function queryOrderList(){
		var  orderDate=jQuery('#queryOrderDate').dateRange("getDate");
		var  orderDateStr=jQuery('#queryOrderDate').val();
		postData = {
				orderDateStart:orderDate.startDate,
				orderDateEnd:orderDate.endDate,
				serviceId: serviceId
			};
		if(orderDateStr==''||orderDateStr== null)
		{
		postData.orderDateStart='';
		postData.orderDateEnd='';
		}
		jQuery("#orderGrid").jqGrid('setGridParam',{postData : postData}).trigger("reloadGrid"); 
	}
});