<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/overview/css/logo-details.css${css_version}" />
<link rel="stylesheet" href="${resPath}/bace/js/jquery-ui/jquery-ui-slider-pips.min.css" type="text/css" />
<div class="panel" >
	<div class="head row">
	     <h1><@spring.message code="service.label.logo.title" /></h1>
	     <h3>Custom Logo Service</h3>
	     <p><@spring.message code="service.label.logo.description" /></p>
	     <div class="buttons">
	     	<button class="btn btn-info btn-sm opened-info hide"><@spring.message code="service.label.logo.opened" /></button>
	     	<span class="opened-info hide"><@spring.message code="service.label.logo.opened.info" /></span>
	     	<button class="btn btn-default btn-sm closed-info hide"><@spring.message code="service.label.logo.closed" /></button>
	     	<span class="closed-info hide"><@spring.message code="service.label.logo.closed.info" /><a tag target="_blank" href="${webpath}/platform/overview/sysGlobal/system-global/${funcId}"><@spring.message code="service.label.logo.closed.toOpen" /></a>!</span>
	     </div>
	     <hr/>
	</div>
	<div class="body">
	   <div class="part">
	     <h1><@spring.message code="order.label.productAdvantage" /></h1>
	     <div class="group">
	         <div class="Advantage">
	            <div class="img">
	              <img alt="" class="icon icon-flexible" src="http://bce.bdstatic.com/portal/ffffff-0_d8974688.gif">
	            </div>
	            <div class="text">
	               <h3><@spring.message code="service.label.logo.advantage1.title" /></h3>
	               <p><@spring.message code="service.label.logo.advantage1.info" /></p>
	            </div>
	         </div>
	         <div class="Advantage">
	            <div class="img">
	              <img alt="" class="icon icon-stable" src="http://bce.bdstatic.com/portal/ffffff-0_d8974688.gif">
	            </div>
	            <div class="text">
	               <h3><@spring.message code="service.label.logo.advantage2.title" /></h3>
	              <p><@spring.message code="service.label.logo.advantage1.info" /></p>
	            </div>
	         </div>
	         <div class="Advantage">
	            <div class="img">
	              <img alt="" class="icon icon-inexpensive" src="http://bce.bdstatic.com/portal/ffffff-0_d8974688.gif">
	            </div>
	            <div class="text">
	               <h3><@spring.message code="service.label.logo.advantage3.title" /></h3>
	               <p><@spring.message code="service.label.logo.advantage3.info" /></p>
	            </div>
	         </div>
	         <div class="Advantage performance">
	            <div class="img">
	              <img alt="" class="icon icon-performance" src="http://bce.bdstatic.com/portal/ffffff-0_d8974688.gif">
	            </div>
	            <div class="text">
	               <h3><@spring.message code="service.label.logo.advantage4.title" /></h3>
	               <p><@spring.message code="service.label.logo.advantage4.info" /></p>
	            </div>
	         </div>
	     </div>
	   </div> 
	</div>
</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
 	var openFlag = '${openFlag}';
	_require(
	{
		paths : {
			'service/details': '${resPath}/resources/platform/overview/js/logo-details',
			'order/message': '${resPath}/resources/platform/overview/js/message',
			'slider':'${resPath}/bace/js/jquery-ui/jquery-ui-slider-pips'
		}
	},
	'service/details', function() {}
);
</script>
