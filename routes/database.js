const
    express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('mongo:27017/familychat');

/* User Collection (Collection Name: users)
    - _id
    - FirstName
    - LastName
    - Username
    - Password
    - Email
    - DateCreated
    - LastLogin
    - ProfilePic
    - OnlineStatus (Datatype: int[1=on, 0=off])
    - FamilyID
 */

/* Family Collection (Collection Name: family)
    - _id
    - Nickname
    - Size
    - ProfilePic
    - DateCreated
    - CreatorID
 */

/* Post Collection (Collection Name: post)
    - _id
    - UserID
    - DateCreated
    - FilePath
    - PostTitle
    - PostContent
    - Comments[]
    - Upvote[]
    - Downvote[]
 */

/* Comment Collection (Collection Name: comment)
    - _id
    - PostID
    - UserID
    - DateCreated
    - CommentContent
 */

/* Voting Collection (Collection Name: vote)
    - _id
    - PostID
    - UserID
    - Vote (Datatype: int[1=up, 0=down])
 */

let userCollection = db.get('users');
let familyCollection = db.get('family');
let postCollection = db.get('post');
let commentCollection = db.get('comment');
let voteCollection = db.get('vote');

module.exports = router;