define(["sabace"],function(a){jQuery(function(){jQuery(".page").on("click",".number",function(){jQuery(".page div").removeClass("clickBtn").addClass("normalBtn theme-background-deep");jQuery(this).addClass("clickBtn").removeClass("normalBtn theme-background-deep")});var b="a";jQuery(".page").on("click",".number",function(){var g=jQuery(this);var d=g.find("span").html()-1;var e=g.attr("reportId");if(b==d){return}b=d;var f=jQuery(".ifrDiv").eq(d);if(f.find("iframe").attr("src")==undefined){var c=a.handleUrlParam("/platform/dataview/view")+"?reportId="+e+"&date="+new Date();f.find("iframe").attr("src",c)}jQuery(".ifrDiv").fadeOut("slow");jQuery("body").animate({scrollTop:0},1);f.fadeIn("slow",function(){var h=g.attr("reportId");a.ajax({data:{reportId:h},url:a.handleUrlParam("/platform/myhome/record-visit"),success:function(i){},error:function(i){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("top.label.fail"),message:i.responseText})}})})});jQuery("#opt").bind("click",function(){window.location.href=a.handleUrlParam("/platform/myhome/my-home-setting")});a.ajax({async:false,url:a.handleUrlParam("/platform/myreport/view/query-myhome"),success:function(c){jQuery.each(c,function(f,e){jQuery(".page").append('<div class="normalBtn number" reportName="'+e.reportName+'" reportDesc="'+e.reportDesc+'" reportId="'+e.reportId+'"><span>'+(f+1)+"</span></div>")});if(c.length>0){jQuery(".number").eq(0).trigger("click")}else{var d=jQuery(".ifrDiv").eq(0);d.show();d.find("img").show()}},error:function(c){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("top.label.fail"),message:c.responseText})}});$(".page .number").poshytip({className:"tip-yellowsimple",content:function(){var e=jQuery(this);var d=jQuery("<div>",{"class":"report-msg"});var c=jQuery("<div>",{"class":"report-name",html:e.attr("reportName")});d.append(c);return d},showTimeout:3,alignTo:"target",alignX:"left",alignY:"center",offsetY:2,offsetX:10,keepInViewport:false})})});