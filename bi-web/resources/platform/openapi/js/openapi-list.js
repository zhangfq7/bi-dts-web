define(['sabace'], function(sabace,message) {
	
	// api信息
	var apiBaseInfo = {};
	// 参数数组
	var paramInfoArray = null;
	
	buildPageList();
	
	//使用js变量记录对话框内容，记录以后删除页面元素,防止有多个ID重复
	var dialogContent = jQuery("#dialogContent").html();
	jQuery("#dialogContent").html('');
	
	/**
	 * 接口表格列表
	 */
	function buildPageList(){
		jQuery("#openApiList").jqGrid({
			url: sabace.handleUrlParam('/platform/openapi/query-openapi-list')+'?ApiCode='+ApiCode,
			styleUI: 'Bootstrap',
			datatype: "json",
			colModel: [{
				label: '接口名称',
				name: 'apiName',
				width: 50,
				align: 'left',
				sortable: false
			}, {
				label: '方法名称',
				name: 'apiCode',
				width: 50,
				align: 'left',
				sortable: false
			}, {
				label: '请求地址',
				name: 'apiUrl',
				width: 50,
				align: 'left',
				sortable: false
			}, {
				label: '请求字段',
				name: 'paramInfoStr',
				width: 50,
				align: 'left',
				sortable: false
			}, {
				label: '结果字段',
				name: 'resultInfoStr',
				width: 50,
				align: 'left',
				sortable: false
			}, {
				label: '操作',
				name: 'serviceApiId',
				width: 20,
				align: 'center',
				sortable: false,
				formatter: function(cellvalue, options, rowObject) {
					if(cellvalue == null || cellvalue == ""){
						return '<a href="javascript:void(0)" id="' + options.rowId + '" class="use-openapi use">引用</a>' ;
					}else {
						return '<a href="javascript:void(0)" id="' + options.rowId + '" class="use-openapi">失效</a>' ;
					}
				}
			}],
			autowidth: true,
			height: 'auto',
			rowNum: 100000,
			regional: 'cn',
			loadComplete:function(data){
				jQuery(".use-openapi").on("click",  function() {
					// 引用
					if(jQuery(this).hasClass("use")){
						var dataIndex = this.id-1;
						var paramInfoStr = data[dataIndex].paramInfoStr;
						apiBaseInfo.apiName = data[dataIndex].apiName;
						apiBaseInfo.apiCode = data[dataIndex].apiCode;
						apiBaseInfo.apiUrl = data[dataIndex].apiUrl;
						apiBaseInfo.clientId = data[dataIndex].clientId;
						apiBaseInfo.passWord = data[dataIndex].passWord;
						apiBaseInfo.resultInfoStr = data[dataIndex].resultInfoStr;
						apiBaseInfo.sysId = data[dataIndex].sysId;
						apiBaseInfo.isDes = data[dataIndex].isDes;
						apiBaseInfo.accessKey = data[dataIndex].accessKey;
						bi.dialog.show({
							id: 'createOpenApi',
							title: "引用",
							nl2br: false,
							cssClass: 'use-openapi-dialog',
							message: dialogContent,
							closable: true,
							closeByBackdrop: false,
							closeByKeyboard: false,
							onshown:function(){
								// 下拉框初始化
								jQuery('.chosen-select').chosen();
								jQuery('#businessType').ajaxChosen({
									fields: ['classifyId','classifyName'],
									findPage: true,
									disabled: false,
									url : sabace.handleUrlParam('/platform/openapi/query-business-type-info')
								});
								// 时间控件初始化
								jQuery('#firstUpdateTime').datetimepicker({
									format:'YYYY-MM-DD HH:mm:ss',
									sideBySide: true,
									minDate: moment().format('YYYY-MM-DD'),
								});
								// 更新方式切换
								jQuery("#updateType").on("change",  function() {
									if(jQuery(this).val() == 'I'){
										jQuery(".first-update-time").fadeOut();
									}else{
										jQuery(".first-update-time").fadeIn();
									}
									if(jQuery(this).val() == 'I' || jQuery(this).val() == 'S'){
										jQuery(".storage-type").fadeOut();
									}else {
										jQuery(".storage-type").fadeIn();
									}
								});
								// 接口名称
								jQuery("#apiName").html(apiBaseInfo.apiName);
								
								// 参数设置
								paramInfoArray = JSON.parse(paramInfoStr);
								var paramLength = paramInfoArray.length;
								var paramObj = null;
								var ruleType = null;
								var paramName = null;
								var paramCode = null;
								var paramRuleData = null;
								// select个数
								var selCount = 0;
								for(var i=0; i < paramLength; i++) {
									paramObj = paramInfoArray[i];
									paramName = paramObj.paramName;
									paramCode = paramObj.paramCode;
									ruleType = paramObj.paramRuleType;
									paramRuleData = paramObj.paramRuleData;
									var paramHtml = '';
									paramHtml += '<tr>';
									paramHtml += '	<td class="table-param-label">';
									paramHtml +=    	paramName;
									paramHtml +=  '  	<label class="control-label f14">';
									paramHtml +=  '  		(' + paramCode + ')';
									paramHtml +=  '  	</label>';
									paramHtml +=  '  </td>';
									paramHtml +=  '  <td>';
									if(ruleType == "1"){
										paramHtml +=  '  	<input type="text" name="' + paramName + '" id="' + paramCode +'" value=' + paramRuleData +' class="form-control" disabled/>';
									} else if(ruleType == "2") {
										selCount += 1;
										paramHtml += '     <select style="width:100%" multiple name="' + paramName + '"  id="' + paramCode + '" class="dim-select' + selCount + '" data-placeholder="请选择维度"></select>';
									} else {
										paramHtml += '     <input type="text"  name="' + paramName + '"  id="' + paramCode +'" class="form-control"/>'
									}
									paramHtml +=  '  </td>';
									paramHtml +=  '</tr>';
									
									jQuery("#param-table").append(paramHtml);
								}
								
								// 对下拉框的处理
								if(selCount > 0){
									for(var n = 1; n <= selCount; n++){
										jQuery('.dim-select' + n + '').chosen({
											disable_search: false
										});
							            var paramCode = jQuery('.dim-select' + n + '').attr('id');
										jQuery('.dim-select' + n + '').ajaxChosen({
											fields: ['code','value'],
											findPage: true,
											disabled: false,
											url : sabace.handleUrlParam('/platform/openapi/query-dim-info') + '?paramCode=' + paramCode + '&paramInfoStr=' + JSON.stringify(paramInfoArray) + '&apiBaseInfoStr=' + JSON.stringify(apiBaseInfo) + '&_t=' + (new Date()).getTime()
										});
									}
								}
								
								// 结果设置
								var resultInfoArray = JSON.parse(apiBaseInfo.resultInfoStr);
								var resultLength = resultInfoArray.length;
								var resultInfoHtml = "";
								var resultObj = null;
								for(var i=0; i < resultLength; i++){
									resultObj = resultInfoArray[i];
									resultInfoHtml += '<div class="resultItem">';
									resultInfoHtml += ' <label class="control-label f14">';
									resultInfoHtml += 		resultObj.resultName + '(' + resultObj.resultCode + ')';
									if(i != resultLength - 1){
										resultInfoHtml += '&nbsp;&nbsp;|';
									}
									resultInfoHtml += '	</label>';
									resultInfoHtml += '</div>';
								}
								resultInfoHtml += '<div style="clear:both"></div>';
								jQuery("#resultDiv").html(resultInfoHtml);
							},
							buttons: [{
								label: "取消",
								cssClass: 'btn-default',
								action: function(dialog) {
									dialog.close();
								}
							}, {
								label: "保存",
								cssClass: 'btn-info',
								action: function(dialog) {
									saveOpenApiTable();
								}
							}]
						});					
					}
					else { // 失效
						// 设置失效
						var dataIndex = this.id-1;
						var serviceApiId = data[dataIndex].serviceApiId;
						bi.dialog.confirm({
				            title: "提示",
				            message: "OpenApi设置失效后该OpenApi所有的配置信息将删除！您确定需要将该OpenApi设置失效吗？",
				            callback: function(result) {
				                if(result) {
									sabace.ajax({
										type: 'post',
										cache: false,
										dataType: "json",
										url: sabace.handleUrlParam("/platform/openapi/set-openapi-invalid"),
										data: {
											serviceApiId: serviceApiId
										},
										loading: {
											title: '请稍后...',
											text: '正在设置OpenApi失效，请稍候...'
										},
										success: function(req) {
											if(req.resFlag == "success"){
												jQuery("#openApiList").jqGrid().trigger("reloadGrid");
												bi.dialog.show({
													type: bi.dialog.TYPE_INFO,
													title: "提示",
													message: "设置OpenApi失效成功!"
												});
											} else {
												bi.dialog.show({
													type: bi.dialog.TYPE_DANGER,
													title: "提示",
													message: "设置OpenApi失效失败!"
												});
											}
										},
										error: function(req) {
											bi.dialog.show({
												type: bi.dialog.TYPE_DANGER,
												title: "提示",
												message: req.responseText || "设置OpenApi失效异常!"
											});
										}
									});
				                }
				            }
					    });
					}
				})
			}
		});
		
		resizeGrid();
		$(window).resize(function() {
			resizeGrid();
		});
	};
	
	// 设置完成界面表格的宽度
	function resizeGrid() {
		jQuery("#openApiList").setGridWidth(jQuery(".data-grid-info").width() - 5);
	}
	
	/**
	 * 保存数据表信息
	 */
	function saveOpenApiTable(){
		// 参数对象
		var param={};
		param = jQuery.extend(param, apiBaseInfo);
		// 清空错误提示区域
		jQuery("#tip").html("");
		jQuery("#tip").hide();
		var paramLength = paramInfoArray.length;
		// 获取接口请求参数设置的值
		for(var i = 0; i < paramLength; i++){
			var paramCode = paramInfoArray[i].paramCode;
			var paramName = paramInfoArray[i].paramName;
            var filterDom = jQuery("#" + paramCode);
            var paramValue = jQuery.trim(filterDom.val());
            //select 的多选值用||分隔 mby shaojs 20161103
            if(filterDom.is("select")){
                paramValue = paramValue.split(",").join("||");
            }
			if(sabace.IsEmpty(paramValue)){
				jQuery("#tip").html("请设置参数 ["+paramName+"] 的值");
				jQuery("#tip").show();
				return;
			}else{
				paramInfoArray[i].paramRuleData = paramValue;
			}
		}
		
		//接口请求参数属性
		param.paramInfoStr = JSON.stringify(paramInfoArray);
		
		// 表名称
		var tableName = jQuery.trim(jQuery("#tableName").val());
		if(sabace.IsEmpty(tableName)){
			jQuery("#tip").html("表名称不能为空");
			jQuery("#tip").show();
			return;
		}
		param.tableName=tableName;
		
		// 更新周期
		var updateType = jQuery("#updateType").val();
		param.updateType=updateType;
		
		// 更新时间
		var updateTime = jQuery("#firstUpdateTime").val();
		if(updateType != "I" && sabace.IsEmpty(firstUpdateTime)){
			jQuery("#tip").html("请设置下次更新时间");
			jQuery("#tip").show();
			return;	
		}
		if(updateType != "I"){
			param.updateTime = updateTime;
		}
		
		// 存储方式
		var storageType = jQuery("#storageType").val();
		if(updateType == "D" || updateType == "W" || updateType == "M"){
			if(sabace.IsEmpty(storageType)){
				jQuery("#tip").html("请设置存储方式");
				jQuery("#tip").show();
				return;	
			} else {
				param.storageType = storageType;
			}
		}
		
		// 业务分类
		var businessType = jQuery("#businessType").val();
		param.businessType = businessType;
		
		// 描述
		var description = jQuery("#description").val();
		param.description = description;
		
		bi.dialog.confirm({
            title: "提示",
            message: "您确定需要保存OpenApi配置信息吗？",
            callback: function(result) {
                if(result) {
                	//保存数据
            		sabace.ajax({
            			type: 'post',
            			cache: false,
            			dataType: "json",
            			url: sabace.handleUrlParam("/platform/openapi/save-openapi-table"),
            			data: param,
            			loading: {
            				title: '请稍后...',
            				text: '正在保存数据，请稍候...'
            			},
            			success: function(req) {
            				if(req.resFlag == "success"){
            					bi.dialog.show({
            						type: bi.dialog.TYPE_INFO,
            						title: "提示",
            						message: "OpenApi配置成功!",
            						closeByBackdrop: false,
            						closeByKeyboard: false,
            						buttons: [{
            							label: "确定",
            							cssClass: 'btn-info',
            							action: function(dialog) {
            								jQuery("#openApiList").jqGrid().trigger("reloadGrid");
            								window.parent.bi.dialog.closeAll();
            							}
            						}]
            					});
            				}
            			},
            			error: function(req) {
            				bi.dialog.show({
            					type: bi.dialog.TYPE_DANGER,
            					title: "提示",
            					message: req.responseText || "OpenApi配置失败!"
            				});
            			}
            		});
                }
            }
	    });
	}
});
