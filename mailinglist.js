var GoogleSpreadsheet = require("google-spreadsheet");
 
// spreadsheet key is the long id in the sheets URL 
var my_sheet = new GoogleSpreadsheet('<1x9_Wen8GQV8-I3o4iEXjxs1y_B_l6VKXvyuX1IzdzGE>');

// Without auth -- read only 
// IMPORTANT: See note below on how to make a sheet public-readable! 
// # is worksheet id - IDs start at 1 
my_sheet.getRows( 1, function(err, row_data){
    console.log( 'pulled in '+row_data.length + ' rows');
});
 
// With auth -- read + write 
// see below for authentication instructions 
var creds = require('./google-generated-creds.json');
// OR, if you cannot save the file locally (like on heroku) 
var creds = {
  client_email: '596794591195-na6uefl1h6h7ecibth4ubljvvojsqqvk@developer.gserviceaccount.com',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCgHdjvHza63dym\n1+fgItJvgk5u4tzPaSYs8O7kkN8iAkqiPKE87fZmd6rA8+sEd/4BNOCbzwwWRd8F\ndJLi1Vk/D6j7l5XPE9JmVgNF9xpyLP7qJyIWHZ/MOygHtGg+2ITxfJxSuEyl9UkK\nI3CbbPAEbZtyENDXddZi6muuqRXPDzXh23HkxeAdYISl+Z7OxI/L81F995zpyI31\n2SlSJeC4NsMwY3hhhDd58A1eZ+5YI9zqI230CpWDx70tsUpmexV4pKYqwh3p6Kbc\nnlUG+q6JPQ7FvMMn4+tId5en13xGC4QiKYetOASoQo1dZIx/isuU153m1iNbFRxo\nZUIwjBXJAgMBAAECggEBAI4pcg79m85WZi8My6fJwyWWgKUbcAoHxglo8fKmXjcH\n6dQaGN7MOVXJMiaXazdQgon3tOUh9A1ihB2H31LfMpo3AUZA1JZDdy+9drKML0Lo\niHzFuhIAw3zFmUkd+OCzxXXTucgIMqW3Ht6NkNGu63xDBR1FqOdkjLDOikVNgzuP\nUjZe6pBUzwLZiVOqgAyMmkuK55Wjbpy/diubFTd5IxLyq1x8qlb/9BYiVd7NpUDy\n+wTLOTbY4YEZD7Gmry5jokM0+dio4qBPviJ8iShw+yy55QKflWPHqOMdLMfuc+Tf\n9aNZolfVibYBCtjDR1LrcmC+udofBkwaYo617NCuZMECgYEAy0f39NuYJwN5MfJP\nKrmAkDRw6A/cupvNt/KgfD1QhEUDPAFN7jAvP4hvyMELquUcrYq9RCym5ifm3cqh\n7m6EMoXDvQg50WizV+FSNl56AquIYmM3vOC75K94xfJHUoRwM/uX70amWaCvyunL\nbMcrkFglXvhxH5n+FsGBC0hB0Y0CgYEAyaQks/aCfwLiAfTQm4HO2kz+YHzkSyLI\n7rT0/XVZTPsandYgHxeKYgQFbtzfyql1QvFZHTjn3O3p/CXg4QF4/JOkDT0y/HsS\n27Q97+5OFBMcgyZv3xt5IfNVyiMdaA5+WmVTrXoM+KyvNkZGCvHaV5q8XvTC4Zmh\nxYmAHk+zQC0CgYEAxlsCc7Y3IJJ+FyOW5ly+O3hAV+DqhFh1gzHIMZLu1zI0NsAb\nF/mCkR8D3MOqK+aGdjxz9GsRrHFxECiim/LRIi9uUS0OpezhWzYtL4o+yg4w9bhU\n8gPktAAY/CYuPDGo/sBYgA3TUo++GWTKr+kk9CNey+3nDGwKCJBm5+ho+R0CgYEA\npjM3VWZAFXRI2RfywdpypxiDKwCGIzAesjJRJICPBJaMT8BoZXg/xZ5O5BwGEcMv\nNeg8bYu0ATPQgtatzogqMvV2aLsixVykJJch3htsG7vM6oTJ/PlmFIe/FIdw+43G\ns7eFCx3ohye+m1u869SBBWgzD4lrAAxjfLBi+5jxxFkCgYBM7y4oneG4EbXJ1Rnv\ntIXCeBe+mbNqeO+7+vB6cGw/B2Nb5FB7ciplocOk00Tu3tvM6IibqFv2yNK+Qoft\nj5DcnMfcvSN3/MMCMOQZtEHRgilzhcCwKY4HtU1O/Cd+NAJsrWF24snCZj4yPrxj\ntM7VZZJ8EqBTuRztwnTumE0HXw\u003d\u003d\n-----END PRIVATE KEY-----\n'
}
 
my_sheet.useServiceAccountAuth(creds, function(err){
    // getInfo returns info about the sheet and an array or "worksheet" objects 
    my_sheet.getInfo( function( err, sheet_info ){
        console.log( sheet_info.title + ' is loaded' );
        // use worksheet object if you want to stop using the # in your calls 
 
        var sheet1 = sheet_info.worksheets[0];
        sheet1.getRows( function( err, rows ){
            rows[0].colname = 'new val';
            rows[0].save(); //async and takes a callback 
            rows[0].del();  //async and takes a callback 
        });
    });
 
    // column names are set by google and are based 
  // on the header row (first row) of your sheet 
    my_sheet.addRow( 2, { colname: 'col value'} );
 
    my_sheet.getRows( 2, {
        start: 100,          // start index 
        num: 100,              // number of rows to pull 
        orderby: 'name'  // column to order results by 
    }, function(err, row_data){
        // do something... 
    });
})