import React, {Component} from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import { message,Select} from 'antd';
import * as actions from "@/store/actions";
import NewsStep from '@/components/Step/NewsStep'
import CoreMessages from '@/components/Understand/CoreMessages'
import Noun from '@/components/Understand/Noun'
import CoreImage from '@/components/Understand/CoreImage'
import Goods from '@/components/Understand/Goods'
import ExtRead from '@/components/Understand/ExtRead'
import store from "store2";
import Loading from '@/components/Loading';
import  '@/style/modal.css'
const Option = Select.Option;


class News2 extends Component {
    constructor(props) {
        super(props);
         
        this.state = {
            fron:this.props.match.params.fron,
            NewArticles: 0,
            nid: this.props.match.params.nid,
            coreHeight: "95px",
            Article: {},
            CMessages: [],
            Nouns: [],
            Goods: [],
            ExtRead: [],
            SysImages: [],
            CoreImages:[],
            CoreImagesCars:[],
            editCMVisible : false,
            editNounVisible:false,
            editGoodsVisible:false,
            editReadVisible:false,
            loading:false,
            articleNum: 1000,
        }
    }

    // 发送请求信息
    static getDerivedStateFromProps(nextProps, prevState) {     
            return {
                Article: nextProps.Article,
                CMessages: nextProps.CMessages,
                Nouns: nextProps.Nouns,
                CoreImages: nextProps.CoreImages,
                Goods: nextProps.Goods,
                ExtRead: nextProps.ExtRead,
                SysImages: nextProps.SysImages,
                NewArticles: nextProps.NewArticles,
                CoreImagesCars:nextProps.CoreImagesCars
            }       
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(_.has(this.state.NewArticles,'errmsg'))
        {       
              message.destroy();    
              message.error(this.state.NewArticles.errmsg); 
              this.setState({loading:false,NewArticles:0},()=>{
                  this.props.dispatch(actions.acticleClear.request());
              });         
        }
        else if(!Array.isArray(this.state.NewArticles) && this.state.NewArticles > 0 ){
            this.props.history.push("/news/news3/" + this.state.nid + '/ar')           
        }
    }

    componentDidMount(prevProps, prevState) {       
        const pnid = this.props.match.params.nid;        
        this.props.dispatch(actions.loadArticle({nid: pnid}));//文章
        this.props.dispatch(actions.loadCoreMessages({nid: pnid, topNumber: 10})); //核心信息
        this.props.dispatch(actions.loadNouns({nid: pnid})); //名词解释
        this.props.dispatch(actions.loadCoreImages({nid: pnid}));//相关图片
        this.props.dispatch(actions.loadGoods({nid: pnid}));//推荐商品
        this.props.dispatch(actions.loadExtRead({nid: pnid}));//延伸阅读
        this.props.dispatch(actions.loadCoreImagesCars({nid: pnid})); //相关图片涉及的类型
 
        window.scrollTo(0,0);
       
        this.props.history.listen((location, action) => {
            store.session("news2nid", this.props.match.params.nid);
        });
    }

    coreHeight = (e) => {
        if (this.state.coreHeight == "95px") {
            this.setState({
                coreHeight: "auto"
            })
            e.target.className = "up"
        } else {
            this.setState({
                coreHeight: "95px"
            })
            e.target.className = "down"
        }
    };

    // 生成
    toNextClick = () => {
        this.props.dispatch(actions.Acticle_inGenerate({
            NewsGenerate: true
        }));
        this.setState({loading:true},()=>{
                    this.props.dispatch(actions.genNewArticles.request({
                        nid: this.props.match.params.nid,
                        count: this.state.articleNum
                    }));
                });
     
    };
    toPrevClick = ()=>{
        this.props.history.push("/news/news1/" + this.state.nid)
    }
    showEditModal =(properties,v)=>{
            this.setState({
                [properties]:v
            });
    }

    articleNum = (val) =>{
        this.setState({
            articleNum: val
        })
    }

    render() {
         
        const { Nouns} = this.state;
        const frommy = _.isUndefined(this.props.match.params.fron) ? "block" : "none";
        
        let oldContent = this.state.Article && _.has(this.state.Article, "content") && this.state.Article.content.replace(/\n/g, "<br/>");
        var checkedMSG = this.state.CMessages.filter(m=> m.checked == 1);
        var MScounts = checkedMSG.length;
        var checkedNouns = Nouns.filter(m=> m.checked == 1);
        var NOUNcounts = checkedNouns.length;
        var checkedGoods = this.state.Goods.filter(m=> m.checked == 1);
        var goodscounts = checkedGoods.length;
        var checkedRead = this.state.ExtRead.filter(m=> m.checked == 1);
        var readcounts = checkedRead.length;

        return (
            <div>
                <Loading loading ={this.state.loading} />
                <NewsStep step={2}></NewsStep>
                <div className="content__box">
                    <section className="news-understand">
                        <div className="news-original">
                           {SectionTitle('新闻原稿')}
                            
                            <div className="dropdownBox">
                                <div className="hidden" id="hidden" style={{height: this.state.coreHeight}}>
                                    <section>
                                        <span>标题：</span>
                                        <p>{this.state.Article && this.state.Article.title}</p>
                                    </section>
                                    <section id="content">
                                        <span>内容：</span>
                                        <p  style={{lineHeight: '32px'}} dangerouslySetInnerHTML={{__html: oldContent ? oldContent : ''}}></p>
                                    </section>
                                </div>
                                <button className="down" id="textBtn" onClick={this.coreHeight}></button>
                            </div>
                        </div>
                        { SectionContent(this,'核心信息提炼',MScounts,this.state.CMessages,1,'编辑核心信息','editCMVisible',frommy,<CoreMessages CMessages={this.state.CMessages} editCMVisible = {this.state.editCMVisible} close = {()=>{this.showEditModal('editCMVisible',false)}}
                                           {...this.props}></CoreMessages>)}

                        { SectionContent(this,'相关名词解释',NOUNcounts,this.state.Nouns,2,'编辑相关名词','editNounVisible',frommy,  <Noun Nouns={Nouns} editNounVisible = {this.state.editNounVisible} close = {()=>{this.showEditModal('editNounVisible',false)}} {...this.props}></Noun> )}

                        <div className="section-box">
                           {SectionTitle('相关图片推荐')}
                             
                            <CoreImage {...this.props} CoreImages = {this.state.CoreImages} CoreImagesCars = {this.state.CoreImagesCars} SysImages = {this.state.SysImages} nid={this.props.match.params.nid}></CoreImage>
                        </div>
                        { this.state.Goods.length > 0 && SectionContent(this,'相关产品',goodscounts,this.state.Goods,3,'编辑产品','editGoodsVisible',frommy, <Goods Goods={this.state.Goods} editGoodsVisible = {this.state.editGoodsVisible} close = {()=>{this.showEditModal('editGoodsVisible',false)}}  {...this.props}></Goods> )}
                        { SectionContent(this,'延伸阅读',readcounts,this.state.ExtRead,4,'编辑延伸阅读','editReadVisible',frommy,  <ExtRead ExtRead={this.state.ExtRead} editReadVisible = {this.state.editReadVisible} close = {()=>{this.showEditModal('editReadVisible',false)}}   {...this.props}></ExtRead> )}
                         
                        <div className="form-drop" style={{display: _.isUndefined(this.state.fron)?"block":"none",lineHeight: '28px',marginTop: '10px'}}>
                            <label style={{color: '#222'}}>生成文章篇数</label>
                            <Select   value={this.state.articleNum} onChange={this.articleNum}> 
                                <Option value={10}>10</Option>
                                <Option value={20}>20</Option>
                                <Option value={50}>50</Option>                    
                                <Option value={100}>100</Option>
                                <Option value={300}>300</Option>
                                <Option value={500}>500</Option>
                                <Option value={1000}>1000</Option>

                            </Select>
                        </div>
                    </section>
                    <div className="btn-box" style={{display: _.isUndefined(this.state.fron)?"block":"none"}}>
                    {/* <button className="btn" onClick={this.toPrevClick}>返回</button>  */} <button className="btn" onClick={this.toNextClick}>改编新闻</button>
                    </div>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const NewArticles = state.Articles3.NewArticles;
    const {
        Article,
        CoreMessages,
        Nouns,
        CoreImages,
        SysImages,
        Goods,
        ExtRead,
        CoreImagesCars

    } = state;
    
    return {
        NewArticles: NewArticles,
        Article: Article,
        CMessages: CoreMessages,
        Nouns: Nouns,
        CoreImages: CoreImages,
        Goods: Goods,
        ExtRead: ExtRead,
        SysImages: SysImages,
        CoreImagesCars:CoreImagesCars
    }
}

const SectionTitle = (title)=>{
   return <h3 className="title">{title}</h3>
}

const CountEle = (count)=>{
    return <div className="top"><span>已勾选数量：{count}</span></div>
 }

 const EditButt = (title,callback,display)=>{
    return <button onClick={callback} style={{display: display, margin: '0 auto'}}>
                <i className="iconfont icon-edit"></i>{title}
            </button>
 }
 const SectionContent = (_this,title,counts,datas,listtype,buttTitle,visible,frommy,modalEle)=>{
    return  <div className="section-box">
    {SectionTitle(title)}
    <div className="section-box__con">
     {CountEle(counts)}
      
     <div className="content">
         <ul>
             {datas && datas.filter(item=>item.checked == 1).map((v, i) => {
                
                     return (
                         <li key={v.rid}>
                             {LiContent(v,listtype,i+1)}
                         </li>
                     )
                 
             })}

         </ul>
      {EditButt(buttTitle,()=>{_this.showEditModal(visible,true)},frommy)}   
      {modalEle}                                                             
      
     </div>
   </div>
 </div>
 }

 const LiContent = (item,type,index) =>{
     var ele = '';
     switch(type)
     {
        case 1 : ele = <span><i>{index}</i> <span style={{display:'inline-block',width:'95%'}}> {item.content}</span></span>;break;
        case 2 : ele = <span><i>{index}</i>  <span style={{display:'inline-block',width:'95%'}}>{item.name}：{item.content}</span></span>;break;
        case 3 : ele = <div>
              <span>{item.name} : </span>
        {
            item.webSites && item.webSites.map((site,j)=>{
                return site.url ? <span  key={j} style={{display:'inline-block',paddingRight:'10px'}}><a href={site.url} target="_blank">{site.title}</a></span> : ''
            })
        }
        </div>
        break; 
        case 4 : ele = <a href={item.link} target="_blank">{item.title}</a>;break;
        default : break;
     }
     return ele;
 }

export default connect(mapStateToProps)(News2)

