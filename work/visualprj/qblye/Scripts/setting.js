var openid = store.session('openid');
//var openid = 'ogHAKj0p37NEUbRZH1yWSn1NR_eg';
// 预警开着

$(function () {
    var notic;
    var dnotic;
    var fnotic;
    var jswsitch = $("#js-switch");
    var ftip = $("#freqbox .ofbtn");
    var fnobox = $("#freq-notic");

    var slider = $("#notic-freq")[0];
    // var fnotic;
    // isWorkDay   0：周一到周日， 1：周一到周五
    // type  :1-预警设置，2-日常设置
    var noticOptions = {
        onSwitchColor : '#21CB48',
        offSwitchColor: "#ccc",
        onChange: function () {
            var sTime;
            var nt = $('.js-notic-time');
            // js-nclose 预警推送关闭 打开的时候取得是第一个，可以从 session 里读取，没有再取第一个OK
            if (nt.hasClass("js-nclose")) {
                sTime = $('span:first-child', nt).attr("text-time");
            } else {
                sTime = $('.button--primary', nt).attr("text-time");
            }


            var aTime = sTime.split('-');
            var start = parseInt(aTime[0]);
            var end = parseInt(aTime[1]);
            var isWorkDay;

            var checked = notic.getChecked();

            if (start == 0) {
                isWorkDay = 0;
            } else {
                isWorkDay = 1;
            }

            var opt = {
                "SendNotice": checked ? 1 : 0,
                "start": start,
                "end": end,
                "isWorkDay": isWorkDay
            };

            if (!checked) {

                // 关闭 todo tip
                var lctip = $("#layTipCancelTpl").html();
                layer.open({
                    className: 'messageBox message message--alert laytip',
                    content: lctip,
                    btn: ['取消', '确定'],
                    no: function (index) {
                        // 实际为确定按钮
                        Setting(function(){
                            nt.unbind();
                            $('span', nt).removeClass("button--primary");
                            nt.addClass("js-nclose");

                            nt.on('click', 'span', function () {
                                    layer.open({
                                        time: 2,
                                        className: 'message message--alert laytip',
                                        content: $("#layTipNeedOpenTpl").html()
                                    })
                                }
                            );

                            fnotic.disable();
                            fnobox.find(".switch").css({"background-color": "#ccc", "border-color": "#ccc", "box-shadow": "none"});
                            $(".ofbtn").off();
                            slider.setAttribute('disabled', true);
                            $("#notic-freq .noUi-handle").hide(30);

                        }, opt);

                        layer.close(index);
                    },
                    yes: function (index) {
                        notic.on();
                        layer.close(index);
                    }
                });

            } else {

                Setting(function () {
                    fnotic.enable();
                    fnobox.find(".switch").css({"background-color": "#21cb48", "border-color": "#21cb48", "box-shadow": "#21cb48"});
                    bindOf();
                    slider.removeAttribute('disabled');
                    $("#notic-freq .noUi-handle").show(30);
                    //开启预警功能后可以选择预警时间段
                    setTimeClickEvent();

                    if (nt.hasClass("js-nclose")) {
                        nt.removeClass("js-nclose");
                        $('span:first-child', nt).addClass("button--primary");
                    }

                }, opt);
            }
        }
    };
    // 日报
    var dailyOptions = {
        onSwitchColor : '#21CB48',
        offSwitchColor: "#ccc",
        onChange: function () {
            var checked = dnotic.getChecked();

            var opt = {
                "DayReportNotice": checked ? 1 : 0,
            };
            var lctip = $("#layTipDailyCancelTpl").html();
            if (!checked) {
                layer.open({
                    className: 'messageBox message message--alert laytip',
                    content: lctip,
                    btn: ['取消', '确定'],
                    no: function (index) {
                        // 实际为确定按钮
                        Setting(function(){}, opt);

                        layer.close(index);
                    },
                    yes: function (index) {
                        dnotic.on();
                        layer.close(index);
                    }
                });
            }else{
                Setting(function(){}, opt);
            }


        }
    };
    var freqbox = $("#freqbox");

    // 预警频率，间隔、实时
    var freqOptions = {
        onSwitchColor : '#21CB48',
        offSwitchColor: '#129AEE',
        onChange: function () {

            var checked = fnotic.getChecked();

            var opt = {};

            if (!checked) {
                slider.setAttribute('disabled', true);
                slider.noUiSlider.set(1);
                $("#notic-freq .noUi-handle").hide(30);
                ftip.removeClass("onbtn")
                ftip.addClass("offbtn");
                ftip.text("实时")
                opt = _.extend(opt, {
                    IsInterval: 0,
                    Frequency: 0,
                });

                Setting(function () {
                }, opt);
            } else {
                slider.removeAttribute('disabled');
                $("#notic-freq .noUi-handle").show(30);
                slider.noUiSlider.set(5);
                ftip.removeClass("offbtn")
                ftip.addClass("onbtn");
                ftip.text("间隔")
                opt = _.extend(opt, {
                    IsInterval: 1,
                    Frequency: 5,
                });
                Setting(function () {
                }, opt);
            }
        }
    };
    var range_all_sliders = {
        'min': [1],
        '50%': [5],
        'max': [8]
    };

    function bindOf(){
        $(".ofbtn").click(function(){
            var checked = fnotic.getChecked();
            if(checked){
                fnotic.off();
            }else{
                fnotic.on();
            }
        });
    }
    setUser().then(function () {

        var oUser = store.session('curuser');
        var sett = oUser.Setting;

        var IsInterval = parseInt(sett.IsInterval, 10);
        var Frequency = parseInt(sett.Frequency, 10);

        noUiSlider.create(slider, {
            range: range_all_sliders,
            start: 1,
            connect: [true, false],
            step: 4,
            snap: true,
            pips: {
                mode: 'values',
                values: [1, 5, 8],
                density: 0,
                // stepped: true
            }
        });

        $(".noUi-value:last").text("8(小时)").css({"left": "98%"});

        slider.noUiSlider.on("change", function (value) {
            var opt = {
                IsInterval: 1,
                Frequency: value[0],
            };
            Setting(function () {
                // setSession(opt)
            }, opt);
        });

        var nchecked = notic.getChecked();

        if(!nchecked){
            $("#notic-freq .noUi-handle").hide(30);
            fnotic.disable();
            fnobox.find(".switch").css({"background-color": "#ccc", "border-color": "#ccc", "box-shadow": "none"});
            slider.setAttribute('disabled', true);

        }else{
            bindOf();
        }
        //
        if (IsInterval === 1) {
            // 间隔
            slider.noUiSlider.set(Frequency);
        } else {
            // 实时
            $("#notic-freq .noUi-handle").css({"display": "none"});
            slider.setAttribute('disabled', true);
        }

        $('.js-back').click(function () {
            document.location.href = 'person.html?v='+Math.random(0, Date.now());
        });
    });

    function Setting(success, opt) {
        var o = {};

        if (_.has(opt, "DayReportNotice")) {
            o.DayReportNotice = opt.DayReportNotice ? 1 : 0;
        }

        if (_.has(opt, "SendNotice")) {
            o.SendNotice = opt.SendNotice;
            o.Start = opt.start;
            o.End = opt.end;
            o.IsWorkDay = opt.isWorkDay;
        }

        if (_.has(opt, "IsInterval")) {
            o.IsInterval = opt.IsInterval;
            o.Frequency = parseInt(opt.Frequency, 10);
        }

        $.ajax({
            type: 'post', //可选get
            url: 'api/user/Setting.ashx',
            data: _.extend({
                openid: openid,
            }, o),
            dataType: 'json',
            success: function (result) {

                if (result.Code == 200) {
                    setSession(o);
                    success && success();
                }

            }
        });
    }

// 获取用户设置数据，更改设置状态
    function setUser() {
        var sUser = store.session('curuser');
        var ftip = $("#freqbox .ofbtn");

        return new Promise(function (resolve, reject) {
            if (sUser) {
                var oUser = sUser;
                var set = oUser.Setting;
                if (!set) {
                    $.ajax({
                        type: 'get', //可选get
                        url: 'api/user/getuser.ashx',
                        data: {openid: openid},
                        dataType: 'json', //服务器返回的数据类型 可选XML ,Json jsonp script htmltext等
                        success: function (result) {
                            if (result.Code == 200) {
                                var user = result.Data;
                                if (user.Setting) {
                                    var isNotice = user.Setting.SendNotice;
                                    var dailyNotice = user.Setting.DayReportNotice;
                                    var IsInterval = parseInt(user.Setting.IsInterval, 10);
                                    var Frequency = parseInt(user.Setting.Frequency, 10);
                                    var start = user.Setting.Start;
                                    var end = user.Setting.End;
                                    var _class = start + '-' + end;

                                    if (isNotice) {
                                        notic = new Switch($("#notic")[0], _.extend(noticOptions, {checked: true}));
                                        setTimeClickEvent();

                                        if (end) {
                                            $('.' + _class).addClass('button--primary').siblings().removeClass('button--primary');
                                        }
                                    } else {
                                        notic = new Switch($("#notic")[0], _.extend(noticOptions, {checked: false}));
                                        $('.js-notic-time').find("span").removeClass("button--primary");
                                        $('.js-notic-time').addClass("js-nclose");
                                    }

                                    if (dailyNotice) {
                                        dnotic = new Switch($("#dailyNotic")[0], _.extend(dailyOptions, {checked: true}));
                                    } else {
                                        dnotic = new Switch($("#dailyNotic")[0], _.extend(dailyOptions, {checked: false}));
                                    }
                                    // // 默认间隔，频率 5
                                    if (IsInterval === 1) {
                                        fnotic = new Switch($("#freqNotic")[0], _.extend(freqOptions, {checked: true}));
                                        ftip.addClass("onbtn")
                                        ftip.text("间隔")
                                    } else {
                                        fnotic = new Switch($("#freqNotic")[0], _.extend(freqOptions, {checked: false}));
                                        ftip.addClass("offbtn")
                                        ftip.text("实时")
                                    }

                                    oUser.Setting = user.Setting;

                                    store.session('curuser', oUser);

                                    resolve();
                                }
                            }

                        },
                        error: function () {
                            reject("服务器获取数据发生错误");
                            console.log('fetch error!!!');
                        }
                    });
                } else {
                    var isNotice = set.SendNotice;
                    var dailyNotice = set.DayReportNotice;
                    var IsInterval = parseInt(set.IsInterval, 10);
                    var Frequency = parseInt(set.Frequency, 10);
                    var start = set.Start;
                    var end = set.End;
                    var _class = start + '-' + end;

                    if (isNotice) {
                        notic = new Switch($("#notic")[0], _.extend(noticOptions, {checked: true}));
                        setTimeClickEvent();

                        if (end) {
                            $('.' + _class).addClass('button--primary').siblings().removeClass('button--primary');
                        }
                    } else {
                        notic = new Switch($("#notic")[0], _.extend(noticOptions, {checked: false}));
                        $('.js-notic-time').find("span").removeClass("button--primary");
                        $('.js-notic-time').addClass("js-nclose");
                    }

                    if (dailyNotice) {
                        dnotic = new Switch($("#dailyNotic")[0], _.extend(dailyOptions, {checked: true}));

                    } else {
                        dnotic = new Switch($("#dailyNotic")[0], _.extend(dailyOptions, {checked: false}));
                    }
                    // 默认间隔，频率 5
                    if (IsInterval === 1) {
                        fnotic = new Switch($("#freqNotic")[0], _.extend(freqOptions, {checked: true}));
                        ftip.addClass("onbtn");
                        ftip.text("间隔")
                    } else {
                        // 实时
                        fnotic = new Switch($("#freqNotic")[0], _.extend(freqOptions, {checked: false}));
                        ftip.addClass("offbtn")
                        ftip.text("实时")

                    }

                    resolve();
                }
            } else {
                reject("没有记录的用户")
            }
        });

    }

    function setTimeClickEvent() {
        var checked = notic.getChecked();
        $('.js-notic-time').unbind();
        $('.js-notic-time').on('click', 'span', function (e) {
            var that = $(e.currentTarget);
            var _sTime = that.attr("text-time");
            var _aTime = _sTime.split('-');
            var _start = parseInt(_aTime[0]);
            var _end = parseInt(_aTime[1]);

            var isWorkDay;

            if (_start == 0) {
                isWorkDay = 0;
            } else {
                isWorkDay = 1;
            }

            var opt = {
                "SendNotice": checked ? 1 : 0,
                "start": _start,
                "end": _end,
                "isWorkDay": isWorkDay,
                "type": 1,
            };

            that.addClass('button--primary').siblings().removeClass('button--primary');
            var _success = function () {

            };

            Setting(_success, opt);
        });
    }

    function setSession(opt) {
        var sUser = store.session('curuser');
        if (sUser) {
            sUser.Setting = _.extend({}, sUser.Setting, opt);
            store.session('curuser', sUser);
        }
    }
});


 