var express = require('express');
var router = express.Router();
IndexFileUtility = require('../lib/indexFileUtility');

var indexFileUtility = new IndexFileUtility();

router.get('/', function(req, res) {
  indexFileUtility.fetchAndCacheLatestIndexFile(function(err, data) {
    if (err) return next(err);
    res.status(200);
    res.set('Content-Type', 'text/html');
    res.set('Cache-Control', 'no-cache');
    res.send(data);
  });
});

module.exports = router;
