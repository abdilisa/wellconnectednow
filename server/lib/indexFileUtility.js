var S3 = require('aws-sdk').S3,
_ = require('underscore'),
moment = require('moment');

function IndexFileUtility(params) {
  var params = params || {};
  if (process.env.NODE_ENV === 'development') {
    params.accessKeyId = process.env.AWSAccessKeyId;
    params.secretAccessKey = process.env.AWSSecretKey;
  }

  this.s3 = new S3(params);

  this.updateIndexEvery = process.env.updateIndexEvery || (1000*60*7);
};

IndexFileUtility.prototype.listIndexFiles = function(cb) {
  var params = {
    Bucket: 'wellconnectedassets',
    EncodingType: 'url'
  };

  this.s3.listObjects(params, function(err, data) {
  if (err) return cb(err);

    var indexFile = _.filter(data.Contents, function(listedObj) {
      //TODO this will eventually grab multiple versions of index files
      return listedObj.Key === 'index.html';
    });

    cb(null, indexFile);
  });
};

IndexFileUtility.prototype.getHtmlFile = function(params, cb) {
  var fetchParams = {
    Bucket: 'wellconnectedassets',
    ResponseContentType: 'text/html'
  };

  fetchParams.Key = params.Key;
  this.s3.getObject(fetchParams, function(err, result) {
    if (err) return cb(err);

    var htmlContents = result.Body.toString('utf8');

    cb(null, htmlContents);
  });
}

IndexFileUtility.prototype.fetchAndCacheLatestIndexFile = function(cb) {

  var cacheNeedsUpdating = false;

  if (this.cachedIndexFile) {
    var lastCheckedAgo = moment(this.cachedIndexFile.lastChecked).diff(new Date());

    if (lastCheckedAgo < this.updateIndexEvery) {
      return cb(null, this.cachedIndexFile.cachedFileContents);
    }
  }

  this.listIndexFiles(function(err, indexFileList) {

    if (err) return cb(err);

    // only one indexFile for now
    var indexFileInfo = indexFileList[0];

    if (this.cachedIndexFile) {

      cacheNeedsUpdating = moment(this.cachedIndexFile.LastModified).isBefore(indexFileInfo.LastModified);

    } else {
      cacheNeedsUpdating = true;
    }

    if (!cacheNeedsUpdating) {
      this.cachedIndexFile.lastChecked = moment(new Date()).format();
      return cb(null, this.cachedIndexFile.cachedFileContents);
    }

    this.getHtmlFile({
      Key: indexFileInfo.Key
    }, function(err, htmlContents) {

      this.cachedIndexFile = indexFileInfo;
      this.cachedIndexFile.lastChecked = moment(new Date()).format();
      this.cachedIndexFile.cachedFileContents = htmlContents;

      cb(null, htmlContents);
    }.bind(this));
  }.bind(this));
};

module.exports = IndexFileUtility;
