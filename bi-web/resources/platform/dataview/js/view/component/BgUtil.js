define(["view/box","bace","jcrop"],function(b,d,c){var a={};a.module={};a.control={show:function(){var f='<div id="chooseBgPanel">请选取一个图像文件: <input type = "file" id = "chooseImg" name = "file" /><div id = "imgResult"> <div id="remove-img">删除</div></div></div>';if(!!sessionStorage.imgSrc){var e=document.createElement("img");e.src=sessionStorage.imgSrc;f=$(f).find("#imgResult").append(e).parent().get(0)}a.view.show(f);if(!!sessionStorage.imgSrc){$("#remove-img").show();$("#remove-img").click(function(){if(!!sessionStorage.imgSrc){sessionStorage.removeItem("imgSrc")}a.view.imgTemp="";$("#imgResult img").remove()})}}};a.view={imgTemp:"",show:function(e){$.dialog({title:"选择或上传您的背景图片",padding:"0",width:"600px",height:"275px",lock:true,content:e,ok:function(){if(!!a.view.imgTemp){sessionStorage.imgSrc=a.view.imgTemp}if(!!sessionStorage.imgSrc){$(".container").css({"background-image":"url("+sessionStorage.imgSrc+")","background-size":"100% 100%","background-repeat":"no-repeat"})}else{$(".container").css({"background-image":"none"})}return true},okVal:"确定",cancelVal:"关闭",cancel:function(){return}});jQuery("body").on("change","#chooseImg",function(){a.view.imgReader()})},imgReader:function(h){var g=$("#chooseImg").get(0).files[0];if(g){if(g.type.indexOf("image")==0){if(g.size>=512000){alert('您这张"'+g.name+'"图片大小过大，应小于500k');return}else{var f=new FileReader();f.onload=function(k){var i=k.target.result;var j=document.createElement("img");j.src=i;a.view.imgTemp=i;if($("#imgResult img")){$("#imgResult img").remove()}$("#imgResult").append(j);$("#remove-img").show();$("#remove-img").click(function(){if(!!sessionStorage.imgSrc){sessionStorage.removeItem("imgSrc")}a.view.imgTemp="";$("#imgResult img").remove()})}}}else{alert('文件"'+g.name+'"不是图片。');return}f.readAsDataURL(g)}},};return a.control});