define(["bace","view/box"],function(c,a){var b={};b.control={init:function(e,d){b.module.el=d;b.view.installIndiFilterSortable(e)},dataStart:function(j,h){if(j==="collect"){var d=[];jQuery(".filterarea .filter-attr").each(function(){var v=$(this);var x=v.data("filterAttrData");var u="";if(x.dimId||["A","B","C"].indexOf(x.filterType)>-1){var p=v.find(".bi-input").data("code");x.filterValue=p?p.join(","):"";x.filterLabelValue=JSON.stringify([v.find(".bi-input").val(),""])}else{var q=v.find(".intervalInput.start").val();var s=v.find(".chooseType.start >select").val();var z=s.split("_");var i=z[0];if(i=="more"||i=="moreEq"){var t="";var y=v.find(".chooseType.end >select").val();q=encodeURIComponent(q);var w=encodeURIComponent(v.find(".intervalInput.end").val());var n=i=="more"?">":">=";var r=y=="less"?"<":"<=";if(q&&w){u=n+q+","+r+w;x.filterLabelValue=JSON.stringify([q,w])}else{if(q){u=n+q;x.filterLabelValue=JSON.stringify([q,""])}if(w){u=r+w;x.filterLabelValue=JSON.stringify(["",w])}if(q==""&&w==""){x.filterLabelValue=JSON.stringify(["",""])}}x.filterSelectValue=JSON.stringify([s,y])}else{if(i=="like"){u="%"+q+"%"}if(i=="leftLike"){u=q+"%"}if(i=="rightLike"){u="%"+q}if(i=="eq"){u=q}x.filterSelectValue=JSON.stringify([s,""]);x.filterLabelValue=JSON.stringify([q,""])}x.filterValue=u}d.push(x)});return d}else{if(h){for(var g=0,f=j.length;g<f;g++){var m=b.view._packIndicatorFilter(j[g]);var l=$.evalJSON(j[g].filterLabelValue);$(".indicatorPanel .dimAttrField.open .modifyName").after(m);if(j[g].filterSelectValue!=(undefined||""||null)){var o=$.evalJSON(j[g].filterSelectValue);var k="";var e="";switch(o[0]){case"more_2":k="大于";break;case"moreEq_2":k="大于等于";break;case"eq_3":k="等于";break;case"like_9":k="全匹配";break;case"leftLike_9":k="左匹配";break;case"rightLike_9":k="右匹配";break}switch(o[1]){case"less":e="小于";break;case"lessEq":e="小于等于";break;case"":e="";break}if(!l[1]){m.find(".filter-attrContent").html(k+decodeURIComponent(l[0])).attr("title",k+decodeURIComponent(l[0])).dotdotdot()}else{m.find(".filter-attrContent").html(k+decodeURIComponent(l[0])+","+e+decodeURIComponent(l[1])).attr("title",k+decodeURIComponent(l[0])+","+e+decodeURIComponent(l[1])).dotdotdot()}}else{m.find(".filter-attrContent").html(decodeURIComponent(l[0])).attr("title",decodeURIComponent(l[0])).dotdotdot()}}}else{for(var g=0,f=j.length;g<f;g++){var m=b.view._packFilter(j[g]);jQuery(".filterarea").append(m);var l=$.evalJSON(j[g].filterLabelValue);(function(n,i){setTimeout(function(){i.find(".intervalInput.start").val(decodeURIComponent(n[0]));i.find(".intervalInput.end").val(decodeURIComponent(n[1]))},100)})(l,m)}}}},getPluginByType:function(d){if(["pie","bar","line","radar","funnel","gauge","map","scatter"].indexOf(d)>-1){return a.Widgets.plugins.echarts}else{return a.Widgets.plugins[d]}},};b.view={installIndiFilterSortable:function(f){$("#layout_attr_treeGrid_panel span[file]").parents("td").trigger("draggable");$(".filterarea").sortable({items:"div.filter-attr",revert:false,scroll:false,delay:200,cancel:".bi-input,.intervalInput",placeholder:"filter-placeholder",containment:"parent",over:function(g,h){setTimeout(function(){myLayout.center.children.layout1.resizeAll()},0)},out:function(g,h){setTimeout(function(){myLayout.center.children.layout1.resizeAll()},0)},start:function(g,h){h.item.css({cursor:"move"})},stop:function(i,k){var g=k.item;if(!g.hasClass("filter-attr")){var j={attrId:g.attr("data-attrid"),attrName:g.attr("data-attrname"),attrType:g.attr("data-attrtype"),filterType:g.attr("data-filterType"),dimId:g.attr("data-dimId"),filterLabelValue:"",filterValue:""};var h=b.view._packFilter(j);g.replaceWith(h);var l=parseInt(jQuery(".filter-panel").height()/45);if(l>1&&l<4){jQuery(".search .fa-search").css({"font-size":15*l*0.6})}}}}).disableSelection().off("mousedown.ui-disableSelection");var e=b.view.bindFilterEvent;for(var d in e){e[d]()}$.dialog({id:"indicatorFilterDialog",title:"指标卡过滤",padding:"0",width:"830px",height:"400px",lock:false,resize:false,content:jQuery("#indicatorFilterPanel")[0],cancelVal:"取消",okVal:"保存",ok:function(){$.dialog.confirm("您确定保存该过滤条件设置吗？",function(){$("#propertyPanel").css({display:"block"});$(".indicatorPanel .dimAttrField.open .filter-attr").remove();var h=b.control.dataStart("collect");var g=f.data("dimAttrData");g.filterContent=h;b.control.dataStart(h,"IsRender");f.find(".filter-attrName").dotdotdot();f.css({height:(122+30*g.filterContent.length)+"px"});return true})},cancel:function(){$("#propertyPanel").css({display:"block"});return true}});c.autoScroll($(".filterarea"))},_packFilter:function(e){e.filterId=e.attrId+"_"+new Date().getTime();var d="";d+='<div id="${filterId}" class="filter-attr cursor-pointer">';d+='   	<span class="label">';d+="   		<label>${attrName}</label><span>：</span>";d+='   		<input id="${filterId}_input" type="text" class="bi-input target" />';d+="   	</span>";d+='   	<span class="icon-filter-tools">';d+='   		<i class="fa fa-remove icon-filter-hover" style="margin-left:1px" title="删除"></i>';d+="   	</span>";d+="</div>";var f=$.tmpl(d,e).data("filterAttrData",e);setTimeout(function(){b.view.translate(e)},0);return f},translate:function(p,j){var e=$("#"+p.filterId);var l=e.find("input.target");e.find("select").chosen("destroy");e.find(".bi-filter").remove();var j=p.filterType;if([b.module.filterType.DIM,"A","B","C"].indexOf(j)>-1){var o=e.data("filterAttrData").dimId;var d=e.data("filterAttrData").filterType;function h(t,r,s){return s.RES_DATA}var n=p.filterLabelValue?$.evalJSON(p.filterLabelValue)[0]:"";e.find(".bi-input").bzTree({async:{label:n,code:p.filterValue,enable:true,autoParam:["id=clickCode","dimId=clickDimId"],url:c.handleUrlParam(b.module.ajaxURL),dataType:"json",otherParam:{dimId:o,filterType:d},dataFilter:h}})}else{var k=p.filterSelectValue?$.evalJSON(p.filterSelectValue):null;var g='<div class="intervalGroup {{if endType != "less" && endType != "lessEq" }} like {{/if}} bi-filter"><div class="chooseType start"><select>{{if attrType != 1 && attrType != 2}}<option {{if startType == "like_9" }} selected {{/if}}value="like_9" >全匹配</option><option {{if startType == "leftLike_9" }} selected {{/if}} value="leftLike_9" >左匹配</option><option {{if startType == "rightLike_9" }} selected {{/if}} value="rightLike_9" >右匹配</option>{{/if}}<option {{if startType == "eq_3" }} selected {{/if}}value="eq_3" >精确</option><option {{if startType == "more_2" }} selected {{/if}}value="more_2" >&gt;</option><option {{if startType == "moreEq_2" }} selected {{/if}} value="moreEq_2" >&gt;=</option></select></div><div><input class="intervalInput start"/></div><div class="chooseType end"  {{if endType != "less" && endType != "lessEq" }}  style="display:none" {{/if}} ><select><option {{if endType == "less" }} selected {{/if}} value="less" >&lt;</option><option {{if endType == "lessEq" }} selected {{/if}} value="lessEq" >&lt;=</option></select></div><div class="endInput" {{if endType != "less" && endType != "lessEq" }}  style="display:none" {{/if}}><input class="intervalInput end"/></div></div>';l.hide().after($.tmpl(g,{attrType:p.attrType,startType:k?k[0]:"",endType:k?k[1]:""}));e.find(".chooseType.start select").chosen({width:"54px",disable_search:true});e.find(".chooseType.end select").chosen({width:"32px",disable_search:true});if(p.filterType==b.module.filterType.MONTH||p.filterType==b.module.filterType.DAY||p.filterType==b.module.filterType.TIME){var m=e.find("input.start");var q=e.find("input.end");if(m.data("DateTimePicker")){m.data("DateTimePicker").destroy();q.data("DateTimePicker").destroy()}var f="";var i="";if(j==b.module.filterType.MONTH){f="YYYY-MM"}if(j==b.module.filterType.DAY){f="YYYY-MM-DD";i+="months,days"}if(j==b.module.filterType.TIME){f="YYYY-MM-DD HH:mm:ss";i+="months,days,times"}p.filterValueType=j;e.find("input.start,input.end").datetimepicker({format:f,showClear:true,showTodayButton:true,showChangeType:i,keepOpen:false,onhide:function(){jQuery(this).attr("title",$(this).val()).parents(".filter-attr").removeClass("hover")},onChangeType:function(t,r){var u=e.find("input.start").data("DateTimePicker");var s=e.find("input.end").data("DateTimePicker");u.viewMode(r);u.format(t);s.viewMode(r);s.format(t);switch(r){case"months":p.filterValueType=b.module.filterType.MONTH;break;case"times":p.filterValueType=b.module.filterType.TIME;break;case"days":p.filterValueType=b.module.filterType.DAY;break;default:break}}});e.find("input.startDate").on("dp.change",function(r){e.find("input.endDate").data("DateTimePicker").minDate(r.date)})}}setTimeout(function(){myLayout.center.children.layout1.resizeAll()},0)},_packIndicatorFilter:function(e){e.filterId=e.attrId+"_"+new Date().getTime();var d="";d+='<div class="filter-attr" data-filterid="${filterId}">';d+='   	<div class="filter-attrName label" title="${attrName}">${attrName}</div><span>:</span>';d+='   	<span class="filter-attrContent" ></span>';d+='   	<div class="filter-attrDelete"><i class="icon-filter-tools">-</i></div>';d+="</div>";var f=$.tmpl(d,e).data("filterAttrData",e);return f},bindFilterEvent:{changeFilterSelect:function(){jQuery(".filterarea").on("change",".chooseType.start select",function(){var d=jQuery(this);var e=d.val();if(["moreEq_2","more_2","less","lessEq"].indexOf(e)>-1){d.parents(".filter-attr .intervalGroup").removeClass("like");d.parents(".filter-attr").find(".end,.endInput").show()}else{d.parents(".filter-attr .intervalGroup").addClass("like");d.parents(".filter-attr").find(".end,.endInput").hide()}setTimeout(function(){myLayout.center.children.layout1.resizeAll()},0)})},removeFilter:function(){jQuery(".filterarea").on("click ",".fa-remove",function(){jQuery(this).parents(".filter-attr").fadeOut(200,function(){this.remove()});setTimeout(function(){myLayout.resizeAll()},300)})},hoverAttr:function(){jQuery(".filterarea").on("mouseover",".filter-attr",function(){$(this).addClass("hover")});jQuery(".filterarea").on("mouseout",".filter-attr",function(d){var e=jQuery(this);var f=e.attr("id");if(jQuery(".fliterMenu[fid='"+f+"']").is(":visible")){}else{e.removeClass("hover")}})}}};b.module={ajaxURL:"/platform/dataview/query-tree-data",attrType:{INT:"1",DATE:"2",STRING:"3"},filterType:{DIM:"1",INTERVAL:"2",EQUAL:"3",LIKE:"9",MONTH:"4",DAY:"6",TIME:"7"},};a.IndiFilter.dataStart=b.control.dataStart;return b.control});