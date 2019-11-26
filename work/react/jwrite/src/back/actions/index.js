
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const CLEAR = 'CLEAR';
const UPDATE = 'UPDATE'; 
const VIEW = 'VIEW'; 

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE,CLEAR,UPDATE,VIEW].reduce((acc, type) => {
		acc[type] = `${base}_${type}`;
		return acc
	}, {})
}

function action(type, payload = {}) {
    return {type, ...payload}
}

// 0 登录
export const loginTypes = createRequestTypes('loginTypes');
export const login = {
    request: (opt) => action(loginTypes[REQUEST], opt),
    success: (opt, response) => action(loginTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(loginTypes[FAILURE], {opt, error}),
    clear:()=>action(loginTypes[CLEAR], {})
};

// 0 退出
export const loginoutTypes = createRequestTypes('loginoutTypes');
export const loginout = {
    request: (opt) => action(loginoutTypes[REQUEST], opt),
    success: (opt, response) => action(loginoutTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(loginoutTypes[FAILURE], {opt, error}),
};
// 0 token 登录
export const accessLoginTypes = createRequestTypes('accessLoginTypes');
export const accessLogin = {
    request: (opt) => action(accessLoginTypes[REQUEST], opt),
    success: (opt, response) => action(accessLoginTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(accessLoginTypes[FAILURE], {opt, error}),
};
// client
export const clientTypes = createRequestTypes('clientTypes');
export const clientInfo = {
    request: (opt) => action(clientTypes[REQUEST], opt),
    success: (opt, response) => action(clientTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(clientTypes[FAILURE], {opt, error}),
};

// 1 添加文章
export const LOAD_AddArticle = 'LOAD_AddArticle';
export const loadAddArticle = (opt) => action(LOAD_AddArticle, opt);
export const AddArticleTypes = createRequestTypes('AddArticle');
export const addArticle = {
    request: (opt) => action(AddArticleTypes[REQUEST], opt),
    success: (opt, response) => action(AddArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(AddArticleTypes[FAILURE], {opt, error}),
    clear: () => action(AddArticleTypes[CLEAR], {}),
    
};



// 1 查询文章
export const LOAD_Article = 'LOAD_Article';
export const loadArticle = (opt) => action(LOAD_Article, opt);
export const ArticleTypes = createRequestTypes('Article');
export const article = {
    request: (opt) => action(ArticleTypes[REQUEST], opt),
    success: (opt, response) => action(ArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(ArticleTypes[FAILURE], {opt, error}),
    clear: () => action(ArticleTypes[CLEAR], {}),
    update: (opt) => action(ArticleTypes[UPDATE], {opt}),
};

// 2 核心信息提炼，获取保存和添加
export const LOAD_CoreMessages = 'LOAD_CoreMessages';
export const loadCoreMessages = (opt) => action(LOAD_CoreMessages, opt);
export const CoreMessagesTypes = createRequestTypes('CoreMessages');
export const coreMessages = {
    request: (opt) => action(CoreMessagesTypes[REQUEST], opt),
    success: (opt, response) => action(CoreMessagesTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(CoreMessagesTypes[FAILURE], {opt, error}),
};

export const CMEditTypes = createRequestTypes('CMEdit');
export const cMEdit = {
    request: (opt) => action(CMEditTypes[REQUEST], opt),
    success: (opt) => action(CMEditTypes[SUCCESS], {opt}),
    failure: (opt, error) => action(CMEditTypes[FAILURE], {opt, error}),
};

// 2 相关名词解释，获取保存和添加
export const LOAD_Nouns = 'LOAD_Nouns';
export const loadNouns = (opt) => action(LOAD_Nouns, opt);
export const NounsTypes = createRequestTypes('Nouns');
export const nouns = {
    request: (opt) => action(NounsTypes[REQUEST], opt),
    success: (opt, response) => action(NounsTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(NounsTypes[FAILURE], {opt, error}),
};

export const NounsEditTypes = createRequestTypes('NounsEdit');
export const nounsEdit = {
    request: (opt) => action(NounsEditTypes[REQUEST], opt),
    success: (opt, response) => action(NounsEditTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(NounsEditTypes[FAILURE], {opt, error}),
};

// 2 相关图片，获取保存
export const LOAD_CoreImages = 'LOAD_CoreImages';
export const loadCoreImages = (opt) => action(LOAD_CoreImages, opt);
export const CoreImagesTypes = createRequestTypes('CoreImages');
export const coreImages = {
    request: (opt) => action(CoreImagesTypes[REQUEST], opt),
    success: (opt, response) => action(CoreImagesTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(CoreImagesTypes[FAILURE], {opt, error}),
};

export const LOAD_CoreImagesCars = 'LOAD_CoreImagesCars';
export const loadCoreImagesCars = (opt) => action(LOAD_CoreImagesCars, opt);
export const CoreImagesTypesCars = createRequestTypes('CoreImagesCars');
export const coreImagesCars = {
    request: (opt) => action(CoreImagesTypesCars[REQUEST], opt),
    success: (opt, response) => action(CoreImagesTypesCars[SUCCESS], {opt, response}),
    failure: (opt, error) => action(CoreImagesTypesCars[FAILURE], {opt, error}),
};

// sys
export const LOAD_SysImages = 'LOAD_SysImages';
export const loadSysImages = (opt) => action(LOAD_SysImages, opt);
export const SysImagesTypes = createRequestTypes('SysImages');
export const sysImages = {
    request: (opt) => action(SysImagesTypes[REQUEST], opt),
    success: (opt, response) => action(SysImagesTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(SysImagesTypes[FAILURE], {opt, error}),
};

// edit
export const CoreImagesEditTypes = createRequestTypes('CoreImagesEdit');
export const coreImagesEdit = {
    request: (opt) => action(CoreImagesEditTypes[REQUEST], opt),
    success: (opt, response) => action(CoreImagesEditTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(CoreImagesEditTypes[FAILURE], {opt, error}),
};

// 2 商品，获取保存和添加
export const LOAD_Goods = 'LOAD_Goods';
export const loadGoods = (opt) => action(LOAD_Goods, opt);
export const GoodsTypes = createRequestTypes('Goods');
export const goods = {
    request: (opt) => action(GoodsTypes[REQUEST], opt),
    success: (opt, response) => action(GoodsTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(GoodsTypes[FAILURE], {opt, error}),
};

export const GoodsEditTypes = createRequestTypes('GoodsEdit');

export const goodsEdit = {
    request: (opt) => action(GoodsEditTypes[REQUEST], opt),
    success: (opt, response) => action(GoodsEditTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(GoodsEditTypes[FAILURE], {opt, error}),
};

export const GoodsEditLocTypes = createRequestTypes('GoodsEditLoc');
export const goodsEditLoc = {
    request: (opt) => action(GoodsEditLocTypes[REQUEST], opt),
    success: (opt) => action(GoodsEditLocTypes[SUCCESS], opt),
    failure: (opt) => action(GoodsEditLocTypes[FAILURE], opt),
};

// 2 阅读，获取保存和添加
export const LOAD_ExtRead = 'LOAD_ExtRead';
export const loadExtRead = (opt) => action(LOAD_ExtRead, opt);
export const ExtReadTypes = createRequestTypes('ExtRead');
export const extRead = {
    request: (opt) => action(ExtReadTypes[REQUEST], opt),
    success: (opt, response) => action(ExtReadTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(ExtReadTypes[FAILURE], {opt, error}),
};

export const ExtReadEditTypes = createRequestTypes('ExtReadEdit');
export const extReadEdit = {
    request: (opt) => action(ExtReadEditTypes[REQUEST], opt),
    success: (opt, response) => action(ExtReadEditTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(ExtReadEditTypes[FAILURE], {opt, error}),
};

// 3 生成改编文章
export const GenNewArticlesTypes = createRequestTypes('GenNewArticles');
export const genNewArticles = {
    request: (opt) => action(GenNewArticlesTypes[REQUEST], opt),
    success: (opt, response) => action(GenNewArticlesTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(GenNewArticlesTypes[FAILURE], {opt, error}),
   

};

// 3 加载所有生成文章
export const LOAD_NewArticles = 'LOAD_NewArticles';
export const loadNewArticles = (opt) => action(LOAD_NewArticles, opt);
export const NewArticlesTypes = createRequestTypes('NewArticles');
export const newArticles = {
    request: (opt) => action(NewArticlesTypes[REQUEST], opt),
    success: (opt, response) => action(NewArticlesTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(NewArticlesTypes[FAILURE], {opt, error}),
    clear: () => action(NewArticlesTypes[CLEAR], {}),
};

export const LOAD_NewArticles_id = 'LOAD_NewArticles_id';
export const loadNewArticlesWithId = (opt) => action(LOAD_NewArticles_id, opt);
export const NewArticlesTypesID = createRequestTypes('NewArticles_id');
export const newArticleswithid = {
    request: (opt) => action(NewArticlesTypesID[REQUEST], opt),
    success: (opt, response) => action(NewArticlesTypesID[SUCCESS], {opt, response}),
    failure: (opt, error) => action(NewArticlesTypesID[FAILURE], {opt, error}),
};

export const OneArticleHandleTypes = createRequestTypes('OneArticleHandle');
export const oneArticleHandle = {
    request: (opt) => action(OneArticleHandleTypes[REQUEST], opt),
    success: (opt, response) => action(OneArticleHandleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(OneArticleHandleTypes[FAILURE], {opt, error}),
};


// 3 查询单个文章
export const LOAD_OneArticle = 'LOAD_OneArticle';
export const loadOneArticle = (opt) => action(LOAD_OneArticle, opt);

export const OneArticleTypes = createRequestTypes('OneArticle');
export const oneArticle = {
    request: (opt) => action(OneArticleTypes[REQUEST], opt),
    success: (opt, response) => action(OneArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(OneArticleTypes[FAILURE], {opt, error}),
    clear: () => action(OneArticleTypes[CLEAR], {}),
    update: (opt) => action(OneArticleTypes[UPDATE], {opt}),


};

// 3 编辑单个文章
export const EditOneArticleTypes = createRequestTypes('EditOneArticle');
export const editOneArticle = {
    request: (opt) => action(EditOneArticleTypes[REQUEST], opt),
    success: (opt, response) => action(EditOneArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(EditOneArticleTypes[FAILURE], {opt, error}),
};

/* export const AutoEditOneArticleTypes = createRequestTypes('AutoEditOneArticle');
export const AutoeditOneArticle = {
    request: (opt) => action(AutoEditOneArticleTypes[REQUEST], opt),
    success: (opt, response) => action(AutoEditOneArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(AutoEditOneArticleTypes[FAILURE], {opt, error}),
    clear: () => action(AutoEditOneArticleTypes[CLEAR], {}),

}; */

// 收藏/取消收藏 单个文章
export const CollectOneArticleTypes = createRequestTypes('CollectOneArticle');
export const collectOneArticle = {
    request: (opt) => action(CollectOneArticleTypes[REQUEST], opt),
    success: (opt, response) => action(CollectOneArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(CollectOneArticleTypes[FAILURE], {opt, error}),
};


// 1 获取广告
// export const LOAD_ADs = 'LOAD_ADs';
// export const loadADs = (opt) => action(LOAD_ADs, opt);
// export const GetADsTypes = createRequestTypes('GetADsTypes');
// export const getADs = {
//     request: (opt) => action(GetADsTypes[REQUEST], opt),
//     success: (opt, response) => action(GetADsTypes[SUCCESS], {opt, response}),
//     failure: (opt, error) => action(GetADsTypes[FAILURE], {opt, error}),
// };
// 1 添加原生广告并生成文章
export const LOAD_AddAD = 'LOAD_AddAD';
export const loadAddAD = (opt) => action(LOAD_AddAD, opt);
export const AddADTypes = createRequestTypes('AddADTypes');
export const addAD = {
    request: (opt) => action(AddADTypes[REQUEST], opt),
    success: (opt, response) => action(AddADTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(AddADTypes[FAILURE], {opt, error}),
};

// 1 查询原生广告
export const LOAD_GetAD = 'LOAD_GetAD';
export const loadGetAD = (opt) => action(LOAD_GetAD, opt);
export const GetADTypes = createRequestTypes('GetADTypes');
export const getAD = {
    request: (opt) => action(GetADTypes[REQUEST], opt),
    success: (opt, response) => action(GetADTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(GetADTypes[FAILURE], {opt, error}),
};

// 1 查询热词
export const LOAD_HotWords = 'LOAD_HotWords';
export const loadHotWords = (opt) => action(LOAD_HotWords, opt);
export const HotWordsTypes = createRequestTypes('HotWordsTypes');
export const hotWords = {
    request: (opt) => action(HotWordsTypes[REQUEST], opt),
    success: (opt, response) => action(HotWordsTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(HotWordsTypes[FAILURE], {opt, error}),
};

// 4 我的文章
export const LOAD_MyArticles = 'LOAD_MyArticles';
export const loadMyArticles = (opt) => action(LOAD_MyArticles, opt);
export const MyArticlesTypes = createRequestTypes('MyArticles');
export const myArticles = {
    request: (opt) => action(MyArticlesTypes[REQUEST], opt),
    success: (opt, response) => action(MyArticlesTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(MyArticlesTypes[FAILURE], {opt, error}),
    clear: () => action(MyArticlesTypes[CLEAR], {}),

};

// 4 导出
export const OUT_Articles = 'OUT_Articles';
export const OUTArticles = (opt) => action(OUTArticles, opt);
export const OUTArticlesTypes = createRequestTypes('OUTArticles');
export const outWordArticles = {
    request: (opt) => action(OUTArticlesTypes[REQUEST], opt),
    success: (opt, response) => action(OUTArticlesTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(OUTArticlesTypes[FAILURE], {opt, error}),
};

// 1 添加借势传播
export const LOAD_AddTrend = 'LOAD_AddTrend';
export const loadAddTrend = (opt) => action(LOAD_AddTrend, opt);
export const AddTrendTypes = createRequestTypes('AddTrend');
export const addTrend = {
    request: (opt) => action(AddTrendTypes[REQUEST], opt),
    success: (opt, response) => action(AddTrendTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(AddTrendTypes[FAILURE], {opt, error}),
};


// 1 查询借势传播 trend2
export const LOAD_Trend2 = 'LOAD_Trend2';
export const loadTrend2 = (opt) => action(LOAD_Trend2, opt);
export const Trend2Types = createRequestTypes('Trend2');
export const Trend2 = {
    request: (opt) => action(Trend2Types[REQUEST], opt),
    success: (opt, response) => action(Trend2Types[SUCCESS], {opt, response}),
    failure: (opt, error) => action(Trend2Types[FAILURE], {opt, error}),
};


// 1 弹窗的查询标签
export const LOAD_Tags = 'LOAD_Tags';
export const loadTags = (opt) => action(LOAD_Tags, opt);
export const TagsTypes = createRequestTypes('TagsTypes');
export const Tags = {
    request: (opt) => action(TagsTypes[REQUEST], opt),
    success: (opt, response) => action(TagsTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(TagsTypes[FAILURE], {opt, error}),
};

// 1 查询关键信息点标签
export const LOAD_KeyInfo = 'LOAD_KeyInfo';
export const loadKeyInfo = (opt) => action(LOAD_KeyInfo, opt);

export const KeyInfoTypes = createRequestTypes('KeyInfoTypes');
export const keyInfo = {
    request: (opt) => action(KeyInfoTypes[REQUEST], opt),
    success: (opt, response) => action(KeyInfoTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(KeyInfoTypes[FAILURE], {opt, error}),
};

export const UpKeyInfoTypes = createRequestTypes('UpKeyInfoTypes');
export const upKeyInfo = {
    request: (opt) => action(UpKeyInfoTypes[REQUEST], opt),
    success: (opt, response) => action(UpKeyInfoTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(UpKeyInfoTypes[FAILURE], {opt, error}),
};

// 3 加载所有生成借势热点 trend3
export const LOAD_NewTrend3s = 'LOAD_NewTrend3s';
export const loadNewTrend3s = (opt) => action(LOAD_NewTrend3s, opt);
export const NewTrend3sTypes = createRequestTypes('NewTrend3s');
export const newTrend3s = {
    request: (opt) => action(NewTrend3sTypes[REQUEST], opt),
    success: (opt, response) => action(NewTrend3sTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(NewTrend3sTypes[FAILURE], {opt, error}),
};

// 3 生成借势文章列表 trend4
export const GenNewTrend4sTypes = createRequestTypes('GenNewTrend4s');
export const genNewTrend4s = {
    request: (opt) => action(GenNewTrend4sTypes[REQUEST], opt),
    success: (opt, response) => action(GenNewTrend4sTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(GenNewTrend4sTypes[FAILURE], {opt, error}),
};

// 3 加载所有生成借势文章列表
export const LOAD_NewTrend4s = 'LOAD_NewTrend4s';
export const loadNewTrend4s = (opt) => action(LOAD_NewTrend4s, opt);
export const NewTrend4sTypes = createRequestTypes('NewTrend4s');
export const newTrend4s = {
    request: (opt) => action(NewTrend4sTypes[REQUEST], opt),
    success: (opt, response) => action(NewTrend4sTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(NewTrend4sTypes[FAILURE], {opt, error}),
};

// 一键改编
export const GenAdaptTypes = createRequestTypes('GenAdapt');
export const genAdapt = {
    request: (opt) => action(GenAdaptTypes[REQUEST], opt),
    success: (opt, response) => action(GenAdaptTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(GenAdaptTypes[FAILURE], {opt, error}),
};

export const Acticle3Clear = createRequestTypes('Acticle3Clear');
export const acticleClear = {
    request: (opt) => action(Acticle3Clear[REQUEST], opt)
};



// 2 核心信息提炼，获取保存和添加
export const Acticle_inGenerate = (data)=>{
      return {
          type:'Acticle_inGenerate',
          data
      }
};

/***
 * 文章编辑页右侧辅助
 * 
 */

// 文章编辑页右侧辅助资料查询
export const LOAD_editAssist = 'LOAD_editAssist';
export const loadeditAssist = (opt) => action(LOAD_editAssist, opt);

export const editAssistGetTypes = createRequestTypes('editAssistGet');
export const editAssistget = {
    request: (opt) => action(editAssistGetTypes[REQUEST], opt),
    success: (opt, response) => action(editAssistGetTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(editAssistGetTypes[FAILURE], {opt, error}),
    clear: (opt) => action(editAssistGetTypes[CLEAR], {opt}),
};

// 文章编辑页右侧辅助资料添加
export const editAssistAddTypes = createRequestTypes('editAssistAdd');
export const editAssistadd = {
    request: (opt) => action(editAssistAddTypes[REQUEST], opt),
    success: (opt, response) => action(editAssistAddTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(editAssistAddTypes[FAILURE], {opt, error}),
     
};

// 文章编辑页右侧辅助资料删除
export const editAssistDelTypes = createRequestTypes('editAssistDel');
export const editAssistdel = {
    request: (opt) => action(editAssistDelTypes[REQUEST], opt),
    success: (opt, response) => action(editAssistDelTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(editAssistDelTypes[FAILURE], {opt, error}),
     
};

// 文章编辑页右侧辅助资料添加图片时选择的实体列表
export const LOAD_editAssistImgSubject = 'LOAD_editAssistImgSubject';
export const loadeditAssistImgSubject = (opt) => action(LOAD_editAssistImgSubject, opt);

export const editAssistImgSubjectGetTypes = createRequestTypes('editAssistImgSubjectGet');
export const editAssistgetImgSubject = {
    request: (opt) => action(editAssistImgSubjectGetTypes[REQUEST], opt),
    success: (opt, response) => action(editAssistImgSubjectGetTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(editAssistImgSubjectGetTypes[FAILURE], {opt, error}),
    clear: () => action(editAssistImgSubjectGetTypes[CLEAR], {}),
};

// 文章编辑页右侧辅助资料图片添加
export const editAssistAddImgTypes = createRequestTypes('editAssistAddImg');
export const editAssistaddImg = {
    request: (opt) => action(editAssistAddImgTypes[REQUEST], opt),
    success: (opt, response) => action(editAssistAddImgTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(editAssistAddImgTypes[FAILURE], {opt, error}),
     
};

// 文章编辑页右侧辅助资料标题添加
export const editAssistAddTitleTypes = createRequestTypes('editAssistAddTitle');
export const editAssistaddTitle = {
    request: (opt) => action(editAssistAddTitleTypes[REQUEST], opt),
    success: (opt, response) => action(editAssistAddTitleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(editAssistAddTitleTypes[FAILURE], {opt, error}),
     
};

 
// 文章编辑页右侧辅助资料查询
export const LOAD_editAssistImg = 'LOAD_editAssistImg';
export const loadeditAssistImg = (opt) => action(LOAD_editAssistImg, opt);

export const editAssisImgtGetTypes = createRequestTypes('editAssistImgGet');
export const editAssistImgget = {
    request: (opt) => action(editAssisImgtGetTypes[REQUEST], opt),
    success: (opt, response) => action(editAssisImgtGetTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(editAssisImgtGetTypes[FAILURE], {opt, error}),
     
};


// 文章编辑页素材-首尾段查询
export const LOAD_material = 'LOAD_material';
export const loadmaterial = (opt) => action(LOAD_material, opt);

export const materialGetTypes = createRequestTypes('materialGet');
export const materialget = {
    request: (opt) => action(materialGetTypes[REQUEST], opt),
    success: (opt, response) => action(materialGetTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(materialGetTypes[FAILURE], {opt, error}),
    clear: (opt) => action(materialGetTypes[CLEAR], {opt}),
};

/**
 * 新闻撰写部分
 * 
 */
/*
// 新闻撰写

export const LOAD_Compose = 'LOAD_Compose';
export const LOADCompose = (opt) => action(LOAD_Compose, opt);

export const  composeTypes = createRequestTypes('compose');
export const compose = { 
    request: (opt) => action(composeTypes[REQUEST], opt),
    success: (opt, response) => action(composeTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(composeTypes[FAILURE], {opt, error}),
    clear: () => action(composeTypes[CLEAR], {}),
     
};


   

// 新闻撰写-生成(查看、清空)要点理解
export const  composeUnderstandGenerateTypes = createRequestTypes('composeUnderstandGenerate');
export const composeUnderstandGenerate = {
    request: (opt) => action(composeUnderstandGenerateTypes[REQUEST], opt),
    success: (opt, response) => action(composeUnderstandGenerateTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(composeUnderstandGenerateTypes[FAILURE], {opt, error}),
    view: (opt) => action(composeUnderstandGenerateTypes[VIEW], {opt}),
    clear: () => action(composeUnderstandGenerateTypes[CLEAR], {}),

     
};

// 新闻撰写-更新要点理解的某一项(新闻、商品、延伸阅读等)
export const  composeUnderstandUpdateTypes = createRequestTypes('composeUnderstandUpdate');
export const composeUnderstandUpdate = {
    request: (opt) => action(composeUnderstandUpdateTypes[REQUEST], opt),
    success: (opt, response) => action(composeUnderstandUpdateTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(composeUnderstandUpdateTypes[FAILURE], {opt, error}),
    view: (opt, response) => action(composeUnderstandUpdateTypes[SUCCESS], {opt, response}),
    clear: () => action(composeUnderstandUpdateTypes[CLEAR], {}),

     
};

//查询要点理解
export const LOAD_PointUnderstand = 'LOAD_PointUnderstand';
export const LOADPointUnderstand = (opt) => action(LOAD_PointUnderstand, opt);

export const PointUnderstandGetTypes = createRequestTypes('PointUnderstandGet');
export const PointUnderstandGet = {
    request: (opt) => action(PointUnderstandGetTypes[REQUEST], opt),
    success: (opt, response) => action(PointUnderstandGetTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(PointUnderstandGetTypes[FAILURE], {opt, error}),
     
};

//查询要点组合
export const LOAD_PointGroup = 'LOAD_PointGroup';
export const LOADPointGroup = (opt) => action(LOAD_PointGroup, opt);

export const PointGroupGetTypes = createRequestTypes('PointGroupGet');
export const composePointGroupGet = {
    request: (opt) => action(PointGroupGetTypes[REQUEST], opt),
    success: (opt, response) => action(PointGroupGetTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(PointGroupGetTypes[FAILURE], {opt, error}),
     
};

// 新闻撰写-更新要点组合
export const  PointGroupUpdateTypes = createRequestTypes('PointGroupUpdate');
export const PointGroupUpdate = {
    request: (opt) => action(PointGroupUpdateTypes[REQUEST], opt),
    success: (opt, response) => action(PointGroupUpdateTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(PointGroupUpdateTypes[FAILURE], {opt, error}),   
     
};

// 新闻撰写-生成
export const  ComposeGenerateTypes = createRequestTypes('ComposeGenerate');
export const ComposeGenerate = {
    request: (opt) => action(ComposeGenerateTypes[REQUEST], opt),
    success: (opt, response) => action(ComposeGenerateTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(ComposeGenerateTypes[FAILURE], {opt, error}),   
     
};


//恢复原文
export const  RevertArticleTypes = createRequestTypes('RevertArticle');
export const RevertArticle = {
    request: (opt) => action(RevertArticleTypes[REQUEST], opt),
    success: (opt, response) => action(RevertArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(RevertArticleTypes[FAILURE], {opt, error}),   
     
};
*/

//文章编辑-辅助-标题类型
export const LOAD_TitleCategory = 'LOAD_TitleCategory';
export const LOADTitleCategory = (opt) => action(LOAD_TitleCategory, opt);

export const LOADTitleCategoryGetTypes = createRequestTypes('LOADTitleCategoryGet');
export const TitleCategoryGet = {
    request: (opt) => action(LOADTitleCategoryGetTypes[REQUEST], opt),
    success: (opt, response) => action(LOADTitleCategoryGetTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(LOADTitleCategoryGetTypes[FAILURE], {opt, error}),
    update: (opt) => action(LOADTitleCategoryGetTypes[UPDATE], {opt}),

     
};

//文章编辑-辅助-标题列表
export const LOAD_TitleRules = 'LOAD_TitleRules';
export const LOADTitleRules = (opt) => action(LOAD_TitleRules, opt);

export const LOADTitleRulesGetTypes = createRequestTypes('LOADTitleRulesGet');
export const TitleRulesGet = {
    request: (opt) => action(LOADTitleRulesGetTypes[REQUEST], opt),
    success: (opt, response) => action(LOADTitleRulesGetTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(LOADTitleRulesGetTypes[FAILURE], {opt, error}),
     
};

//文章编辑-辅助-全网搜展开文章
export const LOAD_AssisNewsItem = 'LOAD_AssisNewsItem';
export const LOADAssisNewsItem = (opt) => action(LOAD_AssisNewsItem, opt);

export const LOADAssisNewsItemGetTypes = createRequestTypes('LOADAssisNewsItemGet');
export const AssisNewsItemGet = {
    request: (opt) => action(LOADAssisNewsItemGetTypes[REQUEST], opt),
    success: (opt, response) => action(LOADAssisNewsItemGetTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(LOADAssisNewsItemGetTypes[FAILURE], {opt, error}),
     
};



// 上传 word 新闻撰写

export const uploadWordTypes = createRequestTypes('UploadWord');
export const uploadWord = {
    request: (opt) => action(uploadWordTypes[REQUEST], opt),
    success: (opt, response) => action(uploadWordTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(uploadWordTypes[FAILURE], {opt, error}),
    clear:   ()=>action(uploadWordTypes[CLEAR], {})
};


export const AnalyzeLinkTypes = createRequestTypes('AnalyzeLink');
export const analyzeLink = {
    request: (opt) => action(AnalyzeLinkTypes[REQUEST], opt),
    success: (opt, response) => action(AnalyzeLinkTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(AnalyzeLinkTypes[FAILURE], {opt, error}),
    clear:   ()=>action(AnalyzeLinkTypes[CLEAR], {})
};


export const LOAD_CreateNews = 'LOAD_CreateNews';
export const LOADCreateNews = (opt) => action(LOAD_CreateNews, opt);

export const createNewsTypes = createRequestTypes('CreateNews');
export const createNews = {
    request: (opt) => action(createNewsTypes[REQUEST], opt),
    success: (opt, response) => action(createNewsTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(createNewsTypes[FAILURE], {opt, error}),
    clear:   ()=>action(createNewsTypes[CLEAR], {})
};

export const imageUploadTypes = createRequestTypes('ImageUpload');
export const imageUpload = {
    request: (opt) => action(imageUploadTypes[REQUEST], opt),
    success: (opt, response) => action(imageUploadTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(imageUploadTypes[FAILURE], {opt, error}),
    clear:   ()=>action(imageUploadTypes[CLEAR], {})
};

// 删除图片
export const imageDelTypes = createRequestTypes('ImageDel');
export const imageDel = {
    request: (opt) => action(imageDelTypes[REQUEST], opt),
    success: (opt, response) => action(imageDelTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(imageDelTypes[FAILURE], {opt, error}),
    clear:   ()=>action(imageDelTypes[CLEAR], {})
};

// 清除 writeInput

export const writeClearTypes = createRequestTypes('WriteClear');
export const writeClear = {
    clear:   ()=>action(writeClearTypes[CLEAR], {})
};

//加载任务列表
export const LOAD_ArticleTasks = 'LOAD_ArticleTasks';
export const LOADArticleTasks = (opt) => action(LOAD_ArticleTasks, opt);

export const LOAD_ArticleTasksTypes = createRequestTypes('ArticleTasks');
export const articleTasks = {
    request: (opt) => action(LOAD_ArticleTasksTypes[REQUEST], opt),
    success: (opt, response) => action(LOAD_ArticleTasksTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(LOAD_ArticleTasksTypes[FAILURE], {opt, error}),
    clear:   ()=>action(LOAD_ArticleTasksTypes[CLEAR], {})
};

//加载具体任务任务文章
export const LOAD_TaskArticle = 'LOAD_TaskArticle';
export const LOADTaskArticle = (opt) => action(LOAD_TaskArticle, opt);

export const LOAD_TaskArticleTypes = createRequestTypes('TaskArticle');
export const taskArticle = {
    request: (opt) => action(LOAD_TaskArticleTypes[REQUEST], opt),
    success: (opt, response) => action(LOAD_TaskArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(LOAD_TaskArticleTypes[FAILURE], {opt, error}),
    clear:   ()=>action(LOAD_TaskArticleTypes[CLEAR], {}),
    update:   (opt)=>action(LOAD_TaskArticleTypes[UPDATE], {opt})

};


//计算统计数据
export const calculationTypes = createRequestTypes('calculation');
export const calculation = {
    request: (opt) => action(calculationTypes[REQUEST], opt),
    success: (opt, response) => action(calculationTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(calculationTypes[FAILURE], {opt, error})
};

//删除生成的文章
export const deleteArticleTypes = createRequestTypes('deleteArticle');
export const deleteArticle = {
    request: (opt) => action(deleteArticleTypes[REQUEST], opt),
    success: (opt, response) => action(deleteArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(deleteArticleTypes[FAILURE], {opt, error})
};

//新增一条生成的文章
export const addoneArticleTypes = createRequestTypes('addoneArticle');
export const addOneArticle = {
    request: (opt) => action(addoneArticleTypes[REQUEST], opt),
    success: (opt, response) => action(addoneArticleTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(addoneArticleTypes[FAILURE], {opt, error})
};

//加载供选择的标题列表
export const LOAD_ProvideTitles = 'LOAD_ProvideTitles';
export const LOADProvideTitles = (opt) => action(LOAD_ProvideTitles, opt);

export const LOAD_ProvideTitlesTypes = createRequestTypes('ProvideTitles');
export const provideTitles = {
    request: (opt) => action(LOAD_ProvideTitlesTypes[REQUEST], opt),
    success: (opt, response) => action(LOAD_ProvideTitlesTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(LOAD_ProvideTitlesTypes[FAILURE], {opt, error}),
    clear:   ()=>action(LOAD_ProvideTitlesTypes[CLEAR], {}), 

};

//新闻理解图片添加
export const NewsAddImgTypes = createRequestTypes('NewsAddImg');
export const newsAddImg = {
    request: (opt) => action(NewsAddImgTypes[REQUEST], opt),
    success: (opt, response) => action(NewsAddImgTypes[SUCCESS], {opt, response}),
    failure: (opt, error) => action(NewsAddImgTypes[FAILURE], {opt, error}),
     
};