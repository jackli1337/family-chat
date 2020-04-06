const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');

let db = monk('mongo:27017/familychat');
let userCollection = db.get('users');

module.exports = router;