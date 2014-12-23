/* global d3:false, toastr:false, moment:false */
(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('d3', d3)
        .constant('toastr', toastr)
        .constant('moment', moment);

})();
