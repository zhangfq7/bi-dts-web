define(['sabace', 'userSelect'], function(sabace,userSelect) {
	// 查询方式 默认查询所有的 0:所有,1:单图,2:多图,3最新
	var queryType = "0";
	// 搜索框中的值
	var queryText = "";
	// 页码
	var pageNum = 1;
	// 每页20条
	var pageSize = 20;
	// 是否是企业用户
	var companyFlag = null;
	
	jQuery(function() {
		// 查询条件按钮样式
		initButtonStyle();
		// 根据不同的查询方式查询展现结果
		jQuery("#searchButton button").on("click", function(){
			queryTplData(true);
		});
		// 搜索查询展示结果
		jQuery("#search").on("click", function(){
			queryTplData(true);
		});
		// 搜索回车事件
		jQuery('#searchText').keydown(function(e) {
			if (e.keyCode == 13) {
				jQuery("#search").trigger("click");
			}
		});
		// 返回顶部事件
		initReturnToTop();
		// 初始化查询数据
		queryTplData(true);
		// 引用
		jQuery("#tplList").on("click", "#quoteTpl", quoteReportTpl);
		// 删除
		jQuery("#tplList").on("click", "#delTpl", delReportTpl);
		// 分享
		jQuery("#tplList").on("click", "#shareTpl", shareReportTpl);
		// 弹出放大图
		jQuery('#tplList').on("click", '#tplImg', enlargeTpl);
	})
	
	// 查询条件按钮样式
	function initButtonStyle(){
		//给按钮组点击样式
		jQuery("#searchButton button").on("click", function() {
			jQuery(this).removeClass("normal-button").addClass("clicked-button theme-background").siblings().addClass("normal-button").removeClass("clicked-button theme-background");
		})
		jQuery("#searchButton").on('mouseover', '.normal-button', function() {
			jQuery('.normalButton').removeClass('theme-background');
			jQuery(this).addClass('theme-background');
		}).on('mouseleave', '.normal-button', function() {
			jQuery(this).removeClass('theme-background');
		})
	}
	
	// 根据不同的查询方式查询展现结果
	function queryTplData(pageFlag){
		// 加载进度条
		initLoading();
		// 获取选择查询类型值
		queryType = jQuery("#searchButton .clicked-button").attr('id');
		// 获取搜索框中的值
		queryText = jQuery("#searchText").val();
		// 发送请求到后台查询模板列表
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/tpl/query-tpl-list"),
			data: {
				pageNum: pageNum,
				pageSize: pageSize,
				queryType: queryType,
				queryText: queryText
			},
			success: function(req) {
				if (req.resFlag == "success") {
					companyFlag = req.companyFlag;
					// 数据查询成功
					queryTplDataSuccess(req.tplList.rows,req.tplList.total,pageFlag,req.jobId,req.userId);
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('report.tpl.tipTitle'),
						message: sabace.getMessage('msg.tpl.queryTipFail')
					});
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('report.tpl.tipTitle'),
					message: sabace.getMessage('msg.tpl.queryTipError')
				});
			}
		});
	}
	
	// 数据查询成功
	function queryTplDataSuccess(tplList,tplTotal,pageFlag,jobId,userId){
		jQuery("#tplList").html("");
		$('body,html').animate({
			scrollTop: 0
		}, 100);
		// 查询结果为空
		if(tplList.length == 0){
			jQuery("#page").page('destroy');
			// 没有查询到数据
			showNoData();
		}else{
			var html = '';
			// 查询结果不为空,组装报表模板
			for(var i = 0; i < tplList.length; i++){
				html += getTplHtml(tplList[i],jobId,userId);
			}
			jQuery("#tplList").append(html);
			// 渲染分页
			initPageTools(tplTotal,pageFlag);
		}
		
		// 去除进度条
		jQuery("#tplLoading").css("width", "99.5%").delay(200).fadeOut(400, function() {
			jQuery(this).remove();
		});
	}
	
	// 没有查询到数据
	function showNoData(){
		var tipMsg = "";
		var html = '';
		html += '<div>!</div>';
		// 搜索内容
		if(queryText != null && queryText != ""){
			tipMsg += sabace.getMessage('report.tpl.queryContent') + queryText;
		}
		if(queryType != 0){
			if(tipMsg.length > 0){
				tipMsg += sabace.getMessage('report.tpl.and');
			}
			// 单图
			if(queryType == 1){
				tipMsg += sabace.getMessage('report.tpl.queryBySingle');
			}else if(queryType == 2){ // 多图
				tipMsg +=sabace.getMessage('report.tpl.queryByMuch');
			}else{// 最新
				tipMsg += sabace.getMessage('report.tpl.queryByLatest');
			}
		}
		if(tipMsg.length == 0){
			html += '<div>' + sabace.getMessage('report.tpl.noTip') + '</div>';
		}else {
			html += '<div>' + sabace.getMessage('report.tpl.notFind') + '<span class="noTpl-msg-font">“' + tipMsg + '”</span> ' + sabace.getMessage('report.tpl.relatedTpl') + '</div>';
		}
		var noTpl = jQuery("<div>", {
			'class': 'noTpl-msg',
			'html': html
		})
		jQuery("#tplList").html(noTpl);
	}
	
	// 组装报表模板List
	var height = (window.screen.width * 0.2 - 62) / 2; //每张报表图片的高度
	function getTplHtml(tpl,jobId,userId) {
		var tplId = tpl.tplId;
		var tplName = tpl.tplName;
		var tplType = tpl.tplType;
		var tplTypeName = null;
		if(tplType == "1"){
			tplTypeName = sabace.getMessage('report.tpl.SingleType');
		}else{
			tplTypeName = sabace.getMessage('report.tpl.muchType');
		}
		var usedNum = tpl.usedNum;
		var createTime = tpl.createTime.substring(0,10);
		var thumbImg = tpl.thumbImg;
		var tplDesc = tpl.tplDesc;
		var createId = tpl.createId;
		var html = '';
		html += '<div class="thumbnail tpl-data tpl-effect" tplId=' + tplId + ' tplType=' + tplType + '>';
		html += '	<div class="tpl-data-top">';
		html += '   	<div class="tpl-data-thumbnail">';
		html +=	'           <div id="tplImg" class="tpl-img" style="height:' + height + 'px;background:url(' + thumbImg +') no-repeat;background-size:100% 100%;"></div>';
		html += '       </div>';
		html += '       <div class="tpl-data-info">';
		html += '       	<span class="tpl-name f15" title=' + tplName +'>' + tplName + '</span>';
		html += '           <span class="line-class f12">' + sabace.getMessage('report.tpl.type') + '&nbsp;:<span class="tpl-info-span line-class f14">' + tplTypeName + '</span></span>'; 
		html += '           <span class="f12">' + sabace.getMessage('report.tpl.useAmount') + '&nbsp;:<span class="tpl-info-span line-class f14">' + usedNum + '</span><span class="line-class">&nbsp;' + sabace.getMessage('report.tpl.second') + '</span></span>';
		html += '           <span><i class="fa fa-calendar"></i>&nbsp;:<span class="tpl-info-span line-class f13">' + createTime + '</span></span>';
		html += '       </div>';
		html += '   </div>';
		html += '   <div class="tpl-desc" title=' + tplDesc + '>' + tplDesc + '</div>';
		html += '   <hr>';
		html += '   <div class="tpl-data-tools">';
		html += '   	<div id="quoteTpl" class="tpl-data-quote"><i class="fa fa-cogs button-fa"></i><span>' + sabace.getMessage('report.tpl.quote') + '</span></div>';
		// 超级管理员、管理员并且是创建人是自己的、普通用户并且创建人是自己的可以进行删除
		if(jobId == "A" || (jobId == "B" && userId == createId) || (jobId == "C" && userId == createId)){
			html += '   <div id="delTpl" class="tpl-data-del"><i class="fa fa-trash-o button-fa"></i><span>' + sabace.getMessage('report.tpl.del') + '</span></div>';
		}
		// 企业用户可以做分享，非企业用户不可做分享
		if(companyFlag == "1"){
			// 超级管理员、管理员并且是创建人是自己的、普通用户并且创建人是自己的可以分享
			if(jobId == "A" || (jobId == "B" && userId == createId) || (jobId == "C" && userId == createId)){
				html += '   <div id="shareTpl" class="tpl-data-share"><i class="fa fa-share button-fa"></i><span>' + sabace.getMessage('report.tpl.share') + '</span></div>';
			}
		}
		html += '   </div>';
		html += '</div>';
		return html;
	}
	
	// 渲染分页
	function initPageTools(tplTotal,pageFlag){
		// 是否需要重新初始化分页控件
		if(pageFlag){
			jQuery("#page").page('destroy');
			//渲染分页控件
			jQuery("#page").page({
				total: tplTotal,
				pageSize: pageSize,
				showJump: true,
				firstBtnText: sabace.getMessage('report.tpl.first'),
				lastBtnText: sabace.getMessage('report.tpl.last'),
				jumpBtnText: sabace.getMessage('report.tpl.jump')
			}).on("pageClicked", function(event, pageIndex) {
				pageNum = pageIndex + 1;
				// 刷新当前页面
				queryTplData(false);
			}).on('jumpClicked', function(event, pageIndex) {
				pageNum = pageIndex + 1;
				// 刷新当前页面
				queryTplData(false);
			});
			//调整分页的位置
			var rowWidth = jQuery(".page").width();
			var pageWidth = Number(jQuery(".m-pagination-page").width()) + Number(jQuery(".m-pagination-jump").width());
			jQuery(".m-pagination-page").css("margin-left", (rowWidth - pageWidth) / 2 + "px");
		}
	}
	
	// 加载进度条
	function initLoading(){
		jQuery("#tplLoading").remove();
		jQuery('<div>', {
			"id": "tplLoading",
			"class": "loadingbar waiting tplLoading",
			"html": "<dt/><dd/>"
		}).appendTo(".tpl-top .tpl-select");
		jQuery("#tplLoading").width((50 + Math.random() * 30) + "%");
	}
	
	// 返回顶部事件
	function initReturnToTop(){
		//返回顶部
		jQuery(window).scroll(function() {
			if (jQuery(window).scrollTop() >= 100) {
				jQuery('.actGotop').fadeIn(300);
				jQuery(".main-panel").addClass("tpl-suspension");
			} else {
				jQuery('.actGotop').fadeOut(300);
				jQuery(".main-panel").removeClass("tpl-suspension");
			}
		});
		jQuery('.actGotop').click(function() {
			jQuery('html,body').animate({
				scrollTop: '0px'
			}, 800);
		});
	}
	
	// 删除报表模板
	function delReportTpl(){
		// 获取模板编码
		var tplId = jQuery(this).parent().parent().attr("tplId");
		bi.dialog.confirm({
            title: sabace.getMessage('report.tpl.tipTitle'),
            message: sabace.getMessage('msg.tpl.confirmDelTpl'),
            callback: function(result) {
                if(result) {
        			deleteTpl(tplId);
                }
            }
	    });
	}
	
	// 删除可视化模板
	function deleteTpl(tplId){
		// 像后台发送请求删除报表模板
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/tpl/del-tpl"),
			loading: {
				title: sabace.getMessage('report.tpl.executing'),
				text: sabace.getMessage('report.tpl.delWait')
			},
			data: {
				tplId: tplId
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 删除可视化模板成功
					bi.dialog.show({
						type: bi.dialog.TYPE_INFO,
						title: sabace.getMessage('report.tpl.tipTitle'),
						message: sabace.getMessage('report.tpl.delSuccess')
					});
					// 刷新当前页面
					queryTplData(false);
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('report.tpl.tipTitle'),
						message: sabace.getMessage('report.tpl.delFail')
					});
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('report.tpl.tipTitle'),
					message: sabace.getMessage('report.tpl.delError')
				});
			}
		});
	}
	
	// 分享报表模板
	function shareReportTpl(){
		// 如果是非企业用户则不可以分享报表模板
		var companyFlag = jQuery("#companyFlag").val();
		if(companyFlag == "0"){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('report.tpl.tipTitle'),
				message: sabace.getMessage('report.tpl.canNotShare')
			});
		}else {
			// 获取模板编码
			var tplId = jQuery(this).parent().parent().attr("tplId");
			shareTpl(tplId);
		}
	}
	
	// 分享报表
	function shareTpl(tplId){
		var url = sabace.handleUrlParam("/platform/resmanage/db/data-user-select");
		bi.dialog.show({
			title: sabace.getMessage('report.tpl.userSelect'),
			message: jQuery('<div id="tplUserList"></div>').load(url),
			spinicon:'glyphicon glyphicon-refresh',
			cssClass: 'tpl-userList',
			onshown:function(dialog){
				// "1"为数据源赋权 "2"为数据分享 "3"为可视化模板分享
				userSelect.init("3",tplId);
			},
			buttons:[{
		   		label: sabace.getMessage('report.tpl.sure'),
		   		cssClass: 'btn-info',
		   		action: function(dialog){
		   			userSelect.saveUserSelect();
				}
			},{
				label: sabace.getMessage('report.tpl.cancel'),
				cssClass: 'btn-default',
				action: function(dialog) {
					dialog.close();
				}
			}
		   ]
		});
	}
	
	// 放大图
	function enlargeTpl(){
		// 打开放大图查看
		var thumbImg = jQuery(this).css("background-image");
		thumbImg = thumbImg.replace('url(','').replace(')','')
		var formTemp = jQuery("<form></form>",{
			"method":"post",
			"action": sabace.handleUrlParam('/platform/myreport/tpl/report-tpl-view'),
			"target": "_blank",
			"html": "<input name='thumbImg' value='" + thumbImg + "'/>"
		});
		jQuery('body').append(formTemp);
		formTemp.submit();
		jQuery(formTemp).remove();
	}
	
	// 引用报表
	function quoteReportTpl(){
		// 获取模板类型
		var tplType = jQuery(this).parent().parent().attr("tplType");
		if(tplType == "1"){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('report.tpl.tipTitle'),
				message: sabace.getMessage('report.tpl.canNotQuote')
			});
			return false;
		}
		// 获取模板编码
		var tplId = jQuery(this).parent().parent().attr("tplId");
		var formTemp = jQuery("<form></form>",{
			"method":"post",
			"action": sabace.handleUrlParam('/platform/dataview/create'),
			"target": "_blank",
			"html": "<input name='tplId' value='" + tplId + "'/>"
		});
		jQuery('body').append(formTemp);
		formTemp.submit();
		jQuery(formTemp).remove();
	}
});