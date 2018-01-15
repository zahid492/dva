import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
// import App from './containers/App'
// import UserPage from './containers/UserPage'
// import RepoPage from './containers/RepoPage'

const Home = () => (
    <div>
        <h2>Home</h2>
    </div>
);

const About = () => (
    <div>
        <h2>About</h2>
    </div>
);


export default (
    <Router>
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
        </div>
    </Router>
)

// export default (
//   <Route path="/" component={App}>
//     <Route path="/:login"
//            component={UserPage} />
//     <Route path="/:login/:name"
//            component={RepoPage} />
//   </Route>
// )
