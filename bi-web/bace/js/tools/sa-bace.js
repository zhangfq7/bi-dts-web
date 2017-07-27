/*
 *  模块化工具JS
 *  use:var sabace=require('sabace');
 *          sabace.xxx();
 *  创建人:朱明鹏
 */
define(['cookie'],function(cookie){
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
    rSafari = /version\/([\w.]+).*(safari)/;
  var browser=0,version=0;
  //var ua = userAgent.toLowerCase();
  function uaMatch(ua) {
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
//获得项目的根目录
//创建人:朱明鹏
//use:
//var webPath = getRootPath();
//========
function getRootPath(){
    //获取当前网址，如： http://localhost:8088/test/test.jsp
    var curPath=window.document.location.href;
    //获取主机地址之后的目录，如： test/test.jsp
    var pathName=window.document.location.pathname;
    var pos=curPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8088
    var localhostPaht=curPath.substring(0,pos);
    //获取带"/"的项目名，如：/test
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName);
}


//========
//URL参数对象转换JSON对象
//创建人:朱明鹏
//use:
//var obj = urlToJson('name=1&age=10');
//obj.name -> 1;
//obj.age  -> 10;
//or
//var obj = urlToJson('name=1&name=2&age=10',true);
//obj.name -> [1,2];
//obj.age  ->10;
//========
function urlToJson(string, overwrite) {
  if (!string || !string.length) {
    return {};
  }
  var obj = {};
  var pairs = string.split("&");
  var name, value;
  for (var i = 0, len = pairs.length; i < len; i++) {
    var index = pairs[i].indexOf("=");
    name = decodeURIComponent(pairs[i].substr(0, index));
    value = decodeURIComponent(pairs[i].substr(index + 1, pairs[i].length));
    if (overwrite !== true) {
      if (typeof obj[name] == "undefined") {
        obj[name] = value;
      } else {
        if (typeof obj[name] == "string") {
          obj[name] = [obj[name]];
          obj[name].push(value);
        } else {
          obj[name].push(value);
        }
      }
    } else {
      obj[name] = value;
    }
  }
  return obj;
}

//========
//JSON对象转换URL参数
//创建人:朱明鹏
//use:
//var obj = {
//  name:[1,2],
//  age:10
//}
//var pars = jsonToUrl(obj);
//  pars -> 'name=1&name=2&age=10'
//========
function jsonToUrl(o) {
  if (!o) {
    return "";
  }
  var buf = [];
  for (var key in o) {
    var ov = o[key],
      k = encodeURIComponent(key);
    var type = typeof ov;
    if (type == "undefined") {
      buf.push(k, "=&");
    } else {
      if (type != "function" && type != "object") {
        buf.push(k, "=", encodeURIComponent(ov), "&");
      } else {
        if (Object.prototype.toString.call(ov) === '[object Array]') {
          if (ov.length) {
            for (var i = 0,
              len = ov.length; i < len; i++) {
              buf.push(k, "=", encodeURIComponent(ov[i] === undefined ? "" : ov[i]), "&");
            }
          } else {
            buf.push(k, "=&");
          }
        }
      }
    }
  }
  buf.pop();
  return buf.join("");
}


//========
//判断是否为空函数
//========
function IsEmpty(xValue) {
  if (xValue == null || xValue == "null" || xValue == "undefined" || xValue == "NaN" || xValue == "" || xValue == undefined)  return true;
  return false;
}

//========
//从cookie中获取语言环境
//========
var lang = function (){
   var lang = $.cookie('org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE')||'zh';
   return lang;
}();

//========
//根据msgMap获得国际化的label值
//========
function getMessage(key, paramArray) {
	var interMap = {};
	if (typeof(topMsgMap) != 'undefined') {
		interMap = $.extend(interMap, topMsgMap);
	}
	if (typeof(msgMap) !=  'undefined') {
		interMap = $.extend(interMap, msgMap);
	}
	
	if (!(interMap[key])) {
		return key;
	}

	var msg = interMap[key][lang];
	if (paramArray != undefined && msg != undefined) {
		if (Object.prototype.toString.call(paramArray) == '[object Array]') {
			for (var i = 0; i < paramArray.length; i++) {
				var reg = '\\{' + (i + 1) + '\\}';
				msg = msg.replaceAll(reg, paramArray[i]);
			}
		} else {
			msg = msg.replace(/\{1}/g, paramArray);
		}
	}
	return msg;
}


// base64加密开始
function encode64(input) {
    var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"
        + "wxyz0123456789+/" + "=";
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;
	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
			+ keyStr.charAt(enc3) + keyStr.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	} while (i < input.length);

	return output;
}
// base64加密结束

//========
//SA产品封装的ajax方法
//========
function ajax(config) {
	var option = {
		type: "post",
		cache: false,
		dataType: "json",
		url:'',
		data:'',
		spin:false
	};
	var deferred;
	var setting = $.extend(true, {}, option, config);
	var dialog_id,lcfg=null;
	if(typeof(setting.loading) === "object" ){
		//loading
		dialog_id = "ajaxLoadingDialog" + new Date().getTime();
		//构建loading参数
		lcfg = {
			"progress_id":dialog_id+"_progress",
			"title":setting.loading.title,
			"text":setting.loading.text,
			"spin":setting.loading.spin
		};
	}
	setting.error = function(req){
		closeLoading(lcfg,function(){
			// 如果返回报没有Session，则说明登录已超时
			if (req && (req.responseText == 'NoSession' || req.responseText == 'OtherLogin')) {
				var msg = '您好，系统检测到您操作超时，为了您的数据安全，请重新登录本系统！5秒钟将自动跳转到登录页面！';
				if (req.responseText == 'OtherLogin') {
					msg = '您好，系统检测到您的帐号在其它地方登录，为了您的数据安全，请重新登录本系统！5秒钟将自动跳转到登录页面！';
				}
				
				bi.dialog.show({
					type:bi.dialog.TYPE_INFO,
					title: '系统提醒',
					//message: msg + '<a href="'+webpath+'/platform/login/page">点我登陆</a>',
					message: msg + '<a href="#" onclick="onshown()">点我登陆</a>',
					cssClass: 'timeout-dialog',
					onshown: function(){
						setTimeout(function() {
							//top.document.location.href = webpath + "/platform/login/page";
							// 测试
							// top.document.location.href ="http://portal.dev-citic.dataos.io/dts/sso/union-entry";
  						// 生产
  						top.document.location.href ="http://data.c.citic/dts/sso/union-entry";
						},5000);
					}
				});
				return;
			}
			if(config.error){
				config.error(req);
			}
		});
	};
	setting.success = function(req){
		closeLoading(lcfg,function(){
			if(config.success){
				config.success(req);
			}
		});
	};
	setting.complete = function(req) {
		if (config.complete) {
			config.complete(req);
		}
	};
	
	//显示loading
	var dialog = showLoading(lcfg,function(){
		deferred = $.ajax(setting);
	});
	
	function closeLoading(lcfg,callback){
		if(typeof(bi) !== "object" || !lcfg){
			callback();
		}else{
			if(!lcfg.spin){
				$("#" + lcfg.progress_id +" .progress-bar").width("105%");
				setTimeout(function(){
					dialog.close();
					callback();
				},500);
			}else{
				setTimeout(function(){
					var spiner = lcfg.spinDiv;
					spiner.spin('close');
					spiner.remove();
					callback();
				},1000);
			}
		}
	}
	function showLoading(lcfg,callback){
		if(typeof(bi) !== "object" || !lcfg ){
			callback();
		}else{
			if(!lcfg.spin){
				return  bi.dialog.show({
					id:lcfg.id,
					title: lcfg.title,
					type:bi.dialog.TYPE_INFO,
					closable: false,
					message:
							 '<div style="margin-left:3px">'+lcfg.text+'...</div>'
							+'<div id="'+lcfg.progress_id+'" class="progress" style="height:7px;">'
							+'	<div class="progress-bar theme-background"></div>' 
							+'</div>',
					onshown:function(dialog){
						jQuery("#"+lcfg.progress_id +"  .progress-bar").width((50 + Math.random() * 30) + "%");
						setTimeout(function(){
							callback();
						},200);
					}
				});
			}else{
				//加载spin
				if(typeof(Spinner2) == "undefined"){
					alert('没有加载spin对象');
				}else{
					var spinOption = {
							appendTo : "body",//蒙层添加对象
							background : 'rgba(226, 242, 250, .6)',//蒙层背景颜色
							lines: 11, // 花瓣个数   
							length: 11, // 花瓣长度   
							width: 5, // 花瓣宽度
							radius: 14, // 圆大小
							color: '#fff',//花瓣颜色	
							corners: 1, // Corner roundness (0..1)   
							rotate: 0, // 旋转偏移量   
							direction: 1, // 1: 顺时针, -1: 逆时针   
							speed: 1, // 转速/秒   
							trail: 60, // Afterglow percentage   
							shadow: true, // 是否显示阴影   
							hwaccel: false, // 是否使用硬件加速   
							className: 'spinner', // 绑定到spinner上的类名   
							zIndex: 2e9, // 定位层 (默认 2000000000)   
							top: '50%', // 相对父元素上定位，单位px   
							left: '50%' // 相对父元素左定位，单位px  
					};
					var spinSetting = $.extend(true, {}, spinOption, lcfg.spin);
					var spinDiv = jQuery("<div>",{
						"css":{
							'position': "absolute",
							'bottom':0,
							'right':0,
							'left':0,
							'top':0,
							'background':spinSetting.background,
							'z-index':99999999,
							'display':"none"
						}
					});
					jQuery(spinSetting.appendTo).append(spinDiv);
					spinDiv.spin(spinSetting).show();
					lcfg.spinDiv = spinDiv;
					//获取spin的半径
					var spinHeight = spinSetting.width+spinSetting.length+spinSetting.radius;
					var textDiv = jQuery("<div>",{
						'html': lcfg.text,
					    'css' : {
					    	'position': "absolute",
					    	'min-width'   : '400px',
					    	'top'     : '50%',
					    	'left'    : '50%',
					    	'color'   : '#fff',
					    	'margin-top' : spinHeight+10,
					    	'margin-left'  :'-200px',
					    	'text-align' :'center'
					    }
					});
					spinDiv.append(textDiv);
					setTimeout(function(){
						callback();
					},200);
				}
			}
		}
	}
	return deferred;
}

function disabledDialog(flag,opt){
	
	if(flag){
		//只有设置了enableButtons 为 false,动画才会旋转
		//并且所有的按钮实例都会灰置
		var text = opt._this.text();
		opt.dialog.setData("bi-text-self",text||'请稍候....');
		opt._this.text(opt.text);
		opt.dialog.enableButtons(false).setClosable(false);
		opt.dialog.getModalBody().append("<div id='cc' style='position: absolute;top:0;left:0;bottom: 0;right: 0;background: rgba(255,255,255,.4);'><div>");
		opt.dialog.getModalHeader().css("opacity","0.8");
	}else{
		var text = opt.text|| opt.dialog.getData("bi-text-self")||'确定';
		opt._this.text(text);
		opt.dialog.enableButtons(true).setClosable(true); 
		opt.dialog.getModalBody().find("#cc").remove();
		opt.dialog.getModalHeader().css("opacity","1");
	}
}



// 请求的URL处理函数
function handleUrlParam(url){
	// 在url的前面需要加入webpath
	if (url.indexOf(webpath) != 0) {
		url = webpath + url;
	}
	
	if (url.lastIndexOf("/") + 1 == url.length) {
		url = url.substring(0, (url.length - 1));
	}
	
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

//========
//获得传入时间与当期时间的差值
//========
function getDateDiff(dateTime){
    var dateTimeStr = dateTime.replaceAll('-','/'); 
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    //var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - new Date(dateTimeStr).getTime();
    if (diffValue < 0) {
      //alert("结束日期不能小于开始日期！");
        return getMessage("msg.sabace.now");
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
      result = parseInt(monthC) + getMessage("msg.sabace.month");
    } else if (weekC >= 1) {
      result = parseInt(weekC) + getMessage("msg.sabace.week");
    } else if (dayC >= 1) {
      if(dayC<2){
         result = getMessage("msg.sabace.yesterday");
      }else{
         result = parseInt(dayC) + getMessage("msg.sabace.day");
      }
    } else if (hourC >= 1) {
      result = parseInt(hourC) + getMessage("msg.sabace.hour");
    } else if (minC >= 1) {
      result = parseInt(minC) + getMessage("msg.sabace.min");
    } else
      result = getMessage("msg.sabace.now");
    return result;
}

//========
//扩展jQuery方法
//arrayVal:根据标识符获得一组HTML对象的value数组
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

//========
//删除指定下标的数组对象
//========
Array.prototype.del=function(n) {
	if(n<0)return this;
	else return this.slice(0,n).concat(this.slice(n+1,this.length)); 
};

//========
//在指定位置插入数组对象
//========
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

//========
//根据传入下标交换数组对象
//========
Array.prototype.exchange = function(s,e){
	var newArray = [];
	for(var i = 0 ; i<this.length;i++){
		if(i==s){
			newArray.push(this[e]);
		}else if(i==e){
			newArray.push(this[s]);
		}else{
			newArray.push(this[i]);
		}
	}
	return newArray;
};

// 字符串的startWtih方法
String.prototype.startWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);         
};

//去掉一个字符串前后的空格，例如：" hello  ";返回的结果是"hello"
String.prototype.trim = function()
{
    if (this == null || this == undefined || this == '')
    {
        return '';
    }
    
    return this.replace(/^\s*|\s*$/g, '');
};

/**
 * 将String转化为时间
 */
String.prototype.stringToDate = function(){
	return new Date(Date.parse(this.replace(/-/g, "/")));
};

/*
 * 让浏览器弹出页面的方法
 * 
 */ 
function lkgWinOpen(sURL, iWidth, iHeight, bStatus, bResize, iTop, iLeft, sName) {
	// 顶端对齐
	if(IsEmpty(iTop)){
		iTop = 0;
	}
	// 默认居中对齐
	if(IsEmpty(iLeft)){
		iLeft = (jQuery(window).width() - iWidth)/2;
	}
    var pathName = window.location.pathname;
    var pageNameTag = pathName.substring(pathName.lastIndexOf("/") + 1);
    if (sURL.indexOf("?") > -1){
        sURL += "&pageNameTag=" + pageNameTag;
    } else{
        sURL += "?pageNameTag=" + pageNameTag;
    }
    if (iWidth == -1) iWidth = screen.availWidth;
    if (iHeight == -1) iHeight = screen.availHeight-20;
  
    iWidth =(IsEmpty(iWidth) ?300:iWidth);
    iHeight=(IsEmpty(iHeight)?100:iHeight);
    sName=(IsEmpty(sName)?"":sName);
  
    sStatus = (IsEmpty(bStatus)?"0":"1");
    sResizable = (IsEmpty(bResize)?"0":"1");
    sStatus = "0";
    return window.open(sURL, sName,
           "width=" + iWidth + "px,height=" + iHeight + "px," +
           "top=" + iTop + "px,Left=" + iLeft + "px," +
           "border=thin,help=no,menubar=no,toolbar=no,location=no,"+
  		   "directories=no,status="+sStatus+",resizable="+sResizable+",scrollbars=1");
}

function interval(callback,time){
	var timer = setInterval(function(){
		callback();
	},time);
	if(!window.bi_interval){
		window.bi_interval = [];
	}
	window.bi_interval.push(timer);
	return timer;
};

function timeout(callback,time){
	var timer = setTimeout(function(){
		callback();
	},time);
	if(!window.bi_timeout){
		window.bi_timeout = [];
	}
	window.bi_timeout.push(timer);
	return timer;
};

/**
 * 获取字符串长度
 */
function getLength(str) {
    //获得字符串实际长度，中文3，英文1
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 3;
    }
    return realLength;
};

/** 
 * js截取字符串，中英文都能用 
 * 如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串。  
 * @param str：需要截取的字符串 
 * @param len: 需要截取的长度 
 */
function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4  
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；  
    if (str_length < len) {
        return str;
    }
}

return {
      getBV:BrowserVersion,
      stopBubble:stopBubble,
      getRootPath:getRootPath,
      urlToJson:urlToJson,
      jsonToUrl:jsonToUrl,
      IsEmpty:IsEmpty,
      getlang:lang,
      getMessage:getMessage,
	  encode64:encode64,
      handleUrlParam:handleUrlParam,
      ajax:ajax,
      wopen:lkgWinOpen,
      disabledDialog:disabledDialog,
      interval:interval,
      timeout:timeout,
      getLength:getLength,
      cutstr:cutstr,
      date:{
          getDateDiff:getDateDiff
      }
  };
});