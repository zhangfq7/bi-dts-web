define(['view/box', 'bace','view/attr'],
	function(Box, Bace, Attr) {
		var CalcUtil = {};
		CalcUtil.Consts = {
		    //用作计算表达式的check
			ATTR:1234567890,
			//连续的指标
			ATTR_2:"12345678901234567890",
			//用作判断是否可做计算指标
			ATTRCLASS:{
				COMMON:0, //普通指标
				CUSTOM:1, //自定义指标
				REPORT:2, //报表自定义指标
				FORMART:3 //日期格式化自定义指标
			},
			//数值型才可计算
			ATTRTYPE:{
				NUM:1,  //数值型
				TIME:2, //日期型
				CHAR:3  //字符型
			}
		};
		var treeId ="";
		CalcUtil.control = {
			init:function(){
				//表单验证
				jQuery('.calc-control').validationEngine({
					autoHidePrompt: true,
					autoHideDelay: 2000,
					binded: true,
					promptPosition: 'bottomLeft',
					showOneMessage: true
				})
				//获取指标分组
				CalcUtil.control.getGroup();
				//初始化拖拽事件的承接
				CalcUtil.control.intialDroppable();
				//初始化 输入数字的拖拽事件
				CalcUtil.control.intialInputDrag();
				
			},
			show: function(dataId) {
				if (!jQuery("#calcPanel").length) {
					jQuery("body").append("<div id='calcPanel' style='display:none;position: relative'></div>");
					jQuery("#calcPanel").load(Bace.handleUrlParam('/platform/dataview/format/calc-page'), function() {
						CalcUtil.view.show(dataId);
						CalcUtil.control.init();
						CalcUtil.view.bindEvent();
						Bace.autoScroll(jQuery("#calcPanel .countarea"));
					})
				} else {
					CalcUtil.view.show(dataId);
					CalcUtil.control.refresh();
				}
			},
			refresh:function(){
				$("#calcName").val('');
				$("#calcGroup").val('');
				
				$(".inputlabel").empty().hide();
				$("#numInput").show().val('');
				$("#dotInput").val(0);
				$(".countarea .countdd").empty();
				//将treeselect下选中的节点取消掉
				var treeObj = $.fn.zTree.getZTreeObj(treeId);
				if(treeObj){
					var nodes = treeObj.getCheckedNodes(true);
					for (var i=0, l=nodes.length; i < l; i++) {
						treeObj.checkNode(nodes[i], false, false);
					}
				}
			},
			//获取指标分组
			getGroup:function(){
				
				$("#calcGroup").treeselect({
					zindex:"99999",
					height: 200,
					searchAjaxParam: "groupName",
					chkStyle: "radio",
					width: (jQuery('#calcGroup').width() + 21),
					url: Bace.handleUrlParam('/platform/resmanage/data/data-query-group'),
					onCheck:function(){
						treeId = this.id;
						$("#div" + this.id).fadeOut("fast");
					}
				});
			},
			//初始化拖拽事件
			intialDroppable:function(){
				$(".countarea").droppable({
					drop:function(event,ui){
						var $helper = ui.helper;
						var attrId = $helper.attr("data-attrId") ||"";
						var attrName = $helper.attr("data-attrName")||"";
						var attrType = $helper.attr("data-attrType")||"";
						var attrClass = $helper.attr("data-attrClass")||"";
						var fieldName = $helper.attr("data-fieldName")||"";
						var filterType = $helper.attr("data-filterType")||"";
						var dimId = $helper.attr("data-dimId")||"";
						var dataId = $helper.attr("data-dataId")||"";
						var diyRelation = $helper.attr("data-diyRelation")||"";

						//如果不是从指标库拖拽过来，则中断逻辑(头部拖拽的helper有attr-helper这个class)
						if (!$helper.hasClass("attr-helper")) {
							return;
						}
						//日期和字符型指标不可做计算指标用
						if(attrType == CalcUtil.Consts.ATTRTYPE.TIME ||
								attrType == CalcUtil.Consts.ATTRTYPE.CHAR){
							$.dialog({
								lock: true,
								content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">日期或字符型指标不可做计算指标！</div>',
								icon: 'warning',
								ok: true
							});
							return;
						}
						//若是计算指标或者日期格式化指标不可做计算指标用
						if(attrClass == CalcUtil.Consts.ATTRCLASS.REPORT || 
								attrClass == CalcUtil.Consts.ATTRCLASS.FORMART){
								$.dialog({
								    lock: true,
								    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">计算不可再做计算指标！</div>',
								    icon: 'warning',
								    ok: true
								});
								return;
						}
					    
						//$this表示拖拽区域
						var $this = $(this).find(".countdd");
						var temp = CalcUtil.Consts.ATTR;
						//如果拖拽过来的数字是0
						if(attrId == 0){
							temp = 0;
						}
						var attrHtml = "<div exp='"+temp+"' data-attrId='"+attrId+"' data-fieldName='"+fieldName+"' data-attrType='"+attrType+"' data-filterType='"+filterType+"' data-dimId='"+dimId+"' data-dataId='"+dataId+"' class='label'>"
			               +"<div class ='text'><span class='name'>"+attrName+"</span></div><div class='close'><i class='fa fa-close'></i></div></div>";
						//如果不是第一个元素 前面加上虚线
						if($this.children().length > 0){
							attrHtml = "<i class='dashline'>--</i>" + attrHtml;
						}
						    
						$this.append(attrHtml);
					}
				})
			},
			//输入数字的拖拽事件
			intialInputDrag:function(){
				$(".inputlabel").draggable({
					delay: 10,
					cursorAt: {
						top: 1,
						left: 56
					},
					addClasses: false,
					//暂时写死
					helper: function(event) {
						var attrId = $(this).text();
						
						return jQuery('<div>', {
							'style': 'z-index:9999999',
							'data-attrid': attrId,
							'data-attrName': attrId,
							'data-fieldName': attrId,
							'html': attrId
						}).addClass('attr-helper').appendTo('body');
					}
				});
			}
			
		}
		CalcUtil.view = {
			show:function(dataId){
				$.dialog({
					id:'calcDialog',
					title:'计算指标',
					padding:'0',
					width:'622px',
					height:'300px',
					lock: false,
					content:jQuery("#calcPanel")[0],
					ok: function () {
						if(!CalcUtil.view.saveExpression(dataId)){
							return false;
						};
						//指标名称
						var calcName = $("#calcName").val();
						//指标分组
						var groupId = $("#calcGroup").attr("truevalue");
						//指标精度
						var colScale = $("#dotInput").val();
						
						//计算表达式
						var dbConnectAttrRule = "";
						var attrRule = "";
						var viewAttrRule = "";
						$("#exparea *[exp]").each(function(){
							if($(this).attr("exp") == CalcUtil.Consts.ATTR){
								attrRule += $(this).attr("data-attrId");
								dbConnectAttrRule += $(this).attr("data-fieldname");
								viewAttrRule += $(this).attr("data-dataId") + "." + $(this).attr("data-fieldname");;
							}else {
								attrRule += $(this).attr("exp");
								dbConnectAttrRule += $(this).attr("exp");
								viewAttrRule += $(this).attr("exp");
							}
						})
						
						var param ={
							    attrRule : encodeURIComponent(attrRule),
								dbConnectAttrRule : encodeURIComponent(dbConnectAttrRule),
							    viewAttrRule : encodeURIComponent(viewAttrRule),
								dataId : dataId,
								dataType: Box.main.dataType,
								calcName:encodeURIComponent(calcName),
						        groupId:groupId||"",
						        attrType:1,
						        attrClass:2,
						        fieldName:"",
						        columnScale:colScale,
						        filterType:2
						}
						$.dialog.confirm("您确定保存该计算指标吗？", function () {
                            $.ajax({
                                url: Bace.handleUrlParam("/platform/dataview/format/save-calc-info"),
                                data:param,
                                success: function (resp) {
                                	if(resp.resFlag == "success"){
                                		$.dialog.alert('新增计算指标成功');
                                		Box.AttrTree.viewInit();
                                		$.dialog.closeAll('calcDialog');
                                	}else {
                                		$.dialog.alert('新增计算指标失败');
                                	}
                                },
                                error: function (req) {
                                    $.dialog.alert('系统异常，新增计算指标失败，请稍后重试');
                                    return false;
                                }
                            })
                        });
						return false;
				    },
				    okVal:'保存',
				    cancelVal: '关闭',
				    cancel: function(){
				    	return true;
				    }
				});
			},
			//验证表达式是否正确
			checkExpression:function(string){
				// 剔除空白符  
		        string = $.trim(string);  
		          
		        // 错误情况，空字符串  
		        if("" === string){  
		            return false;  
		        }  
		          
		        // 错误情况，运算符连续  
		        if( /[\+\-\*\/]{2,}/.test(string) ){  
		            return false;  
		        }  
		          
		        // 错误情况，括号不配对  
		        if(string.indexOf('(') != -1 || string.indexOf(')') != -1){
		        	var stack = [];  
		            for(var i = 0, item; i < string.length; i++){  
		                item = string.charAt(i);  
		                if('(' === item){  
		                    stack.push('(');  
		                }else if(')' === item){  
		                    if(stack.length > 0){  
		                        stack.pop();  
		                    }else{  
		                        return false;  
		                    }  
		                }  
		            }  
		            if(0 !== stack.length){  
		                return false;  
		            }  
		        }   
		         
		        // 错误情况，(后面是运算符   
		        if(/\([\+\-\*\/]/.test(string)){  
		            return false;  
		        }  
		          
		        // 错误情况，)前面是运算符  
		        if(/[\+\-\*\/]\)/.test(string)){  
		            return false;  
		        }  
		        // 错误情况，(前面不是运算符  
		        if(/[^\+\-\*\/]\(/.test(string)){  
		            return false;  
		        }  
		        
		        // 错误情况，()  
		        if(/\(\)/.test(string)){  
		            return false;  
		        }
		        //连续的指标
		        if(string.indexOf(CalcUtil.Consts.ATTR_2) != -1 || string.indexOf(CalcUtil.Consts.ATTR + "0") != -1){  
		            return false;  
		        }
		        if(string == '+' || string == '-' || string == '*' || string == '/'){
		        	return false;
		        }
		        //以运算符开头
		        if(string.substring(0,1) == '+' || string.substring(0,1) == '-' || string.substring(0,1) == '*' || string.substring(0,1) == '/'){
		        	return false;
		        }
		        //以运算符结尾
		        if(string.substring(string.length-1) == '+' || string.substring(string.length-1) == '-' || string.substring(string.length-1) == '*' || string.substring(string.length-1) == '/'){
		        	return false;
		        }
		        //除数为零
		        if(string.indexOf("/0") != -1){
		        	return false;
		        }
		        return true;
			
			},
			bindHover:function(){
				//避免多次绑定 先销毁
				jQuery("#exparea a").poshytip("destroy");
				//添加hover事件
				jQuery("#exparea a").poshytip({
					content: function() {
						     var expId = $(this).attr("expid");
						     var outHTML= "<div expid='"+expId+"'class='downboxl'><ul><li>+</li><li>-</li><li>×</li><li>÷</li><li>(</li><li>)</li><li class='deleteicon'></li></ul></div>";
						     return outHTML;
					         },
					className: 'tip-yellowsimple', 
					alignTo: 'target',
					alignY: 'bottom',
					alignX: 'center',
					offsetY: 2,
					offsetX: 80,
					showTimeout: 200,
					keepInViewport: false,
					show:function(){
						CalcUtil.view.bindExpClick()
					}
				});
			},
			bindEvent:function(){
				//为运算符添加事件
				jQuery(".countinput .countdd").on("click",'a',function(){
					//为运算符添加ID，方便定位
					var $this = $(this);
					     $this.attr("expid","exp"+new Date().getTime());
					var exHtml = $this.outerHTML();
					if($(".countarea .countdd").children().length>0){
						$(".countarea .countdd").append("<i class='dashline'>--</i>"+exHtml);
						//如果是第一个运算符，不需添加虚线
					}else {
						$(".countarea .countdd").append(exHtml);
					}
					CalcUtil.view.bindHover();
				});
//				
				//删除拖拽区域的指标
				jQuery(".countarea .countdd").on('click', '.close', function(event) {
					var $label = jQuery(this).parents('.label');
					//上一个兄弟节点 虚线
					var $pre = $label.prev();
					   $label.remove();
					   $pre.remove();
				});
				//输入数字区域的blur事件
				$("#numInput").on("blur keyup",function(){
					var $this = $(this);
					var labelName = $this.val();
					if ((event.keyCode == '13' || event.type === 'blur') && labelName) {
						//验证控件值的合法性
						var isError = jQuery('#numInput').validationEngine('validate');
						if(isError){
							return;
						}
						$this.hide();
						$(".inputlabel").show().text(labelName);
					}
					
				});
				//双击未选区域标签，修改
				jQuery(".inputlabel").on('dblclick',function(){
					var $this = $(this);
					var val = $this.text();
					$this.hide();
					$("#numInput").show().val(val);
					Bace.stopBubble(event)
				});
			},
			bindExpClick:function(){
				//切换运算符
				$(".downboxl li").on("click",function(){
				    var $li =$(this);
				    var expId = $li.parent().parent().attr("expid");
				    //触发提示的标签a
				    var $a = $("#exparea").find("a[expid='"+expId+"']");
				    var $pre = $a.prev();
				    //如果是删除按钮
				    if($li.hasClass("deleteicon")){
				    	$a.remove();
				    	if($pre.hasClass("dashline")){
				    		$pre.remove();
				    	}
				    	var $first = $("#exparea>:first");
				    	//如果是第一个  需要把后面的虚线去掉
				    	if($first.hasClass("dashline")){
				    		$first.remove();
				    	}
				    }else {
				    	var val = $li.html();
				    	$a.attr("exp",val);
				    	$a.html(val);
				    }
				});
			},
			//保存计算指标的表达式
			saveExpression:function(dataId){
                var exp = "";
				$("#exparea *[exp]").each(function(){
					exp += $(this).attr("exp");
				})
				//验证控件值的合法性
				var isPass = jQuery('.calc-control').validationEngine('validate');
				if (!isPass) {
					return false;
				}
				//验证计算表达式是否符合规则
				if(!CalcUtil.view.checkExpression(exp)){
					$.dialog({
					    lock: true,
					    content: '<div style="color:#444;font-weight:bolder;margin-top:-10px">计算表达式不符合运算规则！</div>',
					    icon: 'warning',
					    ok: true
					});
					return false;
				}
				return true;
			}
		}
		return CalcUtil.control;
	})