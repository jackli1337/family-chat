const express = require('express');
const path = require('path');
const router = express.Router();

// 

router.get('/download/:id', function (req, res) {
    let path = req['path'];
    familyID = path.split('/')[2];

    let
        location = `${__dirname}/../client/family`,
        output = fs.createWriteStream(`${location}/${familyID}.zip`),
        archive = archiver('zip', {
            gzip: true,
            zlib: { level: 9 } // Sets the compression level.
        });

    archive.directory(`${location}`, `${familyID}`);
    archive.pipe(output);
    archive.finalize();
    archive.on('error', function (err) { throw err; });
    output.on('close', function () {
        res.download(`${location}/${familyID}.zip`);
    });
});

module.exports = router;