<link rel="stylesheet" href="${resPath}/resources/platform/resmanage/data/css/data-contcat.css${css_version}" />
<div class="bodyDiv">
	<div class="headFilterDiv dis-none">
		<div id="interval" class="filterText">
			<@spring.message code="data.dataLink.label.intervalquery"/>
		</div>
		<div id="precise" class="filterText">
			<@spring.message code="data.dataLink.label.precisequery"/>
		</div>
		<div id="fuzzy" class="filterText">
			<@spring.message code="data.dataLink.label.fuzzyquery"/>
		</div>
		<div id="isEmpty" class="filterText-noB">
			<@spring.message code="data.dataLink.label.isEmpty"/>
		</div>
		<div style="clear:both;"></div>
	</div>
	<div class="numberFilterDiv dis-none">
		<div id="interval" class="filterText">
			<@spring.message code="data.dataLink.label.intervalquery"/>
		</div>
		<div id="precise" class="filterText">
			<@spring.message code="data.dataLink.label.precisequery"/>
		</div>
		<div id="isEmpty" class="filterText-noB">
			<@spring.message code="data.dataLink.label.isEmpty"/>
		</div>
		<div style="clear:both;"></div>
	</div>
	<div class="dateFilterDiv dis-none">
		<div id="date" class="filterText-time">
			<@spring.message code="data.dataLink.label.date"/>
		</div>
		<div id="dateSection" class="filterText-noB">
			<@spring.message code="data.dataLink.label.datesection"/>
		</div>
		<div style="clear:both;"></div>
	</div>
	<div class="monthFilterDiv dis-none">
		<div id="month" class="filterText-time">
			<@spring.message code="data.dataLink.label.month"/>
		</div>
		<div id="monthSection" class="filterText-noB">
			<@spring.message code="data.dataLink.label.monthsection"/>
		</div>
		<div style="clear:both;"></div>
	</div>
	<div class="timeFilterDiv dis-none">
		<div id="time" class="filterText-time">
			<@spring.message code="data.dataLink.label.time"/>
		</div>
		<div id="timeSection" class="filterText-noB">
			<@spring.message code="data.dataLink.label.timesection"/>
		</div>
	</div>
</div>
<div id="intervalDiv" class="dataTabDiv dis-none">
	<div class="middleDiv">
		<div class="question-icon" style="float: left;margin-top:6px;cursor:pointer" title="<@spring.message code="data.dataLink.label.intervaltitle"/>"></div>
		<div style="float:left;margin-left:10px"><@spring.message code="data.dataLink.label.intervalwhat"/></div>
		<div style="clear:both;"></div>
	</div>
	<div class="footerDiv">
		<form class="form-inline" id="intervalForm">
			<div class='filter-choosen-left'>
				<select id="minValue" class="chosen-select">
					<option value=">=">>=</option>
					<option value=">">></option>
				</select>
			</div>
			<div class="form-group form-group-sm" style="float:left;margin-left:9px">
					<input id="minValueText" class="form-control input-sm validate[groupRequired[payments],sp,len[0,200]" type="text"/>
			</div>
			<div class='filter-choosen-text'>
				<@spring.message code="data.dataLink.label.and"/>
			</div>
			<div class='filter-choosen-left'>
				<select id="maxValue" class="chosen-select">
					<option><=</option>
					<option><</option>
				</select>
			</div>
			<div class="form-group form-group-sm" style="float:left;margin-left:9px">
					<input id="maxValueText" class="form-control input-sm validate[groupRequired[payments],sp,len[0,200]]" type="text"/>
			</div>
	    </form>
	</div>
</div>
<div id="preciseDiv" class="dataTabDiv dis-none">
	<div class="middleDiv">
		<div class="question-icon" style="float: left;margin-top:6px;cursor:pointer" title="<@spring.message code="data.dataLink.label.precisetitle"/>"></div>
		<div style="float:left;margin-left:10px"><@spring.message code="data.dataLink.label.precisewhat"/></div>
		<div style="clear:both;"></div>
	</div>
	<div class="footerDiv">
		<form class="form-inline" id="preciseForm">
			<div class='filter-choosen-left'>
				<select id="preciseSelect" class="chosen-select">
					<option value="0"><@spring.message code="data.dataLink.label.Contains"/></option>
					<option value="1"><@spring.message code="data.dataLink.label.Exclude"/></option>
				</select>
			</div>
			<div class="form-group form-group-sm" style="float:left;margin-left:9px">
					<input id="preciseSelectText" class="form-control input-sm validate[required,sp,len[0,400]]" type="text" style="width:600px"/>
			</div>
	    </form>
	</div>
</div>
<div id="fuzzyDiv" class="dis-none dataTabDiv">
	<div class="middleDiv">
		<div class="question-icon" style="float: left;margin-top:6px;cursor:pointer" title="<@spring.message code="data.dataLink.label.fuzzytitle"/>"></div>
		<div style="float: left;margin-left:10px"><@spring.message code="data.dataLink.label.fuzzywhat"/></div>
		<div style="clear:both;"></div>
	</div>
	<div class="footerDiv">
		<form class="form-inline" id="fuzzyForm">
			<div class='filter-choosen-left'>
				<select id="fuzzySelect" class="chosen-select">
					<option value="0"><@spring.message code="data.dataLink.label.Contains"/></option>
					<option value="1"><@spring.message code="data.dataLink.label.Exclude"/></option>
				</select>
			</div>
			<div class="form-group form-group-sm" style="float:left;margin-left:9px">
				<input id="fuzzySelectText" class="form-control input-sm validate[required,sp,len[0,400]]" type="text" style="width:600px"/>
			</div>
	    </form>
	</div>
</div>
<div id="isEmptyDiv" class="dis-none dataTabDiv" >
	<div class="middleDiv">
		<div class="question-icon" style="float:left;margin-top:6px;cursor:pointer" title="<@spring.message code="data.dataLink.label.isemptytitle"/>"></div>
		<div style="float: left;margin-left:10px"><@spring.message code="data.dataLink.label.isemptywhat"/></div>
		<div style="clear:both;"></div>
	</div>
	<div class="footerDiv">
		<div class="form-inline">
		     <label class="radio radio-ma-left">
		        <input type="radio" data-toggle="radio" value="1" name="relRadio" id="optionsRadios1"  data-radiocheck-toggle="radio" required>
		          <@spring.message code="data.dataLink.label.yes"/>
		     </label>
		     <label class="radio radio-ma-left-1">
		       <input type="radio" data-toggle="radio" value="0" name="relRadio" id="optionsRadios2" data-radiocheck-toggle="radio" checked="">
		     	  <@spring.message code="data.dataLink.label.no"/>
		     </label>
	    </div>
    </div>
</div>
<div id="monthDiv" class="dataTabDiv dis-none">
	<form id="monthForm">
		<div class="date_input_style">
			<label><@spring.message code="data.dataLink.label.choosemonth"/></label>
			<input id="month_input" class="validate[required]" type="text" />
		</div>
	</form>
</div>
<div id="monthSectionDiv" class="dataTabDiv dis-none">
	<form id="monthSectionForm">
		<div class="date_input_style_section">
			<label><@spring.message code="data.dataLink.label.choosemonthsection"/></label>
			<input id="month_section_input_from" class="validate[groupRequired[payments]]" type="text" />
			<label><@spring.message code="data.dataLink.label.to"/></label>
			<input id="month_section_input_to" class="validate[groupRequired[payments]]" type="text" />
		</div>
	</form>
</div>
<div id="dateDiv" class="dataTabDiv dis-none">
	<form id="dateForm">
		<div class="date_input_style">
			<label><@spring.message code="data.dataLink.label.choosedate"/></label>
			<input id="date_input" class="validate[required]" type="text" />
		</div>
	</form>
</div>
<div id="dateSectionDiv" class="dataTabDiv dis-none">
	<form id="dateSectionForm">
		<div class="date_input_style_section">
			<label><@spring.message code="data.dataLink.label.choosedatesection"/></label>
			<input id="date_section_input_from" class="validate[groupRequired[payments]]" type="text" />
			<label><@spring.message code="data.dataLink.label.to"/></label>
			<input id="date_section_input_to" class="validate[groupRequired[payments]]" type="text" />
		</div>
	</form>
</div>
<div id="timeDiv" class="dataTabDiv dis-none">
	<form id="timeForm">
		<div class="date_input_style">
			<label><@spring.message code="data.dataLink.label.choosetime"/></label>
			<input id="time_input" class="validate[required]" type="text" />
		</div>
	</form>
</div>
<div id="timeSectionDiv" class="dataTabDiv dis-none">
	<form id="timeSectionForm">
		<div class="date_input_style_section">
			<label><@spring.message code="data.dataLink.label.choosetimesection"/></label>
			<input id="time_section_input_from" class="validate[groupRequired[payments]]" type="text" />
			<label><@spring.message code="data.dataLink.label.to"/></label>
			<input id="time_section_input_to" class="validate[groupRequired[payments]]" type="text" />
		</div>
	</form>
</div>