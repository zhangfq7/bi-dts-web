define(['sabace','upload','user/message'], function(sabace,message) {
	var uploader;
	var imageWidth = 0;
	var imageHeight = 0;
	var jcrop_api = null;
	var	boundx=0;
	var	boundy=0;
	var	pcnt = jQuery('.preview-container');
	var	pimg = jQuery('.preview-container img');
	var xsize = pcnt.width();
	var ysize = pcnt.height();
	var zoomedImageTrueWidth;
	var zoomedImageTrueHeight;
	var zoomRatio=0;
	var cropImageDivWidth = 140;
	var cropImageDivHeight = 140;
//	var fileName="";
	var isChecked=false;
	var options='';
//	var serverFilePath = '';
	jQuery(function(){
		
		//获取今年
		var currentYear=new Date().getFullYear();
		
		//初始化100年
		for(var year=currentYear;year>=currentYear-100;year--){
			options += '<option value="'+year+'">'+year+'</option>';
		}
		jQuery('#select-year').html(options);
		
		//初始化月
		options='';
		for(var month=1;month <= 12;month++){
			options += '<option value="'+month+'">'+month+'</option>';
		}
		jQuery('#select-month').html(options);
		
		//初始化日
		options='';
		for(var day=1; day<=31 ; day++){
			options += '<option value="'+day+'">'+day+'</option>';
		}
		jQuery('#select-day').html(options);
		
		//如果已经设置过生日
		if(!sabace.IsEmpty(birthday2)){
			var year=birthday2.split('-')[0];
			var month=parseInt(birthday2.split('-')[1]);
			var day=parseInt(birthday2.split('-')[2]);
			jQuery('#select-year').val(year);
			jQuery('#select-month').val(month);
			jQuery('#select-day').val(day);
		}
		
		//如果已经设置过性别
		if(!sabace.IsEmpty(sex2)){
			if(sex2 == '1'){
				jQuery("#male").removeClass("fa-square-o");
				jQuery("#male").addClass("fa-check-square-o");
			}else if(sex2 == '0'){
				jQuery("#female").removeClass("fa-square-o");
				jQuery("#female").addClass("fa-check-square-o");				
			}else if(sex2 == '9'){
				jQuery("#unknown").removeClass("fa-square-o");
				jQuery("#unknown").addClass("fa-check-square-o");				
			}
		}
		
		//渲染select控件
		jQuery('#select-year').chosen({disable_search:true});
		jQuery('#select-day').chosen({disable_search:true});
		jQuery('#select-month').chosen({disable_search:true});
		
		//初始化文件上传组件
		initWebuploader();
		
		//年月的下拉框注册改变事件，用来更改对应年月包含的天数
		jQuery('#select-year').on("change",dateChanged);
		jQuery('#select-month').on("change",dateChanged);
		
		//注册按钮事件
		jQuery('#saveUserInfoBtn').on("click",saveUserInfo);
		jQuery('.radio-label').on("click",function(){
			jQuery(this).prev().click();
		});
		jQuery('.checkBox').on("click",function(){
			isChecked=jQuery(this).hasClass("fa-square-o");
			jQuery('.checkBox').removeClass("fa-check-square-o");
			jQuery('.checkBox').addClass("fa-square-o");
			if(isChecked){
				jQuery(this).removeClass("fa-square-o");
				jQuery(this).addClass("fa-check-square-o");
			}
		});
		
		jQuery("#account-security").on("click",function(){
			window.location.href=sabace.handleUrlParam("/platform/sysmanage/user/safety");
		});
		
		//控件验证
		jQuery('.div-left').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true,
		});	
	});
	
	/**
	 * 当生日的年月改变的时候调用
	 */
	function dateChanged(){
		var year=jQuery("#select-year").val();
		var month=jQuery("#select-month").val();
		
		//获取指定年月的天数
		var days=getDays(year,month);
		
		//根据得出的天数重新初始化日
		options='';
		for(var day=1; day<=days ; day++){
			options += '<option value="'+day+'">'+day+'</option>';
		}
		jQuery("#select-day-parent").html('<select id="select-day" class="birthday-select"></select>');
		jQuery('#select-day').html(options);
		jQuery('#select-day').chosen({disable_search:true});
	}
	
	/**
	 * 计算指定年月的天数
	 */
	function getDays(year, month) {
		//year   四位数的年份，如果取值为0~99之间，则year = year + 1900。  
		//month  取值0~11之间，代表1月到12月。  
		//day    取值1~31之间的天数,某月的第0天，就是前一个月的最后一天。
		//得到前一个月的最后一天
	    return new Date(year, month, 0).getDate();
	}
	
	/**
	 * 初始化文件上传组件
	 */
	function initWebuploader(){
		jQuery("#picker").show();
		 uploader = WebUploader.create({
			
		    // swf文件路径
		    swf: resPath + '/bace/js/webuploader/swf/Uploader.swf',
		    
		    // 文件接收服务端。
		    server: sabace.handleUrlParam("/platform/sysmanage/user/upload-file"),
		    
		    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		    pick: '#picker',
		    
		    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
		    resize: false,
		    auto: true,
		    accept: {
		        title: 'Images',
		        extensions: 'gif,jpg,jpeg,bmp,png',
		        mimeTypes: 'image/*'
		    }
		});
		uploader.on( 'uploadSuccess', function( file ,response) {
			sabace.timeout(function(){
				jQuery("#uploadProgress").slideUp();
				jQuery("#picker").css("margin","0px");
				showJcrop(response);
			},500);
		});
		uploader.on( 'uploadProgress', function( file, percentage ) {
			jQuery("#uploadProgress").html(Math.round(percentage*100)+'%');
			if(Math.round(percentage*100) == 100){
				jQuery("#uploadProgress").html(sabace.getMessage('user.label.uploadSucceed'));
			}
		});
		uploader.on( 'startUpload', function() {
			jQuery("#uploadProgress").slideDown();
			jQuery("#uploadProgress").html('0%');
			jQuery("#cropImageDiv").empty();
		});		
	}
	
	/**
	 * 文件上传成功，服务器处理返回后回调方法
	 */
	function showJcrop(data){
		uploader.reset();
	//	fileName=data.fileName;
	//	serverFilePath = data.url;
		initJcrop(data.width,data.height);
	}
	
	/**
	 * 获取截图选择区域,计算出坐标对应图片真实的坐标
	 */
	function showCoords(c) {
		if (parseInt(c.w) > 0) {
			tcx = (c.x / (imageWidth * zoomRatio)) * imageWidth;
			tcy = (c.y / (imageHeight * zoomRatio)) * imageHeight;
			tcw = ((c.x2 - c.x) / (imageWidth * zoomRatio)) * imageWidth;
			tch = ((c.y2 - c.y) / (imageHeight * zoomRatio)) * imageHeight;
			if ((tcx + tcw) > imageWidth) {
				tcw = imageWidth - tcx;
			}
			if ((tcy + tch) > imageHeight) {
				tch = imageHeight - tcy;
			}
			var rx = xsize / c.w;
			var ry = ysize / c.h;
			pimg.css({
				width: Math.round(rx * boundx) + 'px',
				height: Math.round(ry * boundy) + 'px',
				marginLeft: '-' + Math.round(rx * c.x) + 'px',
				marginTop: '-' + Math.round(ry * c.y) + 'px'
			});
		}
	}
	
	/**
	 * 获取截图选择区域
	 */
	function getRandom() {
		var dim = jcrop_api.getBounds();
		
		//默认图片剪切区域选择宽度
		var selectionWidth = 100;
		var x =0;
		var y =0;
		if (dim[0] >= selectionWidth && dim[1] >= selectionWidth) {
			 x = (dim[0] - selectionWidth) / 2;
			 y = (dim[1] - selectionWidth) / 2;
		} else {
			if (dim[0] > dim[1]) {
				selectionWidth = dim[1];
				x = (dim[0] - selectionWidth) / 2;
				y = 0;
			} else if (dim[0] < dim[1]) {
				selectionWidth = dim[0];
				x = 0;
				y = (dim[1] - selectionWidth) / 2;
			} else {
				selectionWidth = dim[0];
				x = 0;
				y = 0;
			}
		}
		var x2 = x + selectionWidth;
		var y2 = y + selectionWidth;
		return [x, y, x2, y2];
	}
	
	/**
	 * 初始化jcrop控件
	 */
	function initJcrop(imageTrueWidth, imageTrueHeight) {
		jQuery("#preview-tr").show();
		jQuery("#cropImageDiv").css("background","url(" + resPath + "/resources/platform/sysmanage/user/img/bg.jpg)");
		imageWidth = imageTrueWidth;
		imageHeight = imageTrueHeight;
		jQuery("#cropImageDiv").empty();
		if (jcrop_api != null) {
			jcrop_api.destroy();
		}
//		var sPath = sabace.handleUrlParam("/platform/sysmanage/user/get-upload-pic")+ '?serverFilePath=' + path + '&fileName='+fName;
		var pPath = sabace.handleUrlParam("/platform/readByteImg")+"?_t="+new Date().getTime();
		
		jQuery("#cropImageDiv").append('<img id="element_id" />');
		jQuery("#element_id").attr("src", pPath);
		jQuery("#preview").attr("src", pPath);
		//样式控制，对不同大小的图片需要居中显示
		if (imageTrueWidth > cropImageDivWidth || imageTrueHeight > cropImageDivHeight) {
			jQuery("#cropImageDiv").css({
				padding:'0px',
				height:cropImageDivHeight + 'px',
				width:cropImageDivWidth + 'px'
			});
			
			if (imageTrueWidth > cropImageDivWidth && imageTrueHeight <= cropImageDivHeight) {
				zoomRatio = cropImageDivWidth / imageTrueWidth;
				jQuery("#element_id").width(imageTrueWidth * zoomRatio + "px");
				zoomedImageTrueHeight = imageTrueHeight * zoomRatio;
				jQuery("#cropImageDiv").css("paddingTop", (cropImageDivHeight - zoomedImageTrueHeight) / 2 + "px");
			} else if (imageTrueWidth <= cropImageDivWidth && imageTrueHeight > cropImageDivHeight) {
				zoomRatio = cropImageDivHeight / imageTrueHeight;
				jQuery("#element_id").height(imageTrueHeight * zoomRatio + "px");
				zoomedImageTrueWidth = imageTrueWidth * zoomRatio;
				jQuery("#cropImageDiv").css("paddingLeft", (cropImageDivWidth - zoomedImageTrueWidth) / 2 + "px");
			} else if (imageTrueWidth > cropImageDivWidth && imageTrueHeight > cropImageDivHeight) {
				var trueWidthToCropDivWidth = cropImageDivWidth / imageTrueWidth;
				var trueHeightToCropDivHeight = cropImageDivHeight / imageTrueHeight;
				if (trueWidthToCropDivWidth <= trueHeightToCropDivHeight) {
					zoomRatio = cropImageDivWidth / imageTrueWidth;
					jQuery("#element_id").width(imageTrueWidth * zoomRatio + "px");
					zoomedImageTrueHeight = imageTrueHeight * zoomRatio;
					jQuery("#cropImageDiv").css("paddingTop", (cropImageDivHeight - zoomedImageTrueHeight) / 2 + "px");
				} else {
					zoomRatio = cropImageDivHeight / imageTrueHeight;
					jQuery("#element_id").height(imageTrueHeight * zoomRatio + "px");
					zoomedImageTrueWidth = imageTrueWidth * zoomRatio;
					jQuery("#cropImageDiv").css("paddingLeft", (cropImageDivWidth - zoomedImageTrueWidth) / 2 + "px");
				}
			}
		} else {
			zoomRatio = 1;
			jQuery("#cropImageDiv").css({
				paddingTop:  (cropImageDivHeight - imageTrueHeight) / 2 + "px",
				paddingLeft:  (cropImageDivWidth - imageTrueWidth) / 2 + "px",
			});
		}
		
		//初始化Jcrop
		jQuery('#element_id').Jcrop({
			
			//选框宽高比。说明：width/height
			aspectRatio: xsize / ysize, 
			onSelect: showCoords,
			onChange: showCoords,
			animationDelay: 20,
			
			//其他可取的值：jcrop-dark,jcrop-light,jcrop-normal
			addClass: 'jcrop-light'
		}, function() {
			
			//初始化完成以后调用,用于选中剪切区域
			jcrop_api = this;
			var bounds = jcrop_api.getBounds();
			boundx = bounds[0];
			boundy = bounds[1];
			sabace.timeout(function() {
				jcrop_api.animateTo(getRandom());
			}, 300);
		});
	}
	
	/**
	 * 保存用户信息，保存用户头像图片
	 */
	function saveUserInfo() {
		
		//验证控件值的合法性
		var isPass = jQuery('.div-left').validationEngine('validate');
		if(!isPass){
			return;
		}	 
		if(jQuery(".fa-check-square-o").length <1){
			jQuery('#female').validationEngine('showPrompt', sabace.getMessage('user.label.pleaseSelectSex'), 'error','topRight',true);
			return;
		}else{
			jQuery('#female').validationEngine('hide');
		}
		
		// 获取用户基本信息
		var sex=jQuery(".fa-check-square-o").eq(0).attr("id");
		if(sex == 'male'){
			sex ='1';
		}else if(sex == 'female'){
			sex ='0';
		}else{
			sex ='9';
		}
		var bardianSign = jQuery("#bardianSign").val();
		var userName = jQuery("#userName").val();
		var year=jQuery("#select-year").val();
		var month=jQuery("#select-month").val();
		var day=jQuery("#select-day").val();
		if(month<10){
			month='0'+month;
		}
		if(day<10){
			day='0'+day;
		}
		var birthday=year+"-"+month+"-"+day;
		
		//定义请求参数
		var paramData={
				userName: userName,
				bardianSign: bardianSign,
				birthday:birthday,
				sex:sex
		};
		
		//获取头像剪切信息
		if (jcrop_api != null && jcrop_api.tellSelect().x != jcrop_api.tellSelect().x2) {
			
			//选取区域在图片上的实际X轴坐标
			paramData.tcx= Math.floor(tcx);
			
			//选取区域在图片上的实际Y轴坐标
			paramData.tcy= Math.floor(tcy);
			
			//选取区域在图片上的实际宽度
			paramData.tcw= Math.floor(tcw);
			
			//选取区域在图片上的实际高度
			paramData.tch= Math.floor(tch);
			
			//服务器临时图片名称
		//	paramData.fileName = fileName;
			
			//文件服务器
		//	paramData.serverFilePath=serverFilePath,
			
			//代表保存信息的时候需要同时保持用户头像图片信息
			paramData.operType = '1';
		}
		
		//操作确认
		bi.dialog.confirm({
			title: sabace.getMessage('user.label.confirm'),
			message: sabace.getMessage('user.label.confirmSave'),
			callback: function(result){
				if (result) {
					
					//开始执行保存操作
					sabace.ajax({
						type: "post",
						cache: false,
						dataType: "json",
						loading: {
							title: sabace.getMessage('user.label.tip'),
							text: sabace.getMessage('user.label.pleaseWait')
						},
						data: paramData,
						url: sabace.handleUrlParam("/platform/sysmanage/user/save-user-info"),
						success: function(req) {
							if (req.flag == "succeed") {
								bi.dialog.show({
									title: sabace.getMessage('user.label.succeed'),
									message: sabace.getMessage('user.label.saveSuccesfully')
								});
							} else {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('user.label.error'),
									message: sabace.getMessage('user.label.saveFail')
								});
							}
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('user.label.error'),
								message: req.responseText || sabace.getMessage('user.label.saveError')
							});
						}
					});
				}
			}
		});
	}
});
