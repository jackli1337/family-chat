const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');

let db = monk('mongo:27017/familychat');

// let userCollection = db.get('users');
// var temp_user = {
//     id: "1",
//     name: {
//         first: "John",
//         last: "Doe"},
//     family_id: "1"
// };
// userCollection.insert(temp_user);

module.exports = router;