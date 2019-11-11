// 整体配置文件
// 2 屏预览
var twoPreview = url("?preview") == 1;

// 4 屏预览
var ids4 = url("?dataids");
var fileids4 = url("?fileids");
var fourqs = false;
var qs4 = "";

if (!_.isUndefined(ids4)) {
    qs4 = '?dataids=' + (ids4.length > 0 ? ids4 : "")
}

if (!_.isUndefined(fileids4)) {
    if (qs4 === "") {
        qs4 += '?fileids=' + (fileids4.length > 0 ? fileids4 : "");
    } else {
        qs4 += '&fileids=' + (fileids4.length > 0 ? fileids4 : "");
    }
}

fourqs = (ids4 && ids4.length > 0) || (fileids4 && fileids4.length > 0);
// themes[config.theme].
export const themes = {
    default: {
        // 1屏词云颜色
        tagColor: ["#ff687d", "#80f9b7", "#ffde5b", "#00f6ff", "#6399dd", "#ed7325", "#a964fe"],
        tagFillColor:"#485dad",
        mapStroke: "#506EDC",
        mapFill:"#0A1646",
        mapIndicatorStop1:"#fa5100",
        mapIndicatorStop2:"#f9d600",
        mapCurrentRadialStop2:"rgba(255,142,0,0.1)",
        mapCityNameTop5: "#fff",
        mapCityName: "#9A9FC5",
        mapCityCircleNum: "#fff",
        // 2屏首页 top 数字颜色
        en2num: ["first", "second", "third", "fourth", "fifth"],
        // 2屏首页 topfive
        colorSeq: ["#fdbd00", "#d7dbde", "#e0ab08"],
        // 2屏首页 徽章
        medalImg: ["gold-medal.png", "silver-medal.png", "bronze-medal.png", "medal.png"],
        // 2屏 图表渐变颜色
        color2Line2: [
            [
                "#f64848", "#f095ff"
            ],
            [
                "#d278f2", "#fcc989"
            ],
            [
                "#fe9c88", "#f5d961"
            ],
            [
                "#80f9b7", "#9abdeb"
            ],
            [
                "#64a1ff", "#8bfcfe"
            ],
            [
                "#f64848", "#f095ff"
            ],
            [
                "#fe9c88", "#f5d961"
            ],
            ["#D4FB7A", "#94E79F"]
        ],
        // 2-1 右侧图例，图示文字颜色， 及坐标刻度颜色
        legend21TextColor: "#fff",
        // 2-1 右侧图例，图示
        legend21Img:["img/line1.png","img/line2.png","img/line3.png","img/line4.png","img/line5.png","img/line6.png"],
        // 2-1 右侧图区域渐变下终止色
        color21AreaStopColor:'rgba(84,199,252, 0.1)',
        // 2-2 area2 阴影颜色
        shadowColorArea2:'rgba(84,199,252, 0.2)',
        // 2-2 line5 tooltip
        line5ToolTipBgColor:'rgba(50,50,50,0.7)',
        line5ToolTipColor: "#fff",
        // 2-2 环图 4
        cycleCtrColor1:"#FF9782",
        cycleCtrColor2:"#F9D34C",
        cycleCvrColor1:"#90BEED",
        cycleCvrColor2:"#48F8B6",
        cyclePercent:"#fff",
        cycleRest:"#1D3569",
        // 3屏渐变 bar3
        color2Line3: [
            [
                "#f64848", "#f095ff"
            ],
            [
                "#d278f2", "#fcc989"
            ],
            [
                "#fe9c88", "#f5d961"
            ],
            [
                "#80f9b7", "#9abdeb"
            ],
            [
                "#64a1ff", "#8bfcfe"
            ],
            [
                "#f64848", "#f095ff"
            ],
            [
                "#fe9c88", "#f5d961"
            ],
            ["#D4FB7A", "#94E79F"]
        ],
        // 3屏渐变 bar3，trend
        color3Line: [
            [
                "#f64848", "#f095ff"
            ],
            [
                "#fe9c88", "#f5d961"
            ],
            ["#64a1ff", "#8bfcfe"]
        ],
        // 3 trend3 区域渐变下终止色
        trend3StopColor:'rgba(44,58,107, 0.1)',
        // 3 bar3 split-line color
        bar3SplitLineColor:'#44537C',
        // 4 pie
        cycleCvr4Color1:"#e8c3fd",
        cycleCvr4Color2:"#9abdeb",
        // 5屏渐变
        color2Line5: [
            [
                "#f64848", "#f095ff"
            ],
            [
                "#d278f2", "#fcc989"
            ],
            [
                "#fe9c88", "#f5d961"
            ],
            [
                "#80f9b7", "#9abdeb"
            ],
            [
                "#64a1ff", "#8bfcfe"
            ],
            [
                "#f64848", "#f095ff"
            ],
            [
                "#fe9c88", "#f5d961"
            ],
            ["#D4FB7A", "#94E79F"]
        ],
        // 所有 xy轴颜色
        xyLineColor: '#445478',

        // 3 曝光趋势(近7日）
        icon3: [1, 3, 5]
    }
};


//export const const imghost = 'http://shudong.oa.com/api/';
//export const const apihost = {
//     visual:'http://shudong.oa.com/api/',
//     tmap: 'http://shudong.oa.com/api/',
//     snk: 'http://snk.oa.com/',
//     jiebao: 'http://jiebao.oa.com/'
// };

// export const imghost = 'http://sdadmin.qq.com/api/';
// export const apihost = {
//     // 腾讯可视化 // 地图数据
//     visual: 'http://sdadmin.qq.com/api/',
//     tmap: 'http://sdadmin.qq.com/api/',
//     // snk
//     snk: 'http://shudong.snkad.com.cn:62814/',
//     // snk: 'http://snk.oa.com/',
//     // jiebao // 3 主流媒体近期舆情
//     jiebao: 'http://tvq.ijiebao.com/'
// };

export const imghost = 'http://api.tencentvisual.com/';
export const apihost = {
    // 腾讯可视化 // 地图数据
    visual: 'http://api.tencentvisual.com/',
    tmap: 'http://api.tencentvisual.com/',
    // visual: 'http://sdadmin.qq.com/api/',
    // tmap: 'http://sdadmin.qq.com/api/',
    // snk
    snk: 'http://api.snk.com/',
    // snk: 'http://116.7.225.92:62814/',
    // jiebao // 3 主流媒体近期舆情
    jiebao: 'http://jiebao.api.com/',
    // jiebao: 'http://tvq.ijiebao.com/',
};
export let api = {
    //登录页面
    login: apihost.visual + "login",
    //accessToken登录页面
    accesslogin: apihost.visual + "accesslogin",
    //退出登录
    logout: apihost.visual + "logout",
    // 配置查询
    configure: apihost.visual + "configure",
    // 游戏播放配置
    pagetimesetting: apihost.visual + "pagetimesetting",
    //1 词云：查询广告曝光之媒体分布接口
    mediaImpressionsList: apihost.snk + "statistics/mediaimpressionslist",
    //1 腾讯游戏新进用户分布
    registers: apihost.visual + "gamestatistics/registers",
    //1 腾讯游戏新进用户分布2
    tencentCitys: apihost.tmap + "stat/location_rank",
    // 测试数据
    tencentCitysTest: apihost.visual + "stat",
    //1 省会城市
    capitals: apihost.visual + "capitals",
    //1 广告点击与曝光
    adImpressionsClicks: apihost.snk + "statistics/adimpressionsclicks",
    //2 查询曝光量前五的游戏接口
    topFiveImpressionsGame: apihost.snk + "statistics/topfiveimpressionsgame",
    //2 查询对应的游戏logo
    gameLogo: apihost.visual + "gamestatistics/gamelogo",
    //3 曝光量 top3
    topThreeImpressionsMedia: apihost.snk + "statistics/topthreeimpressionsmedia",
    //3 主流媒体近期舆情
    mediaNearSentiments: apihost.jiebao + "mediastatistics/medianearsentiments",
    //2 根据游戏名称查询优秀素材,微信指数，appstore榜单
    trend: apihost.jiebao + "gamestatistics/trend",
    //2 游戏信息
    info: apihost.visual + "gamestatistics/info" + (fourqs ? qs4 : "") + (twoPreview ? "&preview=1" : ""),
    //4 优秀广告素材展示
    excellentAdSources: apihost.visual + "gamestatistics/excellentadsources" + (fourqs ? qs4 : ""),
    //第五屏新闻发布情况总览
    newsPublishOverview: apihost.visual + "mediastatistics/newspublishoverview",
    //第五屏一月游戏产品新闻发布一览
    gameNewsStatisticsByMonth: apihost.visual + "mediastatistics/gamenewsstatisticsbymonth",
    //第五屏新闻发布案例
    newsPublishCases: apihost.visual + "mediastatistics/newspublishcases"
};

export const configs = {
    // 确定是否要用假数据
    debug: true,
    // 前端读的配置
    "name": null,
    // 最多显示，这个后台更改后影响返回数据，但前台要每隔时间获取更新数据
    "wordcloud_size": 30,
    // 曝光量大于
    "wordcloud_gt_exposures": 0,
    //2 详情展示规则：默认曝光排名展示
    "game_show_rule": 0,
    //2 固定游戏展示，最多5款游戏 []
    "game_show_names": null,
    //3 媒体舆情 页面展示条码，多余15分页
    "media_sentiment_size": 15,
    //3 轮播间隔
    "media_sentiment_interval": 5,
    //3 时间倒序
    "media_sentiment_order": 0,

    // 第4屏视频播放次数
    "video_loops": 1,
    //  图片停留时间
    "img_stays": 10,
    // 2 优秀广告 和4所有
    "material_source_publish": 0,
    // 5 发布案例
    "publishcase_publish": 0,
    // 5 其他两个一起
    "publishdata_publish": 0,
    // 自定义
    // updateDay: 3600 * 24,
    updateDay: 300,
    updateMinute: 60,
    updateConfig: 30,
    // 版本提示切换
    appStoreDelay: 2,
    // 所有 psw sw 切换时间
    picSpeed: 800,
    // 1 地图更新时间，单位秒
    mapChangeTime: 600,
    // mapChangeTime: 30,
    // 地图刷新时间
    // mapReloadTime: 1820,
    mapReloadTime: 1230,
    // 1 地图取前 100 数据
    mapCount: 320,
    // 1 显示全部省会城市
    capitals: true,
    // 2屏1到2转换时间
    delay1to2: 5000,
    // 2 psw 停留时间 10000
    delayslide: 10000,
    // 2 进度
    delayProcess: 1000,
    // 3 媒体舆情 10分钟一次
    mediaSentiment: 600,
    // 只有当skip = true 时候起作用。当 skip = false 是默认播放无控制。
    maxTime: 7200,
    "first_time": 10,
    // 第二屏第一页展示时间，单位秒
    "second_time": 3,
    // 第二屏选中 0具体页游戏展示时间, 1 每次素材个数 （同样有4的问题，所有播放完跳）
    "second_checked": 0,
    // 第二屏具体页展示时间，单位秒
    "seconddetail_time": 8,
    // 第二屏具体素材个数 // 每个游戏播放n个数量素材，然后进入下个游戏，到最后游戏进入下页。再次进入页面播放后n个素材。
    "seconddetail_material_count": 2,
    // 第三屏展示时间，单位秒
    "three_time": 5,
    // 第四屏选中  0页面展示时间（极端情况，不知道总时间，但所有播放完毕再跳，缺播放完直接跳） 1媒体展示 2游戏展示
    "four_checked": 2,
    // 第四屏展示时间，单位秒
    "four_time": 15,
    // 第四屏媒体展示时间，单位秒
    "four_meidia_time": 15,
    // 第四屏游戏展示数量
    "four_game_time": 2,
    // 第五屏选中  0展示时间 1案例个数 （同样有4的问题，所有播放完跳）
    "five_checked": 0,
    // 第五屏展示时间，单位秒
    "five_time": 5,
    // 第五屏案例个数
    "five_case_count": 2,
    // 主题
    "theme": "default"
};

export const skips = {
    "1": "first.html",
    "2": "second.html",
    "3": "third.html",
    "4": "fourth.html",
    "5": "fifth.html",
};

export const title = {
    first: "树洞可视化平台—腾讯游戏推广效果概览",
    second: "树洞可视化平台—游戏营销效果",
    third: "树洞可视化平台—网站营销效果",
    fourth: "树洞可视化平台—优秀广告素材",
    fifth: "树洞可视化平台—传播资源概览",
};

export const nanhai = ["三沙市", "南沙群岛"];