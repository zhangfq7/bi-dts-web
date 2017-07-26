define(['sabace'], function(sabace) {
	var o1=document.getElementById("sms-order");	
	jQuery('#sendbtn').on("click",change);
	function change(){
		 jQuery('.line-color').css("background","#66CD00");
		 jQuery('.ui-viewstep-last-item').css("color","#1da653");
		 jQuery('.circle2').css("border","1px solid #1da653");
		 o1.style.display=='none'
		
	}
	
	

	
})
