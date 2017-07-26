define(['EBuilder', 'sabace', 'glober/message','system/serviceInfo'], function(EBuilder, sabace, message,serviceInfo) {
	var global = {};
	global.modal = {
		echartsObj: {} //存放页面图像对象
	}

	var themeColor = jQuery("#bi-nav").css("backgroundColor") || "#87cefa"; //主题颜色
    var deepDiv = jQuery("<div>",{
    	'class':'webuploader-pick-hover'
    });
    jQuery("body").append(deepDiv)
    var deepThemeColor = deepDiv.css("backgroundColor") || "#87cefa";
    deepDiv.remove();
    
	global.view = {
		/**
		 * 空间处理
		 */
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
		
		/**
		 * 仪表板排名
		 */
		initDashboard: function() {
			// 向后台发送请求获取仪表板数据
			sabace.ajax({
				url: sabace.handleUrlParam('/platform/overview/sysGlobal/get-dashboard'),
				success: function(req) {
					var dashboardData = [];
					
					if(req.resFlag == "success"){
						// 默认展示访问排名
						jQuery.each(req.visitList, function(i, v) {
							var obj = {};
							obj['name'] = '第' + (i + 1);
							obj['group'] = '访问排名';
							obj['reportName'] = v.reportName;
							obj['reportId'] = v.reportId;
							obj['value'] = v.visitCount;
							dashboardData.push(obj);
						})
						
						if (sabace.IsEmpty(dashboardData)) {
							$('#dashboardChart').hide();
							$('#noDashboardData').show();
							return;
						} else {
							$('#dashboardChart').show();
							$('#noDashboardData').hide();
							
							// 展示仪表板chart图
							initDashboardChart(dashboardData);
						}
					} else {
						$('#dashboardChart').hide();
						$('#noDashboardData').show();
					}
				},
				error: function(req) {
					$('#noDashboardData .text').html(req.responseText);
					$('#dashboardChart').hide();
					$('#noDashboardData').show();
				}
			});
		},
		
		/**
		 * 模板引入
		 */
		initTplRank: function() {
			// 向后台发送请求获取模板引入数据
			sabace.ajax({
				url: sabace.handleUrlParam('/platform/overview/sysGlobal/get-tpl-rank'),
				success: function(req) {
					if(req.resFlag == "success") {
						var tplData = [];
						jQuery.each(req.tplList, function(i, v) {
							var obj = {};
							obj['group'] = '引用数量';
							obj['name'] = '第' + (i + 1);
							obj['value'] = v.usedNum;
							obj['tplName'] = v.tplName;
							obj['tplId'] = v.tplId;
							obj['thumbImg'] = v.thumbImg;
							tplData.push(obj);
						})
						if (sabace.IsEmpty(tplData)) {
							$('#tplRankChart').hide();
							$('#noTplRankData').show();
							return;
						} else {
							$('#tplRankChart').show();
							$('#noTplRankData').hide();
							
							// 展示引入报表chart图
							initTplRankChart(tplData);
						}
					} else {
						$('#tplRankChart').hide();
						$('#noTplRankData').show();
					}
				},
				error: function(req) {
					$('#noTplRankData .text').html(req.responseText);
					$('#tplRankChart').hide();
					$('#noTplRankData').show();
				}
			});
		},
		
		/**
		 * 7日内数据监控
		 */
		initData: function() {
			// 向后台发送请求获取7日内数据监控
			sabace.ajax({
				url: sabace.handleUrlParam('/platform/overview/sysGlobal/get-data-pie'),
				success: function(req) {
					if(req.resFlag == "success") {
						var dataBean = req.dataBean;
						// 页面赋值
						$('#dataSuccNum').html(dataBean.succNum);
						$('#dataFailNum').html(dataBean.failNum);
						
						var data = [];
						var succObj = {};
						succObj['group'] = '数据更新';
						succObj['name'] = '成功';
						succObj['value'] = dataBean.succNum;
						data.push(succObj);
						var failObj = {};
						failObj['group'] = '数据更新';
						failObj['name'] = '失败';
						failObj['value'] = dataBean.failNum;
						data.push(failObj);
						
						if (sabace.IsEmpty(data)) {
							$('#dataChart').hide();
							$('#noDataData').show();
							return;
						} else {
							$('#dataChart').show();
							$('#noDataData').hide();
							
							// 展示引入七日内数据监控chart图
							initDataChart(data);
						}
					} else {
						$('#dataChart').hide();
						$('#noDataData').show();
					}
				},
				error: function(req) {
					$('#noDataData .text').html(req.responseText);
					$('#dataChart').hide();
					$('#noDataData').show();
				}
			});
		},
		
		/**
		 * 数据源监控
		 */
		initDataSource: function() {
			// 向后台发送请求获取数据源监控数据
			sabace.ajax({
				url: sabace.handleUrlParam('/platform/overview/sysGlobal/get-data-source'),
				success: function(req) {
					var dataSourceData = [];
					var numList = req.numList;
					var reportNumList = req.reportNumList;
					var numBean = req.numBean;
					var reportNumBean = req.reportNumBean;
					
					if(numList != null){
						jQuery.each(numList, function(i, v) {
							var obj = {};
							obj['group'] = '数据表数量';
							obj['name'] = v.dbName;
							obj['value'] = v.tableNum;
							dataSourceData.push(obj);
						})
					}
					
					if(reportNumList != null){
						jQuery.each(reportNumList, function(i, v) {
							var obj = {};
							obj['group'] = '仪表板数量';
							obj['name'] = v.dbName;
							obj['value'] = v.tableReportNum;
							dataSourceData.push(obj);
						})
					}
					
					var fileNumObj = {};
					fileNumObj['group'] = '数据表数量';
					fileNumObj['name'] = '文件';
					fileNumObj['value'] = numBean.fileNum;
					dataSourceData.push(fileNumObj);
					
					var fileReportNumObj = {};
					fileReportNumObj['group'] = '仪表板数量';
					fileReportNumObj['name'] = '文件';
					fileReportNumObj['value'] = reportNumBean.fileReportNum;
					dataSourceData.push(fileReportNumObj);
					
					var linkNumObj = {};
					linkNumObj['group'] = '数据表数量';
					linkNumObj['name'] = '数据连接';
					linkNumObj['value'] = numBean.linkNum;
					dataSourceData.push(linkNumObj);
					
					var linkReportNumObj = {};
					linkReportNumObj['group'] = '仪表板数量';
					linkReportNumObj['name'] = '数据连接';
					linkReportNumObj['value'] = reportNumBean.linkReportNum;
					dataSourceData.push(linkReportNumObj);
					
					if (sabace.IsEmpty(dataSourceData)) {
						$('#dataSourceChart').hide();
						$('#noDataSourceData').show();
						return;
					} else {
						$('#dataSourceChart').show();
						$('#noDataSourceData').hide();
						
						// 展示数据源监控chart图
						initDataSourceChart(dataSourceData);
					}
				},
				error: function(req) {
					$('#noDataSourceData .text').html(req.responseText);
					$('#dataSourceChart').hide();
					$('#noDataSourceData').show();
				}
			});
		},
		
		/**
		 * 数据耗时
		 */
		initDataTime: function () {
			// 向后台发送请求获取数据耗时
			sabace.ajax({
				url: sabace.handleUrlParam('/platform/overview/sysGlobal/get-data-time'),
				success: function(req) {
					if(req.resFlag == "success") {
						var dataTimeData = [];
						jQuery.each(req.timeList, function(i, v) {
							var obj = {};
							obj['group'] = '耗时';
							obj['name'] = '第' + (i + 1);
							obj['value'] = v.taskTotalSecond;
							obj['dataName'] = v.dataName;
							obj['dataId'] = v.dataId;
							obj['taskType'] = v.taskType;
							dataTimeData.push(obj);
						})
						
						if (sabace.IsEmpty(dataTimeData)) {
							$('#dataTimeChart').hide();
							$('#noDataTimeData').show();
							return;
						} else {
							dataTimeData.reverse();
							
							$('#dataTimeChart').show();
							$('#noDataTimeData').hide();
							// 展示数据耗时chart图
							initDataTimeChart(dataTimeData);
						}
					} else {
						$('#dataTimeChart').hide();
						$('#noDataTimeData').show();
					}
				},
				error: function(req) {
					$('#noDataTimeData .text').html(req.responseText);
					$('#dataTimeChart').hide();
					$('#noDataTimeData').show();
				}
			});
		}
	}
	
	// 展示仪表排行chart
	function initDashboardChart(dashboardData){
		$('#dashboardChart').EBuilder({
			data: dashboardData,
			type: ['bar'],
			option: {
				tooltip: {
					formatter: function() {
						var showName = arguments[0][0].data.reportName + ": " + arguments[0][0].data.value + "次";
						return showName;
					}
				},
				legend: {
					show: false
//					show: true,
//					y: 'top'
				},
				toolbox: {
					show: false
				},
				color: [themeColor], //取系统的主题色(top的导航)
				grid: {
					x: 50,
					x2: 30,
					y: 8,
					y2: 40
				},
				series: [{
					barWidth: 25
				}],
				yAxis: [{
					axisLabel: {
						formatter: '{value}'
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
				global.modal.echartsObj["dashboard"] = this;
				var ecConfig = require('echarts/config');
				this.on(ecConfig.EVENT.CLICK, function(){
					window.open(sabace.handleUrlParam('/platform/dataview/view') + '?reportId=' + arguments[0].data.reportId);
				});
			}
		});
	}
	
	// 展示模板引用排行chart
	function initTplRankChart(tplData) {
		$('#tplRankChart').EBuilder({
			data: tplData,
			type: ['bar'],
			option: {
				tooltip: {
					formatter: function() {
						var showName = arguments[0][0].data.tplName + ": " + arguments[0][0].data.value + "次";
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
						formatter: '{value}'
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
				global.modal.echartsObj["tpl"] = this;
				var ecConfig = require('echarts/config');
				this.on(ecConfig.EVENT.CLICK, function(){
					var formTemp = jQuery("<form></form>",{
						"method":"post",
						"action": sabace.handleUrlParam('/platform/myreport/tpl/report-tpl-view'),
						"target": "_blank",
						"html": "<input name='thumbImg' value='" + arguments[0].data.thumbImg + "'/>"
					});
					jQuery('body').append(formTemp);
					formTemp.submit();
					jQuery(formTemp).remove();
				});
			}
		});
	}
	
	// 展现七日内数据监控chart
	function initDataChart(data){
		$('#dataChart').EBuilder({
			data: data,
			type: ['pie'],
			option: {
				toolbox: {
					show: false
				},
                tooltip:{
                    enterable:true,
                    showDelay:100
                },
				color: [themeColor,deepThemeColor], //取系统的主题色(top的导航)
			    legend: {
			        show: false
			    },
			    series:[{
			    	radius: ['60%','80%']
			    }]
			},
			theme: ['echarts/theme/blue'],
			callback: function() {
				global.modal.echartsObj["data"] = this;
			}
		});
	}
	
	// 展现数据源简监控chart
	function initDataSourceChart(dataSourceData){
		$('#dataSourceChart').EBuilder({
			data: dataSourceData,
			type: ['line'],
			option: {
				tooltip : {
				    trigger: 'axis',
				    axisPointer: {
				    	lineStyle : {
				    		color: themeColor
				    	}
				    }
				},
				toolbox: {
					show: false
				},
				color: [themeColor], //取系统的主题色(top的导航)
				xAxis : [
			           {
			        	   type : 'category',
			               boundaryGap : false,
			               axisLine: {
								lineStyle: {
									color: themeColor
								}
							}
			           }
			    ],
			    yAxis: [{
					axisLine: {
						lineStyle: {
							color: themeColor
						}
					}
				}],
				series:[{
					 type:'line',
					 itemStyle: {normal: {areaStyle: {type: 'default'}}},
					 smooth: true
				},{
					 type:'line',
					 itemStyle: {normal: {areaStyle: {type: 'default'}}},
					 smooth: true
				}]
			},
			theme: ['echarts/theme/blue'],
			callback: function() {
				global.modal.echartsObj["dataSource"] = this;
				var ecConfig = require('echarts/config');
			}
		});
	}
	
	// 展现数据耗时chart
	function initDataTimeChart(dataTimeData){
		$('#dataTimeChart').EBuilder({
			data: dataTimeData,
			type: ['bar'],
			yx: true,
			option: {
				tooltip: {
					formatter: function() {
						var showName = arguments[0][0].data.dataName + ": " + arguments[0][0].data.value + "秒";
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
						formatter: '{value}秒'
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
				}]
			},
			theme: ['echarts/theme/blue'],
			callback: function() {
				global.modal.echartsObj["time"] = this;
				var ecConfig = require('echarts/config');
				this.on(ecConfig.EVENT.CLICK, function(){
					var type = arguments[0].data.taskType;
					var dataId = arguments[0].data.dataId;
					var url = null;
					var html = null;
					if(type == "1" || type == "2"){
						url = sabace.handleUrlParam("/platform/resmanage/data/data-common-view");
						html = "<input name='dataId' value='" + dataId + "'/><input name='type' value='" + type + "'/>";
					}else if(type == "3"){
						url = sabace.handleUrlParam("/platform/resmanage/datalink/data-link-show");
						html = "<input name='dataLinkId' value='" + dataId + "'/>";
					}
					var formTemp = jQuery("<form></form>",{
						"method":"post",
						"action": url,
						"target": "_blank",
						"html": html
					});
					jQuery('body').append(formTemp);
					formTemp.submit();
					jQuery(formTemp).remove();
				});
			}
		});
	}
	
	// 仪表盘切换事件
	function rankChange() {
		var type = jQuery(this).val();
		// 向后台发送请求获取仪表板数据
		sabace.ajax({
			data: {
				type: type
			},
			url: sabace.handleUrlParam('/platform/overview/sysGlobal/get-dashboard'),
			success: function(req) {
				var dashboardData = [];
				if(req.resFlag == "success"){
					if(type == "visit"){
						jQuery.each(req.visitList, function(i, v) {
							var obj = {};
							obj['name'] = '第' + (i + 1);
							obj['group'] = '访问排名';
							obj['reportName'] = v.reportName;
							obj['reportId'] = v.reportId;
							obj['value'] = v.visitCount;
							dashboardData.push(obj);
						})
					}else if(type == "share"){
						jQuery.each(req.shareList, function(i, v) {
							var obj = {};
							obj['name'] = '第' + (i + 1);
							obj['group'] = '分享排名';
							obj['reportName'] = v.reportName;
							obj['reportId'] = v.reportId;
							obj['value'] = v.shareNum;
							dashboardData.push(obj);
						})
					}else if(type == "email"){
						jQuery.each(req.emailList, function(i, v) {
							var obj = {};
							obj['name'] = '第' + (i + 1);
							obj['group'] = '邮件推送排名';
							obj['reportName'] = v.reportName;
							obj['reportId'] = v.reportId;
							obj['value'] = v.emailNum;
							dashboardData.push(obj);
						})
					}
					
					if (sabace.IsEmpty(dashboardData)) {
						$('#dashboardChart').hide();
						$('#noDashboardData').show();
						return;
					} else {
						$('#dashboardChart').show();
						$('#noDashboardData').hide();
						// 展示仪表板chart图
						initDashboardChart(dashboardData);
					}
				} else {
					$('#dashboardChart').hide();
					$('#noDashboardData').show();
					return;
				} 
			},
			error: function(req) {
				$('#noDashboardData .text').html(req.responseText);
				$('#dashboardChart').hide();
				$('#noDashboardData').show();
			}
		});
	}
	
	global.controller = {
		init: function() {
			
			// 下拉框初始化
			jQuery('#selectRank').chosen({
				disable_search: true
			});

			// 空间处理
			global.view.initSpace();
			
			// 仪表板排名
			global.view.initDashboard();
			
			// 模板引入
			global.view.initTplRank();
			
			// 七日内数据表更新监控
			global.view.initData();
			
			// 数据源监控
			global.view.initDataSource();
			
			// 数据耗时
			global.view.initDataTime();
			
			// 仪表盘排行切换事件
			jQuery("#selectRank").bind("change", rankChange)
			
			//给存储空间详情加事件
			jQuery("#extendStorage").bind("click", function() {
				window.open(sabace.handleUrlParam('/platform/serviceopen/extend-storage'));
			})

			//给报表个数加点击事件
			jQuery("#reportCount").bind("click",function(){
				window.open(sabace.handleUrlParam('/platform/myreport/view/report-list'));
			})
			
			//七日内数据监控成功数加点击事件
			jQuery("#dataSuccNum").bind("click", function() {
				var url = sabace.handleUrlParam('/platform/overview/sysGlobal/service-info')+"?state=9"
				bi.dialog.show({
					title: '七日内数据表更新监控-成功总数',
					message: jQuery('<div id="serviceInfo" ></div>').load(url),
					cssClass: 'service-info-dialog',
					closeByBackdrop: false,
					closeByKeyboard: false,
					buttons: [{
						label: '确认',
						cssClass: 'btn-info',
						action: function(dialogItself) {
							dialogItself.close();
						}
					}],
					onshown:function(){
						serviceInfo.init();
					}
				});			
			
				
			})

			//七日内数据监控失败数加点击事件
			jQuery("#dataFailNum").bind("click",function(){
				var url = sabace.handleUrlParam('/platform/overview/sysGlobal/service-info')+"?state=7"
				bi.dialog.show({
					title: '七日内数据表更新监控-失败总数',
					message: jQuery('<div id="serviceInfo" ></div>').load(url),
					cssClass: 'service-info-dialog',
					closeByBackdrop: false,
					closeByKeyboard: false,
					buttons: [{
						label: '确认',
						cssClass: 'btn-info',
						action: function(dialogItself) {
							dialogItself.close();
						}
					}],
					onshown:function(){
						serviceInfo.init();
					}
				});			
			})
			
			window.onresize = function() {
				$.each(global.modal.echartsObj, function(i, v) {
					global.modal.echartsObj[i].resize && global.modal.echartsObj[i].resize();
				})
			}
		}
	}

	// 返回页面所需方法
	return global.controller
});