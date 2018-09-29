import React, {Component} from 'react';
import  _ from 'lodash';
import request from 'superagent';
// import store from 'store2';
import qs from 'qs';

const API_ROOTS = 'http://192.168.210.158:6088/';

class App extends Component {
    constructor(props){
        super(props);
        this.genG = this.gen.bind(this);

        this.state = {
        }

    }


    gen = function* (){
        let y;

        try{
            y = yield request.get("//www.baidu.com/img/bd_logo1.png");

        }catch(e){
            console.error(e)
        }
        console.log(y)
        return y;
    };

    componentDidMount() {
        let g = this.genG();
        const res = g.next();
        res.value.then((data)=>{
            // console.log(data.json())
            return data.json()
        })
        // console.log(g.next())
    }


    render() {

        return (
            <div className="app">

            </div>
        );
    }
}

export default App;
