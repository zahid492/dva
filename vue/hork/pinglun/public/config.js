var host = window.location.origin;
var identityServer = "http://192.168.188.101";

var config = {
    // "host": "http://192.168.220.81",
    // "host": "/resource",
    // "apihost": window.location.origin,
    "apihost": "/api",
    apiPath(){
        return this.apihost;
    },
    "txtSeparator":";",
    "category":["百度企业", "百度领导人", "百度产品", "百度生态", "吉利汽车负面", "百度度小满自身", "北京现代胜达危机监测"],
};

var oidcConfig = {
    client_id: 'Miaobi_Sentiment_Code',
    redirect_uri: host + "/callback",
    scope: "openid Miaobi_Sentiment_ApiResource miaobiidentityresources",

    authority: identityServer,
    // 默认只有 code. id_token token
    response_type: 'code',
    post_logout_redirect_uri: host + "/",
    // silent_redirect_uri: host + '/silent-renew.html',
    dispatchEventsOnWindow: true,
};

