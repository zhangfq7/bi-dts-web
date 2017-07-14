<script>
	var operaId = "${Session.UserSessBean.userID}";
</script>
<div class="attrName">
<span class="bandTip">拖拽指标至此进行分档</span>
</div>
<div class="levelPanel validationEngineContainer">
	<table class="levelTable">
		<tr>
			<td class="listPanel">
				<div class="listTitle">
					<div class="button addlevel no-select"><i class="fa  fa-plus"></i> 新建分档</div>
				</div>
				<div class="level-all">
					<div id="levelList">
					     <div class="level-clone"></div>
					</div>
				</div>
			</td>
			<td class="infoPanel">
				<div class="form-label"><span for="">&nbsp;&nbsp; 分档名称：</span> <input type="text" class="bi-input validate[required,len[1,30]]" id="levelName" /><input type='hidden' id="levelId"></div>
				<div class="form-label"><div style="display:inline-block;vertical-align: top;">&nbsp;&nbsp; 分档描述：</div> <textarea id="levelDesc" class="bi-input validate[len[1,200]]" name="" rows="5" cols="5"></textarea></div>	
				<div class="selectTitle">
					<span><label style="font-weight: bolder;">提示：</label>为每一条规则设置标签名称，当起始值等于多个值，可用英文逗号隔开。</span>
					<div id="addRule" class="addRule button no-select"><i class="fa fa-plus"></i> 添加一条规则</div>
				</div>
				<div class="levelRulePanel">
					<ul>

					</ul>
				</div>
			</td>
		</tr>
	</table>
</div>