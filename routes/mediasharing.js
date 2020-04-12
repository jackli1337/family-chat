const
    express = require('express'),
    path = require('path'),
    router = express.Router(),
    database = require(`./database`);

// 
router.get('/feed', function (req, res) {
    res.render('feed');
});

// upload

router.post('/create-post', (req, res) => {
    if (req.files) {
        console.log(req.files);

        var file = req.files.file;
        var filename = file.name;

        console.log(filename);

        file.mv('./client/users/ids/' + filename, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully uploaded file!");
            }
        })
    }
});

// router.post("/create-post", function(req, res){
//     if(req.files){
//         console.log(req.files);
//         var file = req.files.filename,
//             filename = file.name;
//         file.mv("./client/users/ids/" + filename, function (err) {
//             if(err){
//                 console.log("Invalid Image")
//             } else {
//                 console.log("Successfully uploaded" + filename);
//             }
//         })
//
//     }
// });



module.exports = router;