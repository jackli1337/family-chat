const express = require('express');
const path = require('path');
const router = express.Router();

// Website Icon
router.get('/favicon.ico', function (req, res) {
    res.sendFile(path.join(__dirname, '../favicon.ico'));
});

module.exports = router;