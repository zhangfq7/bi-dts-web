/**
 * @author zhump;
 * @name box
 * 
 * 1.这个模块是干嘛的？
 * 此模块作用是 让A模块运行时，调用B模块的方法。
 * 原理：当B模块初始完成后，更改Box模块的对象方法的指针。
 * 	         当A模块需要B模块方法的时候，调用Box模块的对象方法，实际上调用了B的模块方法。
 * 	   B.js
 *     Box.B.xx = B.xx;//更改Box模块B对象的xx方法的指针
 *     ---------------------
 *     A.js
 *     Box.B.xx();//A模块调用B模块的xx方法
 * 
 * 2.为什么这么做？
 *   当模块之间调用方法增多时，如果直接强行调用，需要依赖原始模块，最后就变成下面的结果
 *   A.js
 *   require('B','C','D','E');
 *   B.js
 *   require('A','C','D','E');
 *   C.js
 *   require('A','B','D','E');
 * 	 D.js
 *   require('A','B','C','E');
 *   可这些模块，原本就是相互独立，这样就会变得十分耦合，繁琐，更加不易管理模块之间调用的方法。
 *   后期业务增多，团队之间维护模块，组员都不知道自己暴露出多少方法。
 *   使用该模块，代码就会更加易于维护，更易懂。
 *   A.js
 *   require('Box'); 
 *   B.js
 *   require('Box');
 *   C.js
 *   require('Box');
 * 	 D.js
 *   require('Box');
 */
define(function(){
	return {
		main:{
			dataId:'',
			dataName:'',
			dataType:'',
			reportId:'',
			tplId:'',
			reportName:'',
			reportDesc:'',
			labelId:'',
            urlMenuInfo:[], //url配置挂载位
            realTimeappConfig:null //实时应用配置挂载位
		},
		Layout:{
			
		},
		Header:{
			save:{
				saveReport:'',
			},
			tools:{
				themeName:''
			}
		},
		Filter:{
			dataStart:'',
			search:''
		},
		AttrTree:{
			openAttrPanel:null,
			findAttrByParam:null,
			viewInit:null
		},
		Widgets:{
			refreshAllChart:null,
			start:null,
			plugins:{},
			updateGridGraph:null,
			showLoading:null,
			hideLoading:null,
			showTip:null,
			hideTip:null,
			getThumbSingleURL:null,
			getThumbURL:null,
			openUrlPanel:null
		},
		DimAttr:{
			dataStart:null
		},
		Design:{
			updateSeriesPanel:null
		},
		Property:{
			apply:null,
			close:null,
			dataStart:null,
			showTip:null,
			hideTip:null,
			isMyProperty:null
		},
        //保存一些全局标识
        flags:{
            isRealtimeapp:false,  //是否是实时应用
            isVeiwPage:false      //是否是查看页面
        },
		IndiFilter:{
			dataStart:''
		}
	}
});