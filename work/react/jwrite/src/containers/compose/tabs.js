import React from 'react'; 

const Tabs = [  {tabTag :2,id:'hotlist2',title:'内文',newsType:[]},
                {tabTag :1,id:'hotlist1',title:'模块',newsType:null},
                {tabTag :-3,id:'hotlist_1',title:'标题',newsType:null},
                {tabTag :-6,id:'hotlist_6',title:'图片',newsType:null}, 
                {tabTag :-5,id:'hotlist_5',title:'全网搜',newsType:null}, 
                {tabTag :6,id:'hotlist6',title:'素材搜',newsType:null}, 

 

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

 