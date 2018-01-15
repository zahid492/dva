var path = require('path');
var webpack = require('webpack');
//"redux-devtools": "^3.4.1",
//"redux-devtools-dock-monitor": "^1.1.3",
//"redux-devtools-log-monitor": "^1.4.0",
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(__dirname, 'index')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: require.resolve('babel-loader'),
                exclude: /node_modules/,
                include: [__dirname],
                options: {
                    // @remove-on-eject-begin
                    babelrc: false,
                    presets: [require.resolve('babel-preset-react-app')],
                    // @remove-on-eject-end
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                },
            }
        ]
    }
};