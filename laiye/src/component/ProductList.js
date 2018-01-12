import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List} from 'antd-mobile';

const Item = List.Item;

class ProductList extends Component {
    render() {
        const {products} = this.props;

        return (
            <div>
                <List renderHeader={() => 'News'} className="my-list">
                    {products.map(product =>
                        <Item
                            key={product.RId}
                            arrow="horizontal"
                            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                            multipleLine
                            onClick={() => {
                            }}
                        >
                            {product.Title}
                        </Item>
                    )}
                </List>
            </div>
        )
    }
}

ProductList.defaultProps = {
    products: []
};

export default connect(
    function (state) {
        return {products: state.products}
    }
)(ProductList)
