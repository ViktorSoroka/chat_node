var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
io.sockets.on('connection', function (client) {
    console.log("Client connected...");

    client.on('disconnect', function () {
        console.log('user disconnected');
    });

    client.on('join', function (name) {
        client.nickname = name;
    });

    client.on('message_chat', function (question) {
        io.sockets.emit('message_chat', client.nickname + ': ' + question);
    });
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(3000);
console.log("server started at port 3000...");