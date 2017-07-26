/*!
 * 
 * @author zhump
bootstrap-datetimepicker extend
By jQuery 1.4+

Version 1.0.0
If you have questions, please email me at 695004175@qq.com
*/
;
(function() {
	var methods = {
		init: function() {
			var setting = {
				startValue:'',
				endValue:'',
				start:{},
				end:{},
				changeStart:function(){},
				changeEnd:function(){},
				onhide:function(){}
			};
			setting = $.extend(true, {}, setting, arguments[0]);
			var temp = '<div class="inputGroup">' +
							'<input class="data-input  date-start-input" readonly placeholder="起始时间"/>' +
							'<input class="data-input  date-end-input" readonly placeholder="结束时间"/>' +
					    	'<div class="date-button primary"><span>确定</span></div> ' +
							'<div class="date-button rest"><span>清空</span></div>' +
						'</div>' +
						'<div class="dataGroup">' +
							'<div class="date-start"></div>' +
							'<div class="date-end"></div>' +
						'</div>';
			var format = setting.format||'YYYY-MM-DD';
			var panelHeight = format.match(/hh|HH|mm|ms|ss/g)?'350px':'320px';	
			var rangeId = "range" + new Date().getTime();
			var $rangePanel = jQuery('<div></div>', {
				"class": "bi-daterange  bootstrap-datetimepicker-widget  dropdown-menu",
				"style": "display:none;width:550px;height:"+panelHeight+";top:35px",
				"id": rangeId
			}).append(temp);
			
			var $this = $(this);
			$this.prop("readonly",true).after($rangePanel);
			
			
			
			var $dateStartPanel= $rangePanel.find(".date-start");
			var $dateEndPanel= $rangePanel.find(".date-end");
			
			var startSetting = $.extend(true,{
				useCurrent: false,
				inline: true,
				format: format
			}, setting.start);
			
			$dateStartPanel.datetimepicker(startSetting);
			var endSetting = $.extend(true,{
				useCurrent: false,
				inline: true,
				format: format
			}, setting.end);
			$dateEndPanel.datetimepicker(endSetting);
			
			
			var $dataStartInput = $rangePanel.find("input.date-start-input");
			var $dataEndInput = $rangePanel.find("input.date-end-input");

			var dataStartVlaue = setting.startValue || moment().format(format);
			var dataEndVlaue = setting.endValue || moment().format(format);
			
			if(format.indexOf('d')>-1||format.indexOf('D')>-1){
				dataEndVlaue = moment(dataEndVlaue,format).add(1, 'month').format(format);
			}


			$dataStartInput.val(dataStartVlaue);
			$dataEndInput.val(dataEndVlaue);
			
			$this.data('startDate',dataStartVlaue);
			$this.data('endDate',dataEndVlaue);

			$dateStartPanel.data("DateTimePicker").date(dataStartVlaue);
			$dateEndPanel.data("DateTimePicker").date(dataEndVlaue);

			$dateStartPanel.on("dp.change", function(e) {
				var format = jQuery(this).data("DateTimePicker").format();
				var startMM = e.date.format('x');
				var endMM = moment($this.data('endDate'),format).format('x');
				
				setting.changeStart(e,$this.data('endDate'),$dateEndPanel.data("DateTimePicker"),$dateStartPanel.data("DateTimePicker"));
				
				if(startMM>endMM){
					$dateEndPanel.data("DateTimePicker").date(e.date);
					$this.data("endDate", e.date.format(format));
				}
				$dataStartInput.val(e.date.format(format));
				$this.data("startDate", e.date.format(format));				
			});
			
			$dateEndPanel.on("dp.change", function(e) {
				var format = jQuery(this).data("DateTimePicker").format();
				var endMM = e.date.format('x');
				var startMM = moment($this.data('startDate'),format).format('x');
				if(startMM > endMM){
					$dateStartPanel.data("DateTimePicker").date(e.date);
					$this.data("startDate", e.date.format(format));
				}
				$dataEndInput.val(e.date.format(format));
				$this.data("endDate", e.date.format(format));
				
				setting.changeEnd($dateStartPanel.data("DateTimePicker"),e);
			});

			//获取焦点时显示
			$this.on("focus", function() {
				setTimeout(function() {
					showMenu();
				}, 0)
			})

			$rangePanel.on("click",".primary",function(event){
				hideMenu();
			})

			$rangePanel.on("click",".rest",function(){
				$this.val("");
				$dataStartInput.val("");
				$dataEndInput.val("");
				$this.data("startDate","");
				$this.data("endDate","");
			})
			
			function saveValue(){
				var startDate = $dataStartInput.val();
				var endDate = $dataEndInput.val();
				var time = "";
				if(startDate == endDate){
					time = startDate;
				}else{
					time = startDate+"   ~   "+endDate;
				}
				if(startDate&&endDate){
					$this.val(time);
					$this.data("startDate",startDate);
					$this.data("endDate",endDate);
					
				}else{
					$this.val("");
				}
			}
			
			function showMenu() {
				$rangePanel.show();
				$("body").on("mousedown", onBodyDown);
			}

			function hideMenu() {
				if(!$("#" + rangeId).is(":hidden")){
					saveValue();
					$("#" + rangeId).fadeOut("fast",function(){
						setting.onhide.call($this);
					});
				}
			}

			//绑定隐藏事件，排除已方元素
			function onBodyDown(event) {
				if (!(event.target.id == $this.attr("id") ||
						event.target.id == rangeId ||
						$(event.target).parents("#" + rangeId).length > 0)) { 
					hideMenu();
					event.stopImmediatePropagation()
				}
			}
			this.data("rangeId", rangeId);
			return this;
		},
		getDate: function() {
			var data = $(this).data();
			return {
				startDate:data.startDate||'',
				endDate:data.endDate||''
			}
		},
		//销毁
		destroy: function() {}
	};

	$.fn.dateRange = function() {
		var method = arguments[0];
		if (methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if (typeof(method) == 'object' || !method) {
			method = methods.init;
		} else {
			console.error('Method ' + method + ' does not exist on jQuery.bzTree');
			return this;
		}
		return method.apply(this, arguments);
	}
})(jQuery);