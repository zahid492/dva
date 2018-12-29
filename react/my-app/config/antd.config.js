module.exports = {
    overrideCracoConfig: ({ cracoConfig }) => {
        if (!cracoConfig.babel) cracoConfig.babel = {};
        if (!cracoConfig.babel.plugins) cracoConfig.babel.plugins = [];

        cracoConfig.babel.plugins.push([
            "import",
            { libraryName: "antd", libraryDirectory: "es", style: "css" }
        ]);
        return cracoConfig;
    }
};