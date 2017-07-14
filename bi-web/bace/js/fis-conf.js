//执行编译命令fis3 release -d ../plugins

// 是否md5加密
var useHashFlag = true;
//引入node文件操作模块
var fs = require('fs');
var path = require('path');

//删除原有的plugins文件夹
deleteFolderRecursive('../plugins');

//需要打包的js
var jsArray = [ 'jquery/jquery-1.11.2.min.js', 
            'jquery-ui/jquery-ui.js',
            'flat-ui/flat-ui.js', 
            'bootstrap-tagsinput/bootstrap-tagsinput.min.js',
            'datetimepicker/js/bootstrap-datetimepicker.js',
            'dialog/js/bootstrap-dialog.js',
            'bootstrap-switch/bootstrap-switch.js',
            'chosen/chosen.ajax.jquery.js',
            'icheck/icheck.js',
            'jquery.daterange/jquery.daterange.js',
            'jquery.dotdotdot/jquery.dotdotdot.js',
            'jCrop/jquery.Jcrop.js',
            'jqGrid/js/jquery.jqGrid.js',
            'pagination/jquery.pagination.js',
            'poshytip/jquery.poshytip.js',
            'validation/jquery.validationEngine.js',
            'ztree/js/jquery.ztree.all-3.5.js',
            'spin/spin.js' ];

//需要打包的css
var cssArray = [ 'jquery-ui.css',
                 'font-awesome.min.css',
                 'font-awesome-animation.min.css',
                 'bootstrap-tagsinput.css',
                 'bootstrap-datetimepicker.css',
                 'bootstrap-dialog.css', 
                 'bootstrap-switch.css', 
                 'chosen.css',
                 'jquery.Jcrop.css', 
                 'ui.jqgrid-bootstrap.css', 
                 'jquery.pagination.css',
                 'validationEngine.jquery.css', 
                 'zTreeStyle.css' ];

//压缩js，css，图片
fis.match('*.js', {
	// fis-optimizer-uglify-js
	optimizer : fis.plugin('uglify-js')
});
fis.match('*.css', {
	// fis-optimizer-clean-css
	optimizer : fis.plugin('clean-css')
});
fis.match('*.png', {
	// fis-optimizer-png-compressor
	optimizer : fis.plugin('png-compressor')
});
fis.match('*.{js,css,png,gif}', {
	useHash : useHashFlag
});
//icheck图片守主题文件影响，排除
fis.match('minimal/*.png', {
	useHash : false
});

//npm install -g fis3-postpackager-loader
//将所有js文件合并sa-plugins.js
//所有css文件合并sa-plugins.css
fis.match('::package', {
	postpackager : fis.plugin('loader'),
	packager : fis.plugin('map', {
		'/sa-plugins.js' : jsArray,
		'/sa-plugins.css' : cssArray
	})
});

// 把所有的图片抽出来放到一个文件夹里，路径会自动更改
fis.match('*.{png,gif,eot,svg,ttf,woff,woff2,otf}', {
	release : '/images/$0',
	url : 'images/$0'
});

// node 脚本删除打包后的不需要的文件(只要sa-plugins.js,sa-plugins.css,images三个文件)

//监听plugins文件夹是否生成
var fsWatcher = fs.watch('..');//上一级目录
fsWatcher.on('change', function(event, filename) {
	//plugins文件发生改变
	if(filename == 'plugins'){
		fsWatcher.close();
		fs.readdir('../plugins/', function (err, files) {
	        if(err) {
	            console.error(err);
	            return;
	        } else {
	        	//遍历plugins文件下所有文件
	            files.forEach(function (file) {
	                    
	            	var filePath = path.normalize('../plugins/' + file);
	            	
	                fs.stat(filePath, function (err, stat) {
	                	
	                	//如果是文件
	                     if(stat.isFile()) {
	                    	 if(file.indexOf('sa-plugins')!=0){
	                    		 fs.unlink(filePath, function(err){ 
	                    			 if(err){
	                    				 console.log("删除"+file+"失败！")
	                    			 }
	                    		 });
	                    	 }else if(useHashFlag){ //如果是生产环境
	                    		 //获取js，css名称
	                    		 if(file.indexOf('js')!= -1){
	                    			//获取bottom.ftl并更改sa-plugins.js的路径
		                    		 fs.readFile('../../../../../../bi-web-platform/src/main/webapp/view/platform/frame/bace/bottom.ftl',{flag: 'r+', encoding: 'utf8'}, function(err,data){
		                    				var data2 = data.replace('<script src="${resPath}/bace/plugins/sa-plugins.js"></script>','<script src="${resPath}/bace/plugins/'+file+'"></script>');
		                    				var ws = fs.createWriteStream('../../../../../../bi-web-platform/src/main/webapp/view/platform/frame/bace/bottom.ftl', {start: 0});
		                    				var buffer = new Buffer(data2);
		                    				 ws.write(buffer, 'utf8', function (err, buffer) {
		                    					 if(!err && (data2 != data)){
		                    						 console.log('bottom.ftl替换成功！！！');
		                    					 }else{
		                    						 console.log('bottom.ftl替换失败！！！');
		                    					 }
		                    				 });
		                    		 });
	                    		 }else{
	                    			//获取top.ftl并更改sa-plugins.css的路径
		                    		 fs.readFile('../../../../../../bi-web-platform/src/main/webapp/view/platform/frame/bace/top.ftl',{flag: 'r+', encoding: 'utf8'}, function(err,data){
		                    				var data2 = data.replace('<link rel="stylesheet" href="${resPath}/bace/plugins/sa-plugins.css" />','<link rel="stylesheet" href="${resPath}/bace/plugins/'+file+'" />');
		                    				var ws = fs.createWriteStream('../../../../../../bi-web-platform/src/main/webapp/view/platform/frame/bace/top.ftl', {start: 0});
		                    				var buffer = new Buffer(data2);
		                    				 ws.write(buffer, 'utf8', function (err, buffer) {
		                    					 if(!err && (data2 != data)){
		                    						 console.log('top.ftl替换成功！！！');
		                    					 }else{
		                    						 console.log('top.ftl替换失败！！！');
		                    					 }
		                    				 });
		                    		 });
	                    		 }
	                    		
	                    	 }
		                 }
	                     //如果不是images文件夹，则直接删除
		                 if(stat.isDirectory() && file != 'images') {
		                    deleteFolderRecursive(filePath);
		                 }
	                });
	            	
	            });
	     }
	 });
	}
});

/**
 * 遍历删除文件夹下所有内容
 * @param path 文件夹路径
 */
function deleteFolderRecursive(path) {

    var files = [];

    if( fs.existsSync(path) ) {

        files = fs.readdirSync(path);

        files.forEach(function(file,index){

            var curPath = path + "/" + file;
            
            if(fs.statSync(curPath).isDirectory()) { // recurse

                deleteFolderRecursive(curPath);

            } else { // delete file

                fs.unlinkSync(curPath);

            }

        });
        fs.rmdirSync(path);
    }
};
