/**
 * Created by shaojs on 2016/10/24.
 * desc 实时应用的过滤条件模块
 */

/**
 * Created by shaojs on 2016/10/24.
 * desc 实时应用页面 datagrid 方法分装,和展示页面公用,所以提出来
 */
define(['bace', 'view/box','underscore',"chosen"],function (Bace,Box,_) {
    var filter = {};


    filter.control = {
        init:function(filters,apiBaseInfo){
            filter.view.rander(filters,apiBaseInfo);
        },
        collect:function (mode) {
            //mode "query"收集查询参数 "save"收集保存参数 "exec" 收集应用时参数
            mode = mode || "query";
            var filterDoms = $(".filter-panel .input_cell","#filterPanel");
            var filterStr = filterDoms.map(function (index) {
                var $this = $(this);
                if($this.find(".textinputer")[0]){
                    var $target = $this.find(".textinputer");
                    return {
                        paramRuleType: $target.data("ruletype"),
                        paramName:$target.attr("name"),
                        paramCode:$target.attr("id"),
                        paramRuleData:$target.val(),
                        paramType:$target.data("paramtype"),
                        isDes:$target.data("isdes")
                    }
                }else{
                    var $target = $this.find("select");
                    //多值的时候取值是用逗号分隔的,现在改成双竖线分隔
                    return {
                        paramRuleType: $target.data("ruletype"),
                        paramName:$target.attr("name"),
                        paramCode:$target.attr("id"),
                        paramRuleData:($target.val()||[]).join("||"),
                        paramType:$target.data("paramtype"),
                        isDes:$target.data("isdes")
                    };
                }
            }) || [];
            switch (mode){
                case "query":
                    return JSON.stringify([].slice.call(filterStr));
                    break;
                case "exec":
                    return "";
                    break;
                default:
                    return "";
            }
        }
    };

    filter.view = {
        rander:function (filters, apiBaseInfo) {
            var container = $(".filter-panel","#filterPanel");
            //先清空
            container.empty();
            //select控件计数器,需要初始化的select个数
            var selCount =0;
            //构建filter组件
            var filterStr = _.map(filters,function (e, i) {
                console.log(e);
                var inputStr = null;
                var ruleType = e.paramRuleType;
                if(ruleType == "1"){
                    inputStr=  '<input type="text" class="textinputer" data-ruletype="{{paramRuleType}}" data-paramtype="{{paramType}}" data-isdes="{{isDes}}" name="{{paramName}}" id="{{paramCode}}" value="'+ (new Date()).format(e.paramRuleData) + '" disabled />';
                } else if(ruleType == "2") {
                    selCount += 1;
                    inputStr= '<select style="width:100%" multiple name="{{paramName}}" data-ruletype="{{paramRuleType}}" data-paramtype="{{paramType}}" data-isdes="{{isDes}}" id="{{paramCode}}" class="dim-select' + selCount + '" data-placeholder="请选择维度"></select>';
                } else {
                    inputStr= '<input type="text" class="textinputer" data-ruletype="{{paramRuleType}}" data-paramtype="{{paramType}}" data-isdes="{{isDes}}" name="{{paramName}}"  id="{{paramCode}}" />'
                }
                var htmlStr = "<div class='filter_can'><div class='label_cell'><label class='filter_name' title='{{paramName}}'>{{paramName}}({{paramCode}}) :</label></div><div class='input_cell'>"+ inputStr +"</div></div>";
                return Bace.buildString(htmlStr,e);
            });

            container.html(filterStr.join(""));

            // 对下拉框的处理
            if(selCount > 0){
                for(var n = 1; n <= selCount; n++){
                    jQuery('.dim-select' + n,"#filterPanel").chosen({
                        disable_search: false
                    });
                    var paramCode = jQuery('.dim-select' + n,"#filterPanel").attr('id');
                    jQuery('.dim-select' + n,"#filterPanel").ajaxChosen({
                        fields: ['code','value'],
                        findPage: true,
                        disabled: false,
                        url : Bace.handleUrlParam('/platform/openapi/query-dim-info') + '?paramCode=' + paramCode + '&paramInfoStr=' + JSON.stringify(filters) + '&apiBaseInfoStr=' + JSON.stringify(apiBaseInfo) + '&_t=' + (new Date()).getTime()
                    });
                }
            }

            //filter构建结束之后,重新计算布局,防止过滤器布局溢出
            window.myLayout.resizeAll();
        },
        bindEvents:function(){

        }
    };
    return filter.control;
});
