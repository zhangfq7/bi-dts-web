define(['sabace', 'upload', 'proviceOrCitySelect'], function(sabace, upload, proviceOrCitySelect) {

	// 文件上传组件
	var uploader = null;
	// 文件上传错误提示
	var errTip = null;
	// 上传文件信息
	/*
	 * currentColNum:当前列序号;firstLineTitle:是否为字段标题;columnNames:列名(A、B、C......);columnNum:列数;
	 * typeArr:类型数组;lengthArr:长度数组;titleArr:标题数组;fieldArr:字段名称数组;filterArr:筛选类型数组;
	 * tableName:数据库表名;columnTypeArr:字段类型(如：VARCHAR(20),DECIMAL(20,
	 * 3)等);fileSuffix:文件后缀; valuesStr:文件校验后前10条数据的字符串拼接，供临时表插入语句用;
	 * dataName:文件名称;dataNum:记录条数;dataDesc:文件描述;
	 * dataId:数据编码;columnData:jqgrid本地数据 data属性值;attrData:指标信息数据;
	 */
	var fileConfigInfo = {};
	// jqgrid配置
	var dataOptions = {};
	// jqgrid模型
	var commonColModel = {};
	var fileName = null;
	var fileDataName = null;
	var fileDataDesc = null;
	var scrollPosition = 0;
	var modType = "1";
	var footerFlag = false;
	// 记忆点击列列序号
	var memoryNum = null;
	var spinOption = null;
	var spinDiv = null;
	var spinHeight = null;
	var textDiv = null;
	// 修改时初始指标信息
	var originalFilter = [];
	// 修改之后的指标
	var nowFilter = [];
	// 修改时初始字段feild
	var originalField = [];
	// 修改之后的字段feild
	var nowField = [];
	// 修改时是否需要改变导入状态，"0"为不改变，"1"为改变，改成导入状态，说明需要重新执行, "4"为用户切换类型，需要判断数据连接、报表是否已经做过了
	var importStateType = "0";
	// 文件过期需要重新上传文件  true为不需要上传，false为需要上传
	var reUploadFlag = true;
	// 业务分类是否已经初始化过
	var classifyFlag = false;
	// 修改时初始指标信息
	var originalAttr = [];
	// 修改之后指标信息
	var nowAttr = [];

	jQuery(function() {
		// 监控点击事件
		initMonitorEvent();
		// 第一行是否是字段标题选项初始化
		jQuery('[data-toggle="radio"]').iCheck({
			checkboxClass: 'icheckbox_minimal',
			radioClass: 'iradio_minimal'
		});
		// 下拉框初始化
		jQuery('.chosen-select').chosen();
		// 初始化spin
		initSpinDiv();
		// 点击tab时
		jQuery('.step-tab').on("click", selectShow);
		// 点击是否为标题时
		jQuery("input[name='optionsRadio']").on("ifChecked", setEditTiltle);
		// webuploader初始化
		initWebuploader();
		// 为修改时像后台发送请求获取
		if (opType == "edit" || opType == "append") {
			initGetEditData();
		}
		// 选择文件"确定"
		jQuery('#fileButton').on("click", fileUpload);
		// 数据处理"取消"
		jQuery('#cancelButton').on("click", dataCancel);
		// 数据处理"确定"
		jQuery('#saveButton').on("click", dataSave);
		// 设置字段"取消"
		jQuery('#fieldCanButton').on("click", fieldCancel);
		// 设置字段"确定"
		jQuery('#fieldSaveButton').on("click", fieldSave);
		// 完成"确定"
		jQuery('#completeSaveButton').on("click", completeSave);
		// 设置横线高亮设置
		setStepLine(1);
		// 函数生成点击事件
		jQuery('#generateData').on("click", generateData);

		// 输入项校验
		jQuery('#fileForm').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});

		// txt文件上传
		jQuery('#fileUploadType .txt').on("click", txtFileUpload);
		// excel文件上传
		jQuery('#fileUploadType .excel').on("click", excelFileUpload);
		// csv文件上传
		jQuery('#fileUploadType .csv').on("click", csvFileUpload);
		
		// 函数框隐藏效果
		jQuery(".funcForm").slideUp();
		
		// 文件上传按钮事件
		jQuery('#uploadFile').on("click", uploadFile);
		// 文件上传取消按钮事件
		jQuery('#uploadCancel').on("click", uploadCancel);
		// 重新上传按钮事件
		jQuery('#reUploadFile').on("click", reUploadFile);
	});

	// 监控点击事件
	function initMonitorEvent() {
		// 监控点击事件
		document.onmousedown = function(event) {
			var eventTarget = event.target;
			if(eventTarget.id == "dimName" || eventTarget.id == "dimNameForOther"){
				return;
			}
			// 非自定义维度查询
			if(eventTarget.id == "dimSearch" || eventTarget.id == "dimSearchForOther"){
				// "1"为非自定义列  "2"为自定义列
				var type = "1";
				if(eventTarget.id == "dimSearchForOther"){
					type = "2";
				}
				// 维度查询
				dimSearch(type);
				return;
			}
			if (eventTarget.id == "dim" || eventTarget.id == "dimSelect") {
				jQuery('.data-info-grid th #dimOther').poshytip('hide');
				jQuery('.data-info-grid th #columnOper').poshytip('hide');
				return;
			}
			if (eventTarget.id == "dimOther" || eventTarget.id == "dimOtherSelect") {
				jQuery('.data-info-grid th #dim').poshytip('hide');
				jQuery('.data-info-grid th #columnOper').poshytip('hide');
				return;
			}
			if (eventTarget.id == "columnOper") {
				jQuery('.data-info-grid th #dimOther').poshytip('hide');
				jQuery('.data-info-grid th #dim').poshytip('hide');
				return;
			}
			if (eventTarget == undefined || eventTarget.id != "dim" || eventTarget.id != "columnOper" || eventTarget.id != "dimOther") {
				jQuery('.data-info-grid th #dim').poshytip('hide');
				jQuery('.data-info-grid th #dimOther').poshytip('hide');
				jQuery('.data-info-grid th #columnOper').poshytip('hide');
				return;
			}
		}
	}
	
	// 维度查询事件
	function dimSearch(type){
		var name = null;
		if(type == "1"){
			name = jQuery('.tip-yellowsimple #dimName').val();
		}else{
			name = jQuery('.tip-yellowsimple #dimNameForOther').val();
		}
		// 请求后台获取
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/data-search-dim"),
			data: {
				dimName: name
			},
			success: function(req) {
				var dimList = req.dimList;
				getSelectLi(type,dimList,name);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.queryFilterTypeError')
				});
			}
		});
	}

	// 修改时获取修改的数据
	function initGetEditData() {
		fileConfigInfo.dataId = dataId;
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/get-file-data"),
			data: {
				dataId: fileConfigInfo.dataId
			},
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: '<span class="f16 bolder gray">' + sabace.getMessage('data.import.text.fileInfoLoading') + '</span>',
				spin: true
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 修改数据返回成功后的处理
					getEditDataSuccess(req);
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: req.msg
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || sabace.getMessage('data.import.message.queryEditDataError')
				});
			}
		});
	}

	// 判断导入状态是否成功，如果为失败状态的弹出提示框告知用户展示的数据是上次上传导入的数据
	function showDataTip(importState){
		if(!reUploadFlag){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.reUpload')
			});
		}else if(importState == "7"){
			bi.dialog.show({
				type: bi.dialog.TYPE_INFO,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.lastData')
			});
		}
	}
	
	// 修改数据返回成功后的处理
	function getEditDataSuccess(req) {
		fileConfigInfo = req.fileConfigBean;
		fileConfigInfo.attrData = req.attrDatas;
		fileConfigInfo.columnData = req.columnDatas;
		fileConfigInfo.dimData = req.dimDatas;
		fileConfigInfo.footerData = req.footerDatas;
		fileConfigInfo.columnNum = req.columnNum;
		// 设置业务分类
		initClassify(req.classifyList, false);
		if(req.reUpload == "fail"){
			reUploadFlag = false;
		}
		// 根据fileConfigInfo.attrData的长度来dataId判断是否有效
		if (fileConfigInfo.attrData.length == 0) {
			opType = "add";
		} else {
			// 判断导入状态是否成功，如果为失败状态的弹出提示框告知用户展示的数据是上次上传导入的数据
			showDataTip(fileConfigInfo.importState);
			var attrData = req.attrDatas;
			var length = attrData.length;
			var filterType = null;
			var field = null;
			var attrId = null;
			var dimId = null;
			var attrObj = {};
			// 取出指标中的所有的筛选类型
			for(var i = 0;i < length; i++){
				filterType = attrData[i].filterType;
				field = attrData[i].fieldName;
				originalFilter.push(filterType);
				originalField.push(field);
				attrId = attrData[i].attrId;
				dimId = attrData[i].dimId;
				attrObj = {
					attrId: attrId,
					filterType: filterType,
					dimId: dimId
				};
				originalAttr.push(attrObj);
			}
			// 放开所有的页签 展示数据处理
			jQuery('#oneStep').addClass("active-Finished");
			jQuery('#twoStep').removeClass("active-notFinished");
			jQuery('#twoStep').addClass("active-Finished");
			// 面板内容切换
			if(opType == "edit"){
				if(reUploadFlag){
					jQuery('#dataInfo').removeClass("hide");
					jQuery('#fileInfo').addClass("hide");
					setStepLine(2);
				}
			}
			if(!reUploadFlag){
				jQuery('.bottom-button-common').addClass("hide");
			}
			jQuery('#thirdStep').removeClass("active-notFinished");
			jQuery('#thirdStep').addClass("active-Finished");
			jQuery('#fourStep').removeClass("active-notFinished");
			jQuery('#fourStep').addClass("active-Finished");
			jQuery('.main-panel').removeClass('hide');
			// 初始化数据处理页签数据
			initCommonGrid();
			// 初始化设置字段页签数据
			var dataName = fileConfigInfo.dataName;
			fileDataName = dataName;
			var dataNum = fileConfigInfo.dataNum;
			var dataDesc = fileConfigInfo.dataDesc;
			fileDataDesc = dataDesc;
			jQuery('#dataName').val(dataName);
			jQuery('#dataNum').val(dataNum);
			jQuery('#recordNum').val(dataNum);
			jQuery('#dataDesc').val(dataDesc);
			// 初始化完成页签数据
			jQuery('#dataName_finish').html(dataName);
			jQuery('#dataNum_finish').html(dataNum);
			jQuery('#recordNum_finish').html(dataNum);
			jQuery('#dataDesc_finish').html(dataDesc);
			// 设置业务分类
			var classifyId = fileConfigInfo.classifyId;
			fileConfigInfo.classifyId = classifyId;
			jQuery("#classifySel").val(classifyId);
			jQuery("#classifySel").trigger("chosen:updated");
			var classifyName = jQuery("#classifySel").find("option:selected").text();
			if(classifyName == null || classifyName == ""){
				classifyName = "无";
			}
			fileConfigInfo.classifyName = classifyName;
			jQuery('#classify_finish').html(classifyName);
		}
	}

	// txt文件上传
	function txtFileUpload() {
		jQuery("#filePicker input:file").attr('accept','.txt'); 
		jQuery("#filePicker input:file").trigger('click');
	}

	// excel文件上传
	function excelFileUpload() {
		jQuery("#filePicker input:file").attr('accept','.xls,.xlsx'); 
		jQuery("#filePicker input:file").trigger('click');
	}

	// csv文件上传
	function csvFileUpload() {
		jQuery("#filePicker input:file").attr('accept','.csv'); 
		jQuery("#filePicker input:file").trigger('click');
	}

	// 初始化spin
	function initSpinDiv(){
		spinOption = {
				background : 'rgba(244, 244, 244, 0.51)',//蒙层背景颜色
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
		spinDiv = jQuery("<div>",{
			"id" :	'fileSpin',		
			"css":{
				'position': "absolute",
				'bottom': 0,
				'right': 0,
				'left': 0,
				'top': 0,
				'background': spinOption.background,
				'z-index': 99999999,
				'display':"none"
			}
		});
		spinHeight = spinOption.width + spinOption.length + spinOption.radius;
		textDiv = jQuery("<div>",{
			'id': 'fileSpinText',
			'html': '<span class="f16 bolder gray">文件上传完成,正在校验文件,请稍后...</span>',
		    'css' : {
		    	'position': "absolute",
		    	'min-width': '400px',
		    	'top': '50%',
		    	'left': '50%',
		    	'color': '#fff',
		    	'margin-top': spinHeight + 10,
		    	'margin-left':'-200px',
		    	'text-align':'center'
		    }
		});
	}
	
	// 文件上传控件Webuploader
	function initWebuploader() {
		if (!WebUploader.Uploader.support()) {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.updateFlashPlayer')
			});
			throw new Error('WebUploader does not support the browser you are using.');
		}
		uploader = WebUploader.create({
			pick: {
				id: '#filePicker',
				label: sabace.getMessage('data.import.uploader.label')
			},
			dnd: '.file-block', // 拖拽区域
			accept: {
				// 可以上传的文件类型
				title: 'doc', // 文字描述
				extensions: 'txt,xls,csv,xlsx', // 文件后缀 多个用逗号分割
				mimeTypes: [ // 文件类型 多个用逗号分割
					'text/plain', // txt
					'application/vnd.ms-excel', // excel2003
					'text/csv', // csv
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // excel
				].join(',')
			},
			// swf文件路径
			swf: resPath + '/bace/js/webuploader/swf/Uploader.swf',
			disableGlobalDnd: true, // 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
			chunked: false, // 分片上传
			server: sabace.handleUrlParam('/platform/resmanage/data/data-file-upload'),
			auto: false, // 只要有东西自动上传，不需要手动点击上传
			resize: false, // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			threads: 1, // 上传并发数,允许同时最大上传进程数
			fileNumLimit: 1, // 可以上传的文件数量
			fileSizeLimit: 500 * 1024 * 1024, // 总文件大小 500 M
			fileSingleSizeLimit: 500 * 1024 * 1024, // 单个文件大小 500 M
			timeout: 0  // 超时时间, 解决文件数据量大校验时不设置超时时间
		});

		// 当有文件被添加进队列的时候
		uploader.on('fileQueued', function(file) {
			jQuery('.file-uploader-text').addClass("hide");
			jQuery('.file-upload-pic').addClass("hide");
			// 展示上传文件信息
			jQuery('.import-file').removeClass("hide");
			// 将所有的图标隐藏
			jQuery('.import-type-pic').addClass("hide");
			// 文件名称
			var fileName = file.name;
			// 文件格式
			var fileSuffix = file.ext;
			// 文件大小(字节)
			var fileSize = file.size;
			// 文件类型展示
			var importFileType = null;
			if(fileSuffix == "txt") {
				jQuery('#txtType').removeClass("hide");
				importFileType = "文本文件";
			}else if(fileSuffix == "csv") {
				jQuery('#csvType').removeClass("hide");
				importFileType = "csv 文件";
			}else {
				jQuery('#excelType').removeClass("hide");
				importFileType = "Excel 文件";
			}
			// 文件大小转换
			fileSize = bytesToSize(fileSize);
			jQuery('#importFileName').html(fileName);
			jQuery('#importFileType').html(importFileType);
			jQuery('#importFileSize').html(fileSize);
			
			// 第一行是否为字段标题
			jQuery('.file-info-label').removeClass("hide");
			// 上传和取消按钮
			jQuery('.upload-button').removeClass("hide");
		});

		// 文件错误提示
		uploader.on('error', function(code) {
			errTip = showErrTip(code);
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: errTip
			});
			return;
		})

		// 文件上传过程中创建进度条实时显示
		uploader.on('uploadProgress', function(file, percentage) {
			var fileProgress = jQuery('.progress');
			var filePercent = fileProgress.find('.progress-bar');
			// 避免重复创建
			if (!filePercent.length) {
				filePercent = jQuery('<div class="progress-bar progress-bar-info progress-bar-striped active" style="width: 0%;">' +
					'<div class="fileSucFlag"></div>' +
					'</div>').appendTo(fileProgress).find('.progress-bar');
			}
			filePercent.css({
				"width": percentage * 100 + "%"
			})
			filePercent.find('.fileSucFlag').text(Math.ceil(percentage * 100) + '%');
			if(filePercent.find('.fileSucFlag').text() == "100%"){
				if(!jQuery('.file-block #fileSpin').length){
					jQuery('.file-block').append(spinDiv);
					spinDiv.spin(spinOption).show();
					spinDiv.append(textDiv);
				}
			}
		});

		// 文件上传成功
		uploader.on('uploadSuccess', function(file,response) {
			fileName = file.name;
			fileName = fileName.substring(0, fileName.indexOf("."));
			file.statusText = "complete";
			spinDiv.spin('close');
			spinDiv.remove();
			// 文件上传并校验成功
			if(response.resFlag == "success"){
				fileConfigInfo = response.fileConfigBean;
				// 展示下一步按钮
				jQuery('#fileButton').removeClass("hide");
			} else if(response.resFlag == "checkFail") {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: response.msg
				});
			} else {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: response.msg
				});
			}
		});
		
		// 文件上传出错
		uploader.on('uploadError', function(file) {
			spinDiv.spin('close');
			spinDiv.remove();
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.uploadFileError')
			});
		});
	}
	
	// 文件大小转换
	function bytesToSize(bytes) {  
       if (bytes === 0) return '0 B';  
        var k = 1024;  
        sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];  
        i = Math.floor(Math.log(bytes) / Math.log(k));  
	    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];   
	}  
	
	// 文件取消按钮事件
	function uploadCancel(){
		// 隐藏文件信息
		jQuery('.import-file').addClass("hide");
		// 隐藏是否第一行为标题
		jQuery('.file-info-label').addClass("hide");
		jQuery('.file-info-title').addClass("hide");
		// 隐藏上传取消按钮
		jQuery('.upload-button').addClass("hide");
		jQuery('.file-uploader-text').removeClass("hide");
		jQuery('.file-upload-pic').removeClass("hide");
		// 进度条隐藏
		jQuery('.progress').addClass("hide");
		uploader.reset();
	}

	// 文件上传按钮事件
	function uploadFile(){
		// 获取第一行是否为字段标题
		fileConfigInfo.firstLineTitle = jQuery("input[name='optionsRadio']:checked").val();
		// 隐藏是否第一行为标题
		jQuery('.file-info-label').addClass("hide");
		jQuery('.file-info-title').addClass("hide");
		// 展示进度条
		jQuery('.progress').removeClass("hide");
		if(opType == "edit" && fileConfigInfo.firstLineTitle == "1" || opType == "append" && fileConfigInfo.firstLineTitle == "1"){
			fileConfigInfo.changeTitleType = jQuery("input[name='titleRadio']:checked").val();
		}
		uploader.options.formData = {
				opType: opType,
				firstLineTitle: fileConfigInfo.firstLineTitle, 
				changeTitleType: fileConfigInfo.changeTitleType,
				dataId: dataId
		};
		uploader.upload();
		// 隐藏按钮
		jQuery('.upload-button').addClass("hide");
		// 展示重新上传按钮
		jQuery('#reUploadFile').removeClass("hide");
	}
	
	// 重新上传文件
	function reUploadFile(){
		// 隐藏文件信息
		jQuery('.import-file').addClass("hide");
		// 隐藏是否第一行为标题
		jQuery('.file-info-label').addClass("hide");
		jQuery('.file-info-title').addClass("hide");
		// 隐藏上传取消按钮
		jQuery('.upload-button').addClass("hide");
		jQuery('.file-uploader-text').removeClass("hide");
		jQuery('.file-upload-pic').removeClass("hide");
		// 进度条隐藏
		jQuery('.progress').addClass("hide");
		// 隐藏重新上传
		jQuery('#reUploadFile').addClass("hide");
		// 隐藏下一步按钮
		jQuery('#fileButton').addClass("hide");
		uploader.reset();
	}
	
	// 错误提示
	function showErrTip(code) {
		var text = "";
		var singleSizeLimit = uploader.options.fileSingleSizeLimit;
		var fileNumLimit = uploader.options.fileNumLimit;
		var fileSizeLimit = uploader.options.fileSizeLimit;
		switch (code) {
			case 'F_EXCEED_SIZE':
				text = sabace.getMessage('data.import.uploader.exceedSize') + singleSizeLimit + 'M';
				break;
			case 'Q_EXCEED_NUM_LIMIT':
				text = sabace.getMessage('data.import.uploader.exceedNumLimit') + fileNumLimit + sabace.getMessage('data.import.uploader.individual');
				break;
			case 'Q_EXCEED_SIZE_LIMIT':
				text = sabace.getMessage('data.import.uploader.exceedSizeLimit') + fileSizeLimit + 'M';
				break;
			case 'Q_TYPE_DENIED':
				text = sabace.getMessage('data.import.uploader.typeDenied');
				break;
			case 'F_DUPLICATE':
				text = sabace.getMessage('data.import.uploader.duplicate');
				break;
			case 'success':
				text = sabace.getMessage('data.import.uploader.success');
				break;
			default:
				text = sabace.getMessage('data.import.uploader.default');
				break;
		}
		return text;
	}
	
	// 修改时判断是否以当前修改的文件的第一行为标题
	function setEditTiltle(){
		if(opType == "edit" || opType == "append"){
			var titleType = jQuery(this).val();
			if(titleType == "1"){
				jQuery('.file-info-title').removeClass("hide");
			}else{
				jQuery('.file-info-title').addClass("hide");
			}
		}
	}

	// 文件选择"确定"事件
	function fileUpload() {
		// 如果需要重新上传的这时代表已经上传成功
		reUploadFlag = true;
		jQuery('.bottom-button-common').removeClass("hide");
		var fileLength = uploader.getFiles().length;
		var file = uploader.getFiles()[0];
		// 判断是否有上传的文件
		if (fileLength < 1) {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.selectFile')
			});
			return;
		} else {
			// 判断文件是否上传成功
			if (file.statusText != "complete") {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.uploadFile')
				});
				return;
			}
		}
		// 向后台发送请求获取数据库信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/data-file-create"),
			data: {
				opType: opType,
				fileConfig: JSON.stringify(fileConfigInfo)
			},
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 文件处理返回成功后的处理
					checkFileSuccess(req);
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: req.msg
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.getFileInfoError')
				});
			}
		});
	}

	// 文件处理返回成功后的处理
	function checkFileSuccess(req) {
		// 横线高亮设置
		setStepLine(2);
		// 按钮样式切换
		jQuery('#oneStep').addClass("active-Finished");
		if (jQuery('#twoStep').hasClass("active-Finished")) {
			jQuery('#twoStep').removeClass("active-Finished");
		}
		jQuery('#twoStep').removeClass("active-notFinished");
		// 面板内容切换
		jQuery('#fileInfo').addClass("hide");
		jQuery('#dataInfo').removeClass("hide");
		fileConfigInfo = req.fileConfigBean;
		fileConfigInfo.columnData = req.columnDatas;
		fileConfigInfo.attrData = req.attrDatas;
		fileConfigInfo.dimData = req.dimDatas;
		fileConfigInfo.footerData = req.footerDatas;
		// 数据处理时初始化jqGrid
		initCommonGrid();
		// 修改文件了
		if(opType == "add" || opType == "edit"){
			modType = "2";
		}else if(opType == "append"){
			modType = "3";
		}
	}

	// 横线高亮设置
	function setStepLine(step) {
		var marWidth = 25 * (step - 1) + 4 + "%";
		jQuery('#stepLine').css("margin-left", marWidth);
	}
	
	// 获取非自定义的筛选类型
	function getFilterLi(type,dimData,dimName){
		var selectLi = "";
		if(dimName == "" || (dimName != null && '数值'.indexOf(dimName) > -1)){
			selectLi +=	" <li class ='fixedDim' value='2' title='数值'><div class='num-pic'></div><span>数值</span></li>";
		}
		if(dimName == "" || (dimName != null && '月份'.indexOf(dimName) > -1)){
			selectLi += " <li class ='fixedDim' value='4' title='月份'><div class='month-pic'></div>月份</li>";
		}
	 	if(dimName == "" || (dimName != null && '日期'.indexOf(dimName) > -1)){
	 		selectLi += " <li class ='fixedDim' value='6' title='日期'><div class='date-pic'></div>日期</li>";
	 	}
		if(dimName == "" || (dimName != null && '时间'.indexOf(dimName) > -1)){
			selectLi += " <li class ='fixedDim' value='7' title='时间'><div class='time-pic'></div>时间</li>";
		}
		if(dimName == "" || (dimName != null && '字符'.indexOf(dimName) > -1)){
			selectLi += " <li class ='fixedDim' value='9' title='字符'><div class='char-pic'></div>字符</li>";
		}
		if(dimName == "" || (dimName != null && '省份'.indexOf(dimName) > -1)){
			selectLi += " <li class ='fixedDim' value='A' title='省份'><div class='province-pic'></div>省份</li>";
		}
		if(dimName == "" || (dimName != null && '地市'.indexOf(dimName) > -1)){
			selectLi += " <li class ='fixedDim' value='B' title='地市'><div class='city-pic'></div>地市</li>";
		}
		if(dimName == "" || (dimName != null && '区县'.indexOf(dimName) > -1)){
			selectLi += " <li class ='fixedDim' value='C' title='区县'><div class='county-pic'></div>区县</li>";
		}
		selectLi += " <li class='divider'></li>";
		return selectLi;
	}
	
	// 获取自定义的筛选类型
	function getFilterOtherLi(type,dimData,dimName){
		var selectOtherLi =  "";
		if(dimName == "" || (dimName != null && '数值'.indexOf(dimName) > -1)){
			selectOtherLi += " <li class ='fixedDim' value='2' title='数值'><div class='num-pic'></div><span>数值</span></li>";
		}
		if(dimName == "" || (dimName != null && '字符'.indexOf(dimName) > -1)){
			selectOtherLi += " <li class ='fixedDim' value='9' title='字符'><div class='char-pic'></div>字符</li>";
		}
		selectOtherLi += " <li class='divider'></li>";
		return selectOtherLi;
	}
	
	// 拼装筛选类型 1:拼装非自定义列的筛选类型;2:拼装自定义列的筛选类型;3:拼装所有
	function getSelectLi(type,dimData,dimName){
		var object = null;
		var otherObject = null;
		if(type == "1"){
			object = jQuery('.tip-yellowsimple #dimSelect');
			object.empty();
		}else if(type == "2"){
			otherObject = jQuery('.tip-yellowsimple #dimOtherSelect');
			otherObject.empty();
		}else{
			object = jQuery('#dimSelect');
			object.empty();
			otherObject = jQuery('#dimOtherSelect');
			otherObject.empty();
		}
		var selectLi = getFilterLi(type,dimData,dimName);
		if(type == "2" || type == "3"){
			var selectOtherLi = getFilterOtherLi(type,dimData,dimName);
		}
		var dimLength = 0;
		// 拼装维度
		if (dimData != null && dimData != "") {
			var name = null;
			var value = null;
			dimLength = dimData.length;
			for (var i = 0; i < dimLength; i++) {
				name = dimData[i].name;
				value = dimData[i].value;
				selectLi += " <li value=" + value + " title=" + name + "><div class='dim-pic'></div>" + name + "</li>";
				if(type == "2" || type == "3"){
					selectOtherLi += " <li value=" + value + " title=" + name + "><div class='dim-pic'></div>" + name + "</li>";
				}
			}
		}
		if(type == "1" || type == "3"){
			object.append(selectLi);
		}
		if(type == "2" || type == "3"){
			otherObject.append(selectOtherLi);
		}
		if (dimLength * 30 > 200) {
			// 筛选类型滚动条
			jQuery("#dim-select").height(360);
		}
		if(type == "2" || type == "3"){
			if((dimLength-3) * 30 > 200){
				// 筛选类型滚动条
				jQuery("#dim-other-select").height(360);
			}
		}
	 }

	// 生成colModel
	function createColModel(attrData, dimData) {
		if (jQuery('#columnOper')) {
			jQuery('#columnOper').empty();
		}
		// 拼装筛选类型
		getSelectLi("3",dimData,"");
		var colModel = [];
		var attrDataLength = attrData.length;
		var jqWidth = $(".data-info-grid").width() - 45;
		if(opType == "append"){
			jqWidth = jQuery(window).width() * 0.94;
		}
		var width = 200;
		if (attrDataLength * width < jqWidth) {
			width = Math.floor(jqWidth / attrDataLength);
		}
		var operHtml = "<div id='columnOper'></div>";
		var columnLabel = null;
		var columnFilterTypeName = null;
		var filterType = null;
		var align = null;
		var _selectHtml = null;
		var attrClass = null;
		for (var i = 0; i < attrDataLength; i++) {
			columnLabel = attrData[i].columnLabel;
			columnFilterTypeName = attrData[i].columnFilterTypeName;
			filterType = attrData[i].filterType;
			attrClass = attrData[i].attrClass;
			if (typeof(columnFilterTypeName) == "undefined") {
				columnFilterTypeName = "字符";
			}
			if (filterType == "2") {
				align = 'right';
			}else{
				align = 'left';
			}
			if(attrClass == "0"){
				_selectHtml = "<div id='dim'><span title=" + columnFilterTypeName + " class='dimText'>" + columnFilterTypeName + "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + columnLabel + operHtml;
			}else{
				_selectHtml = "<div id='dimOther'><span title=" + columnFilterTypeName + " class='dimText' >" + columnFilterTypeName + "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + columnLabel + operHtml;
			}
			colModel.push({
				label: _selectHtml,
				name: columnLabel,
				align: align,
				hlign: 'center',
				sortable: false,
				width: width
			})
		}
		return colModel;
	}

	// 初始化数据处理grid
	function initCommonGrid() {
		if (!jQuery('#dataGrid').is(':empty')) {
			jQuery.jgrid.gridUnload('dataGrid');
		}
		commonColModel = createColModel(fileConfigInfo.attrData, fileConfigInfo.dimData);
		dataOptions = {
			datatype: "local",
			styleUI: 'Bootstrap',
			regional: 'cn',
			data: fileConfigInfo.columnData,
			colModel: commonColModel,
			rownumbers: true,
			autowidth: true,
			shrinkToFit: false,
			height: 'auto',
			footerrow:true,
			loadComplete: function() {
				// 设置自定义列颜色
				jQuery("#dataInfo #dimOther").parent().parent().css("background-color", "#DAE9E9");
				// 底部数据展示
				if(fileConfigInfo.footerData.length < 1){
					jQuery(".data-info-grid .ui-jqgrid-sdiv").hide();
				}else{
					jQuery(".data-info-grid .ui-jqgrid-sdiv").show();
					footerFlag = true;
					var data = {};
					var colNum = fileConfigInfo.footerData.length;
					var footerData = null;
					for(var i = 0; i < colNum; i++){
						footerData = fileConfigInfo.footerData[i];
						data[footerData.name] = footerData.desc;
					}
					jQuery(this).footerData("set", data);
				}
				var columnTh = jQuery(this).parents().find(".data-info-grid th");
				columnTh.click(function() {
					fileConfigInfo.currentColNum = jQuery(this)[0].cellIndex;
					var obj = jQuery(this);
					var th_id = jQuery(obj).attr("id");
					jQuery("th").removeClass('jqgrid-underline');
					jQuery("th[id=" + th_id + "]").addClass('jqgrid-underline');
					// 判断当前列是否是自定义列，是则打开函数框
					openFuncForm();
				});
				columnTh.find("#dim").on("click", function() {
					fileConfigInfo.currentColNum = jQuery(this).parent().parent()[0].cellIndex;
					var filterType = fileConfigInfo.attrData[fileConfigInfo.currentColNum-1].filterType;
					columnTh.find("#dim").poshytip('hide');
					// 下拉框绑定事件
					jQuery(this).poshytip({
						className: 'tip-yellowsimple',
						content: jQuery("#dim-select").outerHTML(),
						showTimeout: 1,
						alignTo: 'target',
						alignX: 'bottom',
						alignY: 'bottom',
						showOn: 'none',
						offsetY: 5,
						offsetX: -128,
						keepInViewport: false
					});
					jQuery(this).poshytip('show');
					// 对已选择的做标示
					jQuery(".tip-yellowsimple #dim-select li[value='" + filterType + "']").prepend("<i class='fa fa-check dimItemsCheck'></i>");
					jQuery(".tip-yellowsimple #dim-select li[value='" + filterType + "']").css("background-color",'#2CC2A7');
					jQuery(".tip-yellowsimple #dim-select").niceScroll();
					jQuery(".tip-yellowsimple").on("click","#dimSelect li",function(){
						changeFilter(jQuery(this).attr("value"), jQuery(this).text());
					});
					sabace.stopBubble(event);
				});
				columnTh.find("#dimOther").on("click", function() {
					fileConfigInfo.currentColNum = jQuery(this).parent().parent()[0].cellIndex;
					var filterType = fileConfigInfo.attrData[fileConfigInfo.currentColNum-1].filterType;
					columnTh.find("#dimOther").poshytip('hide');
					// 下拉框绑定事件
					jQuery(this).poshytip({
						className: 'tip-yellowsimple',
						content: jQuery("#dim-other-select").outerHTML(),
						showTimeout: 1,
						alignTo: 'target',
						alignX: 'bottom',
						alignY: 'bottom',
						showOn: 'none',
						offsetY: 5,
						offsetX: -128,
						keepInViewport: false
					});
					jQuery(this).poshytip('show');
					// 对已选择的做标示
					jQuery(".tip-yellowsimple #dim-other-select li[value='" + filterType + "']").prepend("<i class='fa fa-check dimItemsCheck'></i>");
					jQuery(".tip-yellowsimple #dim-other-select li[value='" + filterType + "']").css("background-color",'#2CC2A7');
					jQuery(".tip-yellowsimple #dim-other-select").niceScroll();
					jQuery(".tip-yellowsimple").on("click","#dimOtherSelect li",function(){
						changeFilter(jQuery(this).attr("value"), jQuery(this).text());
					});
					sabace.stopBubble(event);
				});
				columnTh.find("#columnOper").on("click", function() {
					columnTh.find("#columnOper").poshytip('hide');
					// 设置图标绑定事件
					jQuery(this).poshytip({
						className: 'tip-yellowsimple',
						content: jQuery("#columnOperMenu").outerHTML(),
						showTimeout: 1,
						alignTo: 'target',
						alignX: 'bottom',
						alignY: 'bottom',
						showOn: 'none',
						offsetY: 6,
						offsetX: -82,
						keepInViewport: false
					});
					jQuery(this).poshytip('show');
					fileConfigInfo.currentColNum = jQuery(this).parent().parent()[0].cellIndex;
					jQuery("#columnOperMenu .addLeftColumn").on("click", addLeftColumn);
					jQuery("#columnOperMenu .addRightColumn").on("click", addRightColumn);
					jQuery("#columnOperMenu .delTheColumn").on("click", delColumn);
					sabace.stopBubble(event);
				});
			}
		}
		jQuery("#dataGrid").jqGrid(dataOptions);
		
		$(window).resize(function() {
			resizeDataGrid();
		});
	}

	// 显示函数框
	function openFuncForm() {
		var curAttrData = fileConfigInfo.attrData[fileConfigInfo.currentColNum - 1];
		if (curAttrData.attrClass == "1") {
			memoryNum = fileConfigInfo.currentColNum;
			jQuery('#colNameSpan').text(curAttrData.columnLabel);
			if (curAttrData.fieldName != "") {
				jQuery('#funcTxt').val(curAttrData.funcLabel);
			}
			jQuery(".funcForm").slideDown();
		}else{
			memoryNum = null;
			jQuery('#funcTxt').val("");
			jQuery(".funcForm").slideUp();
		}
	}

	// 判断是否已经配置了省或市的字段
	function judgeProvinceOrCity(index){
		var attrData = fileConfigInfo.attrData;
		var columnNum = fileConfigInfo.columnNum;
		var data = null;
		var flag = false;
		for(var i = 0;i < columnNum; i++){
			if(i != index){
				data = attrData[i];
				if("A" == data.filterType || "B" == data.filterType){
					flag = true;
					break;
				}
			}
		}
		return flag;
	}
	
	// 省市选择
	function selectProvinceOrCity(index,changeData,curAttrData){
		var url = sabace.handleUrlParam("/platform/resmanage/data/data-select-city");
		bi.dialog.show({
			title: sabace.getMessage('data.import.title.selectProAndCity'),
			message: jQuery('<div id="selectProvinceOrCity"></div>').load(url),
			spinicon:'glyphicon glyphicon-refresh',
			cssClass: 'data-selectProvinceOrCity',
			onshown:function(dialog){
				proviceOrCitySelect.init();
			},
			buttons:[{
		   		label:sabace.getMessage('data.import.label.sure'),
		   		cssClass: 'btn-info',
		   		action: function(dialog){
		   			var selectObject = proviceOrCitySelect.saveSelect();
		   			if(selectObject.flag){
		   				fileConfigInfo.attrData[index].superRange = selectObject.selectValue;
			   			dialog.close();
			   			filterChange(index,changeData,curAttrData);
		   			}
				}
			},{
				label: sabace.getMessage('data.import.label.cancel'),
				cssClass: 'btn-default',
				action: function(dialog) {
					dialog.close();
				}
			}
		   ]
		});
	}
	
	// 遍历所有的指标信息，查找是否有配置了区县的指定，有则去除指定省市
	function queryHasCountySet(index){
		var attrData = fileConfigInfo.attrData;
		var columnNum = fileConfigInfo.columnNum;
		var data = null;
		for(var i = 0;i < columnNum; i++){
			if(i != index){
				data = attrData[i];
				if("C" == data.filterType){
					if(typeof(data.superRange) != "undefined" && data.superRange != ""){
						data.superRange = "";
					}
				}
			}
		}
	}
	
	// 筛选类型切换
	function changeFilter(selectValue, selectName) {
		scrollPosition = jQuery(".data-info-grid .ui-jqgrid .ui-jqgrid-bdiv").scrollLeft();
		var changePosition = fileConfigInfo.currentColNum - 1;
		var changeData = {};
		// 获取是选中的列的下拉框列表
		changeData.selectValue = selectValue;
		changeData.selectName = selectName;
		var curAttrData = fileConfigInfo.attrData[changePosition];
		// 记住原来的值供转换失败时重新查询
		changeData.columnLabel = curAttrData.columnLabel;
		changeData.colLength = curAttrData.colLength;
		changeData.colScale = curAttrData.colScale;
		changeData.fieldName = curAttrData.fieldName;
		changeData.dataId = fileConfigInfo.dataId;
		var originType = curAttrData.originFilterType;
		var oldType = curAttrData.filterType;
		var newType = selectValue;
		var flag = true; 
		
		if (curAttrData.attrClass == "1") {
			if (typeof(curAttrData.fieldName) == "undefined" || curAttrData.fieldName == "") {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.no') + " " + curAttrData.columnLabel + " " + sabace.getMessage('data.import.message.customChangeFilter')
				});
				return;
			}
		}
		
		// 原来是数值类型，要换成时间。转换不了：文件校验时优先校验的是月份、日期、时间
		if (originType == "2")
		{
			if (newType == "4" || newType == "6" || newType == "7")
			{
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.cannotChange') +　getTypeName(newType) + "!"
				});
				return;
			}
		}

		// 类型不同时
		if (oldType != newType) {
			// 维度不需要往后台校验
			if (newType == "2" || newType == "4" || newType == "6" || newType == "7" || newType == "9" || newType == "A" || newType == "B" || newType == "C") {
				// 如果选择的是区县，需要判断其是否选择了省或市字段，没有则弹出页面选择省或市
				if(newType == "C"){
					// 遍历所有的指标信息，查找是否配置了省或市
					flag = judgeProvinceOrCity(changePosition);
					if(!flag){
						selectProvinceOrCity(changePosition,changeData,curAttrData);
					}
				}else if(newType == "A" || newType == "B"){
					// 遍历所有的指标信息，查找是否有配置了区县的指定，有则去除指定省市
					queryHasCountySet(changePosition);
				}
				if(flag){
					filterChange(changePosition,changeData,curAttrData);
				}
			} else {
				// 维度切换查询
				dimChange(changePosition,changeData,curAttrData);
			}
		}
	}
	
	// 向后台发送请求切换筛选类型
	function filterChange(changePosition,changeData,curAttrData){
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/change-column-type"),
			data: {
				changeData: JSON.stringify(changeData),
				columnData: JSON.stringify(fileConfigInfo.columnData),
				type: "1"
			},
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					jQuery.jgrid.gridUnload('dataGrid');
					fileConfigInfo.columnData = req.columnDatas;
					// 修改attrData
					curAttrData.filterType = changeData.selectValue;
					curAttrData.attrType = req.attrType;
					curAttrData.colLength = req.colLength;
					curAttrData.colScale = req.colScale;
					curAttrData.columnType = req.columnType;
					curAttrData.columnFilterTypeName = req.columnFilterTypeName;
					var operHtml = "<div id='columnOper'></div>";
					var _selectHtml = null;
					if(curAttrData.attrClass == "0"){
						_selectHtml = "<div id='dim'><span title=" + changeData.selectName + " class='dimText'>" + changeData.selectName + "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + changeData.columnLabel + operHtml;
					}else{
						_selectHtml = "<div id='dimOther'><span title=" + changeData.selectName + " class='dimText'>" + changeData.selectName+ "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + changeData.columnLabel + operHtml;
					}
					var colModel = dataOptions.colModel;
					var _align = null;
					if (curAttrData.filterType == '2') {
						_align = 'right';
					}else{
						_align = 'left';
					}
					colModel[changePosition].label = _selectHtml;
					colModel[changePosition].align = _align;
					dataOptions.colModel = colModel;
					dataOptions.data = fileConfigInfo.columnData;
					jQuery('#dataGrid').jqGrid(dataOptions);
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.restoreData')
					});
				}
				resizeDataGrid();
				setScrollPosition();
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || sabace.getMessage('data.import.message.dataGenerationError')
				});
			}
		});
	}
	
	// 根据筛选类型获取名称
	function getTypeName(value){
		var name = "";
		if(value == "2"){
			name = "数值";
		}else if(value == "4"){
			name = "月份";
		}else if(value == "6"){
			name = "日期";
		}else if(value == "7"){
			name = "时间";
		}else if(value == "9"){
			name = "字符";
		}
		return name;
	}
	
	// 维度切换查询
	function dimChange(changePosition,changeData,curAttrData){
		curAttrData.filterType = changeData.selectValue;
		// 像后台发送请求查询维度并转换
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/dim-change"),
			data: {
				changeData: JSON.stringify(changeData),
				columnData: JSON.stringify(fileConfigInfo.columnData)
			},
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					jQuery.jgrid.gridUnload('dataGrid');
					// 修改attrData
					fileConfigInfo.columnData = req.columnData;
					curAttrData.filterType = changeData.selectValue;
					curAttrData.columnFilterTypeName = changeData.selectName;
					var operHtml = "<div id='columnOper'></div>";
					var _selectHtml = null;
					if(curAttrData.attrClass == "0"){
						_selectHtml = "<div id='dim'><span title=" + changeData.selectName + " class='dimText'>" + changeData.selectName + "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + changeData.columnLabel + operHtml;
					}else{
						_selectHtml = "<div id='dimOther'><span title=" + changeData.selectName + " class='dimText'>" + changeData.selectName + "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + changeData.columnLabel + operHtml;
					}
					var colModel = dataOptions.colModel;
					colModel[changePosition].label = _selectHtml;
					colModel[changePosition].align = 'left';
					dataOptions.colModel = colModel;
					dataOptions.data = fileConfigInfo.columnData;
					jQuery('#dataGrid').jqGrid(dataOptions);
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.restoreData')
					});
				}
				resizeDataGrid();
				setScrollPosition();
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.dataGenerationError')
				});
			}
		})
	}

	// 函数生成
	function generateData() {
		var funcTxt = jQuery.trim(jQuery('#funcTxt').val());
		if (funcTxt == "") {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.inputFunc')
			});
			return;
		}
		
		// 判断是否选择列
		if (memoryNum == null) {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.selectCustomColumn')
			});
			return;
		}

		fileConfigInfo.funcTxt = funcTxt;
		reloadData(memoryNum);
	}
	
	// 函数处理后刷新数据
	function reloadData(columnIndex) {
		scrollPosition = jQuery(".data-info-grid .ui-jqgrid .ui-jqgrid-bdiv").scrollLeft();
		// 向后台发送请求处理用户输入函数
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/process-func"),
			data: {
				dataId: fileConfigInfo.dataId,
				columnIndex: columnIndex,
				funcTxt: fileConfigInfo.funcTxt,
				attrData: JSON.stringify(fileConfigInfo.attrData),
				columnData: JSON.stringify(fileConfigInfo.columnData)
			},
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					jQuery.jgrid.gridUnload('dataGrid');
					fileConfigInfo.columnData = req.columnDatas;
					var curData = fileConfigInfo.attrData[memoryNum - 1];
					curData.funcLabel = fileConfigInfo.funcTxt;
					curData.fieldName = req.fileName;
					curData.attrType = req.attrType;
					curData.originAttrType = req.attrType;
					curData.columnType = req.columnType;
					curData.originColumnType = req.columnType;
					curData.filterType = req.filterType;
					curData.originFilterType = req.filterType;
					curData.colLength = req.colLength;
					curData.originColLength = req.colLength;
					curData.colScale = req.colScale;
					curData.originColScale = req.colScale;
					curData.columnFilterTypeName = req.columnFilterTypeName;
					commonColModel = createColModel(fileConfigInfo.attrData, fileConfigInfo.dimData);
					dataOptions.colModel = commonColModel;
					dataOptions.data = fileConfigInfo.columnData;
					jQuery('#dataGrid').jqGrid(dataOptions);
				} else {
					jQuery.jgrid.gridUnload('dataGrid');
					var curData = fileConfigInfo.attrData[memoryNum - 1];
					curData.fieldName = "";
					curData.funcLabel = "";
					commonColModel = createColModel(fileConfigInfo.attrData, fileConfigInfo.dimData);
					dataOptions.colModel = commonColModel;
					dataOptions.data = fileConfigInfo.columnData;
					jQuery('#dataGrid').jqGrid(dataOptions);
					if(req.resFlag == "filterFail"){
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('data.import.title.tips'),
							message: req.msg
						});
					}else{
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('data.import.title.tips'),
							message: sabace.getMessage('data.import.message.reEnterFunc')
						});
					}
				}
				resizeDataGrid();
				setScrollPosition();
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.processFunError')
				});
			}
		});
	}

	// 添加列时刷新数据
	function refreshData(curIndex, columnNum, nameArr) {
		scrollPosition = jQuery(".data-info-grid .ui-jqgrid .ui-jqgrid-bdiv").scrollLeft();
		var columnData = jQuery('#dataGrid').jqGrid("getRowData");
		var tempData = [];
		var data = null;
		for (var i = 0; i < columnData.length; i++) {
			data = {};
			for (var j = 0; j < columnNum; j++) {
				if (j > curIndex) {
					data[nameArr[j]] = columnData[i][nameArr[j - 1]];
				} else {
					data[nameArr[j]] = columnData[i][nameArr[j]];
				}
			}
			data[nameArr[curIndex]] = "";
			tempData.push(data);
		}
		fileConfigInfo.attrData = updateFuncLabel(fileConfigInfo.attrData,curIndex);
		jQuery.jgrid.gridUnload('dataGrid');
		fileConfigInfo.columnData = tempData;
		commonColModel = createColModel(fileConfigInfo.attrData, fileConfigInfo.dimData);
		dataOptions.colModel = commonColModel;
		dataOptions.data = fileConfigInfo.columnData;
		jQuery('#dataGrid').jqGrid(dataOptions);
		resizeDataGrid();
		setScrollPosition();
	}

	// 设置滚动条位置
	function setScrollPosition(){
		scrollPosition = scrollPosition;
		jQuery(".data-info-grid .ui-jqgrid .ui-jqgrid-bdiv").scrollLeft(scrollPosition);
	}
	
	// 添加列时同步修改所有的自定义列的FuncLabel
	function updateFuncLabel(attrData,curIndex){
		var columnNum = fileConfigInfo.columnNum;
		var curAttrData = null;
		var attrClass = null;
		var funcLabel = null;
		for(var i = 0; i< columnNum; i++){
			curAttrData = attrData[i];
			attrClass = curAttrData.attrClass;
			if(attrClass == "1" && curIndex != i){
				funcLabel = curAttrData.funcLabel;
				if(typeof(funcLabel) != "undefined" && funcLabel != ""){
					curAttrData.funcLabel = getFuncLabel(funcLabel,curIndex,columnNum);
				}
			}
		}
		return attrData;
	}
	
	// 根据funcLabel实时更新所有的自定义的函数表达式
	function getFuncLabel(funcLabel,curIndex,columnNum){
		var nameArr = getAllColumnName(columnNum);
		var colName = null;
		var longColName = null;
		var newColName = null;
		var hasIndex = -1;
		var length = 0;
		var reg= /[A-Z]$/;
		// 从当前变换的列开始，查找当前函数公式中是否包含大于该列的列名，有则替换
		for(var i = curIndex; i < columnNum; i++){
			length = funcLabel.length;
			colName = "$" + nameArr[i];
			newColName = "$()" + nameArr[i+1];
			hasIndex = funcLabel.indexOf(colName);
			if(hasIndex > -1){
				// 说明存在该列，再次判断该位置再加上一位的判断，因为列数多的时候存在AA、AB这种列
				// 如果存在位置取3位的长度不能超过总长度
				if(hasIndex + 3 <= length){
					longColName = funcLabel.substr(hasIndex,3);
					// 判断这三位是否以大写字母结尾,输入函数中是否存在AA、AB这种
					if(reg.test(longColName)){
						// 是以大写字母结果,则判断后两位大写字母是否与当前列名相同，相同则替换
						if(funcLabel.substr(hasIndex + 1,2) == nameArr[i]){
							funcLabel = funcLabel.replace(new RegExp("\\" + longColName,"g"),newColName);
						}
					}else{
						// 不是以大写字母结尾，则不存在更长列，则将已存在的引用列替换成funcLabel
						funcLabel = funcLabel.replace(new RegExp("\\" + colName,"g"),newColName);
					}
				}else if(hasIndex + 2 == length){
					// 已经到最后了，直接替换
					funcLabel = funcLabel.replace(new RegExp("\\" + colName,"g"),newColName);
				}
			}
		}
		funcLabel = funcLabel.replace(new RegExp('\\$\\(\\)',"g"),'$');
		return funcLabel;
	}
	
	// 添加左边列
	function addLeftColumn() {
		var columnNum = fileConfigInfo.columnNum + 1;
		fileConfigInfo.columnNum = columnNum;
		var curIndex = fileConfigInfo.currentColNum - 1;
		// 获取所有的列名
		var nameArr = getAllColumnName(columnNum);
		var newCols = {
				orderId: curIndex + 1,
				columnLabel: nameArr[curIndex],
				attrType: "3",
				filterType: "9",
				attrClass: "1",
				isUsed: "1"
			};
		var newData = {
				name: nameArr[curIndex],
				desc: ""
			};
			// 根据需要插入列的次序调整原来指标数组中的的orderId,columnLabel
		for (var i = 0; i < columnNum; i++) {
			if (i == curIndex) {
				// 加入新列
				fileConfigInfo.attrData.insert(i, newCols);
				// 处理底部数据
				if(footerFlag){
					fileConfigInfo.footerData.insert(i, newData);
				}
			} else if (i > curIndex) {
				fileConfigInfo.attrData[i].orderId = i + 1;
				fileConfigInfo.attrData[i].columnLabel = nameArr[i];
				// 处理底部数据
				if(footerFlag){
					fileConfigInfo.footerData[i].name = nameArr[i];
				}
			}
		}
		refreshData(curIndex, columnNum, nameArr);
	}

	// 根据列数获取所有的列名
	function getAllColumnName(columnNum) {
		var nameArr = new Array();
		var str = "A";
		var code = str.charCodeAt();
		var num = 0;
		var count = 0;
		// 先遍历出26个字母
		for (var i = 0; i < columnNum; i++) {
			if (i < 26) {
				nameArr.push(String.fromCharCode(code + i) + "");
			} else {
				num = Math.floor(i / 26);
				if ((num - 1) > 0) {
					count = i - 26 * num;
				}
				nameArr.push(nameArr[i - 25 * num - count - 1] + nameArr[i - 26 * num]);
				count++;
			}
		}
		return nameArr;
	}

	// 添加右边列
	function addRightColumn() {
		var columnNum = fileConfigInfo.columnNum + 1;
		fileConfigInfo.columnNum = columnNum;
		var curIndex = fileConfigInfo.currentColNum;
		// 获取所有的列名
		var nameArr = getAllColumnName(columnNum);
		var newCols = {
				orderId: curIndex + 1,
				columnLabel: nameArr[curIndex],
				attrType: "3",
				filterType: "9",
				attrClass: "1",
				isUsed: "1"
			}
		var newData = {
				name: nameArr[curIndex],
				desc: ""
			};
			// 根据需要插入列的次序调整原来指标数组中的的orderId,columnLabel
		for (var i = 0; i < columnNum; i++) {
			if (i == curIndex) {
				// 加入新列
				fileConfigInfo.attrData.insert(i, newCols);
				// 底部数据处理
				if(footerFlag){
					fileConfigInfo.footerData.insert(i, newCols);
				}
			} else if (i > curIndex) {
				fileConfigInfo.attrData[i].orderId = i + 1;
				fileConfigInfo.attrData[i].columnLabel = nameArr[i];
				// 底部数据处理
				if(footerFlag){
					fileConfigInfo.footerData[i].name = nameArr[i];
				}
			}
		}
		refreshData(curIndex, columnNum, nameArr);
	}

	// 删除列
	function delColumn() {
		// 首先判断是否是自定义
		if (fileConfigInfo.attrData[fileConfigInfo.currentColNum - 1].attrClass == "0") {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.notDelCustomColumn')
			});
			return;
		}
		
		// 判断是否有其他自定义引用该列，如有，提示用户先删除其他关联列
		var columnLabel = "$" + fileConfigInfo.attrData[fileConfigInfo.currentColNum - 1].columnLabel;
		var curAttrData = null;
		var labelName = null;
		var curfuncLabel = null;
		var quoteArr = [];
		for(var i = 0; i< fileConfigInfo.columnNum; i++ ){
			curAttrData =  fileConfigInfo.attrData[i];
			if(i != fileConfigInfo.currentColNum - 1 && curAttrData.attrClass == "1"){
				curfuncLabel = curAttrData.funcLabel;
				labelName = curAttrData.columnLabel;
				if(typeof(curfuncLabel) != "undefined" && curfuncLabel != ""){
					if(curfuncLabel.indexOf(columnLabel) >= 0){
						quoteArr.push(labelName);
					}
				}
			}
		}
		
		if(quoteArr.length > 0){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.delColumnConfirm') + quoteArr + sabace.getMessage('data.import.message.quoteColumn')
			});
			return;
		}
		
		bi.dialog.confirm({
			title: sabace.getMessage('data.import.text.delColumn'),
			message: sabace.getMessage('data.import.message.delColumnConfirm'),
			callback: function(result) {
				if (result) {
					var columnNum = fileConfigInfo.columnNum - 1;
					var curIndex = fileConfigInfo.currentColNum - 1;
					fileConfigInfo.columnNum = columnNum;
					// 获取所有的列名
					var nameArr = getAllColumnName(columnNum + 1);
					// 根据需要删除列的次序调整原来指标数组中的的orderId,columnLabel
					for (var i = 0; i < columnNum + 1; i++) {
						if (i == curIndex) {
							// 删除列
							fileConfigInfo.attrData.splice(i, 1);
							// 底部数据处理
							if(footerFlag){
								fileConfigInfo.footerData.splice(i, 1);
							}
						} else if (i > curIndex) {
							fileConfigInfo.attrData[i - 1].orderId = i;
							fileConfigInfo.attrData[i - 1].columnLabel = nameArr[i - 1];
							// 底部数据处理
							if(footerFlag){
								fileConfigInfo.footerData[i - 1].name = nameArr[i - 1];
							}
						}
					}
					reloadDeleteData(curIndex, columnNum, nameArr);
				}
			}
		});
	}
	
	// 删除列时刷新数据
	function reloadDeleteData(curIndex, columnNum, nameArr) {
		jQuery(".funcForm").slideUp();
		scrollPosition = jQuery(".data-info-grid .ui-jqgrid .ui-jqgrid-bdiv").scrollLeft();
		var columnData = jQuery('#dataGrid').jqGrid("getRowData");
		var tempData = [];
		var data = null;
		for (var i = 0; i < columnData.length; i++) {
			data = {};
			for (var j = 0; j < columnNum; j++) {
				if (j >= curIndex) {
					data[nameArr[j]] = columnData[i][nameArr[j + 1]];
				} else {
					data[nameArr[j]] = columnData[i][nameArr[j]];
				}
			}
			tempData.push(data);
		}
		jQuery.jgrid.gridUnload('dataGrid');
		fileConfigInfo.attrData = updateDelFuncLabel(fileConfigInfo.attrData,curIndex);
		fileConfigInfo.columnData = tempData;
		commonColModel = createColModel(fileConfigInfo.attrData, fileConfigInfo.dimData);
		dataOptions.colModel = commonColModel;
		dataOptions.data = fileConfigInfo.columnData;
		jQuery('#dataGrid').jqGrid(dataOptions);
		resizeDataGrid();
		setScrollPosition();
	}
	
	// 删除列时同步修改所有的自定义列的FuncLabel
	function updateDelFuncLabel(attrData,curIndex){
		var columnNum = fileConfigInfo.columnNum;
		var curAttrData = null;
		var attrClass = null;
		var funcLabel = null;
		for(var i = 0; i< columnNum; i++){
			curAttrData = attrData[i];
			attrClass = curAttrData.attrClass;
			if(attrClass == "1" && curIndex != i){
				funcLabel = curAttrData.funcLabel;
				if(typeof(funcLabel) != "undefined" && funcLabel != ""){
					curAttrData.funcLabel = getDelFuncLabel(funcLabel,curIndex,columnNum);
				}
			}
		}
		return attrData;
	}
	
	// 根据funcLabel实时更新所有的自定义的函数表达式
	function getDelFuncLabel(funcLabel,curIndex,columnNum){
		var nameArr = getAllColumnName(columnNum + 1);
		var colName = null;
		var longColName = null;
		var newColName = null;
		var hasIndex = -1;
		var length = 0;
		var reg= /[A-Z]$/;
		// 从当前变换的列开始，查找当前函数公式中是否包含大于该列的列名，有则替换
		for(var i = curIndex; i < columnNum + 1; i++){
			length = funcLabel.length;
			colName = "$" + nameArr[i];
			newColName = "$()" + nameArr[i-1];
			hasIndex = funcLabel.indexOf(colName);
			if(hasIndex > -1){
				// 说明存在该列，再次判断该位置再加上一位的判断，因为列数多的时候存在AA、AB这种列
				// 如果存在位置取3位的长度不能超过总长度
				if(hasIndex + 3 <= length){
					longColName = funcLabel.substr(hasIndex,3);
					// 判断这三位是否以大写字母结尾,输入函数中是否存在AA、AB这种
					if(reg.test(longColName)){
						// 是以大写字母结果,则判断后两位大写字母是否与当前列名相同，相同则替换
						if(funcLabel.substr(hasIndex + 1,2) == nameArr[i]){
							funcLabel = funcLabel.replace(new RegExp("\\" + longColName,"g"),newColName);
						}
					}else{
						// 不是以大写字母结尾，则不存在更长列，则将已存在的引用列替换成funcLabel
						funcLabel = funcLabel.replace(new RegExp("\\" + colName,"g"),newColName);
					}
				}else if(hasIndex + 2 == length){
					// 已经到最后了，直接替换
					funcLabel = funcLabel.replace(new RegExp("\\" + colName,"g"),newColName);
				}
			}
		}
		funcLabel = funcLabel.replace(new RegExp('\\$\\(\\)',"g"),'$');
		return funcLabel;
	}

	// 数据处理"取消"
	function dataCancel() {
		// 横线高亮设置
		setStepLine(1);
		// 面板内容切换
		jQuery('#dataInfo').addClass("hide");
		jQuery('#fileInfo').removeClass("hide");
	}

	// 数据处理"确定"
	function dataSave() {
		// 判断是否有自定义列但没有生成函数的
		for (var i = 0; i < fileConfigInfo.columnNum; i++) {
			if (fileConfigInfo.attrData[i].attrClass == "1") {
				if (typeof(fileConfigInfo.attrData[i].fieldName) == "undefined" || fileConfigInfo.attrData[i].fieldName == "") {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.no') + " " + fileConfigInfo.attrData[i].columnLabel + " " + sabace.getMessage('data.import.message.delCustomColumn')
					});
					return;
				}
			}
		}

		// 横线高亮设置
		setStepLine(3);
		// 按钮样式切换
		jQuery('#oneStep').addClass("active-Finished");
		jQuery('#twoStep').addClass("active-Finished");
		if (jQuery('#thirdStep').hasClass("active-Finished")) {
			jQuery('#thirdStep').removeClass("active-Finished");
		}
		jQuery('#thirdStep').removeClass("active-notFinished");
		// 面板内容切换
		jQuery('#dataInfo').addClass("hide");
		jQuery('#fieldInfo').removeClass("hide");
		// 初始化文件记录和符合条件记录 将数据处理时的文件记录、符合文件记录传递到设置字段页面中
		if (opType == "add") {
			jQuery('#dataName').val(fileName);
		} else {
			jQuery('#dataName').val(fileDataName);
			jQuery('#dataDesc').val(fileDataDesc);
		}
		jQuery('#dataNum').val(fileConfigInfo.dataNum);
		jQuery('#recordNum').val(fileConfigInfo.dataNum);
		// 初始化字段Grid
		initFieldGrid();
	}

	// 字段grid初始化
	function initFieldGrid() {
		if (!jQuery('#fieldGrid').is(':empty')) {
			jQuery.jgrid.gridUnload('fieldGrid');
		}
		sabace.ajax({
			dataType: "json",
			mtype: 'post',
			url: sabace.handleUrlParam("/platform/resmanage/data/data-common-field"),
			data: {
				attrData: JSON.stringify(fileConfigInfo.attrData)
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 请求field字段信息成功后加载jqgrid
					getFieldSuccess(req);
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.queryDataFail'),
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || sabace.getMessage('data.import.message.queryFieldFail')
				});
			}
		})
	}
	
	/**
	 * 初始化下拉框
	 * @param req
	 */
	function initClassify(classifyList, triggerFlag) {
		jQuery('#classifySel').append("");
		var classifyLength = classifyList.length;
		var classifyObj = null;
		var classifyName = null;
		var classifyId = null;
		var html = '<option></option>';
		html += '<option value="">无</option>';
		if(classifyLength > 0){
			for(var i=0; i < classifyLength; i++){
				classifyObj = classifyList[i];
				classifyId = classifyObj.classifyId;
				classifyName = classifyObj.classifyName;
				html += '<option value="' + classifyId + '">' + classifyName + '</option>';
			}
		}
		jQuery('#classifySel').append(html);
		if(triggerFlag && opType == "add"){
			if(!classifyFlag) {
				jQuery("#classifySel").trigger("chosen:updated");
				classifyFlag = true;
			}
		}
	}

	// 请求field字段信息成功后加载jqgrid
	function getFieldSuccess(req) {
		// 初始化业务分类下拉框
		initClassify(req.classifyList, true);
		var columnData = req.columnData;
		jQuery('#fieldGrid').jqGrid({
			datatype: "local",
			styleUI: 'Bootstrap',
			data: columnData,
			regional: 'cn',
			autowidth: true,
			height: 'auto',
			rowNum: 100000,
			colModel: [{
				label: sabace.getMessage('data.import.label.columnLabel'),
				name: 'columnLabel',
				align: 'center',
				hlign: 'center',
				width: 50,
				sortable: false,
			}, {
				label: sabace.getMessage('data.import.label.attrName'),
				name: 'attrName',
				align: 'center',
				hlign: 'center',
				sortable: false,
				editable: true,
				edittype: 'text'
			}, {
				label: sabace.getMessage('data.import.label.groupName'),
				name: 'groupName',
				align: 'center',
				hlign: 'center',
				sortable: false,
				editable: true
			}, {
				label: sabace.getMessage('data.import.label.attrType'),
				name: 'attrType',
				align: 'center',
				hlign: 'center',
				sortable: false,
				formatter: "select",
				editoptions: {
					value: sabace.getMessage('data.import.label.attrTypeFormat')
				}
			}, {
				label: sabace.getMessage('data.import.label.groupName'),
				name: 'groupId',
				align: 'center',
				hlign: 'center',
				hidden: true
			}, {
				label: sabace.getMessage('data.import.label.isUsed') + '：<i class="fa fa-square-o check-box" id="allCheck"></i>)',
				name: 'isUsed',
				align: 'center',
				hlign: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					var html = "";
					if (cellvalue == "1") {
						html = '<i class="fa fa-check-square-o check-box" id="usedCheck" value="1"></i>';
					} else {
						html = '<i class="fa fa-square-o check-box" id="usedCheck" value="0"></i>';
					}
					return html;
				}
			}],
			loadComplete: function() {
				// 全选checkbox
				var allCheckObject = jQuery(this).parents().find(".field-info-grid th #allCheck");
				// 单选checkbox
				var checkObject = jQuery(this).parents().find(".field-info-grid td #usedCheck");
				// 全选
				allCheckObject.on("click", function() {
					var isChecked = jQuery(this).hasClass("fa-square-o");
					if (isChecked) {
						jQuery(this).removeClass("fa-square-o");
						jQuery(this).addClass("fa-check-square-o");
						// 该列全选
						checkObject.removeClass("fa-square-o");
						checkObject.removeClass("fa-check-square-o");
						checkObject.addClass("fa-check-square-o");
						checkObject.attr("value", "1");
					} else {
						jQuery(this).removeClass("fa-check-square-o");
						jQuery(this).addClass("fa-square-o");
						// 该列取消全选
						checkObject.removeClass("fa-square-o");
						checkObject.removeClass("fa-check-square-o");
						checkObject.addClass("fa-square-o");
						checkObject.attr("value", "0");
					}
				});
				// 单选
				checkObject.on("click", function() {
					allCheckObject.removeClass("fa-check-square-o");
					allCheckObject.addClass("fa-square-o");
					var isChecked = jQuery(this).hasClass("fa-square-o");
					if (isChecked) {
						jQuery(this).attr("value", "1");
						jQuery(this).removeClass("fa-square-o");
						jQuery(this).addClass("fa-check-square-o");
					} else {
						jQuery(this).attr("value", "0");
						jQuery(this).removeClass("fa-check-square-o");
						jQuery(this).addClass("fa-square-o");
					}
					sabace.stopBubble(event);
				});
				// 设置编辑状态
				for (var i = 2; i <= fileConfigInfo.columnNum; i++) {
					$('#fieldGrid').jqGrid('editRow', i, false);
					// 当点击属性组的时候
					var selobj = jQuery(this).find('#' + i + '_groupName');
					selobj.attr("readOnly", true);
					groupSelect(selobj);
				}
				// 编辑始终显示在第一行
				$('#fieldGrid').jqGrid('editRow', 1, false);
				var selFirstobj = jQuery(this).find('#1_groupName');
				selFirstobj.attr("readOnly", true);
				groupSelect(selFirstobj);
			}
		});

		resizeFieldGrid();
		$(window).resize(function() {
			resizeFieldGrid();
		});
	}

	// 点击属性组时选择
	function groupSelect(obj) {
		// 初始化树选择
		jQuery(obj).treeselect({
			height: 200,
			chkStyle: "radio",
			searchAjaxParam: "groupName",
			width: (jQuery(obj).width() + 25),
			url: sabace.handleUrlParam("/platform/resmanage/data/data-query-group")
		});
	}

	// 设置字段取消
	function fieldCancel() {
		// 横线高亮设置
		setStepLine(2);
		// 面板内容切换
		jQuery('#fieldInfo').addClass("hide");
		jQuery('#dataInfo').removeClass("hide");
	}

	// 获取字段真实长度，一个中文字符占3位
	function getLength(value) {
		// 判断长度
		var realLength = 0;
		var len = value.length;
		var charCode = -1;
		for (var i = 0; i < len; i++) {
			charCode = value.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) realLength += 1;
			else realLength += 3;
		}
		return realLength;
	}

	// 设置字段确定
	function fieldSave() {
		var isPass = $('#fileForm').validationEngine('validate');
		if (!isPass) {
			return false;
		}
		// 对设置字段中的信息取出发送后台处理进正式表
		// 获取文件名称、符合条件记录、文件描述；从fieldgrid中获取用户设置的字段信息
		fileConfigInfo.dataName = jQuery.trim(jQuery('#dataName').val());
		fileConfigInfo.dataNum = jQuery('#dataNum').val();
		fileConfigInfo.dataDesc = jQuery.trim(jQuery('#dataDesc').val());
		var count = 0;
		// 存放名称
		var nameList = [];
		for (var i = 1; i <= fileConfigInfo.columnNum; i++) {
			var rowData = jQuery('#fieldGrid').jqGrid('getRowData', i);
			var usedVlaue = jQuery(".field-info-grid #fieldGrid #" + i + " .fa").attr("value");
			var attrName = jQuery.trim(jQuery("#" + i + "_attrName").val());
			var groupId = null;
			// 获取指标分组
			if (typeof(jQuery("#" + i + "_groupName").attr("trueValue")) == "undefined") {
				groupId = rowData.groupId;
			} else {
				groupId = jQuery("#" + i + "_groupName").attr("trueValue");
			}
			// 校验使用的字段中文名称不能为空
			if (usedVlaue == "1") {
				if (attrName == "") {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.no') + " " + rowData.columnLabel + " " + sabace.getMessage('data.import.message.columnEmpty')
					});
					return;
				}
			}
			// 校验所有的字段的长度
			if (attrName != "") {
				var realLength = getLength(attrName);
				if (realLength > 90) {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.no') + " " + rowData.columnLabel + " " + sabace.getMessage('data.import.message.columnLength')
					});
					return;
				}
			}
			if (usedVlaue == "0") {
				count++;
			}
			// 校验使用的指标名称是否重复
			if(usedVlaue == "1"){
				// 校验中文字段是否重复
				for (var j in nameList) {
					if (nameList[j] == attrName) {
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('data.import.title.tips'),
							message: sabace.getMessage('data.import.message.no') + " " + rowData.columnLabel + " " + sabace.getMessage('data.import.message.columnRepet')
						});
						return;
					}
				}
			}
			nameList.push(attrName);
			// 添加attrData中的attrUse
			fileConfigInfo.attrData[i - 1].isUsed = usedVlaue;
			// 替换attrData中的attrTitle
			fileConfigInfo.attrData[i - 1].attrName = attrName;
			// 添加attrData中的attrGroup
			fileConfigInfo.attrData[i - 1].groupId = groupId;
		}

		if (count == fileConfigInfo.columnNum) {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.selectUsedColumn')
			});
			return;
		}

		// 获取业务分类
		fileConfigInfo.classifyId = jQuery('#classifySel').val();
		fileConfigInfo.classifyName = jQuery("#classifySel").find("option:selected").text();
		
		// 横线高亮设置
		setStepLine(4);
		// 按钮样式切换
		jQuery('#oneStep').addClass("active-Finished");
		jQuery('#twoStep').addClass("active-Finished");
		jQuery('#thirdStep').addClass("active-Finished");
		if (jQuery('#fourStep').hasClass("active-Finished")) {
			jQuery('#fourStep').removeClass("active-Finished");
		}
		jQuery('#fourStep').removeClass("active-notFinished");
		// 面板内容切换
		jQuery('#fieldInfo').addClass("hide");
		jQuery('#completeInfo').removeClass("hide");
		// 初始化上方内容
		jQuery('#dataName_finish').html(fileConfigInfo.dataName);
		jQuery('#dataNum_finish').html(fileConfigInfo.dataNum);
		jQuery('#recordNum_finish').html(fileConfigInfo.dataNum);
		if(fileConfigInfo.classifyName == null || fileConfigInfo.classifyName == ""){
			fileConfigInfo.classifyName = "无";
		}
		jQuery('#classify_finish').html(fileConfigInfo.classifyName);
		jQuery('#dataDesc_finish').html(fileConfigInfo.dataDesc);
		// 初始化完成Grid
		initCompleteGrid();
	}

	// 初始化完成grid
	function initCompleteGrid() {
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/query-last-column"),
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.configLoading')
			},
			data: {
				dataId: fileConfigInfo.dataId,
				attrData: JSON.stringify(fileConfigInfo.attrData),
				columnData: JSON.stringify(fileConfigInfo.columnData)
			},
			success: function(req) {
				if (req.resFlag == "success") {
					fileConfigInfo.columnData = req.columnData;
					getCompleteDataSuccess();
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.queryDataFail')
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || sabace.getMessage('data.import.message.queryDataError')
				});
			}
		})
	}
	
	// 数据预览请求成功
	function getCompleteDataSuccess(){
		var colModelList = fileConfigInfo.attrData;
		var columnData = fileConfigInfo.columnData;
		var columnNum = colModelList.length;
		var colModel = [];

		var jqWidth = $(".complete-info-grid").width() - 45;
		var width = 180;
		if (columnNum * width < jqWidth) {
			width = Math.floor(jqWidth / columnNum);
		}
		var data = null;
		var filterType = null;
		var _align = null;
		var isUsed = null;
		for (var i = 0; i < columnNum; i++) {
			data = colModelList[i];
			isUsed = data.isUsed;
			if(isUsed == "1"){
				filterType = data.filterType;
				if (filterType == "2") {
					_align = 'right';
				}else{
					_align = 'left';
				}
				colModel.push({
					label: data.attrName,
					name: data.columnLabel,
					align: _align,
					hlign: 'center',
					sortable: false,
					width: width
				})
			}
		}
		var dataOption = {
			datatype: "local",
			styleUI: 'Bootstrap',
			regional: 'cn',
			data: columnData,
			colModel: colModel,
			rownumbers: true,
			shrinkToFit: false,
			autowidth: true,
			height: 'auto'
		};
		if (jQuery('#completeGrid').is(':empty')) {
			jQuery('#completeGrid').jqGrid(dataOption);
		} else {
			jQuery.jgrid.gridUnload('completeGrid');
			jQuery('#completeGrid').jqGrid(dataOption);
		}

		resizeCompleteGrid();
		$(window).resize(function() {
			resizeCompleteGrid();
		});
	}

	// 完成"确定"
	function completeSave() {
		bi.dialog.confirm({
			title: sabace.getMessage('data.import.title.saveData'),
			message: sabace.getMessage('data.import.message.savaDataConfirm'),
			callback: function(result) {
				if (result) {
					dataConfirmSave();
				}
			}
		});
	}

	// 数据确认保存
	function dataConfirmSave() {
		var url = sabace.handleUrlParam("/platform/resmanage/data/save-file-info");
		var fileData = {
			dataId: fileConfigInfo.dataId,
			dataName: fileConfigInfo.dataName,
			dataNum: fileConfigInfo.dataNum,
			dataDesc: fileConfigInfo.dataDesc,
			filePath: fileConfigInfo.filePath,
			firstLineTitle: fileConfigInfo.firstLineTitle,
			fileSuffix: fileConfigInfo.fileSuffix,
			attrData: JSON.stringify(fileConfigInfo.attrData),
			modType: modType,
			importStateType: importStateType,
			classifyId: fileConfigInfo.classifyId
		};
		if (opType == "edit" || opType == "append") {
			nowFilter = [];
			nowField = [];
			nowAttr = [];
			var attrData = fileConfigInfo.attrData;
			var length = attrData.length;
			var filterType = null;
			var field = null;
			var attrId = null;
			var dimId = null;
			var attrObj = {};
			// 取出指标中的所有的筛选类型
			for(var i = 0;i < length; i++){
				filterType = attrData[i].filterType;
				field =  attrData[i].fieldName;
				nowFilter.push(filterType);
				nowField.push(field);
				attrId = attrData[i].attrId;
				dimId = attrData[i].dimId;
				attrObj = {
					attrId: attrId,
					filterType: filterType,
					dimId: dimId
				};
				nowAttr.push(attrObj);
			}
			// 比较两个数组是否相等，相等说明指标信息没有做更改，不需要后台执行，不需要改变import_state,不相等说明需要改变导入状态
			if(originalFilter.toString() != nowFilter.toString() || originalField.toString() != nowField.toString()){
				fileData.importStateType = "1";
			}
			// 为追加是需要改变导入状态
			if(modType == "2" || modType == "3"){
				fileData.importStateType = "1";
			}
			url = sabace.handleUrlParam("/platform/resmanage/data/save-file-data");
		}
		// 当fileData.importStateType为“1”时说明用户改变了指标（1、新增指标 2、删除指标 3、切换类型）
		if(fileData.importStateType == "1"){
			var originalLen = originalAttr.length;
			var nowLen = nowAttr.length;
			// 遍历nowAttr判断用户是否改变了某个指标的类型，根据nowAttr中的attrId到originalAttr中比对
			// nowAttr中可能存在新增的，新增的指标的attrId为空，不需要比对
			// 只要寻找到一个就结束遍历
			var attrObj = {};
			var oAttrObj = {};
			var attrId = null;
			var oAttrId = null;
			var filterType = null;
			var oFilterType = null;
			var dimId = null;
			var oDimId = null;
			var flag = false;
			for(var i = 0; i < nowLen; i++ ){
				attrObj = nowAttr[i];
				attrId = attrObj.attrId;
				filterType = attrObj.filterType;
				dimId = attrObj.dimId
				if(attrId != null)
				{
					for(var j=0 ; j< originalLen; j++){
						oAttrObj = originalAttr[j];
						oAttrId = oAttrObj.attrId;
						oFilterType = oAttrObj.filterType;
						// 寻找到attrId相等的
						if(attrId == oAttrId)
						{
							// 判断是filterType是否相等
							if(filterType != oFilterType)
							{
								flag = true;
								break;
							} else {
								// 相等时，如果是维度，判断dimId是否相等
								if(filterType == "1"){
									if(dimId != oDimId){
										flag = true;
										break;
									}
								}
							}
						}
					}
				}
			}
		
			if(flag) {
				fileData.importStateType = "4";
			}
		}
		// 发送请求到后台保存文件信息、指标信息
		sabace.ajax({
			url: url,
			data: fileData,
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 文件配置信息保存成功后
					saveFileInfoSuccess();
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: req.msg
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || "文件数据配置失败！"
				});
			}
		});
	}

	// 文件配置信息保存成功后的处理
	function saveFileInfoSuccess() {
		bi.dialog.show({
			type: bi.dialog.TYPE_INFO,
			title: sabace.getMessage('data.import.title.tips'),
			message: sabace.getMessage('data.import.message.savaFileData'),
			closeByBackdrop: false,
			closeByKeyboard: false,
			buttons: [{
				label: sabace.getMessage('data.import.label.sure'),
				cssClass: 'btn-info',
				action: function(dialog) {
					dialog.close();
					// 隐藏所有的按钮,用户可以tab页查看数据
					jQuery('#fileButton').addClass("hide");
					jQuery('.bottom-button-common').addClass("hide");
					jQuery('#completeSaveButton').addClass("hide");
				}
			}, {
				label: sabace.getMessage('data.import.label.closePage'),
				cssClass: 'btn-default',
				action: function() {
					if(jQuery.isFunction(window.opener.reloadDataList)){
						window.opener.reloadDataList();
					}
					window.close();
				}
			}]
		});
	}

	// tab点击选择
	function selectShow() {
		var object = jQuery(this).find(".step-title-num");
		var objId = jQuery(this).attr("id");
		// 判断当前是都是已经完成的Tab
		if (object.hasClass("active-Finished") || !object.hasClass("active-notFinished")) {
			if (objId == "fileTab") {
				// 横线高亮设置
				setStepLine(1);
				// 当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#fileInfo').removeClass("hide");
			} else if (objId == "dataTab") {
				// 横线高亮设置
				setStepLine(2);
				// 当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#dataInfo').removeClass("hide");
				resizeDataGrid();
			} else if (objId == "fieldTab") {
				// 横线高亮设置
				setStepLine(3);
				// 当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#fieldInfo').removeClass("hide");
				if (jQuery('#fieldGrid').is(':empty')) {
					initFieldGrid();
				} else {
					resizeFieldGrid();
				}
			} else if (objId == "completeTab") {
				if(!reUploadFlag){
					return false;
				}
				// 横线高亮设置
				setStepLine(4);
				// 当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#completeInfo').removeClass("hide");
				if (jQuery('#completeGrid').is(':empty')) {
					initCompleteGrid();
				} else {
					resizeCompleteGrid();
				}
			}
		}
	}

	// 设置预览数据表格的宽度
	function resizeDataGrid() {
		jQuery("#dataGrid").setGridWidth($(".data-info-grid").width() - 5);
	}

	// 设置字段表格的宽度
	function resizeFieldGrid() {
		jQuery("#fieldGrid").setGridWidth($(".field-info-grid").width() - 5);
		jQuery("#fieldGrid").setGridHeight($(".field-info-grid").height() - 38);
	}

	// 设置完成界面表格的宽度
	function resizeCompleteGrid() {
		jQuery("#completeGrid").setGridWidth($(".complete-info-grid").width() - 5);
	}

	// 获取当前显示面板
	function getCurrentDisplayDiv() {
		if (jQuery(".file-info").is(":visible")) {
			return "fileInfo";
		}
		if (jQuery(".data-info").is(":visible")) {
			return "dataInfo";
		}
		if (jQuery(".field-info").is(":visible")) {
			return "fieldInfo";
		}
		if (jQuery(".complete-info").is(":visible")) {
			return "completeInfo";
		}
	}
});