<#include "view/manage/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/bace/js/font-awesome/css/font-awesome.min.css" />
<link rel="stylesheet" href="${resPath}/resources/manage/frame/index/css/index-page.css${css_version}" />

<div class="main-panel">
	<ul>
		<li>
			<ul class='user-panel info'>
				<li>
					<div class='user-head-class'>
						<img src="${webpath}/manage/readUserImg/${funcId}?t=${date}">
					</div>
					<div class='company-info'>
						<span class="f14 font-bolder">企业：</span>
						<span class="f14">苏宁易购</span>
						<span class="f14">（50人）</span>
					</div>
				</li>
				<li class='user-detail'>
					<div class='user-name'>
						<span class="f12">管理员</span>
					</div>
					<div class='bind-service'>
						<i class="fa fa-weixin f12 user-unbind"></i>
					</div>
					<div class='bind-service'>
						<i class="fa fa-mobile-phone f16 user-bind" style="padding: 2px 7px 3px 7px;"></i>
					</div>
					<div class='bind-service'>
						<i class="fa fa-envelope f12 user-bind"></i>
					</div>
				</li>
				
				<li class='user-balance'>
					<div><span class="f14 font-bolder">现金余额：</span></div>
					<div>
						<span class="f14 font-bolder font-orange">￥</span>
						<span class="f20 font-bolder font-orange">100</span>
					</div>
					<div class='user-balance-oper'>
						<span class="f12 balance-oper">充值</span>
						<span class="f12 balance-oper">提现</span>
					</div>
				</li>
				
				<li class='user-integral'>
					<span class="f14 font-bolder">可用积分：</span>
					<span class="f20 font-bolder font-orange">2100</span>
				</li>
				
				<li class='user-storage'>
					<div><span class="f14 font-bolder">存储空间：</span></div>
					<div>
						<div id="allStorage" class="progress">
							<div id="usedStorage" class="progress-bar">1.4G</div>
						</div>
					</div>
					<div><span class="f14 font-bolder">2G</span></div>
				</li>
				
				<li class='user-report'>
					<div>
						<i class="fa fa-bar-chart-o f14"></i>
						<span class="f14">分析报表：</span>
						<span class="f16 font-bolder font-orange">12</span>
						<span class="f14">个</span>
					</div>
					<div>
						<i class="fa fa-paw f14"></i>
						<span class="f14">登陆系统：</span>
						<span class="f16 font-bolder font-orange">142</span>
						<span class="f14">次</span>
					</div>
				</li>
			</ul>
		</li>
		<li>
			<ul class='user-panel bill'>
				<li class='select-acyc'>
					<div>
						<span class="f14 font-bolder">账单查询：</span>
					</div>
					<div class='input-group input-group-sm'>
						<input type='text' class="form-control" readonly style="width: 180px;height: 29px"/>
						<span class="input-group-addon acyc-icon">
							<span class="glyphicon glyphicon-calendar"></span>
						</span>
					</div> 
				</li>
				<li>
					<div id="acycBillChart"></div>
				</li>
			</ul>
		</li>
		<li>
			<ul class='user-panel visit'>
				<li>
					<div style="width: 100%; height: 33px; text-align: center;">
						<span class="f14 font-bolder">分析报表访问排行</span>
					</div>
				</li>
				<li>
					<div id="visitRankChart"></div>
				</li>
			</ul>
		</li>
	</ul>
	
	<ul>
		<li class="service-name-panel">
			<i class="fa fa-info-circle f16 service-info-icon"></i><span class="title-str f14" >开通服务信息</span>
		</li>
		<li class="open-service-panel">
			<ul>
				<li class="service-info">
					<ul>
						<li>
							<span class="f12 font-bolder">计算与存储</span>
						</li>
						<li>
							<div class="service-info-name">
								<i class="fa fa-database f14 service-info-icon"></i>
								<span class="f12">存储空间扩容</span>
								<span class="f12">（<span class="f14 font-bolder font-orange">2</span>&nbsp;G）</span>
							</div>
							<div class="service-info-oper">
								<i class="fa fa-cart-plus f14 font-orange"></i>
								<span class="f12">扩容</span>
								<span class="f12">|</span>
								<span class="f12">详情</span>
							</div>
						</li>
						<li>
							<div class="service-info-name">
								<i class="fa fa-cubes f14 service-info-icon"></i>
								<span class="f12">分布式数据计算</span>
								<span class="f12">（<span class="f14 font-bolder font-orange">1</span>&nbsp;个）</span>
							</div>
							<div class="service-info-oper">
								<i class="fa fa-cart-plus f14 font-orange"></i>
								<span class="f12">增加</span>
								<span class="f12">|</span>
								<span class="f12">详情</span>
							</div>
						</li>
						<li>
							<div class="service-info-name">
								<i class="fa fa-object-group f14 service-info-icon"></i>
								<span class="f12">多个数据关联</span>
								<span class="f12">（<span class="f14 font-bolder font-orange">2</span>&nbsp;个）</span>
							</div>
							<div class="service-info-oper">
								<i class="fa fa-cart-plus f14 font-orange"></i>
								<span class="f12">增加</span>
								<span class="f12">|</span>
								<span class="f12">详情</span>
							</div>
						</li>
					</ul>
				</li>
				<li class="service-info">
					<ul>
						<li>
							<span class="f12 font-bolder">访问控制</span>
						</li>
						<li>
							<div class="service-info-name">
								<i class="fa fa-users f14 service-info-icon"></i>
								<span class="f12">企业用户数</span>
								<span class="f12">（<span class="f14 font-bolder font-orange">3</span>&nbsp;人）</span>
							</div>
							<div class="service-info-oper">
								<i class="fa fa-cart-plus f14 font-orange"></i>
								<span class="f12">扩容</span>
								<span class="f12">|</span>
								<span class="f12">详情</span>
							</div>
						</li>
						<li>
							<div class="service-info-name">
								<i class="fa fa-sitemap f14 service-info-icon"></i>
								<span class="f12">同时在线用户数</span>
								<span class="f12">（<span class="f14 font-bolder font-orange">3</span>&nbsp;人）</span>
							</div>
							<div class="service-info-oper">
								<i class="fa fa-cart-plus f14 font-orange"></i>
								<span class="f12">扩容</span>
								<span class="f12">|</span>
								<span class="f12">详情</span>
							</div>
						</li>
					</ul>
				</li>
				<li class="service-info">
					<ul>
						<li>
							<span class="f12 font-bolder">应用服务</span>
						</li>
						<li>
							<div class="service-open-name">
								<i class="fa fa-weixin f14 service-info-icon"></i>
								<span class="f12">微信数据订阅</span>
							</div>
							<div class="service-open-oper">
								<input type="checkbox" id="openWeiChat" checked data-toggle="switch" data-size="mini" data-on-color="success" data-label-width="10" data-on-color="danger" data-on-text="已开通" data-off-text="已关闭"/>
								<span class="f12">|</span>
								<span class="f12">详情</span>
							</div>
						</li>
						<li>
							<div class="service-open-name">
								<i class="fa fa-volume-up f14 service-info-icon"></i>
								<span class="f12">短信告警通知</span>
							</div>
							<div class="service-open-oper">
								<input type="checkbox" id="openSms" checked data-toggle="switch" data-size="mini" data-on-color="success" data-label-width="10" data-on-color="danger" data-on-text="已开通" data-off-text="已关闭"/>
								<span class="f12">|</span>
								<span class="f12">详情</span>
							</div>
						</li>
						<li>
							<div class="service-open-name">
								<i class="fa fa-envelope f14 service-info-icon"></i>
								<span class="f12">邮件推送服务</span>
							</div>
							<div class="service-open-oper">
								<input type="checkbox" id="openEmail" checked data-toggle="switch" data-size="mini" data-on-color="success" data-label-width="10" data-on-color="danger" data-on-text="已开通" data-off-text="已关闭"/>
								<span class="f12">|</span>
								<span class="f12">详情</span>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
</div>

<#include "view/manage/frame/bace/bottom.ftl">

<script>
_require(
	{
		paths : {
			'index-page/info': '${resPath}/resources/manage/frame/index/js/index-page',
			"ECharts/AMD": '${resPath}/bace/js/echarts/echarts.amd',
			"EBuilder": '${resPath}/bace/js/echarts/jquery.echarts.template',
			'datetimepicker':'${resPath}/bace/js/datetimepicker/js/bootstrap-datetimepicker'
		}
	},
	'index-page/info',function(index){
		index.init();
	}
);
</script>

