const
    fs = require('fs'),
    archiver = require('archiver'),
    express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('mongo:27017/familychat');




/* create user collection
        - userID
        - firstname
        - familyID
        - pfpID
        - email
        - password
        - authoToken
        - regDate
        - logged
 */
let userCollection = db.get('users');

// Creating User
// var temp_user = {
//     id: "1",
//     name: {
//         first: "John",
//         last: "Doe"},
//     family_id: "1"
// };
// userCollection.insert(temp_user);

// Finding User
userCollection.find({ id: '1' }, function (err, temp_user) {
    if (err) {
        console.log("Temp User Not Found");
    }
    else {
        console.log('Temp User Found');
        console.log(temp_user);
    }
});


/* create family collection
        - familyID
        - nickname
        - pfpID
        - userID
        - member ID's
        - regDate
        - images
 */
let familyCollection = db.get('family');
// Creating Family
var temp_fam = {
    id: "1",
    nickname: "8888",
    pfp_id: "1",
    user_id: 1,
    members: [0, 1, 2, 3],
    user_id: 1,
    reg_date: Date.now(),
    folder: "family/8888"
};
familyCollection.insert(temp_fam);
// Finding Family
familyCollection.find({ id: '1' }, function (err, temp_fam) {
    if (err) {
        console.log("Temp Family Not Found");
    }
    else {
        console.log('Temp Family Found');
        console.log(temp_fam);
    }
});



/* create post collection
        - postID
        - userID
        - filepath
        - content
        - upvote
        - downvote
 */
let postCollection = db.get('post');
// Creating User
var temp_post = {
    id: "1",
    user_id: 1,
    filepath: 'users/id/1',
    content: {
        title: "VERY FUNNY!!!",
        post: "Yo mama's so stupid, if she spoke her mind, she'd be speechless."
    },
    comments: [],
    upvote: [],
    downvote: []
};
postCollection.insert(temp_post);
// Finding Post
postCollection.find({ id: '1' }, function (err, temp_post) {
    if (err) {
        console.log("Temp Post Not Found");
    }
    else {
        console.log('Temp Post Found');
        console.log(temp_post);
    }
});


/* create comment collection
        - commentID
        - postID
        - userID
        - data
 */
let commentsCollection = db.get('comment');



/* create voting collection
        - postID
        - userID
        - up/down
 */
let votingCollection = db.get('voting');


// Downloads family data
// << TESTING >> this is a temp family entry
// familyCollection.insert(temp_family = {
//     id: '8888',
//     nickname: 'lucky',
//     size: 99,
//     pfpID: 'none.jpg',
//     userID: '1',
//     regDate: Date.now(),
//     images: 33
// });
router.get('/download/:id', function (req, res) {
    let path = req['path'];
    familyID = path.split('/')[2];

    let
        location = `${__dirname}/../client/family`,
        output = fs.createWriteStream(`${location}/${familyID}.zip`),
        archive = archiver('zip', {
            gzip: true,
            zlib: { level: 9 } // Sets the compression level.
        });

    archive.directory(`${location}`, `${familyID}`);
    archive.pipe(output);
    archive.finalize();
    archive.on('error', function (err) { throw err; });
    output.on('close', function () {
        res.download(`${location}/${familyID}.zip`);
    });
})


module.exports = router;