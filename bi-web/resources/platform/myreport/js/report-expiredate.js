define(['sabace'], function(sabace) {

	var reportList = {};

	reportList.view = {
		ReportExpireList: function(){
			var postData = {};
			$("#reportListGrid").jqGrid({
				 url: sabace.handleUrlParam('/platform/dataview/query-report-expireDate'),
				 styleUI: 'Bootstrap',
				 datatype: "json",
				 postData: postData,
				 mtype: 'post',
				 forceFit: true,
				 colModel: [{
						name: 'reportId',
						width: 75,
						align: 'left',
						hlign: 'center',
						hidden: true,
						sortable: false
					},{
						label: sabace.getMessage('report.reportlist.label.reportName'),
						name: 'reportName',
						width: 180,
						align: 'left',
						hlign: 'center',
						sortable: false
					}, {
						label: sabace.getMessage('report.reportlist.label.createUsername'),
						name: 'userName',
						width: 90,
						align: 'left',
						hlign: 'center',
						sortable: false
					}, {
						label: sabace.getMessage('report.reportlist.label.createTime'),
						name: 'createTime',
						width: 180,
						align: 'left',
						hlign: 'center',
						sortable: false
					},{
						label: sabace.getMessage('report.reportlist.label.expireDate'),
						name: 'expireDate',
						width: 180,
						align: 'left',
						hlign: 'center',
						sortable: false
					},{
						label: sabace.getMessage('report.reportlist.label.expireDateEdit'),
						name: 'operate',
						width: 80,
						align: 'center',
						hlign: 'center',
						sortable: false,
						formatter: function(cellvalue, options, rowObject) {
							return "<a href='javascript:void(0)' class='report-edit' data-rowobject='"+ JSON.stringify(rowObject) + "'>修改</a>";
						}
					}],
				viewrecords: true, // show the current page, data rang and total
				autowidth: true,
				height: 'auto',
				rowNum: 10,
				rowList: [10, 20, 30],
				rownumbers: true, // show row number
				pager: "#reportListGridPager",
				jsonReader: {
					records: "total",
					total: "totalPages"
				},
				afterInsertRow: function(rowId, data) {
					jQuery(this).jqGrid('setCell', rowid, 'operate', '<a>操作</a>');
				},
				regional: 'cn'
			  });
			},
	ExpireDateEdit: function(rowObject){
		// 字段编辑对话框
		var dialog = bi.dialog.show({
			title: sabace.getMessage('report.reportlist.label.expireDateEdit'),
			message: ' <div id="expire-date-edit-page">'
			+'<div id="edit-page" class="validationEngineContainer">'
			+'<div class="edit-expireDate-dialog">'
			+'<label class="col-xs-3 control-label " id="reportNameLabel">'
			+'</label>'
			+'<div class="edit-expireDate-list-div col-xs-6">'
			+'<input id="reportName" type="text" class="form-control" disabled="disabled" id="reportName" value="">'
			+'</div>'
			+'<div style="clear:both;"></div>'
			+'</div>'
			+'<div class="edit-expireDate-dialog">'
			+'<label class="col-xs-3 control-label" id="createUsernameLabel">'
			+'</label>'
			+'<div class="edit-expireDate-list-div col-xs-6">'
			+'<input id="createUsername" type="text" class="form-control" disabled="disabled" value="">'
		    +'</div>'
		    +'<div style="clear:both;"></div>'
		    +'</div>'
		    +'<div class="edit-expireDate-dialog">'
		    +'<label class="col-xs-3 control-label" id="createTimeLabel">'
		    +'</label>'
		    +'<div class="edit-expireDate-list-div col-xs-6">'
		    +'	<input id="createTime" type="text" class="form-control" disabled="disabled"  value="">'
		    +'</div>'
		    +'<div style="clear:both;"></div>'
		    +'</div>'
		    +'<div class="edit-expireDate-dialog">'
		    +'<label class="col-xs-3 control-label" id="expireDateLabel">'
		    +'</label>'
		    +'<div class="edit-expireDate-div col-xs-6">'
		    +'	<input id="expireDate"  type="text" class="form-control "   value=""/>'
		    +'	</div>'
		    +'	<div style="clear:both;"></div>'
		    +'</div>'
		    +'</div>'
		    +'</div>',
			nl2br: false,
			closable: true,
			closeByBackdrop: false,
			closeByKeyboard: false,
		    cssClass: 'expireDate-add-dialog',
			buttons: [{
				label: sabace.getMessage('report.reportlist.button.cancel'),
				action: function(dialog) {
					dialog.close();
				}
			}, {
				label: sabace.getMessage('report.reportlist.button.save'),
				cssClass: 'btn-info',
				action: function(dialogItself) {
					// 判断验证
					var isPass = dialog.getModalBody().find("#edit-page").validationEngine('validate');
					if (!isPass) {
						return false;
					}
					bi.dialog.confirm({
						title: sabace.getMessage('report.reportlist.msg.confirm'),
						message: sabace.getMessage('report.reportlist.msg.saveConfirm'),
						callback: function(result) {
							if (!result) {
								return;
							}
							var expireDate = dialog.getModalBody().find("#expireDate").val();
							var dataParams = {
								reportId: reportId,
								expireDate: expireDate,
							};
							sabace.ajax({
								loading: {
									title: sabace.getMessage('report.reportlist.label.tip'),
									text: sabace.getMessage('report.reportlist.label.pleaseWait')
								},
								url: sabace.handleUrlParam("/platform/dataview/edit-report-expireDate"),
								data: dataParams,
								success: function(req) {
									dialog.close();
									jQuery('#reportListGrid').trigger("reloadGrid");
								},
								error: function(req) {
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: sabace.getMessage('report.reportlist.label.tip'),
										message: req.responseText || sabace.getMessage('report.msg.save.exception')
									});
								}
							});

						}
					});
				}
			}],
		});
		
		//   国际化配置文件，页面配置
		dialog.getModalBody().find('#reportNameLabel').text(sabace.getMessage('report.reportlist.label.reportName')+"：");
		dialog.getModalBody().find('#createUsernameLabel').text(sabace.getMessage('report.reportlist.label.createUsername')+"：");
		dialog.getModalBody().find('#createTimeLabel').text(sabace.getMessage('report.reportlist.label.createTime')+"：");
		dialog.getModalBody().find('#expireDateLabel').text(sabace.getMessage('report.reportlist.label.expireDate')+"：");
		
		//初始化值
		dialog.getModalBody().find("#reportName").attr("value", "");
		dialog.getModalBody().find("#createUsername").attr("value", "");
		dialog.getModalBody().find("#createTime").attr("value", "");
		dialog.getModalBody().find("#expireDate").attr("value", "");
		
		//赋值
		dialog.getModalBody().find("#reportName").attr("value", rowObject.reportName);
		dialog.getModalBody().find("#createUsername").attr("value",   rowObject.userName);
		dialog.getModalBody().find("#createTime").attr("value", rowObject.createTime);
		dialog.getModalBody().find("#expireDate").attr("value", rowObject.expireDate);
		var reportId=rowObject.reportId;
		
		//输入框添加日历控件
		dialog.getModalBody().find("#expireDate").datepicker({
			onSelect : function(date) {
				this.focus();
				this.blur();
			},
			minDate : new Date(),
			dateFormat : 'yy-mm-dd',
			changeMonth: true,
			changeYear: true,
		});
		
		dialog.getModalBody().find("#expire-date-edit-page").validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'topRight',
			showOneMessage: true
		});
		
	  }
			
	}
	
	reportList.controller={
			init: function () {	
				/**
				 * 查询
				 */
			    jQuery("#searchButton").on("click", function() {
			    	var reportName = $("#queryReportName").val();
			    	var postData = {};
			    	postData.reportName = reportName;
			    	jQuery("#reportListGrid").jqGrid("setGridParam", {
							postData: postData
						}).trigger("reloadGrid");
			    });
			    
			 reportList.view.ReportExpireList();
			 
				/**
				 * 有效期修改
				 */
				$('#reportList').on("click", '.report-edit', function() {
							var rowObject = $(this).data("rowobject");
							reportList.view.ExpireDateEdit(rowObject);
				     	});
				}
			}
		return reportList.controller
});