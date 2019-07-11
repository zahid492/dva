const path = require("path");
const fs = require("fs");

module.exports = {
    overrideWebpackConfig: ({context, webpackConfig, pluginOptions}) => {
        const {
            getLoader,
            loaderByName,
            throwUnexpectedConfigError
        } = require("@craco/craco");

        if (!("externals" in webpackConfig)) {
            webpackConfig.externals = [];
        }

        webpackConfig.externals.push({
            lodash: '_',
            moment: "moment"
        });

        // fs.writeFile("webpackConfig.js", JSON.stringify(webpackConfig), (err)=>{
        //     if(err) throw err;
        //     console.log("配置已写入")
        // });

        return webpackConfig;
    }
};
