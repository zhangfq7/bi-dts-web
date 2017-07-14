define(["sabace"],function(b){var a={};a.view={ReportExpireList:function(){var c={};$("#reportListGrid").jqGrid({url:b.handleUrlParam("/platform/dataview/query-report-expireDate"),styleUI:"Bootstrap",datatype:"json",postData:c,mtype:"post",forceFit:true,colModel:[{name:"reportId",width:75,align:"left",hlign:"center",hidden:true,sortable:false},{label:b.getMessage("report.reportlist.label.reportName"),name:"reportName",width:180,align:"left",hlign:"center",sortable:false},{label:b.getMessage("report.reportlist.label.createUsername"),name:"userName",width:90,align:"left",hlign:"center",sortable:false},{label:b.getMessage("report.reportlist.label.createTime"),name:"createTime",width:180,align:"left",hlign:"center",sortable:false},{label:b.getMessage("report.reportlist.label.expireDate"),name:"expireDate",width:180,align:"left",hlign:"center",sortable:false},{label:b.getMessage("report.reportlist.label.expireDateEdit"),name:"operate",width:80,align:"center",hlign:"center",sortable:false,formatter:function(d,e,f){return"<a href='javascript:void(0)' class='report-edit' data-rowobject='"+JSON.stringify(f)+"'>修改</a>"}}],viewrecords:true,autowidth:true,height:"auto",rowNum:10,rowList:[10,20,30],rownumbers:true,pager:"#reportListGridPager",jsonReader:{records:"total",total:"totalPages"},afterInsertRow:function(e,d){jQuery(this).jqGrid("setCell",rowid,"operate","<a>操作</a>")},regional:"cn"})},ExpireDateEdit:function(e){var d=bi.dialog.show({title:b.getMessage("report.reportlist.label.expireDateEdit"),message:' <div id="expire-date-edit-page"><div id="edit-page" class="validationEngineContainer"><div class="edit-expireDate-dialog"><label class="col-xs-3 control-label " id="reportNameLabel"></label><div class="edit-expireDate-list-div col-xs-6"><input id="reportName" type="text" class="form-control" disabled="disabled" id="reportName" value=""></div><div style="clear:both;"></div></div><div class="edit-expireDate-dialog"><label class="col-xs-3 control-label" id="createUsernameLabel"></label><div class="edit-expireDate-list-div col-xs-6"><input id="createUsername" type="text" class="form-control" disabled="disabled" value=""></div><div style="clear:both;"></div></div><div class="edit-expireDate-dialog"><label class="col-xs-3 control-label" id="createTimeLabel"></label><div class="edit-expireDate-list-div col-xs-6">	<input id="createTime" type="text" class="form-control" disabled="disabled"  value=""></div><div style="clear:both;"></div></div><div class="edit-expireDate-dialog"><label class="col-xs-3 control-label" id="expireDateLabel"></label><div class="edit-expireDate-div col-xs-6">	<input id="expireDate"  type="text" class="form-control "   value=""/>	</div>	<div style="clear:both;"></div></div></div></div>',nl2br:false,closable:true,closeByBackdrop:false,closeByKeyboard:false,cssClass:"expireDate-add-dialog",buttons:[{label:b.getMessage("report.reportlist.button.cancel"),action:function(f){f.close()}},{label:b.getMessage("report.reportlist.button.save"),cssClass:"btn-info",action:function(f){var g=d.getModalBody().find("#edit-page").validationEngine("validate");if(!g){return false}bi.dialog.confirm({title:b.getMessage("report.reportlist.msg.confirm"),message:b.getMessage("report.reportlist.msg.saveConfirm"),callback:function(i){if(!i){return}var j=d.getModalBody().find("#expireDate").val();var h={reportId:c,expireDate:j,};b.ajax({loading:{title:b.getMessage("report.reportlist.label.tip"),text:b.getMessage("report.reportlist.label.pleaseWait")},url:b.handleUrlParam("/platform/dataview/edit-report-expireDate"),data:h,success:function(k){d.close();jQuery("#reportListGrid").trigger("reloadGrid")},error:function(k){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:b.getMessage("report.reportlist.label.tip"),message:k.responseText||b.getMessage("report.msg.save.exception")})}})}})}}],});d.getModalBody().find("#reportNameLabel").text(b.getMessage("report.reportlist.label.reportName")+"：");d.getModalBody().find("#createUsernameLabel").text(b.getMessage("report.reportlist.label.createUsername")+"：");d.getModalBody().find("#createTimeLabel").text(b.getMessage("report.reportlist.label.createTime")+"：");d.getModalBody().find("#expireDateLabel").text(b.getMessage("report.reportlist.label.expireDate")+"：");d.getModalBody().find("#reportName").attr("value","");d.getModalBody().find("#createUsername").attr("value","");d.getModalBody().find("#createTime").attr("value","");d.getModalBody().find("#expireDate").attr("value","");d.getModalBody().find("#reportName").attr("value",e.reportName);d.getModalBody().find("#createUsername").attr("value",e.userName);d.getModalBody().find("#createTime").attr("value",e.createTime);d.getModalBody().find("#expireDate").attr("value",e.expireDate);var c=e.reportId;d.getModalBody().find("#expireDate").datepicker({onSelect:function(f){this.focus();this.blur()},minDate:new Date(),dateFormat:"yy-mm-dd",changeMonth:true,changeYear:true,});d.getModalBody().find("#expire-date-edit-page").validationEngine({autoHidePrompt:true,autoHideDelay:2000,binded:true,promptPosition:"topRight",showOneMessage:true})}};a.controller={init:function(){jQuery("#searchButton").on("click",function(){var d=$("#queryReportName").val();var c={};c.reportName=d;jQuery("#reportListGrid").jqGrid("setGridParam",{postData:c}).trigger("reloadGrid")});a.view.ReportExpireList();$("#reportList").on("click",".report-edit",function(){var c=$(this).data("rowobject");a.view.ExpireDateEdit(c)})}};return a.controller});