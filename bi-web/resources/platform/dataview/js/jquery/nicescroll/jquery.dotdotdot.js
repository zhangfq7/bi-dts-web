(function(j,d){if(j.fn.dotdotdot){return}j.fn.dotdotdot=function(x){if(this.length==0){j.fn.dotdotdot.debug('No element found for "'+this.selector+'".');return this}if(this.length>1){return this.each(function(){j(this).dotdotdot(x)})}var t=this;if(t.data("dotdotdot")){t.trigger("destroy.dot")}t.data("dotdotdot-style",t.attr("style")||"");t.css("word-wrap","break-word");if(t.css("white-space")==="nowrap"){t.css("white-space","normal")}t.bind_events=function(){t.bind("update.dot",function(A,C){A.preventDefault();A.stopPropagation();v.maxHeight=(typeof v.height=="number")?v.height:q(t);v.maxHeight+=v.tolerance;if(typeof C!="undefined"){if(typeof C=="string"||("nodeType" in C&&C.nodeType===1)){C=j("<div />").append(C).contents()}if(C instanceof j){y=C}}u=t.wrapInner('<div class="dotdotdot" />').children();u.contents().detach().end().append(y.clone(true)).find("br").replaceWith("  <br />  ").end().css({height:"auto",width:"auto",border:"none",padding:0,margin:0});var B=false,z=false;if(s.afterElement){B=s.afterElement.clone(true);B.show();s.afterElement.detach()}if(m(u,v)){if(v.wrap=="children"){z=c(u,v,B)}else{z=o(u,t,u,v,B)}}u.replaceWith(u.contents());u=null;if(j.isFunction(v.callback)){v.callback.call(t[0],z,y)}s.isTruncated=z;return z}).bind("isTruncated.dot",function(A,z){A.preventDefault();A.stopPropagation();if(typeof z=="function"){z.call(t[0],s.isTruncated)}return s.isTruncated}).bind("originalContent.dot",function(A,z){A.preventDefault();A.stopPropagation();if(typeof z=="function"){z.call(t[0],y)}return y}).bind("destroy.dot",function(z){z.preventDefault();z.stopPropagation();t.unwatch().unbind_events().contents().detach().end().append(y).attr("style",t.data("dotdotdot-style")||"").data("dotdotdot",false)});return t};t.unbind_events=function(){t.unbind(".dot");return t};t.watch=function(){t.unwatch();if(v.watch=="window"){var B=j(window),A=B.width(),z=B.height();B.bind("resize.dot"+s.dotId,function(){if(A!=B.width()||z!=B.height()||!v.windowResizeFix){A=B.width();z=B.height();if(r){clearInterval(r)}r=setTimeout(function(){t.trigger("update.dot")},100)}})}else{w=l(t);r=setInterval(function(){if(t.is(":visible")){var C=l(t);if(w.width!=C.width||w.height!=C.height){t.trigger("update.dot");w=C}}},500)}return t};t.unwatch=function(){j(window).unbind("resize.dot"+s.dotId);if(r){clearInterval(r)}return t};var y=t.contents(),v=j.extend(true,{},j.fn.dotdotdot.defaults,x),s={},w={},r=null,u=null;if(!(v.lastCharacter.remove instanceof Array)){v.lastCharacter.remove=j.fn.dotdotdot.defaultArrays.lastCharacter.remove}if(!(v.lastCharacter.noEllipsis instanceof Array)){v.lastCharacter.noEllipsis=j.fn.dotdotdot.defaultArrays.lastCharacter.noEllipsis}s.afterElement=b(v.after,t);s.isTruncated=false;s.dotId=n++;t.data("dotdotdot",true).bind_events().trigger("update.dot");if(v.watch){t.watch()}return t};j.fn.dotdotdot.defaults={ellipsis:"... ",wrap:"word",fallbackToLetter:true,lastCharacter:{},tolerance:0,callback:null,after:null,height:null,watch:false,windowResizeFix:true,line:null};j.fn.dotdotdot.defaultArrays={lastCharacter:{remove:[" ","\u3000",",",";",".","!","?"],noEllipsis:[]}};j.fn.dotdotdot.debug=function(r){};var n=1;function c(u,y,x){var w=u.children(),r=false;u.empty();for(var t=0,s=w.length;t<s;t++){var v=w.eq(t);u.append(v);if(x){u.append(x)}if(m(u,y)){v.remove();r=true;break}else{if(x){x.detach()}}}return r}function o(t,s,z,u,r){if(u.line){var v=s.css("line-height").replace("px","");s.css({"line-height":v/u.line+"px"})}var w=false;var y="a table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, blockquote, select, optgroup, option, textarea, script, style";var x="script, .dotdotdot-keep";t.contents().detach().each(function(){var B=this,A=j(B);s.attr("title",B.data);if(typeof B=="undefined"||(B.nodeType==3&&j.trim(B.data).length==0)){return true}else{if(A.is(x)){t.append(A)}else{if(w){return true}else{t.append(A);if(r&&!A.is(u.after)&&!A.find(u.after).length){t[t.is(y)?"after":"append"](r)}if(m(z,u)){if(B.nodeType==3){w=e(A,s,z,u,r)}else{w=o(A,s,z,u,r)}if(!w){A.detach();w=true}}if(!w){if(r){r.detach()}}}}}});return w}function e(t,v,G,w,s){var D=t[0];if(!D){return false}var z=i(D),r=(z.indexOf(" ")!==-1)?" ":"\u3000",B=(w.wrap=="letter")?"":r,E=z.split(B),A=-1,H=-1,C=0,u=E.length-1;if(w.fallbackToLetter&&C==0&&u==0){B="";E=z.split(B);u=E.length-1}while(C<=u&&!(C==0&&u==0)){var x=Math.floor((C+u)/2);if(x==H){break}H=x;a(D,E.slice(0,H+1).join(B)+w.ellipsis);if(!m(G,w)){A=H;C=H}else{u=H;if(w.fallbackToLetter&&C==0&&u==0){B="";E=E[0].split(B);A=-1;H=-1;C=0;u=E.length-1}}}if(A!=-1&&!(E.length==1&&E[0].length==0)){z=g(E.slice(0,A+1).join(B),w);a(D,z)}else{var y=t.parent();t.detach();var F=(s&&s.closest(y).length)?s.length:0;if(y.contents().length>F){D=f(y.contents().eq(-1-F),v)}else{D=f(y,v,true);if(!F){y.detach()}}if(D){z=g(i(D),w);a(D,z);if(F&&s){j(D).parent().append(s)}}}return true}function m(s,r){return s.innerHeight()>r.maxHeight}function g(r,s){while(j.inArray(r.slice(-1),s.lastCharacter.remove)>-1){r=r.slice(0,-1)}if(j.inArray(r.slice(-1),s.lastCharacter.noEllipsis)<0){r+=s.ellipsis}return r}function l(r){return{width:r.innerWidth(),height:r.innerHeight()}}function a(s,r){if(s.innerText){s.innerText=r}else{if(s.nodeValue){s.nodeValue=r}else{if(s.textContent){s.textContent=r}}}}function i(r){if(r.innerText){return r.innerText}else{if(r.nodeValue){return r.nodeValue}else{if(r.textContent){return r.textContent}else{return""}}}}function k(r){do{r=r.previousSibling}while(r&&r.nodeType!==1&&r.nodeType!==3);return r}function f(s,v,r){var u=s&&s[0],t;if(u){if(!r){if(u.nodeType===3){return u}if(j.trim(s.text())){return f(s.contents().last(),v)}}t=k(u);while(!t){s=s.parent();if(s.is(v)||!s.length){return false}t=k(s[0])}if(t){return f(j(t),v)}}return false}function b(r,s){if(!r){return false}if(typeof r==="string"){r=j(r,s);return(r.length)?r:false}return !r.jquery?false:r}function q(u){var v=u.innerHeight(),t=["paddingTop","paddingBottom"];for(var w=0,s=t.length;w<s;w++){var r=parseInt(u.css(t[w]),10);if(isNaN(r)){r=0}v-=r}return v}var p=j.fn.html;j.fn.html=function(r){if(r!=d&&!j.isFunction(r)&&this.data("dotdotdot")){return this.trigger("update",[r])}return p.apply(this,arguments)};var h=j.fn.text;j.fn.text=function(r){if(r!=d&&!j.isFunction(r)&&this.data("dotdotdot")){r=j("<div />").text(r).html();return this.trigger("update",[r])}return h.apply(this,arguments)}})(jQuery);