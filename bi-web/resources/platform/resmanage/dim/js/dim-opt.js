define(['sabace', 'handsontable', 'dimOpt/message'], function(sabace, handsontable, message) {

	var isChecked; // 单选框是否已被选择
	var createType = 1; // 创建方式
	var dataHot; // 维度设置表格
	var resultHot; // 维度结果表格
	var importType; // 数据导入类型
	var lastUpdateTime; // 导入数据更新时间
	var secStepValid; // “维度详情”页面校验
	var first = true; // 是否是首次加载
	var typeChanged = false; // 维度类型是否修改
	var dbId; //sql配置方式数据库编码

	jQuery(function() {
		jQuery('#firstStep-div .form-horizontal').validationEngine({
			validationEventTrigger: 'input propertychange paste keyup', //jQuery事件，直接写入就好（input propertychange）这个是鼠标按下完美解决方案
			promptPosition: 'bottomLeft',
			showOneMessage: true, //如果一个区域中，又多个不满足的表单元素，是否按照队列出发
			//maxErrorsPerField: 1,//如果一个元素上有多个验证规则，当触发时，是否显示队列中所有消息
			scroll: false,
		});
		
		
		jQuery('#projectId').chosen({
	                disable_search: true,
					width:'280px'
	            });





		//  绑定事件
		bindEvent();
		
		$('#dbId').chosen({
			disable_search: false
		});

		// 如果dimId不为空，获取维度信息加载到页面
		if (!sabace.IsEmpty(dimId)) {
			initDimInfo();
		}

        jQuery("#parentDimName").click();

	});

	/**
	 * 初始化维度信息（修改流程）
	 */
	function initDimInfo() {
		var paramData = {
			'dimId': dimId
		}

		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/dim/query-dim-info"),
			data: paramData,
			success: function(req) {
				initDimBasicInfo(req);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('dim.title.error'),
					message: sabace.getMessage('dim.message.query.dimInfo.error')
				});
			},
			loading: {
				spin: true
			}
		});
	}

	/**
	 * 初始化维度基本信息
	 */
	function initDimBasicInfo(req) {
		// 维度名称
		jQuery("#dimName").val(req.dimName);

		// 上级维度
		var $parentDimName = jQuery("#parentDimName");
		$parentDimName.attr("trueValue", req.parentDimId);
		$parentDimName.attr("value", req.parentDimName);

		// 创建方式
		createType = req.createType;
		if ("1" == createType) {
			// 文本编辑方式
			var $textEdit = jQuery("#textEdit");
			$textEdit.removeClass("fa-square-o");
			$textEdit.addClass("fa-check-square-o");

			var $dataImport = jQuery("#dataImport");
			$dataImport.removeClass("fa-check-square-o");
			$dataImport.addClass("fa-square-o");
		} else if ("2" == createType) {
			// 已有数据导入
			jQuery("#dataImport").removeClass("fa-square-o");
			jQuery("#dataImport").addClass("fa-check-square-o");
			jQuery("#textEdit").removeClass("fa-check-square-o");
			jQuery("#textEdit").addClass("fa-square-o");

			// 已有数据选择
			var $dataId = jQuery("#dataId");
			$dataId.attr("trueValue", req.dataId);
			$dataId.attr("value", req.dataName);
			$dataId.val(req.dataName);

			// 维度值
			var $dimCodeAttr = jQuery("#dimCodeAttr");
			$dimCodeAttr.attr("key", req.dimCodeAttr);
			$dimCodeAttr.attr("value", req.dimCodeName);
			$dimCodeAttr.val(req.dimCodeName);

			// 维度名称
			var $dimLabelAttr = jQuery("#dimLabelAttr");
			$dimLabelAttr.attr("key", req.dimLabelAttr);
			$dimLabelAttr.attr("value", req.dimLabelName);
			$dimLabelAttr.val(req.dimLabelName);

			// 上级维度值
			var $parentCodeAttr = jQuery("#parentCodeAttr");
			$parentCodeAttr.attr("key", req.parentCodeAttr);
			$parentCodeAttr.attr("value", req.parentCodeName);
			$parentCodeAttr.val(req.parentCodeName);
			
			// 排序字段
			var $dimOrderAttr = jQuery("#dimOrderAttr");
			$dimOrderAttr.attr("key", req.dimOrderAttr);
			$dimOrderAttr.attr("value", req.dimOrderName);
			$dimOrderAttr.val(req.dimOrderName);
		}else if ("3" == createType){
			// SQL配置
			jQuery("#configSql").removeClass("fa-square-o");
			jQuery("#configSql").addClass("fa-check-square-o");
			jQuery("#textEdit").removeClass("fa-check-square-o");
			jQuery("#textEdit").addClass("fa-square-o");
			
			// 已有数据选择
			var $dbId = jQuery("#dbId");
			$dbId.val(req.dbId);
			$dbId.trigger("chosen:updated");
			
			var $dimSql = jQuery("#dimSqlStr");
			$dimSql.val(req.dimSql);

			// 维度值
			var $dimCodeAttr = jQuery("#dimCodeAttrSql");
			$dimCodeAttr.val(req.dimCodeAttr);

			// 维度名称
			var $dimLabelAttr = jQuery("#dimLabelAttrSql");
			$dimLabelAttr.val(req.dimLabelAttr);

			// 上级维度值
			var $parentCodeAttr = jQuery("#parentCodeAttrSql");
			$parentCodeAttr.val(req.parentCodeAttr);
			
			// 排序字段
			var $dimOrderAttr = jQuery("#dimOrderAttrSql");
			$dimOrderAttr.val(req.dimOrderAttr);
		}

		// 维度描述
		jQuery("#dimDesc").val(req.dimDesc);
		
		//租户
		jQuery("#projectId").find("option[value='"+req.proId+"']").attr("selected",true);

        jQuery('#projectId').trigger("chosen:updated");
	}

	var paramDimObj;
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		// “创建方式”单选按钮点击事件
		var $checkBox = jQuery("#firstStep-div .checkBox");
		$checkBox.on("click", function() {
			isChecked = jQuery(this).hasClass("fa-square-o");
			if (isChecked) {
				$checkBox.removeClass("fa-check-square-o");
				$checkBox.addClass("fa-square-o");
				jQuery(this).removeClass("fa-square-o");
				jQuery(this).addClass("fa-check-square-o");
			}
		});

		// 单选按钮文字同样可以点击
		jQuery("#firstStep-div .radio-label").on("click", function() {
			jQuery(this).prev().click();
		});

		// 加载“上级维度”的维度树
		var $parentDimName = jQuery("#parentDimName");

		$parentDimName.treeselect({
			height: 200,
			chkStyle: "radio",
			searchAjaxParam: "dimName",
			width: ($parentDimName.width() + 21),
			url: sabace.handleUrlParam('/platform/resmanage/dim/upper-dim-tree')+'?proId='+jQuery.trim(jQuery('#projectId').find("option:selected").val())
		});

		// 维度基本信息页面“下一步”
		jQuery("#first-next").on("click", function() {

			// 维度基本信息页面的检验
			var isPass = $('#firstStep-div .form-horizontal').validationEngine('validate');

			if (!isPass) {
				return;
			}

			// 判断是否修改过创建方式
			var $checkedBox = jQuery("#firstStep-div .fa-check-square-o")
			if (createType != $checkedBox.attr("value")) {
				typeChanged = true;
			} else {
				typeChanged = false;
			}

			// 获取创建方式
			createType = $checkedBox.attr("value");

			// 展示“设置维度详情”步骤
			initSecondStep();
		})

		//		// 设置头点击事件
		//		jQuery("#firstTab").on("click", function() {
		//			changTitleStyle(1);
		//		})
		//
		//		jQuery("#secondTab").on("click", function() {
		//			changTitleStyle(2);
		//		})
		//
		//		jQuery("#saveTab").on("click", function() {
		//			changTitleStyle(3);
		//		})

        jQuery('#projectId').on('change', function(evt, params) {
            // 加载“上级维度”的维度树
            var $parentDimName = jQuery("#parentDimName");

            var defaults = $parentDimName.data("defaults");
            if(defaults && defaults.url)
			{
                $parentDimName.val("");
                $parentDimName.attr("trueValue", "");
                $parentDimName.attr("value", "");

                defaults.url=sabace.handleUrlParam('/platform/resmanage/dim/upper-dim-tree')+'?proId='+jQuery.trim(jQuery('#projectId').find("option:selected").val());

                $parentDimName.treeselectUpdate();
			}


        });

		// 设置横线样式
		setStepLine(1);
	}

	/**
	 * 清空输入数据表格
	 */
	function emptyDataHot() {
		dataHot.clear();

		// 重新加载表格头
		var settings = {
			colHeaders: [sabace.getMessage('dim.label.dimCode'), sabace.getMessage('dim.label.dimLabel'), sabace.getMessage('dim.label.parentCode')],
			colWidths: 240
		}

		dataHot.updateSettings(settings);

		// 删除初始化的多余列
		if (dataHot.countCols() > 3) {
			dataHot.alter("remove_col", 3, dataHot.countCols() - 3);
		}

		if (dataHot.countCols() < 3) {
			dataHot.alter("insert_col", 3, 3 - dataHot.countCols());
		}

		// 删除初始化多余的行
		if (dataHot.countRows() > 5) {
			dataHot.alter("remove_row", 5, dataHot.countRows() - 5);
		}

		// 渲染表格
		dataHot.render();
	}

	/**
	 * 设置维度详情步骤
	 */
	function initSecondStep() {
		// 展示第二页DIV
		showSecondStep();

		// 表格只加载第一次
		if (first) {
			// 初始化数据表格
			initHandsomeTable();

			// 修改流程,且没有修改过导入状态需要加载数据
			if (!sabace.IsEmpty(dimId) && !typeChanged) {
				// “数据导入方式”获取维度信息加载到页面
				if ("2" == createType) {
					if (!sabace.IsEmpty(jQuery("#dataId").attr("trueValue"))) {
						getTableData();
					}
				}else if ("3" == createType) {
					// 设置已选择数据库
//					var $dbId = jQuery("#dbId");
//					$dbId.val(dbId);
//					$dbId.trigger("chosen:updated");
				} else {
					var paramData = {
						'dimId': dimId
					}

					sabace.ajax({
						url: sabace.handleUrlParam("/platform/resmanage/dim/dim-edit-data"),
						data: paramData,
						success: function(req) {
							dataHot.loadData(req.dataList);
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('dim.title.error'),
								message: sabace.getMessage('dim.message.query.dimData.error')
							});
						}
					});
				}
			}

			first = false;
		}

		// 维度类型发生变化
		if (typeChanged) {
			// 清空表格数据
			emptyDataHot();

			// 导入数据源信息清空
			var $dataId = jQuery("#dataId");
			$dataId.attr("trueValue", "");
			$dataId.attr("value", "");
			
			// 清空维度详情表单
			cleanDimInfo();
		}

		// 加载校验信息
		initSecStepValid();

		// 设置维度信息页面点击“上一步”
		jQuery("#second-before").on("click", function() {
			showFirstStep();
		})

		// 设置维度信息页面点击“下一步”
		jQuery("#second-next").on("click", function() {

			// 维度基本信息页面的检验
			var isPass = $('#secondStep-div .form-horizontal').validationEngine('validate');

			if (!isPass) {
				return;
			}

			initSaveStep();
		})
	}

	/**
	 * 初始化“维度详情”必填项
	 */
	function initSecStepValid() {
		if (sabace.IsEmpty(secStepValid)) {
			secStepValid = jQuery('#secondStep-div .form-horizontal').validationEngine({
				validationEventTrigger: 'input propertychange paste keyup', //jQuery事件，直接写入就好（input propertychange）这个是鼠标按下完美解决方案
				promptPosition: 'bottomLeft',
				showOneMessage: true, //如果一个区域中，又多个不满足的表单元素，是否按照队列出发
				//				maxErrorsPerField: 1,//如果一个元素上有多个验证规则，当触发时，是否显示队列中所有消息
				scroll: false
			});
		}
	}

	/**
	 * 加载“已有数据选择”的维度树
	 */
	function initDataImportTree() {
		var $dataId = jQuery("#dataId");

		$dataId.treeselect({
			height: 200,
			chkStyle: "radio",
			searchAjaxParam: "dataName",
			width: ($dataId.width() + 21),
			zindex: 1030,
			url: sabace.handleUrlParam('/platform/resmanage/dim/import-data-tree'),
			onCheck: function() {

				// 设置dataType和lastUpdateTime值
				var zTree = $.fn.zTree.getZTreeObj(this.id);
				var nodes = zTree.getCheckedNodes(true);
				importType = jQuery(nodes[0]).attr("pId");
				lastUpdateTime = jQuery(nodes[0]).attr("lastUpdateTime");

				// 清空维度详情表单
				cleanDimInfo();

				if (!sabace.IsEmpty($dataId.attr("trueValue"))) {
					// 获取表格数据
					getTableData();
				}
			}
		});
	}

	/**
	 * 保存步骤
	 */
	function initSaveStep() {
		checkDimDate();
	}
	
	/**
	 * 加载保存页面DIV信息
	 */
	function initSaveStepDiv()
	{
		// 展示保存页面DIV
		showSaveStep();

		// 加载前页的内容
		jQuery("#showDimName").text(jQuery("#dimName").val());
		jQuery("#showParentDim").text(jQuery("#parentDimName").val());
		jQuery("#showCreateType").text(jQuery(".fa-check-square-o").next().text());
		
		// 截取字符串，并增加title
		var dimDesc = jQuery("#dimDesc").val();
		jQuery("#showDimDesc").text(sabace.cutstr(dimDesc,130));
		jQuery("#showDimDesc").prop("title",dimDesc);
		
		// 根据创建类型展示不同的结果
		if ("2" == createType) {
			getDataDimResult();
		}else if ("3" == createType) {
			getSqlDimResult();
		} else {
			getInputDimResult();
		}
		
		// “保存页面” 上一步
		jQuery("#save-before").on("click", function() {
			showSecondStep();
		})

		// 保存维度
		jQuery("#save-add").on("click", function() {
			saveDimInfo();
		})
	}

	/**
	 * 初始化数据表格
	 */
	function initHandsomeTable() {
		if (sabace.IsEmpty(dataHot)) {
			var container = document.getElementById('dimData');
			dataHot = new Handsontable(container, {
				minSpareRows: 1,
				rowHeaders: true,
				colHeaders: [sabace.getMessage('dim.label.dimCode'), sabace.getMessage('dim.label.dimLabel'), sabace.getMessage('dim.label.parentCode')],
				colWidths: 240,
				contextMenuCopyPaste: {
					swfPath: 'swf/ZeroClipboard.swf'
				}
			});

			// 删除初始化的多余列
			dataHot.alter("remove_col", 3, 2);

			// 渲染表格
			dataHot.render();
		}

	}

	/**
	 * 清空维度详情表单
	 */
	function cleanDimInfo() {
		// 维度值
		var $dimCodeAttr = jQuery("#dimCodeAttr");
		$dimCodeAttr.attr("key", "");
		$dimCodeAttr.attr("value", "");

		// 维度名称
		var $dimLabelAttr = jQuery("#dimLabelAttr");
		$dimLabelAttr.attr("key", "");
		$dimLabelAttr.attr("value", "");

		// 上级维度值
		var $parentCodeAttr = jQuery("#parentCodeAttr");
		$parentCodeAttr.attr("key", "");
		$parentCodeAttr.attr("value", "");

		// 排序字段
		var $dimOrderAttr = jQuery("#dimOrderAttr");
		$dimOrderAttr.attr("key", "");
		$dimOrderAttr.attr("value", "");
	}

	/**
	 * 获取表格数据
	 */
	function getTableData() {
		var paramData = {
			"dataId": jQuery("#dataId").attr("trueValue")
		}

		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/dim/dim-import-data"),
			data: paramData,
			loading: {
				title: sabace.getMessage('dim.title.tips'),
				text: sabace.getMessage('dim.message.loading')
			},
			success: function(req) {
				reLoadData(req);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('dim.title.error'),
					message: sabace.getMessage('dim.message.query.data.error')
				});
			}
		});
	}

	/**
	 * 重新加载表格
	 */
	function reLoadData(req) {
		// 重新加载数据
		dataHot.loadData(req.dataList);

		// 重新加载表格头
		var settings = {
			colHeaders: req.titleList,
			colWidths: req.titleLength
		}

		// 删除多余列
		var colNum = req.titleList.length;
		if (colNum < 3) {
			dataHot.alter("remove_col", colNum, 3 - colNum);
		}

		dataHot.updateSettings(settings);

		// 渲染表格
		dataHot.render();

		// 绑定表格头事件
		buildTableOpt();
	}

	/**
	 * 初始化字段头的浮动DIV
	 */
	function buildTableOpt() {
		var $optMenu = jQuery("#secondStep-div .opt-menu");
		jQuery(".data-head").poshytip({
			className: 'tip-yellowsimple',
			content: $optMenu.outerHTML(),
			showTimeout: 3,
			alignY: 'bottom',
			liveEvents: true,
			show: function() {
				$optMenu.parent().attr("key", jQuery(this).attr("key"));
				$optMenu.parent().attr("value", jQuery(this).attr("value"));
				bindOptMenuClick();
			},
			keepInViewport: false
		});
	}

	/**
	 * 绑定浮动框的点击事件
	 */
	function bindOptMenuClick() {
		var $optMenu = jQuery("#secondStep-div .opt-menu");
		var attrValue = $optMenu.parent().attr("key");
		var attrName = $optMenu.parent().attr("value");
		jQuery(".opt-menu").on("click", ".opt-dimId", function() {
			var $dimCodeAttr = jQuery("#dimCodeAttr");
			$dimCodeAttr.attr("key", attrValue);
			$dimCodeAttr.attr("value", attrName);
			$dimCodeAttr.val(attrName);
		})

		jQuery(".opt-menu").on("click", ".opt-dimName", function() {
			var $dimLabelAttr = jQuery("#dimLabelAttr");
			$dimLabelAttr.attr("key", attrValue);
			$dimLabelAttr.attr("value", attrName);
			$dimLabelAttr.val(attrName);
		})

		jQuery(".opt-menu").on("click", ".opt-parentId", function() {
			var $parentCodeAttr = jQuery("#parentCodeAttr");
			$parentCodeAttr.attr("key", attrValue);
			$parentCodeAttr.attr("value", attrName);
			$parentCodeAttr.val(attrName);
		})

		jQuery(".opt-menu").on("click", ".opt-orderId", function() {
			var $dimOrderAttr = jQuery("#dimOrderAttr");
			$dimOrderAttr.attr("key", attrValue);
			$dimOrderAttr.attr("value", attrName);
			$dimOrderAttr.val(attrName);
		})
	}

	/**
	 * 获取数据导入方式维度结果
	 */
	function getDataDimResult() {
		var paramData = {
			"dataId": jQuery("#dataId").attr("trueValue"),
			"dimId": jQuery("#dimCodeAttr").attr("key"),
			"dimName": jQuery("#dimLabelAttr").attr("key"),
			"parentCodeAttr": jQuery("#parentCodeAttr").attr("key"),
			"dimOrderAttr": jQuery("#dimOrderAttr").attr("key")
		}
		
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/dim/get-import-result"),
			data: paramData,
			loading: {
				title: sabace.getMessage('dim.title.tips'),
				text: sabace.getMessage('dim.message.loading')
			},
			success: function(req) {
				loadResultData(req.dataList, req.dataList.length);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('dim.title.error'),
					message: sabace.getMessage('dim.message.query.result.error')
				});
			}                   
		});
	}
	
	/**
	 * 获取数据直连sql配置方式维度结果
	 */
	function getSqlDimResult() {
		var paramData = {
			"dbId": jQuery("#dbId").val(),
			"dimSql": jQuery("#dimSqlStr").val(),
			"dimId": jQuery("#dimCodeAttrSql").val(),
			"dimName": jQuery("#dimLabelAttrSql").val(),
			"parentCodeAttr": jQuery("#parentCodeAttrSql").val(),
			"dimOrderAttr": jQuery("#dimOrderAttrSql").val()
		}
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/dim/get-sql-result"),
			data: paramData,
			loading: {
				title: sabace.getMessage('dim.title.tips'),
				text: sabace.getMessage('dim.message.loading')
			},
			success: function(req) {
				loadResultData(req.dataList, req.dataList.length);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('dim.title.error'),
					message: sabace.getMessage('dim.message.query.result.error')
				});
			}
		});
	}
	
	/**
	 * 校验维度数据
	 */
	function checkDimDate()
	{
		var paramData = {
			"createType": createType,
			"dataId": jQuery("#dataId").attr("trueValue"),
			"dimId": jQuery("#dimCodeAttr").attr("key"),
			"dimName": jQuery("#dimLabelAttr").attr("key"),
			"dataList": JSON.stringify(dataHot.getData())	
		}
		if("3" == createType){
			paramData.dimId = jQuery("#dimCodeAttrSql").val();
			paramData.dimName = jQuery("#dimLabelAttrSql").val();
			paramData.dbId = jQuery("#dbId").val();
			paramData.dimSql = jQuery("#dimSqlStr").val();
		}
		
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/dim/check-dim-data"),
			data: paramData,
			loading: {
				title: sabace.getMessage('dim.title.tips'),
				text: sabace.getMessage('dim.message.loading')
			},
			success: function(req) {
				var result = req.result;
				if ("valid" == result)
				{
					initSaveStepDiv();
				}
				else
				{
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: sabace.getMessage('dim.title.error'),
						message: req.msg
					});
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('dim.title.error'),
					message: sabace.getMessage('dim.message.check.error')
				});
			}
		});
	}
	
	/**
	 * 加载结果维度数据表信息
	 */
	function loadResultData(dataList, dataRows) {
		if (sabace.IsEmpty(resultHot)) {
			var container = document.getElementById('showData');
			resultHot = new Handsontable(container, {
				data: dataList,
				readOnly: true,
				minSpareRows: 1,
				rowHeaders: true,
				colHeaders: [sabace.getMessage('dim.label.dimCode'), sabace.getMessage('dim.label.dimLabel'), sabace.getMessage('dim.label.parentCode')],
				colWidths: 240,
				contextMenuCopyPaste: {
					swfPath: 'swf/ZeroClipboard.swf'
				}
			});
		} else {
			resultHot.loadData(dataList);
		}

		// 渲染表格
		resultHot.render();

		// 数据个数
		jQuery("#showDimCount").text(dataRows);
	}

	/**
	 * 获取文本方式维度结果
	 */
	function getInputDimResult() {
		// 获取表格中非空的数据行数
		var dataRows = dataHot.countRows() - dataHot.countEmptyRows();
		loadResultData(dataHot.getData(), dataRows);
	}

	/**
	 * 横线高亮设置
	 */
	function setStepLine(step) {
		var width = jQuery(window).width() / 3;
		var lineWidth = width - 64;
		var marWidth = width * (step - 1) + 32;
		lineWidth = lineWidth.toString() + "px";
		marWidth = marWidth.toString() + "px";
		var stepLineObj = jQuery('#stepLine');
		stepLineObj.css("margin-left", marWidth);
		stepLineObj.css("width", lineWidth);
		stepLineObj.css("background-color", "#6BACD5");
	}


	/**
	 * 修改标题样式
	 */
	function changTitleStyle(num) {
		// 设置横线样式
		setStepLine(num);

		// 标题样式
		jQuery(".step-title-num").addClass("active-notFinished");
		jQuery(".step-title-num:lt(" + (num) + ")").removeClass("active-notFinished");
	}

	/**
	 * 展示第一页DIV
	 */
	function showFirstStep() {
		changTitleStyle(1);
		changeStepDiv("firstStep-div");
	}

	/**
	 * 展示第二页DIV
	 */
	function showSecondStep() {
		changTitleStyle(2);
		changeStepDiv("secondStep-div");

		if ("1" == createType) {
			jQuery("#dimInfoTable").removeClass("hide");
			jQuery("#dataDiv").addClass("hide");
			jQuery("#sqlDiv").addClass("hide");
			jQuery("#textDiv").removeClass("hide");
			jQuery("#dimData").css("height", "349px");
		} else if ("2" == createType){
			jQuery("#dimInfoTable").removeClass("hide");
			jQuery("#sqlDiv").addClass("hide");
			jQuery("#dataDiv").removeClass("hide");
			jQuery("#textDiv").addClass("hide");
			jQuery("#dimData").css("height", "257px");
			initDataImportTree();
		}else if ("3" == createType){
			jQuery("#dimInfoTable").addClass("hide");
			jQuery("#sqlDiv").removeClass("hide");
			jQuery("#dataDiv").addClass("hide");
			jQuery("#textDiv").addClass("hide");
		}

	}

	/**
	 * 展示保存页面DIV
	 */
	function showSaveStep() {
		changTitleStyle(3);
		changeStepDiv("saveStep-div");
	}

	/**
	 * 切换步骤样式变化
	 */
	function changeStepDiv(divId) {
		jQuery(".step-div").addClass("hide");
		jQuery("#" + divId).removeClass("hide");
	}

	/**
	 * 保存维度信息
	 */
	function saveDimInfo() {
		var paramData = {
			'dimId': dimId,
			'dimName': jQuery("#showDimName").text(),
			'parentDimId': jQuery("#parentDimName").attr("trueValue"),
			'dimRecordNum': jQuery("#showDimCount").text(),
			'createType': createType,
			'dataId': jQuery("#dataId").attr("trueValue"),
			'importType': importType,
			'lastUpdateTime': lastUpdateTime,
			'dimCodeAttr': jQuery("#dimCodeAttr").attr("key"),
			'dimLabelAttr': jQuery("#dimLabelAttr").attr("key"),
			'parentCodeAttr': jQuery("#parentCodeAttr").attr("key"),
			'dimOrderAttr': jQuery("#dimOrderAttr").attr("key"),
			'dimDesc': jQuery("#showDimDesc").text(),
			"tableData": JSON.stringify(resultHot.getData()),
			"proId":jQuery.trim(jQuery('#projectId').find("option:selected").val())
		}
		
		// Sql配置方式
		if(createType == "3"){
			
			paramData.dbId = jQuery("#dbId").val();
			paramData.dimSql = jQuery("#dimSqlStr").val();
			paramData.dimCodeAttr = jQuery("#dimCodeAttrSql").val();
			paramData.dimLabelAttr = jQuery("#dimLabelAttrSql").val();
			paramData.parentCodeAttr = jQuery("#parentCodeAttrSql").val();
			paramData.dimOrderAttr = jQuery("#dimOrderAttrSql").val();
		}

		bi.dialog.confirm({
			title: sabace.getMessage('dim.title.confirm'),
			message: sabace.getMessage('dim.message.opt.confirm'),
			callback: function(result) {
				if (result) {
					sabace.ajax({
						url: sabace.handleUrlParam("/platform/resmanage/dim/save-dim-info"),
						data: paramData,
						loading: {
							title: sabace.getMessage('dim.title.tips'),
							text: sabace.getMessage('dim.message.opt.doing')
						},
						success: function(req) {
							if ("succeed" == req.result) {
								bi.dialog.show({
									title: sabace.getMessage('dim.title.succeed'),
									message: sabace.getMessage('dim.message.opt.succeed'),
									onhidden: function() {
										window.close();
										opener.dimList.searchTable();
									}
								});
							} else {
								bi.dialog.show({
									type: bi.dialog.TYPE_DANGER,
									title: sabace.getMessage('dim.title.error'),
									message: sabace.getMessage('dim.message.opt.error')
								});
							}
						},
						error: function(req) {
							bi.dialog.show({
								type: bi.dialog.TYPE_DANGER,
								title: sabace.getMessage('dim.title.error'),
								message: sabace.getMessage('dim.message.opt.error')
							});
						}
					});
				}
			}
		});
	}
});