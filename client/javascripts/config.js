(function () {
    'use strict';

    var serviceId = 'config';
    var config = {};

    angular.module('tweetStreamApp')
        .constant(serviceId, {
           'tweetStreamUrl': 'http://localhost:3000',
            'toast': {
                'hideDelay': 3000,
                'position': 'top left'
            }
        });
})();
