define(['sabace'], function(sabace) {
	// 导入数据库表信息
	/*
	 * currentColNum:当前列序号;columnNames:列名(A、B、C......);columnNum:列数;
	 * typeArr:类型数组;lengthArr:长度数组;titleArr:标题数组;fieldArr:字段名称数组;filterArr:筛选类型数组;
	 * columnTypeArr:字段类型(如：VARCHAR(20),DECIMAL(20, 3)等);
	 * valuesStr:数据库表前10条数据的字符串拼接，供临时表插入语句用;
	 * dataTable:数据库表名称;splitType:数据表分表类型;dataName:数据库表中文名称;storageType:存储方式;
	 * tableDesc:数据库表描述;
	 * dataId:数据编码;columnData:jqgrid本地数据 data属性值;attrData:指标信息数据;
	 */
	var tableConfigInfo = {};
	// jqgrid配置
	var dataOptions = {};
	// jqgrid模型
	var commonColModel = {};
	var opType = "add";
	// 记忆点击列列序号
	var memoryNum = null;

	var dbProId = {};
	
	var proId =null;
	
	var selDbId=null;

	// 修改时是否需要改变导入状态，"0"为不改变，"1"为改变，改成导入状态，说明需要重新执行 ,
	// "4"为用户切换类型，需要判断数据连接、报表是否已经做过了
	var importStateType = "0";

	jQuery(function() {

		// 下拉框初始化
		jQuery('.chosen-select').chosen();
		// 查询业务分类
		//queryClassify();
		// 设置时间查询
		jQuery("#setTableTimeSql").on("click",function(){
			setTableTimeSql();
        })
        
		// 判断是新增还是修改
		if (dataId != "") {
			opType = "edit";
		}
		tableConfigInfo.dbId = dbId;
		if (opType == "add") {
			// 如果数据库编码也为空说明是从数据管理处添加
			if(sabace.IsEmpty(dbId)){
				// 查询当前用户所有的数据库
				queryUserDB();
			}else {
				if(sabace.IsEmpty(dataBaseName)){
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
							// 日表
							if(dataTable.lastIndexOf("YYYYMMDD") > 0 || dataTable.lastIndexOf("YYYYMM") > 0) {
								jQuery("#tableStorage").val("2");
								jQuery("#tableStorage").trigger("chosen:updated");
								// 如果分表字段关联SQL没有显示,让其显示出来
								if(jQuery("#ccc").hasClass("hide")){
									jQuery("#ccc").removeClass("hide");
								}
							} 
						}
					}
				}
			}
		}

		// 为修改时像后台发送请求获取
		if (opType == "edit") {
			initGetEditData();
		}
		// 点击tab时
		jQuery('.step-tab').on("click", selectShow);
		// 暂存
		// jQuery('#tableButton').on("click", tableSave);
		// 下一步，查询配置表字段
		jQuery('#nextButton').on("click", fieldSearch);
		// 设置字段"取消"
		jQuery('#fieldCanButton').on("click", fieldCancel);
		// 设置字段"确定"
		jQuery('#fieldSaveButton').on("click", completeSave);
		// 设置横线高亮设置
		setStepLine(1);

		// 输入项校验
		jQuery('#tableForm').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',
			showOneMessage: true
		});
		// 切换分表存储类型时
		jQuery('#tableStorage').on("change", tableStorageChange);

		jQuery('#selectDB').on("change", function(){
			var dbId = jQuery('#selectDB').val();
			proId = dbProId[dbId];

            sabace.ajax({
                url: sabace.handleUrlParam("/platform/resmanage/data/get-project-name"),
                data: {
                    proId: proId
                },
                success: function(req) {
                	var proName = req.proName;
                	var dataName = jQuery('#dataName').val();
                	var nameArray = dataName.split("_");

                	if(null!=proName || ""!=proName)
					{
                        jQuery('#dataName').val(proName+"_"+nameArray[nameArray.length-1]);
					}
                }
            });

		})
		
		
	});
	
	// 修改时获取修改的数据
	function initGetEditData() {
		tableConfigInfo.dataId = dataId;
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/get-table-data-direct"),
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
	
	// 返回成功后的处理
	function getEditDataSuccess(req) {
		tableConfigInfo = req.tableConfigBean;
		tableConfigInfo.columnData = req.columnData;
		tableConfigInfo.columnNum=req.columnNum;
		
		// 根据tableConfigInfo.columnData的长度来dataId判断是否有效
		if (tableConfigInfo.columnData.length == 0) {
			opType = "add";
		} else {
			jQuery("#dbName").val(tableConfigInfo.dbName);
			// 设置业务分类
			
			sabace.ajax({
				url: sabace.handleUrlParam("/platform/resmanage/data/query-classify-list"),
				data: {dbId:tableConfigInfo.dbId},
				success: function(req) {
					// 查询成功
					initClassify(req.classifyList);
				},
				error: function(req) {}
			});
			
			jQuery("#classifySel").val(tableConfigInfo.classifyId);
			alert('tableConfigInfo.classifyId:'+tableConfigInfo.classifyId);
			jQuery("#classifySel").find("option[value='"+tableConfigInfo.classifyId+"']").attr("selected",true);
			
			jQuery("#classifySel").trigger("chosen:updated");
			
			jQuery('#dataTable').val(tableConfigInfo.dataTable);
			jQuery('#dataName').val(tableConfigInfo.dataName);
			jQuery('#tableTime').val(tableConfigInfo.tableTime);
			jQuery('#tableType').val(tableConfigInfo.tableType);
			jQuery("#tableType").trigger("chosen:updated");
			jQuery('#tableStorage').val(tableConfigInfo.tablesStorage);
			jQuery("#tableStorage").trigger("chosen:updated");
			jQuery('#storageField').val(tableConfigInfo.storageField);
			jQuery('#storageSql').val(tableConfigInfo.storageSql);
			jQuery('#tableDesc').val(tableConfigInfo.tableDesc);
			
			if(tableConfigInfo.tablesStorage != "0"){
				if(tableConfigInfo.tablesStorage == "A"){
					jQuery('#aaa').removeClass('hide');
					jQuery('#bbb').removeClass('hide');
					jQuery('#ccc').removeClass('hide');
						
				}else if(tableConfigInfo.tablesStorage == "2"){	
						jQuery('#ccc').removeClass('hide');
					}
			}
	
		}
	}
	/**
	 * 查询当前用户下所有的数据库
	 */
	function queryUserDB(){
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/get-user-db"),
			data: {
				interfaceFlag: '2'
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 拼装select选项
					var dbList = req.dbList;
					var dbCount = dbList.length;
					var dbObj = null;
					var dbId = null;
					var dbName = null;
					proId = null;
					var html = '<option selected></option>';
					for(var i = 0; i< dbCount; i++){
						dbObj = dbList[i];
						dbId = dbObj.dbId;
						dbName = dbObj.dbName;
						proId = dbObj.proId;
						html += '<option " value="' + dbId + '">' + dbName + '</option>';
                        dbProId[dbId]=proId;
					}
					jQuery('#selectDB').append(html);
					
					jQuery("#selectDB").trigger("chosen:updated").change(function(){
						var dbPara = $(this).val()
						var para = {dbId:dbPara};
						sabace.ajax({
							url: sabace.handleUrlParam("/platform/resmanage/data/query-classify-list"),
							data: para,
							success: function(req) 
							{
								// 查询成功
								initClassify(req.classifyList);
							},
							error: function(req) {}
						});

					});
					
					
					
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
	 * 数据日期更新Sql,查询最近更新时间
	 */
	function setTableTimeSql() {
		tableConfigInfo.etlDbId=(tableConfigInfo.etlDbId == undefined ? "" : tableConfigInfo.etlDbId);
		tableConfigInfo.tableTimeSql=(tableConfigInfo.tableTimeSql == undefined ? "" : tableConfigInfo.tableTimeSql);
		var data={
				etlDbId:tableConfigInfo.etlDbId,
				tableTimeSql:tableConfigInfo.tableTimeSql
		};
		
        if(!jQuery("#tableTimePanel")[0]){
            jQuery("body").append("<div id='tableTimePanel' style='display:none;position: relative'></div>");
        }
        jQuery("#tableTimePanel").load(sabace.handleUrlParam('/platform/resmanage/data/table-date'), data, function () {
        	showTableTime();
        })
    }
	function showTableTime() {
		   $.dialog({
               id: 'tableTimeDialog',
               title: '设置数据更新日期',
               padding: '0',
               width: '600px',
               height: '260px',
               lock: true,
               content: jQuery("#tableTimePanel")[0],
               okVal: '查询',
               ok: function () {
                   var isPass = $('#tableForm').validationEngine('validate');
                   if (!isPass) {
                	   return false;
                   }
                   if (sabace.IsEmpty(etlDbId)) {
                       $.dialog.alert("请选择ETL数据库！");
                       return false;
                   }
                   if (sabace.IsEmpty(tableTimeSql)) {
                       $.dialog.alert("请输入数据日期更新SQL！");
                       return false;
                   }
                      $.ajax({
                           url: sabace.handleUrlParam('/platform/resmanage/data/query-table-time'),
                           contentType: 'charset=utf-8',
                           data: {
                        	   etlDbId: jQuery("#etlDbId option:selected").val(),
                               tableTimeSql: jQuery("#tableTimeSql").val(),
                           },
                           success: function (resp) {
                               if(resp.tableTime != "error"){
                            	   tableConfigInfo.tableTime=resp.tableTime;
                            	   tableConfigInfo.etlDbId=resp.etlDbId;
                            	   tableConfigInfo.tableTimeSql=resp.tableTimeSql;
                            	   jQuery("#tableTime").val(resp.tableTime)
                                   $.dialog.closeAll('tableTimeDialog');
                               } else {
                                   $.dialog.alert('数据日期查询失败');
                               }
                           },
                           error: function (req) {
                               $.dialog.alert('系统异常，数据日期查询失败，请稍后重试');
                               return false;
                           }
                       })
                   return false;
               }
           });
	}
	/**
	 * 查询维度
	 */
	function checkDim(obj, dbId,rowId){
        if(!jQuery("#tableDimPanel")[0]){
            jQuery("body").append("<div id='tableDimPanel' style='display:none;position: relative;'></div>");
        }
        jQuery("#tableDimPanel").load(sabace.handleUrlParam('/platform/resmanage/data/table-dim'), function () {
        	showTableDim(rowId);
        	queryDimList();
        	jQuery("#dimSearchButton").on("click",function(){
        		var flag=queryDimList();
        		if(flag){
	        		jQuery("#succQueryListTable").jqGrid("clearGridData");
	        		jQuery("#succQueryListTable").jqGrid("setGridParam",{datatype: "local",data:tableConfigInfo.dimList}).trigger("reloadGrid");
        		}
        	})
        })
    }
	
	// 删除维度
	function deleteDim(obj,rowId){
		 $("#"+rowId+"_dimDiv").text("");
		 $("#"+rowId+"_dimDiv").attr("value","");
	}
	
	//查询口径 by xuyx
	function checkCaliber(obj, dbId,rowId){
        if(!jQuery("#attrCaliberPanel")[0]){
            jQuery("body").append("<div id='attrCaliberPanel' style='display:none;position: relative'></div>");
        }
        //获取口径配置页面和数据
        jQuery("#attrCaliberPanel").load(sabace.handleUrlParam('/platform/resmanage/data/attr-caliber')+'?dbId='+selDbId, function () {
        	showAttrCaliber(rowId);
        	queryCaliberList();
        	jQuery("#caliberSearchButton").on("click",function(){
        		var flag=queryCaliberList();
        		if(flag){
	        		jQuery("#queryCaliberListTable").jqGrid("clearGridData");
	        		jQuery("#queryCaliberListTable").jqGrid("setGridParam",{datatype: "local",data:tableConfigInfo.caliberList}).trigger("reloadGrid");
        		}
        	})
        })
    }
	
	
	// 获取口径信息 by xuyx
	function queryCaliberList() {
		caliberName=$('#caliber_name').val()
		var caliberParams = {
			caliberName:caliberName,
			dbId:selDbId
		}
		var returnFlag = false;
		sabace.ajax({
			url:sabace.handleUrlParam("/platform/resmanage/data/query-attr-caliber"),
			data: caliberParams,
			async:false,
			success: function(req) {
				// 查询成功
				tableConfigInfo.caliberList=req.caliberList;
				initCaliberSuccess();
				returnFlag = true;
			},
			error: function(req) {returnFlag = false;}
		});
		return returnFlag;
	}
	
	
	//口径配置会话框 by xuyx
	function showAttrCaliber(rowId) {
		   $.dialog({
            id: 'attrCaliberDialog',
            title: '请选择口径信息',
            padding: '0',
            width: '715px',
            height: '260px',
            top:'50px',
            lock: true,
            resize: false,
            drag: false,
            content: jQuery("#attrCaliberPanel")[0],
            okVal: '确定',
            ok: function () {
                var isPass = $('#tableForm').validationEngine('validate');
                if (!isPass) {
             	   return false;
                }
	                $("#"+rowId+"_caliberDiv").text(tableConfigInfo.caliberName);
	         	    $("#"+rowId+"_caliberDiv").attr("value",tableConfigInfo.caliberId);
               
            }
        });
	}
	// 删除口径 by xuyx
	function deleteCaliber(obj,rowId){
		 $("#"+rowId+"_caliberDiv").text("");
		 $("#"+rowId+"_caliberDiv").attr("value","");
	}
	
	//口径信息配置的表格  by xuyx
	function initCaliberSuccess() {
		var columnData=tableConfigInfo.caliberList;
		jQuery("#queryCaliberListTable").jqGrid({
			datatype: "local",
			styleUI: 'Bootstrap',
			data: columnData,
			colModel: [
				 {
					 label:'口径名称',
					 name: 'caliberName',
					 index: 'caliberName', 
					 sortable:false,
					 align:'center',
					 hlign: 'center'
				 },{
					 label:'口径描述',
					 name: 'caliberDesc', 
					 index: 'caliberDesc',
					 sortable:false,
					 align:'center',
					 hlign: 'center'
				},{
					label:'选择',
					name: 'caliberIdHtml',
					index: 'caliberIdHtml',
					sortable:false,
					width:'60px',
					align: 'center',
					hlign: 'center'
				},{
					label:'口径编码',
					name: 'caliberId', 
					index: 'caliberId', 
					hidden:true,
					hlign: 'center'
				}],
				rowNum:10,
				autowidth: true,
		        height: 'auto',
		        rowList:[10,20,30],
		        viewrecords: true,
		        forceFit:true,
		        sortorder: "desc",
		        gridview :false,
		        shrinkToFit: true,
			pager: '#queryCaliberListTablePagerDiv',
			jsonReader: {root: "result", total: "totalPage", page: "currentPage", records: "rowNumber", repeatitems: false},
			afterInsertRow: function(rowid, columnData)
			{
		        var  queryHTML = '<input type="radio"  id="selectId" name="selectId"  title="' + columnData.caliberName +  '" value="' + columnData.caliberId + '" ';
				queryHTML+='/> ';
				jQuery(this).jqGrid('setCell',rowid,'caliberIdHtml',queryHTML);
			},
			beforeSelectRow:function(rowid,e)
			{
				jQuery("#queryCaliberListTable").find("tr[id='"+rowid+"']").find("input[type=radio]").prop("checked",true);
				var table = jQuery(this);
				var rowdata = table.jqGrid('getRowData',rowid);
				tableConfigInfo.caliberId=rowdata['caliberId'];
				tableConfigInfo.caliberName=rowdata['caliberName'];
			},
			loadComplete:function(rowid,e)
			{
				var table = jQuery(this);
				var ret = table.jqGrid('getRowData');
				if (ret.length == 0)
				{
					// addJqGridBlankLine(table, '没有符合条件的结果数据！');
					$(".ui-paging-info").text("  总记录共   0   条  ");
				}
				/*table.setGridWidth(document.body.clientWidth*0.495);
				jQuery(window).resize(function()
				{
					 table.setGridWidth(document.body.clientWidth*0.495);
				})*/
			}
		
		});
	}
	
	function showTableDim(rowId) {
		   $.dialog({
               id: 'tableDimDialog',
               title: '请选择维度信息',
               padding: '0',
               width: '650px',
               height: '260px',
               top:'50px',
               lock: true,
               resize: false,
               drag: false,
               content: jQuery("#tableDimPanel")[0],
               okVal: '确定',
               ok: function () {
                   var isPass = $('#tableForm').validationEngine('validate');
                   if (!isPass) {
                	   return false;
                   }
	                   $("#"+rowId+"_dimDiv").text(tableConfigInfo.dimName);
	             	   $("#"+rowId+"_dimDiv").attr("value",tableConfigInfo.dimId);
               }
           });
	}
	window.checkDim = checkDim;
	window.deleteDim = deleteDim;
	window.checkCaliber=checkCaliber;
	window.deleteCaliber = deleteCaliber;
	// 获取维度信息
	function queryDimList() {
		dimName=$('#dim_name').val()
		var dimParams = {
				dimName:dimName,
				dbId:selDbId
		}
		var returnFlag = false;
		sabace.ajax({
			url:sabace.handleUrlParam("/platform/resmanage/data/query-dim-list"),
			data: dimParams,
			async:false,
			success: function(req) {
				// 查询成功
				tableConfigInfo.dimList=req.dimList;
				initDimSuccess();
				returnFlag = true;
			},
			error: function(req) {returnFlag = false;}
		});
		return returnFlag;
	}
	function initDimSuccess() {
		var columnData=tableConfigInfo.dimList;
		jQuery("#succQueryListTable").jqGrid({
			datatype: "local",
			styleUI: 'Bootstrap',
			data: columnData,
			colModel: [
				 {label:'维度名称', name: 'dimName', index: 'dimName', width:'3px', sortable:false,align:'center',hlign: 'center'},
				 {label:'CODE字段', name: 'dimCodeAttr', index: 'dimCodeAttr', width: '3px', sortable:false,align:'center',hlign: 'center'},
				 {label:'名称字段', name: 'dimLabelAttr', index: 'dimLabelAttr', width:'3px', sortable:false,align:'center',hlign: 'center'},
				 {label:'选择', name: 'dimIdHtml', index: 'dimIdHtml', width: '2px', sortable:false,align: 'center',title:false,hlign: 'center'},
				 {label:'维度编码', name: 'dimId', index: 'dimId',hidden:true}
		    ],
			rowNum:10,
			autowidth: true,
	        height: 'auto',
	        rowList:[10,20,30],
	        viewrecords: true,
	        sortorder: "desc",
	        gridview :false,
	        shrinkToFit: true,
			pager: '#succQueryListTablePagerDiv',
			jsonReader: {root: "result", total: "totalPage", page: "currentPage", records: "rowNumber", repeatitems: false},
			afterInsertRow: function(rowid, columnData)
			{
		        var  queryHTML = '<input type="radio"  id="selectId" name="selectId"  title="' + columnData.dimName +  '" value="' + columnData.dimId + '" ';
				queryHTML+='/> ';
				jQuery(this).jqGrid('setCell',rowid,'dimIdHtml',queryHTML);
			},
			beforeSelectRow:function(rowid,e)
			{
				jQuery("#succQueryListTable").find("tr[id='"+rowid+"']").find("input[type=radio]").prop("checked",true);
				var table = jQuery(this);
				var rowdata = table.jqGrid('getRowData',rowid);
				tableConfigInfo.dimId=rowdata['dimId'];
				tableConfigInfo.dimName=rowdata['dimName'];
			},
			loadComplete:function(rowid,e)
			{
				var table = jQuery(this);
				var ret = table.jqGrid('getRowData');
				if (ret.length == 0)
				{
					// addJqGridBlankLine(table, '没有符合条件的结果数据！');
					$(".ui-paging-info").text("  总记录共   0   条  ");
				}
//				table.setGridWidth(document.body.clientWidth*0.485);
//				jQuery(window).resize(function()
//				{
//					 table.setGridWidth(document.body.clientWidth*0.5);
//				})
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
	 * 
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
	
	// 切换分表存储类型
	function tableStorageChange(){
		// 选择只更新一次、每日更新、每周更新、每月更新时需要选择下次更新时间
		// 每日更新、每周更新、每月更新时需要选择是否删除历史记录
		jQuery('#aaa').addClass('hide');
		jQuery('#bbb').addClass('hide');
		jQuery('#ccc').addClass('hide');
		if(this.value != "0"){
			if(this.value == "A"){
				jQuery('#aaa').removeClass('hide');
				jQuery('#bbb').removeClass('hide');
				jQuery('#ccc').removeClass('hide');
			}else if(this.value == "1"||this.value == "2"){	
				jQuery('#ccc').removeClass('hide');
			}
		
		}
		
	}

	// 点击下一步，查询配置表字段
	function fieldSearch() {
		
		var isPass = $('#tableForm').validationEngine('validate');
		if (!isPass) {
			return false;
		}
		 if(opType == "add" && (sabace.IsEmpty(dbId))){
			var selDB = jQuery("#selectDB").val();
			var selDBName = jQuery("#selectDB").find("option:selected").text();
			if(sabace.IsEmpty(selDB)){
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
		 
		// 解决非数据库直连时interfaceTag不存在问题
		if(!interfaceTag){
			interfaceTag = false;
		}
		selDbId=tableConfigInfo.dbId;
		// 发送请求到后台查询表字段
		tableConfigInfo.classifyId = jQuery('#classifySel').val();							// 业务分类Id
		tableConfigInfo.classifyName = jQuery("#classifySel").find("option:selected").text();// 业务分类名称
		tableConfigInfo.dataTable = jQuery.trim(jQuery("#dataTable").val());				// 数据表名称
		tableConfigInfo.dataName = jQuery.trim(jQuery("#dataName").val());					// 中文表名称
		tableConfigInfo.tableType = jQuery("#tableType").val();								// 数据表存储类型
																							// 0：其他，1：月表，2：日表
		tableConfigInfo.tableTypeText = jQuery("#tableType").find("option:selected").text();
		tableConfigInfo.tableStorage = jQuery("#tableStorage").val();						// 分表存储类型
		tableConfigInfo.tableStorageText = jQuery("#tableStorage").find("option:selected").text();
		tableConfigInfo.storageField = jQuery("#storageField").val();						// 分表存储字段
		tableConfigInfo.storageSql = jQuery.trim(jQuery("#storageSql").val());	// 分表字段关联SQL
		tableConfigInfo.tableDesc = jQuery.trim(jQuery("#tableDesc").val());				// 数据表描述
		//校验是否填写数据最新更新日期
		if(sabace.IsEmpty(tableConfigInfo.tableTime)){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
				title: sabace.getMessage('data.import.title.tips'),
				message: sabace.getMessage('data.import.message.tableTime')
			});
			return;
		}
		
		// 判断是否是分表
		if (tableConfigInfo.dataTable.indexOf("$") > 0) {
			if (tableConfigInfo.tableStorage == 0) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.subTable')
				});
				return;
			}
		} else {
			if (tableConfigInfo.tableStorage != 0) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.import.message.notSubTable')
				});
				return;
			}
		}
		if(opType == "edit" && dataId != ""){
				
				var columnData=tableConfigInfo.columnData;
				var columnNum=tableConfigInfo.columnNum;
				initField(columnData,columnNum);
				return true;
		}
		
		
		var dbParams = {
				dbId: tableConfigInfo.dbId,
				dataTable: tableConfigInfo.dataTable,
				dataName: tableConfigInfo.dataName,
				tableTime: tableConfigInfo.tableTime,
				etlDbId:tableConfigInfo.etlDbId,
				tableTimeSql:tableConfigInfo.tableTimeSql,
				classifyId: tableConfigInfo.classifyId,
			    classifyName: tableConfigInfo.classifyName,
				tableType: tableConfigInfo.tableType,
				tablesStorage: tableConfigInfo.tableStorage,
				storageField: tableConfigInfo.storageField,
				storageSql: tableConfigInfo.storageSql,
				tableDesc: tableConfigInfo.tableDesc,
				dataId: tableConfigInfo.dataId,
				opType: opType,
				classifyId: tableConfigInfo.classifyId,
			    classifyName: tableConfigInfo.classifyName,
			    interfaceTag: interfaceTag
			};
		// 发送请求到后台
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/creat-from-table-direct"),
			data: dbParams,
			loading: {
				title: sabace.getMessage('data.import.title.execute'),
				text: sabace.getMessage('data.import.text.queryTableLoading')
			},
			success: function(req) {
				if (req.resFlag == "success") {
					// 返回成功后的处理
					var columnData=req.columnData;
					var columnNum=req.columnNum;
					initField(columnData,columnNum);
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


	// 横线高亮设置
	function setStepLine(step) {
		var marWidth = 40 * (step - 1) + 8 + "%";
		jQuery('#stepLine').css("margin-left", marWidth);
	}


	// 数据处理"确定"
	function initField(columnData,columnNum) {
		// 横线高亮设置
		setStepLine(2);
		// 按钮样式切换
		jQuery('#oneStep').addClass("active-Finished");
		if (jQuery('#twoStep').hasClass("active-Finished")) {
			jQuery('#twoStep').removeClass("active-Finished");
		}
		jQuery('#twoStep').removeClass("active-notFinished");
		// 面板内容切换
		jQuery('#tableInfo').addClass("hide");
		jQuery('#fieldInfo').removeClass("hide");
		
		getFieldSuccess(columnData,columnNum);
	
	}
	

	// field字段信息返回成功后的处理
	function getFieldSuccess(columnData,columnNum) {
		tableConfigInfo.attrData =columnData;
		tableStorage=tableConfigInfo.tablesStorage;
		jQuery('#fieldGrid').jqGrid({
			datatype: "local",
			styleUI: 'Bootstrap',
			data: columnData,
			regional: 'cn',
			autowidth: true,
			height: 'auto',
			rowNum: 100000,
			gridview :false,
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
				editable: true,

			},{
				name: 'groupId',
				align: 'center',
				hlign: 'center',
				hidden: true
			},{
				label: sabace.getMessage('data.import.label.columnType'),
				name: 'columnType',
				align: 'center',
				hlign: 'center',
				sortable: false
			},{
				label: sabace.getMessage('data.import.label.attrType'),
				name: 'attrType',
				align: 'center',
				hlign: 'center',
				sortable: false,
				hidden: true,
				editable:true,
				formatter: "select",
				edittype: "select",
				editoptions: {
					value: sabace.getMessage('data.import.label.attrTypeFormat')
				}
			},{
				label: sabace.getMessage('data.import.label.filterType'),
				name: 'filterType',
				index: 'filterType',
				width: 140, 
				sortable:false,
				align:'center',
				hlign: 'center'
			},{
				name: 'dimId',
				align: 'center',
				hlign: 'center',
				hidden: true
			},{
				name: 'dimName',
				align: 'center',
				hlign: 'center',
				hidden: true
			},{
				name: 'expression',
				align: 'center',
				hlign: 'center',
				hidden: true
			},{
				label: sabace.getMessage('data.import.label.dimName'),
				name: 'dim_html',
				index: 'dim_html', 
				width: 140, 
				sortable:false,
				align:'center',
				hlign: 'center',
				title:false,
				formatter: function(cellvalue, options, rowObject) {
						// 维度设置
				    	var disp_typeHTML = "";
				    	var columnLabel=(rowObject.columnLabel == undefined ? "" : rowObject.columnLabel);
				        if (rowObject.filterType == '1')
				        {
				            var dimId = (rowObject.dimId == undefined ? "" : rowObject.dimId);
				            var dimName = (rowObject.dimName == undefined ? "" : rowObject.dimName);
				            var dimHTML = '<div style="float:left;width:70%" id="dimNameDiv"><span class="blue12" id="'+columnLabel+'_dimDiv" value="'+dimId+'">' +dimName + '</span></div>';
				            dimHTML += '<div style="float:right">[<img src="'+webpath+'/resources/platform/resmanage/data/img/editfind.png" width="14" height="14" style="cursor:pointer" onclick="checkDim(this, \'' + dbId + '\', \'' + columnLabel + '\')" title="选择维度" align="absbottom"/> ';
				            dimHTML += '<img src="'+webpath+'/resources/platform/resmanage/data/img/editdelete.png" width="14" height="14" style="cursor:pointer" onclick="deleteDim(this,\'' + columnLabel + '\')" title="删除选择的维度" align="absbottom"/>]</div>';
				            disp_typeHTML = dimHTML;
				            
					    }
				        else if (rowObject.filterType == '4')
				        {
				        	var expression = (rowObject.expression == undefined ? "" : rowObject.expression);
				        	disp_typeHTML += '<select id="'+columnLabel+'_expression" name="expression">';
					        disp_typeHTML += ' <option value="yyyy-MM" ' + (expression == 'yyyy-MM' ? 'selected' : '') + '>yyyy-MM</option>';
					        disp_typeHTML += ' <option value="yyyyMM" ' + (expression == 'yyyyMM' ? 'selected' : '') + '>yyyyMM</option>';
				        	disp_typeHTML += '</select>';
				        }
				        else if (rowObject.filterType == '6')
				        {
				        	var expression = (rowObject.expression == undefined ? "" : rowObject.expression);
				        	disp_typeHTML += '<select id="'+columnLabel+'_expression" name="expression">';
					        disp_typeHTML += ' <option value="yyyy-MM-dd" ' + (expression == 'yyyy-MM-dd' ? 'selected' : '') + '>yyyy-MM-dd</option>';
					        disp_typeHTML += ' <option value="yyyyMMdd" ' + (expression == 'yyyyMMdd' ? 'selected' : '') + '>yyyyMMdd</option>';
				        	disp_typeHTML += '</select>';
				        }
				        else if (rowObject.filterType == '7')
				        {
				        	var expression = (rowObject.expression == undefined ? "" : rowObject.expression);
				        	disp_typeHTML += '<select id="'+columnLabel+'_expression" name="expression" style="width:100%;height:80%">';
					        disp_typeHTML += ' <option value="yyyy-MM-dd HH:mm:ss" ' + (expression == 'yyyy-MM-dd HH:mm:ss' ? 'selected' : '') + '>yyyy-MM-dd HH:mm:ss</option>';
					        disp_typeHTML += ' <option value="yyyyMMddHHmmss" ' + (expression == 'yyyyMMddHHmmss' ? 'selected' : '') + '>yyyyMMddHHmmss</option>';
				        	disp_typeHTML += '</select>';
				        }else
				        {
				        	disp_typeHTML += "";
					    }
				        return disp_typeHTML;
				}
			
			},{
				label: sabace.getMessage('data.import.label.caliberName'),
				name: 'caliberName',
				index: 'dim_html', 
				width: 140, 
				sortable:false,
				align:'center',
				hlign: 'center',
				title:false,
				formatter: function(cellvalue, options, rowObject) {
						// 口径设置
				    	var disp_typeHTML = "";
				    	var columnLabel=(rowObject.columnLabel == undefined ? "" : rowObject.columnLabel);
				    	var caliberId = (rowObject.caliberId == undefined ? "" : rowObject.caliberId);
			            var caliberName = (rowObject.caliberName == undefined ? "" : rowObject.caliberName);
			            var dimHTML = '<div style="float:left;width:70%" id="caliberNameDiv"><span class="blue12" id="'+columnLabel+'_caliberDiv" value="'+caliberId+'">' +caliberName + '</span></div>';
			            dimHTML += '<div style="float:right">[<img src="'+webpath+'/resources/platform/resmanage/data/img/editfind.png" width="14" height="14" style="cursor:pointer" onclick="checkCaliber(this, \'' + dbId + '\', \'' + columnLabel + '\')" title="选择口径" align="absbottom"/> ';
			            dimHTML += '<img src="'+webpath+'/resources/platform/resmanage/data/img/editdelete.png" width="14" height="14" style="cursor:pointer" onclick="deleteCaliber(this,\'' + columnLabel + '\')" title="删除选择的口径" align="absbottom"/>]</div>';
			            disp_typeHTML = dimHTML;
				        return disp_typeHTML;
				}
			
			},{
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
			},{
				label: sabace.getMessage('data.import.label.dateField'),
				name: 'dateFieldId',
				align: 'center',
				hlign: 'center',
				sortable: false,
				editable:true,
				edittype: "select",
				editoptions: {
					value: sabace.getMessage('data.import.label.dateFieldType'),
					dataEvents: [{type: 'change',fn: function(e) {
					              	var value=$(this).val();// /这可以取到当前单元格的值
					              	var currtenTr = $(this).closest("tr").index();//取到当前行
					              	var filedName=columnData[currtenTr-1].fieldName;
					              	var filterType=jQuery('#' + currtenTr + '_filterTypeDispalay').val()
					              	//只有日期型才能选择调度日期
					              	if(!(filterType=='4'||filterType=='6'||filterType=='7'))
					              	{
					              		$.dialog.alert("非日期类型字段！");
					              		$(this).val("");
					              		 return false;
					              	}
					              	tableConfigInfo.dateFieldId = (tableConfigInfo.dateFieldId == undefined ? "" : tableConfigInfo.dateFieldId);
					              	//设置调度日期字段
									if(value == '1' && (!tableConfigInfo.dateFieldId==""))
									{
										bi.dialog.confirm({
											title: sabace.getMessage('data.import.title.saveData'),
											message: sabace.getMessage('data.import.message.dataFiledConfirm'),
											callback: function(result) {
												if (result) {
													// 如果已经配置了调度日期字段，先清空，再设置新的字段为调度日期字段
													for(var i=1;i<=columnData.length;i++){
														if(columnData[i-1].fieldName==tableConfigInfo.dateFieldId){
															jQuery('#' + i + '_dateFieldId').val("");
															//字段配置为调度日期后，将非日期型展示方式置为disabled
															var displayOpt=jQuery('select#' + i + '_filterTypeDispalay option');
															for (var i = 0; i < displayOpt.length; i++)
															{
																displayOpt[i].hidden = false;
															}
															break;
														}
													}
													tableConfigInfo.dateFieldId=filedName; 
												}
											}
										});
									}else if(value == '1' && (tableConfigInfo.dateFieldId==""))
									{
										tableConfigInfo.dateFieldId=filedName; 
									}
									else
									{
										tableConfigInfo.dateFieldId="";
									}
									//字段配置为调度日期后，将非日期型展示方式置为disabled
									var displayOpt=jQuery('select#' + currtenTr + '_filterTypeDispalay option');
									for (var i = 0; i < displayOpt.length; i++)
									{
										 if (value == "1")
										 {
								        		if (displayOpt[i].value == '2' || displayOpt[i].value == '3' ||displayOpt[i].value == '9')
								        		{
								        			displayOpt[i].hidden = true;
								        		}
								        		
										 }else
										 {
											 displayOpt[i].hidden = false;
										 }
										 
									 }
									
								}
						}]
				}
			}],
			afterInsertRow: function(rowid, aData)
			{
				// 展示方式设置 1:数值型;2:日期型;3:字符型
				var value=jQuery('#' + rowid + '_filterTypeDispalay').find("option:selected").val();
		    	var filter_typeHTML = "";
		        if (aData.attrType == '1')
		        {
					var filterType = (aData.filterType == undefined ? "" : aData.filterType);
					filter_typeHTML += '<select id="'+rowid+'_filterTypeDispalay" name="filterTypeDispalay" onchange="changeDisplayType(this,\'' + rowid + '\')">';
					filter_typeHTML += ' <option value="">--请选择--</option>';
					filter_typeHTML += ' <option value="1" ' + (filterType == '1' ? 'selected' : '') + '>维度选择</option>';
					filter_typeHTML += ' <option value="2" ' + (filterType == '2' ? 'selected' : '') + '>数值间隔</option>';
					filter_typeHTML += ' <option value="3" ' + (filterType == '3' ? 'selected' : '') + '>精确查找</option>';
					filter_typeHTML += '</select>';
					jQuery(this).jqGrid('setCell',rowid,'filterType',filter_typeHTML);
		        }else if (aData.attrType == '2')
		        {
		        	var filterType = (aData.filterType == undefined ? "" : aData.filterType);
					filter_typeHTML += '<select id="'+rowid+'_filterTypeDispalay" name="filterTypeDispalay" onchange="changeDisplayType(this,\'' + rowid + '\')">';
					filter_typeHTML += ' <option value="">--请选择--</option>';
					filter_typeHTML += ' <option value="4" ' + (filterType == '4' ? 'selected' : '') + '>月份</option>';
					filter_typeHTML += ' <option value="6" ' + (filterType == '6' ? 'selected' : '') + '>日期</option>';
					filter_typeHTML += ' <option value="7" ' + (filterType == '7' ? 'selected' : '') + '>时间</option>';
					filter_typeHTML += '</select>';
					jQuery(this).jqGrid('setCell',rowid,'filterType',filter_typeHTML);
		        }else
		        {
		        	var filterType = (aData.filterType == undefined ? "" : aData.filterType);
					filter_typeHTML += '<select id="'+rowid+'_filterTypeDispalay" name="filterTypeDispalay" onchange="changeDisplayType(this,\'' + rowid + '\')">';
					filter_typeHTML += ' <option value="">--请选择--</option>';
					filter_typeHTML += ' <option value="1" ' + (filterType == '1' ? 'selected' : '') + '>维度选择</option>';
					filter_typeHTML += ' <option value="2" ' + (filterType == '2' ? 'selected' : '') + '>数值间隔</option>';
					filter_typeHTML += ' <option value="3" ' + (filterType == '3' ? 'selected' : '') + '>精确查找</option>';
					filter_typeHTML += ' <option value="4" ' + (filterType == '4' ? 'selected' : '') + '>月份</option>';
					filter_typeHTML += ' <option value="6" ' + (filterType == '6' ? 'selected' : '') + '>日期</option>';
					filter_typeHTML += ' <option value="7" ' + (filterType == '7' ? 'selected' : '') + '>时间</option>';
					filter_typeHTML += ' <option value="9" ' + (filterType == '9' ? 'selected' : '') + '>模糊查询</option>';
					filter_typeHTML += '</select>';
					jQuery(this).jqGrid('setCell',rowid,'filterType',filter_typeHTML);
		        }
			},
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
				for (var i = 1; i <= columnNum; i++) {
					$('#fieldGrid').jqGrid('editRow', i, false);
					// 当点击属性组的时候
					var obj = jQuery(this).find('#' + i + '_groupName');
					groupSelect(obj);
					$('#' + i + '_groupName').attr("truevalue","0");
					$('#' + i + '_groupName').val("默认属性组");
					//调整下样式
					$('#' + i + '_filterTypeDispalay').addClass("selectFiledClass");
					$('#' + i + '_expression').addClass("selectFiledClass");
					$('#' + i + '_dateFieldId').addClass("selectFiledClass");
					$('#' + i + '_dateFieldId').removeClass("form-control");
					$('#' + i + '_dateFieldId').attr("size","");
					// 设置调度日期
					var filedName=columnData[i-1].fieldName;
					var dateFieldId = (tableConfigInfo.dateFieldId == undefined ? "" : tableConfigInfo.dateFieldId);
					if(dateFieldId==filedName){
						$('#' + i + '_dateFieldId').val("1");
					}
					
					//字段配置为调度日期后，将非日期型展示方式置为disabled
					var n=$('#' + i + '_dateFieldId').val();
					var displayOpt=jQuery('select#' + i + '_filterTypeDispalay option');
					for (var j = 0; j < displayOpt.length; j++)
					{
						 if (n == "1")
						 {
				        		if (displayOpt[j].value == '2' || displayOpt[j].value == '3' ||displayOpt[j].value == '9')
				        		{
				        			displayOpt[j].hidden = true;
				        		}
				        }
					 }
					
				}
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
			url: sabace.handleUrlParam("/platform/resmanage/data/data-query-group")+"?dbId="+selDbId,
			onCheck:function(){
				$("#div" + this.id).fadeOut("fast");
			}
		});
	}
	
	
	// 改变默认展现方式
	function changeDisplayType(obj,rowid)
	{
       //展示方式filterType： 1:维度选择 ,4:月份, 6:日期,7：时间
	    var innerHTML = "";
	    if (obj.value == '1')
	    {
	    	var dimName="";
	    	var dimId="";
            innerHTML = '<div style="float:left;width:70%" id="dimNameDiv"><span class="blue12" id="'+rowid+'_dimDiv" width="80%" value='+dimId+'>' +dimName + '</span></div>';
            innerHTML += '<div style="float:right">[<img src="'+webpath+'/resources/platform/resmanage/data/img/editfind.png" width="14" height="14" style="cursor:pointer" onclick="checkDim(this, \'' + dbId + '\', \'' + rowid + '\')" title="选择维度" align="absbottom"/> ';
            innerHTML += '<img src="'+webpath+'/resources/platform/resmanage/data/img/editdelete.png" width="14" height="14" style="cursor:pointer" onclick="deleteDim(this,\'' + rowid + '\')" title="删除选择的维度" align="absbottom"/>]</div>';
	    }
	    else if (obj.value == '4')
        {
	    	innerHTML += '<select id="'+rowid+'_expression" name="expression" class="selectFiledClass">';
	    	innerHTML += ' <option value="yyyy-MM">yyyy-MM</option>';
	    	innerHTML += ' <option value="yyyyMM">yyyyMM</option>';
	    	innerHTML += '</select>';
        }
	    else if (obj.value == '6')
        {
	    	innerHTML += '<select id="'+rowid+'_expression" name="expression" class="selectFiledClass">';
	    	innerHTML += ' <option value="yyyy-MM-dd">yyyy-MM-dd</option>';
	    	innerHTML += ' <option value="yyyyMMdd">yyyyMMdd</option>';
	    	innerHTML += '</select>';
        }
	    else if (obj.value == '7')
        {
	    	innerHTML += '<select id="'+rowid+'_expression" name="expression" class="selectFiledClass">';
	    	innerHTML += ' <option value="yyyy-MM-dd HH:mm:ss" >yyyy-MM-dd HH:mm:ss</option>';
	    	innerHTML += ' <option value="yyyyMMddHHmmss">yyyyMMddHHmmss</option>';
	    	innerHTML += '</select>';
        }
	    else
	    {
	    	innerHTML += "&nbsp;";
	    }
		$("#"+rowid,"#fieldGrid").find("td").eq(11).empty().html(innerHTML);
	}
	window.changeDisplayType = changeDisplayType;
	
	
	// 设置字段取消
	function fieldCancel() {
		// 横线高亮设置
		setStepLine(1);
		// 面板内容切换
		jQuery('#fieldInfo').addClass("hide");
		jQuery('#tableInfo').removeClass("hide");
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
		var attrData=tableConfigInfo.attrData;
		var length=attrData.length;
		for(var i=1;i<=length;i++){
			attrData[i-1].attrName = $('#' + i + '_attrName').val();
			attrData[i-1].groupId = $('#' + i + '_groupName').attr("truevalue");
			
			// 获取展示方式
			var filterType= $('#' + i + '_filterTypeDispalay').find("option:selected").val();
			attrData[i-1].filterType=filterType;
			
			// 获取维度
			attrData[i-1].dimId = $('#' + i + '_dimDiv').attr("value");
			attrData[i-1].dimId = (attrData[i-1].dimId == undefined ? "" : attrData[i-1].dimId);
			
			// 获取口径信息
			attrData[i-1].caliberId = $('#' + i + '_caliberDiv').attr("value");
			attrData[i-1].caliberId = (attrData[i-1].caliberId == undefined ? "" : attrData[i-1].caliberId);
			
			if(filterType=="1"&&attrData[i-1].dimId==""){
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.import.title.tips'),
					message: sabace.getMessage('data.connect.message.dimSelect'),
				});
				return;
			}
			
			// 获取表达式
			attrData[i-1].expression = $('#' + i + '_expression').val();
			// 获取是否使用
			var rowdata=jQuery("#fieldGrid").jqGrid('getRowData',i);
			attrData[i-1].isUsed=$(rowdata['isUsed']).attr("value");
		}
		tableConfigInfo.attrData=attrData;
		var dbParams = {
				dbId: tableConfigInfo.dbId,
				dataTable: tableConfigInfo.dataTable,
				dataName: tableConfigInfo.dataName,
				tableTime: tableConfigInfo.tableTime,
				etlDbId:tableConfigInfo.etlDbId,
				tableTimeSql:tableConfigInfo.tableTimeSql,
				classifyId: tableConfigInfo.classifyId,
			    classifyName: tableConfigInfo.classifyName,
				tableType: tableConfigInfo.tableType,
				tablesStorage: tableConfigInfo.tableStorage,
				storageField: tableConfigInfo.storageField,
				storageSql: tableConfigInfo.storageSql,
				tableDesc: tableConfigInfo.tableDesc,
				dataId: tableConfigInfo.dataId,
				opType: opType,
				classifyId: tableConfigInfo.classifyId,
			    classifyName: tableConfigInfo.classifyName,
			    attrData: JSON.stringify(tableConfigInfo.attrData),
			    dateFieldId: tableConfigInfo.dateFieldId
			    
			};
		
		var url = sabace.handleUrlParam("/platform/resmanage/data/save-table-info-direct");
		
		if(opType == "edit"){
			url = sabace.handleUrlParam("/platform/resmanage/data/save-table-data-direct");
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
					if (opType == "add") {
						toDataListPage();
					}
					if(jQuery.isFunction(window.opener.reloadDataList)){
						window.opener.reloadDataList();
					}
					dialog.close();
					window.close();
					
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
	
	//跳转到工作表管理页面
	function toDataListPage(){
		var url = sabace.handleUrlParam("/platform/resmanage/data/data-list");
		//页面跳转
		redirecPage(url,"");
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

	// tab点击选择
	function selectShow() {
		var object = jQuery(this).find(".step-title-num");
		var objId = jQuery(this).attr("id");
		// 判断当前是都是已经完成的Tab
		if (object.hasClass("active-Finished") || !object.hasClass("active-notFinished")) {
			if (objId == "tableTab") {
				// 横线高亮设置
				setStepLine(1);
				// 当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#tableInfo').removeClass("hide");
			} else if (objId == "fieldTab") {
				// 横线高亮设置
				setStepLine(2);
				// 当前隐藏
				jQuery('#' + getCurrentDisplayDiv() + '').addClass("hide");
				jQuery('#fieldInfo').removeClass("hide");
				if (jQuery('#fieldGrid').is(':empty')) {
					initFieldGrid();
				} else {
					resizeFieldGrid();
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


	// 获取当前显示面板
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
