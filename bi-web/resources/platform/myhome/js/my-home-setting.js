define(['sabace', 'mymessage'], function(sabace, mymessage) {
	var pageSize = 30; //一页显示的条数
	var type = "all";
	jQuery(function() {
		$(".selectedList").height($(".centerDiv").height() - 80).niceScroll();
		$(".selectList").height($(".rightDiv").height() - 140).niceScroll();
		$(".selectedList").height($(".centerDiv").height() - 100);
		$(window).resize(function() {
			$(".selectedList").height($(".centerDiv").height() - 80).niceScroll();
			$(".selectList").height($(".rightDiv").height() - 140).niceScroll();
			$(".selectedList").height($(".centerDiv").height() - 100);
		});


		//给已选报表绑定点击事件
		jQuery("#selectedList").on("click", ".parentPanel", function() {
			var obj = jQuery(this).find("input[data-toggle='checkbox']");
			obj.prop("checked", !obj.prop("checked"));
		});

		//给按钮组点击样式
		jQuery(".btn-group button").bind("click", function() {
			jQuery(".btn-group button").removeClass("clickedButton theme-background").addClass("normalButton");
			jQuery(this).addClass("clickedButton theme-background").removeClass("normalButton");
		})
		jQuery("#firstbutton").click();

		//给已选报表删除按钮加事件
		jQuery(".reportDelete").bind("click", function() {
			if (jQuery("#selectedList input:checked").size() == 0) {
				bi.dialog.show({
					title: sabace.getMessage('home.label.TipBox'),
					message: sabace.getMessage('home.msg.deleteMsg'),
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
			} else {
				bi.dialog.confirm({
					title: sabace.getMessage('home.label.confirmBox'),
					message: sabace.getMessage('home.msg.deleteConfirmMsg'),
					callback: function(result) {
						if (result) {
							jQuery("#selectedList input:checked").parents(".parentPanel").remove();
							if($("#selectedList>div").size()==0){
								$("#selectedList").html("<div id='todelete' style='height:150px;width:100%;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>")
							}
						}
					}
				});
			}
		})


		sabace.ajax({
			url: sabace.handleUrlParam('/platform/myreport/view/query-myhome'),
			success: function(req) {
				jQuery.each(req, function(i, v) {
					var obj = creatRep(v);
					addReport(obj, 'query');
				})
				if($("#selectedList>div").size()==0){
					$("#selectedList").html("<div id='todelete' style='height:150px;width:100%;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>")
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

		jQuery(".search-btn-group button").bind("click", function() {
			type = jQuery(this).val();
			$('.selectList').animate({
				scrollTop: 0
			}, 100);
			findDataByButton(0, type, "");
		})

		jQuery("#firstbutton").click();

		jQuery("#search").bind("click", function() {
			findDataByButton(0, type, "");
		})

		//点击分页查询数据的方法
		function findData(index, ty, labelIds) {
			var searchText = jQuery("#searchInput").val(); //搜索框的内容
			sabace.ajax({
				loading:{
					spin:true,
					spin  : {
						appendTo : ".selectList",//蒙层添加对象
						//background : 'rgba(231, 140, 91, .6)',//蒙层背景颜色
						lines: 11, // 花瓣个数   
						length: 12, // 花瓣长度   
						width: 5, // 花瓣宽度
						radius: 15, // 圆大小
						color: '#fff',//花瓣颜色	
					}
				},
				url: sabace.handleUrlParam('/platform/myreport/view/query-reps/'),
				data: {
					page: index,
					rows: pageSize,
					type: ty,
					labelIds: labelIds,
					searchText: searchText
				},
				success: function(req) {
					jQuery("#content").html("");
					$('.selectList').animate({
						scrollTop: 0
					}, 100);
					jQuery.each(req.reportList.rows, function(i, v) {
						var obj = creatRep(v);
						jQuery("#content").append(obj);
					})

					//拖拽
					jQuery(".selectList .thumbnail").draggable({
						revert: "invalid",
						cursor: "move",
						helper: "clone",
						connectToSortable: "#selectedList",
						appendTo: "body",
						start: function() {
							$(".selectList .thumbnail").removeClass("draped");
							$(this).addClass("draped");
							$(".selectedList .parentPanel").addClass("dragBgColor");
						},
						stop: function(){
							$(".selectedList .parentPanel").removeClass("dragBgColor");
						}
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
		}

		function findDataByButton(index, ty, labelIds) {
			var searchText = jQuery("#searchInput").val(); //搜索框的内容
			sabace.ajax({
				data: {
					page: index,
					rows: pageSize,
					type: ty,
					labelIds: labelIds,
					searchText: searchText
				},
				loading:{
					spin:true,
					spin  : {
						appendTo : ".selectList",//蒙层添加对象
						//background : 'rgba(231, 140, 91, .6)',//蒙层背景颜色
						lines: 11, // 花瓣个数   
						length: 12, // 花瓣长度   
						width: 5, // 花瓣宽度
						radius: 15, // 圆大小
						color: '#fff',//花瓣颜色	
					}
				},
				url: sabace.handleUrlParam('/platform/myreport/view/query-reps'),
				success: function(req) {
					jQuery("#content").html("");
					if (req.reportList.rows.length == 0) {
						var d = jQuery("<div>", {
							'style': 'text-align:center;margin-top:40px;'
						})
						var noreport = jQuery("<img>", {
							'src': resPath + '/resources/platform/myreport/img/noreport.png',
							'style': 'width:50%;'
						})
						d.append(noreport)
						jQuery("#content").html(d);
					}
					jQuery.each(req.reportList.rows, function(i, v) {
						var obj = creatRep(v);
						jQuery("#content").append(obj);
					})

					//拖拽
					jQuery(".selectList .thumbnail").draggable({
						revert: "invalid",
						cursor: "move",
						helper: "clone",
						appendTo: "body",
						connectToSortable: "#selectedList",
						start: function() {
							$(".selectList .thumbnail").removeClass("draped");
							$(this).addClass("draped");
							$(".selectedList .parentPanel").addClass("dragBgColor");
						},
						stop: function(){
							$(".selectedList .parentPanel").removeClass("dragBgColor");
						}
					});

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
						findData(pageIndex, ty, "");
					}).on('jumpClicked', function(event, pageIndex) {
						findData(pageIndex, ty, "");
					});
					//调整分页的位置
					var rowWidth = jQuery(".page").width();
					var pageWidth = Number(jQuery(".m-pagination-page").width()) + Number(jQuery(".m-pagination-jump").width());
					jQuery(".m-pagination-page").css("margin-left", (rowWidth - pageWidth) / 2 + "px");
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

		jQuery(".savebtn").bind("click", function() {
			var num = jQuery("#selectedList").children().not('#todelete').size();
			var reportIdArry = [];
			jQuery.each(jQuery("#selectedList .thumbnail"), function(i, v) {
				reportIdArry.push(jQuery(v).attr("reportId"))
			})
			bi.dialog.confirm({
				title: sabace.getMessage('home.label.confirmBox'),
				message: sabace.getMessage('home.msg.sethome1') + num + sabace.getMessage('home.msg.sethome2'),
				callback: function(result) {
					if (result) {
						sabace.ajax({
							loading: { //如果传入loading对象，系统将产生loading进度条
								title: sabace.getMessage('home.msg.execution'),
								text: sabace.getMessage('home.msg.submitMsg')
									//	        					,spin:true
									//	        					spin  : {
									//	        						appendTo : ".centerDiv",//蒙层添加对象
									//	    							background : 'rgba(231, 140, 91, .6)',//蒙层背景颜色
									//	    							lines: 11, // 花瓣个数   
									//	    							length: 12, // 花瓣长度   
									//	    							width: 5, // 花瓣宽度
									//	    							radius: 15, // 圆大小
									//	    							color: '#fff',//花瓣颜色	
									//	        					}
							},
							url: sabace.handleUrlParam('/platform/myreport/view/set-home/'),
							data: {
								reportIds: reportIdArry.toString()
							},
							success: function(req) {
								bi.dialog.show({
									title: sabace.getMessage('home.label.TipBox'),
									message: sabace.getMessage('home.msg.successSet'),
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
       
		//已选报表列表加sort事件
		$("#selectedList").sortable({
			revert: true,
			start: function() {
               
			},
			axis: 'y',
			stop: function(event, ui) {
				var item = $(ui.item);
				if (item.hasClass("parentPanel")) {
					return;
				}
				var _selfId = item.attr("reportId");
				//找出现有的报表
				var reportIdArray = jQuery("#selectedList .thumbnail").arrayAttr("reportId");
				var num = 0;
				jQuery.each(reportIdArray, function(i, v) {
					if (v == _selfId) {
						num++;
					}
				})
				if (num > 1) {
					item.remove();
					bi.dialog.show({
						title: sabace.getMessage('home.label.TipBox'),
						message: sabace.getMessage('home.msg.repeatMsg'),
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
				}

				if (jQuery("#selectedList").children().size() > 5) {
					bi.dialog.confirm({
						title: sabace.getMessage('home.label.confirmBox'),
						message: sabace.getMessage('home.msg.mostMsg'),
						callback: function(result) {
							if (result) {
								jQuery("#selectedList").children().eq(5).remove();
							} else {
								jQuery("#selectedList div[reportId=" + _selfId + "]").parents(".parentPanel").remove();
							}
						}
					});
				}
				sabace.timeout(function() {
					item.replaceWith(addReport(item.outerHTML()));
					$('[data-toggle="checkbox"]').iCheck({
						checkboxClass: 'icheckbox_minimal',
						radioClass: 'iradio_minimal'
					});
				}, 0)
				jQuery("#todelete").remove();
			},
			opacity: 0.8
		});



		/*jQuery("#selectedList").droppable({ 
			drop: function( event, ui ) {
			    alert(sortFlag)
				if(sortFlag == 0){
					return;
				}
				
				flag = 0;
				//判断该报表已选列表里是否存在
				var reportId = jQuery(".selectList .draped").attr("reportId");
				jQuery.each(jQuery(".selectedList .thumbnail"),function(i,v){
					if(jQuery(v).attr("reportId")==reportId){
						flag = 1;
						bi.dialog.show({
				            title: sabace.getMessage('home.label.TipBox'),
				            message: sabace.getMessage('home.msg.repeatMsg'),
				            cssClass:'register-dialog',
				            nl2br:false,
				            closable:true,
				            closeByBackdrop:false,
				            closeByKeyboard:false,
				            buttons: [{
				                label: sabace.getMessage('home.button.sure'),
				                action: function(dialogItself){
				                	dialogItself.close();
				                }
				            }]
					    });
					}
				})
				
				if(flag == 0){
					if(jQuery( "#selectedList").children().size() >= 5){
						flag = 1;
						bi.dialog.confirm({
				            title: sabace.getMessage('home.label.confirmBox'),
				            message: sabace.getMessage('home.msg.mostMsg'),
				            callback: function(result) {
				                if(result) {
				                	jQuery( "#selectedList").children().eq(4).remove();
				        			addReport(jQuery(".selectList .draped").clone());
				                }
				            }
					    });
					}
				}
				
				if(flag == 0){
					  addReport(jQuery(".selectList .draped").clone());
				}
			} 
		});*/
	})

	//在已选报表列表里动态加报表的方法
	function addReport(obj, type) {
		var a = jQuery("<div>", {
			"class": "parentPanel"
		});
		var div2 = jQuery("<div>", {
			"class": "imgPanel"
		});
		var div3 = jQuery("<div>", {
			"class": "checkPanel"
		});
		var label = jQuery("<label>", {
			"class": "checkbox"
		});
		var input = jQuery("<input>", {
			"type": "checkbox",
			"data-toggle": "checkbox"
		});
		div2.append(obj);
		label.append(input);
		div3.append(label);

		a.append(div2).append(div3);
		if (type == 'query') {
			jQuery("#selectedList").append(a);
		} else {
			return a;
		}
		$('[data-toggle="checkbox"]').iCheck({
			checkboxClass: 'icheckbox_minimal',
			radioClass: 'iradio_minimal'
		});
	}

	//生成报表的方法
	var height = $(document).height() / 5 + 5; //每张报表图片的高度
	function creatRep(obj) {
		var thumbnail = jQuery("<div>", {
			'class': 'thumbnail effect',
			'reportId': obj.reportId
		});
		var img = jQuery("<div>", {
			'css': {
				'height': height + 'px',
				'background': 'url(' + obj.imgByte + ') no-repeat',
				'background-size': '100% auto'
			},
			'class': 'repImg'
		});
		var txt = jQuery("<div>", {
			'class': 'txt'
		})
		var title = jQuery("<strong>", {
			'html': obj.reportName
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
		stars.append(starArr);
		helpBlock.append(stars).append(a);
		txt.append(title).append(helpBlock);
		thumbnail.append(img).append(txt);
		return thumbnail;
	}

});