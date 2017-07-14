<!DOCTYPE html>
<html lang="zh">
<head>
<title><@spring.message code="top.label.title"/></title>
<meta charset="UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="author" content="${author}"/>
<meta name="keywords" content="${keywords}"/>
<meta name="description" content="${description}"/>
<meta http-equiv="cache-control" content="public">
<meta http-equiv="pragma" content="Pragma">
<meta http-equiv="Expires" content="Mon,12 May 2050 00:20:00 GMT">
<link rel="stylesheet" href="${resPath}/bace/js/chosen/chosen.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/myreport/css/report-comment.css${css_version}" />
</head>

<body>
	<div class="main-comment-panel">
		<div class="comment-title">
			<span class="comment-title-span f14">报表评价</span>
		</div>
		<div class="my-comment">
			<div class="my-score">
				<span class="comment-span-right f14">我的评分</span>
				<div id="myStar" class="my-star inline">
				</div>
				<div id="commentSubmit" class="button comment-submit f13 hide">提交
					<div class="add-load">
				        <img class="loading" src="data:image/png;base64,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">
				    </div>
				</div>
			</div>
			<div class="my-rating">
				<span class="my-rating-title comment-span-right f14">我的评价</span>
				<div class="coment-content-div inline">
					<div id="commentContent" contenteditable="false" class="comment-content f13 hide">写下评价吧...</div>
				</div>
			</div>
			<div class="my-tools hide">
				<span id="commentId" class="hide"></span>
				<span id="userId" class="hide"></span>
				<span id="userName" class="hide"></span>
				<span id="contentTime" class="comment-time f12"></span>
				<span class="icon comment-icon" id="comment" title="评论"></span><span class="icon del-icon" id="delComment" title="删除"></span><span class="icon edit-icon" id="editComment" title="编辑"></span>
				<span id="contentLike" class="inline f12">赞(<span id="likeCount">0</span>)</span>
				<div class="comment-dashed"></div>
			</div>
			<div class="my-tools-edit hide">
				<div id="commentEditSubmit" class="button edit-btn">提交
					<div class="edit-load">
				        <img class="loading" src="data:image/png;base64,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">
				    </div>
				</div>
				<div id="commentEditCancel" class="button edit-btn cancel-btn">取消
					<div class="cancel-load">
				        <img class="loading" src="data:image/png;base64,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">
				    </div>
				</div>
			</div>
		</div>
		<div class="query-tools">
			<div id="radioSelect" class="radio-select inline f13">
				<div id="0" class="radio-check radio-span-color checked">
					<span class="radio-select-icon radio-ico"></span>全部<span class="radio-span">(<span id="allStarCount">0</span>)</span>
				</div>
				<div id="5" class="radio-check">
					<span class="radio-not-select-icon radio-ico"></span>5颗星<span class="radio-span">(<span id="fiveStarCount">0</span>)</span>
				</div>
				<div id="4" class="radio-check">
					<span class="radio-not-select-icon radio-ico"></span>4颗星<span class="radio-span">(<span id="fourStarCount">0</span>)</span>
				</div>
				<div id="3" class="radio-check">
					<span class="radio-not-select-icon radio-ico"></span>3颗星<span class="radio-span">(<span id="threeStarCount">0</span>)</span>
				</div>
				<div id="2" class="radio-check">
					<span class="radio-not-select-icon radio-ico"></span>2颗星<span class="radio-span">(<span id="twoStarCount">0</span>)</span>
				</div>
				<div id="1" class="radio-check">
					<span class="radio-not-select-icon radio-ico"></span>1颗星<span class="radio-span">(<span id="oneStarCount">0</span>)</span>
				</div>
			</div>
			<div class="comment-select inline f13">
				<select id="orderSelect" class="chosen-select">
					<option value="0" selected>最近时间</option>
					<option value="1">推荐指数</option>
				</select>
			</div>
		</div>
		<div class="hide">
			<span id="curUserId"></span>
			<span id="reportId"></span>
		</div>
		<div class="commemt-list">
			<ul id="commentList">
			</ul>
			<div class="list-load">
				 <img class="loading" src="data:image/png;base64,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">
			</div>
			<div id="moreComment" class="comment-more f13 hide">
				<a href="javascript:;">点击更多</a>
			</div>
			<div class="comment-end hide" id="endComment">已经到底了~</div>
		</div>
	</div>
<script>
	var webpath = '${webpath}';
	var resPath = '${resPath}';
	var js_version = '${js_version}';
	var funcId = '${funcId}';
</script>


<script src="${resPath}/bace/js/jquery/jquery-1.11.2.min.js"></script>
<script src="${resPath}/bace/js/nicescroll/jquery.nicescroll.min.js"></script>
<script src="${resPath}/bace/js/require.js"></script>
<script src="${resPath}/bace/js/form.js"></script>

</body>
</html>
<script>
var reportId = '${reportId}';
_require(
{
	paths : {
		'sabace' : '${resPath}/bace/js/tools/sa-bace',
		'cookie' : '${resPath}/bace/js/jquery-cookie/jquery.cookie',
		'platform/myreport/comment/report-comment':'${resPath}/resources/platform/myreport/js/report-comment',
		'chosen':'${resPath}/bace/js/chosen/chosen.ajax.jquery'
	}
},
'platform/myreport/comment/report-comment',function(){}
);
</script>