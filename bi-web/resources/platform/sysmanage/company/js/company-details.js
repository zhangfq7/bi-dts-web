define(['sabace', 'upload', 'message'], function(sabace, upload, message) {
	var pcnt = jQuery('.preview-container');
	var pimg = jQuery('.preview-container img');
	var xsize = pcnt.width();
	var ysize = pcnt.height();
	var isChecked = false;
	var editFlag = false;
	var options = '';


	function init() {
		pcnt = jQuery('.preview-container');
		pimg = jQuery('.preview-container img');
		xsize = pcnt.width();
		ysize = pcnt.height();
		jQuery('.user-info-rgt').validationEngine({
			autoHidePrompt: true,
			autoHideDelay: 2000,
			binded: true,
			promptPosition: 'bottomLeft',

		});

		//获取今年
		var currentYear = new Date().getFullYear();
		options = '';
		//初始化100年
		for (var year = currentYear; year >= currentYear - 100; year--) {
			options += '<option value="' + year + '">' + year + '</option>';
		}
		jQuery('#select-year').html(options);

		//初始化月
		options = '';
		for (var month = 1; month <= 12; month++) {
			options += '<option value="' + month + '">' + month + '</option>';
		}
		jQuery('#select-month').html(options);

		//初始化日
		options = '';
		for (var day = 1; day <= 31; day++) {
			options += '<option value="' + day + '">' + day + '</option>';
		}
		jQuery('#select-day').html(options);

		var depIdShow = $("#depIdShow").val();
		if (depIdShow == undefined) {
			depIdShow = "";
		}

		//如果已经设置过生日
		if (!sabace.IsEmpty(birthday2)) {
			var year = birthday2.split('-')[0];
			var month = parseInt(birthday2.split('-')[1]);
			var day = parseInt(birthday2.split('-')[2]);
			jQuery('#select-year').val(year);
			jQuery('#select-month').val(month);
			jQuery('#select-day').val(day);

			//设置部门

			$("#add-dep").attr("truevalue", depIdShow);
			$("#add-dep").attr("value", $("#depName").val());
		}

		//如果已经设置过性别
		if (!sabace.IsEmpty(sex2)) {
			if (sex2 == '1') {
				jQuery("#mail").removeClass("fa-square-o");
				jQuery("#mail").addClass("fa-check-square-o");
			} else if (sex2 == '0') {
				jQuery("#femail").removeClass("fa-square-o");
				jQuery("#femail").addClass("fa-check-square-o");
			} else if (sex2 == '9') {
				jQuery("#unknown").removeClass("fa-square-o");
				jQuery("#unknown").addClass("fa-check-square-o");
			}
		}

		//点击checkbox事件的效果
		jQuery('.checkBox').on("click", function() {
			isChecked = jQuery(this).hasClass("fa-square-o");
			jQuery('.checkBox').removeClass("fa-check-square-o");
			jQuery('.checkBox').addClass("fa-square-o");
			if (isChecked) {
				jQuery(this).removeClass("fa-square-o");
				jQuery(this).addClass("fa-check-square-o");
			}
		});
		if (sex2 == "") {
			jQuery("#mail").eq(0).trigger("click");
			editFlag = false;
		} else {
			editFlag = true;
		}
		
		function bytesToSize(bytes) {
			if (bytes === 0) return '0 B';
			var k = 1024,
				sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
				i = Math.floor(Math.log(bytes) / Math.log(k));
			return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + '<span>'+sizes[i]+'</span>';
		}
		var $usedSpace = jQuery("#usedSpace");
		
		$usedSpace.html(bytesToSize($usedSpace.html() * 1024 * 1024))


		$("#add-dep").treeselect({
			height: 200,
			searchAjaxParam: "depName",
			width: 310,
			chkStyle: "radio",
			url: sabace.handleUrlParam('/platform/sysmanage/dept/company-dept')
		});


		$('.chosen-select').chosen({
			disable_search: true
		});

	}


	/**
	 * 计算指定年月的天数
	 */
	function getDays(year, month) {
		//year   四位数的年份，如果取值为0~99之间，则year = year + 1900。  
		//month  取值0~11之间，代表1月到12月。  
		//day    取值1~31之间的天数,某月的第0天，就是前一个月的最后一天。
		//得到前一个月的最后一天
		return new Date(year, month, 0).getDate();
	}



	return {
		init: init,
	}
});