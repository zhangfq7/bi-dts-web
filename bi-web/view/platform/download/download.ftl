<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>欢迎使用数据可视化</title>
		<meta name="renderer" content="webkit">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta http-equiv="cache-control" content="public">
		<meta http-equiv="pragma" content="Pragma">
		<link rel="stylesheet" href="${resPath}/resources/platform/download/css/download.css${css_version}" />
	</head>	
		
	<body>	
	    <div class="download-content">
	          <div>
	                <div class="img">
	                   <div class="img-img"></div>
	                </div>
	                <div class="desc">
	                    <div class="desc-top">纯图片格式</div>
	                    <div class="desc-bottom">说明：为 .png格式的文件，将生成一张大图</div>
	                </div>
	                <div class="check">
	                   <div type='pic'></div>
	                </div>
	          </div>
	          <div>
	                <div class="img">
	                   <div class="img-ppt"></div>
	                </div>
	                <div class="desc">
	                    <div class="desc-top">ppt文件格式</div>
	                    <div class="desc-bottom">说明：图形生成的图片将以幻灯片形式展现，表现力更加丰富，更易于图形二次再利用。</div>
	                </div>
	                <div class="check">
	                   <div type='ppt'></div>
	                </div>
	          </div>
	          
	    </div>
	    
	    <div class="phone-check hide">
	         <div class="phone-img"></div>
	         <div class="phone-code">
	            <div class="tr">
	               <div class="phone-title">请输入你的手机号码进行验证：</div>
	               <div><input class="phoneNum" value="${Session.UserSessBean.mobileNum}" disabled/></div>
	               <div>
	               	   <div id="scondsReSend" class="phone-btn phone-sec hide"><span>60</span>s 后重发</div>
	                   <div id="sendCaptcha" class="phone-btn phone-cap">发送验证码</div>
	               </div>
	            </div>
	            <div class="msgtr">校验码已发送到你的手机，3分钟内输入有效，请勿泄露</div>
	            <div class="tr">
	               <div class="phone-title">请输入验证码：</div>
	               <div><input maxlength="4" id="code" class="code"/></div>
	               <div id="errorInfo" ></div>
	            </div>
	         </div>
	    </div>
	    
	    <script>
			var webpath = '${webpath}';
			var resPath = '${resPath}';
			var js_version = '${js_version}';
			var funcId = '${funcId}';
		</script>
	    <script src="${resPath}/resources/platform/dataview/js/jquery/code/jquery.min.js"></script>
	    <script src="${resPath}/bace/js/nicescroll/jquery.nicescroll.min.js"></script>
	    <script src="${resPath}/bace/js/require.js"></script>
		<script src="${resPath}/bace/js/form.js"></script>
    </body>

</html>
<script>
_require(
{
	paths : {
		'sabace' : '${resPath}/bace/js/tools/sa-bace',
		'platform/download-report/download':'${resPath}/resources/platform/download/js/download'
	}
},
'platform/download-report/download',function(){}
);
</script>