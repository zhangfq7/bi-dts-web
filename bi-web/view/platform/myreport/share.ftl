     <input type="hidden" id="reportId" value="${reportInfo.reportId}"/>
     <input type="hidden" id="createId" value="${reportInfo.createId}"/>
     <div  class="part row">
       <div class="title">
            <span><@spring.message code="report.share.reportName"/>：</span>
       </div>
       <div class="input">
           <input type="text" class="form-control input-sm" id="reportName" disabled value="${reportInfo.reportName}">
       </div>
     </div>
     <div  class="part row">
       <div class="title">
            <span><@spring.message code="report.share.reportLabel"/>：</span>
       </div>
       <div class="input">
           <input type="text" class="form-control input-sm" id="labelName" disabled value="${labelIds}">
       </div>
     </div>
     <div  class="part row">
       <div class="title">
            <span><@spring.message code="report.share.publishWay"/>：</span>
       </div>
       <div class="mytable">
             <div class="head">
                  <div class="tab defaultTab systab" pro="sys">
                       <label class="checkbox-diy">
		                  <input type="checkbox" data-toggle="checkbox" />
		                  <span class="tabspan"><@spring.message code="report.share.currentSystem"/></span>
		               </label>
		          </div>
                  <div class="tab defaultTab" pro="app">
                       <label class="checkbox-diy">
		                  <input type="checkbox" data-toggle="checkbox" />
		                  <span class="tabspan"><@spring.message code="report.share.terminal"/></span>
		               </label>
		               
                  </div>
                  <div class="tabright">&nbsp;</div>
             </div>
	         <div class="tableBody sys">
	           <div class="leftDiv">
	                 <div class="userNameDiv input-group input-group-sm">
		                  <input type="text" class="form-control input-sm searchInput">
					      <span class="input-group-btn input-group-sm">
					        <button class="btn btn-default btn-sm userNameBtn" type="button"><@spring.message code="home.setting.button.search"/></button>
					      </span>
		             </div>
	                <div class="selectList">	  
	                </div>
               </div> 
               <div class="leftright">
                      <img class="right"/>
                       <img class="left" />
               </div>
               <div class="rightDiv">
                   <div class="myUserDiv input-group-sm">
                       <input id="sysmyUser" name="sysmuUser" type="text"  placeholder="自定义用户','号分隔" class="myUserInput form-control input-sm searchInput">
                   </div>
                    <div class="selectedList">	  
	                </div>
               </div>
             </div>
             <div class="tableBody app" style="display:none;">
                <div class="leftDiv">
	                 <div class="userNameDiv input-group input-group-sm">
		                  <input type="text" class="form-control input-sm searchInput">
					      <span class="input-group-btn input-group-sm">
					        <button class="btn btn-default btn-sm userNameBtn" type="button"><@spring.message code="home.setting.button.search"/></button>
					      </span>
		             </div>
	                <div class="selectList">	  
	                </div>
               </div> 
               <div class="leftright">
                   <img class="right"/>
                   <img class="left"/>
               </div>
               <div class="rightDiv">
                   <div class="myUserDiv input-group-sm">
                       <input id="appmyUser" name="appmuUser" type="text"  placeholder="自定义用户','号分隔" class="myUserInput form-control input-sm searchInput">
                   </div>
                    <div class="selectedList">	  
	                </div>
               </div>
             </div>
       </div>
     </div>
     