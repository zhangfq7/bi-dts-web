define(['bace'], function(Bace) {
	
	var seriesData = {
		series:{
			//"style":"background:#FFF8E4;padding-top:3px",
			className:"series",
			items:[
				{id:"series-attrs",lable:"指标:",type:"select",width:'162px',selectHTML:"<option></option>"},
				{id:"series-charts",lable:"图形:",type:"select",width:'80px',selectHTML:"<option></option>"},
				{type:"html",html:"<div class='cs-button update active' title='点击更换图形类型，指标将不再使用相同图形，您将分别对不同指标进行设置'>更换</div><div class='cs-button makeSure' title='点击默认按钮，会将下方图形作为统一生成图形标准'>默认</div>","style":"position: absolute;right: -7px;top: 28px;"}
			]
		},
		pie:{
			"title":"饼图",
			//state:"close",
			className:"seriesType",
			items:[
				{id:"pie-radius",	lable:"尺寸大小：<span>50</span>%",value:50, type:"slider",width:"190px",min:0,max:100},
				{id:"pie-centerX",	lable:"水平位置：<span>50</span>%",value:50, type:"slider",width:"190px",min:0,max:100},
				{id:"pie-centerY",	lable:"垂直位置：<span>50</span>%",value:50, type:"slider",width:"190px",min:0,max:100},
				{id:"pie-ringSize",	lable:"空心圆大小：<span>0</span>%",value:0, type:"slider",width:"190px",min:0,max:100},
				{id:"pie-showLabel",lable:"展示方式:",type:"select",width:'110px',selectHTML:"<option value= 'outer' selected>外部连接线</option><option value='inner' >饼块上显示值</option><option value='none' >不显示</option>"},
				{id:"pie-chartType",lable:"展示类型:",type:"select",width:'110px',selectHTML:"<option value= 'pie' selected>普通饼图</option><option value='rose' >玫瑰图</option>"}
			]
		},
		bar:{
			"title":"柱图",
			//state:"close",
			className:"seriesType",
			items:[
				{id:"bar-stack",  lable:"堆积展示:", type:"switchbutton", value:false},
				{id:"bar-width", lable:"柱块的宽度:", type:"spaceInput",value:'',width:"80px"},
				//{id:"bar-color", lable:"柱块的颜色:", type:"spaceInput",value:'',width:"90px"},
				{id:"bar-labelPosition",lable:"值展示方式:",type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='top'>柱图上方</option><option value='insideBottom'>柱图底部</option><option value='insideTop' >柱图顶部</option><option value='inside'>柱图内部</option><option value='left'>柱图左侧</option><option value='right'>柱图右侧</option>"},
				{id:"bar-markFuncAvg",lable:"平均值标注:",type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='line'>显示标注线</option>"},
				{id:"bar-markFuncMax",lable:"最大值标注:",type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='line'>显示标注线</option><option value='point'>显示标注点</option>"},
				{id:"bar-markFuncMin",lable:"最小值标注:",type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='line'>显示标注线</option><option value='point'>显示标注点</option>"}
			]
		},
		line:{
			"title":"线图",
			//state:"close",
			className:"seriesType",
			items:[
				{id:"line-stack", lable:"堆积展示:", type:"switchbutton", value:false},
				{id:"line-fill",  lable:"区域展示:", type:"switchbutton", value:false},
				{id:"line-smooth",lable:"平滑曲线:", type:"switchbutton", value:false},
				{id:"line-symbol",lable:"标注类型:", type:"select",width:'110px',selectHTML:"<option value='none' >无</option><option value='emptyCircle' selected>空心圆</option><option value='circle'>实心圆</option><option value='rectangle'>实心方块</option><option value='emptyRectangle'>空心方块</option><option value='triangle'>实心三角</option><option value='rectangle'>方块</option><option value='diamond'>实心菱形</option><option value='emptyDiamond'>空心菱形</option><option value='arrow'>箭头</option>"},
				{id:"line-symbolRotate",lable:"标注角度：<span>0</span>度",value:0, type:"slider",width:"190px",min:-180,max:180},
				{id:"line-symbolSize",lable:"标注大小：<span>4</span>",value:4,type:"slider",width:"190px",min:0,max:20},
				{id:"line-labelPosition",lable:"值显示方式:",type:"select",width:'110px',selectHTML:"<option value='none' >不显示</option><option value='top'>上方</option><option value='bottom'>下方</option><option value='left'>左侧</option><option value='right'>右侧</option>"},
				{id:"line-markFuncAvg",lable:"平均值标注:",type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='line'>显示标注线</option>"},
				{id:"line-markFuncMax",lable:"最大值标注:", type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='line'>显示标注线</option><option value='point'>显示标注点</option>"},
				{id:"line-markFuncMin",lable:"最小值标注:",type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='line'>显示标注线</option><option value='point'>显示标注点</option>"}
			]
		},
		scatter:{
			"title":"散点图",
			//state:"close",
			className:"seriesType",
			items:[
				{id:"scatter-symbol",  lable:"标注类型:", type:"select",width:'110px',selectHTML:"<option value='none'>默认</option><option value='emptyCircle'>空心圆</option><option value='circle' selected>实心圆</option><option value='rectangle'>实心方块</option><option value='emptyRectangle'>空心方块</option><option value='triangle'>实心三角</option><option value='rectangle'>方块</option><option value='diamond'>实心菱形</option><option value='emptyDiamond'>空心菱形</option><option value='arrow'>箭头</option>"},
				{id:"scatter-markFuncAvg",lable:"平均标注:",type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='line'>显示标注线</option>"},
				{id:"scatter-markFuncMax",lable:"最大标注:", type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='line'>显示标注线</option><option value='point'>显示标注点</option>"},
				{id:"scatter-markFuncMin",lable:"最小标注:",type:"select",width:'110px',selectHTML:"<option value='none'>不显示</option><option value='line'>显示标注线</option><option value='point'>显示标注点</option>"}
			]
		},
		radar:{
			"title":"雷达图",
			className:"seriesType",
			items:[
				{id:"radar2-fill",lable:"区域展示:", type:"switchbutton", value:false},
				{id:"radar-0-radius",	lable:"尺寸大小：<span>50</span>%",value:'50',type:"slider",width:"190px",min:0,max:100},
				{id:"radar-0-name-textStyle-fontSize", lable:"标签大小:", 	type:"spaceInput",value:12,width:"13px"},
				{id:"radar-0-name-textStyle-color",	lable:"标签颜色:",type:"color",value:"rgba(0,0,0,1)",position:"top left-60"},
				{id:"radar-0-name-dataUnit",lable:"数据单位:",type:"input",width:"120px",value:""},
			]
		},
		funnel:{
			"title":"漏斗图",
			//state:"close",
			className:"seriesType",
			items:[
				{id:"funnel-width",	lable:"图形宽度：<span>50</span>%",value:50,type:"slider",width:"190px",min:0,max:100},
				{id:"funnel-height",lable:"图形高度：<span>50</span>%",value:50,type:"slider",width:"190px",min:0,max:100},
				{id:"funnel-left",lable:"水平位置：<span>30</span>%",value:30,type:"slider",width:"190px",min:0,max:100},
				{id:"funnel-top",lable:"垂直位置：<span>30</span>%",value:30,type:"slider",width:"190px",min:0,max:100},
				{id:"funnel-labelPosition",lable:"数值展示:", type:"select",width:'110px',selectHTML:"<option value='none'>不展示</option><option value='left'>展示在左侧</option><option value='right' selected>展示在右侧</option><option value='inside'>展示在内部</option>"},
				{id:"funnel-sort",lable:"图形展示:", type:"select",width:'110px',selectHTML:"<option value='ascending'>正三角</option><option value='descending' selected>倒三角</option>"},
				{id:"funnel-funnelAlign",lable:"对齐方式:", type:"select",width:'110px',selectHTML:"<option value='left'>居左</option><option value='center' selected>居中</option><option value='right' >居右</option>"},
				{id:"funnel-gap", lable:"方块间距:", type:"spaceInput",value:0,width:"13px"}
			]
		},
		gauge:{
			"title":"仪表盘",
			//state:"close",
			className:"seriesType",
			items:[
			    {id:"gauge-radius",	lable:"尺寸大小：<span>85</span>%",value:85,type:"slider",width:"190px",min:0,max:100},
			    {id:"gauge-centerX",lable:"水平位置：<span>50</span>%",value:50,type:"slider",width:"190px",min:0,max:100},
			    {id:"gauge-centerY",lable:"垂直位置：<span>55</span>%",value:55,type:"slider",width:"190px",min:0,max:100},
			    {id:"gauge-startAngle",lable:"起始角度：<span>225</span>度",value:225,type:"slider",width:"190px",min:0,max:360},
			    {id:"gauge-endAngle",lable:"结束角度：<span>-45</span>度",value:-45,type:"slider",width:"190px",min:-180,max:360},
                {id:"gauge-axisLine-lineStyle-color-panelCloAPP",lable:"仪表颜色:",type:"spaceInput",width:"45px",value:"20",min:0,max:100},
                {id:"gauge-axisLine-lineStyle-color-panelCloA",   lable:"",  type:"color",position:"bottom left-140", value:"#228b22","style":"position:absolute;top:144px;right:17px"},
                {id:"gauge-axisLine-lineStyle-color-panelCloBPP",lable:"",type:"spaceInput",width:"45px",value:"80","style":"margin-left:51px",min:0,max:100},
                {id:"gauge-axisLine-lineStyle-color-panelCloB",   lable:"",  type:"color",position:"bottom left-140", value:"#48b","style":"position:absolute;top:174px;right:17px"},
                {id:"gauge-axisLine-lineStyle-color-panelCloCPP",lable:"",type:"spaceInput",width:"45px",value:"100","style":"margin-left:51px",min:0,max:100},
                {id:"gauge-axisLine-lineStyle-color-panelCloC",   lable:"",  type:"color",position:"bottom left-140", value:"#ff4500","style":"position:absolute;top:204px;right:17px"},
                {id:"gauge-max", lable:"最大刻度:",value:'100',type:"spaceInput",width:"90px"},
			    {id:"gauge-min", lable:"最小刻度:",value:'0',type:"spaceInput",width:"90px"},
				{id:"gauge-dataUnit",lable:"数据单位:",type:"input",width:"120px",value:""}
			]
		},
		map:{
			"title":"地图",
			//state:"close",
			className:"seriesType",
			items:[
			    {id:"map-width",lable:"尺寸大小：",value:'',type:"spaceInput",width:"90px",min:200},
			    {id:"map-left",lable:"水平位置：<span>12</span>%",value:12,type:"slider",width:"190px",min:0,max:100},
			    {id:"map-top",lable:"垂直位置：<span>10</span>%",value:10,type:"slider",width:"190px",min:0,max:100},
			    {id:"map-showLabel",lable:"地域名称:",type:"switchbutton", value:true},
			    {id:"map-roam",lable:"地图缩放:",type:"switchbutton", value:false},
			    {id:"visualMap-show",lable:"值域控件:",type:"switchbutton", value:true},
				{id:"map-dataUnit",lable:"数据单位:",type:"input",width:"120px",value:""}
			]
		},
		treemap: {
			"title": "矩形树图",
		},
		heatmap:{
			"title":"地图",
			//state:"close",
			className:"seriesType",
			items:[
				{id:"map-width",lable:"尺寸大小：",value:'',type:"spaceInput",width:"90px",min:200},
				{id:"map-left",lable:"水平位置：<span>12</span>%",value:12,type:"slider",width:"190px",min:0,max:100},
				{id:"map-top",lable:"垂直位置：<span>10</span>%",value:10,type:"slider",width:"190px",min:0,max:100},
				{id:"map-showLabel",lable:"地域名称:",type:"switchbutton", value:true},
				{id:"map-roam",lable:"地图缩放:",type:"switchbutton", value:false},
				{id:"visualMap-show",lable:"值域控件:",type:"switchbutton", value:true},
			]		
		}
	};
	
	return {
		seriesData:seriesData
	};
})