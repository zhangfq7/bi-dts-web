<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/message/js/layout/jquery.layout.css"/>
<link rel="stylesheet" href="${resPath}/resources/platform/message/css/msg.css${css_version}" />
   <div id="msgcontent">
	        <div class="ui-layout-center">
			</div>
			<div class="ui-layout-north">
				<div class="msg-leve-panel">
				</div>
				<div class="msg-button-panel">
					 <button type="button" class="btn btn-info btn-sm allSelect" disabled="disabled"><span class="glyphicon glyphicon-tags"></span><@spring.message code="msg.button.open"/></button>
				     <button type="button" class="btn btn-primary btn-sm " disabled="disabled"><span class="glyphicon glyphicon-tag"></span><@spring.message code="msg.button.markRead"/></button>
				     <button type="button" class="btn btn-danger btn-sm " disabled="disabled"><span class="glyphicon glyphicon-trash"></span><@spring.message code="msg.button.delete"/></button>
				</div>
			</div>
			<div class="ui-layout-west">
				<div class="list-group msglist no-select">
						  
				</div>
				<div class="page">
				        <div>
				              <select class="pagination-page-list">
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="30">30</option>
							  </select>
				        </div>
				        <div>
				              <div class="pagination-btn-separator"></div>
				        </div>
				        <div>
				             <div class="icon-btn">
				                <div class="first-btn"></div>
				             </div> 
				        </div>
				        <div>
				             <div class="icon-btn">
				                <div class="prev-btn"></div>
				             </div> 
				        </div>
				        <div>
				              <div class="pagination-btn-separator"></div>
				        </div>
				        <div>
				              <span class="pageNum"></span>/<span class="totalPages"></span>
				        </div>
				        <div>
				              <div class="pagination-btn-separator"></div>
				        </div>
				        <div>
				             <div class="icon-btn">
				                <div class="next-btn"></div>
				             </div> 
				        </div>
				        <div>
				             <div class="icon-btn">
				                <div class="last-btn"></div>
				             </div> 
				        </div>
				</div>
			</div>
			<div class="noMsg">
			    <div>
			     <div class="glyphicon glyphicon-envelope"></div>
			     <div><@spring.message code="msg.label.noMsg"/></div>
			    <div> 
            </div>
	</div>
			
<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
{
	paths : {
	    'mymessage':'${resPath}/resources/platform/myhome/js/message',
		'layout':'${resPath}/resources/platform/message/js/layout/jquery.layout',
		'top':'${resPath}/resources/platform/frame/bace/js/top',
		'msg':'${resPath}/resources/platform/message/js/msg'
	}
},
'msg',function(msg){
    msg.init();
}
);
</script>