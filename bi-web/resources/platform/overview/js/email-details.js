define(['sabace','order/message','slider'], function(sabace, message,slider) {

	jQuery(function(){
		
		if(openFlag == "0"){
			jQuery(".opened-info").addClass("hide");
			jQuery(".closed-info").removeClass("hide");
		}else{
			jQuery(".closed-info").addClass("hide");
			jQuery(".opened-info").removeClass("hide");
		}
		
		jQuery(".openEmail").on("click", function(){
			
		});
	});
	
	
});