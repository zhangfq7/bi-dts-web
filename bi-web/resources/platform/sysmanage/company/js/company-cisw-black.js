define(['sabace', 'message'], function(sabace, message) {

	//移除黑名单
	function ciswDel() {
		jQuery(".cisw-del").on("click", function() {
			var companyId = jQuery(this).attr("companyId");
			var userId = jQuery(this).attr("userId");

			bi.dialog.confirm({
				title: sabace.getMessage('company.label.tip'),
				message: sabace.getMessage('company.cisaw.msg.remove'),
				callback: function(result) {
					if (result) {
						sabace.ajax({
							type: "post",
							cache: false,
							dataType: "json",
							url: sabace.handleUrlParam('/platform/sysmanage/cisaw/black-del'),
							data: {
								"companyId": companyId,
								"userId": userId
							},
							loading:{
								title: sabace.getMessage('company.label.tip'),
		        				text: sabace.getMessage('company.label.pleaseWait')
							},
							success: function(req) {
								bi.dialog.show({
									title: sabace.getMessage('company.label.tip'),
									message: sabace.getMessage('company.cisaw.msg.success.tip'),
									nl2br: false,
									closable: true,
									closeByBackdrop: false,
									closeByKeyboard: false,
									buttons: [{
										label: sabace.getMessage('company.label.confirm'),
										cssClass: 'btn-info',
										action: function(dialogItself) {
											ciswBlackSearch();
											dialogItself.close();
										}
									}]
								});
							},
							error: function(req) {
								bi.dialog.show({
									title: sabace.getMessage('company.label.tip'),
									message: sabace.getMessage('company.cisaw.msg.failure.tip'),
									nl2br: false,
									closable: true,
									closeByBackdrop: false,
									closeByKeyboard: false,
									buttons: [{
										label: sabace.getMessage('company.label.confirm'),
										cssClass: 'btn-info',
										action: function(dialogItself) {
											dialogItself.close();
										}
									}]
								});
							}
						});

					}
				}
			});

		});
	}


	function init() {

		ciswDel();
		//点击查询操作
		jQuery(".cisw-black-operate").on("click", function() {
			ciswBlackSearch();
		});

	}

	//查询黑名单列表
	function ciswBlackSearch() {
		var searchName = jQuery(".cisw-black-lable1").val().trim();
		sabace.ajax({
			type: "post",
			cache: false,
			dataType: "json",
			url: sabace.handleUrlParam('/platform/sysmanage/cisaw/black-search-list'),
			data: {
				"searchName": searchName
			},
			success: function(req) {
				var html = "";
				var ciswBlackList = req.ciswBlackList;
				if (ciswBlackList.length == 0) {
					html += '<div class="cisw-black-line">\n';
					html += '<div class="company-ciswblack-warning">\n';
					html += '<div class="icon">\n';
					html += '!';
					html += '</div>\n';
					html += '<div class="text">' + sabace.getMessage('company.cisaw.blacklist.tip') + '</div>';
					html += '</div>\n';
					html += '</div>\n';
				} else {
					for (var i = 0; i < ciswBlackList.length; i++) {

						html += '<div class="company-ciswblack-line">';
						html += '<div class="company-ciswblack-table company-ciswblack-img">';
						html += '<img style="width: 60px;padding-top: 6px;border-radius: 60px;" src="' + webpath + '/platform/readUserImg/OVERVIEW_SYS?userImgId=' + ciswBlackList[i].userId + '" />';
						html += '</div>';
						html += '<div class="company-ciswblack-table company-ciswblack-first">' + ciswBlackList[i].userName + '</div>';
						html += '<div class="company-ciswblack-table company-ciswblack-third">	';
						html += '<div class="company-ciswblack-label1 f14">' + sabace.getMessage('company.cisaw.label.Postscript') + '</div>';
						html += '<div class="company-cisaw-bad-label2" title="' + ciswBlackList[i].authMsg + '">';
						html += ciswBlackList[i].authMsg;
						html += '</div>';
						html += '<div style="clear:both;"></div>';
						html += '</div>';
						html += '<div class="company-ciswblack-table company-ciswblack-four">';
						html += '<button type="button"  class="cisw-del btn btn-info btn-sm" companyId="' + ciswBlackList[i].companyId + '" userId="' + ciswBlackList[i].userId + '">' + sabace.getMessage('company.cisaw.button.remove') + '</button>';
						html += '</div>';
						html += '</div>';
					}
				}
				jQuery("#cisw-black-list").html("").html(html);
				ciswDel();
			},
			error: function(req) {
			}
		});
	}

	//返回页面所需方法
	return {
		init: init
	}
});