import React, {Component} from 'react'

export default class List extends Component {

    render() {
        const {
            items,
        } = this.props

        return (
            <div>
                {items.map(function (v) {
                    return (
                        <div>v</div>
                    )
                })}
            </div>
        )
    }
}
