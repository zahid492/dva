import React from 'react'
import { Tag, Input, Tooltip, Icon,message} from 'antd'
import $ from 'jquery';
import * as query from "../services/Utils"
import * as apiUrl from '../services/ApiUrl';
const maxCount = 15;
export default class TagGroup extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
                tags: props.datas,
                inputVisible: false,
                inputValue: '',
            };
        }

        //接收props
static getDerivedStateFromProps(nextProps, prevState) {            
      return {
        tags: nextProps.datas
      };
}

getSnapshotBeforeUpdate(prevProps, prevState) {
  return null;
}
componentDidUpdate(){}

    handleClose = (e,removedTag) => { 
      e.stopPropagation();
      const tags = this.state.tags.filter(tag => tag !== removedTag);
            
      this.props.change(tags);

      query.setData(apiUrl.apiMKDataDelUrl,removedTag._id);
      
    }
  
    showInput = () => {
      this.setState({ inputVisible: true }, () => this.input.focus());
    }
  
    handleInputChange = (e) => { 
      this.setState({ inputValue: e.target.value });
       
    }
  
    handleInputConfirm = () => {
      const state = this.state;
      const inputValue = state.inputValue;
      let tags = state.tags;
      if(tags.length >= maxCount)
      {
          message.warn('当前模块数量已经超过15个了');
          return;
      }
      

      if (inputValue && tags.indexOf(inputValue) === -1) {       
        let url = apiUrl.apiMKDataAddUrl;
        let data = { 
          name: inputValue,
          sArticleType: this.props.ManuscriptType,
          content: '',
          source: 1
        }

        query.setData(url,data).then(res=>{
            let _id = res.data;
            data._id =_id;
            let newTags = [...tags, data];            
            this.setState({ 
              inputVisible: false,
              inputValue: '',
            },()=>{
              this.props.change(newTags);
            });
        })
      } 
 
    }
  
    selectTag = (e,tag)=>{ 
      e.stopPropagation();
      this.props.select(tag);
    }
    saveInputRef = input => this.input = input

    render() {
        const { tags, inputVisible, inputValue } = this.state;
        const eles =  tags.map((_tag, index) => {
                        let tag = _tag.name;
                        let id = _tag._id;
                         
                        const isLongTag = tag.length > 5;
                        const tagElem = (
                            <Tag  className='item' key={id + index + Math.random()} onClick = {(e) => this.selectTag(e,_tag)} closable={_tag.source == 1} onClose={(e) => this.handleClose(e,_tag)}>
                            {isLongTag ? `${tag.slice(0, 5)}...` : tag}
                            </Tag>
                        );
                        return isLongTag ? <Tooltip title={tag} key={id + index + Math.random()}>{tagElem}</Tooltip> : tagElem;
                        }); 
        let inputEle = '';
        if(tags.length < maxCount)
        {
         if(inputVisible)
          {
              inputEle =  <Input 
                            ref={this.saveInputRef}
                            type="text"
                            size="small"
                            style={{ width: 100 }}
                            value={inputValue}
                            onChange={this.handleInputChange} 
                            onPressEnter={this.handleInputConfirm} 

                            /> 
          }else{
              inputEle =  <Tag className='item'
                              onClick={this.showInput}                            
                          >
                              <Icon type="plus" style={{fontSize:20}} /> 
                          </Tag> 
          } 
        } 
      return (
            <div className="mk-biaoqian-list">                  
              {eles}
              { inputEle}       
           </div>
       
      )
    }
  }