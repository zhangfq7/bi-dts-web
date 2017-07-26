/**
 * 该模块用于展示页面url导航条
 * Created by goaya on 2016/9/12.
 */
define(["bace","view/box",'upload','validation'],function(Bace,Box){
    var urlPath={};
    urlPath.module={
        reportUrlMenuInfo:[],//向后台传递数据集合
        urlGroupPosition:{},
        defaultPicture:"data:image/png;base64,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",
        backgroundPicture:""
    };
    urlPath.view={};
    urlPath.view={
        init:function(){
            var urlPanel='<div id="layout_body_url_panel">' +
                    '<div id="setUrlPath">设置</div>' +
                    '<div id="urlPanel" class=" urlpaths_name_left">' +
                    '</div>'+
                    '</div>'
                $("#layout_body_panel").append(urlPanel);
            if(Box.main.urlMenuInfo&&(Box.main.urlMenuInfo.length!=0)){
                urlPath.view.refreshUrlGroup();}
        },
        show:function(){
            $.dialog({
                id: 'urlSetDialog',
                title: '设置URL导航',
                padding: '0',
                width: '880px',
                height: '400px',
                lock: true,
                resize:false,
                content: jQuery("#urlSettingsPanel")[0],
                cancelVal: '取消',
                okVal: '保存',
                ok:function(){

                    if(!urlPath.view.valid()){
                        return false;
                    };

                    $.dialog.confirm("您确定保存该url设置吗？",function(){
                        urlPath.module.reportUrlMenuInfo=[];
                        urlPath.view.collect();
                        Box.main.urlMenuInfo=urlPath.module.reportUrlMenuInfo;
                        urlPath.view.refreshUrlGroup();
                        urlPath.view.changeDialogCss();
                    });
                },
                cancel:function(){
                    urlPath.view.changeDialogCss();
                    return true;
                }
            });
            for (var event in urlPath.view.bindEvent) {
                urlPath.view.bindEvent[event]();
            }
        },
        changeDialogCss:function(){//"保存、取消、关闭"弹框时，恢复弹框原有的css样式，避免对"时间格式化和计算指标"弹框产生影响
            $(".aui_buttons").siblings().remove();
            $(".aui_footer").css("background","#f8f8f8");
            $("table.aui_border>tbody>tr:nth-child(2)>td.aui_e").css("background","#f8f8f8");
        },

        collect:function(){//收集弹出框中所有url菜单的内容
            var $urlMenuPosition=$('.url-btn-group>div[class="active"]').attr("id").split("-")[2];
            var urlGroupPosition={position:""};//数组最后一个为url导航栏对齐方式
            urlGroupPosition.position=$urlMenuPosition;

            //防止用户不输入url组名，自动生成url组名,设置变量i
            var j=0;

            //获取弹框左侧url组名下所有的url组
            var $urlnamedefines=$(".url-name-define>div>input.url_name_input");
            // console.log($urlnamedefines);
            $.map($urlnamedefines,function(v){
                var urlMenuGroup={menuName:"",reportUrlInfo:[]};
                var $urlContents=$('.'+$(v).attr("id")+'>div.url_menus');//收集与左侧url组名对应下的右侧url菜单
                $.map($urlContents,function(i){
                    var urlMenuInfo={urlPathName:"",urlPathDetail:"",urlPathPicture:"",urlPathToken:""};
                    var $urlContentMenu=$(i).children().children();
                    urlMenuInfo.urlPathName=$($urlContentMenu[0]).val();
                    urlMenuInfo.urlPathDetail=$($urlContentMenu[1]).val();

                    if(urlMenuInfo.urlPathName&&urlMenuInfo.urlPathDetail){//只有当url名称与url链接都存在时才会收集图片和token值
                        urlMenuInfo.urlPathDetail=(/^[a-zA-z]+:\/\/[^\s]*/).test(urlMenuInfo.urlPathDetail) ? urlMenuInfo.urlPathDetail:"http://"+urlMenuInfo.urlPathDetail;
                        urlMenuInfo.urlPathPicture=$($urlContentMenu[2]).attr("src");
                        // console.log(urlMenuInfo.urlPathPicture);
                        // console.log($($urlContentMenu[2]));
                        //token值
                        urlMenuInfo.urlPathToken=$urlContentMenu[3].checked?1:0;

                        urlMenuGroup.reportUrlInfo.push(urlMenuInfo);
                    }
                });
                if((urlMenuGroup.reportUrlInfo.length==0)&&$(v).val()){
                    urlMenuGroup.menuName=$(v).val();
                    urlPath.module.reportUrlMenuInfo.push(urlMenuGroup);
                }
                if(urlMenuGroup.reportUrlInfo.length>0){
                    urlMenuGroup.menuName=($(v).val())||("url00"+(++j));
                    urlPath.module.reportUrlMenuInfo.push(urlMenuGroup);
                }
            })
            urlPath.module.reportUrlMenuInfo.push(urlGroupPosition);
        },
        refreshUrlGroup:function(){//仪表板制作页面底部的url导航条更新内容
            var $urlPanel=$("#urlPanel");
            var urlGroupWidth;
            $urlPanel.children().remove();
            var urlLength=Box.main.urlMenuInfo.length;
            var $urlPanelPosition=Box.main.urlMenuInfo[urlLength-1].position;
            //  将url菜单放入数组中
            var $urlmenusList='';var $urlmenus=[];var i=0;
            $.map(Box.main.urlMenuInfo,function($e){/*console.log($e);*/
                if($e.reportUrlInfo) {
                    if ($e.reportUrlInfo.length != 0) {
                        $urlmenusList += '<div class="urlPaths"><div class="urlpaths_name urlnamedefine_' + (++i) + '"><b class="fa fa-bars url_fa"></b><a>' + $e.menuName + '</a></div><ul class="urlmenus">';
                        $.map($e.reportUrlInfo, function ($i) {
                            $urlmenusList += '<li class="urlmenulist"><a href="' + $i.urlPathDetail + '" target="_blank"><img class="urlpicture" src="' + ($i.urlPathPicture || urlPath.module.defaultPicture) + '">' + $i.urlPathName + '</a></li>';
                        });
                        $urlmenusList += '</ul></div>';
                    } else {
                        $urlmenusList += '<div class="urlPaths"><div class="urlpaths_name urlnamedefine_' + (++i) + '"><b class="fa fa-bars url_fa"></b><a>' + $e.menuName + '</a></div></div>';
                    }
                }
                $urlmenus.push($urlmenusList);
                $urlmenusList="";
            })
            $urlPanel.append($urlmenus.join(""));
            if($urlPanelPosition==="middle"){
                urlGroupWidth=100/(urlLength-1);
                $("#urlPanel>div.urlPaths").css("width",urlGroupWidth+"%");
            }else if($urlPanelPosition=="right"){
                $urlPanel.removeClass("urlpaths_name_left").addClass("urlpaths_name_"+$urlPanelPosition);
                $("#urlPanel>div.urlPaths").css({"float":"right",
                                                    "borderRight":"none",
                                                    "borderLeft":"1px solid #ddd"});
            }
        },
        refreshUrlDialog:function(){
            $(".url-name-define>div").remove();
            $("#urlcontent>div").remove();
            var $urlGroupPosition=Box.main.urlMenuInfo[Box.main.urlMenuInfo.length-1].position;
            if($urlGroupPosition!="left"){
                $("#url-btn-left").removeClass("active");
                if($urlGroupPosition=="middle"){
                    $("#url-btn-middle").addClass("active");
                }else if($urlGroupPosition=="right"){
                    $("#url-btn-right").addClass("active");
                }
            }
            var $urlGroupName="";
            var $urlGroupDetail="";
            var i=0;
            $.map(Box.main.urlMenuInfo,function($e){
                if($e.reportUrlInfo){/*console.log($e);*/
                    $urlGroupName+='<div><input id="urlnamedefine_'+(++i)+'" class=" url_input url_name_input " type="text" value="'+$e.menuName+'" maxlength="4"></div>';
                    $urlGroupDetail+='<div class="urlnamedefine_'+i+'">';
                    $.map($e.reportUrlInfo,function($i){/*console.log($i);*/
                        $urlGroupDetail+='<div class="url_menus">'+
                            '<div class="url_path_name">'+
                            '<input class="url_input url_path_name_input" type="text" placeholder="请输入名称" value="'+$i.urlPathName+'" maxlength="4">'+
                            '</div>'+
                            '<div class="url_path_detail">'+
                            '<input class="url_input url_path_detail_input" type="text" placeholder="请输入URL链接" value="'+$i.urlPathDetail+'">'+
                            '</div>'+
                            '<div class="url_path_picture"><img class="pictureContainer" src="'+$i.urlPathPicture+'"/>';
                        if($i.urlPathPicture){//有上传图片时，div背景为透明
                                $urlGroupDetail+='<div class="url_path_addPicture" style="background:transparent;"></div></div>';
                        }else{
                            $urlGroupDetail+='<div class="url_path_addPicture"></div></div>';
                        }
                        $urlGroupDetail+='<div class="url_path_token">'+
                            '<input type="checkbox" value="" '+($i.urlPathToken?"checked":" ")+'>'+
                            '</div>'+
                            '<div class="url_path_option">'+
                            '<a href="">删除</a></div></div>';
                    })
                    $urlGroupDetail+='</div>';
                }
            })
            $(".url-name-define").append($urlGroupName).children().first().addClass("active");
            $("#urlcontent").append($urlGroupDetail).children().first().addClass("active");
            $($(".url_name_input")[0]).addClass("validate[required,len[1,6]");
            $($(".url_path_name_input")[0]).addClass("validate[required,len[1,6]");
            $($(".url_path_detail_input")[0]).addClass("validate[required]");
        },
        bindEvent:function(){

            //左侧"按钮组"位置选择点击事件
            $(".url-btn-group").on("click","a",function(e){
                if ( e && e.preventDefault ){e.preventDefault();}else{window.event.returnValue = false;}
                $(e.target).parent().addClass("active").siblings().removeClass("active");
                //禁止5个以下url组选中平铺

            })
            //对左侧"+"添加点击增加url菜单的功能
            $("#addUrlMenus").click(function(){
                var $urlNameInput=$(".url_name_input");
                if($('.url_name_input').length<10/*urlNavNum*/){
                    // var urlMenuList = $("#urlnamedefine_1").parent().parent().children().last().children().attr("id").split("_")[1];
                    var urlMenuList =$($urlNameInput[$urlNameInput.length-1]).attr("id").split("_")[1];
                    $(".url-name-define").append('<div><input id="urlnamedefine_' + (parseInt(urlMenuList) + 1) + '" class="url_input url_name_input " type="text" maxlength="4"></div>');
                    var $url_menus = "";
                    for (var i = 0; i < 4; i++) {
                        $url_menus += '<div class="url_menus">' +
                            '<div class="url_path_name">' +
                            '<input class="url_input url_path_name_input" type="text" placeholder="请输入名称" maxlength="4">' +
                            '</div>' +
                            '<div class="url_path_detail">' +
                            '<input class="url_input url_path_detail_input" type="text" placeholder="请输入URL链接">' +
                            '</div>' +
                            '<div class="url_path_picture">' +
                            '<img class="pictureContainer" src="" alt=""><div class="url_path_addPicture"></div>' +
                            '</div>' +
                            '<div class="url_path_token">' +
                            '<input type="checkbox" value="">' +
                            '</div>' +
                            '<div class="url_path_option">' +
                            '<a href="">删除</a></div></div>'
                    }
                    $("#urlcontent").append('<div class="urlnamedefine_' + (parseInt(urlMenuList) + 1) + '">' + $url_menus + '</div>');
                    $(".url_path_addPicture").children().remove();
                    urlPath.view.pickuploader();
                    $(".webuploader-pick").css({"width":"33px","height":"33px","position":"absolute","top":"0px","left":"0px"})
                        .next().css({"width":"33px","height":"33px","position":"absolute","top":"0px","left":"0px"});
                }
            })
            //对右侧"+"添加点击增加url路径的功能
            $("#addUrlContent").click(function(){
                if($('div.active>.url_menus').length<8/*urlInfoNum*/){
                    $("#urlcontent>div.active").append('<div class="url_menus">'+
                        '<div class="url_path_name"><input class="url_input url_path_name_input" type="text" placeholder="请输入名称" maxlength="4"></div>'+
                        '<div class="url_path_detail"><input class="url_input url_path_detail_input" type="text" placeholder="请输入URL链接"></div>'+
                        '<div class="url_path_picture"><img class="pictureContainer" src="" alt=""><div class="url_path_addPicture"></div></div>'+
                        '<div class="url_path_token"><input type="checkbox" value=""></div>'+
                        '<div class="url_path_option"><a href="">删除</a></div></div>');
                    $(".url_path_addPicture").children().remove();
                    urlPath.view.pickuploader();
                    $(".webuploader-pick").css({"width":"33px","height":"33px","position":"absolute","top":"0px","left":"0px"})
                        .next().css({"width":"33px","height":"33px","position":"absolute","top":"0px","left":"0px"});
                }
            });
            //点击左侧输入框，切换右侧url菜单组
            $(".url-name-define").on("click",".url_name_input",function(e){
                var $e=$(e.target);
                $e.parent().addClass("active").siblings().removeClass("active");
                $("."+$e.attr("id")).addClass("active").siblings().removeClass("active");
            });
            //右侧url菜单组中"删除"按钮事件
            $("#urlcontent").on("click",".url_path_option>a",function(e){
                if ( e && e.preventDefault ){e.preventDefault();}else{window.event.returnValue = false;}
                $(e.target).parent().parent().remove();
            });

            //验证表单格式
            $(".urlSetting").validationEngine({
                autoHidePrompt: true,
                autoHideDelay: 2000,
                binded: true,
                promptPosition: 'bottomLeft',
                showOneMessage: true,
            });

        },
        //提交表单时验证表单内容，至少有一个不为空
        valid:function(){
            var isPass = $('.urlSetting').validationEngine('validate');
            if (!isPass) {
                return false;
            }
            /*设置url菜单对齐方式限制*/
            var $urlNameInput=$(".url_name_input");
            for(var i=0,urlNameInput=[];i<$urlNameInput.length;i++){
               if($($urlNameInput[i]).val()!=""||undefined||null){
                   urlNameInput.push($($urlNameInput[i]).val());
               }
            }
            if(urlNameInput==0){return false;}
            if(urlNameInput.length<6){
                if($("#url-btn-middle").hasClass("active")){
                    $.dialog.alert("少于或等于5个URL导航不能平铺");
                    return false;
                }
            }

            /*设置url菜单中名称与url链接必须同时有*/
            var $checkUrlName=$(".url_path_name_input");
            var $checkUrlDetail=$(".url_path_detail_input");
            var checkNameCollect=[];
            var checkDetailCollect=[];
            $.map($checkUrlName,function($e){
                if($($e).val()){
                    checkNameCollect.push($($e).val());
                }
            });
            $.map($checkUrlDetail,function($v){
                if($($v).val()){
                    checkDetailCollect.push($($v).val());
                }
            });
            if((checkNameCollect.length==0)&&(checkDetailCollect.length==0)){
                $.dialog.alert("请填写url名称与url链接！");
                return false;
            }
            if(checkNameCollect.length!=checkDetailCollect.length){
                $.dialog.alert("url名称与url链接必须填写");
                return false;
            }else{
                return true;
            }

        },
        pickuploader:function(){

            var uploader = WebUploader.create({

                // swf文件路径
                swf: resPath + '/bace/js/webuploader/swf/Uploader.swf',

                // 文件接收服务端。
                server: Bace.handleUrlParam("/platform/dataview/image-handle"),

                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick:'.url_path_addPicture',

                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: false,
                duplicate :true,
                auto: true,
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                }
            });

            uploader.on( 'uploadStart', function( file,response ) {
                // console.log(file);
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on( 'uploadSuccess', function( file,response ) {
                var $div=document.getElementById("rt_"+file.source.ruid);
                $div.parentNode.style.background="transparent";
                $div.parentNode.previousElementSibling.src=response.retMessage;
                console.log(response.retMessage);
            });

            // 文件上传失败，现实上传出错。
            uploader.on( 'uploadError', function( file,response ) {
                $.dialog.alert("图片上传失败！");
            });

            uploader.on("error",function(handler){
                if(handler){
                    $.dialog.alert("图片上传失败,请查看图片格式！");
                }
            })

        }

    };
    urlPath.control={

        init:function(){
            if(!$("#layout_body_url_panel")[0]){urlPath.view.init();}
            //widgets页面底部url菜单点击事件
            $("#urlPanel").on("click",".urlpaths_name>a",function(e){
                $(e.target).parent().siblings().toggleClass("active");
            });
            $("body").click(function(e){
                var $e=$(e.target);
                if(!($e.parent().hasClass("urlpaths_name"))){
                   $("#urlPanel ul.urlmenus.active").removeClass("active");
                }
            });
        },
        show:function(){
            if(!$("#urlSettingsPanel")[0]){
                jQuery("body").append("<div id='urlSettingsPanel' style='display:none;position: relative;'></div>");
            }
            jQuery("#urlSettingsPanel").load(Bace.handleUrlParam('/platform/dataview/url-setting'), function () {

                urlPath.view.show();
                urlPath.view.backgroundPicture=$(".url_path_addPicture").css("background");
                $("table.aui_border>tbody>tr:nth-child(2)>td.aui_e").css("background", "#fff");
                $("table.aui_dialog>tbody>tr:nth-child(3)>td.aui_footer").css({"background":"#fff","position":"relative"})
                    .prepend('<div class="url_name"><p>注：少于或等于5个URL导航不能平铺</p></div>');

                //如果当前页面中已有保存的url信息，打开对话框时，将url信息显示在对话框中
                if(Box.main.urlMenuInfo&&(Box.main.urlMenuInfo.length!=0)){
                    urlPath.view.refreshUrlDialog();
                    // urlPath.view.refreshUrlGroup();
                }
                $(".url_path_addPicture").children().remove();
                urlPath.view.pickuploader();
                $(".webuploader-pick").css({"width":"33px","height":"33px","position":"absolute","top":"0px","left":"0px"})
                    .next().css({"width":"33px","height":"33px","position":"absolute","top":"0px","left":"0px"});

                Bace.autoScroll($(".url-name-define"));
                Bace.autoScroll($(".url_path_content"));
            });
        },
    };
    return urlPath.control;
})
