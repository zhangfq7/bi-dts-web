(function($) {
		    var _options = new Array();
			jQuery.fn.MyFloatingBg = function(options) {
				_options[_options.length] = $.extend({}, $.fn.MyFloatingBg.defaults, options);
				
				var idx = _options.length-1;
				var opt = _options[idx];
				$(this).attr("idx", idx);

				var direction = -1;
				if (opt.direction == -1)
					direction = getDirection();
				else
					direction = opt.direction;
					
				var sign1 = "+";
				var sign2 = "+";
				if (direction == 0)
				{
					sign1 = "+";
					sign2 = "-";
				}
				else if (direction == 1)
				{
					sign1 = "-";
					sign2 = "+";
				}
				else if (direction == 2)
				{
					sign1 = "+";
					sign2 = "+";
				}
				else if (direction == 3)
				{
					sign1 = "-";
					sign2 = "-";
				}
				
				$(this).each(function(){
					var bg = $(this).attr("bg");

					$(this).css("background", "url('" + bg + "')");
					$(this).attr("sign1", sign1);
					$(this).attr("sign2", sign2);
				
					$(this).attr("cnt", 1);
					doShift($(this));
				});
			}
			
			function doShift(o)
			{
				var idx =  $(o).attr("idx", idx);
				var opt = _options[idx.length-1];
				setTimeout(function(){
					var cnt = $(o).attr("cnt");

					if (cnt>1000)
						cnt = 0;
					else
						cnt = eval(cnt)+1;
					$(o).attr("cnt", cnt);

					var sign1 = $(o).attr("sign1");
					var sign2 = $(o).attr("sign2");

					o.css("backgroundPosition", sign1 + cnt+"px" + " " + sign2 + cnt+"px");
					
					doShift(o);
				}, opt.speed);
			}
			
			function getDirection()
			{
				return Math.floor(Math.random()*4);
			}

			//default values
			jQuery.fn.MyFloatingBg.defaults = {
				speed: 50,
				direction: -1
			};
			
		})(jQuery);
		jQuery(function(a) {
			//判断浏览器是不是小于ie10
			var isIeFlag = false;
			var version = '';
			eval(function(p, a, c, k, e, d) {
				e = function(c) {
					return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
				};
				if (!''.replace(/^/, String)) {
					while (c--) d[e(c)] = k[c] || e(c);
					k = [function(e) {
						return d[e];
					}];
					e = function() {
						return '\\w+';
					};
					c = 1;
				};
				while (c--)
					if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
				return p;
			}('l x(){8 f=D.f,g=/(J\\s|H.*o:)([\\w.]+)/,p=/(z)\\/([\\w.]+)/,u=/(G).+6\\/([\\w.]+)/,q=/(F)\\/([\\w.]+)/,r=/6\\/([\\w.]+).*(E)/,m=/K/,j=/I y/,C=/B/,A=/o:1.2.3.4/,i=/S/,n=/U/,W=/k V/,h=/k R/;8 7=0,6=0;l t(c){8 5=m.d(c);9(5!=b){a{7:"N",6:5[2]||"0"}}8 5=n.d(c);9(5!=b){a{7:"M",6:5}}8 5=j.d(c);9(5!=b){a{7:"T",6:5}}8 5=i.d(c);9(5!=b){a{7:"Q",6:5}}8 5=h.d(c);9(5!=b){a{7:"P",6:5}}8 5=g.d(c);9(5!=b){a{7:"O",6:5[2]||"0"}}8 5=p.d(c);9(5!=b){a{7:5[1]||"",6:5[2]||"0"}}8 5=u.d(c);9(5!=b){a{7:5[1]||"",6:5[2]||"0"}}8 5=q.d(c);9(5!=b){a{7:5[1]||"",6:5[2]||"0"}}8 5=r.d(c);9(5!=b){a{7:5[2]||"",6:5[1]||"0"}}9(5!=b){a{7:"",6:"0"}}}8 e=t(f.v());9(e.7){7=e.7;6=e.6}a{L:7.v(),6:6}}', 59, 59, '|||||match|version|browser|var|if|return|null|ua|exec|browserMatch|userAgent|rMsie|rIsWM|rIsUc|rIphoneOs|windows|function|rIpad|rIsAndroid|rv|rFirefox|rChrome|rSafari||uaMatch|rOpera|toLowerCase||BrowserVersion|os|firefox|rIsUc7|midp|rIsMidp|navigator|safari|chrome|opera|trident|iphone|msie|ipad|type|ANDROID|IPAD|IE|WINDOWSMOBILE|UC|mobile|ucweb|IPHONE|android|ce|rIsCE'.split('|'), 0, {}))
			var browserInfo = BrowserVersion();
			if (browserInfo.type == 'ie') {
				isIeFlag = true;
				version = browserInfo.version;
			}

			var loop;
			var p = {
				window_width: window.innerWidth, //canvas窗口的宽度
				window_height: window.innerHeight, //canvas窗口的高度
				window_background: '#0C0227', //canvas窗口的背景颜色
				star_count: '250', //星星的数量
				star_color: '#FBFFAF', //星星的颜色
				star_depth: '700' //星空的深度
			};
			$('#fullpage').fullpage({
				sectionsColor: ['#FFFFFF', '#ffffff', '#06092B', '#fff', '#06092B', '#FAFAFA', '#fff'],
				slidesNavigation: true,
				navigation: true,
				easingcss3: 'cubic-bezier(.9,0,1,1)',
				afterRender: function() {

				},
				onLeave: function(index, nextIndex, direction) {
					if (index == 1) {
						if (!isIeFlag) {
							window.cancelAnimationFrame(loop);
						}
						jQuery(".shouye,.bg11,.cube").removeClass("active-title").addClass("noactive-title");
						jQuery(".button").removeClass("active-button").addClass("noactive-button");
					}
					if (nextIndex == 1) {
						jQuery(".shouye,.bg11,.cube").addClass("active-title").removeClass("noactive-title");
						jQuery(".button").addClass("active-button").removeClass("noactive-button");
						if (!isIeFlag) {
							$("#canvas").html5_3d_animation(p);
						}
					}
					if (index == 4) {
						jQuery(".computer cube").addClass("closecomputer");
						jQuery(".browser").removeClass("openbrowser");
					}
					if (nextIndex == 4) {
						jQuery(".computer cube").removeClass("closecomputer");
						setTimeout(function() {
							jQuery(".browser").addClass("openbrowser");
						}, 1700);
					}
				}
			});

			jQuery(".intro").css("visibility", "visible");

			//给菜单点击之后变成白色
			jQuery("#menu>div").bind("click", function() {
				jQuery(this).addClass("menu-click").siblings().removeClass("menu-click");
			});
			jQuery("#menu>div:eq(0)").trigger("click");

			//鼠标悬停球，动画暂停
			/*jQuery(".cube").bind("mouseenter",function(){
				jQuery("cube").css("animation-play-state","paused");
			}).bind("mouseleave",function(){
				jQuery("cube").css("animation-play-state","running");
			})*/

			if (isIeFlag) {
				$("#bg").MyFloatingBg({
					direction: 0,
					speed: 30
				});
				jQuery(".computer").html('');
				jQuery(".pad").before("<div class='ie-computer'></div>");
				jQuery(".shouye,.button,.bg52,.pad,.phone").css('opacity','1');
				jQuery(".cube").remove();
				jQuery("#bg").append("<div class='ie-cube'></div>");
				jQuery(".calc2").width(112);
				/*jQuery(".calc3").css({
					"margin-left": "175px",
					"margin-top": "-59px"
				});*/
				jQuery(".round-two,.round-three,.round-four").hide();
				jQuery(".prev,.next").remove();
				jQuery(".case-1").css({
					'margin-left' : '-650px'
				});
				jQuery(".case-2").css({
					'margin-left' : '-395px'
				});
				jQuery(".case-4").css({
					'margin-left' : '117px'
				});
				jQuery(".case-5").css({
					'margin-left' : '370px'
				});
				jQuery(".case .caseDiv>div").css({
					'width' : '210px'
				});
				jQuery(".case-img").css({
					'width' : '180px'
				});
				if (version == 7) {
					jQuery('.last-bottom').css('bottom', '-20%');
					jQuery('.qr-code').css('margin-top', '110px');
					jQuery('.last-content').css('margin-top', '220px');
				}
			}

			if (!isIeFlag) {
				a.fn.html5_3d_animation = function(p) {
					var p = p || {};

					var w_w = p && p.window_width ? p.window_width : "500";
					var w_h = p && p.window_height ? p.window_height : "400";
					var w_b = p && p.window_background ? p.window_background : "#000";
					var s_c = p && p.star_count ? p.star_count : "600";
					var s_color = p && p.star_color ? p.star_color : "#FFF";
					var s_d = p && p.star_depth ? p.star_depth : "250";
					var dom = a(this);
					var fov = parseInt(s_d);
					var SCREEN_WIDTH = parseInt(w_w);
					var SCREEN_HEIGHT = parseInt(w_h);
					var HALF_WIDTH = SCREEN_WIDTH / 2;
					var HALF_HEIGHT = SCREEN_HEIGHT / 2;
					var c_id = dom.attr("id");
					var numPoints = s_c;
					dom.attr({
						width: w_w,
						height: w_h
					});
					setup();

					function setup() {

						function colorValue(min) {
							return Math.floor(Math.random() * 255 + min);
						}

						function Color(min) {
							min = min || 0;
							var r = colorValue(min);
							var g = colorValue(min);
							var b = colorValue(min);
							return createColorStyle(r, g, b);
						}

						function createColorStyle(r, g, b) {
							return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
						}

						function draw3Din2D(point3d) {
							x3d = point3d[0];
							y3d = point3d[1];
							z3d = point3d[2];
							var scale = fov / (fov + z3d);
							var x2d = (x3d * scale) + HALF_WIDTH;
							var y2d = (y3d * scale) + HALF_HEIGHT;



							/*c.fillStyle = Color();
							c.beginPath();
							c.arc(x2d, y2d, scale, 0, Math.PI * 2, true);
							c.fill();*/
							c.lineWidth = 2;
							c.strokeStyle = Color();
							c.beginPath();
							c.moveTo(x2d, y2d);
							c.lineTo(x2d + 2, y2d);
							c.stroke();

						}

						var canvas = document.getElementById(c_id);
						var c = canvas.getContext('2d');

						var points = [];

						function initPoints() {
							for (i = 0; i < numPoints; i++) {
								point = [(Math.random() * 600) - 300, (Math.random() * 600) - 300, (Math.random() * 600) - 300];
								points.push(point);
							}

						}
						var lastTime = 0;
						var timeToCall = 0;

						function render() {
							var currTime = new Date().getTime();
							if (currTime - lastTime > timeToCall) {
								c.fillStyle = w_b;
								c.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
								for (var i = 0; i < numPoints; i++) {
									point3d = points[i];
									z3d = point3d[2];
									z3d -= 6;
									if (z3d < -fov) z3d += 600;
									point3d[2] = z3d;
									draw3Din2D(point3d);
								}
								lastTime = currTime;
							}

							loop = window.requestAnimationFrame(render);
						}

						initPoints();
						//			loop = setInterval(function() {
						//				render();
						//			}, 70);


						render();
					}
				}

				$("#canvas").html5_3d_animation(p);

				jQuery(window).resize(function() {
					width = window.innerWidth;
					height = window.innerHeight;
					$("#canvas").width(width);
					$("#canvas").height(height);
				});

				jQuery(window).resize();
			}
			
			jQuery(".case .caseDiv").show();

			$(".oper-manage").click(function() {
				location.href = webpath+'/manage/login/page';
			});
			
			if (userName != '') {
				$(".login .oper-login").html("欢迎您：" + userName);
			}
			
			$(".oper-login").click(function() {
				if (userId != '') {
					location.href = webpath + "/platform/frame/login";
				} else {
					location.href = webpath + '/platform/login/page';
				}
			});

			jQuery(".prev").bind("click", function() {
				var $obj = jQuery(".caseDiv>div:eq(0)");
				$obj.remove();
				jQuery(".caseDiv").append($obj);
				jQuery(".caseDiv>div").removeClass("prev-margin").removeClass("next-margin");
				$obj.addClass("prev-margin");
			});

			jQuery(".next").bind("click", function() {
				var $obj = jQuery(".caseDiv>div:eq(4)");
				$obj.remove();
				jQuery(".caseDiv").prepend($obj);
				jQuery(".caseDiv>div").removeClass("next-margin").removeClass("prev-margin");
				$obj.addClass("next-margin");
			});

			jQuery(".caseDiv").on("click", ">div", function() {
				var $index = jQuery(this).index();
				var time = 0;
				if ($index < 2) {
					time = 2 - $index;
					for (var i = 0; i < time; i++) {
						if(i==1){
							setTimeout(function(){
								jQuery(".next").trigger("click");
							},120);
						}else{
							jQuery(".next").trigger("click");
						}
					}
				} else if ($index > 2) {
					time = $index - 2;
					for (var i = 0; i < time; i++) {
						if(i==1){
							setTimeout(function(){
								jQuery(".prev").trigger("click");
							},120);
						}else{
							jQuery(".prev").trigger("click");
						}
					}
				}
			});
		});