define(['bace','view/box','view/widgets/plugins/table/dimAttr','view/widgets/plugins/table/desgin','view/attr'],function(Bace,Box,DimAttr,Desgin,Attr){
	Box.Widgets.plugins.table = {
		//插件类型
		type:'table',
		flag:false,
		init:function(){
			//只允许初始化一次
			if(!Box.Widgets.plugins.table.flag){
				settingPanelEvent();
				Box.Widgets.plugins.table.flag = true;
			}
		},
		//初始化数据面板
		initDataPanel:DimAttr.init,

		//配置面板属性的配置信息
		initDesginPanel:{
			//设计面板的配置信息
			config:{
				title2:{
					"title":"标题",
					items:[
						{id:"table-title-text",	lable:"标题:",width:'158px',	type:"input", value:""},
						{id:"table-title-color",lable:"颜色:",type:"color",value:"rgba(14,45,95,1)",position:"bottom left-30"},
						{id:"table-title-left",	lable:"水平:",type:"select",width:'70px',selectHTML:"<option value='left' selected>居左</option><option value='center'>居中</option><option value='right'>居右</option>","style":"position:absolute;top:30px;right:2px"},
					]
				}
			},
			//设计面板配置项发生变化时触发的方法
			change:Desgin.change
		},
		contanier:{

			//容器工具
			getTools:function(page,type){
				//shaojs 20160804 改造方法,为不同的页面放回不同的tools集合
				page = page || "main";//默认是主页面
                type = type || 0; // 表格类型 0 清单表格 1 详情表格
				var tools = {
					move            : '<div class="chart-icon move" title="按住我，拖动！"><i class="iconfont icon-move" ></i></div>',
					setting         : '<div class="chart-icon setting" title="打开属性面板"><i class="iconfont icon-setting" ></i></div>',
					openSelfDimAttr : '<div class="chart-icon openSelfDimAttr" title="打开小面板"><i class="iconfont icon-dim" ></i></div>',
					removeSelfChart : '<div class="chart-icon removeSelfChart del" title="移除"><i class="iconfont icon-delete" ></i></div>',
                    xy2yx           : '<div class="chart-icon xy2yx" title="行列互换"><i class="iconfont icon-xy2yx" ></i></div>',
                    table_download  : '<div class="chart-icon tabledownload" title="表格下载"><i class="iconfont icon-tabledownload" ></i></div>'
				};
				switch(page){
					case "main" :
                        var ret = [
                            [tools.move, tools.setting, tools.openSelfDimAttr,tools.table_download, tools.removeSelfChart ],
                            [tools.move, tools.setting, tools.openSelfDimAttr,tools.xy2yx,tools.table_download, tools.removeSelfChart ]
                        ];
						return ret[type];
						break;
					case "container" :
                        var ret = [
                            [tools.openSelfDimAttr,tools.table_download],
                            [tools.openSelfDimAttr,tools.xy2yx,tools.table_download]
                        ];
						return ret[type];
						break;
					default :
						return [];
				}
			},
			//容器工具小面板
			settingPanel:'<div class="fieldTitle rowsDimTitle">列维度<div class="applyTable">应用</div></div>'+
				'	<div class="rowsDimPanel panel"></div>'+
				'	<div class="fieldTitle colsDimTitle">行维度</div>'+
				'	<div class="colsDimPanel panel"></div>'+
				'	<div class="fieldTitle attrFuncTitle">指标函数</div>'+
				'	<div class="attrFuncPanel panel"></div>',
			//容器小面板初始化方法
				renderSettingPanel:function($container){
					var $dimAttrSettingPanel = $container.find('.dimAttrSettingPanel');
						$dimAttrSettingPanel.find(".rowsDimPanel,.colsDimPanel,.attrFuncPanel").empty();
					var dataPanel = $container.data("option").config.dataPanel;
					var $rowsDimPanel = $dimAttrSettingPanel.find(".rowsDimPanel").html("");
					var $colsDimPanel = $dimAttrSettingPanel.find(".colsDimPanel").html("");
					var $attrPanel = $dimAttrSettingPanel.find(".attrFuncPanel").html("");
					if(_.keys(dataPanel).length > 0){
						//因为表格需要点击应用才会生效，所以从容器配置中读取的data需要断绝引用关系
						var attrData =  eval( "(" + $.toJSON(dataPanel.attrData) + ")" );
						var colsData =  eval( "(" + $.toJSON(dataPanel.colsData) + ")" );
						var rowsData =  eval( "(" + $.toJSON(dataPanel.rowsData) + ")" );

						var html = '<div class="dimAttrField ${order}" title="${attrName}">'
									  +'<div class="attrDimText {{if isChecked==true}} checked {{/if}}">${modifyName}</div>'
								   +'</div>';

					    for(var i =0;i<colsData.length;i++){
					    	$colsDimPanel.append($.tmpl(html,colsData[i]).data("data",colsData[i]))
						}
						for(var i =0;i<rowsData.length;i++){
							$rowsDimPanel.append($.tmpl(html,rowsData[i]).data("data",rowsData[i]))
						}
						for(var i =0;i<attrData.length;i++){
							$attrPanel.append($.tmpl(html,attrData[i]).data("data",attrData[i]))
						}
					}

					$(".rowsDimPanel,.colsDimPanel",$dimAttrSettingPanel).sortable({
						connectWith: ".colsDimPanel,.rowsDimPanel",
						appendTo: 'body',
						delay: 200,
						containment: $dimAttrSettingPanel[0],
						scroll: true,
						placeholder:"table-item-placeholder",
						helper: function(event, ui) {
							return jQuery('<div>', {
								'html': $(ui).text()
							}).addClass('attr-helper').appendTo('body');
						}
					}).disableSelection();

					return $dimAttrSettingPanel;
				},
			//容器改变大小方法
			resize:{
				start:function(){
				},
				reisze:function(el){
					var $el = $("#"+el);
					$(".chart",$el).treegrid('resize', {
		                height: $el.height()
		            });
				},
				stop:function(el){
//					var $el = $("#"+el);
//					setTimeout(function() {
//						var columns_temp = $el.data("option").config.build.columns;
//						var columns = columns_temp[columns_temp.length-1];
//						var columns_len = columns.length;
//						var firstWidth = jQuery("td[field='A0']:eq(0)",$el).parent().width()+5;
//						var numWidth = jQuery(".datagrid-header-rownumber:eq(0)",$el).parent().width();
//						var totalWidth = $el.width()+31;
//						var trueWidth = ((totalWidth - firstWidth - numWidth)/columns_len)+"px";
//						var $dg = jQuery(".chart",$el);
////						_.each(columns,function(column){
////							var $col = $dg.treegrid('getColumnOption', column.field);
////							$col.width = trueWidth;
////							$col.align = "center";
////						})
////						$dg.treegrid();
//						_.each($dg.treegrid('options').columns[1],function(obj){
//							obj.width = trueWidth;
//						})
//						$dg.treegrid();
//					}, 1000)
				}
			}
		},
		//属性面板
		propPanel:{
			//数据面板
			data:{
				html:'<div propType="table">'+
						'<div class="fieldTitle rowsTitle">'+
							'<div style="display: inline-block; vertical-align:top">行维度</div>'+
						'</div>'+
						'<div class="rowsDimPanel" id="rowsDimPanel"></div>'+
						'<div class="fieldTitle colsTitle">'+
							'<div style="display: inline-block; vertical-align:top">列维度</div>'+
						'</div>'+
						'<div class="colsDimPanel" id="colsDimPanel"></div>'+
						'<div class="fieldTitle attrFuncTitle">'+
							'<div style="display: inline-block; vertical-align:top">指标函数</div>'+
						'</div>'+
						'<div class="attrFuncPanel" id="attrFuncPanel"></div>'+
					'</div>'
			},
			//面板切换时触发
			tabsChange:function(event,ui){

			},
			//面板打开时，触发的方法
			openRender:function(option){
				//多数据源改造
				if(option.isInit){
					//当前图形的dataId
					var currentDataId = option.config.build.dataParams.dataId;
					var currentDataName = option.config.build.dataParams.dataName;
					Box.main.dataName = currentDataName;
					Box.main.dataId = currentDataId;
					Attr.init();
					Attr.openAttrPanel('open');
				}
				DimAttr.render(option);
				Desgin.render(option);
			},
			//面板关闭方法
			close:function(){
				if(DimAttr.checkDiff()===false){
					Box.Property.hideTip("error");
					Box.Property.showTip({
						_id:"error",
						msg: '<br/>系统检测到关闭操作!<br/>但图形指标数据发生变化，<br/>是否应用该数据？',
						button: '<div class="btn changeChart" style="width: 196px;">应用</div>' + '<div class="btn cancelChange" style="width: 196px;">直接关闭</div>'
					});

					$("#error .changeChart").click(function(){
						Box.Property.apply();
						Box.Property.hideTip("error");
					});

					$("#error .cancelChange").click(function(){
						Box.Property.close(true);
						Box.Property.hideTip("error");
					});
					return false;
				}else{
					Box.Property.close(true);
					return true;
				}
			}
		},
		//应用属性到容器的方法
		apply:function(option,isPass,isQuick){
			//明细表格
            var __datatype;
			if(option.chartChild == 'detail'){
				if(isPass){
					installTableDetByBuild(option.config.build,option);
				}else{
					option.config.dataPanel =  isQuick?option.config.dataPanel:DimAttr.collect();

                    checkDimAttrData(option.config.dataPanel,option.chartChild) && installTableDetByBuild(option.config.build,option);
				}
                option.config.build.dataParams.dataType = option.config.build.dataParams.dataType || Box.main.dataType;
                __datatype = option.config.build.dataParams.dataType;
			}else{
				if(isPass){
                    installTableByBuild(option.config.build,option);
                    __datatype = option.config.build.dataParams.dataType;
				}else{
                    //是否是小面板发生变化
                    var dimAttrData  = isQuick?option.config.dataPanel:DimAttr.collect();
                    option.config.dataPanel = dimAttrData;
                    var build = {};
                    build.dataParams  = {
                        dataId:Box.main.dataId,
                        dataName:Box.main.dataName, //挂载数据源名称 shaojs 20160823
                        dataType:Box.main.dataType,
                        chartType:option.chartType+"Cnt",
                        dimAttrJsonStr:$.toJSON(DimAttr.getCheckedDimAttr(dimAttrData)),
                        filterJsonStr:$.toJSON(Box.Filter.dataStart('collect'))
                    };
                    checkDimAttrData(dimAttrData,option.chartChild) && installTableByBuild(build,option);
                    __datatype = build.dataParams.dataType;
                }

			}

			//根据table的数据类型,判断是否提供表格下载按钮,直连数据不能下载 datatype =5 是直连数据
            if("5" == __datatype){
                $("#"+ option.el).find(".tools .tabledownload").remove();
            }

            //验证参数是否合法
			function checkDimAttrData(dimAttrData,chartChild){
                var errorText = DimAttr.checkValidity(dimAttrData,chartChild);
                if(errorText){
                    //如果不合法
                    Box.Property.showTip({
                        _id:"error",
                        msg: '<br/>'+errorText,
                        button: '<div class="btn changeChart" style="width: 196px;">确定</div>' + '<div class="btn cancelChange" style="width: 196px;">取消</div>'
                    });
                    $("#error .changeChart").click(function(){
                        jQuery("#propertyTabs").tabs("option", "active", 0);
                        Box.Property.hideTip("error");
                    });
                    $("#error .cancelChange").click(function(){
                        jQuery("#propertyTabs").tabs("option", "active", 0);
                        Box.Property.hideTip("error");
                    });
                    return false;
                }
                return true;
			}
		},
		destory:function(el){
			var $this = $("#"+el);
			if($this.find('.datagrid').length > 0 ){
				$(".chart",$this).treegrid('getPanel').panel("destroy");
			}
		},
        unchainChart:function(container){
            //取消数据联动
            var option = $.extend(true, {}, container.data("option"));
            container.find(".chainInfo").empty().hide();
            container.data("isLinked",false);
            Box.Widgets.plugins.table.apply(option,true);
        }
	};

    /**
     * 表格菜单click事件处理函数合集
     * @type {{}}
     */
	var tableHeaderContextMethods={
        //固定表格列
        lockCol:function($el,$grid,data){
            var filed = data.filed;
            var menuData =  $.extend(true,{},$el.data("__menuData"),$el.data("menuData"));
            menuData[filed] = menuData[filed] || {};
            menuData[filed].isLock = !menuData[filed].isLock;

            $el.data("menuData",menuData);
            var option = $.extend(true, {}, $el.data("option"));
            Box.Widgets.plugins.table.apply(option,true);
        },
        //显示和隐藏列
        hidden:function($el,$grid,data){
            var filed = data.filed;
            var menuData =  $.extend(true,{},$el.data("__menuData"),$el.data("menuData"));
            menuData[filed] = menuData[filed] || {};
            menuData[filed].isHidden = !menuData[filed].isHidden;

            if(menuData[filed].isHidden){
                $grid.datagrid("hideColumn",filed);
            }else{
                $grid.datagrid("showColumn",filed);
            }
            $el.data("menuData",menuData);

            //显示和隐藏固定列的时候需要重新加载一下,否则固定列宽度不对
            if(menuData[filed].isLock){
                var option = $.extend(true, {}, $el.data("option"));
                Box.Widgets.plugins.table.apply(option,true);
            }

        },
        //告警设置
        color:function($el,$grid,data){
            var $colormenu = $("#"+data.filed+"_colormenu");
            var menuData =  $.extend(true,{},$el.data("__menuData"),$el.data("menuData"));
            var cmd = menuData[data.filed] =  menuData[data.filed] || {};
            var color = cmd.color || {
                    on:false,
                    lt:"",
                    gt:"",
                    attrId:data.filed
                };
                //on值在渲染的时候会变成checked字符串,这里再换回来
                color.on = !! color.on;
            var __color = {
                on:$("#"+data.filed+"_colorswitch")[0].checked,
                lt:$(".number-input",$colormenu).eq(0).val() || "",
                gt:$(".number-input",$colormenu).eq(1).val() || "",
                attrId:data.filed
            };
            //如果参数有变化,则重新加载,否则不动
            if(!(_.isEqual(color,__color))){
                menuData[data.filed].color = __color;
                $el.data("menuData",menuData);
                var option = $.extend(true, {}, $el.data("option"));
                Box.Widgets.plugins.table.apply(option,true);
            }
        },
        //渲染设置
        render:function($el,$grid,data){
            var $rendermenu = $("#"+data.filed+"_rendermenu");
            var menuData =  $.extend(true,{},$el.data("__menuData"),$el.data("menuData"));
            var cmd = menuData[data.filed] = menuData[data.filed] || {};
            var render = cmd.render || {
                    on:false,
                    bace:"1",
                    attrId:data.filed
                };
                //on值在渲染的时候会变成checked字符串,这里再换回来
                render.on = !! render.on;
            var __render = {
                on:$("#"+data.filed+"_renderswitch")[0].checked,
                bace:$(".number-input",$rendermenu).eq(0).val() || "1",
                attrId:data.filed
            };
            //如果参数有变化,则重新加载,否则不动
            if(!(_.isEqual(render,__render))){
                menuData[data.filed].render = __render;
                $el.data("menuData",menuData);
                var option = $.extend(true, {}, $el.data("option"));
                Box.Widgets.plugins.table.apply(option,true);
            }
        },
        //重置表格
        reset:function($el,$grid,data){
            $el.data("menuData",null);
            var option = $.extend(true, {}, $el.data("option"));
            Box.Widgets.plugins.table.apply(option,true);
        }
    };



	function installTableDetByBuild(build,option){
		var $el = $("#"+option.el);
		var $grid = $(".chart",$el);
		Box.Widgets.showLoading($el);

		//防止与表格卡死
		setTimeout(function(){
			$(".dimAttrSettingPanel",$el).hide('slide');
		},0);

		if($grid.data("datagrid")){
			$grid.datagrid('getPanel').panel("destroy");
			$el.find(".dimAttrSettingPanel:eq(0)").after($grid);
		}

		var columns = [];
		var attrData = option.config.dataPanel.rowsData;
		var checkAttrData = DimAttr.getCheckedDimAttr({rowsData:attrData});
        var menuData = $.extend(true,{},$el.data("__menuData"),$el.data("menuData"));


		_.each(checkAttrData.rowsData,function(attr){
            var __menudata = menuData[attr.attrId] ||{};
			columns.push({
				field:attr.attrId,
				title:attr.modifyName,
				halign:'center',
				align:attr.attrType == 1?"right":"left",
                sortable:true, //开启排序功能 addby shaojs 20161121
                hidden:!!__menudata.isHidden,              //是否隐藏列
                __lock:!!__menudata.isLock?"fcol":"ncol",   //是否固定列
                formatter:(function(){
                    /*
                    * 设置格式化
                    * 渲染(render)的优先级高于告警(color)
                    * 告警中 '小于'的优先级高于'大于'的优先级
                    * */
                    var color = __menudata.color ,render =  __menudata.render;
                    //如果没有告警和渲染配置
                    if(!color && !render){
                        return;
                    }
                    //如果有配置渲染,且渲染打开
                    if(render && render.on){
                        //获取基值
                        var bace = parseFloat(render.bace);
                        return function(value,row,index){
                            //获取百分比
                            var __value = ((value/bace)*100).toFixed(2);
                            //修正百分比
                            (__value > 100) && (__value = 100);
                            //返回一个进度条
                            var full = __value == 100? "full" :"";
                            return '<div class="process-out"><div class="process-inner '+ full +'" style="width: '+__value+'%;"><span>'+ __value+'%</span></div></div>';
                        }
                    }
                    //如果有配置告警,且告警打开
                    if(color && color.on){
                        var __lt = color.lt == undefined?"":color.lt;
                        var __gt = color.gt == undefined?"":color.gt;
                        //如果小于值和大于值都没有设置
                        if(__lt === "" && __gt === ""){
                            return;
                        }
                        return function(value,row,index){
                            //如果符合小于条件,则显示绿色
                            if(__lt !== "" && parseFloat(value) < parseFloat(__lt)){
                                return '<span class="value_green">'+value+'</span>';
                            }else if(__gt !== "" && parseFloat(value) > parseFloat(__gt)){
                                return '<span class="value_red">'+value+'</span>';
                            }else{
                                return value;
                            }
                        };
                    }
                })()
			})
		});
        //根据是否固定列分组
        var __colums = _.groupBy(columns,"__lock");

        var designPanel =  option.config.designPanel;
		var title =designPanel.table.title.text||false;
        if(!option.isInit){
            build = {
                dataParams:{
                    dataId:Box.main.dataId,
                    dataName:Box.main.dataName,
                    dataType:Box.main.dataType,
                    chartType:option.chartType+"Det",
                    dimAttrJsonStr:$.toJSON(checkAttrData),
                    filterJsonStr:$.toJSON(Box.Filter.dataStart('collect'))
                }
            };
        }else{
            build.dataParams = $.extend(build.dataParams,{
                dimAttrJsonStr:$.toJSON(checkAttrData),
                filterJsonStr:$.toJSON(Box.Filter.dataStart('collect'))
            });
        }
		if(typeof(goal)!="undefined"&&goal!=""){
			build.dataParams.chartLinkJsonStr=JSON.stringify(goal.chartLinkData);
		}

        //在查看页面,添加containerid和查看页面标识
        if(Box.flags.isVeiwPage){
            build.dataParams.containerid = option.el;
            build.dataParams.isViewPage = true;
        }

		var grid_option = {
			width: "100%",
			title:title,
			fit:true,
			border: false,
            multiSort:true, /*支持多重排序 addby shaojs 20161121*/
			rownumbers: true,
			columns:[__colums.ncol],
            frozenColumns:[__colums.fcol],  /*添加固定列*/
			url:Bace.handleUrlParam('/platform/dataview/viewTableDetData'),
			method:'post',
    		pagination:"true",
    		queryParams: build.dataParams,
			onLoadSuccess:function(){
				setTimeout(function(){
					var $rownumber = $el.find(".datagrid-td-rownumber");
					var width = $rownumber.width();
					$rownumber.width(width)

				},1000);
				Box.Widgets.hideLoading($el);
				//Bace.autoScroll($(".datagrid-body:eq(1)",$el));
				//渲染设计面板的配置项
				var table_config = option.config.designPanel.table;
				if(!table_config)return;
				$el.find(".panel-header> .panel-title").css({
					"text-align":table_config.title.left,
					"color":table_config.title.color
				})
			},
            onHeaderContextMenu: function(e, field){
                e.preventDefault();
                //定制右击菜单
                createColumnMenu($el,$grid,checkAttrData.rowsData,field);
                $("#tableheader_menu_div").menu('show', {
                    left:e.pageX,
                    top:e.pageY,
                    duration:500
                });
            }
		};

		$grid.datagrid(grid_option);
		option.config.build = build;
		option.isInit = true;
	}

    /**
     * 创建表头右键菜单
     * @param $el 表格容器,用于获取数据
     * @param $grid 表格元素的jq对象
     * @param rowsData 表格列数据
     * @param field 当前列的field,用于查找当前列的属性,方便显示和隐藏一些菜单功能
     */
    function createColumnMenu($el,$grid,rowsData,field){
        //创建右键菜单,每次都销毁,然后根据容器上的参数重新生成一个菜单
        var cmenu = $("#tableheader_menu_div");
        if(!cmenu.length){
            cmenu = $('<div id="tableheader_menu_div"></div>').css({position:"absolute",backgroundColor:"#fff"}).appendTo('body');
        }else{
            cmenu.menu("destroy").css({height:"initial"});
        }
        var innerHtml = _.map(buildMenuData($el,$grid,rowsData,field),function(e,i){
            return buildTableMenuHtml(e);
        }).join("");
        cmenu.empty().html(innerHtml);

        //初始化switchbutton控件
        cmenu.find(".switchbutton").each(function(e){
            $(this).switchbutton({
                classes: 'ui-switchbutton-thin',
                checkedLabel: '打 开',
                uncheckedLabel: '关 闭'
            })/*.change(function(){
                //console.log(arguments);
            })*/;
        });
/*        //'取消'按钮
        cmenu.on("click","j-cancel",function(){

        });
        //'确定'按钮
        cmenu.on("click","j-commit",function(){

        });*/

        //初始化菜单
        cmenu.menu({
            onClick:function(item){
                var target = item.target;
                var menuData = $(target).data("menudata") || {};
                menuData.method && tableHeaderContextMethods[menuData.method] && tableHeaderContextMethods[menuData.method]($el,$grid,menuData.data);
            },
            onHide:function(){
                //处理自定义菜单事件
                $(".menu-content").each(function() {
                    var $this = $(this);
                    var menuData = $this.data("menudata") || {};
                    menuData.method && tableHeaderContextMethods[menuData.method] && tableHeaderContextMethods[menuData.method]($el,$grid,menuData.data);
                });
            }
        });
    }

    /**
     * 构建表头右击菜单数据
     * @param container  表格容器
     * @param grid  表格元素
     * @param rows  行信息
     * @param field 当前列的field,用于查找当前列的属性,方便显示和隐藏一些菜单功能
     */
	function buildMenuData(container,grid,rows,field){
        var currentField = _.find(rows,{attrId:field});
        //console.log("菜单参数",rows,currentField,field);
        var menuData = $.extend(true,{},container.data("__menuData"),container.data("menuData"));

        //处理当前MenuData值,处理空值
        var currentMenuData = menuData[currentField.attrId] || {};
        var __color  = currentMenuData.color || {};
        __color.on = __color.on?'checked="checked"':"";
        __color.attrId = __color.attrId || currentField.attrId;

        //处理渲染参数默认值
        var __render  = currentMenuData.render || {};
        __render.on = __render.on?'checked="checked"':"";
        __render.attrId = __render.attrId || currentField.attrId;
        __render.bace = __render.bace || 1;
        var hiddenCount = _.countBy(menuData,function(e){
            return e.isHidden?"hidden":"show";
        })["hidden"];
        var isLastShowCol = rows.length - hiddenCount == 1;

        var menus;

        //预警定制子菜单
        var colorSubContentStr = '<div class="content-line"><span class="line-text">开关：</span><div class="line-box"><input id="{{attrId}}_colorswitch" type="checkbox" class="switchbutton" {{on}} style="width:64px;"></div></div>' +
            '<div class="content-separat"></div>' +
            '<div class="content-line"><span class="line-text">小于：</span><div class="line-box"><input type="number" class="number-input" value="{{lt}}"><span class="color-box green"></span></div></div>' +
            '<div class="content-line"><span class="line-text">大于：</span><div class="line-box"><input type="number" class="number-input" value="{{gt}}"><span class="color-box red"></span></div></div>' ;
            /*'<div class="content-line button-line"><div class="line-button line-button-cancel j-cancel">取消</div><div class="line-button line-button-commit j-commit">确定</div></div>';*/

        var colorSubContent = {
                style:"height:100px;",
                id:currentField.attrId+"_colormenu",
                data:JSON.stringify({method:"color",data:{filed:currentField.attrId}}),
                content: Bace.buildString(colorSubContentStr,__color)
            };

        //渲染定制子菜单
        var renderSubContentStr = '<div class="content-line"><span class="line-text">开关：</span><div class="line-box"><input id="{{attrId}}_renderswitch" type="checkbox" class="switchbutton" {{on}} style="width:64px;"></div></div>' +
            '<div class="content-separat"></div>' +
            '<div class="content-line"><span class="line-text">基值：</span><div class="line-box"><input type="number" class="number-input" value="{{bace}}"></div></div>' ;
            /*'<div class="content-line button-line"><div class="line-button line-button-cancel j-cancel">取消</div><div class="line-button line-button-commit j-commit">确定</div></div>';*/
        var renderSubContent = {
            style:"height:70px;",
            id:currentField.attrId+"_rendermenu",
            data:JSON.stringify({method:"render",data:{filed:currentField.attrId}}),
            content: Bace.buildString(renderSubContentStr,__render)
        };

        //列锁定子菜单
        var lockColSubMenu = _.map(rows,function(e,i){
            var id = e.attrId+"_lockcolmenu";
            var __menudata = menuData[e.attrId] || {};
            var iconCls = __menudata.isLock ? "icon-spin" : "icon-unspin";
            return {
                text: e.modifyName,
                options:'id:"'+id+'",iconCls:"'+iconCls+'"',
                data:JSON.stringify({method:"lockCol",data:{filed:e.attrId}})
            }
        });
        //显示隐藏列子菜单
        var hiddenSubMenu = _.map(rows,function(e,i){
            var id = e.attrId+"_hiddenmenu";
            var iconCls,disableStr;
            var __menudata = menuData[e.attrId] || {};
            iconCls = __menudata.isHidden ? "icon-hidden" : "";
            disableStr = (isLastShowCol && iconCls == "")?',disabled:"true"':'';
            return {
                text: e.modifyName,
                options:'id:"'+id+'",iconCls:"'+iconCls+'"'+disableStr,
                data:JSON.stringify({method:"hidden",data:{filed:e.attrId}})
            }
        });

        var baseMenu = {
            color:{
                text: '预警设置',
                options:'id:"table-menu-color",iconCls:"icon-color"',
                //自定义子菜单(只允许一级,和submenu不能共存)
                subContent:colorSubContent
            },
            render:{
                text: '渲染',
                options:'id:"table-menu-render",iconCls:"icon-render"',
                subContent: renderSubContent
            },
            lockCol:{
                text: '固定列',
                options:'id:"table-menu-lockCol",iconCls:"icon-lockCol"',
                submenu: lockColSubMenu
            },
            hidden:{
                text: '显示和隐藏',
                options:'id:"table-menu-hidden",iconCls:"icon-hidden"',
                submenu: hiddenSubMenu
            },
            reset:{
                text: '重置表格',
                options:'id:"table-menu-reset",iconCls:"icon-reset"',
                data:JSON.stringify({method:"reset"})
            }
        };

        //只有数字型的才可以设置预警和渲染
        if(currentField.attrType == "1"){
            menus = [baseMenu.color,baseMenu.render,baseMenu.lockCol,baseMenu.hidden,baseMenu.reset];
        }else{
            menus = [baseMenu.lockCol,baseMenu.hidden,baseMenu.reset];
        }
        return menus;
    }

    /**
     * 构建菜单html字符串用于生产菜单
     * @param menuData 菜单参数 参数说明如下
     * {
            text: '菜单名称',
            options:'id:"table-menu-hidden",iconCls:"icon-hidden"',   //菜单的options字符串
            data:JSON.stringify({method:"hidden",data:{...}}),        //将会被挂载到菜单div上,点击菜单时会自动调用tableHeaderContextMethods[method]的方法,并将data作为第三个参数传递给该方法
            submenu: [{...},{...}]                                    //子菜单列表,元素结构和menuData一致,会被递归生成菜单元素,和subContent不能同时使用
            subContent:{                                              //自定义子菜单,和submenu不能同时使用,只允许一层,不能嵌套
                style: "XXXXX",                                       //自定义子菜单样式
                id:    "XXXX",                                        //自定义子菜单ID
                data:  "XXXXXX",                                      //自定义子菜单数据,将会被挂载到菜单div上
                content:"XXXXXX"                                      //自定义子菜单内容
            }
       }
     */
    function buildTableMenuHtml(menuData){
        var ret = [];

        //如果没有子菜单 且 没有自定义子菜单,则返回(递归收敛条件)
        if((!menuData.submenu || !menuData.submenu.length) && !menuData.subContent){
            ret.push(Bace.buildString("<div data-options='{{options}}' data-menudata='{{data}}'>{{text}}</div>",menuData));
        }else{
            ret.push(Bace.buildString("<div data-options='{{options}}' data-menudata='{{data}}'>",menuData));
            ret.push(Bace.buildString("<span>{{text}}</span>",menuData));

            //如果是定制子菜单,做特殊处理
            if(menuData.subContent){
                ret.push(Bace.buildString("<div id='{{id}}' class='menu-content' data-menudata='{{data}}' style='{{style}}'>{{content}}",menuData.subContent));
            }else{
                ret.push('<div>');
            }
            var submenu = menuData.submenu || [];
            _.each(submenu,function (el) {
                ret.push(buildTableMenuHtml(el));  //递归调用
            });
            ret.push("</div></div>");
        }
        return ret.join("");
    }

	function installTableByBuild(build,option){

		var $el = $("#"+option.el);
		var $grid = $(".chart",$el);
		Box.Widgets.showLoading($el);

		//防止与表格卡死
		setTimeout(function(){
			$(".dimAttrSettingPanel",$el).hide('slide');
		},0);

		if($grid.data("treegrid")){
			$grid.treegrid('getPanel').panel("destroy");
			$el.find(".dimAttrSettingPanel:eq(0)").after($grid);
		}
		if(typeof(goal)!="undefined"&&goal!=""){
			build.dataParams.chartLinkJsonStr=JSON.stringify(goal.chartLinkData);
		}
		build.ajaxURL = Bace.handleUrlParam('/platform/dataview/viewTableData');

        //在查看页面,添加containerid和查看页面标识
        if(Box.flags.isVeiwPage){
            build.dataParams.containerid = option.el;
            build.dataParams.isViewPage = true;
        }

		$.ajax({
			type: "POST",
			url:build.ajaxURL,
			dataType: 'json',
			data:build.dataParams,
			success: function(response) {
				installTable(response);
			},
			error: function() {
				Box.Widgets.hideLoading($el);
			}
		});

		function installTable(response){

			if(response.RES_TYPE !== "OK"){
                //防止后台来的数据为空,调用split时报错
                response.RES_TYPE = response.RES_TYPE ||"";
				var resType = response.RES_TYPE.split("$");
				var msg = '';
				if(resType[0] == "COLUMNS_OVERFLOW"){
					msg = "查询结果列数超过" + resType[1] +"列,表格无法展示，请设置筛选条件！";
				}else if(resType[0] == "ROWS_OVERFLOW"){
					msg = "查询结果行数超过" + resType[1] +"行,表格无法展示，请设置筛选条件！";
				}
				showErrorData($el,msg);
				Box.Widgets.hideLoading($el);

                //shaojs 20160921 更新build,设置filter的时候需要用到一些参数,需要在新的build上取
                option.config.build = build;
				return;
			}
			hideErrorData($el);
			var designPanel =  option.config.designPanel;
			var title = designPanel.table.title.text||false;
			var tableHeight = $el.css("height");
			var grid_option = {
				width: "100%",
				title:title,
				height:tableHeight,
				fit:true,
				border: false,
				rownumbers: true,
				idField: 'dimCode',
				treeField: 'A0',
				showFooter:true,
                remoteSort:false,
				onBeforeExpand:function(row){
					if(row){
						var url = Bace.handleUrlParam('/platform/dataview/drillTableData');
						var level  = $grid.treegrid("getLevel",row["dimCode"])||1;
						var dimAttrData  = $el.data("option").config.dataPanel;
						var checkDimData = DimAttr.getCheckedDimAttr(dimAttrData);
						var _option = $el.data("option");
						var attrType = checkDimData.rowsData[level-1].attrType;
						var types = row.clickType ? row.clickType+"@" +attrType : attrType;
						var prevRowsAttrId = checkDimData.rowsData[level-1].attrId;
						$grid.treegrid("options").queryParams = {
							dataId:_option.config.build.dataParams.dataId,
							dataType:_option.config.build.dataParams.dataType,
							chartType:_option.chartType+"Cnt",
							dimAttrJsonStr:$.toJSON(DimAttr.getCheckedDimAttr(dimAttrData)),
							filterJsonStr:$.toJSON(Box.Filter.dataStart('collect')),
							clickJsonStr:$.toJSON({
							  clickCode:row.dimCode,
							  clickAttrId:prevRowsAttrId,
							  clickAttrType:types
							}),
							tabTitle:$.toJSON(_option.config.build.columns)
						};
						$grid.treegrid("options").url = url;

                        //在查看页面,添加containerid和查看页面标识
                        if(Box.flags.isVeiwPage){
                            $grid.treegrid("options").queryParams.containerid = _option.el;
                            $grid.treegrid("options").queryParams.isViewPage = true;
                        }
					}
				},
				onCollapse:function(){
					var width = $el.find("td[field='A0']:eq(0)>div").width();
					$el.find("td[field='A0']>div").each(function(){
						$(this).width(width)
					})
				},
				onLoadSuccess:function(){
					setTimeout(function(){
						var $rownumber = $el.find(".datagrid-td-rownumber");
						var width = $rownumber.width();
						$rownumber.width(width)
					},1000);
					Box.Widgets.hideLoading($el);
					//Bace.autoScroll($(".datagrid-body:eq(1)",$el));

					//渲染设计面板的配置项
					var table_config = option.config.designPanel.table;
					if(!table_config)return;
					$el.find(".panel-header> .panel-title").css({
						"text-align":table_config.title.left,
						"color":table_config.title.color
					})
				},
                onClickRow:function(row){
                    //点击行后,将后事抛给window上挂载的事件来处理,穿透或者关联在eventBinder里面处理
                    $(window).trigger("table.mainchain",[row,$el]);
                }
			};
			grid_option.columns = response.columns;
			if(response.firstColumn){
				grid_option.frozenColumns = [[response.firstColumn]];
			}
//			var len = grid_option.columns[grid_option.columns.length-1].length;
//			var width = 100/(len+1);
//			grid_option.frozenColumns[0][0].width = width  + "%";
//			_.each(grid_option.columns[grid_option.columns.length-1],function(obj){
//				obj.width = (width-1) + "%";
//			})
			grid_option.data = response.data;
            $grid.treegrid(grid_option);
			option.config.build = build;
			option.config.build.columns = response.columns;
			option.isInit = true;
		}
	}
	function settingPanelEvent(){
		$("#tableChartPanel").on('click', '.dimAttrSettingPanel .applyTable', function(event) {
			var $dimAttrPanel = $(this).parents(".dimAttrSettingPanel");
			var $container = $dimAttrPanel.parents(".container");
			var option = $container.data("option");
			var dataPanel = option.config.dataPanel;

			var rowsData = [];
			$(".rowsDimPanel >.dimAttrField",$dimAttrPanel).each(function(){
				rowsData.push($(this).data('data'));
			});

			var colsData = [];
			$(".colsDimPanel >.dimAttrField",$dimAttrPanel).each(function(){
				colsData.push($(this).data('data'));
			});
			var attrData = [];
			$(".attrFuncPanel >.dimAttrField",$dimAttrPanel).each(function(){
				attrData.push($(this).data('data'));
			});


			if($(".attrDimText.checked",$dimAttrPanel).length == 0){
				Box.Widgets.showTip({
					_id:"checkPanel",
					titleShow:"false",
					msg: '请勾选有效的指标或维度！',
					button: '<div class="btn checkTable">确定</div>'
				},$container);
				$("#checkPanel .checkTable").click(function(){
					Box.Widgets.hideTip("checkPanel");
				});
				return;
			}

			dataPanel.rowsData = rowsData;
			dataPanel.colsData = colsData;
			dataPanel.attrData = attrData;
			if(Box.Property.isMyProperty && Box.Property.isMyProperty(option.el)){
				DimAttr.render(option);
			}
			Box.Widgets.plugins.table.apply(option,null,true);
		});
		$("#tableChartPanel").on('click', '.attrFuncPanel .dimAttrField,.rowsDimPanel .dimAttrField,.colsDimPanel .dimAttrField', function(event) {
			var $this  = jQuery(this);
			var $attrText = $this.find(".attrDimText");
			//注意：容器的配置项也会随之改变
			if($attrText.hasClass("checked")){
				$this.data("data").isChecked = false;
				$attrText.removeClass("checked");
			}else{
				$this.data("data").isChecked = true;
				$attrText.addClass("checked");
			}
		})
	}
	function hideErrorData($container){
		 $container.find('.chart').show();
		 $container.find('.tableError').hide();
	}
	function showErrorData($container,txt){
		$container.find('.chart').hide();
		if($container.find('.tableError').length == 0){
			$container.append(jQuery('<div>',{
				"class":"tableError",
				html:txt
			}))
		}else{
			$container.find('.tableError').show();
		}
	}
});
