/*
 *  模块化工具JS
 *  use:var sabace=require('sabace');
 *          sabace.xxx();
 *  创建人:朱明鹏
 */
define(['cookie','nicescroll'],function(cookie){
//========
// 返回JSON格式，判断主流浏览器及其版本号，兼容IE11
// 创建人:朱明鹏
//  use:
//  var bv = BrowserVersion();
//  type = bv.type; //浏览器类型
// version = bv.version;//版本号
//========
function BrowserVersion() {
  var userAgent = navigator.userAgent,
    rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
    rFirefox = /(firefox)\/([\w.]+)/,
    rOpera = /(opera).+version\/([\w.]+)/,
    rChrome = /(chrome)\/([\w.]+)/,
    rSafari = /version\/([\w.]+).*(safari)/,
    rIpad = /ipad/,
    rIphoneOs=/iphone os/,
    rIsMidp =  /midp/,
    rIsUc7  =/rv:1.2.3.4/,
    rIsUc =/ucweb/,
    rIsAndroid =/android/,
    rIsCE =/windows ce/,
    rIsWM =/windows mobile/;
  var browser=0,version=0;
  //var ua = userAgent.toLowerCase();
  function uaMatch(ua) {
  	
  	 var match = rIpad.exec(ua);
  	 if (match != null) {
      return {
        browser: "IPAD",
        version: match[2] || "0"
      };
     }
  	 
  	 var match = rIsAndroid.exec(ua);
  	 if (match != null) {
      return {
        browser: "ANDROID",
        version: match
      };
     }
  	
  	var match = rIphoneOs.exec(ua);
  	 if (match != null) {
      return {
        browser: "IPHONE",
        version: match
      };
     }
  	 
  	var match = rIsUc.exec(ua);
  	 if (match != null) {
      return {
        browser: "UC",
        version: match
      };
     }
  	var match = rIsWM.exec(ua);
  	 if (match != null) {
      return {
        browser: "WINDOWSMOBILE",
        version: match
      };
     }
  	
    var match = rMsie.exec(ua);
    if (match != null) {
      return {
        browser: "IE",
        version: match[2] || "0"
      };
    }
    
    var match = rFirefox.exec(ua);
    if (match != null) {
      return {
        browser: match[1] || "",
        version: match[2] || "0"
      };
    }
    var match = rOpera.exec(ua);
    if (match != null) {
      return {
        browser: match[1] || "",
        version: match[2] || "0"
      };
    }
    var match = rChrome.exec(ua);
    if (match != null) {
      return {
        browser: match[1] || "",
        version: match[2] || "0"
      };
    }
    var match = rSafari.exec(ua);
    if (match != null) {
      return {
        browser: match[2] || "",
        version: match[1] || "0"
      };
    }
    if (match != null) {
      return {
        browser: "",
        version: "0"
      };
    }
  }
  var browserMatch = uaMatch(userAgent.toLowerCase());
  if (browserMatch.browser) {
    browser = browserMatch.browser;
    version = browserMatch.version;
  }
  
  return {
    type: browser.toLowerCase(),
    version: version
  };
}


//========
//阻止事件冒泡的通用函数
//创建人:朱明鹏
//use:
//<div><div onclick="fun()&&stopBubble(event)"></div></div>
//or
//jQuery('xx').on('click',function(e){
//  //你的方法
//  //阻止事件冒泡
//  stopBubble(e)
//});
//========
function stopBubble(e) {
  // 如果传入了事件对象，那么就是非ie浏览器  
  if (e && e.stopPropagation) {
    //因此它支持W3C的stopPropagation()方法  
    e.stopPropagation();
  } else {
    //否则我们使用ie的方法来取消事件冒泡  
    window.event.cancelBubble = true;
  }
}



//========
//判断是否为空函数
//========
function IsEmpty(xValue) {
  if (xValue == null || xValue == "null" || xValue == "undefined" || xValue == "NaN" || xValue == "" || xValue == undefined)  return true;
  return false;
}


//========
//扩展jQuery方法
//arrayVal:根据标识符获得一组HTML对象的attr数组
//outerHTML:获取对象的outerHTML
//========
(function($){
    $.fn.extend({
        arrayAttr: function(attr,type){
            var self = $(this);
            var result = [];
            if(self.length > 0){
                self.each(function(i, o){
                	if(type=='prop'){
                		result.push($(o).prop(attr));
                	}else{
                		result.push($(o).attr(attr||"value"));
                	}
                });
            }
            return result;
        },
        outerHTML:function(){
        	return $(this).prop('outerHTML');
        }
    });
})(jQuery);

//========
//LOG
//========
window.log = window.log||function(){
	if(!typeof(logmode)&&logmode=="product")return;
	var console=window.console||{log:function(){}};
	for(var i = 0,n = arguments.length;i<n;i++){
		console.log(arguments[i]);
	}
//	console.log((new Date().toString()).split(' ')[4]);
};

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

//========
//Date 侵入原型扩展方法
//========

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(Y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("YYYY-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("YYYY-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


//========
//String侵入原型扩展方法
//========

//========
//替换指定字符
//========
String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
};

//========
//Array侵入原型扩展方法
//========

////========
////删除指定下标的数组对象
////========
//Array.prototype.del=function(n) {
//	if(n<0)return this;
//	else return this.slice(0,n).concat(this.slice(n+1,this.length)); 
//};
//
////========
////在指定位置插入数组对象
////========
//Array.prototype.insert = function (index, item) {
//this.splice(index, 0, item);
//};

//========
//根据传入下标交换数组对象
//========
//Array.prototype.exchange = function(s,e){
//	var newArray = [];
//	for(var i = 0 ; i<this.length;i++){
//		if(i==s){
//			newArray.push(this[e]);
//		}else if(i==e){
//			newArray.push(this[s]);
//		}else{
//			newArray.push(this[i]);
//		}
//	}
//	return newArray;
//};

// 字符串的startWtih方法
String.prototype.startWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);         
};

//请求的URL处理函数
function handleUrlParam(url){
	// 在url的前面需要加入webpath
	if (url.indexOf(webpath) != 0) {
		url = webpath + url;
	}
	
//	 && !IsEmpty(funcId)
	var start = url.indexOf('funcId=');
	if (start > -1) {
		var tempFunc = "";
		var end = url.substring(start + 7).indexOf("&");
		if (end > -1) {
			tempFunc = start.substring(start + 7, start + end + 7);
			url = url.substring(0, start) + "/" + tempFunc.toLowerCase() + url.substring(start + end + 8);
		} else {
			tempFunc = url.substring(start + 7);
			url = url.substring(0, start) + "/" + tempFunc.toLowerCase();
		}
	} else if (!IsEmpty(funcId)){
		url = url + "/" + funcId.toLowerCase();
	}

	return url;
}

    /**
     * @desc 工具方法,拼接字符串,根据参数列表构建字符串(相当于一个简易的模板构建工具)
     * @author shaojs
     * @param str 字符串模板
     * @param paraList 参数列表
     */
    var buildString = function(){
        //占位符前后修饰符
        var prefix="\\{\\{", surfix="\\}\\}";
        //正则表达式字符串
        var regStr = prefix + "(.+?)" + surfix;
        //新建正则表达式
        var regExp = new RegExp(regStr,"mg");

        //功能函数,替换并返回
        function bulidStr(str,paraList){
            var ret = str.replace(regExp,function(full,key){
                return paraList[key] || "";
            });
            return ret;
        }

        return function(str,paraList){
            if (!str){
                //没有参数时返回空字符串
                return "";
            }
            else if (str && arguments.length == 1){
                //只有一个参数时返回本身
                return str;
            }
            else if (arguments.length >= 2 && ((typeof paraList) == "string")){
                //字符串传参数时转换参数变成数组
                paraList = Array.prototype.splice.call(arguments,1);
                return bulidStr(str,paraList);
            }else{
                //数组或对象传参数
                return bulidStr(str,paraList);
            }

        }
    }();

    /**
     * @desc 将对象的属性名字 从 xxx_xxx 转成驼峰形式xxxXxx
     * @author shaojs
     * @returns {Function}
     */
    var coverObj2Camel = (function(){
        function toCamel(str){
            var re=/_(\w)/g;
            return str.replace(re,function(){
                var args=arguments;
                return args[1].toUpperCase();
            })
        }
        return function (obj) {
            var ret = {};
            for(var i in obj){
                ret[toCamel(i)] = obj[i];
            }
            return ret;
        }
    })();

    //工具方法,导出
    function downloadbyfloor(url) {
        var bodyDom = document.body;

        var iFrameDom = $('#resultFrm');
        if (iFrameDom[0]) iFrameDom.remove();
        iFrameDom = $("<iframe/>",{
            id:'resultFrm',
            name:'resultFrm',
            style:'display:none;'
        }).appendTo($(bodyDom));
        iFrameDom.on("load",function(a) {
            var thisDocument = iFrameDom[0].contentDocument || iFrameDom[0].contentWindow.document;
            var html = thisDocument.body.innerHTML;
            if (html) {
                window.top.$.dialog({
                    title: '下载错误',
                    lock: true,
                    resize: false,
                    width: 700,
                    height: 100,
                    padding: '0px 0px',
                    content: '<span class="error_message">文件下载时发生错误,请联系管理员!</span>',
                    cancel: function () {

                    }
                });
            }
        });

        var formDom = $('#downLoadForm');
        if (formDom[0]) formDom.remove();
        formDom = $('<form/>',{
            id:'downLoadForm',
            name:'downLoadForm',
            style:'display:none;',
            method:'post',
            target:'resultFrm'
        });
        var i = url.indexOf('?');
        formDom.attr("action",url.substr(0, i));
        if (i > -1) {
            var querystr = url.substr(i + 1);
            var arr = querystr.split('&');
            for (i in arr) {
                var p = arr[i].split('=');

                var inputDom = $('<input/>',{
                    id:p[0],
                    name:p[0]
                });
                for (var index = 1; index < p.length; index++) {
                    if (index > 1) inputDom[0].value += '=';
                    inputDom[0].value += p[index];
                }

                formDom.append(inputDom);
            }
        }
        $(bodyDom).append(formDom);
        formDom.submit();
    }


    return {
      getBV:BrowserVersion,
      stopBubble:stopBubble,
      IsEmpty:IsEmpty,
      handleUrlParam:handleUrlParam,
      autoScroll:autoScroll,
      buildString:buildString,
      coverObj2Camel:coverObj2Camel,
      downloadbyfloor:downloadbyfloor

}});