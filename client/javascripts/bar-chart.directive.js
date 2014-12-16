/**
 * Bar Chart directive, based on
 * @link http://bl.ocks.org/biovisualize/5372077
 */
(function () {
    'use strict';

    angular.module('tweetStreamApp')
        .directive('barChart', barChart);

    barChart.$inject = ['$window'];

    function barChart($window) {

        var chart = $window.d3.custom.barChart();
        var directive = {
            restrict: 'E',
            replace : true,
            template: '<div class="chart"></div>',
            scope: {
                width  : '=width',
                height : '=height',
                data   : '=data',
                hovered: '&hovered'
            },
            link        : linkFunction,
            controller  : BarChartController,
            controllerAs: 'vm'
        };

        return directive;

        /////////////////

        function linkFunction(scope, element, attributes) {

            var chartElement = d3.select(element[0]);
            chart.on('barHover', function (d, i) {

                scope.hovered({args:d});
            });

            scope.$watch('data', function (newVal) {

                chartElement.datum(newVal).call(chart);
            }, true);
        }
    }


    /**
     * Note: The directive's controller is outside the directive's closure.
     * Why?: This style eliminates issues where the injection gets created as unreachable code after a return.
     */
    BarChartController.$inject = ['$scope'];

    function BarChartController($scope) {

        // Injecting $scope just for comparison
        /*jshint validthis: true*/
        var vm = this;
    }
})();