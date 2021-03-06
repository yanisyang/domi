let table = layui.table;
let permissionValue = pageCommon.getPermissionValue();

function PlatformManagement() {
}

PlatformManagement.prototype = {
    constructor: PlatformManagement,
    init: function () {
        this._table();
        this._toolEvent();
        this._cellEditing();
        this._productSwitching();
        this._addPlatform();
        this._classificationAndAddition();
        this._classifiedEditor();
        this._classificationDeletion();
        this._hover();
    },
    /**
     *   表格初始化
     * @private
     */
    _table: function () {
        let _this = this;
        table.render({
            elem: '#channel-data-content-table'
            , even: true //开启隔行背景
            , method: 'GET'
            , limits: [10, 20, 30, 50, 100, 200]
            , limit: 10 //注意：请务必确保 limit 参数（默认：10）是与你服务端限定的数据条数一致 //支持所有基础参数
            , url: globalAjaxUrl + '/admin/loanPlatform/getLoanPlatform'
            , where: {
                beginDate: '',
                endDate: '',
                name: ''
            }
            , cols: [[
                {field: 'name', width: '20%', title: '产品名称', align: 'center'}
                , {field: 'id', title: 'ID', align: 'center', hide: true}
                , {field: 'logo', title: 'logo', templet: '#logo', align: 'center'}
                , {field: 'money', title: '导流单价', align: 'center'}
                , {field: 'typeName', title: '推荐分类', align: 'center'}
                , {field: 'dateTime', title: '更新时间', align: 'center'}
                , {fixed: 'right', width: '15%', title: '操作', toolbar: '#barDemo', align: 'center'}
            ]]
            , page: true
            , done: function (res, curr, count) {
                $('.layui-table-main').perfectScrollbar(); //数据渲染完成后的回调

            }
            ,parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
                _this._getPlatformManagementSuccess(res);
                return {
                    "code": res.data.code, //解析接口状态
                    "msg": res.info, //解析提示文本
                    "count": res.data.count, //解析数据长度
                    "data": res.data.data //解析数据列表
                };
            }
        });
    },
    /**
     *  添加产品分类
     * @param res
     * @private
     */
    _getPlatformManagementSuccess: function (res) {
        let liLen = $('.platform-label>ul').find('.add-li').length;
        if (res.errcode==3) {
            if (liLen != res.data.type.length) {
                for (let j = 0; j < res.data.type.length; j++) {
                    let label = `<li data-id="${res.data.type[j].id}" class="add-li">
                            <div class="platform-label-tit">
                                <span class="platform-label-tit-span">${res.data.type[j].name}</span>
                                <input type="text" class="platform-label-tit-ipt">
                            </div>
                            <span class="platform-label-down"><i class="fa fa-chevron-down"></i></span>
                            <div class="platform-label-option">
                                <p class="platform-title-edit">编辑分类</p>
                                <p class="platform-title-remove">删除分类</p>
                            </div>
                        </li>`;
                    $('.add-platform-li').before(label);
                }
            }
        }
    },
    /**
     * 监听行工具事件  编辑 删除
     * @private
     */
    _toolEvent: function () {
        let _this = this;
        table.on('tool(channel-management-table)', function (obj) {
            let data = obj.data;
            if (obj.event === 'del') {
                if (!permissionValue.remove) {
                    pageCommon.layerMsg('你没有权限删除', 2);
                    return false;
                }
                layer.confirm('确定删除嘛？', function (index) {
                    let url = globalAjaxUrl + '/admin/loanPlatform/deleteLoanPlatform?loanPlatformId=' + data.id + '&typeId=' + data.id + '&labelId=' + data.labelId;
                    pageCommon.getAjax(url, {}, function (res) {
                        pageCommon.layerMsg(res.msg, 1);
                        layer.close(index);
                        _this._productSelection('.platform-active');
                    });
                });
            } else if (obj.event === 'edit') {
                if (!permissionValue.edit) {
                    pageCommon.layerMsg('你没有权限编辑', 2);
                    return false;
                }
                $('.content-data').text(JSON.stringify(data));
                let index = pageCommon.layerParentOpenIframe({
                    url: globalUrl + '/view/popup/add-platform.html?field=edit',
                    title: '编辑平台',
                    confirm: function () {
                        let body = parent.layer.getChildFrame('body', index),
                            id = body.find('.add-platform').attr('data-id'),  // id
                            tit = body.find('.platform-title').val(),  // 平台名称
                            maximumBorrowable = body.find('.maximum-borrowable').val(),  // 最高可借
                            dailyInterestRate = body.find('.daily-interest-rate').val(),  // 日利率
                            photo = body.find('.platform-photo').attr('data-src'),   // 平台logo
                            synopsis = body.find('.platform-synopsis').val(), // 平台简介
                            classification = body.find('.platform-classification').val(),  // 平台分类
                /*            label = body.find('.platform-label').val(),  // 平台标签*/
                            platformUrl = body.find('.platform-url').val(), // 平台链接
                            cooperationMode = body.find('.cooperation-mode').val(), // 合作模式
                            platformPrice = body.find('.platform-price').val(), // 价格
                            pickUpPeople = body.find('.platform-pick-up-people').val(), // 对接人
                            contactInformation = body.find('.contact-information').val(), // 联系方式
                            borrowingCycle = body.find('.spanActive'), // 借款周期
                            accountName = body.find('.background-account').val(), // 后台账号
                            password = body.find('.background-password').val(), // 后台密码
                            backstageUrl = body.find('.background-link').val(); // 后台链接

                        let elArr = ['platform-title', 'maximum-borrowable', 'daily-interest-rate', 'platform-synopsis', 'platform-classification',  'cooperation-mode', 'platform-price', 'platform-pick-up-people', 'contact-information'];
                        let alertArr = ['平台名称', '最高可借', '日利率', '平台简介', '平台分类',  '合作模式', '价格', '对接人', '联系方式'];

                        for (var i in elArr) {
                            if ($.trim(body.find('.' + elArr[i]).val()) == '') {
                                pageCommon.layerMsg(alertArr[i] + '不能为空', 2);
                                return false;
                            }
                        }
                        if (photo == undefined) {
                            pageCommon.layerMsg('logo不能为空', 2);
                            return false;
                        }
                        if (platformUrl == '') {
                            pageCommon.layerMsg('网址不正确', 2);
                            return false;
                        }

                        if (!borrowingCycle.length) {
                            pageCommon.layerMsg('请选择借款周期', 2);
                            return false;
                        }
                        let borrowingCycleArr = [];
                        for (let i = 0; i < borrowingCycle.length; i++) {
                            borrowingCycleArr.push($(borrowingCycle[i]).attr('data-num'))
                        }


                        let obj = {
                            id: parseInt(id),
                            name: tit,
                            maxMoney: parseInt(maximumBorrowable),
                            periodArr: borrowingCycleArr,
                            dayRatio: dailyInterestRate,
                            logo: photo,
                            platformDesc: synopsis,
                            typeId: parseInt(classification),
                            url: platformUrl,
                            model: cooperationMode,
                            money: parseInt(platformPrice),
                            dockPeople: pickUpPeople,
                            phone: contactInformation,
                            accountName: accountName,
                            password: password,
                            backstageUrl:backstageUrl
                        };

                        let url = globalAjaxUrl + '/admin/loanPlatform/updateLoanPlatform';

                        pageCommon.postAjax(url, JSON.stringify(obj), function (res) {
                            if (!res.errcode) {
                                pageCommon.layerMsg(res.info, 2);
                                return false;
                            } else {
                                pageCommon.layerMsg(res.info, 1);
                                parent.layer.close(index);
                                _this._productSelection('.platform-active');
                            }
                        });
                    },
                    cancel: function (index, layero) {
                        parent.layer.close(index);
                    },
                    success:function () {
                    }
                });
            } else if (obj.event == 'view') {
                $('.content-data').text(JSON.stringify(data));
                let index = pageCommon.layerParentOpenIframe({
                    url: globalUrl + '/view/popup/add-platform.html?field=view',
                    title: '预览平台',
                    btn: ['关闭'],
                    confirm: function (index, layero) {
                        parent.layer.close(index);
                    },
                    success:function (layero, index) {
                    }
                });
            }
        });

    },
    /**
     *  监听单元格编辑
     * @private
     */
    _cellEditing: function () {
        table.on('edit(channel-management-table)', function (obj) {
            let value = obj.value //得到修改后的值
                , data = obj.data //得到所在行所有键值
                , id = data.id
                , typeId = data.typeId;

            let arr = [];
            let obj1 = {
                id: id,
                typeId: typeId,
                sort: parseInt(value)
            };
            arr.push(obj1);
            let url = globalAjaxUrl + '/admin/loanPlatform/sort';
            let post = {newData: JSON.stringify(arr)};
            pageCommon.postAjax(url, post, function (res) {
                if (res.state) {
                    pageCommon.layerMsg(res.msg, 1);
                } else {
                    pageCommon.layerMsg(res.msg, 2);
                }
            });
        });


    },
    /**
     *  产品分类的切换
     * @private
     */
    _productSwitching: function () {
        let _this = this;
        $('.platform-label>ul').on('click', 'li', function () {
            _this._productSelection(this)
        });
    },
    /**
     * 产品分类的选中
     * @param e  当前元素
     * @private
     */
    _productSelection: function (e) {
        let _this = this;
        let len = $(e).parent().find('li').length;
        let index = $(e).index();
        let id = $(e).attr('data-id');
        if (len - index != 1 && index != 0) {
            $(e).addClass('platform-active').siblings().removeClass('platform-active');
            table.reload('channel-data-content-table', {
                url: globalAjaxUrl + '/admin/loanPlatform/getLoanPlatformByType'
                , where: {
                    typeId: id
                }
                , cols: [[
                    {field: 'name', width: '20%', title: '产品名称', align: 'center'}
                    , {field: 'id', title: 'ID', align: 'center', hide: true}
                    , {field: 'logo', title: 'logo', templet: '#logo', align: 'center'}
                    , {field: 'money', title: '导流单价', align: 'center'}
                    , {field: 'sort', edit: 'text', title: '排序', align: 'center'}
                    , {field: 'dateTime', title: '更新时间', align: 'center'}
                    , {fixed: 'right', width: '15%', title: '操作', toolbar: '#barDemo', align: 'center'}
                ]]
            });
        } else {
            $(e).addClass('platform-active').siblings().removeClass('platform-active');
            _this._table();
        }
    },
    /**
     * 创建平台
     * @private
     */
    _addPlatform: function () {
        let _this = this;
        $('.platform-top').on('click', '.platform', function () {
            if (!permissionValue.add) {
                pageCommon.layerMsg('你没有权限创建', 2);
                return false;
            }
            let index = pageCommon.layerParentOpenIframe({
                url: globalUrl + '/view/popup/add-platform.html',
                title: '创建平台',
                confirm: function () {
                    var body = parent.layer.getChildFrame('body', index),
                        tit = body.find('.platform-title').val(),  // 平台名称
                        maximumBorrowable = body.find('.maximum-borrowable').val(),  // 最高可借
                        dailyInterestRate = body.find('.daily-interest-rate').val(),  // 日利率
                        photo = body.find('.platform-photo').attr('data-src'),   // 平台logo
                        synopsis = body.find('.platform-synopsis').val(), // 平台简介
                        classification = body.find('.platform-classification').val(),  // 平台分类
          /*              label = body.find('.platform-label').val(),  // 平台标签*/
                        platformUrl = body.find('.platform-url').val(), // 平台链接
                        cooperationMode = body.find('.cooperation-mode').val(), // 合作模式
                        platformPrice = body.find('.platform-price').val(), // 价格
                        pickUpPeople = body.find('.platform-pick-up-people').val(), // 对接人
                        contactInformation = body.find('.contact-information').val(), // 联系方式
                        borrowingCycle = body.find('.spanActive'), // 借款周期
                        accountName = body.find('.background-account').val(), // 后台账号
                        password = body.find('.background-password').val(), // 后台密码
                        backstageUrl = body.find('.background-link').val(); // 后台链接


                    var elArr = ['platform-title', 'maximum-borrowable', 'daily-interest-rate', 'platform-synopsis', 'platform-classification',  'cooperation-mode', 'platform-price', 'platform-pick-up-people', 'contact-information'];
                    var alertArr = ['平台名称', '最高可借', '日利率', '平台简介', '平台分类',  '合作模式', '价格', '对接人', '联系方式'];

                    for (var i in elArr) {
                        if ($.trim(body.find('.' + elArr[i]).val()) == '') {
                            pageCommon.layerMsg(alertArr[i] + '不能为空', 2);
                            return false;
                        }
                    }
                    if (photo == undefined) {
                        pageCommon.layerMsg('logo不能为空', 2);
                        return false;
                    }
                    if (platformUrl == '') {
                        pageCommon.layerMsg('网址不能为空', 2);
                        return false;
                    }

                    if (!borrowingCycle.length) {
                        pageCommon.layerMsg('请选择借款周期', 2);
                        return false;
                    }
                    let borrowingCycleArr = [];
                    for (let i = 0; i < borrowingCycle.length; i++) {
                        borrowingCycleArr.push($(borrowingCycle[i]).attr('data-num'))
                    }

                    let obj = {
                        name: tit,
                        maxMoney: parseInt(maximumBorrowable),
                        periodArr: borrowingCycleArr,
                        dayRatio: dailyInterestRate,
                        logo: photo,
                        platformDesc: synopsis,
                        typeId: parseInt(classification),
                        url: platformUrl,
                        model: cooperationMode,
                        money: parseInt(platformPrice),
                        dockPeople: pickUpPeople,
                        phone: contactInformation,
                        accountName: accountName,
                        password: password,
                        backstageUrl:backstageUrl
                    };

                    let url = globalAjaxUrl + '/admin/loanPlatform/addLoanPlatform';
                    pageCommon.postAjax(url, JSON.stringify(obj), function (res) {
                        if (!res.errcode) {
                            pageCommon.layerMsg(res.info, 2);
                            return false;
                        } else {
                            pageCommon.layerMsg(res.info, 1);
                            parent.layer.close(index);
                        }
                        pageCommon.layerMsg(res.msg, 1);
                        parent.layer.close(index);
                        _this._table();

                    });
                },
                cancel: function (index, layero) {
                    parent.layer.close(index);
                },
                success:function (layero, index) {
                }
            });
        });

    },
    /**
     * 产品分类的添加
     * @private
     */
    _classificationAndAddition: function () {
        $('.add-platform-title').click(function () {
            if (!permissionValue.add) {
                pageCommon.layerMsg('你没有权限添加', 2);
                return false;
            }
            $('.platform-title-ipt').show();
            $('.platform-title-ipt').focus();
            document.onkeydown = function (e) {
                var ev = document.all ? window.event : e;
                if (ev.keyCode == 13) {
                    var val = $.trim($('.platform-title-ipt').val());
                    if (val) {
                        var html = ` <li>
                            <div class="platform-label-tit">
                                <span class="platform-label-tit-span">${val}</span>
                                <input type="text" class="platform-label-tit-ipt">
                            </div>
                            <span class="platform-label-down"><i class="fa fa-chevron-down"></i></span>
                            <div class="platform-label-option">
                                <p class="platform-title-edit">编辑分类</p>
                                <p class="platform-title-remove">删除分类</p>
                            </div>
                        </li>`;

                        let url = globalAjaxUrl + '/admin/loanPlatform/addLoanPlatformType';

                        let obj = {
                            name: val
                        };

                        pageCommon.postAjax(url, JSON.stringify(obj), function (res) {
                            if (res.errcode){
                                pageCommon.layerMsg(res.info, 1);
                                $('.add-platform-li').before(html);
                                $('.platform-title-ipt').val('').hide();
                            } else {
                                pageCommon.layerMsg(res.info, 2);
                            }

                            window.location.reload();
                        });
                    } else {
                        pageCommon.layerMsg('请输入标题名称')
                    }
                }
            }
        });
    },
    /**
     * 产品分类的编辑
     * @private
     */
    _classifiedEditor: function () {
        $('.platform-label').on('click', '.platform-title-edit', function (e) {
            if (!permissionValue.edit) {
                pageCommon.layerMsg('你没有权限删除', 2);
                return false;
            }
            let span = $(this).parents('li').find('.platform-label-tit-span');
            let input = $(this).parents('li').find('.platform-label-tit-ipt');
            let id = $(this).parents('li').attr('data-id');
            $(this).parents('.platform-label-option').hide();
            let text = span.text();
            span.hide();
            input.show();
            input.val(text).focus();
            document.onkeydown = function (e) {
                var ev = document.all ? window.event : e;
                if (ev.keyCode == 13) {
                    span.text(input.val());
                    span.show();
                    input.hide();
                    let obj = {
                        name: input.val(),
                        id: id
                    };

                    let url = globalAjaxUrl + '/admin/loanPlatform/updateLoanPlatformType';

                    pageCommon.postAjax(url, JSON.stringify(obj), function (res) {
                        if (res.errcode){
                            pageCommon.layerMsg(res.info, 1);
                        } else {
                            pageCommon.layerMsg(res.info, 2);
                        }
                    });
                }
            }
        });
    },
    /**
     * 产品分类的删除
     * @private
     */
    _classificationDeletion: function () {
        $('.platform-label').on('click', '.platform-title-remove', function (e) {
            if (!permissionValue.remove) {
                pageCommon.layerMsg('你没有权限删除', 2);
                return false;
            }
            let $this = $(this);
            let id = $(this).parents('li').attr('data-id');
            let url = globalAjaxUrl + '/admin/loanPlatform/deleteLoanPlatformType?typeId=' + id;
            pageCommon.layerConfirm(function () {
                $this.parents('li').remove();
                pageCommon.getAjax(url, {}, function (res) {
                    if (res.errcode){
                        pageCommon.layerMsg(res.info, 1);
                    } else {
                        pageCommon.layerMsg(res.info, 2);
                    }
                    window.location.reload();
                })
            });

        });
    },
    _hover: function () {
        $('.platform-label>ul').on('mouseenter', 'li', function () {
            $(this).find('.fa-chevron-down').show();
        });

        $('.platform-label>ul').on('mouseleave', 'li', function () {
            $(this).find('.platform-label-option,.fa-chevron-down').hide();
        });

        $('.platform-label').on('mouseenter', '.platform-label-down', function () {
            $(this).next().show();
        });
    }
};

let platformManagement = new PlatformManagement();
platformManagement.init();







