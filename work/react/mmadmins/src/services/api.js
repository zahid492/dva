
// 接口地址，从原妙笔后台移动过来
const Api = {
    //热点
    hotNews_list: 'api/hotnews',//上传文件
    hotNews_get: 'api/hotnews',//获取实体
    hotNews_save: 'api/hotnews/{id}/update',//添加修改
    hotNews_del: 'api/hotnews/{id}/delete',//删除
    hotNews_parasList: 'api/hotnews/parasList', //段落列表
    hotNews_parasEdit: 'api/hotnews/updateParas', //段落修改
    hotNews_delParas: 'api/hotnews/{id}/deleteParas',//删除
    //模板
    hotnews_template_list: 'api/Template/GetList',
    hotnews_template_del: 'api/Template/Delete',
    hotnews_template_put: 'api/Template/Update',
    hotnews_template_add: 'api/Template/Add',
    hotnews_template_get: 'api/Template/GetOne',
    hotnews_template_test: 'api/Template/ValidateFormat',


    //模块
    hotnews_module_list: 'api/Module/GetList',
    hotnews_module_del: 'api/Module/Delete',
    hotnews_module_put: 'api/Module/Update',
    hotnews_module_add: 'api/Module/Add',
    hotnews_module_get: 'api/Module/GetOne',

    //细分
    hotnews_subdivision_list: 'api/TopicDataSubType/GetList',
    hotnews_subdivision_del: 'api/TopicDataSubType/Delete',
    hotnews_subdivision_put: 'api/TopicDataSubType/Update',
    hotnews_subdivision_add: 'api/TopicDataSubType/Add',
    hotnews_subdivision_get: 'api/TopicDataSubType/GetOne',

    //类别
    hotnews_dataType_list: 'api/TopicDataType/GetList',

    //框架
    hotnews_framework_list: 'api/Framework/GetList',
    hotnews_framework_del: 'api/Framework/Delete',
    hotnews_framework_put: 'api/Framework/Update',
    hotnews_framework_add: 'api/Framework/Add',
    hotnews_framework_get: 'api/Framework/GetOne',

    //模板语言
    hotnews_tpl_list: 'api/TemplateLang/GetList',
    hotnews_tpl_del: 'api/TemplateLang/Delete',
    hotnews_tpl_put: 'api/TemplateLang/Update',
    hotnews_tpl_add: 'api/TemplateLang/Add',
    hotnews_tpl_get: 'api/TemplateLang/GetOne',

    //标记文章
    hotnews_sign_list: 'api/TagArticle/getlist',
    hotnews_sign_put: 'api/TagArticle/tagparas',
    hotnews_sign_get: 'api/TagArticle/getobj',
    hotnews_sign_put_cut: 'api/TagArticle/recut',
    hotnews_sign_post: 'api/TagArticle/add',
    hotnews_sign_del: 'api/TagArticle/delete',

    //妙笔账号
    hotnews_account_list: 'api/MiaobiAccount/GetList',//获取账号列表
    hotnews_account_get: "api/MiaobiAccount/GetOne",       //获取一条账号数据
    hotnews_account_post: "api/MiaobiAccount/Add",          //添加账号
    hotnews_account_put: "api/MiaobiAccount/Update",      //修改账号
    hotnews_account_putStatus: "api/MiaobiAccount/UpdateStatus/",   //更改账号状态
    hotnews_account_putInterval: "api/MiaobiAccount/updateinterval/",   //更改账号发布频率
    hotnews_account_putTimes: "api/MiaobiAccount/updatetimes/",   //更改账号发布时间段
    hotnews_account_putpublish: "api/MiaobiAccount/updatepublishstatus/",   //更改账号发布时间段

    hotnews_hotnews_categorylist: 'api/TopicDataType/GetList',//获取话题分类列表

    //媒体账号--------------------------
    hotnews_MediaAccount_list: 'api/MediaAccount/GetList',
    hotnews_MediaAccount_del: 'api/MediaAccount/Delete',
    hotnews_MediaAccount_put: 'api/MediaAccount/Update',
    hotnews_MediaAccount_add: 'api/MediaAccount/Add',
    hotnews_MediaAccount_get: 'api/MediaAccount/GetOne',

    // 统计：账号平台信息
    statistics_account: "api/Statistics/getstatisticsaccount",
    statistics_platform: "api/Statistics/getstatisticsplatForm",
    statistics_export: "api/Statistics/export",

    // 对应关系：文章分类
    relation_article_add: "api/DicHotTopicType/add",
    relation_article_delete: "api/DicHotTopicType/delete",
    relation_article_edit: "api/DicHotTopicType/edit",
    relation_article_getlist: "api/DicHotTopicType/getlist",
    relation_article_getone: "api/DicHotTopicType/getone",

    // 对应关系：发布分类
    relation_publish_add: "api/DicPublishType/add",
    relation_publish_delete: "api/DicPublishType/delete",
    relation_publish_edit: "api/DicPublishType/edit",
    relation_publish_getlist: "api/DicPublishType/getlist",
    relation_publish_getone: "api/DicPublishType/getone",

    // 自媒体：平台列表
    mymedia_platform_add: "api/DicPlatform/add",
    mymedia_platform_delete: "api/DicPlatform/delete",
    mymedia_platform_edit: "api/DicPlatform/edit",
    mymedia_platform_getlist: "api/DicPlatform/getlist",
    mymedia_platform_getone: "api/DicPlatform/getone",

    // 自媒体：文章列表
    mymedia_article_getlist: "api/ArticleManage/getlist",
    mymedia_article_export: "api/ArticleManage/export",

    // 自媒体：账号列表
    mymedia_account_list: 'api/MiaobiAccount/GetList',
    mymedia_account_get: "api/MiaobiAccount/GetOne",
    mymedia_account_post: "api/MiaobiAccount/Add",
    mymedia_account_put: "api/MiaobiAccount/Update",
    mymedia_account_putStatus: "api/MiaobiAccount/UpdateStatus/",
    mymedia_account_putNormal: "api/MiaobiAccount/updatenormalstatus/",
    mymedia_account_putInterval: "api/MiaobiAccount/updateinterval/",
    mymedia_account_putTimes: "api/MiaobiAccount/updatetimes/",
    mymedia_account_putpublish: "api/MiaobiAccount/updatepublishstatus/",
    mymedia_account_export: 'api/MiaobiAccount/export',
    mymedia_account_interval: 'api/MiaobiAccount/updateinterval',
    mymedia_account_time: 'api/MiaobiAccount/updatetimes',
    //
    mymedia_account_categorylist: 'api/TopicDataType/GetList',
    // 日志
    logs_type: 'api/Dictionaries/LogType',
    logs_status: 'api/Dictionaries/LogStatus',
    logs_source: 'api/Dictionaries/LogSource',

    logs_getlist: "api/SystemLog/getlist",
    logs_export: "api/SystemLog/export",

    // 监控------20191017
    monitor_basic_get: 'api/MonitorSetting/Get',
    monitor_basic_update: 'api/MonitorSetting/Update',

};

 export default Api;