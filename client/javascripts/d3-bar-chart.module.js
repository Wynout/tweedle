/**
 * Timeline barchart inspired by:
 * @link https://strongriley.github.io/d3/tutorial/bar-2.html
 */
(function (window, d3) {
    'use strict';

    /*global d3*/
    d3.custom = {};

    d3.custom.barChart = function module() {

        var canvas = {width: 1024, height: 250},
            margin = {top: 20, right: 20, bottom: 60, left: 40},
            chart  = {
                width : canvas.width  - margin.left - margin.right,
                height: canvas.height - margin.top  - margin.bottom
            },
            delay = 300,
            ease  = 'exp',
            svg,
            dispatch = d3.dispatch('barHover');


        function exports(selection) {

            selection.each(function (data) {

                var
                    container,
                    x,
                    xAxis,
                    y,
                    yAxis,
                    rect;

                if (data.length === undefined || data.length === 0) {

                    return;
                }

                if (!svg) {
                    svg = d3.select(this)
                        .append('svg:svg')
                        .attr('class', 'chart')
                        .attr('width', canvas.width)
                        .attr('height', canvas.height);
                        //.call(responsivefy); // Enables responsive charting (disabled because of scaling issues)

                    container = svg.append('g').classed('container-group', true);
                    container.append('g').classed('chart-group', true);
                    container.append('g').classed('x-axis-group axis', true);
                    container.append('g').classed('y-axis-group axis', true);
                }
                svg.select('.container-group')
                    .attr({transform: 'translate(' + margin.left + ',' + margin.top + ')'});

                x = d3.scale.ordinal()
                    .rangeRoundBands([0, chart.width], 0.1)
                    .domain(data.map(function (d) { return d.minute; }));

                y = d3.scale.linear()
                    .rangeRound([chart.height, 0])
                    .domain([0, d3.max(data, function (d) { return d.value; })])
                    .nice();

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left')
                    .ticks(6, 's');

                // Create X axis
                svg.select('.x-axis-group.axis')
                    .attr({transform: 'translate(0,' + (chart.height) + ')'})
                    .call(xAxis)
                    .selectAll('text')
                        .style('text-anchor', 'end')
                        .style('font-size', '.8em')
                        .attr('dx', '-.8em')
                        .attr('dy', '-0.45em')
                        .attr('transform', function () { return 'rotate(-90)'; })
                        .text(function (d) { return d; });
                        //.text(function (d) { return moment(d).format('HH:mm:ss') });

                // Create Y axis
                svg.select('.y-axis-group.axis')
                    .transition()
                    .duration(delay)
                    .ease(ease)
                    .delay(delay)
                    .call(yAxis);


                rect = svg.select('.chart-group').selectAll('rect')
                    .data(data, function (d) { return d.timestamp; });

                rect.enter().insert('svg:rect', 'line')
                    .attr('x', function (d) { return x(d.minute) + 2 * x.rangeBand(); })
                    .attr('y', function (d) { return y(d.value); })
                    .attr('width', x.rangeBand())
                    .attr('height', function (d) { return chart.height - y(d.value); })
                    .on('mouseover', dispatch.barHover)
                    .transition()
                    .duration(delay)
                    .attr('x', function (d) { return x(d.minute); });

                rect.transition()
                    .duration(delay)
                    .attr('x', function (d) { return x(d.minute); })
                    .transition()
                    .ease(ease)
                    .delay(delay)
                    .attr('y', function (d) { return y(d.value); })
                    .attr('height', function (d) { return chart.height - y(d.value); });

                rect.exit().transition()
                    .duration(delay)
                    .style('opacity', 0)
                    .attr('x', function () { return -1 * x.rangeBand(); })
                    .remove();
            });
        }

        d3.rebind(exports, dispatch, 'on');
        return exports;
    };

    /**
     * Responsive D3 Charting
     * @link http://www.brendansudol.com/posts/responsive-d3/
     */
    /*
    function responsivefy(svg) {

        // get container + svg aspect ratio
        var container = d3.select(svg.node().parentNode),
            width     = parseInt(svg.style('width'), 10),
            height    = parseInt(svg.style('height'), 10),
            aspect    = width / height;

        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg.attr('viewBox', '0 0 ' + width + ' ' + height)
            .attr('preserveAspectRatio', 'xMinYMid')
            .call(resize);

        // to register multiple listeners for same event type,
        // you need to add namespace, i.e., 'click.foo'
        // necessary if you call invoke this function for multiple svgs
        // api docs: https://github.com/mbostock/d3/wiki/Selections#on
        d3.select(window).on('resize.' + container.attr('id'), resize);

        // get width of container and resize svg to fit it
        function resize() {

            var targetWidth = parseInt(container.style('width'), 10);
            svg.attr('width', targetWidth);
            svg.attr('height', Math.round(targetWidth / aspect));
        }
    }
    */
})(window, d3);