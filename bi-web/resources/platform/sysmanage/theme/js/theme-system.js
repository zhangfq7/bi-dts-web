define(['sabace','upload','theme/message'], function(sabace,upload,message) {
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
	var cropImageDivWidth = 250;
	var cropImageDivHeight = 50;
	//var fileName="";
	var isChecked=false;
	var options='';
	//var serverFilePath = '';
	jQuery(function(){
		//初始化选框背景色和选择项
		initBoxcolor();
         
		//初始化文件上传组件
		initWebuploader();
		
	
		//注册按钮事件
		jQuery('#saveThemeBtn').on("click",saveThemeInfo);
		
		//恢复系统设置
		jQuery('#recoverThemeBtn').on("click",recoverThemeInfo);
		
     
		
		//控件验证
		jQuery('.div-left').validationEngine({
			validationEventTrigger: 'input propertychange paste keyup ',
			promptPosition: 'topRight',
			showOneMessage: true
		});	
		
		//切换主题
		jQuery(".theme-system-bg-border").bind("click",function(){
			var color = jQuery(this).find(">div").attr("id");
			jQuery(".theme-test").remove();
			jQuery(".panel:eq(0)").append('<link class="theme-test" rel="stylesheet" href="'+resPath+'/bace/ui/css/flat-ui-'+color+'.css" />')
		})
		
	});
	
	
//选中颜色
	jQuery(".theme-system-bg-border").on('click',function(){
		var $this = jQuery(this);
		jQuery(".theme-system-bg-border").removeClass('checked');
		$this.addClass('checked');
		changeColor($this);
		
	})
	
	//改变选框背景颜色
	function changeColor(obj){		
	     var themcolor = obj.find(">div").css('background-color');
	     jQuery('#cropImageDiv,.preview-container').css({
    		 background:themcolor,
    		 "box-shadow": "0px 0px 3px 3px "+themcolor,
    	 });
	}
	
	
	
	
	
	//初始化选框背景颜色和选择项
	function initBoxcolor(){
		  sabace.ajax({
			url: sabace.handleUrlParam("/platform/sysmanage/theme/query-bg-color"),
			success: function(req) {
				var $obj = jQuery("#"+req.bgColor).parent()
				$obj.toggleClass('checked');
				changeColor($obj);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('theme.label.error'),
					message: req.responseText || sabace.getMessage('theme.label.saveFail')
				});
			}
		});
	}
	
	//上传头像
	/**
	 * 初始化文件上传组件
	 */
	function initWebuploader() {
		jQuery("#picker").show();
		uploader = WebUploader.create({

			// swf文件路径
			swf: resPath + '/bace/js/webuploader/swf/Uploader.swf',

			// 文件接收服务端。
			server: sabace.handleUrlParam("/platform/sysmanage/theme/upload-file"),

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
		uploader.on('uploadSuccess', function(file, response) {
			sabace.timeout(function() {
				jQuery("#uploadProgress").slideUp();
				jQuery("#picker").css("margin", "0px");
				showJcrop(response);
			}, 500);
		});
		uploader.on('uploadProgress', function(file, percentage) {
			jQuery("#uploadProgress").html(Math.round(percentage * 100) + '%');
			if (Math.round(percentage * 100) == 100) {
				jQuery("#uploadProgress").html(sabace.getMessage('user.label.uploadSucceed'));
			}
		});
		uploader.on('startUpload', function() {
			jQuery("#uploadProgress").slideDown();
			jQuery("#uploadProgress").html('0%');
			jQuery("#cropImageDiv").empty();
		});
	}
	
	
	/**
	 * 文件上传成功，服务器处理返回后回调方法
	 */
	function showJcrop(data) {
		uploader.reset();
		//fileName = data.fileName;
		//serverFilePath = data.url;
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
				marginTop: '-' + Math.round(ry * c.y) + 'px',
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
		imageWidth = imageTrueWidth;
		imageHeight = imageTrueHeight;
		jQuery("#cropImageDiv").empty();
		if (jcrop_api != null) {
			jcrop_api.destroy();
		}
		
		//var sPath = sabace.handleUrlParam("/platform/sysmanage/user/get-upload-pic")+ '?serverFilePath=' + path + '&fileName='+fName;
		var pPath = sabace.handleUrlParam("/platform/readByteImg")+"?_t="+new Date().getTime()+"&companyFlag=yes";
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
			maxSize:[250,50],
			onSelect: showCoords,
			onChange: showCoords,
			animationDelay: 20,
			//裁剪图片时的背景色
			bgColor:"transparent",
		
			//其他可取的值：jcrop-dark,jcrop-light,jcrop-normal
			addClass: 'jcrop-normal'
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
	 * 恢复系统主题设置
	 */
	function recoverThemeInfo(){
		bi.dialog.confirm({
			title: sabace.getMessage('theme.label.confirm'),
			message: sabace.getMessage('theme.label.recovery'),
			callback: function(result){
				if (result) {
					sabace.ajax({
						loading: {
							title: sabace.getMessage('theme.label.tip'),
							text: sabace.getMessage('theme.label.pleaseWait2')
						},
						url: sabace.handleUrlParam("/platform/sysmanage/theme/recover-theme"),
						success: function(req) {
							// 恢复成功后需要刷新页面
							bi.dialog.show({
								title: sabace.getMessage('theme.label.succeed'),
								message: sabace.getMessage('theme.label.restoreSuccesfully'),
								closable: false,
								nl2br: false,
								closeByBackdrop: false,
								closeByKeyboard: false,
								buttons: [{
									label: sabace.getMessage('theme.button.OK'),
									cssClass: 'btn-info',
									action: function(dialog) {
										window.location.reload();
									}
								}]
							});
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('theme.label.error'),
								message: req.responseText || sabace.getMessage('theme.label.saveError')
							});
						}
					});
				}
			}
		});
	}
	  
	
	/**
	 * 保存用户信息，保存用户头像图片
	 */
	function saveThemeInfo() {
		//获取logo剪切信息
		var paramData={};
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
			//paramData.fileName = fileName;
			
			//文件服务器
			//paramData.serverFilePath=serverFilePath;
			//代表保存信息的时候需要同时保持logo信息
			paramData.operType = '1';
						
		}
		
		//皮肤		
		paramData.skin=jQuery('.theme-system-bg-border.checked>div').attr('id')==undefined?'blue':jQuery('.theme-system-bg-border.checked>div').attr('id');
		
		//操作确认
		bi.dialog.confirm({
			title: sabace.getMessage('theme.label.confirm'),
			message: sabace.getMessage('theme.label.confirmSave'),
			callback: function(result){
				if (result) {
					
					//开始执行保存操作
					sabace.ajax({
						loading: {
							title: sabace.getMessage('theme.label.tip'),
							text: sabace.getMessage('theme.label.pleaseWait')
						},
						data: paramData,
						url: sabace.handleUrlParam("/platform/sysmanage/theme/save-theme"),
						success: function(req) {
							if (req.flag == "succeed") {
								bi.dialog.show({
									title: sabace.getMessage('theme.label.succeed'),
									message: sabace.getMessage('theme.label.saveSuccesfully')
								});
								sabace.timeout(function(){document.location.href = sabace.handleUrlParam("/platform/sysmanage/theme/systheme")},3000);
							} else {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('theme.label.error'),
									message: sabace.getMessage('theme.label.saveFail')
								});
							}
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('theme.label.error'),
								message: req.responseText || sabace.getMessage('theme.label.saveError')
							});
						}
					});
				}
			}
		});
	}
});







