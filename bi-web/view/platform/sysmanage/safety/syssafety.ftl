<#include "view/platform/frame/bace/top.ftl">
	<link rel="stylesheet" href="${resPath}/resources/platform/sysmanage/safety/css/syssafety.css" />
	<!--start-->
	<div class="panel" style="padding: 10px;">
		<@spring.message code="safety.label.systemsafety" />
	</div>
	<div class="panel company-syssafety-container">
		<div class="company-syssafety-photo">
			<img class='anquan' src="${resPath}/resources/platform/sysmanage/safety/img/syssafety.png" style="margin-left:10px; margin-top:40px;">
		</div>
		<div class="company-syssafety-content">
			<ul>
				<li class="sysponit-img">
					<img class='' src="${resPath}/resources/platform/sysmanage/safety/img/sysponit.png">
				</li>
				<li class="text-content f14">
					<div class="company-syssafety-four-title">
						<span><@spring.message code="safety.label.usewatermark"/></span>
					</div>
					<div class="company-syssafety-four">
						<@spring.message code="safety.label.watermark" />
					</div>
				</li>
				<li class="company-syssafety-img">
					<div>
						<input type="checkbox" data-toggle="switch" data-on-color="danger" data-on-text="<@spring.message code="safety.label.on" />" data-off-text="<@spring.message code="safety.label.off" />" id="openwatermark" />
					</div>
				</li>
				<div style="clear:both"></div>
			</ul>

			<ul>
				<li class="sysponit-img">
					<img class='' src="${resPath}/resources/platform/sysmanage/safety/img/sysponit.png">
				</li>
				<li class="text-content f14">
					<div class="company-syssafety-four-title">
						<span><@spring.message code="safety.label.usesmscaptcha"/></span>
					</div>
					<div class="company-syssafety-four">
						<@spring.message code="safety.label.smscaptcha" />
					</div>
				</li>
				<li class="company-syssafety-img">
					<input type="checkbox" data-toggle="switch" data-on-color="danger" data-on-text="<@spring.message code="safety.label.on" />" data-off-text="<@spring.message code="safety.label.off" />" id="smscaptcha" />
				</li>
				<div style="clear:both"></div>
			</ul>

			<ul>
				<li class="sysponit-img">
					<img class='' src="${resPath}/resources/platform/sysmanage/safety/img/sysponit.png">
				</li>
				<li class="text-content f14">
					<div class="company-syssafety-four-title">

						<span><@spring.message code="safety.label.usedatacopy"/></span>
					</div>
					<div class="company-syssafety-four">
						<@spring.message code="safety.label.datacopy" />
					</div>
				</li>
				<li class="company-syssafety-img">
					<input type="checkbox" data-toggle="switch" data-on-color="danger" data-on-text="<@spring.message code="safety.label.on" />" data-off-text="<@spring.message code="safety.label.off" />" id="datanocopy" />
				</li>
				<div style="clear:both"></div>
			</ul>

            <ul>
				<li class="sysponit-img">
					<img class='' src="${resPath}/resources/platform/sysmanage/safety/img/sysponit.png">
				</li>
				<li class="text-content f14">
					<div class="company-syssafety-four-title">
            			<span><@spring.message code="safety.label.usepsdlevel"/></span>
					</div>
					<div class="company-syssafety-four">
						<@spring.message code="safety.label.psdlevel" />
					</div>
				</li>
				<li class="company-syssafety-img btnStylefour">
					<input type="hidden" id="psdlevel" value=""/>
					<button class="syssafety-first btn btn-default btn-sm normalFourButton"  title="<@spring.message code="safety.label.psdlevel.low" />" id="sysLow" value="1"><@spring.message code="safety.label.low" /></button>
	    	   		<button class="syssafety-middle btn btn-default btn-sm normalFourButton" title="<@spring.message code="safety.label.psdlevel.middle" />" id="sysMiddle" value="2"><@spring.message code="safety.label.middle" /></button>
	    	   		<button class="syssafety-middle btn btn-default btn-sm normalFourButton" title="<@spring.message code="safety.label.psdlevel.high" />" id="sysHigh" value="3"><@spring.message code="safety.label.high" /></button>
	    	   		<button class="syssafety-last btn btn-default btn-sm normalFourButton"   title="<@spring.message code="safety.label.psdlevel.veryhigh" />" id="sysVeryhigh" value="4"><@spring.message code="safety.label.veryhigh" /></button>
				</li>
				
				<div style="clear:both"></div>
			</ul>
			<div style="clear:both"></div>
		</div>
	</div>
	</div>
	<#include "view/platform/frame/bace/bottom.ftl">
		<script>
			_require({
					paths: {
						'safety/syssafety': '${resPath}/resources/platform/sysmanage/safety/js/syssafety',
						'safety/message': '${resPath}/resources/platform/sysmanage/safety/js/message'
					}
				},
				'safety/syssafety'
			);
		</script>