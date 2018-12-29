import React, {Component} from 'react';
import * as d3 from 'd3';
import FauxChart from './rdfChart';
import './scss/main.scss'

class App extends Component {

    state = {
        data: []
    };

    componentDidMount() {
        console.log("start")
        d3.tsv('./data/data.tsv').then((data)=> {
            this.setState({
                data
            })
        })
    }

    render() {

        return (
            <div>
                <FauxChart />
            </div>
        );
    }
}

export default App;
