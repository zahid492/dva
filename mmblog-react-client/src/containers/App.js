import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {resetErrorMessage} from '../actions'
import List from '../components/vList'

// 容器组件
class App extends Component {
        render() {

        return (
            <div>
                <List />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        tag: state.tag,
        page: state.curPage,
        limit: state.pageSize,
        posts: state.posts,
    }
}

export default connect(mapStateToProps)(App)
