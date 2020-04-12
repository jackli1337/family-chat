const express = require('express');
const path = require('path');
const router = express.Router();

mongo = require('mongodb');
monk = require('monk');
db = monk('mongo:27017/familychat');

var postCollection = db.get('post-collection');

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

        file.mv('./client/users/ids/' + filename, function (err) {
            if(err) {
                console.log(err);
            } else {
                console.log("Successfully uploaded file!!!");
                // res.redirect('/feed');

                var userdata = {

                    userPostText: req.body.posttxt,
                    userFile: filename,
                    userName: req.body.postuser
                };

                postCollection.insert(userdata);
                console.log(userdata);
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