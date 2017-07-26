define(['view/box', 'bace'], function(Box, Bace) {
	var LevelUtil = {
	};
	LevelUtil.module = {
		clickObj:null,
		//进入类型 0：表示从点击“分档”按钮进入 ，1：表示从点击“衍生维度”进入
		enterType:'',
		//是否有新建分档
		isNew:false,
		//指标编码
		attrId:'',
		//指标名称
		attrName:'',
		//维度编码
		dimId:'',
		//系统自带的归类指标
		filterType:'',
		//分档编码
		levelId:'',
		//分档数据源
		data:null,
		//分档规则模版
		temp:'<li class="levelRule">'+
		'	<input value="${intervalName}" class="bi-input intervalName validate[required,len[1,30]]" placeholder="等级名称"/> '+
			'<select {{if createId != "" && createId!=operaId}} disabled {{/if}} class="levelSelect beginType" >'+
				'<option {{if beginType==1}} selected {{/if}} value="1">大于</option>'+
				'<option {{if beginType==2}} selected {{/if}} value="2">大于且等于</option>'+
				'<option {{if beginType==3}} selected {{/if}} value="3">等于</option>'+
			'</select>'+
		'	 <input value="${beginValue}" {{if beginType==3}} style="width:56%" {{/if}}  class="bi-input beginValue"  placeholder="起始值"/> '+
			'<span  {{if beginType==3}} style="display:none" {{/if}} class="endPanel"><select {{if createId != "" && createId!=operaId}} disabled {{/if}} class="levelSelect endType" >'+
				'<option {{if endType==1}} selected {{/if}} value="1">小于</option>'+
				'<option {{if endType==2}} selected {{/if}} value="2">小于且等于</option>'+
			'</select>'+
		'	 <input value="${endValue}" class="bi-input endValue" placeholder="结束值"/></span>'+
		'	 <div class="removeRule" title="移除该规则">'+
		'		<i {{if createId == "" || createId==operaId}}  class="fa fa-trash-o" {{/if}}></i>'+
		'	</div>'+
		'</li>',
		dimTemp:'<li class="levelRule">'+
					'<input value="${intervalName}"  class="bi-input intervalName validate[required,len[1,30]" placeholder="等级名称"/> '+
					'<select class="levelSelect beginType" >'+
						'<option selected  value="3">等于</option>'+
					'</select>'+
					' <input  style="width:58%" value="${beginLabel}" data-code="${beginValue}"  class="bi-input beginValue" placeholder=""/> '+
					'	 <div class="removeRule" title="移除该规则">'+
					'		<i  {{if createId == "" || createId==operaId}}  class="fa fa-trash-o" {{/if}}></i>'+
					'	</div>'+
				'</li>',
		errMsg :'<div class="errMsgDiy form-validation-field-0formError parentFormaa formError" style="z-index:999;opacity: 0.9; position: absolute; top: 34px; left: 222px; margin-top: 0px;"><div class="formErrorContent"></div></div>'
	};
	
	LevelUtil.control = {
		//入口方法
		show: function(clickObj,attrId,levelId,dimId,filterType,attrName,enterType) {
			LevelUtil.module.clickObj  = clickObj;
			//点击对象的指标编码
			LevelUtil.module.attrId=attrId;
			//点击对象的指标名称
			LevelUtil.module.attrName=attrName;
			//分档编码
			LevelUtil.module.levelId=levelId;
			//指标类型
			LevelUtil.module.filterType = filterType;
			//维度编码
			LevelUtil.module.dimId=dimId;
			//入口类型
			LevelUtil.module.enterType=enterType;

			//如果分档面板不存在，则生成分档面板
			if (!jQuery("#saveLevelPanel").length ) {
				//构建面板
				jQuery("<div></div>",{
					"id":"saveLevelPanel",
					"style":"display:none"
				}).appendTo("body");
				var pageURL = Bace.handleUrlParam("/platform/dataview/saveLevelPage");
				jQuery("#saveLevelPanel").load(pageURL , function(){
					//弹框显示
					LevelUtil.view.show();

					if(enterType == '1'){
						LevelUtil.view.installDropAttr();
						var $levelPanel = jQuery("#saveLevelPanel");
						$levelPanel.find(".listPanel").hide();
						jQuery("#importLevel").hide();
						jQuery("#removeLevel").hide();
					} else {
						//查询当前指标编码的所有的分档信息
						LevelUtil.view.rendLevel();
						jQuery("#importLevel").show();
						jQuery("#removeLevel").show();
					}

					setTimeout(function () {
						//添加规则
						LevelUtil.view.addRule();
					},100);
				})
				
			}else {
				LevelUtil.view.show();
				if(enterType == '1'){
					LevelUtil.view.installDropAttr();
					var $levelPanel = jQuery("#saveLevelPanel");
					$levelPanel.find(".listPanel").hide();
					jQuery("#importLevel").hide();
					jQuery("#removeLevel").hide();
				} else {
					var $levelPanel = jQuery("#saveLevelPanel");
					$levelPanel.find(".level-list.checked").attr("levelId","");
					//查询当前指标编码的所有的分档信息
					LevelUtil.view.rendLevel();
					jQuery("#importLevel").show();
					jQuery("#removeLevel").show();
				}
				setTimeout(function () {
					//添加规则
					var $levelPanel = jQuery("#saveLevelPanel");
					var levelId = $levelPanel.find(".level-list.checked").attr("levelId");
					if(levelId == undefined || levelId == ""){
						LevelUtil.view.addRule();
					}
				},100);
			}
			
		},
		
		//查询分档列表，根据当前面板的指标Id
		findLevelListByAttrId:function(){
			return $.ajax({
				type:'post',
				dataType:'json',
				url:Bace.handleUrlParam("/platform/dataview/findLevelListByAttrId"),
				data:{
					attrId:LevelUtil.module.attrId
				}
			})
		},
		//保存分档信息，collectData收集表单信息，如果levelId不为空，则视为修改
		saveLevelInfo:function(){
			var param = LevelUtil.view.collectData();
			 return $.ajax({
				type: "POST",
				url:Bace.handleUrlParam("/platform/dataview/saveLevelInfo"),
				dataType: 'json',
				data:param
			});
		},
		//删除分档，根据传入的分档编码
		delRuleById:function(levelId){
			return $.ajax({
				type:'post',
				dataType:'json',
				url:Bace.handleUrlParam("/platform/dataview/delLevelInfo"),
				data:{
					levelId:levelId
				}
			})
		}
	};
	
	LevelUtil.view = {
		//dialog显示分档面板
		show:function(){
			if(LevelUtil.module.enterType == '0'){
				jQuery(".bandTip").text("分档指标："+LevelUtil.module.attrName);
			} else {
				jQuery(".bandTip").text("拖拽指标至此进行分档");
			}
			var $levelPanel = jQuery("#saveLevelPanel").clone();
			$.dialog({
				title:'设置分档',
				padding:'0',
				width:'760px',
				height:'500px',
				lock: LevelUtil.module.enterType=='1'?false:true,
				content:$levelPanel[0],
				button: [{
						id:'importLevel',
		                name: '引用该分档',
		                //disabled:true,
		                title:'请在左侧选择一个有效的分档！',
		                callback: function () {
		                	//引用分档
		                	var $levelPanel = jQuery("#saveLevelPanel");
		                	var levelName = jQuery("#levelName").val();
		                	
		                	var levelId = $levelPanel.find(".level-list.checked").attr("levelId");
		                    if(!levelId){
		                    	art.dialog.alert('请选择一个有效的分档！')
		                    	return false;
		                    }
		                    LevelUtil.module.clickObj.data("dimAttrData").levelId = levelId;
		                    LevelUtil.module.clickObj.find(".fendang >div").text("已分档");
		                	return true;
		                }
	            	},{
						id:'removeLevel',
		                name: '取消分档',
		                //disabled:true,
		                callback: function () {
		                	//引用分档
		                	LevelUtil.module.clickObj.data("dimAttrData").levelId = "";
		                	LevelUtil.module.clickObj.find(".fendang >div").text("分档");
		                	return true;
		                }
	            	},{
						id:'saveLevel',
	                	name: '保存',
	                    callback: function () {
							if(LevelUtil.module.attrId == ''){
								art.dialog.alert('请先拖拽指标');
								return false;
							}
	                    	var isPass = $('#saveLevelPanel .levelPanel').validationEngine('validate');
							var $levelRule = $(".levelRulePanel>ul").find('li').length;
							if($levelRule <= 0){
								isPass = false;
								art.dialog.alert('请添加规则')
								return isPass;
							}
	                    	var $levlList =$("#levelList .datagrid-row:not('.datagrid-row-checked') .level-list");
	                    	$.each($levlList,function(i,v){
	                    		if($(v).html()==jQuery("#levelName").val()){
	                    			isPass = false;
	                    			art.dialog.alert('分档名称不能重复！')
	                    		}
	                    	});
	            			if(!isPass){
	            				return isPass;
	            			}
	            			//校验初始值结束值
	            			$.each($("#saveLevelPanel .levelRule"),function(i,v){
	            				if (! LevelUtil.view.checkValue($(v))){
	            					isPass = false;
	            				}
	            			});
	            			if(!isPass){
	            				return isPass;
	            			}

		                	$.dialog.confirm("您确定保存该分档信息吗？",function(){
								var that = this;
								LevelUtil.control.saveLevelInfo().then(function(data) {
									if(data.result == "IS USERD"){
										that.showError('保存失败，该分档已被引用，不能修改');
										return;
									} else if(data.result == "ERROR"){
										that.showError('保存失败，系统异常，请您稍后重新提交或者咨询相关人员！');
										return;
									}
									jQuery("#levelId").val(data.levelId);
									LevelUtil.module.isNew = false;
									that.showSucceed('保存成功，点击‘引用该分档’可以使用该分档进行分析！');
									//更新列表
									$("#levelList .level-clone").datagrid("load",{
										"attrId":LevelUtil.module.attrId
									})
								},function(){
									that.showError('保存失败，请您稍后重新提交或者咨询相关人员！');
								});
								return false;
							});
							return false;
	                    },
	                	focus: true
		            },
		            {
						name: '关闭',
						callback:function(){
							jQuery("#levelName,#levelDesc").removeAttr("disabled");
						}
					}
		        ],
		        init:function(){
		        	var $levelPanel = $('#saveLevelPanel .levelPanel');
		        	$levelPanel.validationEngine({ 
		        		  promptPosition: 'bottomLeft', 
		        		  scroll: false ,
		        		  autoHidePrompt :true,
		        		  autoHideDelay : 3000
		        	});
		        	
		        	//给初始值跟结束值加上
		        	$levelPanel.on("blur",".beginValue , .endValue",function(){
		        		LevelUtil.view.checkValue($(this).parents(".levelRule"));
		        	});
		        	
		        	//添加规则
					$levelPanel.on('click','.addRule',function(){
						//创建人和操作人不一致时点击失效 added by zhangcheng7
						var createId = jQuery("#levelId").attr("createId");
						var levelId = jQuery("#levelId").val();
						if(levelId !="" && createId!="" && createId !=undefined && operaId != createId){
							return;
						}
						LevelUtil.view.addRule();
					});
					
					//移除规则
					$levelPanel.on('click','.removeRule',function(){
						//创建人和操作人不一致时点击失效
						var createId = jQuery("#levelId").attr("createId");
						var levelId = jQuery("#levelId").val();
						if(levelId !="" && createId!="" && createId !=undefined && operaId != createId){
							return;
						}
						LevelUtil.view.removeRule($(this).parents(".levelRule"));
					});
					
					//左侧分档列表删除事件
					$levelPanel.on('click','.deletelevel',function(event){
						var $this = $(this);
						var levelId = $(this).attr("levelId");
						$.dialog.confirm("您确定要删除该分档信息吗？",function(){
							var that =this;
							LevelUtil.control.delRuleById(levelId).then(function(data) { 
								that.showSucceed('删除该分档成功！');
								//更新列表
								LevelUtil.view.rendLevel();
								
								var $levelPanel = jQuery("#saveLevelPanel");
								//如果删除的是，当前打开的分档信息，则置空
								if(levelId == $levelPanel.find(".infoPanel").attr("levelId")){
									LevelUtil.view.restLevelInfo();
								}
								
							},function(){
								that.showError('删除该分档失败！');
							});
							return false;
						});
						Bace.stopBubble(event);
					});
					
					//绑定事件
					LevelUtil.view.bindEvent();
					
					$("#saveLevelPanel .infoPanel").niceScroll({
						'cursorcolor' : '#fff'
					});
		        }
			});
		},
		installDropAttr: function () {
			$(".attrName").droppable({
				drop:function(event,ui) {
					var $helper = ui.helper;
					var attrId = $helper.attr("data-attrId") || "";
					var attrName = $helper.attr("data-attrName") || "";
					var filterType = $helper.attr("data-filterType") || "";
					var dimId = $helper.attr("data-dimId") || "";
					//如果不是从指标库拖拽过来，则中断逻辑(头部拖拽的helper有attr-helper这个class)
					if (!$helper.hasClass("attr-helper")) {
						return;
					}

					//点击对象的指标编码
					LevelUtil.module.attrId=attrId;
					//点击对象的指标名称
					LevelUtil.module.attrName=attrName;
					//指标类型
					LevelUtil.module.filterType = filterType;
					//维度编码
					LevelUtil.module.dimId=dimId;

					jQuery(".bandTip").text("分档指标：" + attrName);

					LevelUtil.view.rendLevel();
					setTimeout(function(){
						$(".aui_dialog .level-clone").datagrid('resize');
					},100);
					var $levelPanel = jQuery("#saveLevelPanel");
					var levelId = $levelPanel.find(".level-list.checked").attr("levelId");
					if(levelId == undefined){
						LevelUtil.view.buildLevelPanel("");
					}
				}
			})
		},

		//渲染左侧分档列表
		rendLevel:function(){
//			$("#levelList").ligerGrid({
//				url:Bace.handleUrlParam("/platform/dataview/findLevelListByAttrId"),
//                parms:{
//                	"attrId":LevelUtil.module.attrId
//                },
//                width: '202px',
//                height:'450px', 
//                usePager:false,
//                inWindow:false,
//                allowHideColumn:false,
//                enabledSort:false,
//                alternatingRow:false,
//                columns: [
//                   { display: '已有分档', name: 'levelName', align: 'left', width: '85%',render:function(rowdata){
//                	   var temp = '<div  class="level-list';
//                	   if(LevelUtil.module.levelId == rowdata.levelId){
//                		   temp+=' checked'
//                	   }
//                	   temp +='"  levelId="'+rowdata.levelId+'">'+rowdata.levelName+'</div>'
//                	   return temp;
//               	   }},
//                   { display: '操作', name: 'levelId', align: 'center', width: '15%',render:function(rowdata){
//                	   return '<div levelId="'+rowdata.levelId+'" class="deletelevel" title="删除该分档">'+
//			           			'<i class="fa fa-trash-o"></i>'+
//			           		  '</div>'
//                   }}
//                ],
//                onSelectRow:function(rowdata, rowindex){
//                	LevelUtil.view.buildLevelPanel(rowdata);
//                	jQuery("#levelId").val(rowdata.levelId);
//                	var $levelList = $("#levelList");
//                	$levelList.find(".level-list").removeClass("checked");
//                	$levelList.find(".level-list[levelId='"+rowdata.levelId+"']").addClass("checked");
//                	
//                },
//                onBeforeShowData:function(data){
//                	var $levelPanel = jQuery("#saveLevelPanel");
//                	if(!data||data.Rows.length == 0 ){
//                		LevelUtil.view.restLevelInfo("未命名");
//    					$levelPanel.find(".listPanel").hide();
//    				}else{
//    					$levelPanel.find(".listPanel").show();
//    				}
//                }
//            });
				$(".aui_dialog .level-clone").datagrid({
					url:Bace.handleUrlParam("/platform/dataview/findLevelListByAttrId"),
					queryParams:{
	                	"attrId":LevelUtil.module.attrId
	                },
	                width: '220px',
	                height:'530px',
	                fitColumns:true,
	                showHeader:false,
	                singleSelect :true,
	                columns:[[   
				          {field:'levelName',title:'Code',width:85,align:'left',formatter:function(val,rowdata){
				        	  var temp = '<div  class="level-list';
		                	   if(LevelUtil.module.levelId == rowdata.levelId){
		                		   temp+=' checked'
		                	   }
		                	   temp +='"  levelId="'+rowdata.levelId+'">'+rowdata.levelName+'</div>'
		                	   return temp;
				          }},   
				          {field:'levelId',title:'Code',width:15,align:'center',formatter:function(val,rowdata){
							  //alert(rowdata.createId + "***operaId:" + operaId);
							  if(rowdata.createId === undefined || operaId == rowdata.createId ){
								  return '<div levelId="'+rowdata.levelId+'" class="deletelevel" title="删除该分档">'+
									  '<i class="fa fa-trash-o"></i>'+
									  '</div>'
							  } else {
								  //alert("不是自己创建的分档");
							  }

				          }}
				    ]] ,
				    onSelect:function(rowIndex, rowdata){
				    	if(rowdata==undefined){
				    		return;
				    	}
				    	LevelUtil.view.buildLevelPanel(rowdata);
	                	jQuery("#levelId").val(rowdata.levelId);
	                	var $levelList = $("#levelList");
	                	$levelList.find(".level-list").removeClass("checked");
	                	$levelList.find(".level-list[levelId='"+rowdata.levelId+"']").addClass("checked");
				    },
				    onUnselect:function(rowIndex, rowdata){
				    	$("#levelList .level-clone").datagrid('selectRow',rowIndex);
				    },
				    onLoadSuccess:function(data){
				    	log(data.rows.length)
				    	var $levelPanel = jQuery("#saveLevelPanel");
	                	if(!data||data.rows.length == 0 ){
	                		LevelUtil.view.restLevelInfo();
	    					$levelPanel.find(".listPanel").hide();
	    				}else{
	    					$levelPanel.find(".listPanel").show();
	    				}
	                	$('.datagrid-view').css('height','530px');
	                	$("#levelList .level-clone").datagrid('selectRow',0);
	                	
				    }
	             });
			
			LevelUtil.module.isNew = false;
			Bace.autoScroll(jQuery("#saveLevelPanel .l-grid-body2"));
			return;
		},
		//删除规则
		removeRule:function($ruleLi){
			$ruleLi.find(".levelSelect").chosen('destory');
			$ruleLi.hide("fade", 350, function() {
				jQuery(this).remove()
			});
		},
		//添加规则
		addRule:function(data,createId){
			if(!data){
				data = [{
					beginType:1,
					endType:1,
					beginLabel:'',
					beginValue:'',
					createId:''
				}]
			} else if (createId){
				for(var i = 0; i< data.length ; i++){
					data[i] = $.extend({},data[i],{createId:createId});
				}
			}
			var $new;
			var dimId = LevelUtil.module.dimId;
			var filterType = LevelUtil.module.filterType;
			if(dimId || ['A','B','C'].indexOf(filterType)>-1){
				$new = $.tmpl(LevelUtil.module.dimTemp,data);
				function ajaxDataFilter(treeId, parentNode, responseData){
					return responseData.RES_DATA;
				}
				var ajaxURL  =  '/platform/dataview/query-tree-data';
				$new.each(function(){
					var $ztreeInput = $(this).find(".beginValue.bi-input");
					$ztreeInput.bzTree({
						async:{
							 enable: true,
							 autoParam: ["id=clickCode","dimId=clickDimId"],
							 url:Bace.handleUrlParam(ajaxURL),
							 dataType:'json',
							 otherParam: {"dimId":dimId,"filterType":filterType},
							 dataFilter: ajaxDataFilter
						},
						zIndex:'999999999999'
					});
				});
				$new.find(".levelSelect").chosen({
					width:"80px",
					disable_search:true
				}).setDisabled(true);
			}else if([4,6,7].indexOf(filterType)>-1){
				//日期格式需要渲染时间框
				//月份 MONTH:'4'
				//日期 DAY:'6'
				//时间 TIME:'7'
				if(filterType == '4'){
					fmt = "YYYY-MM";
				}
				if(filterType == '6'){
					fmt = "YYYY-MM-DD"
				}
				if(filterType == '7'){
					fmt = "YYYY-MM-DD HH:mm:ss"
				}
				$new = $.tmpl(LevelUtil.module.temp,data);
				$new.find(".beginValue.bi-input,.endValue.bi-input").datetimepicker({
					format: fmt,
					showClear:true,
					showTodayButton:true,
					keepOpen:false,
					widgetPositioning:{
			            horizontal: 'right',
		                vertical: 'bottom'
		             }
				});
				$new.find(".levelSelect").chosen({
					width:"19%",
					disable_search:true
				});
				
			}else{
				$new = $.tmpl(LevelUtil.module.temp,data);
				$new.find(".levelSelect").chosen({
					width:"19%",
					disable_search:true
				});
			}
			jQuery("#saveLevelPanel .levelRulePanel>ul:eq(0)").append($new);
			$new.find("input").placeholder();	
		},
		//收集将要保存的分档表单信息
		collectData:function(){
			var $levelPanel = jQuery("#saveLevelPanel");
            var levelId = jQuery("#levelId").val();
			var param = {
				levelName:jQuery("#levelName").val(),
				levelDesc:jQuery("#levelDesc").val(),
				attrId:LevelUtil.module.attrId,
				//从面板中获得，为空视为新建，不为空视为修改
				levelId:levelId,
				levelRule:''
			};
			var levelRuleArray = [];
			if(LevelUtil.module.dimId || ['A','B','C'].indexOf(LevelUtil.module.filterType)>-1){
				$levelPanel.find("li.levelRule").each(function(i){
					var $this= $(this);
					levelRuleArray.push({
						intervalId:i,
						intervalName:$this.find(".intervalName").val(),
						beginType : $this.find(".beginType").val(),
						beginValue: ($this.find(".beginValue").data('code')||[]).join(','),
						beginLabel: $this.find(".beginValue").val(),
					});
				})
			}else{
				$levelPanel.find("li.levelRule").each(function(i){
					var $this= $(this);
					levelRuleArray.push({
						intervalId:i,
						intervalName:$this.find(".intervalName").val(),
						beginType : $this.find(".beginType").val(),
						beginValue: $this.find(".beginValue").val(),
						endType:$this.find(".endType").val(),
						endValue:$this.find(".endValue").val()
					});
				})
			}
			
			param.levelRule = JSON.stringify({"rule":levelRuleArray});
			return param;
		},
		buildLevelPanel:function(rowData){
			//寻找labelId代表的左侧信息
			//所有分档都已缓存在左侧属性中
			//先清空，再渲染
			LevelUtil.view.restLevelInfo();
			if(rowData==undefined){
				return;
			}
			jQuery("#levelId").val(rowData.levelId);
			//将创建人id挂载到levelId后面，新增和删除规则判断是否是本人创建的分档时用到
			jQuery("#levelId").attr("createId",rowData.createId);
			jQuery("#levelName").val(rowData.levelName);
			jQuery("#levelDesc").val(rowData.levelDesc);
			LevelUtil.view.addRule(rowData.levelRule?$.evalJSON(rowData.levelRule).rule:"",rowData.createId);
			//是否本人创建的分档
			if(rowData.createId != undefined && operaId != rowData.createId){
				jQuery("#levelName,#levelDesc").attr("disabled","disabled");
				setTimeout(function () {
					jQuery(".levelRule>input").prop("disabled","disabled");
					jQuery(".levelRule span>input").prop("disabled","disabled");
				},100);
				jQuery("#addRule").hide();
				jQuery("#saveLevel").hide();
			} else {
				jQuery("#levelName,#levelDesc").removeAttr("disabled");
				jQuery("#addRule").show();
				jQuery("#saveLevel").show();
			}
		},
		restLevelInfo:function(levelName){
			var $levelPanel = jQuery("#saveLevelPanel");
			jQuery("#levelDesc").val("");
			jQuery("#levelName").val(levelName||'');
			var $ul = $levelPanel.find(".levelRulePanel>ul");
			$ul.find(".levelSelect").chosen('destory');
			$ul.html("");
		},
		bindEvent:function(){
			var $levelPanel = jQuery("#saveLevelPanel");
			
			//左侧分档列表点击新建事件
			$levelPanel.on('click','.addlevel',function(){
				if(LevelUtil.module.isNew === false){
					 var row = {
						 levelName: "*未命名"
					 };
					 var $obj =$(".aui_dialog .level-clone");
					 $obj.datagrid('appendRow',row);
					 
					 var index =$obj.datagrid('getRowIndex',row );
					 $obj.datagrid('selectRow',index );
			    	 LevelUtil.module.isNew = true;
				}
			});
			
			//开始规则切换事件
			$levelPanel.on('change','.beginType',function(){
				var $this = $(this),
					 $levelRule =$(this).parents('.levelRule'),
					 $endPanel = $levelRule.find('.endPanel'),
					 $beginInput = $levelRule.find('.beginValue');
				if($this.val() == '3'){
					$endPanel.hide();
					$beginInput.css({
						width:'56%'
					}).attr('placeholder','如需匹配多个值，用英文逗号分割。');
					
				}else{
					$endPanel.show();
					$beginInput.css({
						width:'18%'
					}).attr('placeholder','起始值');
				}
			});
			
			//初始化滚动条 ,#saveLevelPanel .level-all
			Bace.autoScroll(jQuery("#saveLevelPanel .infoPanel"))
		},
		//校验初始值跟结束值
		checkValue:function(obj){
			var begin = obj.find(".beginValue").val();
			var end =obj.find(".endValue").val()==undefined?"":obj.find(".endValue").val();
			obj.find(".errMsgDiy").remove();
			var $errMsg = $(LevelUtil.module.errMsg);
			setTimeout(function(){
				$errMsg.remove();
			},3000);
			if(begin == "" && end == ""){
				$errMsg.find(".formErrorContent").html("* 初始值跟结束值必须填写一个");
				obj.append($errMsg);
				return false;
			}
			
			//都是数字
			if(!isNaN(begin) && !isNaN(end)){
				if(parseInt(begin)>parseInt(end) && end !=""){
					$errMsg.find(".formErrorContent").html("* 初始值不能大于结束值");
					obj.append($errMsg)
					return false;
				}
			}
			if([4,6,7].indexOf(LevelUtil.module.filterType)>-1){
				var beiginDate = new Date(begin).getTime();
				var endDate = new Date(end).getTime();
				if(beiginDate>endDate){
					$errMsg.find(".formErrorContent").html("* 初始值不能大于结束值");
					obj.append($errMsg);
					return false;
				}
			}
			return true;
		}
	};
	return LevelUtil.control;
});