define(["sabace","safety/message"],function(c,e){function f(){jQuery(".captcha-pic img").on("click",function(i,h){jQuery(".captcha-pic img").attr("src",c.handleUrlParam("/ImageServlet?")+Math.random())});jQuery("#getvalidNum").on("click",b);jQuery("#comfirm-bind").on("click",function(i,h){if(g()){c.ajax({url:c.handleUrlParam("/platform/sysmanage/safety/bind-mobile"),data:{mobileNum:jQuery("#mobileNum").val(),checkCode:jQuery("#checkCode").val(),captcha:jQuery("#captcha").val()},success:function(j){if(!j.validateFlag){a(c.getMessage(j.errorMsg))}else{bi.dialog.show({title:c.getMessage("safety.msg.success"),message:c.getMessage("safety.msg.successfully")});c.timeout(function(){top.document.location.href=c.handleUrlParam("/platform/sysmanage/user/safety")},3000)}},error:function(j){bi.dialog.alert({type:bi.dialog.TYPE_DANGER,title:c.getMessage("safety.msg.error"),message:c.getMessage("safety.msg.exception"),closeByBackdrop:false,closeByKeyboard:false,})}})}})}function g(){var h=jQuery("#checkCode").val();var k=jQuery("#mobileNum").val();var i=jQuery("#captcha").val();var j=/^((13[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8}$/;if(c.IsEmpty(k)){a(c.getMessage("safety.msg.mobile.empty"));return false}if(!j.test(k)){a(c.getMessage("safety.msg.mobile.error"));return false}if(h.length!=4){a(c.getMessage("safety.msg.checkCode.lengthError"));return false}if(i.length!=4){a(c.getMessage("safety.msg.captcha.error"));return false}return true}function b(){var j=jQuery("#mobileNum").val();var i=/^((13[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8}$/;if(c.IsEmpty(j)){a(c.getMessage("safety.msg.mobile.empty"));return}if(!i.test(j)){a(c.getMessage("safety.msg.mobile.error"));return}d.init(this);var h=jQuery("#captcha").val();c.ajax({data:{mobileNum:jQuery("#mobileNum").val()},url:c.handleUrlParam("/platform/sysmanage/safety/send-sms"),success:function(k){if(!k.validateFlag){a(c.getMessage(k.errorMsg))}},error:function(k){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:c.getMessage("user.label.error"),message:k.responseText||c.getMessage("safety.msg.exception")})}})}var d={node:null,count:60,start:function(){if(this.count>0){this.node.innerHTML=this.count--+c.getMessage("safety.label.send.msg");var h=this;c.timeout(function(){h.start()},1000)}else{this.node.removeAttribute("disabled");this.node.innerHTML=c.getMessage("safety.button.getMsg");this.count=60}},init:function(h){this.node=h;this.node.setAttribute("disabled",true);this.start()}};function a(h){jQuery(".captcha-pic img").attr("src",c.handleUrlParam("/ImageServlet?")+Math.random());bi.dialog.show({type:"type-warning",title:c.getMessage("safety.msg.prompt"),message:h,})}return{init:f}});