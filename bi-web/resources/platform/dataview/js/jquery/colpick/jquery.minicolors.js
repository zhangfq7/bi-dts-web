(function(a){if(typeof define==="function"&&define.amd&&!jQuery){define(["jquery"],a)}else{if(typeof exports==="object"){module.exports=a(require("jquery"))}else{a(jQuery)}}}(function(f){f.minicolors={defaults:{animationSpeed:50,animationEasing:"swing",change:null,changeDelay:0,control:"hue",dataUris:true,defaultValue:"",format:"hex",hide:null,hideSpeed:100,inline:false,keywords:"",letterCase:"lowercase",opacity:false,position:"bottom left",show:null,showSpeed:100,colorSelectors:null,theme:"default"}};f.extend(f.fn,{minicolors:function(A,z){switch(A){case"destroy":f(this).each(function(){y(f(this))});return f(this);case"hide":l();return f(this);case"opacity":if(z===undefined){return f(this).attr("data-opacity")}else{f(this).each(function(){b(f(this).attr("data-opacity",z))})}return f(this);case"rgbObject":return j(f(this),A==="rgbaObject");case"rgbString":case"rgbaString":return k(f(this),A==="rgbaString");case"settings":if(z===undefined){return f(this).data("minicolors-settings")}else{f(this).each(function(){var B=f(this).data("minicolors-settings")||{};y(f(this));f(this).minicolors(f.extend(true,B,z))})}return f(this);case"show":x(f(this).eq(0));return f(this);case"value":if(z===undefined){return f(this).val()}else{f(this).each(function(){if(typeof(z)==="object"){if(z.opacity){f(this).attr("data-opacity",q(z.opacity,0,1))}if(z.color){f(this).val(z.color)}}else{f(this).val(z)}b(f(this))})}return f(this);default:if(A!=="create"){z=A}f(this).each(function(){u(f(this),z)});return f(this)}}});function u(J,C){var E=f('<div class="minicolors" />'),D=f.minicolors.defaults,L=J.attr("data-format"),F=J.attr("data-keywords"),H=J.attr("data-opacity");if(J.data("minicolors-initialized")){return}C=f.extend(true,{},D,C);E.addClass("minicolors-theme-"+C.theme).toggleClass("minicolors-with-opacity",C.opacity).toggleClass("minicolors-no-data-uris",C.dataUris!==true);var I=J.attr("data-position")||"";if(I){f.each(I.split(" "),function(){E.addClass("minicolors-position-"+this)})}if(L==="rgb"){$input_size=H?"25":"20"}else{$input_size=F?"11":"7"}J.addClass("minicolors-input").data("minicolors-initialized",false).data("minicolors-settings",C).prop("size",$input_size).wrap(E).after('<div class="minicolors-panel minicolors-slider-'+C.control+'"><div class="minicolors-slider minicolors-sprite"><div class="minicolors-picker"></div></div><div class="minicolors-opacity-slider minicolors-sprite"><div class="minicolors-picker"></div></div><div class="minicolors-grid minicolors-sprite"><div class="minicolors-grid-inner"></div><div class="minicolors-picker"><div></div></div></div><div class="colorpicker-selectors"></div><div class="colorpicker-close">确认</div></div>');if(!C.inline){J.after('<span class="minicolors-swatch minicolors-sprite"><span class="minicolors-swatch-color"></span></span>');J.next(".minicolors-swatch").on("click",function(M){M.preventDefault();J.focus()})}J.parent().find(".minicolors-panel").on("selectstart",function(){return false}).end();if(C.inline){J.parent().addClass("minicolors-inline")}b(J,false);J.data("minicolors-initialized",true);if(C.colorSelectors){var z=J.parent().find(".colorpicker-selectors").show();J.parent().find(".minicolors-panel").height("174px");f.each(C.colorSelectors,function(N,M){var O=f("<i />").css("background-color",M);O.click(function(){J.minicolors("value",{color:M,opacity:1})});z.append(O)});var K=f("<i />").addClass("transparent");var G=f("<i />").addClass("white");K.click(function(){J.minicolors("opacity",0);J.val("rgba(225,225,225,0)")});G.click(function(){J.minicolors("value",{color:"#fff",opacity:1})});z.append(K,G)}var A=J.attr("data-position")||"";var B=parseInt(A.replace(/top|bottom|left|right/g,""))||0;if(A.indexOf("left-")){J.parent().find(".minicolors-panel").css("left",B+"px")}J.parent().find(".colorpicker-close").click(function(){J.minicolors("hide")})}function y(z){var A=z.parent();z.removeData("minicolors-initialized").removeData("minicolors-settings").removeProp("size").removeClass("minicolors-input");A.before(z).remove()}function x(A){var C=A.parent(),z=C.find(".minicolors-panel"),B=A.data("minicolors-settings");if(!A.data("minicolors-initialized")||A.prop("disabled")||C.hasClass("minicolors-inline")||C.hasClass("minicolors-focus")){return}l();C.addClass("minicolors-focus");z.stop(true,true).fadeIn(B.showSpeed,function(){if(B.show){B.show.call(A.get(0))}})}function l(){f(".minicolors-focus").each(function(){var C=f(this),A=C.find(".minicolors-input"),z=C.find(".minicolors-panel"),B=A.data("minicolors-settings");z.fadeOut(B.hideSpeed,function(){if(B.hide){B.hide.call(A.get(0))}C.removeClass("minicolors-focus")})})}function s(K,A,B){var N=K.parents(".minicolors").find(".minicolors-input"),C=N.data("minicolors-settings"),I=K.find("[class$=-picker]"),H=K.offset().left,G=K.offset().top,M=Math.round(A.pageX-H),L=Math.round(A.pageY-G),E=B?C.animationSpeed:0,F,D,z,J;if(A.originalEvent.changedTouches){M=A.originalEvent.changedTouches[0].pageX-H;L=A.originalEvent.changedTouches[0].pageY-G}if(M<0){M=0}if(L<0){L=0}if(M>K.width()){M=K.width()}if(L>K.height()){L=K.height()}if(K.parent().is(".minicolors-slider-wheel")&&I.parent().is(".minicolors-grid")){F=75-M;D=75-L;z=Math.sqrt(F*F+D*D);J=Math.atan2(D,F);if(J<0){J+=Math.PI*2}if(z>75){z=75;M=75-(75*Math.cos(J));L=75-(75*Math.sin(J))}M=Math.round(M);L=Math.round(L)}if(K.is(".minicolors-grid")){I.stop(true).animate({top:L+"px",left:M+"px"},E,C.animationEasing,function(){i(N,K)})}else{I.stop(true).animate({top:L+"px"},E,C.animationEasing,function(){i(N,K)})}}function i(R,Z){function V(ab,aa){var ad,ac;if(!ab.length||!aa){return null}ad=ab.offset().left;ac=ab.offset().top;return{x:ad-aa.offset().left+(ab.outerWidth()/2),y:ac-aa.offset().top+(ab.outerHeight()/2)}}var H,I,Y,P,O,S,E,L=R.val(),W=R.attr("data-format"),N=R.attr("data-keywords"),F=R.attr("data-opacity"),G=R.parent(),X=R.data("minicolors-settings"),T=G.find(".minicolors-swatch"),z=G.find(".minicolors-grid"),U=G.find(".minicolors-slider"),K=G.find(".minicolors-opacity-slider"),J=z.find("[class$=-picker]"),Q=U.find("[class$=-picker]"),D=K.find("[class$=-picker]"),C=V(J,z),B=V(Q,U),M=V(D,K);if(Z.is(".minicolors-grid, .minicolors-slider, .minicolors-opacity-slider")){switch(X.control){case"wheel":P=(z.width()/2)-C.x;O=(z.height()/2)-C.y;S=Math.sqrt(P*P+O*O);E=Math.atan2(O,P);if(E<0){E+=Math.PI*2}if(S>75){S=75;C.x=69-(75*Math.cos(E));C.y=69-(75*Math.sin(E))}I=q(S/0.75,0,100);H=q(E*180/Math.PI,0,360);Y=q(100-Math.floor(B.y*(100/U.height())),0,100);L=c({h:H,s:I,b:Y});U.css("backgroundColor",c({h:H,s:I,b:100}));break;case"saturation":H=q(parseInt(C.x*(360/z.width()),10),0,360);I=q(100-Math.floor(B.y*(100/U.height())),0,100);Y=q(100-Math.floor(C.y*(100/z.height())),0,100);L=c({h:H,s:I,b:Y});U.css("backgroundColor",c({h:H,s:100,b:Y}));G.find(".minicolors-grid-inner").css("opacity",I/100);break;case"brightness":H=q(parseInt(C.x*(360/z.width()),10),0,360);I=q(100-Math.floor(C.y*(100/z.height())),0,100);Y=q(100-Math.floor(B.y*(100/U.height())),0,100);L=c({h:H,s:I,b:Y});U.css("backgroundColor",c({h:H,s:I,b:100}));G.find(".minicolors-grid-inner").css("opacity",1-(Y/100));break;default:H=q(360-parseInt(B.y*(360/U.height()),10),0,360);I=q(Math.floor(C.x*(100/z.width())),0,100);Y=q(100-Math.floor(C.y*(100/z.height())),0,100);L=c({h:H,s:I,b:Y});z.css("backgroundColor",c({h:H,s:100,b:100}));break}if(X.opacity){F=parseFloat(1-(M.y/K.height())).toFixed(2)}else{F=1}if(X.opacity){R.attr("data-opacity",F)}if(W==="rgb"){var A=r(L),F=R.attr("data-opacity")===""?1:q(parseFloat(R.attr("data-opacity")).toFixed(2),0,1);if(isNaN(F)||!X.opacity){F=1}if(R.minicolors("rgbObject").a<=1&&A&&X.opacity){value="rgba("+A.r+", "+A.g+", "+A.b+", "+parseFloat(F)+")"}else{value="rgb("+A.r+", "+A.g+", "+A.b+")"}}else{value=n(L,X.letterCase)}R.val(value)}T.find("span").css({backgroundColor:L,opacity:F});e(R,value,F)}function b(L,M){var F,O,R=L.attr("data-format"),H=L.attr("data-keywords"),C,J,I,N,B,D=L.parent(),S=L.data("minicolors-settings"),P=D.find(".minicolors-swatch"),z=D.find(".minicolors-grid"),Q=D.find(".minicolors-slider"),G=D.find(".minicolors-opacity-slider"),E=z.find("[class$=-picker]"),K=Q.find("[class$=-picker]"),A=G.find("[class$=-picker]");if(h(L.val())){F=p(L.val());alpha=q(parseFloat(t(L.val())).toFixed(2),0,1);if(alpha){L.attr("data-opacity",alpha)}}else{F=n(v(L.val(),true),S.letterCase)}if(!F){F=n(o(S.defaultValue,true),S.letterCase)}O=d(F);H=!H?[]:f.map(H.split(","),function(T){return f.trim(T.toLowerCase())});if(L.val()!==""&&f.inArray(L.val().toLowerCase(),H)>-1){value=n(L.val())}else{value=h(L.val())?m(L.val()):F}if(!M){L.val(value)}if(S.opacity){C=L.attr("data-opacity")===""?1:q(parseFloat(L.attr("data-opacity")).toFixed(2),0,1);if(isNaN(C)){C=1}L.attr("data-opacity",C);P.find("span").css("opacity",C);I=q(G.height()-(G.height()*C),0,G.height());A.css("top",I+"px")}if(L.val().toLowerCase()==="transparent"){P.find("span").css("opacity",0)}P.find("span").css("backgroundColor",F);switch(S.control){case"wheel":N=q(Math.ceil(O.s*0.75),0,z.height()/2);B=O.h*Math.PI/180;J=q(75-Math.cos(B)*N,0,z.width());I=q(75-Math.sin(B)*N,0,z.height());E.css({top:I+"px",left:J+"px"});I=150-(O.b/(100/z.height()));if(F===""){I=0}K.css("top",I+"px");Q.css("backgroundColor",c({h:O.h,s:O.s,b:100}));break;case"saturation":J=q((5*O.h)/12,0,150);I=q(z.height()-Math.ceil(O.b/(100/z.height())),0,z.height());E.css({top:I+"px",left:J+"px"});I=q(Q.height()-(O.s*(Q.height()/100)),0,Q.height());K.css("top",I+"px");Q.css("backgroundColor",c({h:O.h,s:100,b:O.b}));D.find(".minicolors-grid-inner").css("opacity",O.s/100);break;case"brightness":J=q((5*O.h)/12,0,150);I=q(z.height()-Math.ceil(O.s/(100/z.height())),0,z.height());E.css({top:I+"px",left:J+"px"});I=q(Q.height()-(O.b*(Q.height()/100)),0,Q.height());K.css("top",I+"px");Q.css("backgroundColor",c({h:O.h,s:O.s,b:100}));D.find(".minicolors-grid-inner").css("opacity",1-(O.b/100));break;default:J=q(Math.ceil(O.s/(100/z.width())),0,z.width());I=q(z.height()-Math.ceil(O.b/(100/z.height())),0,z.height());E.css({top:I+"px",left:J+"px"});I=q(Q.height()-(O.h/(360/Q.height())),0,Q.height());K.css("top",I+"px");z.css("backgroundColor",c({h:O.h,s:100,b:100}));break}if(L.data("minicolors-initialized")){e(L,value,C)}}function e(z,D,A){var B=z.data("minicolors-settings"),C=z.data("minicolors-lastChange");if(!C||C.value!==D||C.opacity!==A){z.data("minicolors-lastChange",{value:D,opacity:A});if(B.change){if(B.changeDelay){clearTimeout(z.data("minicolors-changeTimeout"));z.data("minicolors-changeTimeout",setTimeout(function(){B.change.call(z.get(0),D,A)},B.changeDelay))}else{B.change.call(z.get(0),D,A)}}z.trigger("change").trigger("input")}}function j(z){var C=v(f(z).val(),true),B=r(C),A=f(z).attr("data-opacity");if(!B){return null}if(A!==undefined){f.extend(B,{a:parseFloat(A)})}return B}function k(z,D){var C=v(f(z).val(),true),B=r(C),A=f(z).attr("data-opacity");if(!B){return null}if(A===undefined){A=1}if(D){return"rgba("+B.r+", "+B.g+", "+B.b+", "+parseFloat(A)+")"}else{return"rgb("+B.r+", "+B.g+", "+B.b+")"}}function n(z,A){return A==="uppercase"?z.toUpperCase():z.toLowerCase()}function v(z,A){z=z.replace(/^#/g,"");if(!z.match(/^[A-F0-9]{3,6}/ig)){return""}if(z.length!==3&&z.length!==6){return""}if(z.length===3&&A){z=z[0]+z[0]+z[1]+z[1]+z[2]+z[2]}return"#"+z}function m(B,D){var A=B.replace(/[^\d,.]/g,""),C=A.split(","),z;C[0]=q(parseInt(C[0],10),0,255);C[1]=q(parseInt(C[1],10),0,255);C[2]=q(parseInt(C[2],10),0,255);if(C[3]){C[3]=q(parseFloat(C[3],10),0,1)}if(D){return{r:C[0],g:C[1],b:C[2],a:C[3]?C[3]:null}}if(typeof(C[3])!=="undefined"&&C[3]<=1){return"rgba("+C[0]+", "+C[1]+", "+C[2]+", "+C[3]+")"}else{return"rgb("+C[0]+", "+C[1]+", "+C[2]+")"}}function o(z,A){if(h(z)){return m(z)}else{return v(z,A)}}function q(B,A,z){if(B<A){B=A}if(B>z){B=z}return B}function h(z){rgb=z.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);return(rgb&&rgb.length===4)?true:false}function t(z){z=z.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+(\.\d{1,2})?|\.\d{1,2})[\s+]?/i);return(z&&z.length===6)?z[4]:"1"}function w(z){var B={};var F=Math.round(z.h);var E=Math.round(z.s*255/100);var A=Math.round(z.b*255/100);if(E===0){B.r=B.g=B.b=A}else{var G=A;var D=(255-E)*A/255;var C=(G-D)*(F%60)/60;if(F===360){F=0}if(F<60){B.r=G;B.b=D;B.g=D+C}else{if(F<120){B.g=G;B.b=D;B.r=G-C}else{if(F<180){B.g=G;B.r=D;B.b=D+C}else{if(F<240){B.b=G;B.r=D;B.g=G-C}else{if(F<300){B.b=G;B.g=D;B.r=D+C}else{if(F<360){B.r=G;B.g=D;B.b=G-C}else{B.r=0;B.g=0;B.b=0}}}}}}}return{r:Math.round(B.r),g:Math.round(B.g),b:Math.round(B.b)}}function p(z){z=z.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);return(z&&z.length===4)?"#"+("0"+parseInt(z[1],10).toString(16)).slice(-2)+("0"+parseInt(z[2],10).toString(16)).slice(-2)+("0"+parseInt(z[3],10).toString(16)).slice(-2):""}function a(z){var A=[z.r.toString(16),z.g.toString(16),z.b.toString(16)];f.each(A,function(B,C){if(C.length===1){A[B]="0"+C}});return"#"+A.join("")}function c(z){return a(w(z))}function d(A){var z=g(r(A));if(z.s===0){z.h=360}return z}function g(B){var A={h:0,s:0,b:0};var C=Math.min(B.r,B.g,B.b);var z=Math.max(B.r,B.g,B.b);var D=z-C;A.b=z;A.s=z!==0?255*D/z:0;if(A.s!==0){if(B.r===z){A.h=(B.g-B.b)/D}else{if(B.g===z){A.h=2+(B.b-B.r)/D}else{A.h=4+(B.r-B.g)/D}}}else{A.h=-1}A.h*=60;if(A.h<0){A.h+=360}A.s*=100/255;A.b*=100/255;return A}function r(z){z=parseInt(((z.indexOf("#")>-1)?z.substring(1):z),16);return{r:z>>16,g:(z&65280)>>8,b:(z&255)}}f(document).on("mousedown.minicolors touchstart.minicolors",function(z){if(!f(z.target).parents().add(z.target).hasClass("minicolors")){l()}}).on("mousedown.minicolors touchstart.minicolors",".minicolors-grid, .minicolors-slider, .minicolors-opacity-slider",function(z){var A=f(this);z.preventDefault();f(document).data("minicolors-target",A);s(A,z,true)}).on("mousemove.minicolors touchmove.minicolors",function(z){var A=f(document).data("minicolors-target");if(A){s(A,z)}}).on("mouseup.minicolors touchend.minicolors",function(){f(this).removeData("minicolors-target")}).on("mousedown.minicolors touchstart.minicolors",".minicolors-swatch",function(A){var z=f(this).parent().find(".minicolors-input");A.preventDefault();x(z)}).on("focus.minicolors",".minicolors-input",function(){var z=f(this);if(!z.data("minicolors-initialized")){return}x(z)}).on("blur.minicolors",".minicolors-input",function(){var A=f(this),C=A.attr("data-keywords"),D=A.data("minicolors-settings"),E,B,z;if(!A.data("minicolors-initialized")){return}C=!C?[]:f.map(C.split(","),function(F){return f.trim(F.toLowerCase())});if(A.val()!==""&&f.inArray(A.val().toLowerCase(),C)>-1){value=A.val()}else{if(h(A.val())){B=m(A.val(),true)}else{E=v(A.val(),true);B=E?r(E):null}if(B===null){value=D.defaultValue}else{if(D.format==="rgb"){value=D.opacity?m("rgba("+B.r+","+B.g+","+B.b+","+A.attr("data-opacity")+")"):m("rgb("+B.r+","+B.g+","+B.b+")")}else{value=a(B)}}}z=D.opacity?A.attr("data-opacity"):1;if(value.toLowerCase()==="transparent"){z=0}A.closest(".minicolors").find(".minicolors-swatch > span").css("opacity",z);A.val(value);if(A.val()===""){A.val(o(D.defaultValue,true))}A.val(n(A.val(),D.letterCase))}).on("keydown.minicolors",".minicolors-input",function(A){var z=f(this);if(!z.data("minicolors-initialized")){return}switch(A.keyCode){case 9:l();break;case 13:case 27:l();z.blur();break}}).on("keyup.minicolors",".minicolors-input",function(){var z=f(this);if(!z.data("minicolors-initialized")){return}b(z,true)}).on("paste.minicolors",".minicolors-input",function(){var z=f(this);if(!z.data("minicolors-initialized")){return}setTimeout(function(){b(z,true)},1)})}));