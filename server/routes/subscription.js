var express = require('express'),
  router = express.Router(),
  mcapi = require('mailchimp-api'),
  inspect = require('eyes').inspector(),
  EmailSubscriptionUtility = require('../lib/emailSubscriptionUtility'),
  googleCreds;

console.log('using mailchimp key:', process.env.mailchimp_access_key);
var mc = new mcapi.Mailchimp(process.env.mailchimp_access_key || '');

if (process.env.useConfigFile) {
 googleCreds = require('../config/prod.json');
} else {
  googleCreds = {
    spreadsheet_user: process.env.spreadsheet_user,
    spreadsheet_key: process.env.spreadsheet_key
  };
}

var unverifiedSubscriptions = new EmailSubscriptionUtility(googleCreds);
console.log('using google creds', googleCreds);

router.post('/', function(req, res, next) {
  mc.lists.subscribe({
      id: 'd24ee8d994',
      email: {
        email: req.body.email
      }
    }, function(data) {

      //return successfully right away, we don't need to wait on spreadsheet logic
      res.status(201).send();

      unverifiedSubscriptions.addEmailSubscription(req.body.email, function(err) {
        if (err) {
          console.log('An error occured while saving an unverified email');
          inspect(err);
          return;
        }
        console.log('Email added to spreadsheet');
      });

    },
    function(error) {
      var errorMessage = error.error || 'an error occurred while subscribing user';
      next({
        status: 400,
        message: errorMessage,
        error: error
      });
    });
});

module.exports = router;
