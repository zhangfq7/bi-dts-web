define(["sabace","upload","user/message"],function(v,o){var t;var n=0;var y=0;var A=null;var f=0;var e=0;var m=jQuery(".preview-container");var u=jQuery(".preview-container img");var s=m.width();var h=m.height();var q;var k;var x=0;var g=140;var r=140;var j=false;var d="";jQuery(function(){var C=new Date().getFullYear();for(var D=C;D>=C-100;D--){d+='<option value="'+D+'">'+D+"</option>"}jQuery("#select-year").html(d);d="";for(var E=1;E<=12;E++){d+='<option value="'+E+'">'+E+"</option>"}jQuery("#select-month").html(d);d="";for(var B=1;B<=31;B++){d+='<option value="'+B+'">'+B+"</option>"}jQuery("#select-day").html(d);if(!v.IsEmpty(birthday2)){var D=birthday2.split("-")[0];var E=parseInt(birthday2.split("-")[1]);var B=parseInt(birthday2.split("-")[2]);jQuery("#select-year").val(D);jQuery("#select-month").val(E);jQuery("#select-day").val(B)}if(!v.IsEmpty(sex2)){if(sex2=="1"){jQuery("#male").removeClass("fa-square-o");jQuery("#male").addClass("fa-check-square-o")}else{if(sex2=="0"){jQuery("#female").removeClass("fa-square-o");jQuery("#female").addClass("fa-check-square-o")}else{if(sex2=="9"){jQuery("#unknown").removeClass("fa-square-o");jQuery("#unknown").addClass("fa-check-square-o")}}}}jQuery("#select-year").chosen({disable_search:true});jQuery("#select-day").chosen({disable_search:true});jQuery("#select-month").chosen({disable_search:true});l();jQuery("#select-year").on("change",b);jQuery("#select-month").on("change",b);jQuery("#saveUserInfoBtn").on("click",c);jQuery(".radio-label").on("click",function(){jQuery(this).prev().click()});jQuery(".checkBox").on("click",function(){j=jQuery(this).hasClass("fa-square-o");jQuery(".checkBox").removeClass("fa-check-square-o");jQuery(".checkBox").addClass("fa-square-o");if(j){jQuery(this).removeClass("fa-square-o");jQuery(this).addClass("fa-check-square-o")}});jQuery("#account-security").on("click",function(){window.location.href=v.handleUrlParam("/platform/sysmanage/user/safety")});jQuery(".div-left").validationEngine({autoHidePrompt:true,autoHideDelay:2000,binded:true,promptPosition:"bottomLeft",showOneMessage:true,})});function b(){var C=jQuery("#select-year").val();var D=jQuery("#select-month").val();var E=w(C,D);d="";for(var B=1;B<=E;B++){d+='<option value="'+B+'">'+B+"</option>"}jQuery("#select-day-parent").html('<select id="select-day" class="birthday-select"></select>');jQuery("#select-day").html(d);jQuery("#select-day").chosen({disable_search:true})}function w(B,C){return new Date(B,C,0).getDate()}function l(){jQuery("#picker").show();t=WebUploader.create({swf:resPath+"/bace/js/webuploader/swf/Uploader.swf",server:v.handleUrlParam("/platform/sysmanage/user/upload-file"),pick:"#picker",resize:false,auto:true,accept:{title:"Images",extensions:"gif,jpg,jpeg,bmp,png",mimeTypes:"image/*"}});t.on("uploadSuccess",function(C,B){v.timeout(function(){jQuery("#uploadProgress").slideUp();jQuery("#picker").css("margin","0px");a(B)},500)});t.on("uploadProgress",function(C,B){jQuery("#uploadProgress").html(Math.round(B*100)+"%");if(Math.round(B*100)==100){jQuery("#uploadProgress").html(v.getMessage("user.label.uploadSucceed"))}});t.on("startUpload",function(){jQuery("#uploadProgress").slideDown();jQuery("#uploadProgress").html("0%");jQuery("#cropImageDiv").empty()})}function a(B){t.reset();i(B.width,B.height)}function p(D){if(parseInt(D.w)>0){tcx=(D.x/(n*x))*n;tcy=(D.y/(y*x))*y;tcw=((D.x2-D.x)/(n*x))*n;tch=((D.y2-D.y)/(y*x))*y;if((tcx+tcw)>n){tcw=n-tcx}if((tcy+tch)>y){tch=y-tcy}var C=s/D.w;var B=h/D.h;u.css({width:Math.round(C*f)+"px",height:Math.round(B*e)+"px",marginLeft:"-"+Math.round(C*D.x)+"px",marginTop:"-"+Math.round(B*D.y)+"px"})}}function z(){var F=A.getBounds();var D=100;var B=0;var G=0;if(F[0]>=D&&F[1]>=D){B=(F[0]-D)/2;G=(F[1]-D)/2}else{if(F[0]>F[1]){D=F[1];B=(F[0]-D)/2;G=0}else{if(F[0]<F[1]){D=F[0];B=0;G=(F[1]-D)/2}else{D=F[0];B=0;G=0}}}var C=B+D;var E=G+D;return[B,G,C,E]}function i(B,D){jQuery("#preview-tr").show();jQuery("#cropImageDiv").css("background","url("+resPath+"/resources/platform/sysmanage/user/img/bg.jpg)");n=B;y=D;jQuery("#cropImageDiv").empty();if(A!=null){A.destroy()}var E=v.handleUrlParam("/platform/readByteImg")+"?_t="+new Date().getTime();jQuery("#cropImageDiv").append('<img id="element_id" />');jQuery("#element_id").attr("src",E);jQuery("#preview").attr("src",E);if(B>g||D>r){jQuery("#cropImageDiv").css({padding:"0px",height:r+"px",width:g+"px"});if(B>g&&D<=r){x=g/B;jQuery("#element_id").width(B*x+"px");k=D*x;jQuery("#cropImageDiv").css("paddingTop",(r-k)/2+"px")}else{if(B<=g&&D>r){x=r/D;jQuery("#element_id").height(D*x+"px");q=B*x;jQuery("#cropImageDiv").css("paddingLeft",(g-q)/2+"px")}else{if(B>g&&D>r){var C=g/B;var F=r/D;if(C<=F){x=g/B;jQuery("#element_id").width(B*x+"px");k=D*x;jQuery("#cropImageDiv").css("paddingTop",(r-k)/2+"px")}else{x=r/D;jQuery("#element_id").height(D*x+"px");q=B*x;jQuery("#cropImageDiv").css("paddingLeft",(g-q)/2+"px")}}}}}else{x=1;jQuery("#cropImageDiv").css({paddingTop:(r-D)/2+"px",paddingLeft:(g-B)/2+"px",})}jQuery("#element_id").Jcrop({aspectRatio:s/h,onSelect:p,onChange:p,animationDelay:20,addClass:"jcrop-light"},function(){A=this;var G=A.getBounds();f=G[0];e=G[1];v.timeout(function(){A.animateTo(z())},300)})}function c(){var C=jQuery(".div-left").validationEngine("validate");if(!C){return}if(jQuery(".fa-check-square-o").length<1){jQuery("#female").validationEngine("showPrompt",v.getMessage("user.label.pleaseSelectSex"),"error","topRight",true);return}else{jQuery("#female").validationEngine("hide")}var E=jQuery(".fa-check-square-o").eq(0).attr("id");if(E=="male"){E="1"}else{if(E=="female"){E="0"}else{E="9"}}var B=jQuery("#bardianSign").val();var H=jQuery("#userName").val();var F=jQuery("#select-year").val();var D=jQuery("#select-month").val();var G=jQuery("#select-day").val();if(D<10){D="0"+D}if(G<10){G="0"+G}var J=F+"-"+D+"-"+G;var I={userName:H,bardianSign:B,birthday:J,sex:E};if(A!=null&&A.tellSelect().x!=A.tellSelect().x2){I.tcx=Math.floor(tcx);I.tcy=Math.floor(tcy);I.tcw=Math.floor(tcw);I.tch=Math.floor(tch);I.operType="1"}bi.dialog.confirm({title:v.getMessage("user.label.confirm"),message:v.getMessage("user.label.confirmSave"),callback:function(K){if(K){v.ajax({type:"post",cache:false,dataType:"json",loading:{title:v.getMessage("user.label.tip"),text:v.getMessage("user.label.pleaseWait")},data:I,url:v.handleUrlParam("/platform/sysmanage/user/save-user-info"),success:function(L){if(L.flag=="succeed"){bi.dialog.show({title:v.getMessage("user.label.succeed"),message:v.getMessage("user.label.saveSuccesfully")})}else{bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:v.getMessage("user.label.error"),message:v.getMessage("user.label.saveFail")})}},error:function(L){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:v.getMessage("user.label.error"),message:L.responseText||v.getMessage("user.label.saveError")})}})}}})}});