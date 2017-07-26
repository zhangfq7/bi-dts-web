define(['sabace', 'mymessage'], function(sabace, mymessage) {
	var pageSize = 20; //定义一页显示的个数
	var nowPage = 0; //当前页数
	var nowTxt = ""; //当前搜索内容
	jQuery(function() {

		//给按钮组点击样式
		jQuery(".btn-group button").bind("click", function() {
			jQuery(this).removeClass("normalButton").addClass("clickedButton theme-background").siblings().addClass("normalButton").removeClass("clickedButton theme-background");
		})

		jQuery(".btn-group").on('mouseover', '.normalButton', function() {
			jQuery('.normalButton').removeClass('theme-background');
			jQuery(this).addClass('theme-background');
		}).on('mouseleave', '.normalButton', function() {
			jQuery(this).removeClass('theme-background');
		})

		var type = "all";

		//获取第一页

		//小弹窗可拖拽
		jQuery("#layer").draggable({
			handle: ".layerHead"
		});

		//给设为按钮绑定事件
		var flag = 0
		jQuery("#content").on("click", ".homeSetting", function() {
			if (flag == 1) {
				return;
			}
			var repeatflag = 0;
			var reportId = jQuery(this).parents(".thumbnail").attr("reportId");
			jQuery.each(jQuery(".layerBody img"), function(i, v) {
				if (jQuery(v).attr("reportId") == reportId) {
					bi.dialog.show({
						title: sabace.getMessage('home.label.TipBox'),
						message: sabace.getMessage('home.msg.repeatMsg'),
						cssClass: 'register-dialog',
						nl2br: false,
						closable: true
					});
					repeatflag = 1;
				}
			})
			if (repeatflag == 1) {
				flag = 0;
				return;
			}
			jQuery("#layer").show();
			flag = 1;

			var url = jQuery(this).parents(".thumbnail").find(".repImg").attr("atr");

			if (jQuery(".layerBody img").size() == 0) {
				var div = jQuery("<div>", {

				});
				var img = jQuery("<img>", {
					'src': url,
					'reportId': reportId
				});
				div.append(img)
				jQuery(".layerBody").prepend(div);
				flag = 0;
				return;
			}
			if (jQuery(".layerBody>div").size() >= 5) {
				jQuery(".layerBody>div").eq(4).remove();
			}

			jQuery(".layerBody>div").eq(0).animate({
				'marginLeft': '78px'
			}, 400, function() {
				var div = jQuery("<div>", {
					'style': 'margin-right:-78px;'
				});
				var img = jQuery("<img>", {
					'src': url,
					'reportId': reportId
				});
				div.append(img);
				jQuery(".layerBody").prepend(div);
				flag = 0;
			})
		})

		//给关注按钮加事件
		jQuery("#content").on("click", ".foucsbtn", function() {
				var obj = jQuery(this);
				var reportId = obj.parents(".thumbnail").attr("reportId");
				sabace.ajax({
					data: {
						reportId: reportId
					},
					url: sabace.handleUrlParam('/platform/myreport/view/foucs'),
					success: function(req) {
						obj.removeClass("foucsbtn").addClass("nofoucsbtn");
						obj.html("<span>" + sabace.getMessage('report.button.unfocus') + "</span>").append('<i class="fa fa-heart butFa"></i>');
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
			/*.on("mouseover",".foucsbtn",function(){
						jQuery(this).html(sabace.getMessage('report.button.focus'));
					}).on("mouseleave",".foucsbtn",function(){
						jQuery(this).html('<i class="fa fa-heart-o"></i>');
					})*/

		//给取消关注按钮加事件
		jQuery("#content").on("click", ".nofoucsbtn", function() {
			var obj = jQuery(this);
			var reportId = obj.parents(".thumbnail").attr("reportId");
			sabace.ajax({
				data: {
					reportId: reportId
				},
				url: sabace.handleUrlParam('/platform/myreport/view/nofoucs'),
				success: function(req) {
					obj.removeClass("nofoucsbtn").addClass("foucsbtn");
					obj.html("<span>" + sabace.getMessage('report.button.focus') + "</span>").append('<i class="fa fa-heart-o butFa"></i>');
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

		jQuery(".manage button").bind("click", function() {
			window.location.href = sabace.handleUrlParam('/platform/myreport/manage/report-list');

		})

		//悬浮出现按钮
		/*var id ;
		var moveflag=0;
		jQuery("#content").on("mouseover",".thumbnail",function(){
			 if(moveflag==1){
				  return;
			  }
			  var obj =jQuery(this);
			  var top = jQuery(this).offset().top;
			 
  			  var left = jQuery(this).offset().left;
		      clearTimeout(id);
	          id= setTimeout(function(){
	        	    var strongtop = obj.find("strong").offset().top;
	        	    jQuery(".but").css("height",obj.css("height").replace("px","")-strongtop+top)
	        	    .css("line-height",obj.css("height").replace("px","")-strongtop+top+"px");
	            	var width = jQuery(".thumbnail").css("width");
	            	obj.find(".but").css("width",width).css("left",left).css("top",top)
	            	.fadeIn("slow");
	            	var buttop = obj.find(".but").offset().top;
	            	var a = buttop-strongtop;
	            	obj.find(".but").css("top",top-a);
	            },300);
	          moveflag = 1;
		}).on("mouseleave",".thumbnail",function(){
			clearTimeout(id);
			moveflag=0
			jQuery(this).find(".but").fadeOut(300);
		})*/

		jQuery(".top").on("click", ".more", function() {
			jQuery(".moreLabel").toggle();
			var content = sabace.getMessage('report.label.more');
			if (jQuery(this).find("strong").html() == content) {
				content = sabace.getMessage('report.label.back');
			}
			jQuery(this).find("strong").html(content);
		})

		var labelArry = ""; //接收所选的标签id
		jQuery(".search-btn-group button").bind("click", function() {
			type = jQuery(this).val();
			findDataByButton(0, type, labelArry);
		})

		jQuery("#firstbutton").click();

		//获取标签
		sabace.ajax({
			url: sabace.handleUrlParam('/platform/myreport/view/query-label'),
			success: function(req) {
				if (req.length > 0) {
					jQuery(".report-panel .top>div,.report-panel .top>hr").show();
				}
				jQuery.each(req, function(i, v) {
					var label = jQuery("<label>", {
							"class": "checkbox-diy col-xs-1",
							"value": v.labelId
						})
						/*
						var input = jQuery("<input>",{
							"type" : "checkbox",
							"data-toggle" : "checkbox"
						})
						var strong = jQuery("<strong>",{
							"html" : v.labelName
						})*/

					var input = jQuery("<input>", {
						"type": "checkbox",
						"data-toggle": "checkbox"
					})
					var strong = jQuery("<label>", {
						"html": v.labelName
					})
					label.append(input).append(strong);
					if (i > 4) {
						label.addClass("moreLabel");
						jQuery(".more").show();
					}
					jQuery(".more").before(label);
				})

				jQuery('[data-toggle="checkbox"]').iCheck({
					checkboxClass: 'icheckbox_minimal',
					radioClass: 'iradio_minimal'
				});
				//给标签点击事件
				$('input').on('ifChanged', function(event) { //ifCreated 事件应该在插件初始化之前绑定 
					var obj = jQuery('.top').find(":checked").parents(".checkbox-diy");
					labelArry = "";
					jQuery.each(obj, function(i, v) {
						if (i == 0) {
							labelArry += jQuery(v).attr("value");
						} else {
							labelArry = labelArry + "," + jQuery(v).attr("value");
						}
					})
					findDataByButton(0, type, labelArry);
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

		jQuery("#search").bind("click", function() {
			findDataByButton(0, type, labelArry);
		})

		jQuery('#searchInput').keydown(function(e) {
			if (e.keyCode == 13) {
				jQuery("#search").trigger("click");
			}
		});

		jQuery(".tool button").bind("click", function() {
			sabace.ajax({
				async: false,
				url: sabace.handleUrlParam('/platform/myreport/view/get-all-Data'),
				success: function(req) {
					if ((req.importList == null || req.importList.length == 0) && (req.dbList == null || req.dbList.length == 0) && (req.linkList = null || req.linkList.length == 0)) {
						bi.dialog.show({
							title: '页面跳转提醒',
							message: '您好，您还没有上传数据源，无法制作报表！<span class="timeSpan">5</span> 秒钟将自动跳转到上传数据源页面！<br><a href="' + sabace.handleUrlParam("/platform/resmanage/data/data-file-import") + '">立即跳转</a>',
							cssClass: 'timeout-dialog',
							onshown: function() {
								sabace.interval(function() {
									jQuery(".timeSpan").html(jQuery(".timeSpan").html() - 1);
								}, 1000);
								sabace.interval(function() {
									top.document.location.href = sabace.handleUrlParam("/platform/resmanage/data/data-file-import");
								}, 5000);
							}
						});
					} else {
						window.open(sabace.handleUrlParam('/platform/dataview/create'));
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
		})

		//获取我的首页信息
		var myhome;

		function getHome() {
			sabace.ajax({
				url: sabace.handleUrlParam('/platform/myreport/view/query-myhome'),
				success: function(req) {
					myhome = req;
					jQuery(".layerBody").html("");
					jQuery.each(req, function(i, v) {
						var div = jQuery("<div>", {

						})
						var img = jQuery("<img>", {
							'src': v.imgByte,
							'alt': '',
							'reportId': v.reportId
						});
						div.append(img);
						jQuery(".layerBody").append(div);
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
		getHome();

		jQuery(".cancle,.close").bind("click", function() {
			jQuery("#layer").hide();
			jQuery(".layerBody").html("");
			jQuery.each(myhome, function(i, v) {
				var div = jQuery("<div>", {

				})
				var img = jQuery("<img>", {
					'src': v.imgByte,
					'alt': '',
					'reportId': v.reportId
				});
				div.append(img);
				jQuery(".layerBody").append(div);
			})
		})

		jQuery(".sure").bind("click", function() {
			var reportIdArry = [];
			jQuery.each(jQuery(".layerBody img"), function(i, v) {
				reportIdArry.push(jQuery(v).attr("reportId"))
			})

			sabace.ajax({
				loading: { //如果传入loading对象，系统将产生loading进度条
					title: sabace.getMessage('home.msg.execution'),
					text: sabace.getMessage('home.msg.submitMsg')
				},
				url: sabace.handleUrlParam('/platform/myreport/view/set-home/'),
				data: {
					reportIds: reportIdArry.toString()
				},
				success: function(req) {
					getHome();
					bi.dialog.show({
						title: sabace.getMessage('home.label.TipBox'),
						message: sabace.getMessage('home.msg.successSet'),
						cssClass: 'register-dialog',
						nl2br: false,
						closable: true
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
		})

		/*jQuery("#layer .layerBody").on("mouseover","img",function(){
			jQuery(this).css("width","20%").css("height","64px");
			jQuery("#layer .layerBody").css("padding-top","13px");
		}).on("mouseleave","img",function(){
			jQuery(this).css("width","17%").css("height","50px");
			jQuery("#layer .layerBody").css("padding-top","20px");
		})*/

		//给缩略图加点击事件查看
		jQuery("#content").on("click", ".repImg,.txt", function() {
			var reportId = jQuery(this).parents(".thumbnail").attr("reportId");
			window.open(sabace.handleUrlParam('/platform/dataview/view') + '?reportId=' + reportId);
		})

		/*//自动刷新消息列表
		sabace.interval(function() {
			findData(nowPage,type,labelArry);
		}, 30000);*/

		//返回顶部
		jQuery(window).scroll(function() {
			if (jQuery(window).scrollTop() >= 100) {
				jQuery('.actGotop').fadeIn(300);
				jQuery(".report-panel").addClass("suspension");
			} else if(jQuery(window).scrollTop()<90) {
				jQuery('.actGotop').fadeOut(300);
				jQuery(".report-panel").removeClass("suspension");
			}
		});
		
		jQuery('.actGotop').click(function() {
			jQuery('html,body').animate({
				scrollTop: '0px'
			}, 800);
		});

	})

	//点击分页查询数据的方法
	function findData(index, ty, labelIds) {
		//加进度条
		jQuery(".loadingbar.waiting.reportLoading").remove();
		jQuery('<div>', {
			"id": "loadingbar2",
			"class": "loadingbar waiting reportLoading",
			"html": "<dt/><dd/>"
		}).appendTo(".report-panel .butRow");
		jQuery("#loadingbar2").width((50 + Math.random() * 30) + "%");

		sabace.ajax({
			url: sabace.handleUrlParam('/platform/myreport/view/query-reps/'),
			/*loading:{
				spin:true
			},*/
			data: {
				page: index,
				rows: pageSize,
				type: ty,
				labelIds: labelIds,
				searchText: nowTxt
			},
			success: function(req) {
				jQuery("#content").html("");
				$('body,html').animate({
					scrollTop: 0
				}, 100);
				if (req.reportList.rows.length == 0) {
					//如果没有结果，就把查询条件拼接出来
					var searchPanel = [];
					var searchlabel = labelIds.split(",");
					if (searchlabel != '') {
						jQuery(searchlabel).each(function(i, v) {
							var label = jQuery("label[value='" + v + "']").find("strong").html();
							if (i == 0) {
								label = sabace.getMessage('report.label.noReportLabel') + label;
							}
							searchPanel.push(label);
						})
					}
					if (searchText != '') {
						searchPanel.push(sabace.getMessage('report.label.noReportTxt') + searchText);
					}
					if (!jQuery("#firstbutton").hasClass("clickedButton")) {
						var and = searchPanel.length == 0 ? '' : sabace.getMessage('report.label.noReportAnd');
						searchPanel.push(and + jQuery(".report-panel .search-btn-group .clickedButton").html().replace(/&nbsp;/g, ''));
					}
					var mhtml = '';
					if (searchPanel.length == 0) {
						mhtml = '<div>!</div><div>' + sabace.getMessage('report.label.noReport3') + '</div>';;
					} else {
						mhtml = '<div>!</div><div>' + sabace.getMessage('report.label.noReport1') + '<span style="font-weight:bold;">“' + searchPanel + '”</span>' + sabace.getMessage('report.label.noReport2') + '</div>';
					}

					var noreport = jQuery("<div>", {
						'class': 'noreport-msg',
						'html': mhtml
					})
					jQuery("#content").html(noreport);
				} else {

					jQuery.each(req.reportList.rows, function(i, v) {
						creatRep(v)
					})
				}

				jQuery("#loadingbar2").css("width", "99.5%").delay(200).fadeOut(400, function() {
					$(this).remove();
				});
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: '异常',
					message: '查询报表异常，请稍后再试 ！'
				});
			}
		});
	}

	function findDataByButton(index, ty, labelIds) {
		//加进度条
		jQuery(".loadingbar.waiting.reportLoading").remove();
		jQuery('<div>', {
			"id": "loadingbar2",
			"class": "loadingbar waiting reportLoading",
			"html": "<dt/><dd/>"
		}).appendTo(".report-panel .butRow");
		jQuery("#loadingbar2").width((50 + Math.random() * 30) + "%");

		var searchText = jQuery("#searchInput").val(); //搜索框的内容
		sabace.ajax({
			url: sabace.handleUrlParam('/platform/myreport/view/query-reps/'),
			/*loading:{
				text : '正在加载中',
				spin:true
			},*/
			data: {
				page: index,
				rows: pageSize,
				type: ty,
				labelIds: labelIds,
				searchText: searchText,
				appType: appType
			},
			success: function(req) {
				nowPage = 0; //当前页数变为0
				nowTxt = searchText;
				jQuery("#content").html("");
				$('body,html').animate({
					scrollTop: 0
				}, 100);
				if (req.reportList.rows.length == 0) {
					//如果没有结果，就把查询条件拼接出来
					var searchPanel = [];
					var searchlabel = labelIds.split(",");
					if (searchlabel != '') {
						jQuery(searchlabel).each(function(i, v) {
							var label = jQuery("label[value='" + v + "']").find("strong").html();
							if (i == 0) {
								label = sabace.getMessage('report.label.noReportLabel') + label;
							}
							searchPanel.push(label);
						})
					}
					if (searchText != '') {
						searchPanel.push(sabace.getMessage('report.label.noReportTxt') + searchText);
					}
					if (!jQuery("#firstbutton").hasClass("clickedButton")) {
						var and = searchPanel.length == 0 ? '' : sabace.getMessage('report.label.noReportAnd');
						searchPanel.push(and + jQuery(".report-panel .search-btn-group .clickedButton").html().replace(/&nbsp;/g, ''));
					}
					var mhtml = '';
					if (searchPanel.length == 0) {
						mhtml = '<div>!</div><div>' + sabace.getMessage('report.label.noReport3') + '</div>';;
					} else {
						mhtml = '<div>!</div><div>' + sabace.getMessage('report.label.noReport1') + '<span style="font-weight:bold;">“' + searchPanel + '”</span>' + sabace.getMessage('report.label.noReport2') + '</div>';
					}

					var noreport = jQuery("<div>", {
						'class': 'noreport-msg',
						'html': mhtml
					})
					jQuery("#content").html(noreport);
				}

				jQuery.each(req.reportList.rows, function(i, v) {
					creatRep(v)
				})

				jQuery("#page").page('destroy');

				//渲染分页控件
				jQuery("#page").page({
					total: req.reportList.total,
					pageSize: pageSize,
					showJump: true,
					firstBtnText: sabace.getMessage('home.page.first'),
					lastBtnText: sabace.getMessage('home.page.last'),
					jumpBtnText: sabace.getMessage('home.page.jump')
				}).on("pageClicked", function(event, pageIndex) {
					nowPage = pageIndex;
					findData(pageIndex, ty, labelIds);
				}).on('jumpClicked', function(event, pageIndex) {
					nowPage = pageIndex;
					findData(pageIndex, ty, labelIds);
				});
				//调整分页的位置
				var rowWidth = jQuery(".page").width();
				var pageWidth = Number(jQuery(".m-pagination-page").width()) + Number(jQuery(".m-pagination-jump").width());
				jQuery(".m-pagination-page").css("margin-left", (rowWidth - pageWidth) / 2 + "px");

				jQuery("#loadingbar2").css("width", "99.5%").delay(200).fadeOut(400, function() {
					$(this).remove();
				});
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: '异常',
					message: '查询报表异常，请稍后再试 ！'
				});
			}
		});
	}

	//生成报表的方法
	var height = (window.screen.width * 0.21 - 30) / 2; //每张报表图片的高度
	function creatRep(obj) {
		var thumbnail = jQuery("<div>", {
			'class': 'thumbnail effect',
			'reportId': obj.reportId
		});
		var img = jQuery("<div>", {
			'css': {
				'height': height + 'px',
				'background': 'url('+ obj.imgByte +') no-repeat',
				'background-size': '100% auto'
			},
			'class': 'repImg',
			'atr':obj.imgByte
		});
		var txt = jQuery("<div>", {
			'class': 'txt'
		})
		var title = jQuery("<strong>", {
			'html': obj.reportName,
			'style': 'margin-left:2%',
			'title':obj.reportName
		})
		var helpBlock = jQuery("<div>", {
			'class': 'help-block',
			'html': '<div class="comment">' + sabace.getMessage('home.label.comment') + '<strong> ' + (obj.commentCount == null ? 0 : obj.commentCount) + ' </strong></div>'
		})

		/*var scoreArry = ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];
		var random = parseInt(10 * Math.random());
		var score = scoreArry[random];*/
		var score = obj.score;
		var star1 = jQuery("<i>", {
			'class': 'fa fa-star-o',
		})
		var star2 = jQuery("<i>", {
			'class': 'fa fa-star-o',
		})
		var star3 = jQuery("<i>", {
			'class': 'fa fa-star-o',
		})
		var star4 = jQuery("<i>", {
			'class': 'fa fa-star-o',
		})
		var star5 = jQuery("<i>", {
			'class': 'fa fa-star-o',
		})
		var starArr = [];
		starArr.push(star1);
		starArr.push(star2);
		starArr.push(star3);
		starArr.push(star4);
		starArr.push(star5);
		if (score.length == 1) {
			//整数
			for (var j = 1; j <= score; j++) {
				starArr[j - 1].attr('class', 'fa fa-star');
			}
		} else {
			//有.5
			for (var j = 1; j <= score.substring(0, 1); j++) {
				starArr[j - 1].attr('class', 'fa fa-star');
			}
			starArr[score.substring(0, 1)].attr('class', 'fa fa-star-half-o')
		}

		var stars = jQuery("<div>", {
			'class': 'stars'
		})
		var a = '<div class="visit">' + sabace.getMessage('home.label.visit') + '<strong class="times"> ' + obj.visitCount + ' </strong></div>';
		var hr = jQuery("<hr>", {});

		var but = jQuery("<div>", {
			'class': 'but'
		})

		var homesetbtn = jQuery("<div>", {
			'class': 'homeSetting',
			'html': '<i class="fa fa-home butFa"></i><span>' + sabace.getMessage('report.button.homeset') + '</span>'
				/*'html' : '<i class="fa fa-home"></i><span>'*/
		})

		if (obj.hasFoucs == false) {
			var foucsbtn = jQuery("<div>", {
				'class': 'foucsbtn',
				'html': '<i class="fa fa-heart-o butFa"></i><span>' + sabace.getMessage('report.button.focus') + '</span>'
					/*'html' : '<i class="fa fa-heart-o"></i>'*/
			})
		} else {
			var foucsbtn = jQuery("<div>", {
				'type': 'button',
				'class': 'nofoucsbtn',
				'html': '<i class="fa fa-heart butFa"></i><span>' + sabace.getMessage('report.button.unfocus') + '</span>'
					/*'html' : '<i class="fa fa-heart"></i>'*/
			})
		}
		but.append(homesetbtn).append(foucsbtn);
		stars.append(starArr);
		helpBlock.append(stars).append(a);
		txt.append(title).append(helpBlock) /*.append(but)*/ ;
		thumbnail.append(img).append(txt).append(hr).append(but);
		jQuery("#content").append(thumbnail)
	}

});