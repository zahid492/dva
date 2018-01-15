
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {
    BrowserRouter as Router
} from 'react-router-dom'
// import DevTools from './DevTools'

export default class Root extends Component {
  render() {
    const { store, history, routes} = this.props

    return (
      <Provider store={store}>
        <div>
          <Router routes={routes} />
          {/*<DevTools />*/}
        </div>
      </Provider>
    )
  }
}
//
// Root.propTypes = {
//   store: PropTypes.object.isRequired,
//   history: PropTypes.object.isRequired,
//   routes: PropTypes.node.isRequired
// }
