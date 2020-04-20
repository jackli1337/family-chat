const express = require('express');
const path = require('path');
const router = express.Router();

// Login/Registration Portal
router.get('/', function (req, res) {
    res.render('index');
});

// Messages
router.get('/messages', function (req, res) {
    res.render('messages');
});

// Profile
router.get('/profile', function (req, res) {
    res.render('profile');
});

// Family
router.get('/family', function (req, res) {
    res.render('family');
});
module.exports = router;