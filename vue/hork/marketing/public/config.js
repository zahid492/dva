
var host = window.location.origin;
var identityServer = "http://auth.aimiaobi.com";

var config = {
    // apiPath: "http://191.167.20.224:8100/api/",
    // apiPath: "http://39.97.34.85/test/rwff/api/",
    apiPath: "http://api.rwff.aimiaobi.rd/api/"
};

var oidcConfig = {
    client_id: 'miaobi_marketing_Code',
    redirect_uri: host + "/callback",
    scope: "openid miaobi_marketing_ApiResource miaobiidentityresources",

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
//localhost: 5010

