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
		'poshytip': '${resPath}/bace/js/poshytip/jquery.poshytip',
		'top/message': '${resPath}/resources/manage/frame/bace/js/message',
		'top/info':'${resPath}/resources/manage/frame/bace/js/top'
	}
},
'top/info',function(info){
	info.init();
}
);
</script>
</#if>