define(['sabace','addUser'], function(sabace,addUser) {
    var email = {}  ;
    
    email.module={
    	img : img,
    	title : title,
    	desc : desc,
    	reportId:reportId
    }
    
    email.view ={
    		isEmail : function(str){
    		       var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    		       return reg.test(str);
    		}
    }
    
    email.control={
    		init : function(){
    			$("#theme").val(email.module.title)
    			$("#content").val(email.module.title+"\n"+email.module.desc)
    			
    			$(".img>div").bind("click",function(){
    				window.open(email.module.img)
    			})
    			
    			$(".head>div").bind("click",function(){
    				var email1=$("#sendEmail").val();
    				
    				if(email1=="" ){
    					bi.dialog.show({
    						type: bi.dialog.TYPE_WARNING,
    						title: '警告',
    						message: '请输入邮箱地址！'
    					});
    					return;
    				}
    				var arr = [];
    				if(email1 != ''){
    					arr = email1.split(",");
    				}
    				var isPass = true;
    				for(var i=0;i<arr.length;i++){
    					if(! email.view.isEmail(arr[i])){
    						isPass = false;
    					}
    				}
    				if(!isPass){
    					bi.dialog.show({
    						type: bi.dialog.TYPE_WARNING,
    						title: '警告',
    						message: '邮箱地址格式不正确！'
    					});
    					return;
    				}else{
    					var address = arr.join(",");
    					sabace.ajax({
    						data: {
    							theme: $("#theme").val(),
	    						emailAddress:address,
    							img:email.module.img,
    							content:$("#content").val(),
    							reportId:email.module.reportId
    						},
    						url: sabace.handleUrlParam(webpath+'/platform/dataview/send-email'),
    						success: function(req) {
    							if(req.flag==0){
    								bi.dialog.show({
        								title: '提示',
        								message: '邮件发送成功!'
        							});
    							}
    						},
    						error: function(req) {
    							bi.dialog.show({
    								type: bi.dialog.TYPE_DANGER,
    								title: '错误',
    								message: req.responseText
    							});
    						}
    					});
    				}
    			})
    			
    			$("#selectUser").bind("click",function(){
    				var url = sabace.handleUrlParam('/platform/myhome/add-user')+"?type=email";
    				//添加新成员
    				bi.dialog.show({
    					title: '编辑用户',
    					message: $('<div id="add-user-dialog"></div>').load(url),
    					spinicon: 'glyphicon glyphicon-refresh',
    					cssClass: 'add-user-dialog',
    					closeByBackdrop: false,
    					closeByKeyboard: false,
    					onshown: function() {
    						addUser.init();
    					},
    					buttons: [{
    						label: '取消',
    						//hotkey: 13, // Enter  让键盘回车直接出发此按钮
    						cssClass: 'btn-info',
    						action: function(dialog) {
    							dialog.close();
    						}
    					}, {
    						label: '保存',
    						//hotkey: 13, // Enter  让键盘回车直接出发此按钮
    						cssClass: 'btn-info',
    						action: function(dialog) {
    							addUser.saveUsers();
    							dialog.close();
    						}
    					}]
    				});
    			})
    			
    		}
    }
    
    return email.control;
})