define(['view/box', 'bace', 'view/attr', 'view/component/ConditionSet'],
    function (Box, Base, Attr, ConditionSet) {
        var PersonalAttr = {};
        PersonalAttr.module = {
            ATTRCLASS: {
                COMMON: 0, //普通指标
                CUSTOM: 1, //自定义指标
                REPORT: 2, //自定义计算指标
                FORMAT: 3, //自定义日期格式化指标
                PERSONAL: 4 //自定义指标(case when)
            },
            attrId: ""//为修改预留
        };
        PersonalAttr.control = {
            init: function () {
                //表单验证
                jQuery('.personal-attr-sub').validationEngine({
                    autoHidePrompt: true,
                    autoHideDelay: 2000,
                    binded: true,
                    promptPosition: 'bottomLeft',
                    showOneMessage: true
                });
                //获取指标分组
                PersonalAttr.control.getGroup();

                //初始化tab
                PersonalAttr.view.initTabs();

                $("#addTab").click();
            },

            componentInit: function () {
                //初始化结果区域可拖放
                PersonalAttr.control.installResultDrop();

                //初始化常量可拖拽
                PersonalAttr.control.initInputDrag();

                //初始化条件区域符号可拖放
                PersonalAttr.control.initSymbolDrag();

                //初始化条件区域可拖放
                //PersonalAttr.control.installConditionDrop();

                //初始化条件区域可排序
                PersonalAttr.control.installConditionSort();

                PersonalAttr.view.bindEvent();
            },
            show: function () {
                if (!jQuery("#personalAttr")[0]) {
                    jQuery("body").append("<div id='personalAttr' style='display:none;position: relative'></div>");
                }
                jQuery("#personalAttr").load(Base.handleUrlParam('/platform/dataview/format/personal-attr-page'), function () {
                    PersonalAttr.view.show();
                    PersonalAttr.control.init();
                })
            },
            //获取指标分组
            getGroup: function () {
                $("#personalAttrGroup").treeselect({
                    zindex: "99999",
                    height: 200,
                    searchAjaxParam: "groupName",
                    chkStyle: "radio",
                    width: (jQuery('#personalAttrGroup').width() + 21),
                    url: Base.handleUrlParam('/platform/resmanage/data/data-query-group'),
                    onCheck: function () {
                        $("#div" + this.id).fadeOut("fast");
                    }
                });
            },

            //初始化结果区域可拖放
            installResultDrop: function () {
                $(".resultArea").droppable({
                    drop: function (event, ui) {
                        var $helper = ui.helper;
                        var attrId = $helper.attr("data-attrId") || "";
                        var attrName = $helper.attr("data-attrName") || "";
                        var attrType = $helper.attr("data-attrType") || "";
                        var attrClass = $helper.attr("data-attrClass") || "";
                        var fieldName = $helper.attr("data-fieldName") || "";
                        var filterType = $helper.attr("data-filterType") || "";
                        var dimId = $helper.attr("data-dimId") || "";
                        var type = $helper.attr("type") || "";
                        var dataId = $helper.attr("data-dataId")||"";
                        var diyRelation = $helper.attr("data-diyRelation")||"";

                        //如果不是从指标库拖拽过来，则中断逻辑(头部拖拽的helper有attr-helper这个class)
                        if (!$helper.hasClass("attr-helper") || $helper.attr("type") == "symbol") {
                            return;
                        }

                        if (PersonalAttr.module.ATTRCLASS.PERSONAL == attrClass || PersonalAttr.module.ATTRCLASS.FORMAT == attrClass) {
                            $.dialog.alert("自定义和时间格式化指标不能再次自定义");
                            return;
                        }
                        //$this表示拖拽区域
                        var $this = $(this);

                        if ($this.html() != "") {
                            $.dialog.alert("只允许设置一个结果字段");
                            return;
                        }
                        var attrHtml = "<div data-attrId='" + attrId + "' data-fieldName='" + fieldName + "' data-attrType='" + attrType + "' data-filterType='" + filterType + "' data-dimId='" + dimId + "' data-attrClass='" + attrClass + "' data-type='" + type + "' data-dataId='"+dataId+"' class='label'>"
                            + "<div class ='text'><span class='name'>" + attrName + "</span></div><div class='close'><i class='fa fa-close'></i></div></div>";
                        $this.append(attrHtml);
                    }
                })
            },
            //输入数字的拖拽事件
            initInputDrag: function () {
                $(".constant-label").draggable({
                    delay: 10,
                    cursorAt: {
                        top: 1,
                        left: 56
                    },
                    addClasses: false,
                    //暂时写死
                    helper: function () {
                        var attrId = $(this).text();

                        return jQuery('<div>', {
                            'style': 'z-index:9999999',
                            'data-attrId': attrId,
                            'data-attrName': attrId,
                            'data-fieldName': attrId,
                            'type': "num",
                            'html': attrId
                        }).addClass('attr-helper').appendTo('body');
                    }
                });
            },

            //符号的拖拽事件
            initSymbolDrag: function () {
                $(".symbol a").draggable({
                    delay: 10,
                    cursorAt: {
                        top: 1,
                        left: 26
                    },
                    addClasses: false,
                    connectToSortable: ".conditionArea",
                    helper: function () {
                        var content = $(this).text();

                        return jQuery('<div>', {
                            'style': 'z-index:9999999',
                            'data-attrid': $(this).attr("exp"),
                            'data-attrName': content,
                            'data-fieldName': content,
                            'type': "symbol",
                            'html': content
                        }).addClass('attr-helper').appendTo('body');
                    }
                }).disableSelection();
            },

            //初始化条件区域可拖放
            installConditionDrop: function () {
                $(".conditionArea").droppable({
                    drop: function (event, ui) {
                        var $helper = ui.helper;
                        var attrId = $helper.attr("data-attrId") || "";
                        var attrName = $helper.attr("data-attrName") || "";
                        var attrType = $helper.attr("data-attrType") || "";
                        var attrClass = $helper.attr("data-attrClass") || "";
                        var fieldName = $helper.attr("data-fieldName") || "";
                        var filterType = $helper.attr("data-filterType") || "";
                        var dimId = $helper.attr("data-dimId") || "";

                        //如果不是从指标库拖拽过来，则中断逻辑(头部拖拽的helper有attr-helper这个class)
                        if (!$helper.hasClass("attr-helper") || $helper.attr("type") == "num") {
                            return;
                        }

                        //$this表示拖拽区域
                        var $this = $(this);


                        if ($helper.attr("type") != "symbol") {

                            //指标存在，不可重复拖入
                            var exit = false;
                            $(".conditionArea div").each(function () {
                                if (attrId == $(this).attr("data-attrId")) {
                                    $.dialog.alert("该指标已存在");
                                    exit = true;
                                }
                            });
                            if (exit) {
                                return;
                            }
                        }

                        var attrHtml = "";
                        if ($helper.attr("type") == "symbol") {
                            attrHtml += "<div data-attrId='" + attrId + "' data-fieldName='" + fieldName + "' data-attrType='" + attrType + "' data-filterType='" + filterType + "' data-dimId='" + dimId + "' class='label'>"
                                + "<div class ='text' style='color:#eb9800'><span class='name'>" + attrName + "</span></div><div class='close'><i class='fa fa-close'></i></div></div>";
                        } else {
                            attrHtml += "<div data-attrId='" + attrId + "' data-fieldName='" + fieldName + "' data-attrType='" + attrType + "' data-filterType='" + filterType + "' data-dimId='" + dimId + "' class='label'>"
                                + "<div class ='text'><span class='name'>" + attrName + "</span></div><div class='close'><i class='fa fa-close'></i></div></div>";
                        }

                        $this.append(attrHtml);
                    }
                })
            },

            //初始化可排序
            installConditionSort: function () {
                $(".conditionArea").sortable({
                    connectWith: ".conditionArea,.symbol",
                    appendTo: 'body',
                    delay: 200,
                    //containment: '#conditionArea',
                    scroll: true,
                    stop: function (event, ui) {
                        var $helper = ui.item;
                        var attrId = $helper.attr("data-attrId") || "";
                        var attrName = $helper.attr("data-attrName") || "";
                        var attrType = $helper.attr("data-attrType") || "";
                        var attrClass = $helper.attr("data-attrClass") || "";
                        var fieldName = $helper.attr("data-fieldName") || "";
                        var filterType = $helper.attr("data-filterType") || "";
                        var dimId = $helper.attr("data-dimId") || "";
                        var dataId = $helper.attr("data-dataId")||"";
                        var diyRelation = $helper.attr("data-diyRelation")||"";

                        //如果不是从指标库拖拽过来，则中断逻辑(头部拖拽的helper有attr-helper这个class)
                        if (!$helper.hasClass("attr-helper") || $helper.attr("type") == "num") {
                            return;
                        }

                        if (PersonalAttr.module.ATTRCLASS.CUSTOM != attrClass && PersonalAttr.module.ATTRCLASS.COMMON != attrClass) {
                            $.dialog.alert("自定义指标不能再次自定义");
                            ui.item.replaceWith("");
                            return;
                        }

                        if ($helper.attr("type") == undefined) {
                            var $parent = $(".conditionArea");
                            var $this = null;
                            $parent.each(function () {
                                if ($(this).is(":visible")) {
                                    $this = $(this);
                                }

                            });

                            //指标存在，不可重复拖入
                            var exit = 0;
                            $this.children().each(function () {
                                if (attrId == $(this).attr("data-attrId")) {
                                    exit += 1;
                                }
                            });
                            if (exit == 2) {
                                $.dialog.alert("该指标已存在");
                                ui.item.replaceWith("");
                                return;
                            }
                        }

                        var attrHtml = "";
                        if ($helper.attr("type") == "symbol") {
                            var nameClass = "text";
                            if (attrId == "and" || attrId == "or") {
                                nameClass = "text andOr";
                            }
                            var expId = "exp" + new Date().getTime();
                            attrHtml += "<div exp='" + attrId + "' expId='" + expId + "' data-attrId='" + attrId + "' data-fieldName='" + fieldName + "' data-attrType='" + attrType + "' data-filterType='" + filterType + "' data-dimId='" + dimId + "' class='label'>"
                                + "<div class ='" + nameClass + "' style='color:#eb9800'><span class='name'>" + attrName + "</span></div><div class='close'><i class='fa fa-remove' style='color: #eb9800'></i></div></div>";
                        } else {
                            attrHtml += "<div exp='attr' data-attrId='" + attrId + "' data-fieldName='" + fieldName + "' data-attrType='" + attrType + "' data-filterType='" + filterType + "' data-dimId='" + dimId + "' data-dataId='"+dataId+"' class='label'>"
                                + "<div class ='text'><span class='name'>" + attrName + "</span></div><div class='set'><i class='fa fa-cog' style='color: #00b7ee'></i></div><div class='close'><i class='fa fa-close' style='color: #00b7ee'></i></div></div>";
                        }

                        ui.item.replaceWith(attrHtml);
                        PersonalAttr.view.bindHover();
                    }
                }).disableSelection();
            }
        };
        PersonalAttr.view = {
            show: function () {
                $.dialog({
                    id: 'personalAttrDialog',
                    title: '设置自定义指标',
                    padding: '0',
                    width: '800px',
                    height: '500px',
                    lock: false,
                    content: jQuery("#personalAttr")[0],
                    ok: function () {
                        var isPass = $('.personal-attr-sub').validationEngine('validate');
                        if (!isPass) {
                            return false;
                        }

                        var personalAttrName = jQuery("#personalAttrName").val();

                        var personalAttrGroup = jQuery("#personalAttrGroup").attr("trueValue");

                        var rule = [];

                        var isResultSet = true;
                        var isConditionSet = true;
                        var isAttrSet = true;
                        var isExpressionChecked = true;
                        var tabLength = jQuery("#personalAttrTabs").children("div").length;
                        jQuery("#personalAttrTabs").children("div").each(function () {
                            var ruleObj = {
                                resultType: "",//0:指标;1:常量;2:空值
                                resultName: "",
                                resultAttrId: "",
                                resultAttrType: "",
                                resultAttrDimId: "",
                                resultAttrClass: "",
                                resultAttrFieldName: "",
                                resultAttrDataId:"",
                                conditionSql: "",
                                conditionVal: ""
                            };
                            var $this = $(this);
                            var resultArea = $this.find(".search-result-div .resultArea");
                            var conditionArea = $this.find(".search-condition-div .conditionArea");

                            if (tabLength > 1 && resultArea.html() == "") {
                                isResultSet = false;
                                return false;
                            }

                            if (conditionArea.html() == "") {
                                isConditionSet = false;
                                return false;
                            }

                            var resultAreaLabel = resultArea.find(".label");
                            if (tabLength == 1 && resultArea.html() == "") {
                                ruleObj.resultType = 2;  //空值
                            } else {
                                if (resultAreaLabel.data("type") == "num") {
                                    ruleObj.resultType = 1;  //常量
                                    ruleObj.resultName = resultAreaLabel.data("attrid");
                                } else {
                                    ruleObj.resultType = 0;  //指标
                                    ruleObj.resultName = resultAreaLabel.text();
                                    ruleObj.resultAttrClass = resultAreaLabel.data("attrclass");
                                    //if(PersonalAttr.module.ATTRCLASS.REPORT == resultAreaLabel.data("attrclass") || PersonalAttr.module.ATTRCLASS.FORMAT == resultAreaLabel.data("attrclass")){
                                        ruleObj.resultAttrFieldName = resultAreaLabel.data("fieldname");
                                        ruleObj.resultAttrDataId = resultAreaLabel.data("dataid");
                                    //}
                                }
                                ruleObj.resultAttrId = resultAreaLabel.data("attrid");
                                ruleObj.resultAttrDimId = resultAreaLabel.data("dimid") ? resultAreaLabel.data("dimid") : "";
                            }
                            ruleObj.resultAttrType = resultAreaLabel.data("attrtype") ? resultAreaLabel.data("attrtype") : "";

                            var sql = "";
                            var conditionValArr = [];
                            var plainRule = "";
                            var plainRuleStr = "";
                            conditionArea.children("div").each(function () {
                                var $this = $(this);

                                var conditionValObj = {
                                    attrId: "",
                                    attrName: "",
                                    fieldName: "",
                                    attrType: "",
                                    conditionOptionValue: "",
                                    conditionLabelValue: "",
                                    attrDataId:"",
                                    conditionRealValue: ""//维度的真实值跟label值不同，为了记录维度真实值
                                };

                                var exp = $this.attr("exp");
                                if (exp == "attr") {
                                    sql += $this.data("attrid") + " ";
                                    conditionValObj.attrId = $this.data("attrid");
                                    conditionValObj.attrName = $this.find(".text").text();
                                    conditionValObj.fieldName = $this.data("fieldname");
                                    conditionValObj.attrType = $this.data("attrtype");
                                    conditionValObj.attrDataId = $this.data("dataid");
                                    var conditionValDiv = $this.find(".condition-val");
                                    if (!conditionValDiv.length) {
                                        isAttrSet = false;
                                        return false;
                                    }
                                    if ($this.data("dimid")) {
                                        conditionValObj.conditionOptionValue = "dimId";
                                    } else {
                                        var conditionOptionValueJson = conditionValDiv.data("filterselectvalue");
                                        conditionValObj.conditionOptionValue = conditionOptionValueJson ? ( conditionOptionValueJson[0] + "," + conditionOptionValueJson[1]) : "";
                                    }
                                    conditionValObj.conditionLabelValue = conditionValDiv.data("filterlabelvalue")[0] + "," + conditionValDiv.data("filterlabelvalue")[1];
                                    conditionValObj.conditionRealValue = conditionValDiv.data("filtervalue");
                                    conditionValArr.push(conditionValObj);
                                } else {
                                    sql += exp + " ";
                                }
                                plainRule += exp;

                                plainRuleStr += exp + ",";
                            });
                            if (!PersonalAttr.view.checkRule(plainRule, plainRuleStr.substring(0, plainRuleStr.length - 1))) {
                                isExpressionChecked = false;
                            }
                            ruleObj.conditionSql = sql;
                            ruleObj.conditionVal = conditionValArr;
                            rule.push(ruleObj);
                        });

                        if (!isResultSet) {
                            $.dialog.alert("请为每一个规则都设置查询结果");
                            return false;
                        }

                        if (!isConditionSet) {
                            $.dialog.alert("请为每一个规则都设置筛选条件");
                            return false;
                        }

                        if (!isAttrSet) {
                            $.dialog.alert("请为每个规则的筛选条件的每个指标都设置条件");
                            return false;
                        }

                        if (!isExpressionChecked) {
                            $.dialog.alert("筛选条件表达式不符合规则，请检查所有规则的筛选条件");
                            return false;
                        }

                        var param = {
                            dataId: Box.main.dataId,
                            dataType: Box.main.dataType,
                            attrId: "",
                            attrName: personalAttrName,
                            groupId: personalAttrGroup,
                            rule: JSON.stringify(rule)
                        };
                        $.dialog.confirm("确定保存该自定义指标吗？", function () {
                            $.ajax({
                                url: Base.handleUrlParam('/platform/dataview/format/save-personal-attr'),
                                dataType: "json",
                                type: "post",
                                data: param,
                                success: function (response) {
                                    if (response.resFlag == "Success") {
                                        $.dialog.alert("新增自定义指标成功");
                                        Box.AttrTree.viewInit();
                                        $.dialog.closeAll("personalAttrDialog");
                                    } else {
                                        $.dialog.alert("新增自定义指标失败，请联系管理员");
                                        return false;
                                    }
                                },
                                error: function () {
                                    $.dialog.alert("新增自定义指标失败，请联系管理员");
                                }
                            })

                        });
                        return false;
                    },
                    okVal: '保存',
                    cancelVal: '关闭',
                    cancel: function () {
                        return true;
                    }
                });
            },

            initTabs: function () {
                var tabs = $("#personalAttrTabs").tabs();
                var tabTemplate = "<li><a shref='#{href}'>#{label}</a><span class='ui-icon ui-icon-close' style='cursor: pointer' role='presentation'></span></li>";
                var tabCounter = 1;
                var tabNum = 0;

                function addTab() {
                    if (tabNum > 8) {
                        $.dialog.alert("超出限制");
                        return;
                    }
                    var label = "规则 " + (tabNum + 1),
                        id = "tab-" + tabCounter,
                        li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));

                    tabs.find(".ui-tabs-nav").append(li);
                    var tabContentHtml = PersonalAttr.view.buildTabContent();
                    tabs.append("<div id='" + id + "' class='personal-attr-tab'>" + tabContentHtml + "</div>");
                    tabs.tabs("refresh");
                    tabs.tabs({active: tabNum});
                    tabNum++;
                    tabCounter++;
                }

                $("#addTab").on('click', function () {
                    addTab();
                    PersonalAttr.control.componentInit();
                });

                tabs.on("click", "span.ui-icon-close", function () {
                    if (tabNum == 1) {
                        return;
                    }
                    var panelId = $(this).closest("li").remove().attr("aria-controls");
                    $("#" + panelId).remove();
                    tabNum--;
                    if (tabNum == 0) {
                        tabCounter = 1;
                    } else {
                        var index = 1;
                        tabs.find(".ui-tabs-nav li>a").each(function () {
                            $(this).html("规则" + index);
                            index++;
                        })
                    }
                    tabs.tabs("refresh");
                });
            },

            buildTabContent: function () {
                return "<div class='search-result-div'><fieldset class='search-result'><legend style='margin-left: 10px'>设置查询结果</legend>" +
                    "<div class='constant-label' style='display:none'>" + " </div>" +
                    "<input type='text' class='bi-input numInput validate[custom[number]]' placeholder='设置常量' style='width: 120px;height: 25px' id='numInput'/>" +
                    "<div class='resultArea' id='resultArea'></div></fieldset></div>" +
                    "<div class='search-condition-div'><fieldset class='search-condition'><legend style='margin-left: 10px'>设置筛选条件</legend>" +
                    "<div class='symbol'><a exp='('>(</a><a exp=')'>)</a><a exp='and'>并且</a><a exp='or'>或者</a></div>" +
                    "<div class='conditionArea' id='conditionArea'></div></fieldset></div>";
            },

            bindHover: function () {
                //避免多次绑定 先销毁
                jQuery(".andOr").poshytip("destroy");
                //添加hover事件
                jQuery(".andOr").poshytip({
                    content: function () {
                        var text = $(this).text();
                        var outHTML = "";
                        var expId = $(this).parent().attr("expid");
                        if (text == "并且") {
                            outHTML = "<div expid='" + expId + "'class='poshy-tip'><ul><li>或者</li></ul></div>";
                        } else {
                            outHTML = "<div expid='" + expId + "'class='poshy-tip'><ul><li>并且</li></ul></div>";
                        }
                        return outHTML;
                    },
                    className: 'tip-yellowsimple',
                    alignTo: 'target',
                    alignY: 'bottom',
                    alignX: 'center',
                    offsetY: 2,
                    offsetX: 80,
                    showTimeout: 200,
                    keepInViewport: false,
                    show: function () {
                        PersonalAttr.view.bindClick();
                    }
                });
            },

            bindClick: function () {
                //切换运算符
                $(".poshy-tip li").on("click", function () {
                    var $li = $(this);
                    var expId = $li.parent().parent().attr("expid");
                    //触发提示的标签a
                    var $this = $(".conditionArea").find("div[expid='" + expId + "']");
                    var val = $li.html();
                    $this.attr("exp", val == "并且" ? "and" : "or");
                    $this.attr("data-attrId", val == "并且" ? "and" : "or");
                    $this.attr("data-fieldName", val);
                    $this.children().find("span").html(val);
                });
            },

            bindEvent: function () {
                //输入数字区域的blur事件
                $(".numInput").on("blur keyup", function () {
                    var $parent = $(".numInput");
                    var $this = null;
                    $parent.each(function () {
                        if ($(this).is(":visible")) {
                            $this = $(this);
                            var labelName = $this.val();
                            if ((event.keyCode == '13' || event.type === 'blur') && labelName) {
                                $this.hide();
                                $this.siblings(".constant-label").show().text(labelName);
                            }
                        }
                    });
                });
                //双击未选区域标签，修改
                jQuery(".constant-label").on('dblclick', function () {
                    var $parent = $(".constant-label");
                    var $this = null;
                    var val = null;
                    $parent.each(function () {
                        if ($(this).is(":visible")) {
                            $this = $(this);
                            val = $this.text();
                            $this.hide();
                            $this.siblings(".numInput").show().val(val);
                        }
                    });
                    Base.stopBubble(event)
                });

                //删除拖拽区域的指标
                jQuery(".resultArea,.conditionArea").on('click', '.close', function (event) {
                    var $label = jQuery(this).parents('.label');
                    $label.remove();
                });

                //条件区域设置
                jQuery(".conditionArea").on('click', '.set', function (event) {
                    var $this = $(this).parent();
                    var attrId = $this.data("attrid");
                    var attrName = $this.find(".text").text();
                    var attrType = $this.data("attrtype");
                    var filterType = $this.data("filtertype");
                    var dimId = $this.data("dimid");
                    var filterSelectValue = $this.children(".condition-val").data("filterselectvalue") || "";
                    var filterLabelValue = $this.children(".condition-val").data("filterlabelvalue") || "";
                    var filterValue = $this.children(".condition-val").data("filtervalue") || "";
                    ConditionSet.show(attrId, attrName, attrType, filterType, dimId, filterSelectValue, filterLabelValue, filterValue, $this, PersonalAttr.view.render);

                });
            },
            render: function (conditionStr, clickObj) {
                var width = clickObj.css("width");
                var filterSelectValue = conditionStr.filterSelectValue;
                var filterLabelValue = conditionStr.filterLabelValue;
                var filterValue = conditionStr.filterValue;
                var conditionVal = $.evalJSON(filterLabelValue);
                var conditionValHtml = "<div class='condition-val' data-filterSelectValue = '" + filterSelectValue + "' data-filterLabelValue='" + filterLabelValue + "' data-filterValue='" + filterValue + "' style='width: " + width + "'><span>条件值：" + conditionVal + "</span></div>";
                if (clickObj.children(".condition-val").length) {
                    if(conditionVal != ","){
                        clickObj.children(".condition-val").replaceWith(conditionValHtml);
                    } else {
                        clickObj.find('.condition-val').remove();
                    }
                } else {
                    if(conditionVal != ","){
                        clickObj.append(conditionValHtml);
                    }
                }

            },

            checkRule: function (plainRule, plainRuleStr) {
                var plainRuleArr = plainRuleStr.split(",");

                var attrNum = 0;
                for (var j = 0; j < plainRuleArr.length; j++) {
                    if ("attr" == plainRuleArr[j]) {
                        attrNum++;
                    }
                }

                if (plainRule != "attr") {
                    var temp = 0;
                    for (var k = 0; k < plainRuleArr.length; k++) {
                        if ("attr" == plainRuleArr[k] && k != plainRuleArr.length - 1) {
                            temp++;
                            if (temp == attrNum && ")" != plainRuleArr[k + 1]) {//最后一个attr后面必须是）或者空
                                return false;
                            } else if (")" != plainRuleArr[k + 1] && "and" != plainRuleArr[k + 1] && "or" != plainRuleArr[k + 1]) {
                                return false;
                            }
                        } else if(("and" == plainRuleArr[k] || "or" == plainRuleArr[k]) && k != plainRuleArr.length - 1){
                            if("attr" != plainRuleArr[k + 1]){
                                return false;
                            }
                        }
                    }
                }

                /**以'and'、'or'开头或者结尾*/
                if ("and" == plainRuleArr[0] || "or" == plainRuleArr[0] || "and" == plainRuleArr[plainRuleArr.length-1] || "or" == plainRuleArr[plainRuleArr.length-1]) {
                    return false;
                }

                /**错误连接*/
                if (plainRule.indexOf('andor') != -1 || plainRule.indexOf('orand') != -1 ||
                    plainRule.indexOf('or)') != -1 || plainRule.indexOf('and)') != -1 ||
                    plainRule.indexOf('(or') != -1 || plainRule.indexOf('(and') != -1 ||
                    plainRule.indexOf('oror') != -1 || plainRule.indexOf('andand') != -1) {
                    return false;
                }

                /**括号不匹配*/
                if (plainRule.indexOf('(') != -1 || plainRule.indexOf(')') != -1) {
                    var stack = [];
                    for (var i = 0, item; i < plainRule.length; i++) {
                        item = plainRule.charAt(i);
                        if ('(' === item) {
                            stack.push('(');
                        } else if (')' === item) {
                            if (stack.length > 0) {
                                stack.pop();
                            } else {
                                return false;
                            }
                        }
                    }
                    if (0 !== stack.length) {
                        return false;
                    }
                }

                /**空括号*/
                if (/\(\)/.test(plainRule)) {
                    return false;
                }

                return true;
            }
        };
        return PersonalAttr.control;
    });