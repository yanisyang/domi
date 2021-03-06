$(function () {

    let contentArr = ['rotation-chart', 'classification-map', 'list-background-map', 'platform-management', 'data-management', 'popular-management', 'article-management', 'channel-management', 'channel-data', 'platform-data-management', 'channel-setup', 'privilege-management', 'user-list'];  // iframe 对应页面元素

    for (let p = 0; p < contentArr.length; p++) {
        let html  = `
    <div id="${contentArr[p]}" class="menu-item fn-hide">
    <div class="content-center">
        <div class="content-center-main ${contentArr[p]}">
            <iframe src=""  frameborder="0" class="${contentArr[p]}-iframe"></iframe>
        </div>
    </div>
</div>`;
       $('body').append(html)  // 插入body
    }
    let loginInfo = localStorage.getItem('loginInfo');
    if (loginInfo == null) {
        pageCommon.returnLogin(); // 等于空 跳回登录页面
    }
    loginInfo = JSON.parse(loginInfo);
    $('.account').text(loginInfo.account);

    // 左边树 初始化
    let ssideuLen = $('.s-side-u>li').length;
    if (!ssideuLen) {
        let infoUrl = globalAjaxUrl + '/admin/employee/getEmployeePermission?employeeId=' + loginInfo.employeeId; // 拿到登录人ID查询用户权限
        pageCommon.getAjax(infoUrl, {}, function (res) {
            res = res.data.trees;
            let domiLen = res.length;
            if (domiLen) {
                for (let i = 0; i < domiLen; i++) {
                    let html = '';
                    html += '<li class="first" data-parentId="' + res[i].id + '" >';
                    html += '<div class="d-firstNav s-firstNav clearfix">';
                    html += '<i class="fa ' + res[i].icon + '"></i>';
                    html += '<span>' + res[i].name + '</span>';
                    html += '<i class="fa fa-caret-right fr "></i>';
                    html += '</div>';
                    html += '<ul class="d-firstDrop s-firstDrop">';
                    for (let j = 0; j < res[i].children.length; j++) {
                        html += '<li class="s-secondItem" data-id="' + res[i].children[j].id + '"  data-child="' + res[i].children[j].tId + '">';
                        html += '<a href="#' + res[i].children[j].tId + '">' + res[i].children[j].name + '</a>';
                        html += '</li>';

                    }
                    html += '</ul>';
                    html += '</li>';
                    $('.s-side-u').append(html);
                }
                // 菜单栏显示
                var hash = window.location.hash,
                    hash_len = hash.length,
                    hash_r = hash.substring(1, hash_len);
                // 如果空 就等于 数据的第一个
                if (hash_r == '') {
                    hash_r = res[0].children[0].tId;
                }
                tab(hash_r);
            } else {
                $('body').append('<span class="no-authority">很抱歉，你没有任何权限，请联系管理员！</span>')
            }

        }, function (res) {
            /*  let domi = [
                  {
                      title: '图片管理',
                      icon: 'fa-photo',
                      child: [
                          {
                              name: '轮播图',
                              id: 'rotation-chart'
                          },
                          {
                              name: '分类',
                              id: 'classification-map'
                          },
                          {
                              name: '列表背景图',
                              id: 'list-background-map'
                          },
                      ]
                  },
                  {
                      title: '贷款平台',
                      icon: 'fa-cloud',
                      child: [
                          {
                              name: '平台管理',
                              id: 'platform-management'
                          },
                          {
                              name: '标签管理',
                              id: 'label-management'
                          },
                          {
                              name: '数据管理',
                              id: 'data-management'
                          },
                          {
                              name: '热门管理',
                              id: 'popular-management'
                          }
                      ]
                  },
                  {
                      title: '新闻资讯',
                      icon: 'fa-newspaper-o',
                      child: [
                          {
                              name: '文章管理',
                              id: 'article-management'
                          }
                      ]
                  },
                  {
                      title: '渠道推广',
                      icon: 'fa-share-alt-square',
                      child: [
                          {
                              name: '渠道管理',
                              id: 'channel-management'
                          },
                          {
                              name: '渠道数据',
                              id: 'channel-data'
                          }
                      ]
                  },
                  {
                      title: '平台管理',
                      icon: 'fa-home',
                      child: [
                          {
                              name: '数据管理',
                              id: 'platform-data-management'
                          },
                          {
                              name: '渠道设置',
                              id: 'channel-setup'
                          }
                      ]
                  }/!*,
                  {
                      title: '系统管理',
                      icon: 'fa-cog',
                      child: [
                          {
                              name: '权限管理',
                              id: 'privilege-management'
                          },
                          {
                              name: '用户列表',
                              id: 'user-list'
                          }
                      ]
                  }*!/
              ];

              let domiLen = domi.length;

              for (let i = 0; i < domiLen; i++) {
                  let html = '';
                  html += '<li class="first">';
                  html += '<div class="d-firstNav s-firstNav clearfix">';
                  html += '<i class="fa ' + domi[i].icon + '"></i>';
                  html += '<span>' + domi[i].title + '</span>';
                  html += '<i class="fa fa-caret-right fr "></i>';
                  html += '</div>';
                  html += '<ul class="d-firstDrop s-firstDrop">';
                  for (let j = 0; j < domi[i].child.length; j++) {
                      html += '<li class="s-secondItem" data-id="' + domi[i].child[j].id + '">';
                      html += '<a href="#' + domi[i].child[j].id + '">' + domi[i].child[j].name + '</a>';
                      html += ' </li>';

                  }
                  html += '</ul>';
                  html += '</li>';
                  $('.s-side-u').append(html);
              }*/
        });
    }

    $('.s-side-u').on('click', '.d-firstNav', function (e) {
        dropSwift($(this), '.d-firstDrop');
        e.stopPropagation();
    });

    $('.s-side-u').on('click', '.d-secondNav', function (e) {
        dropSwift($(this), '.d-secondDrop');
        e.stopPropagation();
    });

    /**
     * @param dom   点击的当前元素
     * @param drop  下一级菜单
     */
    function dropSwift(dom, drop) {
        //点击当前元素，收起或者伸展下一级菜单
        dom.next().slideToggle();

        //设置旋转效果

        //1.将所有的元素都至为初始的状态
        dom.parent().siblings().find('.fa-caret-right').removeClass('iconRotate');

        //2.点击该层，将其他显示的下滑层隐藏
        dom.parent().siblings().find(drop).slideUp();

        let iconChevron = dom.find('.fa-caret-right');
        if (iconChevron.hasClass('iconRotate')) {
            iconChevron.removeClass('iconRotate');
        } else {
            iconChevron.addClass('iconRotate');
        }
    }


    //点击菜单栏切换
    $('.s-side-u').on('click', '.s-secondItem', function () {
        let id = $(this).attr('data-child');
        $('.info-title').text($(this).parents('li').find('.d-firstNav span').text());
        $('.info-title-child').text($(this).find('a').text());
        tab(id);
    });

    // 侧边栏切换
    function tab(id) {
/*        let index = layer.load();*/
        let $item = $('.s-secondItem a');
        for (let i = 0, len = $item.length; i < len; i++) {
            $item.eq(i).parent().removeClass('active');
            let data_id_i = $item.eq(i).parent().attr('data-child');
            if (id == data_id_i) {
                $('.menu-item').addClass('fn-hide');
                $item.eq(i).parent().addClass('active');
                $('#' + data_id_i).removeClass('fn-hide');
            }
        }
        $('.active').parents('.s-firstDrop').show();
        $('.active').parent().show();
        sessionStorage.setItem('modelId', $('.active').parents('li').attr('data-parentId'));

        let contentArr = ['rotation-chart', 'classification-map', 'list-background-map', 'platform-management', 'data-management', 'popular-management', 'article-management', 'channel-management', 'channel-data', 'platform-data-management', 'channel-setup', 'privilege-management', 'user-list'];

        let nameArr = ['轮播', '分类', '列表背景图', '平台管理', '数据管理', '热门管理', '文章管理', '渠道管理', '渠道数据', '数据管理', '渠道设置', '权限管理', '用户列表'];  //  分别对应相应模块

        for (let j = 0; j < contentArr.length; j++) {
            if (id == contentArr[j]) {
                if (!$('.' + contentArr[j]).find('iframe').attr('src')){
                    $('.' + contentArr[j]).find('iframe').attr('src', 'content/' + contentArr[j] + '.html');
                    /*         $('.' + contentArr[j]).find('iframe')[0].onload = function () {
                                 layer.close(index)
                             }*/
                }
            }
        }


        /* if (id == 'rotation-chart') {  // 轮播图
             $('.rotation-chart').find('iframe').attr('src', 'content/rotation-chart.html')
         } else if (id == 'data-management') { // 贷款数据管理
             $('.data-management').find('iframe').attr('src', 'content/data-management.html')
         } else if (id == 'channel-data') { // 渠道数据
             $('.channel-data').find('iframe').attr('src', 'content/channel-data.html')
         } else if (id == 'channel-management') { // 渠道数据
             $('.channel-management').find('iframe').attr('src', 'content/channel-management.html')
         } else if (id == 'privilege-management') { // 权限管理
             $('.privilege-management').find('iframe').attr('src', 'content/privilege-management.html')
         } else if (id == 'platform-data-management') { // 平台数据管理
             $('.platform-data-management').find('iframe').attr('src', 'content/platform-data-management.html')
         } else if (id == 'channel-setup') { // 平台渠道设置
             $('.channel-setup').find('iframe').attr('src', 'content/channel-setup.html')
         } else if (id == 'classification-map') { // 分类
             $('.classification-map').find('iframe').attr('src', 'content/classification-map.html')
         } else if (id == 'list-background-map') { // 列表背景图
             $('.list-background-map').find('iframe').attr('src', 'content/list-background-map.html')
         } else if (id == 'user-list') { // 用户列表
             $('.user-list').find('iframe').attr('src', 'content/user-list.html')
         } else if (id == 'platform-management') { // 贷款平台管理
             $('.platform-management').find('iframe').attr('src', 'content/platform-management.html')
         } else if (id == 'label-management') { // 贷款标签管理
             $('.label-management').find('iframe').attr('src', 'content/label-management.html')
         } else if (id == 'article-management') { // 新闻文章管理
             $('.article-management').find('iframe').attr('src', 'content/article-management.html')
         } else if (id == 'popular-management') { // 贷款平台热门管理
             $('.popular-management').find('iframe').attr('src', 'content/popular-management.html')
         }*/
    }


    //   菜单下拉
    $('.personal').click(function () {
        $('.personal-settings').toggle();
    });

    // 修改密码
    $('.change-password').click(function () {
        let content = `
            <div class="change-password">
                <div class="password">
                    <span class="fw dsl">原密码:</span>
                    <input type="password" placeholder="请输入原密码" class="password-ipt original-password">
                </div> 
                <div class="password">
                    <span class="fw dsl">新密码:</span>
                    <input type="password" placeholder="请输入新密码"  class="password-ipt new-password">
                </div> 
                <div class="password">
                    <span class="fw dsl">确认密码:</span>
                    <input type="password" placeholder="确认输入新密码" class="password-ipt confirm-new-password">
                </div>
                <div class="password-opi">
                    <span class="confirm dsl">确认</span>
                    <span class="cancel dsl">取消</span>
                </div>
            </div>`;
        let index = layer.open({
            type: 1,
            area: ['300px', '230px'], //宽高
            content: content
        });

        // 确认
        $('.confirm').click(function () {
            let originalPassword = $(".original-password").val();
            let newPassword = $(".new-password").val();
            let confirmNewPassword = $(".confirm-new-password").val();
            if ($.trim(originalPassword) == '') {
                pageCommon.layerMsg('原密码不能为空', 2);
                return false;
            }
            if ($.trim(newPassword) == '') {
                pageCommon.layerMsg('请输入新密码', 2);
                return false;
            }
            if ($.trim(confirmNewPassword) == '') {
                pageCommon.layerMsg('确认输入新密码', 2);
                return false;
            }

            if ($.trim(newPassword) != $.trim(confirmNewPassword)) {
                pageCommon.layerMsg('两次密码不一致，请重新输入', 2);
                return false;
            }

            let url = globalAjaxUrl + '/admin/employee/updatePassword?id=' + loginInfo.employeeId + '&newPassword=' + newPassword + '&oldPassword=' + originalPassword;
            pageCommon.getAjax(url, {}, function (res) {
                if (res.state) {
                    pageCommon.layerMsg(res.msg);
                    setTimeout(() => {
                        window.location.href = globalUrl + '/admin/index.html';
                    }, 1500);
                } else {
                    pageCommon.layerMsg('密码修改失败，请检原密码是否正确!', 2)
                }
            })


        });

        // 取消
        $('.cancel').click(function () {
            layer.close(index)
        });
    });

    // 退出
    $('.sign-out').click(function () {
        setTimeout(() => {
            window.location.href = globalUrl + '/admin/index.html';
            localStorage.clear();
            sessionStorage.clear();
        }, 100);
    });
});
