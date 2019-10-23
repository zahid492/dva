/*
 * @Author: wsc
 * @Date:   2017-11-24 10:37:10
 * @Last Modified by:   wsc
 * @Last Modified time: 2017-11-28 14:40:47
 */

var Categorys = {};
var clist;
var curCategory = '';
// 选择关注的项目
var selectedSubjects = [];
var imgpath = '/BrandsLogo/';
var tipConfirm = '取消对“{key}”的关注？';
var mylazy;
var myScroll = [];
var mySwiper;
var lazyArr = [];
$(function () {
    //取出openid
    var openid = store.session('openid');
    if (openid) {
        var sUser = store.session('curuser');

        if (sUser && _.has(sUser, "Subjects")) {
            var t = url('?t');
            if (_.isNull(t) || _.isUndefined(t)) {
                store.session('tempSubjects', sUser.Subjects);
            } else {
                store.session('tempSubjects', decodeURIComponent(t));
            }

            getSubjects().then(function (res) {
                DivideList(res);
                setSelectedSubjectCancelEvent();

                // 返回资讯列表
                $('.return').click(function (e) {
                    e.preventDefault();
                    var nUser = store.session('curuser');

                    if (_.has(nUser, "Subjects") && nUser.Subjects.length > 0) {
                        nUser.Subjects = store.session('tempSubjects');
                        store.session('curuser', sUser);
                        store.session.remove('tempSubjects');
                        document.location.href = 'index.html';
                    } else {
                        layer.open({
                            time: 2,
                            className: 'message message--alert laytip',
                            content: $("#layTipOneTpl").html()
                        })
                    }
                });

                // 选定关注词，提交
                $('.js-submit').click(function () {
                    if (sUser.Subjects.length > 0) {
                        $.ajax({
                            type: 'post', //可选get
                            url: 'api/user/createSubjects.ashx',
                            data: {openid: openid, subjects: sUser.Subjects.join(',')},
                            dataType: 'json',
                            success: function (result) {

                                if (result.Code == 200) {
                                    store.session('curuser', sUser);
                                    store.session.remove('tempSubjects');
                                    document.location.href = 'zmain.html?v=' + Math.random(0, Date.now());
                                } else {
                                    layer.open({
                                        time: 2,
                                        className: 'message message--success laytip',
                                        content: $("#layTipErrorTpl").html()
                                    })
                                }
                            },
                            error: function () {
                            }
                        });
                    } else {

                        layer.open({
                            time: 2,
                            className: 'message message--alert laytip',
                            content: $("#layTipOneTpl").html()
                        })
                    }
                });

                // 搜索
                $('.js-search').click(function (e) {
                    e.preventDefault();
                    location.href = "search.html?t=" + encodeURIComponent(store.session('tempSubjects'))
                });

                // 关注词添加
                $(".brand__list").on("click", ".last", function (e) {
                    e.preventDefault();
                    // 到申请添加关注词页面
                    location.href = 'attention.html?v=' + Math.random(0, Date.now());
                });

                // 关注词添加和删除
                $('.brand__list').on('click', 'li:not(:last)', function (e) {
                    e.preventDefault();

                    var lic = $(e.currentTarget);
                    var key = lic.attr('title');
                    var url = lic.find('img').attr('src');
                    var pslide = lic.closest(".swiper-slide");
                    var psub = pslide.attr("id").slice(2);
                    // 删除关注词
                    var removeLastSubjects = _.concat([],sUser.Subjects);


                    if (_.includes(sUser.Subjects, key)) {
                        _.pull(sUser.Subjects, key);
                        sendSubject(function () {
                            //取消激活蒙版
                            pslide.siblings().each(function(i, v){
                                $(".brand__list li", $(v)).each(function(j, w){
                                    if($(w).attr("title")===key){
                                        $(w).removeClass('active')
                                    }
                                });
                            });
                            //取消操作
                            lic.removeClass('active');

                            // 顶部关注词图标删除
                            $('.header-logo h2 img').each(function (i) {
                                if ($(this).attr('title') == key) {
                                    $(this).remove();
                                }
                            });
                        });
                    } else {
                        //最多关注3个，如果改变关注词数量限制，修改这里
                        if (_.size(sUser.Subjects) === 3) {

                            layer.open({
                                time: 2,
                                className: 'message message--alert laytip',
                                content: $("#layTipThreeTpl").html()
                            })


                        } else {
                            if (_.size(sUser.Subjects) < 3) {
                                sUser.Subjects.push(key);
                                sendSubject(function () {
                                    pslide.siblings().each(function(i, v){
                                        $(".brand__list li", $(v)).each(function(j, w){
                                            if($(w).attr("title")===key){
                                                $(w).addClass('active')
                                            }
                                        })

                                    });
                                    addSubjectElement(key, url);
                                    lic.addClass('active');
                                });
                            }

                        }
                    }

                    store.session('curuser', sUser);

                });
            });
        }
    }

    function sendSubject(callback) {
        $.ajax({
            type: 'post', //可选get
            url: 'api/user/createSubjects.ashx',
            data: {openid: openid, subjects: sUser.Subjects.join(',')},
            dataType: 'json',
            success: function (result) {
                if (result.Code == 200) {
                    store.session('curuser', sUser);
                    callback();
                } else {
                    layer.open({
                        time: 2,
                        className: 'message message--success laytip',
                        content: $("#layTipErrorTpl").html()
                    })
                }
            },
            error: function () {
            }
        });
    }

//已选中的关注词取消事件
    function setSelectedSubjectCancelEvent() {
        $('.header-logo h2').on('click', 'img', function (e) {
            $lic = $(e.currentTarget);
            //确认是否取消
            var key = $lic.attr('title');
            var tipContent = tipConfirm.replace('{key}', key);
            var lctip = $("#layTipCancelTpl").html();
            var tpl = $("<div></div>").html(lctip);
            tpl.find("h3").text(tipContent);

            layer.open({
                className: 'messageBox message message--alert laytip',
                content: tpl.html(),
                btn: ['取消', '确定'],
                no: function (index) {
                    _.pull(sUser.Subjects, key);
                    sendSubject(function () {
                        // 实际为确定按钮
                        $('.brand__list li[title=' + key + ']').removeClass('active');
                        $lic.remove();
                        layer.close(index);
                        store.session('curuser', sUser);
                    });
                },
                yes: function (index) {
                    layer.close(index);
                }
            });
        })
    }

    function getSubjects() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get', //可选get
                url: 'api/SubjectAPI.ashx',
                data: {cmd: 'list'},
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data);
                    }
                },
                error: function () {
                    reject()
                    //document.location.href = 'create.html';
                }
            });
        })

    }

//给待选择的关注词分类
    function DivideList(list) {

        clist = list.map(function (v) {
            v.Logo = imgpath + v.Logo;
            return v;
        });

        Categorys = _.groupBy(clist, function (item) {
            return item.Industry
        });

        if (!curCategory) {
            curCategory = "全部";
        }

        _.forEach(sUser.Subjects, function (sb) {
            var sbi = _.findIndex(clist, {"Name": sb});

            if (sbi !== -1) {
                addSubjectElement(list[sbi].Name, list[sbi].Logo);
            }

        });
        // tab swiper
        var cats = _.concat(["全部"], _.keys(Categorys));
        var compiled = _.template($("#slideTpl").html());
        var cateList = compiled({"cats": cats});

        $('.swiper-wrapper').append(cateList);

        mySwiper = new Swiper('#container', {
            lazy:{
                loadPrevNext: true,
            },
            autoplay: 0,
            observer: true,
            observeParents: true,
            passiveListeners: false,
            //跟随手指。如设置为false，手指滑动时slide不会动，当你释放时slide才会切换。
            followFinger: false,
            //拖动的临界值（单位为px），如果触摸距离小于该值滑块不会被拖动。
            threshold:30,
            // 值越大触发Swiper所需距离越大
            // longSwipesRatio:0.1,
            // 触摸比例。触摸距离与slide滑动距离的比率。
            // touchRatio:1.5,
            // 抵抗率。边缘抵抗力的大小比例。值越小抵抗越大越难将slide拖离边缘，0时完全无法拖离。
            resistanceRatio:0.6,
            // 允许触发拖动的角度值。默认45度，即使触摸方向不是完全水平也能拖动slide。
            touchAngle: 20,
            pagination: {
                el: '#pagination',
                clickable: true,
                bulletActiveClass: 'menu-item--active',
                renderBullet: function (index, className) {
                    return '<li class="' + className + '"><a class="menu-item">' + cats[index] + '</a></li>'
                },
            },
            touchMoveStopPropagation : false,
            on: {
                slideChangeTransitionStart: function(){
                    // var index = this.activeIndex;
                    // var subject = v;
                    // var etitle = dics[index][0];
                    // triggerLoad(state, nj);

                },
                slideChange: function () {
                    // 当切换到某个 slider
                    var index = this.activeIndex;
                },
                touchEnd: function(event){
                    var k = $(event.target).closest(".wrap-box").attr("id").substring(2);

                    myScroll[k]._end(event);
                },
            }
        });

        var sh = $(window).height() - $(".header").height() - $(".header-logo").height() - $(".menubar").height();
        $(".js-wrap-box").height(sh);

        _.forEach(cats, function(k){
            if(k != "全部"){
                var subList = _.filter(clist, function (v, i) {
                    return v.Industry == k;
                });
                buildSubjects(subList, $("#sw"+k), k);
            }else{
                buildSubjects(clist, $("#sw"+k), k);
            }
        });

    }

// 添加顶部关注词图标
    function addSubjectElement(key, url) {
        var oImg = document.createElement('img');
        oImg.src = url;
        oImg.title = key;
        $('.header-logo h2').append(oImg);
    }

// 要被添加的关注词列表
    function buildSubjects(list, parent, k) {
        var ww = $(window).width();
        var sw = ww * 0.80;
        var $box = $('.brand__list', parent).html('');
        var compiled = _.template($("#contentTpl").html());
        var slist = compiled({"lists": list, "selectedSubjects": sUser.Subjects});
        var tpl = $("<div></div>");
        tpl.html(slist);

        tpl.find(".js-brand").width(sw / 4);

        $box.append(tpl.html());

        // lazyArr[k] = new LazyLoad({
        //     container: parent[0],
        //     callback_set: function (element) {
        //     }
        // });

        myScroll[k] = new IScroll('#sc'+k, {
            probeType: 3,
            click: true,
            tap: true,
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true
        });

        myScroll[k].on('scroll', function () {
            if (this.y < -10) {
                $(".brand h2").hide(30);
            } else {
                $(".brand h2").show(30);
            }
        });

        setTimeout(function () {
            myScroll[k].refresh();
            mySwiper.lazy.load()
            // lazyArr[k].update();
        }, 50);
    }

});
