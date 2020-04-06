const
    express = require('express'),
    path = require('path'),
    escapeHtml = require('escape-html'),
    app = express(),
    http = require(`http`).Server(app),
    io = require(`socket.io`)(http),
    upload = require("express-fileupload"),

    pageRouter = require('./routes/pages'),
    fileRouter = require('./routes/files'),

    mediashareRouter = require('./routes/mediasharing');

// <!--Setting View Engine-->
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// <!--Start Routing-->
// Serve Static Files
app.use(express.static(path.join(__dirname, 'client')));
// Serve Pages
app.use(pageRouter);
// Serve Files
app.use(fileRouter);
// Media Share Files
app.use(mediashareRouter);
app.use(upload());
// Error Handling
app.use((req, res, next) => {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { errorMsg: err.message });
});


// <!--Start Website-->
http.listen('3000', () => {
    console.log('Server Started on Port 3000')
});