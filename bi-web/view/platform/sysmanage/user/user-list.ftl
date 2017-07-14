<#include "view/platform/frame/bace/top.ftl">

<link rel="stylesheet" href="${resPath}/bace/js/webuploader/css/webuploader.css${css_version}" />
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/user/css/user-list.css" />
<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/user/css/user-edit.css${css_version}" />
<!--start-->
<div class="panel">
	<span class="f16"><@spring.message code="company.detp.lebel.topTlitle"/>&nbsp;&nbsp;/&nbsp;&nbsp;<@spring.message code="user.userlist.label.title"/></span>
</div>

<div class="panel mypanel">
	<ul id="searchPanel" class="tab-pane">
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14"><@spring.message code="user.label.userId"/></span>
			</div>
			<div class="search-class">
				<input type="text" class="form-control" id="userId" />
			</div>
			<div class="label-class">
				<span class="f14"><@spring.message code="user.label.userName"/></span>
			</div>
			<div class="search-class">
				<input type="text" class="form-control" id="userName" />
			</div>
			<div class="label-class">
				<span class="f14"><@spring.message code="user.userlist.label.mobile"/></span>
			</div>
			<div class="search-class">
				<input type="text" class="form-control" id="phone" />
			</div>
			<div class="label-class">
				<span class="f14"><@spring.message code="user.userlist.label.job"/></span>
			</div>
			<div class="search-class">
				<select  id="userJob"  class="chosen-select chosen-width">
					<option value=""><@spring.message code="home.setting.button.all"/></option>
					<#list jobInfoList as JobInfoBean>
					<option value="${JobInfoBean.jobId}">${JobInfoBean.jobName}</option>
					</#list>
				</select>
			</div>
		</li>
		<li class="form-group form-group-sm">
			<div class="label-class">
				<span class="f14"><@spring.message code="user.userlist.button.sex"/></span>
			</div>
			<div class="search-class">
				<select id="userSex" style="width:100%;font-size:14px;">
					<option value=""><@spring.message code="home.setting.button.all"/></option>
					<option value="1"><@spring.message code="user.useredit.label.male"/></option>
					<option value="0"><@spring.message code="user.useredit.label.female"/></option>
					<option value="9"><@spring.message code="user.useredit.label.unknown"/></option>
				</select>
			</div>
			<div class="label-class">
				<span class="f14"><@spring.message code="user.userlist.button.email"/></span>
			</div>
			<div class="search-class">
				<input type="text" class="form-control" id="email" />
			</div>
			<div class="label-class">
				<span class="f14"><@spring.message code="user.userlist.label.deptName"/></span>
			</div>
			<div class="search-class">
				<input id="deptlist" type="text" class="form-control" placeholder="<@spring.message code="home.setting.button.all"/>"/>
			</div>
			<div class="label-class"></div>
			<div class="search-class">
				<button id="searchButton" type="button" class="btn btn-info btn-sm button-class"><@spring.message code="group.button.search"/></button>
			</div>
		</li>
	</ul>
	<HR/>
	<ul id="operPanel" class="oper-pane">
		<li class="form-group form-group-sm">
			<div>
				<button id="addUserButton" type="button" class="btn btn-info btn-sm button-class"><@spring.message code="user.userlist.button.add"/></button>
			</div>
		</li>
	</ul>
	<ul id="listPanel" class="list-pane">
		<li id="userList">
			<table id="userListGrid" style="width:100%"></table>
			<div id="userListGridPager"></div>
    	</li>
	</ul>
</div>


<#include "view/platform/frame/bace/bottom.ftl">
<script>
	_require({
			paths: {
				'user/list': '${resPath}/resources/platform/sysmanage/user/js/user-list',
				'upload':'${resPath}/bace/js/webuploader/js/webuploader',
				'userEidt': '${resPath}/resources/platform/sysmanage/user/js/user-edit',
				'user/message': '${resPath}/resources/platform/sysmanage/user/js/message'
			}
		},
		'user/list', function(list) {
			list.init();
		}
	);
</script>
