     <link rel="stylesheet" href="${webpath}/bace/js/validation/validationEngine.jquery.css${css_version}">
     <input type="hidden" id="reportId" value="${reportId}"/>
     
      <div  class="part row">
       <div class="title">
            <span><@spring.message code="report.publish.portalType"/>：</span>
       </div>
       <div id="type-div" class="validationEngineContainer">
			<select  id="portalType"  onchange="handleUser(this)">
				<option value="0">外门户 </option>
				<option value="1">内门户 </option>
			</select>
	   </div>
     </div>
	   
	  <div  class="part row" id="div_typeId_outer">
       <div class="title">
            <span><@spring.message code="report.publish.type"/>：</span>
       </div>
       <div id="type-div" class="validationEngineContainer">
			<select class="validate[required]" id="typeId_outer" >
				<option value="">请选择分类 </option>
			<#list appTypeList as appTypeBean>
			    <option value="${appTypeBean.typeId}">${appTypeBean.typeName}</option>
			</#list>
			</select>
	    </div>
     </div>
     
     <div  class="part row" id="div_typeId_inner" style="display:none">
       <div class="title">
            <span><@spring.message code="report.publish.type"/>：</span>
       </div>
       <div id="type-div" class="validationEngineContainer">
			<select class="validate[required]" id="typeId_inner" >
				<option value="">请选择分类 </option>
			<#list appTypeInnerList as appTypeBean>
			    <option value="${appTypeBean.typeId}">${appTypeBean.typeName}</option>
			</#list>
			</select>
	    </div>
     </div>
     
      <div  class="part row" id="div_userId" style="display:none">
       <div class="title">
            <span><@spring.message code="report.publish.user"/>：</span>
       </div>
       
 		<div id="type-div" class="validationEngineContainer">
			<select id="userId" >
			<#list userList as userBean>
			    <option value="${userBean.userId},${userBean.deptId}">${userBean.userName}</option>
			</#list>
			</select>
	   </div>
	   </div>
     <#--<div  class="part row">-->
       <#--<div class="title">-->
            <#--<span><@spring.message code="report.publish.version"/>：</span>-->
       <#--</div>-->
       <#--<div id="version-div" class="validationEngineContainer">-->
           <#--<input type="text" class="validate[required]" id="version">-->
       <#--</div>-->
     <#--</div>-->
     <div  class="part row">
       <div class="title">
            <span><@spring.message code="report.publish.appDesc"/>：</span>
       </div>
       <div class="validationEngineContainer" id="appDesc-div">
           <textarea class="validate[required]" id="appDesc" style="width:470px;height:85px"></textarea>
       </div>
     </div>
     
    <script language="javascript">
	 function handleUser(obj) 
	 {
	    var opt = obj.options[obj.selectedIndex];
	    var obj=document.getElementById("div_userId");
	    var obj_type_outer=document.getElementById("div_typeId_outer");
	    var obj_type_inner=document.getElementById("div_typeId_inner");
    	if ('0' == opt.value)
    	{
    		obj.style.display="none";
    		obj_type_inner.style.display="none";
    		obj_type_outer.style.display="";
    	}
    	else
    	{
    		obj.style.display="";
    		obj_type_inner.style.display="";
    		obj_type_outer.style.display="none";
    	}
	 }
	</script>
     