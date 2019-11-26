import React, {Component} from 'react'
import {Spin} from 'antd';
import * as apiUrl from '../services/ApiUrl';
import * as query from '../services/Utils';

import '../style/articleView.css'

const $ = window.$;

class View extends Component {
    constructor(props) {
        super(props);
        let id = props.match.params.id;
        this.state = {
            id: id ? id : '',
            title:'',
            content : '',
            loading : false
        };
    }


    loadData = ()=>{
       this.setState({
          loading:true
       });
       query.__request_Temp('get',apiUrl.GetArticleUrl,{id:this.state.id},(res)=>{

            this.setState({
                loading:false,
                 title:res.newArticleTitle ? res.newArticleTitle : '',
                 content:res.newArticleContent ? res.newArticleContent : ''
            },()=>{
               $('img').parent().addClass('align');
            });

       },()=>{
            this.setState({
            loading:false,
            title:'',
            content: ''
            })
        });
    }


    componentDidUpdate() {
        // console.log(this.state)
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
      const {loading,title,content} = this.state;
      var allContent = '';

      allContent =  '<article class="landingHead"><h1 class="titleSize">' + title + '</h1></article>' + content


      let ContentEle = <div  key={"read"}  >
          <div style={{
                  margin: '10px 0',
                  height:'auto'
              }}>
            <Spin spinning = {loading} size = 'large'/>
              <div style={{float:'none'}}
                  dangerouslySetInnerHTML={{
                      __html: allContent
                  }}></div>
          </div>

      </div>
        return (
            <div className = 'article mod'>
                {
                  ContentEle
                }
            </div>
        )
    }
}



export default View

