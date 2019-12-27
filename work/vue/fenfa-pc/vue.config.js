module.exports = {
  //
  devServer: {
    host: 'localhost',
    port: 8080,
    https: false,
    open: true,
    proxy: {
      '/api': {
        target: 'http://api.rwff.aimiaobi.rd',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
};