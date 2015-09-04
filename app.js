var express = require('express'),
path = require('path'),
logger = require('morgan'),
bodyParser = require('body-parser'),
subscriptionRoute = require('./routes/subscription'),
compression = require('compression'),
debug = require('debug')('expressapp');


var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(request, response) {
  response.render('../app');
});

// view engine setup
app.set('view engine', null);

// compress all requests
app.use(compression());

app.use('/api/subscription', subscriptionRoute);
app.use('/health', function(req, res, next) {
  res.status(200).send({
    status: 'ok'
  });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err,
            title: err.title || 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {},
        title: err.title || 'error'
    });
});

if (!module.parent) {
  app.set('port', process.env.PORT || 3000);

  process.env.host = process.env.host;

  var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
  });
}

module.exports = app;
