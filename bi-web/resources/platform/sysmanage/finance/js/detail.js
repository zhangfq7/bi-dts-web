define(['sabace', 'detail/message'], function(sabace, message) {
	function init() {
		//下拉框初始化
		jQuery('.chosen-select').chosen();
		
		//渲染datetimepicker	
		
		initConsumeDate();
		initRechargeDate();
		
		//绑定consume-time事件
		jQuery("#consume-time").on("click",function(){
			jQuery('#queryConsumeTime').focus();		
		});
		
		jQuery("#recharge-time").on("click",function(){
			jQuery('#queryRechargeTime').focus();	
		});
		// 获取第一个tab中表格的宽度，需要统一设置给其它的几个tab页表格中
		var consumeListWidth = $(".consume-list-class").width() - 5;
		
		initConsumeList(consumeListWidth);
		initRechargeList(consumeListWidth);
		
		
		
		// 监控页面的宽度变化，并修改表格的宽度
		$(window).resize(function() {
			var consumeListWidth = $(".consume-list-class").width() - 5;
			var rechargeListWidth = $(".recharge-list-class").width() - 5;
			$("#consumeListGrid").setGridWidth(consumeListWidth > rechargeListWidth ? consumeListWidth : rechargeListWidth);
			$("#rechargeListGrid").setGridWidth(consumeListWidth > rechargeListWidth ? consumeListWidth : rechargeListWidth);
		});

		$("#rechargeListGrid").on("click", '.recharge-oper', function() {
			alert($(this).attr("value"));
		});
		
		
		// 绑定查询事件
		jQuery('#consumeSearcheButton').on("click", consumeSearch);
		jQuery('#rechargeSearcheButton').on("click", rechargeSearch);
		
	}
	

	//返回页面所需方法
	return {
		init: init
	}
	
	
	//获取消费记录页面传入的值
	function consumeSearch(){				
		var  serviceName = jQuery('#serviceName').val();
		var  consumeAcyc=jQuery('#queryConsumeTime').dateRange("getDate");
		var  consumeTimeTxt=jQuery('#queryConsumeTime').val();
		postData = {
				serviceName : encodeURI(serviceName),
				queryStartAcyc : consumeAcyc.startDate,
				queryEndAcyc:consumeAcyc.endDate,
			};
		if(consumeTimeTxt==''||consumeTimeTxt== null)
		{
		postData.queryStartAcyc='';
		postData.queryEndAcyc='';
		}
		
		jQuery("#consumeListGrid").jqGrid('setGridParam',{postData : postData}).trigger("reloadGrid"); 
		
		//[]数组参数可以省略
	
	}
	
	//获取入账记录页面传入的值
	function rechargeSearch(){
		var  rechargeTime=jQuery('#queryRechargeTime').dateRange("getDate");
		var  rechargeType=jQuery("#rechargeType").val();
		var  rechargeState=jQuery('#rechargeState').val();
		var  rechargeTimeTxt=jQuery('#queryRechargeTime').val();
		postData = {
				rechargeStartTime:rechargeTime.startDate,
				rechargeEndTime:rechargeTime.endDate,
				rechargeType:rechargeType,
		        rechargeState:rechargeState,
			};
		if(rechargeTimeTxt==''||rechargeTimeTxt== null)
		{
		postData.rechargeStartTime='';
		postData.rechargeEndTime='';
		}
		jQuery("#rechargeListGrid").jqGrid('setGridParam',{postData : postData}).trigger("reloadGrid"); 
	}
	
	function initConsumeList(consumeListWidth){
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
		var startDate = startYear + "-" + startMonth;
		var endDate = endYear + "-" + endMonth;
		jQuery("#queryConsumeTime").val(startDate+"   ~   "+endDate);
		
		$("#consumeListGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/sysmanage/finance/consume-list'),
			styleUI: 'Bootstrap',
			datatype: 'json',
			postData: {
				queryStartAcyc: startDate,
				queryEndAcyc: endDate,
			},
			width: consumeListWidth,
			height: 'auto',
			regional: 'cn',
			rownumbers: true,
			colModel: [{
				label: sabace.getMessage("finance.label.serviceName"),
				name: 'serviceName',
				width: 300,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("finance.label.serviceMonth"),
				name: 'consumeAcyc',
				width: 150,
				align: 'center',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("finance.label.orderTime"),
				name: 'orderTime',
				width: 150,
				align: 'center',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("finance.label.pointsTime"),
				name: 'adminTime',
				width: 150,
				align: 'center',
				hlign: 'center',
				sortable: false
			},{
				label: sabace.getMessage("finance.label.orderType"),
				name: 'orderType',
				width: 150,
				align: 'right',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					if (cellvalue == 1) {
						return sabace.getMessage("finance.label.orderType.times");
					} else if (cellvalue == 2) {
						return sabace.getMessage("finance.label.orderType.days");
					} else if(cellvalue == 5) {
						return sabace.getMessage("finance.label.orderType.month");
					}else{
						return sabace.getMessage("finance.label.orderType.year");
					}
				}
			}, {
				label: sabace.getMessage("finance.label.costNum"),
				name: 'consumeIntegral',
				width: 150,
				align: 'right',
				hlign: 'center',
				sortable: false
			}],
		    loadComplete:function(){
			    var len=$("#consumeListGrid").getGridParam("records");
			    var integralsum=0;
			    var rowdata=jQuery("#consumeListGrid").jqGrid("getRowData");
			    for(var i=0;i<rowdata.length;i++){
	                 integralsum=integralsum+parseInt(rowdata[i]["consumeIntegral"]);
			                           }
			    document.getElementById('integralsum').innerHTML =integralsum;	
			}
		});
	}
	
	function initRechargeList(consumeListWidth){
		
		var date = new Date();
		var endDay = date.getDate();
		var endMonth = date.getMonth() + 1;
		var endYear = date.getFullYear();
		var startYear;
		var startMonth;
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
		var startDate = startYear + "-" + startMonth + "-01";
		var endDate = endYear + "-" + endMonth + "-" + endDay;
		
		jQuery("#queryRechargeTime").val(startDate+"   ~   "+endDate);
		
		$("#rechargeListGrid").jqGrid({
			url: sabace.handleUrlParam('/platform/sysmanage/finance/recharge-list'),
			styleUI: 'Bootstrap',
			datatype: 'json',
			postData: {
				rechargeStartTime: startDate,
				rechargeEndTime: endDate
			},
			width: consumeListWidth,
			height: 'auto',
			regional: 'cn',
			rownumbers: true,
			colModel: [{
				label: sabace.getMessage("finance.label.orderCode"),
				name: 'rechargeId',
				width: 250,
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("finance.label.orderTime"),
				name: 'rechargeTime',
				width: 120,
				align: 'center',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("finance.label.payType"),
				name: 'rechargeType',
				width: 130,
				align: 'left',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					var rechargeType = rowObject.rechargeType;
					if (rechargeType == '1') {
						return sabace.getMessage("finance.label.payType.alipay");
					} else if (rechargeType == '2') {
						return sabace.getMessage("finance.label.payType.weChat");
					} else if (rechargeType == '3') {
						return sabace.getMessage("finance.label.payType.CFT");
					}
				}
			}, {
				label: sabace.getMessage("finance.label.payState"),
				name: 'rechargeState',
				width: 150,
				align: 'left',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					var rechargeState = rowObject.rechargeState;
					if (rechargeState == '1') {
						return sabace.getMessage("finance.label.payState.notPaid");
					} else if (rechargeState == '4') {
						return sabace.getMessage("finance.label.payState.failed");
					} else if (rechargeState == '9') {
						return sabace.getMessage("finance.label.payState.succeed");
					}
				}
			}, {
				label: sabace.getMessage("finance.label.payMoney"),
				name: 'payMoney',
				width: 100,
				align: 'right',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					return Number(cellvalue)/100+sabace.getMessage("finance.label.money.unit")
				}
			}, {
				label: sabace.getMessage("finance.label.post.points"),
				name: 'rechargeIntegral',
				width: 100,
				align: 'right',
				hlign: 'center',
				sortable: false
			}, {
				label: sabace.getMessage("finance.label.operate"),
				name: 'rechargeOper',
				width: 100,
				align: 'center',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					var rechargeState = rowObject.rechargeState;
					if (rechargeState == '1') {
						return '<a href="javascript:void(0)" class="recharge-oper" value="' + rowObject.rechargeId + '">'+sabace.getMessage("finance.label.toPay")+'</a>';
					} else {
						return '';
					}
				}
			}],
			 loadComplete:function(){
				    var lenth=$("#rechargeListGrid").getGridParam("records");
				    var paysucess=0;
				    var rechargeIntegral=0;
				    var payfailed=0;
				    var rowdata=jQuery("#rechargeListGrid").jqGrid("getRowData");

				    for(var i=0;i<rowdata.length;i++){
				    	if(rowdata[i]["rechargeState"]==sabace.getMessage("finance.label.paySuccess")){
				    		paysucess=parseFloat(paysucess)+parseFloat(rowdata[i]["payMoney"]);
				    		rechargeIntegral=rechargeIntegral+parseInt(rowdata[i]["rechargeIntegral"]);
				        }
				    	else if(rowdata[i]["rechargeState"]==sabace.getMessage("finance.label.payFailed")){
				    		payfailed=parseFloat(payfailed)+parseFloat(rowdata[i]["payMoney"]);
				    	}
				    }
				    document.getElementById('paysucess').innerHTML =paysucess;	
				    document.getElementById('rechargeIntegral').innerHTML =rechargeIntegral;
				    document.getElementById('payfailed').innerHTML =payfailed;	
				   
				}
		});
	}
	
	function initConsumeDate(){
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
		var startDate = startYear + "-" + startMonth;
		var endDate = endYear + "-" + endMonth;
		jQuery("#queryConsumeTime").dateRange({
			format:'YYYY-MM',
			start:{
				maxDate:endDate,
			},
			end:{
				maxDate:endDate,
			},
			onhide:function(){
				var acycId=jQuery(this).dateRange("getDate");
			},
			startValue:startDate,
			endValue:endDate
		});
	}

	function initRechargeDate(){
		var date = new Date();
		var endDay = date.getDate();
		var endMonth = date.getMonth() + 1;
		var endYear = date.getFullYear();
		var startYear;
		var startMonth;
		if (endMonth < 5) {
			startYear = endYear - 1;
			startMonth = endMonth + 8;
		} else {
			startYear = endYear;
			startMonth = endMonth - 4;
		}
		if(startMonth < 10){
			startMonth = "0" + startMonth;
		}
		if(endMonth < 10){
			endMonth = "0" + endMonth;
		}
		
		var startDate = startYear + "-" + startMonth + "-01";
		var endDate = endYear + "-" + endMonth + "-" + endDay;
		
		jQuery("#queryRechargeTime").dateRange({
			format:'YYYY-MM-DD',
			start:{
				maxDate:moment().format('YYYY-MM-DD'),
			},
			end:{
				maxDate:moment().format('YYYY-MM-DD'),
			},
			onhide:function(){
				var rechargeTime=jQuery(this).dateRange("getDate");
			},
			startValue:startDate,		
			endValue:endDate
		});
	}
	
});








