define(['sabace', 'top/message'], function(sabace, message) {
	function init() {
		$('.head-font').poshytip({
			className: 'tip-yellowsimple',
			content: jQuery(".tooltip-menu"),
			showTimeout: 3,
			alignTo: 'target',
			alignX: 'bottom',
			alignY: 'bottom',
			offsetY: 2,
			offsetX: -100,
			keepInViewport: false
		});

		$('.head-img').poshytip({
			className: 'tip-yellowsimple msg-tip',
			content: jQuery(".msg-menu"),
			showTimeout: 3,
			alignTo: 'target',
			alignX: 'bottom',
			alignY: 'bottom',
			offsetY: 5,
			offsetX: -146,
			keepInViewport: false
		});
		jQuery(".msg-foot").bind('click', function() {
			window.location.href = sabace.handleUrlParam('/platform/msg/msg-list')
		});

		jQuery(".out").on("click", function() {
			bi.dialog.confirm({
				title: sabace.getMessage('top.msg.logout'),
				message: sabace.getMessage('top.msg.confrm.logout'),
				callback: function(result) {
					if (result) {
						sabace.ajax({
							type: "post",
							cache: false,
							dataType: "json",
							url: sabace.handleUrlParam("/platform/login/logout"),
							complete: function(req) {
								document.location.href = webpath + "/";
							}
						});
					}
				}
			});
		});

		jQuery(".tooltip-menu .refresh").on("click", function() {
			bi.dialog.confirm({
				title: sabace.getMessage('top.msg.refresh'),
				message: sabace.getMessage('top.msg.confrm.refresh'),
				callback: function(result) {
					if (result) {
						sabace.ajax({
							loading: {
								title: sabace.getMessage('top.label.tip'),
								text: sabace.getMessage('top.label.pleaseWait')
							},
							url: sabace.handleUrlParam("/platform/login/refresh"),
							success: function(req) {
								if (req.retFlag) {
									bi.dialog.show({
										title: sabace.getMessage('top.label.succeed'),
										message: sabace.getMessage('top.msg.oper.success')
									});
								} else {
									bi.dialog.show({
										type: bi.dialog.TYPE_DANGER,
										title: sabace.getMessage('top.label.fail'),
										message: sabace.getMessage('top.msg.oper.fail')
									});
								}
							},
							error: function(req) {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('top.label.fail'),
									message: sabace.getMessage('top.msg.oper.error')
								});
							}
						});
					}
				}
			});
		});

		var wookmark = $('#bi-nav .bi-nav-child ').wookmark({
			autoResize: true,
			container: $('#bi-nav .parent'),
			align: 'left',
			outerOffset: 15,
			offset: 20,
			onLayoutChanged: function() {
				var liSize = jQuery("#bi-nav .bi-nav-child>li").size();
				var $this = jQuery('#bi-nav .bi-nav-child ');
				if (liSize == 3) {
					$this.width("560px");
				}
				if (liSize == 2) {
					$this.width("380px");
				}
				if (liSize == 1) {
					$this.width("180px");
				}
			}
		}).css({
			visibility: "visible",
			display: "none"
		})
		jQuery("#bi-nav .parent").on('click', function() {
			jQuery(this).toggleClass('checked').find(".down").toggleClass("fa-caret-up fa-caret-down");
			jQuery(this).find(".bi-nav-child").toggle();
		})
		jQuery("body").on("click", function(event) {
			var $eventObj = jQuery(event.target);
			if (!($eventObj.parents('.parent').hasClass('parent') ||
					$eventObj.parent().hasClass('parent'))) {
				jQuery("#bi-nav .bi-nav-child").hide();
				jQuery("#bi-nav .parent").removeClass("checked").find(".fa-caret-up").toggleClass("fa-caret-up fa-caret-down");
			}
		})
		getMsg();
        
		//判断浏览器版本
		var version = sabace.getBV();
		if(version.type == 'ie'){
			setInterval(function() {
				if(window.document.hasFocus()){
					getMsg();
				}
			}, 30000);
		}else{
			var intevalId = '';
			//自动刷新消息列表
			intevalId  = setInterval(function() {
				getMsg();
			}, 30000);
			
			//当浏览器的当前窗口不处于激活状态时，取消该事件
			var hiddenProperty = 'hidden' in document ? 'hidden' :    
			    'webkitHidden' in document ? 'webkitHidden' :    
			    'mozHidden' in document ? 'mozHidden' :    
			    null;
			    

			var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
	        var missTime = 0; //失去激活的时间
			var onVisibilityChange = function(){
			    if (!document[hiddenProperty]) { 
			    	   //激活状态
			    	if(new Date().getTime()-missTime >20000){
			    		getMsg();
			    	}
			    	clearInterval(intevalId);
			    	intevalId  = setInterval(function() {
						getMsg();
					}, 30000);
			    }else{
			    	    //非激活状态
			    	clearInterval(intevalId);
			    	missTime = new Date().getTime();
			    }
			}
			document.addEventListener(visibilityChangeEvent, onVisibilityChange);
		}
		
		

		//给消息绑定事件
		jQuery("#msg-content").on("click", ".msgDiv", function() {
			var $this = jQuery(this);
			sabace.ajax({
				type: "post",
				cache: false,
				dataType: "json",
				url: sabace.handleUrlParam('/platform/msg/set-read-state'),
				data: {
					msgIdArr: $this.attr("pro")
				},
				success: function(req) {
					getMsg();
					var pageUrl = sabace.handleUrlParam('/platform/msg/msg-info');
					bi.dialog.show({
						title: sabace.getMessage("msg.sabace.noRead"),
						cssClass: 'msg-dialog',
						message: $('<div id="msg-dialog"></div>').load(pageUrl),
						spinicon: 'glyphicon glyphicon-refresh',
						closeByBackdrop: false,
						closeByKeyboard: false,
						onshown: function(dialog) {
							var $obj = dialog.getModal().find("#msg-dialog");
							$obj.find(".msg-info-title,.msg-info-time,.msg-info-content").html("");
							var levelClass = $this.find(".msg-level").attr("class");
							var title = $this.find(".msg-title").html();
							$obj.find(".msg-info-title").append('<div class="' + levelClass + '"></div>').append(title);
							var sendUserName = $this.find(".msg-time").attr("sendUserName");
							var sendTime = $this.find(".msg-time").attr("sendTime");
							$obj.find(".msg-info-time").append("<div>" + sabace.getMessage("msg.sabace.sender") + sendUserName + "</div>")
								.append("<div>" + sendTime + "</div>");
							$obj.find(".msg-info-content").append($this.find(".msg-content").html());
						},
						buttons: [{
							label: sabace.getMessage("msg.sabace.close"),
							//hotkey: 13, // Enter  让键盘回车直接出发此按钮
							cssClass: 'btn-info',
							action: function(dialog) {
								dialog.close();
							}
						}]
					});
				},
				error: function(req) {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('top.label.fail'),
						message: req.responseText
					});
				}
			});

		});

	}

	var msgContent = jQuery("#msg-content");
	var newMessage = jQuery(".msg-menu .new-message");

	function getMsg() {
		sabace.ajax({
			url: webpath + '/platform/msg/get-msg', // 该地址不需要加funcId
			data: {
				readState: 0,
				rows: 5,
				page: 1,
				t: new Date()
			},
			success: function(req) {
				newMessage.html(req.msgList.total);
				var $this = msgContent;
				$this.html("");
				var $noreadNum = jQuery("#bi-nav .noreadNum");
				if (req.msgList.rows.length == 0) {
					$this.append('<div><span class="msg-title">' + sabace.getMessage("msg.sabace.noMsg") + '</span></div>');
					$noreadNum.hide();
					$('.head-img').poshytip('disable');
				} else {
					$noreadNum.show();
					$noreadNum.html((req.msgList.total > 99 ? 99 : req.msgList.total));
					$('.head-img').poshytip('enable');
				}
				jQuery.each(req.msgList.rows, function(i, v) {
					var div = jQuery("<div>", {
						'pro': v.msgId,
						'class': 'msgDiv'
					});
					var level = jQuery("<span>", {
						'class': 'msg-level level-' + v.msgLevel
					});
					var title = jQuery("<span>", {
						'title': v.msgTitle,
						'html': v.msgTitle,
						'class': 'msg-title'
					});
					var time = jQuery("<span>", {
						'class': 'msg-time',
						'html': sabace.date.getDateDiff(v.sendTime),
						'sendUserName': v.sendUserName,
						'sendTime': v.sendTime
					});
					var content = jQuery("<div>", {
						'class': 'msg-content hide',
						'html': v.msgContent
					})
					div.append(level).append(title).append(time).append(content);
					$this.append(div);
				})
			},
			error: function(req) {
				// 此处不用实现错误信息的提示。
			}
		});
	}

	//返回页面所需方法
	return {
		init: init,
		getMsg: getMsg
	}
});