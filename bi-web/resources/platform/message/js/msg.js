define(['sabace', 'layout', 'mymessage'], function(sabace, layout, mymessage) {
	var msg = {};
	msg.model = {
		fist: true, //判断是否是第一次进入页面
		checkIndex: '', //shift选择时候的起始位置
		isHaveMsg: true, //是否有值
		allSelectFlag: false
	}
	msg.view = {
		getMsgByPram: function(data) {
			return sabace.ajax({
				url: webpath + '/platform/msg/get-msg', // 该地址不需要加funcId
				data: data
			});
		},
		getMsg: function(page) {
			var pro = jQuery(".msg-leve-panel .clickClass").attr("pro");
			if (pro == undefined) {
				pro = 'all';
			}
			var data = {
				rows: jQuery(".ui-layout-west .pagination-page-list :selected").val(),
				page: page,
				type: pro
			};
			if (pro == 'all') {
				data.msgLevel = '';
			} else if (pro == 'new') {
				data.readState = 0;
			} else if (pro == 'level1') {
				data.msgLevel = 1;
			} else if (pro == 'level2') {
				data.msgLevel = 2;
			} else if (pro == 'level3') {
				data.msgLevel = 3;
			}
			msg.view.getMsgByPram(data).done(function(req) {
				//处理等级数量levelInfo
				var $obj = jQuery(".ui-layout-north .msg-leve-panel");

				//判断是否有消息来设置页面的布局
				if (req.levelInfo == null || req.levelInfo.allCount == 0) {
					msg.model.isHaveMsg = false;
					jQuery(".ui-layout-west,.ui-layout-center,.ui-layout-resizer-west").hide();
					jQuery("#msgcontent .noMsg").show();
					jQuery(".msg-button-panel button").prop("disabled", "disabled").css("cursor", "not-allowed");
				} else {
					msg.model.isHaveMsg = true;
					jQuery(".ui-layout-west,.ui-layout-center,.ui-layout-resizer-west").show();
					jQuery("#msgcontent .noMsg").hide();
					jQuery(".msg-button-panel button").removeAttr("disabled").css("cursor", "pointer");
				}

				var $obj = jQuery(".ui-layout-north .msg-leve-panel");
				$obj.html("");
				if (req.levelInfo == null || req.levelInfo.allCount == 0) {
					$obj.append('<div><div class="msg-level no-read"></div> <span>' + sabace.getMessage('msg.label.new') + '(<span class="noreadCount">0</span>)</span></div>');
				} else {
					$obj.append('<div pro="all"><span class="all">' + sabace.getMessage('msg.label.all') + '(' + req.levelInfo.allCount + ')</span></div>');

					if (req.levelInfo.noReadCount != 0) {
						$obj.append('<div pro="new"><div class="msg-level no-read"></div> <span>' + sabace.getMessage('msg.label.new') + '(<span class="noreadCount">' + req.levelInfo.noReadCount + '</span>)</span></div>');
					}

					if (req.levelInfo.level1Count != 0) {
						$obj.append('<div pro="level1"><div class="msg-level level-1"></div> <span>' + sabace.getMessage('msg.label.ordinary') + '(' + req.levelInfo.level1Count + ')</span></div>');
					}

					if (req.levelInfo.level2Count != 0) {
						$obj.append('<div pro="level2"><div class="msg-level level-2"></div> <span>' + sabace.getMessage('msg.label.important') + '(' + req.levelInfo.level2Count + ')</span></div>');
					}

					if (req.levelInfo.level3Count != 0) {
						$obj.append('<div pro="level3"><div class="msg-level level-3"></div> <span>' + sabace.getMessage('msg.label.urgent') + '(' + req.levelInfo.level3Count + ')</span></div>');
					}
				}
				jQuery(".msg-leve-panel>div[pro=" + req.type + "]").addClass("clickClass theme-background theme-border-color");
				if (req.msgList.rows.length != 0) {
					jQuery(".ui-layout-west .totalPages").html(req.msgList.totalPages);
					jQuery(".ui-layout-west .pageNum").html(req.msgList.page);
					var $this = jQuery(".ui-layout-west .msglist");
					$this.animate({
						scrollTop: 0
					}, 100).html(""); //把列表信息清空
					jQuery.each(req.msgList.rows, function(i, v) {
							var div = jQuery("<div>", {
								'class': 'list-group-item ' + (v.readState == '0' ? 'noread' : 'hasread'),
								'pro': v.msgId
							});

							var level = jQuery("<div>", {
								'class': 'msg-left-level',
								'html': (v.readState == '0' ? '<div class="msg-level no-read "></div>' : '') + '<div class="msg-level level-' + v.msgLevel + '"></div>'
							})

							var img = jQuery("<div>", {
								'class': 'msg-left-img',
								'html': '<img src="' + webpath + '/platform/readUserImg/' + funcId + '?t=' + new Date() + '&userImgId=' + v.sendUserId + '" />'
							})

							var info = jQuery("<div>", {
								'class': 'msg-left-info',
								'html': '<div class="userName">' + v.sendUserName + '</div><div class="title">' + v.msgTitle + '</div>'
							})

							var time = jQuery("<div>", {
								'class': 'msg-left-time',
								'html': sabace.date.getDateDiff(v.sendTime),
								'pro': v.sendTime
							})

							var content = jQuery("<div>", {
								'class': "msg-left-content",
								'html': v.msgContent
							})

							div.append(level)
								.append(img)
								.append(info)
								.append(time)
								.append(content);

							$this.append(div)
						})
						//如果为开启全选状态，全部选中
					if (msg.model.allSelectFlag) {
						$this.find('>div').addClass('allSelected theme-background-deep');
					}

					jQuery(".ui-layout-west .icon-btn div").removeClass("disabled-btn")
					if (req.msgList.page == 1) {
						jQuery(".ui-layout-west .first-btn,.ui-layout-west .prev-btn").addClass("disabled-btn");
					}
					if (req.msgList.page == req.msgList.totalPages) {
						jQuery(".ui-layout-west .next-btn,.ui-layout-west .last-btn").addClass("disabled-btn");
					}

					if (msg.model.fist == true) {
						msg.model.fist = false;
						jQuery(".msglist :first").trigger("click");
					}
				} else if (req.levelInfo != null && req.levelInfo.allCount != 0) {
					//该情况表示该类型的信息被删光了，跳到全部信息
					msg.view.getMsg(1);
				}
				jQuery("#msgcontent").css("visibility", "visible");
			})
		}
	}

	msg.controller = {
		init: function() {
				//				require(['layout'], function(layout) {
				jQuery('#msgcontent').layout({
					closable: false,
					north__size: 40,
					west__size: 300,
					north__spacing_open: -1,
					spacing_open: 2,
					resizerDragOpacity: 0.2,
					onresizeall_end: function() {
						if (!msg.model.isHaveMsg) {
							jQuery(".ui-layout-resizer").hide();
						} else {
							jQuery(".ui-layout-resizer").show();
						}
						jQuery(".msglist").height(jQuery('.ui-layout-west').height() - 31).niceScroll();
					},
					onresize_end: function() {
						var $this = jQuery(".ui-layout-west");
						if ($this.width() <= 300) {
							$this.css("width", "300px");
							jQuery(".ui-layout-resizer").css("left", "300px");
						}
					},
					center: {
						minWidth: 300
					}
				});
				jQuery(".ui-layout-west,.ui-layout-center,.ui-layout-resizer-west").hide();
				jQuery(".msglist").height(jQuery('.ui-layout-west').height() - 31).niceScroll();

				//				})
				msg.view.getMsg(1);

				//给第一页绑定事件
				jQuery(".ui-layout-west .first-btn").parent().bind("click", function() {
					if (jQuery(this).find(".first-btn").hasClass('disabled-btn')) {
						return;
					}
					msg.view.getMsg(1);
				})

				//给前一页绑定事件
				jQuery(".ui-layout-west .prev-btn").parent().bind("click", function() {
					if (jQuery(this).find(".prev-btn").hasClass('disabled-btn')) {
						return;
					}
					msg.view.getMsg(jQuery(".ui-layout-west .pageNum").html() - 1);
				})

				//给下一页绑定事件
				jQuery(".ui-layout-west .next-btn").parent().bind("click", function() {
					if (jQuery(this).find(".next-btn").hasClass('disabled-btn')) {
						return;
					}
					msg.view.getMsg(jQuery(".ui-layout-west .pageNum").html() - (-1));
				})

				//给最后一页绑定事件
				jQuery(".ui-layout-west .last-btn").parent().bind("click", function() {
					if (jQuery(this).find(".last-btn").hasClass('disabled-btn')) {
						return;
					}
					msg.view.getMsg(jQuery(".ui-layout-west .totalPages").html());
				})

				//给分页下拉框绑定事件
				jQuery(".ui-layout-west .pagination-page-list").bind("change", function() {
					msg.view.getMsg(1);
				})

				var isAllSelectFlag = false; //开启关闭全选标识
				//给全选按钮绑定事件
				jQuery(".msg-button-panel .allSelect").bind("click", function() {
					isAllSelectFlag = !isAllSelectFlag;
					msg.model.allSelectFlag = isAllSelectFlag;
					if (isAllSelectFlag == false) {
						jQuery(this).html('<span class="glyphicon glyphicon-tags"></span>' + sabace.getMessage('msg.button.open'));
						jQuery(".ui-layout-west .msglist .list-group-item")
							.removeClass("singleSelect theme-background").removeClass("allSelected theme-background-deep");
					} else {
						jQuery(this).html('<span class="glyphicon glyphicon-tags"></span>' + sabace.getMessage('msg.button.close'));
						jQuery(".ui-layout-west .msglist .list-group-item")
							.removeClass("singleSelect theme-background").addClass("allSelected theme-background-deep");
					}
				})

				//自动刷新消息列表
				sabace.interval(function() {
					if (!isAllSelectFlag) {
						msg.view.getMsg(jQuery(".pageNum").html());
					}
				}, 30000);

				//给筛选条件绑定事件
				jQuery(".msg-leve-panel").on("click", ">div", function() {
					var $this = jQuery(this)
					$this.addClass("clickClass theme-background theme-border-color");
					$this.siblings().removeClass("clickClass theme-background theme-border-color");
					msg.view.getMsg(1);
				})

				//给标记已读按钮绑定事件
				jQuery(".msg-button-panel :nth-child(2)").bind("click", function() {
					var $obj = jQuery(".singleSelect,.allSelected");
					var msgIdArr = [];
					jQuery.each($obj, function(i, v) {
						var $this = jQuery(v);
						msgIdArr.push($this.attr("pro"));

						$this.removeClass("noread").removeClass("singleSelect theme-background").removeClass("allSelected theme-background-deep");
						$this.find(".no-read").remove();
						if (!$this.hasClass("hasread")) {
							$this.addClass("hasread");
						}
					})
					if (isAllSelectFlag) {
						jQuery(".msg-button-panel .allSelect").trigger("click");
					}

					//改为已读的状态
					sabace.ajax({
						url: sabace.handleUrlParam('/platform/msg/set-read-state'),
						data: {
							msgIdArr: msgIdArr.toString()
						},
						success: function(req) {

						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('top.label.fail'),
								message: req.responseText
							});
						}
					});
				})

				//给删除按钮绑定事件
				jQuery(".msg-button-panel :nth-child(3)").bind("click", function() {
					var $obj = jQuery(".singleSelect,.allSelected");
					if ($obj.size() == 0) {
						bi.dialog.show({
							title: sabace.getMessage('home.label.TipBox'),
							message: sabace.getMessage('msg.label.deleteTip'),
							cssClass: 'register-dialog',
							nl2br: false,
							closable: true,
							closeByBackdrop: false,
							closeByKeyboard: false,
							buttons: [{
								label: sabace.getMessage('home.button.sure'),
								action: function(dialogItself) {
									dialogItself.close();
								}
							}]
						});
						return;
					}
					bi.dialog.confirm({
						title: sabace.getMessage('home.label.confirmBox'),
						message: sabace.getMessage('msg.label.deleteMsg'),
						callback: function(result) {
							if (result) {
								var msgIdArr = [];
								jQuery.each($obj, function(i, v) {
									var $this = jQuery(v);
									msgIdArr.push($this.attr("pro"));
								})
								sabace.ajax({
									url: sabace.handleUrlParam('/platform/msg/delete-msg'),
									data: {
										msgIdArr: msgIdArr.toString()
									},
									success: function(req) {
										msg.view.getMsg(jQuery(".pageNum").html())
									},
									error: function(req) {
										bi.dialog.show({
											type: bi.dialog.TYPE_DANGER,
											title: sabace.getMessage('top.label.fail'),
											message: req.responseText
										});
									}
								});
							}
						}
					});

				})

				//给消息列表绑定事件
				jQuery(".ui-layout-west .msglist").on("click", ".list-group-item", function(e) {
					var $this = jQuery(this);
					//没有按shift的时候
					if (!e.shiftKey) {
						if (!isAllSelectFlag) {
							msg.model.checkIndex = $this.index();
							//关闭全选的状态下
							jQuery(".ui-layout-center").html("");
							var level = $this.find(".msg-left-level :last").clone();
							var title = $this.find(".msg-left-info .title").html();
							jQuery(".ui-layout-center").append('<div class="center-title"></div>');
							jQuery(".ui-layout-center .center-title").html(level).append(title);
							var sendUserName = $this.find(".msg-left-info .userName").html();
							var time = $this.find(".msg-left-time").attr("pro");
							jQuery(".ui-layout-center").append('<div class="center-time"></div>');
							jQuery(".ui-layout-center .center-time").html("<div>" + sabace.getMessage('msg.label.sender') + sendUserName + "</div>")
								.append("<div>" + time + "</div>");
							var content = $this.find(".msg-left-content").html();
							jQuery(".ui-layout-center").append('<div class="center-content"></div>');
							jQuery(".ui-layout-center .center-content").html(content);

							//如果是未读消息
							if ($this.hasClass("noread")) {
								//jQuery(".ui-layout-west .msglist .list-group-item").removeClass("singleSelect");
								sabace.ajax({
									url: sabace.handleUrlParam('/platform/msg/set-read-state'),
									data: {
										msgIdArr: $this.attr("pro")
									},
									success: function(req) {
										$this.removeClass("noread").addClass("hasread");
										$this.find(".no-read").remove();
										jQuery(".noreadCount").html(jQuery(".noreadCount").html() - 1);
										require(['top'], function(top) {
											top.getMsg();
										})
									},
									error: function(req) {
										bi.dialog.show({
											type: bi.dialog.TYPE_DANGER,
											title: sabace.getMessage('top.label.fail'),
											message: req.responseText
										});
									}
								});
							}

							$this.siblings().removeClass("singleSelect theme-background");
							$this.addClass("singleSelect theme-background");
						} else {
							//全选状态下
							$this.toggleClass("allSelected theme-background-deep");
						}
					} else {
						if (!isAllSelectFlag) {
							//关闭全选的状态下
							//优先判断页面中有没有被选中的消息体
							var checkObj = jQuery('.singleSelect');
							if (checkObj.length > 0) {
								var startIndex = msg.model.checkIndex;
								var endIndex = $this.index();
								if (startIndex > endIndex) {
									var temp = endIndex;
									endIndex = startIndex;
									startIndex = temp;
								}
								var $o = jQuery(".ui-layout-west .msglist .list-group-item"); //获取所有的消息列表
								$o.removeClass("singleSelect theme-background");
								for (var i = startIndex; i <= endIndex; i++) {
									$o.eq(i).addClass("singleSelect theme-background");
								}
							}
							return;
						}
					}
				})

				jQuery(".ui-layout-north .msg-leve-panel").on('mouseover', '>div:not(".clickClass")', function() {
					jQuery('this').siblings().removeClass('theme-background theme-border-color');
					jQuery(this).addClass('theme-background theme-border-color');
				}).on('mouseleave', '>div:not(".clickClass")', function() {
					jQuery(this).removeClass('theme-background theme-border-color');
				})

			}
			/*showMsg: function(page, rows) {
				sabace.ajax({
					type: "post",
					cache: false,
					dataType: "json",
					url: webpath + '/platform/msg/get-msg', // 该地址不需要加funcId
					data: {
						rows: rows,
						page: page
					},
					success: function(req) {
						//处理等级数量levelInfo
						var $obj = jQuery(".ui-layout-north .msg-leve-panel");

						//判断是否有消息来设置页面的布局
						if (req.msgList.rows.length != 0) {
							msg.model.isHaveMsg = true;
							jQuery(".ui-layout-west,.ui-layout-center,.ui-layout-resizer-west").show();
							jQuery("#msgcontent .noMsg").hide();
							jQuery(".msg-button-panel button").removeAttr("disabled").css("cursor", "pointer");
						} else {
							msg.model.isHaveMsg = false;
							jQuery(".ui-layout-west,.ui-layout-center,.ui-layout-resizer-west").hide();
							jQuery("#msgcontent .noMsg").show();
							jQuery(".msg-button-panel button").prop("disabled", "disabled").css("cursor", "not-allowed");
						}
						$obj.html("");
						if (req.msgList.rows.length != 0) {
							$obj.append('<div pro="all" class="clickClass"><span class="all">'+sabace.getMessage('msg.label.all')+'(' + req.msgList.total + ')</span></div>');

							if (req.levelInfo.noReadCount != 0) {
								$obj.append('<div pro="new"><div class="msg-level no-read"></div> <span>'+sabace.getMessage('msg.label.new')+'(<span class="noreadCount">' + req.levelInfo.noReadCount + '</span>)</span></div>');
							}

							if (req.levelInfo.level1Count != 0) {
								$obj.append('<div pro="level1"><div class="msg-level level-1"></div> <span>'+sabace.getMessage('msg.label.ordinary')+'(' + req.levelInfo.level1Count + ')</span></div>');
							}

							if (req.levelInfo.level2Count != 0) {
								$obj.append('<div pro="level2"><div class="msg-level level-2"></div> <span>'+sabace.getMessage('msg.label.important')+'(' + req.levelInfo.level2Count + ')</span></div>');
							}

							if (req.levelInfo.level3Count != 0) {
								$obj.append('<div pro="level3"><div class="msg-level level-3"></div> <span>'+sabace.getMessage('msg.label.urgent')+'(' + req.levelInfo.level3Count + ')</span></div>');
							}
						} else {
							$obj.append('<div class="msg-level no-read"></div> <span>'+sabace.getMessage('msg.label.new')+'(<span class="noreadCount">0</span>)</span>');
						}
						if (req.msgList.rows.length != 0) {
							jQuery(".ui-layout-west .totalPages").html(req.msgList.totalPages);
							jQuery(".ui-layout-west .pageNum").html(req.msgList.page);
							var $this = jQuery(".ui-layout-west .msglist");
							$this.animate({
								scrollTop: 0
							}, 100);
							$this.html("");
							jQuery.each(req.msgList.rows, function(i, v) {
								var div = jQuery("<div>", {
									'class': 'list-group-item ' + (v.readState == '0' ? 'noread' : 'hasread'),
									'pro': v.msgId
								});

								var level = jQuery("<div>", {
									'class': 'msg-left-level',
									'html': (v.readState == '0' ? '<div class="msg-level no-read "></div>' : '') + '<div class="msg-level level-' + v.msgLevel + '"></div>'
								})

								var img = jQuery("<div>", {
									'class': 'msg-left-img',
									'html': '<img src="' + webpath + '/platform/readUserImg/' + funcId + '?t=' + new Date() + '&userImgId=' + v.sendUserId + '" />'
								})

								var info = jQuery("<div>", {
									'class': 'msg-left-info',
									'html': '<div class="userName">' + v.sendUserName + '</div><div class="title">' + v.msgTitle + '</div>'
								})

								var time = jQuery("<div>", {
									'class': 'msg-left-time',
									'html': sabace.date.getDateDiff(v.sendTime),
									'pro': v.sendTime
								})

								var content = jQuery("<div>", {
									'class': "msg-left-content",
									'html': v.msgContent
								})

								div.append(level)
									.append(img)
									.append(info)
									.append(time)
									.append(content);

								$this.append(div)
							})
							jQuery(".ui-layout-west .icon-btn div").removeClass("disabled-btn")
							if (req.msgList.page == 1) {
								jQuery(".ui-layout-west .first-btn,.ui-layout-west .prev-btn").addClass("disabled-btn");
							}
							if (req.msgList.page == req.msgList.totalPages) {
								jQuery(".ui-layout-west .next-btn,.ui-layout-west .last-btn").addClass("disabled-btn");
							}

							if (msg.model.fist == true) {
								msg.model.fist = false;
								jQuery(".msglist :first").trigger("click");
							}
						} else {

						}
						jQuery("#msgcontent").css("visibility", "visible");
					},
					error: function(req) {

					}
				});
			}*/
	}

	return msg.controller;
})