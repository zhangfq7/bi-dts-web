define(['sabace', 'plumb', 'dataLinkChoose', 'dataLinkFilter','dataDimensionFilter'], function (sabace, plumb, dataLinkChoose, dataLinkFilter, dataDimensionFilter) {
    var modifyStopFlag = false;
    //数据是否被报表使用
    var reportFlag = false;
    //修改时用的OBJ
    var dataLinkObj = {};
    //新增时用到的OBj
    var resultObj = {};
    //修改时判断连接类型是左连接还是等于
    var leftOrEqFlag;

    //初始化第二页checkBox
    var initSelectFlag = false;

    var instance;
    var leftIndex = 50;
    var topIndex = 50;
    var checkedAttr = [];
    jQuery(function () {
        //添加
        if ("add" == linkModifyFlag) {
            initMdataNode(MdataId, true);
        } else {
            //修改
            initDataLinkForModify(MdataId);
            initSelectFlag = true;
        }
        //首先初始化主节点
        jQuery('[name="followOrigin"]').iCheck({
            checkboxClass: 'icheckbox_minimal',
            radioClass: 'iradio_minimal'
        });
        //初始化第一个foot下一步的按钮
        initNextStep1();
        //初始化第一个上一步
        initLastStep1();

        //初始化第二个foot下一步的按钮
        initNextStep2();

        //初始化第一个上一步
        initLastStep2();

        //初始化条件筛选的上下控制
        updownShow();
        /**
         * 初始化添加跟清楚节点的方法
         */
        initAddClearNode();
        //初始化条件筛选
        initPenIcon();
        //初始化删除
        initDelDiv();
        //条件筛选删除
        bindFilterDelete();

        jQuery('#statemachine-demo').niceScroll();
        //	jQuery('#conditionlabel').niceScroll();
        //	jQuery('.containerDiv').niceScroll();
        jQuery('#con-container').niceScroll();
        jQuery('.mess-content').niceScroll();
        initChangeAttrName();

        jQuery('#validateForm').validationEngine({
            autoHidePrompt: true,
            autoHideDelay: 2000,
            binded: true,
            promptPosition: 'bottomLeft',
            showOneMessage: true
        });
        jQuery('#validateForm2').validationEngine({
            autoHidePrompt: true,
            autoHideDelay: 2000,
            binded: true,
            promptPosition: 'bottomLeft',
            showOneMessage: true
        });
        judgeTabActive();
        
        // 下拉框初始化
		jQuery('.chosen-select').chosen();
		
		// 查询业务分类
		queryClassify();
    });
    
    /**
	 * 查询业务分类
	 */
	function queryClassify() {
		sabace.ajax({
			url: sabace.handleUrlParam("/platform/resmanage/data/query-classify-list"),
			success: function(req) {
				// 查询成功
				initClassify(req.classifyList);
			},
			error: function(req) {}
		});
	}
	
	/**
	 * 初始化下拉框
	 * @param req
	 */
	function initClassify(classifyList) {
		var classifyLength = classifyList.length;
		var classifyObj = null;
		var classifyName = null;
		var classifyId = null;
		var html = '<option selected></option>';
		html += '<option value="">无</option>';
		if(classifyLength > 0){
			for(var i=0; i < classifyLength; i++){
				classifyObj = classifyList[i];
				classifyId = classifyObj.classifyId;
				classifyName = classifyObj.classifyName;
				html += '<option value="' + classifyId + '">' + classifyName + '</option>';
			}
		}
		jQuery('#classifySel').append(html);
		jQuery("#classifySel").trigger("chosen:updated");
	}

    /**
     * 判断几个tab页是否已经被激活
     */
    function judgeTabActive() {
        jQuery('#step1 #step-title-label-first').on('click', function () {
            if (jQuery(this).prev().hasClass('active-notFinished')) {
                return;
            } else {
                if (!jQuery('#plumbContent2').hasClass('dis-none')) {
                    jQuery('#plumbContent2').addClass('dis-none');
                }
                if (!jQuery('#plumbContent3').hasClass('dis-none')) {
                    jQuery('#plumbContent3').addClass('dis-none');
                }
                if (jQuery('#plumbContent').hasClass('dis-none')) {
                    jQuery('#plumbContent').removeClass('dis-none');
                }
                if (jQuery('#step1').hasClass('step-tab-unselect')) {
                    jQuery('#step1').removeClass('step-tab-unselect');
                    jQuery('#step1').addClass('step-tab-select');
                }
                if (jQuery('#step2').hasClass('step-tab-select')) {
                    jQuery('#step2').removeClass('step-tab-select');
                    jQuery('#step2').addClass('step-tab-unselect');
                }
                if (jQuery('#step3').hasClass('step-tab-select')) {
                    jQuery('#step3').removeClass('step-tab-select');
                    jQuery('#step3').addClass('step-tab-unselect');
                }
                jQuery('#dataResultGrid').jqGrid("clearGridData");
                $.jgrid.gridDestroy('#dataResultGrid');
                jQuery('.complete-content .r-grid').append('<table id="dataResultGrid"></table>');
            }
        });
        jQuery('#step2 #step-title-label-second').on('click', function () {
            if (jQuery(this).prev().hasClass('active-notFinished')) {
                return;
            } else {
                if (!getPamramByStep1()) {
                    if (!jQuery('#plumbContent').hasClass('dis-none')) {
                        jQuery('#plumbContent').addClass('dis-none');
                    }
                    if (!jQuery('#plumbContent3').hasClass('dis-none')) {
                        jQuery('#plumbContent3').addClass('dis-none');
                    }
                    if (jQuery('#plumbContent2').hasClass('dis-none')) {
                        jQuery('#plumbContent2').removeClass('dis-none');
                    }
                    if (jQuery('#step2').hasClass('step-tab-unselect')) {
                        jQuery('#step2').removeClass('step-tab-unselect');
                        jQuery('#step2').addClass('step-tab-select');
                    }
                    if (jQuery('#step1').hasClass('step-tab-select')) {
                        jQuery('#step1').removeClass('step-tab-select');
                        jQuery('#step1').addClass('step-tab-unselect');
                    }
                    if (jQuery('#step3').hasClass('step-tab-select')) {
                        jQuery('#step3').removeClass('step-tab-select');
                        jQuery('#step3').addClass('step-tab-unselect');
                    }
                    jQuery('#dataResultGrid').jqGrid("clearGridData");
                    $.jgrid.gridDestroy('#dataResultGrid');
                    jQuery('.complete-content .r-grid').append('<table id="dataResultGrid"></table>');
                }
            }
        });
        jQuery('#step3 #step-title-label-third').on('click', function () {
            if (jQuery(this).prev().hasClass('active-notFinished')) {
                return;
            } else {
                if (!getPamramByStep1()) {
                    if (initSetp2Check().length > 0) {
                        if (!jQuery('#plumbContent2').hasClass('dis-none')) {
                            jQuery('#plumbContent2').addClass('dis-none');
                        }
                        if (!jQuery('#plumbContent').hasClass('dis-none')) {
                            jQuery('#plumbContent').addClass('dis-none');
                        }
                        if (jQuery('#plumbContent3').hasClass('dis-none')) {
                            jQuery('#plumbContent3').removeClass('dis-none');
                        }
                        if (jQuery('#step3').hasClass('step-tab-unselect')) {
                            jQuery('#step3').removeClass('step-tab-unselect');
                            jQuery('#step3').addClass('step-tab-select');
                        }
                        if (jQuery('#step1').hasClass('step-tab-select')) {
                            jQuery('#step1').removeClass('step-tab-select');
                            jQuery('#step1').addClass('step-tab-unselect');
                        }
                        if (jQuery('#step2').hasClass('step-tab-select')) {
                            jQuery('#step2').removeClass('step-tab-select');
                            jQuery('#step2').addClass('step-tab-unselect');
                        }
                        initfieldGrid();
                        initcompleteBtn();
                    } else {
                        bi.dialog.show({
                            type: bi.dialog.TYPE_DANGER,
                            title: sabace.getMessage('data.dataLink.label.prompt'),
                            message: sabace.getMessage('data.dataLink.label.chooseOneR')
                        });
                    }
                }
            }
        });
    }

    /**
     * 第二页checkBox全选方法
     */
    function checkAll() {
        jQuery('#allAttrId').on('click', function () {
            if (jQuery('#allAttrId').is(':checked')) {
                jQuery('input[name="attrId"]').each(function () {
                    jQuery(this).prop('checked', true);
                })
            } else {
                $('input[name="attrId"]').each(function () {
                    jQuery(this).prop('checked', false);
                })
            }
        });
        jQuery('input[name="attrId"]').on('click', function () {
            if (jQuery(this).is(':checked')) {
                var length1 = jQuery('input[name="attrId"]').length;
                var length2 = jQuery('input[name="attrId"]:checked').length;
                if (length1 === length2) {
                    jQuery('#allAttrId').prop('checked', true);
                }
            } else {
                jQuery('#allAttrId').prop('checked', false);
            }
        });
    }

    /**
     * 修改的情况下进入页面主方法入口
     */
    function initDataLinkForModify(MdataId) {
        var paramData = {
            dataId: MdataId
        };
        sabace.ajax({
            url: sabace.handleUrlParam("/platform/resmanage/datalink/query-datalink-info"),
            data: paramData,
            loading: {
                spin: true
            },
            success: function (req) {
                    dataLinkObj = req.dataLinkObj;
                    reportFlag = req.reportFlag;
                    //初始化画节点
                    for (var i = 0; i < dataLinkObj.nodeDataArray.length; i++) {
                        initMdataNodeForModify(dataLinkObj.nodeDataArray[i].nodeDataId, dataLinkObj.nodeDataArray[i].nodeLeft, dataLinkObj.nodeDataArray[i].nodeTop, dataLinkObj);
                    }
                    
                    //判断这些任务哪些是被删除了
                    
                    //经过ajax同步操作
                    initLinkDataConnectionsForModify();
                    //初始化筛选条件
                    initFilterBoxForModify();
                    //初始化第三页的值
                    initThirdSelect();
                    initNumSelect();

                    if (reportFlag) {
                        bi.dialog.confirm({
                            title: sabace.getMessage("data.dataLink.label.prompt"),
                            message: sabace.getMessage("data.import.message.linkbyreport"),
                            callback: function (result) {
                                if (!result) {
                                    window.close();
                                }
                            }
                        });
                    }
                },
                error: function (req) {
                    bi.dialog.show({
                        type: bi.dialog.TYPE_DANGER,
                        title: sabace.getMessage("data.dataLink.label.prompt"),
                        message: req.responseText || sabace.getMessage("data.dataLink.error.queryLinkError")
                    });
                }
        });
    }


    /**
     * 修改数字高亮
     */
    function initNumSelect() {
        if (!modifyStopFlag) {
            jQuery('#twoStep,#thirdStep').removeClass('active-notFinished');
        }
    }

    /**
     * 修改初始化第三页
     */
    function initThirdSelect() {
        jQuery('#dataName').val(dataLinkObj.dataName);
        jQuery("input[name='followOrigin'][value=" + dataLinkObj.followOrigin + "]").attr("checked", true);
        jQuery('#dataDescText').text(dataLinkObj.dataDesc);
        // 业务分类
        jQuery("#classifySel").val(dataLinkObj.classifyId);
		jQuery("#classifySel").trigger("chosen:updated");
        checkedAttr = [];
        for (var i = 0; i < dataLinkObj.checkedArr.length; i++) {
            checkedAttr.push(dataLinkObj.checkedArr[i].attrId);
        }
        getPamramByStep1();
        var checkedArr = initSetp2Check();
        resultObj.checkedArr = checkedArr;
    }

    /**
     * 初始化筛选条件
     */
    function initFilterBoxForModify() {
        var linkWhereObjArray = dataLinkObj.linkWhereObjArray;
        if (linkWhereObjArray.length > 0) {
            showFilterDiv();
        }
        //在实体上添加筛选标志
        //初始化条件筛值
        for (var i = 0; i < linkWhereObjArray.length; i++) {
            var fType = linkWhereObjArray[i].filterType;
            log(fType)
            var iExclude = linkWhereObjArray[i].isExclude;
            if ('2' == fType || '1' == fType || '4' == fType || '6' == fType || '7' == fType) {
                linkWhereObjArray[i].trueText = linkWhereObjArray[i].whereText;
            } else if ('3' == fType || '9' == fType) {
                if ('0' == iExclude) {
                    linkWhereObjArray[i].trueText = sabace.getMessage('data.dataLink.label.Contains') + linkWhereObjArray[i].whereValue;
                } else {
                    linkWhereObjArray[i].trueText = sabace.getMessage('data.dataLink.label.Exclude') + linkWhereObjArray[i].whereValue;
                }
            } else if ('8' == fType) {
                if ('0' == linkWhereObjArray[i].whereValue) {
                    linkWhereObjArray[i].trueText = sabace.getMessage('data.dataLink.label.IsNotEmpty');
                } else {
                    linkWhereObjArray[i].trueText = sabace.getMessage('data.dataLink.label.IsEmpty');
                }
            }
            var tmpTar = jQuery('#' + linkWhereObjArray[i].dataId).children('#' + linkWhereObjArray[i].attrId).find('.pen-filter');
            jQuery(tmpTar).after('<div class="up-no-icon-temp pen-icon-style-temp"></div>');
            createFilterParamBox(linkWhereObjArray[i], linkWhereObjArray[i].attrId, linkWhereObjArray[i].attrName, linkWhereObjArray[i].dataId);
        }
    }

    /**
     * 修改时渲染一个节点
     */
    function initMdataNodeForModify(MdataId, left, top, obj) {
            var paramData = {
                "nodeDataId": MdataId,
                "isModify": "yes",
                "dataId": obj.dataId
            };
            sabace.ajax({
                url: sabace.handleUrlParam("/platform/resmanage/datalink/main-data-node"),
                data: paramData,
                async: false,
                success: function (req) {
                        req.linkNodeBean.nodeLeft = left;
                        req.linkNodeBean.nodeTop = top;
                        //如果是第一个节点就initjsplumb
                        //将查询出来的节点信息渲染到页面中去
                        initDataNode(req.linkNodeBean, true, "no");
                        if('1' == req.delFlag){
                        	jQuery('#'+req.linkNodeBean.nodeDataId).children('.firstdiv-own').addClass('back-white');/*('background-color','#c5c5c8');*/
                        }
                        if (sabace.IsEmpty(instance)) {
                            initjsplumb();
                        } else {
                            //	initjsplumb();
                            reSetDivDigaable(req.linkNodeBean.nodeDataId);
                        }
                        //需要初始化连接线
                        //	initLinkDataConnectionsForModify();
                    },
                    error: function (req) {
                        bi.dialog.show({
                            type: bi.dialog.TYPE_DANGER,
                            title: sabace.getMessage("data.dataLink.label.prompt"),
                            message: req.responseText || sabace.getMessage("data.dataLink.error.queryLinkNodeError")
                        });
                    }
            });
        }
        /**
         * 需要初始化连接线
         */

    function initLinkDataConnectionsForModify() {
        var nodeDataLinkArray = dataLinkObj.nodeDataLinkArray;
        for (var i = 0; i < nodeDataLinkArray.length; i++) {
            leftOrEqFlag = nodeDataLinkArray[i].linkType;
            instance.connect({
                source: nodeDataLinkArray[i].leftAttrId,
                target: nodeDataLinkArray[i].rightAttrId
            });
        }
    }

    /**
     * 初始化添加清除节点
     */
    function initAddClearNode() {
        jQuery('#addNode,#addNodeLabel').on('click', function () {
            var nodeArray = jQuery('.statemachine-demo .mydiv');
            var nodeIdArray = new Array;
            for (var i = 0; i < nodeArray.length; i++) {
                nodeIdArray.push(jQuery(nodeArray[i]).attr("id"));
            }
            bindAddNode(nodeIdArray);
        });
        jQuery('#clearNode,#clearNodeLabel').on('click', function () {
            bi.dialog.confirm({
                title: sabace.getMessage("data.dataLink.label.prompt"),
                message: sabace.getMessage("data.dataLink.label.clearAllNode"),
                callback: function (result) {
                    if (result) {
                        delAllNodeAndCon();
                    }
                }
            });
        });
    }

    /**
     * 初始化添加节点事件
     */
    function bindAddNode(nodeIdArray) {
            var url = sabace.handleUrlParam("/platform/resmanage/datalink/data-link-choose");
            //添加新数据源对话框
            bi.dialog.show({
                title: sabace.getMessage('data.dataLink.label.addDataNode'),
                message: jQuery('<div width="955px" height="450px" id="daChooseIframe"></div>').load(url),
                cssClass: 'data-choose-dialog',
                closable: true,
                closeByBackdrop: false,
                closeByKeyboard: false,
                onshown: function () {
                        dataLinkChoose.setNodeIdArray(nodeIdArray);
                        dataLinkChoose.init();
                    },
                    buttons: [{
                        label: sabace.getMessage('data.dataLink.label.Sure'),
                        cssClass: 'btn-info',
                        action: function (dialog) {
                            sabace.ajax({
                                url: sabace.handleUrlParam("/platform/resmanage/datalink/query-link-data"),
                                success: function (req) {
                                        var paramDataArrTemp = dataLinkChoose.getCheckedNode();
                                        var dataLinkNum = req.dataLinkNum;
                                        var nodeArray = jQuery('.statemachine-demo .mydiv');
                                        if (dataLinkNum >= nodeArray.length + paramDataArrTemp.length) {
                                            for (var i = 0; i < paramDataArrTemp.length; i++) {
                                                initMdataNode(paramDataArrTemp[i].dataId, false);
                                            }
                                        } else {
                                            bi.dialog.show({
                                                type: bi.dialog.TYPE_DANGER,
                                                title: sabace.getMessage('data.dataLink.label.prompt'),
                                                message: sabace.getMessage('data.import.message.linkoverbycom')
                                            });
                                        }
                                        dialog.close();
                                    },
                                    error: function (req) {
                                        dialog.close();
                                        bi.dialog.show({
											type: bi.dialog.TYPE_DANGER,
											title: sabace.getMessage('data.dataLink.label.prompt'),
											message: req.responseText || sabace.getMessage('data.import.message.linkoverbycom')
										});
                                    }
                            });
                        }
                    }, {
                        label: sabace.getMessage('data.dataLink.label.Cancel'),
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
            });
        }
        /**
         * 渲染一个节点
         */

    function initMdataNode(MdataId, firstTimeFlag) {
        var paramData = {
            "nodeDataId": MdataId,
            "isModify": "no"
        };
        sabace.ajax({
            url: sabace.handleUrlParam("/platform/resmanage/datalink/main-data-node"),
            data: paramData,
            loading: {
                title: sabace.getMessage("data.dataLink.label.workingTitle"),
                text: sabace.getMessage("data.dataLink.label.workingLoading")
            },
            success: function (req) {
                    //如果是第一个节点就initjsplumb
                    if (firstTimeFlag) {
                        //将查询出来的节点信息渲染到页面中去
                        initDataNode(req.linkNodeBean, true, "yes");
                        initjsplumb();
                    } else {
                        //将节点重新初始化
                        initDataNode(req.linkNodeBean, false, "yes");
                        reSetDivDigaable(MdataId);
                    }
                },
                error: function (req) {
                    bi.dialog.show({
                        type: bi.dialog.TYPE_DANGER,
                        title: sabace.getMessage("data.dataLink.label.prompt"),
                        message: req.responseText || sabace.getMessage("data.dataLink.error.queryLinkNodeError")
                    });
                }
        });
    }

    //点击数据节点中的×
    function initDelDiv() {
        jQuery("#statemachine-demo").on('click', '.del-icon', function () {
            var $this = jQuery(this);
            bi.dialog.confirm({
                title: sabace.getMessage("data.dataLink.label.prompt"),
                message: sabace.getMessage("data.dataLink.label.clearNode"),
                callback: function (result) {
                    if (result) {
                        //先获取要删除的数据点的属性
                        var nodeParamIdArray = [];
                        var nodeParamArray = $this.parent().parent().find('.divline');
                        for (var i = 0; i < nodeParamArray.length; i++) {
                            nodeParamIdArray.push(jQuery(nodeParamArray[i]).attr("id"))
                        }
                        var conArray = instance.getConnections();
                        for (var i = 0; i < conArray.length; i++) {
                            for (var j = 0; j < nodeParamIdArray.length; j++) {
                                if (nodeParamIdArray[j] == conArray[i].sourceId || nodeParamIdArray[j] == conArray[i].targetId) {
                                    instance.detach(conArray[i]);
                                }
                            }
                        }
                        $this.parent().parent().remove();
                        var nodeArrayDel = jQuery('.statemachine-demo .mydiv');
                        if (nodeArrayDel.length == 0) {
                            jQuery('#addNode').click();
                        }
                        var filterConArr = jQuery('.con-box #' + $this.parent().parent().attr('id'));
                        for (var i = 0; i < filterConArr.length; i++) {
                            if (jQuery(filterConArr[i]).parent().prev(".con-and").length == 0) {
                                jQuery(filterConArr[i]).parent().next(".con-and").remove();
                            } else {
                                jQuery(filterConArr[i]).parent().prev(".con-and").remove();
                            }
                            jQuery(filterConArr[i]).parent().remove();
                        }
                    }
                }
            });
        });
    }



    //初始化笔
    function initPenIcon() {
        jQuery("#statemachine-demo").on("click", ".pen-filter", function () {
            var penIconId = jQuery(this).children('#pen-icon-id').val();
            var isUsed = jQuery(this).children('#pen-isUsed').val();
            if (0 == isUsed) {
                bi.dialog.show({
                    type: bi.dialog.TYPE_DANGER,
                    title: sabace.getMessage("data.dataLink.label.prompt"),
                    message: sabace.getMessage("data.dataLink.label.reChooseAttr")
                });
                return;
            }
            var penIconName = jQuery(this).children('#pen-icon-name').val();
            var filterType = jQuery(this).children('#pen-filterType').val();
            var attrType = jQuery(this).children('#pen-attrType').val();
            var fieldName = jQuery(this).children('#pen-fieldName').val();
            var dimId = jQuery(this).children('#pen-dimId').val();
            var dataId = jQuery(this).parent().parent().parent().attr('id');
            //判断是修改
            var mFlag = judgeModifyOrCreate(this);
            var modifyObj = {};
            if ('modify' == mFlag) {
                var tmpArray = jQuery('.con-box .con-box-in #filterParamId');
                for (var i = 0; i < tmpArray.length; i++) {
                    if (penIconId == jQuery(tmpArray[i]).val()) {
                        modifyObj.whereText = jQuery(tmpArray[i]).parent().next('.con-box-content').children('.font-div-date').children('#whereText').val();
                        modifyObj.whereValue = jQuery(tmpArray[i]).parent().next('.con-box-content').children('.font-div-date').children('#whereValue').val();
                        modifyObj.isExclude = jQuery(tmpArray[i]).parent().next('.con-box-content').children('.font-div-date').children('#isExclude').val();
                        modifyObj.filterType = jQuery(tmpArray[i]).parent().next('.con-box-content').children('.font-div-date').children('#filterType').val();
                        //	modifyObj.fieldName = jQuery(tmpArray[i]).parent().next('.con-box-content').children('.font-div-date').children('#fieldName').val();
                    }
                }
            }
            modifyObj.dimId = dimId;
            //维度选择
            if ('1' == filterType) {
                bindDataDimensionFilter(penIconId, penIconName, fieldName, this, mFlag, modifyObj, dataId);
                //	bindStringFilter(penIconId,penIconName,fieldName,this,mFlag,modifyObj,dataId,'8');
                //月份
            } else if ('4' == filterType) {
                bindStringFilter(penIconId, penIconName, fieldName, this, mFlag, modifyObj, dataId, '1');
                //日期
            } else if ('6' == filterType) {
                bindStringFilter(penIconId, penIconName, fieldName, this, mFlag, modifyObj, dataId, '2');
                //时间
            } else if ('7' == filterType) {
                bindStringFilter(penIconId, penIconName, fieldName, this, mFlag, modifyObj, dataId, '3');
            } else {
                //数值型
                if ('1' == attrType) {
                    bindStringFilter(penIconId, penIconName, fieldName, this, mFlag, modifyObj, dataId, '8');
                    //日期型
                } else if ('2' == attrType) {
                    bindStringFilter(penIconId, penIconName, fieldName, this, mFlag, modifyObj, dataId, '2');
                    //字符型
                } else {
                    //9表示是
                    bindStringFilter(penIconId, penIconName, fieldName, this, mFlag, modifyObj, dataId, '9');
                }
            }
        })
    }

    /**
     * 维度选择
     */
    function bindDataDimensionFilter(penIconId, penIconName, fieldName, obj, mFlag, modifyObj, dataId) {
        var url = sabace.handleUrlParam("/platform/resmanage/datalink/data-dimension-filter");
        if ('modify' == mFlag) {
            dataDimensionFilter.setModifyObj(modifyObj);
        }
        bi.dialog.show({
            title: sabace.getMessage('data.dataLink.label.Cselection'),
            message: jQuery('<div width="761px" height="360px" id="daFilter"></div>').load(url),
            cssClass: 'data-dim-dialog',
            nl2br: false,
            closable: true,
            closeByBackdrop: false,
            closeByKeyboard: false,
            onshown: function () {
                    //dimId还未被查出
                    dataDimensionFilter.setDimId(modifyObj.dimId);
                    if ('modify' == mFlag) {
                        dataDimensionFilter.init(mFlag);
                    } else {
                        dataDimensionFilter.init();
                    }
                },
                buttons: [{
                    label: sabace.getMessage('data.dataLink.label.Sure'),
                    cssClass: 'btn-info',
                    action: function (dialogItself) {
                        var paramObj = dataDimensionFilter.getDimCode();
                        if (!sabace.IsEmpty(paramObj.whereValue)) {
                            if ('modify' == mFlag) {
                                var tmpArray = jQuery('.con-box .con-box-in #filterParamId');
                                for (var i = 0; i < tmpArray.length; i++) {
                                    if (penIconId == jQuery(tmpArray[i]).val()) {
                                        modifyFilterParamBox(tmpArray[i], paramObj);
                                    }
                                }
                            } else {
                                createFilterParamBox(paramObj, penIconId, penIconName, dataId);
                                jQuery(obj).after('<div class="up-no-icon-temp pen-icon-style-temp"></div>');
                            }
                            showFilterDiv();
                        } else {
                            if ('modify' == mFlag) {
                                log(dataId)
                                var arr = jQuery('#con-container .con-box #' + dataId + ' #filterParamId');
                                for (var i = 0; i < arr.length; i++) {
                                    if (penIconId == jQuery(arr[i]).val()) {
                                        jQuery(arr[i]).nextAll('.del-icon').trigger('click');
                                    }
                                }
                            }
                        }
                        dialogItself.close();
                    }
                }]
        });
    }

    //字符 类型的弹出框
    function bindStringFilter(penIconId, penIconName, fieldName, obj, mFlag, modifyObj, dataId, divFlag) {
        if ('modify' == mFlag) {
            dataLinkFilter.setModifyObj(modifyObj);
        }
        var url = sabace.handleUrlParam("/platform/resmanage/datalink/data-link-filter");
        bi.dialog.show({
            title: sabace.getMessage('data.dataLink.label.Cselection'),
            message: jQuery('<div width="761px" height="238px" id="daFilter"></div>').load(url),
            cssClass: 'data-filter-dialog',
            nl2br: false,
            closable: true,
            closeByBackdrop: false,
            closeByKeyboard: false,
            onshown: function () {
                    if ('modify' == mFlag) {
                        dataLinkFilter.init(divFlag, mFlag);
                    } else {
                        dataLinkFilter.init(divFlag);
                    }
                },
                buttons: [{
                    label: sabace.getMessage('data.dataLink.label.Sure'),
                    cssClass: 'btn-info',
                    action: function (dialogItself) {
                        var paramObj = dataLinkFilter.getSelectQuery();
                        if (!paramObj) {
                            return false;
                        } else {
                            if ('modify' == mFlag) {
                                var tmpArray = jQuery('.con-box .con-box-in #filterParamId');
                                for (var i = 0; i < tmpArray.length; i++) {
                                    if (penIconId == jQuery(tmpArray[i]).val()) {
                                        modifyFilterParamBox(tmpArray[i], paramObj);
                                    }
                                }
                            } else {
                                createFilterParamBox(paramObj, penIconId, penIconName, dataId);
                                jQuery(obj).after('<div class="up-no-icon-temp pen-icon-style-temp"></div>');
                            }
                            showFilterDiv();
                            //加上条件筛选标志
                            dialogItself.close();
                        }
                    }
                }]
        });
        jQuery('.chosen-select').chosen();
    }

    /**
     * 判断是添加条件筛选还是修改条件筛选 modify表示是修改的  add表示是添加的
     */
    function judgeModifyOrCreate(obj) {
        var upNoIcon = jQuery(obj).next('.up-no-icon-temp');
        if (upNoIcon.length > 0) {
            return "modify";
        } else {
            return "add";
        }
    }

    //创建条件筛选
    function createFilterParamBox(obj, penIconId, penIconName, dataId) {
        var andArr = jQuery('.con-box');
        if (andArr.length > 0) {
            var andHtml = '<div class="con-and"><label>并且</label></div>';
            jQuery('#con-container').append(andHtml);
        }
        var paramHtml = "";
        paramHtml += '<div class="con-box"';
        if (andArr.length > 0) {
            paramHtml += ' style="margin-left:10px">';
        } else {
            paramHtml += '>';
        }
        paramHtml += '<div class="con-box-in" id="' + dataId + '" >';
        var penIconNameTemp = penIconName;
        if (penIconName.length > 4) {
            penIconName = penIconName.substr(0, 4) + "..";
        }
        paramHtml += '<div class="del-icon del-icon-style-filter" title="' + sabace.getMessage('data.dataLink.label.delete') + '"></div>';
        paramHtml += '<label title=' + penIconNameTemp + '>' + penIconName + '</label>';
        paramHtml += '<input type="hidden" id="filterParamId" value="' + penIconId + '"/>';
        paramHtml += '<input type="hidden" id="filterParamName" value="' + penIconName + '"/>';
        paramHtml += '<input type="hidden" id="dataId" value="' + dataId + '"/>';
        paramHtml += '</div>';
        paramHtml += '<div class="con-box-content">';
        paramHtml += '<div class="nbsp-icon nbsp-icon-style"></div>';
        paramHtml += '<div class="font-div">' + sabace.getMessage('data.dataLink.label.conditionValue') + '</div>';
        paramHtml += '<div class="font-div font-div-date textOverflow" title="' + obj.trueText + '">' + obj.trueText;
        paramHtml += '<input type="hidden" id="whereText" value="' + obj.whereText + '"/>';
        paramHtml += '<input type="hidden" id="whereValue" value="' + obj.whereValue + '"/>';
        paramHtml += '<input type="hidden" id="filterType" value="' + obj.filterType + '"/>';
        paramHtml += '<input type="hidden" id="isExclude" value="' + obj.isExclude + '"/>';
        paramHtml += '</div>';
        paramHtml += '</div>';
        paramHtml += '</div>';
        jQuery('#con-container').append(paramHtml);
    }

    /**
     * 绑定条件筛选删除
     */
    function bindFilterDelete() {
        jQuery('#con-container').on('click', '.del-icon-style-filter', function () {
            var $this = jQuery(this);
            bi.dialog.confirm({
                title: sabace.getMessage("data.dataLink.label.prompt"),
                message: sabace.getMessage("data.dataLink.label.clearNodeFilter"),
                callback: function (result) {
                    if (result) {
                        var filterParamId = $this.nextAll("#filterParamId").val();
                        jQuery('#' + filterParamId).children('.paramdiv').children('.pen-icon-style-temp').remove();
                        if ($this.parent().parent().prev('.con-and').length == 0) {
                            $this.parent().parent().next('.con-and').remove();
                        } else {
                            $this.parent().parent().prev('.con-and').remove();
                        }
                        $this.parent().parent().remove();
                    }
                }
            });
        });
    }

    //修改筛选条件
    function modifyFilterParamBox(obj, paramObj) {
        jQuery(obj).parent().next('.con-box-content').children('.font-div-date').text(paramObj.trueText);;
        jQuery(obj).parent().next('.con-box-content').children('.font-div-date').prop('title', paramObj.trueText);
        var h1 = '<input type="hidden" id="whereText" value="' + paramObj.whereText + '"/>';
        h1 += '<input type="hidden" id="whereValue" value="' + paramObj.whereValue + '"/>';
        h1 += '<input type="hidden" id="filterType" value="' + paramObj.filterType + '"/>'
        h1 += '<input type="hidden" id="isExclude" value="' + paramObj.isExclude + '"/>'
        jQuery(obj).parent().next('.con-box-content').children('.font-div-date').append(h1);
    }

    /**
     * 展示条件筛选
     */
    function showFilterDiv() {
        if (jQuery('#plumblabel').hasClass('plumblabelTemp')) {
            jQuery('#plumblabel').removeClass('plumblabelTemp');
            jQuery('#plumblabel').addClass('plumblabel');
        }
        if (jQuery('#statemachine-demo').hasClass('dpanelTemp')) {
            jQuery('#statemachine-demo').removeClass('dpanelTemp');
            jQuery('#statemachine-demo').addClass('dpanel');
        }
        if (jQuery('#conditionlabel').hasClass('conditionlabelTemp')) {
            jQuery('#conditionlabel').removeClass('conditionlabelTemp');
            jQuery('#conditionlabel').addClass('conditionlabel');
        }
        if (jQuery('.containerDiv').hasClass('dis-none')) {
            jQuery('.containerDiv').removeClass('dis-none');
        }
        if (jQuery('#updown').hasClass('upshow-icon')) {
            jQuery('#updown').removeClass('upshow-icon');
            jQuery('#updown').removeClass('upshow-icon-style');
            jQuery('#updown').addClass('down-icon');
            jQuery('#updown').addClass('down-icon-style');
        }
    }

    //清楚所有节点
    function delAllNodeAndCon() {
        instance.detachEveryConnection();
        var nodeArrayDel = jQuery('.statemachine-demo .mydiv');
        var nodeIdArrayDel = new Array;
        for (var i = 0; i < nodeArrayDel.length; i++) {
            nodeIdArrayDel.push(jQuery(nodeArrayDel[i]).attr("id"));
        }
        //主节点一并清除
        for (var i = 0; i < nodeIdArrayDel.length; i++) {
            if (MdataId == nodeIdArrayDel[i]) {
                //	continue;
            }
            jQuery("#" + nodeIdArrayDel[i]).remove();

            var filterConArr = jQuery('.con-box #' + nodeIdArrayDel[i]);
            for (var j = 0; j < filterConArr.length; j++) {
                if (jQuery(filterConArr[j]).parent().prev(".con-and").length == 0) {
                    jQuery(filterConArr[j]).parent().next(".con-and").remove();
                } else {
                    jQuery(filterConArr[j]).parent().prev(".con-and").remove();
                }
                jQuery(filterConArr[j]).parent().remove();
            }
        }
        jQuery('#addNode').click();
    }

    /**
     * 添加一个节点
     */
    function reSetDivDigaable(MdataId) {
        instance.draggable(jsPlumb.getSelector(".statemachine-demo #" + MdataId));
        var windowsTemp = jsPlumb.getSelector("#" + MdataId + " .ziduan");
        instance.makeSource(windowsTemp, {
            filter: '.paramdiv,.textOverflow',
            dropOptions: {
                hoverClass: "dragHover"
            },
            connector: ["StateMachine", {
                curviness: 20
            }],
            connectorStyle: {
                strokeStyle: "#5c96bc",
                lineWidth: 2,
                outlineColor: "transparent",
                outlineWidth: 4
            },
            anchor: "Continuous"
        });
        instance.makeTarget(windowsTemp, {
            filter: '.paramdiv,.textOverflow',
            dropOptions: {
                hoverClass: "dragHover"
            },
            anchor: "Continuous"
        });
    }

    /**
     * 渲染添加节点信息 flag true为主节点 false为不是
     * isModify yes说明是添加的时候，no是修改节点
     */
    function initDataNode(linkNodeBean, flag, isModify) {
        var nodeHtml = "";
        if ('yes' == isModify) {
            nodeHtml += '<div class="mydiv w" id="' + linkNodeBean.nodeDataId + '" style="top:' + topIndex + 'px;left:' + leftIndex + 'px">';
            topIndex += 10;
            leftIndex += 10;
        } else {
            nodeHtml += '<div class="mydiv w" id="' + linkNodeBean.nodeDataId + '" style="top:' + linkNodeBean.nodeTop + 'px;left:' + linkNodeBean.nodeLeft + 'px">';
        }

        //经修改去除了主节点这个概念
        /*if(flag){
			nodeHtml += '<div class="firstdiv chooseDiv">';
			nodeHtml += '<div class="del-icon del-icon-style"></div>';
		}else{*/
        nodeHtml += '<div class="firstdiv-own chooseDiv">';
        nodeHtml += '<div class="del-icon del-icon-style"></div>';
        //	}
        nodeHtml += '<div class="file-icon file-icon-style"></div>';
        nodeHtml += '<div title="' + linkNodeBean.nodeDataName + '" class="tb-title">' + linkNodeBean.nodeDataName + '</div>';
        nodeHtml += '<div style="clear:both;"></div>';
        nodeHtml += '</div>';
        var nodeHtmlParam = "";
        for (var i = 0; i < linkNodeBean.linkSelectBeanList.length; i++) {
            if ('1' == linkNodeBean.linkSelectBeanList[i].isUsed) {
                nodeHtmlParam += '<div class="divline ziduan" id="' + linkNodeBean.linkSelectBeanList[i].attrId + '">';
            } else {
                nodeHtmlParam += '<div style="color:red" class="divline ziduan" id="' + linkNodeBean.linkSelectBeanList[i].attrId + '">';
            }

            nodeHtmlParam += '<div class="paramdiv" style="width:100%"><div style="width:70%;float:left" title="' + linkNodeBean.linkSelectBeanList[i].attrName + '" class="textOverflow">' + linkNodeBean.linkSelectBeanList[i].attrName;
            nodeHtmlParam += '</div><div class="pen-icon pen-icon-style pen-filter">';
            nodeHtmlParam += '<input type="hidden" id="pen-icon-id" value="' + linkNodeBean.linkSelectBeanList[i].attrId + '"/>';
            nodeHtmlParam += '<input type="hidden" id="pen-icon-name" value="' + linkNodeBean.linkSelectBeanList[i].attrName + '"/>';
            nodeHtmlParam += '<input type="hidden" id="pen-filterType" value="' + linkNodeBean.linkSelectBeanList[i].filterType + '"/>';
            nodeHtmlParam += '<input type="hidden" id="pen-attrType" value="' + linkNodeBean.linkSelectBeanList[i].attrType + '"/>';
            nodeHtmlParam += '<input type="hidden" id="pen-fieldName" value="' + linkNodeBean.linkSelectBeanList[i].fieldName + '"/>';
            nodeHtmlParam += '<input type="hidden" id="pen-dimId" value="' + linkNodeBean.linkSelectBeanList[i].dimId + '"/>';
            nodeHtmlParam += '<input type="hidden" id="pen-isUsed" value="' + linkNodeBean.linkSelectBeanList[i].isUsed + '"/>';
            nodeHtmlParam += '<input type="hidden" id="pen-column-type" value="' + linkNodeBean.linkSelectBeanList[i].columnType + '"/>';
            nodeHtmlParam += '</div>';
            nodeHtmlParam += '</div>';
            nodeHtmlParam += '</div>';
        }
        nodeHtml += nodeHtmlParam;
        nodeHtml += '</div>';
        jQuery('#statemachine-demo').append(nodeHtml);
    }

    /**
     * 控制上下跳动按钮
     */
    function updownShow() {
        jQuery('#updown').on('click', function () {
            jQuery('#plumblabel').toggleClass('plumblabel');
            jQuery('#plumblabel').toggleClass('plumblabelTemp');
            jQuery('#statemachine-demo').toggleClass('dpanel');
            jQuery('#statemachine-demo').toggleClass('dpanelTemp');
            jQuery('#conditionlabel').toggleClass('conditionlabel');
            jQuery('#conditionlabel').toggleClass('conditionlabelTemp');
            jQuery('.containerDiv').toggleClass('dis-none');
            jQuery(this).toggleClass('down-icon');
            jQuery(this).toggleClass('down-icon-style');
            jQuery(this).toggleClass('upshow-icon');
            jQuery(this).toggleClass('upshow-icon-style');
        });
    }

    /**
     * 初始化jsplumb
     */
    function initjsplumb() {
        jsPlumb.ready(function () {
            instance = jsPlumb.getInstance({
                Endpoint: ["Dot", {
                    radius: 0.1
                }],
                HoverPaintStyle: {
                    strokeStyle: "#1e8151",
                    lineWidth: 2
                },
                ConnectionOverlays: [
                    ["Arrow", {
                        location: 1,
                        id: "arrow",
                        length: 14,
                        foldback: 0.8
                    }],
                    ["Label", {
                        label: "",
                        id: "label",
                        cssClass: "aLabel"
                    }]
                ],
                Container: "statemachine-demo"
            });
            var windows2 = jsPlumb.getSelector(".statemachine-demo .w");
            var windows = jsPlumb.getSelector(".statemachine-demo .w .ziduan");
            instance.draggable(windows2);
            //instance.draggable(jsPlumb.getSelector(".window"), { containment:".demo"});   
            instance.bind("click", function (c) {
                instance.detach(c);
            });

            instance.bind("connection", function (info) {
                var connections = instance.getConnections();
                var num = 0;
                for (var i = 0; i < connections.length; i++) {
                    if (connections[i].sourceId == info.connection.sourceId && connections[i].targetId == info.connection.targetId) {
                        num += 1;
                    }
                    if (connections[i].sourceId == info.connection.targetId && connections[i].targetId == info.connection.sourceId) {
                        num += 1;
                    }
                }
                if (num == 2) {
                    instance.detach(info);
                    return;
                }
                //先把线给清除掉
                var targetParent = jQuery('#' + info.connection.targetId).parent().attr('id');
                var sourceParent = jQuery('#' + info.connection.sourceId).parent().attr('id');
                if (targetParent == sourceParent) {
                    instance.detach(info);
                    return;
                }
                if (info.connection.targetId == info.connection.sourceId) {
                    instance.detach(info);
                    return;
                }
                var tColumnType = jQuery('#' + info.connection.targetId).find('#pen-column-type').val();
                var sColumnType = jQuery('#' + info.connection.sourceId).find('#pen-column-type').val();
                if (tColumnType.startWith('text') || sColumnType.startWith('text')) {
                    bi.dialog.show({
                        type: bi.dialog.TYPE_DANGER,
                        title: sabace.getMessage("data.dataLink.label.prompt"),
                        message: sabace.getMessage('data.import.message.fieldintext')
                    });
                    instance.detach(info);
                    return;
                }
                var linkTypeMsg = '';
                linkTypeMsg += '<div id="chooseMessage" class="hide" >';
                linkTypeMsg += '<div class="form-group">';
                linkTypeMsg += '<label class="radioLabel radio">';
                linkTypeMsg += '<input type="radio" data-toggle="radio" value="leftjoin" name="relRadio" id="optionsRadios3" data-radiocheck-toggle="radio" checked="">';
                linkTypeMsg += '<span style="margin-left:5px">'+sabace.getMessage('data.dataLink.label.leftjoinTemp')+'</span>';
                linkTypeMsg += '</label>';
                linkTypeMsg += '<label class="radioLabel radio">';
                linkTypeMsg += '<input type="radio" data-toggle="radio" value="equals" name="relRadio" id="optionsRadios4" data-radiocheck-toggle="radio" required>';
                linkTypeMsg += '<span style="margin-left:5px">'+sabace.getMessage('data.dataLink.label.equalTemp')+'</span>';
                linkTypeMsg += '</label>';
                linkTypeMsg += '</div>';
                linkTypeMsg += '</div>';
                //新增的时候连接方式
                if ("add" == linkModifyFlag) {
                    bi.dialog.show({
                        title: sabace.getMessage('data.dataLink.label.chooseLink'),
                        message: linkTypeMsg,
                        cssClass: 'data-message-dialog',
                        nl2br: false,
                        closable: false,
                        closeByBackdrop: false,
                        closeByKeyboard: false,
                        onshown:function(){
                        	jQuery('[name="relRadio"]').iCheck({
                				checkboxClass: 'icheckbox_minimal',
                				radioClass: 'iradio_minimal'
                			});
                        	jQuery('#chooseMessage').removeClass('hide');
                        },
                        buttons: [{
                            label: sabace.getMessage('data.dataLink.label.Sure'),
                            cssClass: 'btn-info',
                            action: function (dialogItself) {
                                if ("leftjoin" == jQuery('input[name="relRadio"]:checked').val()) {
                                    info.connection.getOverlay("label").setLabel(sabace.getMessage('data.dataLink.label.leftjoinTemp'));
                                    var obj = {
                                        lineWidth: 3,
                                        strokeStyle: "#ffa500",
                                        "dashstyle": "2 4"
                                    };
                                    info.connection.setPaintStyle(obj);
                                } else {
                                    info.connection.getOverlay("label").setLabel(sabace.getMessage('data.dataLink.label.equalTemp'));
                                }
                                if (info.connection.targetId == info.connection.sourceId) {
                                    instance.detach(info);
                                }
                                
                                // 判断两个数据表之间只能有同一种关系
                                checkRelation(connections, info);
                                dialogItself.close();
                            }
                        }]
                    });
                } else {
                    //修改的时候
                    if ('1' == leftOrEqFlag) {
                        leftOrEqFlag = '';
                        info.connection.getOverlay("label").setLabel(sabace.getMessage('data.dataLink.label.equalTemp'));
                    } else if ('2' == leftOrEqFlag) {
                        info.connection.getOverlay("label").setLabel(sabace.getMessage('data.dataLink.label.leftjoinTemp'));
                        var obj = {
                            lineWidth: 3,
                            strokeStyle: "#ffa500",
                            "dashstyle": "2 4"
                        };
                        leftOrEqFlag = '';
                        info.connection.setPaintStyle(obj);
                    } else {
                        bi.dialog.show({
                            title: sabace.getMessage('data.dataLink.label.chooseLink'),
                            message: linkTypeMsg,
                            cssClass: 'data-message-dialog',
                            nl2br: false,
                            closable: false,
                            closeByBackdrop: false,
                            closeByKeyboard: false,
                            onshown:function(){
                            	jQuery('[name="relRadio"]').iCheck({
                    				checkboxClass: 'icheckbox_minimal',
                    				radioClass: 'iradio_minimal'
                    			});
                            	jQuery('#chooseMessage').removeClass('hide');
                            },
                            buttons: [{
                                label: sabace.getMessage('data.dataLink.label.Sure'),
                                cssClass: 'btn-info',
                                action: function (dialogItself) {
                                    if ("leftjoin" == jQuery('input[name="relRadio"]:checked').val()) {
                                        info.connection.getOverlay("label").setLabel(sabace.getMessage('data.dataLink.label.leftjoinTemp'));
                                        var obj = {
                                            lineWidth: 3,
                                            strokeStyle: "#ffa500",
                                            "dashstyle": "2 4"
                                        };
                                        info.connection.setPaintStyle(obj);
                                    } else {
                                        info.connection.getOverlay("label").setLabel(sabace.getMessage('data.dataLink.label.equalTemp'));
                                    }
                                    if (info.connection.targetId == info.connection.sourceId) {
                                        instance.detach(info);
                                    }
                                    // 判断两个数据表之间只能有同一种关系
                                    checkRelation(connections, info);
                                    dialogItself.close();
                                }
                            }]
                        });
                    }
                }

            });
            instance.makeSource(windows, {
                filter: '.paramdiv,.textOverflow',
                dropOptions: {
                    hoverClass: "dragHover"
                },
                connector: ["StateMachine", {
                    curviness: 20
                }],
                connectorStyle: {
                    strokeStyle: "#5c96bc",
                    lineWidth: 2,
                    outlineColor: "transparent",
                    outlineWidth: 4
                },
                anchor: "Continuous"
            });
            instance.makeTarget(windows, {
                filter: '.paramdiv,.textOverflow',
                dropOptions: {
                    hoverClass: "dragHover"
                },
                anchor: "Continuous"
            });
            jsPlumb.fire("jsPlumbDemoLoaded", instance);
        });
    }
    
    /**
     * 判断两个数据之间只能有同一种关系
     */
    function checkRelation(connections, info){
        var onlyNum = 0;
        var connectionStarDivId = null;
        var infoStarDivId = null;
        var connectionEndDivId = null;
        var infoEndDivId = null;
        for (var i = 0; i < connections.length; i++) {
            // 两张表之间只能有一种关系
            connectionStarDivId = jQuery('#' + connections[i].sourceId).parent().attr('id');
            infoStarDivId = jQuery('#' + info.connection.sourceId).parent().attr('id');
            connectionEndDivId = jQuery('#' + connections[i].targetId).parent().attr('id');
            infoEndDivId = jQuery('#' + info.connection.targetId).parent().attr('id');
            if(connectionStarDivId == infoStarDivId && connectionEndDivId == infoEndDivId){
            	if(connections[i]._jsPlumb.overlays.label.label != info.connection._jsPlumb.overlays.label.label){
            		onlyNum += 1;
            	}
            }
            if(connectionStarDivId == infoEndDivId && connectionEndDivId == infoStarDivId){
            	if(connections[i]._jsPlumb.overlays.label != info.connection._jsPlumb.overlays.label.label){
            		onlyNum += 1;
            	}
            }
        }
    	if(onlyNum > 0){
        	 bi.dialog.show({
                 type: bi.dialog.TYPE_DANGER,
                 title: sabace.getMessage("data.dataLink.label.prompt"),
                 message: "两个数据之间只能存在同种连接关系，所有的连接关系都为左连接或都为等于！"
             });
        	instance.detach(info);
            return;
        }
    }

    /**
     * 初始化下一步菜单
     */
    function initNextStep1() {
        jQuery('#nextbth1').on('click', function () {
            if (!checkJsplumbDrag()) {
                bi.dialog.confirm({
                    title: sabace.getMessage('data.dataLink.label.prompt'),
                    message: sabace.getMessage('data.dataLink.label.linkError')
                });
                return;
            }
            /*var nodeArrayTemp = jQuery('.statemachine-demo .mydiv');
			
			if(nodeArrayTemp.length<2){
				bi.dialog.confirm({
		            title: sabace.getMessage("data.dataLink.label.prompt"),
		            message: '请选择两个以上实体！'
			    });
				return;
			}*/
            //获取第一部分的数据
            var gFlag = getPamramByStep1();
            if (!gFlag) {
                //将设置连接关系页面隐藏
                jQuery('#plumbContent').addClass('dis-none');

                //将光标提示信息提示到设置结果信息
                if (jQuery('#step1').hasClass('step-tab-select')) {
                    jQuery('#step1').removeClass('step-tab-select');
                    jQuery('#step1').addClass('step-tab-unselect');
                }
                if (jQuery('#step2').hasClass('step-tab-unselect')) {
                    jQuery('#step2').removeClass('step-tab-unselect');
                    jQuery('#step2').addClass('step-tab-select');
                }
                //将设置结果信息页面展示
                if (jQuery('#plumbContent2').hasClass('dis-none')) {
                    jQuery('#plumbContent2').removeClass('dis-none');
                }

                //	jQuery('#step1 .step-title-num').addClass('active-notFinished');
                jQuery('#step2 .step-title-num').removeClass('active-notFinished');
            }

        });
    }

    function getPamramByStep1() {
    	var dataDelFalg = false;
        modifyStopFlag = false;
        //获取所有节点
        var nodeArray = jQuery('.statemachine-demo .mydiv');
        if (nodeArray.length < 2) {
            bi.dialog.show({
                type: bi.dialog.TYPE_DANGER,
                title: sabace.getMessage("data.dataLink.label.prompt"),
                message: sabace.getMessage('data.import.message.seltwoentities')
            });
            modifyStopFlag = true;
            return modifyStopFlag;
        }

        //
        var nodeDataArray = new Array;
        //数据节点
        var dataNode;
        //数据节点字段
        var dataNodeArray;
        //字段实体
        var dataNodeArrayObj;
        for (var i = 0; i < nodeArray.length; i++) {
            //nodeIdArray.push(jQuery(nodeArray[i]).attr("id"));
            dataNode = {};
            dataNode.nodeTop = jQuery(nodeArray[i]).css("top").substring(0, jQuery(nodeArray[i]).css("top").length - 2);
            dataNode.nodeLeft = jQuery(nodeArray[i]).css("left").substring(0, jQuery(nodeArray[i]).css("left").length - 2);
            //		dataNode.nodeTop = 70;
            //		dataNode.nodeLeft = 180;
            dataNode.nodeDataId = jQuery(nodeArray[i]).attr("Id");
            dataNode.nodeDataName = jQuery(nodeArray[i]).children('.chooseDiv').children('.tb-title').text();
            var temArray = jQuery(nodeArray[i]).children('.divline');
            dataNodeArray = new Array;
            for (var j = 0; j < temArray.length; j++) {
                dataNodeArrayObj = {};
                dataNodeArrayObj.attrId = jQuery(temArray[j]).attr('id');
                dataNodeArrayObj.attrName = jQuery(temArray[j]).children('.paramdiv').text();
                dataNodeArrayObj.fieldName = jQuery(temArray[j]).children('.paramdiv').children('.pen-filter').children('#pen-fieldName').val();
                dataNodeArrayObj.filterType = jQuery(temArray[j]).children('.paramdiv').children('.pen-filter').children('#pen-filterType').val();
                dataNodeArrayObj.dimId = jQuery(temArray[j]).children('.paramdiv').children('.pen-filter').children('#pen-dimId').val();
                if ('1' == jQuery('#' + dataNodeArrayObj.attrId).find('#pen-isUsed').val()) {
                    dataNodeArray.push(dataNodeArrayObj);
                }
            }
            dataNode.dataNodeArray = dataNodeArray;
            nodeDataArray.push(dataNode);
            if(jQuery(nodeArray[i]).children('.firstdiv-own').hasClass('back-white')){
            	 bi.dialog.show({
                     type: bi.dialog.TYPE_DANGER,
                     title: sabace.getMessage("data.dataLink.label.prompt"),
                     message: '数据源"'+jQuery(nodeArray[i]).children('.firstdiv-own').children('.tb-title').text()+'"被删除，请重新选择！'
                 });
            	 dataDelFalg = true;
            	break;
            }
        }
        if(dataDelFalg){
        	return true;
        }
        var nodeDataLinkArray = new Array;
        var nodeDataLinkObj;
        var conArray = instance.getConnections();
        var usedFlag = false;
        //获取连接信息
        for (var i = 0; i < conArray.length; i++) {
            nodeDataLinkObj = {};
            var tempSourceId = conArray[i].sourceId;
            nodeDataLinkObj.leftDataId = jQuery('#' + tempSourceId).parent().attr('id');
            nodeDataLinkObj.leftFieldName = jQuery('#' + tempSourceId).children().children().children('#pen-fieldName').val();
            nodeDataLinkObj.leftAttrId = tempSourceId;
            nodeDataLinkObj.leftAttrType = jQuery('#' + tempSourceId).find("#pen-attrType").val();
            var isUsedleft = jQuery('#' + tempSourceId).find('#pen-isUsed').val();
            //绑定关联关系
            if (sabace.getMessage('data.dataLink.label.equalTemp') == conArray[i]._jsPlumb.overlays.label.label) {
                nodeDataLinkObj.linkType = '1';
            } else {
                nodeDataLinkObj.linkType = '2';
            }
            var tempTargetId = conArray[i].targetId;
            nodeDataLinkObj.rightDataId = jQuery('#' + tempTargetId).parent().attr('id');
            nodeDataLinkObj.rightFieldName = jQuery('#' + tempTargetId).children().children().children('#pen-fieldName').val();
            nodeDataLinkObj.rightAttrId = tempTargetId;
            nodeDataLinkObj.rightAttrType = jQuery('#' + tempTargetId).find("#pen-attrType").val();
            var isUsedright = jQuery('#' + tempTargetId).find('#pen-isUsed').val();
            if ('0' == isUsedleft || '0' == isUsedright) {
                usedFlag = true;
                break;
            }
            nodeDataLinkArray.push(nodeDataLinkObj);
        }
        if (usedFlag) {
            bi.dialog.show({
                type: bi.dialog.TYPE_DANGER,
                title: sabace.getMessage("data.dataLink.label.prompt"),
                message: sabace.getMessage("data.dataLink.label.reChooseAttr")
            });
            modifyStopFlag = true;
            return modifyStopFlag;
        }
        //获取filter
        var linkWhereObj;
        var linkWhereObjArray = new Array;
        var filterArray = jQuery('#con-container .con-box');
        for (var i = 0; i < filterArray.length; i++) {
            linkWhereObj = {};
            linkWhereObj.attrId = jQuery(filterArray[i]).children('.con-box-in').children('#filterParamId').val();
            linkWhereObj.attrName = jQuery(filterArray[i]).children('.con-box-in').children('#filterParamName').val();
            linkWhereObj.whereText = jQuery(filterArray[i]).children('.con-box-content').children('.font-div-date').children('#whereText').val();
            linkWhereObj.whereValue = jQuery(filterArray[i]).children('.con-box-content').children('.font-div-date').children('#whereValue').val();
            linkWhereObj.filterType = jQuery(filterArray[i]).children('.con-box-content').children('.font-div-date').children('#filterType').val();
            linkWhereObj.isExclude = jQuery(filterArray[i]).children('.con-box-content').children('.font-div-date').children('#isExclude').val();
            linkWhereObj.fieldName = jQuery(filterArray[i]).children('.con-box-content').children('.font-div-date').children('#fieldName').val();
            linkWhereObj.dataId = jQuery(filterArray[i]).children('.con-box-in').children('#dataId').val();
            linkWhereObj.orderId = i + 1;
            linkWhereObjArray.push(linkWhereObj);
        }

        resultObj.linkWhereObjArray = linkWhereObjArray;
        resultObj.nodeDataArray = nodeDataArray;
        resultObj.nodeDataLinkArray = nodeDataLinkArray;
        //给第二步的初始化
        initStep2Param(resultObj.nodeDataArray, resultObj.nodeDataLinkArray);
        return modifyStopFlag;
    }


    /**
     * 初始化第二步
     */
    function initStep2Param(nodeDataArray, nodeDataLinkArray) {
        var paramHtml;
        var kNum = 1;
        for (var i = 0; i < nodeDataArray.length; i++) {
            var dataNodeArray = nodeDataArray[i].dataNodeArray;
            var flag = true;
            var tFalg = null;
            for (var j = 0; j < dataNodeArray.length; j++) {
                paramHtml += '<tr class="zdDiv">';
                paramHtml += '<td class="t-width tbackg td-align-center">' + kNum + '</td>'
                if (flag) {
                    paramHtml += '<td class="t-width1 td-align-left"'
                    paramHtml += 'rowspan="' + dataNodeArray.length + '"';
                    paramHtml += '><div class="t-width1 textOverflow">' + nodeDataArray[i].nodeDataName + '</div></td>';
                    flag = false;
                }
                paramHtml += '<td class="t-width2 t-attrname td-align-left"><div id="spanDiv" class="t-width2 textOverflow">' + dataNodeArray[j].attrName + '</div><input type="hidden" id="attrNameInput" class="validate[required],sp,len[1,100]" ><div class="pen-icon pen-icon-click"></div><div style="clear: both;"></div></td>';
                paramHtml += '<td class="t-width3 td-align-center">';
                paramHtml += '<input type="hidden" name="fieldName" id="fieldName" value="' + dataNodeArray[j].fieldName + '"/>';
                paramHtml += '<input type="hidden" name="filterType" id="filterType" value="' + dataNodeArray[j].filterType + '"/>';
                paramHtml += '<input type="hidden" name="dimId" id="dimId" value="' + dataNodeArray[j].dimId + '"/>';
                tFalg = false;
                if (checkedAttr.length > 0) {
                    if (checkedAttr.indexOf(dataNodeArray[j].attrId) > -1) {
                        tFalg = true;
                    }
                }
                if (tFalg) {
                    paramHtml += '<input type="checkbox" name="attrId" checked="checked" id="attrId" value="' + dataNodeArray[j].attrId + '" />';
                } else {
                    paramHtml += '<input type="checkbox" name="attrId" id="attrId" value="' + dataNodeArray[j].attrId + '" />';
                }
                paramHtml += '<input type="hidden" name="nodeDataId" id="nodeDataId" value="' + nodeDataArray[i].nodeDataId + '" />';
                paramHtml += '</td></tr>';
                kNum++;
            }
        }
        jQuery('#dtable tbody tr').remove('.zdDiv');
        jQuery('#headTr').after(paramHtml);
        //初始化选择字段
        if (initSelectFlag == true) {
            initSelectFlag = false;
            var checkedArr = dataLinkObj.checkedArr;
            var attrArray = jQuery('input[name="attrId"]');
            for (var i = 0; i < checkedArr.length; i++) {
                for (var j = 0; j < attrArray.length; j++) {
                    if (checkedArr[i].attrId == jQuery(attrArray[j]).val()) {
                        jQuery(attrArray[j]).attr("checked", "checked");
                    }
                }
            }
        }
        checkAll();
        //	initChangeAttrName();
    }



    function initChangeAttrName() {
        jQuery('#dtable').on('click', '.pen-icon-click', function () {
            var str = $(this).parent().children("#spanDiv").html();
            jQuery(this).prevAll("#spanDiv").addClass('dis-none');
            jQuery(this).prev("#attrNameInput").val(str);
            jQuery(this).prev("#attrNameInput").attr("type", "text");
            jQuery(this).prev("#attrNameInput").focus();
            jQuery(this).addClass('dis-none');
        });
        jQuery('#dtable').on('blur', '#attrNameInput', function () {
            var isPass = $('.data-concat-grid').validationEngine('validate');
            if (!isPass) {
                return false;
            }
            var str = jQuery(this).val();
            jQuery(this).attr("type", "hidden");
            jQuery(this).prevAll("#spanDiv").html(str);

            jQuery(this).next('.pen-icon').removeClass('dis-none');
            jQuery(this).prevAll("#spanDiv").removeClass('dis-none');
        });
        /*jQuery('#attrNameInput').keydown(function(e) {
			if (e.keyCode == 13) {
				var str = jQuery(this).val();
				jQuery(this).attr("type", "hidden");
				jQuery(this).prev("#spanDiv").html(str);
				jQuery(this).prev("#spanDiv").removeClass('dis-none');
				jQuery(this).next('.pen-icon').removeClass('dis-none');
			}
		});*/
    }


    // 初始化第一个上一步
    function initLastStep1() {
        jQuery('#lastbth1').on('click', function () {
            checkedAttr = [];
            jQuery('input[name="attrId"]:checked').each(function () {
                checkedAttr.push(jQuery(this).val());
            });

            //将设置连接关系页面隐藏
            jQuery('#plumbContent2').addClass('dis-none');

            //将光标提示信息提示到设置结果信息
            if (jQuery('#step2').hasClass('step-tab-select')) {
                jQuery('#step2').removeClass('step-tab-select');
                jQuery('#step2').addClass('step-tab-unselect');
            }
            if (jQuery('#step1').hasClass('step-tab-unselect')) {
                jQuery('#step1').removeClass('step-tab-unselect');
                jQuery('#step1').addClass('step-tab-select');
            }
            //将设置结果信息页面展示
            if (jQuery('#plumbContent').hasClass('dis-none')) {
                jQuery('#plumbContent').removeClass('dis-none');
            }
            //	jQuery('#step2 .step-title-num').addClass('active-notFinished');
            //	jQuery('#step1 .step-title-num').removeClass('active-notFinished');
            jQuery('#allAttrId').prop('checked', false);
        });
    }

    /**
     * 获取选择了哪些字段
     */
    function initSetp2Check() {
        var checkedArr = new Array;
        var linkSelectObj;
        var i = 1;
        checkedAttr = [];
        jQuery('input[name="attrId"]:checked').each(function () {
            checkedAttr.push(jQuery(this).val());
            linkSelectObj = {};
            linkSelectObj.attrId = jQuery(this).val();
            linkSelectObj.dataId = jQuery(this).next('#nodeDataId').val();
            linkSelectObj.fieldName = jQuery(this).prevAll('#fieldName').val();
            linkSelectObj.dimId = jQuery(this).prevAll('#dimId').val();
            linkSelectObj.filterType = jQuery(this).prevAll('#filterType').val();
            linkSelectObj.attrName = jQuery(this).parent().prev('.t-attrname').children('#spanDiv').html();
            linkSelectObj.orderId = i++;
            checkedArr.push(linkSelectObj);
        });
        return checkedArr;
    }

    //初始化第二个下一步
    function initNextStep2() {
        jQuery('#nextbth2').on('click', function () {
            var checkedArr = initSetp2Check();
            if (checkedArr.length == 0) {
                bi.dialog.show({
                    type: bi.dialog.TYPE_DANGER,
                    title: sabace.getMessage('data.dataLink.label.prompt'),
                    message: sabace.getMessage('data.dataLink.label.chooseOneR')
                });
            } else {
                //将设置连接关系页面隐藏
                jQuery('#plumbContent2').addClass('dis-none');

                //将光标提示信息提示到设置结果信息
                if (jQuery('#step2').hasClass('step-tab-select')) {
                    jQuery('#step2').removeClass('step-tab-select');
                    jQuery('#step2').addClass('step-tab-unselect');
                }
                if (jQuery('#step3').hasClass('step-tab-unselect')) {
                    jQuery('#step3').removeClass('step-tab-unselect');
                    jQuery('#step3').addClass('step-tab-select');
                }
                //将设置结果信息页面展示
                if (jQuery('#plumbContent3').hasClass('dis-none')) {
                    jQuery('#plumbContent3').removeClass('dis-none');
                }
                //		jQuery('#step2 .step-title-num').addClass('active-notFinished');
                jQuery('#step3 .step-title-num').removeClass('active-notFinished');


                resultObj.checkedArr = checkedArr;

                //	log(checkedArr);
                initfieldGrid();
                initcompleteBtn();
            }
        });
    }

    //完成按钮
    function initcompleteBtn() {
        jQuery('#completeBtn').on('click', function () {
            var isPass = $('#validateForm').validationEngine('validate');
            var isPass2 = $('#validateForm2').validationEngine('validate');
            if (!isPass) {
                return false;
            }
            if (!isPass2) {
                return false;
            }
            bi.dialog.confirm({
	            title: sabace.getMessage('data.dataLink.label.prompt'),
	            message: '确定保存数据连接吗？',
	            callback: function(result) {
	                if(result) {
	                    //获取数据连接的一些额外信息
	                    resultObj.dataId = dataLinkObj.dataId;
	                    resultObj.dataName = jQuery('#dataName').val();
	                    resultObj.followOrigin = jQuery('input[name="followOrigin"]:checked').val();
	                    resultObj.dataDesc = jQuery('#dataDescText').val();
	                    resultObj.saveFlag = linkModifyFlag;
	                    resultObj.classifyId = jQuery('#classifySel').val();
	                    var param = JSON.stringify(resultObj);
	                    if ("modify" == linkModifyFlag) {
	                        var url = sabace.handleUrlParam("/platform/resmanage/data/query-data-state");
	                        sabace.ajax({
	                            url: url,
	                            data: {
	                                "dataId": dataLinkObj.dataId,
	                                "dataType": '3'
	                            },
	                            success: function (req) {
	                                    if ('2' == req.dataType) {
	                                        bi.dialog.show({
	                                            type: bi.dialog.TYPE_DANGER,
	                                            title: sabace.getMessage("data.dataLink.label.prompt"),
	                                            message: sabace.getMessage('data.import.message.datalinkisworking')
	                                        });
	                                    } else {
	                                    	saveLinkInfo(param);
	                                    }
	                                },
	                                error: function (req) {
	                                    bi.dialog.show({
	                                        type: bi.dialog.TYPE_DANGER,
	                                        title: sabace.getMessage("data.dataLink.label.prompt"),
	                                        message: req.responseText || sabace.getMessage("data.import.message.sysAbnormal")
	                                    });
	                                }
	                        });
	                    } else {
	                    	 saveLinkInfo(param);
	                    }
	                }
	            }
	            });
        });
    }

    
    /**
     * 实际的保存动作
     */
    function saveLinkInfo(param){
    	sabace.ajax({
            url: sabace.handleUrlParam("/platform/resmanage/datalink/save-data-link"),
            data: {
            	'dataStr':param
            },
            loading: {
                title: sabace.getMessage("data.dataLink.label.prompt"),
                text: sabace.getMessage("data.dataLink.label.workingLoading")
            },
            success: function (req) {
            		bi.dialog.confirm({
			            title: sabace.getMessage('data.dataLink.label.prompt'),
			            message: '保存成功，是否确定退出！',
			            callback: function(result) {
			                if(result) {
			                	if(jQuery.isFunction(window.opener.reloadDataList)){
									window.opener.reloadDataList();
								}
			                    window.close();
			                }
		            }});
                },
                error: function (req) {
                    bi.dialog.show({
                        type: bi.dialog.TYPE_DANGER,
                        title: sabace.getMessage("data.dataLink.label.prompt"),
                        message: req.responseText || sabace.getMessage("data.dataLink.error.saveLinkError")
                    });
                }
        });
    }
    
    //初始化上一步
    function initLastStep2() {
        jQuery('#lastbth2').on('click', function () {
            //jQuery('#dataResultGrid').jqGrid('gridDestroy');
            jQuery('#dataResultGrid').jqGrid("clearGridData");
            $.jgrid.gridDestroy('#dataResultGrid');
            jQuery('.complete-content .r-grid').append('<table id="dataResultGrid"></table>');
            //   jQuery('#dataResultGrid').remove();
            //$('#r-grid').empty();

            //将设置连接关系页面隐藏
            jQuery('#plumbContent3').addClass('dis-none');

            //将光标提示信息提示到设置结果信息
            if (jQuery('#step3').hasClass('step-tab-select')) {
                jQuery('#step3').removeClass('step-tab-select');
                jQuery('#step3').addClass('step-tab-unselect');
            }
            if (jQuery('#step2').hasClass('step-tab-unselect')) {
                jQuery('#step2').removeClass('step-tab-unselect');
                jQuery('#step2').addClass('step-tab-select');
            }
            //将设置结果信息页面展示
            if (jQuery('#plumbContent2').hasClass('dis-none')) {
                jQuery('#plumbContent2').removeClass('dis-none');
            }
            //	jQuery('#step3 .step-title-num').addClass('active-notFinished');
            //	jQuery('#step2 .step-title-num').removeClass('active-notFinished');
        });
    }

    //初始化fieldgrid
    function initfieldGrid() {
        var param = JSON.stringify(resultObj);
        var colModelArray = new Array;
        var colModelObject;
        var checkedArrTmp = resultObj.checkedArr;

        var length = checkedArrTmp.length;
        var jqWidth = jQuery(".r-grid").width() - 45;
        var width = 180;
        if (length * width < jqWidth) {
            width = Math.floor(jqWidth / length);
        }

        for (var i = 0; i < checkedArrTmp.length; i++) {
            colModelObject = {};
            colModelObject.label = checkedArrTmp[i].attrName;
            colModelObject.name = checkedArrTmp[i].attrId;
            colModelObject.align = 'left';
            colModelObject.hlign = 'left';
            colModelObject.width = width;
            colModelArray.push(colModelObject);
        }
        var colObj = {
            hidden: true,
            name: 'jqGridError'
        };
        colModelArray.push(colObj);
        jQuery('#dataResultGrid').jqGrid({
            url: sabace.handleUrlParam("/platform/resmanage/datalink/preview-link-result"),
            datatype: "json",
            styleUI: 'Bootstrap',
            postData: {
                'dataId': param
            },
            mtype: "POST",
            colModel: colModelArray,
            rowNum: 10,
            jsonReader: {
                records: "total",
                total: "totalPages"
            },
            shrinkToFit: false,
            autowidth: true,
            height: 230,
            regional: 'cn',
            loadComplete: function () {
                var table = jQuery(this);
                var ret = table.jqGrid('getRowData');
                if (ret.length == 1) {
                    var tmpObj = ret[0];
                    if ("true" == tmpObj.jqGridError) {
                        table.find("#1").remove();
                        jQuery(".r-grid").find('.ui-jqgrid-bdiv').append('<div class="noResult" style="font-size:12px;height:28px;line-height:35px;text-align:center;">' + '数据连接设置错误，请重新设置！' + '</div>');
                        jQuery(".r-grid").find('.ui-jqgrid-bdiv').find(".noResult").prev().hide();
                    }
                }
            }
        });
        resizeDataGrid();
    }

    function resizeDataGrid() {
        jQuery("#dataResultGrid").setGridWidth(jQuery(".r-grid").width() - 5);
    }
    $(window).resize(function () {
        resizeDataGrid();
    });

    /**
     * 检查连接表模型是否有错  返回错误码（）
     */
    function checkJsplumbDrag() {
        var edgeArr = [];
        var objArr = new Array;
        //连接线
        var connArray = instance.getConnections();
        //节点数目
        var nodeArray = jQuery('.statemachine-demo .mydiv');
        //多个节点 但是没有连接
        if (nodeArray.length > 1 && connArray.length == 0) {
            return false;
        }

        var leftArray = new Array;
        var leftObj;
        var edgeObj
            //多个节点连接了但是存在两个节点互相左连接
        for (var i = 0; i < connArray.length; i++) {
            if (sabace.getMessage('data.dataLink.label.leftjoin') == connArray[i]._jsPlumb.overlays.label.label) {
                leftObj = {
                    'sourceId': connArray[i].sourceId,
                    'targetId': connArray[i].targetId
                };
                leftArray.push(leftObj);
            }
            edgeObj = {
                'sourceId': connArray[i].sourceId,
                'targetId': connArray[i].targetId
            };
            edgeArr.push(edgeObj);
            objArr.push(jQuery('#' + connArray[i].sourceId).parent().attr('id'));
            objArr.push(jQuery('#' + connArray[i].targetId).parent().attr('id'));
        }
        for (var i = 0; i　 < leftArray.length; i++) {
            var tmpTargetId = leftArray[i].targetId;
            var tmpSourceId = leftArray[i].sourceId;
            for (var j = i + 1; j < leftArray.length; j++) {
                if (tmpTargetId == leftArray[j].sourceId && tmpSourceId == leftArray[j].targetId) {
                    return false;
                }
            }
        }

        objArr = unique(objArr);
        for (var i = 0; i < nodeArray.length; i++) {
            if (objArr.length > 0) {
                if (-1 == objArr.indexOf(jQuery(nodeArray[i]).attr("id"))) {
                    return false;
                }
            }
        }
        //多个节点连接了但是没有连接全
        if (checkJsPlumbThrough(edgeArr, nodeArray)) {
            return true;
        } else {
            return false;
        }
        return true;
    }

    /**
     * 去除一个数组里面的重复数据
     */
    function unique(arr) {
        var result = [],
            hash = {};
        for (var i = 0, elem;
            (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }

    /**
     * 去除数组里面对象重复
     */
    function uniqueArrObj(arr) {
        var result = [];
        var resultTemp = [];
        var elemFlag;
        var tmpElemFlag;
        for (var i = 0, elem, tmpElem;
            (elem = arr[i]) != null; i++) {
            elemFlag = false;
            tmpElemFlag = false;
            tmpElem = {};
            tmpElem.targetNode = elem.sourceNode;
            tmpElem.sourceNode = elem.targetNode;
            for (var j = 0; j < result.length; j++) {
                var tmpObj = result[j];
                if (tmpObj.targetNode == elem.targetNode && tmpObj.sourceNode == elem.sourceNode) {
                    elemFlag = true;
                    break;
                }
            }
            if (!elemFlag) {
                result.push(elem);
                resultTemp.push(elem);
                result.push(tmpElem);
            }
        }
        return resultTemp;
    }

    /**
     * 检查线是否连成功 返回approveFlag true表示通了，false表示不通
     */
    function checkJsPlumbThrough(edgeArr, nodeArray) {
        var approveFlag1 = false;
        var nodeConcatArr = new Array;
        var linObj;
        var nodeArr = [];
        for (var i = 0; i < nodeArray.length; i++) {
            nodeArr.push(jQuery(nodeArray[i]).attr("id"));
        }
        for (var i = 0; i < edgeArr.length; i++) {
            linObj = {}
            linObj.targetNode = jQuery('#' + edgeArr[i].targetId).parent().attr('id');
            linObj.sourceNode = jQuery('#' + edgeArr[i].sourceId).parent().attr('id');
            nodeConcatArr.push(linObj);
        }
        if (uniqueArrObj(nodeConcatArr).length >= nodeArray.length - 1) {
            approveFlag1 = true;
        }
        //	log(nodeArr)
        /*var apNumArr = [];
		for(var i = 0;i < nodeArr.length;i++){
			for(var j = 0; j< nodeArr.length;j++){
				var apNum = 0;
				if(i == j){
					continue;
				}
				for(var k = 0;k < nodeConcatArr.length; k++){
					if((nodeConcatArr[k].targetNode == nodeArr[i]&&nodeConcatArr[k].sourceNode == nodeArr[j])||(nodeConcatArr[k].targetNode == nodeArr[j]&&nodeConcatArr[k].sourceNode == nodeArr[i])){
						apNum = 1;
						break;
					}else{
						continue;
					}
				}
				apNumArr.push(apNum);
			}
		}
		for(var i = 0;i<apNumArr.length;i++){
			if(1 == apNumArr[i]){
				approveFlag1 = true;
				continue;
			}else{
				approveFlag1 = false;
				break;
			}
		}*/

        return approveFlag1;
    }
});