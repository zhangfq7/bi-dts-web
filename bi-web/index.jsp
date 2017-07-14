<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="renderer" content="webkit">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>数据超市 | 所见即所得，最好用的数据分析工具  </title>
		<link rel="stylesheet" type="text/css" href="${resPath}/bace/css/normalize.css" />
		<link rel="stylesheet" href="${resPath}/bace/js/fullpage/jquery.fullPage.css" />
		<link rel="stylesheet" href="${resPath}/bace/css/index/index.css" />
		<link rel="shortcut icon" href="${resPath}/bace/img/favicon.ico" type="image/x-icon" />
		<script>
			var webpath = '${webpath}';
			var resPath = '${resPath}';
			var userId = '${sessionScope.UserSessBean.userID}';
			var userName = '${sessionScope.UserSessBean.userName}';
		</script>
	</head>

	<body>
		<div id="fullpage">
			<!--第一页 -->
			<div class="section">
				<div class="intro " id="bg" bg="${resPath}/bace/img/index/BG.png">
					<canvas id='canvas' style="position: absolute;"></canvas>
					<div class="navbar">
						<div class="log"></div>
						<div class="menu" id="menu">
							<div>首页</div>
							<div>产品介绍</div>
							<div>解决方案</div>
							<div>合作伙伴</div>
							<div>使用帮助</div>
							<div>支持</div>
						</div>
						<div class="login">
							<div class="oper-manage">管理</div>
							<div class="oper-login">登录</div>
							<div class="language"></div>
						</div>
					</div>
					<!--<div class="title active-title">数据分析,<span>重新定义</span>数据分析</div>
					<div class="text active-title">通过简单、易用的在线操作，快速制作精美的可视化报表。</div>-->
					<div class="shouye active-title"></div>
					<!--<div class="create-button active-button" data-text='制作报表'>
						<span>制</span>
						<span>作</span>
						<span>报</span>
						<span>表</span>
					</div>-->
					<button class="button  active-button button--nina oper-login" data-text="制作仪表板">
						<span>制</span><span>作</span><span>仪</span><span>表</span><span>板</span>
					</button>
					<div class="bg11 active-title"></div>
					<div class="cube  active-title">
						<cube>
							<back></back>
							<bottom></bottom>
							<front></front>
							<left></left>
							<right></right>
							<top></top>
						</cube>
					</div>
				</div>
			</div>
			<!--第二页 -->
			<div class="section">
				<div class="intro">
					<!--<div class="title21">云分析平台</div>
					<div class="title22">让数据在云端飞翔</div>-->
					<div class="title2"></div>
					<div class="main2">
						<div class="part21">
							<div class="bg21">
								<div class="lamp1"></div>
								<div class="lamp2"></div>
								<div class="lamp3"></div>
								<div class="window"></div>
							</div>
							<div class="content">
								<div class="content-div21"><span>云存储</span></div>
								<div class="content-span21">
									云计算（cloud computing）是基于互联网的相关服务的增加、使用和交付模式，通常涉及通过互联网来提供动态易扩展且经常是虚拟化的资源。
								</div>
							</div>
						</div>
						<div class="part22">
							<div class="bg22">
								<div class="calc1"></div>
								<div class="calc2"></div>
								<div class="calc3"></div>
							</div>
							<div class="content">
								<div class="content-div22"><span>云计算</span></div>
								<div class="content-span22">
									云计算（cloud computing）是基于互联网的相关服务的增加、使用和交付模式。
								</div>
							</div>
						</div>
						<div class="part23">
							<div class="bg23">
								<div class="maintain1"></div>
								<div class="maintain2"></div>
								<div class="maintain3"></div>
								<div class="maintain4"></div>
								<div class="maintain5"></div>
							</div>
							<div class="content">
								<div class="content-div23"><span>零维护</span></div>
								<div class="content-span23">
									云计算（cloud computing）是基于互联网的相关服务的增加、使用和交付模式，通常涉及。
								</div>
							</div>
						</div>
						<div class="part24">
							<div class="bg24">
								<div class="money1"></div>
								<div class="money2"></div>
								<div class="money3"></div>
								<div class="money4"></div>
							</div>
							<div class="content">
								<div class="content-div24"><span>永久免费</span></div>
								<div class="content-span24">
									我们不收钱。我们不收钱。我们不收钱。
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--第三页 -->
			<div class="section">
				<div class="intro">

					<div class="bg51"></div>
					<div class="bg52">
						<div></div>
					</div>
					<div class="round-one">
						<div class="pic-1">
							<div class="left">数据隔离</div>
						</div>
						<div class="pic-2">
							<div class="left">7*24小时监控</div>
						</div>
						<div class="pic-3">
							<div class="left">日志分析监控</div>
						</div>
						<div class="pic-4">
							<div class="right">数据安全策略</div>
						</div>
						<div class="pic-5">
							<div class="right">数据报表水印</div>
						</div>
						<div class="pic-6">
							<div class="right">数据实时容灾</div>
						</div>
					</div>
					<div class="round-two"></div>
					<div class="round-three"></div>
					<div class="round-four"></div>
				</div>
			</div>
			<!--第四页 -->
			<div class="section">
				<div class="intro">
					<div class="bg41"></div>
					<div class="computer">
						<div class="top">
							<cube>
								<back></back>
								<bottom>
									<div class="browser">
										<div></div>
									</div>
								</bottom>
								<front></front>
								<left></left>
								<right></right>
								<top></top>
							</cube>
						</div>
						<div class="center-front"></div>
						<div class="bottom-front"></div>
					</div>
					<div class="pad"></div>
					<div class="phone"></div>
				</div>
			</div>
			<!--第五页 -->
			<div class="section">
				<div class="intro">
					<div class="part31">
						<div class="round">
							<div class="round1">
								<div class="round11">
									<div class="round111"></div>
									<div class="round112"></div>
								</div>
								<div class="bg31"></div>
							</div>
						</div>
						<div class="bg32"></div>
						<div class="bg33"></div>
						<div class="bg34"></div>
						<div class="bg35"></div>
					</div>
					<div class="part32">
						<div class="content3"></div>
					</div>
					<div class="part33"></div>
					<div class="part34">
						<div></div>
					</div>
					<div class="part35"></div>
				</div>
			</div>
			<!--第六页 -->
			<div class="section">
				<div class="intro">
					<div class="bg61"></div>
					<div class="case">
						<div class="caseDiv">
							<div class="case-1">
								<div class="case-head">
									<div>01</div>
									<div></div>
								</div>
								<div class="case-title">
									合肥移动数据分析
								</div>
								<div class="case-line"></div>
								<div class="case-content">
									自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助.
								</div>
								<div class="case-img"></div>
							</div>
							<div class="case-2">
								<div class="case-head">
									<div>02</div>
									<div></div>
								</div>
								<div class="case-title">
									合肥移动数据分析
								</div>
								<div class="case-line"></div>
								<div class="case-content">
									自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助.
								</div>
								<div class="case-img"></div>
							</div>
							<div class="case-3">
								<div class="case-head">
									<div>03</div>
									<div></div>
								</div>
								<div class="case-title">
									合肥移动数据分析
								</div>
								<div class="case-line"></div>
								<div class="case-content">
									自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助.
								</div>
								<div class="case-img"></div>
							</div>
							<div class="case-4">
								<div class="case-head">
									<div>04</div>
									<div></div>
								</div>
								<div class="case-title">
									合肥移动数据分析
								</div>
								<div class="case-line"></div>
								<div class="case-content">
									自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助.
								</div>
								<div class="case-img"></div>
							</div>
							<div class="case-5">
								<div class="case-head">
									<div>05</div>
									<div></div>
								</div>
								<div class="case-title">
									合肥移动数据分析
								</div>
								<div class="case-line"></div>
								<div class="case-content">
									自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助分析自助.
								</div>
								<div class="case-img"></div>
							</div>
						</div>
						<div class="prev"></div>
						<div class="next"></div>
					</div>

				</div>
			</div>
			<!--第七页 -->
			<div class="section">
				<div class="intro">
					<div class="half1">
						<div class="last-title">VIVA、开启全民数据分析时代</div>
						<div class="last-ex">改变更多、更多惊喜等你来约！</div>
						<div class="oper-login">约吗</div>
					</div>
					<div class="half2">
						<div>
							<div class="last-head">帮助与支持</div>
							<div class="line"></div>
							<div class="last-text"><span>新手学堂</span></div>
							<div class="last-text"><span>常见问题</span></div>
							<div class="last-text"><span>意见反馈</span></div>
							<div class="last-text"><span>充值付款</span></div>
						</div>
						<div>
							<div class="last-head">联系我们</div>
							<div class="line"></div>
							<div class="last-text">产品咨询：025-8564279</div>
							<div class="last-text">技术支持：025-8564279</div>
							<div class="last-text">市场推广：025-8564279</div>
							<div class="last-text" style="margin-left: 46px;">Email：asiainfo@asiainfo.com</div>
							<div class="last-bottom">©2012-2015 北京亚信数据科技有限公司 版权所有</div>
						</div>
						<div>
							<div class="last-head">关注我们</div>
							<div class="line"></div>
							<div class="qr-code"></div>
							<div class="last-content">扫描产品二维码进行关注</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="${resPath}/bace/js/jquery/jquery-1.11.2.min.js"></script>
		<script type="text/javascript" src="${resPath}/bace/js/jquery-ui/jquery-ui.js"></script>
		<script type="text/javascript" src="${resPath}/bace/js/fullpage/jquery.fullPage.min.js"></script>
		<script type="text/javascript" src="${resPath}/bace/js/index/index.js"></script>
	</body>

</html>