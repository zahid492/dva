import React, {Component} from 'react'
import PropTypes from 'prop-types';

export default class List extends Component {

    render() {
        const {
            items
        } = this.props;

        return (
            <ul>
                {items.map(function(v){
                    <li key={v.id}>{v.article}</li>
                })}
            </ul>
        )
    }
}

List.propTypes = {
    items: PropTypes.array.isRequired,
};

List.defaultProps = {
};
