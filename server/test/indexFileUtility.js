var should = require('should'),
  IndexFileUtility = require('../lib/indexFileUtility');

describe('Retrieve index files', function() {
  var indexFileUtility;

  this.timeout(3000);

  beforeEach(function() {
    indexFileUtility = new IndexFileUtility();
  });

  it('should grab all of the index files', function(done) {
    indexFileUtility.listIndexFiles(function(err, data) {
      should(err).be.not.ok;
      data.should.be.ok;
      data.should.have.length;
      done();
    });

  });

  it('should grab contents of latestFile', function(done) {
    indexFileUtility.fetchAndCacheLatestIndexFile(function(err, data) {
      should(err).be.not.ok;
      data.should.be.ok;
      done();
    });
  });

});

describe('Uses cache correctly', function() {
  var indexFileUtility;

  this.timeout(3000);

  beforeEach(function() {
    var listIndexCalled = false,
    getHtmlCalled = false;

    indexFileUtility = new IndexFileUtility();

    var _listIndexFiles = indexFileUtility.listIndexFiles;
    indexFileUtility.listIndexFiles = function() {
      console.log('checking files');
      listIndexCalled = true;
      _listIndexFiles.apply(this, arguments);
    }.bind(indexFileUtility);

    var _getHtmlFile = indexFileUtility.getHtmlFile;
    indexFileUtility.getHtmlFile = function() {
      console.log('html fetched!');
      getHtmlCalled = true;
      _getHtmlFile.apply(this, arguments);
    }.bind(indexFileUtility);

  });

  it('should cache file after requesting it', function(done) {
    indexFileUtility.fetchAndCacheLatestIndexFile(function(err, data) {
      should(err).be.not.ok;

      indexFileUtility.cachedIndexFile.cachedFileContents === data;
      done();
    });

  });

  it('should not check list or rerequest file immediately after', function(done) {
    indexFileUtility.fetchAndCacheLatestIndexFile(function(err, data) {

      //reset
      listIndexCalled = false;
      getHtmlCalled = false;

      indexFileUtility.fetchAndCacheLatestIndexFile(function(err, data) {
        listIndexCalled.should.be.equal(false);
        getHtmlCalled.should.be.equal(false);
        done();
      });

    });

  });

  it('should check list, but not rerequest file if file has not updated', function(done) {

    indexFileUtility.updateIndexEvery = 0;

    indexFileUtility.fetchAndCacheLatestIndexFile(function(err, data) {

      //reset
      listIndexCalled = false;
      getHtmlCalled = false;
      setTimeout(function() {
        indexFileUtility.fetchAndCacheLatestIndexFile(function(err, data) {
          listIndexCalled.should.be.equal(true);
          getHtmlCalled.should.be.equal(false);
          done();
        });
      }, 200);
    });

  });
});
