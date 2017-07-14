<div class="user-select-div">
	<div class="form-group form-group-sm user-filter" >
		<div class="label-class">
			<span class="f14"><@spring.message code="authority.label.userName"/></span>
		</div>
		<div class="input-class">
			<input type="text" id="user-name" value="" class="form-control" />
		</div>
		<div class="button-class">
			<button id="searchUser" type="button" class="btn btn-sm btn-info button-middle"><@spring.message code="authority.button.query"/></button>
		</div>
	</div>
	<div class="div-left">
		<table id="unSelectUserGrid"></table> 
		<div id="unSelectUserGridPager"></div>
	</div>
	<div class="div-center">
		<ul>
			<li id="right-arrow" class="fa fa-arrow-right fa-2x cursor-pointer"></li>
			<li id="left-arrow" class="fa fa-arrow-left fa-2x cursor-pointer"></li>
		</ul>
	</div>
	<div class="div-right">
		<table id="selectUserGrid"></table> 
	</div>
</div>
<div class="dim-select-div">
	<div class="form-group form-group-sm dim-filter" >
		<div class="label-class">
			<span class="f14"><@spring.message code="authority.label.selectDim"/></span>
		</div>
		<div class="search-class">
			<select class="chosen-select chosen-width" id="dimId">
				<#list dimList as dimBean>
	            	<option value="${dimBean.dimId}">${dimBean.dimName}</option>
            	</#list> 
         	</select>
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
