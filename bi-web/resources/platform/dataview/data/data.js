var pieData  = [{name:'衬衫',value:'15'},
				{name:'羊毛衫',value:'20'},
				{name:'雪纺衫',value:'40'},
				{name:'裤子',value:'10'}];
		
var lineBarData=[{name:'周一',group:'最高气温 ',value:111},{name:'周一',group:'最低气温',value:11}, {name:'周一',group: '超低气温',value:31}, {name:'周一',group: '太低气温',value:31},  {name:'周一',group: '超高气温',value:31},   
		  	     {name:'周二',group:'最高气温 ',value:115},{name:'周二',group:'最低气温',value:8},  {name:'周二',group: '超低气温',value:38}, {name:'周二',group: '太低气温',value:38} , {name:'周二',group: '超高气温',value:38} ,  
		  		 {name:'周三',group:'最高气温 ',value:111},{name:'周三',group:'最低气温',value:10}, {name:'周三',group:'超低气温',value:40},  {name:'周三',group:'太低气温',value:40},   {name:'周三',group:'超高气温',value:40},    
		  		 {name:'周四',group:'最高气温',value:112}, {name:'周四',group:'最低气温',value:15}, {name:'周四',group:'超低气温',value:45},  {name:'周四',group:'太低气温',value:45},   {name:'周四',group:'超高气温',value:45},    
		  		 {name:'周五',group:'最高气温 ',value:11}, {name:'周五',group:'最低气温',value:18},  {name:'周五',group:'超低气温',value:84},  {name:'周五',group:'太低气温',value:84} ,  {name:'周五',group:'超高气温',value:84} ,  
		  		 {name:'周六',group:'最高气温 ',value:17}, {name:'周六',group:'最低气温',value:12},  {name:'周六',group:'超低气温',value:42},  {name:'周六',group:'太低气温',value:42},   {name:'周六',group:'超高气温',value:42},   
		  		 {name:'周日',group:'最高气温',value:18}, {name:'周日',group:'最低气温',value:14},   {name:'周日',group:'超低气温',value:44},   {name:'周日',group:'太低气温',value:44},   {name:'周日',group:'超高气温',value:44}    
		  		 
];



var scatterData = [
	{group:'最高气温 ',value:[11,22]},
	{group:'最高气温 ',value:[21,22]},
	{group:'最高气温 ',value:[31,22]},
	{group:'最高气温 ',value:[41,22]},
	{group:'最高气温 ',value:[51,22]},

	{group:'最低气温 ',value:[111,22]},
	{group:'最低气温 ',value:[121,-22]},
	{group:'最低气温 ',value:[131,-22]},
	{group:'最低气温 ',value:[141,-22]},
	{group:'最低气温 ',value:[151,22]}
];

var gaugeData  = [{name:'完成率',value:30}]

var mapLineData = [
{name: '北京',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '天津',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '上海',value: 1111,group:'合肥'},
{name: '杭州',value: 1111,group:'合肥'},
{name: '重庆',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '河北',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '河南',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '云南',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '辽宁',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '黑龙江',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '湖南',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '安徽',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '山东',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '新疆',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '江苏',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '浙江',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '江西',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '湖北',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '广西',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '甘肃',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '山西',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '内蒙古',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '陕西',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '吉林',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '福建',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '贵州',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '广东',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '青海',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '西藏',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '四川',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '宁夏',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '海南',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '台湾',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '香港',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '澳门',value: Math.round(Math.random()*1000),group:'合肥'},
{name: '合肥',value: Math.round(Math.random()*1000),group:'合肥'},


{name: '北京',value: Math.round(Math.random()*1000),group:'上海'},
{name: '天津',value: Math.round(Math.random()*1000),group:'上海'},
{name: '上海',value: 2222,group:'上海'},
{name: '重庆',value: Math.round(Math.random()*1000),group:'上海'},
{name: '河北',value: Math.round(Math.random()*1000),group:'上海'},
{name: '河南',value: Math.round(Math.random()*1000),group:'上海'},
{name: '云南',value: Math.round(Math.random()*1000),group:'上海'},
{name: '辽宁',value: Math.round(Math.random()*1000),group:'上海'},
{name: '黑龙江',value: Math.round(Math.random()*1000),group:'上海'},
{name: '湖南',value: Math.round(Math.random()*1000),group:'上海'},
{name: '安徽',value: Math.round(Math.random()*1000),group:'上海'},
{name: '山东',value: Math.round(Math.random()*1000),group:'上海'},
{name: '新疆',value: Math.round(Math.random()*1000),group:'上海'},
{name: '江苏',value: Math.round(Math.random()*1000),group:'上海'},
{name: '浙江',value: Math.round(Math.random()*1000),group:'上海'},
{name: '江西',value: Math.round(Math.random()*1000),group:'上海'},
{name: '湖北',value: Math.round(Math.random()*1000),group:'上海'},
{name: '广西',value: Math.round(Math.random()*1000),group:'上海'},
{name: '甘肃',value: Math.round(Math.random()*1000),group:'上海'},
{name: '山西',value: Math.round(Math.random()*1000),group:'上海'},
{name: '内蒙古',value: Math.round(Math.random()*1000),group:'上海'},
{name: '陕西',value: Math.round(Math.random()*1000),group:'上海'},
{name: '吉林',value: Math.round(Math.random()*1000),group:'上海'},
{name: '福建',value: Math.round(Math.random()*1000),group:'上海'},
{name: '贵州',value: Math.round(Math.random()*1000),group:'上海'},
{name: '广东',value: Math.round(Math.random()*1000),group:'上海'},
{name: '青海',value: Math.round(Math.random()*1000),group:'上海'},
{name: '西藏',value: Math.round(Math.random()*1000),group:'上海'},
{name: '四川',value: Math.round(Math.random()*1000),group:'上海'},
{name: '宁夏',value: Math.round(Math.random()*1000),group:'上海'},
{name: '海南',value: Math.round(Math.random()*1000),group:'上海'},
{name: '台湾',value: Math.round(Math.random()*1000),group:'上海'},
{name: '香港',value: Math.round(Math.random()*1000),group:'上海'},
{name: '澳门',value: Math.round(Math.random()*1000),group:'上海'},


{name: '北京',value: Math.round(Math.random()*1000),group:'南京'},
{name: '天津',value: Math.round(Math.random()*1000),group:'南京'},
{name: '上海',value: 3333,group:'南京'},
{name: '重庆',value: Math.round(Math.random()*1000),group:'南京'},
{name: '河北',value: Math.round(Math.random()*1000),group:'南京'},
{name: '河南',value: Math.round(Math.random()*1000),group:'南京'},
{name: '云南',value: Math.round(Math.random()*1000),group:'南京'},
{name: '辽宁',value: Math.round(Math.random()*1000),group:'南京'},
{name: '黑龙江',value: Math.round(Math.random()*1000),group:'南京'},
{name: '湖南',value: Math.round(Math.random()*1000),group:'南京'},
{name: '安徽',value: Math.round(Math.random()*1000),group:'南京'},
{name: '山东',value: Math.round(Math.random()*1000),group:'南京'},
{name: '新疆',value: Math.round(Math.random()*1000),group:'南京'},
{name: '江苏',value: Math.round(Math.random()*1000),group:'南京'},
{name: '浙江',value: Math.round(Math.random()*1000),group:'南京'},
{name: '江西',value: Math.round(Math.random()*1000),group:'南京'},
{name: '湖北',value: Math.round(Math.random()*1000),group:'南京'},
{name: '广西',value: Math.round(Math.random()*1000),group:'南京'},
{name: '甘肃',value: Math.round(Math.random()*1000),group:'南京'},
{name: '山西',value: Math.round(Math.random()*1000),group:'南京'},
{name: '内蒙古',value: Math.round(Math.random()*1000),group:'南京'},
{name: '陕西',value: Math.round(Math.random()*1000),group:'南京'},
{name: '吉林',value: Math.round(Math.random()*1000),group:'南京'},
{name: '福建',value: Math.round(Math.random()*1000),group:'南京'},
{name: '贵州',value: Math.round(Math.random()*1000),group:'南京'},
{name: '广东',value: Math.round(Math.random()*1000),group:'南京'},
{name: '青海',value: Math.round(Math.random()*1000),group:'南京'},
{name: '西藏',value: Math.round(Math.random()*1000),group:'南京'},
{name: '四川',value: Math.round(Math.random()*1000),group:'南京'},
{name: '宁夏',value: Math.round(Math.random()*1000),group:'南京'},
{name: '海南',value: Math.round(Math.random()*1000),group:'南京'},
{name: '台湾',value: Math.round(Math.random()*1000),group:'南京'},
{name: '香港',value: Math.round(Math.random()*1000),group:'南京'},
{name: '澳门',value: Math.round(Math.random()*1000),group:'南京'}
]

var mapData = [
{name: '北京',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '天津',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '上海',value: 1111,group:'iphone4'},
{name: '杭州',value: 1111,group:'iphone4'},
{name: '重庆',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '河北',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '河南',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '云南',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '辽宁',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '黑龙江',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '湖南',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '安徽',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '山东',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '新疆',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '江苏',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '浙江',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '江西',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '湖北',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '广西',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '甘肃',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '山西',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '内蒙古',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '陕西',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '吉林',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '福建',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '贵州',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '广东',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '青海',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '西藏',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '四川',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '宁夏',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '海南',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '台湾',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '香港',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '澳门',value: Math.round(Math.random()*1000),group:'iphone4'},
{name: '合肥',value: Math.round(Math.random()*1000),group:'iphone4'},


{name: '北京',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '天津',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '上海',value: 2222,group:'iphone5'},
{name: '重庆',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '河北',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '河南',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '云南',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '辽宁',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '黑龙江',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '湖南',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '安徽',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '山东',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '新疆',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '江苏',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '浙江',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '江西',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '湖北',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '广西',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '甘肃',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '山西',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '内蒙古',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '陕西',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '吉林',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '福建',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '贵州',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '广东',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '青海',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '西藏',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '四川',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '宁夏',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '海南',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '台湾',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '香港',value: Math.round(Math.random()*1000),group:'iphone5'},
{name: '澳门',value: Math.round(Math.random()*1000),group:'iphone5'},


{name: '北京',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '天津',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '上海',value: 3333,group:'iphone6'},
{name: '重庆',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '河北',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '河南',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '云南',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '辽宁',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '黑龙江',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '湖南',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '安徽',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '山东',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '新疆',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '江苏',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '浙江',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '江西',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '湖北',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '广西',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '甘肃',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '山西',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '内蒙古',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '陕西',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '吉林',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '福建',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '贵州',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '广东',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '青海',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '西藏',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '四川',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '宁夏',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '海南',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '台湾',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '香港',value: Math.round(Math.random()*1000),group:'iphone6'},
{name: '澳门',value: Math.round(Math.random()*1000),group:'iphone6'}

]
var pm = [{name: "海门", value: 19,group:'pm2.5'}];
var pm1 = [{name: "营口", value: 9,group:'pm2.5'},
{name: "鄂尔多斯", value: 12,group:'pm2.5'},
{name: "招远", value: 12,group:'pm2.5'},
{name: "舟山", value: 12,group:'pm2.5'},
{name: "齐齐哈尔", value: 14,group:'pm2.5'},
{name: "盐城", value: 15,group:'pm2.5'},
{name: "赤峰", value: 16,group:'pm2.5'},
{name: "青岛", value: 18,group:'pm2.5'},
{name: "乳山", value: 18,group:'pm2.5'},
{name: "金昌", value: 19,group:'pm2.5'},
{name: "泉州", value: 21,group:'pm2.5'},
{name: "莱西", value: 21,group:'pm2.5'},
{name: "日照", value: 21,group:'pm2.5'},
{name: "胶南", value: 22,group:'pm2.5'},
{name: "南通", value: 23,group:'pm2.5'},
{name: "拉萨", value: 24,group:'pm2.5'},
{name: "云浮", value: 24,group:'pm2.5'},
{name: "梅州", value: 25,group:'pm2.5'},
{name: "文登", value: 25,group:'pm2.5'},
{name: "上海", value: 25,group:'pm2.5'},
{name: "攀枝花", value: 25,group:'pm2.5'},
{name: "威海", value: 25,group:'pm2.5'},
{name: "承德", value: 25,group:'pm2.5'},
{name: "厦门", value: 26,group:'pm2.5'},
{name: "汕尾", value: 26,group:'pm2.5'},
{name: "潮州", value: 26,group:'pm2.5'},
{name: "丹东", value: 27,group:'pm2.5'},
{name: "太仓", value: 27,group:'pm2.5'},
{name: "曲靖", value: 27,group:'pm2.5'},
{name: "烟台", value: 28,group:'pm2.5'},
{name: "福州", value: 29,group:'pm2.5'},
{name: "瓦房店", value: 30,group:'pm2.5'},
{name: "即墨", value: 30,group:'pm2.5'},
{name: "抚顺", value: 31,group:'pm2.5'},
{name: "玉溪", value: 31,group:'pm2.5'},
{name: "张家口", value: 31,group:'pm2.5'},
{name: "阳泉", value: 31,group:'pm2.5'},
{name: "莱州", value: 32,group:'pm2.5'},
{name: "湖州", value: 32,group:'pm2.5'},
{name: "汕头", value: 32,group:'pm2.5'},
{name: "昆山", value: 33,group:'pm2.5'},
{name: "宁波", value: 33,group:'pm2.5'},
{name: "湛江", value: 33,group:'pm2.5'},
{name: "揭阳", value: 34,group:'pm2.5'},
{name: "荣成", value: 34,group:'pm2.5'},
{name: "连云港", value: 35,group:'pm2.5'},
{name: "葫芦岛", value: 35,group:'pm2.5'},
{name: "常熟", value: 36,group:'pm2.5'},
{name: "东莞", value: 36,group:'pm2.5'},
{name: "河源", value: 36,group:'pm2.5'},
{name: "淮安", value: 36,group:'pm2.5'},
{name: "泰州", value: 36,group:'pm2.5'},
{name: "南宁", value: 37,group:'pm2.5'},
{name: "营口", value: 37,group:'pm2.5'},
{name: "惠州", value: 37,group:'pm2.5'},
{name: "江阴", value: 37,group:'pm2.5'},
{name: "蓬莱", value: 37,group:'pm2.5'},
{name: "韶关", value: 38,group:'pm2.5'},
{name: "嘉峪关", value: 38,group:'pm2.5'},
{name: "广州", value: 38,group:'pm2.5'},
{name: "延安", value: 38,group:'pm2.5'},
{name: "太原", value: 39,group:'pm2.5'},
{name: "清远", value: 39,group:'pm2.5'},
{name: "中山", value: 39,group:'pm2.5'},
{name: "昆明", value: 39,group:'pm2.5'},
{name: "寿光", value: 40,group:'pm2.5'},
{name: "盘锦", value: 40,group:'pm2.5'},
{name: "长治", value: 41,group:'pm2.5'},
{name: "深圳", value: 41,group:'pm2.5'},
{name: "珠海", value: 42,group:'pm2.5'},
{name: "宿迁", value: 43,group:'pm2.5'},
{name: "咸阳", value: 43,group:'pm2.5'},
{name: "铜川", value: 44,group:'pm2.5'},
{name: "平度", value: 44,group:'pm2.5'},
{name: "佛山", value: 44,group:'pm2.5'},
{name: "海口", value: 44,group:'pm2.5'},
{name: "江门", value: 45,group:'pm2.5'},
{name: "章丘", value: 45,group:'pm2.5'},
{name: "肇庆", value: 46,group:'pm2.5'},
{name: "大连", value: 47,group:'pm2.5'},
{name: "临汾", value: 47,group:'pm2.5'},
{name: "吴江", value: 47,group:'pm2.5'},
{name: "石嘴山", value: 49,group:'pm2.5'},
{name: "沈阳", value: 50,group:'pm2.5'},
{name: "苏州", value: 50,group:'pm2.5'},
{name: "茂名", value: 50,group:'pm2.5'},
{name: "嘉兴", value: 51,group:'pm2.5'},
{name: "长春", value: 51,group:'pm2.5'},
{name: "胶州", value: 52,group:'pm2.5'},
{name: "银川", value: 52,group:'pm2.5'},
{name: "张家港", value: 52,group:'pm2.5'},
{name: "三门峡", value: 53,group:'pm2.5'},
{name: "锦州", value: 54,group:'pm2.5'},
{name: "南昌", value: 54,group:'pm2.5'},
{name: "柳州", value: 54,group:'pm2.5'},
{name: "三亚", value: 54,group:'pm2.5'},
{name: "自贡", value: 56,group:'pm2.5'},
{name: "吉林", value: 56,group:'pm2.5'},
{name: "阳江", value: 57,group:'pm2.5'},
{name: "泸州", value: 57,group:'pm2.5'},
{name: "西宁", value: 57,group:'pm2.5'},
{name: "宜宾", value: 58,group:'pm2.5'},
{name: "呼和浩特", value: 58,group:'pm2.5'},
{name: "成都", value: 58,group:'pm2.5'},
{name: "大同", value: 58,group:'pm2.5'},
{name: "镇江", value: 59,group:'pm2.5'},
{name: "桂林", value: 59,group:'pm2.5'},
{name: "张家界", value: 59,group:'pm2.5'},
{name: "宜兴", value: 59,group:'pm2.5'},
{name: "北海", value: 60,group:'pm2.5'},
{name: "西安", value: 61,group:'pm2.5'},
{name: "金坛", value: 62,group:'pm2.5'},
{name: "东营", value: 62,group:'pm2.5'},
{name: "牡丹江", value: 63,group:'pm2.5'},
{name: "遵义", value: 63,group:'pm2.5'},
{name: "绍兴", value: 63,group:'pm2.5'},
{name: "扬州", value: 64,group:'pm2.5'},
{name: "常州", value: 64,group:'pm2.5'},
{name: "潍坊", value: 65,group:'pm2.5'},
{name: "重庆", value: 66,group:'pm2.5'},
{name: "台州", value: 67,group:'pm2.5'},
{name: "南京", value: 67,group:'pm2.5'},
{name: "滨州", value: 70,group:'pm2.5'},
{name: "贵阳", value: 71,group:'pm2.5'},
{name: "无锡", value: 71,group:'pm2.5'},
{name: "本溪", value: 71,group:'pm2.5'},
{name: "克拉玛依", value: 72,group:'pm2.5'},
{name: "渭南", value: 72,group:'pm2.5'},
{name: "马鞍山", value: 72,group:'pm2.5'},
{name: "宝鸡", value: 72,group:'pm2.5'},
{name: "焦作", value: 75,group:'pm2.5'},
{name: "句容", value: 75,group:'pm2.5'},
{name: "北京", value: 79,group:'pm2.5'},
{name: "徐州", value: 79,group:'pm2.5'},
{name: "衡水", value: 80,group:'pm2.5'},
{name: "包头", value: 80,group:'pm2.5'},
{name: "绵阳", value: 80,group:'pm2.5'},
{name: "乌鲁木齐", value: 84,group:'pm2.5'},
{name: "枣庄", value: 84,group:'pm2.5'},
{name: "杭州", value: 84,group:'pm2.5'},
{name: "淄博", value: 85,group:'pm2.5'},
{name: "鞍山", value: 86,group:'pm2.5'},
{name: "溧阳", value: 86,group:'pm2.5'},
{name: "库尔勒", value: 86,group:'pm2.5'},
{name: "安阳", value: 90,group:'pm2.5'},
{name: "开封", value: 90,group:'pm2.5'},
{name: "济南", value: 92,group:'pm2.5'},
{name: "德阳", value: 93,group:'pm2.5'},
{name: "温州", value: 95,group:'pm2.5'},
{name: "九江", value: 96,group:'pm2.5'},
{name: "邯郸", value: 98,group:'pm2.5'},
{name: "临安", value: 99,group:'pm2.5'},
{name: "兰州", value: 99,group:'pm2.5'},
{name: "沧州", value: 100,group:'pm2.5'},
{name: "临沂", value: 103,group:'pm2.5'},
{name: "南充", value: 104,group:'pm2.5'},
{name: "天津", value: 105,group:'pm2.5'},
{name: "富阳", value: 106,group:'pm2.5'},
{name: "泰安", value: 112,group:'pm2.5'},
{name: "诸暨", value: 112,group:'pm2.5'},
{name: "郑州", value: 113,group:'pm2.5'},
{name: "哈尔滨", value: 114,group:'pm2.5'},
{name: "聊城", value: 116,group:'pm2.5'},
{name: "芜湖", value: 117,group:'pm2.5'},
{name: "唐山", value: 119,group:'pm2.5'},
{name: "平顶山", value: 119,group:'pm2.5'},
{name: "邢台", value: 119,group:'pm2.5'},
{name: "德州", value: 120,group:'pm2.5'},
{name: "济宁", value: 120,group:'pm2.5'},
{name: "荆州", value: 127,group:'pm2.5'},
{name: "宜昌", value: 130,group:'pm2.5'},
{name: "丽水", value: 133,group:'pm2.5'},
{name: "洛阳", value: 134,group:'pm2.5'},
{name: "秦皇岛", value: 136,group:'pm2.5'},
{name: "株洲", value: 143,group:'pm2.5'},
{name: "石家庄", value: 147,group:'pm2.5'},
{name: "莱芜", value: 148,group:'pm2.5'},
{name: "常德", value: 152,group:'pm2.5'},
{name: "保定", value: 153,group:'pm2.5'},
{name: "湘潭", value: 154,group:'pm2.5'},
{name: "金华", value: 157,group:'pm2.5'},
{name: "岳阳", value: 169,group:'pm2.5'},
{name: "长沙", value: 175,group:'pm2.5'},
{name: "衢州", value: 177,group:'pm2.5'},
{name: "廊坊", value: 193,group:'pm2.5'},
{name: "菏泽", value: 194,group:'pm2.5'},
{name: "合肥", value: 229,group:'pm2.5'},
{name: "武汉", value: 273,group:'pm2.5'},
{name: "大庆", value: 279,group:'pm2.5'}]

var geoCoord = {
	"北京": ["116.395645", "39.929986"],
	"上海": ["121.487899", "31.249162"],
	"天津": ["117.210813", "39.14393"],
	"重庆": ["106.530635", "29.544606"],
	"安徽": ["117.216005", "31.859252"],
	"合肥": ["117.282699", "31.866942"],
	"安庆": ["117.058739", "30.537898"],
	"蚌埠": ["117.35708", "32.929499"],
	"亳州": ["115.787928", "33.871211"],
	"巢湖": ["117.88049", "31.608733"],
	"池州": ["117.494477", "30.660019"],
	"滁州": ["118.32457", "32.317351"],
	"阜阳": ["115.820932", "32.901211"],
	"淮北": ["116.791447", "33.960023"],
	"淮南": ["117.018639", "32.642812"],
	"黄山": ["118.29357", "29.734435"],
	"六安": ["116.505253", "31.755558"],
	"马鞍山": ["118.515882", "31.688528"],
	"宿州": ["116.988692", "33.636772"],
	"铜陵": ["117.819429", "30.94093"],
	"芜湖": ["118.384108", "31.36602"],
	"宣城": ["118.752096", "30.951642"],
	"福建": ["117.984943", "26.050118"],
	"福州": ["119.330221", "26.047125"],
	"龙岩": ["117.017997", "25.078685"],
	"南平": ["118.181883", "26.643626"],
	"宁德": ["119.542082", "26.656527"],
	"莆田": ["119.077731", "25.44845"],
	"泉州": ["118.600362", "24.901652"],
	"三明": ["117.642194", "26.270835"],
	"厦门": ["118.103886", "24.489231"],
	"漳州": ["117.676205", "24.517065"],
	"甘肃": ["102.457625", "38.103267"],
	"兰州": ["103.823305", "36.064226"],
	"白银": ["104.171241", "36.546682"],
	"定西": ["104.626638", "35.586056"],
	"甘南州": ["102.917442", "34.992211"],
	"嘉峪关": ["98.281635", "39.802397"],
	"金昌": ["102.208126", "38.516072"],
	"酒泉": ["98.508415", "39.741474"],
	"临夏州": ["103.215249", "35.598514"],
	"陇南": ["104.934573", "33.39448"],
	"平凉": ["106.688911", "35.55011"],
	"庆阳": ["107.644227", "35.726801"],
	"天水": ["105.736932", "34.584319"],
	"武威": ["102.640147", "37.933172"],
	"张掖": ["100.459892", "38.93932"],
	"广东": ["113.394818", "23.408004"],
	"广州": ["113.30765", "23.120049"],
	"潮州": ["116.630076", "23.661812"],
	"东莞": ["113.763434", "23.043024"],
	"佛山": ["113.134026", "23.035095"],
	"河源": ["114.713721", "23.757251"],
	"惠州": ["114.410658", "23.11354"],
	"江门": ["113.078125", "22.575117"],
	"揭阳": ["116.379501", "23.547999"],
	"茂名": ["110.931245", "21.668226"],
	"梅州": ["116.126403", "24.304571"],
	"清远": ["113.040773", "23.698469"],
	"汕头": ["116.72865", "23.383908"],
	"汕尾": ["115.372924", "22.778731"],
	"韶关": ["113.594461", "24.80296"],
	"深圳": ["114.025974", "22.546054"],
	"阳江": ["111.97701", "21.871517"],
	"云浮": ["112.050946", "22.937976"],
	"湛江": ["110.365067", "21.257463"],
	"肇庆": ["112.479653", "23.078663"],
	"中山": ["113.42206", "22.545178"],
	"珠海": ["113.562447", "22.256915"],
	"广西": ["108.924274", "23.552255"],
	"南宁": ["108.297234", "22.806493"],
	"百色": ["106.631821", "23.901512"],
	"北海": ["109.122628", "21.472718"],
	"崇左": ["107.357322", "22.415455"],
	"防城港": ["108.351791", "21.617398"],
	"桂林": ["110.26092", "25.262901"],
	"贵港": ["109.613708", "23.103373"],
	"河池": ["108.069948", "24.699521"],
	"贺州": ["111.552594", "24.411054"],
	"来宾": ["109.231817", "23.741166"],
	"柳州": ["109.422402", "24.329053"],
	"钦州": ["108.638798", "21.97335"],
	"梧州": ["111.305472", "23.485395"],
	"玉林": ["110.151676", "22.643974"],
	"贵州": ["106.734996", "26.902826"],
	"贵阳": ["106.709177", "26.629907"],
	"安顺": ["105.92827", "26.228595"],
	"毕节地区": ["105.300492", "27.302612"],
	"六盘水": ["104.852087", "26.591866"],
	"铜仁地区": ["109.196161", "27.726271"],
	"遵义": ["106.93126", "27.699961"],
	"黔西南州": ["104.900558", "25.095148"],
	"黔东南州": ["107.985353", "26.583992"],
	"黔南州": ["107.523205", "26.264536"],
	"海南": ["109.733755", "19.180501"],
	"海口": ["110.330802", "20.022071"],
	"白沙": ["109.358586", "19.216056"],
	"保亭": ["109.656113", "18.597592"],
	"昌江": ["109.0113", "19.222483"],
	"儋州": ["109.413973", "19.571153"],
	"澄迈": ["109.996736", "19.693135"],
	"东方": ["108.85101", "18.998161"],
	"定安": ["110.32009", "19.490991"],
	"琼海": ["110.414359", "19.21483"],
	"琼中": ["109.861849", "19.039771"],
	"乐东": ["109.062698", "18.658614"],
	"临高": ["109.724101", "19.805922"],
	"陵水": ["109.948661", "18.575985"],
	"三亚": ["109.522771", "18.257776"],
	"屯昌": ["110.063364", "19.347749"],
	"万宁": ["110.292505", "18.839886"],
	"文昌": ["110.780909", "19.750947"],
	"五指山": ["109.51775", "18.831306"],
	"河北": ["115.661434", "38.61384"],
	"石家庄": ["114.522082", "38.048958"],
	"保定": ["115.49481", "38.886565"],
	"沧州": ["116.863806", "38.297615"],
	"承德": ["117.933822", "40.992521"],
	"邯郸": ["114.482694", "36.609308"],
	"衡水": ["115.686229", "37.746929"],
	"廊坊": ["116.703602", "39.518611"],
	"秦皇岛": ["119.604368", "39.945462"],
	"唐山": ["118.183451", "39.650531"],
	"邢台": ["114.520487", "37.069531"],
	"张家口": ["114.893782", "40.811188"],
	"河南": ["113.486804", "34.157184"],
	"郑州": ["113.649644", "34.75661"],
	"安阳": ["114.351807", "36.110267"],
	"鹤壁": ["114.29777", "35.755426"],
	"焦作": ["113.211836", "35.234608"],
	"开封": ["114.351642", "34.801854"],
	"洛阳": ["112.447525", "34.657368"],
	"漯河": ["114.046061", "33.576279"],
	"南阳": ["112.542842", "33.01142"],
	"平顶山": ["113.300849", "33.745301"],
	"濮阳": ["115.026627", "35.753298"],
	"三门峡": ["111.181262", "34.78332"],
	"商丘": ["115.641886", "34.438589"],
	"新乡": ["113.91269", "35.307258"],
	"信阳": ["114.085491", "32.128582"],
	"许昌": ["113.835312", "34.02674"],
	"周口": ["114.654102", "33.623741"],
	"驻马店": ["114.049154", "32.983158"],
	"黑龙江": ["128.047414", "47.356592"],
	"哈尔滨": ["126.657717", "45.773225"],
	"大庆": ["125.02184", "46.596709"],
	"大兴安岭地区": ["124.196104", "51.991789"],
	"鹤岗": ["130.292472", "47.338666"],
	"黑河": ["127.50083", "50.25069"],
	"鸡西": ["130.941767", "45.32154"],
	"佳木斯": ["130.284735", "46.81378"],
	"牡丹江": ["129.608035", "44.588521"],
	"七台河": ["131.019048", "45.775005"],
	"齐齐哈尔": ["123.987289", "47.3477"],
	"双鸭山": ["131.171402", "46.655102"],
	"绥化": ["126.989095", "46.646064"],
	"伊春": ["128.910766", "47.734685"],
	"湖北": ["112.410562", "31.209316"],
	"武汉": ["114.3162", "30.581084"],
	"鄂州": ["114.895594", "30.384439"],
	"恩施": ["109.517433", "30.308978"],
	"黄冈": ["114.906618", "30.446109"],
	"黄石": ["115.050683", "30.216127"],
	"荆门": ["112.21733", "31.042611"],
	"荆州": ["112.241866", "30.332591"],
	"潜江": ["112.768768", "30.343116"],
	"神农架林区": ["110.487231", "31.595768"],
	"十堰": ["110.801229", "32.636994"],
	"随州": ["113.379358", "31.717858"],
	"天门": ["113.12623", "30.649047"],
	"仙桃": ["113.387448", "30.293966"],
	"咸宁": ["114.300061", "29.880657"],
	"襄阳": ["112.176326", "32.094934"],
	"孝感": ["113.935734", "30.927955"],
	"宜昌": ["111.310981", "30.732758"],
	"湖南": ["111.720664", "27.695864"],
	"长沙": ["112.979353", "28.213478"],
	"常德": ["111.653718", "29.012149"],
	"郴州": ["113.037704", "25.782264"],
	"衡阳": ["112.583819", "26.898164"],
	"怀化": ["109.986959", "27.557483"],
	"娄底": ["111.996396", "27.741073"],
	"邵阳": ["111.461525", "27.236811"],
	"湘潭": ["112.935556", "27.835095"],
	"湘西州": ["109.745746", "28.317951"],
	"益阳": ["112.366547", "28.588088"],
	"永州": ["111.614648", "26.435972"],
	"岳阳": ["113.146196", "29.378007"],
	"张家界": ["110.48162", "29.124889"],
	"株洲": ["113.131695", "27.827433"],
	"江苏": ["119.368489", "33.013797"],
	"南京": ["118.778074", "32.057236"],
	"常州": ["119.981861", "31.771397"],
	"淮安": ["119.030186", "33.606513"],
	"连云港": ["119.173872", "34.601549"],
	"南通": ["120.873801", "32.014665"],
	"苏州": ["120.619907", "31.317987"],
	"宿迁": ["118.296893", "33.95205"],
	"泰州": ["119.919606", "32.476053"],
	"无锡": ["120.305456", "31.570037"],
	"徐州": ["117.188107", "34.271553"],
	"盐城": ["120.148872", "33.379862"],
	"扬州": ["119.427778", "32.408505"],
	"镇江": ["119.455835", "32.204409"],
	"江西": ["115.676082", "27.757258"],
	"南昌": ["115.893528", "28.689578"],
	"抚州": ["116.360919", "27.954545"],
	"赣州": ["114.935909", "25.845296"],
	"吉安": ["114.992039", "27.113848"],
	"景德镇": ["117.186523", "29.303563"],
	"九江": ["115.999848", "29.71964"],
	"萍乡": ["113.859917", "27.639544"],
	"上饶": ["117.955464", "28.457623"],
	"新余": ["114.947117", "27.822322"],
	"宜春": ["114.400039", "27.81113"],
	"鹰潭": ["117.03545", "28.24131"],
	"吉林": ["126.262876", "43.678846"],
	"长春": ["125.313642", "43.898338"],
	"白城": ["122.840777", "45.621086"],
	"白山": ["126.435798", "41.945859"],
	"吉林市": ["126.564544", "43.871988"],
	"辽源": ["125.133686", "42.923303"],
	"四平": ["124.391382", "43.175525"],
	"松原": ["124.832995", "45.136049"],
	"通化": ["125.94265", "41.736397"],
	"延边": ["129.485902", "42.896414"],
	"辽宁": ["122.753592", "41.6216"],
	"沈阳": ["123.432791", "41.808645"],
	"鞍山": ["123.007763", "41.118744"],
	"本溪": ["123.778062", "41.325838"],
	"朝阳": ["120.446163", "41.571828"],
	"大连": ["121.593478", "38.94871"],
	"丹东": ["124.338543", "40.129023"],
	"抚顺": ["123.92982", "41.877304"],
	"阜新": ["121.660822", "42.01925"],
	"葫芦岛": ["120.860758", "40.74303"],
	"锦州": ["121.147749", "41.130879"],
	"辽阳": ["123.172451", "41.273339"],
	"盘锦": ["122.073228", "41.141248"],
	"铁岭": ["123.85485", "42.299757"],
	"营口": ["122.233391", "40.668651"],
	"内蒙古": ["114.415868", "43.468238"],
	"呼和浩特": ["111.660351", "40.828319"],
	"阿拉善盟": ["105.695683", "38.843075"],
	"包头": ["109.846239", "40.647119"],
	"巴彦淖尔": ["107.423807", "40.76918"],
	"赤峰": ["118.930761", "42.297112"],
	"鄂尔多斯": ["109.993706", "39.81649"],
	"呼伦贝尔": ["119.760822", "49.201636"],
	"通辽": ["122.260363", "43.633756"],
	"乌海": ["106.831999", "39.683177"],
	"乌兰察布": ["113.112846", "41.022363"],
	"锡林郭勒盟": ["116.02734", "43.939705"],
	"兴安盟": ["122.048167", "46.083757"],
	"宁夏": ["106.155481", "37.321323"],
	"银川": ["106.206479", "38.502621"],
	"固原": ["106.285268", "36.021523"],
	"石嘴山": ["106.379337", "39.020223"],
	"吴忠": ["106.208254", "37.993561"],
	"中卫": ["105.196754", "37.521124"],
	"青海": ["96.202544", "35.499761"],
	"西宁": ["101.767921", "36.640739"],
	"果洛州": ["100.223723", "34.480485"],
	"海东地区": ["102.085207", "36.51761"],
	"海北州": ["100.879802", "36.960654"],
	"海南州": ["100.624066", "36.284364"],
	"海西州": ["97.342625", "37.373799"],
	"黄南州": ["102.0076", "35.522852"],
	"玉树州": ["97.013316", "33.00624"],
	"山东": ["118.527663", "36.09929"],
	"济南": ["117.024967", "36.682785"],
	"滨州": ["117.968292", "37.405314"],
	"东营": ["118.583926", "37.487121"],
	"德州": ["116.328161", "37.460826"],
	"菏泽": ["115.46336", "35.26244"],
	"济宁": ["116.600798", "35.402122"],
	"莱芜": ["117.684667", "36.233654"],
	"聊城": ["115.986869", "36.455829"],
	"临沂": ["118.340768", "35.072409"],
	"青岛": ["120.384428", "36.105215"],
	"日照": ["119.50718", "35.420225"],
	"泰安": ["117.089415", "36.188078"],
	"威海": ["122.093958", "37.528787"],
	"潍坊": ["119.142634", "36.716115"],
	"烟台": ["121.309555", "37.536562"],
	"枣庄": ["117.279305", "34.807883"],
	"淄博": ["118.059134", "36.804685"],
	"山西": ["112.515496", "37.866566"],
	"太原": ["112.550864", "37.890277"],
	"长治": ["113.120292", "36.201664"],
	"大同": ["113.290509", "40.113744"],
	"晋城": ["112.867333", "35.499834"],
	"晋中": ["112.738514", "37.693362"],
	"临汾": ["111.538788", "36.099745"],
	"吕梁": ["111.143157", "37.527316"],
	"朔州": ["112.479928", "39.337672"],
	"忻州": ["112.727939", "38.461031"],
	"阳泉": ["113.569238", "37.869529"],
	"运城": ["111.006854", "35.038859"],
	"陕西": ["109.503789", "35.860026"],
	"西安": ["108.953098", "34.2778"],
	"安康": ["109.038045", "32.70437"],
	"宝鸡": ["107.170645", "34.364081"],
	"汉中": ["107.045478", "33.081569"],
	"商洛": ["109.934208", "33.873907"],
	"铜川": ["108.968067", "34.908368"],
	"渭南": ["109.483933", "34.502358"],
	"咸阳": ["108.707509", "34.345373"],
	"延安": ["109.50051", "36.60332"],
	"榆林": ["109.745926", "38.279439"],
	"四川": ["102.89916", "30.367481"],
	"成都": ["104.067923", "30.679943"],
	"阿坝州": ["102.228565", "31.905763"],
	"巴中": ["106.757916", "31.869189"],
	"达州": ["107.494973", "31.214199"],
	"德阳": ["104.402398", "31.13114"],
	"甘孜州": ["101.969232", "30.055144"],
	"广安": ["106.63572", "30.463984"],
	"广元": ["105.819687", "32.44104"],
	"乐山": ["103.760824", "29.600958"],
	"凉山州": ["102.259591", "27.892393"],
	"泸州": ["105.44397", "28.89593"],
	"南充": ["106.105554", "30.800965"],
	"眉山": ["103.84143", "30.061115"],
	"绵阳": ["104.705519", "31.504701"],
	"内江": ["105.073056", "29.599462"],
	"攀枝花": ["101.722423", "26.587571"],
	"遂宁": ["105.564888", "30.557491"],
	"雅安": ["103.009356", "29.999716"],
	"宜宾": ["104.633019", "28.769675"],
	"资阳": ["104.63593", "30.132191"],
	"自贡": ["104.776071", "29.359157"],
	"西藏": ["89.137982", "31.367315"],
	"拉萨": ["91.111891", "29.662557"],
	"阿里地区": ["81.107669", "30.404557"],
	"昌都地区": ["97.185582", "31.140576"],
	"林芝地区": ["94.349985", "29.666941"],
	"那曲地区": ["92.067018", "31.48068"],
	"日喀则地区": ["88.891486", "29.269023"],
	"山南地区": ["91.750644", "29.229027"],
	"新疆": ["85.614899", "42.127001"],
	"乌鲁木齐": ["87.564988", "43.84038"],
	"阿拉尔": ["81.291737", "40.61568"],
	"阿克苏地区": ["80.269846", "41.171731"],
	"阿勒泰地区": ["88.137915", "47.839744"],
	"巴音郭楞": ["86.121688", "41.771362"],
	"博尔塔拉州": ["82.052436", "44.913651"],
	"昌吉州": ["87.296038", "44.007058"],
	"哈密地区": ["93.528355", "42.858596"],
	"和田地区": ["79.930239", "37.116774"],
	"喀什地区": ["75.992973", "39.470627"],
	"克拉玛依": ["84.88118", "45.594331"],
	"克孜勒苏州": ["76.137564", "39.750346"],
	"石河子": ["86.041865", "44.308259"],
	"塔城地区": ["82.974881", "46.758684"],
	"图木舒克": ["79.198155", "39.889223"],
	"吐鲁番地区": ["89.181595", "42.96047"],
	"五家渠": ["87.565449", "44.368899"],
	"伊犁州": ["81.297854", "43.922248"],
	"云南": ["101.592952", "24.864213"],
	"昆明": ["102.714601", "25.049153"],
	"保山": ["99.177996", "25.120489"],
	"楚雄州": ["101.529382", "25.066356"],
	"大理州": ["100.223675", "25.5969"],
	"德宏州": ["98.589434", "24.44124"],
	"迪庆州": ["99.713682", "27.831029"],
	"红河州": ["103.384065", "23.367718"],
	"丽江": ["100.229628", "26.875351"],
	"临沧": ["100.092613", "23.887806"],
	"怒江州": ["98.859932", "25.860677"],
	"普洱": ["100.980058", "22.788778"],
	"曲靖": ["103.782539", "25.520758"],
	"昭通": ["103.725021", "27.340633"],
	"文山": ["104.089112", "23.401781"],
	"西双版纳": ["100.803038", "22.009433"],
	"玉溪": ["102.545068", "24.370447"],
	"浙江": ["119.957202", "29.159494"],
	"杭州": ["120.219375", "30.259244"],
	"湖州": ["120.137243", "30.877925"],
	"嘉兴": ["120.760428", "30.773992"],
	"金华": ["119.652576", "29.102899"],
	"丽水": ["119.929576", "28.4563"],
	"宁波": ["121.579006", "29.885259"],
	"衢州": ["118.875842", "28.95691"],
	"绍兴": ["120.592467", "30.002365"],
	"台州": ["121.440613", "28.668283"],
	"温州": ["120.690635", "28.002838"],
	"舟山": ["122.169872", "30.03601"],
	"香港": ["114.186124", "22.293586"],
	"澳门": ["113.557519", "22.204118"],
	"台湾": ["120.961454", "23.80406"],
	"海门": [121.15, 31.89],
	"招远": [120.38, 37.35],
	"乳山": [121.52, 36.89],
	"莱西": [120.53, 36.86],
	"胶南": [119.97, 35.88],
	"文登": [122.05, 37.2],
	"太仓": [121.1, 31.45],
	"瓦房店": [121.979603, 39.627114],
	"即墨": [120.45, 36.38],
	"莱州": [119.942327, 37.177017],
	"昆山": [120.95, 31.39],
	"荣成": [122.41, 37.16],
	"常熟": [120.74, 31.64],
	"江阴": [120.26, 31.91],
	"蓬莱": [120.75, 37.8],
	"寿光": [118.73, 36.86],
	"平度": [119.97, 36.77],
	"章丘": [117.53, 36.72],
	"吴江": [120.63, 31.16],
	"胶州": [120.03336, 36.264622],
	"张家港": [120.555821, 31.875428],
	"宜兴": [119.82, 31.36],
	"金坛": [119.56, 31.74],
	"句容": [119.16, 31.95],
	"溧阳": [119.48, 31.43],
	"库尔勒": [86.06, 41.68],
	"临安": [119.72, 30.23],
	"富阳": [119.95, 30.07],
	"诸暨": [120.23, 29.71],
	"义乌": [120.06, 29.32]
}

var AttrTreeData = {
	"Rows": [{
		"attrId": "1",
		"children": [{
			"attrId": "G10224",
			"children": [{
				"attrId": "A1005530",
				"dimId": "1",
				"filterType": "1",
				"attrName": "省份",
				"attrType": "3",
				"iconClass": "icon-attr-dim"
			}, {
				"attrId": "A1005540",
				"dimId": "2",
				"filterType": "1",
				"attrName": "地市",
				"attrType": "3",
				"iconClass": "icon-attr-dim"
			}, {
				"attrId": "A1005550",
				"dimId": "3",
				"filterType": "1",
				"attrName": "区县",
				"attrType": "3",
				"iconClass": "icon-attr-dim"
			}],
			"attrName": "位置信息"
		}],
		"attrName": "用户信息"
	}, {
		"attrId": "3",
		"children": [{
			"attrId": "G10197",
			"children": [{
				"attrId": "A1005510",
				"dimId": "",
				"filterType": "9",
				"attrName": "用户编码",
				"attrType": "3",
				"iconClass": "icon-attr-str"
			}, {
				"attrId": "A1005520",
				"dimId": "",
				"filterType": "9",
				"attrName": "用户名称",
				"attrType": "3",
				"iconClass": "icon-attr-str"
			}],
			"attrName": "用户基本信息"
		}, {
			"attrId": "G10212",
			"children": [{
				"attrId": "A1005560",
				"dimId": "",
				"filterType": "2",
				"attrName": "年龄",
				"attrType": "1",
				"iconClass": "icon-attr-num"
			}, {
				"attrId": "A1005570",
				"dimId": "",
				"filterType": "2",
				"attrName": "话费",
				"attrType": "1",
				"iconClass": "icon-attr-num"
			}, {
				"attrId": "A1005580",
				"dimId": "",
				"filterType": "2",
				"attrName": "ARPU",
				"attrType": "1",
				"iconClass": "icon-attr-num"
			}],
			"attrName": "收入信息"
		}],
		"attrName": "教育经历"
	}]
}
var AttrTreeData2 = {
	Rows: [{
	attrId: '01',
	attrName: "默认属性组",
	remark: "1989-01-12",
	children: [{
		attrId: '0102',
		attrName: "通话基础属性组",
		children: [{
			attrId: '010201',
			attrName: "基础属性组",
			children: [{
				attrId: '01020101',
				attrName: '用户标识',
				attrType: '3',// 1数值 2日期 3字符
				filterType:'9',//1维度 2数值 3精确 4月份 6日期 7时间 9模糊
				dim:'',
				iconClass: 'icon-attr-str'
			}, {
				attrId: '01020102',
				attrName: '手机号码',
				attrType: '1',// 1数值 2日期 3字符
				filterType:'2',//1维度 2数值 3精确 4月份 6日期 7时间 9模糊
				dim:'',
				iconClass: 'icon-attr-str'
			}, {
				attrId: '01020103',
				attrName: '年龄',
				attrType: '1',// 1数值 2日期 3字符
				filterType:'2',//1维度 2数值 3精确 4月份 6日期 7时间 9模糊
				dim:'',
				iconClass: 'icon-attr-num'
			}, {
				attrId: '01020104',
				attrName: '性别',
				attrType: '1',// 1数值 2日期 3字符
				filterType:'1',//1维度 2数值 3精确 4月份 6日期 7时间 9模糊
				dim:'D1',
				iconClass: 'icon-attr-dim'
			}, {
				attrId: '01020105',
				attrName: '出生日期',
				attrType: '2',// 1数值 2日期 3字符
				filterType:'6',//1维度 2数值 3精确 4月份 6日期 7时间 9模糊
				dim:'',
				iconClass: 'icon-attr-time'
			}, {
				attrId: '01020106',
				attrName: '入网时间',
				attrType: '2',// 1数值 2日期 3字符
				filterType:'7',//1维度 2数值 3精确 4月份 6日期 7时间 9模糊
				dim:'',
				iconClass: 'icon-attr-time'
			}
			, {
				attrId: '01020107',
				attrName: '账期（月）',
				attrType: '2',// 1数值 2日期 3字符
				filterType:'4',//1维度 2数值 3精确 4月份 6日期 7时间 9模糊
				dim:'',
				iconClass: 'icon-attr-time'
			}
			]
		}, {
			attrId: '010202',
			attrName: "地域属性组",
			children: [{
				attrId: '01020201',
				attrName: '归属地市',
				iconClass: 'icon-attr-dim'
			}, {
				attrId: '01020202',
				attrName: '归属区县',
				iconClass: 'icon-attr-dim'
			}, {
				attrId: '01020203',
				attrName: '归属片区',
				iconClass: 'icon-attr-dim'
			}]
		}]
	}, {
		attrId: '0103',
		attrName: "长途通话属性组",
		children: [{
			attrId: '010301',
			attrName: "用户标识",
			iconClass: 'icon-attr-str'
		}, {
			attrId: '010302',
			attrName: "手机号码",
			iconClass: 'icon-attr-str'
		}, {
			attrId: '010303',
			attrName: "用户通话时长",
			iconClass: 'icon-attr-str'
		}, {
			attrId: '010304',
			attrName: "国际漫游费用",
			iconClass: 'icon-attr-str'
		}]
	}]
}]
}
var config = {
	"reportId": "REPB898C8D01F844F1A81227DDAC83F18DE",
	"reportName": "zhump测试",
	"reportDesc": "zhump测试",
	"resportConfig": function(){
		return "{\"widgets\":[{\"type\":\"line\",\"chartId\":\"container_1448696998578\",\"dimAttr\":{\"dimData\":[{\"attrId\":\"A1005530\",\"attrName\":\"省份\",\"modifyName\":\"省份\",\"attrType\":\"3\",\"filterType\":\"1\",\"dimId\":\"1\",\"isChecked\":true,\"fanyi\":true},{\"attrId\":\"A1005540\",\"attrName\":\"地市\",\"modifyName\":\"地市\",\"attrType\":\"3\",\"filterType\":\"1\",\"dimId\":\"2\",\"isChecked\":false,\"fanyi\":true}],\"attrData\":[{\"attrId\":\"A1005560\",\"attrName\":\"[ 计数 ] 年龄\",\"modifyName\":\"[ 计数 ] 年龄\",\"attrType\":\"1\",\"filterType\":\"2\",\"dimId\":\"\",\"isChecked\":true,\"funcName\":\"count\"},{\"attrId\":\"A1005570\",\"attrName\":\"[ 求和 ] 话费\",\"modifyName\":\"[ 求和 ] 话费\",\"attrType\":\"1\",\"filterType\":\"2\",\"dimId\":\"\",\"isChecked\":true,\"funcName\":\"sum\"}]},\"design\":{\"bi\":{\"style\":{\"border\":{\"have\":\"1px\",\"color\":\"rgba(33,132,190,1)\"},\"background\":\"rgba(255,255,255,0.6)\",\"shadow\":false,\"opacity\":60},\"lineBarScatter\":{\"yx\":false,\"stack\":false,\"smooth\":true,\"fill\":false,\"labelPosition\":\"none\",\"symbol\":\"none\",\"symbolRotate\":0,\"symbolSize\":2,\"markFuncAvg\":\"none\",\"markFuncMax\":\"none\",\"markFuncMin\":\"none\"}},\"title\":{\"text\":\"\",\"subtext\":\"\",\"x\":\"left\",\"y\":\"top\",\"textStyle\":{\"color\":\"rgba(51,51,51,1)\",\"fontSize\":\"20\"}},\"tooltip\":{\"show\":true},\"toolbox\":{\"show\":true,\"padding\":[5,50]},\"legend\":{\"orient\":\"horizontal\",\"x\":\"center\",\"y\":\"bottom\",\"show\":true,\"itemGap\":10},\"calculable\":false,\"xAxis\":[{\"name\":\"\",\"unit\":\"\",\"axisLabel\":{\"interval\":\"auto\",\"rotate\":0},\"axisLine\":{\"lineStyle\":{\"color\":\"rgba(0,138,205,1)\"}},\"show\":false,\"splitLine\":{\"show\":false},\"splitArea\":{\"show\":false}}],\"yAxis\":[{\"unit\":\"1\",\"show\":false,\"name\":\"\",\"axisLine\":{\"lineStyle\":{\"color\":\"rgba(0,138,205,1)\"}},\"splitLine\":{\"show\":false},\"splitArea\":{\"show\":false}}],\"grid\":{\"x\":50,\"y\":50,\"x2\":50,\"y2\":60,\"borderWidth\":0},\"dataZoom\":{\"show\":false}},\"build\":{\"type\":[\"line\"],\"seriesArray\":[{\"markLine\":{\"data\":[]},\"markPoint\":{\"data\":[]},\"symbolSize\":2,\"stack\":false,\"smooth\":true,\"itemStyle\":{\"normal\":{\"label\":{\"show\":true,\"position\":\"none\",\"formatter\":\"{c}\"}}}}],\"seriesAuto\":true,\"theme\":\"helianthus\",\"yx\":false,\"ajaxURL\":\"/bi-web/platform/dataview/viewChartData/overview_sys\",\"dataParams\":{\"dataId\":\"T10836\",\"chartType\":\"line\",\"dimAttrJsonStr\":\"{\\\"dimData\\\":[{\\\"attrId\\\":\\\"A1005530\\\",\\\"attrName\\\":\\\"省份\\\",\\\"modifyName\\\":\\\"省份\\\",\\\"attrType\\\":\\\"3\\\",\\\"filterType\\\":\\\"1\\\",\\\"dimId\\\":\\\"1\\\",\\\"isChecked\\\":true,\\\"fanyi\\\":true}],\\\"attrData\\\":[{\\\"attrId\\\":\\\"A1005560\\\",\\\"attrName\\\":\\\"[ 计数 ] 年龄\\\",\\\"modifyName\\\":\\\"[ 计数 ] 年龄\\\",\\\"attrType\\\":\\\"1\\\",\\\"filterType\\\":\\\"2\\\",\\\"dimId\\\":\\\"\\\",\\\"isChecked\\\":true,\\\"funcName\\\":\\\"count\\\"},{\\\"attrId\\\":\\\"A1005570\\\",\\\"attrName\\\":\\\"[ 求和 ] 话费\\\",\\\"modifyName\\\":\\\"[ 求和 ] 话费\\\",\\\"attrType\\\":\\\"1\\\",\\\"filterType\\\":\\\"2\\\",\\\"dimId\\\":\\\"\\\",\\\"isChecked\\\":true,\\\"funcName\\\":\\\"sum\\\"}]}\",\"filterJsonStr\":\"[]\"}},\"layout\":{\"top\":\"10px\",\"left\":\"290px\",\"width\":\"799px\",\"height\":\"339px\",\"border-width\":\"1px\",\"border-color\":\"rgb(33, 132, 190)\",\"background\":\"rgba(255, 255, 255, 0.6) none repeat scroll 0% 0% / auto padding-box border-box\",\"box-shadow\":\"none\"}},{\"type\":\"bar\",\"chartId\":\"container_1448698361726\",\"dimAttr\":{\"dimData\":[{\"attrId\":\"A1005530\",\"attrName\":\"省份\",\"modifyName\":\"省份\",\"attrType\":\"3\",\"filterType\":\"1\",\"dimId\":\"1\",\"isChecked\":true,\"fanyi\":true}],\"attrData\":[{\"attrId\":\"A1005570\",\"attrName\":\"[ 计数 ] 话费\",\"modifyName\":\"[ 计数 ] 话费\",\"attrType\":\"1\",\"filterType\":\"2\",\"dimId\":\"\",\"isChecked\":true,\"funcName\":\"count\"},{\"attrId\":\"A1005580\",\"attrName\":\"[ 计数 ] ARPU\",\"modifyName\":\"[ 计数 ] ARPU\",\"attrType\":\"1\",\"filterType\":\"2\",\"dimId\":\"\",\"isChecked\":true,\"funcName\":\"count\"},{\"attrId\":\"A1005560\",\"attrName\":\"[ 计数 ] 年龄\",\"modifyName\":\"[ 计数 ] 年龄\",\"attrType\":\"1\",\"filterType\":\"2\",\"dimId\":\"\",\"isChecked\":true,\"funcName\":\"count\"}]},\"design\":{\"bi\":{\"style\":{\"border\":{\"have\":\"1px\",\"color\":\"rgba(33,132,190,1)\"},\"background\":\"rgba(255,255,255,0.6)\",\"shadow\":false,\"opacity\":60},\"lineBarScatter\":{\"yx\":false,\"stack\":false,\"smooth\":true,\"fill\":false,\"labelPosition\":\"none\",\"symbol\":\"none\",\"symbolRotate\":0,\"symbolSize\":2,\"markFuncAvg\":\"none\",\"markFuncMax\":\"none\",\"markFuncMin\":\"none\"}},\"title\":{\"text\":\"\",\"subtext\":\"\",\"x\":\"left\",\"y\":\"top\",\"textStyle\":{\"color\":\"rgba(51,51,51,1)\",\"fontSize\":\"20\"}},\"tooltip\":{\"show\":true},\"toolbox\":{\"show\":true,\"padding\":[5,50]},\"legend\":{\"orient\":\"horizontal\",\"x\":\"center\",\"y\":\"bottom\",\"show\":true,\"itemGap\":10},\"calculable\":false,\"xAxis\":[{\"name\":\"\",\"unit\":\"\",\"axisLabel\":{\"interval\":\"auto\",\"rotate\":0},\"axisLine\":{\"lineStyle\":{\"color\":\"rgba(0,138,205,1)\"}},\"show\":true,\"splitLine\":{\"show\":true},\"splitArea\":{\"show\":true}}],\"yAxis\":[{\"unit\":\"1\",\"show\":true,\"name\":\"\",\"axisLine\":{\"lineStyle\":{\"color\":\"rgba(0,138,205,1)\"}},\"splitLine\":{\"show\":true},\"splitArea\":{\"show\":true}}],\"grid\":{\"x\":50,\"y\":50,\"x2\":50,\"y2\":60,\"borderWidth\":1},\"dataZoom\":{\"show\":false}},\"build\":{\"type\":[\"bar\"],\"seriesArray\":[{\"markLine\":{\"data\":[]},\"markPoint\":{\"data\":[]},\"symbolSize\":2,\"stack\":false,\"itemStyle\":{\"normal\":{\"label\":{\"show\":true,\"position\":\"none\",\"formatter\":\"{c}\"}}}}],\"seriesAuto\":true,\"theme\":\"helianthus\",\"yx\":false,\"ajaxURL\":\"/bi-web/platform/dataview/viewChartData/overview_sys\",\"dataParams\":{\"dataId\":\"T10836\",\"chartType\":\"bar\",\"dimAttrJsonStr\":\"{\\\"dimData\\\":[{\\\"attrId\\\":\\\"A1005530\\\",\\\"attrName\\\":\\\"省份\\\",\\\"modifyName\\\":\\\"省份\\\",\\\"attrType\\\":\\\"3\\\",\\\"filterType\\\":\\\"1\\\",\\\"dimId\\\":\\\"1\\\",\\\"isChecked\\\":true,\\\"fanyi\\\":true}],\\\"attrData\\\":[{\\\"attrId\\\":\\\"A1005570\\\",\\\"attrName\\\":\\\"[ 计数 ] 话费\\\",\\\"modifyName\\\":\\\"[ 计数 ] 话费\\\",\\\"attrType\\\":\\\"1\\\",\\\"filterType\\\":\\\"2\\\",\\\"dimId\\\":\\\"\\\",\\\"isChecked\\\":true,\\\"funcName\\\":\\\"count\\\"},{\\\"attrId\\\":\\\"A1005580\\\",\\\"attrName\\\":\\\"[ 计数 ] ARPU\\\",\\\"modifyName\\\":\\\"[ 计数 ] ARPU\\\",\\\"attrType\\\":\\\"1\\\",\\\"filterType\\\":\\\"2\\\",\\\"dimId\\\":\\\"\\\",\\\"isChecked\\\":true,\\\"funcName\\\":\\\"count\\\"},{\\\"attrId\\\":\\\"A1005560\\\",\\\"attrName\\\":\\\"[ 计数 ] 年龄\\\",\\\"modifyName\\\":\\\"[ 计数 ] 年龄\\\",\\\"attrType\\\":\\\"1\\\",\\\"filterType\\\":\\\"2\\\",\\\"dimId\\\":\\\"\\\",\\\"isChecked\\\":true,\\\"funcName\\\":\\\"count\\\"}]}\",\"filterJsonStr\":\"[]\"}},\"layout\":{\"top\":\"390px\",\"left\":\"290px\",\"width\":\"799px\",\"height\":\"359px\",\"border-width\":\"1px\",\"border-color\":\"rgb(33, 132, 190)\",\"background\":\"rgba(255, 255, 255, 0.6) none repeat scroll 0% 0% / auto padding-box border-box\",\"box-shadow\":\"none\"}},{\"type\":\"pie\",\"chartId\":\"container_1448698367202\",\"dimAttr\":{\"dimData\":[{\"attrId\":\"A1005530\",\"attrName\":\"省份\",\"modifyName\":\"省份\",\"attrType\":\"3\",\"filterType\":\"1\",\"dimId\":\"1\",\"isChecked\":true,\"fanyi\":true},{\"attrId\":\"A1005550\",\"attrName\":\"区县\",\"modifyName\":\"区县\",\"attrType\":\"3\",\"filterType\":\"1\",\"dimId\":\"3\",\"isChecked\":false,\"fanyi\":true},{\"attrId\":\"A1005540\",\"attrName\":\"地市\",\"modifyName\":\"地市\",\"attrType\":\"3\",\"filterType\":\"1\",\"dimId\":\"2\",\"isChecked\":false,\"fanyi\":true}],\"attrData\":[{\"attrId\":\"A1005540\",\"attrName\":\"[ 计数 ] 地市\",\"modifyName\":\"[ 计数 ] 地市\",\"attrType\":\"3\",\"filterType\":\"1\",\"dimId\":\"2\",\"isChecked\":true,\"funcName\":\"count\"}]},\"design\":{\"bi\":{\"style\":{\"border\":{\"have\":\"1px\",\"color\":\"rgba(33,132,190,1)\"},\"background\":\"rgba(54,110,150,1)\",\"shadow\":true,\"opacity\":18},\"pie\":{\"ring\":true}},\"title\":{\"text\":\"   全国统计\",\"subtext\":\"\",\"x\":\"center\",\"y\":\"center\",\"textStyle\":{\"color\":\"rgba(51,51,51,1)\",\"fontSize\":\"16\"}},\"tooltip\":{\"show\":true},\"toolbox\":{\"show\":false,\"padding\":[5,50]},\"legend\":{\"orient\":\"vertical\",\"x\":\"left\",\"y\":\"top\",\"show\":true,\"itemGap\":6},\"calculable\":false},\"build\":{\"type\":[\"pie\"],\"seriesArray\":[{\"radius\":[\"45%\",\"58%\"]}],\"seriesAuto\":true,\"theme\":\"helianthus\",\"ajaxURL\":\"/bi-web/platform/dataview/viewChartData/overview_sys\",\"dataParams\":{\"dataId\":\"T10836\",\"chartType\":\"pie\",\"dimAttrJsonStr\":\"{\\\"dimData\\\":[{\\\"attrId\\\":\\\"A1005530\\\",\\\"attrName\\\":\\\"省份\\\",\\\"modifyName\\\":\\\"省份\\\",\\\"attrType\\\":\\\"3\\\",\\\"filterType\\\":\\\"1\\\",\\\"dimId\\\":\\\"1\\\",\\\"isChecked\\\":true,\\\"fanyi\\\":true}],\\\"attrData\\\":[{\\\"attrId\\\":\\\"A1005540\\\",\\\"attrName\\\":\\\"[ 计数 ] 地市\\\",\\\"modifyName\\\":\\\"[ 计数 ] 地市\\\",\\\"attrType\\\":\\\"3\\\",\\\"filterType\\\":\\\"1\\\",\\\"dimId\\\":\\\"2\\\",\\\"isChecked\\\":true,\\\"funcName\\\":\\\"count\\\"}]}\",\"filterJsonStr\":\"[]\"}},\"layout\":{\"top\":\"790px\",\"left\":\"290px\",\"width\":\"799px\",\"height\":\"319px\",\"border-width\":\"1px\",\"border-color\":\"rgb(33, 132, 190)\",\"background\":\"rgba(54, 110, 150, 0.180392) none repeat scroll 0% 0% / auto padding-box border-box\",\"box-shadow\":\"rgba(33, 132, 190, 0.4) 0px 2px 3px 0px\"}}],\"filter\":[]}";
	}(),
	"createId": null,
	"createTime": null,
	"delFlag": "0",
	"adminId": null,
	"adminTime": null,
	"dataId": "T10836",
	"lastUpdataTime": null,
	"labelId": "1,2,3"
}


var chartTpl = {
	"attrDataTpl" : [ {
		"attrId" : "_tplId_0",
		"isChecked" : false,
		"isTpl" : true,
		"attrName" : "模版指标位",
		"modifyName" : "模版指标位",
		"seriesId" : "_tplId_01460080158874",
		"seriesType" : "bar"
	}, {
		"attrId" : "_tplId_1",
		"isChecked" : false,
		"isTpl" : true,
		"attrName" : "模版指标位",
		"modifyName" : "模版指标位",
		"seriesId" : "_tplId_11460080341005",
		"seriesType" : "line"
	} ],
	"designPanel" : {
		"bi" : {
			"style" : {
				"border" : {
					"have" : "",
					"color" : "#f0ad4e",
					"shadow" : true,
					"radius" : false
				},
				"background" : "rgba(212, 173, 101, 0.72)"
			},
			"grid" : {
				"yx" : false,
				"xUnit" : "",
				"yUnit" : ""
			}
		},
		"title" : {
			"text" : "各省份平均ARPU一览",
			"subtext" : "数据来源：亚信数据",
			"left" : "center",
			"top" : "top",
			"textStyle" : {
				"color" : "rgba(255, 85, 0, 0.71)",
				"fontSize" : 25
			}
		},
		"legend" : {
			"show" : true,
			"orient" : "horizontal",
			"top" : "bottom",
			"left" : "center",
			"itemGap" : 22
		},
		"tooltip" : {
			"show" : true
		},
		"toolbox" : {
			"show" : true
		},
		"xAxis" : [ {
			"show" : true,
			"name" : "",
			"axisLabel" : {
				"interval" : "auto",
				"rotate" : "0"
			},
			"position" : "bottom",
			"axisLine" : {
				"lineStyle" : {
					"color" : "rgba(0, 0, 0, 0.8)"
				}
			},
			"axisTick" : {
				"show" : true
			},
			"splitLine" : {
				"show" : false
			},
			"splitArea" : {
				"show" : false
			}
		} ],
		"yAxis" : [ {
			"show" : true,
			"name" : "",
			"position" : "left",
			"max" : 0,
			"min" : 0,
			"axisLine" : {
				"lineStyle" : {
					"color" : "rgba(0, 0, 0, 0.8)"
				}
			},
			"splitLine" : {
				"show" : false
			},
			"splitArea" : {
				"show" : false
			}
		} ],
		"grid" : {
			"top" : 77,
			"bottom" : 44,
			"left" : 15,
			"right" : 35
		},
		"dataZoom" : [ {
			"show" : false
		}, {
			"type" : "inside"
		} ],
		"seriesPanel" : {
			"seriesData" : {
				"_tplId_01460080158874" : {
					"bar" : {
						"type" : "bar",
						"color" : "",
						"width" : 55,
						"stack" : true,
						"labelPosition" : "inside",
						"markFuncAvg" : "none",
						"markFuncMax" : "none",
						"markFuncMin" : "line"
					}
				},
				"_tplId_11460080341005" : {
					"line" : {
						"type" : "line",
						"symbol" : "emptyCircle",
						"symbolRotate" : 0,
						"symbolSize" : 4,
						"labelPosition" : "bottom",
						"markFuncAvg" : "none",
						"markFuncMax" : "point",
						"markFuncMin" : "none",
						"smooth" : false,
						"stack" : true,
						"fill" : false
					}
				}
			},
			"seriesAuto" : false
		}
	},
	"chartType" : "bar"
};

var tplAll = [ {
	"layout" : {
		"top" : "10px",
		"left" : "50px",
		"width" : "759px",
		"height" : "359px"
	},
	"config" : {
		"attrDataTpl" : [ {
			"attrId" : "_tplId_0",
			"isChecked" : false,
			"isTpl" : true,
			"attrName" : "模版指标位",
			"modifyName" : "模版指标位",
			"seriesId" : "_tplId_01460080158874",
			"seriesType" : "bar"
		}, {
			"attrId" : "_tplId_1",
			"isChecked" : false,
			"isTpl" : true,
			"attrName" : "模版指标位",
			"modifyName" : "模版指标位",
			"seriesId" : "_tplId_11460080341005",
			"seriesType" : "line"
		} ],
		"designPanel" : {
			"bi" : {
				"style" : {
					"border" : {
						"have" : "",
						"color" : "#d9534f",
						"shadow" : true,
						"radius" : false
					},
					"background" : "rgba(212, 173, 101, 0.72)"
				},
				"grid" : {
					"yx" : false,
					"xUnit" : "",
					"yUnit" : ""
				}
			},
			"title" : {
				"text" : "各省份平均ARPU一览",
				"subtext" : "数据来源：亚信数据",
				"left" : "center",
				"top" : "top",
				"textStyle" : {
					"color" : "rgba(255, 85, 0, 0.71)",
					"fontSize" : 25
				}
			},
			"legend" : {
				"show" : true,
				"orient" : "horizontal",
				"top" : "bottom",
				"left" : "center",
				"itemGap" : 22
			},
			"tooltip" : {
				"show" : true
			},
			"toolbox" : {
				"show" : true
			},
			"xAxis" : [ {
				"show" : true,
				"name" : "",
				"axisLabel" : {
					"interval" : "auto",
					"rotate" : "0"
				},
				"position" : "bottom",
				"axisLine" : {
					"lineStyle" : {
						"color" : "rgba(0, 0, 0, 0.8)"
					}
				},
				"axisTick" : {
					"show" : true
				},
				"splitLine" : {
					"show" : false
				},
				"splitArea" : {
					"show" : false
				}
			} ],
			"yAxis" : [ {
				"show" : true,
				"name" : "",
				"position" : "left",
				"max" : 0,
				"min" : 0,
				"axisLine" : {
					"lineStyle" : {
						"color" : "rgba(0, 0, 0, 0.8)"
					}
				},
				"splitLine" : {
					"show" : false
				},
				"splitArea" : {
					"show" : false
				}
			} ],
			"grid" : {
				"top" : 77,
				"bottom" : 44,
				"left" : 15,
				"right" : 35
			},
			"dataZoom" : [ {
				"show" : false
			}, {
				"type" : "inside"
			} ],
			"seriesPanel" : {
				"seriesData" : {
					"_tplId_01460080158874" : {
						"bar" : {
							"type" : "bar",
							"color" : "",
							"width" : 55,
							"stack" : true,
							"labelPosition" : "inside",
							"markFuncAvg" : "none",
							"markFuncMax" : "none",
							"markFuncMin" : "line"
						}
					},
					"_tplId_11460080341005" : {
						"line" : {
							"type" : "line",
							"symbol" : "emptyCircle",
							"symbolRotate" : 0,
							"symbolSize" : 4,
							"labelPosition" : "bottom",
							"markFuncAvg" : "none",
							"markFuncMax" : "point",
							"markFuncMin" : "none",
							"smooth" : false,
							"stack" : true,
							"fill" : false
						}
					}
				},
				"seriesAuto" : false
			}
		},
		"chartType" : "bar"
	}
}, {
	"layout" : {
		"top" : "390px",
		"left" : "50px",
		"width" : "759px",
		"height" : "419px"
	},
	"config" : {
		"attrDataTpl" : [ {
			"attrId" : "_tplId_0",
			"isChecked" : false,
			"isTpl" : true,
			"attrName" : "模版指标位",
			"modifyName" : "模版指标位",
			"seriesId" : "_tplId_01460183933303",
			"seriesType" : "pie"
		}, {
			"attrId" : "_tplId_1",
			"isChecked" : false,
			"isTpl" : true,
			"attrName" : "模版指标位",
			"modifyName" : "模版指标位",
			"seriesId" : "_tplId_11460183934133",
			"seriesType" : "pie"
		} ],
		"designPanel" : {
			"bi" : {
				"style" : {
					"border" : {
						"have" : "",
						"color" : "",
						"shadow" : false,
						"radius" : false
					},
					"background" : "rgba(255, 255, 255, 0.6)"
				}
			},
			"title" : {
				"text" : "还是起个名字吧23333",
				"subtext" : "",
				"left" : "left",
				"top" : "bottom",
				"textStyle" : {
					"color" : "#5bc0de",
					"fontSize" : 22
				}
			},
			"legend" : {
				"show" : true,
				"orient" : "vertical",
				"top" : "middle",
				"left" : "right",
				"itemGap" : 5
			},
			"tooltip" : {
				"show" : true
			},
			"toolbox" : {
				"show" : true
			},
			"seriesPanel" : {
				"seriesData" : {
					"_tplId_01460183933303" : {
						"pie" : {
							"type" : "pie",
							"radius" : 77,
							"ringSize" : 58,
							"centerX" : 44,
							"centerY" : 49,
							"showLabel" : "outer",
							"chartType" : "pie"
						}
					},
					"_tplId_11460183934133" : {
						"pie" : {
							"type" : "pie",
							"radius" : 48,
							"ringSize" : 0,
							"centerX" : 44,
							"centerY" : 49,
							"showLabel" : "inner",
							"chartType" : "pie"
						}
					}
				},
				"seriesAuto" : false
			}
		},
		"chartType" : "pie"
	}
} ]
