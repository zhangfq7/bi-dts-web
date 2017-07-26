define(['sabace', 'chosen'], function(sabace, dialog, chosen) {
	
	// 评论对象
	var comment = {};
	// 页码
	var pageNum = 1;
	// 每页15条
	var pageSize = 15;
	// 记忆当前是哪种方式查询， 0即为全部，1即为点击星星查询,2即为按时间或推荐字数查询
	var queryType = 0;
	// 是否已经清空过了
	var clearFlag = false;
	
	jQuery(function() {
		jQuery('#reportId').val(reportId);
		// 获取评论记录
		getCommentList();
		// 下拉框初始化
		jQuery('.chosen-select').chosen();
		// 星星点击设置分值方法
		jQuery('.my-comment').on('click','#myStar span', clickStar);
		// 文本框清空提示信息
		jQuery('#commentContent').on("focus", clearTip);
		// 提交方法
		jQuery('#commentSubmit').on("click", commentSubmit);
		// 删除评论
		jQuery('#delComment').on("click", delComment);
		// 修改评论
		jQuery('#editComment').on("click", editComment);
		// 评论信息中的点赞
		jQuery('.commemt-list').on("click", '#commentList #listContentLike', likeForList);
		// 星级点击查询
		jQuery('#radioSelect div').on("click", clickRadio);
		// 星级点击查询(radio)
		jQuery('#radioSelect div').on("click", queryCommentByStar);
		// 排序切换点击查询(select)
		jQuery('#orderSelect').on("change", queryCommentByOrder);
		// 修改评论取消
		jQuery('#commentEditCancel').on("click", editCommentCancel);
		// 修改评论确定
		jQuery('#commentEditSubmit').on("click", editCommentSubmit);
		// 点击评论
		jQuery('#comment').on("click", replyComment);
		// 评论列表点击评论
		jQuery('.commemt-list').on("click", '#commentList #listReplyComment', replyCommentForList);
		// 自己评论中回复
		jQuery('.my-tools').on("click", '#replyBtn', clickReply);
		// 评论列表中的回复
		jQuery('#commentList').on("click", '#replyBtn', clickListReply);
		// 我的评论中追评中的我的回复
		jQuery('.my-tools').on("click", '#appendComment', appendComment);
		// 评论列表追评中的我的回复
		jQuery('.commemt-list').on("click", '#appendComment', appendCommentForList);
		// 自己评论中追评的回复
		jQuery('.my-tools').on("click", '#myReplyBtn', clickMyReply);
		// 评论列表中追评的回复
		jQuery('#commentList').on("click", '#myReplyBtn', clickMyListReply);
		// 删除我的评论下追评
		jQuery('.main-comment-panel').on("click", '#delAppComment', delAppComment);
		// 自己的追评可以删除
		showDelete();
		// 点击更多
		jQuery('#moreComment').on("click", clickMore);
		// 设置星星
		setStar();
	});

	// 自己的追评自己可以删除
	function showDelete(){
		// 鼠标出现删除
		jQuery('.my-tools').on("mouseover mouseout", '.append-comment', function (event){
			if(event.type == "mouseover"){
				var curUserId = jQuery('#curUserId').val();
				var appendUserId = jQuery(this).find('#appendUserId').text();
				if(curUserId == appendUserId){
					jQuery(this).find('#delAppComment').removeClass('hide');
				}
			}else if(event.type == "mouseout"){
				jQuery(this).find('#delAppComment').addClass('hide');
			}
		});
		jQuery('.commemt-list').on("mouseover mouseout", '#commentList .append-comment', function (event){
			if(event.type == "mouseover"){
				var curUserId = jQuery('#curUserId').val();
				var appendUserId = jQuery(this).find('#appendUserId').text();
				if(curUserId == appendUserId){
					jQuery(this).find('#delAppComment').removeClass('hide');
				}
			}else if(event.type == "mouseout"){
				jQuery(this).find('#delAppComment').addClass('hide');
			}
		});
	}
	
	// 设置星星
	function setStar(){
		// 星星点击设置分值方法
		jQuery('.my-comment').on('mouseover','#myStar span', function(){
			var curIndex = jQuery(this).attr("id");
			var index = null;
			jQuery('#myStar span').each(function(){
				if(jQuery(this).hasClass('red-star')){
					jQuery(this).removeClass("red-star");
					jQuery(this).addClass("white-star");
				}
				index = jQuery(this).attr("id");
				if(index <= curIndex ){
					jQuery(this).removeClass("white-star");
					jQuery(this).addClass("red-star");
				}
			});
		});
		// 点亮星星
		jQuery("#myStar").hover(null,
			// 移出
	    	function() {
				var index = null;
				jQuery('#myStar span').each(function(){
					if(typeof(comment.score) == "undefined" || comment.score == "" || comment.score == 0){
						if(jQuery(this).hasClass('red-star')){
							jQuery(this).removeClass("red-star");
							jQuery(this).addClass("white-star");
						}
					}else{
						index = jQuery(this).attr("id");
						if(index <= comment.score ){
							jQuery(this).removeClass("white-star");
							jQuery(this).addClass("red-star");
						}else{
							jQuery(this).removeClass("red-star");
							jQuery(this).addClass("white-star");
						}
					}
				});
	    	}
		);
	}
	
	// 获取评论记录
	function getCommentList(){
		// 我的评论loading框
		jQuery(".commemt-list .list-load").toggle();
		queryType = 0;
		pageNum = 1;
		// 发送请求到后台查询评论信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/comment/comment-query-list"),
			data: {
				reportId: reportId,
				pageNum: pageNum,
				pageSize: pageSize
			},
			success: function(req) {
				jQuery(".commemt-list .list-load").toggle();
				if (req.resFlag == "success") {
					// 先隐藏点击更多和已经到底了
					hideBottom();
					// 查询成功后展示自己已评论信息
					showSelfComment(req.curUserComment);
					jQuery('#curUserId').val(req.curUserId);
					// 判断是否有评论记录
					if(req.commentList.total > 0){
						// 判断是否需要点击更多
						if(req.commentList.totalPages > 1){
							jQuery('#moreComment').removeClass('hide');
						}
						// 查询成功后展示评论列表
						queryCommentSuccess(req.commentList.rows,req.starCounts);
					}else{
						// 查询数据为空时展示
						showZeroComment();
					}
					hideScroll();
				} else {
					// 查询成功后展示自己已评论信息
					showSelfComment(null);
					// 查询数据为空时展示
					showZeroComment();
					return false;
				}
			},
			error: function(req) {
				jQuery(".commemt-list .list-load").toggle();
				// 查询成功后展示自己已评论信息
				showSelfComment(null);
				// 查询数据为空时展示
				showZeroComment();
				return false;
			}
		});
	}
	
	// 展示自己已评论信息
	function showSelfComment(curUserComment){
		if(curUserComment != null){
			// 设置评论id
			jQuery('#commentId').val(curUserComment.commentId);
			// 设置评论用户
			jQuery('#userId').val(curUserComment.commentUser);
			// 设置评论用户名称
			jQuery('#userName').val(curUserComment.commentUserName);
			// 根据评分设置点亮星星html
			var star = getStar(curUserComment.score);
			comment.score = curUserComment.score;
			jQuery("#myStar").append(star);
			// 展示评论
			jQuery("#commentContent").removeClass('hide').html(curUserComment.commentContent).removeClass('comment-content');
			jQuery("#commentContent").addClass('comment-content-show');
			// 展现评论时间
			jQuery('#contentTime').html(curUserComment.commentTime);
			// 展示工具
			jQuery(".my-tools").removeClass('hide');
			// 赞数量
			jQuery('#likeCount').html(curUserComment.likeCount);
			
			// 拼装追评信息
			var appendList = curUserComment.appendList;
			showMyAppendList(appendList);
		}else{
			// 根据评分设置点亮星星html
			var star = getStar(0);
			jQuery("#myStar").append(star);
			jQuery("#commentSubmit").removeClass('hide');
			jQuery("#commentContent").removeClass('hide');
			jQuery("#commentContent").prop("contenteditable", true);
		}
	}
	
	// 没有评论信息时展示
	function showZeroComment(){
		jQuery("#commentList").removeClass('hide');
		jQuery("#commentList").empty();
		var html = '<div class="zero-comment">空空如也~  还不快来坐沙发~</div>';
		jQuery("#commentList").append(html);
	}
	
	// 没有查询到符合条件数据
	function showNoDataComment(){
		jQuery("#commentList").removeClass('hide');
		jQuery("#commentList").empty();
		var html = '<div class="zero-comment">没有符合条件的评论~</div>';
		jQuery("#commentList").append(html);
	}
	
	// 获取星星html
	function getStar(score){
		var html = '';
		for(var i = 1; i < 6; i++){
			if(score == 0){
				html += '<span id="' + i + '" class="white-star"></span>';
			}else {
				if(score >= i){
					html += '<span id="' + i + '" class="red-star"></span>';
				}else{
					html += '<span id="' + i + '" class="white-star"></span>';
				}
			}
		}
		return html;
	}
	
	// 点击星星评分事件
	function clickStar(){
		comment.score = jQuery(this).attr("id");
	}
	
	// 获取字段真实长度，一个中文字符占3位
	function getLength(value) {
		// 判断长度
		var realLength = 0;
		var len = value.length;
		var charCode = -1;
		for (var i = 0; i < len; i++) {
			charCode = value.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) realLength += 1;
			else realLength += 3;
		}
		return realLength;
	}
	
	// 评论提交事件
	function commentSubmit(){
		// 判断是否评分
		if(comment.score == null){
			showAlert({'title':"提示",'content':"请设置评分!"});
			return false;
		}
		// 获取我的评论
		comment.commentContent = jQuery.trim(jQuery("#commentContent").text());
		// 判断评论信息
		if(comment.commentContent == "" || comment.commentContent == "写下评价吧..."){
			showAlert({'title':"提示",'content':"请输入评价!"});
			return false;
		}
		var realLength = getLength(comment.commentContent);
		if(realLength > 900){
			showAlert({'title':"提示",'content':"您输入的评价长度不能超过900位,一个中文占3位!"});
			return false;
		}
		comment.reportId = jQuery('#reportId').val();
		var orderVal = jQuery('#orderSelect').val();
		var scoreValue = jQuery('#radioSelect .checked').attr("id");
		// 请求后台传递参数
		var commentParams = {
			reportId: comment.reportId,
			commentContent: comment.commentContent,
			score: comment.score,
			orderVal: orderVal,
			scoreValue: scoreValue
		}
		// 我的评论loading框
		jQuery(".my-comment .add-load").toggle();
		jQuery('#commentSubmit').css("background-color","#bdc3c7");
		// 发送请求到后台保存评论信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/comment/report-comment-save"),
			data: commentParams,
			success: function(req) {
				// 我的评论loading框
				jQuery(".my-comment .add-load").toggle();
				jQuery('#commentSubmit').css("background-color","#027EBE");
				if (req.resFlag == "success") {
					// 先隐藏点击更多和已经到底了
					hideBottom();
					//  保存评论信息成功
					saveCommentSuccess(req.reportCommentBean);
					// 判断是否需要点击更多
					if(req.commentList.totalPages > 1){
						jQuery('#moreComment').removeClass('hide');
					}
					// 查询成功后展示评论列表
					queryCommentSuccess(req.commentList.rows,req.starCounts);
					hideScroll();
				} else {
					return false;
				}
			},
			error: function(req) {
				jQuery(".my-comment .add-load").toggle();
				jQuery('#commentSubmit').css("background-color","#027EBE");
				return false;
			}
		});
	}
	
	// 保存评论信息成功
	function saveCommentSuccess(curUserComment){
		// 设置评论id
		jQuery('#commentId').val(curUserComment.commentId);
		// 设置评论用户
		jQuery('#userId').val(curUserComment.commentUser);
		// 设置评论用户名称
		jQuery('#userName').val(curUserComment.commentUserName);
		// 屏蔽提交按钮
		jQuery('#commentSubmit').addClass('hide');
		// 展示评论
		jQuery("#commentContent").removeClass('hide').html(curUserComment.commentContent).removeClass('comment-content');
		jQuery("#commentContent").addClass('comment-content-show');
		// 展现评论时间
		jQuery('#contentTime').html(curUserComment.commentTime);
		// 展示工具
		jQuery(".my-tools").removeClass('hide');
		// 赞数量
		jQuery('#likeCount').html(curUserComment.likeCount);
		jQuery("#commentContent").prop("contenteditable", false);
	}
	
	// 删除评论
	function delComment(){
		showConfirm({'title': "提示",'content':"您确定需要删除此评论?"},function(){
			// 获取评论编码
			var commentId = jQuery('#commentId').val();
			var orderVal = jQuery('#orderSelect').val();
			var scoreValue = jQuery('#radioSelect .checked').attr("id");
			jQuery(".commemt-list .list-load").toggle();
			// 发送请求到后台删除评论信息
			sabace.ajax({
				url: sabace.handleUrlParam("/platform/myreport/comment/report-comment-del"),
				data: {
					commentId: commentId,
					reportId: reportId,
					orderVal: orderVal,
					scoreValue: scoreValue
				},
				success: function(req) {
					jQuery(".commemt-list .list-load").toggle();
					if (req.resFlag == "success") {
						// 先隐藏点击更多和已经到底了
						hideBottom();
						// 删除评论信息成功
						delCommentSuccess();
						// 判断是否有评论记录
						if(req.commentList.total > 0){
							// 判断是否需要点击更多
							if(req.commentList.totalPages > 1){
								jQuery('#moreComment').removeClass('hide');
							}
							// 查询成功后展示评论列表
							queryCommentSuccess(req.commentList.rows,req.starCounts);
						}else{
							// 各星级总数
							jQuery('#allStarCount').text(req.starCounts.allStarCount);
							jQuery('#fiveStarCount').text(req.starCounts.fiveStarCount);
							jQuery('#fourStarCount').text(req.starCounts.fourStarCount);
							jQuery('#threeStarCount').text(req.starCounts.threeStarCount);
							jQuery('#twoStarCount').text(req.starCounts.twoStarCount);
							jQuery('#oneStarCount').text(req.starCounts.oneStarCount);
							jQuery("#commentList").removeClass('hide');
							jQuery("#commentList").empty();
							if(req.starCounts.allStarCount == 0){
								// 没有数据
								showZeroComment();
							}else{
								// 查询数据为空时展示
								showNoDataComment();
							}
						}
						hideScroll();
					} else {
						jQuery(".commemt-list .list-load").toggle();
						return false;
					}
				},
				error: function(req) {
					jQuery(".commemt-list .list-load").toggle();
					return false;
				}
			});
		});
	}
	
	// 删除评论信息成功
	function delCommentSuccess(){
		// 展示空心星星
		jQuery('#myStar span').each(function(){
			if(jQuery(this).hasClass('red-star')){
				jQuery(this).removeClass("red-star");
				jQuery(this).addClass("white-star");
			}
		});
		// 展示提交按钮
		jQuery('#commentSubmit').removeClass('hide');
		// 展示文本框
		jQuery('#commentContent').html("写下评价吧...").removeClass('comment-content-show').addClass('comment-content').css('color',' #919191');
		// 隐藏工具部分
		jQuery('.my-tools').addClass("hide");
		jQuery('#commentContent').removeClass('not-clearTip');
		jQuery("#commentContent").prop("contenteditable", true);
		jQuery(".my-tools .append-comment").remove();
	}
	
	// 修改评论
	function editComment(){
		// 将页面中所有的回复移除
		jQuery('.reply-comment').remove();
		// 展示文本框
		jQuery('#commentContent').removeClass('comment-content-show').addClass('comment-content');
		jQuery('.my-tools').addClass("hide");
		jQuery('.my-tools-edit').removeClass("hide");
		jQuery('#commentContent').addClass('not-clearTip');
		jQuery("#commentContent").prop("contenteditable", true);
	}
	
	// 修改评论取消
	function editCommentCancel(){
		// 获取评论编码
		var commentId = jQuery('#commentId').val();
		jQuery(".my-comment .cancel-load").toggle();
		// 向后台请求获取修改前的评论信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/comment/comment-info"),
			data: {
				commentId: commentId
			},
			success: function(req) {
				jQuery(".my-comment .cancel-load").toggle();
				if (req.resFlag == "success") {
					editCommentCancelSuccess(req.comment);
				} else {
					return false;
				}
			},
			error: function(req) {
				jQuery(".my-comment .cancel-load").toggle();
				return false;
			}
		});
	}
	
	// 还原修改前的评论信息
	function editCommentCancelSuccess(curComment){
		// 屏蔽取消提交按钮
		jQuery('.my-tools-edit').addClass('hide');
		// 还原原始分数
		comment.score = curComment.score;
		// 还原评论内容
		var content = curComment.commentContent;
		// 展示评论
		jQuery("#commentContent").removeClass('hide').html(content).removeClass('comment-content');
		jQuery("#commentContent").addClass('comment-content-show');
		// 展示工具
		jQuery(".my-tools").removeClass('hide');
		// 赞数量
		var likeCount = curComment.likeCount;
		jQuery('#likeCount').html(likeCount);
		jQuery("#commentContent").prop("contenteditable", false);
	}
	
	// 修改评论提交
	function editCommentSubmit(){
		// 获取评论编码
		var commentId = jQuery('#commentId').val();
		// 获取评论内容
		var commentContent = jQuery('#commentContent').text();
		// 判断评论信息
		if(commentContent == ""){
			showAlert({'title':"提示",'content':"请输入评价!"});
			return false;
		}
		var realLength = getLength(commentContent);
		if(realLength > 900){
			showAlert({'title':"提示",'content':"您输入的评价长度不能超过900位,一个中文占3位!"});
			return false;
		}		
		var orderVal = jQuery('#orderSelect').val();
		var scoreValue = jQuery('#radioSelect .checked').attr("id");
		var reportId = jQuery('#reportId').val();
		jQuery(".my-comment .edit-load").toggle();
		jQuery('#commentEditSubmit').css("background-color","#bdc3c7");
		// 发送请求到后台删除评论信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/comment/comment-edit-save"),
			data: {
				reportId: reportId,
				commentId: commentId,
				score: comment.score,
				commentContent: commentContent,
				orderVal: orderVal,
				scoreValue: scoreValue
			},
			success: function(req) {
				jQuery('#commentEditSubmit').css("background-color","#027EBE");
				jQuery(".my-comment .edit-load").toggle();
				if (req.resFlag == "success") {
					// 先隐藏点击更多和已经到底了
					hideBottom();
					// 修改评论信息成功
					saveEditReportCommentSuccess(req.comment);
					// 判断是否需要点击更多
					if(req.commentList.totalPages > 1){
						jQuery('#moreComment').removeClass('hide');
					}
					// 查询成功后展示评论列表
					queryCommentSuccess(req.commentList.rows,req.starCounts);
					hideScroll();
				} else {
					return false;
				}
			},
			error: function(req) {
			    jQuery('#commentEditSubmit').css("background-color","#027EBE");
				jQuery(".my-comment .edit-load").toggle();
				return false;
			}
		});
	}
	
	// 修改信息评论信息成功
	function saveEditReportCommentSuccess(curComment){
		// 屏蔽取消提交按钮
		jQuery('.my-tools-edit').addClass('hide');
		// 设置评论内容
		var content = curComment.curComment;
		// 展示评论
		jQuery("#commentContent").removeClass('hide').html(content).removeClass('comment-content');
		jQuery("#commentContent").addClass('comment-content-show');
		// 展示工具
		jQuery(".my-tools").removeClass('hide');
		// 赞数量
		var likeCount = curComment.likeCount;
		jQuery('#likeCount').html(likeCount);
		jQuery("#commentContent").prop("contenteditable", false);
	}
	
	// 星级点击查询
	function clickRadio(){
		// 将所有的radio都置为空
		jQuery('#radioSelect div .radio-ico').each(function(){
			// 清除颜色
			jQuery(this).parent().removeClass('radio-span-color');
			jQuery(this).parent().removeClass("checked");
			if(jQuery(this).hasClass("radio-select-icon")){
				jQuery(this).addClass("radio-not-select-icon");
			}
		});
		jQuery(this).find('.radio-ico').removeClass("radio-not-select-icon");
		jQuery(this).find('.radio-ico').addClass("radio-select-icon");
		// 颜色
		jQuery(this).addClass('radio-span-color');
		jQuery(this).addClass('checked');
	}
	
	// 文本框清空提示信息
	function clearTip(){
		if(!clearFlag){
			if(!jQuery(this).hasClass('not-clearTip')){
				jQuery(this).html("");
				jQuery(this).css('color','black');
			}
		}
		clearFlag = true;
	}
	
	// 获取回复评论的html
	function getReplyCommentHtml(appendToName){ 
		var html = '';
		html += '<div class="reply-comment">';
		html += '  <div id="replyContent" contenteditable="true" class="reply-content f13">';
		html += '  	  <div class="reply-Touser" contenteditable="false">回复<span class="reply-Touser-span""> ' + appendToName + '</span> : </div>';
		html += '  </div>';
		html += '  <div id="replyBtn" class="button reply-button f13">回复';
		html += '    <div class="reply-load">';
	    html += '      <img class="loading" src="data:image/png;base64,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">';
	    html += '    </div>';
		html +=	'  </div>';
		html += '</div>';
		return html;
	}
	
	// 回复评论信息
	function replyComment(){
		// 将页面中所有的回复移除
		jQuery('.reply-comment').remove();
		if(!jQuery('.my-tools .reply-comment').is(':visible')){
			var appendToName = jQuery('#userName').val();
			jQuery('.my-tools .comment-dashed').after(getReplyCommentHtml(appendToName));
		};
		hideScroll();
	}
	
	// 星级点击查询(radio)
	function queryCommentByStar(){
		queryType = 1;
		pageNum = 1;
		// 获取点击的星级数
		var score = jQuery(this).attr("id");
		var orderVal = jQuery('#orderSelect').val();
		jQuery(".commemt-list .list-load").toggle();
		jQuery('.commemt-list').addClass('comment-shade');
		// 发送请求到后台查询评论信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/comment/comment-query-score"),
			data: {
				reportId: reportId,
				score: score,
				orderVal: orderVal,
				pageNum: pageNum,
				pageSize: pageSize
			},
			success: function(req) {
				jQuery(".commemt-list .list-load").toggle();
				jQuery('.commemt-list').removeClass('comment-shade');
				if (req.resFlag == "success") {
					// 先隐藏点击更多和已经到底了
					hideBottom();
					// 判断是否有评论记录
					if(req.commentList.total > 0){
						// 判断是否需要点击更多
						if(req.commentList.totalPages > 1){
							jQuery('#moreComment').removeClass('hide');
						}
						// 查询成功后展示评论列表
						queryCommentSuccess(req.commentList.rows,req.starCounts);
					}else{
						// 查询数据为空时展示
						showNoDataComment();
					}
					hideScroll();
				} else {
					return false;
				}
			},
			error: function(req) {
				jQuery(".commemt-list .list-load").toggle();
				jQuery('.commemt-list').removeClass('comment-shade');
				return false;
			}
		});
	}
	
	// 排序点击切换查询
	function queryCommentByOrder(){
		queryType = 2;
		pageNum = 1;
		// 获取切换的条件
		var orderVal = jQuery(this).val();
		var score = jQuery('#radioSelect .checked').attr("id");
		jQuery(".commemt-list .list-load").toggle();
		jQuery('.commemt-list').addClass('comment-shade');
		// 发送请求到后台查询评论信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/comment/comment-query-order"),
			data: {
				reportId: reportId,
				orderVal: orderVal,
				score: score,
				pageNum: pageNum,
				pageSize: pageSize
			},
			success: function(req) {
				jQuery(".commemt-list .list-load").toggle();
				jQuery('.commemt-list').removeClass('comment-shade');
				if (req.resFlag == "success") {
					// 先隐藏点击更多和已经到底了
					hideBottom();
					// 判断是否有评论记录
					if(req.commentList.total > 0){
						// 判断是否需要点击更多
						if(req.commentList.totalPages > 1){
							jQuery('#moreComment').removeClass('hide');
						}
						// 查询成功后展示评论列表
						queryCommentSuccess(req.commentList.rows,req.starCounts);
					}else{
						// 查询数据为空时展示
						showNoDataComment();
					}
					hideScroll();
				} else {
					return false;
				}
			},
			error: function(req) {
				jQuery(".commemt-list .list-load").toggle();
				jQuery('.commemt-list').removeClass('comment-shade');
				return false;
			}
		});
	}
	
	// 查询评论列表成功
	function queryCommentSuccess(commentList,starCounts){
		// 各星级总数
		jQuery('#allStarCount').text(starCounts.allStarCount);
		jQuery('#fiveStarCount').text(starCounts.fiveStarCount);
		jQuery('#fourStarCount').text(starCounts.fourStarCount);
		jQuery('#threeStarCount').text(starCounts.threeStarCount);
		jQuery('#twoStarCount').text(starCounts.twoStarCount);
		jQuery('#oneStarCount').text(starCounts.oneStarCount);
		jQuery("#commentList").removeClass('hide');
		jQuery("#commentList").empty();
		var commentObject = null;
		var _html = null;
		for(var i = 0; i < commentList.length; i++){
			commentObject = commentList[i];
			_html = getComment(commentObject);
			jQuery("#commentList").append(_html);
		}
	}

	// 展示得分星星
	function showStar(score){
		var star = "";
		for(var i=0; i<5;i++){
			if(i < score){
				star += '<span class="star red-star"></span>';
			}else{
				star += '<span class="star white-star"></span>';
			}
		}
		return star;
	}
	
	// 拼接单条评论信息
	function getComment(commentObject){
		var userName = commentObject.commentUserName;
		var commentId = commentObject.commentId;
		var score = commentObject.score;
		var content = commentObject.commentContent;
		var time = commentObject.commentTime;
		var likeCount = commentObject.likeCount;
		var userId = commentObject.commentUser;
		var appendList = commentObject.appendList;
		var appendHtml = '';
		var imgUrl = sabace.handleUrlParam("/platform/myreport/comment/comment-user-img");
		imgUrl = imgUrl + "?t=" + new Date() + "&userId=" + userId;
		var html = '';
		html += '<li>';
		html += '	<div class="user-info">';
		html += '		<img src="' + imgUrl + '" />';
		html += '		<span class="user-span f12" id="userName" title="' + userName + '">' + userName +'</span>';
		html += '   </div>';
		html += '   <div class="comment-info" id=' + commentId + '>'; 
		html += '		<span id="userId" class="hide">' + userId + '</span>';
		html += '       <div class="comment-star-show">';
		html += 			showStar(score);
		html += '       </div>';
		html += '   	<div contenteditable="false" class="comment-info-content f13">' + content + '</div>';
		html += '   	<span class="comment-info-time f12">' + time + '</span>';
		html += '  		<span id="listReplyComment" class="comment-icon comment-info-icon" title="评论"></span>';
		html += '   	<span id="listContentLike" class="comment-info-like f12">赞(<span id="listLike">' + likeCount + '</span>)</span>';
		if(appendList.length > 0){
			html += '   <div class="comment-dashed dashed"></div>';
			for(var i = 0; i < appendList.length; i++){
				appendHtml += getAppendHtml(appendList[i]);
			}
			html += appendHtml;
		}else{
			html += '   <div class="comment-dashed dashed hide"></div>';
		}
		html += '   </div>'; 
		html += '   <div class="comment-dashed"></div>';
		html += '</li>';
		return html;
	}
	
	// 评论记录点赞
	function likeForList(){
		var commentId = jQuery(this).parent().attr("id");
		var curCommentId = jQuery("#commentId").val();
		// 发送请求到后台保存点赞信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/comment/comment-like-save"),
			data: {
				commentId: commentId
			},
			success: function(req) {
				if (req.resFlag == "success") {
					jQuery("#" + commentId + " #listLike").text(req.likeCount);
					if(commentId == curCommentId){
						jQuery("#contentLike #likeCount").text(req.likeCount);
					}
				} else if(req.resFlag == "hasLike"){
					showAlert({'title':"提示",'content':"您已赞过该评论!"});
					return false;
				} else {
					return false;
				}
			},
			error: function(req) {
				return false;
			}
		});
	}
	
	// 评论信息中回复
	function replyCommentForList(){
		// 将页面中所有的回复移除
		jQuery('.reply-comment').remove();
		if(!jQuery(this).parent().find('#replyContent').is(':visible')){
			var appendToName = jQuery(this).parent().parent().find('#userName').text();
			var html = getReplyCommentHtml(appendToName);
			var commentId = jQuery(this).parent().attr('id');
			// 判断追评的虚线是否显示
			if(!jQuery("#" + commentId + " .dashed").is(':visible')){
				jQuery("#" + commentId + " .dashed").removeClass('hide');
			}
			jQuery(this).next().next().after(html);
		}
		hideScroll();		
	}
	
	// 点击回复事件
	function clickReply(){
		var commentId = jQuery('#commentId').val();
		var userId = jQuery('#userId').val();
		var replyContent = jQuery.trim(jQuery('.my-tools #replyContent').text());
		replyContent = replyContent.substr(replyContent.indexOf(':') + 2, replyContent.length);
		// 判断评论信息
		if(replyContent == ""){
			showAlert({'title':"提示",'content':"请输入回复内容!"});
			return false;
		}
		var realLength = getLength(replyContent);
		if(realLength > 900){
			showAlert({'title':"提示",'content':"您输入的回复内容长度不能超过900位,一个中文占3位!"});
			return false;
		}
		saveReplyInfo(commentId, userId, replyContent, "1");
	}
	
	// 点击评论列表中的回复
	function clickListReply(){
		var commentId = jQuery(this).parent().parent().attr('id');
		var userId = jQuery(this).parent().parent().find('#userId').text();
		var replyContent = jQuery.trim(jQuery(this).parent().find('#replyContent').text());
		replyContent = replyContent.substr(replyContent.indexOf(':') + 2, replyContent.length);
		// 判断评论信息
		if(replyContent == ""){
			showAlert({'title':"提示",'content':"请输入回复内容!"});
			return false;
		}
		var realLength = getLength(replyContent);
		if(realLength > 900){
			showAlert({'title':"提示",'content':"您输入的回复内容长度不能超过900位,一个中文占3位!"});
			return false;
		}
		saveReplyInfo(commentId, userId, replyContent, "2");
	}
	
	// 保存回复信息
	function saveReplyInfo(commentId, userId, replyContent, type){
		var curCommentId = jQuery('#commentId').val();
		if("1" == type){
			jQuery('.my-tools #replyBtn').css("background-color","#bdc3c7");
			jQuery('.my-tools .reply-load').toggle();
		}else if("2" == type){
			jQuery("#" + commentId + ' #replyBtn').css("background-color","#bdc3c7");
			jQuery("#" + commentId + ' .reply-load').toggle();
		}else if("3" == type){
			jQuery('.my-tools #myReplyBtn').css("background-color","#bdc3c7");
			jQuery('.my-tools .reply-load').toggle();
		}else if("4" == type){
			jQuery("#" + commentId + ' #MyReplyBtn').css("background-color","#bdc3c7");
			jQuery("#" + commentId + ' .reply-load').toggle();
		}
		// 发送请求到后台保存回复信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/myreport/comment/report-comment-reply"),
			data: {
				commentId: commentId,
				appendToUser: userId,
				appendContent: replyContent
			},
			success: function(req) {
				if("1" == type){
					jQuery('.my-tools #replyBtn').css("background-color","#027EBE");
					jQuery('.my-tools .reply-load').toggle();
				}else if("2" == type){
					jQuery("#" + commentId + ' #replyBtn').css("background-color","#027EBE");
					jQuery("#" + commentId + ' .reply-load').toggle();
				}else if("3" == type){
					jQuery('.my-tools #MyReplyBtn').css("background-color","#027EBE");
					jQuery('.my-tools .reply-load').toggle();
				}else if("4" == type){
					jQuery("#" + commentId + ' #MyReplyBtn').css("background-color","#027EBE");
					jQuery("#" + commentId + ' .reply-load').toggle();
				}
				if (req.resFlag == "success") {
					if("1" == type || "3" == type){
						// 上方自己的评论
						showMyAppendList(req.appendList);
						if(curCommentId == commentId){
							// 下方评论列表
							saveReplyInfoSuccessForList(req.appendList,req.commentId);
						}
					}else{
						if(curCommentId == commentId){
							// 上方自己的评论
							showMyAppendList(req.appendList);
						}
						// 下方评论列表
						saveReplyInfoSuccessForList(req.appendList,req.commentId);
					}
				} else {
					return false;
				}
				hideScroll();
			},
			error: function(req) {
				if("1" == type){
					jQuery('.my-tools #replyBtn').css("background-color","#027EBE");
					jQuery('.my-tools .reply-load').toggle();
				}else{
					jQuery("#" + commentId + ' #replyBtn').css("background-color","#027EBE");
					jQuery("#" + commentId + ' .reply-load').toggle();
				}
				return false;
			}
		});
	}
	
	// 获取追评html
	function getAppendHtml(appendInfo){
		var appendId = appendInfo.appendId;
		var appendTime = appendInfo.appendTime;
		var appendContent = appendInfo.appendContent;
		var appendUser = appendInfo.appendUser;
		var appendToUser = appendInfo.appendToUser;
		var appendUserName = appendInfo.appendUserName;
		var appendToUserName = appendInfo.appendToUserName;
		var html = '';
		html += '<div class="append-comment" id=' + appendId + '>';
		html += '   <div id="appendContent" class="append-content f12">';
		html += '       <span id="appendUserId" class="hide">' + appendUser + '</span>';
		html += '       <span id="appendUserName" class="hide">' + appendInfo.appendUserName + '</span>';
		html += 		appendUserName + '<span class="append-reply-span">回复</span>' + appendToUserName + ' : ';
		html += '       <span>' + appendContent + '<span>';
		html += '   </div>'
		html += '	<div class="append-tools">';
		html += '		<span id="appendTime" class="append-time f12">' + appendTime + '</span>';
		html += '		<span id="appendComment" class="comment-icon append-info-icon" title="评论"></span>';
		html += '   	<span id="delAppComment" class="del-icon append-info-icon del-append-icon hide" title="删除"></span>';
		html += '	</div>';
		html += '</div>';
		return html;
	}
	
	// 我的评论的追评展示
	function showMyAppendList(appendList){
		// 隐藏回复
		jQuery('.my-tools .reply-comment').addClass('hide');
		// 去除之前的追评信息
		jQuery('.my-tools .append-comment').remove();
		jQuery('.my-tools #replyContent').text("");
		var html = '';
		if(appendList.length > 0){
			for(var i = 0; i < appendList.length; i++){
				html += getAppendHtml(appendList[i]);
			}
			jQuery('.my-tools').append(html);
		}
	}
	
	// 评论列表中追评信息
	function saveReplyInfoSuccessForList(appendList,commentId){
		// 隐藏回复
		jQuery("#" + commentId + " .reply-comment").addClass('hide');
		// 去除之前的追评信息
		jQuery("#" + commentId).find('.append-comment').remove();
		var html = '';
		if(appendList.length > 0){
			for(var i = 0; i < appendList.length; i++){
				html += getAppendHtml(appendList[i]);
			}
			// 判断追评的虚线是否显示
			if(!jQuery("#" + commentId + " .dashed").is(':visible')){
				jQuery("#" + commentId + " .dashed").removeClass('hide');
			}
			jQuery("#" + commentId).append(html);
		}
	}
	
	// 获取回复评论的html
	function getMyReplyCommentHtml(appendUserId,appendUserName){
		var html = '';
		html += '<div class="reply-comment">';
		html += '  <span id="appendUserId" class="hide">' + appendUserId + '</span>';
		html += '  <span id="appendUserName" class="hide">' + appendUserName + '</span>';
		html += '  <div id="replyContent" contenteditable="true" class="reply-content f12">';
		html += '  		<div class="reply-Touser" contenteditable="false">回复<span class="reply-Touser-span""> ' + appendUserName + '</span> : </div>';
		html += '  </div>';
		html += '  <div id="myReplyBtn" class="button reply-button f13">回复';
		html += '    <div class="reply-load">';
	    html += '     	 <img class="loading" src="data:image/png;base64,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">';
	    html += '    </div>';
		html +=	'  </div>';
		html += '</div>';
		return html;
	}
	
	// 追评中我的回复
	function appendComment(){
		if(!jQuery(this).parent().parent().find('#replyContent').is(':visible')){
			// 将页面中所有的回复移除
			jQuery('.reply-comment').remove();
			var appendUserId = jQuery(this).parent().parent().find("#appendUserId").text();
			var appendUserName = jQuery(this).parent().parent().find("#appendUserName").text();
			var html = getMyReplyCommentHtml(appendUserId,appendUserName);
			jQuery(this).parent().parent().after(html);
		}
	}
	
	// 追评中我的回复
	function appendCommentForList(){
		if(!jQuery(this).parent().parent().find('#replyContent').is(':visible')){
			// 将页面中所有的回复移除
			jQuery('.reply-comment').remove();
			var appendUserId = jQuery(this).parent().parent().find("#appendUserId").text();
			var appendUserName = jQuery(this).parent().parent().find("#appendUserName").text();
			var html = getMyReplyCommentHtml(appendUserId,appendUserName);
			jQuery(this).parent().parent().after(html);
		}
	}
	
	// 点击回复事件
	function clickMyReply(){
		var commentId = jQuery('#commentId').val();
		var userId = jQuery(this).parent().find("#appendUserId").text();
		var replyContent = jQuery.trim(jQuery(this).parent().find('#replyContent').text());
		replyContent = replyContent.substr(replyContent.indexOf(':') + 2, replyContent.length);
		// 判断评论信息
		if(replyContent == ""){
			showAlert({'title':"提示",'content':"请输入回复内容"});
			return false;
		}
		var realLength = getLength(replyContent);
		if(realLength > 900){
			showAlert({'title':"提示",'content':"您输入的回复内容长度不能超过900位,一个中文占3位!"});
			return false;
		}
		saveReplyInfo(commentId, userId, replyContent, "3");
	}
	
	// 点击评论列表中的回复
	function clickMyListReply(){
		var commentId = jQuery(this).parent().parent().attr('id');
		var userId = jQuery(this).parent().find("#appendUserId").text();
		var replyContent = jQuery.trim(jQuery(this).parent().find('#replyContent').text());
		replyContent = replyContent.substr(replyContent.indexOf(':') + 2, replyContent.length);
		// 判断评论信息
		if(replyContent == ""){
			showAlert({'title':"提示",'content':"请输入回复内容!"});
			return false;
		}
		var realLength = getLength(replyContent);
		if(realLength > 900){
			showAlert({'title':"提示",'content':"您输入的回复内容长度不能超过900位,一个中文占3位!"});
			return false;
		}
		saveReplyInfo(commentId, userId, replyContent, "4");
	}
	
	// 删除我的评论下追评信息
	function delAppComment(){
		var appendId = jQuery(this).parent().parent().attr("id");
		var commentId = jQuery(this).parent().parent().parent().attr("id");
		var curUserId = jQuery('#curUserId').val();
		var appendUserId = jQuery(this).parent().parent().find("#appendUserId").text();
		showConfirm({'title':"提示",'content':"您确定删除此追评？"},function(){
			// 发送请求到后台删除追评信息
			sabace.ajax({
				url: sabace.handleUrlParam("/platform/myreport/comment/comment-append-del"),
				data: {
					appendId: appendId
				},
				success: function(req) {
					if (req.resFlag == "success") {
						// 清除追加评论
						jQuery('#' + appendId).remove();
						if(curUserId == appendUserId){
							jQuery('#' + appendId).remove();
						}
						// 判断评论下面是否有追加了没有了则隐藏虚线
						if(jQuery('#' + commentId + ' .append-comment').length == 0){
							jQuery("#" + commentId + " .dashed").addClass('hide');
						}
					} else {
						return false;
					}
				},
				error: function(req) {
					return false;
				}
			});
			}
		);
	}
	
	// 点击更多
	function clickMore(){
		pageNum += 1;
		// 根据当前查询方式设置查询url和查询参数
		var url = null;
		var dataParams = null;
		if(queryType == 0){
			url = sabace.handleUrlParam("/platform/myreport/comment/comment-query-list");
			dataParams = {
				reportId: reportId,
				pageNum: pageNum,
				pageSize: pageSize
			}
		}else if(queryType == 1){
			// 获取点击的星级数
			var score = jQuery('#radioSelect .checked').attr("id");
			url = sabace.handleUrlParam("/platform/myreport/comment/comment-query-list");
			dataParams = {
				reportId: reportId,
				score: score,
				pageNum: pageNum,
				pageSize: pageSize
			}
		}else if(queryType == 2){
			// 获取切换的条件
			var orderVal = jQuery('#orderSelect').val();
			url = sabace.handleUrlParam("/platform/myreport/comment/comment-query-list");
			dataParams = {
				reportId: reportId,
				orderVal: orderVal,
				pageNum: pageNum,
				pageSize: pageSize
			}
		}
		jQuery(".commemt-list .list-load").toggle();
		jQuery('.commemt-list').addClass('comment-shade');
		// 发送请求到后台查询评论信息
		sabace.ajax({
			url: url,
			data: dataParams,
			success: function(req) {
				jQuery(".commemt-list .list-load").toggle();
				jQuery('.commemt-list').removeClass('comment-shade');
				if (req.resFlag == "success") {
					jQuery('#endComment').addClass('hide');
					// 判断是否需要有点击更多
					if(req.commentList.totalPages == pageNum){
						jQuery('#moreComment').addClass('hide');
						jQuery('#endComment').removeClass('hide');
					}
					queryMoreSuccess(req.commentList.rows);
					hideScroll();
				} else {
					return false;
				}
			},
			error: function(req) {
				jQuery(".commemt-list .list-load").toggle();
				jQuery('.commemt-list').removeClass('comment-shade');
				return false;
			}
		});
	}
	
	// 点击更多后展现更多评论
	function queryMoreSuccess(commentList){
		var commentObject = null;
		var _html = null;
		for(var i = 0; i < commentList.length; i++){
			commentObject = commentList[i];
			_html = getComment(commentObject);
			jQuery("#commentList").append(_html);
		}
	}
	
	// 先将点击更多和到底了设置成隐藏
	function hideBottom(){
		jQuery('#endComment').addClass('hide');
		jQuery('#moreComment').addClass('hide');
	}
	
	// 滚动条
	function hideScroll(){
		var mycomment = jQuery(".my-comment").height();
		var commentList =jQuery("#commentList").height();
		jQuery('#commentIframe', parent.document).css('height',mycomment+commentList+180);
	}
	
	//提示框的方法
	function showAlert(option){
		jQuery(".showAlert").remove();
		var alertOption = {
			'title' : '提示框',
			'content' : '您已评论成功！'
		}
		var alertSetting = $.extend(true, {}, alertOption, option);
		var panel = jQuery("<div>",{
			'css':{
				'class':'showpanel',
				'position':'fixed',
				'left':'0',
				'right':'0',
				'top':'0',
				'bottom':'0',
				'background':'black',
				'opacity':'.5'
			}
		})
		var alertDialog = jQuery("<div>",{
			'class': 'showAlert',
			'css'  : {
			   'width':'378px',
			   'height':'auto',
			   'min-height': '150px',
			   'background':'#fff',
			   'position':'absolute',
			   'left':'50%',
			   'top':'120px',
			   'margin-left':'-189px',
			   'z-index': '10002',
			   'box-shadow': '0 0 8px rgba(0,0,0,.1)',
		       'border': 'solid 1px #dcdcdc'
			}
		});
		jQuery("body").unbind('click').bind('click',function(){
			if(alertDialog.size()>0){
				alertDialog.remove();
			}
		})
		var showHead=jQuery("<div>",{
			'html' : alertSetting.title,
			'css'  : {
				'height':'44px',
				'width' :'100%',
				'border-bottom' : '2px solid #EEEEEE',
				'font-size':'16px',
				'padding' :'10px 17px',
				'position': 'absolute',
				'top' : '0'
			}
		})
		var showBody=jQuery("<div>",{
			'html' : alertSetting.content,
			'css'  : {
				'height':'44px',
				'width' :'100%',
				'font-size':'13px',
				'padding' :'10px 17px',
				'position': 'absolute',
				'top' : '46px',
				'bottom': '45px'
			}
		})
		var showButon = jQuery("<div>",{
			'html' : '确定',
			'css'  : {
				'border': '1px solid #4898d5',
		        'background': '#2e8ded',
		        'color': '#fff',
		        'font-size': '14px',
		        'letter-spacing': '1px',
				'height' : '30px',
				'width'  : '62px',
				'padding-top': '5px',
				'padding-left': '16px',
			    'position': 'absolute',
		        'right': '10px',
		        'cursor':'pointer',
				'border-radius': '4px'
			},
		   'onmouseover' : "this.style.background='#3092f5'",
		   'onmouseout' : "this.style.background='#2e8ded'"
		})
		showButon.bind("click",function(){
			panel.remove();
			alertDialog.remove();
		})
		var showFoot=jQuery("<div>",{
			'html' : showButon,
			'css'  : {
				'height':'45px',
				'width' :'100%',
				'position': 'absolute',
				'bottom': '0',
				'padding-top' : '7px'
			}
		})
		alertDialog.append(showHead).append(showBody).append(showFoot);
		$('body', parent.document).append(alertDialog).append(panel);
	}
	//框的方法
	function showConfirm(option,callback){
		jQuery(".showConfirm").remove();
		var alertOption = {
				'title' : '确认框',
				'content' : '确定删除此评论吗？'
		}
		var alertSetting = $.extend(true, {}, alertOption, option);
		var panel = jQuery("<div>",{
			'css':{
				'class':'showpanel',
				'position':'fixed',
				'left':'0',
				'right':'0',
				'top':'0',
				'bottom':'0',
				'background':'black',
				'opacity':'.5'
			}
		})
		var alertDialog = jQuery("<div>",{
			'class': 'showConfirm',
			'css'  : {
				'width':'378px',
				'height':'auto',
				'min-height': '136px',
				'background':'#fff',
				'position':'absolute',
				'left':'50%',
				'top':'120px',
				'margin-left':'-189px',
				'z-index': '10002',
				'box-shadow': '0 0 8px rgba(0,0,0,.1)',
				'border': 'solid 1px #dcdcdc'
			}
		});
		var showHead=jQuery("<div>",{
			'html' : alertSetting.title,
			'css'  : {
				'height':'44px',
				'width' :'100%',
				'border-bottom' : '2px solid #EEEEEE',
				'font-size':'16px',
				'padding' :'10px 17px',
				'position': 'absolute',
				'top' : '0'
			}
		})
		var showBody=jQuery("<div>",{
			'html' : alertSetting.content,
			'css'  : {
				'height':'44px',
				'width' :'100%',
				'font-size':'13px',
				'padding' :'10px 17px',
				'position': 'absolute',
				'top' : '46px',
				'bottom': '45px'
			}
		})
		var showButon = jQuery("<div>",{
			'html' : '确定',
			'css'  : {
				'border': '1px solid #4898d5',
				'background': '#2e8ded',
				'color': '#fff',
				'font-size': '14px',
				'letter-spacing': '1px',
				'height' : '30px',
				'width'  : '62px',
				'padding-top': '5px',
				'padding-left': '16px',
				'position': 'absolute',
				'right': '80px',
				'cursor':'pointer',
				'border-radius': '4px'
			},
			'onmouseover' : "this.style.background='#3092f5'",
			'onmouseout' : "this.style.background='#2e8ded'"
		})
		showButon.bind('click',function(){
			
			if(typeof callback == 'function'){
				callback();
			}
			alertDialog.remove();
			panel.remove();
		})
		
		var showCancleButon = jQuery("<div>",{
			'html' : '取消',
			'css'  : {
				'border': '1px solid #dedede',
				'background': '#f1f1f1',
				'font-size': '14px',
				'letter-spacing': '1px',
				'height' : '30px',
				'width'  : '62px',
				'padding-top': '5px',
				'padding-left': '16px',
				'position': 'absolute',
				'right': '10px',
				'cursor':'pointer',
				'border-radius': '4px'
			},
			'onmouseover' : "this.style.background='#f3f3f3'",
			'onmouseout' : "this.style.background='#f1f1f1'"
		})
		showCancleButon.bind("click",function(){
			alertDialog.remove();
			panel.remove();
		})
		var showFoot=jQuery("<div>",{
			'css'  : {
				'height':'45px',
				'width' :'100%',
				'position': 'absolute',
				'bottom': '0',
				'padding-top' : '7px'
			}
		})
		showFoot.append(showButon).append(showCancleButon);
		alertDialog.append(showHead).append(showBody).append(showFoot);
		
		$('body', parent.document).append(panel).append(alertDialog);
	}
	
});