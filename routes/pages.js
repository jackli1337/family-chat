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
    if (user) {
        res.render('messages', { user: user });
    }
    else {
        res.redirect('/');
    }
});

// Profile
router.get('/profile', function (req, res) {
    let user = req.session.user;

    // get all posts by user
    let postCollection = db.get('post');

    if (user) {

        postCollection.find({ user_id: user._id }, function (err, docs) {
            res.render('profile', { target: user, user: user, posts: docs });
        });
    }
    else {
        res.redirect('/');
    }
});

// Profile - URI
router.get('/profile/:id', function (req, res) {
    let user = req.session.user;
    let userCollection = db.get('users');
    
    if (user) {
        let path = req['path'];
        let uri = path.split('/')[2];

        userCollection.find({ Username: uri }, function (err, result) {

            // user not found
            if (!result[0]) {
                res.redirect('/');
            }

            else {
                console.info(result);
                console.info(result[0]);
                console.info(result[0]._id);
                let postCollection = db.get('post');
                postCollection.find({ user_id: result[0]._id }, function (err, docs) {

                    // found self
                    if (result.length && (result[0].Username === user.Username || uri === "")) {
                        res.render('profile', { target: result[0], user: user, posts: docs });
                    }

                    // found others 
                    else if (result.length !== 0) {
                        // checking following
                        res.render('profile', { target: result[0], user: user, posts: docs });
                    }
                    console.log(result)
                });
            }
        });

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