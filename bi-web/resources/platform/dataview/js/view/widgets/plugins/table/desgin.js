define(['bace', 'view/box', 'underscore', 'view/widgets/plugins/echarts/series', 'view/widgets/plugins/echarts/collect'], function(Bace, Box, _, series, Collect) {

	var Desgin = {
	};
	
	Desgin.control = {
		/**
		 * 描述：根据传入的容器对象渲染设计面板，并挂载相应的方法
		 * @param {Object} option	容器对象的配置信息
		 */
		render:function(option){
			var chartType = option.chartType;
			//如果容器已经初始化
			if(option.isInit){
				var designPanel = option.config.designPanel;
				Box.Property.dataStart(designPanel);
			}else{
				var initBuild = {
					bi:{
						"style":{
							border:{
								have:'',
								color:'1px solid rgba(170, 170, 170,.99)',
								shadow:false,
								radius:false
							},
							background:'rgba(255,255,255,0.8)',
						}
					},
					table:{
						title:{
							color:"rgba(14,45,95,1)",
							text:"",
							left:"left"
						}
					}
				}
				Box.Property.dataStart(initBuild);
				option.config.designPanel = initBuild;
			}
		},
		/**
		 * 描述：设计面板组件发生变化，会触发此方法
		 * @param {String} $el	容器对象
		 * @param {String} id	发生变化的组件ID
		 * @param {String} val  发生变化所产生的值
		 * @param {Object} prop 基于id-val生成的对象，如果line-color:red=>{line:{color:red}} 
		 */
		change:function($el,id,val,prop){
			if(id == "table-title-left"){
				$el.find(".panel-header> .panel-title").css({
					"text-align":val
				});
			}
			if(id == "table-title-color"){
				$el.find(".panel-header > .panel-title").css({
					"color":val
				});
			}
			if(id == "table-title-text"){
				var option  = $el.data("option");
				var $title = $el.find(".panel-header > .panel-title");
				
				if($title.length == 1 && val!=""){
					$title.text(val);
				}else{
					$(".chart",$el)[option.chartChild=="detail"?"datagrid":"treegrid"]({title:val||false});
					$(".applyProperty ").trigger("click");
				}
				var title_css = option.config.designPanel.table.title;
				$title.css({
					"text-align":title_css.left,
					"color":title_css.color
				})
				
			}
			var option = $el.data("option");
			$.extend(true,option.config.designPanel, prop);
		}
	}
	return Desgin.control;
})