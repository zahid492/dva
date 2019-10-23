export const API_ROOT = window.API_ROOTS;
export const IMAGE_ROOT = window.IMAGE_ROOTS;
export const platForms =  window.accountPlatForms;
export const categorySource =  window.accountPlatformCategorys;
export const WebUrl = window.host;

// 0 账号
export const startNewsGeneralUrl = API_ROOT+ "api/HotNews/weibotopics";   //给后台指令，触发自动生成文章服务
export const GetArticlesUrl = API_ROOT+ "api/HotNews/getlist";         //查询文章列表
export const CreateNewsUrl = API_ROOT+ "api/HotNews/generatearticle";   //生成文章
export const GetArticleUrl = API_ROOT+ "api/HotNews/getarticle";        //查询一篇文章
export const GetArticleImgsUrl = API_ROOT+ "api/HotNews/getallimage";        //查询一篇文章封面图片待选列表
export const PutArticleUrl = API_ROOT+ "api/HotNews/updatenewarticle";    //更新文章
export const PutArticleCoverImgsUrl = API_ROOT+ "api/HotNews/updateconverimages";    //更新文章封面图片

export const PublishArticleUrl = API_ROOT+ "api/HotNews/publisharticle";    //发布
export const PublishArticleUrl_toutiao = API_ROOT+ "api/HotNews/publishtoutiao";    //发布(头条平台)

export const addArticleByTemplateUrl = API_ROOT+ "api/HotNews/recreatearticle";    //根据模板再次生成一篇文章

export const AddArticleTopicUrl = API_ROOT+ "api/HotNews/addtopic";    //添加话题

export const GetArticleTypesUrl = API_ROOT+ "api/TopicDataType/GetList";    //话题类型列表

export const PutArticleReleasedStatusUrl = API_ROOT+ "api/HotNews/released";    //设置文章是否发送

export const GetWebAccountsUrl = API_ROOT+ "api/MiaobiAccount/GetList";    //获取账号列表
export const GetWebAccountUrl = API_ROOT+ "api/MiaobiAccount/GetOne";       //获取一条账号数据
export const AddWebAccountUrl = API_ROOT+ "api/MiaobiAccount/Add";          //添加账号
export const PutWebAccountUrl = API_ROOT+ "api/MiaobiAccount/Update";       //修改账号
export const PutWebAccountStatusUrl = API_ROOT+ "api/MiaobiAccount/UpdateStatus";   //更改账号状态

export const GetTopicUrl = API_ROOT+ "api/Topic/getlist";        //查询一篇文章
