define(['sabace','order/message','slider'], function(sabace, message,slider) {

	var maxOrderNum = 100;
	var orderNum;
	var initOrderId;
	
	jQuery(function(){
		
		// 初始化订购数量滑块
		initOrderNumSlider();

		// 加载月份选择按钮显示月份
		initOrderMonth();
		
		// 页面事件绑定
		bindEvent();
		
		// 初始化订购记录列表
		initOrderList();
		
		// 服务总量
		setTotalNum();
		
	});

	// 表格宽度自适应
	$(window).resize(function() {
		jQuery("#orderListGrid").setGridWidth(jQuery("#orderList").width());
	});
	
	function bindEvent(){
		
		// 订单查询按钮事件
		jQuery("#queryOrderListBtn").on("click",function(){
			queryOrderList();	
		});
		
		// 订单日期图表点击事件
		jQuery("#changeOrderDate").on("click",function(){
			jQuery('#queryOrderDate').focus();	
		});
		
		// 绑定保存按钮事件
		jQuery("#saveOrderInfo").on("click", function() {
			saveOrderInfo();
		});
		
		// 订购按钮点击事件
		jQuery("#showOrderPage").on("click", function() {
			if(jQuery(".orderDiv").hasClass("hide")){
				jQuery(".orderDiv").removeClass("hide");
			}else{
				jQuery(".orderDiv").addClass("hide");
			}
			jQuery(".orderListDiv").addClass("hide");
		});
		
		// 订购记录按钮点击事件
		jQuery("#showOrderList").on("click", function() {
			if(jQuery(".orderListDiv").hasClass("hide")){
				jQuery(".orderListDiv").removeClass("hide");
				jQuery("#orderListGrid").setGridWidth(jQuery("#orderList").width());
			}else{
				jQuery(".orderListDiv").addClass("hide");
			}
			jQuery(".orderDiv").addClass("hide");
		});
		
		// 订购数量
		jQuery("#orderNum").on("change",function(){
			onChangeOrderNum();
		});
		
		// 月份按钮组点击样式
		jQuery(".btn-group button").bind("click", function() {
			jQuery(".btn-group button").removeClass("clickedButton theme-background").addClass("normalButton");
			jQuery(this).addClass("clickedButton theme-background").removeClass("normalButton");
			
			var orderMonth = jQuery(this).val();
			// 修改截止日期
			changeOrderEndDate(orderMonth);
		});
		
		// 月份按钮组滑动样式
		jQuery(".btn-group").on('mouseover', '.normalButton', function() {
			jQuery('.normalButton').removeClass('theme-background');
			jQuery(this).addClass('theme-background');
		}).on('mouseleave', '.normalButton', function() {
			jQuery(this).removeClass('theme-background');
		})
		
		// 默认选择为第一个按钮
		jQuery("#lastbutton").click();
		
		// 变更服务
		jQuery(".orderList").on("click", '.orderEdit', function() {
			modifyOrderInfo(this);
		});
		
		// 关闭服务
		jQuery(".orderList").on("click", '.orderClose', function() {
			closeOrder(this);
		});
		
		// 变更操作的返回按钮
		jQuery("#back").on("click",function(){
			jQuery(".orderDiv").addClass("hide");
			jQuery(".orderListDiv").removeClass("hide");
			jQuery(".buttons button").prop("disabled","");
			jQuery("#orderListGrid").setGridWidth(jQuery("#orderList").width());
			
			initOrderInfo();
		});
		
	}
	
	/**
	 * 保存订购信息
	 */
	function saveOrderInfo(){
		var orderEndDate = jQuery("#orderEndDate").attr("endDate");
		if (orderEndDate == "--")
		{
			orderEndDate = "";
		}
		var orderNum = Number(jQuery("#orderNum").val());
		var costNum = Number(jQuery(".costNum").html());
		
		var paramData = {
				orderId: initOrderId,
				orderNum: orderNum,
				orderEndDate: orderEndDate,
				serviceId: serviceId,
				sumConstIntegral: costNum
		};
		
		bi.dialog.confirm({
			title: sabace.getMessage("order.label.sure"),
			message: sabace.getMessage("order.label.sure.save"),
			callback: function(result) {
				if (result) {
					sabace.ajax({
						url: sabace.handleUrlParam("/platform/serviceopen/save-order"),
						data: paramData,
						loading: {
							title: sabace.getMessage("order.label.save"),
							text: sabace.getMessage("order.label.saveing")
						},
						success: function(req) {
							if (req.saveFlag == "true") {
								// 新增订购信息，保存成功修改服务总量
								if(sabace.IsEmpty(initOrderId)){
									totalNum = Number(totalNum) + Number(orderNum);
									setTotalNum();
								}
								
								// 初始化订购信息
								initOrderInfo();
								bi.dialog.show({
									title: sabace.getMessage("order.label.save.succeed"),
									message: sabace.getMessage("order.usernum.msg.succeed"),
									onhidden: function() {
										jQuery(".buttons button").prop("disabled","");
										jQuery(".orderDiv").addClass("hide");
										jQuery(".orderListDiv").removeClass("hide");
										jQuery("#orderListGrid").trigger("reloadGrid");
										jQuery("#orderListGrid").setGridWidth(jQuery("#orderList").width());
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
								message: sabace.getMessage("order.usernum.msg.failed")
							});
						}
					});
				}
			}
		});
	}
	
	/**
	 * 初始化订购记录
	 */
	function initOrderList(){
		
		// 初始化订购日期控件
		jQuery("#queryOrderDate").dateRange({
			format:'YYYY-MM-DD',
			startValue: moment().format('YYYY-MM-DD'),		
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
		
		var postData = {};
		postData.serviceId = serviceId;
		$("#orderListGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/serviceopen/order-list'),
			styleUI: 'Bootstrap',
			autowidth: true,
			postData: postData,
			height: 'auto',
			mtype: 'post',
			regional: 'cn',
			datatype: "json",
			viewrecords: true, 
			forceFit: true,
			rownumbers: true,
			colModel: [{
				label: sabace.getMessage('order.label.orderStartDate'),
				name: 'orderStartDate',
				width: 240,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage('order.label.orderEndDate'),
				name: 'orderEndDate',
				width: 240,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage('order.label.orderNum'),
				name: 'orderNum',
				width: 220,
				align: 'left',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					return cellvalue + sabace.getMessage("order.label.userUnit");
				}
			}, {
				label: sabace.getMessage('order.label.orderCost'),
				name: 'sumConstIntegral',
				width: 230,
				align: 'left',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					return cellvalue + sabace.getMessage("order.label.costUnit");
				}
//			}, {
//				label: sabace.getMessage('order.label.orderType'),
//				name: 'orderType',
//				width: 160,
//				align: 'left',
//				hlign: 'center',
//				sortable: false,
//				formatter: function(cellvalue, options, rowObject) {
//					if (cellvalue == 1) {
//						return '按次';
//					} else if (cellvalue == 2) {
//						return '按天';
//					} else if (cellvalue == 5) {
//						return '包月';
//					} else if (cellvalue == 8) {
//						return '包年';
//					} else {
//						return cellvalue;
//					}
//				}
			}, {
				label: sabace.getMessage('order.label.operation'),
				name: 'operate',
				width: 230,
				align: 'center',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					var orderId = rowObject.orderId;
					return "<a href='javascript:void(0)' class='orderEdit' orderId='" + orderId + "' orderEndDate='"+rowObject.orderEndDate+"' orderNum='"+rowObject.orderNum+"'>"+sabace.getMessage('order.label.modify')+"</a>";
//					var orderEndDate = rowObject.orderEndDate;
//					if(sabace.IsEmpty(orderEndDate)){
//						return "<a href='javascript:void(0)' class='orderEdit' orderId='" + orderId + "' orderEndDate='"+rowObject.orderEndDate+"' orderNum='"+rowObject.orderNum+"'>变更</a> /  " +
//						"<a href='javascript:void(0)' class='orderClose' orderId='" + orderId + "'>关闭</a> ";
//					}else{
//						return "<a href='javascript:void(0)' class='orderEdit' orderId='" + orderId + "' orderEndDate='"+rowObject.orderEndDate+"' orderNum='"+rowObject.orderNum+"'>变更</a>";
//					}
				}
			}],
			rowNum: 5,
			rowList: [5],
			pager: "#orderListGridPager",
			jsonReader: {
				records: "total",
				total: "totalPages"
			},
			afterInsertRow: function(rowId, data) {
				jQuery(this).jqGrid('setCell', rowid, 'operate', '<a>'+sabace.getMessage('order.label.operation')+'</a>');
			}
		});
	}
	
	/**
	 * 初始化订购数量滑块
	 */
	function initOrderNumSlider(){
		// 滑块插件
		jQuery("#orderNumSlider") 
		.slider({ 
		    min: 0, 
		    max: maxOrderNum,
		    range:"min", 
		    step: 1,
		    slide:function(event, ui){
		    	// 修改输入框值
		    	changeOrderNum(ui.value,true);
		    }
		})                       
		.slider("pips", {
		    rest: "label",
		    step: 20,
			suffix:"",
			click: false
		})                      
		.slider("float",{
			handle: true,
			pips:true,
			suffix:sabace.getMessage("order.label.userUnit")
		});
		jQuery("#orderNumSlider .ui-widget-header").addClass("theme-background");
		
		jQuery("#orderNumSlider .ui-slider-handle")
		.unbind('focusin')
		.on('mouseover', function() {
			jQuery(this).addClass('theme-border-color');
		}).on('mouseleave', function() {
		jQuery(this).removeClass('theme-border-color');
	});
	}
	
	// 修改订购数量输入框的值
	function changeOrderNum(value,isSlider)
	{
		// 非滑块操作，还需要修改滑块的值
		if (!isSlider)
		{
			jQuery("#orderNumSlider").slider("value",value);
		}
		
    	// 修改输入框内容值
    	jQuery("#orderNum").val(value);
    	
    	// 有效值需要赋给临时值,无效输入时还原
    	orderNum = value;
    	
    	// 修改消费值
    	changeCostValue(value);
    	
    	// 判断“确定”按钮是否可以点击
    	isShowConfirm();
	}
	
	// 手动输入订购数量时，同步改变滑块位置
	function onChangeOrderNum(){
		var storVal = jQuery("#orderNum").val();
		
		// 输入的是数字才有效，否则恢复原值
		if (!isNaN(storVal))
		{
			if (storVal > maxOrderNum)
			{
				storVal = maxOrderNum;
			}
			else if(storVal < 0)
			{
				storVal = 0;
			}
			else
			{
				storVal = Math.floor(storVal);
			}
			
			changeOrderNum(storVal,false);
		}
		else
		{
			jQuery("#orderNum").val(orderNum);
		}
	}
	

	/**
	 * 修改服务截止时间
	 */
	function changeOrderEndDate(obj)
	{
		if ("--" == obj)
		{
			orderEndDate = obj;
			jQuery("#orderEndDate").html(obj);
			jQuery("#orderEndDate").attr("endDate", obj);
		}
		else
		{
			// 获取截止时间，月份的最后一天
			var dt = new Date();
			dt.setDate(1);
		    dt.setMonth(dt.getMonth()+1+Number(obj));  
		    cdt = new Date(dt.getTime()-1000*60*60*24);
		    
		    var yearValue = cdt.getFullYear();
		    var monthValue = (cdt.getMonth() + 1)+"";
			var dayValue =  cdt.getDate()+"";
			
			if(monthValue.length == 1)
			{
				monthValue = "0" + monthValue;
			}
			
			if(dayValue.length == 1)
			{
				dayValue = "0" + dayValue;
			}
			orderEndDate = yearValue + "-" + monthValue + "-" + dayValue;
			var endDateStr = '<span class="font-orange dateNum">'+yearValue+'</span>'+sabace.getMessage("order.label.year")+'<span class="font-orange dateNum">'+monthValue+'</span>'+sabace.getMessage("order.label.month")+'<span class="font-orange dateNum">'+dayValue+'</span>'+sabace.getMessage("order.label.day");
			jQuery("#orderEndDate").html(endDateStr);
			jQuery("#orderEndDate").attr("endDate", orderEndDate);
		}
	}
	

	/**
	 * 初始化订购月份的显示时间
	 */
	function initOrderMonth()
	{
		var dt = new Date();
		dt.setDate(1);
	    
		var currentDate = new Date();
		jQuery(".btn-group button").each(function(i) {
			if (i == 0)
			{
				dt.setMonth(dt.getMonth());
			}
			else if (i<9)
			{
				dt.setMonth(dt.getMonth()+1);
			}
			else if (i<11)
			{
				dt.setMonth(currentDate.getMonth()+12);
			}
			else
			{
				return;
			}
			
			var monthValue =(dt.getMonth()+1);
			if (monthValue < 10)
			{
				monthValue = "0" + monthValue;
			}
			
			jQuery(this).html(dt.getFullYear() + "-" + monthValue);
		});
	}
	
	// 订单数量改变，同步修改消费积分值
	function changeCostValue(obj)
	{
		var costValue = Math.floor(obj) * Number(servicePrice);
		jQuery(".costNum").html(costValue);
	}
	
	// 订购界面提交按钮控制
	function isShowConfirm()
	{
		var result = false;
		var storValue = jQuery("#orderNum").val();
		if (storValue > 0)
		{
			result = true;
		}
		
		if(result)
		{
			jQuery("#saveOrderInfo").prop("disabled","");
		}
		else
		{
			jQuery("#saveOrderInfo").prop("disabled","disabled");
		}
	}
	
	function initOrderInfo()
	{
		// 初始化存储容量信息为0
		changeOrderNum(0,false);
		
		// 初始化月份截止为第一个
		jQuery("#lastbutton").click();
		
		// 初始化订购编码为空
		initOrderId = "";
		
		// 滑块组件生效
		if (jQuery("#orderNumSlider").slider("option", "disabled")) {
			jQuery("#orderNumSlider").slider("enable");
		}

		// 存储输入框有效
		if (jQuery("#orderNum").prop("disabled")) {
			jQuery("#orderNum").prop("disabled", "");
		}
	}
	
	// 订购信息修改
	function modifyOrderInfo(obj){
		
		initOrderId = jQuery(obj).attr("orderId");
		
		// 初始化原订购信息结束月份
		var orderEndDate = jQuery(obj).attr("orderEndDate");
		if (sabace.IsEmpty(orderEndDate))
		{
			jQuery("#lastbutton").click();
		}
		else
		{
			orderEndDate = orderEndDate.substr(0,7);
		}
		
		var orderNum = jQuery(obj).attr("orderNum");
		
		// 显示滑块的值
		orderNum = Number(orderNum);
		changeOrderNum(orderNum,false);
		

		// 禁用滑块组件以及输入框
		jQuery("#orderNumSlider").slider("disable");

		// 存储空间输入框禁用
		jQuery("#orderNum").prop("disabled", true);
		
		// 显示订购月份
		jQuery(".btn-group button").each(function(i) {
			var showMonthValue = jQuery(this).html();
			if(showMonthValue === orderEndDate)
			{
				jQuery(this).click();
			}
		});
		
		// 隐藏订购记录，显示订单修改域
		jQuery(".orderListDiv").addClass("hide");
		jQuery(".orderDiv").removeClass("hide");
		
		jQuery(".buttons button").prop("disabled","disabled");
		jQuery("#back").removeClass("hide");
	}
	
	// 订单关闭
	function closeOrder(obj){
		var orderId = jQuery(obj).attr("orderId");
		var paramData = {
				orderId: orderId
			};
		bi.dialog.confirm({
			title: "确认",
			message: "您确定要关闭该服务？ 注意：服务关闭次月生效",
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
										jQuery("#orderListGrid").trigger("reloadGrid");
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
	
	// 服务总量
	function setTotalNum(){
		jQuery("#totalNum").empty();
		for(i=totalNum; i>0; i=parseInt(Number(i)/10)){
			var numStr = '<span class="numSpan">' + Number(i)%10 + '</span>';
			jQuery("#totalNum").prepend(numStr);
		}
	}
	
	// 订购记录查询
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
		jQuery("#orderListGrid").jqGrid('setGridParam',{postData : postData}).trigger("reloadGrid"); 
	}
	
});