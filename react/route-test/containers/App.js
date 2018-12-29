import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {navigate, updateRouterState, resetErrorMessage} from '../actions'
import Explore from '../components/Explore'

// 容器组件
class App extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleDismissClick = this.handleDismissClick.bind(this)
    }
    // 向 state 增加两个属性
    componentWillMount() {
        this.props.updateRouterState({
            pathname: this.props.location.pathname,
            params: this.props.params
        })
    }
    // 路径改变同时改变 state 中相关属性
    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname){
            this.props.updateRouterState({
                pathname: nextProps.location.pathname,
                params: nextProps.params
            })
        }
    }
    // 消除弹出消息
    handleDismissClick(e) {
        this.props.resetErrorMessage()
        e.preventDefault()
    }

    handleChange(nextValue) {
        this.props.history.push(`/${nextValue}`)
    }
    // 显示错误消息
    renderErrorMessage() {
        const {errorMessage} = this.props
        if (!errorMessage) {
            return null
        }

        return (
            <p style={{backgroundColor: '#e99', padding: 10}}>
                <b>{errorMessage}</b>
                {' '}
                (<a href="#"
                    onClick={this.handleDismissClick}>
                Dismiss
            </a>)
            </p>
        )
    }

    render() {
        const {children, inputValue} = this.props
        return (
            <div>
                <Explore value={inputValue}
                         onChange={this.handleChange}/>
                <hr/>
                {this.renderErrorMessage()}
                {children}
            </div>
        )
    }
}


App.propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    inputValue: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
    updateRouterState: PropTypes.func.isRequired,
    resetErrorMessage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node
};

function mapStateToProps(state) {
    return {
        errorMessage: state.errorMessage,
        inputValue: state.router.pathname.substring(1)
    }
}

export default connect(mapStateToProps, {
    navigate,
    updateRouterState,
    resetErrorMessage
})(App)
