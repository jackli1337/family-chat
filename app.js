const
    http = require(`http`),
    express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    socketio = require(`socket.io`),
    SocketIOFileUpload = require("socketio-file-upload"),

    path = require('path'),
    escapeHtml = require('escape-html'),

    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('mongo:27017/familychat'),

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
app.use(SocketIOFileUpload.router);


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
io.on('connection', (sock) => {
    console.log(sock.id + " has connected!");

    var uploader = new SocketIOFileUpload();
    uploader.dir = "client/users/ids/1"; // + FILENAME
    uploader.listen(sock);

    // Do something when a file is saved:
    uploader.on("saved", function (event) {
        console.log(event.file);
    });

    // Error handler:
    uploader.on("error", function (event) {
        console.log("Error from uploader", event);
    });

    // listens for new post
    sock.on(`spost`, (data) => {
        // saves new post to database
        let postCollection = db.get('post');
        let newPost = {
            user_id: 1,
            filepath: uploader.dir,
            content: {
                title: data.title,
                post: data.content
            },
            comments: [],
            upvote: [],
            downvote: []
        };
        postCollection.insert(newPost, function (err, postInserted) {
            io.sockets.emit(`spost`, postInserted);
        });

        // updates all users of new post
    });

    /* ----- REPLICATE (( SEE INDEX.JS FOR MORE ))----- */
    // listens for new comment
    // sock.on(`scomment`, (data) => {
    //
    //     let postCollection = db.get('post');
    //     postCollection.find({ _id: data.post_id }, function (err, post) {
    //         if (err) { console.log("Post not found"); }
    //         else {
    //             post.comments.push(data.content);
    //             io.sockets.emit(`scomment`, post);
    //         }
    //     });
    // });
});


// <!--Start Website-->
server.listen(port, () => {
    console.log('Server Started on Port ' + port)
});