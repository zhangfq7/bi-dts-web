<div class="savePanel">
	<div>
		<div class="form-label">可视化名称：</div>
		<div class="form-control">
			<input type="text" class="bi-input validate[required,len[1,100]]" id="reportName" />
		</div>
	</div>
	<div >
		<div class="form-label" style="vertical-align:top">可视化描述：</div>
		<div class="form-control">
			<textarea  id="reportDesc" class="bi-input validate[len[1,200]]" name="" rows="5" cols="5"></textarea>
		</div>
	</div>
	<div >
		<div class="form-label" style="vertical-align:top">仪表板可评论：</div>
		<div class="form-control">
			<div id="allowComment" class="icon-checkbox  checked "></div>
		</div>
		<div class="form-label" style="vertical-align:top">有效期：</div>
		<div class="form-control">
			<input id="expireDatesave" class="bi-input" readonly="readonly" style="width:204px"/>
		</div>
	</div>
	<div>
		<div class="form-label">贴上标签，方便查看。</div>
		<div class="selectedPanel">
		</div>
		<div class="selectTitle">
			<span><label style="font-weight: bolder;">提示：</label>点击下方标签快捷设置标签，双击标签即可修改，敲回车键确认新增或修改。</span>
			<div class="addLabel no-select"><i class="fa fa-plus"></i> 创建一个标签</div>
		</div>
		<div class="unSelectedPanel">
				<#assign  num = 0/>
				<#list list as list>
		 	  		<div class="label
		 	  			  <#assign  num=num+1/>
		 	  			  <#if num==4><#assign  num=0/></#if>
		 	  			  <#if num==0> green</#if>
		 	  			  <#if num==1> red</#if>
		 	  			  <#if num==2> yellow</#if>
		 	  			  <#if num==3> blue</#if>
		 	  			" data-id=${list.labelId}>
						<div class='text no-select'><span class="name">${list.labelName}</span>
						<input class="bi-input validate[required]" style="display: none;">
						</div>
						 <#if list.labelType == 2>
							<div class='close'><i class="fa fa-close"></i></div>						 
						 </#if>
					</div>
				</#list>
		</div>
	</div>
	<div id="navShow">
		<div class="form-label" style="vertical-align:top">一级导航：</div>
		<div class="form-control">
			<select id="naviLevel1" style="width:150px">
			</select>
		</div>
		<div class="form-label" style="vertical-align:top">二级导航：</div>
		<div class="form-control" >
			<select id="naviLevel2" style="width:150px">
			</select>
		</div>
	</div>
</div>
<script>
    var isNavyShow = '${isNavyShow}';
	(isNavyShow!="0")?$("#navShow").show():$("#navShow").hide();

</script>