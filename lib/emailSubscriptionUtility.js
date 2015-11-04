'use strict';

var moment = require('moment'),
  GoogleSpreadsheet = require("google-spreadsheet");

function EmailSubscriptionUtility(params) {
  params = params || {};

  this.creds = {
    client_email: params.spreadsheet_user,
    private_key: params.spreadsheet_key
  };

  this.spreadsheet = new GoogleSpreadsheet('1x9_Wen8GQV8-I3o4iEXjxs1y_B_l6VKXvyuX1IzdzGE');
}

EmailSubscriptionUtility.prototype.addEmailSubscription = function(email, cb) {
  this.spreadsheet.useServiceAccountAuth(this.creds, function(err) {
    console.log('Attempting to auth to google spreadsheets using: ' + JSON.stringify(this.creds));

    if (err) {
      //bail
      console.log('An error occured while trying to auth to google spreadsheet: ');
      inspect(err);
      return cb(new Error({
        message: 'Failed to auth to google spreadsheets',
        err: err
      }));
    }
    else {
      console.log('authenticated to google spreadsheet successfully!')
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
