define(['view/box', 'bace'], function(Box, Bace) {
	var ReportUtil = {};
	
	ReportUtil.module = {
		labelNameArray: null
	};
	
	ReportUtil.control = {
		show:function(){
			var $savePanel = $("#saveReportPanel");
			if (!$savePanel.length) {
				
				//如果保存面板不存在，开始创建保存面板
				$("<div></div>",{
					"id":'saveReportPanel',
					"class":'validationEngineContainer',
					"style":'display:none'
				}).appendTo("body");
				var pageUrl = Bace.handleUrlParam('/platform/dataview/saveViewPage');
				$("#saveReportPanel").load(pageUrl, function() {
					//弹框打开保存页面
					ReportUtil.view.show();
					
					//添加日历  by xuyx  2016/11/9
					var date=new Date();
					var newdate=new Date(date.getTime()+30*24*60*60*1000);
					var expireDate=newdate.getFullYear()+'-'+(newdate.getMonth()+1)+'-'+newdate.getDate();
					$('#expireDatesave').val(expireDate);
					$('#expireDatesave').datepicker({
                        onSelect : function(date) {
							this.focus();
							this.blur();
						},
						minDate : date,
						dateFormat : 'yy-mm-dd',
						changeMonth: true,
						changeYear: true
					});
					//绑定初始化事件
					ReportUtil.view.bindEvent();
					
					//收集当前标签
					ReportUtil.module.labelNameArray = $("#saveReportPanel .unSelectedPanel").find(".text").arrayAttr('innerText', 'prop');

                    //如果是实时应用,移除可评论选择框 addby shaojs 20161026
                    if(Box.flags.isRealtimeapp){
                        $("#allowComment").parent().parent().remove();
                    }

                    //如果是修改操作，给面板赋默认值
					if (Box.main.reportId) {
						$("#reportName").val(Box.main.reportName);
						$("#reportDesc").val(Box.main.reportDesc);
						$("#expireDatesave").val(Box.main.expireDate);
						//已选标签初始化
						if (Box.main.labelId) {
							ReportUtil.view.addSelectLabel(Box.main.labelId);
						}
						//赋值允许评论报表
						if(Box.main.allowComment==0){
							jQuery("#allowComment").removeClass("checked");
						}
					}
					if(isNavyShow!="0"){
                        $('#naviLevel1').chosen({
                            disable_search: true
                        });

                        $('#naviLevel2').chosen({
                            disable_search: true
                        });

                        ReportUtil.view.initNavi(Box.main.reportId);
					}

					
				})
			}else{
				//如果页面存在，直接打开保存面板
				ReportUtil.view.show();

				//添加日历  by xuyx  2016/11/9
				var date=new Date();
				var newdate=new Date(date.getTime()+30*24*60*60*1000);
				var expireDate=newdate.getFullYear()+'-'+(newdate.getMonth()+1)+'-'+newdate.getDay();
				$('#expireDatesave').attr("value",expireDate);
				$('#expireDatesave').datepicker({
					onSelect : function(date) {
						this.focus();
						this.blur();
					},
					minDate : new Date(),
					dateFormat : 'yy-mm-dd',
					changeMonth: true,
					changeYear: true,
				});
			}
		},
		save:function(dtd){
			//先获得缩略图
			$.Deferred(ReportUtil.view.getThumbURL).done(function(thumbURL){
                if(Box.flags.isRealtimeapp){
                    var config = Box.main.realTimeappConfig;
                    var labeIdStr = ReportUtil.control.getSelectedId()||[""];
                    //收集参数
                    var param = {
                        reportId: Box.main.reportId,
                        dataId: Box.main.dataId,  //"" 没有dataId
                        urlMenuInfo:"",//没有url信息
                        reportName: $("#reportName").val(),
                        reportDesc: $("#reportDesc").val(),
                        expireDate: $("#expireDatesave").val(),
                        naviLevel1: $("#naviLevel1").val(),
                        naviLevel2: $("#naviLevel2").val(),
                        allowComment:0,  //默认不可以评论
                        labelId: labeIdStr.join(','),
                        thumbURL:"",
                        appType:"1" //"1" openAPI
                    };
					config.imgSrc= sessionStorage.imgSrc?sessionStorage.imgSrc:"";
                    param.resportConfig= $.toJSON(config);
                }else{
                    var config = Box.Widgets.start('collect');
                    var widgets=config.widgets;
                    var labeIdStr = ReportUtil.control.getSelectedId()||[""];
                    //收集参数
                    var param = {
                        reportId: Box.main.reportId,
                        dataId: Box.main.dataId,
                        urlMenuInfo:$.toJSON(Box.main.urlMenuInfo),//url菜单信息gaoya
                        reportName: $("#reportName").val(),
                        reportDesc: $("#reportDesc").val(),
                        expireDate: $("#expireDatesave").val(),
                        naviLevel1: $("#naviLevel1").val(),
                        naviLevel2: $("#naviLevel2").val(),
                        allowComment:$("#allowComment").hasClass("checked")?1:0,
                        labelId: labeIdStr.join(','),
                        // resportConfig: $.toJSON(config),add by gaoya ,探索页面取消filter数据，在下面修改
                        thumbURL:thumbURL,
                        appType:"0" //"0" 报表
                    };
                    //探索图表的时候是另存，所以把reportId的值设为空
                    if(discovery == '1'){
                        param.reportId='';
                        for(var i=0;i<widgets.length;i++){
                            widgets[i].option.config.build.dataParams.filterJsonStr="";
                        }
                    }
					config.imgSrc= sessionStorage.imgSrc?sessionStorage.imgSrc:"";
                    param.resportConfig= $.toJSON(config);
                }
				dtd.resolve($.ajax({
					type: "POST",
					url: Bace.handleUrlParam("/platform/dataview/saveViewInfo"),
					dataType: 'json',
					data: param
				}));
			})
		},
		saveLabel:function(saveObj,callback){
			$.ajax({
				type: "POST",
				url: Bace.handleUrlParam("/platform/dataview/addNewLabel"),
				dataType: 'json',
				data: {
					labelName:saveObj.labelName,
					labelId:saveObj.labelId||'',
					labelType:"2",
				},
				success: function(data) {
					if(data.labelId){
						ReportUtil.module.labelNameArray.push(saveObj.labelName)
						callback?callback(data.labelId):"";
					}
					return true;
				},
				error: function() {
					log(JSON.stringify(arguments));
					$.dialog.alert('保存标签失败');
					return false;
				}
			});
		},
		getSelectedId:function(){
			return $("#saveReportPanel .selectedPanel").find("div.label").arrayAttr('data-id');
		},
		getSelectedText:function(){
			return $("#saveReportPanel .selectedPanel").find("div.label .name").arrayAttr('innerText','prop');
		}
	};
	
	ReportUtil.view = {
		//显示弹框
		show:function(){
			
			$.dialog({
				id: 'saveDialog',
				title: '保存当前数据可视化',
				padding: '0',
				width: '600px',
				height: '400px',
				lock: true,
				content: $("#saveReportPanel")[0],
				ok: function() {
				
					//验证控件值的合法性
					var isPass = jQuery('#saveReportPanel').validationEngine('validate');
					if(!isPass){
						return false;
					}
					console.log(isNavyShow);
					if(isNavyShow!="0"){
						var level1 = $("#naviLevel1").val();
						var level2 = $("#naviLevel2").val();
						if(!level1 || !level2){
							$.dialog.alert('请选择正确的导航信息!');
							return false;
						}
					}
					
					$.dialog.confirm("您确定保存该可视化信息吗？",function(){
						var that =this;
						
						//设置table 的宽度
						var $els = $("#tableChartPanel .container");
						$els.each(function(i,v){
							var $this = $(v);
							var option = $this.data("option");
							if(option.chartType == 'table'){
								$this.find("td[field]>div").each(function(){
								   $(this).width($(this).width())	
							    })
							}
						});
						
						$.Deferred(ReportUtil.control.save).done(function(deferred){
							deferred.then(function(data){
								log(data);
                                //后台捕获异常后处理过了,所以不走ajax的failed方法,需要自己判断result addby shaojs 20161026
                                //data.result  "ERROR":失败,"OK":成功
                                if("ERROR" == data.result){
                                    that.showError('保存失败，请您稍后重新提交或者咨询相关人员！');
                                }else{
                                    Box.main.reportId = data.reportId;
                                    that.showSucceed('保存成功，您可以在仪表板管理里查看该可视化分析！',"close");
                                    $els.each(function(i,v){
                                        var $this = $(v);
                                        var option = $this.data("option");
                                        if(option.chartType == 'table'){
                                            $this.find("td[field]>div").each(function(){
                                                $(this)[0].style.width='';
                                            })
                                        }
                                    })
                                }
							},function(){
								that.showError('保存失败，请您稍后重新提交或者咨询相关人员！');
							})
						});
						return false;
					});
					return false;
				},
				okVal: '保存',
				cancelVal: '关闭',
				cancel: function() {
					return true;
				}
			});
		},
		addSelectLabel:function(labelArray){
			var labelObjArray = [];
			var $unSelectedPanel = jQuery("#saveReportPanel .unSelectedPanel");
			var $selectedPanel = $("#saveReportPanel .selectedPanel");
			for(var i =0,n=labelArray.length ;i<n;i++){
				var firstColorClass = $unSelectedPanel.find(".label:eq("+i+")").attr("class");
				var firstColor = firstColorClass ? firstColorClass.match(/blue|red|yellow|green/g) : "green";
				var color = ReportUtil.view.getNextColor(firstColor);
				
				var labelId = labelArray[i].labelId;
				$unSelectedPanel.find("div[data-id='"+labelId+"']").addClass("disabeld");;
				labelObjArray.push(
					$("<div></div>", {
						"class": "label " + color + " ladda-button",
						"data-style":'expand-left',
						"data-id":labelId,
						"data-spinner-color":'#2175BD',
						"html": '<div class="text no-select">'+
									'<span class="name">'+labelArray[i].labelName+'</span>'+
//									'<input class="bi-input validate[required]"/>'+
								'</div>' +
								'<div class="close"><i class="fa fa-close"></i></div>'
					})
				);
			}
			$selectedPanel.append(labelObjArray);
		},
		addLabel:function(){
			
			var $unSelectedPanel = jQuery("#saveReportPanel .unSelectedPanel");
			var firstColorClass = $unSelectedPanel.find(".label:eq(0)").attr("class");
			var firstColor = firstColorClass ? firstColorClass.match(/blue|red|yellow|green/g) : "green";
			var color = ReportUtil.view.getNextColor(firstColor);
			
			//如果没有显示的input框说明，没有新建状态，则可以新增
			if ($unSelectedPanel.find("input:visible").length == 0) {
				
				$("<div></div>", {
					"class": "label " + color + " ladda-button",
					"data-style":'expand-left',
					"data-spinner-color":'#2175BD',
					"html": '<div class="text no-select">'+
								'<span class="name"></span>'+
								'<input class="bi-input validate[required]"/>'+
							'</div>' +
							'<div class="close"><i class="fa fa-close"></i></div>'
				}).prependTo($unSelectedPanel);
				
			}
			//获得焦点
			$unSelectedPanel.find("input:visible").focus();
			
		},
		getNextColor: function(color, type) {
			var colorArray = ["red", "green", "yellow", "blue"];
			var index = 0;
			var type = type || 'next';
			if (type == 'prev') {
				index = colorArray.indexOf(color) - 1;
				index = index == -1 ? 0 : index;
			} else {
				index = colorArray.indexOf(color) + 1;
				index = index == 4 ? 0 : index;
			}
			return colorArray[index];
		},
		copyLabel:function($label){
			var text = $label.find(".text").text();
			var color = $label.attr("class").match(/blue|red|yellow|green/g);
			return $("<div></div>", {
						"class": "label " + color,
						"data-id":$label.attr("data-id"),
						"html": '<div class="text no-select">'+
									'<span class="name">'+text+'</span>'+
								'</div>' +
								'<div class="close"><i class="fa fa-close"></i></div>'
					})
		},
		deleteLabelById:function(labelId){
			return $.ajax({
				type: "POST",
				url: Bace.handleUrlParam("/platform/dataview/deleteLabelById"),
				dataType: 'json',
				data: {
					labelId:labelId
				}
			});
		},
		getThumbURL:function(dtd){

            //如果是实时引用,不用缩略图 addby shaojs 20161026
            if(Box.flags.isRealtimeapp){
                dtd.resolve("");
                return dtd;
            }

			jQuery("#gridBg,#tableChartPanel").removeClass("grid-bg");

			//布局面板
			var $tableChartPanel = jQuery("#tableChartPanel");
			
			$tableChartPanel.animate({
				scrollTop: 0
			}, 0);
			
			jQuery("#thumb_canvas").remove();			
			
			var firstTopArray = [];
			var lastBottomArray = [];
			
			var firstLeftArray = [];
			var lastRightArray = [];
			
			jQuery("#tableChartPanel .container").each(function() {
				var $this = $(this);
				
				firstTopArray.push($this.position().top);
				lastBottomArray.push($this.position().top + $this.parent().scrollTop() + $this.height() + 20);
				
				firstLeftArray.push($this.position().left + $this.parent().scrollLeft());
				lastRightArray.push($this.position().left + $this.parent().scrollLeft() + $this.width() );
				
			});
			
			//从画板中获得第一个图形的纵向起始位置=》firstTop
			var firstTop = Math.min.apply({},firstTopArray) - 20  ;
			firstTop = firstTop<0?0:firstTop;
			//从画板中获得最后一个图形的纵向结束位置=》lastBottom
			var lastBottom = Math.max.apply({},lastBottomArray) + 20;
			
			//从画板中获得第一个图形的横向起始位置=》firstTop
			var firstLeft = Math.min.apply({},firstLeftArray)-20;
			
			//从画板中获得最后一个图形的横向结束位置=》lastBottom
			var lastRight = Math.max.apply({},lastRightArray)+20;
			
			log("firstTop:"+firstTop);
			log("lastBottom:"+lastBottom);
			log("firstLeft:"+firstLeft);
			log("lastRight:"+lastRight);
			
			html2canvas(document.getElementById("tableChartPanel"), {
				onrendered: function(canvas) {
					 var sourceX = 0;
					 var sourceY =  0;
					 var sourceWidth = lastRight + 400;
					 var sourceHeight = lastBottom + 400;
					 var destWidth = sourceWidth;
					 var destHeight = sourceHeight;
					 var destX =-firstLeft;
					 var destY = -firstTop;
					 
					 log("destX:"+" " + destX);
					 log("destY:"+" " + destY);
					 
					 var image = new Image();
						 image.src = canvas.toDataURL("image/png");
						
						image.onload = function(){
							log(image.src)
							var width = lastRight-firstLeft;
							var height = lastBottom-firstTop;
							
							log("width:"+width)
							log("height:"+width/2)
							var newCnvs= document.createElement('canvas');
								newCnvs.setAttribute("id","thumb_canvas");
								newCnvs.style.display = "none"
								newCnvs.width=width;
								newCnvs.height=width/2+40; 
								document.body.appendChild(newCnvs);
							
							var canvas2 = document.getElementById('thumb_canvas');
							var context = canvas2.getContext('2d');
							context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
							document.body.appendChild(canvas2);
							log("图形生成完毕");
							log(canvas2.toDataURL("image/png"))
							jQuery("#gridBg,#tableChartPanel").addClass("grid-bg");
							dtd.resolve(canvas2.toDataURL("image/png"));
						}
				},
				width:lastRight + 500,
				height:lastBottom + 500
			});
			return dtd;
		},
		bindEvent:function(){
			//控件验证
			jQuery("#saveReportPanel").validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'bottomLeft',
				showOneMessage: true,
			});	
			
			Bace.autoScroll(jQuery("#saveReportPanel .unSelectedPanel,#saveReportPanel .selectedPanel"));
			
			//点击新建标签按钮
			jQuery("#saveReportPanel .selectTitle").on('click', '.addLabel', function() {
				ReportUtil.view.addLabel();
			});
			
			
			//新建标签内文本框，鼠标失去焦点和按下确认键触发事件
			jQuery("#saveReportPanel .unSelectedPanel").on('blur keyup', 'input:visible', function(event) {
				var $this = $(this);
				var labelName = $this.val();
				if ((event.keyCode == '13' || event.type === 'blur') && labelName) {
					var labelId = $this.parents('.label').attr('data-id');
					
					if(labelId&&labelName){
						log('修改')
						ReportUtil.control.saveLabel({
							labelName:labelName,
							labelId:labelId
						},function(){
							$this.hide();
							$this.parent().find('.name').show().text(labelName);
							$this.validationEngine('showPrompt','修改成功，单击为您的可视化贴上标签！', 'error','bottomLeft',true,3000);
							jQuery("#saveReportPanel .selectedPanel").find(".label[data-id="+labelId+"] .name").text(labelName);
						
							//如果是已选中的则加上禁止选择样式
							if ($.inArray(labelName, ReportUtil.control.getSelectedText()) > -1) {
								$this.parents('.label').addClass("disabeld");
							}
						})
					}else{
						if ($.inArray(labelName, ReportUtil.module.labelArray) > -1) {
							$this.validationEngine('showPrompt', "该标签名称已存在了，请重新录入！", 'error','bottomLeft',true,30000);
							$this.select();
							return;
						}else{
							ReportUtil.control.saveLabel({
								labelName:labelName
							},function(labelId){
								$this.parents(".label").attr("data-id",labelId);
								$this.hide();
								$this.parent().find('.name').text(labelName);
								$this.validationEngine('showPrompt','保存成功，单击为您的可视化贴上标签！', 'error','bottomLeft',true,3000);
							})
						}
					}
				}
			});
			
			//新建标签内文本框，输入的时候，移除验证不通过的提示框
			jQuery("#saveReportPanel .unSelectedPanel").on('input keyup', '.bi-input', function(event) {
				if (event.keyCode != '13') {
					 $(this).validationEngine('hide');
				}
			});
			
			var TimeFn = null;
			
			//单击标签，选择报表标签
			jQuery("#saveReportPanel .unSelectedPanel").on('click','.label',function(){
				
				// 取消上次延时未执行的方法
    			clearTimeout(TimeFn);
				var $this = $(this);
				$(this).validationEngine('hide');
				TimeFn = setTimeout(function(){
					
					if($this.find("input:visible").length==0 && !$this.hasClass("disabeld")){
						var selectlabel = ReportUtil.view.copyLabel($this);
						jQuery("#saveReportPanel .selectedPanel").prepend(selectlabel);
						$this.addClass("disabeld");
					}
					
				},200)
				
			});
			
			//双击未选区域标签，修改
			jQuery("#saveReportPanel .unSelectedPanel").on('dblclick','.label',function(event){
				 // 取消上次延时未执行的方法
    			clearTimeout(TimeFn);
				var $this = $(this);
				if($this.find("input").length==1 && $this.find(".close").length==1){
					var $input = $this.find("input");
					$input.show().select();
					$input.parent().find(".name").hide();
					$this.removeClass("disabeld");
				}
				Bace.stopBubble(event)
			});
			
			jQuery("#saveReportPanel .selectedPanel").on('click', '.close', function(event) {
				var $label = jQuery(this).parents('.label');
				log(jQuery("#saveReportPanel .unSelectedPanel").find(".label[data-id="+$label.attr('data-id')+"]"))
				jQuery("#saveReportPanel .unSelectedPanel").find(".label[data-id="+$label.attr('data-id')+"]").removeClass("disabeld");
				$label.remove();
			});

			jQuery("#saveReportPanel .unSelectedPanel").on('click', '.close', function(event) {
				var $label = jQuery(this).parents('.label');
				var labelId = $label.attr('data-id');
				
				$.dialog.confirm("您确定删除该标签吗？",function(){
					var that =this;
					ReportUtil.view.deleteLabelById(labelId).then(function(){
						that.showSucceed('删除成功！',function(){
							$label.remove();
						});
					},function(){
						that.showError('删除失败，请您稍后重新删除或者咨询相关人员！');
					});
					return false;
				});
				
				Bace.stopBubble(event)
			});
			
			//允许报表评论按钮
			jQuery("#allowComment").bind("click",function(){
				jQuery(this).toggleClass("checked");
			})
			
		},
		initNavi:function(reportId){
			
			console.log("reportId="+reportId);
			

			var getNaviLevel = function (level, parentNaviId, func){
				
				$.ajax({
					type: "POST",
					url: Bace.handleUrlParam('/platform/dataview/get-navi-level'),
					dataType: 'json',
					data: {
						"level": level,
						"parentNaviId": parentNaviId
					},
					success: function(req) {
						func(req);
					},
					error: function(req) {
						$.dialog.alert('初始化导航信息失败。');
					}
				});
				
			};
			
			var getLevel2=function(parentNaviId){
				
				$('#naviLevel2').empty();
				$('#naviLevel2').append('<option value="">&nbsp</option>');
				$('#naviLevel2').trigger("chosen:updated");
				
				getNaviLevel("2",parentNaviId,function(req){
					
					if(req==null || req.length==0){
						
						$('#naviLevel2').empty();
						$('#naviLevel2').append('<option value ="">无</option>');
						$('#naviLevel2').trigger("chosen:updated");

						return;
					}
					
					$('#naviLevel2').empty();
					
					for(var i=0;i<req.length;i++){
						var option = req[i];
						
						$('#naviLevel2').append('<option value ="'+option.naviId+'">'+option.naviName+'</option>');
						
					}
					
					$('#naviLevel2').trigger("chosen:updated");
					
				});1
					
					
			}
			
			
			var initNewNaviInfo = function(){
				
				getNaviLevel("1","",function(req){
					
					if(req==null || req.length==0){
						
						$('#naviLevel1').empty();
						$('#naviLevel1').append('<option value ="">无</option>');
						$('#naviLevel1').trigger("chosen:updated");
						
						return;
					}
					
					for(var i=0;i<req.length;i++){
						var option = req[i];
						
						if(i==0){
							getLevel2(option.naviId);
						}
						
						$('#naviLevel1').append('<option value ="'+option.naviId+'">'+option.naviName+'</option>');
						
					}
					
					$('#naviLevel1').bind('change',function(){

						var val = $("#naviLevel1").val();
						if(val!=''){
							getLevel2(val);
						}else{
							$('#naviLevel2').empty();
							$('#naviLevel2').append('<option value="">&nbsp</option>');
							$('#naviLevel2').trigger("chosen:updated");
						}
					});
					
					$('#naviLevel1').trigger("chosen:updated");
					
				});
			}
			
			if(reportId!=null){
			
				$.ajax({
					type: "POST",
					url: Bace.handleUrlParam("/platform/dataview/get-navi-info"),
					dataType: 'json',
					data: {
						naviId:reportId
					},
					success: function(data) {
						
						var level1 = data.level1;
						var level2 = data.level2;
						var level1s = data.level1s;
						var level2s = data.level2s;
						
						if(!data.status){
							initNewNaviInfo();
							return;
						}
						
						$('#naviLevel1').empty();
						$.each(level1s,function(){
							$('#naviLevel1').append('<option value="' + this.naviId + '">' + this.naviName + '</option>');
						});
						
						$('#naviLevel2').empty();
						$.each(level2s,function(){
							$('#naviLevel2').append('<option value="' + this.naviId + '">' + this.naviName + '</option>');
						});
						
						$("#naviLevel1").find("option[value='" + level1 + "']").attr("selected",true);
						$("#naviLevel2").find("option[value='" + level2 + "']").attr("selected",true);

						
						$('#naviLevel1').trigger("chosen:updated");
						
						$('#naviLevel2').trigger("chosen:updated");
						
						$('#naviLevel1').bind('change',function(){

							var val = $("#naviLevel1").val();
							if(val!=''){
								getLevel2(val);
							}else{
								$('#naviLevel2').empty();
								$('#naviLevel2').append('<option value="">&nbsp</option>');
								$('#naviLevel2').trigger("chosen:updated");
							}
						});
						
					},
					error: function() {
						$.dialog.alert('初始化导航信息失败。');
						return false;
					}
				});
			
			}else{
				
				initNewNaviInfo();

			}

		}
	};
	return ReportUtil.control;
});
