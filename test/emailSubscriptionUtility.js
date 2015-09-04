var should = require('should'),
  path = require('path'),
  inspect = require('eyes').inspector(),
  EmailSubscriptionUtility = require('../lib/emailSubscriptionUtility');

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

describe('Retrieve index files', function() {
  var emailSubscriptionUtility;

  var creds = require(path.resolve(getUserHome() + '/.wellconnectednow/dev.json'));

  this.timeout(3000);

  beforeEach(function() {
    emailSubscriptionUtility = new EmailSubscriptionUtility({
      spreadsheet_user: creds.spreadsheet_user,
      spreadsheet_key: creds.spreadsheet_key
    });
  });

  it('should add an email to the email list', function(done) {
    emailSubscriptionUtility.addEmailSubscription('foo@foo.com', function(err) {
      inspect(err);
      should(err).not.be.ok;
      done();
    });

  });

});
