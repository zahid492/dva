export const API_ROOT = window.API_ROOTS;
export const IMAGE_ROOT = window.IMAGE_ROOTS;
export const OIDCConfig = window.OIDCconfig ;

export const SYSIMAGE_PAGESIZE= 5;
export const AD_PAGESIZE= 10;
export const HOTWORDS_PAGESIZE= 5;
export const NEWS_PAGESIZE= 10;

// 0 账号
export const accountUrl = API_ROOT+ "api/account/";
export const clientUrl = API_ROOT+ "api/client/";

// 1 添加文章
export const AddArticlesUrl = API_ROOT+ "api/article/add";
export const getArticlesUrl = API_ROOT+ "api/article/";
// 2 核心信息提炼，获取，编辑
export const articleInfoUrl = API_ROOT+ "api/articleinfo/";

// 3 生成改编文章
export const newArticlesUrl = API_ROOT+ "api/newarticles/"; 

// 1 添加原生广告并生成文章
export const adUrl = API_ROOT+ "api/adarticle/";
export const adUrl2 = API_ROOT + "api/";
export const apiImageUrl =  API_ROOT + 'api/Image/';


// 3 生成借势传播
export const trendUrl = API_ROOT+ "api/hotcombineinfo/";
export const tagsApi = API_ROOT+ "api/Tag/";

 
//----------------
export const HotKeyWordsSize = 100;

export const tagColors =  window.Colors; 

export const apinewsAddUrl =  API_ROOT + 'api/news/add';
export const apinewsDelUrl =  API_ROOT + 'api/news/delete/';
export const apinewsGetUrl =  API_ROOT + 'api/news/get';
//export const apinewsGet160Url =  API_ROOT + 'api/medianet/sentimentdata';
export const apinewsGet160Url =  API_ROOT + 'api/medianet/websearch';  //全网搜
export const apinewsGetItem160Url =  API_ROOT + 'api/medianet/expandnews';  //全网搜展开

 
 

export const apinewsImgGetUrl =  API_ROOT + 'api/Image/byclient';

export const apinewsImgAddUrl =  API_ROOT + 'api/Image/ImgRelation';
export const apinewsImgSubjectsUrl =  API_ROOT + 'api/Subject/byclient';

export const apiNewsCompose = API_ROOT + 'api/article/'
export const apiNewsComposeAdd = API_ROOT + 'api/article/addkeyinfo' 


export const apiTitleRulesCategorys = API_ROOT + 'api/TitleRulesCategory'
export const apiTitleRules = API_ROOT + 'api/TitleRules/suggestion/'
export const apiTitleRulesAdd = API_ROOT + 'api/TitleRules/add'

export const apiProviderTitlesUrl = API_ROOT + 'api/news/RecTitles'

  
export const apiTitleRulesNoSuggestion = API_ROOT + 'api/TitleRules' 

export const apiImgDel =  API_ROOT + "api/Image/del/"


export const apiWriteAnalyzeLinkurl =  API_ROOT + "api/helper/analyzebyurl"

export const apiArticleTasksUrl =  API_ROOT + "api/ArticleTask/GetTaskListByUser"
export const apiTaskArticleUrl =  API_ROOT + "api/ArticleTask/GetArticleInfoFromTaskId/"

export const apiStaticalReportsUrl =  API_ROOT + "api/StaticalReport/RefreshStaticalReports"



export const apiArticleCompareSimilarUrl =  API_ROOT + "api/news/SimSentence";
export const apiArticleCompareSimilarSentenceUrl =  API_ROOT + "api/news/SimParagraph";
export const apiArticleCompareSimilarArticleUrl =  API_ROOT + "api/seo/AllSimilarTerms";


export const apiseoArticleEditCheckedSentenceUrl =  API_ROOT + "api/seo/ChangeChecked";
export const apiseoArticleEditchdSentenceUrl =  API_ROOT + "api/seo/ChangeTermsLog";

export const apiseoArticleEditGetSentenceDataUrl =  API_ROOT + "api/seo/GetObj";

//export const apiseoArticleEditGetSentenceData_newUrl =  API_ROOT + "api/seo/GetSimilarTermsList";
export const apiseoArticleEditGetSeoWordsUrl =  API_ROOT + "api/seoWords/GetWordsSynon";
export const apiseoArticleEditEditSentenceUrl =  API_ROOT + "api/seo/EditSentence/";
export const apiseoArticleEditSentencLogeUrl =  API_ROOT + "api/seo/wordschangelog";  //停止使用
export const apiseoArticleEditSentenceLogUrl =  API_ROOT + "api/seo/ChangeTermsLog";
export const apiseoArticleEditHitRateUrl =  API_ROOT + "api/seo/HitRateById";




export const apiseoArticleEditGetCutSentenceUrl =  API_ROOT + "api/seo/GetCutSentence"; /* 获取一个句子的切词替换结果 */

export const apiseoArticleEditSentenceDelUrl =  API_ROOT + "api/seo/DeleteSentence";

export const apiseoArticleHitRateUrl =  API_ROOT + "api/seo/HitRateByArticle";

export const apiComposeArticleChangeUrl =  API_ROOT + "api/newarticles/GenerateNewsBuild"; 

export const apiseoArticleEditGetRPSentenceUrl =  API_ROOT + "api/seo/GetReplaceSentence"; /* 获取一个句子的切词替换结果 */

 
  


//稿件类型列表
export const apiManuscriptTypeGetUrl =  API_ROOT + "api/StructArticleType/getlist";

//根据稿件类型查询出模板类型
export const apimoduleTypeGetUrl =  API_ROOT + "api/TemplateType/getlist";

//查询模板数据列表
export const apimoduleDatasGetUrl =  API_ROOT + "api/Template/getlist";

//删除模板
export const apimoduleDataDelUrl =  API_ROOT + "api/Template/delete";
//新增模板
export const apimoduleDataAddUrl =  API_ROOT + "api/Template/add";

//修改模板
export const apimoduleDataEditUrl =  API_ROOT + "api/Template/edit";


//单条模板获取
export const apimoduleDataGetUrl =  API_ROOT + "api/Template/getobj/{id}";

//根据稿件类型获取模块
export const apiMKDatasGetUrl =  API_ROOT + "api/Module/getlistbytype/{type}";

//模块新增
export const apiMKDataAddUrl =  API_ROOT + "api/Module/add";
//模块删除
export const apiMKDataDelUrl =  API_ROOT + "api/Module/delete";



export const apiClientsGetUrl =  API_ROOT + "api/client/getclients";     //查询客户带细分

export const apiClientsWithIndustryGetUrl =  API_ROOT + "api/client";   //查询客户带行业

export const apiStructArticleGetUrl =  API_ROOT + "api/StructArticle/getobj/{id}";

export const apimoduleDataSetLikesUrl =  API_ROOT + "api/Template/setlikes";


export const apiArticleNWListUrl =  API_ROOT + "api/structnews/getlist";

export const apiArticleMaterialListUrl =  API_ROOT + "api/structnews/getlistbysearch";


export const apiArticleToNewModuleUrl =  API_ROOT + "api/Module/GetNewList";

export const apiStructArticleSaveUrl =  API_ROOT + "api/StructArticle/edit/{id}";
export const apiStructAddUrl =  API_ROOT + "api/StructArticle/add";
export const apiStructsAddUrl =  API_ROOT + "api/StructArticle/addlist/{count}";

export const apiStructArticleToSeoUrl =  API_ROOT + "api/StructArticle/createseo/{order}";


export const apiStructArticleToStructUrl =  API_ROOT + "api/StructArticle/createstruct/{id}";

export const apiStructArticleListUrl =  API_ROOT + "api/StructArticle/getlist";

export const apiStructArticleSecondListUrl =  API_ROOT + "api/StructArticle/getlistbyparent";



export const apimoduleDatasByidsGetUrl =  API_ROOT + "api/Module/getlistbyids";










 


