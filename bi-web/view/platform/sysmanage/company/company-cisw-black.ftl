<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/company/css/company-cisw-black.css" />

<!--start-->
<div class="panel" style="padding: 10px;width:650px;height:440px;">
	<form class="form-horizontal">
		<div class="aa" style="max-height:500px;overflow-y:hidden">
			<div class="company-ciswblack-input">
				<span class="company-ciswblack-label"><@spring.message code="user.label.userName"/></span>
				<input type="text" style="width: 220px" class="cisw-black-lable1 form-control " id="userName">
				<button style="margin-left: 20px;" type="button" class="cisw-black-lable2 cisw-black-operate btn btn-info btn-sm">
					<@spring.message code="group.button.search" />
				</button>
				<div style="clear:both;"></div>
			</div>
		</div>

		<div class="bb" style="max-height:350px;overflow-y:auto">
			<div id="cisw-black-list">
				<#if ciswBlackList?exists>
					<#list ciswBlackList as ciswBlackBean>
						<div class="company-ciswblack-line">
							<div class="company-ciswblack-table company-ciswblack-img">
								<img class='toux' style="width: 60px;padding-top: 6px;border-radius: 60px;" src="${webpath}/platform/readUserImg/OVERVIEW_SYS?userImgId=${ciswBlackBean.userId}" />
							</div>
							<div class="company-ciswblack-table company-ciswblack-first">${ciswBlackBean.userName}</div>
							<div class="company-ciswblack-table company-ciswblack-third">
								<div class="company-ciswblack-label1">
									<@spring.message code="company.cisaw.label.Postscript" />
								</div>
								<div class="company-cisaw-bad-label2" title="${ciswBlackBean.authMsg}">
									${ciswBlackBean.authMsg}
								</div>
								<div style="clear:both;"></div>
							</div>
							<div class="company-ciswblack-table company-ciswblack-four">
								<button type="button" class="cisw-del btn btn-info btn-sm " companyId="${ciswBlackBean.companyId}" userId="${ciswBlackBean.userId}">
									<@spring.message code="company.cisaw.button.remove" />
								</button>
							</div>
						</div>
					</#list>
					<#else>
						<div class="cisw-black-line">
							<div class="company-ciswblack-warning">
								<div class='icon'>
									!
								</div>
								<div class='text'>
									<@spring.message code="company.cisaw.blacklist.tip" />
								</div>
							</div>
						</div>
				</#if>
			</div>
		</div>
	</form>
</div>
<script>
_require(
{
	paths: {
		'user/ciswBlack': '${resPath}/resources/platform/sysmanage/company/js/company-cisw-black',
		'message': '${resPath}/resources/platform/sysmanage/company/js/message',
	}
},
'user/ciswBlack',
function(ciswBlack) {
	ciswBlack.init();
}
);
</script>