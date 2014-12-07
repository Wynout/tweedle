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
        var directiveDefinitionObject = {
            restrict: 'E',
            replace : true,
            template: '<div class="chart"></div>',
            scope: {
                width  : '=width',
                height : '=height',
                data   : '=data',
                hovered: '&hovered'
            },
            link: function (scope, element, attributes) {

                var chartElement = d3.select(element[0]);
                chart.on('customHover', function (d, i) {

                    scope.hovered({args:d});
                });

                scope.$watch('data', function (newVal, oldVal) {

                    chartElement.datum(newVal).call(chart);
                });

                scope.$watch('width', function (newVal, oldVal){

                    chartElement.call(chart.width(scope.width));
                });

                scope.$watch('height', function (newVal, oldVal){

                    chartElement.call(chart.height(scope.height));
                });
            }
        };

        return directiveDefinitionObject;
    }
})();