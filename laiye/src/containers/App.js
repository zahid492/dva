import React, { Component } from 'react'
import ProductList from '../component/ProductList'
import InputBox from '../component/Input'

export default class App extends Component {

    render() {
        return (
            <div>
                <InputBox />
                <ProductList />
            </div>
        )
    }
}
