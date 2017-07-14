<form class="form-inline" role="form" id="userSearchForm">
   <div class="form-group form-group-sm">
      <label class="f12"><@spring.message code="data.user.userName"/></label>
      <input type="text" class="form-control formWidth f12" id="userName" placeholder="<@spring.message code="data.user.inputUserName"/>">
   </div>
   <button class="btn btn-info searchButton"><@spring.message code="data.user.search"/></button>
</form>
<div class="div-list">
<div class="div-left">
	<table id="leftListGrid"></table> 
	<div id="leftListGridPager"></div>
</div>
<div class="div-center">
	<ul>
		<li id="right-arrow" class="fa fa-arrow-right fa-2x cursor-pointer"></li>
		<li id="left-arrow" class="fa fa-arrow-left fa-2x cursor-pointer"></li>
	</ul>
</div>
<div class="div-right">
	<table id="rightListGrid"></table> 
</div>
<div>

