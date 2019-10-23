
var host = window.location.origin;
var identityServer = "http://auth.aimiaobi.com";

var config = {
    apiPath: "http://191.167.20.217:1001/"
};

var host_media = "http://localhost:3008/";

var oidcConfig = {
    client_id: 'miaobihotnewsapp_Code',
    redirect_uri: host + "/callback",
    scope: "openid miaobiidentityresources miaobihotnewsapp_ApiResource",

    authority: identityServer,
    // 默认只有 code. id_token token
    response_type: 'code',
    post_logout_redirect_uri: host + "/",
    silent_redirect_uri: host + '/silent-renew',
    silentRequestTimeout:20000,
    accessTokenExpiringNotificationTime: 20,
    // automaticSilentRenew is handled in vuex and not by user manager
    automaticSilentRenew: true,
    dispatchEventsOnWindow: true,
};
var accountPlatForms = ['百家号', '今日头条'];
//localhost: 4000

