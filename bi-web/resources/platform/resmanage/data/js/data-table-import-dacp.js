define(['sabace', 'proviceOrCitySelect'], function(sabace, proviceOrCitySelect) {

	// 导入数据库表信息 
	/* currentColNum:当前列序号;columnNames:列名(A、B、C......);columnNum:列数;
	   typeArr:类型数组;lengthArr:长度数组;titleArr:标题数组;fieldArr:字段名称数组;filterArr:筛选类型数组;
	   columnTypeArr:字段类型(如：VARCHAR(20),DECIMAL(20, 3)等);
	   valuesStr:数据库表前10条数据的字符串拼接，供临时表插入语句用;
	   dataTable:数据库表名称;splitType:数据表分表类型;dataName:数据库表中文名称;updatePeriod:更新周期;storageType:存储方式;
	   tableDesc:数据库表描述;updatePeriod_text: 更新周期选中显示名;storageType_text:存储方式选中显示名
	   dataId:数据编码;columnData:jqgrid本地数据 data属性值;attrData:指标信息数据;
	*/
	var tableConfigInfo = {};
	// jqgrid配置
	var dataOptions = {};
	// jqgrid模型
	var commonColModel = {};
	var opType = "add";
	var scrollPosition = 0;
	// 记忆点击列列序号
	var memoryNum = null;
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
	// 修改时初始指标信息
	var originalAttr = [];
	// 修改之后指标信息
	var nowAttr = [];

	jQuery(function() {

		// 下拉框初始化
		jQuery('.chosen-select').chosen();
		
		// 时间选择控件
		jQuery('#nextUpdateTime').datetimepicker({
			format:'YYYY-MM-DD HH:mm:ss',
			sideBySide: true,
			minDate: moment().format('YYYY-MM-DD'),
		});
		
		// 判断是新增还是修改
		if (dataId != "") {
			opType = "edit";
		}
		
		tableConfigInfo.dbId = dbId;
		if (opType == "add") {
			// 如果数据库编码也为空说明是从数据管理处添加
			if(dbId == null || dbId == ""){
				// 查询当前用户所有的数据库
				queryUserDB();
			}else {
				if(dataBaseName == null || dataBaseName == ""){
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.notDataSource')
					});
				}else{
					jQuery("#dbName").val(dataBaseName);
					if(interfaceTag){
						jQuery("#dataTable").val(dataTable);
						jQuery("#dataName").val(tableName);
						// 根据表名判断分表类型
						if(dataTable.length > 0){
							// 地市日表或日表
							if(dataTable.lastIndexOf("YYYYMMDD") > 0) {
								jQuery("#splitType").val("1");
								jQuery("#splitType").trigger("chosen:updated");
							} 
							else if (dataTable.lastIndexOf("YYYYMM") > 0){ // 地市月表或月表
								jQuery("#splitType").val("4");
								jQuery("#splitType").trigger("chosen:updated");
							}
							else if (dataTable.lastIndexOf("CITY") > 0){ // 地市
								jQuery("#splitType").val("0");
								jQuery("#splitType").trigger("chosen:updated");
							}
						}
					}else{
						// 根据数据库名称查询数据表
						queryDBTable();
					}
				}
			}
		}

		// 监控点击事件
		initMonitorEvent();
		
		// 查询业务分类
		queryClassify();

		// 为修改时像后台发送请求获取
		if (opType == "edit") {
			initGetEditData();
		}
		//点击tab时
		jQuery('.step-tab').on("click", selectShow);
		//选择数据库表"确定"
		jQuery('#tableButton').on("click", tableSave);
		//数据处理"取消"
		jQuery('#cancelButton').on("click", dataCancel);
		//数据处理"确定"
		jQuery('#saveButton').on("click", dataSave);
		//设置字段"取消"
		jQuery('#fieldCanButton').on("click", fieldCancel);
		//设置字段"确定"
		jQuery('#fieldSaveButton').on("click", fieldSave);
		//完成"确定"
		jQuery('#completeSaveButton').on("click", completeSave);
		// 设置横线高亮设置
		setStepLine(1);
		// 函数生成点击事件
		jQuery('#generateData').on("click", generateData);

		// 输入项校验
		jQuery('#tableForm').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
		
		// 切换更新周期时加上下次更新时间选择
		jQuery('#updatePeriod').on("change", updatePeriodChange);
		
		// 函数框隐藏效果
		jQuery(".funcForm").slideUp();
		
		// 数据库选择事件
		jQuery("#selectDB").on("change", queryDBTable);
		
		// 表名选择事件
		jQuery("#dataTable").on("change", dataTableChange);
		
	});
	
	/**
	 * 查询当前用户下所有的数据库
	 */
	function queryUserDB(){
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/get-user-db"),
			data: {
				interfaceFlag: "1"
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 拼装select选项
					var dbList = req.dbList;
					var dbCount = dbList.length;
					var dbObj = null;
					var dbId = null;
					var dbName = null;
					var html = '<option selected></option>';
					for(var i = 0; i< dbCount; i++){
						dbObj = dbList[i];
						dbId = dbObj.dbId;
						dbName = dbObj.dbName;
						html += '<option value="' + dbId + '">' + dbName + '</option>';
					}
					jQuery('#selectDB').append(html);
					jQuery("#selectDB").trigger("chosen:updated");
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: "您当前还没有配置数据库,请先配置数据库"
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || "查询用户所有数据库异常"
				});
			}
		});
	}
	
	/**
	 * 查询业务分类
	 */
	function queryClassify() {
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/query-classify-list"),
			success: function(req) {
				// 查询成功
				initClassify(req.classifyList);
			},
			error: function(req) {}
		});
	}
	
	/**
	 *  根据数据库名称查询数据表
	 */
	function queryDBTable(){
		jQuery('#dataTable').html("");
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/get-dacp-table"),
			data: {
				dbName: dataBaseName
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 拼装select选项
					var tableArr = req.tableArr;
					var tableCount = tableArr.length;
					var tableObj = null;
					var dataName = null;
					var dataCnName = null;
					var schemaName = null;
					var html = '<option selected></option>';
					for(var i = 0; i< tableCount; i++){
						tableObj = tableArr[i];
						dataName = tableObj.dataName;
						dataCnName = tableObj.dataCnName;
						schemaName = tableObj.schemaName;
						html += '<option value="' + schemaName + '.' + dataName + '" dataCnName="' + dataCnName + '">' + schemaName + '.' + dataName + '</option>';
					}
					jQuery('#dataTable').append(html);
					jQuery("#dataTable").trigger("chosen:updated");
				} else if(req.resFlag == "fail"){
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: "没有查询到数据库表，请确认配置接口中存在数据库表！"
					});
					return;
				}else if(req.resFlag == "error"){
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: "接口查询失败!"
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || "查询数据库表异常！"
				});
			}
		});
	}
	
	/**
	 * 表名选择事件
	 */
	function dataTableChange() {
		var dataCnName = jQuery(this).find("option:selected").attr("dataCnName");
		jQuery("#dataName").val(dataCnName);
		var dataTable = this.value;
		if(dataTable.length > 0){
			// 地市日表或日表
			if(dataTable.lastIndexOf("YYYYMMDD") > 0) {
				jQuery("#splitType").val("1");
				jQuery("#splitType").trigger("chosen:updated");
			} 
			else if (dataTable.lastIndexOf("YYYYMM") > 0){ // 地市月表或月表
				jQuery("#splitType").val("4");
				jQuery("#splitType").trigger("chosen:updated");
			}
			else if (dataTable.lastIndexOf("CITY") > 0){ // 地市
				jQuery("#splitType").val("0");
				jQuery("#splitType").trigger("chosen:updated");
			}
		}
	}
	
	/**
	 * 初始化下拉框
	 * @param req
	 */
	function initClassify(classifyList) {
		var classifyLength = classifyList.length;
		var classifyObj = null;
		var classifyName = null;
		var classifyId = null;
		var html = '<option selected></option>';
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
		jQuery("#classifySel").trigger("chosen:updated");
	}
	
	// 切换更新周期时加上下次更新时间选择
	function updatePeriodChange(){
		// 选择只更新一次、每日更新、每周更新、每月更新时需要选择下次更新时间
		// 每日更新、每周更新、每月更新时需要选择是否删除历史记录
		if(this.value != "I"){
			jQuery('#xxgxsj').removeClass('hide');
			jQuery('#sjxz').removeClass('hide');
			if(this.value == "D" || this.value == "W" || this.value == "M"){
				jQuery('#ccfs').removeClass('hide');
				jQuery('#ccxz').removeClass('hide');
			}else{
				jQuery('#ccfs').addClass('hide');
				jQuery('#ccxz').addClass('hide');
			}
		}else{
			jQuery('#xxgxsj').addClass('hide');
			jQuery('#sjxz').addClass('hide');
			jQuery('#ccfs').addClass('hide');
			jQuery('#ccxz').addClass('hide');
		}
	}

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
		tableConfigInfo.dataId = dataId;
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/get-table-data"),
			data: {
				dataId: tableConfigInfo.dataId
			},
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: '<span class="f16 bolder gray">' + sabace.getMessage('data.import.text.DBInfoLoading') + '</span>',
				spin: true
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 返回成功后的处理
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
		if(importState == "7"){
			bi.dialog.show({
				type: bi.dialog.TYPE_INFO,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.lastData')
			});
		}
	}

	// 返回成功后的处理
	function getEditDataSuccess(req) {
		tableConfigInfo = req.tableConfigBean;
		tableConfigInfo.attrData = req.attrDatas;
		tableConfigInfo.columnData = req.columnDatas;
		tableConfigInfo.dimData = req.dimDatas;
		tableConfigInfo.footerData = req.footerDatas;
		tableConfigInfo.columnNum = req.columnNum;
		// 根据tableConfigInfo.attrData的长度来dataId判断是否有效
		if (tableConfigInfo.attrData.length == 0) {
			opType = "add";
		} else {
			// 判断导入状态是否成功，如果为失败状态的弹出提示框告知用户展示的数据是上次上传导入的数据
			showDataTip(tableConfigInfo.importState);
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
				// 修改时初始指标信息
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
			// 放开所有的页签
			jQuery('#oneStep').addClass("active-Finished");
			jQuery('#twoStep').removeClass("active-notFinished");
			jQuery('#twoStep').addClass("active-Finished");
			jQuery('#thirdStep').removeClass("active-notFinished");
			jQuery('#thirdStep').addClass("active-Finished");
			jQuery('#fourStep').removeClass("active-notFinished");
			jQuery('#fourStep').addClass("active-Finished");
			jQuery('.main-panel').removeClass('hide');
			var dbName = req.dbName;
			tableConfigInfo.dataBaseName = dbName;
			jQuery("#dbName").val(dbName);
			// 初始化数据处理页签数据
			initCommonGrid();
			// 初始化设置字段页签数据
			var dataTable = tableConfigInfo.dataTable;
			var splitType = tableConfigInfo.splitType;
			var dataName = tableConfigInfo.dataName;
			var updatePeriod = tableConfigInfo.updatePeriod;
			var nextUpdateTime = tableConfigInfo.nextUpdateTime;
			var storageType = tableConfigInfo.storageType;
			var tableDesc = tableConfigInfo.tableDesc;
			jQuery("#dataTable").val(dataTable);
			jQuery("#dataTable").prop("disabled", true);
			jQuery("#splitType").val(splitType).setDisabled(true);
			jQuery("#splitType").trigger("chosen:updated");
			jQuery("#dataName").val(dataName);
			jQuery("#updatePeriod").val(updatePeriod);
			jQuery("#updatePeriod").trigger("chosen:updated");
			if(updatePeriod != "I"){
				jQuery('#xxgxsj').removeClass('hide');
				jQuery('#sjxz').removeClass('hide');
				// 下次更新时间
				if(nextUpdateTime == "-1"){
					jQuery("#nextUpdateTime").val(tableConfigInfo.lastUpdateTime);
				}else{
					jQuery("#nextUpdateTime").val(nextUpdateTime);
				}
				if(updatePeriod == "D" || updatePeriod == "W" || updatePeriod == "M"){
					jQuery('#ccfs').removeClass('hide');
					jQuery('#ccxz').removeClass('hide');
					jQuery("#storageType").val(storageType);
					jQuery("#storageType").trigger("chosen:updated");
				}else{
					jQuery('#ccfs').addClass('hide');
					jQuery('#ccxz').addClass('hide');
				}
			}else{
				jQuery('#xxgxsj').addClass('hide');
				jQuery('#sjxz').addClass('hide');
				jQuery('#ccfs').addClass('hide');
				jQuery('#ccxz').addClass('hide');
			}
			jQuery("#tableDesc").val(tableDesc);
			// 初始化完成页签数据
			var splitType_text = jQuery("#splitType").find("option:selected").text();
			var updatePeriod_text = jQuery("#updatePeriod").find("option:selected").text();
			jQuery("#dbName_finish").html(dbName);
			jQuery("#dataTable_finish").html(dataTable);
			jQuery("#dataName_finish").html(dataName);
			jQuery("#splitType_finish").html(splitType_text);
			jQuery("#updatePeriod_finish").html(updatePeriod_text);
			if(updatePeriod != "I"){
				jQuery('#xxgxsj_finish').removeClass('hide');
				jQuery('#sjxz_finish').removeClass('hide');
				jQuery("#nextUpdateTime_finish").html(nextUpdateTime);
				if(updatePeriod == "D" || updatePeriod == "W" || updatePeriod == "M"){
					jQuery('#ccfs_finish').removeClass('hide');
					jQuery('#ccxz_finish').removeClass('hide');
					var storageType_text = jQuery("#storageType").find("option:selected").text();
					jQuery("#storageType_finish").html(storageType_text);
				}else{
					jQuery('#ccfs_finish').addClass('hide');
					jQuery('#ccxz_finish').addClass('hide');
				}
			}else{
				jQuery('#xxgxsj_finish').addClass('hide');
				jQuery('#sjxz_finish').addClass('hide');
				jQuery('#ccfs_finish').addClass('hide');
				jQuery('#ccxz_finish').addClass('hide');
			}
			jQuery("#tableDesc_finish").html(tableDesc);
			// 设置业务分类
			var classifyId = tableConfigInfo.classifyId;
			tableConfigInfo.classifyId = classifyId;
			jQuery("#classifySel").val(classifyId);
			jQuery("#classifySel").trigger("chosen:updated");
			var classifyName = jQuery("#classifySel").find("option:selected").text();
			if(classifyName == null || classifyName == "") {
				classifyName = "无";
			}
			tableConfigInfo.classifyName = classifyName;
			jQuery('#classify_finish').html(classifyName);
		}
	}

	//数据库表选择"确定"事件
	function tableSave() {
		var isPass = $('#tableForm').validationEngine('validate');
		if (!isPass) {
			return false;
		}
		
		if(opType == "add" && (dbId == null || dbId == "")){
			var selDB = jQuery("#selectDB").val();
			var selDBName = jQuery("#selectDB").find("option:selected").text();
			if(selDB == null || selDB == ""){
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: "您还没有选择归属数据库，请选择归属数据库！"
				});
				return;
			}
			dataBaseName = selDBName;
			tableConfigInfo.dbId = selDB;
		}else {
			var dbName = jQuery("#dbName").val();
			if(dbName == ""){
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.notDataSource')
				});
				return;
			}
		}

		//发送请求到后台创建临时表
		tableConfigInfo.dataTable = jQuery.trim(jQuery("#dataTable").val());
		tableConfigInfo.splitType = jQuery("#splitType").val();
		tableConfigInfo.dataName = jQuery.trim(jQuery("#dataName").val());
		tableConfigInfo.updatePeriod = jQuery("#updatePeriod").val();
		tableConfigInfo.updatePeriodText = jQuery("#updatePeriod").find("option:selected").text();
		tableConfigInfo.splitType = jQuery("#splitType").val();
		tableConfigInfo.splitTypeText = jQuery("#splitType").find("option:selected").text();
		tableConfigInfo.storageType = jQuery("#storageType").val();
		tableConfigInfo.storageTypeText = jQuery("#storageType").find("option:selected").text();
		tableConfigInfo.tableDesc = jQuery.trim(jQuery("#tableDesc").val());
		tableConfigInfo.nextUpdateTime = jQuery("#nextUpdateTime").val();
		// 获取业务分类
		tableConfigInfo.classifyId = jQuery('#classifySel').val();
		tableConfigInfo.classifyName = jQuery("#classifySel").find("option:selected").text();
//		// 判断是否是分表
//		if (tableConfigInfo.dataTable.indexOf("$") > 0) {
//			if (tableConfigInfo.splitType == 0) {
//				bi.dialog.show({
//					type: bi.dialog.TYPE_DANGER,
//					title: sabace.getMessage('data.import.title.tips'),
//					message: sabace.getMessage('data.import.message.subTable')
//				});
//				return;
//			}
//		} else {
//			if (tableConfigInfo.splitType != 0) {
//				bi.dialog.show({
//					type: bi.dialog.TYPE_DANGER,
//					title: sabace.getMessage('data.import.title.tips'),
//					message: sabace.getMessage('data.import.message.notSubTable')
//				});
//				return;
//			}
//		}
		if (tableConfigInfo.updatePeriod == "") {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.updatePeriod')
			});
			return;
		}
		// 校验下次更新时间和存储方式
		// 选择只更新一次、每日更新、每周更新、每月更新时需要选择下次更新时间
		// 每日更新、每周更新、每月更新时需要选择是否删除历史记录
		if(tableConfigInfo.updatePeriod != "I"){
			// 判断下次校验时间是否为空
			if(tableConfigInfo.nextUpdateTime == ""){
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.nextUpdateTime')
				});
				return;
			}
			if(tableConfigInfo.updatePeriod == "D" || tableConfigInfo.updatePeriod == "W" || tableConfigInfo.updatePeriod == "M"){
				if (tableConfigInfo.storageType == "") {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.storageType')
					});
					return;
				}
			}
		}
		
		if(tableConfigInfo.updatePeriod == "I"){
			tableConfigInfo.nextUpdateTime = "";
			tableConfigInfo.storageType = "";
		}else{
			if(tableConfigInfo.updatePeriod == "S"){
				tableConfigInfo.storageType = "";
			}
		}
		
		var dbParams = {
			dbId: tableConfigInfo.dbId,
			dataTable: tableConfigInfo.dataTable,
			dataName: tableConfigInfo.dataName,
			splitType: tableConfigInfo.splitType,
			updatePeriod: tableConfigInfo.updatePeriod,
			storageType: tableConfigInfo.storageType,
			tableDesc: tableConfigInfo.tableDesc,
			dataId: tableConfigInfo.dataId,
			nextUpdateTime: tableConfigInfo.nextUpdateTime,
			opType: opType,
			classifyId: tableConfigInfo.classifyId,
		    classifyName: tableConfigInfo.classifyName
		};
		// 发送请求到后台
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/creat-dacp-table"),
			data: dbParams,
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.queryTableLoading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 返回成功后的处理
					createTableSuccess(req);
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
					message: req.responseText || sabace.getMessage('data.import.message.importTableError')
				});
			}
		});
	}

	// 返回成功后的处理
	function createTableSuccess(req) {
		tableConfigInfo = req.tableConfigBean;
		tableConfigInfo.attrData = req.attrDatas;
		tableConfigInfo.columnData = req.columnDatas;
		tableConfigInfo.dimData = req.dimDatas;
		tableConfigInfo.footerData = req.footerDatas;
		//横线高亮设置
		setStepLine(2);
		//按钮样式切换
		jQuery('#oneStep').addClass("active-Finished");
		if (jQuery('#twoStep').hasClass("active-Finished")) {
			jQuery('#twoStep').removeClass("active-Finished");
		}
		jQuery('#twoStep').removeClass("active-notFinished");
		//面板内容切换
		jQuery('#tableInfo').addClass("hide");
		jQuery('#dataInfo').removeClass("hide");
		//数据处理时初始化jqGrid
		initCommonGrid();
	}

	//横线高亮设置
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
		var jqWidth = jQuery(window).width() * 0.94;
		var width = 200;
		if (attrDataLength * width < jqWidth) {
			width = Math.floor(jqWidth / attrDataLength);
		}
		var columnLabel = null;
		var _selectHtml = null;
		var columnFilterTypeName = null;
		var filterType = null;
		var _align = null;
		var attrClass = null;
		var operHtml = "<div id='columnOper'></div>";
		for (var i = 0; i < attrDataLength; i++) {
			columnFilterTypeName = attrData[i].columnFilterTypeName;
			columnLabel = attrData[i].columnLabel;
			filterType = attrData[i].filterType;
			attrClass = attrData[i].attrClass;
			if (typeof(columnFilterTypeName) == "undefined") {
				columnFilterTypeName = "字符";
			}
			if (filterType == "2") {
				_align = 'right';
			}else{
				_align = 'left';
			}
			if(attrClass == "0"){
				_selectHtml = "<div id='dim'><span title=" + columnFilterTypeName + " class='dimText'>" + columnFilterTypeName+ "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + columnLabel + operHtml;
			}else{
				_selectHtml = "<div id='dimOther'><span title=" + columnFilterTypeName + " class='dimText'>" + columnFilterTypeName+ "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + columnLabel + operHtml;
			}
			colModel.push({
				label: _selectHtml,
				name: columnLabel,
				align: _align,
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
		commonColModel = createColModel(tableConfigInfo.attrData, tableConfigInfo.dimData);
		dataOptions = {
			datatype: "local",
			styleUI: 'Bootstrap',
			regional: 'cn',
			data: tableConfigInfo.columnData,
			colModel: commonColModel,
			rownumbers: true,
			autowidth: true,
			shrinkToFit: false,
			height: 'auto',
			footerrow: true,
			loadComplete: function() {
				// 设置自定义列颜色
				jQuery("#dataInfo #dimOther").parent().parent().css("background-color", "#DAE9E9");
				// 底部数据展示
				if(tableConfigInfo.footerData.length < 1){
					jQuery(".data-info-grid .ui-jqgrid-sdiv").hide();
				}else{
					jQuery(".data-info-grid .ui-jqgrid-sdiv").show();
					var data = {};
					var colNum = tableConfigInfo.footerData.length;
					var footerData = null;
					for(var i = 0; i < colNum; i++){
						footerData = tableConfigInfo.footerData[i];
						data[footerData.name] = footerData.desc;
					}
					jQuery(this).footerData("set", data);
				}
				var columnTh = jQuery(this).parents().find(".data-info-grid th");
				columnTh.click(function() {
					tableConfigInfo.currentColNum = jQuery(this)[0].cellIndex;
					var obj = jQuery(this);
					var th_id = jQuery(obj).attr("id");
					jQuery("th").removeClass('jqgrid-underline');
					jQuery("th[id=" + th_id + "]").addClass('jqgrid-underline');
					// 判断当前列是否是自定义列，是则打开函数框
					openFuncForm();
				});
				columnTh.find("#dim").on("click", function() {
					tableConfigInfo.currentColNum = jQuery(this).parent().parent()[0].cellIndex;
					var filterType = tableConfigInfo.attrData[tableConfigInfo.currentColNum-1].filterType;
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
					tableConfigInfo.currentColNum = jQuery(this).parent().parent()[0].cellIndex;
					var filterType = tableConfigInfo.attrData[tableConfigInfo.currentColNum-1].filterType;
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
					tableConfigInfo.currentColNum = jQuery(this).parent().parent()[0].cellIndex;
					jQuery("#columnOperMenu .addLeftColumn").on("click", addLeftColumn);
					jQuery("#columnOperMenu .addRightColumn").on("click", addRightColumn);
					jQuery("#columnOperMenu .delThecolumn").on("click", delColumn);
					sabace.stopBubble(event);
				});
			}
		}
		jQuery('#dataGrid').jqGrid(dataOptions);

		$(window).resize(function() {
			resizeDataGrid();
		});
	}

	// 显示函数框
	function openFuncForm() {
		var curAttrData = tableConfigInfo.attrData[tableConfigInfo.currentColNum - 1];
		if (curAttrData.attrClass == "1") {
			memoryNum = tableConfigInfo.currentColNum;
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
		var attrData = tableConfigInfo.attrData;
		var columnNum = tableConfigInfo.columnNum;
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
			   			tableConfigInfo.attrData[index].superRange = selectObject.selectValue;
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
		var attrData = tableConfigInfo.attrData;
		var columnNum = tableConfigInfo.columnNum;
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
		var changePosition = tableConfigInfo.currentColNum - 1;
		var changeData = {};
		// 获取是选中的列的下拉框列表
		changeData.selectValue = selectValue;
		changeData.selectName = selectName;
		var curAttrData = tableConfigInfo.attrData[changePosition];
		// 记住原来的值供转换失败时重新查询
		changeData.columnLabel = curAttrData.columnLabel;
		changeData.colLength = curAttrData.colLength;
		changeData.colScale = curAttrData.colScale;
		changeData.fieldName = curAttrData.fieldName;
		changeData.dataId = tableConfigInfo.dataId;
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
		
		// 字符或时间不可转换成数值
		if (originType =="9" || originType == "4" || originType == "6" || originType == "7")
		{
			if (newType == "2")
			{
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.cannotChange') + getTypeName(originType) + ",不可切换成数值！"
				});
				return;
			}
		}
		
		// 类型不同时
		if (oldType != selectValue) {
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
					// 筛选类型切换
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
				columnData: JSON.stringify(tableConfigInfo.columnData),
				type: "2"
			},
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					jQuery.jgrid.gridUnload('dataGrid');
					// 修改attrData
					tableConfigInfo.columnData = req.columnDatas;
					curAttrData.filterType = changeData.selectValue;
					curAttrData.attrType = req.attrType;
					curAttrData.colLength = req.colLength;
					curAttrData.colScale = req.colScale;
					curAttrData.columnType = req.columnType;
					curAttrData.columnFilterTypeName = req.columnFilterTypeName;
					var operHtml = "<div id='columnOper'></div>";
					var _selectHtml = null;
					if(curAttrData.attrClass == "0"){
						_selectHtml = "<div id='dim'><span title=" + changeData.selectName + " class='dimText'>" + changeData.selectName+ "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + changeData.columnLabel + operHtml;
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
					dataOptions.data = tableConfigInfo.columnData;
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
				columnData: JSON.stringify(tableConfigInfo.columnData)
			},
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					jQuery.jgrid.gridUnload('dataGrid');
					// 修改attrData
					tableConfigInfo.columnData = req.columnData;
					curAttrData.filterType = changeData.selectValue;
					curAttrData.columnFilterTypeName = changeData.selectName;
					var operHtml = "<div id='columnOper'></div>";
					var _selectHtml = null;
					if(curAttrData.attrClass == "0"){
						_selectHtml = "<div id='dim'><span title=" + changeData.selectName + " class='dimText'>" + changeData.selectName+ "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + changeData.columnLabel + operHtml;
					}else{
						_selectHtml = "<div id='dimOther'><span title=" + changeData.selectName + " class='dimText'>" + changeData.selectName+ "</span><span class='glyphicon glyphicon-chevron-down dimDown'></span></div>" + changeData.columnLabel + operHtml;
					}
					var colModel = dataOptions.colModel;
					colModel[changePosition].label = _selectHtml;
					colModel[changePosition].align = 'left';
					dataOptions.colModel = colModel;
					dataOptions.data = tableConfigInfo.columnData;
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
		tableConfigInfo.funcTxt = funcTxt;
		reloadData(memoryNum);
	}
	
	// 函数处理后刷新数据
	function reloadData(columnIndex) {
		scrollPosition = jQuery(".data-info-grid .ui-jqgrid .ui-jqgrid-bdiv").scrollLeft();
		// 向后台发送请求处理用户输入函数
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/process-func"),
			data: {
				dataId: tableConfigInfo.dataId,
				columnIndex: columnIndex,
				funcTxt: tableConfigInfo.funcTxt,
				attrData: JSON.stringify(tableConfigInfo.attrData),
				columnData: JSON.stringify(tableConfigInfo.columnData)
			},
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					jQuery.jgrid.gridUnload('dataGrid');
					tableConfigInfo.columnData = req.columnDatas;
					var curData = tableConfigInfo.attrData[memoryNum - 1];
					curData.funcLabel = tableConfigInfo.funcTxt;
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
					commonColModel = createColModel(tableConfigInfo.attrData, tableConfigInfo.dimData);
					dataOptions.colModel = commonColModel;
					dataOptions.data = tableConfigInfo.columnData;
					jQuery('#dataGrid').jqGrid(dataOptions);
				} else {
					jQuery.jgrid.gridUnload('dataGrid');
					var curData = tableConfigInfo.attrData[memoryNum - 1];
					curData.fieldName = "";
					curData.funcLabel = "";
					commonColModel = createColModel(tableConfigInfo.attrData, tableConfigInfo.dimData);
					dataOptions.colModel = commonColModel;
					dataOptions.data = tableConfigInfo.columnData;
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
		tableConfigInfo.attrData = updateFuncLabel(tableConfigInfo.attrData,curIndex);
		jQuery.jgrid.gridUnload('dataGrid');
		tableConfigInfo.columnData = tempData;
		commonColModel = createColModel(tableConfigInfo.attrData, tableConfigInfo.dimData);
		dataOptions.colModel = commonColModel;
		dataOptions.data = tableConfigInfo.columnData;
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
		var columnNum = tableConfigInfo.columnNum;
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
		var columnNum = tableConfigInfo.columnNum + 1;
		tableConfigInfo.columnNum = columnNum;
		var curIndex = tableConfigInfo.currentColNum - 1;
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
				tableConfigInfo.attrData.insert(i, newCols);
				// 底部数据处理
				tableConfigInfo.footerData.insert(i, newData);
			} else if (i > curIndex) {
				tableConfigInfo.attrData[i].orderId = i + 1;
				tableConfigInfo.attrData[i].columnLabel = nameArr[i];
				// 底部数据处理
				tableConfigInfo.footerData[i].name = nameArr[i];
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
		var columnNum = tableConfigInfo.columnNum + 1;
		tableConfigInfo.columnNum = columnNum;
		var curIndex = tableConfigInfo.currentColNum;
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
				tableConfigInfo.attrData.insert(i, newCols);
				// 底部数据处理
				tableConfigInfo.footerData.insert(i, newData);
			} else if (i > curIndex) {
				tableConfigInfo.attrData[i].orderId = i + 1;
				tableConfigInfo.attrData[i].columnLabel = nameArr[i];
				// 底部数据处理
				tableConfigInfo.footerData[i].name = nameArr[i];
			}
		}
		refreshData(curIndex, columnNum, nameArr);
	}

	// 删除列
	function delColumn() {
		// 首先判断是否是自定义
		if (tableConfigInfo.attrData[tableConfigInfo.currentColNum - 1].attrClass == "0") {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.notDelCustomColumn')
			});
			return;
		}
		
		// 判断是否有其他自定义引用该列，如有，提示用户先删除其他关联列
		var columnLabel = "$" + tableConfigInfo.attrData[tableConfigInfo.currentColNum - 1].columnLabel;
		var curAttrData = null;
		var labelName = null;
		var curfuncLabel = null;
		var quoteArr = [];
		for(var i = 0; i< tableConfigInfo.columnNum; i++ ){
			curAttrData =  tableConfigInfo.attrData[i];
			if(i != tableConfigInfo.currentColNum - 1 && curAttrData.attrClass == "1"){
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
					var columnNum = tableConfigInfo.columnNum - 1;
					var curIndex = tableConfigInfo.currentColNum - 1;
					tableConfigInfo.columnNum = columnNum;
					// 获取所有的列名
					var nameArr = getAllColumnName(columnNum+1);
					// 根据需要删除列的次序调整原来指标数组中的的orderId,columnLabel
					for (var i = 0; i < columnNum + 1; i++) {
						if (i == curIndex) {
							// 删除列
							tableConfigInfo.attrData.splice(i, 1);
							// 底部数据处理
							tableConfigInfo.footerData.splice(i, 1);
						} else if (i > curIndex) {
							tableConfigInfo.attrData[i - 1].orderId = i;
							tableConfigInfo.attrData[i - 1].columnLabel = nameArr[i - 1];
							// 底部数据处理
							tableConfigInfo.footerData[i - 1].name = nameArr[i - 1];
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
		tableConfigInfo.attrData = updateDelFuncLabel(tableConfigInfo.attrData,curIndex);
		tableConfigInfo.columnData = tempData;
		commonColModel = createColModel(tableConfigInfo.attrData, tableConfigInfo.dimData);
		dataOptions.colModel = commonColModel;
		dataOptions.data = tableConfigInfo.columnData;
		jQuery('#dataGrid').jqGrid(dataOptions);
		resizeDataGrid();　　
		setScrollPosition();
	}
	
	// 添加列时同步修改所有的自定义列的FuncLabel
	function updateDelFuncLabel(attrData,curIndex){
		var columnNum = tableConfigInfo.columnNum;
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

	//数据处理"取消"
	function dataCancel() {
		//横线高亮设置
		setStepLine(1);
		//面板内容切换
		jQuery('#dataInfo').addClass("hide");
		jQuery('#tableInfo').removeClass("hide");
	}

	//数据处理"确定"
	function dataSave() {
		// 判断是否有自定义列但没有生成函数的
		for (var i = 0; i < tableConfigInfo.columnNum; i++) {
			if (tableConfigInfo.attrData[i].attrClass == "1") {
				if (typeof(tableConfigInfo.attrData[i].fieldName) == "undefined" || tableConfigInfo.attrData[i].fieldName == "") {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: sabace.getMessage('data.import.message.no') + " " + tableConfigInfo.attrData[i].columnLabel + " 列是自定义列,该列还没有生成数据,请输入函数生成该列数据或选择删除该列！"
					});
					return;
				}
			}
		}
		//横线高亮设置
		setStepLine(3);
		//按钮样式切换
		jQuery('#oneStep').addClass("active-Finished");
		jQuery('#twoStep').addClass("active-Finished");
		if (jQuery('#thirdStep').hasClass("active-Finished")) {
			jQuery('#thirdStep').removeClass("active-Finished");
		}
		jQuery('#thirdStep').removeClass("active-notFinished");
		//面板内容切换
		jQuery('#dataInfo').addClass("hide");
		jQuery('#fieldInfo').removeClass("hide");
		//初始化字段Grid
		initFieldGrid();
	}

	// 字段grid初始化
	function initFieldGrid() {
		if (!jQuery('#fieldGrid').is(':empty')) {
			jQuery.jgrid.gridUnload('fieldGrid');
		}
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/data-common-field"),
			data: {
				attrData: JSON.stringify(tableConfigInfo.attrData)
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// field字段信息返回成功后的处理
					getFieldSuccess(req);
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
					message: req.responseText || sabace.getMessage('data.import.message.queryFieldFail')
				});
			}
		})
	}

	// field字段信息返回成功后的处理
	function getFieldSuccess(req) {
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
				label: sabace.getMessage('data.import.label.fieldName'),
				name: 'fieldName',
				align: 'left',
				hlign: 'center',
				sortable: false
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
				name: 'groupId',
				align: 'center',
				hlign: 'center',
				hidden: true
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
				label: sabace.getMessage('data.import.label.isUsed') + ':<i class="fa fa-square-o check-box" id="allCheck"></i>)',
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
				for (var i = 2; i <= tableConfigInfo.columnNum; i++) {
					$('#fieldGrid').jqGrid('editRow', i, false);
					// 当点击属性组的时候
					var obj = jQuery(this).find('#' + i + '_groupName');
					obj.attr("readOnly", true);
					groupSelect(obj);
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

	//设置字段取消
	function fieldCancel() {
		//横线高亮设置
		setStepLine(2);
		//面板内容切换
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

	//设置字段确定
	function fieldSave() {
		var count = 0;
		// 存放名称
		var nameList = [];
		for (var i = 1; i <= tableConfigInfo.columnNum; i++) {
			var rowData = jQuery('#fieldGrid').jqGrid('getRowData', i);
			var usedVlaue = jQuery(".field-info-grid #fieldGrid #" + i + " .fa").attr("value");
			var attrName = jQuery("#" + i + "_attrName").val();
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
			// 校验使用的名表名称不能重复
			if (usedVlaue == "1") {
				// 校验中文字段是否重复
				for (var j in nameList) {
					if (nameList[j] == attrName) {
						bi.dialog.show({
							type: bi.dialog.TYPE_DANGER,
							title: sabace.getMessage('data.import.title.tips'),
							message: sabace.getMessage('data.import.message.no') + " "  + rowData.columnLabel + " " + sabace.getMessage('data.import.message.columnRepet')
						});
						return;
					}
				}
			}
			nameList.push(attrName);
			// 添加attrData中的attrUse
			tableConfigInfo.attrData[i - 1].isUsed = usedVlaue;
			// 替换attrData中的attrTitle
			tableConfigInfo.attrData[i - 1].attrName = attrName;
			// 添加attrData中的attrGroup
			tableConfigInfo.attrData[i - 1].groupId = groupId;
		}

		if (count == tableConfigInfo.columnNum) {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.selectUsedColumn')
			});
			return;
		}
	
		//横线高亮设置
		setStepLine(4);
		//按钮样式切换
		jQuery('#oneStep').addClass("active-Finished");
		jQuery('#twoStep').addClass("active-Finished");
		jQuery('#thirdStep').addClass("active-Finished");
		if (jQuery('#fourStep').hasClass("active-Finished")) {
			jQuery('#fourStep').removeClass("active-Finished");
		}
		jQuery('#fourStep').removeClass("active-notFinished");
		//面板内容切换
		jQuery('#fieldInfo').addClass("hide");
		jQuery('#completeInfo').removeClass("hide");
		//设置上方的值
		if (opType == "add") {
			jQuery("#dbName_finish").html(dataBaseName);
		} else {
			jQuery("#dbName_finish").html(tableConfigInfo.dataBaseName);
		}
		jQuery("#dataTable_finish").html(tableConfigInfo.dataTable);
		jQuery("#dataName_finish").html(tableConfigInfo.dataName);
		var splitType_text = jQuery("#splitType").find("option:selected").text();
		var updatePeriod_text = jQuery("#updatePeriod").find("option:selected").text();
		var storageType_text = jQuery("#storageType").find("option:selected").text();
		jQuery("#splitType_finish").html(splitType_text);
		jQuery("#updatePeriod_finish").html(updatePeriod_text);
		jQuery("#tableDesc_finish").html(tableConfigInfo.tableDesc);
		if(tableConfigInfo.classifyName == null || tableConfigInfo.classifyName == ""){
			tableConfigInfo.classifyName = "无";
		}
		jQuery('#classify_finish').html(tableConfigInfo.classifyName);
		
		if(tableConfigInfo.updatePeriod != "I"){
			jQuery('#xxgxsj_finish').removeClass('hide');
			jQuery('#sjxz_finish').removeClass('hide');
			jQuery("#nextUpdateTime_finish").html(tableConfigInfo.nextUpdateTime);
			if(tableConfigInfo.updatePeriod == "D" || tableConfigInfo.updatePeriod == "W" || tableConfigInfo.updatePeriod == "M"){
				jQuery('#ccfs_finish').removeClass('hide');
				jQuery('#ccxz_finish').removeClass('hide');
				jQuery("#storageType_finish").html(storageType_text);
			}else{
				jQuery('#ccfs_finish').addClass('hide');
				jQuery('#ccxz_finish').addClass('hide');
			}
		}else{
			jQuery('#xxgxsj_finish').addClass('hide');
			jQuery('#sjxz_finish').addClass('hide');
			jQuery('#ccfs_finish').addClass('hide');
			jQuery('#ccxz_finish').addClass('hide');
		}

		//初始化完成Grid
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
				dataId: tableConfigInfo.dataId,
				attrData: JSON.stringify(tableConfigInfo.attrData),
				columnData: JSON.stringify(tableConfigInfo.columnData)
			},
			success: function(req) {
				if (req.resFlag == "success") {
					tableConfigInfo.columnData = req.columnData;
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
		var colModelList = tableConfigInfo.attrData;
		var columnData = tableConfigInfo.columnData;
		var columnNum = colModelList.length;
		
		var jqWidth = $(".complete-info-grid").width() - 45;
		var width = 180;
		if (columnNum * width < jqWidth) {
			width = Math.floor(jqWidth / columnNum);
		}

		var colModel = [];
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
			data: columnData,
			styleUI: 'Bootstrap',
			colModel: colModel,
			regional: 'cn',
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

	//完成"确定"
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
		var dbParams = {
			dbId: tableConfigInfo.dbId,
			dataTable: tableConfigInfo.dataTable,
			dataName: tableConfigInfo.dataName,
			splitType: tableConfigInfo.splitType,
			updatePeriod: tableConfigInfo.updatePeriod,
			storageType: tableConfigInfo.storageType,
			tableDesc: tableConfigInfo.tableDesc,
			dataId: tableConfigInfo.dataId,
			nextUpdateTime: tableConfigInfo.nextUpdateTime,
			attrData: JSON.stringify(tableConfigInfo.attrData),
			importStateType: importStateType,
			classifyId: tableConfigInfo.classifyId
		};
		var url = sabace.handleUrlParam("/platform/resmanage/data/save-dacp-table-info");
		if (opType == "edit") {
			nowFilter = [];
			nowField = [];
			nowAttr = [];
			var attrData = tableConfigInfo.attrData;
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
				dbParams.importStateType = "1";
			}
			url = sabace.handleUrlParam("/platform/resmanage/data/save-table-data");
		}
		// 当dbParams.importStateType为“1”时说明用户改变了指标（1、新增指标 2、删除指标 3、切换类型）
		if(dbParams.importStateType == "1"){
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
				dbParams.importStateType = "4";
			}
		}
		// 发送请求到后台保存表信息及指标信息
		sabace.ajax({
			url: url,
			data: dbParams,
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 数据保存成功后的处理
					saveTableInfoSuccess();
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
					message: req.responseText || "数据表数据配置失败！"
				});
			}
		});
	}

	// 数据保存成功
	function saveTableInfoSuccess() {
		bi.dialog.show({
			type: bi.dialog.TYPE_INFO,
			title: sabace.getMessage('data.import.title.tips'),
			message: sabace.getMessage('data.import.message.savaTableData'),
			closable: true,
			closeByBackdrop: false,
			closeByKeyboard: false,
			buttons: [{
				label: sabace.getMessage('data.import.label.sure'),
				cssClass: 'btn-info',
				action: function(dialog) {
					dialog.close();
					// 隐藏所有的按钮,用户可以tab页查看数据
					jQuery('#tableButton').addClass("hide");
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

	//tab点击选择
	function selectShow() {
		var object = jQuery(this).find(".step-title-num");
		var objId = jQuery(this).attr("id");
		//判断当前是都是已经完成的Tab
		if (object.hasClass("active-Finished") || !object.hasClass("active-notFinished")) {
			if (objId == "tableTab") {
				//横线高亮设置
				setStepLine(1);
				//当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#tableInfo').removeClass("hide");
			} else if (objId == "dataTab") {
				//横线高亮设置
				setStepLine(2);
				//当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#dataInfo').removeClass("hide");
				resizeDataGrid();
			} else if (objId == "fieldTab") {
				//横线高亮设置
				setStepLine(3);
				//当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#fieldInfo').removeClass("hide");
				if (jQuery('#fieldGrid').is(':empty')) {
					initFieldGrid();
				} else {
					resizeFieldGrid();
				}
			} else if (objId == "completeTab") {
				//横线高亮设置
				setStepLine(4);
				//当前隐藏
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

	// 设置预览数据表格的宽度
	function resizeFieldGrid() {
		jQuery("#fieldGrid").setGridWidth($(".field-info-grid").width() - 5);　　
		jQuery("#fieldGrid").setGridHeight($(".field-info-grid").height() - 38);
	}
	
	// 设置完成界面表格的宽度
	function resizeCompleteGrid() {
		jQuery("#completeGrid").setGridWidth($(".complete-info-grid").width() - 5);
	}


	//获取当前显示面板
	function getCurrentDisplayDiv() {
		if (jQuery(".table-info").is(":visible")) {
			return "tableInfo";
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