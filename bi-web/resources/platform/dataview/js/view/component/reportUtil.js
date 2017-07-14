define(["view/box","bace"],function(a,c){var b={};b.module={labelNameArray:null};b.control={show:function(){var e=$("#saveReportPanel");if(!e.length){$("<div></div>",{id:"saveReportPanel","class":"validationEngineContainer",style:"display:none"}).appendTo("body");var h=c.handleUrlParam("/platform/dataview/saveViewPage");$("#saveReportPanel").load(h,function(){b.view.show();var j=new Date();var k=new Date(j.getTime()+30*24*60*60*1000);var i=k.getFullYear()+"-"+(k.getMonth()+1)+"-"+k.getDate();$("#expireDatesave").val(i);$("#expireDatesave").datepicker({onSelect:function(l){this.focus();this.blur()},minDate:j,dateFormat:"yy-mm-dd",changeMonth:true,changeYear:true});b.view.bindEvent();b.module.labelNameArray=$("#saveReportPanel .unSelectedPanel").find(".text").arrayAttr("innerText","prop");if(a.flags.isRealtimeapp){$("#allowComment").parent().parent().remove()}if(a.main.reportId){$("#reportName").val(a.main.reportName);$("#reportDesc").val(a.main.reportDesc);$("#expireDatesave").val(a.main.expireDate);if(a.main.labelId){b.view.addSelectLabel(a.main.labelId)}if(a.main.allowComment==0){jQuery("#allowComment").removeClass("checked")}}$("#naviLevel1").chosen({disable_search:true});$("#naviLevel2").chosen({disable_search:true});b.view.initNavi(a.main.reportId)})}else{b.view.show();var f=new Date();var g=new Date(f.getTime()+30*24*60*60*1000);var d=g.getFullYear()+"-"+(g.getMonth()+1)+"-"+g.getDay();$("#expireDatesave").attr("value",d);$("#expireDatesave").datepicker({onSelect:function(i){this.focus();this.blur()},minDate:new Date(),dateFormat:"yy-mm-dd",changeMonth:true,changeYear:true,})}},save:function(d){$.Deferred(b.view.getThumbURL).done(function(e){if(a.flags.isRealtimeapp){var g=a.main.realTimeappConfig;var f=b.control.getSelectedId()||[""];var k={reportId:a.main.reportId,dataId:a.main.dataId,urlMenuInfo:"",reportName:$("#reportName").val(),reportDesc:$("#reportDesc").val(),expireDate:$("#expireDatesave").val(),naviLevel1:$("#naviLevel1").val(),naviLevel2:$("#naviLevel2").val(),allowComment:0,labelId:f.join(","),thumbURL:"",appType:"1"};g.imgSrc=sessionStorage.imgSrc?sessionStorage.imgSrc:"";k.resportConfig=$.toJSON(g)}else{var g=a.Widgets.start("collect");var j=g.widgets;var f=b.control.getSelectedId()||[""];var k={reportId:a.main.reportId,dataId:a.main.dataId,urlMenuInfo:$.toJSON(a.main.urlMenuInfo),reportName:$("#reportName").val(),reportDesc:$("#reportDesc").val(),expireDate:$("#expireDatesave").val(),naviLevel1:$("#naviLevel1").val(),naviLevel2:$("#naviLevel2").val(),allowComment:$("#allowComment").hasClass("checked")?1:0,labelId:f.join(","),thumbURL:e,appType:"0"};if(discovery=="1"){k.reportId="";for(var h=0;h<j.length;h++){j[h].option.config.build.dataParams.filterJsonStr=""}}g.imgSrc=sessionStorage.imgSrc?sessionStorage.imgSrc:"";k.resportConfig=$.toJSON(g)}d.resolve($.ajax({type:"POST",url:c.handleUrlParam("/platform/dataview/saveViewInfo"),dataType:"json",data:k}))})},saveLabel:function(d,e){$.ajax({type:"POST",url:c.handleUrlParam("/platform/dataview/addNewLabel"),dataType:"json",data:{labelName:d.labelName,labelId:d.labelId||"",labelType:"2",},success:function(f){if(f.labelId){b.module.labelNameArray.push(d.labelName);e?e(f.labelId):""}return true},error:function(){log(JSON.stringify(arguments));$.dialog.alert("保存标签失败");return false}})},getSelectedId:function(){return $("#saveReportPanel .selectedPanel").find("div.label").arrayAttr("data-id")},getSelectedText:function(){return $("#saveReportPanel .selectedPanel").find("div.label .name").arrayAttr("innerText","prop")}};b.view={show:function(){$.dialog({id:"saveDialog",title:"保存当前数据可视化",padding:"0",width:"600px",height:"400px",lock:true,content:$("#saveReportPanel")[0],ok:function(){var f=jQuery("#saveReportPanel").validationEngine("validate");if(!f){return false}var e=$("#naviLevel1").val();var d=$("#naviLevel2").val();if(!e||!d){$.dialog.alert("请选择正确的导航信息!");return false}$.dialog.confirm("您确定保存该可视化信息吗？",function(){var h=this;var g=$("#tableChartPanel .container");g.each(function(k,j){var m=$(j);var l=m.data("option");if(l.chartType=="table"){m.find("td[field]>div").each(function(){$(this).width($(this).width())})}});$.Deferred(b.control.save).done(function(i){i.then(function(j){log(j);if("ERROR"==j.result){h.showError("保存失败，请您稍后重新提交或者咨询相关人员！")}else{a.main.reportId=j.reportId;h.showSucceed("保存成功，您可以在仪表板管理里查看该可视化分析！","close");g.each(function(l,k){var n=$(k);var m=n.data("option");if(m.chartType=="table"){n.find("td[field]>div").each(function(){$(this)[0].style.width=""})}})}},function(){h.showError("保存失败，请您稍后重新提交或者咨询相关人员！")})});return false});return false},okVal:"保存",cancelVal:"关闭",cancel:function(){return true}})},addSelectLabel:function(e){var o=[];var f=jQuery("#saveReportPanel .unSelectedPanel");var l=$("#saveReportPanel .selectedPanel");for(var k=0,g=e.length;k<g;k++){var j=f.find(".label:eq("+k+")").attr("class");var m=j?j.match(/blue|red|yellow|green/g):"green";var h=b.view.getNextColor(m);var d=e[k].labelId;f.find("div[data-id='"+d+"']").addClass("disabeld");o.push($("<div></div>",{"class":"label "+h+" ladda-button","data-style":"expand-left","data-id":d,"data-spinner-color":"#2175BD",html:'<div class="text no-select"><span class="name">'+e[k].labelName+'</span></div><div class="close"><i class="fa fa-close"></i></div>'}))}l.append(o)},addLabel:function(){var f=jQuery("#saveReportPanel .unSelectedPanel");var g=f.find(".label:eq(0)").attr("class");var d=g?g.match(/blue|red|yellow|green/g):"green";var e=b.view.getNextColor(d);if(f.find("input:visible").length==0){$("<div></div>",{"class":"label "+e+" ladda-button","data-style":"expand-left","data-spinner-color":"#2175BD",html:'<div class="text no-select"><span class="name"></span><input class="bi-input validate[required]"/></div><div class="close"><i class="fa fa-close"></i></div>'}).prependTo(f)}f.find("input:visible").focus()},getNextColor:function(d,f){var g=["red","green","yellow","blue"];var e=0;var f=f||"next";if(f=="prev"){e=g.indexOf(d)-1;e=e==-1?0:e}else{e=g.indexOf(d)+1;e=e==4?0:e}return g[e]},copyLabel:function(d){var f=d.find(".text").text();var e=d.attr("class").match(/blue|red|yellow|green/g);return $("<div></div>",{"class":"label "+e,"data-id":d.attr("data-id"),html:'<div class="text no-select"><span class="name">'+f+'</span></div><div class="close"><i class="fa fa-close"></i></div>'})},deleteLabelById:function(d){return $.ajax({type:"POST",url:c.handleUrlParam("/platform/dataview/deleteLabelById"),dataType:"json",data:{labelId:d}})},getThumbURL:function(e){if(a.flags.isRealtimeapp){e.resolve("");return e}jQuery("#gridBg,#tableChartPanel").removeClass("grid-bg");var k=jQuery("#tableChartPanel");k.animate({scrollTop:0},0);jQuery("#thumb_canvas").remove();var h=[];var l=[];var i=[];var g=[];jQuery("#tableChartPanel .container").each(function(){var n=$(this);h.push(n.position().top);l.push(n.position().top+n.parent().scrollTop()+n.height()+20);i.push(n.position().left+n.parent().scrollLeft());g.push(n.position().left+n.parent().scrollLeft()+n.width())});var f=Math.min.apply({},h)-20;f=f<0?0:f;var j=Math.max.apply({},l)+20;var d=Math.min.apply({},i)-20;var m=Math.max.apply({},g)+20;log("firstTop:"+f);log("lastBottom:"+j);log("firstLeft:"+d);log("lastRight:"+m);html2canvas(document.getElementById("tableChartPanel"),{onrendered:function(p){var r=0;var o=0;var n=m+400;var s=j+400;var w=n;var q=s;var v=-d;var u=-f;log("destX: "+v);log("destY: "+u);var t=new Image();t.src=p.toDataURL("image/png");t.onload=function(){log(t.src);var z=m-d;var x=j-f;log("width:"+z);log("height:"+z/2);var B=document.createElement("canvas");B.setAttribute("id","thumb_canvas");B.style.display="none";B.width=z;B.height=z/2+40;document.body.appendChild(B);var A=document.getElementById("thumb_canvas");var y=A.getContext("2d");y.drawImage(t,r,o,n,s,v,u,w,q);document.body.appendChild(A);log("图形生成完毕");log(A.toDataURL("image/png"));jQuery("#gridBg,#tableChartPanel").addClass("grid-bg");e.resolve(A.toDataURL("image/png"))}},width:m+500,height:j+500});return e},bindEvent:function(){jQuery("#saveReportPanel").validationEngine({autoHidePrompt:true,autoHideDelay:2000,binded:true,promptPosition:"bottomLeft",showOneMessage:true,});c.autoScroll(jQuery("#saveReportPanel .unSelectedPanel,#saveReportPanel .selectedPanel"));jQuery("#saveReportPanel .selectTitle").on("click",".addLabel",function(){b.view.addLabel()});jQuery("#saveReportPanel .unSelectedPanel").on("blur keyup","input:visible",function(f){var h=$(this);var e=h.val();if((f.keyCode=="13"||f.type==="blur")&&e){var g=h.parents(".label").attr("data-id");if(g&&e){log("修改");b.control.saveLabel({labelName:e,labelId:g},function(){h.hide();h.parent().find(".name").show().text(e);h.validationEngine("showPrompt","修改成功，单击为您的可视化贴上标签！","error","bottomLeft",true,3000);jQuery("#saveReportPanel .selectedPanel").find(".label[data-id="+g+"] .name").text(e);if($.inArray(e,b.control.getSelectedText())>-1){h.parents(".label").addClass("disabeld")}})}else{if($.inArray(e,b.module.labelArray)>-1){h.validationEngine("showPrompt","该标签名称已存在了，请重新录入！","error","bottomLeft",true,30000);h.select();return}else{b.control.saveLabel({labelName:e},function(i){h.parents(".label").attr("data-id",i);h.hide();h.parent().find(".name").text(e);h.validationEngine("showPrompt","保存成功，单击为您的可视化贴上标签！","error","bottomLeft",true,3000)})}}}});jQuery("#saveReportPanel .unSelectedPanel").on("input keyup",".bi-input",function(e){if(e.keyCode!="13"){$(this).validationEngine("hide")}});var d=null;jQuery("#saveReportPanel .unSelectedPanel").on("click",".label",function(){clearTimeout(d);var e=$(this);$(this).validationEngine("hide");d=setTimeout(function(){if(e.find("input:visible").length==0&&!e.hasClass("disabeld")){var f=b.view.copyLabel(e);jQuery("#saveReportPanel .selectedPanel").prepend(f);e.addClass("disabeld")}},200)});jQuery("#saveReportPanel .unSelectedPanel").on("dblclick",".label",function(e){clearTimeout(d);var f=$(this);if(f.find("input").length==1&&f.find(".close").length==1){var g=f.find("input");g.show().select();g.parent().find(".name").hide();f.removeClass("disabeld")}c.stopBubble(e)});jQuery("#saveReportPanel .selectedPanel").on("click",".close",function(f){var e=jQuery(this).parents(".label");log(jQuery("#saveReportPanel .unSelectedPanel").find(".label[data-id="+e.attr("data-id")+"]"));jQuery("#saveReportPanel .unSelectedPanel").find(".label[data-id="+e.attr("data-id")+"]").removeClass("disabeld");e.remove()});jQuery("#saveReportPanel .unSelectedPanel").on("click",".close",function(f){var e=jQuery(this).parents(".label");var g=e.attr("data-id");$.dialog.confirm("您确定删除该标签吗？",function(){var h=this;b.view.deleteLabelById(g).then(function(){h.showSucceed("删除成功！",function(){e.remove()})},function(){h.showError("删除失败，请您稍后重新删除或者咨询相关人员！")});return false});c.stopBubble(f)});jQuery("#allowComment").bind("click",function(){jQuery(this).toggleClass("checked")})},initNavi:function(f){console.log("reportId="+f);var d=function(j,h,i){$.ajax({type:"POST",url:c.handleUrlParam("/platform/dataview/get-navi-level"),dataType:"json",data:{level:j,parentNaviId:h},success:function(k){i(k)},error:function(k){$.dialog.alert("初始化导航信息失败。")}})};var e=function(h){$("#naviLevel2").empty();$("#naviLevel2").append('<option value="">&nbsp</option>');$("#naviLevel2").trigger("chosen:updated");d("2",h,function(l){if(l==null||l.length==0){$("#naviLevel2").empty();$("#naviLevel2").append('<option value ="">无</option>');$("#naviLevel2").trigger("chosen:updated");return}$("#naviLevel2").empty();for(var j=0;j<l.length;j++){var k=l[j];$("#naviLevel2").append('<option value ="'+k.naviId+'">'+k.naviName+"</option>")}$("#naviLevel2").trigger("chosen:updated")});1};var g=function(){d("1","",function(k){if(k==null||k.length==0){$("#naviLevel1").empty();$("#naviLevel1").append('<option value ="">无</option>');$("#naviLevel1").trigger("chosen:updated");return}for(var h=0;h<k.length;h++){var j=k[h];if(h==0){e(j.naviId)}$("#naviLevel1").append('<option value ="'+j.naviId+'">'+j.naviName+"</option>")}$("#naviLevel1").bind("change",function(){var i=$("#naviLevel1").val();if(i!=""){e(i)}else{$("#naviLevel2").empty();$("#naviLevel2").append('<option value="">&nbsp</option>');$("#naviLevel2").trigger("chosen:updated")}});$("#naviLevel1").trigger("chosen:updated")})};if(f!=null){$.ajax({type:"POST",url:c.handleUrlParam("/platform/dataview/get-navi-info"),dataType:"json",data:{naviId:f},success:function(j){var i=j.level1;var h=j.level2;var k=j.level1s;var l=j.level2s;if(!j.status){g();return}$("#naviLevel1").empty();$.each(k,function(){$("#naviLevel1").append('<option value="'+this.naviId+'">'+this.naviName+"</option>")});$("#naviLevel2").empty();$.each(l,function(){$("#naviLevel2").append('<option value="'+this.naviId+'">'+this.naviName+"</option>")});$("#naviLevel1").find("option[value='"+i+"']").attr("selected",true);$("#naviLevel2").find("option[value='"+h+"']").attr("selected",true);$("#naviLevel1").trigger("chosen:updated");$("#naviLevel2").trigger("chosen:updated");$("#naviLevel1").bind("change",function(){var m=$("#naviLevel1").val();if(m!=""){e(m)}else{$("#naviLevel2").empty();$("#naviLevel2").append('<option value="">&nbsp</option>');$("#naviLevel2").trigger("chosen:updated")}})},error:function(){$.dialog.alert("初始化导航信息失败。");return false}})}else{g()}}};return b.control});