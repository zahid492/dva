
// 2 核心信息提炼，获取
export const selectCoreMessages = (state) => {
    return state.CoreMessages
};

// 2 新闻文章
export const selectArticle = (state) => {
    return state.Article
};

// 2 名词解释
export const selectNouns = (state) => {
    return state.Nouns
};

// 2 图片
export const selectCoreImages = (state) => {
    return state.CoreImages
};
export const selectCoreImagesCars = (state) => {
    return state.CoreImagesCars
};
// sys
export const selectSysImages = (state) => {
    return state.SysImages
};

// 2 商品
export const selectGoods = (state) => {
    return state.Goods
};

// 2 商品
export const selectExtRead = (state) => {
    return state.ExtRead
};

// 3 生成改编文章
export const selectArticles3 = (state) => {
    return {
        NewArticles:state.Articles3.NewArticles,
        count:state.Articles3.count
    }
};

// 4 我的文章
export const selectMyArticles4 = (state) => {
    return {
        MArticles:state.MyArticles4.MArticles,
        count:state.MyArticles4.count
    }
};

// 3 单个文章
export const selectOneArticle = (state) => {
    return state.OneArticle
};


