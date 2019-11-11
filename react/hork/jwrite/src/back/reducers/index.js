import * as Types from '../actions'
import _ from 'lodash'
import {combineReducers} from 'redux'
//import {loadingBarReducer} from 'react-redux-loading-bar'
import store from "store2";


// 1 文章+
function Article(state = {articleId: '', title: '', content: ''}, action) {

    if ((action.type === Types.ArticleTypes["SUCCESS"] ||action.type === Types.AnalyzeLinkTypes["SUCCESS"]) && action.response) {
        return Object.assign({},state,action.response.data,{setContent:true});
    }
    if (action.type === Types.AnalyzeLinkTypes["FAILURE"]) {
        return  Object.assign({},state,{articleId: '',title: '',content: '',setContent:true });
    }

    if (action.type === Types.ArticleTypes["CLEAR"] || action.type === Types.writeClearTypes["CLEAR"]) {
        return Object.assign({}, state, {articleId: '', title: '', content: '', clientName: "", industry: "", addDateTime:"",firstPara:'',midPara:'',endPara:'',setContent:false});
    }
    if (action.type === Types.ArticleTypes["UPDATE"]) {
        return Object.assign({}, state, {
            articleId: '',
            title: action.opt.title,
            content: action.opt.content,
            clientName: action.opt.customer,
            industry: action.opt.industry,
            setContent:false
        });
    }
    return Object.assign({}, state);
}

function Nid(state = {nid: ""}, action) {
    if (action.type === Types.AddArticleTypes["SUCCESS"] && action.response) {
        return {nid: action.response}
    }
    if (action.type === Types.AddArticleTypes["FAILURE"] && action.error) {
        return {nid: action.error}
    }
    if (action.type === Types.AddArticleTypes["CLEAR"]) {
        return {nid: ''}
    }


    return Object.assign({}, state);
}

// 2 核心信息提炼，获取
function CoreMessages(state = [], action) {
    if (action.type === Types.CoreMessagesTypes["SUCCESS"] && action.response) {
        console.log(action)
        return [].concat([], action.response.data)
    }

    return [].concat([], state);
}

// 2 相关名词解释，获取
function Nouns(state = [], action) {
    if (action.type === Types.NounsTypes["SUCCESS"] && action.response) {
        if (action.response.data === null) {
            return [];
        }
        return [].concat([], action.response.data)
    }

    return [].concat([], state);
}

// 2 图片解释，获取
function CoreImages(state = [], action) {
    if (((action.type === Types.CoreImagesTypes["SUCCESS"]) || (action.type === Types.CoreImagesEditTypes["SUCCESS"])) && action.response) {
        if (action.response === null) {
            return [];
        }
        return [].concat([], action.response.data)
    }

    return [].concat([], state);
}

function CoreImagesCars(state = [], action) {
    if ((action.type === Types.CoreImagesTypesCars["SUCCESS"]) && action.response) {
        if (action.response === null) {
            return [];
        }
        return [].concat([], action.response.data)
    }

    return [].concat([], state);
}

function SysImages(state = [], action) {
    if (action.type === Types.SysImagesTypes["SUCCESS"] && action.response) {
        if (action.response === null) {
            return [];
        }
        return [].concat([], action.response.data)
    }

    return [].concat([], state);
}

// 2 商品，获取
function Goods(state = [], action) {
    if (action.type === Types.GoodsTypes["SUCCESS"] && action.response) {
        if (action.response.data === null) {
            return [];
        }
        return [].concat([], action.response.data)
    }

    if (action.type === Types.GoodsEditLocTypes["SUCCESS"]) {
        if (action.opt.data === null) {
            return [];
        }
        return [].concat([], action.opt.data)
    }

    return [].concat([], state);
}

// 2 阅读，获取
function ExtRead(state = [], action) {
    if (action.type === Types.ExtReadTypes["SUCCESS"] && action.response) {
        if (action.response.data === null) {
            return [];
        }
        return [].concat([], action.response.data)
    }

    return [].concat([], state);
}

// 3 生成改编文章
function Articles3(state = {count: 0, current: 0, NewArticles: []}, action) {
    // 3
    if (action.type === Types.NewArticlesTypes["SUCCESS"] && action.response) {
        return {
            current: action.opt.index,
            count: action.response.count,
            NewArticles: action.response.data
        }
    }
    if (action.type === Types.Acticle3Clear["REQUEST"]) {
        return {
            count: 0, current: 0, NewArticles: 0
        };
    }
    //Acticle3Clear
    // 2->3
    if (action.type === Types.GenNewArticlesTypes["SUCCESS"] && action.response) {
        return {
            current: 0,
            count: 0,
            NewArticles: action.response

        }
    }
    if (action.type === Types.GenNewArticlesTypes["FAILURE"] && action.error) {
        //console.log(action.error);
        return {
            current: 0,
            count: 0,
            NewArticles: action.error

        }
    }
    if (action.type === Types.newArticleswithid["SUCCESS"] && action.error) {
        //console.log(action.error);
        return {
            current: 0,
            count: 0,
            NewArticles: action.error

        }
    }

    if (action.type === Types.NewArticlesTypes["CLEAR"] ) {
        //console.log(action.error);
        return {
            current: 0,
            count: 0,
            NewArticles: []

        }
    }
    return state
}

function ArticleIds(state = {count: 0, current: 0, NewArticlesWithid: []}, action) {

    if (action.type === Types.NewArticlesTypesID["SUCCESS"] && action.response) {
        return Object.assign({}, state, {
            current: action.opt.index,
            count: action.response.count,
            NewArticlesWithid: action.response.data
        })

    }

    //return state
    return Object.assign({}, state)
}

let ones = {
    one: {},
    go: null
};

function OneArticle(state = ones, action) {
    
    if (action.type === Types.OneArticleTypes["SUCCESS"]  && action.response) {
        // 如果选项中包含 跳转信息，那么更新state 后，带着跳转信息返回 step3
        //console.log("step3")  
       // action.response.data.keywords  = [];
        if (_.has(action.opt, "m")) {
            return Object.assign({}, state, {
                one: action.response.data,
                go: {
                    m: action.opt.m,
                    id: action.opt.id
                }
            })

            
        }

        if (_.isNull(action.response)) {
            return state;
        }
        // return action.response.data;

        return Object.assign({}, state, {
            one: action.response.data,
            go: null
        })

        
    }
    if (action.type === Types.OneArticleTypes["CLEAR"]) {

        return Object.assign({}, state, {go: {},one:{} })
    }
    if (action.type === Types.OneArticleTypes["UPDATE"]) {

        return Object.assign({}, state, {go: {m: action.opt.m,id: action.opt.id} })
    }


    return Object.assign({}, state);
}
 
function HotWords(state = {}, action) {
    if (action.type === Types.HotWordsTypes["SUCCESS"] && action.response) {
        if (action.response === null) {
            return {count: 0, data: []};
        }
        //return [].concat([], action.response.data)
        return action.response;

    }
    if (action.type === Types.HotWordsTypes["FAILURE"] && action.error) {

        return action.error;

    }
    return Object.assign({}, state);
}

// 从我的文章过来的原生广告
function ADs(state = {}, action) {
    if (action.type === Types.GetADTypes["SUCCESS"] && action.response) {
        if (action.response === null) {
            return {};
        }

        return action.response.data;
    }

    return Object.assign({}, state);
}

function ADsOver(state = "", action) {
    if (action.type === Types.AddADTypes["SUCCESS"] && action.response) {
        if (action.response === null) {
            return "";
        }

        return action.response
    }

    if (action.type === Types.AddADTypes["FAILURE"] && action.error) {

        return action.error

    }

    return state
}

function Account(state = {loginVisible: false}, action) {   
    if ((action.type === Types.loginTypes["SUCCESS"]
        || action.type === Types.accessLoginTypes["SUCCESS"])
        && action.response) {
        if (action.response === null) {
            return {msg: "登陆失败，请重新登录！", loginVisible: true,code:500};
        }

        if (!_.has(action.response, "accesstoken")) {

            if (action.response === "用户不存在") {
                return {msg: "用户不存在", loginVisible: true,code:401}
            }
            return {loginVisible: true}
        }
        let _account = action.response;

        action.response.roleModals = [];
        if(_account && _account.roleId)
        {
            action.response.roleModals = window.role[_account.roleId];
            if(!action.response.roleModals)
            {
                action.response.roleModals = window.role.all;
            }
        }else if(!_account.roleId){
            action.response.roleModals = window.role.all;
        }

        return _.extend({loginVisible: false}, action.response)
    }
    if (action.type === Types.loginoutTypes["SUCCESS"] && action.response) {
        return {loginVisible: true, accesstoken: ''}
    }
    if (action.type === Types.loginTypes["FAILURE"] || (action.error && action.error.code === 401)) {
        return {
            msg: action.error.errmsg,
            loginVisible: true,
            code:action.error.code
        }
    }
      if (action.error && action.error.code === 503) {
        return {
            msg: '服务器报错或AccessToken已经过期，请重新登录',
            loginVisible: true,
            code:503
        }
    }   
    if (action.type === Types.loginTypes["CLEAR"]) {
        return {
            accesstoken: '',
            loginVisible: true
        }
    }
    if (action.type === Types.loginoutTypes["FAILURE"]) {
        return {
            loginVisible: true
        }
    }

    return state

}

function ClientInfo(state = [], action) {
    
    if (action.type === Types.clientTypes["SUCCESS"] && action.response) {
        if (action.response === null) {
            return [];
        }      
        return action.response
    }

    return state;
}

// 我的文章
function MyArticles4(state = {count: 0, current: 0, MArticles: []}, action) {
    if (action.type === Types.MyArticlesTypes["SUCCESS"] && action.response) {
        return {
            current: action.opt.index,
            count: action.response.count,
            MArticles: action.response.data
        }
    }
    if (action.type === Types.MyArticlesTypes["CLEAR"] ) {
        return {
            current: 1,
            count: 0,
            MArticles: []
        }
    }
    return state
}

// 1->2
function Trend2Nid(state = {nid: ""}, action) {
    if (action.type === Types.AddTrendTypes["SUCCESS"] && action.response) {
        return {nid: action.response}
    }

    if (action.type === Types.AddTrendTypes["FAILURE"] && action.error) {
        return {nid: action.error}
    }

    return state;
}

// 借势传播 trend2
function Trend2(state = {}, action) {
    if (action.type === Types.Trend2Types["SUCCESS"] && action.response) {
        return action.response.data
    }

    return state
}

function Tags(state = {}, action) {
    if (action.type === Types.TagsTypes["SUCCESS"] && action.response) {
        if (action.response === null) {
            return {count: 0, data: []};
        }
        return action.response;

    }
    if (action.type === Types.TagsTypes["FAILURE"] && action.error) {

        return action.error;

    }
    return state
}

function KeyInfo(state = {}, action) {
    if (action.type === Types.KeyInfoTypes["SUCCESS"] && action.response) {
        if (action.response === null) {
            return {count: 0, data: []};
        }

        return action.response;
    }

    if (action.type === Types.KeyInfoTypes["FAILURE"] && action.error) {
        return action.error;
    }

    return state
}

// 3 生成借势热点
function Trend3sT(state = {count: 0, current: 0, NewTrend3s: []}, action) {
    // 3
    if (action.type === Types.NewTrend3sTypes["SUCCESS"] && action.response) {
        return {
            current: action.opt.index,
            count: action.response.count,
            NewTrend3s: action.response.data
        }
    }

    return state
}

// 一键改编
function Adapt(state = {Adaptation: "", _id: 0}, action) {
    if ((action.type === Types.CoreMessagesTypes["SUCCESS"] || action.type === Types.MyArticlesTypes["SUCCESS"]) && action.response) {
        return {Adaptation: "", _id: 0}
    }

    if (action.type === Types.GenAdaptTypes["SUCCESS"] && action.response) {
        return {Adaptation: action.response, _id: action.opt.newArticleId}
    }

    if (action.type === Types.GenAdaptTypes["FAILURE"] && action.error) {
        return {Adaptation: action.error, _id: action.opt.newArticleId}
    }

    return state;
}

// 3 生成借势文章列表
function Trend4sT(state = {count: 0, current: 0, NewTrend4s: []}, action) {

    // 4
    if (action.type === Types.NewTrend4sTypes["SUCCESS"] && action.response) {
        return {
            current: action.opt.index,
            count: action.response.count,
            NewTrend4s: action.response.data
        }
    }
    // 3->4
    if (action.type === Types.GenNewTrend4sTypes["SUCCESS"] && action.response) {
        return {
            current: 0,
            count: 0,
            NewTrend4s: action.response

        }
    }

    if (action.type === Types.GenNewTrend4sTypes["FAILURE"] && action.error) {
        return {
            current: 0,
            count: 0,
            NewTrend4s: action.error

        }
    }
    return state
}

//指示文章列表页是否是刚刚生成跳转过来的
function Acticle_inGenerate(state = {NewsGenerate: false}, action) {
    let ingernerate = store.session.get('Acticle_inGenerate');
    if (ingernerate) {
        state = Object.assign({}, state, ingernerate)
    }

    if (action.type === 'Acticle_inGenerate') {
        store.session.set('Acticle_inGenerate', action.data)
        return Object.assign({}, state, action.data)
    }

    return Object.assign({}, state);
}


function ActileEditNew(state = {}, action) {
    if ((action.type === Types.editAssistGetTypes['SUCCESS'] || action.type === Types.editAssisImgtGetTypes['SUCCESS']) && action.response) {
        let _d = action.response.data;
        let _type = action.opt.tabTag;
        let key = decodeURI(action.opt.key);
        if(!_d)
        {
            _d = [];
        }
        if(!state[_type + key])
        {
            state[_type + key] = [];
        }
        if(state[_type + key].length < 1000)
        {
            let  _data = [...state[_type + key], ..._d]; 

            if(action.opt.tabTag === -7001)
            {
                _data = [..._d];
            } 
            /* else if(action.opt.tabTag === -3)
            {
                _data = [..._d];
            }  */ 
            state[_type + key] = _data;
        }
        
         
    }
    if ((action.type === Types.editAssistGetTypes['FAILURE'] || action.type === Types.editAssisImgtGetTypes['FAILURE']) && action.error) {
        
        let _type = action.opt.tabTag;
        let key = decodeURI(action.opt.key);

        if(!state[_type + key])
        {
            state[_type + key] = [];
        }        
         
    }

    // todo 所有请求数据在退出时候都要进行清理操作
     if ( action.type === Types.loginoutTypes["SUCCESS"]
        || action.type === Types.loginTypes["FAILURE"] 
        || action.type === Types.loginTypes["CLEAR"]) { 
            state = {};       
    } 
 
    if (action.type === Types.editAssistGetTypes['CLEAR']) {
        let _type = action.opt.tabTag;
        let key = decodeURI(action.opt.key);
        if(!_type)
        {
            state = {};  
        }
        else if(state[_type + key])
        {
            let k =  _type + key
            delete state[k]
            //state[] = null;
        }        
    }
    if (action.type === Types.editAssistDelTypes['SUCCESS']) {
        let id = action.opt.id;
        let _type = action.opt.tabTag;
        let key = decodeURI(action.opt.key);
        let index = state[_type + key].findIndex(item => item._id === id);
        state.splice(index, 1);
        
    }
    //全网搜-展开
    if (action.type === Types.LOADAssisNewsItemGetTypes['SUCCESS'] && action.response) {
         let item = action.response.data;
         let url = action.opt.url;
         let content = item.content;
         let _type = action.opt.tabTag;
         let key = decodeURI(action.opt.key);
         if(state[_type + key].length > 0)
         {
          let curitem = state[_type + key].find(t=>t.url === url);
          if(curitem)
          {
            curitem.content = content;
            curitem.extend = 1;
          }
         }
    }

    return Object.assign({}, state);
}

function ActileMaterialData(state = {m6:[],m7:[]}, action) {
    if (action.type === Types.materialGetTypes['SUCCESS']  && action.response) {
        let _d = action.response.data;
        let _type = action.opt.newstype;
         
        state['m' + _type] = _d ? _d:[];
         
    }
    if (action.type === Types.materialGetTypes['FAILURE']  && action.error) {
        return Object.assign({}, state,{m6:[],m7:[]});    
    }

    if (action.type === Types.materialGetTypes['CLEAR']) {       
         return Object.assign({}, state,{m6:[],m7:[]});
    }    
    return Object.assign({}, state);
}
function ActileProviderTitlesData(state = [], action) {
    if (action.type === Types.LOAD_ProvideTitlesTypes['SUCCESS']  && action.response) {       
        state  =  action.response.data;        
    }
    if (action.type === Types.LOAD_ProvideTitlesTypes['FAILURE']  && action.error) {
        return [];        
    }

    if (action.type === Types.LOAD_ProvideTitlesTypes['CLEAR']) {       
         return [];
    }    
    return Object.assign([], state);
}

//文章编辑页-辅助模块-标题分类列表
function ActileEditTitleCategory(state = {data:[],defaultID:''},action)
{ 
    if(action.type === Types.LOADTitleCategoryGetTypes['SUCCESS'] && action.response)
    {    
        let defaultid = '';
        if(action.response.data.length > 0)
        {
            defaultid = action.response.data[action.response.data.length -1]._id;
        }
        return  Object.assign({},state,{data:action.response.data,defaultID:defaultid});
    } 
    if(action.type === Types.LOADTitleCategoryGetTypes['UPDATE'] )
    {      
        return  Object.assign({},state,{defaultID:action.opt.defaultID});
    } 
    return Object.assign({},state);
}
function Subjects(state = [],action)
{
    if (action.type === Types.editAssistImgSubjectGetTypes['SUCCESS'] && action.response) {

        return Object.assign([], action.response.data);
    }
    return Object.assign([], state);
}


/*
function ComposeUnderstand(state = {}, action) {
    if (action.type === Types.composeUnderstandGenerateTypes['SUCCESS']) {
        return Object.assign([], {
            redirect: action.opt.redirect,
            pointid: 1,
            redirectUrl: '/compose/understand/1/1'   //有数据后拼个链接 '/compose/understand/文章id/要点ID'
        });
    }
    if (action.type === Types.composeUnderstandGenerateTypes['CLEAR']) {
        return Object.assign([], {
            redirect: false,
            pointid: '',
            redirectUrl: ''
        });
    }

    return Object.assign([], state);
}

function Compose(state = {}, action) {
    if (action.type === Types.composeTypes['CLEAR']) {
        return Object.assign([], {
            redirect: false,
            pointid: '',
            redirectUrl: ''
        });
    }

    return Object.assign([], state);
}
*/
// 上传 word 文件
var initUploadWordState = { articleId : '',
                            title: '', 
                            content: '', 
                            clientName:'', 
                            industry:'', 
                            addUser:'', 
                            addDateTime:'',
                            errmsg:'',
                            count:0,
                            clients:[],
                            upload:false,
                            from:'task'
                        }
function UploadWord(state = initUploadWordState, action) {
    if (action.type === Types.uploadWordTypes["SUCCESS"]  && action.response) {
        return Object.assign({}, state, action.response,{upload:true,from:'', clientName:'', industry:''});
    }
    /* if (action.type === Types.clientTypes["SUCCESS"] && action.response) {
        state.clients =  action.response;       
    } */
    if ( action.type === Types.AnalyzeLinkTypes["SUCCESS"] && action.response) {    
        /* if(action.response.data)
        {
            //分析标题中是否存在客户名称，包含客户名称的给予默认值
            var title = action.response.data.title;
            var clients = state.clients;
            if(clients && clients.length > 0)
            {
                let _clients = [];
                clients.forEach(client=>{
                     var clientname = client.clientName;
                     if(clientname =='百度人工智能')
                        {
                            clientname = '百度';
                        }
                     if(title.indexOf(clientname) > -1)
                     {                        
                        _clients.push(Object.assign({}, client,{_index:title.indexOf(clientname)}))
                     }
                      
                });

                if(_clients.length > 0)
                {
                    _clients.sort((c1,c2)=>{return c1._index - c2._index});
                    let client = _clients[0];
                    state.clientName = client.clientName;
                    state.industry = client.industry;
                }
            }
        }   */
        return Object.assign({}, state, action.response.data,{upload:true,from:''});
    }
    if ( action.type === Types.LOAD_TaskArticleTypes["SUCCESS"] && action.response) {        
        return Object.assign({}, state, action.response.data,{upload:true,from:'task'});
    }

    if ((action.type === Types.uploadWordTypes["FAILURE"] || action.type === Types.AnalyzeLinkTypes["FAILURE"] )&& action.error) {
        return Object.assign({}, state, {errmsg:action.error.errmsg,upload:false});
    }
    if (action.type === Types.uploadWordTypes["CLEAR"] || action.type === Types.writeClearTypes["CLEAR"] || action.type === Types.AnalyzeLinkTypes["CLEAR"]) {
        return Object.assign({}, state, {articleId: '', title: '', content: '', clientName:'', industry:'', addUser:'', addDateTime:'',errmsg:'',upload:false});
    }

    return Object.assign({}, state);
}

function WriteImageUpload(state = [], action) {
    if (action.type === Types.imageUploadTypes["SUCCESS"] && action.response) {
        return _.concat([], state, [{uid:action.opt.file.uid, id: action.response}]);
    }

    if (action.type === Types.imageUploadTypes["CLEAR"] || action.type === Types.writeClearTypes["CLEAR"]) {
        return [];
    }

    return Object.assign({}, state);
}

function WriteImagesDel(state = [], action) {
    if (action.type === Types.imageDelTypes["SUCCESS"] && action.response) {
        return _.concat(state, [{uid:action.opt.uid}]);
    }

    if (action.type === Types.imageDelTypes["CLEAR"] || action.type === Types.writeClearTypes["CLEAR"]) {
        return [];
    }

    return Object.assign({}, state);
}

// 新闻撰写生成
function CreateNews(state={nid:""}, action){
    if (action.type === Types.createNewsTypes['SUCCESS'] && action.response) {
        return {nid: action.response}
    }

    if (action.type === Types.createNewsTypes["FAILURE"] && action.error) {
        return {nid: action.error}
    }

    if (action.type === Types.createNewsTypes["CLEAR"]) {
        return {nid:""};
    }

    return Object.assign({}, state);
}

// 新闻撰写生成
function ArticleTasks(state=[], action){
    if (action.type === Types.LOAD_ArticleTasksTypes['SUCCESS'] && action.response) {
        return action.response.data
    }

    if (action.type === Types.createNewsTypes["FAILURE"] && action.error) {
        return  []
    }

    if (action.type === Types.createNewsTypes["CLEAR"]) {
        return  [];
    }

    return Object.assign([], state);
}

// 新闻撰写生成
function ArticleTask(state={taskid:'',count:0}, action){
     if ( action.type === Types.LOAD_TaskArticleTypes["SUCCESS"] && action.response) {        
        return Object.assign({}, state, {count:action.response.data.count});
    } 
    if ( action.type === Types.createNewsTypes["SUCCESS"]) {     //生成文章后，清空选中的任务ID   
        return Object.assign({}, state, {taskid:'',count:0});
    } 
    
    if (action.type === Types.LOAD_TaskArticleTypes["CLEAR"]) {
        return  Object.assign({}, state,{taskid:'',count:0});
    }
    if (action.type === Types.LOAD_TaskArticleTypes["UPDATE"]) {
        return  Object.assign({}, state,{taskid:action.opt.taskid});
    }
    return Object.assign({}, state);
}

const rootReducer = combineReducers({
    Nid,
    Article,
   CoreMessages,
    Nouns,
    CoreImages,
    SysImages,
    Goods,
    ExtRead,
    Articles3,
    ArticleIds,
    OneArticle,
    //HotWords,
    //ADsOver,
    Account,
    ClientInfo,
    MyArticles4,
    //ADs,
    //loadingBar: loadingBarReducer,
    CoreImagesCars,
    Trend2Nid,
    Trend2,
    Trend3sT,
    KeyInfo,
    Tags,
    Trend4sT,
    Adapt,
    Acticle_inGenerate,
    ActileEditNew,
    Subjects,
    ActileEditTitleCategory,
    UploadWord,
    CreateNews,
    WriteImagesDel,
    WriteImageUpload, 
    ActileMaterialData,
    ArticleTasks,
    ArticleTask,
    ActileProviderTitlesData,
});

export default rootReducer
