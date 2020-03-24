const express = require('express');
const router = express.Router();
const fs = require('fs');

function processFile(buffer) {
    // split the contents by new line
    const lines = buffer.toString().split(/\r?\n/);

    // print all lines
    lines.forEach((line) => {
        console.log(line);
    });
}

/* GET users listing. */
router.post('/file', function(req, res, next) {
    fs.promises.readFile(req.files.file.path)
        .then((buffer) => {
            processFile(buffer);
        })
        .catch((err) => {
           console.error(err);
           res.status(500).send(err);
        });

    res.send('respond with a resource');
});

module.exports = router;
