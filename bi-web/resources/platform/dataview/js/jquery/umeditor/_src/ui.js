/*******widget部分*********/
(function ($) {
    //对jquery的扩展
    $.parseTmpl = function parse(str, data) {
        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\'' + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g,function (match, code) {
            return "'," + code.replace(/\\'/g, "'") + ",'";
        }).replace(/<%([\s\S]+?)%>/g,function (match, code) {
                return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
            }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');";
        var func = new Function('obj', tmpl);
        return data ? func(data) : func;
    };
    $.extend2 = function (t, s) {
        var a = arguments,
            notCover = $.type(a[a.length - 1]) == 'boolean' ? a[a.length - 1] : false,
            len = $.type(a[a.length - 1]) == 'boolean' ? a.length - 1 : a.length;
        for (var i = 1; i < len; i++) {
            var x = a[i];
            for (var k in x) {
                if (!notCover || !t.hasOwnProperty(k)) {
                    t[k] = x[k];
                }
            }
        }
        return t;
    };

    $.IE6 = !!window.ActiveXObject && parseFloat(navigator.userAgent.match(/msie (\d+)/i)[1]) == 6;

    //所有ui的基类
    var _eventHandler = [];
    var _widget = function () {
    };
    var _prefix = 'edui';
    _widget.prototype = {
        on: function (ev, cb) {
            this.root().on(ev, $.proxy(cb, this));
            return this;
        },
        off: function (ev, cb) {
            this.root().off(ev, $.proxy(cb, this));
            return this;
        },
        trigger: function (ev, data) {
            return  this.root().trigger(ev, data) === false ? false : this;
        },
        root: function ($el) {
            return this._$el || (this._$el = $el);
        },
        destroy: function () {

        },
        data: function (key, val) {
            if (val !== undefined) {
                this.root().data(_prefix + key, val);
                return this;
            } else {
                return this.root().data(_prefix + key)
            }
        },
        register: function (eventName, $el, fn) {
            _eventHandler.push({
                'evtname': eventName,
                '$els': $.isArray($el) ? $el : [$el],
                handler: $.proxy(fn, $el)
            })
        }
    };

    //从jq实例上拿到绑定的widget实例
    $.fn.edui = function (obj) {
        return obj ? this.data('eduiwidget', obj) : this.data('eduiwidget');
    };

    function _createClass(ClassObj, properties, supperClass) {
        ClassObj.prototype = $.extend2(
            $.extend({}, properties),
            (UM.ui[supperClass] || _widget).prototype,
            true
        );
        ClassObj.prototype.supper = (UM.ui[supperClass] || _widget).prototype;
        //父class的defaultOpt 合并
        if( UM.ui[supperClass] && UM.ui[supperClass].prototype.defaultOpt ) {

            var parentDefaultOptions = UM.ui[supperClass].prototype.defaultOpt,
                subDefaultOptions = ClassObj.prototype.defaultOpt;

            ClassObj.prototype.defaultOpt = $.extend( {}, parentDefaultOptions, subDefaultOptions || {} );

        }
        return ClassObj
    }

    var _guid = 1;

    function mergeToJQ(ClassObj, className) {
        $[_prefix + className] = ClassObj;
        $.fn[_prefix + className] = function (opt) {
            var result, args = Array.prototype.slice.call(arguments, 1);

            this.each(function (i, el) {
                var $this = $(el);
                var obj = $this.edui();
                if (!obj) {
                    ClassObj(!opt || !$.isPlainObject(opt) ? {} : opt, $this);
                    $this.edui(obj)
                }
                if ($.type(opt) == 'string') {
                    if (opt == 'this') {
                        result = obj;
                    } else {
                        result = obj[opt].apply(obj, args);
                        if (result !== obj && result !== undefined) {
                            return false;
                        }
                        result = null;
                    }

                }
            });

            return result !== null ? result : this;
        }
    }

    UM.ui = {
        define: function (className, properties, supperClass) {
            var ClassObj = UM.ui[className] = _createClass(function (options, $el) {
                    var _obj = function () {
                    };
                    $.extend(_obj.prototype, ClassObj.prototype, {
                            guid: className + _guid++,
                            widgetName: className
                        }
                    );
                    var obj = new _obj;
                    if ($.type(options) == 'string') {
                        obj.init && obj.init({});
                        obj.root().edui(obj);
                        obj.root().find('a').click(function (evt) {
                            evt.preventDefault()
                        });
                        return obj.root()[_prefix + className].apply(obj.root(), arguments)
                    } else {
                        $el && obj.root($el);
                        obj.init && obj.init(!options || $.isPlainObject(options) ? $.extend2(options || {}, obj.defaultOpt || {}, true) : options);
                        try{
                            obj.root().find('a').click(function (evt) {
                                evt.preventDefault()
                            });
                        }catch(e){
                        }

                        return obj.root().edui(obj);
                    }

                },properties, supperClass);

            mergeToJQ(ClassObj, className);
        }
    };

    $(function () {
        $(document).on('click mouseup mousedown dblclick mouseover', function (evt) {
            $.each(_eventHandler, function (i, obj) {
                if (obj.evtname == evt.type) {
                    $.each(obj.$els, function (i, $el) {
                        if ($el[0] !== evt.target && !$.contains($el[0], evt.target)) {
                            obj.handler(evt);
                        }
                    })
                }
            })
        })
    })
})(jQuery);
	/********button部分*********/
	//button 类
UM.ui.define('button', {
    tpl: '<<%if(!texttype){%>div class="edui-btn edui-btn-<%=icon%> <%if(name){%>edui-btn-name-<%=name%><%}%>" unselectable="on" onmousedown="return false" <%}else{%>a class="edui-text-btn"<%}%><% if(title) {%> data-original-title="<%=title%>" <%};%>> ' +
        '<% if(icon) {%><div unselectable="on" class="edui-icon-<%=icon%> edui-icon"></div><% }; %><%if(text) {%><span unselectable="on" onmousedown="return false" class="edui-button-label"><%=text%></span><%}%>' +
        '<%if(caret && text){%><span class="edui-button-spacing"></span><%}%>' +
        '<% if(caret) {%><span unselectable="on" onmousedown="return false" class="edui-caret"></span><% };%></<%if(!texttype){%>div<%}else{%>a<%}%>>',
    defaultOpt: {
        text: '',
        title: '',
        icon: '',
        width: '',
        caret: false,
        texttype: false,
        click: function () {
        }
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options)))
            .click(function (evt) {
                me.wrapclick(options.click, evt)
            });

        me.root().hover(function () {
            if(!me.root().hasClass("edui-disabled")){
                me.root().toggleClass('edui-hover')
            }
        })

        return me;
    },
    wrapclick: function (fn, evt) {
        if (!this.disabled()) {
            this.root().trigger('wrapclick');
            $.proxy(fn, this, evt)()
        }
        return this;
    },
    label: function (text) {
        if (text === undefined) {
            return this.root().find('.edui-button-label').text();
        } else {
            this.root().find('.edui-button-label').text(text);
            return this;
        }
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('edui-disabled')
        }
        this.root().toggleClass('edui-disabled', state);
        if(this.root().hasClass('edui-disabled')){
            this.root().removeClass('edui-hover')
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('edui-active')
        }
        this.root().toggleClass('edui-active', state)

        return this;
    },
    mergeWith: function ($obj) {
        var me = this;
        me.data('$mergeObj', $obj);
        $obj.edui().data('$mergeObj', me.root());
        if (!$.contains(document.body, $obj[0])) {
            $obj.appendTo(me.root());
        }
        me.on('click',function () {
            me.wrapclick(function () {
                $obj.edui().show();
            })
        }).register('click', me.root(), function (evt) {
                $obj.hide()
            });
    }
});
/*********toolbar部分**********/
//toolbar 类
(function () {
    UM.ui.define('toolbar', {
        tpl: '<div class="edui-toolbar"  ><div class="edui-btn-toolbar" unselectable="on" onmousedown="return false"  ></div></div>'
          ,
        init: function () {
            var $root = this.root($(this.tpl));
            this.data('$btnToolbar', $root.find('.edui-btn-toolbar'))
        },
        appendToBtnmenu : function(data){
            var $cont = this.data('$btnToolbar');
            data = $.isArray(data) ? data : [data];
            $.each(data,function(i,$item){
                $cont.append($item)
            })
        }
    });
})();
/********menu部分*********/
//menu 类
UM.ui.define('menu',{
    show : function($obj,dir,fnname,topOffset,leftOffset){

        fnname = fnname || 'position';
        if(this.trigger('beforeshow') === false){
            return;
        }else{
            this.root().css($.extend({display:'block'},$obj ? {
                top : $obj[fnname]().top + ( dir == 'right' ? 0 : $obj.outerHeight()) - (topOffset || 0),
                left : $obj[fnname]().left + (dir == 'right' ?  $obj.outerWidth() : 0) -  (leftOffset || 0)
            }:{}))
            this.trigger('aftershow');
        }
    },
    hide : function(all){
        var $parentmenu;
        if(this.trigger('beforehide') === false){
            return;
        } else {

            if($parentmenu = this.root().data('parentmenu')){
                if($parentmenu.data('parentmenu')|| all)
                    $parentmenu.edui().hide();
            }
            this.root().css('display','none');
            this.trigger('afterhide');
        }
    },
    attachTo : function($obj){
        var me = this;
        if(!$obj.data('$mergeObj')){
            $obj.data('$mergeObj',me.root());
            $obj.on('wrapclick',function(evt){
                me.show()
            });
            me.register('click',$obj,function(evt){
               me.hide()
            });
            me.data('$mergeObj',$obj)
        }
    }
});
/********dropmenu部分*********/
//dropmenu 类
UM.ui.define('dropmenu', {
    tmpl: '<ul class="edui-dropdown-menu" aria-labelledby="dropdownMenu" >' +
        '<%for(var i=0,ci;ci=data[i++];){%>' +
        '<%if(ci.divider){%><li class="edui-divider"></li><%}else{%>' +
        '<li <%if(ci.active||ci.disabled){%>class="<%= ci.active|| \'\' %> <%=ci.disabled||\'\' %>" <%}%> data-value="<%= ci.value%>">' +
        '<a href="#" tabindex="-1"><em class="edui-dropmenu-checkbox"><i class="edui-icon-ok"></i></em><%= ci.label%></a>' +
        '</li><%}%>' +
        '<%}%>' +
        '</ul>',
    defaultOpt: {
        data: [],
        click: function () {

        }
    },
    init: function (options) {
        var me = this;
        var eventName = {
            click: 1,
            mouseover: 1,
            mouseout: 1
        };

        this.root($($.parseTmpl(this.tmpl, options))).on('click', 'li[class!="edui-disabled edui-divider edui-dropdown-submenu"]',function (evt) {
            $.proxy(options.click, me, evt, $(this).data('value'), $(this))()
        }).find('li').each(function (i, el) {
                var $this = $(this);
                if (!$this.hasClass("edui-disabled edui-divider edui-dropdown-submenu")) {
                    var data = options.data[i];
                    $.each(eventName, function (k) {
                        data[k] && $this[k](function (evt) {
                            $.proxy(data[k], el)(evt, data, me.root)
                        })
                    })
                }
            })

    },
    disabled: function (cb) {
        $('li[class!=edui-divider]', this.root()).each(function () {
            var $el = $(this);
            if (cb === true) {
                $el.addClass('edui-disabled')
            } else if ($.isFunction(cb)) {
                $el.toggleClass('edui-disabled', cb(li))
            } else {
                $el.removeClass('edui-disabled')
            }

        });
    },
    val: function (val) {
        var currentVal;
        $('li[class!="edui-divider edui-disabled edui-dropdown-submenu"]', this.root()).each(function () {
            var $el = $(this);
            if (val === undefined) {
                if ($el.find('em.edui-dropmenu-checked').length) {
                    currentVal = $el.data('value');
                    return false
                }
            } else {
                $el.find('em').toggleClass('edui-dropmenu-checked', $el.data('value') == val)
            }
        });
        if (val === undefined) {
            return currentVal
        }
    },
    addSubmenu: function (label, menu, index) {
        index = index || 0;

        var $list = $('li[class!=edui-divider]', this.root());
        var $node = $('<li class="edui-dropdown-submenu"><a tabindex="-1" href="#">' + label + '</a></li>').append(menu);

        if (index >= 0 && index < $list.length) {
            $node.insertBefore($list[index]);
        } else if (index < 0) {
            $node.insertBefore($list[0]);
        } else if (index >= $list.length) {
            $node.appendTo($list);
        }
    }
}, 'menu');
/**********splitbutton部分************/
//splitbutton 类
///import button
UM.ui.define('splitbutton',{
    tpl :'<div class="edui-splitbutton <%if (name){%>edui-splitbutton-<%= name %><%}%>"  unselectable="on" <%if(title){%>data-original-title="<%=title%>"<%}%>><div class="edui-btn"  unselectable="on" ><%if(icon){%><div  unselectable="on" class="edui-icon-<%=icon%> edui-icon"></div><%}%><%if(text){%><%=text%><%}%></div>'+
            '<div  unselectable="on" class="edui-btn edui-dropdown-toggle" >'+
                '<div  unselectable="on" class="edui-caret"><\/div>'+
            '</div>'+
        '</div>',
    defaultOpt:{
        text:'',
        title:'',
        click:function(){}
    },
    init : function(options){
        var me = this;
        me.root( $($.parseTmpl(me.tpl,options)));
        me.root().find('.edui-btn:first').click(function(evt){
            if(!me.disabled()){
                $.proxy(options.click,me)();
            }
        });
        me.root().find('.edui-dropdown-toggle').click(function(){
            if(!me.disabled()){
                me.trigger('arrowclick')
            }
        });
        me.root().hover(function () {
            if(!me.root().hasClass("edui-disabled")){
                me.root().toggleClass('edui-hover')
            }
        });

        return me;
    },
    wrapclick:function(fn,evt){
        if(!this.disabled()){
            $.proxy(fn,this,evt)()
        }
        return this;
    },
    disabled : function(state){
        if(state === undefined){
            return this.root().hasClass('edui-disabled')
        }
        this.root().toggleClass('edui-disabled',state).find('.edui-btn').toggleClass('edui-disabled',state);
        return this;
    },
    active:function(state){
        if(state === undefined){
            return this.root().hasClass('edui-active')
        }
        this.root().toggleClass('edui-active',state).find('.edui-btn:first').toggleClass('edui-active',state);
        return this;
    },
    mergeWith:function($obj){
        var me = this;
        me.data('$mergeObj',$obj);
        $obj.edui().data('$mergeObj',me.root());
        if(!$.contains(document.body,$obj[0])){
            $obj.appendTo(me.root());
        }
        me.root().delegate('.edui-dropdown-toggle','click',function(){
            me.wrapclick(function(){
                $obj.edui().show();
            })
        });
        me.register('click',me.root().find('.edui-dropdown-toggle'),function(evt){
            $obj.hide()
        });
    }
});
/************colorspiltbutton部分*************/
/**
 * Created with JetBrains PhpStorm.
 * User: hn
 * Date: 13-7-10
 * Time: 下午3:07
 * To change this template use File | Settings | File Templates.
 */
UM.ui.define('colorsplitbutton',{

    tpl : '<div class="edui-splitbutton <%if (name){%>edui-splitbutton-<%= name %><%}%>"  unselectable="on" <%if(title){%>data-original-title="<%=title%>"<%}%>><div class="edui-btn"  unselectable="on" ><%if(icon){%><div  unselectable="on" class="edui-icon-<%=icon%> edui-icon"></div><%}%><div class="edui-splitbutton-color-label" <%if (color) {%>style="background: <%=color%>"<%}%>></div><%if(text){%><%=text%><%}%></div>'+
            '<div  unselectable="on" class="edui-btn edui-dropdown-toggle" >'+
            '<div  unselectable="on" class="edui-caret"><\/div>'+
            '</div>'+
            '</div>',
    defaultOpt: {
        color: ''
    },
    init: function( options ){

        var me = this;

        me.supper.init.call( me, options );

    },
    colorLabel: function(){
        return this.root().find('.edui-splitbutton-color-label');
    }

}, 'splitbutton');
/***********popup部分*************/
//popup 类
UM.ui.define('popup', {
    tpl: '<div class="edui-dropdown-menu edui-popup"'+
        '<%if(!<%=stopprop%>){%>onmousedown="return false"<%}%>'+
        '><div class="edui-popup-body" unselectable="on" onmousedown="return false"><%=subtpl%></div>' +
        '<div class="edui-popup-caret"></div>' +
        '</div>',
    defaultOpt: {
        stopprop:false,
        subtpl: '',
        width: '',
        height: ''
    },
    init: function (options) {
        this.root($($.parseTmpl(this.tpl, options)));
        return this;
    },
    mergeTpl: function (data) {
        return $.parseTmpl(this.tpl, {subtpl: data});
    },
    show: function ($obj, posObj) {
        if (!posObj) posObj = {};

        var fnname = posObj.fnname || 'position';
        if (this.trigger('beforeshow') === false) {
            return;
        } else {
            this.root().css($.extend({display: 'block'}, $obj ? {
                top: $obj[fnname]().top + ( posObj.dir == 'right' ? 0 : $obj.outerHeight()) - (posObj.offsetTop || 0),
                left: $obj[fnname]().left + (posObj.dir == 'right' ? $obj.outerWidth() : 0) - (posObj.offsetLeft || 0),
                position: 'absolute'
            } : {}));

            this.root().find('.edui-popup-caret').css({
                top: posObj.caretTop || 0,
                left: posObj.caretLeft || 0,
                position: 'absolute'
            }).addClass(posObj.caretDir || "up")

        }
        this.trigger("aftershow");
    },
    hide: function () {
        this.root().css('display', 'none');
        this.trigger('afterhide')
    },
    attachTo: function ($obj, posObj) {
        var me = this
        if (!$obj.data('$mergeObj')) {
            $obj.data('$mergeObj', me.root());
            $obj.on('wrapclick', function (evt) {
                me.show($obj, posObj)
            });
            me.register('click', $obj, function (evt) {
                me.hide()
            });
            me.data('$mergeObj', $obj)
        }
    },
    getBodyContainer: function () {
        return this.root().find(".edui-popup-body");
    }
});
/*********scale部分************/
//scale 类
UM.ui.define('scale', {
    tpl: '<div class="edui-scale" unselectable="on">' +
        '<span class="edui-scale-hand0"></span>' +
        '<span class="edui-scale-hand1"></span>' +
        '<span class="edui-scale-hand2"></span>' +
        '<span class="edui-scale-hand3"></span>' +
        '<span class="edui-scale-hand4"></span>' +
        '<span class="edui-scale-hand5"></span>' +
        '<span class="edui-scale-hand6"></span>' +
        '<span class="edui-scale-hand7"></span>' +
        '</div>',
    defaultOpt: {
        $doc: $(document),
        $wrap: $(document)
    },
    init: function (options) {
        if(options.$doc) this.defaultOpt.$doc = options.$doc;
        if(options.$wrap) this.defaultOpt.$wrap = options.$wrap;
        this.root($($.parseTmpl(this.tpl, options)));
        this.initStyle();
        this.startPos = this.prePos = {x: 0, y: 0};
        this.dragId = -1;
        return this;
    },
    initStyle: function () {
        utils.cssRule('edui-style-scale', '.edui-scale{display:none;position:absolute;border:1px solid #38B2CE;cursor:hand;}' +
            '.edui-scale span{position:absolute;left:0;top:0;width:7px;height:7px;overflow:hidden;font-size:0px;display:block;background-color:#3C9DD0;}'
            + '.edui-scale .edui-scale-hand0{cursor:nw-resize;top:0;margin-top:-4px;left:0;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand1{cursor:n-resize;top:0;margin-top:-4px;left:50%;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand2{cursor:ne-resize;top:0;margin-top:-4px;left:100%;margin-left:-3px;}'
            + '.edui-scale .edui-scale-hand3{cursor:w-resize;top:50%;margin-top:-4px;left:0;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand4{cursor:e-resize;top:50%;margin-top:-4px;left:100%;margin-left:-3px;}'
            + '.edui-scale .edui-scale-hand5{cursor:sw-resize;top:100%;margin-top:-3px;left:0;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand6{cursor:s-resize;top:100%;margin-top:-3px;left:50%;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand7{cursor:se-resize;top:100%;margin-top:-3px;left:100%;margin-left:-3px;}');
    },
    _eventHandler: function (e) {
        var me = this,
            $doc = me.defaultOpt.$doc;
        switch (e.type) {
            case 'mousedown':
                var hand = e.target || e.srcElement, hand;
                if (hand.className.indexOf('edui-scale-hand') != -1) {
                    me.dragId = hand.className.slice(-1);
                    me.startPos.x = me.prePos.x = e.clientX;
                    me.startPos.y = me.prePos.y = e.clientY;
                    $doc.bind('mousemove', $.proxy(me._eventHandler, me));
                }
                break;
            case 'mousemove':
                if (me.dragId != -1) {
                    me.updateContainerStyle(me.dragId, {x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y});
                    me.prePos.x = e.clientX;
                    me.prePos.y = e.clientY;
                    me.updateTargetElement();
                }
                break;
            case 'mouseup':
                if (me.dragId != -1) {
                    me.dragId = -1;
                    me.updateTargetElement();
                    var $target = me.data('$scaleTarget');
                    if ($target.parent()) me.attachTo(me.data('$scaleTarget'));
                }
                $doc.unbind('mousemove', $.proxy(me._eventHandler, me));
                break;
            default:
                break;
        }
    },
    updateTargetElement: function () {
        var me = this,
            $root = me.root(),
            $target = me.data('$scaleTarget');
        $target.css({width: $root.width(), height: $root.height()});
        me.attachTo($target);
    },
    updateContainerStyle: function (dir, offset) {
        var me = this,
            $dom = me.root(),
            tmp,
            rect = [
                //[left, top, width, height]
                [0, 0, -1, -1],
                [0, 0, 0, -1],
                [0, 0, 1, -1],
                [0, 0, -1, 0],
                [0, 0, 1, 0],
                [0, 0, -1, 1],
                [0, 0, 0, 1],
                [0, 0, 1, 1]
            ];

        if (rect[dir][0] != 0) {
            tmp = parseInt($dom.offset().left) + offset.x;
            $dom.css('left', me._validScaledProp('left', tmp));
        }
        if (rect[dir][1] != 0) {
            tmp = parseInt($dom.offset().top) + offset.y;
            $dom.css('top', me._validScaledProp('top', tmp));
        }
        if (rect[dir][2] != 0) {
            tmp = $dom.width() + rect[dir][2] * offset.x;
            $dom.css('width', me._validScaledProp('width', tmp));
        }
        if (rect[dir][3] != 0) {
            tmp = $dom.height() + rect[dir][3] * offset.y;
            $dom.css('height', me._validScaledProp('height', tmp));
        }
    },
    _validScaledProp: function (prop, value) {
        var $ele = this.root(),
            $wrap = this.defaultOpt.$doc,
            calc = function(val, a, b){
                return (val + a) > b ? b - a : value;
            };

        value = isNaN(value) ? 0 : value;
        switch (prop) {
            case 'left':
                return value < 0 ? 0 : calc(value, $ele.width(), $wrap.width());
            case 'top':
                return value < 0 ? 0 : calc(value, $ele.height(),$wrap.height());
            case 'width':
                return value <= 0 ? 1 : calc(value, $ele.offset().left, $wrap.width());
            case 'height':
                return value <= 0 ? 1 : calc(value, $ele.offset().top, $wrap.height());
        }
    },
    show: function ($obj) {
        var me = this;
        if ($obj) me.attachTo($obj);
        me.root().bind('mousedown', $.proxy(me._eventHandler, me));
        me.defaultOpt.$doc.bind('mouseup', $.proxy(me._eventHandler, me));
        me.root().show();
        me.trigger("aftershow");
    },
    hide: function () {
        var me = this;
        me.root().unbind('mousedown', $.proxy(me._eventHandler, me));
        me.defaultOpt.$doc.unbind('mouseup', $.proxy(me._eventHandler, me));
        me.root().hide();
        me.trigger('afterhide')
    },
    attachTo: function ($obj) {
        var me = this,
            imgPos = $obj.offset(),
            $root = me.root(),
            $wrap = me.defaultOpt.$wrap,
            posObj = $wrap.offset();

        me.data('$scaleTarget', $obj);
        me.root().css({
            position: 'absolute',
            width: $obj.width(),
            height: $obj.height(),
            left: imgPos.left - posObj.left - parseInt($wrap.css('border-left-width')) - parseInt($root.css('border-left-width')),
            top: imgPos.top - posObj.top - parseInt($wrap.css('border-top-width')) - parseInt($root.css('border-top-width'))
        });
    },
    getScaleTarget: function () {
        return this.data('$scaleTarget')[0];
    }
});
/*********colorpicker部分***********/
//colorpicker 类
UM.ui.define('colorpicker', {
    tpl: function (opt) {
        var COLORS = (
            'ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
                'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
                'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
                'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
                'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
                '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
                'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,').split(',');

        var html = '<div unselectable="on" onmousedown="return false" class="edui-colorpicker<%if (name){%> edui-colorpicker-<%=name%><%}%>" >' +
            '<table unselectable="on" onmousedown="return false">' +
            '<tr><td colspan="10">'+opt.lang_themeColor+'</td> </tr>' +
            '<tr class="edui-colorpicker-firstrow" >';

        for (var i = 0; i < COLORS.length; i++) {
            if (i && i % 10 === 0) {
                html += '</tr>' + (i == 60 ? '<tr><td colspan="10">'+opt.lang_standardColor+'</td></tr>' : '') + '<tr' + (i == 60 ? ' class="edui-colorpicker-firstrow"' : '') + '>';
            }
            html += i < 70 ? '<td><a unselectable="on" onmousedown="return false" title="' + COLORS[i] + '" class="edui-colorpicker-colorcell"' +
                ' data-color="#' + COLORS[i] + '"' +
                ' style="background-color:#' + COLORS[i] + ';border:solid #ccc;' +
                (i < 10 || i >= 60 ? 'border-width:1px;' :
                    i >= 10 && i < 20 ? 'border-width:1px 1px 0 1px;' :
                        'border-width:0 1px 0 1px;') +
                '"' +
                '></a></td>' : '';
        }
        html += '</tr></table></div>';
        return html;
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.supper.mergeTpl(me.tpl(options)),options)));

        me.root().on("click",function (e) {
            me.trigger('pickcolor',  $(e.target).data('color'));
        });
    }
}, 'popup');
/********combobox部分*********/
/**
 * Created with JetBrains PhpStorm.
 * User: hn
 * Date: 13-5-29
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */

(function(){

    var widgetName = 'combobox',
        itemClassName = 'edui-combobox-item',
        HOVER_CLASS = 'edui-combobox-item-hover',
        ICON_CLASS = 'edui-combobox-checked-icon',
        labelClassName = 'edui-combobox-item-label';

    UM.ui.define( widgetName, ( function(){

        return {
            tpl: "<ul class=\"dropdown-menu edui-combobox-menu<%if (comboboxName!=='') {%> edui-combobox-<%=comboboxName%><%}%>\" unselectable=\"on\" onmousedown=\"return false\" role=\"menu\" aria-labelledby=\"dropdownMenu\">" +
                "<%if(autoRecord) {%>" +
                "<%for( var i=0, len = recordStack.length; i<len; i++ ) {%>" +
                "<%var index = recordStack[i];%>" +
                "<li class=\"<%=itemClassName%><%if( selected == index ) {%> edui-combobox-checked<%}%>\" data-item-index=\"<%=index%>\" unselectable=\"on\" onmousedown=\"return false\">" +
                "<span class=\"edui-combobox-icon\" unselectable=\"on\" onmousedown=\"return false\"></span>" +
                "<label class=\"<%=labelClassName%>\" style=\"<%=itemStyles[ index ]%>\" unselectable=\"on\" onmousedown=\"return false\"><%=items[index]%></label>" +
                "</li>" +
                "<%}%>" +
                "<%if( i ) {%>" +
                "<li class=\"edui-combobox-item-separator\"></li>" +
                "<%}%>" +
                "<%}%>" +
                "<%for( var i=0, label; label = items[i]; i++ ) {%>" +
                "<li class=\"<%=itemClassName%><%if( selected == i ) {%> edui-combobox-checked<%}%> edui-combobox-item-<%=i%>\" data-item-index=\"<%=i%>\" unselectable=\"on\" onmousedown=\"return false\">" +
                "<span class=\"edui-combobox-icon\" unselectable=\"on\" onmousedown=\"return false\"></span>" +
                "<label class=\"<%=labelClassName%>\" style=\"<%=itemStyles[ i ]%>\" unselectable=\"on\" onmousedown=\"return false\"><%=label%></label>" +
                "</li>" +
                "<%}%>" +
                "</ul>",
            defaultOpt: {
                //记录栈初始列表
                recordStack: [],
                //可用项列表
                items: [],
		        //item对应的值列表
                value: [],
                comboboxName: '',
                selected: '',
                //自动记录
                autoRecord: true,
                //最多记录条数
                recordCount: 5
            },
            init: function( options ){

                var me = this;

                $.extend( me._optionAdaptation( options ), me._createItemMapping( options.recordStack, options.items ), {
                    itemClassName: itemClassName,
                    iconClass: ICON_CLASS,
                    labelClassName: labelClassName
                } );

                this._transStack( options );

                me.root( $( $.parseTmpl( me.tpl, options ) ) );

                this.data( 'options', options ).initEvent();

            },
            initEvent: function(){

                var me = this;

                me.initSelectItem();

                this.initItemActive();

            },
            /**
             * 初始化选择项
             */
            initSelectItem: function(){

                var me = this,
                    labelClass = "."+labelClassName;

                me.root().delegate('.' + itemClassName, 'click', function(){

                    var $li = $(this),
                        index = $li.attr('data-item-index');

                    me.trigger('comboboxselect', {
                        index: index,
                        label: $li.find(labelClass).text(),
                        value: me.data('options').value[ index ]
                    }).select( index );

                    me.hide();

                    return false;

                });

            },
            initItemActive: function(){
                var fn = {
                    mouseenter: 'addClass',
                    mouseleave: 'removeClass'
                };
                if ($.IE6) {
                    this.root().delegate( '.'+itemClassName,  'mouseenter mouseleave', function( evt ){
                        $(this)[ fn[ evt.type ] ]( HOVER_CLASS );
                    }).one('afterhide', function(){
                    });
                }
            },
            /**
             * 选择给定索引的项
             * @param index 项索引
             * @returns {*} 如果存在对应索引的项，则返回该项；否则返回null
             */
            select: function( index ){

                var itemCount = this.data('options').itemCount,
                    items = this.data('options').autowidthitem;

                if ( items && !items.length ) {
                    items = this.data('options').items;
                }

                if( itemCount == 0 ) {
                    return null;
                }

                if( index < 0 ) {

                    index = itemCount + index % itemCount;

                } else if ( index >= itemCount ) {

                    index = itemCount-1;

                }

                this.trigger( 'changebefore', items[ index ] );

                this._update( index );

                this.trigger( 'changeafter', items[ index ] );

                return null;

            },
            selectItemByLabel: function( label ){

                var itemMapping = this.data('options').itemMapping,
                    me = this,
                    index = null;

                !$.isArray( label ) && ( label = [ label ] );

                $.each( label, function( i, item ){

                    index = itemMapping[ item ];

                    if( index !== undefined ) {

                        me.select( index );
                        return false;

                    }

                } );

            },
            /**
             * 转换记录栈
             */
            _transStack: function( options ) {

                var temp = [],
                    itemIndex = -1,
                    selected = -1;

                $.each( options.recordStack, function( index, item ){

                    itemIndex = options.itemMapping[ item ];

                    if( $.isNumeric( itemIndex ) ) {

                        temp.push( itemIndex );

                        //selected的合法性检测
                        if( item == options.selected ) {
                            selected = itemIndex;
                        }

                    }

                } );

                options.recordStack = temp;
                options.selected = selected;
                temp = null;

            },
            _optionAdaptation: function( options ) {

                if( !( 'itemStyles' in options ) ) {

                    options.itemStyles = [];

                    for( var i = 0, len = options.items.length; i < len; i++ ) {
                        options.itemStyles.push('');
                    }

                }

                options.autowidthitem = options.autowidthitem || options.items;
                options.itemCount = options.items.length;

                return options;

            },
            _createItemMapping: function( stackItem, items ){

                var temp = {},
                    result = {
                        recordStack: [],
                        mapping: {}
                    };

                $.each( items, function( index, item ){
                    temp[ item ] = index;
                } );

                result.itemMapping = temp;

                $.each( stackItem, function( index, item ){

                    if( temp[ item ] !== undefined ) {
                        result.recordStack.push( temp[ item ] );
                        result.mapping[ item ] = temp[ item ];
                    }

                } );

                return result;

            },
            _update: function ( index ) {

                var options = this.data("options"),
                    newStack = [],
                    newChilds = null;

                $.each( options.recordStack, function( i, item ){

                    if( item != index ) {
                        newStack.push( item );
                    }

                } );

                //压入最新的记录
                newStack.unshift( index );

                if( newStack.length > options.recordCount ) {
                    newStack.length = options.recordCount;
                }

                options.recordStack = newStack;
                options.selected = index;

                newChilds = $( $.parseTmpl( this.tpl, options ) );

                //重新渲染
                this.root().html( newChilds.html() );

                newChilds = null;
                newStack = null;

            }
        };

    } )(), 'menu' );

})();
/***********buttoncombobox部分*************/
/**
 * Combox 抽象基类
 * User: hn
 * Date: 13-5-29
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */

(function(){

    var widgetName = 'buttoncombobox';

    UM.ui.define( widgetName, ( function(){

        return {
            defaultOpt: {
                //按钮初始文字
                label: '',
                title: ''
            },
            init: function( options ) {

                var me = this;

                var btnWidget = $.eduibutton({
                    caret: true,
                    name: options.comboboxName,
                    title: options.title,
                    text: options.label,
                    click: function(){
                        me.show( this.root() );
                    }
                });

                me.supper.init.call( me, options );

                //监听change， 改变button显示内容
                me.on('changebefore', function( e, label ){
                    btnWidget.eduibutton('label', label );
                });

                me.data( 'button', btnWidget );

                me.attachTo(btnWidget)

            },
            button: function(){
                return this.data( 'button' );
            }
        }

    } )(), 'combobox' );

})();
/*********modal部分**********/
/*modal 类*/
UM.ui.define('modal', {
    tpl: '<div class="edui-modal" tabindex="-1" >' +
        '<div class="edui-modal-header">' +
        '<div class="edui-close" data-hide="modal"></div>' +
        '<h3 class="edui-title"><%=title%></h3>' +
        '</div>' +
        '<div class="edui-modal-body"  style="<%if(width){%>width:<%=width%>px;<%}%>' +
        '<%if(height){%>height:<%=height%>px;<%}%>">' +
        ' </div>' +
        '<% if(cancellabel || oklabel) {%>' +
        '<div class="edui-modal-footer">' +
        '<div class="edui-modal-tip"></div>' +
        '<%if(oklabel){%><div class="edui-btn edui-btn-primary" data-ok="modal"><%=oklabel%></div><%}%>' +
        '<%if(cancellabel){%><div class="edui-btn" data-hide="modal"><%=cancellabel%></div><%}%>' +
        '</div>' +
        '<%}%></div>',
    defaultOpt: {
        title: "",
        cancellabel: "",
        oklabel: "",
        width: '',
        height: '',
        backdrop: true,
        keyboard: true
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options || {})));

        me.data("options", options);
        if (options.okFn) {
            me.on('ok', $.proxy(options.okFn, me))
        }
        if (options.cancelFn) {
            me.on('beforehide', $.proxy(options.cancelFn, me))
        }

        me.root().delegate('[data-hide="modal"]', 'click', $.proxy(me.hide, me))
            .delegate('[data-ok="modal"]', 'click', $.proxy(me.ok, me));

        $('[data-hide="modal"],[data-ok="modal"]',me.root()).hover(function(){
            $(this).toggleClass('edui-hover')
        });
    },
    toggle: function () {
        var me = this;
        return me[!me.data("isShown") ? 'show' : 'hide']();
    },
    show: function () {

        var me = this;

        me.trigger("beforeshow");

        if (me.data("isShown")) return;

        me.data("isShown", true);

        me.escape();

        me.backdrop(function () {
            me.autoCenter();
            me.root()
                .show()
                .focus()
                .trigger('aftershow');
        })
    },
    showTip: function ( text ) {
        $( '.edui-modal-tip', this.root() ).html( text ).fadeIn();
    },
    hideTip: function ( text ) {
        $( '.edui-modal-tip', this.root() ).fadeOut( function (){
            $(this).html('');
        } );
    },
    autoCenter: function () {
        //ie6下不用处理了
        !$.IE6 && this.root().css("margin-left", -(this.root().width() / 2));
    },
    hide: function () {
        var me = this;

        me.trigger("beforehide");

        if (!me.data("isShown")) return;

        me.data("isShown", false);

        me.escape();

        me.hideModal();
    },
    escape: function () {
        var me = this;
        if (me.data("isShown") && me.data("options").keyboard) {
            me.root().on('keyup', function (e) {
                e.which == 27 && me.hide();
            })
        }
        else if (!me.data("isShown")) {
            me.root().off('keyup');
        }
    },
    hideModal: function () {
        var me = this;
        me.root().hide();
        me.backdrop(function () {
            me.removeBackdrop();
            me.trigger('afterhide');
        })
    },
    removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    },
    backdrop: function (callback) {
        var me = this;
        if (me.data("isShown") && me.data("options").backdrop) {
            me.$backdrop = $('<div class="edui-modal-backdrop" />').click(
                me.data("options").backdrop == 'static' ?
                    $.proxy(me.root()[0].focus, me.root()[0])
                    : $.proxy(me.hide, me)
            )
        }
        me.trigger('afterbackdrop');
        callback && callback();

    },
    attachTo: function ($obj) {
        var me = this
        if (!$obj.data('$mergeObj')) {

            $obj.data('$mergeObj', me.root());
            $obj.on('click', function () {
                me.toggle($obj)
            });
            me.data('$mergeObj', $obj)
        }
    },
    ok: function () {
        var me = this;
        me.trigger('beforeok');
        if (me.trigger("ok", me) === false) {
            return;
        }
        me.hide();
    },
    getBodyContainer: function () {
        return this.root().find('.edui-modal-body')
    }
});

/**********tooltip部分*********/
/*tooltip 类*/
UM.ui.define('tooltip', {
    tpl: '<div class="edui-tooltip" unselectable="on" onmousedown="return false">' +
        '<div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div>' +
        '<div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div>' +
        '</div>',
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options || {})));
    },
    content: function (e) {
        var me = this,
            title = $(e.currentTarget).attr("data-original-title");

        me.root().find('.edui-tooltip-inner')['text'](title);
    },
    position: function (e) {
        var me = this,
            $obj = $(e.currentTarget);

        me.root().css($.extend({display: 'block'}, $obj ? {
            top: $obj.outerHeight(),
            left: (($obj.outerWidth() - me.root().outerWidth()) / 2)
        } : {}))
    },
    show: function (e) {
        if ($(e.currentTarget).hasClass('edui-disabled')) return;

        var me = this;
        me.content(e);
        me.root().appendTo($(e.currentTarget));
        me.position(e);
        me.root().css('display', 'block');
    },
    hide: function () {
        var me = this;
        me.root().css('display', 'none')
    },
    attachTo: function ($obj) {
        var me = this;

        function tmp($obj) {
            var me = this;

            if (!$.contains(document.body, me.root()[0])) {
                me.root().appendTo($obj);
            }

            me.data('tooltip', me.root());

            $obj.each(function () {
                if ($(this).attr("data-original-title")) {
                    $(this).on('mouseenter', $.proxy(me.show, me))
                        .on('mouseleave click', $.proxy(me.hide, me))

                }
            });

        }

        if ($.type($obj) === "undefined") {
            $("[data-original-title]").each(function (i, el) {
                tmp.call(me, $(el));
            })

        } else {
            if (!$obj.data('tooltip')) {
                tmp.call(me, $obj);
            }
        }
    }
});
/*********tab部分***********/
/*tab 类*/
UM.ui.define('tab', {
    init: function (options) {
        var me = this,
            slr = options.selector;

        if ($.type(slr)) {
            me.root($(slr, options.context));
            me.data("context", options.context);

            $(slr, me.data("context")).on('click', function (e) {
                me.show(e);
            });
        }
    },
    show: function (e) {

        var me = this,
            $cur = $(e.target),
            $ul = $cur.closest('ul'),
            selector,
            previous,
            $target,
            e;

        selector = $cur.attr('data-context');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');

        var $tmp = $cur.parent('li');

        if (!$tmp.length || $tmp.hasClass('edui-active')) return;

        previous = $ul.find('.edui-active:last a')[0];

        e = $.Event('beforeshow', {
            target: $cur[0],
            relatedTarget: previous
        });

        me.trigger(e);

        if (e.isDefaultPrevented()) return;

        $target = $(selector, me.data("context"));

        me.activate($cur.parent('li'), $ul);
        me.activate($target, $target.parent(), function () {
            me.trigger({
                type: 'aftershow', relatedTarget: previous
            })
        });
    },
    activate: function (element, container, callback) {
        if (element === undefined) {
            return $(".edui-tab-item.edui-active",this.root()).index();
        }

        var $active = container.find('> .edui-active');

        $active.removeClass('edui-active');

        element.addClass('edui-active');

        callback && callback();
    }
});

/************separator部分*************/
//button 类
UM.ui.define('separator', {
    tpl: '<div class="edui-separator" unselectable="on" onmousedown="return false" ></div>',
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        return me;
    }
});