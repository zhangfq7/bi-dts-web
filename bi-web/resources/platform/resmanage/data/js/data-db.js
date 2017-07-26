define(['sabace'], function(sabace) {



	var DBInfo = {};
	
	DBInfo.view = {
		init:function(type,dbId){
			DBInfo.type = type;
			DBInfo.dbId = dbId;
			
			if(DBInfo.type == "add"){
				jQuery('#dataSource').removeClass("hide");
			}else{
				jQuery('#dbInfo').removeClass("hide");
			}
			
			//数据库类型选择点击事件
			jQuery("#dbSelect .pic").on('click',function(){
				jQuery("#dbSelect .pic .dbCheck").removeClass('check');
				jQuery("#dbSelect .pic .dbCheck").addClass('hide');
				jQuery("#dbSelect .pic").css("border","1px solid #E9E9E9");
				jQuery(this).css("border","1px solid rgba(23,153,236,0.65)");
				jQuery(this).find(".dbCheck").removeClass('hide');
				jQuery(this).find(".dbCheck").addClass("check");
				var db = jQuery(this).attr('id');
				jQuery("#dbType").val(db);
				jQuery('#icon-database').removeClass().addClass(db+'-icon');
				DBInfo.view.getDbBaInfo(db);
			})
			
			//表单校验
			jQuery('#dbForm').validationEngine({
				autoHidePrompt: true,
				autoHideDelay: 2000,
				binded: true,
				promptPosition: 'bottomLeft',
				showOneMessage: true
			});
			
			//'数据库类型'下拉框初始化
		//	jQuery('#dbType').chosen();
            jQuery('#projectId').chosen({
                disable_search: true,
				width:'280px'
            });
			
			//当为修改时加载页面信息
			if(DBInfo.type == 'edit' || DBInfo.type == 'view'){
				jQuery("#dbType").attr("disabled",true); 
				jQuery("#dbInterfaceFlag").attr("disabled",true); 
				if(DBInfo.type == 'view'){
				/*	jQuery("#dbName").attr("disabled",true); 
					jQuery("#dbURL").attr("disabled",true); 
					jQuery("#dbDriver").attr("disabled",true); 
					jQuery("#dbUser").attr("disabled",true); 
					jQuery("#dbPassword").attr("disabled",true); */
					jQuery("#dbName,#dbURL,#dbDriver,#dbUser,#dbPassword,#dbSchema,#dbSpace,#dbAlias,#dbDesc,#dbInterfaceFlag,#isDurable").remove(); 
					var paramArr = ['.dbName-div','.dbURL-div','.dbDriver-div','.dbUser-div','.dbPassword-div','.dbSchema-div','.dbSpace-div','.dbAlias-div','.dbDesc-div','.dbInterfaceFlag-div','.isDurable-div'];
					
					jQuery('.dbName-div').append('<label class="lable-v"  id="dbName"></label>');
					jQuery('.dbURL-div').append('<label class="lable-v" id="dbURL"></label>');
					jQuery('.dbDriver-div').append('<label class="lable-v"  id="dbDriver"></label>');
					jQuery('.dbUser-div').append('<label class="lable-v"  id="dbUser"></label>');
					jQuery('.dbPassword-div').append('<label class="lable-v"  id="dbPassword"></label>');
					jQuery('.dbSchema-div').append('<label  class="lable-v" id="dbSchema"></label>');
					jQuery('.dbSpace-div').append('<label  class="lable-v" id="dbSpace"></label>');
					jQuery('.dbAlias-div').append('<label  class="lable-v" id="dbAlias"></label>');
					jQuery('.dbInterfaceFlag-div').append('<label  class="lable-v" id="dbInterfaceFlag"></label>');
					jQuery('.dbDesc-div').append('<label  class="lable-v" id="dbDesc"></label>');
					jQuery('.isDurable-div').append('<label  class="lable-v" id="isDurable"></label>');
					
				}
				initDataInfo(DBInfo.type);
			}
		},
		next: function(){
			if(jQuery("#dbSelect .pic .check").length > 0){
				var db = jQuery("#dbSelect .pic .check").parent().attr('id');
				jQuery("#dbType").val(db);
				DBInfo.view.getDbBaInfo(db);
				jQuery('#dataSource').addClass("hide");
				jQuery('#dbInfo').removeClass("hide");
				DBInfo.flag = true;
			}else{
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
		            title: sabace.getMessage('data.db.title.tips'),
		            message: sabace.getMessage('data.db.message.dataSourceType')
			    });
				DBInfo.flag = false;
			}
		},
		reSelect: function(){
			jQuery("#dbName").val("");
			jQuery("#dbType").val("");
			jQuery("#dbURL").val("");
			jQuery("#dbDriver").val("");
			jQuery("#dbUser").val("");
			jQuery("#dbPassword").val("");
			jQuery('#dataSource').removeClass("hide");
			jQuery('#dbInfo').addClass("hide");
		},
		test: function(){
			editDB("test");
		},
		save: function(func){
			editDB(DBInfo.type,func);
		},
		getDbBaInfo:function(dbTypeId){
			getDbInfoByDbType(dbTypeId)
		}
	};
	
	/**
	 * 根据不同的数据库类型给它添加基本的信息
	 */
	function getDbInfoByDbType(dbTypeId){
		var dbDriver;
		var dbUrl;
		switch(dbTypeId) {
			case 'oracle':
				dbUrl = "jdbc:oracle:thin:@localhost:1521:databasename";
				dbDriver = "oracle.jdbc.driver.OracleDriver";
				break;
			case 'db2':
				dbUrl = "jdbc:db2://localhost:50001/databasename";
				dbDriver = "com.ibm.db2.jcc.DB2Driver";
				break;
			case 'mysql':
				dbUrl = "jdbc:mysql://localhost:3306/databasename";
				dbDriver = "com.mysql.jdbc.Driver";
				break;
			case 'postgresql':
				dbUrl = "jdbc:postgresql://localhost:5432/databasename";
				dbDriver = "org.postgresql.Driver";
				break;
			case 'spark':
				dbUrl = "jdbc:hive2://localhost:10000/databasename";
				dbDriver ="org.apache.hive.jdbc.HiveDriver"
				break;
			default:
				dbDriver = "";
			    dbUrl = "";
		}
		jQuery('#dbURL').val(dbUrl);
		jQuery('#dbDriver').val(dbDriver);
	}
	
	//当为修改时加载页面信息
	function initDataInfo(type){
		//向后台发送请求获取数据库信息
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/db/data-db-singleInfo"),
			data: { 
				dbId: DBInfo.dbId 
			},
			success: function(req) {
				jQuery("#icon-database").removeClass();
				jQuery("#icon-database").addClass(req.dbInfo.dbType+'-icon')
				//查看
				if('view' == type){
					jQuery("#dbName").prop('title',req.dbInfo.dbName);
					jQuery("#dbName").html(req.dbInfo.dbName);
					jQuery("#dbURL").prop('title',req.dbInfo.dbUrl);
					jQuery("#dbURL").html(req.dbInfo.dbUrl);
					jQuery("#dbDriver").prop('title',req.dbInfo.dbDriver);
					jQuery("#dbDriver").html(req.dbInfo.dbDriver);
					jQuery("#dbUser").prop('title',req.dbInfo.dbUser);
					jQuery("#dbUser").html(req.dbInfo.dbUser);
					jQuery("#dbPassword").prop('title',req.dbInfo.dbPassword);
					jQuery("#dbPassword").html(req.dbInfo.dbPassword);
					jQuery("#dbSchema").prop('title',req.dbInfo.dbSchema);
					jQuery("#dbSchema").html(req.dbInfo.dbSchema);
					jQuery("#dbSpace").prop('title',req.dbInfo.dbSpace);
					jQuery("#dbSpace").html(req.dbInfo.dbSpace);
					jQuery("#dbAlias").prop('title',req.dbInfo.dbAlias);
					jQuery("#dbAlias").html(req.dbInfo.dbAlias);
					jQuery("#dbInterfaceFlag").prop('title',req.dbInfo.interfaceFlag);
					if(req.dbInfo.interfaceFlag=='2'){
						jQuery("#dbInterfaceFlag").html("直连数据库");
					}
					else if(req.dbInfo.interfaceFlag=='1'){
						jQuery("#dbInterfaceFlag").html("DACP抽取");
					}
					else if(req.dbInfo.interfaceFlag=='0'){
						jQuery("#dbInterfaceFlag").html("普通抽取");
					}
					
					jQuery("#dbDesc").prop('title',req.dbInfo.dbDesc);
					jQuery("#dbDesc").html(req.dbInfo.dbDesc);
					jQuery("#isDurable").prop('title',req.dbInfo.isDurable); 
					if(req.dbInfo.isDurable=='0'){
						jQuery("#isDurable").html("否");
					} 
					else if(req.dbInfo.isDurable=='1'){
						jQuery("#isDurable").html("是");
					 }
				}else{//修改
					jQuery("#dbName").val(req.dbInfo.dbName);
					jQuery("#dbType").val(req.dbInfo.dbType);
					jQuery("#dbURL").val(req.dbInfo.dbUrl);
					jQuery("#dbDriver").val(req.dbInfo.dbDriver);
					jQuery("#dbUser").val(req.dbInfo.dbUser);
					jQuery("#dbPassword").val(req.dbInfo.dbPassword);
					jQuery("#dbSchema").val(req.dbInfo.dbSchema);
					jQuery("#dbSpace").val(req.dbInfo.dbSpace);
					jQuery("#dbAlias").val(req.dbInfo.dbAlias);
					jQuery("#dbInterfaceFlag").val(req.dbInfo.interfaceFlag);
					jQuery("#dbDesc").val(req.dbInfo.dbDesc);
					jQuery("#isDurable").val(req.dbInfo.isDurable);
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.db.title.tips'),
					message: req.responseText || sabace.getMessage('data.db.message.dataSourceError')
				});
			}
		});
	}
	
	//数据库配置连接测试及数据库配置保存
	function editDB(type,func){
		var errorMsg = sabace.getMessage('data.db.message.saveDataSourceError');
		if("text"==type){
			errorMsg = sabace.getMessage('data.db.message.connectFail');
		}
		var isPass = jQuery('#dbForm').validationEngine('validate');
		if(!isPass){
			return false;
		}
		//判断数据库类型是否有值
		if(jQuery("#dbType").val()==""){
			bi.dialog.show({
				type: bi.dialog.TYPE_DANGER,
	            title: sabace.getMessage('data.db.title.tips'),
	            message: sabace.getMessage('data.db.message.databaseType')
		    });
			return false;
		}
		//获取页面属性值
		var dbName = jQuery.trim(jQuery("#dbName").val());
		var dbType = jQuery("#dbType").val();
		var dbURL = jQuery.trim(jQuery("#dbURL").val());
		var dbDriver = jQuery.trim(jQuery("#dbDriver").val());
		var dbUser = jQuery.trim(jQuery("#dbUser").val());
		var dbPassword = jQuery.trim(jQuery("#dbPassword").val());
		var dbSchema = jQuery.trim(jQuery("#dbSchema").val());
		var dbSpace = jQuery.trim(jQuery("#dbSpace").val());
		var dbAlias = jQuery.trim(jQuery("#dbAlias").val());
		var dbDesc = jQuery.trim(jQuery('#dbDesc').val());
		var dbInterfaceFlag = jQuery.trim(jQuery('#dbInterfaceFlag').find("option:selected").val());
		var isDurable = jQuery.trim(jQuery('#isDurable').find("option:selected").val());
		var proId = jQuery.trim(jQuery('#projectId').find("option:selected").val())
		
		var dataParams={
			dbId: DBInfo.dbId,
			dbName: dbName,
			dbUrl: dbURL,
			dbType: dbType,
			dbDriver: dbDriver,
			dbUser: dbUser,
			dbPassword: dbPassword,
			dbSchema: dbSchema,
			dbSpace: dbSpace,
			dbAlias: dbAlias,
			interfaceFlag:dbInterfaceFlag,
			dbDesc:dbDesc,
			isDurable: isDurable,
			type: type,
            proId:proId
			
		};
		var msg = "";
		//向后台发送请求
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/db/data-db-edit"),
			data: dataParams,
			loading: {
				title: sabace.getMessage('data.db.title.execute'),
				text: sabace.getMessage('data.db.loading.text')
			},
			success: function(req) {
				saveInfoSuccess(req);
				if(func){
					func();
				}
			},
			error: function(req) {
				bi.dialog.show({
					type: bi.dialog.TYPE_DANGER,
					title: sabace.getMessage('data.db.title.tips'),
					message: req.responseText || sabace.getMessage('data.db.message.saveDataSourceError')  
				});
			}
		});
	}
	
	// 保存信息请求成功后处理
	function saveInfoSuccess(req){
		if(req.retFlag == "0"){
			msg = sabace.getMessage('data.db.message.connectFail');
		} else if(req.retFlag == 1){
			msg = sabace.getMessage('data.db.message.connectSuccess');
		} else if(req.retFlag == 2){
			msg = sabace.getMessage('data.db.message.mismatch');
		} else if(req.retFlag == 3){
			msg = sabace.getMessage('data.db.message.saveSuccess');
		} else if(req.retFlag == 4){
			msg = sabace.getMessage('data.db.message.dataNameRepeat');
		}
		bi.dialog.show({
            title: sabace.getMessage('data.db.title.tips'),
            message: msg,
            onshown:function(dialog){
            	if(req.retFlag == 3){
            		dialog.setButtons([{
		                label: sabace.getMessage('data.db.label.sure'),
		                cssClass: 'btn-info',
		                action: function(){
		                	window.parent.bi.dialog.closeAll();
		                }
		            }]);
            	}
			},
	    });
	}
	
	DBInfo.control = { 
		init:function(type,dbId){
			DBInfo.view.init(type,dbId);
		},
		next:function(){
			DBInfo.view.next();
			return DBInfo.flag;
		},
		reSelect:function(){
			DBInfo.view.reSelect();
		},
		test:function(){
			DBInfo.view.test();
		},
		save:function(func){
			DBInfo.view.save(func);
		}
	};
	
	//返回页面所需方法
	return DBInfo.control;
});
