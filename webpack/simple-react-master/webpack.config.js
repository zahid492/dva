var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var ROOT = process.cwd();
var PATHROOT = path.resolve(__dirname);

module.exports = {
  entry: "./index.js",
  devtool: 'source-map',
  output: {
    path: PATHROOT + '/dist',
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.map.js'
  },
  module: {
    rules: [
      { test: /\.js[x]?$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        ENV: JSON.stringify(process.env.MODE)
      }
    })
  ]
}