import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

const AuthExample = () => (
    <Router>
        <div>
            <AuthButton/>
            <ul>
                <li><Link to="/protected">Protected</Link></li>
            </ul>

            <Route path="/login" component={Login} />
            <PrivateRoute path="/protected" component={Protected} />
        </div>
    </Router>
);
export default AuthExample;