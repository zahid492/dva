var webpack = require('webpack');
var opn = require('opn')
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.development.config');
config.entry.app.unshift("webpack-dev-server/client?http://127.0.0.1:9000/", "webpack/hot/dev-server");
new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: {
        index: '/public'
    }
}).listen(9000, '127.0.0.1', function (err, result) {
    if (err) {
        return console.log(err);
    }
    opn('http://127.0.0.1:9000/')
});
