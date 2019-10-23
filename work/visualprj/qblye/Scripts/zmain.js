// allen 2018-02-06 事件PicUrl 更改
// 关注词组
var aSubject = [];
// 滑动索引
var subjectIndex = 0;
var pageSize = 10;
var oUser = {};
// 上下滑动数组
var subjectMini = [];

var host = 'http://qbly.ijiebao.com/NewsImage/';
var wxUrl = 'http://qbly.ijiebao.com/wxheadimage/';
// 本地 session
var sd = store.session('state');
// 初始状态
var state = _.isNull(sd) ? {} : sd;
// 滑动数组
var mySwiper = [];
// 包含精选的关注词
var hasChoicenes = [];

var dic = {
    stick: "敏感",
    choiceness: "精选",
    news: "最新",
    event: "事件",
    trade: "行业",
};

var lazyArr = [];
var rs;
var eventImaPath = '/QBLYNewsImage/Events/';
var rPic = /^http.*/i;
var openid = store.session('openid');

// 依赖组
var depTrade = [];

var swc = [];
var request = window.superagent;

$(function () {

    // window.vConsole = new window.VConsole({
    //     defaultPlugins: ['system', 'network', 'element', 'storage'],
    //     maxLogNumber: 1000,
    //     onReady: function () {
    //     }
    // });

    if (openid) {
        // todo 用户微信过来的敏感新闻 id
        var rid = store.session('robotrid');

        jb.ajx.request({
            url: 'api/user/getuser.ashx',
            data: {
                openId: openid
            },
            cb: function (result) {
                if (result.body.Code == 200) {
                    var user = result.body.Data;
                    if (user) {
                        store.session('curuser', user);
                        if (rid) {
                            // 直接打开敏感新闻
                            openNews(rid, openid);
                        } else {
                            init(openid);
                        }
                    }
                } else {
                    console.log(result.body.ErrMsg)
                }
            }
        });

    }

    // 判精选、事件
    function filterDic(dic, subject) {
        return _.omitBy(dic, function (k, ii) {
            if (k == "精选" && !_.includes(hasChoicenes.selected, subject)) {
                return true;
            }

            if (k == "事件" && !_.includes(hasChoicenes.events, subject)) {
                return true;
            }

            return false;
        });
    }

    function init(openid, url) {

        oUser = store.session('curuser');
        // 当前关注词
        aSubject = oUser.Subjects;
        // 记录主屏 swiper 滑屏的索引
        subjectIndex = Number(store.session('qblynewsindex')) || 0;

        var sIndestry = store.session('qblyyjSubject');

        if (sIndestry) {
            // 根据舆情关注词，获得应该激活的滑屏索引
            var yjindex = _.indexOf(aSubject, sIndestry);

            if (yjindex > -1) {
                // 设置为敏感舆情所属的关注词
                subjectIndex = yjindex;
            }
        } else {
            var oldsubject = store.session('oldsubject');
            var oldindex = _.indexOf(aSubject, oldsubject);
            if (oldindex > -1) {
                // 返回上一主关注词
                subjectIndex = oldindex;
                store.session('qblynewsindex', subjectIndex)
            } else {
                // 上一主屏关注词不存在后
                store.session('oldsubject', aSubject[0]);
                store.session('qblynewsindex', 0);
                subjectIndex = 0;
            }
        }
        // 初始化状态
        state = initState(state, aSubject);
        store.session('state', state);

        rs = Redux.createStore(rducer, state, Redux.applyMiddleware(ReduxThunk));
        rs.subscribe(render);
        // 获取关注词状态信息
        rs.dispatch(firstCon({
            openid: openid,
            subjects: aSubject,
            url: url
        }));
    }

    // 触发加载数据, siblingv 同行业关注词，无传 ""
    function triggerLoad(olds, v, siblingv) {
        // 关注词的子栏目
        var tdic = filterDic(dic, v);
        var timer = 0;
        if (v === "315") {
            tdic = {
                news: "最新",
                choiceness: "精选",
                event: "事件"
            };
        }
        _.forEach(tdic, function (vl, etitle) {
            var mindex = etitle + v;
            var snum = parseInt(olds[v].scroll[etitle], 10);
            // 数据展示容器
            if (_.isUndefined(subjectMini[mindex])) {
                buildContent(v);
            }
            // 子栏目无数据则远程加载数据
            if (_.isEmpty(olds[v][etitle]) && (siblingv.length === 0 || (etitle !== "trade" && siblingv.length > 0))) {
                setTimeout(function () {
                    subjectMini[mindex].triggerUpLoading();
                }, timer);
                timer = timer + 60;
            }
            // 本地有缓存数据则加载
            if (_.size(olds[v][etitle]) > 0 && (siblingv.length === 0 || (etitle !== "trade" && siblingv.length > 0))) {
                rs.dispatch(storeRequest({
                    from: "store",
                    data: olds[v][etitle],
                    subject: v,
                    etitle: etitle,
                    scroll: snum,
                    direction: 0,
                    stickNo: false
                }));
            }
        });
    }

    // 渲染
    function render() {
        var mindex, wh, hh;
        var deps;
        var newState = rs.getState();
        mindex = newState.etitle + newState.subject;
        // 界面初始化并加载数据
        if (_.has(newState, "openid")) {
            // 精选判断
            hasChoicenes = newState.chev;

            // hasChoicenes.activityImages = [];

            if(_.size(hasChoicenes.activityImages)>0){
                var allPics = _.groupBy(hasChoicenes.activityImages, function (v) {
                    return v.IsAll
                });

                hasChoicenes.pics = _.groupBy(allPics["false"], function (v) {
                    return v.Relations[0]
                });

                _.each(aSubject, function (v) {
                    if (!_.has(hasChoicenes.pics, v)) {
                        hasChoicenes.pics[v] = [];
                    }
                });

                var trueMap = _.map(allPics["true"], function (v) {
                    return v.Name;
                });

                _.each(hasChoicenes.pics, function (v, i) {
                    if (!_.includes(trueMap, v)) {
                        hasChoicenes.pics[i] = _.concat(allPics["true"], v);
                    }

                    hasChoicenes.pics[i] = _.sortBy(hasChoicenes.pics[i], function (p, j) {
                        return p.Order;
                    })

                });
            }else{
                hasChoicenes.pics = [];
            }

            // 从该查询返回315 海报内容

            var pice = [];
            var noIndexPice;
            var curSubjectsItem;
            // 考虑当前关注词， 新添加关注词可以命中已删除关注词的数据
            // 检查当前关注词，保证正确的顺序
            //
            // newState.logo = _.compact(_.map(aSubject, function (v) {
            //     if(v !== "315"){
            //         return _.find(newState.logo, {Name: v});
            //     }
            // }));
            // noIndexPice = _.reject(newState.logo, {Name: aSubject[subjectIndex]});
            // curSubjectsItem = _.find(newState.logo, {Name: aSubject[subjectIndex]});
            //
            // console.log(newState.logo, noIndexPice, curSubjectsItem)
            // _.forEach(noIndexPice, function (v, i) {
            //     if (v.Industry === curSubjectsItem.Industry) {
            //         v.SameIndustrySibling = curSubjectsItem.Name;
            //         depTrade.push(curSubjectsItem.Name);
            //         depTrade.push(v.Name);
            //     }
            // });
            // // 检查剩余关注词，构建依赖数据指向 美团-》百度，腾讯-》百度
            // for (var j = 1; j <= noIndexPice.length - 1; j++) {
            //     pice = _.concat([curSubjectsItem], _.take(noIndexPice, j));
            //     // 在前面找， 找到一个就可以
            //     var findex = _.findIndex(pice, {Industry: noIndexPice[j].Industry});
            //     if (findex > -1) {
            //         var nIndex = _.findIndex(newState.logo, {Name: noIndexPice[j].Name});
            //         newState.logo[nIndex].SameIndustrySibling = pice[findex].Name;
            //         depTrade.push(newState.logo[nIndex].Name);
            //         depTrade.push(pice[findex].Name);
            //     }
            // }
            // // 关注依赖数组
            // depTrade = _.uniq(depTrade);
            // 构造子栏目容器
            buildTab(newState.logo, hasChoicenes.pics);
            wh = $(window).height();
            hh = $(".header").height();
            $(".wrap-box").height(wh - hh);
            buildSwipe();

            _.forEach(aSubject, function (v, i) {
                buildContent(v);
            });

            // 补充数据，已激活的主关注词或第一个关注词
            var cr = _.find(newState.logo, {Name: aSubject[subjectIndex]});
            var hs = _.has(cr, "SameIndustrySibling");

            if (aSubject.length > 1) {
                triggerLoad(state, aSubject[subjectIndex], hs ? cr.SameIndustrySibling : "");
                // 分时加载保证，后续依赖可以拿到数据。
                // _.delay(function () {
                var narr = _.concat([], aSubject);
                _.pull(narr, aSubject[subjectIndex]);
                _.forEach(narr, function (nj, i) {
                    var cr = _.find(newState.logo, {Name: nj});
                    var hs = _.has(cr, "SameIndustrySibling");
                    // setTimeout(function () {
                    triggerLoad(state, nj, hs ? cr.SameIndustrySibling : "");
                    // }, (i) * 600);
                })
                // }, 600);
            }

            if (aSubject.length === 1) {
                triggerLoad(state, aSubject[subjectIndex], hs ? cr.SameIndustrySibling : "");
            }
            // 绑定事件
            setEvent(newState.openid);
            // 打开微信新闻

            if (newState.wxurl) {
                setTimeout(function () {
                    openUrl(newState.openid, newState.wxurl);
                }, 1300);
            }
            // 保存当前关注词
            _.delay(function () {
                store.session.remove('qblyyjSubject');
                store.session('oldsubject', aSubject[subjectIndex]);
            }, 1000);
        } else {
            // 数据更新
            if (_.has(newState, "direction") && _.size(newState.data) > 0) {
                renderList(newState);
                // up
                if (newState["direction"] == 0) {
                    subjectMini[mindex].endUpLoading(false);
                }
                // down
                if (newState["direction"] == 1) {
                    subjectMini[mindex].endDownLoading(true);
                }

                if (!_.has(lazyArr, mindex)) {
                    lazyArr[mindex] = new LazyLoad({
                        container: document.getElementById(mindex),
                        elements_selector: ".imgLiquid",
                        callback_set: function (element) {
                        }
                    });
                }

                lazyArr[mindex].update();

                // 滚动到记录位置
                if (_.has(newState, "scroll") && newState.scroll > 50) {
                    setTimeout(function () {
                        subjectMini[mindex].scrollTo(newState.scroll, 30);
                    }, 500)
                }
                // 远程获取的行业数据第一次加载，及本地获取数据刷新命中缓存, 渲染完后分发依赖同步
                // if (newState.etitle === "trade" && newState.from !== "same") {
                //     deps = _.concat([], depTrade);
                //     _.pull(deps, newState.subject);
                //     if (_.includes(depTrade, newState.subject) && deps.length > 0) {
                //         _.forEach(deps, function (v) {
                //             // console.log("up dep:", newState.subject + "->" + v, newState);
                //             rs.dispatch(storeRequest({
                //                 sameSibling: newState.subject,
                //                 data: newState.data,
                //                 subject: v,
                //                 etitle: newState.etitle,
                //                 scroll: 0,
                //                 direction: 0,
                //                 stickNo: false
                //             }));
                //         });
                //     }
                // }


                if (newState.etitle === "stick") {
                    swc[mindex] = new Swiper('#slide315-' + mindex, {
                        speed: 300,
                        autoplay: {
                            disableOnInteraction: false,
                            delay: 2000
                        },
                        observer: true,
                        observeParents: true,
                        nested: true,
                        pagination: {
                            el: '#page315-' + mindex,
                        }
                    });
                }

            }
        }
    }

    // dir 1 up 0 down 列表渲染
    function renderList(tdata) {

        var olds = store.session('state');
        var mb = $("#mini-" + tdata.etitle + tdata.subject);

        if (tdata.stickNo && olds[tdata.subject].nostick) {
            $(".js-stick-no", mb).addClass("no-data");
        }

        var mbox = mb.find(".js-list");
        // 事件
        var eventbox = mb.find(".js-hotsec");
        var liArr = [];

        var wxtpl = $("#wxItemTpl").html();

        var othertpl = $("#otherItemTpl").html();

        if (tdata.etitle === "event") {
            liArr = buildEvent(tdata.data);
            eventbox.append(liArr);
            var mindex = tdata.etitle + tdata.subject;

            mb.find(".minirefresh-upwrap").css({"display": "none"});
            mbox.empty();

        } else {
            liArr = _.map(tdata.data, function (item) {
                return buildItem(item, tdata.subject, tdata.etitle, wxtpl, othertpl);
            });
            if (tdata.dir) {
                mbox.prepend(liArr);
            } else {
                mbox.append(liArr);
            }
            $(".contentList-item", mbox).css("visibility", "visible");
        }


    }

    // 事件
    function buildEvent(list) {

        var hotlist = list.map(function (v) {
            if (!_.isNull(v.Title)) {
                if (v.Title.length > 18) {
                    v.Title = v.Title.substring(0, 18) + "...";
                }
            }
            v.PublishDateTimeStart = _.replace(v.PublishDateTimeStart.substring(0, 10), /-/g, ".");
            v.PublishDateTimeEnd = _.replace(v.PublishDateTimeEnd.substring(0, 10), /-/g, ".");

            if (!rPic.test(v.PicUrl)) {
                v.PicUrl = eventImaPath + v.PicUrl;
            }

            return v;
        });

        var ww = $(window).width();
        var sw = ww * 0.84;

        var compiled = _.template($("#hotListTpl").html());
        var slist = compiled({"lists": hotlist});
        var tpl = $("<div></div>");
        tpl.html(slist);

        tpl.find(".js-brand").width(sw / 2);

        return tpl.html();
    }

    //构建新闻列表中的一条新闻的DOM，这个应该有几种模板对应
    function buildItem(item, subject, etitle, wxtpl, othertpl) {
        // oImg.src = 'data:image/png;base64,' + imgurl;
        if (item.Title.length > 56) {
            item.Title = item.Title.substring(0, 56) + "...";
        }
        var time = item.PublishDateTime;
        var tpl;

        if (time) {
            item.time = convertTime(time);
            if (!time) {
                item.time = '今天';
            }
        }

        if (/mp\.weixin\.qq\.com/.test(item.Url)) {
            item.wx = 1;

            if (_.size(item.UserPic) > 1) {
                item.UserPic = wxUrl + _.replace(item.UserPic, /\\/, '\\\/');
            }

            if (!_.isNull(item.VerifyInfo)) {
                if (item.VerifyInfo.length > 16) {
                    item.VerifyInfo = item.VerifyInfo.substring(0, 16) + "...";
                }
            }

        } else {
            item.wx = 0;
        }

        if (item.ImageCount == 0) {
            item.ImageUrl = ""
        }

        if (item.ImageCount > 0) {
            item.ImageUrl = host + item.RId.toString().substring(0, 6) + '/' + item.RId;
        }

        if ((item.MediaName).length > 8) {
            item.MediaName = (item.MediaName).substring(0, 8)
        }

        var ww = $(window).width();
        var wx = ww * 0.92;
        var sw = ww * 0.84;

        if (item.wx == 1) {
            tpl = wxtpl;
        } else {
            tpl = othertpl;
        }

        // 根据情况选模板
        var compiled = _.template(tpl);
        var itemHtml = compiled({"item": item, "subject": subject, "etitle": etitle});

        var box = $("<div></div>");
        box.html(itemHtml);

        $(box).find(".js-img").each(function (i, item) {

            if ($(item).hasClass("js-li")) {
                $("li", item).css({"width": sw / 3 + "px", "height": sw * 2 / 9 + "px"});
            }
            // wx one
            if ($(item).hasClass("js-wx")) {
                // $(item).css({"width": wx + "px", "height": wx * 2 / 3 + "px"});
                $(item).css({"width": sw / 3 + "px", "height": sw * 2 / 9 + "px"});
            }

            // other one
            if ($(item).hasClass("js-ot-one")) {
                $(item).css({"width": sw / 3 + "px", "height": sw * 2 / 9 + "px"});
            }

        });

        // console.log(box.html())
        return box.html()
    }

    // 构造滑动子栏目内容
    function buildTab(sr, pics) {
        var index = parseInt(subjectIndex, 10) + 1;
        var compiled = _.template($("#subjectTab").html());
        var temp = compiled({"subjects": aSubject, "sr": sr});
        $('#js-inc').append(temp);

        $('#js-header').tabslet({
            activeclass: "head-active",
            container: "#js-tab-box",
            active: index
        });

        aSubject.forEach(function (v, i) {
            var tdic = filterDic(dic, v);
            if (v === "315") {
                tdic = {
                    news: "最新",
                    choiceness: "精选",
                    event: "事件"
                };
            }

            var scompiled = _.template($("#swiperTpl").html());

            var stemp = scompiled({"datas": {"tdic": tdic, "slide": v, "pics": pics}});

            $('#' + v + 'container .swiper-wrapper').append(stemp);
        });
    }

    // 根据关注词数量构建swipe容器及滑动子标题
    function buildSwipe() {
        var olds = store.session('state');
        aSubject.forEach(function (v, i) {
            var tdic = filterDic(dic, v);

            if (v === "315") {
                tdic = {
                    news: "最新",
                    choiceness: "精选",
                    event: "事件"
                };
            }

            var dics = _.toPairs(tdic);
            mySwiper[v] = new Swiper('#' + v + 'container', {
                autoplay: 0,
                observer: true,
                observeParents: true,
                pagination: {
                    el: '#' + v + 'pagination',
                    clickable: true,
                    bulletActiveClass: 'menu-item--active',
                    renderBullet: function (index, className) {
                        return '<li class="' + className + '"><a class="menu-item">' + dics[index][1] + '</a></li>'
                    },
                },
                // touchMoveStopPropagation : false,
                on: {
                    slideChangeTransitionStart: function () {

                    },
                    slideChange: function () {
                        var olds = store.session('state');
                        // 当切换到某个 slider
                        var index = this.activeIndex;
                        olds[v].active = index;
                        store.session('qblynewsindex', index);
                        store.session('state', olds);
                    }
                }
            });

            mySwiper[v].slideTo(parseInt(olds[v].active, 10), 300);
        });

    }

    // 上下拉动
    function buildContent(v) {
        var ww = $(window).width();
        var hh = $(".header").height();
        var tdic = filterDic(dic, v);
        if (v === "315") {
            tdic = {
                news: "最新",
                choiceness: "精选",
                event: "事件"
            };
        }
        var tkeys = _.keys(tdic);
        _.forEach(tdic, function (vl, etitle) {
            var mindex = etitle + v;
            subjectMini[mindex] = new MiniRefresh({
                container: "#mini-" + mindex,
                down: {
                    progress: 0,
                    offset: 90,
                    //
                    isAllowAutoLoading: true,
                    // 初始不自动触发
                    isAuto: false,
                    // 下拉后也可以上拉
                    isAways: true,
                    successAnim: {
                        isEnable: false,
                        duration: 1000
                    },
                    contentdown: '<img src="img/loading.gif">',
                    // 可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover: '<img src="img/loading.gif">',
                    // 可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: '<img src="img/loading.gif">',

                    callback: function () {
                        var datetime = fecha.format(new Date(), 'YYYY-MM-DD HH:mm');

                        if (etitle !== "event") {
                            rs.dispatch(downRequest({
                                subject: v,
                                etitle: etitle,
                                ctitle: vl,
                                direction: 1,
                                datetime: datetime
                            }));
                        } else {
                            subjectMini[mindex].endDownLoading(true);
                        }
                    },
                    isWrapCssTranslate: true
                },
                up: {
                    isAuto: false,
                    toTop: {
                        isEnable: false,
                    },
                    callback: function () {
                        var olds = store.session('state');

                        if (!_.has(olds, v)) {
                            olds = initState(olds, v);
                            store.session('state', olds);
                        }

                        if (etitle === "event") {
                            rs.dispatch(upEventRequest({
                                subject: v,
                                etitle: etitle,
                                ctitle: vl,
                                direction: 0,
                                page: olds[v].page[etitle] + 1,
                            }));
                        } else {

                            rs.dispatch(upRequest({
                                subject: v,
                                etitle: etitle,
                                ctitle: vl,
                                direction: 0,
                                page: olds[v].page[etitle] + 1,
                            }));
                        }

                    },
                    onScroll: function () {
                        var scroll;
                        var olds;
                        var index;
                        var elm;

                        scroll = subjectMini[mindex].getPosition();
                        olds = store.session('state');
                        index = _.indexOf(tkeys, etitle);
                        olds[v].scroll[etitle] = scroll;
                        store.session('state', olds);

                        // elm = $(subjectMini[mindex].toTopBtn);
                        // elm.css({"left": ww - 45 + (index) * ww + "px", "bottom": 2 * hh + "px"});

                    }
                }
            });

        });

    }

    // 全局事件绑定
    function setEvent(openid) {
        history.pushState({path: "zmain.html"}, "", "zmain.html");
        window.onpopstate = function (e) {
            document.location.href = 'zmain.html?v=' + Math.random(0, Date.now());
        };

        $("#js-tosearch").click(function (e) {
            e.preventDefault();
            location.href = 'hotevent.html?v=' + Math.random(0, Date.now());
        });

        $('#js-header').on("_after", function (e) {
            var li = $(e.target);
            var index = li.index();
            store.session('qblynewsindex', index);
            store.session('oldsubject', aSubject[index]);
        });

        $('#js-create').click(function () {
            var cindex = store.session('qblynewsindex');
            store.session('oldsubject', aSubject[cindex]);
            document.location.href = 'create.html?v=' + Math.random(0, Date.now());
        });

        $('.js-shezhi').click(function () {
            document.location.href = 'person.html?v=' + Math.random(0, Date.now());
        });

        $(".js-conbox").delegate('.js-rec', 'click', function (event) {
            event.preventDefault();
            var el = $(event.currentTarget);
            var url = el.attr('href');

            jb.ajx.browseRecord({openid: openid, url: url, logtype: 2}).then(function () {
                location.href = url;
            });

        });


        // 媒体点击
        $(".js-conbox").delegate('.js-media', 'click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var $elc = $(event.currentTarget);
            var similarid = $elc.attr("item-similar-id");
            var isClicked = $elc.attr("item-clicked");

            var pitem = $elc.closest(".contentList-item");
            if (isClicked == "0") {
                $.ajax({
                    type: 'get',
                    url: 'api/report/similarNews.ashx',
                    data: {similarid: similarid},
                    dataType: 'json',
                    success: function (result) {
                        var compiled;
                        var datas;
                        var tpl;
                        if (result.Code == 200) {
                            if (result.Data.length > 0) {
                                compiled = _.template($("#mediaTip").html());
                                datas = result.Data;

                                if (datas.length > 10) {
                                    datas = _.take(datas, 10);
                                }

                                datas = _.map(datas, function (v) {
                                    if (v.length > 8) {
                                        v = v.substring(0, 8);
                                    }
                                    return v;
                                });

                                tpl = compiled({"datas": datas});
                                $elc.addClass("src-is-active");
                                pitem.addClass("contentList-item--nopadding");
                                pitem.append(tpl);
                                $elc.attr("item-clicked", 1);

                            }
                        }
                    }
                });
            } else {
                $elc.removeClass("src-is-active");
                pitem.removeClass("contentList-item--nopadding");
                pitem.find(".src-drop").remove();
                $elc.attr("item-clicked", 0);
            }

        });
        // 媒体关闭
        $(".js-conbox").delegate('.src-drop', 'click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var sd = $(event.currentTarget);
            var pitem = sd.closest(".contentList-item");
            var $elc = $(".src-is-active", pitem);

            $elc.removeClass("src-is-active");
            pitem.removeClass("contentList-item--nopadding");
            sd.remove();
            $elc.attr("item-clicked", 0);
        });

        // 反馈
        $(".js-conbox").delegate('.js-check', 'click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $a = $(e.currentTarget);

            var $p = $a.closest(".contentList-item");
            var sindex = $a.closest(".js-wrap-box").attr("id");

            var dtitle = $a.attr("data-title");
            var durl = $a.attr("data-url");
            var dmeida = $a.attr("data-meida");
            var rid = $p.attr("itemid");

            $a.qtip({
                content: {
                    text: $("#feedbackTip").html()
                },
                style: {
                    def: false,
                    classes: 'close-box',
                    // width: ($(window).width()-20),
                    tip: {
                        border: 0,
                        width: 8,
                        height: 8
                    }
                },
                position: {
                    viewport: $(".js-conbox"),
                    my: 'top right',
                    at: 'bottom right',
                    adjust: {
                        x: -10,
                    },
                    target: $a
                },
                overwrite: false,
                show: {
                    event: event.type,
                    ready: true
                },
                hide: {
                    event: 'click',
                    target: $(".shadow")
                },
                events: {
                    show: function (event, api) {
                        $('.shadow').addClass('shadow-bg').show();

                        document.querySelector('.shadow').addEventListener("touchmove", function (e) {
                            e.preventDefault();
                        }, false);

                        var jetitle = $a.attr("data-lan");

                        var tipBox = $(event.currentTarget);

                        // console.log(event, jetitle)

                        if (jetitle === "stick") {
                            $(".js-not-stick", tipBox).css("display", "list-item");
                        }

                        var nref = {
                            up: {
                                isLock: true
                            },
                            down: {
                                isLock: true
                            }
                        };

                        subjectMini[sindex].refreshOptions(nref);
                        $h2 = $(".js-title", $p);


                        $(".js-feed").click(function (e) {
                            var li = $(e.currentTarget);
                            var feed = $(e.currentTarget).text();
                            var json = {
                                type: 2,
                                rid: $h2.attr("item-rid"),
                                content: feed,
                                OpenId: oUser.OpenId
                            };

                            li.addClass("button--primary");

                            setTimeout(function () {
                                li.removeClass("button--primary");
                            }, 60);

                            $.ajax({
                                type: 'post', //可选get
                                url: 'api/feedback/insert.ashx',
                                data: json,
                                dataType: 'json',
                                success: function (result) {
                                    api.hide();
                                    $('.shadow').addClass('shadow-bg').show();
                                    $('#tip h3').html('提交成功');
                                    $('#tip').fadeIn(600);
                                    setTimeout(function () {
                                        $('#tip').fadeOut(200);
                                        $('.shadow').hide().removeClass('shadow-bg');

                                    }, 2000);

                                    $a.empty();
                                },
                                error: function () {
                                    api.hide();
                                    $('.shadow').addClass('shadow-bg').show();
                                    $('#tip i').removeClass("icon-success").addClass("icon-false")
                                    $('#tip h3').html('提交失败');

                                    $('#tip').fadeIn(600);
                                    setTimeout(function () {
                                        $('#tip').fadeOut(200);
                                        $('.shadow').hide().removeClass('shadow-bg');

                                    }, 2000);

                                    $a.empty();
                                }
                            })
                        });

                        $(".js-nolook").click(function (e) {
                            var li = $(e.currentTarget);
                            var feed = $(e.currentTarget).text();
                            var json = {
                                openid: oUser.OpenId,
                                rid: rid,
                                mediaView: dmeida,
                                title: dtitle,
                                url: durl,
                                description: feed
                            };

                            li.addClass("button--primary");

                            setTimeout(function () {
                                li.removeClass("button--primary");
                            }, 60);

                            $.ajax({
                                type: 'post', //可选get
                                url: 'api/mediaview/insert.ashx',
                                data: json,
                                dataType: 'json', //服务器返回的数据类型 可选XML ,Json jsonp script htmltext等
                                success: function (result) {
                                    api.hide();
                                    $('.shadow').addClass('shadow-bg').show();
                                    $('#tip h3').html('提交成功');
                                    $('#tip').fadeIn(600);
                                    setTimeout(function () {
                                        $('#tip').fadeOut(200);
                                        $('.shadow').hide().removeClass('shadow-bg');

                                    }, 2000);

                                    $a.empty();
                                },
                                error: function () {
                                    api.hide();
                                    $('.shadow').addClass('shadow-bg').show();
                                    $('#tip i').removeClass("icon-success").addClass("icon-false")
                                    $('#tip h3').html('提交失败');

                                    $('#tip').fadeIn(600);
                                    setTimeout(function () {
                                        $('#tip').fadeOut(200);
                                        $('.shadow').hide().removeClass('shadow-bg');

                                    }, 2000);

                                    $a.empty();
                                }
                            })
                        });
                    },
                    hide: function (event, api) {
                        $('.shadow').hide().removeClass('shadow-bg');

                        var hideref = {
                            up: {
                                isLock: false
                            },
                            down: {
                                isLock: false
                            }
                        };
                        subjectMini[sindex].refreshOptions(hideref);
                        document.querySelector('.shadow').removeEventListener("touchmove", function (e) {
                            e.preventDefault();

                        }, false);

                        api.destroy();
                    },

                }
            }, event);

        });

        // 事件子栏目里事件项点击
        $(".js-hotsec").on("click", "a", function (e) {
            e.preventDefault();
            var itype = $(e.currentTarget).attr("item-type");
            var el = $(e.currentTarget);
            var pli = el.closest(".js-brand");

            var pt = "/";

            if(url('path').indexOf("dev")>-1){
                pt = "/dev/"
            }

            if(url('path').indexOf("test")>-1){
                pt = "/test/"
            }

            var turl = url('protocol') + "://" + url('hostname') + ":" + url('port') + pt;

            if (itype == 2) {
                turl += "event.html?id=" + pli.attr("item-id") + "&from=zmain&v=" + Math.random(0, Date.now());
            }

            if (itype == 4) {
                turl += "eventBrand315.html?id=" + pli.attr("item-id") + "&sty=315" + "&from=zmain&v=" + Math.random(0, Date.now());
            }

            if (itype == 5) {
                turl += "315eventTrace.html?id=5aa9278cbaea2922cc53d77d&sty=315" + "&from=zmain&v=" + Math.random(0, Date.now());
            }

            if (itype == 3) {
                turl += "eventBrand.html?id=" + pli.attr("item-id") + "&from=zmain&v=" + Math.random(0, Date.now());
            }

            jb.ajx.browseRecord({openid: openid, url: turl, logtype: 4}).then(function () {
                location.href = turl;
                return;
            });

        });

        // 事件小图标点击
        $(".js-conbox").delegate(".js-event", "click", function (e) {
            var el = $(e.currentTarget);
            // console.log(el)
            var eid = el.attr("eid");
            var idd = el.attr("idd");
            var id = el.closest(".js-wrap-box").attr("id");
            var turl = url('protocol') + "://" + url('hostname') + ":" + url('port') + "/";

            if (id.indexOf("315")) {
                turl += "315eventTrace.html?name=" + encodeURIComponent(eid) + "&sty=315&from=zmain";
            } else {
                turl += "event.html?name=" + encodeURIComponent(eid) + "&from=zmain";
            }

            jb.ajx.browseRecord({openid: openid, url: turl, logtype: 4}).then(function () {
                location.href = turl;
                return;
            });

        });

        $('.swc .swiper-slide[idd="5aa8d1f0baea292540b2d970"]').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            var el = $(e.currentTarget);

            have315().then(function (data) {
                if (data === true) {
                    store.session("has315", 1);
                    location.href = '315dy.html?v=' + Math.random(0, Date.now());
                } else {
                    location.href = '315.html?v=' + Math.random(0, Date.now());
                }
            });

        })
    }

    function have315() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'post',
                url: 'api/feedback/isExist.ashx',
                data: {openid: openid},
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data)
                    } else {
                        reject()
                        alertTip(result.ErrMsg);
                    }
                },
                error: function () {
                }
            });
        })
    }

    // 打开微信过来的敏感新闻页面
    function openUrl(openid, surl) {
        jb.ajx.browseRecord({openid: openid, url: surl, logotype: 3}).then(function () {

            store.session.remove('robotrid');
            document.location.href = surl;
        }, function () {
            // document.location.href = url;

        });

    }

    // 时间转换
    function convertTime(time) {
        var date = new Date(time).getTime();
        var now = new Date().getTime();
        var s = (now - date) / 1000;

        var result;

        switch (true) {
            case s >= (6 * 24 * 60 * 60):
                result = formatDate(time, "-");
                break;
            case s >= (24 * 60 * 60):
                result = Math.ceil(s / (24 * 60 * 60)) + '天前';
                break;
            case s >= 3600:
                result = Math.ceil(s / 3600) + '小时前';
                break;
            default:
                result = Math.ceil(s / 60) + '分钟前';

        }
        return result;
    }

    function formatDate(date) {
        var arg1 = _.toArray(arguments)[1];
        var sep = _.isUndefined(arg1) ? "-" : arg1;
        var tdate = fecha.parse(date, 'YYYY-MM-DD');
        return fecha.format(tdate, 'YYYY' + sep + 'MM' + sep + 'DD');
    }

    function closeWindow() {
        WeixinJSBridge.call('closeWindow');
    }

    // 打开新闻，或敏感新闻，rid:0 非敏感
    function openNews(rid, openid) {

        jb.ajx.request({
            url: 'api/report/getReportEntity.ashx',
            data: {
                rid: rid
            },
            cb: function (result) {
                if (result.body.Code == 200) {
                    var data = result.body.Data;
                    var url = data.Url;
                    // 新闻所属的关注词
                    var Subject = data.Subject;
                    // 保存舆情关注词
                    store.session('qblyyjSubject', Subject);

                    // 初始化页面，传入新闻舆情对应的 url
                    init(openid, url);
                } else {
                    init(openid);
                }
            }

        });
    }
});
