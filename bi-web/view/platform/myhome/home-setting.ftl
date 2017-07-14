<#include "view/platform/frame/bace/top.ftl">  
<link rel="stylesheet" href="${resPath}/resources/platform/myhome/css/add-user.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/myhome/css/home-setting.css${css_version}" />
    <div class="leftDiv">
              <div  id="userHeader">
		               <div>
		                   <label class="" id="allSelect">
				                <input id="ab" type="checkbox" />
				                <small >选择成员</small>
				           </label>                            
	                   </div>
			           <div>
			                <img src="${resPath}/resources/platform/myhome/img/delete.png" class="userDelete">
			           </div>
			           <div>
			                <span class="glyphicon glyphicon-plus-sign addUser"></span>
			           </div>
			   </div>
			   
			   <div class="userList" >
			         <div class="list-group " id="userList">
			               
			               
			         </div>
		       </div>
			   
			   <div  id="userFooter">
			   </div>
    </div>

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
	var appType = '${appType}';
_require(
{
	paths : {
	    'message':'${resPath}/resources/platform/myhome/js/message',
		'myhome/homesetting':'${resPath}/resources/platform/myhome/js/home-setting',
		'myhome/addUser':'${resPath}/resources/platform/myhome/js/add-user',
	}
},
'myhome/homesetting'
);
</script>
