import React, {Component} from 'react' 
import HeadUser from '@/components/HeadUser'
import {
    Link,
    withRouter
} from 'react-router-dom'
import {connect} from 'react-redux'
import _ from "lodash";  

import mgr from '@/containers/userManager'
//公用Head
class Head extends Component {
    constructor(props) {
        super(props);
         
        const pn = this.props.location.pathname.substring(1).split("/");
        let tin = 'compose'; 
                      
        if(pn.length > 0 && pn[0])
        {
            tin = pn[0];
        }
         
        this.state = {           
            type: tin,   
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return null;
    }

    componentDidMount(prevProps, prevState, snapshot) {
        // 新开窗口，不做监听
        this.props.history.listen((location, action) => {
           
            const pn =  location.pathname.substring(1).split("/");
            
            let tin =  'compose';
           
            if(pn.length > 0 && pn[0])
            {
                tin = pn[0];
            }
       
            this.setState({
                    type:tin
                });
             
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {       
       
    }


    logoOut = () => { 
        mgr.signoutRedirect(); 
    };

    render() {

        const {type} = this.state;      
        
        var mEles = window.moduals;
        var modualEle = mEles.map((item,index)=>{
            return <li key={index} className={item.tin === type ? 'active' : ''}> <Link to={item.path} style={{textDecoration: 'none'}}>{item.title}</Link> </li>
        });
        var headEle = <header style = {{height:'80px',width:'100%'}}>        
                        <section className='w_100' style={{padding:0,height:'80px',lineHeight:'80px',margin: '0 auto'}}>
                            <div className="logo" style={{paddingLeft:'30px'}}> 
                                <img src="/img/logo.4.png" alt=''/>

                            </div>
                            <nav>
                                <ul> {modualEle} </ul>
                            </nav>
                            <HeadUser logoOut={this.logoOut} ></HeadUser>
                        </section>

                    </header>
         
        
        return (
            <div>
                {headEle}
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {

    return { 
    }
}

export default connect(mapStateToProps)(withRouter(Head))

