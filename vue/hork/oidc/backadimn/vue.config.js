// wsc 2019-07-03 create
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8091,
        https: false,
        open: false,
        headers:{
            "Access-Control-Allow-Origin":"*"
        },
        proxy: {
            // dev 81 test 120
            '/api/': {
                target: 'http://191.167.20.222',
                // target: 'http://localhost:5001',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api/': '/api/'
                }
            },

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

// http://192.168.188.101/connect/authorize?client_id=Miaobi_IdentitySystem_clientId&redirect_uri=http://localhost:5001/silent-renew&response_type=code&scope=openid Miaobi_IdentitySystem_apiResource miaobiidentityresources&state=3c4a8d33d8c841bfb697185b7cf3272a&code_challenge=hljnA94JkjC6t6djqgX5LFeuo_fY6s839eUKGlafQTc&code_challenge_method=S256&prompt=none&id_token_hint=eyJhbGciOiJSUzI1NiIsImtpZCI6IkNCQkI4MEJCRUI0MjM2REY0MjRFODdBNEM5Qjk0MkJBMTM5Qjc4NUEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJ5N3VBdS10Q050OUNUb2VreWJsQ3VoT2JlRm8ifQ.eyJuYmYiOjE1NjUyNTg4NTAsImV4cCI6MTU2NTI1OTE1MCwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMTg4LjEwMSIsImF1ZCI6Ik1pYW9iaV9JZGVudGl0eVN5c3RlbV9jbGllbnRJZCIsImlhdCI6MTU2NTI1ODg1MCwiYXRfaGFzaCI6Ikt0Mk5hODZJaUw1ckkwZHpvc1dFY0EiLCJzaWQiOiJmMzQ0NGEyZTcxNDI1OTg3ZDdiNDNhODM0Y2IxYzFhMCIsInN1YiI6IjI0IiwiYXV0aF90aW1lIjoxNTY1MjQ3NzIyLCJpZHAiOiJsb2NhbCIsImFtciI6WyJwd2QiXX0.PCsZfx_YaqQY8wWKWQTypbY-cBFmYC8nZOE7DybsPpvtuezfkrOYCgj8pOt9ZmMiA-hkCRVbIsirlzEt-o7h-Rwlbik5ag_Pdp7j-7h6jXE9I4gE7ol8l1p5oXwP7NNzlFtjSgq5Yl2lrxcPnzG2-QVdcLRjqFuXA6ey-2fwXa7Ie1oGpii_KzGBywgQfUMwbTy-I_Ca9Hq4O9KPIViLlDu4hcJXZ6_HCB9uxDuvfs-PND9RBCGisAZic-ZS85FFgOC8FwTu8ePIF_6KhmYpy_0V2jRUYGaRKEF5m7xsa17IHwbNiPBxvizUItGviV0JRy-Wf40VJMyExggKQoFCBA