const express = require('express');
const path = require('path');
const router = express.Router();

mongo = require('mongodb');
monk = require('monk');
db = monk('mongo:27017/familychat');

let postCollection = db.get('post');

//
router.get('/feed', function (req, res) {
    postCollection.find({}, function(err, docs) {
        if (err) throw err;
        res.render('feed', {items: docs});
    });
});

// upload

router.post('/create-post', (req, res, next) => {
    if(req.files){
        console.log(req.files);

        var file = req.files.file;
        var filename = file.name;

        console.log(filename);

        file.mv('./client/users/ids/1/' + filename, function (err) {
            if(err) {
                console.log(err);
            } else {
                console.log("Successfully uploaded file!!!");
                // res.redirect('/feed');

                var temp_post2 = {
                    id: "2",
                    user_id: 1,
                    filepath: '/users/ids/1/' + filename,
                    content: {
                        title: req.body.postTitle,
                        post: req.body.posttxt,
                    },
                    comments: [],
                    upvote: [],
                    downvote: []

                };

                postCollection.insert(temp_post2);
                console.log(temp_post2);
                res.redirect('/get-data');

            }
        });
    };
});

router.get('/get-data', function (req, res, next) {
    var data = postCollection.find({}, function (err, data) {
        if (err) {
            console.log("Error");
            throw err;
        }
        console.log(data);
        res.render('feed', {items: data})
    });
});

module.exports = router;