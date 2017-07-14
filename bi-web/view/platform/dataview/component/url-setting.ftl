
<div class="urlSetting validationEngineContainer">
    <!--左侧"URL导航名称"-->
    <div class="url_name">
        <h2>URL导航名称</h2>
        <div class="url-btn-group">
            <div id="url-btn-left" class="active"><a href="">左对齐</a></div>
            <div id="url-btn-middle"><a href="">平铺</a></div>
            <div id="url-btn-right"><a href="">右对齐</a></div>
        </div>
        <div class="url-name-define">
            <div class="active">
                <input id="urlnamedefine_1" class="validate[required,len[1,12]] url_input url_name_input " type="text" value="" maxlength="4">
            </div>
        </div>
        <a class="urladdclicktab" id="addUrlMenus">+</a>
    </div>

    <!--右侧"设置URL栏"-->
    <div class="url_path">
        <h2>设置URL导航</h2>
        <div class="url_path_title">
            <div class="url_path_name">URL名称</div>
            <div class="url_path_detail">URL链接</div>
            <div class="url_path_picture">图片</div>
            <div class="url_path_token">token</div>
            <div class="url_path_option">操作</div>
        </div>
        <div class="url_path_content" id="urlcontent">
            <div class="urlnamedefine_1 active">
                <div class="url_menus">
                    <div class="url_path_name">
                        <input class="validate[required,len[1,12]] url_input url_path_name_input" type="text" placeholder="请输入名称" maxlength="4">
                    </div>
                    <div class="url_path_detail">
                        <input class="validate[required] url_input url_path_detail_input" type="text" placeholder="请输入URL链接">
                    </div>
                    <div class="url_path_picture">
                        <img class="pictureContainer" src="" alt="">
                        <div class="url_path_addPicture" id="pickpicture1"></div>
                    </div>
                    <div class="url_path_token">
                        <input type="checkbox" value="">
                    </div>
                    <div class="url_path_option">
                        <a href="">删除</a>
                    </div>
                </div>
                <div class="url_menus">
                    <div class="url_path_name">
                        <input class="url_input url_path_name_input" type="text" placeholder="请输入名称">
                    </div>
                    <div class="url_path_detail">
                        <input class="url_input url_path_detail_input" type="text" placeholder="请输入URL链接">
                    </div>
                    <div class="url_path_picture">
                        <img class="pictureContainer" src="" alt="">
                        <div class="url_path_addPicture"></div>
                    </div>
                    <div class="url_path_token">
                        <input type="checkbox" value="">
                    </div>
                    <div class="url_path_option">
                        <a href="">删除</a>
                    </div>
                </div>
                <div class="url_menus">
                    <div class="url_path_name">
                        <input class="url_input url_path_name_input" type="text" placeholder="请输入名称" maxlength="6">
                    </div>
                    <div class="url_path_detail">
                        <input class="url_input url_path_detail_input" type="text" placeholder="请输入URL链接">
                    </div>
                    <div class="url_path_picture">
                        <img class="pictureContainer" src="" alt="">
                        <div class="url_path_addPicture"></div>
                    </div>
                    <div class="url_path_token">
                        <input type="checkbox" value="">
                    </div>
                    <div class="url_path_option">
                        <a href="">删除</a>
                    </div>
                </div>
                <div class="url_menus">
                    <div class="url_path_name">
                        <input class="url_input url_path_name_input" type="text" placeholder="请输入名称" maxlength="6">
                    </div>
                    <div class="url_path_detail">
                        <input class="url_input url_path_detail_input" type="text" placeholder="请输入URL链接">
                    </div>
                    <div class="url_path_picture">
                        <img class="pictureContainer" src="" alt="">
                        <div class="url_path_addPicture"></div>
                    </div>
                    <div class="url_path_token">
                        <input type="checkbox" value="">
                    </div>
                    <div class="url_path_option">
                        <a href="">删除</a>
                    </div>
                </div>
            </div>
            <#--<div id="urlnamedefine_005">
                <div class="url_path_name">
                    <input class="url_input url_path_name_input" type="text" placeholder="请输入名称">
                </div>
                <div class="url_path_detail">
                    <input class="url_input url_path_detail_input" type="text" placeholder="请输入URL链接">
                </div>
                <div class="url_path_picture">
                    <div class="url_path_addPicture"></div>
                </div>
                <div class="url_path_token">
                    <input type="checkbox" value="">
                </div>
                <div class="url_path_option">
                    <a href="">删除</a>
                </div>
            </div>-->
        </div>
        <a class="urladdclicktab" id="addUrlContent">+</a>
        <p class="pictureSize">注：图片仅支持gif,jpg,jpeg,bmp,png格式</p>
    </div>
</div>
<script>
    var urlNavNum="${urlNavNum}";
    var urlInfoNum="${urlInfoNum}";
</script>
