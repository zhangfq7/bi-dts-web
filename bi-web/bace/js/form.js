jQuery(function() {
	jQuery('body').niceScroll();
	if(jQuery.pjax){
		jQuery.pjax({
		    selector: '[tag]',
		    container: '#pjax-container',
		    show: 'fade',
		    cache: false,
		    storage: false
	    });
	}
	
});
var config = {
	urlArgs :js_version,
	baseUrl : resPath + '/bace/js',
	waitSeconds : 60,
	paths : {
		"sabace" : "tools/sa-bace",
		'cookie' : 'jquery-cookie/jquery.cookie',
		'validation' : 'validation/jquery.validationEngine',
	}
};
function _require(_self_config,id,callback){
	if(window.bi_timeout){
		for(var i = 0,n=bi_timeout.length;i<n;i++){
			clearTimeout(bi_timeout[i]);
		}
		window.bi_timeout = [];
	}
	if(window.bi_interval){
		for(var i = 0,n=bi_interval.length;i<n;i++){
			clearInterval(bi_interval[i]);
		}
		window.bi_interval = [];
	}
	require.config($.extend(true,{},config,_self_config));
	require([id],function(req){
		var paths = Object.keys(_self_config.paths);
		$.each(paths,function(i,v){
			require.undef(v);
		});
		callback?callback.call(this,req):'';
	});
}