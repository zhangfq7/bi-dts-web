<#include "view/platform/frame/bace/top.ftl">  
<link rel="stylesheet" href="${resPath}/resources/platform/myhome/css/my-home-setting.css${css_version}" />
	<div class="centerDiv">
	     <div  id="selectedHeader">
               <div >
                   <small >
                       <@spring.message code="home.setting.label.selectedReportList"/>
                   </small>
               </div>
           
	           <div class="reportDelete">
	              <img src="${resPath}/resources/platform/myhome/img/delete.png">
	           </div>
		  </div>
		  
		  <div class="selectedList">
			  <div class="list-group " id="selectedList" >
			  </div>
		  </div>
		  
		  <div  id="selectedFooter">
                   <button type="button" class="btn btn-info btn-xs savebtn" >
                        <span class="glyphicon glyphicon-floppy-open"></span>
                        <span style="font-size:16px;margin:0 10px;"><@spring.message code="home.setting.button.save"/></span>  
                   </button>
		  </div> 
	</div>
	
	
	
	
	<div class="rightDiv">
	      <div  id="selectHeader">
	              <div>
	                   <small >
	                       <@spring.message code="home.setting.label.selectReportList"/>
	                   </small>
                   </div>
                   <div class="input-group input-group-sm">
				      <input type="text" class="form-control input-sm"  id="searchInput">
				      <span class="input-group-btn">
				        <button class="btn btn-default btn-sm theme-background theme-border-color" type="button" id="search"><@spring.message code="home.setting.button.search"/></button>
				      </span>
	    	       </div>
		   </div>
		   <div id="buttons">
			    <div >
			      <div class="btn-group search-btn-group">
	    	   	    <button type="button" class="btn btn-default btn-sm" id="firstbutton" value="all">&nbsp;&nbsp;<@spring.message code="home.setting.button.all"/>&nbsp;&nbsp;</button>
	    	   	    <button type="button" class="btn btn-default btn-sm" value="date"><@spring.message code="home.setting.button.new"/></button>
	    	   	    <button type="button" class="btn btn-default btn-sm" value="new"><@spring.message code="home.setting.button.visit"/></button>
	    	   	    <button type="button" class="btn btn-default btn-sm" value="visit"><@spring.message code="home.setting.button.most"/></button>
	    	   	    <button type="button" class="btn btn-default btn-sm" id="lastbutton" value="foucs"><@spring.message code="home.setting.button.focus"/></button>
	    	      </div>
	    	    </div>  
	       </div>
	       <div class="selectList">
		      		<div class="" id="content">
	                 
					</div>
					<div class="page col-xs-12">
					     <div id="page" class="m-pagination"></div>
					</div>
		   </div>
	</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
{
	paths : {
		'mymessage':'${resPath}/resources/platform/myhome/js/message',
		'myhome/homesetting':'${resPath}/resources/platform/myhome/js/my-home-setting',
	}
},
'myhome/homesetting'
);
</script>
