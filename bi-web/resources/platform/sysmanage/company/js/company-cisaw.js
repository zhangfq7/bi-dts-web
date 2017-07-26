define(['sabace', 'company/message'], function(sabace, message) {
	//同意，加入黑名单 ，拒绝，删除的操作
	function ciswOperate() {
		jQuery(".cisw-operate").on("click", function() {
			var handleState = $(this).attr("handleState");
			var msgId = $(this).attr("msgId");
			var companyId = $(this).attr("companyId");
			var userId = $(this).attr("userId");
			var msgShow = sabace.getMessage('company.label.tip');
			var msgShowSuccess = sabace.getMessage('company.label.tip');
			var url = sabace.handleUrlParam('/platform/sysmanage/cisaw/cisaw-operate');

			switch (handleState) {
				case '-1':
					msgShow = sabace.getMessage('company.cisaw.msg.del');
					msgShowSuccess = sabace.getMessage('company.cisaw.msg.success');
					url = sabace.handleUrlParam('/platform/sysmanage/cisaw/ciws-del');
					break;
				case '2':
					msgShow = sabace.getMessage('company.cisaw.msg.agree');
					msgShowSuccess = sabace.getMessage('company.cisaw.msg.agreesuccess');
					break;
				case '3':
					msgShow = sabace.getMessage('company.cisaw.msg.blacklist');
					msgShowSuccess = sabace.getMessage('company.cisaw.msg.success');
					break;
				case '4':
					msgShow = sabace.getMessage('company.cisaw.msg.refuse');
					msgShowSuccess = sabace.getMessage('company.cisaw.msg.success');
					break;
				default:
					msgShow = sabace.getMessage('company.label.tip');
			}

			//开始操作
			bi.dialog.confirm({
				title: sabace.getMessage('company.label.tip'),
				message: msgShow,
				callback: function(result) {
					if (result) {
						sabace.ajax({
							url: url,
							data: {
								"handleState": handleState,
								"msgId": msgId,
								"userId": userId,
								"companyId": companyId
							},
							loading: {
								title: sabace.getMessage('company.label.tip'),
								text: sabace.getMessage('company.label.pleaseWait')
							},
							success: function(req) {
								//超过当前公司最大用户数的提示
								if (req.flag == '0') {
									bi.dialog.show({
										title: sabace.getMessage('company.label.tip'),
										message: sabace.getMessage('company.cisaw.msg.maxNum'),
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

								} else {
									//操作成功
									bi.dialog.show({
										title: sabace.getMessage('company.label.tip'),
										message: msgShowSuccess,
										nl2br: false,
										closable: true,
										closeByBackdrop: false,
										closeByKeyboard: false,
										buttons: [{
											label: sabace.getMessage('company.label.confirm'),
											cssClass: 'btn-info',
											action: function(dialogItself) {
												var $obj = jQuery(".company-cisaw-btn").find('.clickedButton');
												$obj.trigger('click');
												dialogItself.close();
											}
										}]
									});

								}

							},
							error: function(req) {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('company.label.error'),
									message: req.responseText || sabace.getMessage('company.cisaw.msg.delError')
								});
							}
						});

					}
				}
			});


		});
	}

	function init() {
		
		//给按钮组点击样式
		jQuery(".company-cisaw-btn button").bind("click", function() {
			jQuery(this).removeClass("normal-button").addClass("clicked-button theme-background").siblings().addClass("normal-button").removeClass("clicked-button theme-background");
		})
		jQuery(".company-cisaw-btn button").on('mouseover', '.normal-button', function() {
			jQuery('.normalButton').removeClass('theme-background');
			jQuery(".company-cisaw-btn button").addClass('theme-background');
		}).on('mouseleave', '.normal-button', function() {
			jQuery(".company-cisaw-btn button").removeClass('theme-background');
		})


		

		//点击今天，明天，更早的操作
		jQuery('.company-cisaw-btn').on('click', '.btn', function() {

			var flag = $(this).attr("flag");
			var timeStart = "";
			var timeEnd = "";
			var date = new Date();
			var time = date.getTime();
			var day = date.getDay() == 0 ? 7 : date.getDay();

			switch (flag) {
				case '1':
					timeStart = time;
					timeEnd = time;
					break;
				case '2':
					timeStart = time - (day - 1) * 24 * 60 * 60 * 1000;
					timeEnd = time;
					break;
				case '3':
					timeStart = time - (day + 6) * 24 * 60 * 60 * 1000;
					timeEnd = time - day * 24 * 60 * 60 * 1000;
					break;
				case '5':
					break;
				default:
					timeEnd = time - (date.getDay() + 6) * 24 * 60 * 60 * 1000;
			}

			var paramData = {
				"flag": flag,
				"timeEnd": timeChange(timeEnd, 0),
				"timeStart": timeChange(timeStart, 1),
			};

			sabace.ajax({
				type: 'post',
				cache: false,
				dataType: "json",
				url: sabace.handleUrlParam('/platform/sysmanage/cisaw/cisaw-list'),
				data: paramData,
				success: function(req) {
					var $dom = jQuery('#company-cisw-content');
					$dom.html("");
					var companyAuthList = req.companyAuthList;
					if (companyAuthList == null) {
						$dom.append("<div class='company-cisw-warning'>\n" +
							"<div class='icon'>\n" +
							"!" +
							"</div>\n" +
							"<div class='text'>" + sabace.getMessage('company.cisaw.list.tip') + "</div>\n" +
							"</div>\n" +
							"</div>\n");
					} else {
						var contentHtml = "";
						for (var i = 0; i < companyAuthList.length; i++) {
							contentHtml +=
								"<div class='company-cisaw-time'>\n" +
								"<label for='upload' class=''>" + companyAuthList[i].adminTime + "</label>\n" +
								"</div>\n" +
								"   <div class='panel-cisaw company-cisaw-line'>\n" +
								"          <div class='company-cisaw-table company-cisaw-img'>\n" +
								"            <img class='toux' userId='" + companyAuthList[i].userId + "' style='width: 60px;border-radius: 60px;' src='" + webpath + "/platform/readUserImg/OVERVIEW_SYS?userImgId=" + companyAuthList[i].userId + "' />\n" +
								"          </div>\n" +
								"          <div class='company-cisaw-table company-cisaw-first' title='" + companyAuthList[i].userName + "'>" + companyAuthList[i].userName + "</div>\n" +
								"          <div class='company-cisaw-table company-cisaw-second'>" + sabace.getMessage('company.cisaw.label.add') + "</div>\n" +
								"          <div class='company-cisaw-table company-cisaw-third'>\n" +
								"            <div class='company-cisaw-label1'>" + sabace.getMessage('company.cisaw.label.Postscript') + "</div>\n" +
								"            <div class='company-cisaw-label2' title='" + companyAuthList[i].authMsg + "'>\n" +
								companyAuthList[i].authMsg +
								"            </div>\n" +
								"            <div style='clear:both;'></div>\n" +
								"          </div>\n" +
								"          <div class='company-cisaw-table'>";

							var handleState = companyAuthList[i].handleState;

							if (handleState == '1') {
								contentHtml +=
									"<button type='button' class='cisw-operate btn btn-info btn-sm' handleState='2' companyId='" + companyAuthList[i].companyId + "' userId='" + companyAuthList[i].userId + "' msgId='" + companyAuthList[i].msgId + "'>" +
									sabace.getMessage('company.cisaw.button.agree') +
									"</button>" +
									"<button type='button' class='cisw-operate cisw-operate-bak btn btn-info btn-sm' handleState='3' companyId='" + companyAuthList[i].companyId + "' userId='" + companyAuthList[i].userId + "' msgId='" + companyAuthList[i].msgId + "'>" +
									sabace.getMessage('company.cisaw.button.add') +
									"</button>" +
									"<button type='button' class='cisw-operate cisw-operate-bak btn btn-info btn-sm' handleState='4' companyId='" + companyAuthList[i].companyId + "' userId='" + companyAuthList[i].userId + "' msgId='" + companyAuthList[i].msgId + "'>" +
									sabace.getMessage('company.cisaw.button.refuse') +
									"</button>" +
									"<button type='button' class='cisw-operate cisw-operate-bak btn btn-danger btn-sm' handleState='-1' companyId='" + companyAuthList[i].companyId + "' userId='" + companyAuthList[i].userId + "' msgId='" + companyAuthList[i].msgId + "'>" +
									sabace.getMessage('company.cisaw.button.delete') +
									"</button>";
							} else if (handleState == '2') {

								contentHtml += "<span style='  display: inline-block;width: 203px;'>" + sabace.getMessage('company.cisaw.label.agree') + "</span>";

							} else if (handleState == '4') {

								contentHtml +=
									"<span style='  display: inline-block;width: 203px;'>" + sabace.getMessage('company.cisaw.label.refuse') + "</span>" +
									"<button type='button' class='cisw-operate cisw-operate-bak btn btn-danger btn-sm' handleState='-1' companyId='" + companyAuthList[i].companyId + "' userId='" + companyAuthList[i].userId + "' msgId='" + companyAuthList[i].msgId + "'>" +
									sabace.getMessage('company.cisaw.button.delete') +
									"</button>";

							} else if (handleState == '9') {

								contentHtml +=
									"<span style='  display: inline-block;width: 203px;'>" + sabace.getMessage('company.cisaw.label.handle') + "</span>" +
									"<button type='button' class='cisw-operate cisw-operate-bak btn btn-danger btn-sm' handleState='-1' companyId='" + companyAuthList[i].companyId + "' userId='" + companyAuthList[i].userId + "' msgId='" + companyAuthList[i].msgId + "'>" +
									sabace.getMessage('company.cisaw.button.delete') +
									"</button>";

							} else if (handleState == '6') {

								contentHtml += "<span style='  display: inline-block;width: 203px;'>" + sabace.getMessage('company.cisaw.label.Processing') + "</span>";

							} else {

								contentHtml +=
									"<span style='  display: inline-block;width: 203px;'>" + sabace.getMessage('company.cisaw.label.revoke') + "</span>" +
									"<button type='button' class='cisw-operate cisw-operate-bak btn btn-danger btn-sm' handleState='-1' companyId='" + companyAuthList[i].companyId + "' userId='" + companyAuthList[i].userId + "' msgId='" + companyAuthList[i].msgId + "'>" +
									sabace.getMessage('company.cisaw.button.delete') +
									"</button>";

							}

							contentHtml += "</div></div>";
						}
					}

					$dom.append(contentHtml);
					ciswOperate();

				},
				error: function(req) {

				}
			});

		});
		ciswOperate();

		//点击黑名单
		$("#black-info").on('click', function() {
			var url = sabace.handleUrlParam('/platform/sysmanage/cisaw/black-list');
			bi.dialog.show({
				title: sabace.getMessage('company.cisaw.label.blacklist'),
				message: jQuery('<div id="groupIframe" width="670px" height="450px"></div>').load(url),
				cssClass: 'black-info-dialog',
				closeByBackdrop: false,
				closeByKeyboard: false
			});
		});

		//点击头像
		$("#company-cisw-content").on('click', '.company-cisaw-img', function() {

			var userId = jQuery(this).find('img').attr('userId');
			var url = sabace.handleUrlParam('/platform/sysmanage/cisaw/details-list') + "?userId=" + userId;
			bi.dialog.show({
				title: '个人信息',
				message: jQuery('<div id="touxframe" ></div>').load(url),
				cssClass: 'toux-info-dialog',
				closeByBackdrop: false,
				closeByKeyboard: false,
				buttons: [{
					label: '确认',
					cssClass: 'btn-info',
					action: function(dialogItself) {
						dialogItself.close();
					}
				}]
			});
		});


	};

	function timeChange(longtime, flag) {

		if (longtime == '') {
			return "";
		} else {

			var date = new Date(longtime);
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var timeParam = "";

			if (month == 12) {
				year = year + 1;
				month = 1;
			} else {
				month = month + 1;
			}

			if (month < 10) {
				month = '0' + month;
			}

			if (day < 10) {
				day = '0' + day;
			}

			timeParam = flag == '1' ? '00:00:00' : '59:59:59'

			return year + "-" + month + "-" + day + " " + timeParam;
		}
	}

	//返回页面所需方法
	return {
		init: init
	}
});