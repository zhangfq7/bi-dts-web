define(['view/box'],
	function(Box) {
		var Layout = {};

		Layout.control = {
			init: function() {
				Layout.view.init();
			},
            resize:function () {
                if(window.myLayout){
                    window.myLayout.resizeAll();
                }
            }
		};

		Layout.view = {
			init: function() {
				//初始化布局,将布局对象挂载到全局上
				window.myLayout = jQuery('body').layout(Layout.module.config);
			}
		};

		Layout.module = {
			config: {
				north: {
					size: 120,
					spacing_open: 0,
					spacing_closed: 0
				},
                west: {
                    spacing_open: 4,
                    spacing_closed: 0,
                    minSize: 180
                },
				center: {
					children: {
						inset: {
							top: 0,
							bottom: 0,
							left: 0,
							right: 0
						},
						center: {
                            border:false
						},
                        north: {
                            spacing_open: 0,
                            spacing_closed: 0,
                            showOverflowOnHover:true,
                            bi_hoverAuto:true
                        }
					}
				}
			}
		};
		return Layout.control;
	});