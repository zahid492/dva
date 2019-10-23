import React from 'react'; 
import {Input,Icon,Tag,message} from 'antd'
import * as apiUrl from '@/services/ApiUrl';
import $ from 'jquery'


class TagsTitle extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        editTagIndex : -1,
        editTagContent:''
      }

    }
//修改标题
TagTitleChange = (e)=>{ 
      this.props.changeTitle();
      var v = $.trim(e.target.value);
       if(v.length > this.props.titleMaxCount)
      {
          message.warn('标题字数已经超过' + this.props.titleMaxCount);
          return;
      } 
      var Titles = this.props.Titles;
      var split = this.props.split;

      var _title = Titles[this.state.editTagIndex];
      var _titles = _title.split(split);
      if(_titles.length === 3)
      {
        var _id = _titles[0];
        var _source = _titles[1];        
        v = _id + split + _source + split + v;
      }
      this.setState({
         editTagContent:v
      });
  }
//主要用于辅助框添加标题时，默认为编辑状态
SetChange = (index)=>{ 
    var  Titles = this.props.Titles;
    this.setState({
      editTagIndex:index,
      editTagContent:Titles[index]
    });
}

//保存标题
TagSave = (index)=>{
    this.props.changeTitle();

    var Titles = this.props.Titles;
    var value = $.trim(this.refs.editTagref.input.value);
    if(value.length > this.props.titleMaxCount)
    {
        message.destroy();
        message.info('标题长度不能大于' + this.props.titleMaxCount);
    }else if(value === ''){
        Titles.splice(index,1);  //内容清空了，删除此标题
        this.setState({
            editTagIndex : -1,
            editTagContent:''
        },()=>{this.props.save(Titles)});

    }else{
       
      var split = this.props.split;
      var _title = Titles[index];
      var _titles = _title.split(split);
      if(_titles.length === 3)
      {
        var _id = _titles[0];
        var _source = _titles[1];        
        value = _id + split + _source + split + value;
      }

        Titles[index] = value;
        this.setState({
            editTagIndex : -1,
            editTagContent:''
        },()=>{this.props.save(Titles)});
    }
    
}

 //关键词插入副标题
insertToEditTitle = (keyword) =>{
    var input = this.refs.editTagref.input;
    var start = input.selectionStart;
    var end = input.selectionEnd;
    
    input.setRangeText(keyword,start,end);
    input.selectionStart = start + keyword.length;
    input.selectionEnd = end + keyword.length;
    var value =  input.value;
    this.setState({ 
      editTagContent:value
    });
      
}
    //点击副标题标签，使其变为编辑状态
clickTag = (e)=>{     
      e.preventDefault();
       var tagEle = e.target;
      var v = tagEle.getAttribute('value'); 
      var title = tagEle.textContent;
      
      this.setState({           
          editTagIndex : v ,
          editTagContent:title
      });
  }
//删除标题
closeTag = (e)=>{ 
    this.props.changeTitle();
    e.preventDefault();
    
    var tagEle = e.target.parentNode;
    while(!tagEle.hasAttribute('value'))
    {
            tagEle = tagEle.parentNode;
    }
    var v = tagEle.getAttribute('value'); 

    var Titles = this.props.Titles;
    Titles.splice(v,1);

    var index = this.state.editTagIndex;
    if(index && index > v)
       {        
            this.setState({ 
                editTagIndex : index - 1
            });
       }  
      
       this.props.save(Titles)
      
    }
  render(){   
         const _this = this;
         const {Titles,titleMaxCount,keywords,split} = this.props;
         const {editTagIndex,editTagContent} = this.state;
                
          //其它标题
          let titlesEle = Titles.map((title,index)=>{             
              var editContent = '';
              var _titles = title.split(split);
              if(_titles.length === 3)
              {
                editContent = _titles[2];
              }
              else{
                editContent = title;
              }

          if(editTagIndex == index)
          {
            var _content = editTagContent;
            var _contents = _content.split(split);
            if(_contents.length === 3)
            { 
                _content = _contents[2];
            }
             return  <div key={index}>
                          <div className="editable-cell">
                                <div className="editable-cell-input-wrapper">
                                      <Input  key={index}  ref = 'editTagref'  value = {_content}  addonAfter= {_content.length + '/' + titleMaxCount}    
                                              onChange = {this.TagTitleChange}   onPressEnter = {_this.TagSave.bind(_this,index)}/>
                                      <Icon type="check" className="editable-cell-icon-check"   onClick={_this.TagSave.bind(_this,index)}  style={{zIndex:100}}/>
                                </div>
                          </div>
                          <div style={{backgroundColor: '#ededed',textAlign: 'left',padding: '10px 0 0 10px',margin:'5px 0'}}>
                                { keywords && keywords.length > 0 && keywords.map((keyword,i)=>{
                                    var _i = i % apiUrl.tagColors.length;
                                      return <Tag color= {apiUrl.tagColors[_i]} closable={false} onClick = {_this.insertToEditTitle.bind(_this,keyword)}  key={i + 'keyword'} value={keyword}  >{keyword}</Tag>
                                  })
                                   } 
                          </div>
                     </div>
              }else{             
                return <Tag color= {'#70abd9'} closable={true} onClick = {_this.clickTag} key={index} value={index}  onClose = {_this.closeTag}>{editContent}</Tag>
                }
            })
       return (  <div className="input" style = {{display:this.props.visible ? 'block' : 'none'}}>
                          <div className="clearfix" style={{backgroundColor:' #fff', marginBottom: '10px', borderRadius: '5px',padding: '10px'}}>                                              
                              {titlesEle}
                          </div>
                    </div>
          )
    }
}
 
export default TagsTitle

 