<input type="hidden" id="dataId" value="${dataId}"/>
<div class="formatBox validationEngineContainer">
    <div class="formatTop">
        <h2>新增时间格式化</h2>
    </div>
    <div class="formatContent">
        <select class="validate[required] " id="dateAttr">
            <option value="">请选择时间指标</option>
        <#list dataAttrBeanList as dataAttrBean>
            <option filterType="${dataAttrBean.filterType}" dataId="${dataAttrBean.dataId}" fieldName = "${dataAttrBean.fieldName}" value="${dataAttrBean.attrId}">${dataAttrBean.attrName}</option>
        </#list>
        </select>
    </div>
    <div class="formatContent">
        <input type="text" class="validate[required,len[1,100]]" placeholder="请输入时间格式化名称" id="formatName"/>
    </div>
    <div class="formatContent">
        <input type="text" placeholder="请选择指标分组" id="attrGroup" readonly/>
    </div>
    <div class="formatContent">请选择你所需要的时间格式</div>
    <div class="formatContent formatRule" id="formatRuleGroup">
        <div class="formatRuleButton" id="day">YYYY-MM-DD</div>
        <div class="formatRuleButton" id="month">YYYY-MM</div>
        <div class="formatRuleButton" id="year">YYYY</div>
    </div>
    <div class="formatContent">
        <p style="color:#77b1d6">(注：只可以向上format,不可以向下format)
    </div>
</div>
