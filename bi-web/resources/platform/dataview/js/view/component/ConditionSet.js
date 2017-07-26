define(['bace'], function (Base) {

    var ConditionSet = {};

    var callback = null;
    ConditionSet.module = {
        attrId: "",
        attrName: "",
        attrType: "",
        filterType: "",
        dimId: "",
        filterSelectValue: "",
        filterLabelValue: "",
        filterValue: "",
        clickObj: "",
        filterTypeArr: {
            DIM: "1",//维度
            INTERVAL: '2',//间隔
            EQUAL: '3',//精确
            LIKE: '9',//模糊
            MONTH: '4',//月份
            DAY: '6',//日期
            TIME: '7'//时间
        },
        attrTypeArr: {
            INT: "1",
            DATE: "2",
            STRING: "3"
        }
    };

    ConditionSet.control = {
        show: function (attrId, attrName, attrType, filterType, dimId, filterSelectValue, filterLabelValue, filterValue, clickObj, cb) {
            /*挂载数据*/
            ConditionSet.module.attrId = attrId;
            ConditionSet.module.attrName = attrName;
            ConditionSet.module.attrType = attrType;
            ConditionSet.module.filterType = filterType;
            ConditionSet.module.dimId = dimId;
            ConditionSet.module.filterSelectValue = filterSelectValue;
            ConditionSet.module.filterLabelValue = filterLabelValue;
            ConditionSet.module.filterValue = filterValue;
            ConditionSet.module.clickObj = clickObj;
            callback = cb;

            if (!jQuery("#conditionSet")[0]) {
                jQuery("body").append("<div id='conditionSet' style='display:none;position: relative'></div>");
            }
            jQuery("#conditionSet").load(Base.handleUrlParam('/platform/dataview/format/condition-set-page'), function () {
                ConditionSet.view.show();
                ConditionSet.control.init();
            });

        },

        init: function () {
            var filterAttrData = {
                attrId: ConditionSet.module.attrId,
                attrName: ConditionSet.module.attrName,
                attrType: ConditionSet.module.attrType,
                filterType: ConditionSet.module.filterType,
                dimId: ConditionSet.module.dimId,
                filterSelectValue: ConditionSet.module.filterSelectValue,
                filterLabelValue: ConditionSet.module.filterLabelValue,
                filterValue: ConditionSet.module.filterValue
            };
            var $conItem = ConditionSet.view._packFilter(filterAttrData);
            jQuery("#conditionSetPanel").append($conItem);
            ConditionSet.view.bindEvent();
        }
    };
    ConditionSet.view = {
        show: function () {
            $.dialog({
                id: 'conditionSetDialog',
                title: '设置自定义指标',
                padding: '0',
                width: '400px',
                height: '300px',
                lock: true,
                content: jQuery("#conditionSet")[0],
                ok: function () {
                    var conditionStr = ConditionSet.view.collect();
                    callback.call(this, conditionStr, ConditionSet.module.clickObj);
                },
                okVal: '保存',
                cancelVal: '关闭',
                cancel: function () {
                    return true;
                }
            });

        },

        bindEvent: function () {
            jQuery("#conditionSetPanel").on('change', '.chooseType.start select', function () {
                var $this = jQuery(this);
                var val = $this.val();
                if (["moreEq_2", "more_2", "less", "lessEq"].indexOf(val) > -1) {
                    $this.parents(".filter-attr .intervalGroup").removeClass("like");
                    $this.parents(".filter-attr .intervalGroup").css("width", "390px");
                    $this.parent().siblings().children(".intervalInput").css("width", "150px");
                    $this.parents(".filter-attr").find(".end,.endInput").show();
                } else {
                    $this.parents(".filter-attr .intervalGroup").addClass("like");
                    $this.parents(".filter-attr").find(".end,.endInput").hide();
                }
            })
        },

        _packFilter: function (filterAttrData) {
            filterAttrData.filterId = filterAttrData.attrId + "_" + new Date().getTime();
            var whereItem = '';
            whereItem += '<div id="${filterId}" class="filter-attr cursor-pointer">';
            whereItem += '   	<span class="label">';
            whereItem += '   		<label style="width:auto">${attrName}</label><span>：</span>';
            whereItem += '   		<input id="${filterId}_input" type="text" class="bi-input target" />';
            whereItem += '   	</span>';
            whereItem += '</div>';

            var filterAttrObj = $.tmpl(whereItem, filterAttrData).data("filterAttrData", filterAttrData);
            setTimeout(function () {
                //根据当前指标类型，和筛选类型生成搜索输入框,并绑定各自相应的事件
                ConditionSet.view.translate(filterAttrData);
            }, 0);

            return filterAttrObj;
        },
        translate: function (filterAttrData) {
            //当前筛选对象
            var $filterAttrObj = $("#" + filterAttrData.filterId);

            //默认input
            var $input = $filterAttrObj.find("input.target");

            //先销毁除了input之外的筛选元素
            $filterAttrObj.find('select').chosen("destroy");
            $filterAttrObj.find('.bi-filter').remove();

            var filterLabelValue = filterAttrData.filterLabelValue ? filterAttrData.filterLabelValue : null;
            var code = filterAttrData.filterValue ? filterAttrData.filterValue : null;

            var type = filterAttrData.filterType;
            //维度查询
            if ([ConditionSet.module.filterTypeArr.DIM, 'A', 'B', 'C'].indexOf(type) > -1) {
                var dimId = filterAttrData.dimId;
                var filterType = filterAttrData.filterType;
                //$input.val(filterLabelValue ? filterLabelValue[0] : '');
                function ajaxDataFilter(treeId, parentNode, responseData) {
                    return responseData.RES_DATA;
                }

                $filterAttrObj.find(".bi-input").bzTree({
                    async: {
                        enable: true,
                        autoParam: ["id=clickCode", "dimId=clickDimId"],
                        url: Base.handleUrlParam('/platform/dataview/query-tree-data'),
                        dataType: 'json',
                        otherParam: {"dimId": dimId, "filterType": filterType},
                        dataFilter: ajaxDataFilter,
                        code:code,
                        label:filterLabelValue
                    }
                });
            } else {
                var selectType = filterAttrData.filterSelectValue ? filterAttrData.filterSelectValue : null;

                //构建筛选类型框
                var selectTypeHTML = '<div class="intervalGroup {{if endType != "less" && endType != "lessEq" }} like {{/if}} bi-filter">' +
                    '<div class="chooseType start">' +
                    '<select>' +
                        //时间类型和数值类型没有模糊查询
                    '{{if attrType != 1 && attrType != 2}}' +
                    '<option {{if startType == "like_9" }} selected {{/if}}value="like_9" >全匹配</option>' +
                    '<option {{if startType == "leftLike_9" }} selected {{/if}} value="leftLike_9" >左匹配</option>' +
                    '<option {{if startType == "rightLike_9" }} selected {{/if}} value="rightLike_9" >右匹配</option>' +
                    '{{/if}}' +
                    '<option {{if startType == "eq_3" }} selected {{/if}}value="eq_3" >精确</option>' +
                    '{{if attrType != 3}}' +
                    '<option {{if startType == "more_2" }} selected {{/if}}value="more_2" >&gt;</option>' +
                    '<option {{if startType == "moreEq_2" }} selected {{/if}} value="moreEq_2" >&gt;=</option>' +
                    '{{/if}}' +
                    '</select>' +
                    '</div>' +
                    '<div><input class="intervalInput start"/></div>' +
                    '<div class="chooseType end"  {{if endType != "less" && endType != "lessEq" }}  style="display:none" {{/if}} >' +
                    '<select>' +
                    '<option {{if endType == "less" }} selected {{/if}} value="less" >&lt;</option>' +
                    '<option {{if endType == "lessEq" }} selected {{/if}} value="lessEq" >&lt;=</option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="endInput" {{if endType != "less" && endType != "lessEq" }}  style="display:none" {{/if}}><input class="intervalInput end"/></div>' +
                    '</div>';
                $input.hide().after(
                    $.tmpl(selectTypeHTML, {
                            attrType: filterAttrData.attrType,
                            startType: selectType ? selectType[0] : '',
                            endType: selectType ? selectType[1] : ''
                        }
                    ));

                $filterAttrObj.find(".intervalInput.start").val(filterLabelValue ? filterLabelValue[0] : '');
                $filterAttrObj.find(".intervalInput.end").val(filterLabelValue ? filterLabelValue[1] : '');
                $filterAttrObj.find(".chooseType.start select").chosen({
                    width: "54px",
                    disable_search: true
                });

                $filterAttrObj.find(".chooseType.end select").chosen({
                    width: "32px",
                    disable_search: true
                });

                //时间查询
                if (filterAttrData.attrType == ConditionSet.module.attrTypeArr.DATE) {
                    //如果是时间切换，销毁时间组件
                    var $startDate = $filterAttrObj.find("input.start");
                    var $endDate = $filterAttrObj.find("input.end");

                    if ($startDate.data("DateTimePicker")) {
                        $startDate.data("DateTimePicker").destroy();
                        $endDate.data("DateTimePicker").destroy();
                    }
                    var fmt = "";
                    var showChangeType = "";
                    if (type == ConditionSet.module.filterTypeArr.MONTH) {
                        fmt = "YYYY-MM";
                    }
                    if (type == ConditionSet.module.filterTypeArr.DAY) {
                        fmt = "YYYY-MM-DD";
                        showChangeType += "months,days"
                    }
                    if (type == ConditionSet.module.filterTypeArr.TIME) {
                        fmt = "YYYY-MM-DD HH:mm:ss";
                        showChangeType += "months,days,times"
                    }
                    //默认当前筛选时间值的类型跟本身类型相同
                    filterAttrData.filterValueType = type;

                    $filterAttrObj.find("input.start,input.end").datetimepicker({
                        format: fmt,
                        showClear: true,
                        showTodayButton: true,
                        //showChangeType: showChangeType,
                        keepOpen: false,
                        onhide: function () {
                            jQuery(this).attr("title", $(this).val()).parents(".filter-attr").removeClass("hover");
                        },
                        //onChangeType: function (format, type) {
                        //    var $startDatePicker = $filterAttrObj.find("input.start").data("DateTimePicker");
                        //    var $endDatePicker = $filterAttrObj.find("input.end").data("DateTimePicker");
                        //
                        //    $startDatePicker.viewMode(type);
                        //    $startDatePicker.format(format);
                        //    $endDatePicker.viewMode(type);
                        //    $endDatePicker.format(format);
                        //    //更滑默认当前筛选时间值的类型
                        //    switch (type) {
                        //        case 'months':
                        //            filterAttrData.filterValueType = ConditionSet.module.filterType.MONTH;
                        //            break;
                        //        case 'times':
                        //            filterAttrData.filterValueType = ConditionSet.module.filterType.TIME;
                        //            break;
                        //        case 'days':
                        //            filterAttrData.filterValueType = ConditionSet.module.filterType.DAY;
                        //            break;
                        //        default:
                        //            break;
                        //    }
                        //}
                    });

                    $filterAttrObj.find("input.startDate").on("dp.change", function (e) {
                        $filterAttrObj.find("input.endDate").data("DateTimePicker").minDate(e.date);
                    });
                }
            }
        },

        collect: function () {
            var $this = $("#conditionSetPanel .filter-attr");
            var filterAttrData = $this.data("filterAttrData");
            var filterValue = "";
            //如果是维度，则获取data里code值
            if (filterAttrData.dimId || ['A', 'B', 'C'].indexOf(filterAttrData.filterType) > -1) {
                var code = $this.find(".bi-input").data('code');
                filterAttrData.filterValue = code ? code.join(',') : '';
                //存入展示的值
                filterAttrData.filterLabelValue = JSON.stringify([$this.find(".bi-input").val(), '']);
            } else {
                var startValue = $this.find(".intervalInput.start").val();
                var startType = $this.find(".chooseType.start >select").val();
                var valArray = startType.split('_');
                var _filterType = valArray[0];
                //如果是大于或者大于等于类型,则还需要收集一个结束值
                if (_filterType == "more" || _filterType == "moreEq") {
                    var endType = $this.find(".chooseType.end >select").val();
                    var endValue = $this.find(".intervalInput.end").val();
                    var startSign = _filterType == "more" ? ">" : ">=";
                    var endSign = endType == "less" ? "<" : "<=";

                    //如果起始数据为空(设置查询参数,保存查询框的值)
                    if (startValue && endValue) {
                        filterValue = startSign + startValue + "," + endSign + endValue;
                        filterAttrData.filterLabelValue = JSON.stringify([startValue, endValue])
                    } else {
                        if (startValue) {
                            filterValue = startSign + startValue;
                            filterAttrData.filterLabelValue = JSON.stringify([startValue, ''])
                        }
                        if (endValue) {
                            filterValue = endSign + endValue;
                            filterAttrData.filterLabelValue = JSON.stringify(['', endValue]);
                        }
                        if (startValue == '' && endValue == '') {
                            filterAttrData.filterLabelValue = JSON.stringify(['', '']);
                        }
                    }
                    filterAttrData.filterSelectValue = JSON.stringify([startType, endType]);
                } else {
                    //构建左右匹配,全匹配参数
                    if (_filterType == "like") {
                        filterValue = "%" + startValue + "%"
                    }
                    if (_filterType == "leftLike") {
                        filterValue = startValue + "%";
                    }
                    if (_filterType == "rightLike") {
                        filterValue = "%" + startValue;
                    }
                    if (_filterType == "eq") {
                        filterValue = startValue;
                    }
                    filterAttrData.filterSelectValue = JSON.stringify([startType, '']);
                    filterAttrData.filterLabelValue = JSON.stringify([startValue, '']);
                }
                filterAttrData.filterValue = filterValue;
            }
            return filterAttrData;
        }

    };
    return ConditionSet.control;
});