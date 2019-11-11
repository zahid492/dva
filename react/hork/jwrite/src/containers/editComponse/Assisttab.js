import React from 'react'; 

const Tabs = [  {tabTag :-3,id:'hotlist_3',title:'标题',newsType:null},
                {tabTag :-7,id:'hotlist_7',title:'内文',newsType:[6,7,-7001]},
                
                {tabTag :-1,id:'hotlist_1',title:'图片',newsType:null},
                {tabTag :-6,id:'hotlist_6',title:'全网搜',newsType:null},
                /* {tabTag :-4,id:'hotlist_4',title:'名词解释',newsType:null}, */
                {tabTag :-5,id:'hotlist_5',title:'原文',newsType:null},
                {tabTag :-2,id:'hotlist_2',title:'收藏',newsType:null},
                
              /*  {tabTag :5,id:'hotlist5',title:'常用'},
                {tabTag :2,id:'hotlist2',title:'企业'},
                {tabTag :3,id:'hotlist3',title:'观点'},
                {tabTag :4,id:'hotlist4',title:'热点'} */
            
            ];


class TabList extends React.Component{
    render(){ 
            let tabs = [];
           if(this.props.tabs)
           {
                 this.props.tabs.forEach(v=>{
                        let items =  Tabs.filter(t=>t.tabTag == v);
                        if(items.length > 0)
                        {
                            tabs.push(items[0])
                        }
                });
           }
           else{
            tabs = [...Tabs]
           }
           var  aLiEles = tabs.map((item,i)=>{
              var targetId = item.id;
              if(i < tabs.length/2)
              {
                targetId = tabs[0].id;
              }
              if(i > tabs.length/3 * 2)
              {
                targetId = tabs[tabs.length-1].id;
              }
             return <li key={item.id} className={this.props.tabTag === item.tabTag ? 'active' : ''} id={item.id} onClick={() => this.props.fun(item.tabTag, targetId,item.newsType)}>
                        <span>{item.title}</span>
                    </li>
          });
          return (
            <ul className="blist scroll clearfix" style={{width: '650px'}}>
                {aLiEles}
            </ul>
          )
    }
}
 
export default TabList



/****

<ul className="blist scroll clearfix" style={{width: '650px'}}>
                                                       <li className={this.state.tabTag === -3 ? 'active' : ''}
                                                            id='hotlist_3' onClick={() => this.tabChange(-3, 'hotlist_3')}>
                                                            <span>标题</span>
                                                        </li>
                                                        <li className={this.state.tabTag === 6 ? 'active' : ''}
                                                            id='hotlist6' onClick={() => this.tabChange(6, 'hotlist_3')}>
                                                            <span>全网搜</span>
                                                        </li>
                                                        <li className={this.state.tabTag === -1 ? 'active' : ''}
                                                            id='hotlist_1'
                                                            onClick={() => this.tabChange(-1, 'hotlist_3')}>
                                                            <span>图片</span>
                                                        </li>
                                                        <li className={this.state.tabTag === -4 ? 'active' : ''}
                                                            id='hotlist_4' onClick={() => this.tabChange(-4, 'hotlist_3')}>
                                                            <span>名词解释</span>
                                                        </li>
                                                        <li className={this.state.tabTag === -5 ? 'active' : ''}
                                                            id='hotlist_5'
                                                            onClick={() => this.tabChange(-5, 'hotlist_5')}>
                                                            <span>原文</span>
                                                        </li>
                                                        <li className={this.state.tabTag === -2 ? 'active' : ''}
                                                            id='hotlist_2'
                                                            onClick={() => this.tabChange(-2, 'hotlist_2')}>
                                                            <span>收藏</span>
                                                        </li>
                                                        <li className={this.state.tabTag === 1 ? 'active' : ''}
                                                            id='hotlist1' onClick={() => this.tabChange(1, 'hotlist1')}>
                                                            <span>行业</span>
                                                        </li>

                                                        <li className={this.state.tabTag === 5 ? 'active' : ''}
                                                            id='hotlist5' onClick={() => this.tabChange(5, 'hotlist5')}>
                                                            <span>常用</span>
                                                        </li>
                                                        <li className={this.state.tabTag === 2 ? 'active' : ''}
                                                            id='hotlist2' onClick={() => this.tabChange(2, 'hotlist4')}>
                                                            <span>企业</span>
                                                        </li>
                                                        <li className={this.state.tabTag === 3 ? 'active' : ''}
                                                            id='hotlist3' onClick={() => this.tabChange(3, 'hotlist4')}>
                                                            <span>观点</span>
                                                        </li>
                                                        <li className={this.state.tabTag === 4 ? 'active' : ''}
                                                            id='hotlist4' onClick={() => this.tabChange(4, 'hotlist4')}>
                                                            <span>热点</span>
                                                        </li>
                                                       
                                                    </ul>


 */