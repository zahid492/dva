var host = window.location.origin;
var identityServer = "http://auth.aimiaobi.rd";

var oidcConfig = {
    client_id: 'Miaobi_IdentitySystem_clientId',
    redirect_uri: host + "/callback",
    scope: "openid Miaobi_IdentitySystem_apiResource miaobiidentityresources",

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

var config = {
    apiPath: "http://191.167.20.222:8888" + "/api/",
};
