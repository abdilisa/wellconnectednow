var express = require('express'),
  router = express.Router(),
  mcapi = require('mailchimp-api'),
  EmailSubscriptionUtility = require('../lib/emailSubscriptionUtility');

var mc = new mcapi.Mailchimp(process.env.mailchimp_access_key || '');

var unverifiedSubscriptions = new EmailSubscriptionUtility({
  client_email: process.env.spreadsheet_user,
  private_key: process.env.spreadsheet_key
});

router.post('/', function(req, res, next) {
  mc.lists.subscribe({
      id: 'email_list',
      email: {
        email: req.body.email
      }
    }, function(data) {

      //return successfully right away, we don't need to wait on spreadsheet logic
      res.status(201).send();

      unverifiedSubscriptions.addEmailSubscription(req.body.email, function(err) {
        if (err) {
          console.log('An error occured while saving an unverified email', err);
        }
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
