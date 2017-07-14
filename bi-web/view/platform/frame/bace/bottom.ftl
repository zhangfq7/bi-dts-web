<#if pjax == "">
	</div>
</div>
</#if>

<script>
var webpath = '${webpath}';
var resPath = '${resPath}';
var js_version = '${js_version}';
var funcId = '${funcId}';
</script>

<#if pjax == "">
<script src="${resPath}/bace/plugins/sa-plugins.js"></script>
<script src="${resPath}/bace/js/nicescroll/jquery.nicescroll.min.js"></script>
<script src="${resPath}/bace/js/pjax/jquery.pjax.sa.js"></script>
<script src="${resPath}/bace/js/wookmark/wookmark.js"></script>
<script src="${resPath}/bace/js/require.js"></script>
<script src="${resPath}/bace/js/form.js"></script>
</body>
</html>
<script>
_require(
{
	paths : {
		'top/message': '${resPath}/resources/platform/frame/bace/js/message',
		'top/info':'${resPath}/resources/platform/frame/bace/js/top'
	}
},
'top/info',function(info){
	info.init();
}
);
</script>
</#if>