define(["view/box"],function(a){var b={};b.control={init:function(){b.view.init()},resize:function(){if(window.myLayout){window.myLayout.resizeAll()}}};b.view={init:function(){window.myLayout=jQuery("body").layout(b.module.config)}};b.module={config:{north:{size:120,spacing_open:0,spacing_closed:0},west:{spacing_open:4,spacing_closed:0,minSize:180},center:{children:{inset:{top:0,bottom:0,left:0,right:0},center:{border:false},north:{spacing_open:0,spacing_closed:0,showOverflowOnHover:true,bi_hoverAuto:true}}}}};return b.control});