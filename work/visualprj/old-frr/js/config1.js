// 整体配置文件
// 2 屏预览
var twoPreview = url("?preview")==1;

// 4 屏预览
var ids4 = url("?dataids");
var fileids4 = url("?fileids");
var fourqs = false;
var qs4 = "";

if(!_.isUndefined(ids4)){
    qs4 = '?dataids=' + (ids4.length>0 ? ids4:"")
}

if(!_.isUndefined(fileids4)){
    if(qs4===""){
        qs4 += '?fileids=' + (fileids4.length>0 ? fileids4:"");
    }else{
        qs4 += '&fileids=' + (fileids4.length>0 ? fileids4:"");
    }
}

fourqs = (ids4 && ids4.length>0) || (fileids4 && fileids4.length>0);

var imghost = 'http://api.tencentvisual.com/';
var apihost = {
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

var api = {
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
    tencentCitys: apihost.visual + "stat/location_rank",
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
    info: apihost.visual + "gamestatistics/info" + (fourqs?qs4:"") + (twoPreview ? "&preview=1":""),
    //4 优秀广告素材展示
    excellentAdSources: apihost.visual + "gamestatistics/excellentadsources" + (fourqs?qs4:""),
    //第五屏新闻发布情况总览
    newsPublishOverview: apihost.visual + "mediastatistics/newspublishoverview",
    //第五屏一月游戏产品新闻发布一览
    gameNewsStatisticsByMonth: apihost.visual + "mediastatistics/gamenewsstatisticsbymonth",
    //第五屏新闻发布案例
    newsPublishCases: apihost.visual + "mediastatistics/newspublishcases"
};

var config = {
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
    updateConfig: 9920,
    // 版本提示切换
    appStoreDelay: 2,
    // 所有 psw sw 切换时间
    picSpeed: 800,
    // 1 地图更新时间，单位秒
    mapChangeTime: 3210,
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
    "second_time": 5,
    // 第二屏选中 0具体页游戏展示时间, 1 每次素材个数 （同样有4的问题，所有播放完跳）
    "second_checked": 0,
    // 第二屏具体页展示时间，单位秒
    "seconddetail_time": 12,
    // 第二屏具体素材个数 // 每个游戏播放n个数量素材，然后进入下个游戏，到最后游戏进入下页。再次进入页面播放后n个素材。
    "seconddetail_material_count": 2,
    // 第三屏展示时间，单位秒
    "three_time": 5,
    // 第四屏选中  0页面展示时间（极端情况，不知道总时间，但所有播放完毕再跳，缺播放完直接跳） 1媒体展示 2游戏展示
    "four_checked": 1,
    // 第四屏展示时间，单位秒
    "four_time": 120,
    // 第四屏媒体展示时间，单位秒
    "four_meidia_time": 30,
    // 第四屏游戏展示数量
    "four_game_time": 3,
    // 第五屏选中  0展示时间 1案例个数 （同样有4的问题，所有播放完跳）
    "five_checked": 0,
    // 第五屏展示时间，单位秒
    "five_time": 5,
    // 第五屏案例个数
    "five_case_count": 2,
};

var skips = {
    "1":"first.html",
    "2":"second.html",
    "3":"third.html",
    "4":"fourth.html",
    "5":"fifth.html",
};

var title = {
    first: "树洞可视化平台—腾讯游戏推广效果概览",
    second: "树洞可视化平台—游戏营销效果",
    third: "树洞可视化平台—媒体营销效果",
    fourth: "树洞可视化平台—优秀广告素材",
    fifth: "树洞可视化平台—媒体资源概览",
};

var tagColor = ["#ff687d", "#80f9b7", "#ffde5b", "#00f6ff", "#6399dd", "#ed7325", "#a964fe"];
var en2num = ["first", "second", "third", "fourth", "fifth"];
// 第二屏首页 top 数字颜色
var colorSeq = ["#fdbd00", "#d7dbde", "#e0ab08"];
// 第二屏首页 徽章
var medalImg = ["gold-medal.png", "silver-medal.png", "bronze-medal.png", "medal.png"];
// 第二屏 图表渐变颜色
var color2Line = [
    [
        "#f095ff", "#f64848"
    ],
    [
        "#d278f2", "#fcc989"
    ],
    [
        "#f5d961", "#fe9c88"
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
];

var xyLineColor = '#445478';

var color3Line = [
    [
         "#f64848", "#f095ff"
    ],
    [
       "#fe9c88",  "#f5d961"
    ],
    ["#64a1ff", "#8bfcfe"]
];
// 3 曝光趋势(近7日）
var icon3 = [1, 3, 5];

var nanhai = ["三沙市", "南沙群岛"];