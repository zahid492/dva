import 'isomorphic-fetch';
import * as apiUrl from './ApiUrl'; 
import _ from 'lodash'; 
import  * as Util from './Utils'

 
 
// get 操作
function callApi(api, opt) { 
   /* opt = _.omit(opt, ["type"]);
    const token = store.get("accesstoken");
    let qss;
    let tokenstr;  
    if (opt) {
        qss = "&" + qs.stringify(opt)
    } else {
        qss = ""
    }

    qss = qss =='&' ? '' : qss;
    if (!_.isNull(token)) {
        tokenstr = '?accesstoken=' + token ;
    } else {
        tokenstr = "";
    }
    return request.get(api + tokenstr + qss + '&_r=' + Math.random())
        .then((res) => {
            if (res.body.code !== 200) {
                return {error: res.body}
            } else {
                return {response: res.body}
            }
        }).catch(res => {
            return {error: {errmsg:'service error', code: 503}}
        });
*/ 
         
        return new Promise((resolve)=>{
            Util.callData(api,opt).then((res) => { 
            if (res.code !== 200) {
                resolve({error: res})
            } else {
                resolve({response: res})
            }
        }).catch(res => {
            resolve({error: {errmsg:'service error', code : 503}});
        });
    });
        
}

// post 操作
function setApi(api, opt) {
     
    // 核心信息编辑等需要 opt.data
    /*return request.post(api)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(JSON.stringify(opt))
        .then(res => {
            if (res.body.code !== 200) {
                return {error: res.body}
            } else {
                return {response: res.body.data}
            }

        }).catch(res => {
            return {error: {errmsg: 'service error', code: 503}}
        })

*/ 
     
    return new Promise((resolve)=>{
        Util.setData(api,opt).then((res) => {  
        if (res.code !== 200) {
            resolve({error: res})
        } else {
            resolve({response: res.data})
        }
    }).catch(res => {
        resolve({error: {errmsg:'service error', code : 503}});
    });
});

}

// 1 添加文章
export const addArticleApi = (opt) => setApi(apiUrl.AddArticlesUrl, opt);
export const getArticleApi = (opt) => callApi(apiUrl.getArticlesUrl + opt.nid, "");
export const uploadWordApi = (opt) => Util.customRequest(apiUrl.getArticlesUrl+"/uploadword", opt);
//根据链接获取文章
export const getArticleByLink = (opt) => callApi(apiUrl.apiWriteAnalyzeLinkurl,{url:opt.url,imgBase64:opt.imgBase64});


// 2 核心信息提炼，获取,编辑
export const getCoreMessages = (opt) => callApi(apiUrl.articleInfoUrl + opt.nid + '/coreinfo/', '');
export const editCoreMessages = (opt) => setApi(apiUrl.articleInfoUrl + opt.nid + '/coreinfo/edit', opt.data);

// 2 相关名词解释，获取,编辑
export const getNouns = (opt) => callApi(apiUrl.articleInfoUrl + opt.nid + '/subjects', "");
export const editNouns = (opt) => setApi(apiUrl.articleInfoUrl + opt.nid + '/subjects/edit', opt.data);

// 2 相关图片，获取,编辑
export const getCoreImages = (opt) => callApi(apiUrl.articleInfoUrl + opt.nid + '/images', "");
export const editCoreImages = (opt) => setApi(apiUrl.articleInfoUrl + opt.nid + '/images/edit', opt.data);
export const getSysImages = (opt) => callApi(apiUrl.apiImageUrl + 'bysubjectid/' + opt.subjectId, opt.data);
export const getCoreImagesCars = (opt) => callApi(apiUrl.articleInfoUrl + opt.nid + '/imagesubjects', "");

// 2 商品推荐，获取,编辑
export const getGoods = (opt) => callApi(apiUrl.articleInfoUrl + opt.nid + '/goodsrecommend', "");
export const editGoods = (opt) => setApi(apiUrl.articleInfoUrl + opt.nid + '/goodsrecommend/edit', opt.data);

// 2 延伸阅读，获取,编辑
export const getExtRead = (opt) => callApi(apiUrl.articleInfoUrl + opt.nid + '/extendedread', "");
export const editExtRead = (opt) => setApi(apiUrl.articleInfoUrl + opt.nid + '/extendedread/edit', opt.data);

// 3 生成改编文章
export const genNewArticles = (opt) => setApi(apiUrl.newArticlesUrl + opt.nid + '/add', {count: opt.count});
//生成N篇相同文章
export const createNewArticles = (opt) => setApi(apiUrl.newArticlesUrl + 'createnewsbuild', opt);
export const getNewArticles = (opt) => callApi(apiUrl.newArticlesUrl + 'GetPage', opt);

export const getNewArticlesWithID = (opt) => callApi(apiUrl.newArticlesUrl + opt.nid + '/allnewarticleids', opt);

export const getOneArticle = (opt) => callApi(apiUrl.newArticlesUrl + opt.nid + '/' + opt.id, "");

export const editOneArticle = (opt) => setApi(apiUrl.newArticlesUrl + opt.nid + '/' + opt.id + '/edit', opt);
// 导出
export const outArticles = (opt) => setApi(apiUrl.newArticlesUrl + 'export', opt);

//收藏/取消收藏
export const collectArticles = (opt) => setApi(apiUrl.newArticlesUrl + 'Collected/' + opt.id, opt.isCollected);


// 广告 //

// 添加原生广告并生成文章
//export const addAdApi = (opt) => setApi(apiUrl.adUrl + 'add', opt);
//export const getAdApi = (opt) => callApi(apiUrl.adUrl + '/' + opt.id, "");
// 查询热词
//export const hotWordsApi = (opt) => callApi(apiUrl.adUrl + 'hotwords', opt);

export const hotWordsApi = (opt) => callApi(apiUrl.adUrl2 + 'hotnews/list', opt);

// 登录
//export const loginApi = (opt) => setApi(apiUrl.accountUrl + 'login', opt);
//export const accessLoginApi = (opt) => setApi(apiUrl.accountUrl + 'accesslogin', "");
//export const logoutApi = (opt) => setApi(apiUrl.accountUrl + 'logout', {accessToken: opt.accesstoken, mid: opt.mid});

//export const clientInfo = (opt) => setApi(apiUrl.clientUrl + 'byuser');
export const clientInfo = (opt) =>  callApi(apiUrl.apiClientsGetUrl);

export const manuscriptType = (opt) => callApi(apiUrl.apiManuscriptTypeGetUrl,opt);  //稿件类型
// 我的文章
//export const getMyArticlesApi = (opt) => callApi(apiUrl.getArticlesUrl + 'myarticles', opt);
export const getMyArticlesApi = (opt) => callApi(apiUrl.getArticlesUrl + 'allmyarticles', opt);
 
//辅助类信息列表查询
export const EditAssistnewsGet = (opt) => {
    var url = apiUrl.apinewsGetUrl;
    var obj = {};
    if (opt.tabTag === -2) //收藏
    {
        url = apiUrl.newArticlesUrl + 'GetPage';
        obj.ApplyPlatform = -1;
        obj.Collected = 1;
        obj.Index = opt.page;
        obj.Size = opt.size;
        obj.Key = opt.key;
        obj.ClientName = opt.clientName;
        obj.Industry = opt.industry;
    }else if (opt.tabTag === -3)  //标题
    {
        url = apiUrl.apiTitleRules + opt.id;
        obj.key = opt.key;
        obj.page = opt.page;
        obj.limit = opt.size;
        obj.category = opt.TitleCategory;
    }
    else if (opt.tabTag === -7001)  //名词解释
    {
        url = apiUrl.newArticlesUrl + 'RecommendSubjects/' + opt.id;
        obj.key = opt.key;
        obj.page = opt.page;
        obj.size = opt.size;
        obj.ClientName = opt.clientName;
        obj.Industry = opt.industry;
    }
    else if (opt.tabTag === -5)  //原文
    {
        url = apiUrl.getArticlesUrl + 'myarticles';
        obj.ArticleType = opt.ArticleType ? opt.ArticleType : 0;
        obj.WithHtml = 1;
        obj.Key = opt.key;
        obj.Index = opt.page;
        obj.Size = opt.size;
        obj.ClientName = opt.clientName;
        obj.Industry = opt.industry;
    }else if (opt.tabTag === -6)  //全网搜
    {
       url = apiUrl.apinewsGet160Url;
       obj.key = opt.key;
       obj.newarticleid = opt.id;
       obj.page = opt.page;
       obj.size = opt.size;
       obj.engineId  = opt.engineId;

   }else if (opt.tabTag === -7 && (opt.newstype === 6 || opt.newstype === 7))  //素材
   {
        
        url = apiUrl.apinewsGetUrl + '/' +opt.id;      
        obj.newsType = opt.newstype;
        obj.key = opt.key;       
        obj.clientName = opt.clientName;
        obj.Industry = opt.industry;    

  }
    else {          
        obj.newstype = opt.newstype;
        obj.key = opt.key;
        obj.page = opt.page;
        obj.size = opt.size;
        obj.ClientName = opt.clientName;
        obj.Industry = opt.industry;
    }
    return callApi(url, obj)
};

//推荐首尾段查询
export const MaterialnewsGet = (opt) => {
    var url = apiUrl.apinewsGetUrl + '/' +opt.id;
    var obj = {};    
    obj.newsType = opt.newstype;
    obj.key = opt.key;       
    obj.clientName = opt.clientName;
    obj.Industry = opt.industry; 
    obj.page = opt.page;    
    obj.size = opt.size;    

 
    return callApi(url, obj)
};
//全网搜展开内容时，查询单条详细内容
export const EditAssistnewsItemGet = (opt) => callApi(apiUrl.apinewsGetItem160Url, opt);

export const EditAssistnewsAdd = (opt) => setApi(apiUrl.apinewsAddUrl, opt);
export const EditAssistnewsDel = (opt) => setApi(apiUrl.apinewsDelUrl + opt.id, opt);
export const EditAssistnewsImgAdd = (opt) => Util.customRequest(apiUrl.apinewsImgAddUrl, opt);
export const EditAssistnewsImgSubjects = (opt) => callApi(apiUrl.apinewsImgSubjectsUrl, opt);
export const EditAssistnewsImgGet = (opt) => callApi(apiUrl.apinewsImgGetUrl, opt);

export const EditAssistnewsTitleCategorysGet = (opt) => callApi(apiUrl.apiTitleRulesCategorys, opt);

export const EditAssistnewsTitleAdd = (opt) => setApi(apiUrl.apiTitleRulesAdd, opt);

 

//新闻编辑-恢复原文
//export const RevertArticle = (opt) =>{return setApi(apiUrl.newArticlesUrl + 'Revert/' + opt.id)};

// 删除图片
export const imageDel = (opt) =>{return setApi(apiUrl.apiImgDel + opt.id)};

export const imageUpload = (opt) =>{return Util.customRequest(apiUrl.apinewsImgAddUrl, opt)};


export const UserArticleTasksGet = (opt) => callApi(apiUrl.apiArticleTasksUrl, {});
export const UserTaskArticleGet = (opt) => callApi(apiUrl.apiTaskArticleUrl + opt.id, {});

export const Calculation = (opt) =>{return setApi(apiUrl.apiStaticalReportsUrl,opt.articleIds)};   


export const newArticleHandle = (opt) =>{
    if(opt.handleType === 'del')
    {
        let url = apiUrl.newArticlesUrl + 'Delete';
        return setApi(url,opt.newarticleId)
    }else if(opt.handleType === 'copy')
    {
        let url = apiUrl.newArticlesUrl + 'AddOne';
        return setApi(url,opt.articleId)
    }
};   

//推荐首尾段查询
export const ProviderTitlesGet = (opt) => {
    var url = apiUrl.apiProviderTitlesUrl;
    var obj = {};    
    obj.newarticleId = opt.id;
    return callApi(url, obj)
};