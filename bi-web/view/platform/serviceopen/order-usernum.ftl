<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/serviceopen/css/order-usernum.css${css_version}" />
<link rel="stylesheet" href="${resPath}/bace/js/jquery-ui/jquery-ui-slider-pips.min.css" type="text/css" />
<div class="panel" >
	<div class="head row">
	     <h1><@spring.message code="order.label.userNum.title" /></h1>
	     <h3>User number capacity expansion</h3>
	     <p><@spring.message code="order.label.userNum.description" /></p>
	     <div class="buttons">
	       <button id="showOrderPage" class="btn btn-info btn-sm"><@spring.message code="order.btn.orderEdit" /></button>
	       <button id="showOrderList" class="btn btn-info btn-sm calc"><@spring.message code="order.btn.orderList" /></button>
	       <span class="serviceNum"><span class="numIcon"></span><@spring.message code="order.label.userNum" /><span id="totalNum"><span class="numSpan">0</span></span><@spring.message code="order.label.userNum.unit.person" /></span>
	     </div>
	     <hr/>
	</div>
	
	<div class="orderDiv hide">
		<div class="form-group form-group-sm">
 		    <label class="label-left"><@spring.message code="order.label.orderNum" /></label>
			<div class="slider-div"><div id="orderNumSlider"></div></div>
			<div class="orderNumDiv">
				<input class="form-control orderNum-value" id="orderNum" name="orderNum" type="text" value="0" />
				<span class="unitStr"><@spring.message code="order.label.userNum.unit.person" /></span>
			</div>	
		</div>
		<hr/>
		<div class="form-group form-group-sm">
			<label class="label-left"><@spring.message code="order.label.endMonth" /></label>
			<div class="order-time">
		 	  <div class="btn-group search-btn-group">
				<button type="button" class="btn btn-default btn-sm" id="firstbutton" value="0"></button>
				<button type="button" class="btn btn-default btn-sm" value="1"></button>
				<button type="button" class="btn btn-default btn-sm" value="2"></button>
				<button type="button" class="btn btn-default btn-sm" value="3"></button>
				<button type="button" class="btn btn-default btn-sm" value="4"></button>
				<button type="button" class="btn btn-default btn-sm" value="5"></button>
				<button type="button" class="btn btn-default btn-sm" value="6"></button>
				<button type="button" class="btn btn-default btn-sm" value="7"></button>
				<button type="button" class="btn btn-default btn-sm" value="8"></button>
				<button type="button" class="btn btn-default btn-sm" value="12"></button>
				<button type="button" class="btn btn-default btn-sm" value="24"></button>
				<button type="button" class="btn btn-default btn-sm" id="lastbutton" value="--"><@spring.message code="order.label.unlimited" /></button>
		      </div>
	        </div>
	    </div>
	    <hr/>
	    <div class="form-group form-group-sm">
 		    <label class="label-left"><@spring.message code="order.label.endDate" /></label> 
			<span id="orderEndDate" class="f16 text-padding-left">--</span>
		</div>
		<hr/>
		<div class="form-group form-group-sm">
 		    <label class="label-left"><@spring.message code="order.label.cost" /></label> 
			<span id="costPerMon" class="f16 text-padding-left"><span class="costNum font-orange">0</span><@spring.message code="order.label.costUnit" /></span>
		</div>
		<hr/>
		<div class="bottom-button-common text-align-center">
			<button id="saveOrderInfo" class="btn btn-info btn-confirm" disabled="disabled"><@spring.message code="order.btn.save" /></button>
			<button id="back" class="btn btn-info btn-confirm hide"><@spring.message code="order.btn.back" /></button>
		</div>
		<hr class="blue"/>
	</div>
	<div class="orderListDiv hide row"> 
		<div class="form-group form-group-sm">
 		    <div class="label-left inline-block">
				<span class="f14"><@spring.message code="order.label.orderTime" /></span>
			</div>
			<div class="orderDateStr inline-block">
				<input type="text" id="queryOrderDate" readOnly class="form-control kalendar ordertime"/>
				<span class=" adder acyc-icon" id="changeOrderDate">
					<span class="glyphicon theme-color glyphicon-calendar"></span>
				</span>
			</div>
			<div class="button-class inline-block query-button">
				<button id="queryOrderListBtn" type="button" class="btn btn-info btn-sm"><@spring.message code="order.btn.query" /></button>
			</div>
		</div>
		<div id="orderList" class="orderList">
			<table id="orderListGrid" width="100%"></table>
			<div id="orderListGridPager"></div>
		</div>
    	<hr class="blue"/>
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
	               <h3><@spring.message code="order.label.userNum.advantage1.title" /></h3>
	               <p><@spring.message code="order.label.userNum.advantage1.info" /></p>
	            </div>
	         </div>
	         <div class="Advantage">
	            <div class="img">
	              <img alt="" class="icon icon-stable" src="http://bce.bdstatic.com/portal/ffffff-0_d8974688.gif">
	            </div>
	            <div class="text">
	               <h3><@spring.message code="order.label.userNum.advantage2.title" /></h3>
	              <p><@spring.message code="order.label.userNum.advantage2.info" /></p>
	            </div>
	         </div>
	         <div class="Advantage">
	            <div class="img">
	              <img alt="" class="icon icon-inexpensive" src="http://bce.bdstatic.com/portal/ffffff-0_d8974688.gif">
	            </div>
	            <div class="text">
	               <h3><@spring.message code="order.label.userNum.advantage3.title" /></h3>
	               <p><@spring.message code="order.label.userNum.advantage3.info" /></p>
	            </div>
	         </div>
	         <div class="Advantage performance">
	            <div class="img">
	              <img alt="" class="icon icon-performance" src="http://bce.bdstatic.com/portal/ffffff-0_d8974688.gif">
	            </div>
	            <div class="text">
	               <h3><@spring.message code="order.label.userNum.advantage4.title" /></h3>
	               <p><@spring.message code="order.label.userNum.advantage4.info" /></p>
	            </div>
	         </div>
	     </div>
	   </div> 
	</div>
</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
 	var servicePrice = '${servicePrice}';
 	var serviceId = '${serviceId}';
 	var totalNum = '${totalNum}';
	_require(
	{
		paths : {
			'order/usernum': '${resPath}/resources/platform/serviceopen/js/order-usernum',
			'order/message': '${resPath}/resources/platform/serviceopen/js/message',
			'slider':'${resPath}/bace/js/jquery-ui/jquery-ui-slider-pips'
		}
	},
	'order/usernum', function() {}
);
</script>
