//var API_ROOTS = 'http://192.168.210.158:6088/';
//var IMAGE_ROOTS = 'http://192.168.210.158:6089/images/';

var API_ROOTS = 'http://191.167.20.217:6088/';
// var IMAGE_ROOTS = 'http://wribot.ijiebao.com/images/';
var IMAGE_ROOTS = 'http://191.167.20.217:6089/images/';


//var API_ROOTS = 'http://wribot.ijiebao.com/blue/';
var WribotUsers = ['zwwtest','jiebao','xushuang',"huoweina","zhaoruohan"];

var Colors = ["#8EA5B1", "#B8B0AF", "#75B39C", "#FBA5A6", "#7BCECC","#e8b667" ];



var Version = '4.0.0';


var moduals = [{path:'/',title:'文章撰写',tin:'compose'},{path:'/write',title:'文章改写',tin:'write'},{path:'/my',title:'文章管理',tin:'my'}];
 

var webhost = window.location.protocol + '//' + window.location.hostname +  (window.location.port ? (':' + window.location.port) : '') + '/#/';
 
var OIDCconfig = {
    // https://github.com/IdentityModel/oidc-client-js/wiki#configuration
    // 授权中心地址
    authority: "http://auth.aimiaobi.com",
    //authority: "http://191.167.20.222",

    // 授权码模式的client的ClientId
    client_id: "Miaobi_Writer_Code",
    // 登录回调地址,需要在app.aimiaobi.com中注册
    redirect_uri: webhost + "callback",
    // 登出回调地址,需要在app.aimiaobi.com中注册
    post_logout_redirect_uri: webhost + "callback",
    // 访问的域
    // openid,miaobiidentityresources
    // 用来得到 "获取用户的 名字(name),角色名(role),手机号(phone_number),邮箱(email)等" 的权限
    // miaobi_marketing_ApiResource,一般为 {appname}_ApiResource; 
    // 用来得到 "访问 名为 miaobi_marketing_ApiResource 的 api资源"的访问权限
    scope: "openid miaobiidentityresources Miaobi_Writer_ApiResource",
    // 固定为 code
    response_type: "code",
    
    // 静默授权重定向地址
    silent_redirect_uri: webhost + "renew",
    // 授权最大时长 20秒
    silentRequestTimeout: 20000,
    // token 过期提前通知时间 10秒 控制台，这个时间不能太短，不然会手动重新登录
    accessTokenExpiringNotificationTime: 20,
    // 是否在过期时自动授权
    automaticSilentRenew: true,

};





