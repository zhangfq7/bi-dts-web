define(['bace','view/box','view/component/dateFormatUtil','view/component/CalcUtil','view/component/levelUtil','view/component/PersonalAttr'],
    function (Base,Box,dateFormatUtil,CalcUtil,LevelUtil,PersonalAttr) {
    var PersonalizeChoose = {};

    PersonalizeChoose.control = {
        show: function (type) {
            if(!jQuery("#personalizeChoose")[0]){
                jQuery("body").append("<div id='personalizeChoose' style='display:none;position: relative'></div>");
            }
            jQuery("#personalizeChoose").load(Base.handleUrlParam('/platform/dataview/format/personalize-choose'), function () {
                PersonalizeChoose.view.show();
                if(type == '0'){
                    $(".derive-attr").show();
                    $(".derive-dim").hide();
                } else if(type == '1'){
                    $(".derive-dim").show();
                    $(".derive-attr").hide();
                }
                PersonalizeChoose.view.bindEvent();
            })
        }
    };

    PersonalizeChoose.view = {
        show:function(){
            $.dialog({
                id: 'chooseDialog',
                title: '选择类型',
                padding: '0',
                width: '440px',
                height: '260px',
                lock: true,
                content: jQuery("#personalizeChoose")[0]
            });
        },
        bindEvent:function(){
            $(".calculate-attr").on('click',function(){
                $.dialog.closeAll();
                // 打开新增计算指标面板时关闭属性面板，否则拖动指标会存在重复生成的问题
                jQuery("#propertyPanel").hide();
                CalcUtil.show(Box.main.dataId);
            });

            $(".personalized-attr").on('click',function(){
                $.dialog.closeAll();
                jQuery("#propertyPanel").hide();
                PersonalAttr.show(Box.main.dataId);
            });

            $(".date-format").on('click', function () {
                $.ajax({
                    url:Base.handleUrlParam('/platform/dataview/format/has-date-attr'),
                    data:{
                        dataId:Box.main.dataId,
                        dataType:Box.main.dataType
                    },
                    success: function (resp) {
                        if(resp.dateAttrNum > 0){
                            $.dialog.closeAll();
                            jQuery("#propertyPanel").hide();
                            dateFormatUtil.show();
                        } else {
                            $.dialog.alert("该数据源不存在日期指标，无法进行时间格式化");
                        }
                    },
                    error: function () {
                        $.dialog.alert("系统异常，请联系管理员");
                    }
                })

            });

            $(".dim-band").on('click', function () {
                $.dialog.closeAll();
                jQuery("#propertyPanel").hide();
                LevelUtil.show('','','','','','','1');
            })
        }
    };

        return PersonalizeChoose.control;
});