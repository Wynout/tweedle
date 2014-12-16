/*jslint node: true */
'use strict';

var config      = require('./../config.json'),
    TweetStream = require('node-tweet-stream'),
    twitter     = new TweetStream(config.twitter_api),
    moment      = require('moment');


module.exports = function (io) {

    var minutes = [],
        lastRecordedMinute = -1;


    // Initialize the minutes array
    function initialize() {

        var now          = moment(),
            minuteExact  = [now.year(), now.month(), now.date(), now.hour(), now.minute(), 0],
            nowTimestamp = moment(minuteExact).valueOf(), // timestamp of current minute, exact (seconds 0)
            currentTimestamp,
            i;

        for (i = 0; i < 60; i += 1) {
            currentTimestamp = moment(nowTimestamp).subtract(59 - i, 'minutes').valueOf();
            minutes.push({ timestamp: currentTimestamp, value: 0, minute: i });
        }
    }
    initialize();


    function getCurrentMinute() {

        return parseInt(moment().format('m'), 10);
    }


    function incrementMinuteHistory() {

        var currentMinute = getCurrentMinute(),
            minuteTimestamp,
            now;

        // Initialize last recorded minute
        if (lastRecordedMinute < 0) {
            lastRecordedMinute = currentMinute;
            console.info('init last recorded minute: ', lastRecordedMinute);
        }

        // Reset counter of current minute
        if (lastRecordedMinute !== currentMinute) {
            now             = moment();
            minuteTimestamp = moment([now.year(), now.month(), now.date(), now.hour(), now.minute(), 0]).valueOf(); // timestamp of current minute, exact (seconds 0)
            minutes[currentMinute].timestamp = moment(minuteTimestamp).valueOf();
            minutes[currentMinute].value = 0;
        }

        // Increment counter current minute
        minutes[currentMinute].value += 1;
        minutes[currentMinute].minute = currentMinute;
        lastRecordedMinute = currentMinute;
    }


    function getMinuteHistory() {

        var left    = [],
            right   = [],
            history = [],
            minute  = getCurrentMinute();

        if (minute === 59) {
            history = minutes;
        } else {
            left    = minutes.slice(minute + 1);
            right   = minutes.slice(0, minute + 1);
            history = left.concat(right);
        }
        return history;
    }


    /**
     * Setup Twitter Stream
     */
    twitter.on('tweet', function (tweet) {

        incrementMinuteHistory();
        io.emit('tweet', tweet);
    });
    twitter.track('sydney');


    /**
     * Setup Socket Events
     */
    io.on('connection', function (socket) {

        console.info('Client connected:', socket.handshake.address, socket.handshake.time);
    });
    io.on('error', function (error) {

        console.error('Twitter error:', error);
    });


    // Send minute history
    setInterval(function () {

        io.emit('tweet-count-minute-history', getMinuteHistory());
    }, 1000);
};