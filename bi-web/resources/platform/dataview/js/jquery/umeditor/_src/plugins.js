/******inserthtml部分*******/
///import core
/**
 * @description 插入内容
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     inserthtml插入内容的命令
 * @param   {String}   html                要插入的内容
 * @author zhanyi
 */
UM.commands['inserthtml'] = {
    execCommand: function (command,html,notNeedFilter){
        var me = this,
            range,
            div;
        if(!html){
            return;
        }
        if(me.fireEvent('beforeinserthtml',html) === true){
            return;
        }
        range = me.selection.getRange();
        div = range.document.createElement( 'div' );
        div.style.display = 'inline';

        if (!notNeedFilter) {
            var root = UM.htmlparser(html);
            //如果给了过滤规则就先进行过滤
            if(me.options.filterRules){
                UM.filterNode(root,me.options.filterRules);
            }
            //执行默认的处理
            me.filterInputRule(root);
            html = root.toHtml()
        }
        div.innerHTML = utils.trim( html );

        if ( !range.collapsed ) {
            var tmpNode = range.startContainer;
            if(domUtils.isFillChar(tmpNode)){
                range.setStartBefore(tmpNode)
            }
            tmpNode = range.endContainer;
            if(domUtils.isFillChar(tmpNode)){
                range.setEndAfter(tmpNode)
            }
            range.txtToElmBoundary();
            //结束边界可能放到了br的前边，要把br包含进来
            // x[xxx]<br/>
            if(range.endContainer && range.endContainer.nodeType == 1){
                tmpNode = range.endContainer.childNodes[range.endOffset];
                if(tmpNode && domUtils.isBr(tmpNode)){
                    range.setEndAfter(tmpNode);
                }
            }
            if(range.startOffset == 0){
                tmpNode = range.startContainer;
                if(domUtils.isBoundaryNode(tmpNode,'firstChild') ){
                    tmpNode = range.endContainer;
                    if(range.endOffset == (tmpNode.nodeType == 3 ? tmpNode.nodeValue.length : tmpNode.childNodes.length) && domUtils.isBoundaryNode(tmpNode,'lastChild')){
                        me.body.innerHTML = '<p>'+(browser.ie ? '' : '<br/>')+'</p>';
                        range.setStart(me.body.firstChild,0).collapse(true)

                    }
                }
            }
            !range.collapsed && range.deleteContents();
            if(range.startContainer.nodeType == 1){
                var child = range.startContainer.childNodes[range.startOffset],pre;
                if(child && domUtils.isBlockElm(child) && (pre = child.previousSibling) && domUtils.isBlockElm(pre)){
                    range.setEnd(pre,pre.childNodes.length).collapse();
                    while(child.firstChild){
                        pre.appendChild(child.firstChild);
                    }
                    domUtils.remove(child);
                }
            }

        }


        var child,parent,pre,tmp,hadBreak = 0, nextNode;
        //如果当前位置选中了fillchar要干掉，要不会产生空行
        if(range.inFillChar()){
            child = range.startContainer;
            if(domUtils.isFillChar(child)){
                range.setStartBefore(child).collapse(true);
                domUtils.remove(child);
            }else if(domUtils.isFillChar(child,true)){
                child.nodeValue = child.nodeValue.replace(fillCharReg,'');
                range.startOffset--;
                range.collapsed && range.collapse(true)
            }
        }
        while ( child = div.firstChild ) {
            if(hadBreak){
                var p = me.document.createElement('p');
                while(child && (child.nodeType == 3 || !dtd.$block[child.tagName])){
                    nextNode = child.nextSibling;
                    p.appendChild(child);
                    child = nextNode;
                }
                if(p.firstChild){

                    child = p
                }
            }
            range.insertNode( child );
            nextNode = child.nextSibling;
            if ( !hadBreak && child.nodeType == domUtils.NODE_ELEMENT && domUtils.isBlockElm( child ) ){

                parent = domUtils.findParent( child,function ( node ){ return domUtils.isBlockElm( node ); } );
                if ( parent && parent.tagName.toLowerCase() != 'body' && !(dtd[parent.tagName][child.nodeName] && child.parentNode === parent)){
                    if(!dtd[parent.tagName][child.nodeName]){
                        pre = parent;
                    }else{
                        tmp = child.parentNode;
                        while (tmp !== parent){
                            pre = tmp;
                            tmp = tmp.parentNode;

                        }
                    }


                    domUtils.breakParent( child, pre || tmp );
                    //去掉break后前一个多余的节点  <p>|<[p> ==> <p></p><div></div><p>|</p>
                    var pre = child.previousSibling;
                    domUtils.trimWhiteTextNode(pre);
                    if(!pre.childNodes.length){
                        domUtils.remove(pre);
                    }
                    //trace:2012,在非ie的情况，切开后剩下的节点有可能不能点入光标添加br占位

                    if(!browser.ie &&
                        (next = child.nextSibling) &&
                        domUtils.isBlockElm(next) &&
                        next.lastChild &&
                        !domUtils.isBr(next.lastChild)){
                        next.appendChild(me.document.createElement('br'));
                    }
                    hadBreak = 1;
                }
            }
            var next = child.nextSibling;
            if(!div.firstChild && next && domUtils.isBlockElm(next)){

                range.setStart(next,0).collapse(true);
                break;
            }
            range.setEndAfter( child ).collapse();

        }

        child = range.startContainer;

        if(nextNode && domUtils.isBr(nextNode)){
            domUtils.remove(nextNode)
        }
        //用chrome可能有空白展位符
        if(domUtils.isBlockElm(child) && domUtils.isEmptyNode(child)){
            if(nextNode = child.nextSibling){
                domUtils.remove(child);
                if(nextNode.nodeType == 1 && dtd.$block[nextNode.tagName]){

                    range.setStart(nextNode,0).collapse(true).shrinkBoundary()
                }
            }else{

                try{
                    child.innerHTML = browser.ie ? domUtils.fillChar : '<br/>';
                }catch(e){
                    range.setStartBefore(child);
                    domUtils.remove(child)
                }

            }

        }
        //加上true因为在删除表情等时会删两次，第一次是删的fillData
        try{
            if(browser.ie9below && range.startContainer.nodeType == 1 && !range.startContainer.childNodes[range.startOffset]){
                var start = range.startContainer,pre = start.childNodes[range.startOffset-1];
                if(pre && pre.nodeType == 1 && dtd.$empty[pre.tagName]){
                    var txt = this.document.createTextNode(domUtils.fillChar);
                    range.insertNode(txt).setStart(txt,0).collapse(true);
                }
            }
            setTimeout(function(){
                range.select(true);
            })

        }catch(e){}


        setTimeout(function(){
            range = me.selection.getRange();
            range.scrollIntoView();
            me.fireEvent('afterinserthtml');
        },200);
    }
};
/*******image部分********/
///import core
///import plugins\inserthtml.js
///commands 插入图片，操作图片的对齐方式
///commandsName  InsertImage,ImageNone,ImageLeft,ImageRight,ImageCenter
///commandsTitle  图片,默认,居左,居右,居中
///commandsDialog  dialogs\image
/**
 * Created by .
 * User: zhanyi
 * for image
 */
UM.commands['insertimage'] = {
    execCommand:function (cmd, opt) {
        opt = utils.isArray(opt) ? opt : [opt];
        if (!opt.length) {
            return;
        }
        var me = this;
        var html = [], str = '', ci;
        ci = opt[0];
        if (opt.length == 1) {
            str = '<img src="' + ci.src + '" ' + (ci._src ? ' _src="' + ci._src + '" ' : '') +
                (ci.width ? 'width="' + ci.width + '" ' : '') +
                (ci.height ? ' height="' + ci.height + '" ' : '') +
                (ci['floatStyle'] == 'left' || ci['floatStyle'] == 'right' ? ' style="float:' + ci['floatStyle'] + ';"' : '') +
                (ci.title && ci.title != "" ? ' title="' + ci.title + '"' : '') +
                (ci.border && ci.border != "0" ? ' border="' + ci.border + '"' : '') +
                (ci.alt && ci.alt != "" ? ' alt="' + ci.alt + '"' : '') +
                (ci.hspace && ci.hspace != "0" ? ' hspace = "' + ci.hspace + '"' : '') +
                (ci.vspace && ci.vspace != "0" ? ' vspace = "' + ci.vspace + '"' : '') + '/>';
            if (ci['floatStyle'] == 'center') {
                str = '<p style="text-align: center">' + str + '</p>';
            }
            html.push(str);

        } else {
            for (var i = 0; ci = opt[i++];) {
                str = '<p ' + (ci['floatStyle'] == 'center' ? 'style="text-align: center" ' : '') + '><img src="' + ci.src + '" ' +
                    (ci.width ? 'width="' + ci.width + '" ' : '') + (ci._src ? ' _src="' + ci._src + '" ' : '') +
                    (ci.height ? ' height="' + ci.height + '" ' : '') +
                    ' style="' + (ci['floatStyle'] && ci['floatStyle'] != 'center' ? 'float:' + ci['floatStyle'] + ';' : '') +
                    (ci.border || '') + '" ' +
                    (ci.title ? ' title="' + ci.title + '"' : '') + ' /></p>';
                html.push(str);
            }
        }

        me.execCommand('insertHtml', html.join(''), true);
    }
};
/***********justify部分*************/
///import core
///commands 段落格式,居左,居右,居中,两端对齐
///commandsName  JustifyLeft,JustifyCenter,JustifyRight,JustifyJustify
///commandsTitle  居左对齐,居中对齐,居右对齐,两端对齐
/**
 * @description 居左右中
 * @name UM.execCommand
 * @param   {String}   cmdName     justify执行对齐方式的命令
 * @param   {String}   align               对齐方式：left居左，right居右，center居中，justify两端对齐
 * @author zhanyi
 */
UM.plugins['justify']=function(){
    var me = this;
    $.each('justifyleft justifyright justifycenter justifyfull'.split(' '),function(i,cmdName){
        me.commands[cmdName] = {
            execCommand:function (cmdName) {
                return this.document.execCommand(cmdName);
            },
            queryCommandValue: function (cmdName) {
                var val = this.document.queryCommandValue(cmdName);
                return   val === true || val === 'true' ? cmdName.replace(/justify/,'') : '';
            },
            queryCommandState: function (cmdName) {
                return this.document.queryCommandState(cmdName) ? 1 : 0
            }
        };
    })
};

/**********font部分************/
///import core
///import plugins\removeformat.js
///commands 字体颜色,背景色,字号,字体,下划线,删除线
///commandsName  ForeColor,BackColor,FontSize,FontFamily,Underline,StrikeThrough
///commandsTitle  字体颜色,背景色,字号,字体,下划线,删除线
/**
 * @description 字体
 * @name UM.execCommand
 * @param {String}     cmdName    执行的功能名称
 * @param {String}    value             传入的值
 */
UM.plugins['font'] = function () {
    var me = this,
        fonts = {
            'forecolor': 'forecolor',
            'backcolor': 'backcolor',
            'fontsize': 'fontsize',
            'fontfamily': 'fontname'
        },
        cmdNameToStyle = {
            'forecolor': 'color',
            'backcolor': 'background-color',
            'fontsize': 'font-size',
            'fontfamily': 'font-family'
        },
        cmdNameToAttr = {
            'forecolor': 'color',
            'fontsize': 'size',
            'fontfamily': 'face'
        };
    me.setOpt({
        'fontfamily': [
            { name: 'songti', val: '宋体,SimSun'},
            { name: 'yahei', val: '微软雅黑,Microsoft YaHei'},
            { name: 'kaiti', val: '楷体,楷体_GB2312, SimKai'},
            { name: 'heiti', val: '黑体, SimHei'},
            { name: 'lishu', val: '隶书, SimLi'},
            { name: 'andaleMono', val: 'andale mono'},
            { name: 'arial', val: 'arial, helvetica,sans-serif'},
            { name: 'arialBlack', val: 'arial black,avant garde'},
            { name: 'comicSansMs', val: 'comic sans ms'},
            { name: 'impact', val: 'impact,chicago'},
            { name: 'timesNewRoman', val: 'times new roman'},
            { name: 'sans-serif',val:'sans-serif'}
        ],
        'fontsize': [/*10,*/ 12,  16, 18,24, 32,48]
    });

    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('font'), function (node) {
            if (node.tagName == 'font') {
                var cssStyle = [];
                for (var p in node.attrs) {
                    switch (p) {
                        case 'size':
                            var val =  node.attrs[p];
                            $.each({
                                '10':'1',
                                '12':'2',
                                '16':'3',
                                '18':'4',
                                '24':'5',
                                '32':'6',
                                '48':'7'
                            },function(k,v){
                                if(v == val){
                                    val = k;
                                    return false;
                                }
                            });
                            cssStyle.push('font-size:' + val + 'px');
                            break;
                        case 'color':
                            cssStyle.push('color:' + node.attrs[p]);
                            break;
                        case 'face':
                            cssStyle.push('font-family:' + node.attrs[p]);
                            break;
                        case 'style':
                            cssStyle.push(node.attrs[p]);
                    }
                }
                node.attrs = {
                    'style': cssStyle.join(';')
                };
            }
            node.tagName = 'span';
            if(node.parentNode.tagName == 'span' && node.parentNode.children.length == 1){
                $.each(node.attrs,function(k,v){

                    node.parentNode.attrs[k] = k == 'style' ? node.parentNode.attrs[k] + v : v;
                })
                node.parentNode.removeChild(node,true);
            }
        });
    });
    for(var p in fonts){
        (function (cmd) {
            me.commands[cmd] = {
                execCommand: function (cmdName,value) {
                    if(value == 'transparent'){
                        return;
                    }
                    var rng = this.selection.getRange();
                    if(rng.collapsed){
                        var span = $('<span></span>').css(cmdNameToStyle[cmdName],value)[0];
                        rng.insertNode(span).setStart(span,0).setCursor();
                    }else{
                        if(cmdName == 'fontsize'){
                            value  = {
                                '10':'1',
                                '12':'2',
                                '16':'3',
                                '18':'4',
                                '24':'5',
                                '32':'6',
                                '48':'7'
                            }[(value+"").replace(/px/,'')]
                        }
                        this.document.execCommand(fonts[cmdName],false, value);
                        if(browser.gecko){
                            $.each(this.$body.find('a'),function(i,a){
                                var parent = a.parentNode;
                                if(parent.lastChild === parent.firstChild && /FONT|SPAN/.test(parent.tagName)){
                                    var cloneNode = parent.cloneNode(false);
                                    cloneNode.innerHTML = a.innerHTML;
                                    $(a).html('').append(cloneNode).insertBefore(parent);

                                    $(parent).remove();
                                }
                            });
                        }
                        if(!browser.ie){
                            var nativeRange = this.selection.getNative().getRangeAt(0);
                            var common = nativeRange.commonAncestorContainer;
                            var rng = this.selection.getRange(),
                                bk = rng.createBookmark(true);

                            $(common).find('a').each(function(i,n){
                                var parent = n.parentNode;
                                if(parent.nodeName == 'FONT'){
                                    var font = parent.cloneNode(false);
                                    font.innerHTML = n.innerHTML;
                                    $(n).html('').append(font);
                                }
                            });
                            rng.moveToBookmark(bk).select()
                        }
                        return true
                    }

                },
                queryCommandValue: function (cmdName) {
                    var start = me.selection.getStart();
                    var val = $(start).css(cmdNameToStyle[cmdName]);
                    if(val === undefined){
                        val = $(start).attr(cmdNameToAttr[cmdName])
                    }
                    return val ? utils.fixColor(cmdName,val).replace(/px/,'') : '';
                },
                queryCommandState: function (cmdName) {
                    return this.queryCommandValue(cmdName)
                }
            };
        })(p);
    }
};
/*****link部分*******/
///import core
///commands 超链接,取消链接
///commandsName  Link,Unlink
///commandsTitle  超链接,取消链接
///commandsDialog  dialogs\link
/**
 * 超链接
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     link插入超链接
 * @param   {Object}  options         url地址，title标题，target是否打开新页
 * @author zhanyi
 */
/**
 * 取消链接
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     unlink取消链接
 * @author zhanyi
 */

UM.plugins['link'] = function(){
    var me = this;

    me.setOpt('autourldetectinie',false);
    //在ie下禁用autolink
    if(browser.ie && this.options.autourldetectinie === false){
        this.addListener('keyup',function(cmd,evt){
            var me = this,keyCode = evt.keyCode;
            if(keyCode == 13 || keyCode == 32){
                var rng = me.selection.getRange();
                var start = rng.startContainer;
                if(keyCode == 13){
                    if(start.nodeName == 'P'){
                        var pre = start.previousSibling;
                        if(pre && pre.nodeType == 1){
                            var pre = pre.lastChild;
                            if(pre && pre.nodeName == 'A' && !pre.getAttribute('_href')){
                                domUtils.remove(pre,true);
                            }
                        }
                    }
                }else if(keyCode == 32){
                   if(start.nodeType == 3 && /^\s$/.test(start.nodeValue)){
                       start = start.previousSibling;
                       if(start && start.nodeName == 'A' && !start.getAttribute('_href')){
                           domUtils.remove(start,true);
                       }
                   }
                }

            }


        });
    }

    this.addOutputRule(function(root){
        $.each(root.getNodesByTagName('a'),function(i,a){
            var _href = utils.html(a.getAttr('_href'));
            if(!/^(ftp|https?|\/|file)/.test(_href)){
                _href = 'http://' + _href;
            }
            a.setAttr('href', _href);
            a.setAttr('_href')
            if(a.getAttr('title')==''){
                a.setAttr('title')
            }
        })
    });
    this.addInputRule(function(root){
        $.each(root.getNodesByTagName('a'),function(i,a){
            a.setAttr('_href', utils.html(a.getAttr('href')));
        })
    });
    me.commands['link'] = {
        execCommand : function( cmdName, opt ) {

            var me = this;
            var rng = me.selection.getRange();
            if(rng.collapsed){
                var start = rng.startContainer;
                if(start = domUtils.findParentByTagName(start,'a',true)){
                    $(start).attr(opt);
                    rng.selectNode(start).select()
                }else{
                    rng.insertNode($('<a>' +opt.href+'</a>').attr(opt)[0]).select()

                }

            }else{
                me.document.execCommand('createlink',false,'_umeditor_link');
                utils.each(domUtils.getElementsByTagName(me.body,'a',function(n){

                    return n.getAttribute('href') == '_umeditor_link'
                }),function(l){
                    if($(l).text() == '_umeditor_link'){
                        $(l).text(opt.href);
                    }
                    domUtils.setAttributes(l,opt);
                    rng.selectNode(l).select()
                })
            }

        },
        queryCommandState:function(){
            return this.queryCommandValue('link') ? 1 : 0;
        },
        queryCommandValue:function(){
            var path = this.selection.getStartElementPath();
            var result;
            $.each(path,function(i,n){
                if(n.nodeName == "A"){
                    result = n;
                    return false;
                }
            })
            return result;
        }
    };
    me.commands['unlink'] = {
        execCommand : function() {
            this.document.execCommand('unlink');
        }
    };
};
/*******print部分********/
///import core
///commands 打印
///commandsName  Print
///commandsTitle  打印
/**
 * @description 打印
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     print打印编辑器内容
 * @author zhanyi
 */
UM.commands['print'] = {
    execCommand : function(){
        var me = this,
            id = 'editor_print_' + +new Date();

        $('<iframe src="" id="' + id + '" name="' + id + '" frameborder="0"></iframe>').attr('id', id)
            .css({
                width:'0px',
                height:'0px',
                'overflow':'hidden',
                'float':'left',
                'position':'absolute',
                top:'-10000px',
                left:'-10000px'
            })
            .appendTo(me.$container.find('.edui-dialog-container'));

        var w = window.open('', id, ''),
            d = w.document;
        d.open();
        d.write('<html><head></head><body><div>'+this.getContent(null,null,true)+'</div><script>' +
            "setTimeout(function(){" +
            "window.print();" +
            "setTimeout(function(){" +
            "window.parent.$('#" + id + "').remove();" +
            "},100);" +
            "},200);" +
            '</script></body></html>');
        d.close();
    },
    notNeedUndo : 1
};
	/**********paragraph部分*************/
	///import core
///commands 格式
///commandsName  Paragraph
///commandsTitle  段落格式
/**
 * 段落样式
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     paragraph插入段落执行命令
 * @param   {String}   style               标签值为：'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
 * @param   {String}   attrs               标签的属性
 * @author zhanyi
 */
UM.plugins['paragraph'] = function() {
    var me = this;
    me.setOpt('paragraph',{'p':'', 'h1':'', 'h2':'', 'h3':'', 'h4':'', 'h5':'', 'h6':''});
    me.commands['paragraph'] = {
        execCommand : function( cmdName, style ) {
            return this.document.execCommand('formatBlock',false,'<' + style + '>');
        },
        queryCommandValue : function() {
            try{
                var  val = this.document.queryCommandValue('formatBlock')
            }catch(e){
            }
            return val ;
        }
    };
};
/*********horizontal部分************/
///import core
///import plugins\inserthtml.js
///commands 分割线
///commandsName  Horizontal
///commandsTitle  分隔线
/**
 * 分割线
 * @function
 * @name UM.execCommand
 * @param {String}     cmdName    horizontal插入分割线
 */
UM.plugins['horizontal'] = function(){
    var me = this;
    me.commands['horizontal'] = {
        execCommand : function(  ) {
            this.document.execCommand('insertHorizontalRule');
            var rng = me.selection.getRange().txtToElmBoundary(true),
                start = rng.startContainer;
            if(domUtils.isBody(rng.startContainer)){
                var next = rng.startContainer.childNodes[rng.startOffset];
                if(!next){
                    next = $('<p></p>').appendTo(rng.startContainer).html(browser.ie ? '&nbsp;' : '<br/>')[0]
                }
                rng.setStart(next,0).setCursor()
            }else{

                while(dtd.$inline[start.tagName] && start.lastChild === start.firstChild){

                    var parent = start.parentNode;
                    parent.appendChild(start.firstChild);
                    parent.removeChild(start);
                    start = parent;
                }
                while(dtd.$inline[start.tagName]){
                    start = start.parentNode;
                }
                if(start.childNodes.length == 1 && start.lastChild.nodeName == 'HR'){
                    var hr = start.lastChild;
                    $(hr).insertBefore(start);
                    rng.setStart(start,0).setCursor();
                }else{
                    hr = $('hr',start)[0];
                    domUtils.breakParent(hr,start);
                    var pre = hr.previousSibling;
                    if(pre && domUtils.isEmptyBlock(pre)){
                        $(pre).remove()
                    }
                    rng.setStart(hr.nextSibling,0).setCursor();
                }

            }
        }
    };

};

/******cleardoc部分*********/
///import core
///commands 清空文档
///commandsName  ClearDoc
///commandsTitle  清空文档
/**
 *
 * 清空文档
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     cleardoc清空文档
 */

UM.commands['cleardoc'] = {
    execCommand : function() {
        var me = this,
            range = me.selection.getRange();
        me.body.innerHTML = "<p>"+(ie ? "" : "<br/>")+"</p>";
        range.setStart(me.body.firstChild,0).setCursor(false,true);
        setTimeout(function(){
            me.fireEvent("clearDoc");
        },0);

    }
};

/*********undo部分***********/
///import core
///commands 撤销和重做
///commandsName  Undo,Redo
///commandsTitle  撤销,重做
/**
 * @description 回退
 * @author zhanyi
 */

UM.plugins['undo'] = function () {
    var saveSceneTimer;
    var me = this,
        maxUndoCount = me.options.maxUndoCount || 20,
        maxInputCount = me.options.maxInputCount || 20,
        fillchar = new RegExp(domUtils.fillChar + '|<\/hr>', 'gi');// ie会产生多余的</hr>
    var noNeedFillCharTags = {
        ol:1,ul:1,table:1,tbody:1,tr:1,body:1
    };
    var orgState = me.options.autoClearEmptyNode;
    function compareAddr(indexA, indexB) {
        if (indexA.length != indexB.length)
            return 0;
        for (var i = 0, l = indexA.length; i < l; i++) {
            if (indexA[i] != indexB[i])
                return 0
        }
        return 1;
    }

    function compareRangeAddress(rngAddrA, rngAddrB) {
        if (rngAddrA.collapsed != rngAddrB.collapsed) {
            return 0;
        }
        if (!compareAddr(rngAddrA.startAddress, rngAddrB.startAddress) || !compareAddr(rngAddrA.endAddress, rngAddrB.endAddress)) {
            return 0;
        }
        return 1;
    }

    function UndoManager() {
        this.list = [];
        this.index = 0;
        this.hasUndo = false;
        this.hasRedo = false;
        this.undo = function () {
            if (this.hasUndo) {
                if (!this.list[this.index - 1] && this.list.length == 1) {
                    this.reset();
                    return;
                }
                while (this.list[this.index].content == this.list[this.index - 1].content) {
                    this.index--;
                    if (this.index == 0) {
                        return this.restore(0);
                    }
                }
                this.restore(--this.index);
            }
        };
        this.redo = function () {
            if (this.hasRedo) {
                while (this.list[this.index].content == this.list[this.index + 1].content) {
                    this.index++;
                    if (this.index == this.list.length - 1) {
                        return this.restore(this.index);
                    }
                }
                this.restore(++this.index);
            }
        };

        this.restore = function () {
            var me = this.editor;
            var scene = this.list[this.index];
            var root = UM.htmlparser(scene.content.replace(fillchar, ''));
            me.options.autoClearEmptyNode = false;
            me.filterInputRule(root,true);
            me.options.autoClearEmptyNode = orgState;
            //trace:873
            //去掉展位符
            me.body.innerHTML = root.toHtml();
            me.fireEvent('afterscencerestore');
            //处理undo后空格不展位的问题
            if (browser.ie) {
                utils.each(domUtils.getElementsByTagName(me.document,'td th caption p'),function(node){
                    if(domUtils.isEmptyNode(node)){
                        domUtils.fillNode(me.document, node);
                    }
                })
            }

            try{
                var rng = new dom.Range(me.document,me.body).moveToAddress(scene.address);
                if(browser.ie && rng.collapsed && rng.startContainer.nodeType == 1){
                    var tmpNode = rng.startContainer.childNodes[rng.startOffset];
                    if( !tmpNode || tmpNode.nodeType == 1 && dtd.$empty[tmpNode]){
                        rng.insertNode(me.document.createTextNode(' ')).collapse(true);
                    }
                }
                rng.select(noNeedFillCharTags[rng.startContainer.nodeName.toLowerCase()]);
            }catch(e){}

            this.update();
            this.clearKey();
            //不能把自己reset了
            me.fireEvent('reset', true);
        };

        this.getScene = function () {
            var me = this.editor;
            var rng = me.selection.getRange(),
                rngAddress = rng.createAddress(false,true);
            me.fireEvent('beforegetscene');
            var root = UM.htmlparser(me.body.innerHTML,true);
            me.options.autoClearEmptyNode = false;
            me.filterOutputRule(root,true);
            me.options.autoClearEmptyNode = orgState;
            var cont = root.toHtml();
            browser.ie && (cont = cont.replace(/>&nbsp;</g, '><').replace(/\s*</g, '<').replace(/>\s*/g, '>'));
            me.fireEvent('aftergetscene');
            return {
                address:rngAddress,
                content:cont
            }
        };
        this.save = function (notCompareRange,notSetCursor) {
            clearTimeout(saveSceneTimer);
            var currentScene = this.getScene(notSetCursor),
                lastScene = this.list[this.index];
            //内容相同位置相同不存
            if (lastScene && lastScene.content == currentScene.content &&
                ( notCompareRange ? 1 : compareRangeAddress(lastScene.address, currentScene.address) )
                ) {
                return;
            }
            this.list = this.list.slice(0, this.index + 1);
            this.list.push(currentScene);
            //如果大于最大数量了，就把最前的剔除
            if (this.list.length > maxUndoCount) {
                this.list.shift();
            }
            this.index = this.list.length - 1;
            this.clearKey();
            //跟新undo/redo状态
            this.update();

        };
        this.update = function () {
            this.hasRedo = !!this.list[this.index + 1];
            this.hasUndo = !!this.list[this.index - 1];
        };
        this.reset = function () {
            this.list = [];
            this.index = 0;
            this.hasUndo = false;
            this.hasRedo = false;
            this.clearKey();
        };
        this.clearKey = function () {
            keycont = 0;
            lastKeyCode = null;
        };
    }

    me.undoManger = new UndoManager();
    me.undoManger.editor = me;
    function saveScene() {
        this.undoManger.save();
    }

    me.addListener('saveScene', function () {
        var args = Array.prototype.splice.call(arguments,1);
        this.undoManger.save.apply(this.undoManger,args);
    });

    me.addListener('beforeexeccommand', saveScene);
    me.addListener('afterexeccommand', saveScene);

    me.addListener('reset', function (type, exclude) {
        if (!exclude) {
            this.undoManger.reset();
        }
    });
    me.commands['redo'] = me.commands['undo'] = {
        execCommand:function (cmdName) {
            this.undoManger[cmdName]();
        },
        queryCommandState:function (cmdName) {
            return this.undoManger['has' + (cmdName.toLowerCase() == 'undo' ? 'Undo' : 'Redo')] ? 0 : -1;
        },
        notNeedUndo:1
    };

    var keys = {
            //  /*Backspace*/ 8:1, /*Delete*/ 46:1,
            /*Shift*/ 16:1, /*Ctrl*/ 17:1, /*Alt*/ 18:1,
            37:1, 38:1, 39:1, 40:1

        },
        keycont = 0,
        lastKeyCode;
    //输入法状态下不计算字符数
    var inputType = false;
    me.addListener('ready', function () {
        $(this.body).on('compositionstart', function () {
            inputType = true;
        }).on('compositionend', function () {
            inputType = false;
        })
    });
    //快捷键
    me.addshortcutkey({
        "Undo":"ctrl+90", //undo
        "Redo":"ctrl+89,shift+ctrl+z" //redo

    });
    var isCollapsed = true;
    me.addListener('keydown', function (type, evt) {

        var me = this;
        var keyCode = evt.keyCode || evt.which;
        if (!keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {
            if (inputType)
                return;

            if(!me.selection.getRange().collapsed){
                me.undoManger.save(false,true);
                isCollapsed = false;
                return;
            }
            if (me.undoManger.list.length == 0) {
                me.undoManger.save(true);
            }
            clearTimeout(saveSceneTimer);
            function save(cont){

                if (cont.selection.getRange().collapsed)
                    cont.fireEvent('contentchange');
                cont.undoManger.save(false,true);
                cont.fireEvent('selectionchange');
            }
            saveSceneTimer = setTimeout(function(){
                if(inputType){
                    var interalTimer = setInterval(function(){
                        if(!inputType){
                            save(me);
                            clearInterval(interalTimer)
                        }
                    },300)
                    return;
                }
                save(me);
            },200);

            lastKeyCode = keyCode;
            keycont++;
            if (keycont >= maxInputCount ) {
                save(me)
            }
        }
    });
    me.addListener('keyup', function (type, evt) {
        var keyCode = evt.keyCode || evt.which;
        if (!keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {
            if (inputType)
                return;
            if(!isCollapsed){
                this.undoManger.save(false,true);
                isCollapsed = true;
            }
        }
    });

};
/******paste部分*********/
///import core
///import plugins/inserthtml.js
///import plugins/undo.js
///import plugins/serialize.js
///commands 粘贴
///commandsName  PastePlain
///commandsTitle  纯文本粘贴模式
/**
 * @description 粘贴
 * @author zhanyi
 */
UM.plugins['paste'] = function () {
    function getClipboardData(callback) {
        var doc = this.document;
        if (doc.getElementById('baidu_pastebin')) {
            return;
        }
        var range = this.selection.getRange(),
            bk = range.createBookmark(),
        //创建剪贴的容器div
            pastebin = doc.createElement('div');
        pastebin.id = 'baidu_pastebin';
        // Safari 要求div必须有内容，才能粘贴内容进来
        browser.webkit && pastebin.appendChild(doc.createTextNode(domUtils.fillChar + domUtils.fillChar));
        this.body.appendChild(pastebin);
        //trace:717 隐藏的span不能得到top
        //bk.start.innerHTML = '&nbsp;';
        bk.start.style.display = '';

        pastebin.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;top:" +
        //要在现在光标平行的位置加入，否则会出现跳动的问题
        $(bk.start).position().top  + 'px';

        range.selectNodeContents(pastebin).select(true);

        setTimeout(function () {
            if (browser.webkit) {
                for (var i = 0, pastebins = doc.querySelectorAll('#baidu_pastebin'), pi; pi = pastebins[i++];) {
                    if (domUtils.isEmptyNode(pi)) {
                        domUtils.remove(pi);
                    } else {
                        pastebin = pi;
                        break;
                    }
                }
            }
            try {
                pastebin.parentNode.removeChild(pastebin);
            } catch (e) {
            }
            range.moveToBookmark(bk).select(true);
            callback(pastebin);
        }, 0);
    }

    var me = this;


    function filter(div) {
        var html;
        if (div.firstChild) {
            //去掉cut中添加的边界值
            var nodes = domUtils.getElementsByTagName(div, 'span');
            for (var i = 0, ni; ni = nodes[i++];) {
                if (ni.id == '_baidu_cut_start' || ni.id == '_baidu_cut_end') {
                    domUtils.remove(ni);
                }
            }

            if (browser.webkit) {

                var brs = div.querySelectorAll('div br');
                for (var i = 0, bi; bi = brs[i++];) {
                    var pN = bi.parentNode;
                    if (pN.tagName == 'DIV' && pN.childNodes.length == 1) {
                        pN.innerHTML = '<p><br/></p>';
                        domUtils.remove(pN);
                    }
                }
                var divs = div.querySelectorAll('#baidu_pastebin');
                for (var i = 0, di; di = divs[i++];) {
                    var tmpP = me.document.createElement('p');
                    di.parentNode.insertBefore(tmpP, di);
                    while (di.firstChild) {
                        tmpP.appendChild(di.firstChild);
                    }
                    domUtils.remove(di);
                }

                var metas = div.querySelectorAll('meta');
                for (var i = 0, ci; ci = metas[i++];) {
                    domUtils.remove(ci);
                }

                var brs = div.querySelectorAll('br');
                for (i = 0; ci = brs[i++];) {
                    if (/^apple-/i.test(ci.className)) {
                        domUtils.remove(ci);
                    }
                }
            }
            if (browser.gecko) {
                var dirtyNodes = div.querySelectorAll('[_moz_dirty]');
                for (i = 0; ci = dirtyNodes[i++];) {
                    ci.removeAttribute('_moz_dirty');
                }
            }
            if (!browser.ie) {
                var spans = div.querySelectorAll('span.Apple-style-span');
                for (var i = 0, ci; ci = spans[i++];) {
                    domUtils.remove(ci, true);
                }
            }

            //ie下使用innerHTML会产生多余的\r\n字符，也会产生&nbsp;这里过滤掉
            html = div.innerHTML;//.replace(/>(?:(\s|&nbsp;)*?)</g,'><');

            //过滤word粘贴过来的冗余属性
            html = UM.filterWord(html);
            //取消了忽略空白的第二个参数，粘贴过来的有些是有空白的，会被套上相关的标签
            var root = UM.htmlparser(html);
            //如果给了过滤规则就先进行过滤
            if (me.options.filterRules) {
                UM.filterNode(root, me.options.filterRules);
            }
            //执行默认的处理
            me.filterInputRule(root);
            //针对chrome的处理
            if (browser.webkit) {
                var br = root.lastChild();
                if (br && br.type == 'element' && br.tagName == 'br') {
                    root.removeChild(br)
                }
                utils.each(me.body.querySelectorAll('div'), function (node) {
                    if (domUtils.isEmptyBlock(node)) {
                        domUtils.remove(node)
                    }
                })
            }
            html = {'html': root.toHtml()};
            me.fireEvent('beforepaste', html, root);
            //抢了默认的粘贴，那后边的内容就不执行了，比如表格粘贴
            if(!html.html){
                return;
            }

            me.execCommand('insertHtml', html.html, true);
            me.fireEvent("afterpaste", html);
        }
    }


    me.addListener('ready', function () {
        $(me.body).on( 'cut', function () {
            var range = me.selection.getRange();
            if (!range.collapsed && me.undoManger) {
                me.undoManger.save();
            }
        }).on(browser.ie || browser.opera ? 'keydown' : 'paste', function (e) {
            //ie下beforepaste在点击右键时也会触发，所以用监控键盘才处理
            if ((browser.ie || browser.opera) && ((!e.ctrlKey && !e.metaKey) || e.keyCode != '86')) {
                return;
            }
            getClipboardData.call(me, function (div) {
                filter(div);
            });
        });

    });
};

/*********list部分**********/
///import core
///commands 有序列表,无序列表
///commandsName  InsertOrderedList,InsertUnorderedList
///commandsTitle  有序列表,无序列表
/**
 * 有序列表
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     insertorderlist插入有序列表
 * @param   {String}   style               值为：decimal,lower-alpha,lower-roman,upper-alpha,upper-roman
 * @author zhanyi
 */
/**
 * 无序链接
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     insertunorderlist插入无序列表
 * * @param   {String}   style            值为：circle,disc,square
 * @author zhanyi
 */

UM.plugins['list'] = function () {
    var me = this;

    me.setOpt( {
        'insertorderedlist':{
            'decimal':'',
            'lower-alpha':'',
            'lower-roman':'',
            'upper-alpha':'',
            'upper-roman':''
        },
        'insertunorderedlist':{
            'circle':'',
            'disc':'',
            'square':''
        }
    } );

    this.addInputRule(function(root){
        utils.each(root.getNodesByTagName('li'), function (node) {
            if(node.children.length == 0){
                node.parentNode.removeChild(node);
            }
        })
    });
    me.commands['insertorderedlist'] =
    me.commands['insertunorderedlist'] = {
            execCommand:function (cmdName) {
                this.document.execCommand(cmdName);
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(true);

                this.$body.find('ol,ul').each(function(i,n){
                    var parent = n.parentNode;
                    if(parent.tagName == 'P' && parent.lastChild === parent.firstChild){
                        $(n).children().each(function(j,li){
                            var p = parent.cloneNode(false);
                            $(p).append(li.innerHTML);
                            $(li).html('').append(p);
                        });
                        $(n).insertBefore(parent);
                        $(parent).remove();
                    }

                    if(dtd.$inline[parent.tagName]){
                        if(parent.tagName == 'SPAN'){

                            $(n).children().each(function(k,li){
                                var span = parent.cloneNode(false);
                                if(li.firstChild.nodeName != 'P'){

                                    while(li.firstChild){
                                        span.appendChild(li.firstChild)
                                    };
                                    $('<p></p>').appendTo(li).append(span);
                                }else{
                                    while(li.firstChild){
                                        span.appendChild(li.firstChild)
                                    };
                                    $(li.firstChild).append(span);
                                }
                            })

                        }
                        domUtils.remove(parent,true)
                    }
                });




                rng.moveToBookmark(bk).select();
                return true;
            },
            queryCommandState:function (cmdName) {
                return this.document.queryCommandState(cmdName);
            }
        };
};

/******source部分********/
///import core
///import plugins/serialize.js
///import plugins/undo.js
///commands 查看源码
///commandsName  Source
///commandsTitle  查看源码
(function (){
    var sourceEditors = {
        textarea: function (editor, holder){
            var textarea = holder.ownerDocument.createElement('textarea');
            textarea.style.cssText = 'resize:none;border:0;padding:0;margin:0;overflow-y:auto;outline:0';
            // todo: IE下只有onresize属性可用... 很纠结
            if (browser.ie && browser.version < 8) {

                textarea.style.width = holder.offsetWidth + 'px';
                textarea.style.height = holder.offsetHeight + 'px';
                holder.onresize = function (){
                    textarea.style.width = holder.offsetWidth + 'px';
                    textarea.style.height = holder.offsetHeight + 'px';
                };
            }
            holder.appendChild(textarea);
            return {
                container : textarea,
                setContent: function (content){
                    textarea.value = content;
                },
                getContent: function (){
                    return textarea.value;
                },
                select: function (){
                    var range;
                    if (browser.ie) {
                        range = textarea.createTextRange();
                        range.collapse(true);
                        range.select();
                    } else {
                        //todo: chrome下无法设置焦点
                        textarea.setSelectionRange(0, 0);
                        textarea.focus();
                    }
                },
                dispose: function (){
                    holder.removeChild(textarea);
                    // todo
                    holder.onresize = null;
                    textarea = null;
                    holder = null;
                }
            };
        }
    };

    UM.plugins['source'] = function (){
        var me = this;
        var opt = this.options;
        var sourceMode = false;
        var sourceEditor;

        opt.sourceEditor = 'textarea';

        me.setOpt({
            sourceEditorFirst:false
        });
        function createSourceEditor(holder){
            return sourceEditors.textarea(me, holder);
        }

        var bakCssText;
        //解决在源码模式下getContent不能得到最新的内容问题
        var oldGetContent = me.getContent,
            bakAddress;

        me.commands['source'] = {
            execCommand: function (){

                sourceMode = !sourceMode;
                if (sourceMode) {
                    bakAddress = me.selection.getRange().createAddress(false,true);
                    me.undoManger && me.undoManger.save(true);
                    if(browser.gecko){
                        me.body.contentEditable = false;
                    }

//                    bakCssText = me.body.style.cssText;
                    me.body.style.cssText += ';position:absolute;left:-32768px;top:-32768px;';


                    me.fireEvent('beforegetcontent');
                    var root = UM.htmlparser(me.body.innerHTML);
                    me.filterOutputRule(root);
                    root.traversal(function (node) {
                        if (node.type == 'element') {
                            switch (node.tagName) {
                                case 'td':
                                case 'th':
                                case 'caption':
                                    if(node.children && node.children.length == 1){
                                        if(node.firstChild().tagName == 'br' ){
                                            node.removeChild(node.firstChild())
                                        }
                                    };
                                    break;
                                case 'pre':
                                    node.innerText(node.innerText().replace(/&nbsp;/g,' '))

                            }
                        }
                    });

                    me.fireEvent('aftergetcontent');

                    var content = root.toHtml(true);

                    sourceEditor = createSourceEditor(me.body.parentNode);

                    sourceEditor.setContent(content);

                    var getStyleValue=function(attr){
                        return parseInt($(me.body).css(attr));
                    };
                    $(sourceEditor.container).width($(me.body).width()+getStyleValue("padding-left")+getStyleValue("padding-right"))
                        .height($(me.body).height());
                    setTimeout(function (){
                        sourceEditor.select();
                    });
                    //重置getContent，源码模式下取值也能是最新的数据
                    me.getContent = function (){
                        return sourceEditor.getContent() || '<p>' + (browser.ie ? '' : '<br/>')+'</p>';
                    };
                } else {
                    me.$body.css({
                        'position':'',
                        'left':'',
                        'top':''
                    });
//                    me.body.style.cssText = bakCssText;
                    var cont = sourceEditor.getContent() || '<p>' + (browser.ie ? '' : '<br/>')+'</p>';
                    //处理掉block节点前后的空格,有可能会误命中，暂时不考虑
                    cont = cont.replace(new RegExp('[\\r\\t\\n ]*<\/?(\\w+)\\s*(?:[^>]*)>','g'), function(a,b){
                        if(b && !dtd.$inlineWithA[b.toLowerCase()]){
                            return a.replace(/(^[\n\r\t ]*)|([\n\r\t ]*$)/g,'');
                        }
                        return a.replace(/(^[\n\r\t]*)|([\n\r\t]*$)/g,'')
                    });
                    me.setContent(cont);
                    sourceEditor.dispose();
                    sourceEditor = null;
                    //还原getContent方法
                    me.getContent = oldGetContent;
                    var first = me.body.firstChild;
                    //trace:1106 都删除空了，下边会报错，所以补充一个p占位
                    if(!first){
                        me.body.innerHTML = '<p>'+(browser.ie?'':'<br/>')+'</p>';
                    }
                    //要在ifm为显示时ff才能取到selection,否则报错
                    //这里不能比较位置了
                    me.undoManger && me.undoManger.save(true);
                    if(browser.gecko){
                        me.body.contentEditable = true;
                    }
                    try{
                        me.selection.getRange().moveToAddress(bakAddress).select();
                    }catch(e){}

                }
                this.fireEvent('sourcemodechanged', sourceMode);
            },
            queryCommandState: function (){
                return sourceMode|0;
            },
            notNeedUndo : 1
        };
        var oldQueryCommandState = me.queryCommandState;


        me.queryCommandState = function (cmdName){
            cmdName = cmdName.toLowerCase();
            if (sourceMode) {
                //源码模式下可以开启的命令
                return cmdName in {
                    'source' : 1,
                    'fullscreen' : 1
                } ? oldQueryCommandState.apply(this, arguments)  : -1
            }
            return oldQueryCommandState.apply(this, arguments);
        };

    };

})();
/*******enterkey部分*******/
///import core
///import plugins/undo.js
///commands 设置回车标签p或br
///commandsName  EnterKey
///commandsTitle  设置回车标签p或br
/**
 * @description 处理回车
 * @author zhanyi
 */
UM.plugins['enterkey'] = function() {
    var hTag,
        me = this,
        tag = me.options.enterTag;
    me.addListener('keyup', function(type, evt) {

        var keyCode = evt.keyCode || evt.which;
        if (keyCode == 13) {
            var range = me.selection.getRange(),
                start = range.startContainer,
                doSave;

            //修正在h1-h6里边回车后不能嵌套p的问题
            if (!browser.ie) {

                if (/h\d/i.test(hTag)) {
                    if (browser.gecko) {
                        var h = domUtils.findParentByTagName(start, [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6','blockquote','caption','table'], true);
                        if (!h) {
                            me.document.execCommand('formatBlock', false, '<p>');
                            doSave = 1;
                        }
                    } else {
                        //chrome remove div
                        if (start.nodeType == 1) {
                            var tmp = me.document.createTextNode(''),div;
                            range.insertNode(tmp);
                            div = domUtils.findParentByTagName(tmp, 'div', true);
                            if (div) {
                                var p = me.document.createElement('p');
                                while (div.firstChild) {
                                    p.appendChild(div.firstChild);
                                }
                                div.parentNode.insertBefore(p, div);
                                domUtils.remove(div);
                                range.setStartBefore(tmp).setCursor();
                                doSave = 1;
                            }
                            domUtils.remove(tmp);

                        }
                    }

                    if (me.undoManger && doSave) {
                        me.undoManger.save();
                    }
                }
                //没有站位符，会出现多行的问题
                browser.opera &&  range.select();
            }else{
                me.fireEvent('saveScene',true,true)
            }
        }
    });

    me.addListener('keydown', function(type, evt) {
        var keyCode = evt.keyCode || evt.which;
        if (keyCode == 13) {//回车
            if(me.fireEvent('beforeenterkeydown')){
                domUtils.preventDefault(evt);
                return;
            }
            me.fireEvent('saveScene',true,true);
            hTag = '';


            var range = me.selection.getRange();

            if (!range.collapsed) {
                //跨td不能删
                var start = range.startContainer,
                    end = range.endContainer,
                    startTd = domUtils.findParentByTagName(start, 'td', true),
                    endTd = domUtils.findParentByTagName(end, 'td', true);
                if (startTd && endTd && startTd !== endTd || !startTd && endTd || startTd && !endTd) {
                    evt.preventDefault ? evt.preventDefault() : ( evt.returnValue = false);
                    return;
                }
            }
            if (tag == 'p') {


                if (!browser.ie) {

                    start = domUtils.findParentByTagName(range.startContainer, ['ol','ul','p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6','blockquote','caption'], true);

                    //opera下执行formatblock会在table的场景下有问题，回车在opera原生支持很好，所以暂时在opera去掉调用这个原生的command
                    //trace:2431
                    if (!start && !browser.opera) {

                        me.document.execCommand('formatBlock', false, '<p>');

                        if (browser.gecko) {
                            range = me.selection.getRange();
                            start = domUtils.findParentByTagName(range.startContainer, 'p', true);
                            start && domUtils.removeDirtyAttr(start);
                        }


                    } else {
                        hTag = start.tagName;
                        start.tagName.toLowerCase() == 'p' && browser.gecko && domUtils.removeDirtyAttr(start);
                    }

                }

            }

        }
    });

    browser.ie && me.addListener('setDisabled',function(){
        $(me.body).find('p').each(function(i,p){
            if(domUtils.isEmptyBlock(p)){
                p.innerHTML = '&nbsp;'
            }
        })
    })
};

/******preview部分******/
///import core
///commands 预览
///commandsName  Preview
///commandsTitle  预览
/**
 * 预览
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     preview预览编辑器内容
 */
UM.commands['preview'] = {
    execCommand : function(){
        var w = window.open('', '_blank', ''),
            d = w.document,
            c = this.getContent(null,null,true),
            path = this.getOpt('UMEDITOR_HOME_URL'),
            formula = c.indexOf('mathquill-embedded-latex')!=-1 ?
                '<link rel="stylesheet" href="' + path + 'third-party/mathquill/mathquill.css"/>' +
                '<script src="' + path + 'third-party/jquery.min.js"></script>' +
                '<script src="' + path + 'third-party/mathquill/mathquill.min.js"></script>':'';
        d.open();
        d.write('<html><head>' + formula + '</head><body><div>'+c+'</div></body></html>');
        d.close();
    },
    notNeedUndo : 1
};
/*********basestyle部分*************/
///import core
///commands 加粗,斜体,上标,下标
///commandsName  Bold,Italic,Subscript,Superscript
///commandsTitle  加粗,加斜,下标,上标
/**
 * b u i等基础功能实现
 * @function
 * @name UM.execCommands
 * @param    {String}    cmdName    bold加粗。italic斜体。subscript上标。superscript下标。
*/
UM.plugins['basestyle'] = function(){
    var basestyles = ['bold','underline','superscript','subscript','italic','strikethrough'],
        me = this;
    //添加快捷键
    me.addshortcutkey({
        "Bold" : "ctrl+66",//^B
        "Italic" : "ctrl+73", //^I
        "Underline" : "ctrl+shift+85",//^U
        "strikeThrough" : 'ctrl+shift+83' //^s
    });
    //过滤最后的产出数据
    me.addOutputRule(function(root){
        $.each(root.getNodesByTagName('b i u strike s'),function(i,node){
            switch (node.tagName){
                case 'b':
                    node.tagName = 'strong';
                    break;
                case 'i':
                    node.tagName = 'em';
                    break;
                case 'u':
                    node.tagName = 'span';
                    node.setStyle('text-decoration','underline');
                    break;
                case 's':
                case 'strike':
                    node.tagName = 'span';
                    node.setStyle('text-decoration','line-through')
            }
        });
    });
    $.each(basestyles,function(i,cmd){
        me.commands[cmd] = {
            execCommand : function( cmdName ) {
                var rng = this.selection.getRange();
                if(rng.collapsed && this.queryCommandState(cmdName) != 1){
                    var node = this.document.createElement({
                        'bold':'strong',
                        'underline':'u',
                        'superscript':'sup',
                        'subscript':'sub',
                        'italic':'em',
                        'strikethrough':'strike'
                    }[cmdName]);
                    rng.insertNode(node).setStart(node,0).setCursor(false);
                    return true;
                }else{
                    return this.document.execCommand(cmdName)
                }

            },
            queryCommandState : function(cmdName) {
                if(browser.gecko){
                    return this.document.queryCommandState(cmdName)
                }
                var path = this.selection.getStartElementPath(),result = false;
                $.each(path,function(i,n){
                    switch (cmdName){
                        case 'bold':
                            if(n.nodeName == 'STRONG' || n.nodeName == 'B'){
                                result = 1;
                                return false;
                            }
                            break;
                        case 'underline':
                            if(n.nodeName == 'U' || n.nodeName == 'SPAN' && $(n).css('text-decoration') == 'underline'){
                                result = 1;
                                return false;
                            }
                            break;
                        case 'superscript':
                            if(n.nodeName == 'SUP'){
                                result = 1;
                                return false;
                            }
                            break;
                        case 'subscript':
                            if(n.nodeName == 'SUB'){
                                result = 1;
                                return false;
                            }
                            break;
                        case 'italic':
                            if(n.nodeName == 'EM' || n.nodeName == 'I'){
                                result = 1;
                                return false;
                            }
                            break;
                        case 'strikethrough':
                            if(n.nodeName == 'S' || n.nodeName == 'STRIKE' || n.nodeName == 'SPAN' && $(n).css('text-decoration') == 'line-through'){
                                result = 1;
                                return false;
                            }
                            break;
                    }
                })
                return result
            }
        };
    })
};

/*********video部分*************/
///import core
///import plugins/inserthtml.js
///commands 视频
///commandsName InsertVideo
///commandsTitle  插入视频
///commandsDialog  dialogs\video
UM.plugins['video'] = function (){
    var me =this,
        div;

    /**
     * 创建插入视频字符窜
     * @param url 视频地址
     * @param width 视频宽度
     * @param height 视频高度
     * @param align 视频对齐
     * @param toEmbed 是否以flash代替显示
     * @param addParagraph  是否需要添加P 标签
     */
    function creatInsertStr(url,width,height,id,align,toEmbed){
        return  !toEmbed ?

                '<img ' + (id ? 'id="' + id+'"' : '') + ' width="'+ width +'" height="' + height + '" _url="'+url+'" class="edui-faked-video"'  +
                ' src="' + me.options.UMEDITOR_HOME_URL+'themes/default/images/spacer.gif" style="background:url('+me.options.UMEDITOR_HOME_URL+'themes/default/images/videologo.gif) no-repeat center center; border:1px solid gray;'+(align ? 'float:' + align + ';': '')+'" />'

                :
                '<embed type="application/x-shockwave-flash" class="edui-faked-video" pluginspage="http://www.macromedia.com/go/getflashplayer"' +
                ' src="' + url + '" width="' + width  + '" height="' + height  + '"'  + (align ? ' style="float:' + align + '"': '') +
                ' wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" >';
    }

    function switchImgAndEmbed(root,img2embed){
        utils.each(root.getNodesByTagName(img2embed ? 'img' : 'embed'),function(node){
            if(node.getAttr('class') == 'edui-faked-video'){

                var html = creatInsertStr( img2embed ? node.getAttr('_url') : node.getAttr('src'),node.getAttr('width'),node.getAttr('height'),null,node.getStyle('float') || '',img2embed);
                node.parentNode.replaceChild(UM.uNode.createElement(html),node)
            }
        })
    }

    me.addOutputRule(function(root){
        switchImgAndEmbed(root,true)
    });
    me.addInputRule(function(root){
        switchImgAndEmbed(root)
    });

    me.commands["insertvideo"] = {
        execCommand: function (cmd, videoObjs){
            videoObjs = utils.isArray(videoObjs)?videoObjs:[videoObjs];
            var html = [],id = 'tmpVedio';
            for(var i=0,vi,len = videoObjs.length;i<len;i++){
                 vi = videoObjs[i];
                 html.push(creatInsertStr( vi.url, vi.width || 420,  vi.height || 280, id + i,vi.align,false));
            }
            me.execCommand("inserthtml",html.join(""),true);

        },
        queryCommandState : function(){
            var img = me.selection.getRange().getClosedNode(),
                flag = img && (img.className == "edui-faked-video");
            return flag ? 1 : 0;
        }
    };
};
/*******selectall部分*******/
///import core
///commands 全选
///commandsName  SelectAll
///commandsTitle  全选
/**
 * 选中所有
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName    selectall选中编辑器里的所有内容
 * @author zhanyi
*/
UM.plugins['selectall'] = function(){
    var me = this;
    me.commands['selectall'] = {
        execCommand : function(){
            //去掉了原生的selectAll,因为会出现报错和当内容为空时，不能出现闭合状态的光标
            var me = this,body = me.body,
                range = me.selection.getRange();
            range.selectNodeContents(body);
            if(domUtils.isEmptyBlock(body)){
                //opera不能自动合并到元素的里边，要手动处理一下
                if(browser.opera && body.firstChild && body.firstChild.nodeType == 1){
                    range.setStartAtFirst(body.firstChild);
                }
                range.collapse(true);
            }
            range.select(true);
        },
        notNeedUndo : 1
    };


    //快捷键
    me.addshortcutkey({
         "selectAll" : "ctrl+65"
    });
};
/********removeformat部分*********/
//UM.plugins['removeformat'] = function () {
//    var me = this;
//    me.commands['removeformat'] = {
//        execCommand: function () {
//            me.document.execCommand('removeformat');
//
//            /* 处理ie8和firefox选区有链接时,清除格式的bug */
//            if (browser.gecko || browser.ie8 || browser.webkit) {
//                var nativeRange = this.selection.getNative().getRangeAt(0),
//                    common = nativeRange.commonAncestorContainer,
//                    rng = me.selection.getRange(),
//                    bk = rng.createBookmark();
//
//                function isEleInBookmark(node, bk){
//                    if ( (domUtils.getPosition(node, bk.start) & domUtils.POSITION_FOLLOWING) &&
//                        (domUtils.getPosition(bk.end, node) & domUtils.POSITION_FOLLOWING) ) {
//                        return true;
//                    } else if ( (domUtils.getPosition(node, bk.start) & domUtils.POSITION_CONTAINS) ||
//                        (domUtils.getPosition(node, bk.end) & domUtils.POSITION_CONTAINS) ) {
//                        return true;
//                    }
//                    return false;
//                }
//
//                $(common).find('a').each(function (k, a) {
//                    if ( isEleInBookmark(a, bk) ) {
//                        a.removeAttribute('style');
//                    }
//                });
//
//            }
//        }
//    };
//
//};
//


UM.plugins['removeformat'] = function(){
    var me = this;
    me.setOpt({
        'removeFormatTags': 'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var',
        'removeFormatAttributes':'class,style,lang,width,height,align,hspace,valign'
    });
    me.commands['removeformat'] = {
        execCommand : function( cmdName, tags, style, attrs,notIncludeA ) {

            var tagReg = new RegExp( '^(?:' + (tags || this.options.removeFormatTags).replace( /,/g, '|' ) + ')$', 'i' ) ,
                removeFormatAttributes = style ? [] : (attrs || this.options.removeFormatAttributes).split( ',' ),
                range = new dom.Range( this.document ),
                bookmark,node,parent,
                filter = function( node ) {
                    return node.nodeType == 1;
                };

            function isRedundantSpan (node) {
                if (node.nodeType == 3 || node.tagName.toLowerCase() != 'span'){
                    return 0;
                }
                if (browser.ie) {
                    //ie 下判断实效，所以只能简单用style来判断
                    //return node.style.cssText == '' ? 1 : 0;
                    var attrs = node.attributes;
                    if ( attrs.length ) {
                        for ( var i = 0,l = attrs.length; i<l; i++ ) {
                            if ( attrs[i].specified ) {
                                return 0;
                            }
                        }
                        return 1;
                    }
                }
                return !node.attributes.length;
            }
            function doRemove( range ) {

                var bookmark1 = range.createBookmark();
                if ( range.collapsed ) {
                    range.enlarge( true );
                }

                //不能把a标签切了
                if(!notIncludeA){
                    var aNode = domUtils.findParentByTagName(range.startContainer,'a',true);
                    if(aNode){
                        range.setStartBefore(aNode);
                    }

                    aNode = domUtils.findParentByTagName(range.endContainer,'a',true);
                    if(aNode){
                        range.setEndAfter(aNode);
                    }

                }


                bookmark = range.createBookmark();

                node = bookmark.start;

                //切开始
                while ( (parent = node.parentNode) && !domUtils.isBlockElm( parent ) ) {
                    domUtils.breakParent( node, parent );
                    domUtils.clearEmptySibling( node );
                }
                if ( bookmark.end ) {
                    //切结束
                    node = bookmark.end;
                    while ( (parent = node.parentNode) && !domUtils.isBlockElm( parent ) ) {
                        domUtils.breakParent( node, parent );
                        domUtils.clearEmptySibling( node );
                    }

                    //开始去除样式
                    var current = domUtils.getNextDomNode( bookmark.start, false, filter ),
                        next;
                    while ( current ) {
                        if ( current == bookmark.end ) {
                            break;
                        }

                        next = domUtils.getNextDomNode( current, true, filter );

                        if ( !dtd.$empty[current.tagName.toLowerCase()] && !domUtils.isBookmarkNode( current ) ) {
                            if ( tagReg.test( current.tagName ) ) {
                                if ( style ) {
                                    domUtils.removeStyle( current, style );
                                    if ( isRedundantSpan( current ) && style != 'text-decoration'){
                                        domUtils.remove( current, true );
                                    }
                                } else {
                                    domUtils.remove( current, true );
                                }
                            } else {
                                //trace:939  不能把list上的样式去掉
                                if(!dtd.$tableContent[current.tagName] && !dtd.$list[current.tagName]){
                                    domUtils.removeAttributes( current, removeFormatAttributes );
                                    if ( isRedundantSpan( current ) ){
                                        domUtils.remove( current, true );
                                    }
                                }

                            }
                        }
                        current = next;
                    }
                }
                //trace:1035
                //trace:1096 不能把td上的样式去掉，比如边框
                var pN = bookmark.start.parentNode;
                if(domUtils.isBlockElm(pN) && !dtd.$tableContent[pN.tagName] && !dtd.$list[pN.tagName]){
                    domUtils.removeAttributes(  pN,removeFormatAttributes );
                }
                pN = bookmark.end.parentNode;
                if(bookmark.end && domUtils.isBlockElm(pN) && !dtd.$tableContent[pN.tagName]&& !dtd.$list[pN.tagName]){
                    domUtils.removeAttributes(  pN,removeFormatAttributes );
                }
                range.moveToBookmark( bookmark ).moveToBookmark(bookmark1);
                //清除冗余的代码 <b><bookmark></b>
                var node = range.startContainer,
                    tmp,
                    collapsed = range.collapsed;
                while(node.nodeType == 1 && domUtils.isEmptyNode(node) && dtd.$removeEmpty[node.tagName]){
                    tmp = node.parentNode;
                    range.setStartBefore(node);
                    //trace:937
                    //更新结束边界
                    if(range.startContainer === range.endContainer){
                        range.endOffset--;
                    }
                    domUtils.remove(node);
                    node = tmp;
                }

                if(!collapsed){
                    node = range.endContainer;
                    while(node.nodeType == 1 && domUtils.isEmptyNode(node) && dtd.$removeEmpty[node.tagName]){
                        tmp = node.parentNode;
                        range.setEndBefore(node);
                        domUtils.remove(node);

                        node = tmp;
                    }


                }
            }



            range = this.selection.getRange();
            if(!range.collapsed) {
                doRemove( range );
                range.select();
            }

        }

    };

};
/**********keystrokes部分***********/
/*
 *   处理特殊键的兼容性问题
 */
UM.plugins['keystrokes'] = function() {
    var me = this;
    var collapsed = true;
    me.addListener('keydown', function(type, evt) {
        var keyCode = evt.keyCode || evt.which,
            rng = me.selection.getRange();

        //处理全选的情况
        if(!rng.collapsed && !(evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) && (keyCode >= 65 && keyCode <=90
            || keyCode >= 48 && keyCode <= 57 ||
            keyCode >= 96 && keyCode <= 111 || {
            13:1,
            8:1,
            46:1
        }[keyCode])
            ){

            var tmpNode = rng.startContainer;
            if(domUtils.isFillChar(tmpNode)){
                rng.setStartBefore(tmpNode)
            }
            tmpNode = rng.endContainer;
            if(domUtils.isFillChar(tmpNode)){
                rng.setEndAfter(tmpNode)
            }
            rng.txtToElmBoundary();
            //结束边界可能放到了br的前边，要把br包含进来
            // x[xxx]<br/>
            if(rng.endContainer && rng.endContainer.nodeType == 1){
                tmpNode = rng.endContainer.childNodes[rng.endOffset];
                if(tmpNode && domUtils.isBr(tmpNode)){
                    rng.setEndAfter(tmpNode);
                }
            }
            if(rng.startOffset == 0){
                tmpNode = rng.startContainer;
                if(domUtils.isBoundaryNode(tmpNode,'firstChild') ){
                    tmpNode = rng.endContainer;
                    if(rng.endOffset == (tmpNode.nodeType == 3 ? tmpNode.nodeValue.length : tmpNode.childNodes.length) && domUtils.isBoundaryNode(tmpNode,'lastChild')){
                        me.fireEvent('saveScene');
                        me.body.innerHTML = '<p>'+(browser.ie ? '' : '<br/>')+'</p>';
                        rng.setStart(me.body.firstChild,0).setCursor(false,true);
                        me._selectionChange();
                        return;
                    }
                }
            }
        }

        //处理backspace
        if (keyCode == 8) {
            rng = me.selection.getRange();
            collapsed = rng.collapsed;
            if(me.fireEvent('delkeydown',evt)){
                return;
            }
            var start,end;
            //避免按两次删除才能生效的问题
            if(rng.collapsed && rng.inFillChar()){
                start = rng.startContainer;

                if(domUtils.isFillChar(start)){
                    rng.setStartBefore(start).shrinkBoundary(true).collapse(true);
                    domUtils.remove(start)
                }else{
                    start.nodeValue = start.nodeValue.replace(new RegExp('^' + domUtils.fillChar ),'');
                    rng.startOffset--;
                    rng.collapse(true).select(true)
                }
            }
            //解决选中control元素不能删除的问题
            if (start = rng.getClosedNode()) {
                me.fireEvent('saveScene');
                rng.setStartBefore(start);
                domUtils.remove(start);
                rng.setCursor();
                me.fireEvent('saveScene');
                domUtils.preventDefault(evt);
                return;
            }
            //阻止在table上的删除
            if (!browser.ie) {
                start = domUtils.findParentByTagName(rng.startContainer, 'table', true);
                end = domUtils.findParentByTagName(rng.endContainer, 'table', true);
                if (start && !end || !start && end || start !== end) {
                    evt.preventDefault();
                    return;
                }
            }
            start = rng.startContainer;
            if(rng.collapsed && start.nodeType == 1){
                var currentNode = start.childNodes[rng.startOffset-1];
                if(currentNode && currentNode.nodeType == 1 && currentNode.tagName == 'BR'){
                    me.fireEvent('saveScene');
                    rng.setStartBefore(currentNode).collapse(true);
                    domUtils.remove(currentNode);
                    rng.select();
                    me.fireEvent('saveScene');
                }
            }

            //trace:3613
            if(browser.chrome){
                if(rng.collapsed){

                    while(rng.startOffset == 0 && !domUtils.isEmptyBlock(rng.startContainer)){
                        rng.setStartBefore(rng.startContainer)
                    }
                    var pre = rng.startContainer.childNodes[rng.startOffset-1];
                    if(pre && pre.nodeName == 'BR'){
                        rng.setStartBefore(pre);
                        me.fireEvent('saveScene');
                        $(pre).remove();
                        rng.setCursor();
                        me.fireEvent('saveScene');
                    }

                }
            }
        }
        //trace:1634
        //ff的del键在容器空的时候，也会删除
        if(browser.gecko && keyCode == 46){
            var range = me.selection.getRange();
            if(range.collapsed){
                start = range.startContainer;
                if(domUtils.isEmptyBlock(start)){
                    var parent = start.parentNode;
                    while(domUtils.getChildCount(parent) == 1 && !domUtils.isBody(parent)){
                        start = parent;
                        parent = parent.parentNode;
                    }
                    if(start === parent.lastChild)
                        evt.preventDefault();
                    return;
                }
            }
        }
    });
    me.addListener('keyup', function(type, evt) {
        var keyCode = evt.keyCode || evt.which,
            rng,me = this;
        if(keyCode == 8){
            if(me.fireEvent('delkeyup')){
                return;
            }
            rng = me.selection.getRange();
            if(rng.collapsed){
                var tmpNode,
                    autoClearTagName = ['h1','h2','h3','h4','h5','h6'];
                if(tmpNode = domUtils.findParentByTagName(rng.startContainer,autoClearTagName,true)){
                    if(domUtils.isEmptyBlock(tmpNode)){
                        var pre = tmpNode.previousSibling;
                        if(pre && pre.nodeName != 'TABLE'){
                            domUtils.remove(tmpNode);
                            rng.setStartAtLast(pre).setCursor(false,true);
                            return;
                        }else{
                            var next = tmpNode.nextSibling;
                            if(next && next.nodeName != 'TABLE'){
                                domUtils.remove(tmpNode);
                                rng.setStartAtFirst(next).setCursor(false,true);
                                return;
                            }
                        }
                    }
                }
                //处理当删除到body时，要重新给p标签展位
                if(domUtils.isBody(rng.startContainer)){
                    var tmpNode = domUtils.createElement(me.document,'p',{
                        'innerHTML' : browser.ie ? domUtils.fillChar : '<br/>'
                    });
                    rng.insertNode(tmpNode).setStart(tmpNode,0).setCursor(false,true);
                }
            }


            //chrome下如果删除了inline标签，浏览器会有记忆，在输入文字还是会套上刚才删除的标签，所以这里再选一次就不会了
            if( !collapsed && (rng.startContainer.nodeType == 3 || rng.startContainer.nodeType == 1 && domUtils.isEmptyBlock(rng.startContainer))){
                if(browser.ie){
                    var span = rng.document.createElement('span');
                    rng.insertNode(span).setStartBefore(span).collapse(true);
                    rng.select();
                    domUtils.remove(span)
                }else{
                    rng.select()
                }

            }
        }

    })
};
	/**********autosave部分**********/
	/**
 * 自动保存草稿
 */
UM.plugins['autosave'] = function() {


    var me = this,
        //无限循环保护
        lastSaveTime = new Date(),
        //最小保存间隔时间
        MIN_TIME = 20,
        //auto save key
        saveKey = null;


    //默认间隔时间
    me.setOpt('saveInterval', 500);

    //存储媒介封装
    var LocalStorage = UM.LocalStorage = ( function () {

        var storage = window.localStorage || getUserData() || null,
            LOCAL_FILE = "localStorage";

        return {

            saveLocalData: function ( key, data ) {

                if ( storage && data) {
                    storage.setItem( key, data  );
                    return true;
                }

                return false;

            },

            getLocalData: function ( key ) {

                if ( storage ) {
                    return storage.getItem( key );
                }

                return null;

            },

            removeItem: function ( key ) {

                storage && storage.removeItem( key );

            }

        };

        function getUserData () {

            var container = document.createElement( "div" );
            container.style.display = "none";

            if( !container.addBehavior ) {
                return null;
            }

            container.addBehavior("#default#userdata");

            return {

                getItem: function ( key ) {

                    var result = null;

                    try {
                        document.body.appendChild( container );
                        container.load( LOCAL_FILE );
                        result = container.getAttribute( key );
                        document.body.removeChild( container );
                    } catch ( e ) {
                    }

                    return result;

                },

                setItem: function ( key, value ) {

                    document.body.appendChild( container );
                    container.setAttribute( key, value );
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                },
//               暂时没有用到
//                clear: function () {
//
//                    var expiresTime = new Date();
//                    expiresTime.setFullYear( expiresTime.getFullYear() - 1 );
//                    document.body.appendChild( container );
//                    container.expires = expiresTime.toUTCString();
//                    container.save( LOCAL_FILE );
//                    document.body.removeChild( container );
//
//                },

                removeItem: function ( key ) {

                    document.body.appendChild( container );
                    container.removeAttribute( key );
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                }

            };

        }

    } )();

    function save ( editor ) {

        var saveData = null;

        if ( new Date() - lastSaveTime < MIN_TIME ) {
            return;
        }

        if ( !editor.hasContents() ) {
            //这里不能调用命令来删除， 会造成事件死循环
            saveKey && LocalStorage.removeItem( saveKey );
            return;
        }

        lastSaveTime = new Date();

        editor._saveFlag = null;

        saveData = me.body.innerHTML;

        if ( editor.fireEvent( "beforeautosave", {
            content: saveData
        } ) === false ) {
            return;
        }

        LocalStorage.saveLocalData( saveKey, saveData );

        editor.fireEvent( "afterautosave", {
            content: saveData
        } );

    }

    me.addListener('ready', function(){
        var _suffix = "-drafts-data",
            key = null;

        if ( me.key ) {
            key = me.key + _suffix;
        } else {
            key = ( me.container.parentNode.id || 'ue-common' ) + _suffix;
        }

        //页面地址+编辑器ID 保持唯一
        saveKey = ( location.protocol + location.host + location.pathname ).replace( /[.:\/]/g, '_' ) + key;
    });

    me.addListener('contentchange', function(){

        if ( !saveKey ) {
            return;
        }

        if ( me._saveFlag ) {
            window.clearTimeout( me._saveFlag );
        }

        if ( me.options.saveInterval > 0 ) {

            me._saveFlag = window.setTimeout( function () {

                save( me );

            }, me.options.saveInterval );

        } else {

            save(me);

        }

    })


    me.commands['clearlocaldata'] = {
        execCommand:function (cmd, name) {
            if ( saveKey && LocalStorage.getLocalData( saveKey ) ) {
                LocalStorage.removeItem( saveKey )
            }
        },
        notNeedUndo: true,
        ignoreContentChange:true
    };

    me.commands['getlocaldata'] = {
        execCommand:function (cmd, name) {
            return saveKey ? LocalStorage.getLocalData( saveKey ) || '' : '';
        },
        notNeedUndo: true,
        ignoreContentChange:true
    };

    me.commands['drafts'] = {
        execCommand:function (cmd, name) {
            if ( saveKey ) {
                me.body.innerHTML = LocalStorage.getLocalData( saveKey ) || '<p>'+(browser.ie ? '&nbsp;' : '<br/>')+'</p>';
                me.focus(true);
            }
        },
        queryCommandState: function () {
            return saveKey ? ( LocalStorage.getLocalData( saveKey ) === null ? -1 : 0 ) : -1;
        },
        notNeedUndo: true,
        ignoreContentChange:true
    }

};
/**********autoupload部分***********/
/**
 * @description
 * 1.拖放文件到编辑区域，自动上传并插入到选区
 * 2.插入粘贴板的图片，自动上传并插入到选区
 * @author Jinqn
 * @date 2013-10-14
 */
UM.plugins['autoupload'] = function () {

    var me = this;

    me.setOpt('pasteImageEnabled', true);
    me.setOpt('dropFileEnabled', true);
    var sendAndInsertImage = function (file, editor) {
        //模拟数据
        var fd = new FormData();
        fd.append(editor.options.imageFieldName || 'upfile', file, file.name || ('blob.' + file.type.substr('image/'.length)));
        fd.append('type', 'ajax');
        var xhr = new XMLHttpRequest();
        xhr.open("post", me.options.imageUrl, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.addEventListener('load', function (e) {
            try {
                var json = eval('('+e.target.response+')'),
                    link = json.url,
                    picLink = me.options.imagePath + link;
                editor.execCommand('insertimage', {
                    src: picLink,
                    _src: picLink
                });
            } catch (er) {
            }
        });
        xhr.send(fd);
    };

    function getPasteImage(e) {
        return e.clipboardData && e.clipboardData.items && e.clipboardData.items.length == 1 && /^image\//.test(e.clipboardData.items[0].type) ? e.clipboardData.items : null;
    }

    function getDropImage(e) {
        return  e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : null;
    }

    me.addListener('ready', function () {
        if (window.FormData && window.FileReader) {
            var autoUploadHandler = function (e) {
                var hasImg = false,
                    items;
                //获取粘贴板文件列表或者拖放文件列表
                items = e.type == 'paste' ? getPasteImage(e.originalEvent) : getDropImage(e.originalEvent);
                if (items) {
                    var len = items.length,
                        file;
                    while (len--) {
                        file = items[len];
                        if (file.getAsFile) file = file.getAsFile();
                        if (file && file.size > 0 && /image\/\w+/i.test(file.type)) {
                            sendAndInsertImage(file, me);
                            hasImg = true;
                        }
                    }
                    if (hasImg) return false;
                }

            };
            me.getOpt('pasteImageEnabled') && me.$body.on('paste', autoUploadHandler);
            me.getOpt('dropFileEnabled') && me.$body.on('drop', autoUploadHandler);

            //取消拖放图片时出现的文字光标位置提示
            me.$body.on('dragover', function (e) {
                if (e.originalEvent.dataTransfer.types[0] == 'Files') {
                    return false;
                }
            });
        }
    });

};
/************formula部分**************/
/**
 * 公式插件
 */
UM.plugins['formula'] = function () {
    var me = this;

    function getActiveIframe() {
        return me.$body.find('iframe.edui-formula-active')[0] || null;
    }

    function blurActiveIframe(){
        var iframe = getActiveIframe();
        iframe && iframe.contentWindow.formula.blur();
    }

    me.addInputRule(function (root) {
        $.each(root.getNodesByTagName('span'), function (i, node) {
            if (node.hasClass('mathquill-embedded-latex')) {
                var firstChild, latex = '';
                while(firstChild = node.firstChild()){
                    latex += firstChild.data;
                    node.removeChild(firstChild);
                }
                node.tagName = 'iframe';
                node.setAttr({
                    'frameborder': '0',
                    'src': me.getOpt('UMEDITOR_HOME_URL') + 'dialogs/formula/formula.html',
                    'data-latex': utils.unhtml(latex)
                });
            }
        });
    });
    me.addOutputRule(function (root) {
        $.each(root.getNodesByTagName('iframe'), function (i, node) {
            if (node.hasClass('mathquill-embedded-latex')) {
                node.tagName = 'span';
                node.appendChild(UM.uNode.createText(node.getAttr('data-latex')));
                node.setAttr({
                    'frameborder': '',
                    'src': '',
                    'data-latex': ''
                });
            }
        });
    });
    me.addListener('click', function(){
        blurActiveIframe();
    });
    me.addListener('afterexeccommand', function(type, cmd){
        if(cmd != 'formula') {
            blurActiveIframe();
        }
    });

    me.commands['formula'] = {
        execCommand: function (cmd, latex) {
            var iframe = getActiveIframe();
            if (iframe) {
                iframe.contentWindow.formula.insertLatex(latex);
            } else {
                me.execCommand('inserthtml', '<span class="mathquill-embedded-latex">' + latex + '</span>');
                browser.ie && browser.ie9below && setTimeout(function(){
                    var rng = me.selection.getRange(),
                        startContainer = rng.startContainer;
                    if(startContainer.nodeType == 1 && !startContainer.childNodes[rng.startOffset]){
                        rng.insertNode(me.document.createTextNode(' '));
                        rng.setCursor()
                    }
                },100)
            }
        },
        queryCommandState: function (cmd) {
            return 0;
        },
        queryCommandValue: function (cmd) {
            var iframe = getActiveIframe();
            return iframe && iframe.contentWindow.formula.getLatex();
        }
    }

};
