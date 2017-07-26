define(['sabace','data-downfile'], function(sabace,downfile) {

	var dataDownFileList = {};
	dataDownFileList.view = {

		initDataDownFileList: function() {

			var logId = $("#logId").val();
			var fileName = $("#fileName").val();
			var fileState =$("#fileState").val();
			var userName = $("#userName").val();
			var fileProgress = $("#fileProgress").val();
			var adminTime = $("#adminTime").val();
            var taskTotalsecond = $("#taskTotalsecond").val();
            
			var postData = {};
			postData.logId = logId;
			postData.fileName = fileName;
			postData.fileState = fileState;
			postData.userName = userName;
			postData.fileProgress = fileProgress;
			postData.adminTime = adminTime;
			postData.taskTotalsecond = taskTotalsecond;


			$("#downFileListGrid").jqGrid({
				url: sabace.handleUrlParam('/platform/resmanage/db/query-downfile-list'),
				styleUI: 'Bootstrap',
				datatype: "json",
				postData: postData,
				mtype: 'post',
				forceFit: true,
				colModel: [{
					index: 'logId',
					label: '选择',
					formatter: function(cellvalue, options, rowObject) {
						var html = '<input type="checkbox" id="selectLogId" value="' + rowObject.logId + '" name="' + rowObject.fileName + '" fileState="' + rowObject.fileState + '" userName="' + rowObject.userName + '" />';
						html += '<div style="display:none">' + rowObject.depDesc + '</div>';
						return html;
					},
					cellattr: function(rowId, tv, rawObject, cm, rdat) {
						if (!rawObject.logId) {
							var colModel = jQuery(this).jqGrid('getGridParam', 'colModel');
							return 'colspan=' + colModel.length;
						}
					},
					hlign: "center",
					align: "center",
					sortable: false,
					width: 30,
					title:false
				},{
					label: "文件名称",
					name: 'fileName',
					width: 80,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: "生成状态",
					name: 'fileState',
					width: 50,
					align: 'left',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						if (cellvalue == 1) {
							return '正在生成';
						} else if (cellvalue == 2) {
							return '生成完毕';
						}  else if (cellvalue == 4) {
							return '生成失败';
						}else {
							return '文件已删除';
						}
					}
				},{
					label: "生成进度",
					name: 'fileProgress',
					width: 80,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: "操作人",
					name: 'userName',
					width: 80,
					align: 'left',
					hlign: 'center',
					sortable: false,
				},  {
					label: "操作时间",
					name: 'adminTime',
					width: 80,
					align: 'left',
					hlign: 'center',
					sortable: false,
				}, {
					label: "下载耗时（秒）",
					name: 'taskTotalsecond',
					width: 80,
					align: 'left',
					hlign: 'center',
					sortable: false,
				}, {
					label: "操作",
					name: 'operate',
					width: 100,
					align: 'center',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						var logId = rowObject.logId;
						var fileName = rowObject.fileName;
						if(rowObject.fileState == '2'){
							return "<a href='javascript:void(0)' class='data-downfile' data-logid='" + logId + "' data-filename='" + fileName + "'>下载</a> /  " +
								   "<a href='javascript:void(0)' class='downfile-del' data-logid='" + logId + "'>删除</a> ";
						}
						else{
							return "" ;
						}	
					}
				}],
				viewrecords: true, // show the current page, data rang and total records on the toolbar
				autowidth: true,
				height: 'auto',
				rowNum: 10,
				rowList: [10, 20, 30],
				//rownumbers: true, //show row number
				pager: "#downFileListGridPager",
				jsonReader: {
					records: "total",
					total: "totalPages"
				},
				afterInsertRow: function(rowId, data) {
					jQuery(this).jqGrid('setCell', rowid, 'operate', '<a>操作</a>');
				},
				regional: 'cn'
			});
		}
	};

	dataDownFileList.controller = {

		init: function() {

			//列表自适应
			$(window).resize(function() {
				sabace.timeout(function() {
					$("#downFileListGrid").setGridWidth($("#listPanel").width() - 5);
				}, 100);
			});
			
			// 点击查询的操作
			jQuery("#searchButton").on("click", function() {
				queryDFList();
			});
			
			// 点击批量删除的操作
			jQuery("#batchDelFile").on("click", function() {
				operDelDFDialog();
			});
			
			//点击下载的操作
			$("#downFileList").on("click", '.data-downfile', function(){
				var logId = $(this).data("logid");
				var fileName = $(this).data("filename");
				bi.dialog.confirm({
					title: '提示',
					message: '是否确定下载该数据报表',
					callback: function(result) {
						if (result) {
							doDownFile({logId:logId,fileName:fileName});
						}
					}
				});
				
			});

			
			/**
			 * 下载文件
			 */
			function doDownFile(paramData) {
				jQuery("#downData").remove();
				jQuery("<form>",{
					"id":"downData",
					"method":"post",
					"action":sabace.handleUrlParam("/platform/resmanage/db/download-file"),
					"target":"_self",
					"html":"<input name='fileName' type='hidden' value='"+paramData.fileName+"'/><input name='logId' type='hidden' value='"+paramData.logId+"'/>"

				}).appendTo("body");
				jQuery("#downData").submit();
			}
			
			
			//离线下载数据删除后实现页面的数据列表的刷新
			function reloadDF(){
				queryDFList();
			}
			
			dataDownFileList.view.initDataDownFileList();

			// 根据录入的查询条件，查询数据信息
			function queryDFList() {
				var postData = {};
				postData.fileName = $("#fileName").val();

				jQuery("#downFileListGrid").jqGrid("setGridParam", {
					postData: postData
				}).trigger("reloadGrid");
			}
			
			
			//删除数据库信息
			function deleteDB(logId){
				//向后台发送请求获取数据库信息
				sabace.ajax({
					url: sabace.handleUrlParam("/platform/resmanage/db/delete-downfile"),
					data:{
						logId: logId
					},
					loading: {
						title: '提示',
						text: '正在删除文件，请稍后...'
					},
					success: function(req) {
						if(req.resFlag == "success"){
							bi.dialog.show({
								type: bi.dialog.TYPE_INFO,
					            title: "提示",
					            message: "文件删除成功！"
						    });
							//页面清除
							reloadDF();
						}
					},
					error: function(req) {
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: "错误",
							message: "文件下载失败，请找管理员处理！"
						});
					}
				});
			}
			
			// 执行批量删除处理操作
			function delDB(logIdArray) {
				var paramData = {};
				paramData.logIdArray = logIdArray;

				sabace.ajax({
					url: sabace.handleUrlParam("/platform/resmanage/db/delete-downfile-list"),
					data: paramData,
					loading: {
						title: '提示',
						text: '正在删除，请稍后！'
					},
					success: function(req) {
						if (req.delFlag == "true") {
							bi.dialog.show({
								title:'提示' ,
								message: '您选择的文件信息已删除成功！',
								onhide: function() {
									reloadDF();
								}
							});
						} else {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: '提示',
								message: '您选择的文件信息删除失败，请重试！'
							});
						}
					},
					error: function(req) {
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: '提示',
							message: '删除文件信息的过程中出现异常！'
						});
					}
				});
			}
			
			// 做批量删除前的确认
			function operDelDFDialog() {
				var checkArray = $("#selectLogId:checked");
				if (checkArray.length < 1) {
					bi.dialog.show({
						type: 'type-warning',
						title: '提示',
						message: '请至少选择一条要删除的文件信息！',
					});
					return;
				}

				var logIdArray = [];
				for (var i = 0; i < checkArray.length; i++) {
					logIdArray[i] = jQuery(checkArray[i]).val();
					var fileName = jQuery(checkArray[i]).attr("name");
					var fileState = jQuery(checkArray[i]).attr("fileState");
					var userName = jQuery(checkArray[i]).attr("userName");
					if (parseInt(fileState) != 2) {
						bi.dialog.show({
							type: 'type-warning',
							title: '提示',
							message: '部分文件没有生成完成，不允许删除，请检查后再试！',
						});
						return;
					}

				}

				bi.dialog.confirm({
					title: '确认',
					message: '您确定需要删除该文件吗？',
					callback: function(result) {
						if (!result) {
							return;
						}
						delDB(logIdArray);
					}
				});
			}

			//删除
			$("#downFileList").on("click", '.downfile-del', function() {
				var logId = $(this).data("logid");

				bi.dialog.confirm({
		            title: "提示",
		            message: "您确定需要删除该文件吗？",
		            callback: function(result) {
		                if(result) {
		                	deleteDB(logId);
		                }
		            }
			    });
			});
		}
	};

	//返回页面所需方法
	return dataDownFileList.controller;
});