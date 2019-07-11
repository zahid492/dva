const path = require("path");
const fs = require("fs");

const escape = require('jsesc');
const bodyParser = require('body-parser');

let todos = [];

module.exports = {
    overrideDevServerConfig: ({devServerConfig, cracoConfig, pluginOptions, context: {env, paths, proxy, allowedHost}}) => {

        devServerConfig.after = function (app, server) {
            app.use(bodyParser.json());

            app.post('/api/todos', function (req, res) {
                console.log(req.body)
                // todos = req.body.todos;
                // console.log(todos)
                // if (Array.isArray(todos)) {
                //     console.log(`Updated todos (${todos.length})`);
                //     res.status(201).send(JSON.stringify({success: true}));
                // } else {
                //     res.status(200).send(JSON.stringify({success: false, error: "expected `todos` to be array"}));
                // }
            });
        };
        //
        //
        // fs.writeFile("devServerConfig.js", JSON.stringify(devServerConfig), (err) => {
        //     if (err) throw err;
        //     console.log("配置已写入")
        // });

        return devServerConfig;
    }
};
