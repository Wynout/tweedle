/*jshint node:true*/
'use strict';

var compress    = require('compression'),
    express     = require('express'),
    app         = require('express')(),
    favicon     = require('serve-favicon'),
    http        = require('http'),
    server      = http.createServer(app),
    sio         = require('socket.io')(server),
    tweetStream = require('./tweet-stream')(sio),
    logger      = require('morgan'),
    port        = process.env.PORT || 3000;

var appDir      =  __dirname + '/../client/', // Our code is served from client directory
    environment = process.env.NODE_ENV;
    // config      = require('./../config.json'),
    // pkg         = './../package.json';

/**
 * Setup Express
 */
app.use(compress({threshold: 512})); // Compress response data with gzip when byte size >= threshold
app.use(express.static(appDir));
app.use(favicon(appDir + 'content/images/favicon.ico'));
app.use(logger('dev'));

console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);


/**
 * Routes
 */
app.get('/', function (req, res) {

    res.redirect('/index.html');
});


/**
 * Start tracking tweets
 */
tweetStream.track('amsterdam');


/**
 * Start Serving
 */
server.listen(port, function () {

    console.log('Express server listening on port ' + port);
    console.log('env = '+ app.get('env') +
    '\n__dirname = ' + __dirname  +
    '\nprocess.cwd = ' + process.cwd() );
});