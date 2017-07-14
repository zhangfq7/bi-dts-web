<div class="countBox">
   <div class="countTop">
    	<h2>计算指标</h2>
    </div>
   <div class="countContent">
        <div class="calc-control validationEngineContainer">
			<input type="text"  class="bi-input validate[required,len[1,100]]" placeholder="请输入计算指标名称" id="calcName" />
		    <input type="text"  class="bi-input validate[required]" readonly placeholder="请点击选择指标分组" id="calcGroup" />
		</div>
        <div class="countinput">
           <div class="countdd">
              <a exp="(">(</a>
              <a exp=")">)</a>
              <a exp="+">+</a>
              <a exp="-">-</a>
              <a exp="*">×</a>
              <a exp="/">÷</a>
                <div class="calc-control validationEngineContainer" style="float:left">
                    常量
                    <div class='inputlabel' style="display:none"></div>
		            <input type="text" class="bi-input validate[custom[number]]" style="width: 90px" id="numInput"/>
		        </div>
		        <div class="calc-control" style="float:left">
		                                  小数位数
		              <!--<input type="text" class="bi-input" id="dotInput"/>-->
		         <select id="dotInput">
					<option value="0">0</option>
					<option value="1">0.1</option>
					<option value="2">0.01</option>
					<option value="3">0.001</option>
				</select>
		        </div> 
            </div>
           
         </div>
         <div class="countarea">
           <div id="exparea" class="countdd">
             
           </div>
        	  <span class="countareatextbg">拖拽指标至此进行计算</span>
         </div>
       </div>
   </div>
    

</div>