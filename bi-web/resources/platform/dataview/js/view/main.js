define(["bace","view/layout","view/attr","view/header","view/widgets","view/box","view/component/keysUtil","layout","poshytip","grid","date","switchButton","dialog","colpick","chosen","ztree","placeholder","dotdotdot","validation"],function(e,d,f,g,c,a,b){var h={};h.control={init:function(){a.main.dataId=_DCVBNMMMM;a.main.dataName=_ELKJHGFFF;a.main.reportId=_RSDFGHJJKK;a.main.tplId=_MFUJNNGJLL;a.main.dataType=_ASWDFAFSS;if(a.main.reportId){$.ajax({type:"POST",url:e.handleUrlParam("/platform/dataview/queryViewInfo"),dataType:"json",data:{reportId:a.main.reportId},success:function(j){if(j.dataDeletaFlag==0){alert("数据源已删除！")}var n=$.evalJSON(j.resportConfig);if(!!n.imgSrc){sessionStorage.imgSrc=n.imgSrc}if(discovery=="1"){n.filters=[];var l=n.widgets;var m;for(var k=0;k<l.length;k++){if(l[k].option.el==chartIdInDiscovery){m=l[k];l=[];l[0]=m;break}}n.widgets=l;m.layout.width=1000+"px";m.layout.height=400+"px";m.layout.left=50+"px";m.layout.top=30+"px";a.main.dataId=m.option.config.build.dataParams.dataId;a.main.dataType=m.option.config.build.dataParams.dataType}else{a.main.dataId=j.dataId}a.main.reportName=j.reportName;a.main.reportDesc=j.reportDesc;a.main.expireDate=j.expireDate;a.main.labelId=$.evalJSON(j.labelId);a.main.reportId=j.reportId;a.main.allowComment=j.allowComment;a.main.urlMenuInfo=$.evalJSON(j.urlMenuInfo);i(function(){f.openAttrPanel()});c.start("render",n)},error:function(){alert("没有查询到数据源，自动跳转到可视化新建页面");i()}})}else{if(a.main.dataId){i(function(){f.openAttrPanel()})}else{if(a.main.tplId){$.ajax({type:"POST",url:e.handleUrlParam("/platform/dataview/queryTplConfigById"),dataType:"json",data:{tplId:a.main.tplId},success:function(j){i(function(){c.start("renderTpl",$.evalJSON(j.tplConfig))})},error:function(){alert("没有查询到模版信息，自动跳转到可视化新建页面");i()}})}else{i()}}}function i(j){_T.set("x");d.init();g.init();c.init();if(a.main.dataId){f.init()}j?j():"";_T.get("x")}}};h.module={};h.view={};window.onbeforeunload=function(i){return"您好，检测到您关闭当前设计器！"};return h.control});