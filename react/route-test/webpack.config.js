const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
let pathsToClean = [
    'public'
];

let cleanOptions = {
    root:     __dirname,
    exclude:  ['favicon.ico'],
    verbose:  true,
    dry:      false
};

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
        new webpack.NoEmitOnErrorsPlugin(),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ManifestPlugin(),
        new ProgressBarPlugin(),
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