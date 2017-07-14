(function(){var v=this;var k=v._;var I=Array.prototype,g=Object.prototype,n=Function.prototype;var L=I.push,l=I.slice,c=g.toString,j=g.hasOwnProperty;var s=Array.isArray,e=Object.keys,J=n.bind,B=Object.create;var E=function(){};var P=function(Q){if(Q instanceof P){return Q}if(!(this instanceof P)){return new P(Q)}this._wrapped=Q};if(typeof exports!=="undefined"){if(typeof module!=="undefined"&&module.exports){exports=module.exports=P}exports._=P}else{v._=P}P.VERSION="1.8.3";var b=function(R,Q,S){if(Q===void 0){return R}switch(S==null?3:S){case 1:return function(T){return R.call(Q,T)};case 2:return function(U,T){return R.call(Q,U,T)};case 3:return function(U,T,V){return R.call(Q,U,T,V)};case 4:return function(T,V,U,W){return R.call(Q,T,V,U,W)}}return function(){return R.apply(Q,arguments)}};var F=function(R,Q,S){if(R==null){return P.identity}if(P.isFunction(R)){return b(R,Q,S)}if(P.isObject(R)){return P.matcher(R)}return P.property(R)};P.iteratee=function(R,Q){return F(R,Q,Infinity)};var p=function(R,Q){return function(Z){var X=arguments.length;if(X<2||Z==null){return Z}for(var T=1;T<X;T++){var Y=arguments[T],W=R(Y),S=W.length;for(var V=0;V<S;V++){var U=W[V];if(!Q||Z[U]===void 0){Z[U]=Y[U]}}}return Z}};var C=function(R){if(!P.isObject(R)){return{}}if(B){return B(R)}E.prototype=R;var Q=new E;E.prototype=null;return Q};var M=function(Q){return function(R){return R==null?void 0:R[Q]}};var K=Math.pow(2,53)-1;var O=M("length");var D=function(R){var Q=O(R);return typeof Q=="number"&&Q>=0&&Q<=K};P.each=P.forEach=function(U,V,R){V=b(V,R);var Q,T;if(D(U)){for(Q=0,T=U.length;Q<T;Q++){V(U[Q],Q,U)}}else{var S=P.keys(U);for(Q=0,T=S.length;Q<T;Q++){V(U[S[Q]],S[Q],U)}}return U};P.map=P.collect=function(V,X,S){X=F(X,S);var U=!D(V)&&P.keys(V),T=(U||V).length,R=Array(T);for(var Q=0;Q<T;Q++){var W=U?U[Q]:Q;R[Q]=X(V[W],W,V)}return R};function z(Q){function R(W,Y,S,V,T,U){for(;T>=0&&T<U;T+=Q){var X=V?V[T]:T;S=Y(S,W[X],X,W)}return S}return function(X,Y,S,U){Y=b(Y,U,4);var W=!D(X)&&P.keys(X),V=(W||X).length,T=Q>0?0:V-1;if(arguments.length<3){S=X[W?W[T]:T];T+=Q}return R(X,Y,S,W,T,V)}}P.reduce=P.foldl=P.inject=z(1);P.reduceRight=P.foldr=z(-1);P.find=P.detect=function(T,Q,S){var R;if(D(T)){R=P.findIndex(T,Q,S)}else{R=P.findKey(T,Q,S)}if(R!==void 0&&R!==-1){return T[R]}};P.filter=P.select=function(T,Q,S){var R=[];Q=F(Q,S);P.each(T,function(W,U,V){if(Q(W,U,V)){R.push(W)}});return R};P.reject=function(S,Q,R){return P.filter(S,P.negate(F(Q)),R)};P.every=P.all=function(V,Q,S){Q=F(Q,S);var U=!D(V)&&P.keys(V),T=(U||V).length;for(var R=0;R<T;R++){var W=U?U[R]:R;if(!Q(V[W],W,V)){return false}}return true};P.some=P.any=function(V,Q,S){Q=F(Q,S);var U=!D(V)&&P.keys(V),T=(U||V).length;for(var R=0;R<T;R++){var W=U?U[R]:R;if(Q(V[W],W,V)){return true}}return false};P.contains=P.includes=P.include=function(T,S,Q,R){if(!D(T)){T=P.values(T)}if(typeof Q!="number"||R){Q=0}return P.indexOf(T,S,Q)>=0};P.invoke=function(S,T){var Q=l.call(arguments,2);var R=P.isFunction(T);return P.map(S,function(V){var U=R?T:V[T];return U==null?U:U.apply(V,Q)})};P.pluck=function(R,Q){return P.map(R,P.property(Q))};P.indexObj=function(R,Q){return R[P.keys(R)[Q]]};P.indexKey=function(R,Q){return P.keys(R)[Q]};P.where=function(R,Q){return P.filter(R,P.matcher(Q))};P.findWhere=function(R,Q){return P.find(R,P.matcher(Q))};P.max=function(T,V,Q){var Y=-Infinity,W=-Infinity,X,S;if(V==null&&T!=null){T=D(T)?T:P.values(T);for(var U=0,R=T.length;U<R;U++){X=T[U];if(X>Y){Y=X}}}else{V=F(V,Q);P.each(T,function(ab,Z,aa){S=V(ab,Z,aa);if(S>W||S===-Infinity&&Y===-Infinity){Y=ab;W=S}})}return Y};P.min=function(T,V,Q){var Y=Infinity,W=Infinity,X,S;if(V==null&&T!=null){T=D(T)?T:P.values(T);for(var U=0,R=T.length;U<R;U++){X=T[U];if(X<Y){Y=X}}}else{V=F(V,Q);P.each(T,function(ab,Z,aa){S=V(ab,Z,aa);if(S<W||S===Infinity&&Y===Infinity){Y=ab;W=S}})}return Y};P.shuffle=function(U){var V=D(U)?U:P.values(U);var T=V.length;var Q=Array(T);for(var R=0,S;R<T;R++){S=P.random(0,R);if(S!==R){Q[R]=Q[S]}Q[S]=V[R]}return Q};P.sample=function(R,S,Q){if(S==null||Q){if(!D(R)){R=P.values(R)}return R[P.random(R.length-1)]}return P.shuffle(R).slice(0,Math.max(0,S))};P.sortBy=function(R,S,Q){S=F(S,Q);return P.pluck(P.map(R,function(V,T,U){return{value:V,index:T,criteria:S(V,T,U)}}).sort(function(W,V){var U=W.criteria;var T=V.criteria;if(U!==T){if(U>T||U===void 0){return 1}if(U<T||T===void 0){return -1}}return W.index-V.index}),"value")};var q=function(Q){return function(T,U,S){var R={};U=F(U,S);P.each(T,function(X,V){var W=U(X,V,T);Q(R,X,W)});return R}};P.groupBy=q(function(Q,S,R){if(P.has(Q,R)){Q[R].push(S)}else{Q[R]=[S]}});P.indexBy=q(function(Q,S,R){Q[R]=S});P.countBy=q(function(Q,S,R){if(P.has(Q,R)){Q[R]++}else{Q[R]=1}});P.toArray=function(Q){if(!Q){return[]}if(P.isArray(Q)){return l.call(Q)}if(D(Q)){return P.map(Q,P.identity)}return P.values(Q)};P.size=function(Q){if(Q==null){return 0}return D(Q)?Q.length:P.keys(Q).length};P.partition=function(U,Q,S){Q=F(Q,S);var T=[],R=[];P.each(U,function(W,V,X){(Q(W,V,X)?T:R).push(W)});return[T,R]};P.first=P.head=P.take=function(S,R,Q){if(S==null){return void 0}if(R==null||Q){return S[0]}return P.initial(S,S.length-R)};P.initial=function(S,R,Q){return l.call(S,0,Math.max(0,S.length-(R==null||Q?1:R)))};P.last=function(S,R,Q){if(S==null){return void 0}if(R==null||Q){return S[S.length-1]}return P.rest(S,Math.max(0,S.length-R))};P.rest=P.tail=P.drop=function(S,R,Q){return l.call(S,R==null||Q?1:R)};P.compact=function(Q){return P.filter(Q,P.identity)};var x=function(W,S,X,aa){var R=[],Z=0;for(var U=aa||0,Q=O(W);U<Q;U++){var Y=W[U];if(D(Y)&&(P.isArray(Y)||P.isArguments(Y))){if(!S){Y=x(Y,S,X)}var T=0,V=Y.length;R.length+=V;while(T<V){R[Z++]=Y[T++]}}else{if(!X){R[Z++]=Y}}}return R};P.flatten=function(R,Q){return x(R,Q,false)};P.without=function(Q){return P.difference(Q,l.call(arguments,1))};P.uniq=P.unique=function(X,T,W,R){if(!P.isBoolean(T)){R=W;W=T;T=false}if(W!=null){W=F(W,R)}var Z=[];var Q=[];for(var V=0,S=O(X);V<S;V++){var Y=X[V],U=W?W(Y,V,X):Y;if(T){if(!V||Q!==U){Z.push(Y)}Q=U}else{if(W){if(!P.contains(Q,U)){Q.push(U);Z.push(Y)}}else{if(!P.contains(Z,Y)){Z.push(Y)}}}}return Z};P.union=function(){return P.uniq(x(arguments,true,true))};P.intersection=function(W){var Q=[];var V=arguments.length;for(var S=0,U=O(W);S<U;S++){var T=W[S];if(P.contains(Q,T)){continue}for(var R=1;R<V;R++){if(!P.contains(arguments[R],T)){break}}if(R===V){Q.push(T)}}return Q};P.difference=function(R){var Q=x(arguments,true,true,1);return P.filter(R,function(S){return !P.contains(Q,S)})};P.zip=function(){return P.unzip(arguments)};P.unzip=function(T){var S=T&&P.max(T,O).length||0;var Q=Array(S);for(var R=0;R<S;R++){Q[R]=P.pluck(T,R)}return Q};P.object=function(U,R){var Q={};for(var S=0,T=O(U);S<T;S++){if(R){Q[U[S]]=R[S]}else{Q[U[S][0]]=U[S][1]}}return Q};function u(Q){return function(V,R,T){R=F(R,T);var U=O(V);var S=Q>0?0:U-1;for(;S>=0&&S<U;S+=Q){if(R(V[S],S,V)){return S}}return -1}}P.findIndex=u(1);P.findLastIndex=u(-1);P.sortedIndex=function(X,V,W,S){W=F(W,S,1);var U=W(V);var Q=0,T=O(X);while(Q<T){var R=Math.floor((Q+T)/2);if(W(X[R])<U){Q=R+1}else{T=R}}return Q};function f(Q,R,S){return function(X,W,T){var U=0,V=O(X);if(typeof T=="number"){if(Q>0){U=T>=0?T:Math.max(T+V,U)}else{V=T>=0?Math.min(T+1,V):T+V+1}}else{if(S&&T&&V){T=S(X,W);return X[T]===W?T:-1}}if(W!==W){T=R(l.call(X,U,V),P.isNaN);return T>=0?T+U:-1}for(T=Q>0?U:V-1;T>=0&&T<V;T+=Q){if(X[T]===W){return T}}return -1}}P.indexOf=f(1,P.findIndex,P.sortedIndex);P.lastIndexOf=f(-1,P.findLastIndex);P.range=function(V,S,U){if(S==null){S=V||0;V=0}U=U||1;var T=Math.max(Math.ceil((S-V)/U),0);var R=Array(T);for(var Q=0;Q<T;Q++,V+=U){R[Q]=V}return R};var y=function(V,S,U,W,T){if(!(W instanceof S)){return V.apply(U,T)}var R=C(V.prototype);var Q=V.apply(R,T);if(P.isObject(Q)){return Q}return R};P.bind=function(T,R){if(J&&T.bind===J){return J.apply(T,l.call(arguments,1))}if(!P.isFunction(T)){throw new TypeError("Bind must be called on a function")}var Q=l.call(arguments,2);var S=function(){return y(T,S,R,this,Q.concat(l.call(arguments)))};return S};P.partial=function(R){var S=l.call(arguments,1);var Q=function(){var T=0,W=S.length;var U=Array(W);for(var V=0;V<W;V++){U[V]=S[V]===P?arguments[T++]:S[V]}while(T<arguments.length){U.push(arguments[T++])}return y(R,Q,this,this,U)};return Q};P.bindAll=function(T){var R,S=arguments.length,Q;if(S<=1){throw new Error("bindAll must be passed function names")}for(R=1;R<S;R++){Q=arguments[R];T[Q]=P.bind(T[Q],T)}return T};P.memoize=function(R,Q){var S=function(V){var U=S.cache;var T=""+(Q?Q.apply(this,arguments):V);if(!P.has(U,T)){U[T]=R.apply(this,arguments)}return U[T]};S.cache={};return S};P.delay=function(R,S){var Q=l.call(arguments,2);return setTimeout(function(){return R.apply(null,Q)},S)};P.defer=P.partial(P.delay,P,1);P.throttle=function(R,T,X){var Q,V,Y;var W=null;var U=0;if(!X){X={}}var S=function(){U=X.leading===false?0:P.now();W=null;Y=R.apply(Q,V);if(!W){Q=V=null}};return function(){var Z=P.now();if(!U&&X.leading===false){U=Z}var aa=T-(Z-U);Q=this;V=arguments;if(aa<=0||aa>T){if(W){clearTimeout(W);W=null}U=Z;Y=R.apply(Q,V);if(!W){Q=V=null}}else{if(!W&&X.trailing!==false){W=setTimeout(S,aa)}}return Y}};P.debounce=function(S,U,R){var X,W,Q,V,Y;var T=function(){var Z=P.now()-V;if(Z<U&&Z>=0){X=setTimeout(T,U-Z)}else{X=null;if(!R){Y=S.apply(Q,W);if(!X){Q=W=null}}}};return function(){Q=this;W=arguments;V=P.now();var Z=R&&!X;if(!X){X=setTimeout(T,U)}if(Z){Y=S.apply(Q,W);Q=W=null}return Y}};P.wrap=function(Q,R){return P.partial(R,Q)};P.negate=function(Q){return function(){return !Q.apply(this,arguments)}};P.compose=function(){var Q=arguments;var R=Q.length-1;return function(){var T=R;var S=Q[R].apply(this,arguments);while(T--){S=Q[T].call(this,S)}return S}};P.after=function(R,Q){return function(){if(--R<1){return Q.apply(this,arguments)}}};P.before=function(S,R){var Q;return function(){if(--S>0){Q=R.apply(this,arguments)}if(S<=1){R=null}return Q}};P.once=P.partial(P.before,2);var G=!{toString:null}.propertyIsEnumerable("toString");var a=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];function d(U,T){var Q=a.length;var R=U.constructor;var S=(P.isFunction(R)&&R.prototype)||g;var V="constructor";if(P.has(U,V)&&!P.contains(T,V)){T.push(V)}while(Q--){V=a[Q];if(V in U&&U[V]!==S[V]&&!P.contains(T,V)){T.push(V)}}}P.keys=function(S){if(!P.isObject(S)){return[]}if(e){return e(S)}var R=[];for(var Q in S){if(P.has(S,Q)){R.push(Q)}}if(G){d(S,R)}return R};P.allKeys=function(S){if(!P.isObject(S)){return[]}var R=[];for(var Q in S){R.push(Q)}if(G){d(S,R)}return R};P.values=function(U){var T=P.keys(U);var S=T.length;var Q=Array(S);for(var R=0;R<S;R++){Q[R]=U[T[R]]}return Q};P.mapObject=function(V,X,S){X=F(X,S);var U=P.keys(V),T=U.length,R={},W;for(var Q=0;Q<T;Q++){W=U[Q];R[W]=X(V[W],W,V)}return R};P.pairs=function(U){var S=P.keys(U);var R=S.length;var T=Array(R);for(var Q=0;Q<R;Q++){T[Q]=[S[Q],U[S[Q]]]}return T};P.invert=function(U){var Q={};var T=P.keys(U);for(var R=0,S=T.length;R<S;R++){Q[U[T[R]]]=T[R]}return Q};P.functions=P.methods=function(S){var R=[];for(var Q in S){if(P.isFunction(S[Q])){R.push(Q)}}return R.sort()};P.extend=p(P.allKeys);P.extendOwn=P.assign=p(P.keys);P.findKey=function(W,Q,T){Q=F(Q,T);var V=P.keys(W),S;for(var R=0,U=V.length;R<U;R++){S=V[R];if(Q(W[S],S,W)){return S}}};P.pick=function(S,W,Q){var aa={},T=S,V,Z;if(T==null){return aa}if(P.isFunction(W)){Z=P.allKeys(T);V=b(W,Q)}else{Z=x(arguments,false,false,1);V=function(ac,ab,ad){return ab in ad};T=Object(T)}for(var U=0,R=Z.length;U<R;U++){var Y=Z[U];var X=T[Y];if(V(X,Y,T)){aa[Y]=X}}return aa};P.omit=function(S,T,Q){if(P.isFunction(T)){T=P.negate(T)}else{var R=P.map(x(arguments,false,false,1),String);T=function(V,U){return !P.contains(R,U)}}return P.pick(S,T,Q)};P.defaults=p(P.allKeys,true);P.create=function(R,S){var Q=C(R);if(S){P.extendOwn(Q,S)}return Q};P.clone=function(Q){if(!P.isObject(Q)){return Q}return P.isArray(Q)?Q.slice():P.extend({},Q)};P.tap=function(R,Q){Q(R);return R};P.isMatch=function(R,Q){var V=P.keys(Q),U=V.length;if(R==null){return !U}var W=Object(R);for(var T=0;T<U;T++){var S=V[T];if(Q[S]!==W[S]||!(S in W)){return false}}return true};var N=function(Y,X,R,T){if(Y===X){return Y!==0||1/Y===1/X}if(Y==null||X==null){return Y===X}if(Y instanceof P){Y=Y._wrapped}if(X instanceof P){X=X._wrapped}var V=c.call(Y);if(V!==c.call(X)){return false}switch(V){case"[object RegExp]":case"[object String]":return""+Y===""+X;case"[object Number]":if(+Y!==+Y){return +X!==+X}return +Y===0?1/+Y===1/X:+Y===+X;case"[object Date]":case"[object Boolean]":return +Y===+X}var S=V==="[object Array]";if(!S){if(typeof Y!="object"||typeof X!="object"){return false}var W=Y.constructor,U=X.constructor;if(W!==U&&!(P.isFunction(W)&&W instanceof W&&P.isFunction(U)&&U instanceof U)&&("constructor" in Y&&"constructor" in X)){return false}}R=R||[];T=T||[];var Q=R.length;while(Q--){if(R[Q]===Y){return T[Q]===X}}R.push(Y);T.push(X);if(S){Q=Y.length;if(Q!==X.length){return false}while(Q--){if(!N(Y[Q],X[Q],R,T)){return false}}}else{var aa=P.keys(Y),Z;Q=aa.length;if(P.keys(X).length!==Q){return false}while(Q--){Z=aa[Q];if(!(P.has(X,Z)&&N(Y[Z],X[Z],R,T))){return false}}}R.pop();T.pop();return true};P.isEqual=function(R,Q){return N(R,Q)};P.isEmpty=function(Q){if(Q==null){return true}if(D(Q)&&(P.isArray(Q)||P.isString(Q)||P.isArguments(Q))){return Q.length===0}return P.keys(Q).length===0};P.isElement=function(Q){return !!(Q&&Q.nodeType===1)};P.isArray=s||function(Q){return c.call(Q)==="[object Array]"};P.isObject=function(R){var Q=typeof R;return Q==="function"||Q==="object"&&!!R};P.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(Q){P["is"+Q]=function(R){return c.call(R)==="[object "+Q+"]"}});if(!P.isArguments(arguments)){P.isArguments=function(Q){return P.has(Q,"callee")}}if(typeof/./!="function"&&typeof Int8Array!="object"){P.isFunction=function(Q){return typeof Q=="function"||false}}P.isFinite=function(Q){return isFinite(Q)&&!isNaN(parseFloat(Q))};P.isNaN=function(Q){return P.isNumber(Q)&&Q!==+Q};P.isBoolean=function(Q){return Q===true||Q===false||c.call(Q)==="[object Boolean]"};P.isNull=function(Q){return Q===null};P.isUndefined=function(Q){return Q===void 0};P.has=function(R,Q){return R!=null&&j.call(R,Q)};P.noConflict=function(){v._=k;return this};P.identity=function(Q){return Q};P.constant=function(Q){return function(){return Q}};P.noop=function(){};P.property=M;P.propertyOf=function(Q){return Q==null?function(){}:function(R){return Q[R]}};P.matcher=P.matches=function(Q){Q=P.extendOwn({},Q);return function(R){return P.isMatch(R,Q)}};P.times=function(U,T,S){var Q=Array(Math.max(0,U));T=b(T,S,1);for(var R=0;R<U;R++){Q[R]=T(R)}return Q};P.random=function(R,Q){if(Q==null){Q=R;R=0}return R+Math.floor(Math.random()*(Q-R+1))};P.now=Date.now||function(){return new Date().getTime()};var r={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};var m=P.invert(r);var w=function(U){var R=function(V){return U[V]};var T="(?:"+P.keys(U).join("|")+")";var S=RegExp(T);var Q=RegExp(T,"g");return function(V){V=V==null?"":""+V;return S.test(V)?V.replace(Q,R):V}};P.escape=w(r);P.unescape=w(m);P.result=function(Q,S,T){var R=Q==null?void 0:Q[S];if(R===void 0){R=T}return P.isFunction(R)?R.call(Q):R};var A=0;P.uniqueId=function(Q){var R=++A+"";return Q?Q+R:R};P.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var t=/(.)^/;var h={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"};var i=/\\|'|\r|\n|\u2028|\u2029/g;var H=function(Q){return"\\"+h[Q]};P.template=function(Z,T,W){if(!T&&W){T=W}T=P.defaults({},T,P.templateSettings);var U=RegExp([(T.escape||t).source,(T.interpolate||t).source,(T.evaluate||t).source].join("|")+"|$","g");var V=0;var Q="__p+='";Z.replace(U,function(ab,ac,aa,ae,ad){Q+=Z.slice(V,ad).replace(i,H);V=ad+ab.length;if(ac){Q+="'+\n((__t=("+ac+"))==null?'':_.escape(__t))+\n'"}else{if(aa){Q+="'+\n((__t=("+aa+"))==null?'':__t)+\n'"}else{if(ae){Q+="';\n"+ae+"\n__p+='"}}}return ab});Q+="';\n";if(!T.variable){Q="with(obj||{}){\n"+Q+"}\n"}Q="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+Q+"return __p;\n";try{var S=new Function(T.variable||"obj","_",Q)}catch(X){X.source=Q;throw X}var Y=function(aa){return S.call(this,aa,P)};var R=T.variable||"obj";Y.source="function("+R+"){\n"+Q+"}";return Y};P.chain=function(R){var Q=P(R);Q._chain=true;return Q};var o=function(Q,R){return Q._chain?P(R).chain():R};P.mixin=function(Q){P.each(P.functions(Q),function(R){var S=P[R]=Q[R];P.prototype[R]=function(){var T=[this._wrapped];L.apply(T,arguments);return o(this,S.apply(P,T))}})};P.mixin(P);P.each(["pop","push","reverse","shift","sort","splice","unshift"],function(Q){var R=I[Q];P.prototype[Q]=function(){var S=this._wrapped;R.apply(S,arguments);if((Q==="shift"||Q==="splice")&&S.length===0){delete S[0]}return o(this,S)}});P.each(["concat","join","slice"],function(Q){var R=I[Q];P.prototype[Q]=function(){return o(this,R.apply(this._wrapped,arguments))}});P.prototype.value=function(){return this._wrapped};P.prototype.valueOf=P.prototype.toJSON=P.prototype.value;P.prototype.toString=function(){return""+this._wrapped};if(typeof define==="function"&&define.amd){define("underscore",[],function(){return P})}}.call(this));