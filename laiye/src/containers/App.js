import React, { Component } from 'react'
import ProductList from '../component/ProductList'
import InputBox from '../component/Input'
import List from '../component/tab'

// import asyncComponent from '../component/AsyncComponent'
// import LineReact from '../component/charts'
// import { lineOption } from '../optionConfig/options'
export default class App extends Component {

    render() {
        return (
            <div>
                {/*<InputBox />*/}
                {/*<ProductList />*/}
                <List />

            </div>
        )
    }
}
