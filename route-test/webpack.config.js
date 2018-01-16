var path = require('path');
var webpack = require('webpack');
//"redux-devtools": "^3.4.1",
//"redux-devtools-dock-monitor": "^1.1.3",
//"redux-devtools-log-monitor": "^1.4.0",
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(__dirname, 'index')
    ],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/public/'
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // new FriendlyErrorsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader?sourceMap',
                exclude: [/node_modules/],
                options: {
                    presets: ['env'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    }
};