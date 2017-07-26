/**
 * Created by gaoya on 2016/10/24.
 */
define(['bace','view/box','lang','plugins','ui','adapter'],function(Bace,Box){
    Box.Widgets.plugins.text = {
        // 插件类型
        type:'text',
        flag:false,
        init:function(){
            // 只允许初始化一次
            if(!Box.Widgets.plugins.text.flag){
                settingPanelEvent();
                Box.Widgets.plugins.text.flag = true;
            }
        },
        apply:function (option,isPass,isView) {
            var $container = $("#"+option.el);
            if(!isView){
                $container.find(".chart").append('<div>'+option.config.build.textStr+'</div>');
                $("#tableChartPanel").off("mouseenter").off("mouseleave").off("click");
                /*$("#tableChartPanel").off("mouseleave");
                $("#tableChartPanel").off("click");*/

            }else{
                $container.css("border","none");
                $container.find("div.chart.text").append('<div class="text-editor"></div>').find("i").remove();
                Box.Widgets.plugins.text.editorFormat($container.find("div.chart.text"));
                $container.find(".text-editor p").replaceWith(option.config.build.textStr);
                $container.data("option",option);
            }
        },
        contanier:{
            // 容器工具
            getTools:function(page){
                page = page || "main";
                switch(page){
                    case "main" :
                        return '<div class="chart-icon move" title="按住我，拖动！"><i class="iconfont icon-move" ></i></div><div class="chart-icon removeSelfChart del" title="移除"><i class="iconfont icon-delete" ></i></div>';
                        break;
                    default :
                        return [];
                }
            },

            // 容器改变大小方法
            resize:{
                start:function(){
                },
                reisze:function(el){
                    Box.Widgets.plugins.text.editorSizeChange(el);
                },
                stop:function(el){
                    Box.Widgets.plugins.text.editorSizeChange(el);
                }
            }
        },
        // 删除容器
        destory:function(el){
            var $this = $("#"+el);
            $this.remove();
        },
        //初始化文本编辑器
        editorFormat:function($this){
            var editorHeight=parseFloat($this.parentsUntil("#tableChartPanel").css("height"))-15;
            var idName="texteditor_"+(new Date()).getTime();//生成文本编辑框的id

            $this.find(".text-editor").attr("id",idName);
            var um = UM.getEditor(idName,{
                toolbar:['undo redo bold italic underline strikethrough superscript subscript forecolor backcolor removeformat insertorderedlist insertunorderedlist selectall cleardoc paragraph fontfamily fontsize justifyleft justifycenter justifyright horizontal '],
                autoHeightEnabled: false,
                initialFrameHeight:editorHeight,
                initialFrameWidth:"100%",
            });
            $(".edui-body-container").css({"width":"100%"});
            Bace.autoScroll($("#"+idName));
        },
        //拖拽过程中文本编辑器状态改变
        editorSizeChange:function(el){
            var $el = $("#"+el);
            var $elHeight=parseFloat($el.css("height"))-15+"px";
            $el.find(".edui-container").css("height",$elHeight);
            $el.find(".edui-editor-body").css("height",$elHeight);
            $el.find(".edui-body-container").css("height",$elHeight);
        }
    };
    function settingPanelEvent(){
        $("#tableChartPanel").on('click', '.text', function() {
            if(!$(".text-editor",this)[0]){
                var $this=$(this);
                $this.parentsUntil("#tableChartPanel").css("background","#fff");
                $this.parent().css("border","none");
                $this.append('<div class="text-editor"></div>').find("i").remove();
                Box.Widgets.plugins.text.editorFormat($this);
            }
            //挂载数据
            var el = $(this).parent().attr("id");
            $(this).parent().data("option", {
                chartChild: "",
                chartType: "text",
                config: {
                    build: {
                        dataParams: {
                            dataId: "",
                            chartType: "text"
                        }
                    }
                },
                el: el,
                isInit: true,
                mapType: ""
            });
        });
        $("#tableChartPanel").on('mouseenter', '.text,.edui-toolbar', function () {
            $(".edui-toolbar", this).css("display", "block");
        });
        $("#tableChartPanel").on('mouseleave', '.text,.edui-toolbar', function () {
            $(".edui-toolbar", this).css("display", "none");
        });
    }
});