/*
* 背景图片设置
* yetf
* 2017-5-22
* */
define(['view/box', 'bace','jcrop'],
	function(Box, Bace,jcrop) {
		var BgUtil = {};
		BgUtil.module = {
			
		};
		BgUtil.control = {
			show: function() {
					var chooseBg='<div id="chooseBgPanel">' +
						'请选取一个图像文件: <input type = "file" id = "chooseImg" name = "file" />'+
						'<div id = "imgResult"> <div id="remove-img">删除</div></div>'+
						'</div>';
                    if(!!sessionStorage.imgSrc){
                        var img = document.createElement("img");
                        img.src = sessionStorage.imgSrc;
                        chooseBg=$(chooseBg).find("#imgResult").append(img).parent().get(0);
                    }
					BgUtil.view.show(chooseBg);
                    if(!!sessionStorage.imgSrc){
                        $("#remove-img").show();
                        $("#remove-img").click(function(){
                            if(!!sessionStorage.imgSrc){
                                sessionStorage.removeItem("imgSrc");
                            }
                            BgUtil.view.imgTemp='';
                            $("#imgResult img").remove();
                        });
                    }


            }
		}
		BgUtil.view = {
		    imgTemp:"",
			show:function(chooseBg){
				$.dialog({
					title:'选择或上传您的背景图片',
					padding:'0',
					width:'600px',
					height:'275px',
					lock: true,
					content:chooseBg,
					ok: function () {
					    if(!!BgUtil.view.imgTemp){
                            sessionStorage.imgSrc=BgUtil.view.imgTemp;
                        }
                        if(!!sessionStorage.imgSrc){
                            $(".container").css({"background-image":"url("+sessionStorage.imgSrc+")","background-size":"100% 100%","background-repeat":"no-repeat"});
                        }else{
                            $(".container").css({"background-image":"none"});
                        }
                        return true;
				    },
				    okVal:'确定',
				    cancelVal: '关闭',
				    cancel: function(){
                         return;
				    }
				});
                jQuery("body").on("change","#chooseImg",function(){
                    BgUtil.view.imgReader();
                })
			},
            //图片预览，及大小限制,yetf 2017/5/22
			imgReader:function (e){
				var file=$('#chooseImg').get(0).files[0];
				if(file){
					if (file.type.indexOf("image") == 0) {
						if (file.size >= 512000) {
							alert('您这张"'+ file.name +'"图片大小过大，应小于500k');
							return
						} else {
							var reader=new FileReader();
							reader.onload = function(e){
								var txt=e.target.result;
								var img = document.createElement("img");
								img.src = txt;
                                BgUtil.view.imgTemp=txt;
                                if($("#imgResult img")){
                                    $("#imgResult img").remove();
                                }
								$("#imgResult").append(img);
                                //删除
                                $("#remove-img").show();
                                $("#remove-img").click(function(){
                                    if(!!sessionStorage.imgSrc){
                                        sessionStorage.removeItem("imgSrc");
                                    }
                                    BgUtil.view.imgTemp='';
                                    $("#imgResult img").remove();
                                });
							}
						}
					} else {
						alert('文件"' + file.name + '"不是图片。');
						return;
					}
					reader.readAsDataURL( file );
			}

		},

		}
		return BgUtil.control;
})