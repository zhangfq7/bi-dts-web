define(['bace','view/box','qrcode','zclip'],
	function(Bace,Box) {
		var Share = {};
		Share.control = {
			init:function(reportConfig){
				initShareEx(reportConfig);
			}
		};
        Share.view={
        }
		/**
         * author:zhangcc
         * desc:初始化分享面板
         * */
		function initShareEx(reportConfig){
			//增加头部区域(现在就剩下一个报表名称)(分享的面板在container.js的start("render")方法中增加);
			var shareDiv='<div class="report-title">'+Box.main.reportName+'</div>';
			//$("#layout_body_panel").css("top","70px");
			var sharPanel = $("<div class='share-panel'>",{
				css:{
					'width':'100%',
					'height':'50px',
					'background':'#FFF'
				},
			});
			sharPanel.append(shareDiv);
			$("body").prepend(sharPanel);

            //查询报表邮件推送条数 added by zhangcc
            $.ajax({
                url: Bace.handleUrlParam(webpath+'/platform/dataview/count-email'),
                async:false,
                data:{
                    'reportId':Box.main.reportId
                },
                success: function(req) {
                    var emailCount=req.emailCount || 0;
                    var downLoadCount=req.downLoadCount || 0;
                    shareAndDownload(emailCount,downLoadCount);
                },
                error: function() {
                    var emailCount=0;
                    var downLoadCount=0;
                    shareAndDownload(emailCount,downLoadCount);
                }
            });

            //分享区域   added by zhangcc start
            function shareAndDownload(emailCount,downLoadCount){
                var shareDiv;
                var elementList = {
                        shareDiv      :'<div class="share-content " >'+
                                       '<div id="share" class="share-text wechat"></div>'+
                                       '<div id="sinaBlog" class="share-text sina-blog"></div>'+
                                       '<div id="QQzone" class="share-text qq-zone"></div>'+
                                       '<div id="copyToClip" class="share-text copy-url"></div>',
                        downloadEx    :'<div id="downloadEx" class="operaDownBottonEx">下载</div>',
                        EmailEx       :'<div id="EmailEx" class="operaEmailBottonEx">邮件推送</div>',
                        detail        :'<br/>'+'<div class="detail">快给朋友分享吧！</div>',
                        countDownLoad :'<div id="countDownLoad">'+downLoadCount+'人已下载</div>',
                        countEmail    :'<div id="countEmail">'+emailCount+'人已推送</div>',
                        bubble        :'</div>'+
                                       '<div id="bubble">'+
                                       '<div class="qr-code ">'+
                                       '<div id="qrCode">'+
                                       '</div>'+
                                       '</div>'+
                                       '<div class="detail">打开微信“扫一扫”，将本报表分享到朋友圈</div>'+
                                       '</div>'
                    };
                var packUp = {
                    shareDiv      :1,
                    downloadEx    :1,
                    EmailEx       :1,
                    detail        :1,
                    countDownLoad :1,
                    countEmail    :1,
                    bubble        :1
                };

                //add by wangle 20160901 start (config在pc.ftl中,由模板直接获取)
                var openSendEmail = reportConfig.openSendEmail||false;
                var openDownload = reportConfig.openDownload||false;
                if(!openDownload){
                    $.extend(packUp,{downloadEx:0,countDownLoad:0});
                }
                if(!openSendEmail){
                    $.extend(packUp,{EmailEx:0,countEmail:0});
                }
                //组装分享div
                shareDiv = ($.map(elementList,function(e,i){
                    if(!!packUp[i]){
                        return e;
                    }
                })).join("");
                //将分享组件插入分享面板
                $("#shareAndDownload").html(shareDiv);

                //微信生成二维码
                $("#bubble").hide();
                jQuery('#qrCode').qrcode({text:reportUrl});
                var timer = null;
                $('#share').bind('mouseover',function(){
                    $("#bubble").show();
                    $(".wechat").addClass("hover");
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        $("#bubble").hide();
                        $(".wechat").removeClass("hover");
                    },10000);
                });

                $("#QQzone").on('click', function(){
                    window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(reportUrl)+'&title='+Box.main.reportName);
                    return false;
                });
                $("#sinaBlog").on('click', function(){
                    window.open('http://service.weibo.com/share/share.php?appkey=&searchPic=false&style=simple&url='+encodeURIComponent(reportUrl)+'&title='+ Box.main.reportName);
                    return false;

                });
				//复制链接  直接弹出框实现
				 $("#copyToClip").on('click', function() {

                	prompt("请用Ctrl+C复制连接",reportUrl);
                })
                //复制到剪贴板  这哥方法有些浏览器不支持，暂时不用
                $("#copyToClip2").on('click', function(){
                    if(window.clipboardData){
                        //如果有原生的事件支持,则重新绑定click事件
                        $("#copyToClip").off("click");
                        $("#copyToClip").on('click', function(){
                            window.clipboardData.setData("Text", reportUrl);
                        });
                        window.clipboardData.setData("Text", reportUrl);
                    }else{
                        // 复制到剪切板
                        $(".zclip").remove();
                        $("#copyToClip").zclip({
                            copy: function () {
                                return reportUrl;
                            }
                        });
                    }
                });
            };
            //分享区域   added by zhangcc end
		};



        /**
         * 1.2版本不用这个方法了,遗留下来备用
         * */
		function initShare(){
			//如果是查看，增加分享区域
			var shareDiv='<div class="report-title">'+Box.main.reportName+'</div><div class="share-area"><div class="share-text share">分享:</div><div id="share" class="share-text wechat cursor-pointer">微 信<span class="show-share"></span></div></div><div id="shareDiv" class="bubble">'+
			'<div class="share-content">'+
		    '<div id="sinaBlog" class="share-text sina-blog">新浪微博</div>'+
		    '<div id="QQzone" class="share-text qq-zone">QQ空间</div>'+
		    '<div id="copyToClip" class="share-text copy-url"><div>复制地址</div></div>'+
		    '<hr class="share-hr"/>'+
		    '<div class="code-title">微信扫描二维码：</div>'+
		    '<div class="qr-code">'+
			    '<div id="qrCode">'+
			    '</div>'+
		    '</div>'+
		    '</div>'+
	        '<div class="bubble-arrow"></div>'+
	        '<div class="bubble-arrow-inner"></div>'+
	        '</div>';
			//$("#layout_body_panel").css("top","70px");
			var sharPanel = $("<div class='share-panel'>",{
				css:{
					'width':'100%',
					'height':'50px',
					'background':'#FFF'
				},
			});
			sharPanel.append(shareDiv);
			$("body").prepend(sharPanel);

//			log(reportUrl);
			jQuery('#qrCode').qrcode({text:reportUrl});

			var shareTimer;  //分享div计时器,分享div弹出后如果不操作,自动消失
			$("#share").on('click', function() {

				var shareTop = jQuery("#share").offset().top;
				var shareLeft = jQuery("#share").offset().left;
				var shareWidth = jQuery("#share").width();
				var shareHeight = jQuery("#share").height();
				$("#shareDiv").css({'top':shareTop+shareHeight+5,'left':shareLeft+shareWidth-113});

				
				if("none" == jQuery("#shareDiv").css("display")){
					jQuery("#shareDiv").show();
					if(window.clipboardData){
						jQuery("#shareDiv").hide();
						$("#copyToClip").on('click', function(){
							window.clipboardData.setData("Text", reportUrl);
						});
					}else{
						// 复制到剪切板
						$(".zclip").remove();
						$("#copyToClip").zclip({ 
							copy: function () {  
								return reportUrl; 
							} 
						});
//							jQuery("#shareDiv").hide();
					}
				}else{
					jQuery("#shareDiv").hide();
				}
				
				clearTimeout(shareTimer)
				shareTimer = setTimeout(function(){
					jQuery("#shareDiv").hide();
				},1500);

			});
		
			jQuery("#shareDiv").on("mousemove",function(){
				if(!shareTimer) return;
				clearTimeout(shareTimer);
				shareTimer = null;
			}).on("mouseleave",function(){
				shareTimer = setTimeout(function(){
						jQuery("#shareDiv").hide();
				},1500);
			});

			$("#QQzone").on('click', function(){
				window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(reportUrl)+'&title='+Box.main.reportName);
				return false;
			});
			$("#sinaBlog").on('click', function(){
				window.open('http://service.weibo.com/share/share.php?appkey=&searchPic=false&style=simple&url='+encodeURIComponent(reportUrl)+'&title='+ Box.main.reportName);
				return false;

			});
		}


		return Share.control;
	}
);