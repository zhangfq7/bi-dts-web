define(['bace', 'view/box', 'underscore'], function(Bace, Box, _) {

    var Desgin = {
    };
    Desgin.module = {
        el:'',
        chartType:'',
        config:{
            title3:{
                "title":"线框 <span class='circle'>●</span> 背景",
                items:[
                    // {id:"indicator-style-text",   lable:"",  type:"selectcolor",position:"bottom left-30", value:"rgba(255,255,255,0.6)"},
                    {id:"indicator-style-background",   lable:"背景:",  type:"selectcolor",position:"bottom left-30", value:"红色|rgb(215, 110, 115)"},
                    /*{id:"indicator-style-border-shadow",lable:"投影:",  type:"switchbutton", value:false },*/
                ]
            },
            fontSize:{
                "title":"字体大小",
                items:[
                    {id:"indicator-style-Content_1",   lable:"指标一:",  type:"select",width:"65px",selectHTML:"<option value='12px'>12px</option><option value='14px'>14px</option><option value='16px'>16px</option><option value='18px'>18px</option><option value='24px'>24px</option><option value='36px'>36px</option>"},
                    {id:"indicator-style-Value_1",   lable:"值:",  type:"select",width:"65px",style:"position:absolute;top:0px;right:0px",selectHTML:"<option value='12px'>12px</option><option value='14px'>14px</option><option value='16px' >16px</option><option value='18px'>18px</option><option value='24px'>24px</option><option value='36px'>36px</option>"},
                    {id:"indicator-style-Content_2",   lable:"指标二:",  type:"select",width:"65px",selectHTML:"<option value='12px'>12px</option><option value='14px'>14px</option><option value='16px'>16px</option><option value='18px'>18px</option><option value='24px'>24px</option><option value='36px'>36px</option>"},
                    {id:"indicator-style-Value_2",   lable:"值:",  type:"select",width:"65px",style:"position:absolute;top:30px;right:0px",selectHTML:"<option value='12px'>12px</option><option value='14px'>14px</option><option value='16px'>16px</option><option value='18px'>18px</option><option value='24px'>24px</option><option value='36px'>36px</option>"},
                    {id:"indicator-style-Content_3",   lable:"指标三:",  type:"select",width:"65px",selectHTML:"<option value='12px'>12px</option><option value='14px'>14px</option><option value='16px'>16px</option><option value='18px'>18px</option><option value='24px'>24px</option><option value='36px'>36px</option>"},
                    {id:"indicator-style-Value_3",   lable:"值:",  type:"select",width:"65px",style:"position:absolute;top:60px;right:0px",selectHTML:"<option value='12px'>12px</option><option value='14px'>14px</option><option value='16px'>16px</option><option value='18px'>18px</option><option value='24px'>24px</option><option value='36px'>36px</option>"},
                    {id:"indicator-style-Content_4",   lable:"指标四:",  type:"select",width:"65px",selectHTML:"<option value='12px'>12px</option><option value='14px'>14px</option><option value='16px'>16px</option><option value='18px'>18px</option><option value='24px'>24px</option>"},
                    {id:"indicator-style-Value_4",   lable:"值:",  type:"select",width:"65px",style:"position:absolute;top:90px;right:0px",selectHTML:"<option value='12px'>12px</option><option value='14px'>14px</option><option value='16px'>16px</option><option value='18px'>18px</option><option value='24px'>24px</option>"}
                ]
            }
        }
    };
    Desgin.control = {
        /**
         * 描述：根据传入的容器对象渲染设计面板，并挂载相应的方法
         * @param {Object} option	容器对象的配置信息
         */
        render:function(option){
            var chartType = option.chartType;
            var chartChild = option.chartChild;
            //如果容器已经初始化
            if(option.isInit){
                var designPanel = option.config.designPanel;

                Box.Property.dataStart(designPanel);

            }else{
                var initBuild = {
                    indicator:{
                        style:{
                            background:'蓝绿色|rgb(74, 197, 213)',
                            Content_1:'18px',
                            Value_1:'36px'
                            /*content2:'16',
                            value2:'24',
                            content3:'16',
                            value3:'16',
                            content4:'12',
                            value4:'12'*/
                        }
                    }
                };
                switch(chartChild){
                    case "two" : _.extend(initBuild.indicator.style,{Content_1:'16px', Value_1:'24px', Content_2:'16px', Value_2:'16px'});
                        break;
                    case "three" : _.extend(initBuild.indicator.style,{Content_1:'16px', Value_1:'24px', Content_2:'16px', Value_2:'16px', Content_3:'16px', Value_3:'16px'});
                        break;
                    case "four" : _.extend(initBuild.indicator.style,{Content_1:'16px', Value_1:'24px', Content_2:'16px', Value_2:'16px', Content_3:'16px', Value_3:'16px', Content_4:'14px', Value_4:'14px'});
                        break;
                }
                //Box.Property.dataStart(initBuild);
                option.config.designPanel = initBuild;
            }
        },
        /**
         * 描述：设计面板组件发生变化，会触发此方法
         * @param {String} $el	容器对象
         * @param {String} id	发生变化的组件ID
         * @param {String} val  发生变化所产生的值
         * @param {Object} prop 基于id-val生成的对象，如果line-color:red=>{line:{color:red}}
         */
        change:function($el,id,val,prop){
            var option = $el.data("option");
            if(id == "indicator-style-background") {
                var text=val.split("|")[0];
                var choseColor=val.split("|")[1];
                $el.css({
                    "background": choseColor
                });
                $("#"+id).find("span").html(text);
                $("#"+id).find("b").css("background",choseColor);
            }else{
                var idNum = id.split("_")[1];
                var idClass = id.split("-")[2];
                $el.find(".fontSizeChange"+idClass).css({"fontSize" : val});
            }
            $.extend(true,option.config.designPanel, prop);

        },

        getConfig:function(){
            return Desgin.module.config;
        }
    }
    return Desgin.control;
})