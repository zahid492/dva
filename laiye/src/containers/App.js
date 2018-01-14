import React, { Component } from 'react'
// import ProductList from '../component/ProductList'
// import InputBox from '../component/Input'

// import asyncComponent from '../component/AsyncComponent'
import LineReact from '../component/charts'
import { lineOption } from '../optionConfig/options'
export default class App extends Component {

    render() {
        return (
            <div>
                <h2>折线图react组件实现</h2>
                <LineReact option={lineOption} />
                {/*<hr/>*/}
                {/*<InputBox />*/}
                {/*<ProductList />*/}
            </div>
        )
    }
}
