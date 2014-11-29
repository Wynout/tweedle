(function () {
    'use strict';

    var serviceId = 'config';
    var config = {};

    angular.module('tweetStreamApp')
        .constant(serviceId, {
           'tweetStreamUrl': 'http://192.168.1.20:3000',

            'toast': {
                'hideDelay': 3000,
                'position': 'top left'
            }
        });
})();
