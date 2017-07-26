define(['view/box', 'bace', 'validation'],
    function (Box, Bace) {
        var dateFormatUtil = {};
        var formatRule;
        dateFormatUtil.module = {};
        dateFormatUtil.control = {
            init: function () {
                dateFormatUtil.control.getGroup();
            },
            show: function () {
                if(!jQuery("#dateFormatPanel")[0]){
                    jQuery("body").append("<div id='dateFormatPanel' style='display:none;position: relative'></div>");
                }
                jQuery("#dateFormatPanel").load(Bace.handleUrlParam('/platform/dataview/format/new-date-format') + "?dataId=" + Box.main.dataId + "&dataType=" + Box.main.dataType, function () {
                    dateFormatUtil.control.init();
                    dateFormatUtil.view.show();
                    dateFormatUtil.view.bindEvent();
                })
            },
            //获取指标分组
            getGroup: function () {
                // 初始化树选择
                var $attrGroup = jQuery("#attrGroup");
                $attrGroup.treeselect({
                    height: 200,
                    chkStyle: "radio",
                    searchAjaxParam: "groupName",
                    width: ($attrGroup.width() + 21),
                    zindex: 99999,
                    url: Bace.handleUrlParam('/platform/resmanage/data/data-query-group'),
                    onCheck:function(){
                        $("#div" + this.id).fadeOut("fast");
                    }
                });
            }
        };
        dateFormatUtil.view = {
            show: function () {
                $.dialog({
                    id: 'dateFormatDialog',
                    title: '新增时间格式化',
                    padding: '0',
                    width: '400px',
                    height: '260px',
                    lock: true,
                    content: jQuery("#dateFormatPanel")[0],
                    cancelVal: '取消',
                    okVal: '保存',
                    ok: function () {
                        var isPass = $('.formatBox').validationEngine('validate');
                        if (!isPass) {
                            return false;
                        }
                        if ("" == formatRule || null == formatRule || undefined == formatRule) {
                            $.dialog.alert("请选择时间格式");
                            return false;
                        }
                        var attrDataId = jQuery("#dateAttr").find("option:selected").attr("dataId");//绑定在指标上的数据源编码，区分视图
                        var fieldName = jQuery("#dateAttr").find("option:selected").attr("fieldName");//绑定在指标上的数据源编码，区分视图
                        $.dialog.confirm("您确定保存该时间格式化指标吗？", function () {
                            $.ajax({
                                url: Bace.handleUrlParam('/platform/dataview/format/save-date-format-attr'),
                                contentType: 'charset=utf-8',
                                data: {
                                    dataId: Box.main.dataId,
                                    dataType:Box.main.dataType,
                                    attrId: jQuery("#dateAttr option:selected").val(),
                                    viewAttrId:attrDataId + "." + fieldName,
                                    attrDataId:attrDataId,
                                    dateFormatName: encodeURIComponent(jQuery("#formatName").val()),
                                    groupId: jQuery("#attrGroup").attr("trueValue"),
                                    formatRule: formatRule
                                },
                                success: function (resp) {
                                    if(resp.retFlag == "success"){
                                        $.dialog.alert('新增时间格式化成功');
                                        Box.AttrTree.viewInit();
                                        $.dialog.closeAll('dateFormatDialog');
                                    } else {
                                        $.dialog.alert('新增时间格式化失败');
                                    }
                                },
                                error: function (req) {
                                    $.dialog.alert('系统异常，新增时间格式化失败，请稍后重试');
                                    return false;
                                }
                            })
                        });
                        return false;
                    },
                    cancel: function () {
                        return true;
                    }
                });
            },
            bindEvent: function () {
                //动态加载时间格式
                jQuery("#dateAttr").on('change', function () {
                    var filterType = jQuery("#dateAttr").find("option:selected").attr("filterType");
                    //过滤类型：7-时间（yyyy-mm-dd hh:mm:ss），6-日期(yyyy-mm-dd)，4-月份(yyyy-mm)
                    if (filterType == 7) {
                        jQuery("#formatRuleGroup").children().css("display", "inline-block");
                    } else if (filterType == 6) {
                        jQuery("#day").css("display", "none").siblings().css("display", "inline-block");
                    } else if (filterType == 4) {
                        jQuery("#year").css("display", "inline-block").siblings().css("display", "none");
                    } else {
                        jQuery("#formatRuleGroup").children().css("display", "none");
                    }
                });
                jQuery("#formatRuleGroup").on("click", ".formatRuleButton", function (e) {
                    $(this).addClass("active").siblings().removeClass("active");
                    formatRule = $(this).text();
                });
                //校验样式初始化
                jQuery('.formatBox').validationEngine({
                    autoHidePrompt: true,
                    autoHideDelay: 2000,
                    binded: true,
                    promptPosition: 'bottomLeft',
                    showOneMessage: true
                })
            }
        }
        return dateFormatUtil.control;
    })