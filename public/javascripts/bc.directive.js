// http://bl.ocks.org/mbostock/3885304#data.tsv
(function () {
    'use strict';

    angular.module('tweetStreamApp')
        .directive('barChart', barChart);

    barChart.$inject = ['$parse', '$window'];

    function barChart($parse, $window) {

        var directiveDefinitionObject =  {

            restrict: 'E',
            template: '<svg></svg>',
            scope: {
                data: '=data'
            },
            link: function (scope, element, attributes) {

                var d3           = $window.d3;
                var moment       = $window.moment;
                var svg          = d3.select(element.find('svg')[0]);
                var getChartData = $parse(attributes.chartData);
                //var data         = getChartData(scope);


                
                //scope.$watchCollection(getChartData, function (newVal, oldVal) {
                //
                //    console.log(newVal);
                //    data = newVal;
                //}, true);
                
                var canvas       = {
                    width : attributes.chartWidth  || 800,
                    height: attributes.chartHeight || 200
                };

                svg.attr('width', canvas.width)
                    .attr('height', canvas.height);

                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width  = canvas.width  - margin.left - margin.right,
                    height = canvas.height - margin.top  - margin.bottom;

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("right")
                    .ticks(5, "%");

                // Format timestamp
                scope.data.forEach(function(d) {

                    d.time = git (d.timestamp*1000).format('HH:mm:ss');
                });

                //d3.tsv("javascripts/data.tsv", type, function(error, data) {
                    x.domain(scope.data.map(function(d) { return d.time; }));
                    y.domain([0, d3.max(scope.data, function(d) { console.log(d); return d.frequency; })]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(" + 0 + "," + height + ")")
                        .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", "-0.55em")
                        .attr("transform", function (d) {
                            return "rotate(-90)"
                        });

                    svg.append("g")
                        .attr("class", "y axis")
                        .attr('transform', 'translate(' + width + ',0)')
                        .call(yAxis)
                      .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", "4em")
                        .style("text-anchor", "end")
                        .text("Frequency");

                    svg.selectAll(".bar")
                        .data(scope.data).enter()
                      .append("rect")
                        .attr("class", "bar")
                        .attr("x", function(d) { return x(d.time); })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) { return y(d.frequency); })
                        .attr("height", function(d) { return height - y(d.frequency); });

                //});

                //function type(d) {
                //    d.frequency = +d.frequency;
                //    return d;
                //}

            }
        };

        return directiveDefinitionObject;
    }
})();