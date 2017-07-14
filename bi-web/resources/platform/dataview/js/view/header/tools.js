define(["view/box","bace","view/component/BgUtil"],function(b,d,a){var c={};c.control={};c.view={toggleFilter:function(){var f,e;if(jQuery("#openFilter")[0]){f=jQuery("#openFilter").prop("checked")}e=f?"open":"close";b.Layout.toggleFilterPanel(e)},openOpera:function(){},openGird:function(){jQuery(".grid-bg").toggleClass("no-bg")},openURL:function(){var e,f;if($("#openURL")[0]){e=$("#openURL").prop("checked")}f=e?"open":"close";b.Widgets.openUrlPanel(f)},buildThemeMenu:function(){var o=[{name:"默认",themeName:"macarons",colors:["#D76E73","#FFB778","#48AAF1","#B6A2E0","#00C3C6"]},{name:"经典",themeName:"vintage",colors:["#0E727D","#EC8A32","#FDCD00","#B0C100","#D0585C"]},{name:"致青春",themeName:"roma",colors:["#005CAD","#268312","#0097DC","#E7B600","#C32C2F"]},{name:"七色时光",themeName:"shine",colors:["#146F9B","#00B2DA","#00B2DA","#87B0BC","#97D2DE"]},{name:"五彩斑斓",themeName:"infographic",colors:["#3DB7D5","#E7256C","#F5E43D","#FF9700","#87EF18"]},{name:"暗夜精灵",themeName:"dark",colors:["#0E727D","#EC8A32","#FDCD00","#B0C100","#D0585C"]}];var g='<div id="themeMenu" class="menu-content" style="width: 200px;">	<div class="menuTitle" >		皮肤设置	</div>	<div class="menuContent theme">';var p="";for(var m=0;m<o.length;m++){var l=o[m];var f=l.name;var e=l.colors;var n=l.themeName;p+='<div data-theme="'+n+'" class="'+(m==0?"theme-check":"")+'"><i class="fa fa-check"></i>'+f+' <div class="example">';for(var j=0;j<e.length;j++){var h=e[j];p+='<div class="colorborder" style="background:'+h+'"></div>'}p+="</div></div>"}g+=p;g+="</div>";return g},setTheme:function(){$(this).addClass("theme-check").siblings().removeClass("theme-check");b.Header.tools.themeName=$(this).attr("data-theme");sessionStorage.setItem("themeName",b.Header.tools.themeName);b.Widgets.plugins.echarts.setTheme(b.Header.tools.themeName)},openBgDialog:function(){a.show()}};c.model={configData:{id:"tabs_tools",groups:[{title:"操作工具",tools:[{panel:[{id:"openFilter",text:"查询框",title:"查询框",type:"switchbutton",iconCls:"icon tools-serach",option:{classes:"ui-switchbutton-thin",checkedLabel:"打 开",uncheckedLabel:"关 闭"},change:c.view.toggleFilter},{id:"openDownload",text:"下&nbsp;&nbsp;&nbsp;&nbsp;载",title:"下&nbsp;&nbsp;&nbsp;&nbsp;载",type:"switchbutton",iconCls:"icon tools-download",option:{classes:"ui-switchbutton-thin",checkedLabel:"打 开",uncheckedLabel:"关 闭"},change:c.view.openOpera},{id:"openGird",text:"背&nbsp;&nbsp;&nbsp;&nbsp;景",title:"背&nbsp;&nbsp;&nbsp;&nbsp;景",type:"switchbutton",checked:"checked",iconCls:"icon tools-grid",option:{classes:"ui-switchbutton-thin",checkedLabel:"打 开",uncheckedLabel:"关 闭"},change:c.view.openGird},{id:"openURL",text:"URL导航",title:"URL导航",type:"switchbutton",iconCls:"icon tools-url",option:{classes:"ui-switchbutton-thin",checkedLabel:"打 开",uncheckedLabel:"关 闭"},change:c.view.openURL}]}],style:"width:300px;"},{title:"设置工具",tools:[{id:"themeSetting",text:"主题设置",iconCls:"icon-tools-theme",menu:{id:"themeMenu",html:c.view.buildThemeMenu()},click:c.view.setTheme},{id:"bgSetting",text:"背景设置",iconCls:"icon-tools-bg",click:c.view.openBgDialog}],}]}};return{config:c.model.configData,discoveryUrlLayout:function(){c.model.configData.groups[0].tools[0].panel.pop()},openSendEmail:function(){var e={id:"openSendEmail",text:"邮件推送",title:"邮件推送",type:"switchbutton",iconCls:"icon tools-email",option:{classes:"ui-switchbutton-thin",checkedLabel:"打 开",uncheckedLabel:"关 闭"},change:c.view.openOpera};c.model.configData.groups[0].tools[0].panel.splice(1,0,e);c.model.configData.groups[0].style="width:"+(150*Math.ceil(c.model.configData.groups[0].tools[0].panel.length/2))+"px;"},openWaterflag:function(){var e={id:"openWaterflag",text:"水&nbsp;&nbsp;&nbsp;&nbsp;印",title:"水&nbsp;&nbsp;&nbsp;&nbsp;印",type:"switchbutton",checked:"checked",iconCls:"icon tools-waterflag",option:{classes:"ui-switchbutton-thin",checkedLabel:"打 开",uncheckedLabel:"关 闭"},change:function(){}};c.model.configData.groups[0].tools[0].panel.push(e);c.model.configData.groups[0].style="width:"+(150*Math.ceil(c.model.configData.groups[0].tools[0].panel.length/2))+"px;"}}});