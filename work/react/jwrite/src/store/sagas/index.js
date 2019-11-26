/* eslint-disable no-constant-condition */
import {take, put, call, fork, select, all, takeEvery} from 'redux-saga/effects'
//import createHistory from 'history/createBrowserHistory'
import _ from 'lodash'
import store from 'store2'
import * as apiUrl from '@/services/ApiUrl';
import * as actions from '@/store/actions'
import * as newsApi from '@/services/newsApi'
import * as selector from '@/store/reducers/selectors'

//const history = createHistory();

function* fetchEntity(action, apiFn, opt) {
    yield put(action.request());
    const {response, error} = yield call(apiFn, opt);
    if (response)
        yield put(action.success(opt, response));
    else
        yield put(action.failure(opt, error))
}

 

// client
function* clientInfo() {
    // 选择操作参数， 调用选择器
    const opt = yield take(actions.clientTypes["REQUEST"]);
    // 操作条件判断

    // 进行操作
    yield call(fetchEntity.bind(null, actions.clientInfo, newsApi.clientInfo, opt))

}
// 稿件类型
function* Manuscript() {
    // 选择操作参数， 调用选择器
    const opt = yield take(actions.manuscriptTypes["REQUEST"]);
    // 操作条件判断

    // 进行操作
    yield call(fetchEntity.bind(null, actions.manuscript, newsApi.manuscriptType, opt))

}

function* loadclientInfo() {
    while (true) {
        yield call(clientInfo)
    }
}

function* loadManuscript() {
    while (true) {
        yield call(Manuscript)
    }
}

// 1 添加文章
function* addArticleGen(action, apiFn) {
    const opt = yield take(actions.LOAD_AddArticle);

    const {response, error} = yield call(apiFn, opt);


    if (response) {
        yield put(action.success(opt, response));
    } else {
        yield put(action.failure(opt, error))
    }
}

export const sendAddArticleGen = addArticleGen.bind(null, actions.addArticle, newsApi.addArticleApi);

function* sendAddArticle() {
    while (true) {
        yield call(sendAddArticleGen)
    }
}

// 2 查询文章
function* loadArticle() {
    // 选择操作参数， 调用选择器
    const opt = yield take(actions.LOAD_Article);
    const data = yield select(selector.selectArticle);
    // 操作条件判断

    // 进行操作
    yield call(fetchEntity.bind(null, actions.article, newsApi.getArticleApi, opt))

}

function* watchArticle() {
    while (true) {
        yield call(loadArticle)
    }
}

// 2 核心信息提炼，获取编辑添加
function* loadCoreMessages() {
    // 选择操作参数， 调用选择器
    const opt = yield take(actions.LOAD_CoreMessages);
    const data = yield select(selector.selectCoreMessages);
    // 操作条件判断

    // 进行操作
    yield call(fetchEntity.bind(null, actions.coreMessages, newsApi.getCoreMessages, opt))

}

function* watchCoreMessages() {
    while (true) {
        yield call(loadCoreMessages)
    }
}

function* sendEditCM(action, apiFn) {
    const opt = yield take(action.request().type);
    // 发送请求 action
    const {response, error} = yield call(apiFn, opt);

    if (response >= 1) {
        // 成功 action
        yield put(action.success(opt));

        yield call(fetchEntity.bind(null, actions.coreMessages, newsApi.getCoreMessages, opt))

    } else {
        // 失败 action
        yield put(action.failure(opt, error))
    }
}

export const sendCoreMessages = sendEditCM.bind(null, actions.cMEdit, newsApi.editCoreMessages);

function* editCMessages() {
    while (true) {
        yield call(sendCoreMessages)
    }
}

// 2 相关名词解释，获取
function* loadNouns() {
    const opt = yield take(actions.LOAD_Nouns);
    const data = yield select(selector.selectNouns);


    yield call(fetchEntity.bind(null, actions.nouns, newsApi.getNouns, opt))

}

function* watchNouns() {
    while (true) {
        yield call(loadNouns)
    }
}

function* sendEditNouns(action, apiFn) {
    const opt = yield take(action.request().type);
    const {response, error} = yield call(apiFn, opt);

    if (response >= 1) {
        yield put(action.success(opt));
        yield call(fetchEntity.bind(null, actions.nouns, newsApi.getNouns, opt))

    } else {
        yield put(action.failure(opt, error))
    }
}

export const sendNouns = sendEditNouns.bind(null, actions.nounsEdit, newsApi.editNouns);

function* editNouns() {
    while (true) {
        yield call(sendNouns)
    }
}

// 2 相关图片，获取
function* loadCoreImages() {
    const opt = yield take(actions.LOAD_CoreImages);
    const data = yield select(selector.selectCoreImages);


    yield call(fetchEntity.bind(null, actions.coreImages, newsApi.getCoreImages, opt))

}

function* watchCoreImages() {
    while (true) {
        yield call(loadCoreImages)
    }
}

//选择图片时换一换选择的汽车品牌列表
function* loadCoreImagesCars() {
    const opt = yield take(actions.LOAD_CoreImagesCars);
    const data = yield select(selector.selectCoreImagesCars);


    yield call(fetchEntity.bind(null, actions.coreImagesCars, newsApi.getCoreImagesCars, opt))

}

function* watchCoreImagesCars() {
    while (true) {
        yield call(loadCoreImagesCars)
    }
}


function* loadSysImages() {
    let opt = yield take(actions.LOAD_SysImages);
    let oldpage = store.session("syspage");
    const data = yield select(selector.selectSysImages);
    opt = _.extend({index: 1, size: apiUrl.SYSIMAGE_PAGESIZE}, opt);

    if (data.length === 0 || oldpage != opt.index) {
        yield call(fetchEntity.bind(null, actions.sysImages, newsApi.getSysImages, opt))
    }
}

function* watchSysImages() {
    while (true) {
        yield call(loadSysImages)
    }
}

// edit
function* sendEditCoreImages(action, apiFn) {
    const opt = yield take(action.request().type);
    opt.data = _.map(opt.data, (v) => {
        return v.rid
    });
    const {response, error} = yield call(apiFn, opt);

    if (response >= 1) {
        yield put(action.success(opt));
        // yield put(actions.loadCoreImages(opt));
        yield call(fetchEntity.bind(null, actions.coreImages, newsApi.getCoreImages, opt))

    } else {
        yield put(action.failure(opt, error))
    }
}


export const sendCoreImages = sendEditCoreImages.bind(null, actions.coreImagesEdit, newsApi.editCoreImages);

function* editCoreImages() {
    while (true) {
        yield call(sendCoreImages)
    }
}

// 2 商品，获取
function* loadGoods() {
    const opt = yield take(actions.LOAD_Goods);
    const data = yield select(selector.selectGoods);

    yield call(fetchEntity.bind(null, actions.goods, newsApi.getGoods, opt))
}

function* watchGoods() {
    while (true) {
        yield call(loadGoods)
    }
}

function* sendEditGoods(action, apiFn) {
    const opt = yield take(action.request().type);
    const {response, error} = yield call(apiFn, opt);

    if (response >= 1) {
        yield put(action.success(opt));
        // yield put(actions.loadGoods(opt));
        yield call(fetchEntity.bind(null, actions.goods, newsApi.getGoods, opt))
    } else {
        yield put(action.failure(opt, error))
    }
}

export const sendGoods = sendEditGoods.bind(null, actions.goodsEdit, newsApi.editGoods);

function* editGoods() {
    while (true) {
        yield call(sendGoods)
    }
}

// goods loc

function* sendEditLocGoods(action) {
    // const opt = yield take(actions.GoodsEditLocTypes);
    const opt = yield take(action.request().type);

    yield put(action.success(opt));
    // 不发请求，只改数据，最后一起发
}

export const sendGoodsLoc = sendEditLocGoods.bind(null, actions.goodsEditLoc);

function* editGoodsLoc() {
    while (true) {
        yield call(sendGoodsLoc)
    }
}


// 2 延伸阅读，获取
function* loadExtRead() {
    const opt = yield take(actions.LOAD_ExtRead);
    const data = yield select(selector.selectExtRead);

    yield call(fetchEntity.bind(null, actions.extRead, newsApi.getExtRead, opt))

}

function* watchExtRead() {
    while (true) {
        yield call(loadExtRead)
    }
}

function* sendEditExtRead(action, apiFn) {
    const opt = yield take(action.request().type);
    const {response, error} = yield call(apiFn, opt);

    if (response >= 1) {
        yield put(action.success(opt));
        // yield put(actions.loadExtRead(opt));
        yield call(fetchEntity.bind(null, actions.extRead, newsApi.getExtRead, opt))

    } else {
        yield put(action.failure(opt, error))
    }
}

export const sendExtRead = sendEditExtRead.bind(null, actions.extReadEdit, newsApi.editExtRead);

function* editExtRead() {
    while (true) {
        yield call(sendExtRead)
    }
}

// 3 生成改编文章
function* genNewArticle() {
    const opt = yield take(actions.genNewArticles.request().type);
    const {response, error} = yield call(newsApi.genNewArticles, opt);

    if (response) {
        yield put(actions.genNewArticles.success(opt, response));

    } else {
        yield put(actions.genNewArticles.failure(opt, error))
    }
}

function* watchGenNewArticles() {
    while (true) {
        yield call(genNewArticle)
    }
}

// 3 加载所有生成文章
function* loadNewArticles() {
    let opt = yield take(actions.LOAD_NewArticles);
    opt = _.extend({index: 1, size: apiUrl.AD_PAGESIZE}, opt);

    yield call(fetchEntity.bind(null, actions.newArticles, newsApi.getNewArticles, opt));
}

function* watchLoadNewArticles() {
    while (true) {
        yield call(loadNewArticles)
    }
}
// 3 加载所有生成文章,文章属性只包含id
function* loadNewArticlesWithId() {
    let opt = yield take(actions.LOAD_NewArticles_id);
    opt = _.extend({index: 1, size: apiUrl.AD_PAGESIZE}, opt);
    yield call(fetchEntity.bind(null, actions.newArticleswithid, newsApi.getNewArticlesWithID, opt));

}

function* watchLoadNewArticlesWithID() {
    while (true) {
        yield call(loadNewArticlesWithId)
    }
}
// 3 查询单个文章
function* loadOneArticle() {
    let opt = yield take(actions.LOAD_OneArticle);
    const one = yield select(selector.selectOneArticle)
    if (one._id !== opt.id) {
        //yield call(fetchEntity.bind(null, actions.oneArticle, newsApi.getOneArticle, opt));
        const {response, error} = yield call(newsApi.getOneArticle, opt);
        if (response)
        {      
            yield put(actions.oneArticle.success(opt, response));
            if(opt.loadMaterial)
            { 
                    var param = {
                        id : opt.id,
                        newstype : 6,
                        key :'',       
                        clientName : response.data.clientName,
                        industry : response.data.industry  ,
                        size:50,
                        page:1
                    }
                yield call(fetchEntity.bind(null, actions.materialget, newsApi.MaterialnewsGet, param));  //首段
                param.newstype = 7;
                yield call(fetchEntity.bind(null, actions.materialget, newsApi.MaterialnewsGet, param));  //尾段

                var _param = {
                    id : opt.id
                }
                yield call(fetchEntity.bind(null, actions.provideTitles, newsApi.ProviderTitlesGet, _param));  //推荐标题

            }
         
        }
    else
        yield put(actions.oneArticle.failure(opt, error))
    }
}

function* watchLoadOneArticle() {
    while (true) {
        yield call(loadOneArticle)
    }
}

// 3 编辑单个文章
function* sendEditOneArticle(action, apiFn) {
    const opt = yield take(action.request().type);
    // 发送请求 action
    const {response, error} = yield call(apiFn, opt);

    if (response >= 1) {
        yield put(action.success(opt));
        // 修改完，更新 store 后，跳转到下一文章或下一步, step2
        
        yield call(fetchEntity.bind(null, actions.oneArticle, newsApi.getOneArticle, opt));
        
    } else {
        yield put(action.failure(opt, error))
    }
}

export const sendOneArticle = sendEditOneArticle.bind(null, actions.editOneArticle, newsApi.editOneArticle);

function* editOneArticle() {
    while (true) {
        yield call(sendOneArticle)
    }
}
 







// 收藏/取消收藏单个文章
function* sendCollectOneArticle(action, apiFn) {
    const opt = yield take(action.request().type);
    // 发送请求 action
    const {response, error} = yield call(apiFn, opt);

    if (response >= 1) {
        yield put(action.success(opt));
        
        if(_.has(opt, "disfrom") && (opt.disfrom === "writelist" ||  opt.disfrom === "news3list")){
            yield call(fetchEntity.bind(null, actions.newArticles, newsApi.getNewArticles, opt));
        }else
        {yield call(fetchEntity.bind(null, actions.oneArticle, newsApi.getOneArticle, opt));}

    } else {
        yield put(action.failure(opt, error))
    }
}

export const CollectOneArticle = sendCollectOneArticle.bind(null, actions.collectOneArticle, newsApi.collectArticles);

function* watchcollectOneArticle() {
    while (true) {
        yield call(CollectOneArticle)
    }
}
/*
// 添加原生广告并生成文章
function* sendAd(action, apiFn) {
    const opt = yield take(actions.LOAD_AddAD);
    // 发送请求 action
    const {response, error} = yield call(apiFn, opt);

    if (response && response.length > 0) {
        // 成功 action
        yield put(action.success(opt, response));
    } else {
        // 失败 action
        yield put(action.failure(opt, error))
    }
}

export const sendAddAd = sendAd.bind(null, actions.addAD, newsApi.addAdApi);

function* watchAddAd() {
    while (true) {
        yield call(sendAddAd)
    }
}

// 查询原生广告
function* loadGetAD() {
    let opt = yield take(actions.LOAD_GetAD);

    yield call(fetchEntity.bind(null, actions.getAD, newsApi.getAdApi, opt));

}

function* watchloadGetAD() {
    while (true) {
        yield call(loadGetAD)
    }
}

// 查询热词
function* loadHotWord() {
    let opt = yield take(actions.LOAD_HotWords);
    opt = _.extend({index: 1, size: apiUrl.HOTWORDS_PAGESIZE}, opt);
    yield call(fetchEntity.bind(null, actions.hotWords, newsApi.hotWordsApi, opt));

}

function* watchloadHotWords() {
    while (true) {
        yield call(loadHotWord)
    }
}
*/
// 4 我的文章
function* loadMyArticles() {
    // 选择操作参数， 调用选择器
    let opt = yield take(actions.LOAD_MyArticles);
    opt = _.extend({index: 1, size: apiUrl.AD_PAGESIZE}, opt);
    const data = yield select(selector.selectMyArticles4);
    // 操作条件判断
    if (_.isEmpty(data.MArticles) || data.current != opt.index) {
        // 进行操作
        yield call(fetchEntity.bind(null, actions.myArticles, newsApi.getMyArticlesApi, opt))
    }
}

function* watchMyArticles() {
    while (true) {
        yield call(loadMyArticles)
    }
}

// 导出
function* loadOUT_Articles() {
    // 选择操作参数， 调用选择器
    let opt = yield take(actions.OUTArticlesTypes["REQUEST"]);

    yield call(fetchEntity.bind(null, actions.outWordArticles, newsApi.outArticles, opt))
}

function* watchOUT_Articles() {
    while (true) {
        yield call(loadOUT_Articles)
    }
}

 
 //文章编辑页面右侧辅助资料列表
function* loadEditAssistList() { 
    let opt = yield take(actions.LOAD_editAssist);

    yield call(fetchEntity.bind(null, actions.editAssistget, newsApi.EditAssistnewsGet, opt));
}

function* watchEditAssistList() {
    while (true) {
        yield call(loadEditAssistList)
    }
}

 //文章编辑页面素材-首尾段列表
 function* loadMaterialList() { 
    let opt = yield take(actions.LOAD_material);
     var _newstype = opt.newstype;
     if(typeof _newstype === 'number')
     {
        yield call(fetchEntity.bind(null, actions.materialget, newsApi.MaterialnewsGet, opt));
     }else if(typeof _newstype === 'object')
     {
        var param = {
            id : opt.id,
            newstype : _newstype[0],
            key :'',       
            clientName :opt.clientName,
            industry : opt.industry,
            size:opt.size,
            page:opt.page
        }
    yield call(fetchEntity.bind(null, actions.materialget, newsApi.MaterialnewsGet, param));  //首段
    param.newstype = _newstype[1];
    yield call(fetchEntity.bind(null, actions.materialget, newsApi.MaterialnewsGet, param));  //尾段
     }

     var _param = {
        id : opt.id
    }
    yield call(fetchEntity.bind(null, actions.provideTitles, newsApi.ProviderTitlesGet, _param));  //推荐标题
    
}

function* watchloadMaterialListList() {
    while (true) {
        yield call(loadMaterialList)
    }
}

 //文章编辑页面右侧辅助资料-全网搜-展开时查询单条数据
 function* loadEditAssistItem() { 
    let opt = yield take(actions.LOAD_AssisNewsItem);

    yield call(fetchEntity.bind(null, actions.AssisNewsItemGet, newsApi.EditAssistnewsItemGet, opt));
}

 
 
function* watchEditAssistItem() {
    while (true) {
        yield call(loadEditAssistItem)
    }
}


//文章编辑页面右侧辅助资料添加
function* addEditAssistNews(action, apiFn) {
    const opt = yield take(action.request().type);
    const {response, error} = yield call(apiFn, opt);

    if (response) {
        yield put(action.success(opt));
         
        yield call(fetchEntity.bind(null, actions.editAssistget, newsApi.EditAssistnewsGet,{page:1,size:5,newstype:opt.newsType,clientName:opt.clientName,industry:opt.industry }))

    } else {
        yield put(action.failure(opt, error))
    }
}

export const addEditAssist = addEditAssistNews.bind(null, actions.editAssistadd, newsApi.EditAssistnewsAdd);

function* watchaddEditAssistNews() {
    while (true) {
        yield call(addEditAssist)
    }
}

//文章编辑页面右侧辅助资料-标题添加
function* addEditAssistTitle(action, apiFn) {
    const opt = yield take(action.request().type);
    const {response, error} = yield call(apiFn, opt);

    if (response) {
        yield put(action.success(opt));
         
        yield call(fetchEntity.bind(null, actions.editAssistget, newsApi.EditAssistnewsGet,{id:opt.id,tabTag:opt.tabTag, key :'',page : opt.page,size : opt.size,TitleCategory : opt.categoryId}))

    } else {
        yield put(action.failure(opt, error))
    }
}

export const _addEditAssistTitle = addEditAssistTitle.bind(null, actions.editAssistaddTitle, newsApi.EditAssistnewsTitleAdd);

function* watchaddEditAssistTitle() {
    while (true) {
        yield call(_addEditAssistTitle)
    }
}


 

//文章编辑页面右侧辅助资料图片添加时选择的实例列表
function* loadEditAssistImgSubjectList() { 
    let opt = yield take(actions.LOAD_editAssistImgSubject);

    yield call(fetchEntity.bind(null, actions.editAssistgetImgSubject, newsApi.EditAssistnewsImgSubjects, opt));
}

 
 
function* watchEditAssistImgSubjectList() {
    while (true) {
        yield call(loadEditAssistImgSubjectList)
    }
}

//文章编辑页面右侧辅助资料图片添加
function* addEditAssistImgNews(action, apiFn) {
    const opt = yield take(action.request().type);
    const {response, error} = yield call(apiFn, opt);

    if (response) {  
        yield put(action.success(opt));
 
        if(opt.clientName)
        {
            yield call(fetchEntity.bind(null, actions.editAssistImgget, newsApi.EditAssistnewsImgGet,{index:1,size:5,clientName:opt.clientName,tabTag: opt.tabTag,key:opt.key}))

        }
        
        else if(opt.CoreImages)
        {
            
            var data = _.map(opt.CoreImages, (v) => {
                return v.rid
            });
            data.push(response);
            yield newsApi.editCoreImages({data:data,nid: opt.nid });
 
            yield call(fetchEntity.bind(null, actions.coreImages, newsApi.getCoreImages, {nid: opt.nid }))

        }

    } else {
        yield put(action.failure(opt, error))
    }
}

export const addEditAssistImg = addEditAssistImgNews.bind(null, actions.editAssistaddImg, newsApi.EditAssistnewsImgAdd);

function* watchaddEditAssistImgNews() {
    while (true) {
        yield call(addEditAssistImg)
    }
}


//加载文章编辑页面右侧辅助资料图片列表
function* loadEditAssistImgList() { 
    let opt = yield take(actions.LOAD_editAssistImg);

    yield call(fetchEntity.bind(null, actions.editAssistImgget, newsApi.EditAssistnewsImgGet, opt));
}

 
 
function* watchEditAssistImgList() {
    while (true) {
        yield call(loadEditAssistImgList)
    }
}

//加载文章编辑页面右侧辅助资料标题分类
function* loadEditAssistTitleCategorys() { 
    let opt = yield take(actions.LOAD_TitleCategory);

    //const {response, error} = yield call(fetchEntity.bind(null, actions.TitleCategoryGet, newsApi.EditAssistnewsTitleCategorysGet, opt));
    const {response, error} = yield call(newsApi.EditAssistnewsTitleCategorysGet, opt);

    yield put(actions.TitleCategoryGet.success(opt, response));

    if(response && response.data.length > 0)
    {
        //var item = response.data[0];
        var item = response.data[response.data.length -1];

        var id = item._id;
         
        yield call(fetchEntity.bind(null, actions.editAssistget, newsApi.EditAssistnewsGet, {key : '',page : 1,size : 15,TitleCategory:id,tabTag:-3,id:opt.id}));
    }
}

 
 
function* watchEditAssistTitleCategorys() {
    while (true) {
        yield call(loadEditAssistTitleCategorys)
    }
}

//------------------------------------------
// 上传 word
function* uploadWord(action, apiFn) {
    const opt = yield take(action.request().type); 
    const {response, error} = yield call(apiFn, opt); 
    
     if (response) {
        yield put(action.success(opt, response));
    } else {
        yield put(action.failure(opt, error))
    } 
}

export const uploadWordAc = uploadWord.bind(null, actions.uploadWord, newsApi.uploadWordApi);
function* watchUploadWords() {
    while (true) {
        yield call(uploadWordAc)
    }
}


function* analyzeLink(action, apiFn) {
    const opt = yield take(action.request().type);
    const {response, error} = yield call(apiFn, opt); 
    if (response) {
        yield put(action.success(opt, response));
    } else {
        yield put(action.failure(opt, error))
    }
}

export const _analyzeLink = analyzeLink.bind(null, actions.analyzeLink, newsApi.getArticleByLink);
function* watchAnalyzeLink() {
    while (true) {
        yield call(_analyzeLink)
    }
}

export const imageUploadAc = uploadWord.bind(null, actions.imageUpload, newsApi.imageUpload);
function* watchImageUpload() {
    while (true) {
        yield call(imageUploadAc)
    }
}

export const imgDelAc = uploadWord.bind(null, actions.imageDel, newsApi.imageDel);
function* watchapiImgDel() {
    while (true) {
        yield call(imgDelAc)
    }
}


function* createNews(action, apiFn) {
    const opt = yield take(action.request().type);
    const {response, error} = yield call(apiFn, opt);
    if (response) {
        yield put(action.success(opt, response));
        
        var id = response;
        yield call(fetchEntity.bind(null, actions.newArticles, newsApi.getNewArticles, 
                                {
                                    ArticleId: id,
                                    index: 1,
                                    listtype: 1,
                                    applyplatform: -1})
                                );
        
       
    } else {
        yield put(action.failure(opt, error))
    }
}

export const createNewsAc = createNews.bind(null, actions.createNews, newsApi.createNewArticles);

function* watchCreateNews() {
    while (true) {
        yield call(createNewsAc)
    }
}


//查询任务列表
function* loadArticleTasks() {
    let opt = yield take(actions.LOAD_ArticleTasks); 
    
    yield call(fetchEntity.bind(null, actions.articleTasks, newsApi.UserArticleTasksGet, opt));
         
}

function* watchloadArticleTasks() {
    while (true) {
        yield call(loadArticleTasks)
    }
}

function* oneArticleHandle(action, apiFn) {
    const opt = yield take(action.request().type);
    const {response, error} = yield call(apiFn, opt);
    if (response) {
        //yield put(action.success(opt, response)); 

        var _opt = {
                    index: 1, 
                    size: apiUrl.AD_PAGESIZE,
                    ArticleId:opt.articleId,
                    applyplatform:opt.applyplatform,
                    listtype: opt.listtype
                  };
        yield call(fetchEntity.bind(null, actions.newArticles, newsApi.getNewArticles, _opt));
       
    } else {
        yield put(action.failure(opt, error))
    }
}

export const _oneArticleHandle = oneArticleHandle.bind(null, actions.oneArticleHandle, newsApi.newArticleHandle);

function* watchoneArticleHandle() {
    while (true) {
        yield call(_oneArticleHandle)
    }
}




//查询任务文章
function* loadTaskArticle() { 
    let opt = yield take(actions.LOAD_TaskArticle); 
    
    yield call(fetchEntity.bind(null, actions.taskArticle, newsApi.UserTaskArticleGet, opt));
         
}

function* watchloadTaskArticle() {
    while (true) {
        yield call(loadTaskArticle)
    }
}


function* calculation(action, apiFn) {
    const opt = yield take(action.request().type);
     yield call(apiFn, opt);
     
}

export const _Calculation = calculation.bind(null, actions.calculation, newsApi.Calculation);

function* watchCalculation() {
    while (true) {
        yield call(_Calculation)
    }
}





export default function* root() {
    yield all([
        //0
        /* fork(login),
        fork(loginout),
        fork(accessLogin), */
        fork(loadclientInfo),
        fork(loadManuscript),
        //1
        fork(sendAddArticle),
        //2
        fork(watchArticle),
        fork(watchCoreMessages),
        fork(editCMessages),
        fork(watchNouns),
        fork(editNouns),
        fork(watchCoreImages),
        fork(watchCoreImagesCars),
        fork(watchSysImages),
        fork(editCoreImages),
        fork(watchGoods),
        fork(editGoods),
        fork(editGoodsLoc),
        fork(watchExtRead),
        fork(editExtRead),
        // 3
        fork(watchGenNewArticles),
        fork(watchLoadNewArticles),
        fork(watchLoadNewArticlesWithID),

        fork(watchLoadOneArticle),
        fork(editOneArticle),
        
        // 4
        fork(watchMyArticles),
        // out
        fork(watchOUT_Articles),
        //5
        /* fork(sendAddTrend),
        fork(watchTrend2),
        fork(watchGenNewTrend4s),
        fork(watchloadTags),
        fork(watchloadKeyInfo),
        fork(watchSendKeyInfo),
        fork(watchLoadNewTrend3s),
        fork(sendAdapt),
        fork(watchLoadTrendList), */

        fork(watchEditAssistList),
        fork(watchaddEditAssistNews), 
        fork(watchEditAssistImgSubjectList),
        fork(watchaddEditAssistImgNews),
        fork(watchEditAssistImgList),
        fork(watchcollectOneArticle),
        fork(watchaddEditAssistTitle),
        fork(watchEditAssistItem),
        //
        fork(watchUploadWords),
        fork(watchImageUpload),
        fork(watchapiImgDel),
        fork(watchCreateNews),

        //恢复文章
        //fork(watchrevertArticle),
        
        fork(watchEditAssistTitleCategorys), 
        fork(watchAnalyzeLink),
        fork(watchloadMaterialListList),
        fork(watchloadArticleTasks),
        fork(watchloadTaskArticle),

        fork(watchCalculation),
        fork(watchoneArticleHandle),
    ])
}
