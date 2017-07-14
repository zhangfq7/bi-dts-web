
<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/myhome/css/home.css${css_version}" />

	      <div class="ifrDiv">
	      	<iframe id="iframe1" frameborder=0 height="100%"  width="100%"  style="position:absolute"></iframe>
	      	<img src="${resPath}/resources/platform/myhome/img/nohome.png"></img>
	      </div>
	      <div class="ifrDiv">
	        <iframe id="iframe2" frameborder=0 height="100%"  width="100%"  style="position:absolute"></iframe>
	      </div>
	      <div class="ifrDiv">
	        <iframe id="iframe3" frameborder=0 height="100%"  width="100%"  style="position:absolute"></iframe>
	      </div>
	      <div class="ifrDiv">
	        <iframe id="iframe4" frameborder=0 height="100%"  width="100%"  style="position:absolute"></iframe>
	      </div>
	      <div class="ifrDiv">
	        <iframe id="iframe5" frameborder=0 height="100%"  width="100%"  style="position:absolute"></iframe>
	      </div>
		<div class="page col-md-1 theme-background">
		     <div class="opt normalBtn" id="opt"><span class="fui-gear"></span></div>
		</div>
<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
{
	paths : {
		'myhome/home':'${resPath}/resources/platform/myhome/js/home'
	}
},
'myhome/home',function(){}
);
</script>