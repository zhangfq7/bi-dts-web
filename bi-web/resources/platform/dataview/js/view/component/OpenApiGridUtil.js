define( ['bace','dialog'],
    function (Bace) {
        // api信息
        var apiBaseInfo = {};
        // 参数数组
        var paramInfoArray = null;
        var OpenApiGridUtil = {};
        var callback = null;
        OpenApiGridUtil.module = {};
        OpenApiGridUtil.control = {
            show: function (cb) {
                //挂载回调函数,点击应用数据源时使用
                callback = cb;
                if (!jQuery("#openApiGridPanel")[0]) {
                    jQuery("body").append("<div id='openApiGridPanel' style='display:none;position: relative'></div>");
                }
                jQuery("#openApiGridPanel").load(Bace.handleUrlParam('/platform/dataview/openapi-grid'), function () {
                    buildPageList();
                    OpenApiGridUtil.view.show();
                });
            }
        };
        OpenApiGridUtil.view = {
            show: function () {
                $.dialog({
                    id: 'openApiGridDialog',
                    title: '选择openApi',
                    padding: '0',
                    width: 'auto',
                    height: 'auto',
                    lock: true,
                    content: jQuery("#openApiGridPanel")[0],
                    cancelVal: '取消',
                    cancel: function () {
                        return true;
                    }
                });
            }
        };
        function buildPageList(){
            jQuery("#openApiList").jqGrid({
                url: Bace.handleUrlParam('/platform/openapi/query-openapi-list'),
                data: {
                    ApiCode: ""
                },
                styleUI: 'Bootstrap',
                datatype: "json",
                colModel: [{
                    label: '接口名称',
                    name: 'apiName',
                    width: 100,
                    align: 'left',
                    sortable: false
                }, {
                    label: '方法名称',
                    name: 'apiCode',
                    width: 100,
                    align: 'left',
                    sortable: false
                }, {
                    label: '请求地址',
                    name: 'apiUrl',
                    width: 200,
                    align: 'left',
                    sortable: false
                }, {
                    label: '请求字段',
                    name: 'paramInfoStr',
                    width: 200,
                    align: 'left',
                    sortable: false
                }, {
                    label: '结果字段',
                    name: 'resultInfoStr',
                    width: 200,
                    align: 'left',
                    sortable: false
                }, {
                    label: '操作',
                    name: 'serviceApiId',
                    width: 50,
                    align: 'center',
                    sortable: false,
                    formatter: function (cellvalue, options, rowObject) {
                        return '<a href="javascript:void(0)" data-rowid="' + options.rowId + '" class="use-openapi">引用</a>';
                    }
                }],
                //autoWidth: true,
                width:'auto',
                height: 'auto',
                rowNum: 100000,
                regional: 'cn',
                loadComplete: function (data) {
                    jQuery(".use-openapi").on("click", function () {
                        // 引用
                        var dataIndex = $(this).data("rowid") - 1;
                        var thisData = data[dataIndex];
                        var paramInfoStr = thisData.paramInfoStr;
                        apiBaseInfo.apiName = thisData.apiName;
                        apiBaseInfo.apiCode = thisData.apiCode;
                        apiBaseInfo.apiUrl = thisData.apiUrl;
                        apiBaseInfo.clientId = thisData.clientId;
                        apiBaseInfo.passWord = thisData.passWord;
                        apiBaseInfo.resultInfoStr = thisData.resultInfoStr;
                        apiBaseInfo.reqSystem = thisData.sysId;
                        apiBaseInfo.isDes = thisData.isDes;
                        apiBaseInfo.accessKey = thisData.accessKey;
                        $.dialog.closeAll('openApiGridDialog');
                        callback.call(this,apiBaseInfo,paramInfoStr);
                    })
                }
            });
        }
        return OpenApiGridUtil.control;
    });