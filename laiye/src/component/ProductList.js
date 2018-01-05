import React, { Component, PropTypes } from 'react'
import ProductItem from './ProductItem'
import { connect } from 'react-redux'

class ProductList extends Component {
  render() {
    const { products } = this.props;

      console.log("productlist:", this.props)

    return (
      <div>
        <h3>News</h3>

          {
              products.length>0 ? products.map(product => <ProductItem key={product.RId} product={product} />): ""
          }
      </div>
    )
  }
}

export default connect(
    function(state){
        console.log(state)
        return {products: state.products}
    }
)(ProductList)
