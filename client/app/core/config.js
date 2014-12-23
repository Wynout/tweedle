(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];

    /* @ngInject */
    function toastrConfig(toastr) {

        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[TweetStream Error] ', //Configure the exceptionHandler decorator
        appTitle      : 'TweetStream Angular Demo',
        version       : '1.0.0'
    };

    core.value('config', config);
    core.config(configure);

    configure.$inject = ['$logProvider', '$routeProvider', 'routehelperConfigProvider', 'exceptionConfigProvider'];

    /* @ngInject */
    function configure($logProvider, $routeProvider, routehelperConfigProvider, exceptionConfigProvider) {

        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common route provider
        routehelperConfigProvider.config.$routeProvider = $routeProvider;
        routehelperConfigProvider.config.docTitle = 'TweetStream-Angular: ';

        // Configure the common exception handler
        exceptionConfigProvider.config.appErrorPrefix = config.appErrorPrefix;
    }

})();
