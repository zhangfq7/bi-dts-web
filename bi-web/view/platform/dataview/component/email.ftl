<#include "view/platform/frame/bace/top.ftl">
<link rel="stylesheet" href="${resPath}/resources/platform/myhome/css/add-user.css${css_version}" />
<link rel="stylesheet" type="text/css" href="${resPath}/resources/platform/dataview/css/component/email.css" />
<script>
  var img = '${img}';
  var title = '${title}';
  var desc = '${desc}';
  var reportId = '${reportId}';
</script>
<div class="emailpanel">
    <div class="head">
        <span>邮件推送</span>
        <div>
           <i class="fa fa-paper-plane" aria-hidden="true"></i>
        </div>
    </div>
    <div class="body">
        <div>
            <div class="title"><span>收件人</span></div>
            <div class="input">
               <input type="text" id="sendEmail" class="form-control input-sm" value="" data-role="tagsinput" >
               <i id="selectUser" class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
        </div> 
        <!-- <div>
            <div class="title"><span>抄送人</span></div>
            <div class="input"><input class="form-control input-sm" id="sendEmail2"/></div>
        </div> -->
        <div>
            <div class="title"><span>主题</span></div>
            <div class="input"><input class="form-control input-sm" id="theme"/></div>
        </div> 
    </div>
    <div class="content">
        <textarea id="content"></textarea>
    </div>
    <div class="img">
        <div>
           <i class="fa fa-file-image-o" aria-hidden="true"></i>
           <span>${title}</span>
        </div>
    </div>
</div>











<#include "view/platform/frame/bace/bottom.ftl">
<script>
_require(
{
	paths : {
		'emial':'${resPath}/resources/platform/dataview/js/view/component/emailUtil',
		'addUser':'${resPath}/resources/platform/myhome/js/email-add-user'
	}
},
'emial',function(emial){
    emial.init();
}
);
</script>