/*jshint node:true*/
'use strict';

var config      = require('./../config.json'),
    TweetStream = require('node-tweet-stream');
    //var twitter     = new TweetStream(config.twitter_api);
var moment = require('moment');

module.exports = function (io) {

    ///**
    // * Setup Twitter Stream
    // */
    //twitter.on('tweet', function (tweet) {
    //
    //    io.emit('tweet', tweet);
    //    console.log(tweet.text)
    //});
    //twitter.track('hong kong');


    /**
     * Setup Socket Events
     */
    io.on('connection', function (socket) {

        console.log('Client connected:', socket.handshake.address, socket.handshake.time);
    });
    io.on('error', function (error) {

        console.log('Twitter error:', error);
    });


    // Send test data for client D3 graph
    var data = [
        {timestamp: 1417879284622, value: 0},
        {timestamp: 1417879285622, value: 1},
        {timestamp: 1417879286622, value: 2},
        {timestamp: 1417879287621, value: 3},
        {timestamp: 1417879288623, value: 4},
        {timestamp: 1417879289625, value: 5},
        {timestamp: 1417879290627, value: 6},
        {timestamp: 1417879300627, value: 7},
        {timestamp: 1417879310627, value: 8},
        {timestamp: 1417879320627, value: 9},
        {timestamp: 1417879330627, value: 10}
    ];
    setInterval(function () {

        data = data.slice(1);
        data.push({timestamp: moment().utc().valueOf(), value: Math.round(Math.random()*10)});
        console.log('\n', data);
        io.emit('tweet-count-history', data);
        //console.log(data);
    }, 2000);

};