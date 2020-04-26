const
    http = require(`http`),
    express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    socketio = require(`socket.io`),

    path = require('path'),
    escapeHtml = require('escape-html'),
    upload = require("express-fileupload"),

    mongo = require('mongodb'),
    monk = require('monk'),

    pageRouter = require('./routes/pages'),
    fileRouter = require('./routes/files'),
    mediashareRouter = require('./routes/mediasharing'),
    databaseRouter = require('./routes/database'),

    app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server);
    port = 8000;

const urlencodedParser = bodyParser.urlencoded({ extended: false });
// <!--Body Parser-->
app.use(urlencodedParser);

// <!--Setting View Engine-->
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// <!--Session-->
let sessionMiddleware = session({
    secret: 'login-session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
});
app.use(sessionMiddleware);


// <!--File Uploader-->
app.use(upload());


// <!--Start Routing-->
// Serve Static Files
app.use(express.static(path.join(__dirname, 'client')));
// Serve Pages
app.use(pageRouter);
// Serve Files
app.use(fileRouter);
// Media Share Files
app.use(mediashareRouter);
// Database Router
app.use(databaseRouter);
// Error Handling
app.use((req, res, next) => {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { errorMsg: err.message });
});


// <!--Socket-->
// On Connection To Server
io.on('connection', function(socket) {
    console.log(socket.id + " has connected!");
});


// <!--Start Website-->
server.listen(port, () => {
    console.log('Server Started on Port ' + port)
});