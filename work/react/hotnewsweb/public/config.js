var API_ROOTS = 'http://191.167.20.217:1001/';
var ROOTS = 'http://wribot.ijiebao.com/';
var IMAGE_ROOTS = 'http://191.167.20.217:6089/images/';

var accountPlatForms = ['百家号', '今日头条', '微信公众号', '妙笔官网'];

var accountPlatformCategorys = {
    '百家号': ['娱乐', '体育', '财经', '人文', '科技', '互联网', '数码', '社会', '汽车', '房产', '旅游', '时尚', '星座', '美食', '生活', '育儿', '影视', '音乐', '动漫', '搞笑', '教育', '文化', '宠物', '游戏', '家居', '摄影', '健康', '养生', '科学', '综合', '其它'],
    '今日头条': ['文娱', '财经', '社会', '互联网', '体育'],
    '微信公众号': [],
    '妙笔官网': [],
};

var host = window.location.origin;
var identityServer = "http://auth.aimiaobi.com";

var OIDCconfig = {
    client_id: 'miaobihotnewsapp_Code',
    redirect_uri: host + "/callback",
    scope: "miaobiidentityresources miaobihotnewsapp_ApiResource openid",

    authority: identityServer,
    // 默认只有 code. id_token token
    response_type: 'code',
    post_logout_redirect_uri: host + "/",
    silent_redirect_uri: host + '/renew',
    silentRequestTimeout:20000,
    accessTokenExpiringNotificationTime: 20,
    // automaticSilentRenew is handled in vuex and not by user manager
    automaticSilentRenew: true,
    dispatchEventsOnWindow: true,
};