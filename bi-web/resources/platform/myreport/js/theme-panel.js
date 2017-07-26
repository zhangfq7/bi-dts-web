define(['sabace', 'share', 'mymessage'], function(sabace, share, mymessage) {
    var pageSize = 20; //定义一页显示的个数
    var nowPage = 0; //当前页数
    var nowTxt = ""; //当前搜索内容
    var shareFlag = 0; //0表示没有打开分析页面，1表示打开
    var goalChoose=[];//选择器容器
    if(typeof(sessionStorage.goalChoose)!="undefine"&&sessionStorage.goalChoose!=""&&sessionStorage.goalChoose!=null){
        goalChoose=JSON.parse(sessionStorage.goalChoose);
    }else{
        sessionStorage.goalChoose="";
    }

    jQuery(function() {

        //给按钮组点击样式
        jQuery(".btn-group button").bind("click", function() {
            jQuery(this).removeClass("normalButton").addClass("clickedButton theme-background").siblings().addClass("normalButton").removeClass("clickedButton theme-background");
        })

        jQuery(".btn-group").on('mouseover', '.normalButton', function() {
            jQuery('.normalButton').removeClass('theme-background');
            jQuery(this).addClass('theme-background');
        }).on('mouseleave', '.normalButton', function() {
            jQuery(this).removeClass('theme-background');
        })

        var type = "all";

        jQuery(".top").on("click", ".more", function() {
            jQuery(".moreLabel").toggle();
            var content = sabace.getMessage('report.label.more');
            if (jQuery(this).find("strong").html() == content) {
                content = sabace.getMessage('report.label.back');
            }
            jQuery(this).find("strong").html(content);
        })

        var labelArry = ""; //接收所选的标签id
        jQuery(".search-btn-group button").bind("click", function() {
            type = jQuery(this).val();
            findDataByButton(0, type, labelArry);
        })

        jQuery("#firstbutton").click();

        //获取标签
        sabace.ajax({
            url: sabace.handleUrlParam('/platform/myreport/manage/query-label'),
            success: function(req) {
                if (req.length > 0) {
                    jQuery(".report-panel .top>div,.report-panel .top>hr").show();
                }
                jQuery.each(req, function(i, v) {
                    var label = jQuery("<label>", {
                        "class": "checkbox-diy col-xs-1",
                        "value": v.labelId
                    })
                    var input = jQuery("<input>", {
                        "type": "checkbox",
                        "data-toggle": "checkbox"
                    })
                    var strong = jQuery("<label>", {
                        "html": v.labelName
                    })
                    label.append(input).append(strong);
                    if (i > 4) {
                        label.addClass("moreLabel");
                        jQuery(".more").show();
                    }
                    jQuery(".more").before(label);
                })

                jQuery('[data-toggle="checkbox"]').iCheck({
                    checkboxClass: 'icheckbox_minimal',
                    radioClass: 'iradio_minimal'
                });
                //给标签点击事件
                $('input').on('ifChanged', function(event) { //ifCreated 事件应该在插件初始化之前绑定
                    var obj = jQuery('.top').find(":checked").parents(".checkbox-diy");
                    labelArry = "";
                    jQuery.each(obj, function(i, v) {
                        if (i == 0) {
                            labelArry += jQuery(v).attr("value");
                        } else {
                            labelArry = labelArry + "," + jQuery(v).attr("value");
                        }
                    })
                    findDataByButton(0, type, labelArry);
                });
            },
            error: function(req) {
                bi.dialog.show({
                    type: bi.dialog.TYPE_DANGER,
                    title: sabace.getMessage('top.label.fail'),
                    message: req.responseText
                });
            }
        });

        jQuery("#search").bind("click", function() {
            findDataByButton(0, type, labelArry);
        })

        jQuery('#searchInput').keydown(function(e) {
            if (e.keyCode == 13) {
                jQuery("#search").trigger("click");
            }
        });
        jQuery(".tool button").bind("click", function() {
            sabace.ajax({
                async: false,
                url: sabace.handleUrlParam('/platform/myreport/view/get-all-Data'),
                success: function(req) {
                    if ((req.importList == null || req.importList.length == 0) && (req.dbList == null || req.dbList.length == 0) && (req.linkList = null || req.linkList.length == 0)) {
                        bi.dialog.show({
                            title: '页面跳转提醒',
                            message: '您好，您还没有上传数据源，无法制作报表！<span class="timeSpan">5</span> 秒钟将自动跳转到上传数据源页面！<br><a href="' + sabace.handleUrlParam("/platform/resmanage/data/data-file-import") + '">立即跳转</a>',
                            cssClass: 'timeout-dialog',
                            onshown: function() {
                                sabace.interval(function() {
                                    jQuery(".timeSpan").html(jQuery(".timeSpan").html() - 1);
                                }, 1000);
                                sabace.timeout(function() {
                                    top.document.location.href = sabace.handleUrlParam("/platform/resmanage/data/data-file-import");
                                }, 5000);
                            }
                        });
                    } else {
                        window.open(sabace.handleUrlParam('/platform/dataview/create'));
                    }
                },
                error: function(req) {
                    bi.dialog.show({
                        type: bi.dialog.TYPE_DANGER,
                        title: sabace.getMessage('top.label.fail'),
                        message: req.responseText
                    });
                }
            });
        })

        jQuery("#content").on("click", ".eidtbtn", function() {
            var obj = jQuery(this);
            var reportId = obj.parents(".thumbnail").attr("reportId");
            var appType = obj.parents(".thumbnail").attr("appType");
            window.open(sabace.handleUrlParam('/platform/dataview/edit') + '?reportId=' + reportId+ '&appType=' + appType);
        })

        jQuery("#content").on("click", ".delbtn", function() {
            var obj = jQuery(this);
            var reportId = obj.parents(".thumbnail").attr("reportId");
            bi.dialog.confirm({
                type: bi.dialog.TYPE_DANGER,
                title: sabace.getMessage('home.label.confirmBox'),
                message: sabace.getMessage('report.msg.delete'),
                callback: function(result) {
                    if (result) {
                        sabace.ajax({
                            loading: {
                                title: sabace.getMessage('report.button.delete'),
                                text: sabace.getMessage('report.button.deleteing'),
                            },
                            url: sabace.handleUrlParam('/platform/myreport/manage/del-rep/'),
                            data: {
                                reportId: reportId
                            },
                            success: function(req) {
                                bi.dialog.show({
                                    title: sabace.getMessage('home.label.TipBox'),
                                    message: sabace.getMessage('report.button.deleteSuccess'),
                                    cssClass: 'register-dialog',
                                    nl2br: false,
                                    closable: true
                                });
                                findDataByButton(nowPage, type, labelArry);
                            },
                            error: function(req) {
                                bi.dialog.show({
                                    type: bi.dialog.TYPE_DANGER,
                                    title: sabace.getMessage('top.label.fail'),
                                    message: req.responseText
                                });
                            }
                        });
                    }
                }
            });
        })

        jQuery("#content").on("click", ".sharebtn", function() {
            //如果是费企业用户，不能分享  0表示是非企业用户
            if (jQuery("#companyFlag").val() == 0) {
                bi.dialog.show({
                    title: sabace.getMessage('home.label.TipBox'),
                    message: sabace.getMessage('report.share.noCompanyMsg'),
                    cssClass: 'register-dialog',
                    nl2br: false,
                    closable: true,
                    closeByBackdrop: false,
                    closeByKeyboard: false,
                    buttons: [{
                        label: sabace.getMessage('home.button.sure'),
                        action: function(dialogItself) {
                            dialogItself.close();
                            dialog.close();
                        }
                    }]
                });
                return;
            }
            shareFlag = 1;
            var obj = jQuery(this);
            var reportId = obj.parents(".thumbnail").attr("reportId");
            //var url = webpath +'/platform/myreport/manage/share-rep/${funcId}?reportId='+reportId;

            //报表分享
            /*bi.dialog.show({
             title: '报表分享',
             closable:true,
             closeByBackdrop:false,
             closeByKeyboard:false,
             message: '<iframe id="fileIframe" frameborder="0" width="710" height="520" style="margin:-12px 0px 0px -7px;border-radius: 5px;" src="' + url + '"></iframe>',
             cssClass: 'data-add-dialog'
             });*/
            var pageUrl;
            if(publishType == 0){
                //本地发布
                pageUrl = sabace.handleUrlParam("/platform/myreport/manage/share-rep") + "?reportId=" + reportId;
            } else if(publishType == 1){
                //第三方发布
                pageUrl = sabace.handleUrlParam("/third-party/publish-rep") + "?reportId=" + reportId;
                bi.dialog.show({
                    title: sabace.getMessage('report.publish.title'),
                    //message: sabace.getMessage('report.share.message'),
                    message: $('<div id="dd"></div>').load(pageUrl),
                    spinicon: 'glyphicon glyphicon-refresh',
                    cssClass: 'share-dialog',
                    closable: true,
                    closeByBackdrop: false,
                    closeByKeyboard: false,
                    onshown: function(dialog) {
                        share.init();
                    },
                    buttons: [
                        {
                            label: sabace.getMessage('home.button.cancel'),
                            cssClass: 'btn-default btn-sm',
                            action: function(dialog) {
                                dialog.close();
                                shareFlag = 0;
                            }
                        }, {
                            label: sabace.getMessage('home.button.sure'),
                            cssClass: 'btn-primary btn-sm',
                            action: function(dialog) {
                                //document.location.href = sabace.handleUrlParam("/third-party/publish-rep") + "?reportId=" + reportId;
                                share.publish(dialog);
                                shareFlag = 0;
                            }
                        }
                    ]
                });

                return;
            }

            bi.dialog.show({
                title: sabace.getMessage('report.share.title'),
                message: $('<div id="dd"></div>').load(pageUrl),
                spinicon: 'glyphicon glyphicon-refresh',
                cssClass: 'share-dialog',
                closable: true,
                closeByBackdrop: false,
                closeByKeyboard: false,
                onshown: function(dialog) {
                    share.init();
                },
                buttons: [
                    /*{
                     label: '调用子页面方法',
                     hotkey: 13, // Enter  让键盘回车直接出发此按钮
                     cssClass: 'btn-primary',
                     action: function(dialog) {
                     alert(sa.getPanelCount())
                     }
                     }, {
                     label: '操作子页面内容',
                     action: function(dialog) {

                     //改变弹框里面的元素
                     jQuery("#dd").find("#span").text('您点击了【操作子页面内容】');
                     dialog.getModal().find("#span").append('<span>API方法找到！</span>')
                     if(dialog.getData("h")){
                     dialog.getModalBody().css("height","140px");
                     dialog.setData("h",false);
                     }else{
                     dialog.getModalBody().css("height","400px");
                     dialog.setData("h",true);
                     }
                     }
                     },*/
                    {
                        label: sabace.getMessage('home.button.cancel'),
                        cssClass: 'btn-default btn-sm',
                        action: function(dialog) {
                            dialog.close();
                            shareFlag = 0;
                        }
                    }, {
                        label: sabace.getMessage('home.button.sure'),
                        cssClass: 'btn-primary btn-sm',
                        action: function(dialog) {
                            share.sure(dialog);
                            shareFlag = 0;
                        }
                    }
                ]
            });

        })

        //给缩略图加点击事件查看
        var panelId="";
        jQuery("#operSure").click(function(){
            var sessionTemp=JSON.stringify("sessionStorage.goalChoose");
            var chooseTemp=[];
            sessionStorage.removeItem("goalChoose");
            for(var i=0;i<goalChoose.length;i++){
                var flag=-1;
                for(var j=0;j<sessionTemp.length;j++){
                    if(goalChoose[i].reportId==sessionTemp[j].reportId){
                       flag=j;
                    }
                }
                if(flag>-1){
                    chooseTemp.push(sessionTemp[j]);
                }else{
                    chooseTemp.push(goalChoose[i]);
                }
            }
            console.log(sessionStorage.goalChoose);
            console.log(goalChoose);
            sessionStorage.goalChoose=JSON.stringify(chooseTemp);
            window.parent.document.getElementById("goalPanel").style.display="none";
            //window.parent.Property.view.buildDesgin().penetrateDraw(data);
            console.log(chooseTemp);
            penetrateDraw(chooseTemp);
        });
        //目标仪表板加载
        function penetrateDraw(data){
            if(data){
                $(".penetrate .list", parent.document).remove();
                var len=data.length;
                for(var i=0;i<len;i++){
                    $("#addPenetrate", parent.document).before( '<div proptype="penetrate" class="list close" style="display:block">'+
                        '<div class="propTitle">'+
                        '<i class="fa fa-caret-right"></i>'+
                        '<i class="fa fa-caret-down"></i>'+
                        '<div class="text">穿透主题 </div>'+
                        '<div  class="delAttrDim delPenetrate" style="display: block" title="移除该主题"></div>'+
                        '</div>'+
                        '<div class="propContanier" style="display: none;">'+
                        '<div class="items">'+
                        '<div class="label">主标题:</div>'+
                        '<div class="config">'+
                        '<input class="theme-text" style="width:143px" class="input" type="text" value='+data[i].reportName+'>'+
                        '</div>'+
                        '</div>'+
                        '<div class="items">'+
                        '<div class="label">目标仪表板:</div>'+
                        '<div class="config">'+
                        '<input id="panelId'+i+'" class="panel-text" style="width:120px" class="input" type="text" placeholder="请选择" code='+data[i].reportId+' value='+data[i].reportGoal+' readonly >'+
                        '</div>'+
                        '</div>'+
                        '</div>');
                }
            }
        }
        jQuery("#operClose").click(function(){
            window.parent.document.getElementById("goalPanel").style.display="none";
        });
        //选择目标仪表板
        jQuery("#content").on("click", ".repImg,.txt", function() {
            var chooseTemp={};
            var reportId = jQuery(this).parents(".thumbnail").attr("reportId");
            var appType = jQuery(this).parents(".thumbnail").attr("appType");
            var reportGoal=jQuery(this).siblings(".txt").children("strong").text();
            var reportName=reportGoal;
            chooseTemp.reportId=reportId;
            chooseTemp.reportGoal=reportGoal;
            chooseTemp.reportName=reportName;
            var goalLen=goalChoose.length;
            var delFlag=-1;
            if($(this).parent().hasClass("thumChoose")){
                $(this).parent().removeClass('thumChoose');
                for(var i=0;i<goalLen;i++){
                    if(goalChoose[i].reportId==chooseTemp.reportId){
                        delFlag=i;
                    }
                }
                if(delFlag!=-1){
                    goalChoose.splice(delFlag,1);
                }

            }else {
                $(this).parent().addClass('thumChoose');
                goalChoose.push(chooseTemp);
            }

        })
        //自动刷新消息列表
        /*sabace.interval(function() {
         if(shareFlag == 0){
         findData(nowPage,type,labelArry);
         }
         }, 30000);*/

        //返回顶部
        jQuery(window).scroll(function() {
            if (jQuery(window).scrollTop() >= 100) {
                jQuery('.actGotop').fadeIn(300);
                jQuery(".report-panel").addClass("suspension");
            } else if(jQuery(window).scrollTop() <90) {
                jQuery('.actGotop').fadeOut(300);
                jQuery(".report-panel").removeClass("suspension");
            }
        });
        jQuery('.actGotop').click(function() {
            jQuery('html,body').animate({
                scrollTop: '0px'
            }, 800);
        });
    })

    //点击分页查询数据的方法
    //点击分页查询数据的方法
    function findData(index, ty, labelIds) {
        //加进度条
        jQuery(".loadingbar.waiting.reportLoading").remove();
        jQuery('<div>', {
            "id": "loadingbar2",
            "class": "loadingbar waiting reportLoading",
            "html": "<dt/><dd/>"
        }).appendTo(".report-panel .butRow");
        jQuery("#loadingbar2").width((50 + Math.random() * 30) + "%");

        var searchText = jQuery("#searchInput").val(); //搜索框的内容
        sabace.ajax({
            /*loading :{
             spin:true
             },*/
            url: sabace.handleUrlParam('/platform/myreport/manage/query-reps/'),
            data: {
                page: index,
                rows: pageSize,
                type: ty,
                labelIds: labelIds,
                searchText: nowTxt
            },
            success: function(req) {
                jQuery("#content").html("");
                $('body,html').animate({
                    scrollTop: 0
                }, 100);
                if (req.reportList.rows.length == 0) {
                    //如果没有结果，就把查询条件拼接出来
                    var searchPanel = [];
                    var searchlabel = labelIds.split(",");
                    if (searchlabel != '') {
                        jQuery(searchlabel).each(function(i, v) {
                            var label = jQuery("label[value='" + v + "']").find("strong").html();
                            if (i == 0) {
                                label = sabace.getMessage('report.label.noReportLabel') + label;
                            }
                            searchPanel.push(label);
                        })
                    }
                    if (searchText != '') {
                        searchPanel.push(sabace.getMessage('report.label.noReportTxt') + searchText);
                    }
                    if (!jQuery("#firstbutton").hasClass("clickedButton")) {
                        var and = searchPanel.length == 0 ? '' : sabace.getMessage('report.label.noReportAnd');
                        searchPanel.push(and + jQuery(".report-panel .search-btn-group .clickedButton").html().replace(/&nbsp;/g, ''));
                    }
                    var mhtml = '';
                    if (searchPanel.length == 0) {
                        mhtml = '<div>!</div><div>' + sabace.getMessage('report.label.noReport3') + '</div>';;
                    } else {
                        mhtml = '<div>!</div><div>' + sabace.getMessage('report.label.noReport1') + '<span style="font-weight:bold;">“' + searchPanel + '”</span>' + sabace.getMessage('report.label.noReport2') + '</div>';
                    }

                    var noreport = jQuery("<div>", {
                        'class': 'noreport-msg',
                        'html': mhtml
                    })
                    jQuery("#content").html(noreport);
                } else {
                    jQuery.each(req.reportList.rows, function(i, v) {
                        creatRep(v)
                    })
                }

                jQuery("#loadingbar2").css("width", "99.5%").delay(200).fadeOut(400, function() {
                    $(this).remove();
                });
            },
            error: function(req) {
                bi.dialog.show({
                    type: bi.dialog.TYPE_DANGER,
                    title: '异常',
                    message: '查询报表异常，请稍后再试 ！'
                });
            }
        });
    }

    function findDataByButton(index, ty, labelIds) {
        //加进度条
        jQuery(".loadingbar.waiting.reportLoading").remove();
        jQuery('<div>', {
            "id": "loadingbar2",
            "class": "loadingbar waiting reportLoading",
            "html": "<dt/><dd/>"
        }).appendTo(".report-panel .butRow");
        jQuery("#loadingbar2").width((50 + Math.random() * 30) + "%");

        var searchText = jQuery("#searchInput").val(); //搜索框的内容
        sabace.ajax({
            /*loading :{
             spin:true
             },*/
            url: sabace.handleUrlParam('/platform/myreport/manage/query-reps/'),
            data: {
                page: index,
                rows: pageSize,
                type: ty,
                labelIds: labelIds,
                searchText: searchText
            },
            success: function(req) {
                nowPage = 0; //当前页数变为0
                nowTxt = searchText;
                jQuery("#content").html("");
                $('body,html').animate({
                    scrollTop: 0
                }, 100);
                if (req.reportList.rows.length == 0) {
                    //如果没有结果，就把查询条件拼接出来
                    var searchPanel = [];
                    var searchlabel = labelIds.split(",");
                    if (searchlabel != '') {
                        jQuery(searchlabel).each(function(i, v) {
                            var label = jQuery("label[value='" + v + "']").find("strong").html();
                            if (i == 0) {
                                label = sabace.getMessage('report.label.noReportLabel') + label;
                            }
                            searchPanel.push(label);
                        })
                    }
                    if (searchText != '') {
                        searchPanel.push(sabace.getMessage('report.label.noReportTxt') + searchText);
                    }
                    if (!jQuery("#firstbutton").hasClass("clickedButton")) {
                        var and = searchPanel.length == 0 ? '' : sabace.getMessage('report.label.noReportAnd');
                        searchPanel.push(and + jQuery(".report-panel .search-btn-group .clickedButton").html().replace(/&nbsp;/g, ''));
                    }
                    var mhtml = '';
                    if (searchPanel.length == 0) {
                        mhtml = '<div>!</div><div>' + sabace.getMessage('report.label.noReport3') + '</div>';;
                    } else {
                        mhtml = '<div>!</div><div>' + sabace.getMessage('report.label.noReport1') + '<span style="font-weight:bold;">“' + searchPanel + '”</span>' + sabace.getMessage('report.label.noReport2') + '</div>';
                    }

                    var noreport = jQuery("<div>", {
                        'class': 'noreport-msg',
                        'html': mhtml
                    })
                    jQuery("#content").html(noreport);
                }
                jQuery.each(req.reportList.rows, function(i, v) {
                    creatRep(v);
                })

                jQuery("#page").page('destroy');
                //渲染分页控件
                jQuery("#page").page({
                    total: req.reportList.total,
                    pageSize: pageSize,
                    showJump: true,
                    firstBtnText: '首页',
                    lastBtnText: '尾页',
                    jumpBtnText: '跳转'
                }).on("pageClicked", function(event, pageIndex) {
                    nowPage = pageIndex;
                    findData(pageIndex, ty, labelIds);
                }).on('jumpClicked', function(event, pageIndex) {
                    nowPage = pageIndex;
                    findData(pageIndex, ty, labelIds);
                });
                //调整分页的位置
                var rowWidth = jQuery(".page").width();
                var pageWidth = Number(jQuery(".m-pagination-page").width()) + Number(jQuery(".m-pagination-jump").width());
                jQuery(".m-pagination-page").css("margin-left", (rowWidth - pageWidth) / 2 + "px");

                jQuery("#loadingbar2").css("width", "99.5%").delay(200).fadeOut(400, function() {
                    $(this).remove();
                });

            },
            error: function(req) {
                bi.dialog.show({
                    type: bi.dialog.TYPE_DANGER,
                    title: '异常',
                    message: '查询报表异常，请稍后再试 ！'
                });
            }
        });
    }
    //生成报表的方法
    var height = (window.screen.width * 0.21 - 30) / 2; //每张报表图片的高度
    function creatRep(obj) {
        var thumbnail = jQuery("<div>", {
            'class': 'thumbnail effect',
            'reportId': obj.reportId,
            'appType':obj.appType
        });
        for(var i=0;i<goalChoose.length;i++){
            if(goalChoose[i].reportId==obj.reportId){
                thumbnail.addClass('thumChoose');
            }
        }

        var img = jQuery("<div>", {
            'css': {
                'height': height + 'px',
                'background': 'url(' + obj.imgByte + ') no-repeat',
                'background-size': '100% auto'
            },
            'class': 'repImg'
        });
        var txt = jQuery("<div>", {
            'class': 'txt'
        })
        var title = jQuery("<strong>", {
            'html': obj.reportName,
            'style': 'margin-left:2%',
            'title':obj.reportName
        })
        var helpBlock = jQuery("<div>", {
            'class': 'help-block',
            'html': '<div class="comment">' + sabace.getMessage('home.label.comment') + '<strong> ' + (obj.commentCount == null ? 0 : obj.commentCount) + ' </strong></div>'
        })

        /*var scoreArry = ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];
         var random = parseInt(10 * Math.random());
         var score = scoreArry[random];*/
        var score = obj.score;
        var star1 = jQuery("<i>", {
            'class': 'fa fa-star-o',
        })
        var star2 = jQuery("<i>", {
            'class': 'fa fa-star-o',
        })
        var star3 = jQuery("<i>", {
            'class': 'fa fa-star-o',
        })
        var star4 = jQuery("<i>", {
            'class': 'fa fa-star-o',
        })
        var star5 = jQuery("<i>", {
            'class': 'fa fa-star-o',
        })
        var starArr = [];
        starArr.push(star1);
        starArr.push(star2);
        starArr.push(star3);
        starArr.push(star4);
        starArr.push(star5);
        if (score.length == 1) {
            //整数
            for (var j = 1; j <= score; j++) {
                starArr[j - 1].attr('class', 'fa fa-star');
            }
        } else {
            //有.5
            for (var j = 1; j <= score.substring(0, 1); j++) {
                starArr[j - 1].attr('class', 'fa fa-star');
            }
            starArr[score.substring(0, 1)].attr('class', 'fa fa-star-half-o')
        }

        var stars = jQuery("<div>", {
            'class': 'stars'
        })
        var a = '<div class="visit">' + sabace.getMessage('home.label.visit') + '<strong class="times"> ' + obj.visitCount + ' </strong></div>';
        var hr = jQuery("<hr>", {});

        var but = jQuery("<div>", {
            'class': 'but'
        })

        var editbtn = jQuery("<div>", {
            'class': 'eidtbtn',
            'html': '<i class="fa fa-pencil butFa"></i><span>' + sabace.getMessage('report.button.edit') + '</span>'
        })

        var delbtn = jQuery("<div>", {
            'class': 'delbtn',
            'html': '<i class="fa fa-trash-o butFa"></i><span>' + sabace.getMessage('report.button.delete') + '</span>'
        })

        var sharebtn = jQuery("<div>", {
            'class': 'sharebtn',
            'html': '<i class="fa fa-share butFa"></i><span>' + sabace.getMessage('report.button.share') + '</span>'
        })

        but.append(editbtn).append(delbtn).append(sharebtn);


        stars.append(starArr);
        helpBlock.append(stars).append(a);
        if("1" == obj.appType){
            txt.append(title).append("<div class='help-block'>").find(".help-block").append(a).find(".visit").css("textAlign","left")
        } else {
            txt.append(title).append(helpBlock) /*.append(but)*/ ;
        }
        var choose = jQuery("<div>", {
            'class': 'choose'
        });
        thumbnail.append(img).append(txt).append(hr).append(but).append(choose);
        jQuery("#content").append(thumbnail);

    }
});