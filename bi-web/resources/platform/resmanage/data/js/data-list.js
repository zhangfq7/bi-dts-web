define(["sabace","radialIndicator","userSelect"],function(y,aj,U){var O=[];var L=[];var ae=[];var X=[];var z=[];var C=false;var R=[];var ai="0";var P="1";var Y="2";var Z="7";var G="9";var m="1";var e="2";var ak="3";var f="4";var T="5";var h="6";var ac="7";var o=1;var J=20;jQuery(function(){I();u();a();n();s();F();q();ad();D();c();x();al();v();S(true)});y.interval(function(){jQuery(".btn-list .tool-title-div").poshytip("hide");S(true)},1000*60);function I(){jQuery("#dataFilter").slideDown();jQuery("#searchFilter").on("click",function(){jQuery("#dataFilter").slideToggle();if(jQuery("#filterIcon").hasClass("fa-angle-up")){jQuery("#filterText").text("显示筛选");jQuery("#filterIcon").removeClass("fa-angle-up");jQuery("#filterIcon").addClass("fa-angle-down")}else{jQuery("#filterText").text("收起筛选");jQuery("#filterIcon").removeClass("fa-angle-down");jQuery("#filterIcon").addClass("fa-angle-up")}K()})}function u(){jQuery("#orderType [name='createTime']").addClass("data-item-border");jQuery("#orderType span").on("click",function(){jQuery("#orderType span").removeClass("data-item-border");jQuery(this).addClass("data-item-border");S(true)})}function a(){document.onmousedown=function(an){var ao=an.target;if(ao==undefined||ao.id!="addSource"){jQuery("#addSource").poshytip("hide");return}};jQuery("#addSource").on("click",function(){jQuery(this).poshytip("hide");jQuery(this).poshytip({className:"tip-yellowsimple data-source",content:jQuery("#sourceDialog").outerHTML(),showTimeout:1,alignTo:"target",alignX:"bottom",alignY:"bottom",showOn:"none",offsetY:5,keepInViewport:false});jQuery(this).poshytip("show");jQuery(".tip-yellowsimple").on("mouseover mouseout","#sourceDialog div",function(ao){if(ao.type=="mouseover"){jQuery(".tip-yellowsimple #sourceDialog .data-show").each(function(){if(!jQuery(this).hasClass("hide")){jQuery(this).addClass("hide")}});jQuery(".tip-yellowsimple #sourceDialog .data-hide").each(function(){if(jQuery(this).hasClass("hide")){jQuery(this).removeClass("hide")}});jQuery(this).find(".data-hide").addClass("hide");jQuery(this).find(".data-show").removeClass("hide")}else{jQuery(this).find(".data-show").addClass("hide");jQuery(this).find(".data-hide").removeClass("hide")}});var an=false;y.ajax({url:y.handleUrlParam("/platform/resmanage/data/query-used-space"),success:function(ao){an=ao.isSpaceFull},error:function(ao){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:"提示",message:"查询用户空间异常！"})}});jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-file",function(){if(an){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:"提示",message:"空间已满，禁止导入数据！"});return}j("add","")});jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-openapi",function(){var ao=y.handleUrlParam("/platform/openapi/openapi-list-page");var ap={};W(ao,ap)});jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-table",function(){if(an){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:"提示",message:"空间已满，禁止导入数据！"});return}V("")});jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-table-direct",function(){af("")});jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-dacp",function(){am("")});jQuery(".tip-yellowsimple").on("click","#sourceDialog .table-view",function(){p("")})})}function n(){jQuery("#dataFilter").on("click",".data-service-type .condition-items, .data-source-type .condition-items,.data-update-type .condition-items",function(){var ar=jQuery(this).parent().attr("name");var ao=jQuery(this).find("span").html();var at=jQuery(this).attr("value");var aq=jQuery.inArray(ar,z);if(aq<0){jQuery(this).parent().find(".data-select-check").each(function(){if(jQuery(this).find("i").hasClass("fa-check-square-o")){jQuery(this).find("i").removeClass("fa-check-square-o");jQuery(this).find("i").addClass("fa-square-o")}});var an=jQuery.inArray(ar,X);if(an>-1){jQuery("#"+ar+" .data-condition-content").html(ao);var au=jQuery("#"+ar+" .data-condition-type").html();var av=jQuery("#"+ar+" .data-condition-content").html();jQuery("#"+ar).attr("title",au+av)}else{var ap=H(ar,ao,at);jQuery(".data-condition").append(ap)}ag(ar,at);S(true)}else{if(jQuery(this).parent().parent().find(".data-select-button").hasClass("hide")){jQuery("#"+ar+" .data-condition-content").html(ao)}}});jQuery(".data-classify-all").on("click",".data-condition #closeIcon",function(){var an=jQuery(this).parent().attr("id");for(var ao=0;ao<X.length;ao++){if(an==X[ao]){X.splice(ao,1);break}}if(an=="dataService"){O=[]}else{if(an=="dataSource"){L=[]}else{if(an=="dataUpdate"){ae=[]}}}jQuery(this).parent().remove();S(true)})}function H(ap,an,aq){var ar=null;if(ap=="dataService"){ar="业务类型：";if(aq!=null){O.push(aq)}}else{if(ap=="dataSource"){ar="数据来源类型：";if(aq!=null){L.push(aq)}}else{if(ap=="dataUpdate"){ar="更新周期：";if(aq!=null){ae.push(aq)}}}}X.push(ap);var ao="";ao+='<div id="'+ap+'" class="condition-div" title="'+ar+an+'">';ao+='<div class="data-show-name">';ao+='	<span class="data-condition-type">'+ar+"</span>";ao+='	<span class="data-condition-content">'+an+"</span>";ao+="</div>";ao+='<div id="closeIcon" class="fa fa-close f12"></div>';ao+="</div>";return ao}function s(){jQuery(".data-service-type .data-items-more").on("click",function(){Q("more");if(jQuery("#moreIcon").hasClass("fa-caret-up")){jQuery("#moreText").text("更多");jQuery("#moreIcon").removeClass("fa-caret-up");jQuery("#moreIcon").addClass("fa-caret-down");jQuery(".data-service-type").css("height","36px");jQuery(".data-service-type .moreItems").addClass("hide")}else{jQuery("#moreText").text("收起");jQuery("#moreIcon").removeClass("fa-caret-down");jQuery("#moreIcon").addClass("fa-caret-up");jQuery(".data-service-type").css("height","auto");jQuery(".data-service-type .moreItems").removeClass("hide")}})}function F(){jQuery(".data-multi-select").on("click",function(){jQuery(this).parent().find(".condition-items").css("margin-left","0px");var aq=jQuery(this).attr("name");if(aq=="data-service-type"){aq="dataService"}else{if(aq=="data-source-type"){aq="dataSource"}else{if(aq=="data-update-type"){aq="dataUpdate"}}}N(aq);if(aq=="dataService"&&C){jQuery(".data-service-type .moreItems").removeClass("hide");jQuery(".data-service-type .data-items-more").addClass("hide")}if(aq!="dataService"){Q("common")}var ao=jQuery.inArray(aq,z);if(ao<0){z.push(aq)}jQuery(this).parent().find(".data-select-check").removeClass("hide");jQuery(this).parent().find(".data-multi-select").addClass("hide");jQuery(this).parent().addClass("data-height-auto");jQuery(this).parent().find(".data-select-button").removeClass("hide");jQuery(this).parent().parent().find(".data-select-check").each(function(){if(jQuery(this).find("i").hasClass("fa-check-square-o")){jQuery(this).find("i").removeClass("fa-check-square-o");jQuery(this).find("i").addClass("fa-square-o")}});var an=[];if(aq=="dataService"){an=O}else{if(aq=="dataSource"){an=L}else{if(aq=="dataUpdate"){an=ae}}}for(var ap=0;ap<an.length;ap++){jQuery(this).parent().find("[value="+an[ap]+"]").find("i").removeClass("fa-square-o");jQuery(this).parent().find("[value="+an[ap]+"]").find("i").addClass("fa-check-square-o")}});jQuery(".condition-items").hover(function(){jQuery(this).find(".data-select-check i").addClass("items-hover-show")},function(){jQuery(this).find(".data-select-check i").removeClass("items-hover-show")});jQuery("#dataFilter").on("click",".data-service-type .condition-items, .data-source-type .condition-items,.data-update-type .condition-items",function(){var an=jQuery(this).find(".data-select-check i").hasClass("fa-square-o");if(an){jQuery(this).find(".data-select-check i").removeClass("fa-square-o");jQuery(this).find(".data-select-check i").addClass("fa-check-square-o")}else{jQuery(this).find(".data-select-check i").removeClass("fa-check-square-o");jQuery(this).find(".data-select-check i").addClass("fa-square-o")}})}function N(an){if(an=="dataService"){if(jQuery.inArray("dataSource",z)>-1){jQuery(".data-source-type .data-multi-cancel").trigger("click")}if(jQuery.inArray("dataUpdate",z)>-1){jQuery(".data-update-type .data-multi-cancel").trigger("click")}}else{if(an=="dataSource"){if(jQuery.inArray("dataService",z)>-1){jQuery(".data-service-type .data-multi-cancel").trigger("click")}if(jQuery.inArray("dataUpdate",z)>-1){jQuery(".data-update-type .data-multi-cancel").trigger("click")}}else{if(an=="dataUpdate"){if(jQuery.inArray("dataService",z)>-1){jQuery(".data-service-type .data-multi-cancel").trigger("click")}if(jQuery.inArray("dataSource",z)>-1){jQuery(".data-source-type .data-multi-cancel").trigger("click")}}}}}function q(){jQuery(".data-multi-submit").on("click",function(){jQuery(this).parent().parent().find(".condition-items").css("margin-left","30px");var aw=jQuery(this).parent().parent().find(".data-items").attr("name");if(aw=="dataService"){O=[]}else{if(aw=="dataSource"){L=[]}else{if(aw=="dataUpdate"){ae=[]}}}var av=[];var at=null;var ay=null;var an=false;jQuery(this).parent().parent().find(".data-select-check").each(function(){if(jQuery(this).find("i").hasClass("fa-check-square-o")){an=true;at=jQuery(this).parent().find("span").html();av.push(at);ay=jQuery(this).parent().attr("value");if(aw=="dataService"){O.push(ay)}else{if(aw=="dataSource"){L.push(ay)}else{if(aw=="dataUpdate"){ae.push(ay)}}}}});if(an){var ar=av.join("、");var au=jQuery.inArray(aw,X);if(au>-1){jQuery("#"+aw+" .data-condition-content").html(ar);var ax=jQuery("#"+aw+" .data-condition-type").html();var ar=jQuery("#"+aw+" .data-condition-content").html();jQuery("#"+aw).attr("title",ax+ar)}else{var aq=H(aw,ar);jQuery(".data-condition").append(aq)}}else{var au=jQuery.inArray(aw,X);if(au>-1){jQuery("#"+aw).remove()}}if(aw=="dataService"&&C){jQuery(".data-service-type .data-items-more").removeClass("hide");jQuery(".data-service-type .moreItems").addClass("hide")}if(aw=="dataService"){Q("common")}jQuery(this).parent().parent().find(".data-select-check").each(function(){if(jQuery(this).find("i").hasClass("fa-check-square-o")){jQuery(this).find("i").removeClass("fa-check-square-o");jQuery(this).find("i").addClass("fa-square-o")}});jQuery(this).parent().parent().find(".data-select-check").addClass("hide");jQuery(this).parent().parent().removeClass("data-height-auto");jQuery(this).parent().parent().find(".data-select-button").addClass("hide");jQuery(this).parent().parent().find(".data-multi-select").removeClass("hide");var ap=jQuery(this).parent().parent().find(".data-items").attr("name");for(var ao=0;ao<z.length;ao++){if(ap==z[ao]){z.splice(ao,1);break}}S(true)})}function ad(){jQuery(".data-multi-cancel").on("click",function(){jQuery(this).parent().parent().find(".condition-items").css("margin-left","30px");var ao=jQuery(this).parent().parent().find(".data-items").attr("name");if(ao=="dataService"&&C){jQuery(".data-service-type .data-items-more").removeClass("hide");jQuery(".data-service-type .moreItems").addClass("hide");if(jQuery("#moreIcon").hasClass("fa-caret-up")){jQuery("#moreText").text("更多");jQuery("#moreIcon").removeClass("fa-caret-up");jQuery("#moreIcon").addClass("fa-caret-down");jQuery(".data-service-type").css("height","36px")}}jQuery(this).parent().parent().find(".data-select-check").each(function(){if(jQuery(this).find("i").hasClass("fa-check-square-o")){jQuery(this).find("i").removeClass("fa-check-square-o");jQuery(this).find("i").addClass("fa-square-o")}});jQuery(this).parent().parent().find(".data-select-check").addClass("hide");jQuery(this).parent().parent().removeClass("data-height-auto");jQuery(this).parent().parent().find(".data-select-button").addClass("hide");jQuery(this).parent().parent().find(".data-multi-select").removeClass("hide");if(ao=="dataService"){Q("common")}var ap=jQuery(this).parent().parent().find(".data-items").attr("name");for(var an=0;an<z.length;an++){if(ap==z[an]){z.splice(an,1);break}}})}function ag(an,ao){if(an=="dataService"){O=[];O.push(ao)}else{if(an=="dataSource"){L=[];L.push(ao)}else{if(an=="dataUpdate"){ae=[];ae.push(ao)}}}}function D(){jQuery("#dataSearch").on("click",function(){S(true)});jQuery("#dataName").keydown(function(an){if(an.keyCode==13){S(true)}})}function S(ap){r();if(ap){J=20;o=1}var an=jQuery("#dataName").val();var ao=jQuery("#orderType .data-item-border").attr("name");y.ajax({url:y.handleUrlParam("/platform/resmanage/data/query-data-list"),data:{pageNum:o,pageSize:J,dataName:an,serviceCondition:JSON.stringify(O),sourceCondition:JSON.stringify(L.sort()),updateCondition:JSON.stringify(ae),orderType:ao,_t:(new Date()).getTime()},success:function(aq){if(aq.resFlag=="success"){B(aq.dataList.rows,aq.dataList.total,aq.companyFlag,ap)}else{jQuery("#dataUl").html("");jQuery("#page").page("destroy");jQuery("#dataListLoading").css("width","99.5%").delay(200).fadeOut(400,function(){jQuery(this).remove()})}},error:function(aq){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:"提示",message:aq.responseText||"查询数据表异常！"})}})}function r(){jQuery("#dataListLoading").remove();jQuery("<div>",{id:"dataListLoading","class":"loadingbar waiting dataListLoading",html:"<dt/><dd/>"}).appendTo(".data-list-loading");jQuery("#dataListLoading").width((50+Math.random()*30)+"%")}function B(an,ap,ao,aq){A(an,ao);g(ap,aq);jQuery("#dataListLoading").css("width","99.5%").delay(200).fadeOut(400,function(){jQuery(this).remove()})}function A(az,ay){jQuery("#dataUl").html("");$("body,html").animate({scrollTop:0},100);var av=null;var aA=null;var at=null;var an=null;var ax=null;var ap=null;var aB=null;var aq=null;var ao=az.length;for(var au=0;au<ao;au++){av=az[au];aA=av.dataType;at=av.dataId;an=av.importState;ap=av.dataName;aB=av.isShare;ax=av.modType;aq=av.interfaceFlag;var aw="";aw+='<li class="dataLi data-list-li" id="'+at+'">';if(Y==an){aw+='<div class="indiv-nofloat">';aw+='<div class="indicatorContainerWrap icon-mp">';aw+=' <div id="indicatorContainer" class="indicatorContainer"></div>';if(ak==aA){aw+='<div class="prgLogo table-contcat-working-icon"></div>'}else{aw+='<div class="prgLogo data-importing-icon"></div>'}aw+="</div>";aw+='<div class="dataText">';aw+='<div class="dataName">'+ap+"</div>";aw+='<div class="dataState">正在导入</div>';aw+="</div></div></li>"}else{aw+='<div class="indiv">';aw+='<div class="indicatorContainerWrap icon-mp">';var ar="";if(G==an||"A"==an){ar="导入成功";if(m==aA){aw+='<div class="successPic data-file-icon"></div>'}else{if(e==aA){aw+='<div class="successPic data-table-icon"></div>'}else{if(f==aA){aw+='<div class="successPic data-openapi-icon"></div>'}else{if(ak==aA){aw+='<div class="successPic data-contcat-icon"></div>'}else{if(T==aA){aw+='<div class="successPic data-directtab-icon"></div>';ar="直连数据"}else{if(ac==aA){aw+='<div class="successPic data-table-view-icon"></div>';ar="视图"}}}}}}}else{if(P==an){ar="等待导入";aw+='<div class="successPic data-waiting-icon"></div>'}else{if(Z==an){ar="导入失败";aw+='<div class="successPic data-failure-icon"></div>'}else{ar="等待调度";aw+='<div class="successPic data-dispatch-icon"></div>'}}}aw+="</div>";aw+='<div class="dataText">';aw+='<div id="dataNameDiv" class="dataName">'+ap+"</div>";aw+='<div class="dataState">'+ar+"</div>";aw+="</div></div>";aw+='<div class="list-container">';aw+='<ul class="btn-list">';if(G==an||"A"==an){aw+='<li class="viewData">';aw+='<div tooltitle="查看" class="query-data-pic tool-title-div"></div>';aw+="</li>";if("0"==aB){if(f!=aA){aw+='<li class="modData">';aw+='<div tooltitle="修改" class="modify-data-pic tool-title-div"></div>';aw+="</li>"}if(m==aA){aw+='<li class="appendData">';aw+='<div tooltitle="追加" class="append-data-pic tool-title-div"></div>';aw+="</li>"}if("1"==ay){aw+='<li class="rightData">';aw+='<div tooltitle="赋权" class="right-data-pic tool-title-div"></div>';aw+="</li>"}}if(e==aA||ak==aA||f==aA){if("0"==aB){aw+='<li class="reloadData">';aw+='<div tooltitle="重生" class="reload-data-pic tool-title-div"></div>';aw+="</li>"}}if(ak!=aA&&T!=aA&&ac!=aA){aw+='<li class="linkData">';aw+='<div tooltitle="连接" class="linkdata-data-pic tool-title-div"></div>';aw+="</li>"}aw+='<li class="createReport">';aw+='<div tooltitle="仪表板" class="report-data-pic tool-title-div"></div>';aw+="</li>";if("0"==aB){aw+='<li class="delData">';aw+='<div tooltitle="删除" class="delete-data-pic tool-title-div"></div>';aw+="</li>"}}else{if(Z==an||P==an||ai==an){if("0"==aB){if(f!=aA){if(ax=="3"){aw+='<li class="appendData">';aw+='<div tooltitle="追加" class="append-data-pic tool-title-div"></div>';aw+="</li>"}else{aw+='<li class="modData">';aw+='<div tooltitle="修改" class="modify-data-pic tool-title-div"></div>';aw+="</li>"}}aw+='<li class="delData">';aw+='<div tooltitle="删除" class="delete-data-pic tool-title-div"></div>';aw+="</li>"}}}aw+='</ul></div><input type="hidden" id="dataType" value="'+aA+'">';aw+='<input type="hidden" id="interfaceFlag" value="'+aq+'"></li>'}jQuery("#dataUl").append(aw)}E();d()}function d(){var aq=[];var ar=null;var ao=jQuery(".indicatorContainer");var at=[];var an=0;for(var ap=0;ap<ao.length;ap++){ar=jQuery(ao[ap]).radialIndicatorTemp({barColor:"#1baf80",barWidth:5,initValue:0,radius:32});aq.push(ar);at.push(an)}setInterval(function(){for(var au=0;au<aq.length;au++){aq[au].value(at[au]+=1)}for(var au=0;au<at.length;au++){if(at[au]>100){at[au]=0}}},200)}function c(){jQuery(".btn-list .tool-title-div").poshytip({className:"tip-yellowsimple",content:function(){var ao=jQuery("<div>",{"class":"btn-tip-msg"});var an=jQuery("<div>",{"class":"btn-tip-name",html:jQuery(this).attr("tooltitle")});ao.append(an);return ao},showTimeout:0,hideTimeout:0,alignTo:"target",alignX:"center",alignY:"top",offsetY:10,offsetX:0,fade:false,slide:false,liveEvents:true,allowTipHover:false,keepInViewport:false})}function E(){jQuery(".dataText .dataName").dotdotdot({line:"2"})}function g(ap,aq){if(aq){jQuery("#page").page("destroy");jQuery("#page").page({total:ap,pageSize:J,showJump:true,firstBtnText:"首页",lastBtnText:"尾页",jumpBtnText:"跳转"}).on("pageClicked",function(at,ar){o=ar+1;S(false)}).on("jumpClicked",function(at,ar){o=ar+1;S(false)});var an=jQuery(".page").width();var ao=Number(jQuery(".m-pagination-page").width())+Number(jQuery(".m-pagination-jump").width());jQuery(".m-pagination-page").css("margin-left",(an-ao)/2+"px")}}function v(){y.ajax({url:y.handleUrlParam("/platform/resmanage/data/query-classify-list"),data:{_t:(new Date()).getTime()},success:function(an){R=an.classifyList;Q("common")},error:function(an){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:"提示",message:an.responseText||"查询业务分类异常！"})}})}function Q(av){jQuery(".data-service-type .data-items .condition-items").remove();var ao=false;var aq=false;if(av=="resize"){if(jQuery("#moreIcon").hasClass("fa-caret-up")){ao=true}var ax=jQuery.inArray("dataService",z);if(ax>-1){aq=true}}var ar=jQuery(window).width();if(jQuery(window).width()<1024){ar=1024}ar=ar*0.7;var at=R.length;var az=null;var an=null;var aA=null;var ay=null;var ap=28+30+28;for(var au=0;au<at;au++){az=R[au];an=az.classifyName;if(an.length>14){ay=200+30}else{ay=30+an.length*14}aA=az.classifyId;ap+=ay;var aw="";if(ap>ar){C=true;if(ao){aw+='<div class="condition-items" value="'+aA+'">'}else{if(aq){aw+='<div class="condition-items" value="'+aA+'">'}else{aw+='<div class="condition-items hide moreItems" value="'+aA+'">'}}}else{aw+='<div class="condition-items" value="'+aA+'">'}if(aq){aw+=' <div class="data-select-check">'}else{aw+=' <div class="data-select-check hide">'}aw+=' 	<i class="fa fa-square-o"></i>';aw+=" </div>";aw+=' <span title="'+an+'">'+an+"</span>";aw+="</div>";jQuery(".data-service-type .data-items").append(aw)}if(av!="resize"){if(C){jQuery(".data-service-type .data-items-more").removeClass("hide")}jQuery(".data-service-type .data-multi-select").removeClass("hide")}if(aq){jQuery(".data-service-type  .condition-items").css("margin-left","0px")}else{jQuery(".data-service-type  .condition-items").css("margin-left","30px")}jQuery(".data-service-type .condition-items").hover(function(){jQuery(this).find(".data-select-check i").addClass("items-hover-show")},function(){jQuery(this).find(".data-select-check i").removeClass("items-hover-show")})}function al(){jQuery("#dataUl").on("click",".data-list-li .list-container .btn-list .viewData",function(){jQuery(".btn-list .tool-title-div").poshytip("hide");var an=jQuery(this).parent().parent().parent().attr("id");var ap=jQuery(this).parent().parent().parent().find("#dataType").val();var ao=y.handleUrlParam("/platform/resmanage/data/data-common-view");var aq={dataId:an,type:ap};if(ak==ap){ao=y.handleUrlParam("/platform/resmanage/datalink/data-link-show");aq={dataLinkId:an}}W(ao,aq)});jQuery("#dataUl").on("click",".data-list-li .list-container .btn-list .modData",function(){var an=jQuery(this).parent().parent().parent().attr("id");var ap=jQuery(this).parent().parent().parent().find("#dataType").val();var ao=jQuery(this).parent().parent().parent().find("#interfaceFlag").val();jQuery(".btn-list .tool-title-div").poshytip("hide");if(m==ap){j("edit",an)}else{if(e==ap){if(ao=="0"){V(an)}else{am(an)}}else{if(ak==ap){b(an,"modify")}else{if(T==ap){w(an)}else{if(ac==ap){p(an)}}}}}});jQuery("#dataUl").on("click",".data-list-li .list-container .btn-list .appendData",function(){var an=jQuery(this).parent().parent().parent().attr("id");jQuery(".btn-list .tool-title-div").poshytip("hide");j("append",an)});jQuery("#dataUl").on("click",".data-list-li .list-container .btn-list .reloadData",function(){jQuery(".btn-list .tool-title-div").poshytip("hide");var an=jQuery(this).parent().parent().parent().attr("id");var ao=jQuery(this).parent().parent().parent().find("#dataType").val();if(e==ao){bi.dialog.confirm({title:y.getMessage("data.dataLink.label.prompt"),message:y.getMessage("data.datlist.label.sureRebuild"),callback:function(ap){if(ap){y.ajax({url:y.handleUrlParam("/platform/resmanage/data/regen-table-data"),data:{dataId:an},success:function(aq){if(aq.resFlag=="success"){bi.dialog.show({type:bi.dialog.TYPE_INFO,title:y.getMessage("data.dataLink.label.prompt"),message:y.getMessage("data.datlist.label.regenSuccess")});S(true)}else{bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:aq.msg});return}},error:function(aq){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:aq.responseText||y.getMessage("data.datlist.label.regenException")})}})}}})}else{if(ak==ao){bi.dialog.confirm({title:y.getMessage("data.dataLink.label.prompt"),message:y.getMessage("data.datlist.label.sureRebuild"),callback:function(ap){if(ap){l(an)}}})}}});jQuery("#dataUl").on("click",".data-list-li .list-container .btn-list .linkData",function(){var an=jQuery(this).parent().parent().parent().attr("id");var ao="add";jQuery(".btn-list .tool-title-div").poshytip("hide");b(an,ao)});jQuery("#dataUl").on("click",".data-list-li .list-container .btn-list .createReport",function(){jQuery(".btn-list .tool-title-div").poshytip("hide");var ao=jQuery(this).parent().parent().parent().attr("id");var ap=jQuery(this).parent().parent().parent().find("#dataType").val();var an=jQuery(this).parent().parent().parent().find("#dataNameDiv").text();ah(ap,ao);k(ao,an,ap)});jQuery("#dataUl").on("click",".data-list-li .list-container .btn-list .delData",function(){var an=jQuery(this).parent().parent().parent().attr("id");var ao=jQuery(this).parent().parent().parent().find("#dataType").val();jQuery(".btn-list .tool-title-div").poshytip("hide");i(an,ao)});jQuery("#dataUl").on("click",".data-list-li .list-container .btn-list .rightData",function(){jQuery(".btn-list .tool-title-div").poshytip("hide");var an=jQuery(this).parent().parent().parent().attr("id");ab("2",an)})}function l(an){var ao={dataId:an};y.ajax({url:y.handleUrlParam("/platform/resmanage/datalink/update-datalink-state"),data:ao,success:function(ap){bi.dialog.show({type:bi.dialog.TYPE_INFO,title:y.getMessage("data.dataLink.label.prompt"),message:y.getMessage("data.datlist.label.regenSuccess")});S(true)},error:function(ap){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:ap.responseText||y.getMessage("data.import.message.sysAbnormal")})}})}function j(ap,an){var ao=y.handleUrlParam("/platform/resmanage/data/data-file-import");var aq={};if(an!=""){aq.dataId=an}aq.type=ap;W(ao,aq)}function V(an){var ap={};if(an!=""){ap.dataId=an}var ao=y.handleUrlParam("/platform/resmanage/data/data-table-import");W(ao,ap)}function af(an){var ap={};if(an!=""){ap.dataId=an}var ao=y.handleUrlParam("/platform/resmanage/data/data-table-import-direct");W(ao,ap)}function p(an){var ap={};if(an!=""){ap.dataId=an}var ao=y.handleUrlParam("/platform/resmanage/tableview/table-view");W(ao,ap)}function w(an){var ap={};if(an!=""){ap.dataId=an}var ao=y.handleUrlParam("/platform/resmanage/data/data-table-import-direct");W(ao,ap)}function p(an){var ap={};if(an!=""){ap.viewId=an}var ao=y.handleUrlParam("/platform/resmanage/tableview/table-view");W(ao,ap)}function am(an){var ap={};if(an!=""){ap.dataId=an}var ao=y.handleUrlParam("/platform/resmanage/data/data-table-import-dacp");W(ao,ap)}function k(ap,an,ao){var ar={};ar.dataId=ap;ar.dataName=an;ar.dataType=ao;var aq=y.handleUrlParam("/platform/dataview/create");W(aq,ar)}function b(an,ap){var aq={};aq.dataId=an;aq.linkModifyFlag=ap;var ao=y.handleUrlParam("/platform/resmanage/datalink/data-link");W(ao,aq)}function ab(ap,an){var ao=y.handleUrlParam("/platform/resmanage/db/data-user-select");bi.dialog.show({title:"用户选择",message:jQuery('<div id="userList"></div>').load(ao),spinicon:"glyphicon glyphicon-refresh",cssClass:"data-userList",onshown:function(aq){U.init(ap,an)},buttons:[{label:y.getMessage("data.dataLink.label.Sure"),cssClass:"btn-info",action:function(aq){U.saveUserSelect()}},{label:y.getMessage("data.dataLink.label.Cancel"),cssClass:"btn-default",action:function(aq){aq.close()}}]})}function W(ap,ar){var aq="";for(var ao in ar){aq+="<input name='"+ao+"' value='"+ar[ao]+"'/>"}var an=jQuery("<form></form>",{method:"post",action:ap,target:"_blank",html:aq});jQuery("body").append(an);an.submit();jQuery(an).remove()}function i(ao,an){var ap={dataId:ao,dataType:an};var aq="";if(m==an){aq="data.datlist.label.sureDelFD"}else{if(e==an){aq="data.datlist.label.sureDelTD"}else{if(f==an){aq="您确定需要删除该OpenApi数据吗？"}else{if(ak==an){aq="data.datlist.label.delDataLink"}else{if(T==an){aq="data.datlist.label.sureDelTD"}else{if(ac==an){aq="您确定需要删除该视图数据吗？"}}}}}}y.ajax({url:y.handleUrlParam("/platform/resmanage/datalink/data-usedby-report"),data:ap,success:function(ar){if(ar.viewCount>0){aq="data.datlist.label.ViewReference"}if(ar.reportUseList.length>0){aq="data.datlist.label.ReportReference"}if(ar.reportUseList.length>0||ar.viewCount>0){bi.dialog.confirm({title:y.getMessage("data.dataLink.label.prompt"),message:y.getMessage(aq),callback:function(at){if(at){if(ak==an){aa(ao)}else{if(f==an){t(ao)}else{M(an,ao)}}}}})}else{bi.dialog.confirm({title:y.getMessage("data.dataLink.label.prompt"),message:y.getMessage(aq),callback:function(at){if(at){if(ak==an){aa(ao)}else{if(f==an){t(ao)}else{M(an,ao)}}}}})}},error:function(ar){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:ar.responseText||y.getMessage("data.import.message.sysAbnormal")})}})}function aa(an){var ao={dataId:an};y.ajax({url:y.handleUrlParam("/platform/resmanage/datalink/delete-data-link"),data:ao,loading:{title:y.getMessage("data.dataLink.label.prompt"),text:"正在删除数据..."},success:function(aq){if(aq.resFlag=="success"){bi.dialog.show({type:bi.dialog.TYPE_INFO,title:y.getMessage("data.dataLink.label.prompt"),message:y.getMessage("data.datlist.label.delSuccess"),buttons:[{label:y.getMessage("data.dataLink.label.Sure"),cssClass:"btn-info",action:function(ar){S(true);ar.close()}}]})}else{var ap=y.getMessage("data.import.message.sysAbnormal");if(!y.IsEmpty(aq.msg)){ap=aq.msg}bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:ap});return}},error:function(ap){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:ap.responseText||y.getMessage("data.import.message.sysAbnormal")})}})}function M(ap,an){var ao=y.handleUrlParam("/platform/resmanage/data/delete-data-file");if(e==ap){ao=y.handleUrlParam("/platform/resmanage/data/delete-data-table")}else{if(T==ap){ao=y.handleUrlParam("/platform/resmanage/data/delete-data-connect-table")}else{if(ac==ap){ao=y.handleUrlParam("/platform/resmanage/data/delete-table-view")}}}y.ajax({url:ao,data:{dataId:an,dataType:ap},loading:{title:y.getMessage("data.dataLink.label.prompt"),text:"正在删除数据..."},success:function(aq){if(aq.resFlag=="success"){bi.dialog.show({type:bi.dialog.TYPE_INFO,title:y.getMessage("data.dataLink.label.prompt"),message:y.getMessage("data.datlist.label.delSuccess"),buttons:[{label:y.getMessage("data.dataLink.label.Sure"),cssClass:"btn-info",action:function(ar){S(true);ar.close()}}]})}else{bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:aq.msg});return}},error:function(aq){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:aq.responseText||y.getMessage("data.datlist.label.delException")})}})}function t(an){y.ajax({url:y.handleUrlParam("/platform/resmanage/data/delete-open-api"),data:{dataId:an},loading:{title:y.getMessage("data.dataLink.label.prompt"),text:"正在删除数据..."},success:function(ao){if(ao.resFlag=="success"){bi.dialog.show({type:bi.dialog.TYPE_INFO,title:y.getMessage("data.dataLink.label.prompt"),message:y.getMessage("data.datlist.label.delSuccess"),buttons:[{label:y.getMessage("data.dataLink.label.Sure"),cssClass:"btn-info",action:function(ap){S(true);ap.close()}}]})}else{bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:ao.msg});return}},error:function(ao){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:ao.responseText||y.getMessage("data.datlist.label.delException")})}})}function ah(ao,an){y.ajax({url:y.handleUrlParam("/platform/resmanage/data/set-hit-count"),data:{type:ao,dataId:an},success:function(ap){},error:function(ap){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:y.getMessage("data.dataLink.label.prompt"),message:ap.responseText||"设置数据表热度异常！"})}})}function x(){jQuery(window).scroll(function(){if(jQuery(window).scrollTop()>=100){jQuery(".actGotop").fadeIn(300)}else{jQuery(".actGotop").fadeOut(300)}});jQuery(".actGotop").click(function(){jQuery("html,body").animate({scrollTop:"0px"},800)})}jQuery(window).resize(function(){Q("resize")});function K(){var an=jQuery(window).height()-153;jQuery("#dataUl").css({height:an})}window.reloadDataList=function(){S(true)}});