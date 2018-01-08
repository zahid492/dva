import React, {Component} from 'react'
import ProductItem from './ProductItem'
import {connect} from 'react-redux'

class ProductList extends Component {
    render() {
        const {products} = this.props;

        return (
            <div>
                <h3>News</h3>
                <div>
                    {products.map(product =>
                        <ProductItem
                            key={product.RId}
                            product={product}
                        />
                    )}
                </div>
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
