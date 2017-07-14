<#include "view/platform/top.ftl">

<!-- your css code -->

<!-- your html code -->

<#include "view/platform/bottom.ftl">

<!-- your js code -->
<script>
<!-- 
_require({},url,callback);
参数解释：
第一个对象：paths:{key:value} 以键值对的方式配置当前页面的js主文件,和当前页面所需的插件js
第二个对象：录入paths中配置是好的，入口js的模块id
第三个对象：加载完入口js后的回调函数（如果没有，可省略）
 -->
 
_require(
{
	paths : {
		'company/info':'${resPath}/resources/platform/js/company/info'
	}
},
'company/info',function(){}
);
</script>

<!--
	规范，大家尽量不写行内style样式 （企业信息和企业认证不规范的地方，负责的同学改一下）
	开发前，可以阅读一下http://codeguide.bootcss.com/ 前端开发的一些规范
-->

