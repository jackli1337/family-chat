const
    http = require(`http`),
    express = require('express'),
    socketio = require(`socket.io`),

    path = require('path'),
    escapeHtml = require('escape-html'),
    upload = require("express-fileupload"),

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


// <!--Setting View Engine-->
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


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
io.on('connection', (sock) => {
    console.log(sock.id + " has connected!");
    
    // listens for new post
    sock.on(`spost`, (data) => {
        // saves new post to database
        let postCollection = db.get('post');
        let newPost = {
            id: "1",
            user_id: 1,
            filepath: '/users/ids/1/',
            content: {
                title: data.title,
                post: data.content
            },
            comments: [],
            upvote: [],
            downvote: []
        };
        postCollection.insert(newPost);

        // updates all users of new post
        io.sockets.emit(`spost`, newPost);
    });

    /* ----- REPLICATE (( SEE INDEX.JS FOR MORE ))----- */
    // // listens for new comment
    // sock.on(`scomment`, (data) => {
    //     // saves new comment to database
        
    //     // updates all users of new comment
    //     io.sockets.emit(`scomment`, newComment);
    // });
});


// <!--Start Website-->
server.listen(port, () => {
    console.log('Server Started on Port ' + port)
});