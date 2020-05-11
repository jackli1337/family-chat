const
    http = require(`http`),
    express = require('express'),
    router = express.Router(),
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
io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});


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
io.sockets.on('connection', (sock) => {

    if (sock.request.session.user) {
        let user = sock.request.session.user;

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

        let chatArray = [];
        let chatCollection = db.get('chat');
        //function to send status
        sendStatus = function (s) {
            io.sockets.emit('status', s);
        }

        //handling input events
        //listen for new message
        sock.on('send message', function (data) {

            let chatCollection = db.get('chat');

            let username = data.username;
            let message = data.message;
            let userFriend = data.friend;

            //Check for name and message
            if (message.length > 0) {

                //insert message
                var msg = {
                    message: message,
                    sender: username,
                };

                chatCollection.update({users: ['sliu57', 'jackli123']}, {$push: {messages: msg}}, function (err, data) {
                    console.log("Added a new message");
                    console.info("The data is: ", data);

                    let sentmsg = msg.message;
                    let sentuser = msg.sender;

                    io.sockets.emit('new message', {msgToSend: sentmsg, userSent: sentuser, data});

                });

            } else {
                console.log("Entered an empty message!")
            }


        });


        // listens for new post
        sock.on(`spost`, (data) => {
            // saves new post to database
            console.log("POSTING, THIS IS USER ID ================================================")
            console.log(user._id);
            let
                postCollection = db.get('post'),
                curDate = new Date(),
                newPost = {
                    user_id: user._id,
                    fullname: escapeHtml(`${user.FirstName} ${user.LastName}`),
                    filepath: uploader.dir,
                    content: {
                        title: escapeHtml(data.title),
                        post: escapeHtml(data.content)
                    },
                    comments: [],
                    upvote: [],
                    downvote: [],
                    date: curDate,
                    Upvotes: 0,
                    Downvotes: 0
                };
            postCollection.insert(newPost, function (err, postInserted) {
                io.sockets.emit(`spost`, postInserted);
            });
        });

        // listens for new comment
        sock.on(`scomment`, (data) => {
            console.info(data);
            let
                postCollection = db.get('post'),
                curDate = new Date(),
                newComment = {
                    parent: data.post_id,
                    user_id: user._id,
                    fullname: `${user.FirstName} ${user.LastName}`,
                    comment: escapeHtml(data.content.comment),
                    // file: data.content.file,
                    date: curDate
                };
            postCollection.update(
                { _id: data.post_id },
                {
                    // adding comment to associated post
                    $push: {
                        comments: newComment
                    }
                },
                function (err, post) {
                    if (err) { console.log("Post not found"); }
                    else {
                        io.sockets.emit(`scomment`, newComment);
                    }
                }
            );
        });

        // listens for new vote
        sock.on(`svote`, (data) => {
            console.info(data);
            let
            postCollection = db.get('post'),
            status = "";


            postCollection.find({ _id: data.post }, function (err, result) {

                let target = result[0];
                console.log(target);
                var newDown = target.Downvotes;
                var newUp = target.Upvotes;



            if(data.option == "up"){

                // if user has upvoted, remove vote
                if (target.upvote.includes(user._id)) {

                     postCollection.update(
                        { _id: target._id },
                        {
                            $inc: { Upvotes : -1 },

                            $pull: {
                                upvote: user._id
                            }
                        }
                    );
                    status = "remove upvote push";
                    newUp--;
                }

                 // if user has downvoted, remove vote add upvote
                 else if (target.downvote.includes(user._id)) {

                    postCollection.update(
                        { _id: target._id },
                        {

                            $inc: { Downvotes : -1 },

                            $pull: {
                                downvote: user._id
                            }
                        }
                    );

                    postCollection.update(
                        { _id: target._id },
                        {
                            $inc: { Upvotes : 1 },

                            $push: {
                                upvote: user._id
                            }
                        }
                    );

                    status = "remove downvote push upvote";
                    newDown--;
                    newUp++;


                }

                // if user hasn't voted at all, push upvote
                else {
                    // get target, add to followers
                    postCollection.update(
                        { _id: target._id },
                        {
                            $inc: { Upvotes : 1 },

                            $push: {
                                upvote: user._id
                            }
                        }
                    );
                    status = "regular upvote push";
                    newUp++;
                }
             } //end if statement




             if(data.option == "down"){

                // if user has downvoted, remove vote
                if (target.downvote.includes(user._id)) {
                    // get target, remove from followers
                     postCollection.update(
                        { _id: target._id },
                        {

                            $inc: { Downvotes : -1 },

                            $pull: {
                                downvote: user._id
                            }
                        }
                    );
                    status = "remove downvote push";
                    newDown--;
                }

                 // if user has upvoted, remove vote push downvote
                 else if (target.upvote.includes(user._id)) {

                    postCollection.update(
                        { _id: target._id },
                        {

                            $inc: { Upvotes : -1 },

                            $pull: {
                                upvote: user._id
                            }
                        }
                    );

                    postCollection.update(
                        { _id: target._id },
                        {

                            $inc: { Downvotes : 1 },

                            $push: {
                                downvote: user._id
                            }
                        }
                    );

                    status = "remove upvote push downvote";
                    newUp--;
                    newDown++;

                }

                // if user hasn't voted at all, push downvote
                else {

                    postCollection.update(
                        { _id: target._id },
                        {
                            $inc: { Downvotes : 1 },

                            $push: {
                                downvote: user._id
                            }
                        }
                    );
                    status = "regular downvote push";
                    newDown++;
                }
             } //end downvote if statement



             console.log(newUp);
             console.log(newDown);


             let update = {
                post : data.post,
                upsize : newUp,
                downsize : newDown
            };

                console.log(status);
                io.sockets.emit(`svote`, update);
            });


        });



        // listens for follow/unfollow
        sock.on(`sfollow`, (data) => {
            let
                userCollection = db.get('users'),
                connection = "";

            userCollection.find({ _id: data.targetID }, function (err, result) {
                let target = result[0];

                // if user is following, remove connection
                if (target.Followers.includes(user._id)) {
                    // get target, remove from followers
                    userCollection.update(
                        { _id: target._id },
                        {
                            $pull: {
                                Followers: user._id
                            }
                        }
                    );
                    // get user, remove from following
                    userCollection.update(
                        { _id: user._id },
                        {
                            $pull: {
                                Following: target._id
                            }
                        }
                    );
                    connection = "severed";
                }

                // if user is not following, add connection
                else {
                    // get target, add to followers
                    userCollection.update(
                        { _id: target._id },
                        {
                            $push: {
                                Followers: user._id
                            }
                        }
                    );
                    // get user, add to following
                    userCollection.update(
                        { _id: user._id },
                        {
                            $push: {
                                Following: target._id
                            }
                        }
                    );
                    connection = "fulfilled";
                }

                io.sockets.emit(`sfollow`, connection);

            });

        });

        /* ----- REPLICATE (( SEE INDEX.JS FOR MORE ))----- */
        // // listens for new comment
        // sock.on(`scomment`, (data) => {
        //     console.info(data);
        //     let
        //         postCollection = db.get('post'),
        //         curDate = new Date(),
        //         newComment = {
        //             parent: data.post_id,
        //             user_id: user._id,
        //             fullname: `${user.FirstName} ${user.LastName}`,
        //             comment: data.content.comment,
        //             // file: data.content.file,
        //             date: curDate
        //         };
        //     postCollection.update(
        //         { _id: data.post_id },
        //         {
        //             // adding comment to associated post
        //             $push: {
        //                 comments: newComment
        //             }
        //         },
        //         function (err, post) {
        //             if (err) { console.log("Post not found"); }
        //             else {
        //                 io.sockets.emit(`scomment`, newComment);
        //             }
        //         }
        //     );
        // });
    }
});


// <!--Start Website-->
server.listen(port, () => {
    console.log('Server Started on Port ' + port)
});