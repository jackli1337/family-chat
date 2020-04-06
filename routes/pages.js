const express = require('express');
const path = require('path');
const router = express.Router();

// Login/Registration Portal
router.get('/', function (req, res) {
    res.render('portal');
});

// Login/Registration Portal
router.get('/feed', function (req, res) {
    res.render('feed');
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