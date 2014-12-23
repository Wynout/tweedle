(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('unsafe', unsafe);

    unsafe.$inject = ['$sce'];

    /* @ngInject */
    function unsafe($sce) {

        return function (value) {

            return $sce.trustAsHtml(value);
        };
    }

})();
