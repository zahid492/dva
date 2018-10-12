var http = require('http');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();
var port = 3100;
app.set('port', port);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
        // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(morgan(':date[iso] :method :url :status :response-time ms - :res[content-length]'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);

var data1 = [{
    id: 1,
    author: "Pete Hunt",
    text: "This is one comment"
}, {
    id: 2,
    author: "Jordan Walke1",
    text: "This is *another* comment"
}];
var data2 =  [{
    id: 3,
    author: "Jordan Walke2",
    text: "This is *another* comment3"
}];

app.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
// react test data
app.get('/api/test1', function(req, res, next) {
    console.log(data1)
    res.send({data: data1});
});
app.get('/api/test2', function(req, res, next) {
    console.log(data2)
    res.send({data: data2});
});

app.post('/api/test', function(req, res, next) {
    // console.log(req.body)
    var id = parseInt(data[data.length - 1].id, 10) + 1;
    data.push({
        id: id,
        author: req.body.author,
        text: req.body.text
    });
    res.send(data);
});
// app.get('/*', function(req, res){
//   res.sendFile(path.join(__dirname, 'build/index.html'));
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var server = http.createServer(app);

server.listen(port, function() {
    console.log("App listening on port 3100");
});
