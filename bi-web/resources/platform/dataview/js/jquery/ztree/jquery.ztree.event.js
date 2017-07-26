/*!
 * 
 * @author zhump
zTree input extend,Choice provide nicescroll 
By jQuery 1.4+

Version 1.0.0
If you have questions, please email me at 695004175@qq.com
*/
;(function() {
	
	var loadingOption = {
		  lines: 13, // The number of lines to draw
		  length: 7, // The length of each line
		  width: 4, // The line thickness
		  radius: 10, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  color: '#fff', // #rgb or #rrggbb
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
	};
	
	var methods = {
		init: function() {
			var $this = this;
			var setting = {
				check: {
						enable: true,
						//chkboxType: {"Y":"", "N":""}是否关联选中
					},
				view: {
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				zIndex:999999,
				async:{
					 otherParam: {"searchText":''}
				},
				callback: {
					beforeClick: beforeClick,
					onCheck: onCheck,
					onExpand:onExpand,
					onAsyncSuccess:onExpand
				}
			};
			var zTreeId = "z"+new Date().getTime(),
				treeMenuId = "m" + zTreeId;
			setting = $.extend(true, {}, setting, arguments[0]);
			if(setting.async.label){
				$(this).data("code",setting.async.code.split(',')).val(setting.async.label);
			}
			setting.treeId = zTreeId;
			$this.prop("readonly",true);
			//构建树容器
			var $treeMenu = jQuery("<div></div>",{
				"id":treeMenuId,
				"class":"treeMenu",
				"css":{
					"display":"none",
					"position": "absolute",
					"z-index":setting.zIndex,
				}
			}).append(
				//构建搜索栏
				jQuery("<div></div>",{
					"class":"treefilterPanel no-select",
					"html":"<div class='group'><input class='filterInput' placeholder='请输入搜索内容' /></div>"+
						   "<button class='filterButton no-select ladda-button' data-spinner-color='#66afe9' data-style='slide-left'><span class='ladda-label'>查询</span></button>"
				})
			).append(
				//构建树
				jQuery("<ul></ul>",{
					"id":zTreeId,
					"class":"ztree no-select ",
					"css":{
						"margin-top":0, 
						"width":"180px",
						"height": "250px",
//						"min-height": "200px",
//						"max-height": "250px"
					}
				})
			).append(
				//构建底部工具
				jQuery("<div></div>",{
					"class":"treeToolPanel no-select",
					"zTreeId":zTreeId,
					"html":"<div class='checkAllNodes'>全选</div>"+
						   "<div class='removeAllNodes'>清空</div>"+
						   "<div class='closeTreeMenu'>关闭</div>"
				})
			).append(
				//构建无数据面板，默认隐藏
				jQuery("<div></div>",{
					"class":"treeNoResultPanel",
					"style":"display:none",
					"html":"没有查询到相关维度信息！"
				})
			).append(
				//构建loading面板，默认隐藏
				jQuery("<div></div>",{
					"class":"ztree-loading",
					"css":{
						'position': "absolute",
						'bottom':0,
						'right':0,
						'left':0,
						'top':0,
						'background':"rgba(135, 206, 250, .3)",
						'z-index':99999999,
						'display':"none"
					}
				})
			).appendTo("body");
			
			
			//查询按钮
			jQuery("#"+treeMenuId).find(".filterButton").on("click keypress",function(event){
				search();
			})
			jQuery("#"+treeMenuId).find(".filterInput").on("click keypress",function(event){
				if(event.keyCode == "13"){
					search()
				}
			})
			
			function search(){
				jQuery("#"+treeMenuId).find(".ztree-loading").show(1,function(){
					var $this =  jQuery(this);
					var zTree = $.fn.zTree.getZTreeObj(zTreeId);
					zTree.setting.async.otherParam.searchText = jQuery("#"+treeMenuId+" .filterInput").val()
					if(typeof(Spinner2) != "undefined"){
						$this.spin(loadingOption)
					}
					zTree.reAsyncChildNodes(null, "refresh",false,function(){
						if(typeof(Spinner2) != "undefined"){
							$this.spin('close').hide();
						}else{
							$this.hide();
						}
						if($("#"+zTreeId+" >li").length == 0){
							$treeMenu.find(".treeNoResultPanel").show();
							$("#"+zTreeId).hide();
						}else{
							$treeMenu.find(".treeNoResultPanel").hide();
							$("#"+zTreeId).show();
						}
						
					});
				})
			}
			
			
			//全选
			$treeMenu.find(".checkAllNodes").on("click",function(){
				if(!$treeMenu.find(".treeNoResultPanel").is(':hidden')){
					return;
				}
				var zTree = $.fn.zTree.getZTreeObj($(this).parent().attr("zTreeId"));
				zTree.checkAllNodes(true);
				nodes = zTree.getCheckedNodes(true),
				v = "",
				value=[];
				for (var i=0, l=nodes.length; i<l; i++) {
					v += nodes[i].name + ",";
					value.push(nodes[i].id);
				}
				if (v.length > 0 ) v = v.substring(0, v.length-1);
				$this.val(v).data("code",value).focus();
				
			})
			
			//清空
			$treeMenu.find(".removeAllNodes").on("click",function(){
				var zTree = $.fn.zTree.getZTreeObj($(this).parent().attr("zTreeId"));
				zTree.checkAllNodes(false);
				$this.val("");
				$this.removeData("code");
			})
			
			//关闭
			$treeMenu.find(".closeTreeMenu").on("click",function(){
				hideMenu();
			})
			
			//初始化ztree
			$.fn.zTree.init($("#"+zTreeId),setting,setting.zNodes);
			
			//获取焦点时显示
			jQuery($this).on("focus",function(){
				setTimeout(function(){
					showMenu();
				},0)
			})
			
			//显示
			function showMenu() {
				var _offset = $this.offset();
				$("#"+treeMenuId).css({
					left:_offset.left + "px", 
					top:_offset.top + $this.outerHeight() +10 + "px"
				}).fadeIn();
				$("body").on("mousedown scroll", onBodyDown);
				
				if($.nicescroll){
					autoScroll($("#"+treeMenuId +" .ztree"));
				}
				
			}
			
			function rest(){
				$treeMenu.find(".filterInput").val("");
				//清空筛选条件，默认勾上已选
				var array = $this.data("code")||[];
				var zTree = $.fn.zTree.getZTreeObj(zTreeId);
				for(var i = 0,n=array.length;i<n;i++){
					var node = zTree.getNodeByParam("code",array[i],null);
					if(node){
						zTree.checkNode(node,true, null, true);
					}
				}
			}
			
			function onExpand(event, treeId, treeNode){
				var array = $this.data("code")||[];
				if(typeof(array)==='string'){
					array = array.split(',')
				}
				var zTree = $.fn.zTree.getZTreeObj(zTreeId);
				if(treeNode){
					node = treeNode.children;
				}else{
					node = zTree.getNodes()
				}
				for(var i in node){
					var code = node[i].id;
					if($.inArray(code,array)>-1){
						zTree.checkNode(node[i], true, null, true);
					}
				}
			}
			
			//隐藏
			function hideMenu() {
				$("#"+treeMenuId).fadeOut("fast");
				$("body").off("mousedown scroll", onBodyDown);
			}
			
			//绑定隐藏事件，排除已方元素
			function onBodyDown(event){
				if (!(event.target.id == $this.attr("id") || 
					  event.target.id == treeMenuId || 
					  $(event.target).parents("#"+treeMenuId).length>0)) {
					hideMenu();
				}
			}
			//更新选中状态
			function beforeClick(treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj(treeId);
				zTree.checkNode(treeNode, !treeNode.checked, null, true);
				return false;
			}
		
			//文本框赋值
			function onCheck(e, treeId, treeNode) {
				if(jQuery("#"+treeMenuId).find(".ztree-loading:visible").length > 0)return;
				var value = $this.val().split(',');
				var code = $this.data('code')||[];
				
				var zTree = $.fn.zTree.getZTreeObj(treeId),
				nodes = zTree.getCheckedNodes(true),
				_value = [],
				_code=[];
				
				for (var i=0, l=nodes.length; i<l; i++) {
					_code.push(nodes[i].id);
					_value.push(nodes[i].name);
				}
				
				
				
				$.merge(_value,value);
				$.merge(_code,code);
				
				$.unique(_value);
				$.unique(_code);
				
				if(!treeNode.checked){
					_value.splice($.inArray(treeNode.name,_value),1);
					_code.splice($.inArray(treeNode.id,_code),1);
				}
				var str = _value.join(',');
				if(str.substring(str.length, str.length-1) == ','){
					str = str.substring(0, str.length-1);
				}
				
				$this.val(str).data("code",_code);
			}
			
			//添加滚动条
			function autoScroll($panel,option){
				if($panel.getNiceScroll().length==0){
					var _option = $.extend(true,{},{
							'cursorcolor': '#D4D4D4',
							'cursorborder':'none',
							'preservenativescrolling':false
					},option);
					$panel.niceScroll(_option);
				}else{
					setTimeout(function(){
						$panel.getNiceScroll().resize();
					},100)
				}
			}
			
			this.data("treeId",zTreeId);
			return this;
		},
		//获得选中的维度编码数组
		getCheckCode:function(){
			var $this = $(this);
			return $this.data("code");
		},
		//设置选中的维度编码数组
		setCheckCode:function(label,code){
			$(this).data("code",code.split(',')).val(label);
		},
		//销毁
		destroy: function() {
			var $this = $(this);
			var treeId = $this.data("treeId");
			if(treeId){
				jQuery("#m"+treeId).remove();
				$.fn.zTree.destroy(treeId);
			}
		}
	};

	$.fn.bzTree = function() {
		var method = arguments[0];
		if (methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if (typeof(method) == 'object' || !method) {
			method = methods.init;
		} else {
			console.error('Method ' + method + ' does not exist on jQuery.bzTree');
			return this;
		}
		return method.apply(this, arguments);
	}
})(jQuery);