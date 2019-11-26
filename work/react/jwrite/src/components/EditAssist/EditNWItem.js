import React, {Component} from 'react'  
import $ from 'jquery'

class EditNWItem extends Component {
    getSnapshotBeforeUpdate(prevProps, prevState) {

        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    handle = (index)=>{
        var item = this.props.data;
        this.props.insert(item.content,index);
    }
    changeEvent = (index)=>{
        var item = this.props.data;
        this.props.changeEvent(item.content,index)
    }
    render() { 
        var item = this.props.data;
        var index = this.props.index;        
        var title = $.trim(item.title);
        var content = $.trim(item.content);
        var _index = index + 1;
        if(index > 998)
        {
            if((index +1)%1000 === 0)
            {
              _index = (index +1)/1000 + 'k'
            }else{
                _index = parseInt((index +1)/1000,10) + 'k+'
            }
            
        } 
        var user = item.addUser;
        var time = item.addDateTime;
        var eleCss = (user || time) ? 'item' : 'p-item item';     
        return (   <div className={eleCss} tag = {index}>
                    <div className="title-bar" >
                        <h2  title = {title}  style={{"textAlign":"left", "float":"none", "lineHeight":"24px",display: 'block',width: '60%'}}>
                            <span>{_index}</span>                           
                            {title}
                            </h2>  
                            <span style={{display:'inline-block',verticalAlign: 'top',position:'absolute',top:'-5px',right:'5px'}}>
                                <button className="btn2" onClick={this.handle.bind(this,index)}
                                style={{  "marginTop":"0", "marginBottom":"10px",display: 'inline'}} >
                                <span className="iconfont icon-cr"></span> 插入</button> 

                                <button className="btn2" onClick={this.changeEvent.bind(this,index)}
                                style={{  "marginTop":"0", "marginBottom":"10px",display:'inline'}} >
                                 机器改编</button> 
                            </span>                     
                    </div> 
                    <div
                            className="p hotnews_text Collectitem" 
                            style={{height: 'auto',marginBottom: '20px',paddingTop:'15px'}}
                            tag = {index}
                            dangerouslySetInnerHTML={{
                                __html: content
                            }}></div>

                    
                    </div>
              )
    }
}

export default EditNWItem
