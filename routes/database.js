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

/* Chatting Collection (Collection Name: chat)
    - chat_id

    messages: [
        { message_id: 1
          message: hi,
          sender_id: 1,
          receiver_id: 2,
          timestamp: Date.now(),
        },
        { message_id: 2
          message: What's up?,
          sender_id: 1,
          receiver_id: 2,
          timestamp: Date.now(),
        },

 */



let userCollection = db.get('users');

userCollection.find({}).then((docs) => {
    console.log("All users");
    console.log(docs);
});


let familyCollection = db.get('family');
let postCollection = db.get('post');
let commentCollection = db.get('comment');
let voteCollection = db.get('vote');


let chatCollection = db.get('chat');

let temp_chat = {
    chat_id: '1',
    users: ['sliu57', 'jackli123'],

    messages: [
        {
            message: "hi",
            sender: 'sliu57',
        },
        {
            message: "What's up?",
            sender: 'jackli123',
        }
        ]

};

//chatCollection.insert(temp_chat);

chatCollection.find({}).then((docs) => {

    //chatCollection.remove( { chat_id: '1'});

     console.log("All chats");
     console.info(docs);
});




module.exports = router;