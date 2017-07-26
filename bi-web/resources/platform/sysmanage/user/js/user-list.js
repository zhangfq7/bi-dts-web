define(['sabace', 'userEidt'], function(sabace, userEidt) {

	var userList = {};

	userList.view = {
		/**
		 * 人员信息新增或者修改
		 */
		addOrEditUser: function(userId) {
			var url = sabace.handleUrlParam('/platform/sysmanage/userlist/user-edit-init');
			var count;
			if (userId != undefined) {
				url += '?userId=' + userId;
				userList.view.showAddPanel(url);
			} else {
				userList.view.isFull().then(
					function(req) {
						count = req.fullFlag; //count =0说明人数已满    1表示人数未满
						if (count == 0) {
							bi.dialog.show({
								title: sabace.getMessage('user.label.tip'),
								message: sabace.getMessage('user.userlist.label.signature'),
								nl2br: false,
								closable: true,
								closeByBackdrop: false,
								closeByKeyboard: false
							});

						} else {
							userList.view.showAddPanel(url);
						}
					},
					function(req) {
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('top.label.fail'),
							message: req.responseText
						});
					}
				)

			}

		},

		//查询人员是否已满的方法
		isFull: function() {
			return sabace.ajax({
				type: "post",
				cache: false,
				dataType: "json",
				url: sabace.handleUrlParam("/platform/sysmanage/userlist/is-full-user/")
			});
		},

		showAddPanel: function(url) {
			bi.dialog.show({
				title: sabace.getMessage('user.userlist.button.add'),
				message: $('<div id="add-user-dialog"></div>').load(url),
				spinicon: 'glyphicon glyphicon-refresh',
				cssClass: 'add-user-dialog',
				closeByBackdrop: false,
				closeByKeyboard: false,
				onshown: function() {
					userEidt.init();
				},
				buttons: [{
					label: sabace.getMessage('user.userlist.button.cancel'),
					//hotkey: 13, // Enter  让键盘回车直接出发此按钮
					cssClass: 'btn-default',
					action: function(dialog) {
						dialog.close();
					}
				}, {
					label: sabace.getMessage('user.userlist.button.save'),
					//hotkey: 13, // Enter  让键盘回车直接出发此按钮
					cssClass: 'btn-info',
					action: function(dialog) {
						userEidt.saveUserInfo(dialog);

					}
				}]
			});
		},

		initUserList: function() {

			var userId = $("#userId").val();
			var userName = $("#userName").val();
			var mobileNum = $("#phone").val();
			var jobIds = $("#userJob").val();
			var sex = $("#userSex").val();
			var email = $("#email").val();
			var depId = $("#deptlist").attr("truevalue");


			var postData = {};
			postData.userID = userId;
			postData.userName = userName;
			postData.mobileNum = mobileNum;
			postData.jobIds = jobIds;
			postData.sex = sex;
			postData.email = email;
			postData.depId = depId;

			$("#userListGrid").jqGrid({
				url: sabace.handleUrlParam('/platform/sysmanage/userlist/user-list'),
				styleUI: 'Bootstrap',
				datatype: "json",
				postData: postData,
				mtype: 'post',
				forceFit: true,
				colModel: [{
					label: sabace.getMessage('user.userlist.label.userId'),
					name: 'userID',
					width: 75,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: sabace.getMessage('user.userlist.label.userName'),
					name: 'userName',
					width: 90,
					align: 'left',
					hlign: 'center',
					sortable: false

				}, {
					label: sabace.getMessage('user.userlist.label.job'),
					name: 'jobName',
					width: 100,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: sabace.getMessage('user.userlist.label.sex'),
					name: 'sex',
					width: 80,
					align: 'left',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						if (cellvalue == 1) {
							return '男';
						} else if (cellvalue == 0) {
							return '女';
						} else {
							return '保密';
						}
					}
				}, {
					label: sabace.getMessage('user.userlist.label.dept'),
					name: 'depName',
					width: 180,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: sabace.getMessage('user.userlist.label.email'),
					name: 'email',
					width: 80,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: sabace.getMessage('user.userlist.label.phone'),
					name: 'mobileNum',
					width: 80,
					align: 'left',
					hlign: 'center',
					sortable: false
				}, {
					label: sabace.getMessage('user.userlist.label.operation'),
					name: 'operate',
					width: 80,
					align: 'center',
					hlign: 'center',
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						var userId = rowObject.userID;

						return "<a href='javascript:void(0)' class='user-edit' userId='" + userId + "'>修改</a> /  " +
							"<a href='javascript:void(0)' class='user-del' userId='" + userId + "'>删除</a> ";
					}
				}],
				viewrecords: true, // show the current page, data rang and total records on the toolbar
				autowidth: true,
				height: 'auto',
				rowNum: 10,
				rowList: [10, 20, 30],
				rownumbers: true, //show row number
				pager: "#userListGridPager",
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
	}

	userList.controller = {

		init: function() {
			$('#userSex').chosen({
				disable_search: true
			});

			$('#userJob').chosen({
				disable_search: true
			});

			jQuery("#deptlist").treeselect({
				height: 200,
				searchAjaxParam: "depName",
				chkStyle: "checkbox",
				width: (jQuery('#deptlist').width() + 21),
				url: sabace.handleUrlParam('/platform/sysmanage/dept/company-dept')
			});


			$(window).resize(function() {
				sabace.timeout(function() {
					$("#userListGrid").setGridWidth($("#listPanel").width() - 5);
				}, 100)
			});

			$(".user-list-div input").css("height", "28px");

			$("#addUserButton").on("click", function() {
				userList.view.addOrEditUser()
			});

			userList.view.initUserList();

			jQuery("#searchButton").on("click", function() {

				var userId = $("#userId").val();
				var userName = $("#userName").val();
				var mobileNum = $("#phone").val();
				var jobIds = $("#userJob").val();
				var sex = $("#userSex").val();
				var email = $("#email").val();
				var depId = $("#deptlist").attr("truevalue");

				var postData = {};
				postData.userID = userId;
				postData.userName = userName;
				postData.mobileNum = mobileNum;
				postData.jobIds = jobIds;
				postData.sex = sex;
				postData.email = email;
				postData.depId = depId;
				jQuery("#userListGrid").jqGrid("setGridParam", {
					postData: postData
				}).trigger("reloadGrid");
			});

			/**
			 * 修改
			 */
			$("#userList").on("click", '.user-edit', function() {
				var userId = $(this).attr("userId");
				userList.view.addOrEditUser(userId);
			});

			/**
			 * 删除
			 */
			$("#userList").on("click", '.user-del', function() {
				var userId = $(this).attr("userId");

				bi.dialog.confirm({
					title: sabace.getMessage('user.label.tip'),
					message: sabace.getMessage('user.label.del.confirm'),
					callback: function(result) {
						if (result) {
							sabace.ajax({
								type: "post",
								cache: false,
								dataType: "json",
								url: sabace.handleUrlParam("/platform/sysmanage/userlist/user-list-del/"),
								data: {
									"userId": userId
								},
								loading: {
									title: sabace.getMessage('user.label.tip'),
									text: sabace.getMessage('user.label.del.loading')
								},
								success: function(req) {
									if (req.resFlag == '0') {
										bi.dialog.show({
											type:bi.dialog.TYPE_WARNING,
											title: sabace.getMessage('user.label.tip'),
											message: '不能删除当前用户',
											nl2br: false,
											closable: true,
											closeByBackdrop: false,
											closeByKeyboard: false
										});

									} else {

										bi.dialog.show({
											title: sabace.getMessage('user.label.tip'),
											message: '用户信息删除成功！',
											nl2br: false,
											closable: true,
											closeByBackdrop: false,
											closeByKeyboard: false,
											buttons: [{
												label: '确定',
												cssClass: 'btn-info',
												action: function(dialogItself) {
													jQuery("#searchButton").trigger("click");
													dialogItself.close();
												}
											}]
										});
									}
								},
								error: function(req) {
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: sabace.getMessage('user.label.error'),
										message: req.responseText || sabace.getMessage('user.label.delError')
									});
								}
							});
						}
					}
				});
			});

/*			//判断人员是否已满，如果满了，新增按钮不能使用
			userList.view.isFull().then(function(req) {
				count = req.fullFlag; //count =0说明人数已满    1表示人数未满
				if (count == 0) {
					jQuery("#addUserButton").attr('title', sabace.getMessage('user.userlist.label.signature'));
				} else {
					jQuery("#addUserButton").attr('title', '');
					jQuery("#addUserButton").attr("disabled", false);
				}
			}, function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('top.label.fail'),
					message: req.responseText
				});
			});*/
			
			jQuery("body").on("click",".orderusernum",function(){
				window.open(sabace.handleUrlParam('/platform/serviceopen/order-usernum'))
			})
		}
	}

	//返回页面所需方法
	return userList.controller
});