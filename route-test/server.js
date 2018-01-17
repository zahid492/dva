/* eslint-disable no-console */
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from './webpack.config'
import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import fs from 'fs'
import React from 'react'
import {Provider} from 'react-redux'
import ReactDOMServer from 'react-dom/server'
import {StaticRouter, matchPath} from 'react-router-dom'
import {matchRoutes, renderRoutes} from 'react-router-config';
import routes from './routes'
import configureStore from './store/configureStore'
import rootSaga from './sagas'

// import {createMemoryHistory} from 'history';
// const history = createMemoryHistory();

const _template = require('lodash/template');
const baseTemplate = fs.readFileSync('./index.html');
const template = _template(baseTemplate);

var app = express();
var port = 3000;

app.use(favicon(path.join(__dirname, 'favicon.ico')));
var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

const initState = (initialState) => (`
    <script type="text/javascript" charset="utf-8">
        window.__INITIAL_STATE__= ${initialState}
    </script>
`);
// 包含空白节点会报警告
const layout = (body) => (`${body}`);

app.use(function (req, res) {
    console.log('req', req.url);
    let context = {};
    const store = configureStore();
    const loadBranchData = () => {
        const branch = matchRoutes(routes, req.url);
        const promises = branch.map(({route}) => {
            let fetchData = route.fetchData;
            return (fetchData instanceof Function) ? fetchData(store.dispatch) : Promise.resolve(null)
        });

        return Promise.all(promises);
    };

    const content = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                {renderRoutes(routes)}
            </StaticRouter>
        </Provider>
    );

    store.runSaga(rootSaga).done.then(() => {
        console.log('sagas complete');

        loadBranchData()
            .then(() => {
                res.status(200).send(
                    template({
                        initState: initState(JSON.stringify(store.getState())),
                        initDom: layout(content)
                    })
                )
            })
            .catch(err => {
                console.log(err);
            })


    }).catch((e) => {
        res.status(500).send(e.message)
    });

    store.close();


    //res.status(200).send(layout('','{}'))
    // Note that req.url here should be the full URL path from
    // the original request, including the query string.
    // match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
    //     if (error) {
    //         res.status(500).send(error.message)
    //     } else if (redirectLocation) {
    //         res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    //     } else if (renderProps && renderProps.components) {
    //     } else {
    //         res.status(404).send('Not found')
    //     }
    // })
});


app.listen(port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
});
