// wsc 2019-04-10 create 2019-08-02 oidc
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8081,
        https: false,
        open: true,
        headers:{
            'Access-Control-Allow-Credentials': true,
            // "Content-Security-Policy":"child-src self http://localhost:8091 http://192.168.188.101"
        },
        proxy: {
            // dev 81 test 120
            '/api': {
                target: 'http://192.168.220.81',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            },
            '/resource': {
                target: 'http://192.168.220.81',
                changeOrigin: true,
                pathRewrite: {
                    '^/resource': '/resource'
                }
            }
        }
    },
    publicPath: undefined,
    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    productionSourceMap: false,
    parallel: undefined,
    css: undefined
};