define(['sabace', 'upload', 'user/message'], function(sabace, message) {
	var uploader;
	var imageWidth = 0;
	var imageHeight = 0;
	var jcrop_api = null;
	var boundx = 0;
	var boundy = 0;
	var pcnt = jQuery('.preview-container');
	var pimg = jQuery('.preview-container img');
	var xsize = pcnt.width();
	var ysize = pcnt.height();
	var zoomedImageTrueWidth;
	var zoomedImageTrueHeight;
	var zoomRatio = 0;
	var cropImageDivWidth = 140;
	var cropImageDivHeight = 140;
	var fileName = "";
	var isChecked = false;
	var editFlag = false;
	var options = '';
	var serverFilePath = '';

	function init() {
		//判断session用户是否存在，重新加载图片
		if(!sabace.IsEmpty(userInfoBeanId)){
			jQuery('.avatar').attr('src',sabace.handleUrlParam('/platform/readUserImg')+'?userImgId='+userInfoBeanId+'&_t='+new Date().getTime());
			jQuery('#preview').attr('src',sabace.handleUrlParam('/platform/readUserImg')+'?userImgId='+userInfoBeanId+'&_t='+new Date().getTime());
		}else{
			jQuery('.avatar').attr('src',sabace.handleUrlParam('/platform/readUserImg')+'?userImgId=default&_t='+new Date().getTime());
			jQuery('#preview').attr('src',sabace.handleUrlParam('/platform/readUserImg')+'?userImgId=default&_t='+new Date().getTime());
		}
		pcnt = jQuery('.preview-container');
		pimg = jQuery('.preview-container img');
		xsize = pcnt.width();
		ysize = pcnt.height();
		jQuery('.user-info-rgt').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true

		});

		//获取今年
		var currentYear = new Date().getFullYear();
		options = '';
		//初始化100年
		for (var year = currentYear; year >= currentYear - 100; year--) {
			options += '<option value="' + year + '">' + year + '</option>';
		}
		jQuery('#select-year').html(options);

		//初始化月
		options = '';
		for (var month = 1; month <= 12; month++) {
			options += '<option value="' + month + '">' + month + '</option>';
		}
		jQuery('#select-month').html(options);

		//初始化日
		options = '';
		for (var day = 1; day <= 31; day++) {
			options += '<option value="' + day + '">' + day + '</option>';
		}
		jQuery('#select-day').html(options);

		var depIdShow = $("#depIdShow").val();
		if (depIdShow == undefined) {
			depIdShow = "";
		}

		//如果已经设置过生日
		if (!sabace.IsEmpty(birthday2)) {
			var year = birthday2.split('-')[0];
			var month = parseInt(birthday2.split('-')[1]);
			var day = parseInt(birthday2.split('-')[2]);
			jQuery('#select-year').val(year);
			jQuery('#select-month').val(month);
			jQuery('#select-day').val(day);

			//设置部门

			$("#add-dep").attr("truevalue", depIdShow);
			$("#add-dep").attr("value", $("#depName").val());
		}

		//渲染select控件
		jQuery('#select-year').chosen({
			disable_search: true
		});
		jQuery('#select-day').chosen({
			disable_search: true
		});
		jQuery('#select-month').chosen({
			disable_search: true
		});

		//年月的下拉框注册改变事件，用来更改对应年月包含的天数
		jQuery('#select-year').on("change", dateChanged);
		jQuery('#select-month').on("change", dateChanged);


		//如果已经设置过性别
		if (!sabace.IsEmpty(sex2)) {
			if (sex2 == '1') {
				jQuery("#mail").removeClass("fa-square-o");
				jQuery("#mail").addClass("fa-check-square-o");
			} else if (sex2 == '0') {
				jQuery("#femail").removeClass("fa-square-o");
				jQuery("#femail").addClass("fa-check-square-o");
			} else if (sex2 == '9') {
				jQuery("#unknown").removeClass("fa-square-o");
				jQuery("#unknown").addClass("fa-check-square-o");
			}
		}

		//点击checkbox事件的效果
		jQuery('.checkBox').on("click", function() {
			isChecked = jQuery(this).hasClass("fa-square-o");
			jQuery('.checkBox').removeClass("fa-check-square-o");
			jQuery('.checkBox').addClass("fa-square-o");
			if (isChecked) {
				jQuery(this).removeClass("fa-square-o");
				jQuery(this).addClass("fa-check-square-o");
			}
		});
		if (sex2 == "") {
			jQuery("#mail").eq(0).trigger("click");
			editFlag = false;
		} else {
			editFlag = true;
		}


		$("#add-dep").treeselect({
			height: 200,
			searchAjaxParam: "depName",
			width: 310,
			chkStyle: "radio",
			url: sabace.handleUrlParam('/platform/sysmanage/dept/company-dept'),
			onCheck:function(){
				$("#div" + this.id).fadeOut("fast");
			}
		});


		//初始化文件上传组件
		initWebuploader();

		$('.chosen-select').chosen({
			disable_search: true
		});

		//保存修改
		jQuery('#saveUserInfoBtn').on("click", saveUserInfo);

		//取消
		jQuery('#cancelUserInfoBtn').on("click", function() {

			window.parent.location.reload();


		});


	}

	/**
	 * 当生日的年月改变的时候调用
	 */
	function dateChanged() {
		var year = jQuery("#select-year").val();
		var month = jQuery("#select-month").val();

		//获取指定年月的天数
		var days = getDays(year, month);

		//根据得出的天数重新初始化日
		options = '';
		for (var day = 1; day <= days; day++) {
			options += '<option value="' + day + '">' + day + '</option>';
		}
		jQuery("#select-day-parent").html('<select id="select-day" class="birthday-select"></select>');
		jQuery('#select-day').html(options);
		jQuery('#select-day').chosen({
			disable_search: true
		});
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
			server: sabace.handleUrlParam("/platform/sysmanage/user/upload-file")+"?userFlag=other",

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
	//	serverFilePath = data.url;
		initJcrop(data.width, data.height);
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
			console.log("xsize=" + xsize)
			console.log("ysize=" + ysize)
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
		var x = 0;
		var y = 0;
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
		jQuery("#cropImageDiv").css("background", "url(" + resPath + "/resources/platform/sysmanage/user/img/bg.jpg)");
		imageWidth = imageTrueWidth;
		imageHeight = imageTrueHeight;
		jQuery("#cropImageDiv").empty();
		if (jcrop_api != null) {
			jcrop_api.destroy();
		}
		
	//	var sPath = sabace.handleUrlParam("/platform/sysmanage/user/get-upload-pic")+ '?serverFilePath=' + path + '&fileName='+fName;
		var pPath = sabace.handleUrlParam("/platform/readByteImg")+"?_t="+new Date().getTime()+"&userFlag=other";
		jQuery("#cropImageDiv").append('<img id="element_id" />');
		jQuery("#element_id").attr("src", pPath);
		jQuery("#preview").attr("src", pPath);
		//样式控制，对不同大小的图片需要居中显示
		if (imageTrueWidth > cropImageDivWidth || imageTrueHeight > cropImageDivHeight) {
			jQuery("#cropImageDiv").css({
				padding: '0px',
				height: cropImageDivHeight + 'px',
				width: cropImageDivWidth + 'px'
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
				paddingTop: (cropImageDivHeight - imageTrueHeight) / 2 + "px",
				paddingLeft: (cropImageDivWidth - imageTrueWidth) / 2 + "px",
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
	function saveUserInfo(dialog) {
		//验证控件值的合法性
		var isPass = jQuery('.user-info-rgt').validationEngine('validate');
		if (!isPass) {
			return;
		}

		var userName = $("#paneluserName").val().trim();

		if ($("#add-dep").attr("truevalue") == undefined) {
			bi.dialog.show({
				title: '提示框',
				message: '请选择部门！',
				cssClass: 'register-dialog',
				nl2br: false,
				closable: true,
				closeByBackdrop: false,
				closeByKeyboard: false,
				buttons: [{
					label: '确定',
					action: function(dialogItself) {
						dialogItself.close();
					}
				}]
			});
		}
		var depId = $("#add-dep").attr("truevalue").trim();

		var sex = $('.fa-check-square-o').attr("sex2");
		var jobIds = $('#add-job-id').val();
		var mobileNum = $('#panelmobile_num').val().trim();
		var email = $('#panelemail').val().trim();

		var year = jQuery("#select-year").val();
		var month = jQuery("#select-month").val();
		var day = jQuery("#select-day").val();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		var birthday = year + "-" + month + "-" + day;
		var sign = jQuery("#sign").val();
		var paramData = {
			userName: userName,
			birthday: birthday,
			depId: depId,
			sex: sex,
			jobIds: jobIds,
			mobileNum: mobileNum,
			email: email,
			bardianSign: sign
		};

		//获取头像剪切信息
		if (jcrop_api != null && jcrop_api.tellSelect().x != jcrop_api.tellSelect().x2) {

			//选取区域在图片上的实际X轴坐标
			paramData.tcx = Math.floor(tcx);

			//选取区域在图片上的实际Y轴坐标
			paramData.tcy = Math.floor(tcy);

			//选取区域在图片上的实际宽度
			paramData.tcw = Math.floor(tcw);

			//选取区域在图片上的实际高度
			paramData.tch = Math.floor(tch);

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
			message: sabace.getMessage('user.label.confirmPreserve'),
			callback: function(result) {
				if (result) {
					if (editFlag) {
						var userId = $("#paneluserId").val().trim();
						paramData.userId = userId;
						paramData.userImageId = userId;
						url = sabace.handleUrlParam('/platform/sysmanage/userlist/user-list-edit')+"?userFlag=other";
					} else {
						var url = sabace.handleUrlParam('/platform/sysmanage/userlist/user-list-add')+"?userFlag=other";
					}
					//开始执行保存操作
					sabace.ajax({
						data: paramData,
						url: url,
						success: function(req) {
							if (req.count == 0) {
								bi.dialog.show({
									title: sabace.getMessage('user.label.tip'),
									message: sabace.getMessage('user.userlist.label.signature'),
									nl2br: false,
									closable: true,
									closeByBackdrop: false,
									closeByKeyboard: false
								});
								return;
							}

							var flag = req.flag;

							if (flag == 'success') {
								bi.dialog.show({
									title: sabace.getMessage('user.label.succeed'),
									message: sabace.getMessage('user.label.saveSuccesfully'),
									buttons: [{
										label: '确定',
										cssClass: 'btn-info',
										action: function(dialogItself) {
											jQuery("#searchButton").trigger("click");
											dialogItself.close();
											dialog.close();
										}
									}]
								});

							} else if (flag == 'email') {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('提示'),
									message: sabace.getMessage('邮箱已存在'),
									buttons: [{
										label: '确定',
										cssClass: 'btn-info',
										action: function(dialogItself) {
											dialogItself.close();
										}
									}]
								});

							} else if (flag == 'phone') {

								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('提示'),
									message: sabace.getMessage('手机号码已存在'),
									buttons: [{
										label: '确定',
										cssClass: 'btn-info',
										action: function(dialogItself) {
											dialogItself.close();
										}
									}]
								});

							} else {

								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('user.label.error'),
									message: sabace.getMessage('user.label.saveError')
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

	return {
		init: init,
		saveUserInfo: saveUserInfo
	}
});