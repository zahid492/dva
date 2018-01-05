import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import ProductsContainer from '../containers/ProductsContainer';
import CartContainer from '../containers/CartContainer';

const App = () => (
    <Router>
        <div>
            <h2>Shopping Cart Example</h2>
            <hr/>
            <Link to="/">ProductsContainer </Link>
            <hr/>
            <Link to="/cart">Cart</Link>

            <Route exact path="/" component={ProductsContainer}></Route>
            <Route exact path="/cart" component={CartContainer}></Route>
        </div>
    </Router>
);

export default App