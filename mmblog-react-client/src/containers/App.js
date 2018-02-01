import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import List from '../components/vList'

// 容器组件
class App extends Component {
        render() {

        return (
            <div>
                <List pageSize="2" />
            </div>
        )
    }
}

export default App
