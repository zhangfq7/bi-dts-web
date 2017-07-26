define(['sabace'], function(sabace) {
	
	// 视图配置信息
	var tableViewConfigInfo = {};
	// 操作类型,默认操作类型为新增
	var opType = "add";
	// 数据表总展示数组
	var allTableArr = [];
	// 返回的所有关联字段
	var joinAttrArr = [];
	// 返回的展示字段
	var viewAttrArr = [];
	// 关联关系数组
	var joinFieldArr = [];
	// 展示字段数组
	var viewFieldArr = [];
	// 是否修改
	var changeFlag = false;
	// 所有的工作表
	var tableList = [];
	
	jQuery(function() {

		// 下拉框初始化
		jQuery('.chosen-select').chosen();
		
		// 判断是新增还是修改
		if (viewId != "") {
			opType = "edit";
		}
		
		if (opType == "add") {
			// 查询当前用户所有的直连数据库
			queryUserDB();
		}
		
		// 查询业务分类
		queryClassify();

		// 为修改时像后台发送请求获取
		if (opType == "edit") {
			initGetEditData();
		}
		// 点击tab时
		jQuery('.step-tab').on("click", selectShow);
		// 定义业务数据视图的"下一步"
		jQuery('#viewButton').on("click", viewSave);
		// 选择业务数据表的"取消"
		jQuery('#tableCancelButton').on("click", tableCancel);
		// 选择业务数据表的"下一步"
		jQuery('#tableSaveButton').on("click", tableSave);
		// 设置业务数据表关系的"取消"
		jQuery('#linkCancelButton').on("click", linkCancel);
		// 设置业务数据表关系的"下一步"
		jQuery('#linkSaveButton').on("click", linkSave);
		// 定义展现字段"确定"
		jQuery('#fieldSaveButton').on("click", fieldSave);
		
		// 设置横线高亮设置
		setStepLine(1);

		// 输入项校验
		jQuery('#viewForm').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
		
		// 数据库表查询框内滚动 
		jQuery("#tableInfo #tableBlock").niceScroll();
		
		// 数据表存储类型change事件
		jQuery('#tableType').on("change", function(){
			queryTable("filter");
		});
		
		// 数据库表选中事件
		jQuery('#tableBlock').on("click", '.table-item', selectTable);
		// 数据表总展示删除事件
		jQuery('#tableSelected').on("click", '#selectedClose', selectedClose);
	});
	
	/**
	 * 查询当前用户下所有直连的数据库
	 */
	function queryUserDB(){
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/get-user-db"),
			data: {
				interfaceFlag: "2"
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
						message: "您当前还没有配置直连数据库,请先配置直连数据库"
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || "查询用户所有直连数据库异常"
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
	 * 初始化下拉框
	 * @param req
	 */
	function initClassify(classifyList) {
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
		jQuery("#classifySel").trigger("chosen:updated");
	}

	// 修改时获取修改的数据
	function initGetEditData() {
		tableViewConfigInfo.viewId = viewId;
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/tableview/get-table-view"),
			data: {
				viewId: tableViewConfigInfo.viewId
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
					message: req.responseText || "视图信息获取异常！"
				});
			}
		});
	}
	
	// 返回成功后的处理
	function getEditDataSuccess(req){
		// 放开所有的页签
		jQuery('#oneStep').addClass("active-Finished");
		jQuery('#twoStep').removeClass("active-notFinished");
		jQuery('#twoStep').addClass("active-Finished");
		jQuery('#thirdStep').removeClass("active-notFinished");
		jQuery('#thirdStep').addClass("active-Finished");
		jQuery('#fourStep').removeClass("active-notFinished");
		jQuery('#fourStep').addClass("active-Finished");
		jQuery('.main-panel').removeClass('hide');
		
		// 定义业务数据视图
		// 视图基本信息
		tableViewConfigInfo = req.tableViewConfigInfo;
		// 视图名称
		jQuery('#viewName').val(tableViewConfigInfo.viewName);
		// 归属数据库
		jQuery('#dbName').val(tableViewConfigInfo.dbName);
		// 业务分类
		jQuery("#classifySel").val(tableViewConfigInfo.classifyId);
		jQuery("#classifySel").trigger("chosen:updated");
		// 视图描述
		jQuery("#viewDesc").val(tableViewConfigInfo.viewDesc);
		
		// 选择业务数据表
		allTableArr = req.allTableArr;
		// 设置总展示
		setEditAllTable(allTableArr);
		// 所有的工作表
		tableList = req.tableList;
		// 设置所有的工作表
		initTableList(tableList);
		
		// 设置业务数据表关系
		joinFieldArr = req.joinFieldArr;
		// 所有的关联字段
		joinAttrArr = req.joinAttrArr;
		
		// 定义展现字段
		viewFieldArr = req.viewFieldArr;
		// 所有的展示字段
		viewAttrArr = req.viewAttrArr;
	}
	
	// 更新数据表总展示的样式
	function setEditAllTable(allTableArr) {
		var html = '';
		var tableObj = null;
		for(var i = 0; i < allTableArr.length; i++){
			tableObj = allTableArr[i];
			html += '<div class="table-all-div divDispaly" id="' + tableObj.dataId +'" title="' + tableObj.dataName + '">';
			html += 	'<div class="table-all-name">';
			html += 	'	<span class="f14">' + tableObj.dataName + '</span>';
			html += 	'</div>';
			html += 	'<i class="fa fa-close f12 table-select-close" id="selectedClose" title="删除"></i>';
			html += '</div>';
		}
		jQuery('#tableInfo .table-selected').append(html);
	}

	//横线高亮设置
	function setStepLine(step) {
		var marWidth = 25 * (step - 1) + 4 + "%";
		jQuery('#stepLine').css("margin-left", marWidth);
	}

	// 定义业务数据视图的"下一步"
	function viewSave() {
		var isPass = $('#viewForm').validationEngine('validate');
		if (!isPass) {
			return false;
		}
		
		// 获取视图基本信息
		// 归属数据库
		if(opType == "add"){
			changeFlag = false;
			if(typeof(tableViewConfigInfo.dbId) == "undefined"){
				tableViewConfigInfo.dbId = "";
			}
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
			if(tableViewConfigInfo.dbId != selDB && "" != tableViewConfigInfo.dbId){
				changeFlag = true;
			}
			tableViewConfigInfo.dbId = selDB;  
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
		// 视图名称
		tableViewConfigInfo.viewName = jQuery.trim(jQuery('#viewName').val());
		// 获取业务分类
		tableViewConfigInfo.classifyId = jQuery('#classifySel').val();
		// 视图描述
		tableViewConfigInfo.viewDesc = jQuery.trim(jQuery("#viewDesc").val());
		
		// 发送请求到后台，根据归属数据库dbId获取由该数据库源配置的数据实体
		queryTable("all");
	}
	
	function queryTable(type) {
		// 请求参数
		var dataParams = {};
		dataParams.dbId = tableViewConfigInfo.dbId;
		if("filter" == type){
			// 获取数据表存储类型
			var tableType = jQuery("#tableType").val();
			if(!sabace.IsEmpty(tableType)){
				dataParams.tableType = tableType;
			}
		}
		// 发送请求到后台
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/tableview/get-connect-table"),
			data: dataParams,
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: "正在查询工作表，请稍后....."
			},
			success: function(req) {
				// 查询出工作表集合
				getConnectTableSuccess(req.tableList,type);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || "查询数据表异常！"
				});
			}
		});
	}
	
	// 获取直连数据库工作表成功,在“选择业务数据表”中展示所有配置的工作表
	function getConnectTableSuccess(tableList,type) {
		if("all" == type){
			// 横线高亮设置
			setStepLine(2);
			// tab按钮样式切换
			jQuery('#oneStep').addClass("active-Finished");
			if (jQuery('#twoStep').hasClass("active-Finished")) {
				jQuery('#twoStep').removeClass("active-Finished");
			}
			jQuery('#twoStep').removeClass("active-notFinished");
			// 面板内容切换
			jQuery('#viewInfo').addClass("hide");
			jQuery('#tableInfo').removeClass("hide");
		}
		// 如果为新增,并且是从上一步过来的需要具体情况具体分析
		if("add" == opType && "all" == type){
			// 判断全局的 dbId和tableViewConfigInfo里面的dbId是否一致
			// 如果相等说明没有改变数据库源，否则改变了数据源，改变了数据源之后需要从头开始配置
			if(changeFlag){
				// 数据源做了改变
				// 重新开始走流程
				jQuery('#tableInfo .table-selected').empty();
				allTableArr = [];
				// 第三步和第四步需要重新走
				if (jQuery('#thirdStep').hasClass("active-Finished")) {
					jQuery('#thirdStep').removeClass("active-Finished");
				}
				if (!jQuery('#thirdStep').hasClass("active-notFinished")) {
					jQuery('#thirdStep').addClass("active-notFinished");
				}
				joinFieldArr = [];
				if (jQuery('#fourStep').hasClass("active-Finished")) {
					jQuery('#fourStep').removeClass("active-Finished");
				}
				if (!jQuery('#fourStep').hasClass("active-notFinished")) {
					jQuery('#fourStep').addClass("active-notFinished");
				}
				viewFieldArr = [];
			}
		}
		// 根据tableList展示数据表列表
		initTableList(tableList);
	}
	
	// 展示initTableList数据列表
	function initTableList(tableList) {
		var length = tableList.length;
		var html = "";
		var tableObj = null;
		var dataName = null;
		var dataId = null;
		var tableItemHtml = "";
		var flag = false;
		var allObj = null;
		if(length > 0) {
			for(var i = 0; i < length; i++){
				flag = false;
				tableObj = tableList[i];
				dataId = tableObj.dataId;
				// 判断当前dataId是否已经存在在展示框中，如果已经存在则需要将其设置为已选择
				for(var j = 0; j < allTableArr.length; j++) {
					allObj = allTableArr[j];
					if(dataId == allObj.dataId) {
						flag = true;
						break;
					}
				}
				dataName = tableObj.dataName;
				if(flag){
					tableItemHtml += "<div class='table-item items-checked divDispaly' id='" + dataId + "' title='" + dataName + "'>";
					tableItemHtml += "  <i class='fa fa-check-circle-o item-check'></i>";
				}else{
					tableItemHtml += "<div class='table-item items-not-checked divDispaly' id='" + dataId + "' title='" + dataName + "'>";
					tableItemHtml += "  <i class='fa fa-check-circle-o item-check hide'></i>";
				}
				tableItemHtml += "	<div class='table-items-name'>";
				tableItemHtml += "		<span class='f14'>" + dataName + "</span>";
				tableItemHtml += "	</div>"
				tableItemHtml += "</div>";
			}
			html += tableItemHtml;
		}
		jQuery('#tableBlock').empty().append(html);
	}
	
	// 数据库表选中事件
	function selectTable() {
		var dataId = jQuery(this).attr("id");
		var dataName = jQuery(this).attr("title");
		// 判断选中的工作表是否选中
		// 说明是未选中状态，需要显示成选中状态
		if(jQuery(this).hasClass("items-not-checked")){
			jQuery(this).removeClass("items-not-checked");
			jQuery(this).addClass("items-checked");
			jQuery(this).find(".item-check").removeClass("hide");
			// 设置数据表总展示
			setAllTable(dataId, dataName, "add");
		}
		else if(jQuery(this).hasClass("items-checked")){ // 说明是选中状态，需要显示成未选中状态
			jQuery(this).removeClass("items-checked");
			jQuery(this).addClass("items-not-checked");
			jQuery(this).find(".item-check").addClass("hide");
			// 设置数据表总展示    
			setAllTable(dataId, dataName, "delete");
		}
	}
	
	// 已选择数据表的总展示
	function setAllTable(dataId, dataName, type) {
		// 新增
		var tableObj = {};
		if("add" == type){
			tableObj.dataId = dataId;
			tableObj.dataName = dataName;
			allTableArr.push(tableObj);
			// 新增已选择的，修改页面展示样式
			updateAllTable(dataId, dataName, type);
		} else { // 去除
			// 遍历allTableArr数组
			for(var i = 0; i < allTableArr.length; i++) {
				tableObj = allTableArr[i];
				if(dataId == tableObj.dataId) {
					allTableArr = allTableArr.del(i);
					// 去除对应已选择的，修改页面展示样式
					updateAllTable(dataId, dataName, type);
					break;
				}
			}
		} 
	}
	
	// 总展示时删除事件
	function selectedClose() {
		var dataId = jQuery(this).parent().attr("id");
		setAllTable(dataId,"","delete");
		jQuery("#tableBlock").find("#" + dataId).removeClass("items-checked");
		jQuery("#tableBlock").find("#" + dataId).addClass("items-not-checked");
		jQuery("#tableBlock").find("#" + dataId).find(".item-check").addClass("hide");  
	}
	
	// 更新数据表总展示的样式
	function updateAllTable(dataId, dataName, type) {
		// 新增
		if("add" == type) {
			var html = '';
			html += '<div class="table-all-div divDispaly" id="' + dataId +'" title="' + dataName + '">';
			html += 	'<div class="table-all-name">';
			html += 	'	<span class="f14">' + dataName + '</span>';
			html += 	'</div>';
			html += 	'<i class="fa fa-close f12 table-select-close" id="selectedClose" title="删除"></i>';
			html += '</div>';
			jQuery('#tableInfo .table-selected').append(html);
		} else { //去除
			jQuery('#tableInfo .table-selected').find("#" + dataId).remove();
		}
	}
	
	// 选择业务数据表的"取消"
	function tableCancel() {
		//横线高亮设置
		setStepLine(1);
		//面板内容切换
		jQuery('#tableInfo').addClass("hide");
		jQuery('#viewInfo').removeClass("hide");
	}
	
	// 选择业务数据表的"下一步"
	function tableSave() {
		// 判断是否选择了数据库表
		if(allTableArr.length < 2){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: "请选择至少2张业务数据表!"
			});
			return;
		}
		// 判断选择的数据表中是否存在关联关系
		getLinkField();
	}
	
	// 判断选择的数据表中是否存在关联关系
	function getLinkField() {
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/tableview/get-link-field"),
			data: {
				dataArrJson: JSON.stringify(allTableArr),
				opType: opType,
				joinArrJson: JSON.stringify(joinFieldArr)
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 关联field字段信息返回成功后的处理
					joinAttrArr = req.attrList;
					getLinkFieldSuccess();
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: "您当前选择的业务数据表之间不存在关联关系，请重新选择业务数据表!"
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || "业务数据表之间关联关系查询异常!"
				});
			}
		})
	}
	
	// 关联field字段信息返回成功后的处理
	function getLinkFieldSuccess() {
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
		jQuery('#tableInfo').addClass("hide");
		jQuery('#linkInfo').removeClass("hide");
		// 初始化关联字段Grid
		initLinkFieldGrid();
	}
	
	// 初始化关联字段Grid
	function initLinkFieldGrid() {
		if (!jQuery('#linkGrid').is(':empty')) {
			jQuery.jgrid.gridUnload('linkGrid');
		}
		jQuery('#linkGrid').jqGrid({
			datatype: "local",
			styleUI: 'Bootstrap',
			data: joinAttrArr,
			regional: 'cn',
			autowidth: true,
			height: 'auto',
			rowNum: 100000,
			rownumbers: true,
			colModel: [{
				label: '字段Id',
				name: 'attrId',
				align: 'left',
				hlign: 'center',
				sortable: false,
				hidden: true
			},{
				label: '关联字段',
				name: 'fieldName',
				align: 'center',
				hlign: 'center',
				sortable: false
			},{
				label: '关联字段中文名称',
				name: 'attrName',
				align: 'left',
				hlign: 'center',
				sortable: false
			}, {
				label: '是否选择(<i class="fa fa-square-o check-box" id="allCheck"></i>)',
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
				var allCheckObject = jQuery(this).parents().find(".link-info-grid th #allCheck");
				// 单选checkbox
				var checkObject = jQuery(this).parents().find(".link-info-grid td #usedCheck");
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
			}
		});
		
		resizeLinkFieldGrid();
		$(window).resize(function() {
			resizeLinkFieldGrid();
		});
	}
	
	// 设置业务数据表关系的"取消"
	function linkCancel() {
		//横线高亮设置
		setStepLine(2);
		//面板内容切换
		jQuery('#linkInfo').addClass("hide");
		jQuery('#tableInfo').removeClass("hide");
	}
	
	// 设置业务数据表关系的"下一步"
	function linkSave() {
		joinFieldArr = [];
		var usedVlaue = null;
		var rowData = null;
		var attrObj = null;
		for (var i = 1; i <= joinAttrArr.length; i++) {
			rowData = jQuery('#linkGrid').jqGrid('getRowData', i);
			usedVlaue = jQuery(".link-info-grid #linkGrid #" + i + " .fa").attr("value");
			if("1" == usedVlaue){
				attrObj = {};
				attrObj.fieldName = rowData.fieldName;
				joinFieldArr.push(attrObj);
			}
		}
		// 判断是否配置关联条件
		if(joinFieldArr.length == 0) {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: "您还没有配置关联条件，请您至少选择一个关联字段作为关联条件!"
			});
			return;
		} else {
			// 获取展示字段
			getViewField();
		}
	}
	
	// 初始化展示字段
	function getViewField() {
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/tableview/get-view-field"),
			data: {
				dataArrJson: JSON.stringify(allTableArr),
				opType: opType,
				viewArrJson: JSON.stringify(viewFieldArr)
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 展示field字段信息返回成功后的处理
					viewAttrArr = req.attrList;
					getViewFieldSuccess();
				} else {
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('data.import.title.tips'),
						message: "您当前选择的业务数据表之间不存在关联关系，请重新选择业务数据表!"
					});
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || "业务数据表之间关联关系查询异常!"
				});
			}
		})
	}
	
	// 展示字段返回成功
	function getViewFieldSuccess() {
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
		jQuery('#linkInfo').addClass("hide");
		jQuery('#fieldInfo').removeClass("hide");
		// 初始化展示字段
		initViewFieldGrid();
	}
	
	// 初始化展示字段Grid
	function initViewFieldGrid() {
		if (!jQuery('#fieldGrid').is(':empty')) {
			jQuery.jgrid.gridUnload('fieldGrid');
		}
		jQuery('#fieldGrid').jqGrid({
			datatype: "local",
			styleUI: 'Bootstrap',
			data: viewAttrArr,
			regional: 'cn',
			autowidth: true,
			height: 'auto',
			rowNum: 100000,
			rownumbers: true,
			colModel: [{
				label: '工作表Id',
				name: 'dataId',
				align: 'left',
				hlign: 'center',
				sortable: false,
				hidden: true
			},{
				label: '字段Id',
				name: 'attrId',
				align: 'left',
				hlign: 'center',
				sortable: false,
				hidden: true
			},{
				label: '工作表中文名称',
				name: 'dataName',
				align: 'center',
				hlign: 'center',
				sortable: false
			},{
				label: '字段名称',
				name: 'fieldName',
				align: 'center',
				hlign: 'center',
				sortable: false
			},{
				label: '字段中文名称',
				name: 'attrName',
				align: 'left',
				hlign: 'center',
				sortable: false
			},{
				label: '是否展示(<i class="fa fa-square-o check-box" id="allCheck"></i>)',
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
			}
		});
		
		resizeViewFieldGrid();
		$(window).resize(function() {
			resizeViewFieldGrid();
		});
	}
	
	// 定义展现字段"确定"
	function fieldSave() {
		viewFieldArr = [];
		// 获取选择的展示字段信息
		var usedVlaue = null;
		var rowData = null;
		var attObj = null;
		for (var i = 1; i <= viewAttrArr.length; i++) {
			rowData = jQuery('#fieldGrid').jqGrid('getRowData', i);
			usedVlaue = jQuery(".field-info-grid #fieldGrid #" + i + " .fa").attr("value");
			if("1" == usedVlaue){
				attObj = {};
				attObj.dataId = rowData.dataId;
				attObj.attrId = rowData.attrId;
				viewFieldArr.push(attObj);
			}
		}
		// 判断是否选择展示字段
		if(viewFieldArr.length == 0) {
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: "您还没有配置展示字段，请您至少选择一个字段作为展示字段!"
			});
			return;
		} else {
			bi.dialog.confirm({
				title: "保存视图",
				message: "您确定保存该视图信息吗？",
				callback: function(result) {
					if (result) {
						// 保存视图配置信息
						saveViewInfo();
					}
				}
			});
		}
	}
	
	// 保存视图配置信息
	function saveViewInfo() {
		// 请求参数
		var dataParmas = {
			dbId: tableViewConfigInfo.dbId,
			viewName: tableViewConfigInfo.viewName,
			classifyId: tableViewConfigInfo.classifyId,
			viewDesc: tableViewConfigInfo.viewDesc,
			dataArrJson: JSON.stringify(allTableArr),
			joinArrJson: JSON.stringify(joinFieldArr),
			viewArrJson: JSON.stringify(viewFieldArr),
			opType: opType
		}
		if("edit" == opType){
			dataParmas.viewId = viewId;
		}
		
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/tableview/save-view-info"),
			data: dataParmas,
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.loading')
			},
			success: function(req) {
				if(req.resFlag == "success") {
					// 视图保存成功后的处理
					saveViewInfoSuccess();
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: req.responseText || "视图信息保存异常!"
				});
			}
		})
	}
	
	// 视图保存成功后的处理
	function saveViewInfoSuccess() {
		bi.dialog.show({
			type: bi.dialog.TYPE_INFO,
			title: sabace.getMessage('data.import.title.tips'),
			message: '视图配置成功!',
			closable: true,
			closeByBackdrop: false,
			closeByKeyboard: false,
			buttons: [{
				label: sabace.getMessage('data.import.label.sure'),
				cssClass: 'btn-info',
				action: function(dialog) {
					dialog.close();
					// 隐藏所有的按钮,用户可以tab页查看数据
					jQuery('#viewButton').addClass("hide");
					jQuery('.bottom-button-common').addClass("hide");
					jQuery('#fieldSaveButton').addClass("hide");
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
	
	// 设置预览数据表格的宽度
	function resizeLinkFieldGrid() {
		jQuery("#linkGrid").setGridWidth(jQuery(".link-info-grid").width() - 5);　　
		jQuery("#linkGrid").setGridHeight(jQuery(".link-info-grid").height() - 38);
	}
	
	// 设置预览数据表格的宽度
	function resizeViewFieldGrid() {
		jQuery("#fieldGrid").setGridWidth(jQuery(".field-info-grid").width() - 5);　　
		jQuery("#fieldGrid").setGridHeight(jQuery(".field-info-grid").height() - 38);
	}
	
	//tab点击选择
	function selectShow() {
		var object = jQuery(this).find(".step-title-num");
		var objId = jQuery(this).attr("id");
		//判断当前是都是已经完成的Tab
		if (object.hasClass("active-Finished") || !object.hasClass("active-notFinished")) {
			if (objId == "viewTab") {
				//横线高亮设置
				setStepLine(1);
				//当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#viewInfo').removeClass("hide");
			} else if (objId == "tableTab") {
				//横线高亮设置
				setStepLine(2);
				//当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#tableInfo').removeClass("hide");
			} else if (objId == "linkTab") {
				//横线高亮设置
				setStepLine(3);
				//当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#linkInfo').removeClass("hide");
				if (jQuery('#linkGrid').is(':empty')) {
					initLinkFieldGrid();
				} else {
					resizeLinkFieldGrid();
				}
			} else if (objId == "fieldTab") {
				//横线高亮设置
				setStepLine(4);
				//当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#fieldInfo').removeClass("hide");
				if (jQuery('#fieldGrid').is(':empty')) {
					initViewFieldGrid();
				} else {
					resizeViewFieldGrid();
				}
			}
		}
	}

	//获取当前显示面板
	function getCurrentDisplayDiv() {
		if (jQuery(".view-info").is(":visible")) {
			return "viewInfo";
		}
		if (jQuery(".table-info").is(":visible")) {
			return "tableInfo";
		}
		if (jQuery(".link-info").is(":visible")) {
			return "linkInfo";
		}
		if (jQuery(".field-info").is(":visible")) {
			return "fieldInfo";
		}
	}
});