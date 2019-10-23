// 客户端 oidc 授权流程，具体可以看官方文档。（研发部武绍春-20190731）
// https://github.com/IdentityModel/oidc-client-js

// 网上实例：
// https://github.com/maxmantz/redux-oidc
// https://github.com/joaojosefilho/vuejsOidcClient
// https://github.com/perarnborg/vuex-oidc-example


// 1 引入依赖：oidc-client

// 2 添加 oidcConfig 配置文件
var host = window.location.origin;
// 授权服务器地址
var identityServer = "http://192.168.188.101:8000";

var oidcConfig = {
    // 应用的客户端id
    client_id: 'Miaobi_IdentitySystem_clientId',
    //授权后的重定向url
    redirect_uri: host + "/callback",
    //可以获得授权的域
    scope: "openid Miaobi_IdentitySystem_apiResource miaobiidentityresources",
    //授权服务地址
    authority: identityServer,
    // 授权类型 默认 code
    response_type: 'code',
    // 退出时的重定向地址
    post_logout_redirect_uri: host + "/",
    // 静默授权重定向地址
    silent_redirect_uri: host + '/silent-renew',
    // 授权最大时长 20秒
    silentRequestTimeout: 20000,
    // token 过期提前通知时间 10秒 控制台，这个时间不能太短，不然会手动重新登录
    accessTokenExpiringNotificationTime: 10,
    // 是否在过期时自动授权
    automaticSilentRenew: true,
    // 下面这个 react 没用
    dispatchEventsOnWindow: true,
};

// 3 创建oidc 实例
import Oidc, {UserManager} from 'oidc-client';

var mgr = Oidc(oidcConfig);

// 4 登录
mgr.signinRedirect().catch(err => {

});

// 5 重定向页面调用
mgr.signinRedirectCallback().then(function (user) {
    // 在重定向页面，oidc 已操作完登录和授权，这时应用已获得用户的授权信息，可以重定向（转到）想去的页面
    // window.location.href = '../';
}).catch(function (err) {
    console.log(err);
});

// 6 在页面里获取用户信息
mgr.getUser().then(function (user) {
    // user 为授权后的用户信息
}).catch(function (err) {
    console.log(err)
});

// 6 配置路由，加入 【授权后的重定向url】和 【出错后的路由】，也可以是两个 html 文件
// 如果需要添加路由守卫，对路由进行权限控制，可以根据 oidc 实例 获取的后端返回的角色进行。

// 7 请求 api 接口需要，请求头添加 Authorization 格式是   'Bearer ' + user.access_token
config.headers['Authorization'] = 'Bearer ' + user.access_token;

// 8 静默授权，silent-renew 页面调用
new UserManager().signinSilentCallback();

// 9 当token 过期或没有用户相关的信息
if (!user || user.expired) {
    // 清除旧数据后
    if (oidcConfig.silent_redirect_uri) {
        // 静默授权
        mgr.signinSilent().then(user => {
            // 获得新的user
        }).catch(err => {

        })
    }
}
// 10 添加过期事件，当静默授权超时时候，退出然后重新登录
mgr.events.addAccessTokenExpired=function () {
    console.log('AccessToken Expired：', arguments);
    // 首先要清理旧数据
    mgr.signoutRedirect().then(function () {
        console.log('signout redirect');
    }).catch(function (err) {
        console.log(err)
    })
}

