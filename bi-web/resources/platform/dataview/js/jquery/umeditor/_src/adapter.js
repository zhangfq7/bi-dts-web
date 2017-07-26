/****adapter部分*****/
/**
 * @file adapter.js
 * @desc adapt ui to editor
 * @import core/Editor.js, core/utils.js
 */

(function () {
    var _editorUI = {},
        _editors = {},
        _readyFn = [],
        _activeWidget = null,
        _widgetData = {},
        _widgetCallBack = {},
        _cacheUI = {},
        _maxZIndex = null;

    utils.extend(UM, {
        defaultWidth : 500,
        defaultHeight : 500,
        registerUI: function (name, fn) {
            utils.each(name.split(/\s+/), function (uiname) {
                _editorUI[uiname] = fn;
            })
        },

        setEditor : function(editor){
            !_editors[editor.id] && (_editors[editor.id] = editor);
        },
        registerWidget : function(name,pro,cb){
            _widgetData[name] = $.extend2(pro,{
                $root : '',
                _preventDefault:false,
                root:function($el){
                    return this.$root || (this.$root = $el);
                },
                preventDefault:function(){
                    this._preventDefault = true;
                },
                clear:false
            });
            if(cb){
                _widgetCallBack[name] = cb;
            }
        },
        getWidgetData : function(name){
            return _widgetData[name]
        },
        setWidgetBody : function(name,$widget,editor){
            if(!editor._widgetData){

                utils.extend(editor,{
                    _widgetData : {},
                    getWidgetData : function(name){
                        return this._widgetData[name];
                    },
                    getWidgetCallback : function(widgetName){
                        var me = this;
                        return function(){
                            return  _widgetCallBack[widgetName].apply(me,[me,$widget].concat(Array.prototype.slice.call(arguments,0)))
                        }
                    }
                })

            }
            var pro = _widgetData[name];
            if(!pro){
                return null;
            }
            pro = editor._widgetData[name];
            if(!pro){
                pro = _widgetData[name];
                pro = editor._widgetData[name] = $.type(pro) == 'function' ? pro : utils.clone(pro);
            }

            pro.root($widget.edui().getBodyContainer());

            pro.initContent(editor,$widget);
            if(!pro._preventDefault){
                pro.initEvent(editor,$widget);
            }

            pro.width &&  $widget.width(pro.width);


        },
        setActiveWidget : function($widget){
            _activeWidget = $widget;
        },
        getEditor: function (id, options) {
            var editor = _editors[id] || (_editors[id] = this.createEditor(id, options));
            _maxZIndex = _maxZIndex ? Math.max(editor.getOpt('zIndex'), _maxZIndex):editor.getOpt('zIndex');
            return editor;
        },
        setTopEditor: function(editor){
            $.each(_editors, function(i, o){
                if(editor == o) {
                    editor.$container && editor.$container.css('zIndex', _maxZIndex + 1);
                } else {
                    o.$container && o.$container.css('zIndex', o.getOpt('zIndex'));
                }
            });
        },
        clearCache : function(id){
            if ( _editors[id]) {
                delete  _editors[id]
            }
        },
        delEditor: function (id) {
            var editor;
            if (editor = _editors[id]) {
                editor.destroy();
            }
        },
        ready: function( fn ){
            _readyFn.push( fn );
        },
        createEditor: function (id, opt) {
            var editor = new UM.Editor(opt);
            var T = this;

            editor.langIsReady ? $.proxy(renderUI,T)() : editor.addListener("langReady", $.proxy(renderUI,T));
            function renderUI(){


                var $container = this.createUI('#' + id, editor);
                editor.key=id;
                editor.ready(function(){
                    $.each( _readyFn, function( index, fn ){
                        $.proxy( fn, editor )();
                    } );
                });
                var options = editor.options;
                if(options.initialFrameWidth){
                    options.minFrameWidth = options.initialFrameWidth
                }else{
                    options.minFrameWidth = options.initialFrameWidth = editor.$body.width() || UM.defaultWidth;
                }

                $container.css({
                    width: options.initialFrameWidth,
                    zIndex:editor.getOpt('zIndex')
                });

                //ie6下缓存图片
                UM.browser.ie && UM.browser.version === 6 && document.execCommand("BackgroundImageCache", false, true);

                editor.render(id);


                //添加tooltip;
                $.eduitooltip && $.eduitooltip('attachTo', $("[data-original-title]",$container)).css('z-index',editor.getOpt('zIndex')+1);

                $container.find('a').click(function(evt){
                    evt.preventDefault()
                });

                editor.fireEvent("afteruiready");
            }

            return editor;

        },
        createUI: function (id, editor) {
            var $editorCont = $(id),
                $container = $('<div class="edui-container"><div class="edui-editor-body"></div></div>').insertBefore($editorCont);
            editor.$container = $container;
            editor.container = $container[0];

            editor.$body = $editorCont;

            //修正在ie9+以上的版本中，自动长高收起时的，残影问题
            if(browser.ie && browser.ie9above){
                var $span = $('<span style="padding:0;margin:0;height:0;width:0"></span>');
                $span.insertAfter($container);
            }
            //初始化注册的ui组件
            $.each(_editorUI,function(n,v){
                var widget = v.call(editor,n);
                if(widget){
                    _cacheUI[n] = widget;
                }

            });

            $container.find('.edui-editor-body').append($editorCont).before(this.createToolbar(editor.options, editor));

            $container.find('.edui-toolbar').append($('<div class="edui-dialog-container"></div>'));


            return $container;
        },
        createToolbar: function (options, editor) {
            var $toolbar = $.eduitoolbar(), toolbar = $toolbar.edui();
            //创建下来菜单列表

            if (options.toolbar && options.toolbar.length) {
                var btns = [];
                $.each(options.toolbar,function(i,uiNames){
                    $.each(uiNames.split(/\s+/),function(index,name){
                        if(name == '|'){
                                $.eduiseparator && btns.push($.eduiseparator());
                        }else{
                            var ui = _cacheUI[name];
                            if(name=="fullscreen"){
                                ui&&btns.unshift(ui);
                            }else{
                                ui && btns.push(ui);
                            }
                        }

                    });
                    btns.length && toolbar.appendToBtnmenu(btns);
                });
            } else {
                $toolbar.find('.edui-btn-toolbar').remove()
            }
            return $toolbar;
        }

    })


})();


/********button部分********/
UM.registerUI('bold italic redo undo underline strikethrough superscript subscript insertorderedlist insertunorderedlist ' +
    'cleardoc selectall link unlink print preview justifyleft justifycenter justifyright justifyfull removeformat horizontal drafts',
    function(name) {
        var me = this;
        var $btn = $.eduibutton({
            icon : name,
            click : function(){
                me.execCommand(name);
            },
            title: this.getLang('labelMap')[name] || ''
        });

        this.addListener('selectionchange',function(){
            var state = this.queryCommandState(name);
            $btn.edui().disabled(state == -1).active(state == 1)
        });
        return $btn;
    }
);

/**************fullscreen部分******************/
/**
 * 全屏组件
 */

(function(){

    //状态缓存
    var STATUS_CACHE = {},
    //状态值列表
        STATUS_LIST = [ 'width', 'height', 'position', 'top', 'left', 'margin', 'padding', 'overflowX', 'overflowY' ],
        CONTENT_AREA_STATUS = {},
    //页面状态
        DOCUMENT_STATUS = {},
        DOCUMENT_ELEMENT_STATUS = {},

        FULLSCREENS = {};


    UM.registerUI('fullscreen', function( name ){

        var me = this,
            $button = $.eduibutton({
                'icon': 'fullscreen',
                'title': (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
                'click': function(){
                    //切换
                    me.execCommand( name );
                    UM.setTopEditor(me);
                }
            });

        me.addListener( "selectionchange", function () {

            var state = this.queryCommandState( name );
            $button.edui().disabled( state == -1 ).active( state == 1 );

        } );

        //切换至全屏
        me.addListener('ready', function(){

            me.options.fullscreen && Fullscreen.getInstance( me ).toggle();

        });

        return $button;

    });

    UM.commands[ 'fullscreen' ] = {

        execCommand: function (cmdName) {

            Fullscreen.getInstance( this ).toggle();

        },
        queryCommandState: function (cmdName) {

            return this._edui_fullscreen_status;
        },
        notNeedUndo: 1

    };

    function Fullscreen( editor ) {

        var me = this;

        if( !editor ) {
            throw new Error('invalid params, notfound editor');
        }

        me.editor = editor;

        //记录初始化的全屏组件
        FULLSCREENS[ editor.uid ] = this;

        editor.addListener('destroy', function(){
            delete FULLSCREENS[ editor.uid ];
            me.editor = null;
        });

    }

    Fullscreen.prototype = {

        /**
         * 全屏状态切换
         */
        toggle: function(){

            var editor = this.editor,
            //当前编辑器的缩放状态
                _edui_fullscreen_status = this.isFullState();
            editor.fireEvent('beforefullscreenchange', !_edui_fullscreen_status );

            //更新状态
            this.update( !_edui_fullscreen_status );

            !_edui_fullscreen_status ? this.enlarge() : this.revert();

            editor.fireEvent('afterfullscreenchange', !_edui_fullscreen_status );
            if(editor.body.contentEditable === 'true'){
                editor.fireEvent( 'fullscreenchanged', !_edui_fullscreen_status );
            }

            editor.fireEvent( 'selectionchange' );

        },
        /**
         * 执行放大
         */
        enlarge: function(){

            this.saveSataus();

            this.setDocumentStatus();

            this.resize();

        },
        /**
         * 全屏还原
         */
        revert: function(){

            //还原CSS表达式
            var options = this.editor.options,
                height = /%$/.test(options.initialFrameHeight) ?  '100%' : (options.initialFrameHeight - this.getStyleValue("padding-top")- this.getStyleValue("padding-bottom") - this.getStyleValue('border-width'));

            $.IE6 && this.getEditorHolder().style.setExpression('height', 'this.scrollHeight <= ' + height + ' ? "' + height + 'px" : "auto"');

            //还原容器状态
            this.revertContainerStatus();

            this.revertContentAreaStatus();

            this.revertDocumentStatus();

        },
        /**
         * 更新状态
         * @param isFull 当前状态是否是全屏状态
         */
        update: function( isFull ) {
            this.editor._edui_fullscreen_status = isFull;
        },
        /**
         * 调整当前编辑器的大小, 如果当前编辑器不处于全屏状态， 则不做调整
         */
        resize: function(){

            var $win = null,
                height = 0,
                width = 0,
                borderWidth = 0,
                paddingWidth = 0,
                editor = this.editor,
                me = this,
                bound = null,
                editorBody = null;

            if( !this.isFullState() ) {
                return;
            }

            $win = $( window );
            width = $win.width();
            height = $win.height();
            editorBody = this.getEditorHolder();
            //文本编辑区border宽度
            borderWidth = parseInt( domUtils.getComputedStyle( editorBody, 'border-width' ), 10 ) || 0;
            //容器border宽度
            borderWidth += parseInt( domUtils.getComputedStyle( editor.container, 'border-width' ), 10 ) || 0;
            //容器padding
            paddingWidth += parseInt( domUtils.getComputedStyle( editorBody, 'padding-left' ), 10 ) + parseInt( domUtils.getComputedStyle( editorBody, 'padding-right' ), 10 ) || 0;

            //干掉css表达式
            $.IE6 && editorBody.style.setExpression( 'height', null );

            bound = this.getBound();

            $( editor.container ).css( {
                width: width + 'px',
                height: height + 'px',
                position: !$.IE6 ? 'fixed' : 'absolute',
                top: bound.top,
                left: bound.left,
                margin: 0,
                padding: 0,
                overflowX: 'hidden',
                overflowY: 'hidden'
            } );

            $( editorBody ).css({
                width: width - 2*borderWidth - paddingWidth + 'px',
                height: height - 2*borderWidth - ( editor.options.withoutToolbar ? 0 : $( '.edui-toolbar', editor.container ).outerHeight() ) - $( '.edui-bottombar', editor.container).outerHeight() + 'px',
                overflowX: 'hidden',
                overflowY: 'auto'
            });

        },
        /**
         * 保存状态
         */
        saveSataus: function(){

            var styles = this.editor.container.style,
                tmp = null,
                cache = {};

            for( var i= 0, len = STATUS_LIST.length; i<len; i++ ) {

                tmp = STATUS_LIST[ i ];
                cache[ tmp ] = styles[ tmp ];

            }

            STATUS_CACHE[ this.editor.uid ] = cache;

            this.saveContentAreaStatus();
            this.saveDocumentStatus();

        },
        saveContentAreaStatus: function(){

            var $holder = $(this.getEditorHolder());

            CONTENT_AREA_STATUS[ this.editor.uid ] = {
                width: $holder.css("width"),
                overflowX: $holder.css("overflowX"),
                overflowY: $holder.css("overflowY"),
                height: $holder.css("height")
            };

        },
        /**
         * 保存与指定editor相关的页面的状态
         */
        saveDocumentStatus: function(){

            var $doc = $( this.getEditorDocumentBody() );

            DOCUMENT_STATUS[ this.editor.uid ] = {
                overflowX: $doc.css( 'overflowX' ),
                overflowY: $doc.css( 'overflowY' )
            };
            DOCUMENT_ELEMENT_STATUS[ this.editor.uid ] = {
                overflowX: $( this.getEditorDocumentElement() ).css( 'overflowX'),
                overflowY: $( this.getEditorDocumentElement() ).css( 'overflowY' )
            };

        },
        /**
         * 恢复容器状态
         */
        revertContainerStatus: function(){
            $( this.editor.container ).css( this.getEditorStatus() );
        },
        /**
         * 恢复编辑区状态
         */
        revertContentAreaStatus: function(){
            var holder = this.getEditorHolder(),
                state = this.getContentAreaStatus();

            if ( this.supportMin() ) {
                delete state.height;
                holder.style.height = null;
            }

            $( holder ).css( state );
        },
        /**
         * 恢复页面状态
         */
        revertDocumentStatus: function() {

            var status = this.getDocumentStatus();
            $( this.getEditorDocumentBody() ).css( 'overflowX', status.body.overflowX );
            $( this.getEditorDocumentElement() ).css( 'overflowY', status.html.overflowY );

        },
        setDocumentStatus: function(){
            $(this.getEditorDocumentBody()).css( {
                overflowX: 'hidden',
                overflowY: 'hidden'
            } );
            $(this.getEditorDocumentElement()).css( {
                overflowX: 'hidden',
                overflowY: 'hidden'
            } );
        },
        /**
         * 检测当前编辑器是否处于全屏状态全屏状态
         * @returns {boolean} 是否处于全屏状态
         */
        isFullState: function(){
            return !!this.editor._edui_fullscreen_status;
        },
        /**
         * 获取编辑器状态
         */
        getEditorStatus: function(){
            return STATUS_CACHE[ this.editor.uid ];
        },
        getContentAreaStatus: function(){
            return CONTENT_AREA_STATUS[ this.editor.uid ];
        },
        getEditorDocumentElement: function(){
            return this.editor.container.ownerDocument.documentElement;
        },
        getEditorDocumentBody: function(){
            return this.editor.container.ownerDocument.body;
        },
        /**
         * 获取编辑区包裹对象
         */
        getEditorHolder: function(){
            return this.editor.body;
        },
        /**
         * 获取编辑器状态
         * @returns {*}
         */
        getDocumentStatus: function(){
            return {
                'body': DOCUMENT_STATUS[ this.editor.uid ],
                'html': DOCUMENT_ELEMENT_STATUS[ this.editor.uid ]
            };
        },
        supportMin: function () {

            var node = null;

            if ( !this._support ) {

                node = document.createElement("div");

                this._support = "minWidth" in node.style;

                node = null;

            }

            return this._support;

        },
        getBound: function () {

            var tags = {
                    html: true,
                    body: true
                },
                result = {
                    top: 0,
                    left: 0
                },
                offsetParent = null;

            if ( !$.IE6 ) {
                return result;
            }

            offsetParent = this.editor.container.offsetParent;

            if( offsetParent && !tags[ offsetParent.nodeName.toLowerCase() ] ) {
                tags = offsetParent.getBoundingClientRect();
                result.top = -tags.top;
                result.left = -tags.left;
            }

            return result;

        },
        getStyleValue: function (attr) {
            return parseInt(domUtils.getComputedStyle( this.getEditorHolder() ,attr));
        }
    };


    $.extend( Fullscreen, {
        /**
         * 监听resize
         */
        listen: function(){

            var timer = null;

            if( Fullscreen._hasFullscreenListener ) {
                return;
            }

            Fullscreen._hasFullscreenListener = true;

            $( window ).on( 'resize', function(){

                if( timer !== null ) {
                    window.clearTimeout( timer );
                    timer = null;
                }

                timer = window.setTimeout(function(){

                    for( var key in FULLSCREENS ) {
                        FULLSCREENS[ key ].resize();
                    }

                    timer = null;

                }, 50);

            } );

        },

        getInstance: function ( editor ) {

            if ( !FULLSCREENS[editor.uid  ] ) {
                new Fullscreen( editor );
            }

            return FULLSCREENS[editor.uid  ];

        }

    });

    //开始监听
    Fullscreen.listen();

})();
/********dialog部分**********/
UM.registerUI('link image video map formula',function(name){

    var me = this, currentRange, $dialog,
        opt = {
            title: (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
            url: me.options.UMEDITOR_HOME_URL + 'dialogs/' + name + '/' + name + '.js'
        };

    var $btn = $.eduibutton({
        icon: name,
        title: this.getLang('labelMap')[name] || ''
    });
    //加载模版数据
    utils.loadFile(document,{
        src: opt.url,
        tag: "script",
        type: "text/javascript",
        defer: "defer"
    },function(){
        //调整数据
        var data = UM.getWidgetData(name);
        if(!data) return;
        if(data.buttons){
            var ok = data.buttons.ok;
            if(ok){
                opt.oklabel = ok.label || me.getLang('ok');
                if(ok.exec){
                    opt.okFn = function(){
                        return $.proxy(ok.exec,null,me,$dialog)()
                    }
                }
            }
            var cancel = data.buttons.cancel;
            if(cancel){
                opt.cancellabel = cancel.label || me.getLang('cancel');
                if(cancel.exec){
                    opt.cancelFn = function(){
                        return $.proxy(cancel.exec,null,me,$dialog)()
                    }
                }
            }
        }
        data.width && (opt.width = data.width);
        data.height && (opt.height = data.height);

        $dialog = $.eduimodal(opt);

        $dialog.attr('id', 'edui-dialog-' + name).addClass('edui-dialog-' + name)
            .find('.edui-modal-body').addClass('edui-dialog-' + name + '-body');

        $dialog.edui().on('beforehide',function () {
            var rng = me.selection.getRange();
            if (rng.equals(currentRange)) {
                rng.select()
            }
        }).on('beforeshow', function () {
                var $root = this.root(),
                    win = null,
                    offset = null;
                currentRange = me.selection.getRange();
                if (!$root.parent()[0]) {
                    me.$container.find('.edui-dialog-container').append($root);
                }

                //IE6下 特殊处理, 通过计算进行定位
                if( $.IE6 ) {

                    win = {
                        width: $( window ).width(),
                        height: $( window ).height()
                    };
                    offset = $root.parents(".edui-toolbar")[0].getBoundingClientRect();
                    $root.css({
                        position: 'absolute',
                        margin: 0,
                        left: ( win.width - $root.width() ) / 2 - offset.left,
                        top: 100 - offset.top
                    });

                }
                UM.setWidgetBody(name,$dialog,me);
                UM.setTopEditor(me);
        }).on('afterbackdrop',function(){
            this.$backdrop.css('zIndex',me.getOpt('zIndex')+1).appendTo(me.$container.find('.edui-dialog-container'))
            $dialog.css('zIndex',me.getOpt('zIndex')+2)
        }).on('beforeok',function(){
            try{
                currentRange.select()
            }catch(e){}
        }).attachTo($btn)
    });




    me.addListener('selectionchange', function () {
        var state = this.queryCommandState(name);
        $btn.edui().disabled(state == -1).active(state == 1)
    });
    return $btn;
});
/*****popup部分******/
UM.registerUI( 'emotion formula', function( name ){
    var me = this,
        url  = me.options.UMEDITOR_HOME_URL + 'dialogs/' +name+ '/'+name+'.js';

    var $btn = $.eduibutton({
        icon: name,
        title: this.getLang('labelMap')[name] || ''
    });

    //加载模版数据
    utils.loadFile(document,{
        src: url,
        tag: "script",
        type: "text/javascript",
        defer: "defer"
    },function(){
        var opt = {
            url : url
        };
        //调整数据
        var data = UM.getWidgetData(name);

        data.width && (opt.width = data.width);
        data.height && (opt.height = data.height);

        $.eduipopup(opt).css('zIndex',me.options.zIndex + 1)
            .addClass('edui-popup-' + name)
            .edui()
            .on('beforeshow',function(){
                var $root = this.root();
                if(!$root.parent().length){
                    me.$container.find('.edui-dialog-container').append($root);
                }
                UM.setWidgetBody(name,$root,me);
                UM.setTopEditor(me);
            }).attachTo($btn,{
                offsetTop:-5,
                offsetLeft:10,
                caretLeft:11,
                caretTop:-8
            });
        me.addListener('selectionchange', function () {
            var state = this.queryCommandState(name);
            $btn.edui().disabled(state == -1).active(state == 1);
        });
    });
    return $btn;

} );

/******imagescalse部分********/
UM.registerUI('imagescale',function () {
    var me = this,
        $imagescale;

    me.setOpt('imageScaleEnabled', true);

    if (browser.webkit && me.getOpt('imageScaleEnabled')) {

        me.addListener('click', function (type, e) {
            var range = me.selection.getRange(),
                img = range.getClosedNode(),
                target = e.target;

            /* 点击第一个图片的后面,八个角不消失 fix:3652 */
            if (img && img.tagName == 'IMG' && target == img) {

                if (!$imagescale) {
                    $imagescale = $.eduiscale({'$wrap':me.$container}).css('zIndex', me.options.zIndex);
                    me.$container.append($imagescale);

                    var _keyDownHandler = function () {
                        $imagescale.edui().hide();
                    }, _mouseDownHandler = function (e) {
                        var ele = e.target || e.srcElement;
                        if (ele && ele.className.indexOf('edui-scale') == -1) {
                            _keyDownHandler(e);
                        }
                    }, timer;

                    $imagescale.edui()
                        .on('aftershow', function () {
                            $(document).bind('keydown', _keyDownHandler);
                            $(document).bind('mousedown', _mouseDownHandler);
                            me.selection.getNative().removeAllRanges();
                        })
                        .on('afterhide', function () {
                            $(document).unbind('keydown', _keyDownHandler);
                            $(document).unbind('mousedown', _mouseDownHandler);
                            var target = $imagescale.edui().getScaleTarget();
                            if (target.parentNode) {
                                me.selection.getRange().selectNode(target).select();
                            }
                        })
                        .on('mousedown', function (e) {
                            me.selection.getNative().removeAllRanges();
                            var ele = e.target || e.srcElement;
                            if (ele && ele.className.indexOf('edui-scale-hand') == -1) {
                                timer = setTimeout(function() {
                                    $imagescale.edui().hide();
                                }, 200);
                            }
                        })
                        .on('mouseup', function (e) {
                            var ele = e.target || e.srcElement;
                            if (ele && ele.className.indexOf('edui-scale-hand') == -1) {
                                clearTimeout(timer);
                            }
                        });
                }
                $imagescale.edui().show($(img));

            } else {
                if ($imagescale && $imagescale.css('display') != 'none') $imagescale.edui().hide();

            }
        });

        me.addListener('click', function (type, e) {
            if (e.target.tagName == 'IMG') {
                var range = new dom.Range(me.document, me.body);
                range.selectNode(e.target).select();
            }
        });

    }
});
/*********autofloat部分*********/
UM.registerUI('autofloat',function(){
    var me = this,
        lang = me.getLang();
    me.setOpt({
        autoFloatEnabled: true,
        topOffset: 0
    });
    var optsAutoFloatEnabled = me.options.autoFloatEnabled !== false,
        topOffset = me.options.topOffset;


    //如果不固定toolbar的位置，则直接退出
    if(!optsAutoFloatEnabled){
        return;
    }
    me.ready(function(){
        var LteIE6 = browser.ie && browser.version <= 6,
            quirks = browser.quirks;

        function checkHasUI(){
            if(!UM.ui){
                alert(lang.autofloatMsg);
                return 0;
            }
            return 1;
        }
        function fixIE6FixedPos(){
            var docStyle = document.body.style;
            docStyle.backgroundImage = 'url("about:blank")';
            docStyle.backgroundAttachment = 'fixed';
        }
        var	bakCssText,
            placeHolder = document.createElement('div'),
            toolbarBox,orgTop,
            getPosition=function(element){
                var bcr;
                //trace  IE6下在控制编辑器显隐时可能会报错，catch一下
                try{
                    bcr = element.getBoundingClientRect();
                }catch(e){
                    bcr={left:0,top:0,height:0,width:0}
                }
                var rect = {
                    left: Math.round(bcr.left),
                    top: Math.round(bcr.top),
                    height: Math.round(bcr.bottom - bcr.top),
                    width: Math.round(bcr.right - bcr.left)
                };
                var doc;
                while ((doc = element.ownerDocument) !== document &&
                    (element = domUtils.getWindow(doc).frameElement)) {
                    bcr = element.getBoundingClientRect();
                    rect.left += bcr.left;
                    rect.top += bcr.top;
                }
                rect.bottom = rect.top + rect.height;
                rect.right = rect.left + rect.width;
                return rect;
            };
        var isFullScreening = false;
        function setFloating(){
            if(isFullScreening){
                return;
            }
            var toobarBoxPos = domUtils.getXY(toolbarBox),
                origalFloat = domUtils.getComputedStyle(toolbarBox,'position'),
                origalLeft = domUtils.getComputedStyle(toolbarBox,'left');
            toolbarBox.style.width = toolbarBox.offsetWidth + 'px';
            toolbarBox.style.zIndex = me.options.zIndex * 1 + 1;
            toolbarBox.parentNode.insertBefore(placeHolder, toolbarBox);
            if (LteIE6 || (quirks && browser.ie)) {
                if(toolbarBox.style.position != 'absolute'){
                    toolbarBox.style.position = 'absolute';
                }
                toolbarBox.style.top = (document.body.scrollTop||document.documentElement.scrollTop) - orgTop + topOffset  + 'px';
            } else {
                if(toolbarBox.style.position != 'fixed'){
                    toolbarBox.style.position = 'fixed';
                    toolbarBox.style.top = topOffset +"px";
                    ((origalFloat == 'absolute' || origalFloat == 'relative') && parseFloat(origalLeft)) && (toolbarBox.style.left = toobarBoxPos.x + 'px');
                }
            }
        }
        function unsetFloating(){

            if(placeHolder.parentNode){
                placeHolder.parentNode.removeChild(placeHolder);
            }
            toolbarBox.style.cssText = bakCssText;
        }

        function updateFloating(){
            var rect3 = getPosition(me.container);
            var offset=me.options.toolbarTopOffset||0;
            if (rect3.top < 0 && rect3.bottom - toolbarBox.offsetHeight > offset) {
                setFloating();
            }else{
                unsetFloating();
            }
        }
        var defer_updateFloating = utils.defer(function(){
            updateFloating();
        },browser.ie ? 200 : 100,true);

        me.addListener('destroy',function(){
            $(window).off('scroll resize',updateFloating);
            me.removeListener('keydown', defer_updateFloating);
        });

        if(checkHasUI(me)){
            toolbarBox = $('.edui-toolbar',me.container)[0];
            me.addListener("afteruiready",function(){
                setTimeout(function(){
                    orgTop = $(toolbarBox).offset().top;
                },100);
            });
            bakCssText = toolbarBox.style.cssText;
            placeHolder.style.height = toolbarBox.offsetHeight + 'px';
            if(LteIE6){
                fixIE6FixedPos();
            }

            $(window).on('scroll resize',updateFloating);
            me.addListener('keydown', defer_updateFloating);
            me.addListener('resize', function(){
                unsetFloating();
                placeHolder.style.height = toolbarBox.offsetHeight + 'px';
                updateFloating();
            });

            me.addListener('beforefullscreenchange', function (t, enabled){
                if (enabled) {
                    unsetFloating();
                    isFullScreening = enabled;
                }
            });
            me.addListener('fullscreenchanged', function (t, enabled){
                if (!enabled) {
                    updateFloating();
                }
                isFullScreening = enabled;
            });
            me.addListener('sourcemodechanged', function (t, enabled){
                setTimeout(function (){
                    updateFloating();
                },0);
            });
            me.addListener("clearDoc",function(){
                setTimeout(function(){
                    updateFloating();
                },0);

            })
        }
    })


});

/********source部分***********/
UM.registerUI('source',function(name){
    var me = this;
    me.addListener('fullscreenchanged',function(){
        me.$container.find('textarea').width(me.$body.width() - 10).height(me.$body.height())

    });
    var $btn = $.eduibutton({
        icon : name,
        click : function(){
            me.execCommand(name);
            UM.setTopEditor(me);
        },
        title: this.getLang('labelMap')[name] || ''
    });

    this.addListener('selectionchange',function(){
        var state = this.queryCommandState(name);
        $btn.edui().disabled(state == -1).active(state == 1)
    });
    return $btn;
});

/*******combobox部分**********/

UM.registerUI('paragraph fontfamily fontsize', function( name ) {

    var me = this,
        label = (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
        options = {
            label: label,
            title: label,
            comboboxName: name,
            items: me.options[ name ] || [],
            itemStyles: [],
            value: [],
            autowidthitem: []
        },
        $combox = null,
        comboboxWidget = null;
    if(options.items.length == 0){
        return null;
    }
    switch ( name ) {

        case 'paragraph':
            options = transForParagraph( options );
            break;

        case 'fontfamily':
            options = transForFontfamily( options );
            break;

        case 'fontsize':
            options = transForFontsize( options );
            break;

    }

    //实例化
    $combox =  $.eduibuttoncombobox(options).css('zIndex',me.getOpt('zIndex') + 1);
    comboboxWidget =  $combox.edui();

    comboboxWidget.on('comboboxselect', function( evt, res ){
                        me.execCommand( name, res.value );
                    }).on("beforeshow", function(){
                        if( $combox.parent().length === 0 ) {
                            $combox.appendTo(  me.$container.find('.edui-dialog-container') );
                        }
                        UM.setTopEditor(me);
                    });


    //状态反射
    this.addListener('selectionchange',function( evt ){

        var state  = this.queryCommandState( name ),
            value = this.queryCommandValue( name );

        //设置按钮状态
        comboboxWidget.button().edui().disabled( state == -1 ).active( state == 1 );
        if(value){
            //设置label
            value = value.replace(/['"]/g, '').toLowerCase().split(/['|"]?\s*,\s*[\1]?/);

            comboboxWidget.selectItemByLabel( value );
        }


    });

    return comboboxWidget.button().addClass('edui-combobox');

    /**
     * 宽度自适应工具函数
     * @param word 单词内容
     * @param hasSuffix 是否含有后缀
     */
    function wordCountAdaptive ( word, hasSuffix ) {

        var $tmpNode = $('<span>' ).html( word ).css( {
                display: 'inline',
                position: 'absolute',
                top: -10000000,
                left: -100000
            } ).appendTo( document.body),
            width = $tmpNode.width();

        $tmpNode.remove();
        $tmpNode = null;

        if( width < 50 ) {

            return word;

        } else {

            word = word.slice( 0, hasSuffix ? -4 : -1 );

            if( !word.length ) {
                return '...';
            }

            return wordCountAdaptive( word + '...', true );

        }

    }


    //段落参数转换
    function transForParagraph ( options ) {

        var tempItems = [];

        for( var key in options.items ) {

            options.value.push( key );
            tempItems.push( key );
            options.autowidthitem.push( wordCountAdaptive( key ) );

        }

        options.items = tempItems;
        options.autoRecord = false;

        return options;

    }

    //字体参数转换
    function transForFontfamily ( options ) {

        var temp = null,
            tempItems = [];

        for( var i = 0, len = options.items.length; i < len; i++ ) {

            temp = options.items[ i ].val;
            tempItems.push( temp.split(/\s*,\s*/)[0] );
            options.itemStyles.push('font-family: ' + temp);
            options.value.push( temp );
            options.autowidthitem.push( wordCountAdaptive( tempItems[ i ] ) );

        }

        options.items = tempItems;

        return options;

    }

    //字体大小参数转换
    function transForFontsize ( options ) {

        var temp = null,
            tempItems = [];

        options.itemStyles = [];
        options.value = [];

        for( var i = 0, len = options.items.length; i < len; i++ ) {

            temp = options.items[ i ];
            tempItems.push( temp );
            options.itemStyles.push('font-size: ' + temp +'px');

        }

        options.value = options.items;
        options.items = tempItems;
        options.autoRecord = false;

        return options;

    }

});


UM.registerUI('forecolor backcolor', function( name ) {
    function getCurrentColor() {
        return domUtils.getComputedStyle( $colorLabel[0], 'background-color' );
    }

    var me = this,
        $colorPickerWidget = null,
        $colorLabel = null,
        $btn = null;

    //querycommand
    this.addListener('selectionchange', function(){

        var state = this.queryCommandState( name );
        $btn.edui().disabled( state == -1 ).active( state == 1 );

    });

    $btn = $.eduicolorsplitbutton({
        icon: name,
        caret: true,
        name: name,
        title: me.getLang("labelMap")[name],
        click: function() {
            me.execCommand( name, getCurrentColor() );
        }
    });

    $colorLabel = $btn.edui().colorLabel();

    $colorPickerWidget = $.eduicolorpicker({
        name: name,
        lang_clearColor: me.getLang('clearColor') || '',
        lang_themeColor: me.getLang('themeColor') || '',
        lang_standardColor: me.getLang('standardColor') || ''
    })
        .on('pickcolor', function( evt, color ){
            window.setTimeout( function(){
                $colorLabel.css("backgroundColor", color);
                me.execCommand( name, color );
            }, 0 );
        })
        .on('show',function(){
            UM.setActiveWidget( colorPickerWidget.root() );
        }).css('zIndex',me.getOpt('zIndex') + 1);

    $btn.edui().on('arrowclick',function(){
        if(!$colorPickerWidget.parent().length){
            me.$container.find('.edui-dialog-container').append($colorPickerWidget);
        }
        $colorPickerWidget.edui().show($btn,{
            caretDir:"down",
            offsetTop:-5,
            offsetLeft:8,
            caretLeft:11,
            caretTop:-8
        });
        UM.setTopEditor(me);
    }).register('click', $btn, function () {
            $colorPickerWidget.edui().hide()
        });

    return $btn;

});