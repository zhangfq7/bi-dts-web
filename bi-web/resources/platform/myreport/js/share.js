define(["sabace","validation"],function(c,b){var a={};a.module={selectList:function(d,e){d.find(".selectList").html('<table id="'+e+'userTable"></table>');d.find("#"+e+"userTable").jqGrid({url:c.handleUrlParam("/platform/myreport/manage/user-list"),datatype:"json",postData:{userName:jQuery(".sys .searchInput").val(),createId:jQuery("#createId").val()},loadComplete:function(n){var m=jQuery("."+e).find("#"+e+"shareuserTable");var f=jQuery("."+e).find("#"+e+"userTable");var l=m.jqGrid("getRowData");var k=f.getCol("userID",true);for(var h=0;h<l.length;h++){for(var g=0;g<k.length;g++){if(k[g].value==l[h].userID){f.jqGrid("delRowData",k[g].id)}}}},styleUI:"Bootstrap",colModel:[{label:"用户编码",width:75,name:"userID",align:"center",hidden:true},{label:c.getMessage("report.share.userName"),width:135,name:"userName",align:"left",sortable:false}],shrinkToFit:false,width:225,height:200,viewrecords:true,multiselect:true,loadtext:"",rowNum:100000,rownumbers:true,regional:"cn"})},selectedList:function(d,e){d.find(".selectedList").html('<table id="'+e+'shareuserTable"></table>');d.find("#"+e+"shareuserTable").jqGrid({url:c.handleUrlParam("/platform/myreport/manage/share-user-list"),datatype:"json",postData:{reportId:jQuery("#reportId").val(),type:e},loadComplete:function(f){a.module.selectList(jQuery("."+e),e);if(f.length>0){jQuery("."+e).find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left","none")}else{jQuery("."+e).find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left","1px solid #ddd")}},styleUI:"Bootstrap",colNames:["用户编码",c.getMessage("report.share.userName")],colModel:[{label:"用户编码",width:75,name:"userID",align:"center",hidden:true},{label:c.getMessage("report.share.userName"),width:135,name:"userName",align:"left",sortable:false}],shrinkToFit:false,width:225,height:200,viewrecords:true,multiselect:true,loadtext:"",rowNum:100000,rownumbers:true,jsonReader:{records:"total",total:"totalPages"},regional:"cn"})}};a.controller={init:function(){$('[data-toggle="checkbox"]').iCheck({checkboxClass:"icheckbox_minimal",radioClass:"iradio_minimal"});jQuery(".mytable .head .tab").bind("click",function(){jQuery(".mytable .head .tab").removeClass("checkTab");jQuery(this).addClass("checkTab");var d=jQuery(this).attr("pro");jQuery(".tableBody").hide();jQuery("."+d).show()});jQuery(".mytable .head .tab").eq(0).trigger("click");jQuery(".mytable .head .tab").bind("click",function(){jQuery(".mytable .head .tab").removeClass("checkTab");jQuery(this).addClass("checkTab");var d=jQuery(this).attr("pro");jQuery(".tableBody").hide();jQuery("."+d).show()});a.module.selectedList(jQuery(".app"),"app");a.module.selectedList(jQuery(".sys"),"sys");jQuery(".sys .userNameBtn").bind("click",function(){jQuery("#sysuserTable").jqGrid("setGridParam",{postData:{userName:jQuery(".sys .searchInput").val()}}).trigger("reloadGrid",[{page:1}])});jQuery(".app .userNameBtn").bind("click",function(){jQuery("#appuserTable").jqGrid("setGridParam",{postData:{userName:jQuery(".app .searchInput").val()}}).trigger("reloadGrid",[{page:1}])});jQuery(".sys .right").bind("click",function(){var h=jQuery("#sysuserTable").jqGrid("getGridParam","selarrrow");if(h.length==0){bi.dialog.show({title:c.getMessage("home.label.TipBox"),message:c.getMessage("report.share.check"),cssClass:"register-dialog",nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,buttons:[{label:c.getMessage("home.button.sure"),action:function(i){i.close()}}]});return}jQuery(".sys .ui-jqgrid-bdiv>div").show();jQuery(".sys .ui-jqgrid-bdiv .noResult").hide();var f=jQuery("#sysshareuserTable").jqGrid("getDataIDs");var j=0;if(f.length>0){j=f[f.length-1]}var d=h.length;for(var e=0;e<d;e++){var g=jQuery("#sysuserTable").jqGrid("getRowData",h[0]);jQuery("#sysshareuserTable").jqGrid("addRowData",Number(j)+e+1,g);jQuery("#sysuserTable").jqGrid("delRowData",h[0])}jQuery(".sys").find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left","none");if(jQuery("#sysuserTable").jqGrid("getDataIDs").length==0){jQuery(".sys").find(".selectList").find(".ui-jqgrid-bdiv>div").css("border-left","1px solid #ddd")}});jQuery(".app .right").bind("click",function(){var h=jQuery("#appuserTable").jqGrid("getGridParam","selarrrow");if(h.length==0){bi.dialog.show({title:c.getMessage("home.label.TipBox"),message:c.getMessage("report.share.check"),cssClass:"register-dialog",nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,buttons:[{label:c.getMessage("home.button.sure"),action:function(i){i.close()}}]});return}jQuery(".app .ui-jqgrid-bdiv>div").show();jQuery(".app .ui-jqgrid-bdiv .noResult").hide();var f=jQuery("#appshareuserTable").jqGrid("getDataIDs");var j=0;if(f.length>0){j=f[f.length-1]}var d=h.length;for(var e=0;e<d;e++){var g=jQuery("#appuserTable").jqGrid("getRowData",h[0]);jQuery("#appshareuserTable").jqGrid("addRowData",Number(j)+e+1,g);jQuery("#appuserTable").jqGrid("delRowData",h[0])}jQuery(".app").find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left","none");if(jQuery("#appuserTable").jqGrid("getDataIDs").length==0){jQuery(".app").find(".selectList").find(".ui-jqgrid-bdiv>div").css("border-left","1px solid #ddd")}});jQuery(".sys .left").bind("click",function(){var h=jQuery("#sysshareuserTable").jqGrid("getGridParam","selarrrow");if(h.length==0){bi.dialog.show({title:c.getMessage("home.label.TipBox"),message:c.getMessage("report.share.check"),cssClass:"register-dialog",nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,buttons:[{label:c.getMessage("home.button.sure"),action:function(i){i.close()}}]});return}var f=jQuery("#sysuserTable").jqGrid("getDataIDs");var j=0;if(f.length>0){j=f[f.length-1]}var d=h.length;for(var e=0;e<d;e++){var g=jQuery("#sysshareuserTable").jqGrid("getRowData",h[0]);jQuery("#sysuserTable").jqGrid("addRowData",Number(j)+e+1,g);jQuery("#sysshareuserTable").jqGrid("delRowData",h[0])}jQuery(".sys").find(".selectList").find(".ui-jqgrid-bdiv>div").css("border-left","none");if(jQuery("#sysshareuserTable").jqGrid("getDataIDs").length==0){jQuery(".sys").find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left","1px solid #ddd")}});jQuery(".app .left").bind("click",function(){var h=jQuery("#appshareuserTable").jqGrid("getGridParam","selarrrow");if(h.length==0){bi.dialog.show({title:c.getMessage("home.label.TipBox"),message:c.getMessage("report.share.check"),cssClass:"register-dialog",nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,buttons:[{label:c.getMessage("home.button.sure"),action:function(i){i.close()}}]});return}var f=jQuery("#appuserTable").jqGrid("getDataIDs");var j=0;if(f.length>0){j=f[f.length-1]}var d=h.length;for(var e=0;e<d;e++){var g=jQuery("#appshareuserTable").jqGrid("getRowData",h[0]);jQuery("#appuserTable").jqGrid("addRowData",Number(j)+e+1,g);jQuery("#appshareuserTable").jqGrid("delRowData",h[0])}jQuery(".app").find(".selectList").find(".ui-jqgrid-bdiv>div").css("border-left","none");if(jQuery("#appshareuserTable").jqGrid("getDataIDs").length==0){jQuery(".app").find(".selectedList").find(".ui-jqgrid-bdiv>div").css("border-left","1px solid #ddd")}})},sure:function(f){var g=jQuery(".tab input:checked").parents(".tab");if(g.length==0){bi.dialog.show({title:c.getMessage("home.label.TipBox"),message:c.getMessage("report.share.select"),cssClass:"register-dialog",nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,buttons:[{label:c.getMessage("home.button.sure"),action:function(h){h.close()}}]});return}var e=[];var d={};jQuery.each(g,function(m,q){var h=jQuery(q).attr("pro");e.push(h);var l=jQuery("."+h).find("#"+h+"shareuserTable");var o=l.getCol("userID",true);var n=[];for(var m=0;m<o.length;m++){n.push(o[m].value)}var j=jQuery("#"+h+"myUser").val();var k=j.split(",");for(var p=0;p<k.length;p++){if(n.join(",").indexOf(k[p])<0){n.push(k[p])}}d[h]=n});c.ajax({data:{reportId:jQuery("#reportId").val(),wayArry:e.toString(),userArry:JSON.stringify(d)},url:c.handleUrlParam("/platform/myreport/manage/share"),success:function(h){bi.dialog.show({title:c.getMessage("home.label.TipBox"),message:c.getMessage("report.share.successShare"),cssClass:"register-dialog",nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,buttons:[{label:c.getMessage("home.button.sure"),action:function(i){i.close();f.close()}}]})},error:function(h){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:c.getMessage("top.label.fail"),message:h.responseText})}})},publish:function(d){var e=$("#appDesc-div,#type-div").validationEngine("validate");if(!e){return}c.ajax({data:{reportId:jQuery("#reportId").val(),appDesc:jQuery("#appDesc").val(),portalType:jQuery("#portalType option:selected").val(),appType:jQuery("#appType").val(),requireApp:jQuery("#requireApp").val(),requireDept:jQuery("#requireDept").val(),requireRegion:jQuery("#requireRegion").val(),appDesc:jQuery("#appDesc").val()},url:c.handleUrlParam("/third-party/publish"),success:function(f){bi.dialog.show({title:c.getMessage("home.label.TipBox"),message:f.resFlag=="success"?c.getMessage("report.share.successShare"):f.resFlag,cssClass:"register-dialog",nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,buttons:[{label:c.getMessage("home.button.sure"),action:function(g){g.close();d.close()}}]})},error:function(f){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:c.getMessage("top.label.fail"),message:f.responseText||"报表发布异常"})}})}};return a.controller});