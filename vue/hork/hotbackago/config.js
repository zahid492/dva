//接口api域名地址 port: 4001
var lhost = window.location.origin;
//妙笔热搜API
var host_hotnews = "http://191.167.20.217:1001/";
var host_media = "http://localhost:3008/";

var identityServer = "http://auth.aimiaobi.com";

var oidcConfig = {
    client_id: 'miaobihotnewsapp_Code',
    redirect_uri: lhost + "/callback.html",
    scope: "openid miaobiidentityresources miaobihotnewsapp_ApiResource",

    authority: identityServer,
    // 默认只有 code. id_token token
    response_type: 'code',
    post_logout_redirect_uri: lhost + "/index.html",
    silent_redirect_uri: lhost + '/silent-renew.html',
    silentRequestTimeout:20000,
    accessTokenExpiringNotificationTime: 20,
    // automaticSilentRenew is handled in vuex and not by user manager
    automaticSilentRenew: true,

    filterProtocolClaims: true,
    loadUserInfo: true
};

var accountPlatForms = ['百家号', '今日头条'];