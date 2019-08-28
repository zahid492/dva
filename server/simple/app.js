var path = require('path');
var express = require('express');
var SERVER_PORT = 9999;

var app = express();

app.set('staticPath', '/public')
app.use(express.static(__dirname + app.get('staticPath')))

app.use(function (req, res, next) {

    res.set('Access-Control-Allow-Origin', '*');
    // res.set('Access-Control-Allow-Credentials', 'true');
    // res.set('Access-Control-Allow-Methods', "*");
    // res.set('Access-Control-Allow-Headers', "");
    // res.set('Access-Control-Expose-Headers', "*");

    next();
});

app.use(function(req, res) {
    res.sendFile(path.join(__dirname, app.get('staticPath') + '/index.html'))
});

app.listen(SERVER_PORT, function () {
    console.log('Started server at http://localhost:' + SERVER_PORT);
});
