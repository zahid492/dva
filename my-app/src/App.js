import React, {Component} from 'react';
// import  _ from 'lodash';
import request from 'superagent';
// import store from 'store2';
// import qs from 'qs';
import co from 'co';


const API_ROOTS = 'http://localhost:3100/';

class App extends Component {
    constructor(props){
        super(props);
        // this.genG = this.gen.bind(this);

        this.state = {
        }
    }

    async gen (){
        let x, y, xx, yy;

        try{
            x =  await request.get(API_ROOTS + "api/test1")
            y = await request.get(API_ROOTS + "api/test2");


        }catch(e){
            console.error(e)
        }
        return [x, y];
    };

    async componentDidMount() {
        let g = this.gen();

        g.then((data)=>{
            console.log(data)
        })
        // let docs = [request.get(API_ROOTS + "api/test1"), request.get(API_ROOTS + "api/test2")];
        // for await (let doc of docs){
        //     console.log(doc);
        // }


    }


    render() {

        return (
            <div className="app">

            </div>
        );
    }
}

export default App;
