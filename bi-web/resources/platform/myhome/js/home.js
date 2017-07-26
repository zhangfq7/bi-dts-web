define(['sabace'], function(sabace) {

	jQuery(function() {
		//分页点击背景颜色改变
		jQuery(".page").on("click", ".number", function() {
			jQuery(".page div").removeClass("clickBtn").addClass("normalBtn theme-background-deep");
			jQuery(this).addClass("clickBtn").removeClass("normalBtn theme-background-deep");
		})
		
		//给分页按钮绑定事件
		var currentIndex = 'a';
		jQuery(".page").on("click", ".number", function() {
			//获取被点的数字，从而判断该显示哪个iframe
			var obj = jQuery(this);
			var index = obj.find("span").html() - 1;
			var reportId = obj.attr("reportId");
			if (currentIndex == index) {
				return;
			}
			currentIndex = index;
			var $this = jQuery(".ifrDiv").eq(index);

			if ($this.find("iframe").attr("src") == undefined) {
				var url = sabace.handleUrlParam('/platform/dataview/view') + "?reportId=" + reportId + '&date=' + new Date();
				$this.find("iframe").attr("src", url)
			}

			jQuery(".ifrDiv").fadeOut('slow');
			jQuery("body").animate({
				scrollTop: 0
			}, 1);
			$this.fadeIn("slow", function() {
				var reportId = obj.attr("reportId");
				sabace.ajax({
					data: {
						reportId: reportId
					},
					url: sabace.handleUrlParam('/platform/myhome/record-visit'),
					success: function(req) {

					},
					error: function(req) {
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('top.label.fail'),
							message: req.responseText
						});
					}
				})
			});
		})


		//禁止iframe滚动
		//jQuery("iframe").prop("scrolling","no");

		//给操作按钮绑定事件跳转到首页定制的页面
		jQuery("#opt").bind("click", function() {
			window.location.href = sabace.handleUrlParam('/platform/myhome/my-home-setting');
		})

		sabace.ajax({
			async: false,
			url: sabace.handleUrlParam('/platform/myreport/view/query-myhome'),
			success: function(req) {
				jQuery.each(req, function(i, v) {
					jQuery(".page").append('<div class="normalBtn number" reportName="' + v.reportName + '" reportDesc="' + v.reportDesc + '" reportId="' + v.reportId + '"><span>' + (i + 1) + '</span></div>');
				})
				if (req.length > 0) {
					//jQuery("body").css("background",'#fff');
					jQuery(".number").eq(0).trigger("click");
				} else {
					//jQuery("body").css("background",'#fff');
					var $this = jQuery(".ifrDiv").eq(0);
					$this.show();
					$this.find("img").show();
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('top.label.fail'),
					message: req.responseText
				});
			}
		});

		$('.page .number').poshytip({
			className: 'tip-yellowsimple',
			content: function() {
				var $this = jQuery(this);
				var reportmsg = jQuery("<div>", {
					'class': 'report-msg'
				})
				var name = jQuery("<div>", {
					'class': 'report-name',
					'html': $this.attr("reportName")
				})
				reportmsg.append(name);
				return reportmsg;
			},
			showTimeout: 3,
			alignTo: 'target',
			alignX: 'left',
			alignY: 'center',
			offsetY: 2,
			offsetX: 10,
			keepInViewport: false
		});
	})

	//iframe自适应高度
	//	function iFrameHeight(ifm) { 
	//		var iframeId = ifm.attr("id");
	//	    ifm.height($(ifm.contents().get(0)).find("body")[0].scrollHeight);
	//	    jQuery(window.frames[iframeId].document).find("body")[0].scrollHeight
	//		alert(jQuery(window.frames[iframeId].document).find("body")[0].scrollHeight)
	//	}  

});