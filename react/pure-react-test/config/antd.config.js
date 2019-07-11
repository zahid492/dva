module.exports = {
    overrideCracoConfig: ({ cracoConfig, pluginOptions, context }) => {
        // console.log("context:", context)
        // console.log("pluginOptions:", pluginOptions)
        // console.log("cracoConfig:", cracoConfig)

        if (!cracoConfig.babel) cracoConfig.babel = {};
        if (!cracoConfig.babel.plugins) cracoConfig.babel.plugins = [];

        cracoConfig.babel.plugins.push([
            "import",
            { libraryName: "antd", libraryDirectory: "es", style: "css" }
        ]);
        return cracoConfig;
    }
};