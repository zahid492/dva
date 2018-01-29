import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {loadUserPage, loadMoreStarred} from '../actions'
import User from '../components/User'
import Repo from '../components/Repo'
import List from '../components/List'
import _ from 'lodash'

class UserPage extends Component {
    constructor(props) {
        super(props)
        this.renderRepo = this.renderRepo.bind(this)
        this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this)
    }
    // 加载用户数据
    componentWillMount() {
        this.props.loadUserPage(this.props.login)
    }
    // 用户改变重新加载数据
    componentWillReceiveProps(nextProps) {
        if (this.props.login !== nextProps.login) {
            this.props.loadUserPage(nextProps.login)
        }
    }
    // 更多
    handleLoadMoreClick() {
        this.props.loadMoreStarred(this.props.login)
    }
    // 渲染代码库
    renderRepo([repo, owner]) {
        return (
            <Repo repo={repo}
                  owner={owner}
                  key={repo.fullName}/>
        )
    }

    render() {
        const {user, login} = this.props;

        if (!user) {
            return <h1><i>Loading {login}’s profile...</i></h1>
        }

        const {starredRepos, starredRepoOwners, starredPagination} = this.props
        return (
            <div>
                {/*仓库作者信息*/}
                <User user={user}/>
                <hr/>
                {/*仓库列表*/}
                <List renderItem={this.renderRepo}
                      items={_.zip(starredRepos, starredRepoOwners)}
                      onLoadMoreClick={this.handleLoadMoreClick}
                      loadingLabel={`Loading ${login}’s starred...`}
                      {...starredPagination} />
            </div>
        )
    }
}

UserPage.propTypes = {
    login: PropTypes.string.isRequired,
    user: PropTypes.object,
    starredPagination: PropTypes.object,
    starredRepos: PropTypes.array.isRequired,
    starredRepoOwners: PropTypes.array.isRequired,
    loadUserPage: PropTypes.func.isRequired,
    loadMoreStarred: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    const {login} = ownProps.match.params;
    const {
        pagination: {starredByUser},
        entities: {users, repos}
    } = state;

    const starredPagination = starredByUser[login] || {ids: []};
    const starredRepos = starredPagination.ids.map(id => repos[id]);
    const starredRepoOwners = starredRepos.map(repo => users[repo.owner]);

    const puser = _.find(users, function (v) {
        return v.login === login;
    });
    return {
        login,
        starredRepos,
        starredRepoOwners,
        starredPagination,
        user: puser
    }
}

export default connect(mapStateToProps, {
    loadUserPage,
    loadMoreStarred
})(UserPage)

