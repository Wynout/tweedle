(function () {
    'use strict';

    var filterId = 'unsafe';

    angular.module('tweetStreamApp')
        .filter(filterId, unsafe);

    unsafe.$inject = ['$sce'];

    function unsafe($sce) {

        return function (value) {

            return $sce.trustAsHtml(value);
        };
    }
})();