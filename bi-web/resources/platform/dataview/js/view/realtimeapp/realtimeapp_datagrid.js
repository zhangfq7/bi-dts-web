/**
 * Created by shaojs on 2016/10/24.
 * desc 实时应用页面 datagrid 方法分装,和展示页面公用,所以提出来
 */
define(['bace', 'view/box'],function (Bace,Box) {
    var grid = {};

    var gridDefault = {
        striped:true,
        method:"post",
        nowrap:true,
        url:Bace.handleUrlParam("/platform/dataview/openapi-apply"),
        /*data:[{phone:"123",phone_time:123},{phone:"123",phone_time:123},{phone:"123",phone_time:123},{phone:"123",phone_time:123},{phone:"123",phone_time:123}],*/
        queryParams:{},
        loadMsg:"正在加载数据,请稍后...",
        emptyMsg:"暂无数据",
        pagination:true,
        rownumbers:true,
        pageSize:30,
        pageList:[30],
        //loadFilter:function(){}
    };

    grid.control = {
        init:function(config){
            var currentConfig = {};
            //如果有表格,则先获取当前的表格配置
            if($("#table_container").hasClass("datagrid-f")){
                currentConfig = $("#table_container").datagrid("options");
            }
            config = $.extend(currentConfig,gridDefault,config);

            $("#table_container").datagrid(config);
        }
    };

    grid.view = {

    };
    return grid.control;

});
