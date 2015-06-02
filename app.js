var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var redis = require('redis');
var redis_client = redis.createClient(6379, '127.0.0.1', {no_ready_check: true});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* GET home page. */

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res, next) {
    res.render('index', {title: 'Main page'});
});

io.sockets.on('connection', function (client) {
    console.log("Client connected...");
    client.on('disconnect', function () {
        console.log('user disconnected');
    });

    client.on('join', function (name) {
        client.nickname = name;

        redis_client.llen("users:1000", function (err, llen) {
            if (err) {
                console.log(err);
                redis_client.quit();
            } else {
                if (llen >= 10) {
                    redis_client.lpop("users:1000");
                }
                redis_client.lrange("users:1000", 0, -1, function (err, obj) {
                    if (err) {
                        console.log(err);
                        redis_client.quit();
                    }
                    obj = obj || [];
                    obj.forEach(function (message) {
                        //io.sockets.emit(, message);
                        client.emit('message_chat', message);
                    });
                });
            }
        });
    });

    client.on('message_chat', function (question) {
        io.sockets.emit('message_chat', client.nickname + ': ' + question);
        redis_client.rpush("users:1000", client.nickname + ': ' + question);
    });
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(3000);
console.log("server started at port 3000...");