'use strict';

var moment = require('moment'),
  GoogleSpreadsheet = require("google-spreadsheet");

function EmailSubscriptionUtility(params) {
  params = params || {};

  this.creds = {
    client_email: params.spreadsheet_user,
    private_key: params.spreadsheet_key
  };

  this.spreadsheet = new GoogleSpreadsheet(params.spreadsheet_key);
}

EmailSubscriptionUtility.prototype.addEmailSubscription = function(email, cb) {
  this.spreadsheet.useServiceAccountAuth(this.creds, function(err) {
    if (err) {
      //bail
      console.log('An error occured while trying to auth to google spreadsheet: ' + JSON.stringify(err));
      console.log('creds used: ' + JSON.stringify(this.creds));
      return cb(new Error({
        message: 'Failed to auth to google spreadsheets',
        err: err
      }));
    }

    this.spreadsheet.addRow(1, {
      email: email,
      time: (new Date()).toString()
    }, function(err) {
      console.log('added new row?')

      if (err) {
        //bail
        return cb(new Error({
          message: 'Failed to save entry',
          err: err
        }));
      }

      cb();
    });
  }.bind(this));
};

module.exports = EmailSubscriptionUtility;
