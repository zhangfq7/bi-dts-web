define(['sabace','jqGrid','dialog'], function(sabace,jqGrid,dialog) {
	
     jQuery(function(){
		jQuery('#add').on("click",fileImport);
//		initContext();
	});
	
	function fileImport(){
		var url = webpath + "/platform/resmanage/data/addPage";
		//文件导入对话框
		bi.dialog.show({
            title: '新建分组',
            message: '<iframe id="fileIframe" frameborder="0" width="600" height="310" style="margin:-16px 0px 0px -14px;" src="' + url + '"></iframe>',
            cssClass: 'data-import-dialog',
            buttons: [{
                id: 'btn-1',
                label: '确定',
                cssClass: 'btn-primary',
            }]
	    });
	}
	

 jQuery(document).ready(function($) {
			jQuery('#tree').jqGrid({
				url:webpath + "/platform/resources/resmanage/data/fonts/data.json",
				styleUI : 'Bootstrap',
				colModel:[
				           {name:"category_id",index:"accounts.account_id",sorttype:"int",key:true,hidden:true,width:50},
				           {name:'',index:'gender',formatter: "checkbox",formatoptions:{disabled:false},width:30},
				           {name:"name",index:"name",sorttype:"string",label:"分组名称",search:"true",width:170},
				           {name:"description",index:"description",sorttype:"string",label:"分组描述",width:170,align:"left"},
				           {name:"founder",index:"founder",sorttype:"int",label:"创建人",width:90,align:"left"},
				           {name:"foundtime",index:"foundtime",sorttype:"string",label:"创建时间",width:150},
				           {name:"lft",hidden:true},
				           {name:"rgt",hidden:true},
				           {name:"level",hidden:true},
				           {name:"uiicon",hidden:true}
				    	   ],
						autowidth:true,
						hoverrows:false,
						viewrecords:false,
						gridview:true,
						height:"auto",
						sortname:"lft",
						loadonce:true,
						rowNum:100,
						scrollrows:true,
						// enable tree grid
						treeGrid:true,
						// which column is expandable
						ExpandColumn:"name",
						// datatype
						treedatatype:"json",
						// the model used
						treeGridModel:"nested",
						// configuration of the data comming from server
						treeReader:{
							left_field:"lft",
							right_field:"rgt",
							level_field:"level",
							leaf_field:"isLeaf",
							expanded_field:"expanded",
							loaded:"loaded",
							icon_field:"icon"
						},
						sortorder:"asc",
						datatype:"json",
						pager:"#pager",
						ExpandColClick:true,
                        loadComplete:function(rowId,data){
							jQuery(".ui-jqgrid-hbox >table >thead >tr >th:eq(1)").append('<input id="setAll"  type="checkbox">');
							jQuery("#setAll").bind("click",function(){
								var _this  = $(this);
								log(_this.prop('checked'))
								if(_this.prop('checked')){//true
									//选中所有的复选框
									jQuery("table input:checkbox").prop("checked",true);
								}else{
									jQuery("table input:checkbox").prop("checked",false);
								}
							});
							
						}

					}); 
			
 });

});

