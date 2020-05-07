const express = require('express'),
    path = require('path'),
    User = require('../core/user'),
    router = express.Router(),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('mongo:27017/familychat');

router.use(express.static(path.join(__dirname, 'client')));

const user = new User();

// Login/Registration Portal
router.get('/', function (req, res) {
    let user = req.session.user;
    if (user) {
        res.redirect('/feed');
    }
    res.render('index');
});

// Login Request
router.post('/login', function (req, res) {
    user.login(req.body.username.toLowerCase(), req.body.password, function (result) {
        if (result) {
            req.session.user = result;
            res.redirect('/feed');
        }
        else {
            res.send('Username/Password Incorrect!');
        }
    });
});

// Register Request
router.post('/register', function (req, res) {

    let userCollection = db.get('users');

    let userInput = {
        FirstName: req.body.firstname,
        LastName: req.body.lastname,
        Username: req.body.username,
        Password: req.body.password,
        Email: req.body.email
    };


    console.log(`==============USER INPUT==============`);
    console.log(userInput);

    user.create(userInput, function (lastID) {
        if (lastID) {
            user.find(lastID, function (result) {
                req.session.user = result;
                res.redirect('/feed');
            });

            userCollection.find({}).then((docs) => {
                console.log("New user added...New userCollection:");
                console.log(docs);
            });

        }
        else {
            res.send('Error creating a new user...username or email already exists!');
        }
    });
});

// Logout Request
router.get('/logout', (req, res, next) => {
    let user = req.session.user;
    if (user) {
        req.session.destroy(function () {
            const userCollection = db.get('users');
            userCollection.update({ Username: user.Username }, { $set: { 'OnlineStatus': 0 } });
            res.redirect('/');
        });
    }
});

// Feed
router.get('/feed', function (req, res) {
    let user = req.session.user;
    if (user) {
        let postCollection = db.get('post');
        postCollection.find({}, function (err, docs) {
            if (err) throw err;
            res.render('feed', { user: user, items: docs });

        });
    }
    else {
        res.redirect('/');
    }
});

// Messages
router.get('/messages', function (req, res) {
    let user = req.session.user;

    let chatArray = [];

    let chatBuddy = 'jackli123';

    if (user) {

        let chatCollection = db.get('chat');

        chatCollection.find({ users: ['sliu57', 'jackli123']}, function (err, privatechat) {
            if(err){
                console.log("Chat doesn't exist");
            } else {


                chatCollection.find({ "messages": { $size: 3} }, function (err, messages) {
                    chatArray.push(messages);
                    console.log(chatArray);
                } )
            }
        });

        res.render('messages', { user: user, chatArray, chatBuddy });
    }
    else {
        res.redirect('/');
    }
});

// Profile
router.get('/profile', function (req, res) {
    let user = req.session.user;
    if (user) {
        res.render('profile', { user: user });
    }
    else {
        res.redirect('/');
    }
});

// Family
router.get('/family', function (req, res) {
    let user = req.session.user;
    if (user) {
        res.render('family', { user: user });
    }
    else {
        res.redirect('/');
    }
});

module.exports = router;