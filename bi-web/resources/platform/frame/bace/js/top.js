define(["sabace","top/message"],function(b,c){function f(){$(".head-font").poshytip({className:"tip-yellowsimple",content:jQuery(".tooltip-menu"),showTimeout:3,alignTo:"target",alignX:"bottom",alignY:"bottom",offsetY:2,offsetX:-100,keepInViewport:false});$(".head-img").poshytip({className:"tip-yellowsimple msg-tip",content:jQuery(".msg-menu"),showTimeout:3,alignTo:"target",alignX:"bottom",alignY:"bottom",offsetY:5,offsetX:-146,keepInViewport:false});jQuery(".msg-foot").bind("click",function(){window.location.href=b.handleUrlParam("/platform/msg/msg-list")});jQuery(".out").on("click",function(){bi.dialog.confirm({title:b.getMessage("top.msg.logout"),message:b.getMessage("top.msg.confrm.logout"),callback:function(n){if(n){b.ajax({type:"post",cache:false,dataType:"json",url:b.handleUrlParam("/platform/login/logout"),complete:function(o){document.location.href=webpath+"/"}})}}})});jQuery(".tooltip-menu .refresh").on("click",function(){bi.dialog.confirm({title:b.getMessage("top.msg.refresh"),message:b.getMessage("top.msg.confrm.refresh"),callback:function(n){if(n){b.ajax({loading:{title:b.getMessage("top.label.tip"),text:b.getMessage("top.label.pleaseWait")},url:b.handleUrlParam("/platform/login/refresh"),success:function(o){if(o.retFlag){bi.dialog.show({title:b.getMessage("top.label.succeed"),message:b.getMessage("top.msg.oper.success")})}else{bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:b.getMessage("top.label.fail"),message:b.getMessage("top.msg.oper.fail")})}},error:function(o){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:b.getMessage("top.label.fail"),message:b.getMessage("top.msg.oper.error")})}})}}})});var l=$("#bi-nav .bi-nav-child ").wookmark({autoResize:true,container:$("#bi-nav .parent"),align:"left",outerOffset:15,offset:20,onLayoutChanged:function(){var o=jQuery("#bi-nav .bi-nav-child>li").size();var n=jQuery("#bi-nav .bi-nav-child ");if(o==3){n.width("560px")}if(o==2){n.width("380px")}if(o==1){n.width("180px")}}}).css({visibility:"visible",display:"none"});jQuery("#bi-nav .parent").on("click",function(){jQuery(this).toggleClass("checked").find(".down").toggleClass("fa-caret-up fa-caret-down");jQuery(this).find(".bi-nav-child").toggle()});jQuery("body").on("click",function(o){var n=jQuery(o.target);if(!(n.parents(".parent").hasClass("parent")||n.parent().hasClass("parent"))){jQuery("#bi-nav .bi-nav-child").hide();jQuery("#bi-nav .parent").removeClass("checked").find(".fa-caret-up").toggleClass("fa-caret-up fa-caret-down")}});d();var g=b.getBV();if(g.type=="ie"){setInterval(function(){if(window.document.hasFocus()){d()}},30000)}else{var i="";i=setInterval(function(){d()},30000);var m="hidden" in document?"hidden":"webkitHidden" in document?"webkitHidden":"mozHidden" in document?"mozHidden":null;var j=m.replace(/hidden/i,"visibilitychange");var h=0;var k=function(){if(!document[m]){if(new Date().getTime()-h>20000){d()}clearInterval(i);i=setInterval(function(){d()},30000)}else{clearInterval(i);h=new Date().getTime()}};document.addEventListener(j,k)}jQuery("#msg-content").on("click",".msgDiv",function(){var n=jQuery(this);b.ajax({type:"post",cache:false,dataType:"json",url:b.handleUrlParam("/platform/msg/set-read-state"),data:{msgIdArr:n.attr("pro")},success:function(o){d();var p=b.handleUrlParam("/platform/msg/msg-info");bi.dialog.show({title:b.getMessage("msg.sabace.noRead"),cssClass:"msg-dialog",message:$('<div id="msg-dialog"></div>').load(p),spinicon:"glyphicon glyphicon-refresh",closeByBackdrop:false,closeByKeyboard:false,onshown:function(s){var v=s.getModal().find("#msg-dialog");v.find(".msg-info-title,.msg-info-time,.msg-info-content").html("");var r=n.find(".msg-level").attr("class");var u=n.find(".msg-title").html();v.find(".msg-info-title").append('<div class="'+r+'"></div>').append(u);var t=n.find(".msg-time").attr("sendUserName");var q=n.find(".msg-time").attr("sendTime");v.find(".msg-info-time").append("<div>"+b.getMessage("msg.sabace.sender")+t+"</div>").append("<div>"+q+"</div>");v.find(".msg-info-content").append(n.find(".msg-content").html())},buttons:[{label:b.getMessage("msg.sabace.close"),cssClass:"btn-info",action:function(q){q.close()}}]})},error:function(o){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:b.getMessage("top.label.fail"),message:o.responseText})}})})}var e=jQuery("#msg-content");var a=jQuery(".msg-menu .new-message");function d(){b.ajax({url:webpath+"/platform/msg/get-msg",data:{readState:0,rows:5,page:1,t:new Date()},success:function(g){a.html(g.msgList.total);var h=e;h.html("");var i=jQuery("#bi-nav .noreadNum");if(g.msgList.rows.length==0){h.append('<div><span class="msg-title">'+b.getMessage("msg.sabace.noMsg")+"</span></div>");i.hide();$(".head-img").poshytip("disable")}else{i.show();i.html((g.msgList.total>99?99:g.msgList.total));$(".head-img").poshytip("enable")}jQuery.each(g.msgList.rows,function(k,j){var p=jQuery("<div>",{pro:j.msgId,"class":"msgDiv"});var o=jQuery("<span>",{"class":"msg-level level-"+j.msgLevel});var n=jQuery("<span>",{title:j.msgTitle,html:j.msgTitle,"class":"msg-title"});var m=jQuery("<span>",{"class":"msg-time",html:b.date.getDateDiff(j.sendTime),sendUserName:j.sendUserName,sendTime:j.sendTime});var l=jQuery("<div>",{"class":"msg-content hide",html:j.msgContent});p.append(o).append(n).append(m).append(l);h.append(p)})},error:function(g){}})}return{init:f,getMsg:d}});