<#include "view/platform/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/sysGlobal/css/sms-order.css${css_version}" />
<body>
<div class="main-area">
  <div id="main">
	<div class="content-wrap" style="min-height: 550px;">
		<p class="breadcrumb">
			<span>应用服务</span>
			<span class="divider">|</span>
			<span class="active">开通邮件推送服务</span>
		</p>
		<div class="create-content">
		     <div class="title">邮件推送服务</div>
		     <div class="open">
			     <ul>
				     <li bind-for="null" class="ui-viewstep-item-active">
				         <div class="circle1" id="circle1">
					     	<span>1</span>
					     </div>
					     <div>开通服务</div>
				     </li>
				     <li class="line line-color" id="line1"></li>
				     <li bind-for="null" class="ui-viewstep-last-item">
				        <div class="circle2" id="circle2">
					     	<span>2</span>
					    </div>
					    <div>开通成功</div>  
				     </li>
				  </ul>
			  </div>
		   
		     <hr class="lhr"/>
		     <div id="orderContentPanel">
	                <div class="order-content">
	                    <div class="item">
	                        <label class="left-title">产品名称：</label>
	                        <label  class="left-content">邮件推送服务</label>
	                    </div>
	                    <div class="item">
	                        <label class="left-title">计费方式：</label>
	                        <label class="left-content">按实际使用量后付费</label>
	                    </div>
	                    <div class="item">
	                        <label class="left-title">计费项：</label>
	                        <label class="left-content">发送条数</label><a href="http://bce.baidu.com/doc/SMS/Pricing.html" class="link-margin" target="_blank">查看计费标准</a>
	                    </div>
	                </div>
	              
	                <div class="col-sm-offset-3 col-sm-9">
						 <button  href="#fakelink" id="sendbtn" class="btn btn-default confirm-button">立即开通</button> 	
					</div>
	                
	            </div>
		            
		</div>
	</div>
 </div>
</div>
</body>
<#include "view/platform/bottom.ftl">
<script>
_require(
{
	paths : {
		'sms-order':'${resPath}/resources/sysGlobal/js/sms-order'
		
	}
});
require(['sms-order']);
</script>

