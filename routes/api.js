const express = require('express');
const router = express.Router();

/* GET users listing. */
router.post('/file', function(req, res, next) {
    console.log('fields:', req.fields);
    console.log('files:', req.files);
    res.send('respond with a resource');
});

module.exports = router;
