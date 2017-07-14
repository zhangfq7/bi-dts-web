<#include "view/platform/frame/bace/top.ftl">
	<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/company/css/company-cisaw.css" />

	<!--start-->
	<div class="panel" style="padding: 10px;">
		<span class="f16"><@spring.message code="company.detp.lebel.topTlitle"/>&nbsp;&nbsp;/&nbsp;&nbsp;<@spring.message code="company.cisaw.label.title"/></span>

		<hr/>
		<div class="row butRow">
			<div class="col-xs-8">
				<div class="btn-group search-btn-group">
					<button type="button" id="black-info" class="btn btn-default btn-sm ">
						<@spring.message code="company.cisaw.button.blacklist" />
					</button>

					<div class="btn-group search-btn-group company-cisaw-btn">
						<button type="button" class="btn btn-sm btn-default clickedButton theme-background" flag="5">
							<@spring.message code="company.cisaw.button.all" />
						</button>
						<button type="button" class="btn btn-sm btn-default normal-button" flag="1">
							<@spring.message code="company.cisaw.button.today" />
						</button>
						<button type="button" class="btn btn-sm btn-default normal-button" flag="2">
							<@spring.message code="company.cisaw.button.week" />
						</button>
						<button type="button" class="btn btn-sm btn-default normal-button" flag="3">
							<@spring.message code="company.cisaw.button.lastWeek" />
						</button>
						<button type="button" id="bad-info" class="btn btn-sm btn-default normal-button last-button" flag="4">
							<@spring.message code="company.cisaw.button.long" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="company-cisaw-clbt"></div>
	<div id="company-cisw-content">
		<#if companyAuthList?exists>
			<#list companyAuthList as companyAuthBean>
				<div class="company-cisaw-time">
					<label for="upload" class="">${companyAuthBean.adminTime}</label>
				</div>
				<div class="panel-cisaw company-cisaw-line">
					<div class="company-cisaw-table company-cisaw-img" >
						<img class='toux' userId='${companyAuthBean.userId}' style="width: 60px;border-radius: 60px;" src="${webpath}/platform/readUserImg/OVERVIEW_SYS?userImgId=${companyAuthBean.userId}" />
					</div>
					<div class="company-cisaw-table company-cisaw-first" title="${companyAuthBean.userName}">${companyAuthBean.userName}</div>
					<div class="company-cisaw-table company-cisaw-second">
						<@spring.message code="company.cisaw.label.add" />
					</div>
					<div class="company-cisaw-table company-cisaw-third">
						<div class="company-cisaw-label1">
							<@spring.message code="company.cisaw.label.Postscript" />
						</div>
						<div class="company-cisaw-label2" title="${companyAuthBean.authMsg}">
							${companyAuthBean.authMsg}
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="company-cisaw-table">
						<#if companyAuthBean ?? && companyAuthBean.handleState=='1'>
							<button type="button" class="cisw-operate btn btn-info btn-sm" handleState="2" companyId="${companyAuthBean.companyId}" userId="${companyAuthBean.userId}" msgId="${companyAuthBean.msgId}">
								<@spring.message code="company.cisaw.button.agree" />
							</button>
							<button type="button" class="cisw-operate btn btn-info btn-sm" handleState="3" companyId="${companyAuthBean.companyId}" userId="${companyAuthBean.userId}" msgId="${companyAuthBean.msgId}">
								<@spring.message code="company.cisaw.button.add" />
							</button>
							<button type="button" class="cisw-operate btn btn-info btn-sm" handleState="4" companyId="${companyAuthBean.companyId}" userId="${companyAuthBean.userId}" msgId="${companyAuthBean.msgId}">
								<@spring.message code="company.cisaw.button.refuse" />
							</button>
							<button type="button" class="cisw-operate btn btn-danger btn-sm" handleState="-1" companyId="${companyAuthBean.companyId}" userId="${companyAuthBean.userId}" msgId="${companyAuthBean.msgId}">
								<@spring.message code="company.cisaw.button.delete" />
							</button>
							<#else>
								<#if companyAuthBean ?? && companyAuthBean.handleState=='2'>
									<span style="  display: inline-block;width: 203px;"><@spring.message code="company.cisaw.label.agree"/></span>
									<#elseif companyAuthBean ?? && companyAuthBean.handleState=='4'>
										<span style="  display: inline-block;width: 203px;"><@spring.message code="company.cisaw.label.refuse"/></span>
										<button type="button" class="cisw-operate btn btn-danger btn-sm" handleState="-1" companyId="${companyAuthBean.companyId}" userId="${companyAuthBean.userId}" msgId="${companyAuthBean.msgId}">
											<@spring.message code="company.cisaw.button.delete" />
										</button>
										<#elseif companyAuthBean ?? && companyAuthBean.handleState=='9'>
											<span style="  display: inline-block;width: 203px;"><@spring.message code="company.cisaw.label.handle"/></span>
											<button type="button" class="cisw-operate btn btn-danger btn-sm" handleState="-1" companyId="${companyAuthBean.companyId}" userId="${companyAuthBean.userId}" msgId="${companyAuthBean.msgId}">
												<@spring.message code="company.cisaw.button.delete" />
											</button>
											<#elseif companyAuthBean ?? && companyAuthBean.handleState=='6'>
												<span style="  display: inline-block;width: 203px;"><@spring.message code="company.cisaw.label.Processing"/></span>
												<#else>
													<span style="  display: inline-block;width: 203px;"><@spring.message code="company.cisaw.label.revoke"/></span>
													<button type="button" class="cisw-operate btn btn-danger btn-sm" handleState="-1" companyId="${companyAuthBean.companyId}" userId="${companyAuthBean.userId}" msgId="${companyAuthBean.msgId}">
														<@spring.message code="company.cisaw.button.delete" />
													</button>
								</#if>
						</#if>
					</div>
				</div>
			</#list>
			<#else>
				<div class="company-cisw-warning">
					<div class='icon'>
						!
					</div>
					<div class='text'><@spring.message code="company.cisaw.list.tip"/></div>
				</div>
		</#if>
	</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
{
	paths: {
		'company/cisaw': '${resPath}/resources/platform/sysmanage/company/js/company-cisaw',
		'company/message': '${resPath}/resources/platform/sysmanage/company/js/message',
		
	}
},
'company/cisaw',
function(cisaw) {
	cisaw.init();
}
);
</script>