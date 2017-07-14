define(["EBuilder","sabace","glober/message"],function(c,a,e){var d={};d.modal={echartsObj:{}};var b=jQuery("#bi-nav").css("backgroundColor")||"#87cefa";d.view={initSpace:function(){function h(n){if(n===0){return"0 B"}var o=1024,q=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],p=Math.floor(Math.log(n)/Math.log(o));return(n/Math.pow(o,p)).toFixed(1)+" <span>"+q[p]+"</span>"}function k(n){if(n===0){return"0 B"}var o=1024,q=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],p=Math.floor(Math.log(n)/Math.log(o));return(n/Math.pow(o,p)).toFixed(1)}var m=jQuery("#usedStorage>span").html().replace("M","");var l=jQuery(".allSpace>span").html().replace("M","");m=parseInt(m)<0?0:parseInt(m);l=parseInt(l)<0?0:parseInt(l);if(m>l){m=l}var g=k(l*1024*1024);var i=parseFloat(m/(l/g)).toFixed(1);var j=jQuery("#usedStorage");j.html(h(m*1024*1024));jQuery(".allSpace").html(h(l*1024*1024));jQuery("#allspace").html(i+"/"+h(l*1024*1024));jQuery("#allspace span").css({color:"#34495e","font-weight":"normal","font-size":"13px"});var f=m/l*100;if(f>80){j.removeClass("theme-background");j.css("background","orange")}if(f>90){j.removeClass("theme-background");j.css("background","red")}j.css({width:f+"%"})},initTimePicker:function(){var i=new Date();var f=i.getMonth()+1;var l=i.getFullYear();var g;var h;if((f-1)<=0){l=l-1;f=f+11}else{f=f-1}if((f-5)<=0){g=l-1;h=f+7}else{g=l;h=f-5}if(h<10){h="0"+h}if(f<10){f="0"+f}var j=g+"/"+h;var k=l+"/"+f;jQuery("#time-picker").dateRange({format:"YYYY/MM",onhide:function(){var n=jQuery(this).dateRange("getDate");var m=n.startDate;var o=n.endDate;a.ajax({type:"post",cache:false,data:{startDate:m,endDate:o},dataType:"json",url:a.handleUrlParam("/platform/overview/sysGlobal/get-bill"),success:function(q){var p=[];jQuery.each(q,function(s,r){var t={};t.group=a.getMessage("overview.label.cost");t.name=r.acycId;t.value=r.serviceFee;p.push(t)});if(a.IsEmpty(p)){$("#acycBillChart").hide();$("#noBillData").show();return}else{$("#acycBillChart").show();$("#noBillData").hide()}d.view.innitBill(p)},error:function(p){}})},changeStart:function(n,q,v,p){var u="YYYY/MM";var o=n.date.format(u);var m=o.split("/");var t=parseInt(m[0]);var s=parseInt(m[1]);if((s+5)>12){t=t+1;s=s-7}else{s=s+5}var r=t+"/"+s;if(r>k){r=k}endTime=moment(q,u).format("x");maxTime=moment(r,u).format("x");if(endTime>maxTime){v.date(r);p.date(o)}v.maxDate(r)},startValue:j,endValue:k});jQuery("#time-icon").on("click",function(){jQuery("#time-picker").focus()})},initSwitch:function(){$("#openWeiChat").bootstrapSwitch();$("#openSms").bootstrapSwitch();$("#openEmail").bootstrapSwitch();$("#openLogo").bootstrapSwitch();if(jQuery("#wechatValue").val()==0){$("#openWeiChat").trigger("click")}if(jQuery("#smsValue").val()==0){$("#openSms").trigger("click")}if(jQuery("#emailValue").val()==0){$("#openEmail").trigger("click")}if(jQuery("#logoValue").val()==0){$("#openLogo").trigger("click")}var h=0;jQuery("#openWeiChat").on({"switchChange.bootstrapSwitch":function(j,k){if(h==1){return}h=1;if(k==true){$("#openWeiChat").bootstrapSwitch("state",false);bi.dialog.confirm({title:a.getMessage("overview.label.confirm"),message:a.getMessage("overview.label.open.WeChat"),callback:function(l){if(l){a.ajax({type:"post",cache:false,dataType:"json",data:{type:"wechat",state:"1"},url:a.handleUrlParam("/platform/overview/sysGlobal/set-open-state"),success:function(m){if(m=="1"){h=1;$("#openWeiChat").bootstrapSwitch("state",true);h=0;jQuery(".bind-service .fa-weixin").removeClass("flag0").addClass("flag1 theme-background")}},error:function(m){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("global.tip.error"),message:m.responseText||a.getMessage("global.msg.error")})}})}}})}else{$("#openWeiChat").bootstrapSwitch("state",true);bi.dialog.confirm({title:a.getMessage("overview.label.confirm"),message:a.getMessage("overview.label.close.WeChat"),callback:function(l){if(l){a.ajax({type:"post",cache:false,dataType:"json",data:{type:"wechat",state:"0"},url:a.handleUrlParam("/platform/overview/sysGlobal/set-open-state"),success:function(m){if(m=="1"){h=1;$("#openWeiChat").bootstrapSwitch("state",false);h=0;jQuery(".bind-service .fa-weixin").removeClass("flag1 theme-background").addClass("flag0")}},error:function(m){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("global.tip.error"),message:m.responseText||a.getMessage("global.msg.error")})}})}}})}h=0}});var i=0;jQuery("#openSms").on({"switchChange.bootstrapSwitch":function(j,k){if(i==1){return}i=1;if(k==true){$("#openSms").bootstrapSwitch("state",false);bi.dialog.confirm({title:a.getMessage("overview.label.confirm"),message:a.getMessage("overview.label.open.SMS"),callback:function(l){if(l){a.ajax({type:"post",cache:false,dataType:"json",data:{type:"sms",state:"1"},url:a.handleUrlParam("/platform/overview/sysGlobal/set-open-state"),success:function(m){if(m=="1"){i=1;$("#openSms").bootstrapSwitch("state",true);i=0;jQuery(".bind-service .fa-mobile-phone").removeClass("flag0").addClass("flag1 theme-background")}},error:function(m){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("global.tip.error"),message:m.responseText||a.getMessage("global.msg.error")})}})}}})}else{$("#openSms").bootstrapSwitch("state",true);bi.dialog.confirm({title:a.getMessage("overview.label.confirm"),message:a.getMessage("overview.label.close.SMS"),callback:function(l){if(l){a.ajax({type:"post",cache:false,dataType:"json",data:{type:"sms",state:"0"},url:a.handleUrlParam("/platform/overview/sysGlobal/set-open-state"),success:function(m){if(m=="1"){i=1;$("#openSms").bootstrapSwitch("state",false);i=0;jQuery(".bind-service .fa-mobile-phone").removeClass("flag1 theme-background").addClass("flag0")}},error:function(m){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("global.tip.error"),message:m.responseText||a.getMessage("global.msg.error")})}})}}})}i=0}});var g=0;jQuery("#openEmail").on({"switchChange.bootstrapSwitch":function(j,k){if(g==1){return}g=1;if(k==true){$("#openEmail").bootstrapSwitch("state",false);bi.dialog.confirm({title:a.getMessage("overview.label.confirm"),message:a.getMessage("overview.label.open.email"),callback:function(l){if(l){a.ajax({type:"post",cache:false,dataType:"json",data:{type:"email",state:"1"},url:a.handleUrlParam("/platform/overview/sysGlobal/set-open-state"),success:function(m){if(m=="1"){g=1;$("#openEmail").bootstrapSwitch("state",true);g=0;jQuery(".bind-service .fa-envelope").removeClass("flag0").addClass("flag1 theme-background");jQuery("#emailValue").val("1")}},error:function(m){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("global.tip.error"),message:m.responseText||a.getMessage("global.msg.error")})}})}}})}else{$("#openEmail").bootstrapSwitch("state",true);bi.dialog.confirm({title:a.getMessage("overview.label.confirm"),message:a.getMessage("overview.label.close.email"),callback:function(l){if(l){a.ajax({type:"post",cache:false,dataType:"json",data:{type:"email",state:"0"},url:a.handleUrlParam("/platform/overview/sysGlobal/set-open-state"),success:function(m){if(m=="1"){g=1;$("#openEmail").bootstrapSwitch("state",false);g=0;jQuery(".bind-service .fa-envelope").removeClass("flag1 theme-background").addClass("flag0");jQuery("#emailValue").val("0")}},error:function(m){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("global.tip.error"),message:m.responseText||a.getMessage("global.msg.error")})}})}}})}g=0}});var f=0;jQuery("#openLogo").on({"switchChange.bootstrapSwitch":function(j,k){if(f==1){return}f=1;if(k==true){$("#openLogo").bootstrapSwitch("state",false);bi.dialog.confirm({title:a.getMessage("overview.label.confirm"),message:a.getMessage("overview.label.open.logo"),callback:function(l){if(l){a.ajax({type:"post",cache:false,dataType:"json",data:{type:"logo",state:"1"},url:a.handleUrlParam("/platform/overview/sysGlobal/set-open-state"),success:function(m){if(m=="1"){f=1;$("#openLogo").bootstrapSwitch("state",true);f=0;jQuery(".bind-service .fa-flag").removeClass("flag0").addClass("flag1 theme-background");jQuery("#logoValue").val("1")}},error:function(m){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("global.tip.error"),message:m.responseText||a.getMessage("global.msg.error")})}})}}})}else{$("#openLogo").bootstrapSwitch("state",true);bi.dialog.confirm({title:a.getMessage("overview.label.confirm"),message:a.getMessage("overview.label.close.logo"),callback:function(l){if(l){a.ajax({type:"post",cache:false,dataType:"json",data:{type:"logo",state:"0"},url:a.handleUrlParam("/platform/overview/sysGlobal/set-open-state"),success:function(m){if(m=="1"){f=1;$("#openLogo").bootstrapSwitch("state",false);f=0;jQuery(".bind-service .fa-flag").removeClass("flag1 theme-background").addClass("flag0");jQuery("#logoValue").val("0")}},error:function(m){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:a.getMessage("global.tip.error"),message:m.responseText||a.getMessage("global.msg.error")})}})}}})}f=0}})},innitBill:function(f){$("#acycBillChart").EBuilder({data:f,type:["bar"],option:{legend:{show:false},color:[b],toolbox:{show:false},grid:{x:50,x2:30,y:8,y2:40},series:[{barWidth:40}],yAxis:[{axisLabel:{formatter:"{value}元"},axisLine:{lineStyle:{color:b}}}],xAxis:[{axisLine:{lineStyle:{color:b}}}]},theme:["echarts/theme/blue"],callback:function(){d.modal.echartsObj.bill=this}})},getBillData:function(){var j=new Date();var g=j.getMonth()+1;var l=j.getFullYear();var h;var i;if((g-1)<=0){l=l-1;g=g+11}else{g=g-1}if((g-5)<=0){h=l-1;i=g+7}else{h=l;i=g-5}if(i<10){i="0"+i}if(g<10){g="0"+g}var f=h+"/"+i;var k=l+"/"+g;jQuery("#time-picker").val(f+"   ~   "+k);a.ajax({type:"post",cache:false,data:{startDate:f,endDate:k,},dataType:"json",url:a.handleUrlParam("/platform/overview/sysGlobal/get-bill"),success:function(n){var m=[];jQuery.each(n,function(p,o){var q={};q.group=a.getMessage("overview.label.cost");q.name=o.acycId;q.value=o.serviceFee;m.push(q)});if(a.IsEmpty(m)){$("#acycBillChart").hide();$("#noBillData").show();return}else{$("#acycBillChart").show();$("#noBillData").hide()}d.view.innitBill(m)},error:function(m){$("#noBillData .text").html(m.responseText||a.getMessage("global.msg.error"));$("#acycBillChart").hide();$("#noBillData").show()}})},getReportData:function(){a.ajax({type:"post",cache:false,dataType:"json",url:a.handleUrlParam("/platform/overview/sysGlobal/get-report"),success:function(f){var g=[];jQuery.each(f,function(j,h){var k={};k.group="访问量";k.name="第"+(j+1);k.value=h.visitCount;k.reportName=h.reportName;k.reportId=h.reportId;g.push(k)});if(a.IsEmpty(g)){$("#visitRankChart").hide();$("#noRankData").show();return}else{$("#visitRankChart").show();$("#noRankData").hide()}g.reverse();$("#visitRankChart").EBuilder({data:g,type:["bar"],yx:true,option:{tooltip:{formatter:function(){var h=arguments[0][0].data.reportName+": "+arguments[0][0].data.value+"次";return h}},legend:{show:false},color:[b],toolbox:{show:false},grid:{x:43,x2:30,y:0,y2:40},series:[{barWidth:15}],xAxis:[{axisLabel:{formatter:"{value}次"},axisLine:{lineStyle:{color:b}}}],yAxis:[{axisLine:{lineStyle:{color:b}}}],},theme:["echarts/theme/blue"],callback:function(){d.modal.echartsObj.visit=this;var h=require("echarts/config");this.on(h.EVENT.CLICK,function(){window.open(a.handleUrlParam("/platform/dataview/view")+"?reportId="+arguments[0].data.reportId)})}})},error:function(f){$("#noRankData .text").html(f.responseText);$("#visitRankChart").hide();$("#noRankData").show()}})}};d.controller={init:function(){d.view.initSpace();d.view.initTimePicker();d.view.initSwitch();d.view.getBillData();d.view.getReportData();jQuery("#extendStorage").bind("click",function(){window.open(a.handleUrlParam("/platform/serviceopen/extend-storage"))});window.onresize=function(){$.each(d.modal.echartsObj,function(g,f){d.modal.echartsObj[g].resize&&d.modal.echartsObj[g].resize()})};jQuery("#reportCount").bind("click",function(){window.open(a.handleUrlParam("/platform/myreport/view/report-list"))});jQuery("#extendUserNum").bind("click",function(){window.open(a.handleUrlParam("/platform/serviceopen/order-usernum"))});jQuery("#emailInfo").bind("click",function(){window.open(a.handleUrlParam("/platform/overview/sysGlobal/email-details")+"?serviceCode=email&openFlag="+jQuery("#emailValue").val())});jQuery("#logoInfo").bind("click",function(){window.open(a.handleUrlParam("/platform/overview/sysGlobal/email-details")+"?serviceCode=logo&openFlag="+jQuery("#logoValue").val())})}};return d.controller});