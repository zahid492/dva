//全局变量，接口
var Api = {
    //热点
    hotNews_list: host_hotnews + 'api/hotnews',//上传文件
    hotNews_get: host_hotnews + 'api/hotnews',//获取实体
    hotNews_save: host_hotnews + 'api/hotnews/{id}/update',//添加修改
    hotNews_del: host_hotnews + 'api/hotnews/{id}/delete',//删除
    hotNews_parasList: host_hotnews + 'api/hotnews/parasList', //段落列表
    hotNews_parasEdit: host_hotnews + 'api/hotnews/updateParas', //段落修改
    hotNews_delParas: host_hotnews + 'api/hotnews/{id}/deleteParas',//删除
    //模板
    hotnews_template_list: host_hotnews + 'api/Template/GetList',
    hotnews_template_del: host_hotnews + 'api/Template/Delete',
    hotnews_template_put: host_hotnews + 'api/Template/Update',
    hotnews_template_add: host_hotnews + 'api/Template/Add',
    hotnews_template_get: host_hotnews + 'api/Template/GetOne',
    hotnews_template_test: host_hotnews + 'api/Template/ValidateFormat',


    //模块
    hotnews_module_list: host_hotnews + 'api/Module/GetList',
    hotnews_module_del: host_hotnews + 'api/Module/Delete',
    hotnews_module_put: host_hotnews + 'api/Module/Update',
    hotnews_module_add: host_hotnews + 'api/Module/Add',
    hotnews_module_get: host_hotnews + 'api/Module/GetOne',

    //细分
    hotnews_subdivision_list: host_hotnews + 'api/TopicDataSubType/GetList',
    hotnews_subdivision_del: host_hotnews + 'api/TopicDataSubType/Delete',
    hotnews_subdivision_put: host_hotnews + 'api/TopicDataSubType/Update',
    hotnews_subdivision_add: host_hotnews + 'api/TopicDataSubType/Add',
    hotnews_subdivision_get: host_hotnews + 'api/TopicDataSubType/GetOne',

    //类别
    hotnews_dataType_list: host_hotnews + 'api/TopicDataType/GetList',

    //框架
    hotnews_framework_list: host_hotnews + 'api/Framework/GetList',
    hotnews_framework_del: host_hotnews + 'api/Framework/Delete',
    hotnews_framework_put: host_hotnews + 'api/Framework/Update',
    hotnews_framework_add: host_hotnews + 'api/Framework/Add',
    hotnews_framework_get: host_hotnews + 'api/Framework/GetOne',

    //模板语言
    hotnews_tpl_list: host_hotnews + 'api/TemplateLang/GetList',
    hotnews_tpl_del: host_hotnews + 'api/TemplateLang/Delete',
    hotnews_tpl_put: host_hotnews + 'api/TemplateLang/Update',
    hotnews_tpl_add: host_hotnews + 'api/TemplateLang/Add',
    hotnews_tpl_get: host_hotnews + 'api/TemplateLang/GetOne',

    //标记文章
    hotnews_sign_list: host_hotnews + 'api/TagArticle/getlist',
    hotnews_sign_put: host_hotnews + 'api/TagArticle/tagparas',
    hotnews_sign_get: host_hotnews + 'api/TagArticle/getobj',
    hotnews_sign_put_cut: host_hotnews + 'api/TagArticle/recut',
    hotnews_sign_post: host_hotnews + 'api/TagArticle/add',
    hotnews_sign_del: host_hotnews + 'api/TagArticle/delete',



    //媒体账号
    hotnews_MediaAccount_list: host_hotnews + 'api/MediaAccount/GetList',
    hotnews_MediaAccount_del: host_hotnews + 'api/MediaAccount/Delete',
    hotnews_MediaAccount_put: host_hotnews + 'api/MediaAccount/Update',
    hotnews_MediaAccount_add: host_hotnews + 'api/MediaAccount/Add',
    hotnews_MediaAccount_get: host_hotnews + 'api/MediaAccount/GetOne',

    // 统计：账号平台信息
    statistics_account: host_hotnews + "api/Statistics/getstatisticsaccount",
    statistics_platform: host_hotnews + "api/Statistics/getstatisticsplatForm",
    statistics_export: host_hotnews + "api/Statistics/export",

    // 对应关系：文章分类
    relation_article_add: host_hotnews + "api/DicHotTopicType/add",
    relation_article_delete: host_hotnews + "api/DicHotTopicType/delete",
    relation_article_edit: host_hotnews + "api/DicHotTopicType/edit",
    relation_article_getlist: host_hotnews + "api/DicHotTopicType/getlist",
    relation_article_getone: host_hotnews + "api/DicHotTopicType/getone",

    // 对应关系：发布分类
    relation_publish_add: host_hotnews + "api/DicPublishType/add",
    relation_publish_delete: host_hotnews + "api/DicPublishType/delete",
    relation_publish_edit: host_hotnews + "api/DicPublishType/edit",
    relation_publish_getlist: host_hotnews + "api/DicPublishType/getlist",
    relation_publish_getone: host_hotnews + "api/DicPublishType/getone",

    // 自媒体：平台列表
    mymedia_platform_add: host_hotnews + "api/DicPlatform/add",
    mymedia_platform_delete: host_hotnews + "api/DicPlatform/delete",
    mymedia_platform_edit: host_hotnews + "api/DicPlatform/edit",
    mymedia_platform_getlist: host_hotnews + "api/DicPlatform/getlist",
    mymedia_platform_getone: host_hotnews + "api/DicPlatform/getone",

    // 自媒体：文章列表
    mymedia_article_getlist: host_hotnews + "api/ArticleManage/getlist",
    mymedia_article_export: host_hotnews + "api/ArticleManage/export",

    // 自媒体：账号列表
    mymedia_account_list: host_hotnews + 'api/MiaobiAccount/GetList',
    mymedia_account_get: host_hotnews + "api/MiaobiAccount/GetOne",
    mymedia_account_post: host_hotnews + "api/MiaobiAccount/Add",
    mymedia_account_put: host_hotnews + "api/MiaobiAccount/Update",
    mymedia_account_putStatus: host_hotnews + "api/MiaobiAccount/UpdateStatus/",
    mymedia_account_putInterval: host_hotnews + "api/MiaobiAccount/updateinterval/",
    mymedia_account_putTimes: host_hotnews + "api/MiaobiAccount/updatetimes/",
    mymedia_account_putpublish: host_hotnews + "api/MiaobiAccount/updatepublishstatus/",
    mymedia_account_categorylist: host_hotnews + 'api/TopicDataType/GetList',
};

var user = store.get("oidc_user");

function ApiToUrl(api) {
    var args = [].slice.call(arguments, 0);
    var path = (args[1] === undefined) ? "" : ((args[1].path === undefined) ? "" : args[1].path);
    var query = (args[1] === undefined) ? "" : ((args[1].query === undefined) ? "" : args[1].query);

    if (args.length === 2) {
        return api + path + query;
    }

    return api;
}

if (user) {
    var token = user.access_token;

    $.ajaxSetup({
        headers: {
            "Authorization": 'Bearer ' + token
        }
    })
}

