<div class="user-info">
	<input id="userID" type="hidden" value="${userBean.userID}"/>
	<input id="modifyFlag" type="hidden" value="${modifyFlag}"/>
	<div class="user-item"><@spring.message code="authority.label.userId"/>${userBean.userID}</div> 
	<div class="user-item"><@spring.message code="authority.label.userName"/>${userBean.userName}</div> 
	<div class="user-item"><@spring.message code="authority.label.jobName"/>${userBean.jobName}</div> 
	<div class="user-item"><@spring.message code="authority.label.depName"/>${userBean.depName}</div> 
</div>
<div class="dim-select-div">
	<div class="form-group form-group-sm dim-filter" >
		<div class="label-class">
			<span class="f14"><@spring.message code="authority.label.selectDim"/></span>
		</div>
		<div class="search-class">
			<#if modifyFlag == 1>
				<select class="chosen-select chosen-width" id="dimId" disabled>
					<#list dimList as dimBean>
		            	<option value="${dimBean.dimId}">${dimBean.dimName}</option>
	            	</#list> 
	         	</select>
			<#else>
				<select class="chosen-select chosen-width" id="dimId">
					<#list dimList as dimBean>
		            	<option value="${dimBean.dimId}">${dimBean.dimName}</option>
	            	</#list> 
	         	</select>
			</#if>
		</div>
	</div>
	<div class="div-left">
		<table id="unSelectDimValueGrid"></table> 
		<div id="unSelectDimValueGridPager"></div>
	</div>
	<div class="div-center">
		<ul>
			<li id="toRightDim" class="fa fa-arrow-right fa-2x cursor-pointer"></li>
			<li id="toLeftDim" class="fa fa-arrow-left fa-2x cursor-pointer"></li>
		</ul>
	</div>
	<div class="div-right">
		<table id="selectDimValueGrid"></table> 
	</div>
</div>
