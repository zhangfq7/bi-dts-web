define(['sabace', 'radialIndicator', 'userSelect'], function(sabace, radialIndicator,userSelect) {
	
	// 业务类型条件数组
	var serviceConditionArr = [];
	// 数据来源条件数组
	var sourceConditionArr = [];
	// 更新周期条件数组
	var updateConditionArr = [];
	// 已选择条件数组
	var conditionTypeArr = [];
	// 开启多选模式数组
	var multiSelectArr = [];
	// 业务分类是否有更多
	var moreFlag = false;
	// 业务分类数组
	var classifyList = [];
	
	/**
	 * 0：等待调度 1：等待导入 2：正在导入 7：导入失败 9：导入成功
	 */
	var task_schedule = '0';
	var task_wait = '1';
	var task_run = '2';
	var task_failure = '7';
	var task_success = '9';
	/**
	 * 1:文件，2:数据库表，3:数据连接，4:openApi，5:数据库直连，6:DACP，7:视图
	 */
	var data_type_file = '1';
	var data_type_table = '2';
	var data_type_link = '3';
	var data_type_openapi = '4';
	var data_type_connect = '5';
	var data_type_dacp = '6';
	var data_type_view = '7';
	
	// 页码
	var pageNum = 1;
	// 每页20条
	var pageSize = 20;
	
	jQuery(function() {
		
		// 收起筛选相关事件处理
		initFilterHandle();
		// 升降排序点击事件处理
		initOrderHandle();
		// 添加数据源点击事件处理
		initSourceHandle();
		// 点击业务类型、数据来源、更新周期事件处理
		initItemsHandle();
		// 点击业务类型中点击更多事件处理
		initItemsMoreHandle();
		// 点击各种分类的多选事件处理
		initMultiSelectHandle();
		// 多选时“提交”事件处理
		initMultiSubmitHandle();
		// 多选时“取消”事件处理
		initMultiCancelHandle();
		// 点击搜索事件处理
		initSearchHandle();
		
		// 按钮提示
		initPoshytip();
		// 返回顶部事件
		initReturnToTop();
		
		// 初始化所有的数据工具栏
		initDataTools();
		
		// 获取所有的业务分类
		initClassifyHandle();
		// 初始化查询
		queryDataList(true);
	});
	
	// 实时刷新
	sabace.interval(function(){
		jQuery('.btn-list .tool-title-div').poshytip('hide');
		queryDataList(true);
	}, 1000 * 60);
	
	/**
	 * 收起筛选相关事件处理
	 */
	function initFilterHandle() {
		// 页面默认打开
		jQuery("#dataFilter").slideDown();
		
		// 点击收起筛选事件
		jQuery("#searchFilter").on("click", function(){
			// 切换内容
			jQuery("#dataFilter").slideToggle();
			
			// 切换收起图标
			if(jQuery("#filterIcon").hasClass('fa-angle-up')){
				jQuery("#filterText").text("显示筛选");
				jQuery("#filterIcon").removeClass('fa-angle-up');
				jQuery("#filterIcon").addClass('fa-angle-down');
			}else{
				jQuery("#filterText").text("收起筛选");
				jQuery("#filterIcon").removeClass('fa-angle-down');
				jQuery("#filterIcon").addClass('fa-angle-up');
			}
			
			resizeBody();
		});
	}
	
	/**
	 * 升降排序点击事件处理
	 */
	function initOrderHandle() {
		// 默认设置选中创建时间
		jQuery("#orderType [name='createTime']").addClass("data-item-border");
		// 点击收起筛选事件
		jQuery("#orderType span").on("click", function() {
			// 首先将所有的点亮样式remove
			jQuery("#orderType span").removeClass("data-item-border");
			jQuery(this).addClass("data-item-border");
			// 查询数据
			queryDataList(true);
		});
	}

	/**
	 * 添加数据源点击事件处理
	 */
	function initSourceHandle() {
		// 监控点击事件
		document.onmousedown = function(event) {
			var eventTarget = event.target;
			if (eventTarget == undefined || eventTarget.id != "addSource") {
				jQuery("#addSource").poshytip('hide');
				return;
			}
		}
		
		// 悬浮框点击显示
		jQuery("#addSource").on("click", function() {
			// 首先隐藏悬浮
			jQuery(this).poshytip('hide');
			// 初始化悬浮
			jQuery(this).poshytip({
				className: 'tip-yellowsimple data-source',
				content: jQuery("#sourceDialog").outerHTML(),
				showTimeout: 1,
				alignTo: 'target',
				alignX: 'bottom',
				alignY: 'bottom',
				showOn: 'none',
				offsetY: 5,
				keepInViewport: false
			});
			jQuery(this).poshytip('show');
			
			// 数据源图标鼠标悬浮事件
			jQuery(".tip-yellowsimple").on("mouseover mouseout","#sourceDialog div", function(event) {
				// 移进
				if(event.type == "mouseover"){
					// 将所有的全部置灰
					jQuery('.tip-yellowsimple #sourceDialog .data-show').each(function(){
						if(!jQuery(this).hasClass('hide')){
							jQuery(this).addClass('hide');
						}
					});
					jQuery('.tip-yellowsimple #sourceDialog .data-hide').each(function(){
						if(jQuery(this).hasClass('hide')){
							jQuery(this).removeClass('hide');
						}
					});
					jQuery(this).find('.data-hide').addClass('hide');
					jQuery(this).find('.data-show').removeClass('hide');
				} else { // 移出
					jQuery(this).find('.data-show').addClass('hide');
					jQuery(this).find('.data-hide').removeClass('hide');
				}
			});
            //导入前先查询用户使用空间
            var isSpaceFull = false;
            sabace.ajax({
                url: sabace.handleUrlParam("/platform/resmanage/data/query-used-space"),
                success: function(req) {
                    isSpaceFull = req.isSpaceFull;
                },
                error: function(req) {
                    bi.dialog.show({
                        type: bi.dialog.TYPE_DANGER,
                        title: "提示",
                        message:"查询用户空间异常！"
                    });
                }
            });

			
			// 文件点击事件
			jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-file", function() {
				if(isSpaceFull){
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
						title: "提示",
						message:"空间已满，禁止导入数据！"
					});
					return;
				}
				fileImport("add","");
			});
			
			// openApi点击事件
			jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-openapi", function() {
				var url = sabace.handleUrlParam("/platform/openapi/openapi-list-page");
				var params = {};
				//页面跳转
				redirecPage(url,params);
			});
			
			// 数据库点击事件
			jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-table", function() {
                if(isSpaceFull){
                    bi.dialog.show({
                        type: bi.dialog.TYPE_DANGER,
                        title: "提示",
                        message:"空间已满，禁止导入数据！"
                    });
                    return;
                }
				tableImport("");
			});

			// 直连点击事件
			jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-table-direct", function() {
				tableDirectImport("");
			});

			// dacp数据库点击事件
			jQuery(".tip-yellowsimple").on("click","#sourceDialog .data-dacp", function() {
				tableImportByDacp("");
			});
			
			// 视图点击事件 
			jQuery(".tip-yellowsimple").on("click","#sourceDialog .table-view", function() {
				tableView(""); 
			});
		});
	}
	
	
	/**
	 * 点击业务类型、数据来源、更新周期事件处理
	 */
	function initItemsHandle() {
		jQuery("#dataFilter").on("click",".data-service-type .condition-items, .data-source-type .condition-items,.data-update-type .condition-items", function() {
			var type = jQuery(this).parent().attr("name");
			var name = jQuery(this).find('span').html();
			var value = jQuery(this).attr("value");
			// 首先判断是否已经开启"多选"模式
			var multiIndex = jQuery.inArray(type, multiSelectArr);
			// 没有开启"多选"时为单选模式，开启多选模式时，点击无效
			if(multiIndex < 0) {
				// 每次点击时都遍历将所有的checkbox设置为未选择状态
				jQuery(this).parent().find('.data-select-check').each(function(){
					if(jQuery(this).find('i').hasClass('fa-check-square-o')){
						jQuery(this).find('i').removeClass("fa-check-square-o");
						jQuery(this).find('i').addClass("fa-square-o");
					}
				});
				// 判断展示条件中是否已经存在该类型
				var typeIndex = jQuery.inArray(type, conditionTypeArr);
				// 已存在再判断展示条件是否已存在
				if(typeIndex > -1){ // 已存在条件类型
					jQuery('#' + type + " .data-condition-content").html(name);
					var showName = jQuery('#' + type + " .data-condition-type").html();
					var showContent = jQuery('#' + type + " .data-condition-content").html();
					jQuery('#' + type).attr("title", showName + showContent);
				} else { // 不存在条件类型
					var html = getDataCondition(type,name,value);
					// 在“所有分类” 后面添加
					jQuery(".data-condition").append(html);
				}
				// 设置当前过滤值
				setSelectValue(type, value);
				queryDataList(true);
			} else {
				// 判断当前"提交"、"取消"是否是展示的，如是展示的说明多选还没提交，点击无效
				if(jQuery(this).parent().parent().find('.data-select-button').hasClass('hide')){
					jQuery('#' + type + " .data-condition-content").html(name);
				}
			}
		});
		
		// 绑定点击删除事件
		jQuery(".data-classify-all").on("click",".data-condition #closeIcon", function() {
			var showId = jQuery(this).parent().attr("id");
			// 从条件数组中移除
			for(var i = 0; i < conditionTypeArr.length; i++){
				if(showId == conditionTypeArr[i]){
					conditionTypeArr.splice(i, 1);
					break;
				}
			}
			// 清空对对用的存放条件数组
			if(showId == "dataService") {
				serviceConditionArr = [];
			} else if(showId == "dataSource") {
				sourceConditionArr = [];
			} else if(showId == "dataUpdate") {
				updateConditionArr = [];
			};
			jQuery(this).parent().remove();
			queryDataList(true);
		});
	}
	
	/**
	 * 获取条件div
	 */
	function getDataCondition(type,name,value) {
		var showName = null;
		if(type == "dataService") {
			showName = "业务类型：";
			if(value != null) { // 用于区分多选
				serviceConditionArr.push(value);
			}
		} else if(type == "dataSource") {
			showName = "数据来源类型：";
			if(value != null) {
				sourceConditionArr.push(value);
			}
		} else if(type == "dataUpdate") {
			showName = "更新周期：";
			if(value != null) {
				updateConditionArr.push(value);
			}
		};
		conditionTypeArr.push(type);
		var html = '';
		html += '<div id="' + type + '" class="condition-div" title="' + showName + name + '">';
		html += 	'<div class="data-show-name">';
		html += 	'	<span class="data-condition-type">' + showName + '</span>';
		html += 	'	<span class="data-condition-content">' + name + '</span>';
		html += 	'</div>';
		html += 	'<div id="closeIcon" class="fa fa-close f12"></div>';
		html += '</div>';
		return html;
	}
	
	/**
	 * 点击业务类型中点击更多事件处理
	 */
	function initItemsMoreHandle() {
		jQuery(".data-service-type .data-items-more").on("click", function(){
			queryClassifySuccess("more");
			if(jQuery("#moreIcon").hasClass('fa-caret-up')){
				// 收起时
				jQuery("#moreText").text("更多");
				jQuery("#moreIcon").removeClass('fa-caret-up');
				jQuery("#moreIcon").addClass('fa-caret-down');
				// 将有class为moreItems的全部隐藏
				jQuery(".data-service-type").css("height", "36px");
				jQuery(".data-service-type .moreItems").addClass("hide");
			}else{
				// 更多时
				jQuery("#moreText").text("收起");
				jQuery("#moreIcon").removeClass('fa-caret-down');
				jQuery("#moreIcon").addClass('fa-caret-up');
				// 将有class为moreItems的全部展示
				jQuery(".data-service-type").css("height", "auto");
				jQuery(".data-service-type .moreItems").removeClass("hide");
			}
		});
	}
	
	/**
	 * 点击各种分类的多选事件处理
	 */
	function initMultiSelectHandle() {
		// 多选按钮开启
		jQuery(".data-multi-select").on("click", function(){
			// 设置条件的margin-left
			jQuery(this).parent().find('.condition-items').css("margin-left","0px");
			var type = jQuery(this).attr("name");
			if(type == "data-service-type") {
				type = "dataService";
			} else if(type == "data-source-type") {
				type = "dataSource";
			} else if(type == "data-update-type") {
				type = "dataUpdate";
			};
			
			// 始终保证一个多选展现出checkbox,隐藏非当前选择的多选
			setOnlyMulti(type);
			
			// 如果是业务分类如果有更多，则需要隐藏更多
			if(type == "dataService" && moreFlag){
				jQuery(".data-service-type .moreItems").removeClass("hide");
				jQuery(".data-service-type .data-items-more").addClass("hide");
			}
			
			if(type != "dataService"){
				queryClassifySuccess("common");
			}
			
			// 判断是否已经存在，不存在则添加
			var selIndex = jQuery.inArray(type, multiSelectArr);
			if(selIndex < 0) {
				multiSelectArr.push(type);
			}
			jQuery(this).parent().find('.data-select-check').removeClass('hide');
			// 隐藏多选
			jQuery(this).parent().find('.data-multi-select').addClass('hide');
			// 展示确定、取消按钮
			jQuery(this).parent().addClass('data-height-auto');
			jQuery(this).parent().find('.data-select-button').removeClass('hide');
			
			// 获取已选择的条件，将已经生效的条件都选择上
			// 先将所有的都置为未选择状态
			jQuery(this).parent().parent().find('.data-select-check').each(function(){
				if(jQuery(this).find('i').hasClass('fa-check-square-o')){
					jQuery(this).find('i').removeClass("fa-check-square-o");
					jQuery(this).find('i').addClass("fa-square-o");
				}
			});
			
			var selectValueArr = [];
			if(type == "dataService") {
				selectValueArr = serviceConditionArr;
			} else if(type == "dataSource") {
				selectValueArr = sourceConditionArr;
			} else if(type == "dataUpdate") {
				selectValueArr = updateConditionArr;
			};
			
			for(var i=0; i < selectValueArr.length; i++) {
				jQuery(this).parent().find("[value=" + selectValueArr[i] + "]").find("i").removeClass("fa-square-o");
				jQuery(this).parent().find("[value=" + selectValueArr[i] + "]").find("i").addClass("fa-check-square-o");
			}
			
		});
		
		// 条件hover事件
		jQuery(".condition-items").hover(function() {
			jQuery(this).find('.data-select-check i').addClass('items-hover-show');
		}, function() {
			jQuery(this).find('.data-select-check i').removeClass('items-hover-show');
		});
		
		// 选中事件
		jQuery("#dataFilter").on("click",".data-service-type .condition-items, .data-source-type .condition-items,.data-update-type .condition-items", function() {
			var isChecked = jQuery(this).find('.data-select-check i').hasClass("fa-square-o");
			if (isChecked) {
				jQuery(this).find('.data-select-check i').removeClass("fa-square-o");
				jQuery(this).find('.data-select-check i').addClass("fa-check-square-o");
			} else {
				jQuery(this).find('.data-select-check i').removeClass("fa-check-square-o");
				jQuery(this).find('.data-select-check i').addClass("fa-square-o");
			}
		});
	}
	
	/**
	 * 始终保证一个多选展现出checkbox,隐藏非当前选择的多选
	 */
	function setOnlyMulti(type) {
		if(type == "dataService") { 
			if(jQuery.inArray("dataSource", multiSelectArr) > -1){
				jQuery(".data-source-type .data-multi-cancel").trigger("click");
			}
			if(jQuery.inArray("dataUpdate", multiSelectArr) > -1){
				jQuery(".data-update-type .data-multi-cancel").trigger("click");
			}
			
		}else if(type == "dataSource") {
			if(jQuery.inArray("dataService", multiSelectArr) > -1) {
				jQuery(".data-service-type .data-multi-cancel").trigger("click");
			}
			if(jQuery.inArray("dataUpdate", multiSelectArr) > -1) {
				jQuery(".data-update-type .data-multi-cancel").trigger("click");
			}
		}else if(type == "dataUpdate") {
			if(jQuery.inArray("dataService", multiSelectArr) > -1) {
				jQuery(".data-service-type .data-multi-cancel").trigger("click");
			}
			if(jQuery.inArray("dataSource", multiSelectArr) > -1) {
				jQuery(".data-source-type .data-multi-cancel").trigger("click");
			}
		}
	}
	
	/**
	 * 多选时“提交”事件处理
	 */
	function initMultiSubmitHandle() {
		jQuery(".data-multi-submit").on("click", function() {
			// 设置margin-left
			jQuery(this).parent().parent().find('.condition-items').css("margin-left", "30px");
			// 判断当前选择的类型是否已经在条件中,已存在的，直接替换，没有选在的替换
			var type = jQuery(this).parent().parent().find('.data-items').attr("name");
			if(type == "dataService") {
				serviceConditionArr = [];
			} else if(type == "dataSource") {
				sourceConditionArr = [];
			} else if(type == "dataUpdate") {
				updateConditionArr = [];
			};
			var contentArr = [];
			var content = null;
			var value = null;
			// 判断是有选中的
			var checkFlag = false;
			jQuery(this).parent().parent().find('.data-select-check').each(function(){
				if(jQuery(this).find('i').hasClass('fa-check-square-o')){
					checkFlag = true;
					content = jQuery(this).parent().find('span').html();
					contentArr.push(content);
					value = jQuery(this).parent().attr('value');
					if(type == "dataService") {
						serviceConditionArr.push(value);
					} else if(type == "dataSource") {
						sourceConditionArr.push(value);
					} else if(type == "dataUpdate") {
						updateConditionArr.push(value);
					};
				}
			});
			// 如果有选中的
			if(checkFlag){
				// 拼装展示条件
				var showContent = contentArr.join("、");
				// 判断展示条件中是否已经存在该类型
				var typeIndex = jQuery.inArray(type, conditionTypeArr);
				// 已存在该类型
				if(typeIndex > -1) {
					jQuery('#' + type + " .data-condition-content").html(showContent);
					var showName = jQuery('#' + type + " .data-condition-type").html();
					var showContent = jQuery('#' + type + " .data-condition-content").html();
					jQuery('#' + type).attr("title", showName + showContent);
				} else { // 不存在该类型
					var html = getDataCondition(type, showContent);
					// 在“所有分类” 后面添加
					jQuery(".data-condition").append(html);
				}
			} else { // 没有选择,去除上方该类型条件内容
				// 判断展示条件中是否已经存在该类型
				var typeIndex = jQuery.inArray(type, conditionTypeArr);
				// 已存在该类型
				if(typeIndex > -1) {
					jQuery('#' + type).remove();
				}
			}
			
			// 如果是业务分类如果有更多，则需要隐藏更多
			if(type == "dataService" && moreFlag){
				jQuery(".data-service-type .data-items-more").removeClass("hide");
				jQuery(".data-service-type .moreItems").addClass("hide");
			}
			
			if(type == "dataService"){
				queryClassifySuccess("common");
			}
			
			// 遍历当前所有的都置为未选择状态
			jQuery(this).parent().parent().find('.data-select-check').each(function(){
				if(jQuery(this).find('i').hasClass('fa-check-square-o')){
					jQuery(this).find('i').removeClass("fa-check-square-o");
					jQuery(this).find('i').addClass("fa-square-o");
				}
			});
			
			// 隐藏多选的checkbox
			jQuery(this).parent().parent().find('.data-select-check').addClass('hide');
			// 去除高度自适应
			jQuery(this).parent().parent().removeClass('data-height-auto');
			// 去除"提交"、"取消"
			jQuery(this).parent().parent().find('.data-select-button').addClass('hide');
			// 展现"多选"
			jQuery(this).parent().parent().find('.data-multi-select').removeClass('hide');
			
			// 移除已开启"多选"
			var multiId = jQuery(this).parent().parent().find('.data-items').attr("name");
			// 从条件数组中移除
			for(var i = 0; i < multiSelectArr.length; i++){
				if(multiId == multiSelectArr[i]){
					multiSelectArr.splice(i, 1);
					break;
				}
			}
			
			queryDataList(true);
		});
	}
	
	/**
	 * 多选时“取消”事件处理
	 */
	function initMultiCancelHandle() {
		jQuery(".data-multi-cancel").on("click", function() {
			// 设置margin-left
			jQuery(this).parent().parent().find('.condition-items').css("margin-left", "30px");
			var type = jQuery(this).parent().parent().find('.data-items').attr("name");
			// 如果是业务分类如果有更多，则需要隐藏更多
			if(type == "dataService" && moreFlag){
				jQuery(".data-service-type .data-items-more").removeClass("hide");
				jQuery(".data-service-type .moreItems").addClass("hide");
				
				// 如果展示的是更多已经打开显示为收起时
				if(jQuery("#moreIcon").hasClass('fa-caret-up')){
					jQuery("#moreText").text("更多");
					jQuery("#moreIcon").removeClass('fa-caret-up');
					jQuery("#moreIcon").addClass('fa-caret-down');
					// 将有class为moreItems的全部隐藏
					jQuery(".data-service-type").css("height", "36px");
				}
			}
			// 遍历当前所有的都置为未选择状态
			jQuery(this).parent().parent().find('.data-select-check').each(function(){
				if(jQuery(this).find('i').hasClass('fa-check-square-o')){
					jQuery(this).find('i').removeClass("fa-check-square-o");
					jQuery(this).find('i').addClass("fa-square-o");
				}
			});
			
			// 隐藏多选的checkbox
			jQuery(this).parent().parent().find('.data-select-check').addClass('hide');
			// 去除高度自适应
			jQuery(this).parent().parent().removeClass('data-height-auto');
			// 去除"提交"、"取消"
			jQuery(this).parent().parent().find('.data-select-button').addClass('hide');
			// 展现"多选"
			jQuery(this).parent().parent().find('.data-multi-select').removeClass('hide');
			
			if(type == "dataService"){
				queryClassifySuccess("common");
			}
			
			// 移除已开启"多选"
			var multiId = jQuery(this).parent().parent().find('.data-items').attr("name");
			// 从条件数组中移除
			for(var i = 0; i < multiSelectArr.length; i++){
				if(multiId == multiSelectArr[i]){
					multiSelectArr.splice(i, 1);
					break;
				}
			}
			
		});
	}
	
	/**
	 * 根据过滤类型清空数组中值，保存当前选中的值
	 */
	function setSelectValue(type, value) {
		// 当前为单选模式,首先都要清空数组
		if(type == "dataService") {
			serviceConditionArr = [];
			serviceConditionArr.push(value);
		} else if(type == "dataSource") {
			sourceConditionArr = [];
			sourceConditionArr.push(value);
		} else if(type == "dataUpdate") {
			updateConditionArr = [];
			updateConditionArr.push(value);
		};
	}
	
	/**
	 * 点击搜索事件处理
	 */
	function initSearchHandle() {
		jQuery("#dataSearch").on("click", function() {
			queryDataList(true);
		});
		jQuery('#dataName').keydown(function(e){
			if(e.keyCode==13){
				queryDataList(true);
			}
		});
	}
	
	/**
	 * 查询方法
	 */
	function queryDataList(pageFlag) {
		// 加载进度条
		initLoading();
		if(pageFlag){
			pageSize = 20;
			pageNum = 1
		}
		// 数据源名称
		var dataName = jQuery("#dataName").val();
		// 排序方式
		var orderType = jQuery("#orderType .data-item-border").attr("name");
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/query-data-list"),
			data: {
				pageNum: pageNum,
				pageSize: pageSize,
				dataName: dataName,
				serviceCondition: JSON.stringify(serviceConditionArr),
				sourceCondition: JSON.stringify(sourceConditionArr.sort()),
				updateCondition: JSON.stringify(updateConditionArr),
				orderType: orderType,
				"_t": (new Date()).getTime()
			},
			success: function(req) {
				if(req.resFlag == "success") {
					// 查询数据成功并且有数据
					queryDataSuccess(req.dataList.rows, req.dataList.total, req.companyFlag, pageFlag);
				}else {
					jQuery("#dataUl").html("");
					// 查询数据成功但是没有数据
					jQuery("#page").page('destroy');
					// 去除进度条
					jQuery("#dataListLoading").css("width", "99.5%").delay(200).fadeOut(400, function() {
						jQuery(this).remove();
					});
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: "提示",
					message: req.responseText || "查询数据表异常！"
				});
			}
		});
	}
	
	/**
	 * 加载进度条
	 */
	function initLoading() {
		jQuery("#dataListLoading").remove();
		jQuery('<div>', {
			"id": "dataListLoading",
			"class": "loadingbar waiting dataListLoading",
			"html": "<dt/><dd/>"
		}).appendTo(".data-list-loading");
		jQuery("#dataListLoading").width((50 + Math.random() * 30) + "%");
	}
	
	/**
	 * 数据查询成功
	 */
	function queryDataSuccess(dataList, dataTotal, companyFlag, pageFlag){
		// 初始化数据展示列表
		initDataDiv(dataList, companyFlag);
		// 初始化分页控件
		initPageTools(dataTotal, pageFlag);
		// 去除进度条
		jQuery("#dataListLoading").css("width", "99.5%").delay(200).fadeOut(400, function() {
			jQuery(this).remove();
		});
	}
	
	/**
	 * 初始化数据展示列表
	 */
	function initDataDiv(dataList, companyFlag){
		jQuery("#dataUl").html("");
		$('body,html').animate({
			scrollTop: 0
		}, 100);
		var data = null;
		var dataType = null;
		var dataId = null;
		var importState = null;
		var modType = null;
		var dataName = null;
		var share = null;
		var interfaceFlag = null;
		var dataLength = dataList.length;
		for(var i = 0;i < dataLength; i++){
			data = dataList[i];
			dataType = data.dataType;
			dataId = data.dataId;
			importState = data.importState;
			dataName = data.dataName;
			share = data.isShare;
			modType = data.modType;
			interfaceFlag = data.interfaceFlag;
			var html = '';
			html += '<li class="dataLi data-list-li" id="' + dataId + '">';
			//等待运行与正在运行
			if(task_run == importState){
				html += '<div class="indiv-nofloat">';
				html += '<div class="indicatorContainerWrap icon-mp">';
				html += ' <div id="indicatorContainer" class="indicatorContainer"></div>';
				if(data_type_link == dataType){
					html += '<div class="prgLogo table-contcat-working-icon"></div>';
				}else{
					html += '<div class="prgLogo data-importing-icon"></div>';
				}
				html += '</div>';
				html += '<div class="dataText">';
				html += '<div class="dataName">' + dataName + '</div>';
				html += '<div class="dataState">正在导入</div>';
				html += '</div></div></li>';
			}else{
				html += '<div class="indiv">';
				html += '<div class="indicatorContainerWrap icon-mp">';
				var dataState = "";
				if(task_success == importState || "A" == importState){
					dataState = "导入成功";
					if(data_type_file == dataType){
						html += '<div class="successPic data-file-icon"></div>';
					}else if(data_type_table == dataType){
						html += '<div class="successPic data-table-icon"></div>';
					}else if(data_type_openapi == dataType){
						html += '<div class="successPic data-openapi-icon"></div>';
					}else if(data_type_link == dataType){
						html += '<div class="successPic data-contcat-icon"></div>';
					}else if(data_type_connect == dataType){
						html += '<div class="successPic data-directtab-icon"></div>';
						dataState = '直连数据';
					}else if(data_type_view == dataType){
						html += '<div class="successPic data-table-view-icon"></div>';
						dataState = '视图';
					}
				}else if(task_wait == importState){
					dataState = "等待导入";
					html += '<div class="successPic data-waiting-icon"></div>';
				}else if(task_failure == importState){
					dataState = "导入失败";
					html += '<div class="successPic data-failure-icon"></div>';
				}else{
					dataState = "等待调度";
					html += '<div class="successPic data-dispatch-icon"></div>';
				}
				html += '</div>';
				html += '<div class="dataText">';
				html += '<div id="dataNameDiv" class="dataName">' + dataName + '</div>';
				html += '<div class="dataState">' + dataState + '</div>';
				html += '</div></div>';
				html += '<div class="list-container">';
				html += '<ul class="btn-list">';
				if(task_success == importState || "A" == importState){
					html += '<li class="viewData">';
					html += '<div tooltitle="查看" class="query-data-pic tool-title-div"></div>';
					html += '</li>';
					if('0' == share){
						if(data_type_openapi != dataType){
							html += '<li class="modData">';
							html += '<div tooltitle="修改" class="modify-data-pic tool-title-div"></div>';
							html += '</li>';
						}
						if(data_type_file == dataType){
							html += '<li class="appendData">';
							html += '<div tooltitle="追加" class="append-data-pic tool-title-div"></div>';
							html += '</li>';
						}
						if('1' == companyFlag){
							html += '<li class="rightData">';
							html += '<div tooltitle="赋权" class="right-data-pic tool-title-div"></div>';
							html += '</li>';
						}
					}
					if(data_type_table == dataType || data_type_link == dataType || data_type_openapi == dataType){
						if('0' == share){
							html += '<li class="reloadData">';
							html += '<div tooltitle="重生" class="reload-data-pic tool-title-div"></div>';
							html += '</li>';
						}
					}
					if(data_type_link != dataType && data_type_connect != dataType && data_type_view != dataType){
						html += '<li class="linkData">';
						html += '<div tooltitle="连接" class="linkdata-data-pic tool-title-div"></div>';
						html += '</li>';
					}
					html += '<li class="createReport">';
					html += '<div tooltitle="仪表板" class="report-data-pic tool-title-div"></div>';
					html += '</li>';
					if('0' == share){
						html += '<li class="delData">';
						html += '<div tooltitle="删除" class="delete-data-pic tool-title-div"></div>';
						html += '</li>';
					}
				}else if(task_failure == importState || task_wait == importState || task_schedule == importState){
					if('0' == share){
						if(data_type_openapi != dataType){
							if(modType == "3"){
								html += '<li class="appendData">';
								html += '<div tooltitle="追加" class="append-data-pic tool-title-div"></div>';
								html += '</li>';
							}else{
								html += '<li class="modData">';
								html += '<div tooltitle="修改" class="modify-data-pic tool-title-div"></div>';
								html += '</li>';
							}
						}
						html += '<li class="delData">';
						html += '<div tooltitle="删除" class="delete-data-pic tool-title-div"></div>';
						html += '</li>';
					}
				}
				html += '</ul></div><input type="hidden" id="dataType" value="' + dataType + '">';
				html += '<input type="hidden" id="interfaceFlag" value="' + interfaceFlag + '"></li>';
			}
			jQuery('#dataUl').append(html);
		}
		// 数据表标题点点点
		dotInit();
		//初始化进度条
		initRadial();
	}
	
	/**
	 * 初始化进度条
	 */
	function initRadial(){
		var radialObjArray = [];
		var radialObj = null;
		var indicatorArray = jQuery('.indicatorContainer');
		var numArr = [];
		var k  =0;
		for(var i = 0;i<indicatorArray.length;i++){
			radialObj = jQuery(indicatorArray[i]).radialIndicatorTemp({
		      	barColor: '#1baf80',
		        barWidth: 5,
		        initValue: 0,
		        radius:32
			});
			radialObjArray.push(radialObj);
			numArr.push(k);
		}
		setInterval(function () {
			for(var i = 0;i<radialObjArray.length;i++){
				radialObjArray[i].value(numArr[i]+=1);
			}
			for(var i = 0;i<numArr.length;i++){
				if(numArr[i]>100){
					numArr[i] = 0;
				}
			}
		}, 200);
	}
	
	
	/**
	 * 初始化按钮title
	 */
	function initPoshytip(){
		jQuery('.btn-list .tool-title-div').poshytip({
			className:'tip-yellowsimple',
			content:  function(){
				var  tipMsg = jQuery("<div>",{
					'class' : 'btn-tip-msg'
				})
				var tipName = jQuery("<div>",{
					'class' : 'btn-tip-name',
					'html'  :  jQuery(this).attr("tooltitle")
				})
				tipMsg.append(tipName);
				return tipMsg;
			},
			showTimeout: 0,
			hideTimeout:0,
			alignTo: 'target',
			alignX: 'center',
			alignY: 'top',
			offsetY: 10,
			offsetX:0,
			fade: false,
			slide: false,
			liveEvents:true,
			allowTipHover: false,
			keepInViewport:false
		});
	}
	
	/**
	 * 数据表标题点点点
	 */
	function dotInit(){
		jQuery(".dataText .dataName").dotdotdot({
			'line':'2'
		});
	}
	
	// 渲染分页
	function initPageTools(dataTotal,pageFlag){
		// 是否需要重新初始化分页控件
		if(pageFlag){
			jQuery("#page").page('destroy');
			//渲染分页控件
			jQuery("#page").page({
				total: dataTotal,
				pageSize: pageSize,
				showJump: true,
				firstBtnText: "首页",
				lastBtnText: "尾页",
				jumpBtnText: "跳转"
			}).on("pageClicked", function(event, pageIndex) {
				pageNum = pageIndex + 1;
				// 刷新当前页面
				queryDataList(false);
			}).on('jumpClicked', function(event, pageIndex) {
				pageNum = pageIndex + 1;
				// 刷新当前页面
				queryDataList(false);
			});
			//调整分页的位置
			var rowWidth = jQuery(".page").width();
			var pageWidth = Number(jQuery(".m-pagination-page").width()) + Number(jQuery(".m-pagination-jump").width());
			jQuery(".m-pagination-page").css("margin-left", (rowWidth - pageWidth) / 2 + "px");
		}
	}
	
	/**
	 * 获取所有的业务分类
	 */
	function initClassifyHandle() {
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/query-classify-list"),
			data: {
				"_t": (new Date()).getTime()
			},
			success: function(req) {
				// 查询成功
				classifyList = req.classifyList;
				queryClassifySuccess("common");
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: "提示",
					message: req.responseText || "查询业务分类异常！"
				});
			}
		});
	}
	
	/**
	 * 业务分类查询成功
	 */
	function queryClassifySuccess(resizeType) {
	   // 先清除
	   jQuery(".data-service-type .data-items .condition-items").remove();
	   var downFlag = false;
	   var multiFlag = false;
	   // 是否是重置页面
	   if(resizeType == "resize"){
		   // 判断更多是否打开, 更多已经打开
		   if(jQuery("#moreIcon").hasClass('fa-caret-up')){
			   downFlag = true;
		   }
		   // 判断多选是否,多选已经打开
		   var multiIndex = jQuery.inArray("dataService", multiSelectArr);
		   if(multiIndex > -1){
			   multiFlag = true;
		   }
	   }
	   var winWidth = jQuery(window).width();
	   if(jQuery(window).width() < 1024){
		   winWidth = 1024
	   }
       winWidth = winWidth * 0.7; // 分类类型总长度为屏幕宽度的70%
		// 拼装业务分类
		var classifyLength = classifyList.length;
		var classify = null;
		var name = null;
		var value = null;
		var nameLength = null;
		var divWidth = 28 + 30 + 28; // 全部：14*2
		for(var i=0; i < classifyLength; i++){
			classify = classifyList[i];
			name = classify.classifyName;
			if(name.length > 14){   // 最大200，如果是200/14, 超过14的都按200算, margin-left: 30
				nameLength = 200 + 30;
			}else{
				nameLength = 30 + name.length * 14; // 字体为14号字体 checkbox 11px
			}
			value = classify.classifyId;
			divWidth += nameLength;
			var html = '';
			// 超过单行宽度隐藏单行以下的
			if(divWidth > winWidth){
				moreFlag = true;
				if(downFlag){
					html += '<div class="condition-items" value="' + value + '">';
				}else {
					if(multiFlag){
						html += '<div class="condition-items" value="' + value + '">';
					}else {
						html += '<div class="condition-items hide moreItems" value="' + value + '">';
					}
				}
			}
			else{
				html += '<div class="condition-items" value="' + value + '">';
			}
			if(multiFlag){
				html += ' <div class="data-select-check">';
			}else {
				html += ' <div class="data-select-check hide">';
			}
			html += ' 	<i class="fa fa-square-o"></i>';
			html += ' </div>';
			html += ' <span title="' + name + '">' + name + '</span>';
			html += '</div>';
			jQuery(".data-service-type .data-items").append(html);
		}
		if(resizeType != "resize"){
			if(moreFlag){
				// 展示更多data-items-more
				jQuery(".data-service-type .data-items-more").removeClass("hide");
			}
			jQuery(".data-service-type .data-multi-select").removeClass("hide");
			
		}
		if(multiFlag){
			jQuery('.data-service-type  .condition-items').css("margin-left", "0px");		
		}else {
			jQuery('.data-service-type  .condition-items').css("margin-left", "30px");		
		}	
		jQuery(".data-service-type .condition-items").hover(function() {
			jQuery(this).find('.data-select-check i').addClass('items-hover-show');
		}, function() {
			jQuery(this).find('.data-select-check i').removeClass('items-hover-show');
		});
	}
	
	
	/**
	 * 初始化数据工具栏
	 */
	function initDataTools(){
		// 查看
		jQuery('#dataUl').on('click','.data-list-li .list-container .btn-list .viewData',function(){
			jQuery('.btn-list .tool-title-div').poshytip('hide');
			var dataId = jQuery(this).parent().parent().parent().attr('id');
			var type = jQuery(this).parent().parent().parent().find('#dataType').val();
			var url = sabace.handleUrlParam("/platform/resmanage/data/data-common-view");
			var params = {
				dataId: dataId,
				type: type
			};
			if(data_type_link == type){
				url = sabace.handleUrlParam("/platform/resmanage/datalink/data-link-show");
				 params = {
					dataLinkId: dataId
				};
			}
			//页面跳转
			redirecPage(url,params);
		});
		
		//修改
		jQuery('#dataUl').on('click','.data-list-li .list-container .btn-list .modData',function(){
			var dataId = jQuery(this).parent().parent().parent().attr('id');
			var type = jQuery(this).parent().parent().parent().find('#dataType').val();
			var interfaceFlag = jQuery(this).parent().parent().parent().find('#interfaceFlag').val();
			jQuery('.btn-list .tool-title-div').poshytip('hide');
			if(data_type_file == type){
				fileImport("edit",dataId);
			}else if(data_type_table == type){
				if(interfaceFlag == "0") {
					tableImport(dataId);
				} else{
					tableImportByDacp(dataId);
				}
			}else if(data_type_link == type){
				dataContact(dataId, "modify");
			}
			else if(data_type_connect == type)
			{
				dataReditTab(dataId);
			}
			else if(data_type_view == type)
			{
				tableView(dataId);
			}
		});
		
		// 文件追加数据
		jQuery('#dataUl').on('click','.data-list-li .list-container .btn-list .appendData',function(){
			var dataId = jQuery(this).parent().parent().parent().attr('id');
			jQuery('.btn-list .tool-title-div').poshytip('hide');
			fileImport("append",dataId);
		});
		
		//重新生成
		jQuery('#dataUl').on('click','.data-list-li .list-container .btn-list .reloadData',function(){
			jQuery('.btn-list .tool-title-div').poshytip('hide');
			var dataId = jQuery(this).parent().parent().parent().attr('id');
			var type = jQuery(this).parent().parent().parent().find('#dataType').val();
			if(data_type_table == type){
				bi.dialog.confirm({
		            title: sabace.getMessage('data.dataLink.label.prompt'),
		            message: sabace.getMessage('data.datlist.label.sureRebuild'),
		            callback: function(result) {
		                if(result) {
		                	sabace.ajax({
		            			url: sabace.handleUrlParam("/platform/resmanage/data/regen-table-data"),
		            			data: {
		            				dataId: dataId
		            			},
		            			success: function(req) {
		            				if(req.resFlag == "success"){
		            					bi.dialog.show({
		            						type: bi.dialog.TYPE_INFO,
		            			            title: sabace.getMessage('data.dataLink.label.prompt'),
		            			            message:sabace.getMessage('data.datlist.label.regenSuccess')
		            				    });
		            					// 刷新数据
		            					queryDataList(true);
		            				}else{
		            					bi.dialog.show({
		            						type: bi.dialog.TYPE_DANGER,
		            			            title: sabace.getMessage('data.dataLink.label.prompt'),
		            			            message: req.msg
		            				    });
		            					return;
		            				}
		            			},
		            			error: function(req) {
		            				bi.dialog.show({
		            					type: bi.dialog.TYPE_DANGER,
		            					title: sabace.getMessage('data.dataLink.label.prompt'),
		            					message: req.responseText || sabace.getMessage('data.datlist.label.regenException')
		            				});
		            			}
		            		});
		                }
		            }
			    });
			}else if(data_type_link == type){
				bi.dialog.confirm({
		            title: sabace.getMessage('data.dataLink.label.prompt'),
		            message: sabace.getMessage('data.datlist.label.sureRebuild'),
		            callback: function(result) {
		                if(result) {
		                	ajaxReloadLink(dataId);
		                }
		            }
			    });
			}
		});
		
		//数据连接
		jQuery('#dataUl').on('click','.data-list-li .list-container .btn-list .linkData',function(){
			var dataId = jQuery(this).parent().parent().parent().attr('id');
			var modifyFlag = "add";
			jQuery('.btn-list .tool-title-div').poshytip('hide');
			dataContact(dataId, modifyFlag);
		});
		
		// 报表
		jQuery('#dataUl').on('click','.data-list-li .list-container .btn-list .createReport',function(){
			jQuery('.btn-list .tool-title-div').poshytip('hide');
			var dataId = jQuery(this).parent().parent().parent().attr('id');
			var type = jQuery(this).parent().parent().parent().find('#dataType').val();
			var dataName = jQuery(this).parent().parent().parent().find('#dataNameDiv').text();
			// 热度加1,每点击一次，热度都加1
			setHitCount(type, dataId);
			gotoCreateReport(dataId,dataName,type);
		});
		
		//删除
		jQuery('#dataUl').on('click','.data-list-li .list-container .btn-list .delData',function(){
			var dataId = jQuery(this).parent().parent().parent().attr('id');
			var type = jQuery(this).parent().parent().parent().find('#dataType').val();
			jQuery('.btn-list .tool-title-div').poshytip('hide');
			getDataIsUseByReport(dataId,type);
		});
		
		// 分享
		jQuery('#dataUl').on('click','.data-list-li .list-container .btn-list .rightData',function(){
			jQuery('.btn-list .tool-title-div').poshytip('hide');
			var dataId = jQuery(this).parent().parent().parent().attr('id');
			// "2"为数据分享
			grantOrShare("2",dataId);
		});
	}
	
	/**
	 * dataLink重新生成的ajax方法
	 */
	function ajaxReloadLink(dataId){
		var param = {
			'dataId':dataId
		};
		sabace.ajax({
			url:sabace.handleUrlParam("/platform/resmanage/datalink/update-datalink-state"),
			data: param,
			success: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_INFO,
		            title: sabace.getMessage('data.dataLink.label.prompt'),
		            message:sabace.getMessage('data.datlist.label.regenSuccess')
			    });
				// 刷新数据
				queryDataList(true);
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage("data.dataLink.label.prompt"),
					message:  req.responseText || sabace.getMessage("data.import.message.sysAbnormal")
				});
			}
		});
	}
	
	//文件导入
	function fileImport(type,dataId){
		var url = sabace.handleUrlParam("/platform/resmanage/data/data-file-import");
		var params = {};
		if(dataId != ""){
			params.dataId = dataId;
		}
		params.type = type;
		//页面跳转
		redirecPage(url,params);
	}
	
	//数据库表导入
	function tableImport(dataId){
		var params = {};
		if(dataId != ""){ 
			params.dataId = dataId;
		}
		var url = sabace.handleUrlParam("/platform/resmanage/data/data-table-import");
		//页面跳转
		redirecPage(url,params);
	}

	//数据库表导入
	function tableDirectImport(dataId){
		var params = {};
		if(dataId != ""){
			params.dataId = dataId;
		}
		var url = sabace.handleUrlParam("/platform/resmanage/data/data-table-import-direct");
		//页面跳转
		redirecPage(url,params);
	}

	//视图设置 
	function tableView(dataId){ 
		var params = {}; 
		if(dataId != ""){ 
			params.dataId = dataId; 
		} 
		var url = sabace.handleUrlParam("/platform/resmanage/tableview/table-view"); 
		//页面跳转 
		redirecPage(url,params); 
    } 
	
	//直连数据库
	function dataReditTab(dataId){
		var params = {};
		if(dataId != ""){
			params.dataId = dataId;
		}
		var url = sabace.handleUrlParam("/platform/resmanage/data/data-table-import-direct");
		//页面跳转
		redirecPage(url,params);
	}
	
	//视图
	function tableView(dataId){
		var params = {};
		if(dataId != ""){
			params.viewId = dataId;
		}
		var url = sabace.handleUrlParam("/platform/resmanage/tableview/table-view");
		//页面跳转
		redirecPage(url,params);
	}

	//数据库表导入
	function tableImportByDacp(dataId){
		var params = {};
		if(dataId != ""){
			params.dataId = dataId;
		}
		var url = sabace.handleUrlParam("/platform/resmanage/data/data-table-import-dacp");
		//页面跳转
		redirecPage(url,params);
	}
	
	// 进入报表
	function gotoCreateReport(dataId,dataName,dataType){
		var params = {};
		params.dataId = dataId;
		params.dataName = dataName;
		params.dataType = dataType;
		var url = sabace.handleUrlParam("/platform/dataview/create");
		//页面跳转
		redirecPage(url,params);
	}
	
	// 进入数据连接
	function dataContact(dataId, modifyFlag){
		var params = {};
		params.dataId = dataId;
		params.linkModifyFlag = modifyFlag;
		var url = sabace.handleUrlParam("/platform/resmanage/datalink/data-link");
		//页面跳转
		redirecPage(url,params);
	}
	
	// 数据库源赋权及数据分享
	function grantOrShare(type,dataId){
		var url = sabace.handleUrlParam("/platform/resmanage/db/data-user-select");
		bi.dialog.show({
			title: "用户选择",
			message: jQuery('<div id="userList"></div>').load(url),
			spinicon:'glyphicon glyphicon-refresh',
			cssClass: 'data-userList',
			onshown:function(dialog){
				// "1"为数据源赋权 "2"为数据分享
				userSelect.init(type,dataId)
			},
			buttons:[{
		   		label: sabace.getMessage('data.dataLink.label.Sure'),
		   		cssClass: 'btn-info',
		   		action: function(dialog){
		   			userSelect.saveUserSelect();
				}
			},{
				label: sabace.getMessage('data.dataLink.label.Cancel'),
				cssClass: 'btn-default',
				action: function(dialog) {
					dialog.close();
				}
			}
		   ]
		});
	}
	
	// 页面跳转方法
	function redirecPage(url,params){
		var html = "";
		// 遍历参数
		for(var name in params){
			html += "<input name='" + name + "' value='" + params[name] + "'/>";
		}
		var formTemp = jQuery("<form></form>",{
			"method":"post",
			"action": url,
			"target": "_blank",
			"html": html
		});
		jQuery('body').append(formTemp);
		formTemp.submit();
		jQuery(formTemp).remove();
	}
	
	/**
	 * dataId:数据源ID,dataType数据类型1：文件 2：数据表 3:数据二次链接 4：openapi 5:直连
	 */
	function getDataIsUseByReport(dataId,dataType){
		var paramObj ={
			'dataId':dataId,
			'dataType':dataType
		};
		var messageStr = '';
		if(data_type_file == dataType){
			messageStr = 'data.datlist.label.sureDelFD';
		}else if(data_type_table == dataType){
			messageStr = 'data.datlist.label.sureDelTD';
		}else if(data_type_openapi == dataType){
			messageStr = '您确定需要删除该OpenApi数据吗？';
		}else if(data_type_link == dataType){
			messageStr = 'data.datlist.label.delDataLink';
		}else if(data_type_connect == dataType){
			messageStr = 'data.datlist.label.sureDelTD';
		}else if(data_type_view == dataType){
			messageStr = '您确定需要删除该视图数据吗？';
		}
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/datalink/data-usedby-report"),
			data: paramObj,
			success: function(req){
				if(req.viewCount>0){ 
					messageStr='data.datlist.label.ViewReference'; 
				} 
				if(req.reportUseList.length>0){ 
					messageStr = 'data.datlist.label.ReportReference'; 
				} 
				if(req.reportUseList.length>0 ||req.viewCount>0){ 
					bi.dialog.confirm({
			            title: sabace.getMessage('data.dataLink.label.prompt'),
			            message: "该工作表已关联了仪表板，不允许删除"
//			            message: sabace.getMessage(messageStr),
//			            callback: function(result) {
//			                if(result) {
//			                	if(data_type_link == dataType){
//			                		delLinkDataById(dataId);
//			                	}else if(data_type_openapi == dataType){
//			                		delOpenApiData(dataId);
//			                	}else{
//			                		delData(dataType,dataId);
//			                	}
//			                }
//			            }
				    });
				}else{
					bi.dialog.confirm({
			            title: sabace.getMessage('data.dataLink.label.prompt'),
			            message: sabace.getMessage(messageStr),
			            callback: function(result) {
			                if(result) {
			                	if(data_type_link == dataType){
			                		delLinkDataById(dataId);
			                	}else if(data_type_openapi == dataType){
			                		delOpenApiData(dataId);
			                	}else{
			                		delData(dataType,dataId);
			                	}
			                }
			            }
				    });
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage("data.dataLink.label.prompt"),
					message:  req.responseText || sabace.getMessage("data.import.message.sysAbnormal")
				});
			}
		});
	}
	
	//删除数据连接
	function delLinkDataById(datalinkId){
		var param = {
			dataId:datalinkId
		}
		sabace.ajax({
			url:sabace.handleUrlParam("/platform/resmanage/datalink/delete-data-link"),
			data: param,
			loading: {
                title: sabace.getMessage("data.dataLink.label.prompt"),
                text: '正在删除数据...'
            },
			success: function(req) {
				if(req.resFlag == "success"){
					bi.dialog.show({
						type: bi.dialog.TYPE_INFO,
			            title: sabace.getMessage('data.dataLink.label.prompt'),
			            message: sabace.getMessage('data.datlist.label.delSuccess'),
			            buttons: [{
			            	label: sabace.getMessage('data.dataLink.label.Sure'),
	                        cssClass: 'btn-info',
	                        action: function (dialogItself) {
	                        	queryDataList(true);
	                        	dialogItself.close();
	                        }
			            }]
				    });
				}else{
					var tmpMeg = sabace.getMessage("data.import.message.sysAbnormal");
					if(!sabace.IsEmpty(req.msg)){
						tmpMeg = req.msg;
					}
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
			            title: sabace.getMessage('data.dataLink.label.prompt'),
			            message: tmpMeg
				    });
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage("data.dataLink.label.prompt"),
					message:  req.responseText || sabace.getMessage("data.import.message.sysAbnormal")
				});
			}
		});
	}
	
	// 删除数据文件
	function delData(type,dataId){
		var url = sabace.handleUrlParam("/platform/resmanage/data/delete-data-file");
		if(data_type_table == type){
			url =sabace.handleUrlParam("/platform/resmanage/data/delete-data-table");
		}else if(data_type_connect == type){
			url =sabace.handleUrlParam("/platform/resmanage/data/delete-data-connect-table");
		}else if(data_type_view == type){
			url =sabace.handleUrlParam("/platform/resmanage/data/delete-table-view");
		}
		sabace.ajax({
			url: url,
			data:{
				'dataId': dataId,
				'dataType':type
			},
			loading: {
                title: sabace.getMessage("data.dataLink.label.prompt"),
                text: '正在删除数据...'
            },
			success: function(req) {
				if(req.resFlag == "success"){
					bi.dialog.show({
						type: bi.dialog.TYPE_INFO,
			            title: sabace.getMessage('data.dataLink.label.prompt'),
			            message: sabace.getMessage('data.datlist.label.delSuccess'),
			            buttons: [{
			            	label: sabace.getMessage('data.dataLink.label.Sure'),
                            cssClass: 'btn-info',
                            action: function (dialogItself) {
                            	queryDataList(true);
                            	dialogItself.close();
                            }
			            }]
				    });
				}else{
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
			            title: sabace.getMessage('data.dataLink.label.prompt'),
			            message: req.msg
				    });
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.dataLink.label.prompt'),
					message: req.responseText || sabace.getMessage('data.datlist.label.delException')
				});
			}
		});
	}
	
	/**
	 * 删除openApi数据
	 */
	function delOpenApiData(dataId) {
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/delete-open-api"),
			data:{
				'dataId': dataId
			},
			loading: {
                title: sabace.getMessage("data.dataLink.label.prompt"),
                text: '正在删除数据...'
            },
			success: function(req) {
				if(req.resFlag == "success"){
					bi.dialog.show({
						type: bi.dialog.TYPE_INFO,
			            title: sabace.getMessage('data.dataLink.label.prompt'),
			            message: sabace.getMessage('data.datlist.label.delSuccess'),
			            buttons: [{
			            	label: sabace.getMessage('data.dataLink.label.Sure'),
                            cssClass: 'btn-info',
                            action: function (dialogItself) {
                            	queryDataList(true);
                            	dialogItself.close();
                            }
			            }]
				    });
				}else{
					bi.dialog.show({
						type: bi.dialog.TYPE_DANGER,
			            title: sabace.getMessage('data.dataLink.label.prompt'),
			            message: req.msg
				    });
					return;
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.dataLink.label.prompt'),
					message: req.responseText || sabace.getMessage('data.datlist.label.delException')
				});
			}
		});
	}
	
	/**
	 * 设置热度
	 */
	function setHitCount(type, dataId) {
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/set-hit-count"),
			data:{
				type: type,
				dataId: dataId	
			},
			success: function(req) {},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.dataLink.label.prompt'),
					message: req.responseText || "设置数据表热度异常！"
				});
			}
		});
	}
	
	/**
	 * 返回顶部事件
	 */
	function initReturnToTop(){
		//返回顶部
		jQuery(window).scroll(function() {
			if (jQuery(window).scrollTop() >= 100) {
				jQuery('.actGotop').fadeIn(300);
			} else {
				jQuery('.actGotop').fadeOut(300);
			}
		});
		jQuery('.actGotop').click(function() {
			jQuery('html,body').animate({
				scrollTop: '0px'
			}, 800);
		});
	}
	
	jQuery(window).resize(function() {
		queryClassifySuccess("resize");
	});
	
	/**
	 * 页面自适应
	 */
	function resizeBody(){
		var maxheight = jQuery(window).height() - 153;
		jQuery('#dataUl').css({
			'height': maxheight
		});
	}
	
	// 子页面调用刷新
	window.reloadDataList = function(){
		queryDataList(true);
	};
});
