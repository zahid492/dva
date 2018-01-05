import React, { Component } from 'react'
import { connect } from 'react-redux'

import List from '../component/List'

class RepoPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const { stargazers } = this.props

    return (
      <div>
        <List items={stargazers} />
      </div>
    )
  }
}

function mapStateToProps(state) {
    console.log("page:", state)
  const stargazers = state

  return {
    stargazers,
  }
}

export default connect(mapStateToProps)(RepoPage)
