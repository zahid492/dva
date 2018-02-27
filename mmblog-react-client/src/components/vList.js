import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import { loadPosts } from '../actions/vindex'
import { Pagination } from 'antd';

class List extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        this.props.loadPosts({page:this.props.page || 1, limit: this.props.pageSize})
    }

    onChange = (page, pageSize) => {
       this.props.loadPosts({page: page, limit: pageSize})
    };

    render() {
        const {posts, total, pageSize} = this.props;

        if (posts.length === 0) {
            return <h3>没有内容</h3>
        }

        return (
            <div>
                <ul>
                    {posts.map(function (v) {
                        return <li key={v.id}>{v.title}--{v.content}</li>
                    })}
                </ul>
                <Pagination defaultCurrent={1} total={total} pageSize={pageSize} onChange={this.onChange} />
            </div>
        )
    }
}

List.propTypes = {
    posts: PropTypes.array.isRequired,
};
//
// List.defaultProps = {
//     posts: []
// };

function mapStateToProps(state, props) {
    return {
        total: state.total,
        posts: state.posts,
        page: state.page,
        pageSize: parseInt(props.pageSize, 10)
    }
}

export default connect(mapStateToProps, {
    loadPosts
})(List)