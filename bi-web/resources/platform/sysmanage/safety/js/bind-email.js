define(["sabace","safety/message"],function(b,c){function f(){jQuery("#validate-sub").on("click",d)}function d(){var j=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;var h=jQuery("#newEmail").val();var i=jQuery("#reNewEmail").val();if(b.IsEmpty(h)){a(b.getMessage("safety.msg.newEmail.empty"));return}if(b.IsEmpty(i)){a(b.getMessage("safety.msg.reNewEmail.empty"));return}if(!j.test(h)){a(b.getMessage("safety.msg.newEmail.error"));return}if(h!=i){a(b.getMessage("safety.msg.email.diff"));return}var g={type:"bind",newEmail:h.toLowerCase()};b.ajax({url:b.handleUrlParam("/platform/sysmanage/safety/edit-email"),data:g,success:function(k){if(!k.validateFlag){bi.dialog.alert({type:bi.dialog.TYPE_DANGER,title:b.getMessage("safety.msg.error"),message:b.getMessage(k.errorMsg),callback:function(l){if(k.expireFlag){var m={};m.type=4;e(b.handleUrlParam("/platform/sysmanage/safety/validate"),m)}}})}else{bi.dialog.show({title:b.getMessage("safety.msg.success"),message:b.getMessage("safety.msg.successfully"),closeByBackdrop:false,closeByKeyboard:false,});b.timeout(function(){top.document.location.href=b.handleUrlParam("/platform/sysmanage/user/safety")},3000)}},error:function(k){bi.dialog.show({type:bi.dialog.TYPE_DANGER,title:b.getMessage("user.label.error"),message:k.responseText||b.getMessage("safety.msg.exception")})}})}function e(i,k){var j="";for(var h in k){j+="<input name='"+h+"' value='"+k[h]+"'/>"}var g=jQuery("<form></form>",{method:"post",action:i,html:j});jQuery("body").append(g);g.submit();jQuery(g).remove()}function a(g){bi.dialog.show({type:"type-warning",title:b.getMessage("safety.msg.prompt"),message:g})}return{init:f}});