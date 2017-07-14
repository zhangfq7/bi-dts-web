<#include "view/manage/frame/bace/top.ftl">
	<link rel="stylesheet" href="${resPath}/resources/manage/sysmanage/func/css/func-manage.css${css_version}">

	<div class="panel">
		<span class="f16"><@spring.message code='label.func.title.funcManage'/></span>
	</div>
	<div class="panel">
		<ul id="searchPanel" class="tab-pane">
			<li class="form-group form-group-sm">
				<div class="label-class">
					<span class="f14"><@spring.message code='label.func.funcName'/></span>
				</div>
				<div class="search-class">
					<input type="text" class="form-control validate[required,len[0,100],sp[{me:'#|%|<|>|?|$|&|/|\'|\\\\'}]]" id="queryFuncName" />
				</div>
				<div class="label-class"></div>
				<div class="search-class">
					<button id="searchButton" type="button" class="btn btn-info btn-sm button-class">
						<@spring.message code='button.func.search' />
					</button>
				</div>
			</li>
		</ul>
		<HR/>
		<ul id="operPanel" class="oper-pane">
			<li class="form-group form-group-sm">
				<div>
					<button id="addFuncButton" type="button" class="btn btn-info btn-sm button-class">
						<@spring.message code='button.func.add' />
					</button>
				</div>
				<div>
					<button id="modifyFuncButton" type="button" class="btn btn-info btn-sm button-class">
						<@spring.message code='button.func.update' />
					</button>
				</div>
				<div>
					<button id="delFuncButton" type="button" class="btn btn-danger btn-sm button-class">
						<@spring.message code='button.func.delete' />
					</button>
				</div>
			</li>

			<div>
		</ul>
		<ul id="funcListPanel" class="fun-list">
			<li id="funcList">
				<table id="funcTree" style="width:100%"></table>
			</li>
		</ul>
		</div>

	</div>

	<div style="display:none;">
		<ul id="funcInfoPanel" class="func-info-panel validationEngineContainer">
			<li class="form-group form-group-sm typeLine">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.funcType'/></span>
				</div>
				<div class="input-class typeselect hide">
					<select id="otype" class="searchType-class">
						<option value="1"><@spring.message code='label.func.func'/></option>
						<option value="2"><@spring.message code='label.func.folder'/></option>
					</select>
				</div>
				<div id="otype" value="3" class="input-class text hide"><@spring.message code='label.func.sys'/></div>
			</li>
			<li class="form-group form-group-sm">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.funcCode'/></span>
				</div>
				<div class="input-class">
					<input type="text" id="funcId" value="" placeholder='<@spring.message code='label.func.msg.func'/>' class="form-control validate[required,len[0,40],sp[{me:'#|%|<|>|?|$|&|/|\'|\\\\'}]]" />
				</div>
				<div class="span-class"><span id="funcIdSpan"></span></div>
			</li>
			
			<li class="form-group form-group-sm">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.funcName'/></span>
				</div>
				<div class="input-class">
					<input type="text" id="funcName" value="" placeholder='<@spring.message code='label.func.msg.funcName'/>' class="form-control validate[required,len[0,100],sp[{me:'#|%|<|>|?|$|&|/|\'|\\\\'}]]" />
					<input type="hidden" id="pid" />
					<input type="hidden" id="systemId" />
				</div>
			</li>
			</li>
			<li id="dimIcon" class="form-group form-group-sm">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.icon'/></span>
				</div>
				<div class="input-class">
					<input type="text" id="icon" value="" placeholder='<@spring.message code='label.func.msg.icon'/>' class="form-control validate[len[0,200]]" />
				</div>
			</li>
			<li id="dimOurl" class="form-group form-group-sm">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.url'/></span>
				</div>
				<div class="input-class">
					<input type="text" id="ourl" value="" placeholder='<@spring.message code='label.func.msg.url'/>' class="form-control validate[required,len[0,300]]" />
				</div>
			</li>
			<li id="dimfuncRightUrl" class="form-group form-group-sm">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.funcRightUrl'/></span>
				</div>
				<div class="input-url">
					<textarea id='funcRightUr' class="form-control  value="" validate[maxSize[900]]" placeholder='<@spring.message code='label.func.msg.checkUrl'/>' rows="4"></textarea>
					
				</div>
			</li>
			<li id="dimTarget" class="form-group form-group-sm">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.funcTarget'/></span>
				</div>
				<div class="input-class">
					<select id="target" class="searchType-class">
						<option value="" class=""><@spring.message code='label.func.directJump'/></option>
						<option value="_blank" class=""><@spring.message code='label.func.addJump'/></option>
					</select>
				</div>
			</li>
			<li id="dimFunctype" class="form-group form-group-sm">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.funcModule'/></span>
				</div>
				<div class="input-class">
					<select id="functype" class="searchType-class select" >
						<option value="1" class=""><@spring.message code='label.func.regularMenu'/></option>
						<option value="2" class=""><@spring.message code='label.func.noEnterpriseMenu'/></option>
						<option value="3" class=""><@spring.message code='label.func.enterpriseMenu'/></option>
						<option value="9" class=""><@spring.message code='label.func.manageMenu'/></option>
					</select>
				</div>
			</li>
			<li id="dimFuncOrder" class="form-group form-group-sm">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.afterWhichFunc'/></span>
				</div>
				<div class="input-class">
					<select id="funcOrder" name="funcOrder" class="select">
					</select>
				</div>
			</li>
			<li class="form-group form-group-sm">
				<div class="name-class">
					<span class="f14"><@spring.message code='label.func.remark'/></span>
				</div>
				<div class="input-class">
					<textarea id='remark' class="form-control validate[maxSize[400]]" placeholder='<@spring.message code='label.func.msg.remark'/>' rows="4"></textarea>
				</div>
			</li>
			<li id="dimFuncRight" class="form-group form-group-sm">
				<div class="name-class"><@spring.message code='label.func.basicFuncRight'/></div>
				<div class="input-class">
					<div class="basic-role blue">
						<@spring.message code='label.func.basicFuncRightBrowse'/>
					</div>
					<div class="basic-role green">
						<@spring.message code='label.func.basicFuncRightGrant'/>
					</div>
				</div>
			</li>
			<li id="expandOperLi" class="form-group form-group-sm">
				<div class="name-class"><@spring.message code='label.func.expandFuncRight'/></div>
				<div class="input-class">
					<table id="expandOperGroup" cellspacing="0" cellpadding="0" class="other-right">
						<tr bgcolor="#59A2C5" class="title">
							<td width="10%"></td>
							<td width="40%" align="center">
								<@spring.message code='label.func.expandFuncRightCode'/>
							</td>
							<td width="40%" align="center">
								<@spring.message code='label.func.expandFuncRightName'/>
							</td>
							<td width="10%"><i id="other-right-add" class="fa fa-plus-circle other-right-plus cursor-pointer"></i>
							</td>
						</tr>
					</table>
					</div>
				</div>
			</li>

		</ul>
	</div>

<#include "view/manage/frame/bace/bottom.ftl">
<script>
_require({
		paths: {
			'func-manage/info': '${webpath}/resources/manage/sysmanage/func/js/func-manage',
			'message': '${webpath}/resources/manage/sysmanage/func/js/message'
		}
	},
	'func-manage/info', function(manage) {
		manage.init();
	}
);
</script>