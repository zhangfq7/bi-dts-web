define(["sabace","cookie"],function(e,d){function g(){jQuery(".captcha-pic img").attr("src",webpath+"/ImageServlet?"+Math.random())}function b(h){jQuery(".login-error").show();jQuery(".error-str").text(h);jQuery(".login-div").height(430)}function f(){jQuery(".login-error").hide();jQuery(".error-str").text("");jQuery(".login-div").height(390)}function c(){if(jQuery(".form-input").prop("disabled")){return}var j=jQuery("#userID").val();if(e.IsEmpty(j)){b(e.getMessage("login.msg.inputUsername"));jQuery("#userID").focus();return}var k=jQuery("#userPassword").val();if(e.IsEmpty(k)){b(e.getMessage("login.msg.inputPassword"));jQuery("#userPassword").focus();return}var i=jQuery("#captcha").val();if("debug"!=runMode){if(e.IsEmpty(i)){b(e.getMessage("login.msg.inputCaptcha"));jQuery("#captcha").focus();return}if(i.length!=4){b(e.getMessage("login.msg.captcha.lengthError"));jQuery("#captcha").focus();return}}var l=jQuery(".remember-user").find("i");if(l.hasClass("fa-check-square-o")){jQuery.cookie("userID",jQuery("#userID").val())}else{jQuery.cookie("userID","")}var h={};h.userID=j;h.userPassword=k;h.captcha=i;jQuery(".form-input").prop("disabled",true);jQuery(".login-button").html(e.getMessage("login.button.loading")).addClass("text-loading");e.ajax({type:"post",cache:false,dataType:"json",url:webpath+"/manage/login/validate-login/validate",data:h,success:function(m){if(!m.validateFlag){a(e.getMessage(m.errorMsg))}else{document.location.href=webpath+"/manage/frame/login"}},error:function(m){a(e.getMessage("login.msg.exception"))}})}function a(h){b(h);jQuery("#userPassword").val("");jQuery("#captcha").val("");g();jQuery(".form-input").prop("disabled",false);jQuery(".login-button").html(e.getMessage("login.button.login")).removeClass("text-loading");jQuery("#userPassword").focus()}jQuery("#userPassword, #captcha").on("keyup",function(h){if(event.keyCode=="13"){c()}});jQuery(function(){jQuery(".login-button").html(e.getMessage("login.button.login"));jQuery("#userID").focus();jQuery(".captcha-pic img").on("click",function(k,j){g()});jQuery(".login-button").on("click",function(){c()});jQuery(".form-input").on("keydown",function(j){f()});jQuery(".langPanel>span").on("click",function(){var j=jQuery(this);if(j.hasClass("en")){location.href=webpath+"/manage/login/page?lang=en"}else{location.href=webpath+"/manage/login/page?lang=zh"}});jQuery(".remember-user").on("click",function(){var j=jQuery(this).find("i");if(j.hasClass("fa-check-square-o")){j.removeClass("fa-check-square-o").addClass("fa-square-o")}else{j.removeClass("fa-square-o").addClass("fa-check-square-o")}});if(e.getlang=="zh"){jQuery(".zh").addClass("active");jQuery(".en").removeClass("active")}else{jQuery(".zh").removeClass("active");jQuery(".en").addClass("active")}var i=jQuery.cookie("userID");var h=jQuery(".remember-user").find("i");if(e.IsEmpty(i)){h.removeClass("fa-check-square-o").addClass("fa-square-o")}else{h.removeClass("fa-square-o").addClass("fa-check-square-o");jQuery("#userID").val(i);jQuery("#userPassword").focus()}})});