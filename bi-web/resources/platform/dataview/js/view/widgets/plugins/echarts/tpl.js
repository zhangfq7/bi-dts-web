define(['view/box', 'bace'],function(Box, Bace) {
	
	var Tpl = {};
	Tpl.module = {
		tplType:'',//1:单图;2:多图
		optType:'',//import:导入;save:保存
		container:{}
	};
	Tpl.control = {
			init:function(){
				var $tplPanel = $("#tplPanel");
				$(".tpl-chose",$tplPanel).removeClass("hide");
				$(".tpl-save,.tpl-import",$tplPanel).addClass("hide");
				$('.tpl-save',$tplPanel).validationEngine({ 
					  promptPosition: 'centerRight', 
					  scroll: false 
				})
			},
			show: function(container,type) { 
				var $tplPanel = $("#tplPanel");
				if (!$tplPanel.length) {
					$("body").append("<div id='tplPanel' style='display:none;position: relative;height:100%;width:100%;'></div>");
					$("#tplPanel").load(Bace.handleUrlParam('/platform/dataview/tpl-page'), function() {
						//你的初始化方法
						Tpl.control.init();
						
						//绑定一些按钮事件 
						Tpl.view.bindEvent();
						
						//弹出dialog
						Tpl.view.show(container,type);
						
						//绑定滚动条
						Bace.autoScroll($("#tplPanel .list"));
					})
				} else {
					Tpl.view.show(container,type);
				}
			},
			getAllTpl:function(){
				return Tpl.view.getAllTpl()
			},
			rendTpl:function($el,json,tplId){
				return Tpl.view.rendTpl($el,json,tplId)
			},

			/**
			 * 描述：跳转到多图模版设计页面
			 */
			skipTplPage:function(tplId){
				$.dialog.confirm("页面即将刷新到新的模版!当前页面信息不会保留！<br/>您确定要引用该模版吗？",function(){
					location.href = Bace.handleUrlParam("/platform/dataview/create")+"?tplId="+tplId;
				});
			}
		}
	Tpl.view = {
			show:function($container,type){
				Tpl.module.tplType  = $container?"1":"2";
				Tpl.module.container  = $container;
				if(Tpl.module.tplType ==2 && type == 'save'){
					//保存多图，验证模版是否合法
					var isPass = true;
					
					var $container = $("#tableChartPanel .container:not([charttype*='table']):not([charttype*='text']):not([charttype*='indicator'])");
					if($container.length == 0){
						$.dialog({
						    lock: true,
						    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">请拖入设置除表格以外的图形容器！</div>',
						    icon: 'warning',
						    ok: true
						});
						isPass = false;
					}
					
					$("#tableChartPanel .container").each(function(){
						if(!isPass)
							return;
						var $this = $(this);
						var option = $this.data("option");
						if(option === undefined || option.isInit === false){
							$("#tableChartPanel").animate({
								scrollTop: $this.css("top")
							}, 500);
							$.dialog({
							    lock: true,
							    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">设计面板中，包含未初始化的图形，请检查！</div>',
							    icon: 'warning',
							    ok: true
							});
							isPass = false;
						}
					})
					if(!isPass){return;}
				}
				
				
				Tpl.control.init();
				$.dialog({
					id:"tplDialog",
					title:'模版操作',
					padding:'0',
					width:'500px',
					height:'300px',
					lock: true,
					content:$("#tplPanel")[0],
					ok: function () {
						if(Tpl.module.optType == 'save'){
							var isPass = $('.tpl-save').validationEngine('validate');
							if(isPass){
								$.dialog.confirm("您确定保存该模版吗？",function(){
									var that =this;
									if(Tpl.module.tplType == "2"){
										$.Deferred(Box.Widgets.getThumbURL).done(function(data){ 
											Tpl.view.saveTpl(data).then(function(req){
												if(req.flag==0){
													that.showSucceed('保存多图模版成功！',"close");
												}else{
													that.showError('保存失败，请您稍后重新提交或者咨询相关人员！');
												}
											},function(){
												that.showError('保存失败，请您稍后重新提交或者咨询相关人员！');
											});//保存多图
										})
									}else{
										Tpl.view.saveTpl(Box.Widgets.getThumbSingleURL($container),$container).then(function(req){
											if(req.flag==0){
												that.showSucceed('保存单图模版成功！',"close");
											}else{
												that.showError('保存失败，请您稍后重新提交或者咨询相关人员！');
											}
										},function(){
											that.showError('保存失败，请您稍后重新提交或者咨询相关人员！');
										});//保存 单图
									}
									
									return false;
								});
								
							}
						
						}else if(Tpl.module.optType == 'import'){
							//单图
							var row = $('#dg').datagrid('getSelected');
							if(row == null){
								$.dialog({
									content :'您还没有选择模版，请选择!',
									icon: 'warning',
								    ok: true,
								    lock: true
								})
								return false;
							}
							if(Tpl.module.tplType == "1"){
								Tpl.view.rendTpl($container,$.parseJSON(row.tplConfig),row.tplId);
								$.dialog({
									content :"该模版引用成功，请打开属性面板，重新应用图形！",
									icon: 'succeed',
								    ok: function(){
								    	$.dialog({id:'tplDialog'}).close();
								    },
								    lock: true
								})
								if(Box.Property.close){
									Box.Property.close()
								}
								return true;
							}
							//多图
							if(Tpl.module.tplType == "2"){
								Tpl.control.skipTplPage(row.tplId);
							}
							
						}else{
							$("#tplPanel .tpl-chose-hover").trigger("click")
						}
						return false;
				    },
				    okVal:'确定',
				    cancelVal: '关闭',
				    cancel: function(){
				    	return true;
				    },
				    init : function(){
				    	Tpl.module.optType = ''
				    	$("#tplPanel .bi-input,.bi-textarea").val("");
				    	$("#tplPanel .tpl-import .aui_state_highlight").bind("click",function(){
				    		$('#dg').datagrid('load',{
				    			'tplType' : Tpl.module.tplType,
				    			'tplName' : $("#tplPanel .tpl-import .bi-input").val()
				    		})
				    	});
				    	$("#tplPanel .import-btn").bind("click",function(){
				    		$('#dg').datagrid('load',{
				    			'tplType' : Tpl.module.tplType,
				    			'page' :1
				    		})
				    	});
				    	//一进页面第一个按钮为选中状态
				    	$("#tplPanel .tpl-chose>div:eq(0)").addClass("tpl-chose-hover");
				    	$("#tplPanel .tpl-chose>div:eq(1)").removeClass("tpl-chose-hover");
				    	
				    	if(Tpl.module.tplType==2){
							if(type=="save"){
								$("#tplPanel .tpl-chose>div:eq(0)").trigger("click");
							}else{
								$("#tplPanel .tpl-chose>div:eq(1)").trigger("click");
							}
						}
				    	if(Tpl.module.tplType==1){
				    		//校验合法性
				    		var isInit = Tpl.module.container.data("option").isInit;
							if(!isInit){
								$("#tplPanel .tpl-chose>div:eq(1)").trigger("click");
							}
				    	}
				    }
				});
			},
			bindEvent:function(){
				//保存模板按钮
				$("#tplPanel .tpl-chose>div:eq(0)").bind("click",function(){
					
					Tpl.module.optType = 'save';
					$("#tplPanel .tpl-chose").addClass("hide");
					$("#tplPanel .tpl-save").removeClass("hide");
				})
				//引入模板按钮
				$("#tplPanel .tpl-chose>div:eq(1)").bind("click",function(){
					Tpl.module.optType = 'import';
					//调整弹出框的位置
					var $this = $(this)
					$this.parents(".aui_main").css("width","650px").css("height","353px");
					var left = $this.parents(".aui_state_lock").css("left").replace("px","");
					$this.parents(".aui_state_lock").css("left",left-75);
					$("#tplPanel .tpl-chose").addClass("hide");
					$("#tplPanel .tpl-import").removeClass("hide");
					$('#dg').datagrid({
			    		singleSelect:true,
			    		url: Bace.handleUrlParam('/platform/dataview/query-tpl'),
			    		method:'post',
			    		pagination:"true",
			    		loadMsg:'加载中...',
			    		queryParams:{
			    			'tplType' : Tpl.module.tplType,
			    			'tplName' : $("#tplPanel .tpl-import .bi-input").val()
			    		},
			    		height:310,
			    		columns:[[   
		    		          {field:'ck',checkbox:true,title:''},   
					          {field:'tplId',hidden:true},   
					          {field:'tplName',width:130,align:'left',halign:'center',title:'模板名称'},   
					          {field:'createTime',width:140,align:'center',halign:'center',title:'创建时间'}, 
//					          {field:'tplType',width:50,align:'center',halign:'center',title:'类型',formatter:function(value){
//					        	  if(value==1){
//					        		  return "单图";
//					        	  }else{
//					        		  return "组合";
//					        	  }
//					          }}, 
					          {field:'tplDesc',width:250,align:'left',halign:'center',title:'模板描述'}, 
					          {field:'thumbImg',width:80,align:'center',halign:'center',title:'操作',formatter:function(id,row,index){
					        	  return '<a class="view-tpl" thumbImg="'+id+'">预览</a>  /  <a class="import-tpl"  tplId="'+row.tplId+'">引用</a>';
					          }}
					    ]]   
			    	});
				});
				
				$("#tplPanel .tpl-chose>div").bind("mouseover",function(){
					$(this).siblings().removeClass("tpl-chose-hover");
					$(this).addClass("tpl-chose-hover");
				})
				//给预览按钮绑定事件
				$("#tplPanel").on("click",".view-tpl",function(){
					var $this = $(this).attr("thumbImg");
					var formTemp = $("<form></form>",{
						"method":"post",
						"action": Bace.handleUrlParam('/platform/myreport/tpl/report-tpl-view'),
						"target": "_blank",
						"html": "<input name='thumbImg' value='" + $this + "'/>"
					});
					$('body').append(formTemp);
					formTemp.submit();
					$(formTemp).remove();
				})
				//给引用按钮绑定事件
				$("#tplPanel").on("click",".import-tpl",function(){
					var tplId = $(this).attr("tplId");

					//单图
					var row = $('#dg').datagrid('getSelected');
					if(Tpl.module.tplType == "1"){
						Tpl.view.rendTpl(Tpl.module.container,$.parseJSON(row.tplConfig),tplId);
						$.dialog({
							content :"该模版引用成功，请打开属性面板，请重新应用图形！",
							icon: 'succeed',
						    ok: function(){
						    	$.dialog({id:'tplDialog'}).close();
						    },
						    lock: true
						})
						if(Box.Property.close){
							Box.Property.close();
						}
						
					}
					//多图
					if(Tpl.module.tplType == "2"){
						Tpl.control.skipTplPage(row.tplId);
					}
				})
			},
			/**
			 * 描述：获得多图模版的配置信息
			 */
			getAllTpl:function(){
				var tpls = [];
				$("#tableChartPanel .container:not([charttype*='table']):not([charttype*='text']):not([charttype*='indicator'])").each(function(){
					var $this = $(this);
					tpls.push({
						layout:{
							"top":$this.css("top"),
							"left":$this.css("left"),
							"width":$this.css("width"),
							"height":$this.css("height")
						},
						config:Tpl.view.getTpl($this)
						
					})
				})
				return tpls;
			},
			/**
			 * 描述：获得单图模版的配置信息
			 * @param {obj} $el	容器对象
			 */
			getTpl:function($container){
				
				//获得断绝血缘关系的容器配置项
				var option =   eval( "(" + $.toJSON($container.data("option")) + ")" );
				var designPanel = option.config.designPanel;
				var seriesPanel = designPanel.seriesPanel;
				var seriesAuto =  seriesPanel.seriesAuto;
				
				var attrData =  option.config.dataPanel.attrData;
				
				var attrDataTpl = [],seriesPanelTpl = {
					seriesData:{},
					seriesAuto:seriesAuto
				};
				
				//开始序列话模版信息
				_.each(attrData,function(obj,n){
					var tplId = "_tplId_"+n;
					var tplSeriesId = obj.seriesId.replace(obj.attrId,tplId);
					attrDataTpl.push({
						attrId:tplId,
						isChecked:false,
						isTpl:true,
						attrName:"模版指标位",
						modifyName:"模版指标位",
						seriesId:tplSeriesId,
						seriesType:obj.seriesType
					});
					if(seriesAuto === false){
						seriesPanelTpl.seriesData[tplSeriesId] = seriesPanel.seriesData[obj.seriesId];
					}
				})
				if(seriesAuto === true){
					seriesPanelTpl.seriesData = seriesPanel.seriesData ;
				}
				designPanel.seriesPanel = seriesPanelTpl;
				var ctype = option.chartType;
				if(!!option.chartChild && option.chartChild != ''){
					ctype = ctype + '-' + option.chartChild;
				}
				return {
					attrDataTpl:attrDataTpl,
					designPanel:designPanel,
					chartType: ctype,
                    mapType:option.mapType || "" //shaojs 20160926 保存模板的时候加mapType,二维柱图需要用
				}
			},
			/**
			 * 描述：获得单图模版的配置信息
			 * @param {obj} $container	容器对象
			 * @param {json} chartTplJSON	模版json
			 * @param {string} tplId	模版编码
			 */
			rendTpl:function($container,chartTplJSON,tplId){
				//当前容器配置项
				var option = $container.data("option") ;
				//设置当前容器的图形类型与模版类型一致
				option.chartType= chartTplJSON.chartType.split("-")[0];//chartType修改为widgets里面的chartClassType gaoya 20170511
				
				//初始化当前容器的模版指标位
				option.tplCount = chartTplJSON.attrDataTpl.length;
				
				//单独模版记录
				option.tplId = tplId||"";

                //shaojs 20160926 渲染模板的时候还原maptype,二维柱图需要用
                option.mapType = chartTplJSON.mapType ||"";

				//当前容器的指标对象集合
				var attrData  =  option.config.dataPanel.attrData;
				
				//当前容器的设计面板对象
				var designPanel = option.config.designPanel;
				
				//模版对象的系列对象
				var seriesPanel_tpl = chartTplJSON.designPanel.seriesPanel;
				
				//指标为空，则直接覆盖设置
				if(attrData===undefined || attrData.length == 0){
					
					option.config.dataPanel.attrData = chartTplJSON.attrDataTpl;
					option.config.designPanel = chartTplJSON.designPanel;
				}else{
					var seriesPanel = designPanel.seriesPanel;
					if(seriesPanel_tpl.seriesAuto === true ){
						option.config.designPanel = chartTplJSON.designPanel;
					}
					if(seriesPanel.seriesAuto === false && seriesPanel_tpl.seriesAuto === false ){
						var seriesData = seriesPanel.seriesData;
						_.each(chartTplJSON.attrDataTpl,function(obj,n){
							if(!attrData[n]){ 
								attrData[n] = obj;
							}
							//容器的seriesData－>seriesPanelTpl.seriesData
							seriesData[_.keys(seriesData)[n]||obj.seriesId] = seriesPanel_tpl.seriesData[obj.seriesId]; 
						})
						chartTplJSON.designPanel.seriesPanel.seriesData = seriesData;
						option.config.designPanel = chartTplJSON.designPanel;
					}
					if(seriesPanel.seriesAuto === true && seriesPanel_tpl.seriesAuto === false ){
						var seriesData = {};
						_.each(chartTplJSON.attrDataTpl,function(obj,n){
							if(!attrData[n]){
								attrData[n] = obj;
							}
							var _attr = attrData[n];
							//容器的seriesData－>seriesPanelTpl.seriesData
							seriesData[_attr.seriesId||obj.seriesId] = seriesPanel_tpl.seriesData[obj.seriesId]; 
						})
						chartTplJSON.designPanel.seriesPanel.seriesData = seriesData;
						option.config.designPanel = chartTplJSON.designPanel;
					}
				}
			},
			saveTpl:function(data,container){
				return $.ajax({
					type: "POST",
				    data: {
						tplType: Tpl.module.tplType,
						tplName :  $("#tplPanel .tpl-save .bi-input").val(),
						tplDesc :  $("#tplPanel .tpl-save .bi-textarea").val(),
						thumbImg:data,
						tplConfig:JSON.stringify(Tpl.module.tplType =="2"? Tpl.view.getAllTpl() :Tpl.view.getTpl(container))
					},
					url: Bace.handleUrlParam('/platform/dataview/save-tpl')
			    });
			}
			
	}
	return Tpl.control;
})