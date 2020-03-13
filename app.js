const express = require('express');
const app = express();


<!--Start Of Page Routing-->
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/portal.html', function (req, res) {
    res.sendFile(__dirname + '/client/portal.html');
});
app.get('/feed.html', function (req, res) {
    res.sendFile(__dirname + '/client/feed.html');
});
app.get('/profile.html', function (req, res) {
    res.sendFile(__dirname + '/client/profile.html');
});
app.get('/messages.html', function (req, res) {
    res.sendFile(__dirname + '/client/messages.html');
});
app.get('/family.html', function (req, res) {
    res.sendFile(__dirname + '/client/family.html');
});
<!--End Of Page Routing-->

<!--Start Of Required Files Routing-->
app.get('/css/style.css', function (req, res) {
    res.sendFile(__dirname + '/client/css/style.css');
});
app.get('/img/Profile%20Picture.png', function (req, res) {
    res.sendFile(__dirname + '/client/img/Profile Picture.png');
    res
});
app.get('/img/Profile%20Picture.png', function (req, res) {
    res.sendFile(__dirname + '/client/img/sunset.jpg');
});
<!--End Of Required Files Routing-->

app.listen('8000');