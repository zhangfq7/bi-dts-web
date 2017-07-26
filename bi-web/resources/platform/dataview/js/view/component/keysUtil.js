define(['view/box', 'bace'],
	function(Box, Bace) {
		var Keys = {
			init:function(){
				$(document).keydown(function(e){
					// ctrl + s 快速保存当前报表
					if( e.ctrlKey  == true && e.keyCode == 83 ){
						if(Box.main.reportId){
							//Box.Header.start.saveReport();
						}else{
							//Box.Header.start.showSaveReport();
						}
						return false; // 截取返回false就不会保存网页了
					}
				});
			}
		}
		return Keys;
	})