const express = require('express');
const path = require('path');
const router = express.Router();

// 
router.get('/feed', function (req, res) {
    res.render('feed');
});

// upload


module.exports = router;