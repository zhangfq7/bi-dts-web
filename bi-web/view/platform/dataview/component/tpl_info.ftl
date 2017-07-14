<div class="tpl-chose">
        <div>
           <div class="save-btn"></div>
                                保存模板
        </div>
        <div>
            <div class="import-btn"></div>
                                  引入模板
        </div>
</div>

<div class="tpl-save hide validationEngineContainer">
        <div>
           <div class="title">模版名称：</div>
           <div class="content">
               <input class="bi-input validate[required,len[1,100]]"/>
           </div>
        </div>
        <div>
           <div class="title">模版描述：</div>
           <div class="content">
               <textarea class="bi-textarea validate[required,len[1,200]]"></textarea>
           </div>
        </div>
</div>

<div class="tpl-import hide">
        <div>
           <div class="title">模板名称：</div>
           <div class="content">
               <input class="bi-input"/>
               <button class="aui_state_highlight" type="button" id="tpl_search">查询</button>
           </div>
        </div>
        <table class="easyui-datagrid" id="dg" style="width:630px;">
		<thead>
			
		</thead>
	</table>
</div>











