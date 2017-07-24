define(["sabace","group/message"],function(c,i){var d;jQuery(function(){f();jQuery("#search").on("click",h);jQuery("#add").on("click",a);jQuery("#edit").on("click",e);jQuery("#delete").on("click",g);jQuery(window).resize(function(){$("#groupTree").setGridWidth($("#groupListPanel").width()-20)});jQuery("body").on("change","#groupProjectId",function(){d=$(this).val();console.log(d)})});function f(){var l=jQuery("#listGroupName").val();var j=jQuery("#listDescription").val();var k=jQuery("#creater").val();postData={groupName:encodeURI(l),description:encodeURI(j),creater:k};jQuery("#groupTree").jqGrid({url:c.handleUrlParam("/platform/resmanage/group/search"),styleUI:"Bootstrap",postData:postData,regional:"cn",loadtext:c.getMessage("group.msg.loading"),gridComplete:function(){jQuery("input[type=checkbox]").on("click",b)},onSelectRow:function(m){var n=jQuery("tr[id="+m+"]>td>input").prop("checked");jQuery("input[type=checkbox]").prop("checked",false);jQuery("tr[id="+m+"]>td>input").prop("checked",!n);if(n){$("#groupTree").trigger("reloadGrid")}var o=$("#groupTree").jqGrid("getRowData",m);if("false"==o.optFlag){jQuery("#edit").addClass("disabled");jQuery("#delete").addClass("disabled")}else{jQuery("#edit").removeClass("disabled");jQuery("#delete").removeClass("disabled")}},beforeSelectRow:function(m){},loadComplete:function(){$(".tree-wrap").width(function(){return $(this).width()+14})},colModel:[{name:"",index:"group_id",formatter:"checkbox",formatoptions:{disabled:false},width:30},{name:"group_id",index:"group_id",sorttype:"int",key:true,hidden:true},{name:"group_name",index:"groupName",sorttype:"string",label:c.getMessage("group.label.group.Name"),width:150,sortable:false},{name:"description",index:"description",sorttype:"numeric",label:c.getMessage("group.label.group.Dec"),align:"left",width:150,sortable:false},{name:"user_name",index:"user_name",sorttype:"numeric",label:c.getMessage("group.label.group.Creater"),align:"left",width:90,sortable:false},{name:"createTime",index:"createTime",sorttype:"numeric",label:c.getMessage("group.label.group.Time"),align:"left",width:120,sortable:false},{name:"boss_id",hidden:true},{name:"optFlag",hidden:true},{name:"proId",hidden:true}],forceFit:true,height:"auto",autowidth:true,sortname:"group_id",scrollrows:true,treeGrid:true,ExpandColumn:"group_name",treedatatype:"json",treeGridModel:"adjacency",treeReader:{parent_id_field:"boss_id",level_field:"level",leaf_field:"isLeaf",expanded_field:"expanded",loaded:"loaded",icon_field:"icon"},columnsResize:true,sortorder:"asc",datatype:"json",pager:"#pager",})}function a(){jQuery("#parentGroupName").attr("value","");jQuery("#groupName").attr("value","");jQuery("#description").html("");var o=$("#groupTree").jqGrid("getGridParam","selrow");var l=$("#groupTree").jqGrid("getRowData",o);var n=l.group_name;var k=l.group_id;var m=jQuery("#"+o).find("input[type='checkbox']").prop("checked");if(!m){k=undefined;n="最上级指标"}if(c.IsEmpty(n)){n="最上级指标"}jQuery("#parentGroupName").attr("value",n);var j=bi.dialog.show({title:c.getMessage("group.label.addGroup"),message:jQuery("#add-page").outerHTML(),nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,cssClass:"group-add-dialog",buttons:[{label:c.getMessage("group.button.cancel"),action:function(p){p.close()}},{label:c.getMessage("group.button.save"),cssClass:"btn-info",action:function(p){if(d==""||null==d){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:c.getMessage("group.label.tip"),message:c.getMessage("group.msg.chooseProjectName")});return false}var q=j.getModalBody().find("#add-page").validationEngine("validate");if(!q){return false}bi.dialog.confirm({title:c.getMessage("group.msg.confirm"),message:c.getMessage("group.msg.saveConfirm"),callback:function(s){if(!s){return}var t=k;var v=j.getModalBody().find("#groupName").val();var u=j.getModalBody().find("#description").val();var r={parentGroupId:t,groupName:v,groupDesc:u,proId:d};c.ajax({data:r,loading:{title:c.getMessage("group.label.tip"),text:c.getMessage("group.label.pleaseWait")},url:c.handleUrlParam("/platform/resmanage/group/add-group"),success:function(w){if(!w.flag){bi.dialog.show({type:bi.dialog.TYPE_WARNING,title:c.getMessage("group.label.warn"),message:c.getMessage("group.msg.group.name.Repetition")})}jQuery("#groupTree").trigger("reloadGrid");j.close()},error:function(w){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:c.getMessage("group.label.tip"),message:w.responseText||c.getMessage("group.msg.save.exception")})}})}})}}]});j.getModalBody().find("#add-page").validationEngine({autoHidePrompt:true,autoHideDelay:2000,binded:true,promptPosition:"bottomLeft",showOneMessage:true})}function e(){if(jQuery("#edit").hasClass("disabled")){return}jQuery("#parentGroupName").attr("value","");jQuery("#groupName").attr("value","");jQuery("#description").html("");var k=$("#groupTree").jqGrid("getGridParam","selrow");var n=$("#groupTree").jqGrid("getRowData",k);var s=n.group_name;var l=n.group_id;var m=n.description;var r=n.boss_id;var q=n.proId;console.log(q);if(c.IsEmpty(r)){var p="最上级字段"}else{var n=$("#groupTree").jqGrid("getRowData",r);var p=n.group_name}var j=jQuery("#"+k).find("input[type='checkbox']").prop("checked");if(c.IsEmpty(k)||!j){bi.dialog.show({type:"type-warning",title:c.getMessage("group.msg.prompt"),message:c.getMessage("group.msg.empty"),});return}jQuery("#parentGroupName").attr("value",p);jQuery("#groupName").attr("value",s);jQuery("#description").html(m);console.log(jQuery("#groupProjectId").find("option[value="+q+"]").val());jQuery("#groupProjectId").find("option[value="+q+"]").attr("selected",true);var o=bi.dialog.show({title:c.getMessage("group.label.editGroup"),message:jQuery("#add-page").outerHTML(),nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,cssClass:"group-add-dialog",buttons:[{label:c.getMessage("group.button.cancel"),action:function(t){t.close()}},{label:c.getMessage("group.button.save"),cssClass:"btn-info",action:function(t){if(d==""||null==d){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:c.getMessage("group.label.tip"),message:c.getMessage("group.msg.chooseProjectName")});return false}var u=o.getModalBody().find("#add-page").validationEngine("validate");if(!u){return false}bi.dialog.confirm({title:c.getMessage("group.msg.confirm"),message:c.getMessage("group.msg.saveConfirm"),callback:function(w){if(!w){return}var y=o.getModalBody().find("#groupName").val();var x=o.getModalBody().find("#description").val();var v={groupId:l,groupName:y,groupDesc:x,parentGroupId:r,proId:d};c.ajax({loading:{title:c.getMessage("group.label.tip"),text:c.getMessage("group.label.pleaseWait")},url:c.handleUrlParam("/platform/resmanage/group/edit-group"),data:v,success:function(z){if(!z.flag){bi.dialog.show({type:bi.dialog.TYPE_WARNING,title:c.getMessage("group.label.warn"),message:c.getMessage("group.msg.group.edit.name.Repetition")})}o.close();jQuery("#groupTree").trigger("reloadGrid")},error:function(z){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:c.getMessage("group.label.tip"),message:z.responseText||c.getMessage("group.msg.save.exception")})}})}})}}]});o.getModalBody().find("#add-page").validationEngine({autoHidePrompt:true,autoHideDelay:2000,binded:true,promptPosition:"topRight",showOneMessage:true})}function g(){if(jQuery("#delete").hasClass("disabled")){return}var n=$("#groupTree").jqGrid("getGridParam","selrow");var l=$("#groupTree").jqGrid("getRowData",n);var k=l.group_id;var j=l.boss_id;var m=jQuery("#"+n).find("input[type='checkbox']").prop("checked");if(c.IsEmpty(n)||!m){bi.dialog.show({type:"type-warning",title:c.getMessage("group.msg.prompt"),message:c.getMessage("group.msg.choose.group"),});return}else{bi.dialog.confirm({title:c.getMessage("group.msg.prompt"),message:c.getMessage("group.msg.confirm.delete"),callback:function(o){if(o){c.ajax({type:"post",cache:false,dataType:"json",data:{groupId:k},url:c.handleUrlParam("/platform/resmanage/group/delete-group"),success:function(p){jQuery("#groupTree").trigger("reloadGrid");bi.dialog.show({title:c.getMessage("group.msg.prompt"),message:p.responseText||c.getMessage("group.msg.success")})},error:function(p){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:c.getMessage("group.msg.prompt"),message:p.responseText||c.getMessage("group.msg.save.exception")})}})}}})}}function h(){var l=jQuery("#listGroupName").val();var j=jQuery("#listDescription").val();var k=jQuery("#creater").val();postData={groupName:encodeURI(l),description:encodeURI(j),creater:encodeURI(k)};jQuery("#groupTree").clearGridData();jQuery("#groupTree").jqGrid("setGridParam",{postData:postData}).trigger("reloadGrid")}function b(){var j=jQuery(this).prop("checked");jQuery("input[type=checkbox]").prop("checked",false);jQuery(this).prop("checked",!j);jQuery("#groupTree").jqGrid("setSelection",jQuery(this).parent().next().text())}});