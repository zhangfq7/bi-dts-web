define(['bace', 'EBuilder', 'view/box', 'view/layout', 'underscore'],
	function(Bace, EBuilder, Box, Layout, _) {
		var Property = {
			currentPlugin: null
		};

		Property.module = {

			//选中的标签页
			selected: 0,

			//当前打开的面板的容器配置
			option: null,

			//属性面板是否初始化
			isInit: false,

			//属性面板的状态
			state: "close"
		};

		Property.control = {
			init: function(option) {

				Box.Property.dataStart = Property.view.dataStart;
				Box.Property.apply  = Property.control.apply;
				Box.Property.close = Property.control.close;
				Box.Property.isMyProperty  = Property.control.isMyProperty;
				//挂载显示提示框方法
				Box.Property.showTip = Property.view.showTip;
				//挂载隐藏提示框方法
				Box.Property.hideTip = Property.view.hideTip;


				//插件集合
				var plugins = Box.Widgets.plugins;
				//萃取出text以外的组件，加载property面板 gaoya 20161104
				var pluginsChart=_.pick(plugins,"echarts","table","indicator");

				//各组件设计面板集合
				var desginPanels = [];

				//根据当前的插件集开始构建属性面板
				var $dataProperty=$("#data-property");
				_.each(pluginsChart, function(obj) {

					$dataProperty.append(obj.propPanel.data.html||"");
					
					//执行每个插件的渲染数据面板的方法
					obj.initDataPanel();

					desginPanels.push(obj.initDesginPanel.config);
				});

				//构建设计面板
				Property.view.buildDesgin(desginPanels);
				//绑定面板按钮事件
				for (var event in Property.view.bindEvent) {
					Property.view.bindEvent[event]();
				}

				//构建tab面板
				var $propertyTabs = jQuery("#propertyTabs");

				$propertyTabs.tabs({
					active: Property.module.selected,
					activate:Property.currentPlugin.propPanel.tabsChange
				});

				//标识已初始化

				Property.module.isInit = true;

			},
			open: function(option) {
				//展开默认选中数据面板
				var chartClassType = option.chartType;
				var chartChild = option.chartChild;
				if (['pie', 'bar','barMix', 'line', 'radar', 'funnel', 'gauge', 'map', 'scatter','heatmap','treemap','effectScatter','heatmap1'].indexOf(chartClassType) > -1) {
					Property.currentPlugin = Box.Widgets.plugins['echarts'];
				} else {
					Property.currentPlugin = Box.Widgets.plugins[chartClassType];
				}


				//如果没有初始化先初始化
				if (!Property.module.isInit) {
					Property.control.init(option);
				}

				//指标卡设计面板配置项改变
                if(chartClassType=="indicator"){
                    $(".list:first-child",".propPanel").css("display","none");
                }else{
                    $(".list:first-child",".propPanel").css("display","block");
                }

				jQuery("#propertyTabs").tabs("option", "active", 0);
				//隐藏所有数据面板
				$("#data-property>div").hide();

				//显示对应插件的数据面板
				jQuery("#data-property>div[propType='" + Property.currentPlugin.type + "']").show();

				var $propPanel = jQuery("#chart-property>.propPanel");
				//不是标题背景的面板全部隐藏
				$("div.list[propType!='borderBg']", $propPanel).hide();
				//显示对应插件的设计面板
				_.each(_.keys(Property.currentPlugin.initDesginPanel.config), function(key) {
					$("div.list[propType='" + key + "']", $propPanel).show();
				});

				//不同指标卡的设计面板展示不同的字体大小选择 gaoya 20170508
				var $fontSizeItems = $("div.list[propType='fontSize']").find(".items").show();
				$.each($fontSizeItems,function(i,e){
					if(chartChild == "single" && i>1){
						$(e).hide();
					}else if(chartChild == "two" && i>3){
						$(e).hide();
					}else if(chartChild == "three" && i>5){
						$(e).hide();
					}
				});

				//开始渲染数据和设计面板
				Property.currentPlugin.propPanel.openRender(option);

				//获得设计面板配置项
				var designPanel = option.config.designPanel;

				//如果为空，则使用初始配置项来渲染
				if (Object.keys(designPanel).length > 0) {
					Property.view.dataStart(designPanel);
				}

				Bace.autoScroll(jQuery("#chart-property"));

				Layout.togglePropPanel("open");
				Property.module.option = option;
				Property.module.state = "open";
                //穿透主题加载
                sessionStorage.removeItem("goalChoose");
                sessionStorage.goalChoose="";
                if(option.goalChoose){
                    sessionStorage.goalChoose=option.goalChoose;
                    Property.control.penetrateDraw(JSON.parse(sessionStorage.goalChoose));
                }else{
                	//清除若穿透为空，选择上个图表穿透主题问题
					$(".penetrate .list").remove();
				}
                if("indicator"==option.chartType){
                    $(".penetrate").hide();
                }else{
                    $(".penetrate").show();
                }
                //颜色图例构建

				if(!!$("#"+Property.module.option.el).data('colorTemp')){
					Property.module.option.colorTemp=$("#"+Property.module.option.el).data('colorTemp');
					Property.module.option.legendData=$("#"+Property.module.option.el).data('legendData');
					for(var i=0;i<Property.module.option.colorTemp.length;i++){
						$("[proptype=colorSet] .propContanier").EBuilder('buildColor',Property.module.option.legendData[i],Property.module.option.colorTemp[i]);
					}
				}
				$(".propContanier").on("change","#title-textStyle-color",function(){
					var colorChange=[];
					$("[proptype=colorSet] .items").each(function(){
						colorChange.push($(this).find("input").val());
					});
					$("body").EBuilder('echartsColor',Property.module.option.el,colorChange);
                    Property.module.option.colorTemp=colorChange;
					$("#"+Property.module.option.el).data('colorTemp',colorChange);
					Property.module.option.legendData=$("#"+Property.module.option.el).data('legendData');
				});
                //背景颜色保存

			},
            //根据选择的穿透主题，重新渲染面板。默认会取上一个面板应用的目标仪表板
            penetrateDraw: function(data){
            if(data){
                $(".penetrate .list").remove();
                var len=data.length;
                for(var i=0;i<len;i++){
                    $("#addPenetrate").before( '<div proptype="penetrate" class="list close" style="display:block">'+
                        '<div class="propTitle">'+
                        '<i class="fa fa-caret-right"></i>'+
                        '<i class="fa fa-caret-down"></i>'+
                        '<div class="text">穿透主题</div>'+
                        '<div  class="delAttrDim delPenetrate" style="display: block" title="移除该主题"></div>'+
                        '</div>'+
                        '<div class="propContanier" style="display: none;">'+
                        '<div class="items">'+
                        '<div class="label">主标题:</div>'+
                        '<div class="config">'+
                        '<input class="theme-text" style="width:143px" class="input" type="text" value='+data[i].reportName+'>'+
                        '</div>'+
                        '</div>'+
                        '<div class="items">'+
                        '<div class="label">目标仪表板:</div>'+
                        '<div class="config">'+
                        '<input id="panelId'+i+'" class="panel-text" style="width:120px" class="input" type="text" code='+data[i].reportId+' value='+data[i].reportGoal+' placeholder="请选择" readonly >'+
                        '</div>'+
                        '</div>'+
                        '</div>');
                }
            }
        },
			close: function(flag) {
				if(Property.module.state == "close"){
					return true;
				}
				//重置固定按钮样式
				$("#propertyPanel .fixedProperty:eq(0)").removeClass('active');
				if(flag === true){
					Layout.togglePropPanel('close');
					Property.module.state = "close";
					return true;
				}else{
					if(Property.currentPlugin){
						return Property.currentPlugin.propPanel.close();
					}
				}
			},
			//widgets调用
			toggle:function(option){
				$("[proptype=colorSet] .propContanier").empty();//清空受影响的图例颜色
				if(Property.module.state == "close"){
					Property.control.open(option);
				}else{
					//关闭操作
					var isPass = Property.control.close();
					if(isPass === false){
						return;
					}
					//如果关闭的对象不是当前面板的对象
					//则将面板再打开
					if(option.el != Property.module.option.el){
						setTimeout(function(){
							Property.control.open(option);
						},300)
					}
				}
			},
			apply: function() {
				if(Property.control.checkWidgetState($("#"+Property.module.option.el)) == 'loading'){
					Property.view.showTip({
						_id:"c-load",
						msg: '<br/>图形正在生成，请稍候应用！',
						button: '<div class="btn changeChart" style="width: 196px;">确定</div>'
					});
					$("#c-load .changeChart").click(function(){
						Property.view.hideTip("c-load");
					});
					return;
				}

				//清空下钻参数,隐藏下钻面包屑 shaojs 20160817
				var $container = $("#"+Property.module.option.el);
				$container.data("drillSettingList",[]);
				$container.find(".breadcrumbs").hide();

                //清除关联痕迹 shaojs 20160921
                $container.find(".chainInfo").empty().hide();
                $container.data("isLinked",false);

                //清除表格菜单数据 shaojs 20161208
                $container.data("menuData",null);
				//调用各自插件的应用方法
				Property.currentPlugin.apply(Property.module.option);
			},
			//传入的容器编码的面板是否打开
			isMyProperty:function(el){
				//面板是打开的
				//传入的容器编码和当前容器也是一致，返回true
				if(!Property.module.close && el == Property.module.option.el){
					return true;
				}
				return false;
			},
			checkWidgetState:function($el){
				return $el.data("isLoading")?'loading':'complete';
			}
		};
		Property.view = {
			buildDesgin: function(configs) {
				var $propPanel = jQuery("#chart-property>.propPanel");

				var _public = {
					borderBg:{
						"title":"线框 <span class='circle'>●</span> 背景 <span class='circle'>●</span> 主题",
						items:[
							{id:"bi-style-background",   lable:"背景:",  type:"color",position:"bottom left-30", value:"rgba(255,255,255,0.6)"},
							{id:"bi-style-border-color", lable:"边框色:",type:"color",position:"bottom left-140", value:"1px solid rgba(170, 170, 170,.99)","style":"position:absolute;top:-3px;right:2px"},
							{id:"bi-style-border-shadow",lable:"投影:",  type:"switchbutton", value:false },
							{id:"bi-style-border-radius",lable:"圆角:",  type:"switchbutton", value:false,"style":"position:absolute;top:30px;right:2px" },
							{id:"bi-style-theme",lable:"主题设置:",type:"select",width:'110px',selectHTML:"<option selected='true' value='macarons'>默认</option><option value='infographic'>五彩斑斓</option><option value='shine'>七色时光</option><option value='dark'>暗夜精灵</option><option value='roma'>致青春</option><option value='vintage'>经典</option>"},
						]
					}
				};
				
				//将公共配置项放入第一的位置
                configs.unshift(_public);

				//防止引用类型，复制对象
				var _config = _.extend.apply({},configs);
				_.each(_config,function(obj,key){

					$("<div>",{
						propType:key,
						//"style":obj.style||'',
						"class":"list "+(obj.state||'') +" "+ (obj["className"]||'')
					}).append(
						//构建title
						function(){
							if(obj.title){
									return	$("<div>",{
									"class":"propTitle"
									}).append(
										$("<i>",{"class":"fa fa-caret-right"}),
										$("<i>",{"class":"fa fa-caret-down"}),
										$("<div>",{
											"class":"text",
											html:obj.title
										})
									)
							}
						}(),
						//构建contanier
						$("<div>",{
							"class":"propContanier"
						}).append(
							_.map(obj.items||[],function(item){
								return jQuery("<div>",{
										"class":"items",
										"style":item.style
										}).append(
											$("<div>",{"class":"label",html:item.lable}),
											$("<div>",{
												"class":"config",
											}).append(function(){
												//支持自定义html
												if(item.type == 'html'){
													return item.html;
												}else{
													return _buildProp(item);
												}
											}())
										)
								})
						)
					).appendTo($propPanel);
				});
                var themeNum=0;
				_penetrate();
				//穿透主题菜单
				function _penetrate(){
					var theme=function(themeN){

                        themeNum++;
					   return  '<div proptype="penetrate" class="list close" style="display:block">'+
						'<div class="propTitle">'+
						'<i class="fa fa-caret-right"></i>'+
						'<i class="fa fa-caret-down"></i>'+
						'<div class="text">穿透主题 </div>'+
						'<div  class="delAttrDim delPenetrate" style="display: block" title="移除该主题"></div>'+
						'</div>'+
						'<div class="propContanier" style="display: none;">'+
						'<div class="items">'+
						'<div class="label">主标题:</div>'+
						'<div class="config">'+
						'<input class="theme-text" style="width:143px" class="input" type="text">'+
						'</div>'+
						'</div>'+
						'<div class="items">'+
						'<div class="label">目标仪表板:</div>'+
						'<div class="config">'+
						'<input id="panelId'+themeNum+'" class="panel-text" style="width:120px" class="input" type="text" placeholder="请选择" readonly>'+
						'</div>'+
						'</div>'+
						'</div>';
					}
					$propPanel.append('<div style="width:100%" class="penetrate">' +
										'<div style="text-align: center;font-size:14px;width: 100%">穿透主题设置</div>'+theme(themeNum)+'</div>'+
										'<div id="addPenetrate" style="height:68px;line-height: 68px;font-size: 14px;color: #ccc;text-align: center">新增穿透主题</div>');
					$('.penetrate').on('click','.delPenetrate',function(event){
					    var thisReportId=$(this).parent().next().find(".panel-text").attr("code");
                        var temp=[];
                        if(sessionStorage.goalChoose){
                           temp= JSON.parse(sessionStorage.goalChoose);
                        }
                        var tempLen=temp.length;
                        var delFlag=-1;
                        for(var i=0;i<tempLen;i++){
                            if(temp[i].reportId==thisReportId){
                                delFlag=i;
                            }
                        }
                        if(delFlag!=-1){
                            temp.splice(delFlag,1);
                        }
                        sessionStorage.removeItem("goalChoose");
                        sessionStorage.goalChoose=JSON.stringify(temp);
						$(this).parent().parent().remove();
                        event.stopPropagation();
					});
                    $("#addPenetrate").click(function(){
                        $(this).before(theme(themeNum));
                    });
                    $(".penetrate").on('click','.propTitle',function(){
                        $(this).siblings().toggle(500);
                        $(this).children(".fa").toggle();
                    });

                    $(".penetrate").on('click','.panel-text',function(){
                    	sessionStorage.panelId="";
                        sessionStorage.panelId=$(this).attr('id');
                        $("#goalPanel").attr("src",resPath+"/platform/myreport/manage/theme-panel/manage_report?new="+Math.random());
						setTimeout( '$("#goalPanel").show()',500);
                    });
                    setTimeout(function(){ $(".penetrate>div").show();$(".penetrate .propContanier").eq(0).show()},500);

				}

				function _buildProp(item){
					var type = item.type;
					if(type == 'color'){
						return '<div class="chooseTool">'+
									'<div class="choose-color"></div>'+
									'<input id="'+item.id+'" collect-special="color" data-position="'+item.position+'" data-format="rgb"  type="hidden" value="'+item.value+'" />'+
									'<div class="chooseToolDown">'+
										'<i class="fa fa-caret-down"></i>'+
									'</div>' +
								'</div>';
					}else if(type== 'select'){
						return '<select id="'+item.id+'" collect-special="select" style="width:'+item.width+'">'+item.selectHTML+'</select>';
					}else if(type== 'switchbutton'){
						return '<input id="'+item.id+'" '+(item.value?"checked":"")+'  collect-special="checkbox" type="checkbox" class="switchbutton" style="width: 48px;" />'
					}else if(type== 'input'){
						return '<input type="text" id="'+item.id+'" style="width:'+(item.width||"143px")+'" class="input" />';
					}else if(type== 'spaceInput'){
						return '<input class="spaceInput" data-max="'+item.max+'" data-max="'+item.min+'" collect-special="int" id="'+item.id+'" type="text"  style="width:'+item.width+'" value="'+(item.value||0)+'"/>';
					}else if(type== 'slider'){
						return '<div id="'+item.id+'"data-value="'+item.value+'" data-max="'+item.max+'" data-min="'+item.min+'" collect-special="slider"  class="slider" style="width:'+item.width+'"></div>'
					}else if(type == 'selectcolor'){
					    return '<div class="chooseTool chooseAdd">'+
                                    '<div class="indicator-color">' +
										// '<input id="'+item.id+'" collect-special="indicatorColor" data-position="'+item.position+'" data-format="rgb"  type="hidden" value="'+item.value+'" />' +
										'<div  id="'+item.id+'" data-value="'+item.value+'" collect-special="selectcolor" class="colorContainer"'+'><span></span><b></b></div>' +
										'<div class="chooseToolDown"><i class="fa fa-caret-down"></i></div>' +
									'</div>'+
                                    '<ul>' +
                                        '<li><span>红色</span><b></b></li>' +
                                        '<li><span>蓝绿色</span><b></b></li>' +
                                        '<li><span>蓝色</span><b></b></li>' +
                                        '<li><span>黄色</span><b></b></li>' +
                                        '<li><span>橘色</span><b></b></li>' +
                                        '<li><span>紫色</span><b></b></li>' +
                                        '<li><span>玫红色</span><b></b></li>' +
                                        '<li><span>绿色</span><b></b></li>' +
                                    '</ul>'+
                                '</div>'
                    }
				}

				function installPropWidgets(){

					//颜色选择器触发事件
					$(".chooseTool",$propPanel).click(function() {
						$("input", this).minicolors('show');
					})

					//颜色选择器
					$('.chooseTool input[collect-special="color"]', $propPanel).minicolors({
						opacity: true,
						change: function(value) {
							var $this = $(this);
							var id = $this.attr("id");
							var value = $this.val();
							timer.start($this,id,value);
						},
						colorSelectors: {
							'#777777': '#777777',
							'#337ab7': '#337ab7',
							'#5cb85c': '#5cb85c',
							'#5bc0de': '#5bc0de',
							'#f0ad4e': '#f0ad4e',
							'#d9534f': '#d9534f'
						}
					});

					//switchbutton
					$('input[collect-special="checkbox"]', $propPanel).switchbutton({
						width: '50px',
						classes: 'ui-switchbutton-thin',
						checkedLabel: 'ON',
						uncheckedLabel: 'OFF'
					}).change(function() {
						var $this = $(this);
						var id = $this.attr("id");
						var repay = $this.attr("repay");
						if(repay != "repay"){
							var value = $this.prop('checked');
							timer.start($this,id,value);
						}else{
							$this.attr("repay","0");
						}
					});

					//下拉选择框
					$("select",$propPanel).chosen().change(function(){
						var $this = $(this);
						var id = $this.attr("id");
						var value = $this.val();
						timer.start($this,id,value);
					});

					//数字输入框
					$(".spaceInput",$propPanel).each(function(){
						var $this = jQuery(this);
						var min = $this.attr('data-min')||0;
						var max = $this.attr('data-max')||100;

						$this.spinner({
							min:parseInt(min),
							max:parseInt(max),
							stop: function( event, ui ) {
								var $this = $(this);
								var id = $this.attr("id");
								var value = $this.val();
								timer.start($this,id,value);
							}
						})
					})

					//滑动块
					$( ".slider",$propPanel).each(function(){
						var $this = jQuery(this);
						var min = $this.attr('data-min')||0;
						var max = $this.attr('data-max')||100;
						var step = $this.attr('data-step')||1;
						var value = $this.attr('data-value')||1;
						$this.slider({
							min:parseInt(min) ,
							max:parseInt(max),
							step:parseInt(step),
							value:parseInt(value),
							slide: function( event, ui ) {
								jQuery($this).parent().siblings(".label").find("span").text(ui.value);
							},
							stop:function(event, ui){
								var $this = $(this);
								var id = $this.attr("id");
								var value = ui.value;
								timer.start($this,id,value);
							}
						});
					});

					//文本框
					jQuery("input.input",$propPanel).bind("input",function(){
						var $this = $(this);
						var id = $this.attr("id");
						var value = $this.val().replace('\\n','\n');
						timer.start($this,id,value);
					});

                    //指标卡背景色配置
                    $(".chooseAdd",$propPanel).on('click','.indicator-color',function(){
                    	$('.indicator-color').css("border-bottom","none");
						$(".chooseTool ul").css("display","block");
					});
					$(".chooseTool ul").on("click","li",function(){
						var $this=$(this);
						var $colorContainer=$(".colorContainer");
						var id = $colorContainer.attr("id");
						var $bgColor=$this.find("b").css("background-color");
						var text=$this.find("span").html();
						var value=text+"|"+$bgColor;
						$(".colorContainer").html($this.html());
						$(".colorContainer").css("border-bottom","1px solid #ddd").find("b").css("background",$bgColor);
						$(".chooseTool ul").css("display","none");
						timer.start($colorContainer,id,value);
					})

				}
				installPropWidgets();

				window.timer = new function() {
					var time = {};
					return {
						start:function($this,id,value){
							if(time[id]){
								clearTimeout(time[id]);
							}
							//开始定时器
							var applyTime = setTimeout(function(){
								var prop = {};
								var propArray = id.split('-');
								if(id.indexOf('0')>-1){
									//删除第一个元素
									var newPropArray =  _.rest(propArray,2);
									prop[propArray[0]]= [eval('(' +"{"+ newPropArray.join(':{') +":0"+( new Array(newPropArray.length +1).join( '}'))   + ')')];
								}else{
									prop = eval('(' +"{"+ propArray.join(':{') +":0"+( new Array(propArray.length +1).join( '}'))   + ')');
								}
								Property.view.dataStart('collect',prop);
								//如果是公共元素，则自己消化
								var $el = $("#"+Property.module.option.el);
								if(id == "bi-style-background"){
									$el.css("background",value);
									$.extend(true,$el.data("option").config.designPanel, prop);
								}else if(id=="bi-style-border-color"){
									$el.css("border-color",value);
									$.extend(true,$el.data("option").config.designPanel, prop);
								}else if(id=="bi-style-border-shadow"){
									if(value === false){
										$el.css("box-shadow","none");
									}else{
										var borderColor = $el.css("border-color");
										if(borderColor.indexOf('rgb') > -1){
											$el.css("box-shadow", "0 2px 3px rgba("+ borderColor.match(/\((.+?)\)/g)[0].replace(/\(|\)/g,"")+",.4)" );
										}else if(borderColor.indexOf('rgba') > -1){
											$el.css("box-shadow","0 2px 3px "+ $el.css("border-color").replace(/(\,[^,]+\))/g,",.4)"));
										}
									}
									$.extend(true,$el.data("option").config.designPanel, prop);
								}else if(id=="bi-style-border-radius"){
									value = value? "3px":"";
									$el.css("border-radius",value);
									$.extend(true,$el.data("option").config.designPanel, prop);
								}else{
									//不是公共元素则调用插件的属性change方法
									Property.currentPlugin.initDesginPanel.change.call($this,$el,id,value,prop);
								}

							},250);
							time[id] = applyTime;
						}
					}
				}
			},
			dataStart: function(handle,prop){
				if(handle === 'collect'){
					traverse(prop,collect,'')
				}else{
					traverse(handle,repay,'');
				}
				//检索数据
				function traverse(obj,func,parentKey){
					for(var i in obj){
						var _obj = obj[i];
						if(typeof(_obj) == "object") {
							traverse(_obj, func,parentKey?parentKey +'-'+ i:i);
						}else{
							func.apply(obj, [i, _obj,parentKey]);
						}
					}
				}
				//收集器
				function collect(key,_value,parentKey){
					var $selector = parentKey? parentKey + '-' +key:key;
					var $this = jQuery("#"+$selector);
					if(!$this.outerHTML()){
						this[key] = _value;
						return;
					}
					var special = $this.attr("collect-special"),
						value = '';
					switch (special){
						case 'int':
							value = parseInt($this.val())||0;
							break;
						case 'color':
							value = $this.val();
							break;
						case 'checkbox':
							value = $this.prop('checked');
							break;
						case 'slider':
							value =  $this.slider('option','value');
							break;
						case 'border':
							value = $this.data("border");
							break;
						case 'selectcolor':
							value=$this.find("span").html()+"|"+$this.find("b").css("background-color");
							break;
						default:
							//过滤特殊字符
							//支持\n换行
							value = ($this.val()||"").replace('\\n','\n');
							break;
						}
					this[key] = value;
				}
				//渲染器
				function repay(key,value,parentKey){
					var $selector = parentKey? parentKey + '-' +key:key;
					var $this = jQuery("#"+$selector);
					var special = $this.attr("collect-special");
					switch (special){
						case 'int':
							$this.spinner( "value", value);
							break;
						case 'color':
							$this.minicolors('value', {
								color: value,
							});
							break;
						case 'checkbox':
							$this.prop('checked',value).attr("repay","repay").change();
							break;
						case 'slider':
							$this.slider('option','value',value);
							$this.parent().siblings(".label").find("span").text(value);
							break;
						case 'border':
							$this.data("border",value);
							break;
						case 'select':
							$this.val(value).trigger("chosen:updated");
							break;
						case 'selectcolor':
							$this.find("b").css({"background-color":value.split("|")[1]});
							$this.find("span").html(value.split("|")[0]);
							break;
						default:
							$this.val(value);
							break;
						}
				}
			},
			showTip:function(tipData){
				tipData.titleShow = tipData.titleShow||true;
				var confirm = '<div id="${_id}" failType="${failType}" class="bi-confirm ${className}">' + '	<div class="confrim-text" style="font-size: 14px;letter-spacing: 1px;">' + '  {{if titleShow==true}} <span style="font-size: 26px;">提示 </span>{{/if}}<br/>{{html msg}}' + '	</div>' + '	<div class="btn-group" style="top:initial;bottom: 17px;">{{html button}}' + '	</div>' + '</div>';
				$.tmpl(confirm, tipData).appendTo(jQuery("#propertyPanel"));
			},
			hideTip:function(id){
				jQuery("#"+id).remove();
			},
			bindEvent: {
				applyPropertyToContanier: function() {

					//绑定属性框【固定】按钮
					//这个功能暂时屏蔽#6960
					jQuery(".fixedProperty").on('click', function() {
						$(this).addClass('active');
						myLayout.center.children.layout1.center.children.layout1.open("west");
					});

					//绑定属性框【关闭】事件
					jQuery(".closeProperty").on('click', function() {
						Property.control.close();
					});

					//绑定属性框【应用】按钮
					jQuery(".applyProperty").on('click', function() {
						var tempChoose=[];
						$(".penetrate .list").each(function(){
							if($(this).find(".panel-text").attr("code")!=""&&typeof($(this).find(".panel-text").attr("code"))!="undefined"){
								var  tempObj={};
								tempObj.reportId=$(this).find(".panel-text").attr("code");
								tempObj.reportGoal=$(this).find(".panel-text").val()
								tempObj.reportName=$(this).find(".theme-text").val();
								tempChoose.push(tempObj);
							}
						});
                        Property.module.option.goalChoose=JSON.stringify(tempChoose);
						Property.control.apply(Property.module.option);
					})
					
					//为单位换算开关绑定点击事件 add by lifeilong
                    jQuery("#xUnit-switch, #yUnit-switch").parent().parent().find(".ui-switchbutton-enabled, .ui-switchbutton-disabled").on('click', function() {
                        Property.control.apply(Property.module.option)
                    });

                    //单独设置echarts图标主题 add by lifeilong
					jQuery('#bi-style-thecurrentPluginme').on('change', function(){
						Property.setSingleTheme($('#bi-style-theme option:selected').attr("value"), Property.module.option.el);
				    });

				},
				autoTitle:function(){
					$("#chart-property .propTitle").click(function(){
						var $this = $(this);
						//判断状态
						if($this.parent().hasClass("close")){
							$this.next().slideDown();
							$this.parent().removeClass("close")
						}else{
							$this.next().slideUp();
							$this.parent().addClass("close")
						}
						Bace.autoScroll(jQuery("#chart-property"));
					});
				}
			}
		};
		return Property.control;
	});
