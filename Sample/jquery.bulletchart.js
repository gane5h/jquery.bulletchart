var bulletChartClasses = {
    container: 'visual-progress-container',
    total: 'visual-progress-total',
    summary: 'visual-progress-summary-current',
    current: 'visual-progress-current',
    baseline: 'visual-progress-baseline',
    unallocated: 'visual-progress-unallocated',
    underallocated: 'visual-progress-underallocated',
    overallocted: 'visual-progress-overallocated'
};

(function ($) {

    $.fn.bulletChart = function (options) {

        if (!String.prototype.format) {
            String.prototype.format = function () {
                var args = arguments;
                return this.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined'
                      ? args[number]
                      : match;
                });
            };
        }

        options = $.extend({
            subtitleFormat: 'of {0}h',
        }, options);

        var self = this;

        if (!self.hasClass(bulletChartClasses.container)) {
            self.addClass(bulletChartClasses.container);
        }

        function validateOptions() {
            if (!options.current)
                throw 'Options must contains an element \'current\'.';
            if (!options.total)
                throw 'Options must contains an element \'total\'.';
            if (options.baseline == '')
                options.baseline = undefined;
        }

        function resolveOptions() {
            if (options.current.constructor === String) {
                options.current = options.current.replace(',', '.');
                options.current = parseFloat(options.current);
            }
            if (options.total.constructor === String) {
                options.total = options.total.replace(",", ".");
                options.total = parseFloat(options.total);
            }
            if (options.baseline && options.baseline.constructor === String) {
                options.baseline = options.baseline.replace(',', '.');
                options.baseline = parseFloat(options.baseline);
            }
        }

        function createHtml() {

            var totalWidth = self.width();

            if (options.title) {
                var title = $('<h4>').text(options.title);
                self.append(title);
            }

            // create the summary, containers and subtitle
            var summary = $('<div>').addClass(bulletChartClasses.summary).text(options.current);
            self.append(summary);

            var remainigWidth = totalWidth - summary.width();
            var chartWidth = (Math.floor((remainigWidth / totalWidth) * 100) - 3) + '%';

            var chartContainer = $('<div>').css({ display: 'inline-block', width: chartWidth });
            self.append(chartContainer);

            var animationContainer = $('<div>').addClass(bulletChartClasses.container);
            chartContainer.append(animationContainer);

            createBulletCharts(animationContainer);

            var subtitle = !options.baseline ? options.subtitleFormat.format(options.total) : options.subtitleFormat.format(options.total, options.baseline);
            var subtitleElement = $('<div>').text(subtitle);
            chartContainer.append(subtitleElement);
        }

        function createBulletCharts(container) {
            if (!options.baseline) {
                createDoubleBulletChart(container);
            } else {
                createTripleBulletChart(container);
            }
        }

        function createDoubleBulletChart(container) {

            var width = (options.current / options.total) * 100;
            var totalValue = $('<div>');
            var currentValue = $('<div>');

            if (options.current <= options.total) {
                totalValue
                    .addClass(bulletChartClasses.total)
                    .addClass(bulletChartClasses.unallocated)
                    .css('width', '100%');

                currentValue
                    .addClass(bulletChartClasses.current)
                    .addClass(bulletChartClasses.underallocated)
                    .css('width', width + '%');

                totalValue.append(currentValue);
                container.append(totalValue);
                animateSlideToLeft(container);
            } else {
                width = 100 - (width - 100);

                currentValue
                    .addClass(bulletChartClasses.current)
                    .addClass(bulletChartClasses.overallocted)
                    .css('width', '100%');

                totalValue
                    .addClass(bulletChartClasses.total)
                    .addClass(bulletChartClasses.overallocted)
                    .css('width', width + '%');

                currentValue.append(totalValue);
                container.append(currentValue);
                animateSlideToLeft(container);
            }
        }

        function createTripleBulletChart(container) {
            var totalValue = $('<div>');
            var currentValue = $('<div>');

            var firstLayer = options.baseline > options.total ? bulletChartClasses.baseline : bulletChartClasses.total;
            var firstElement = $('<div>').addClass(firstLayer).css('width', '100%');

            if (firstLayer == bulletChartClasses.baseline) {

                if (options.current <= options.total) {
                    var totalWidth = (options.total / options.baseline) * 100;
                    var currentWidth = (options.current / options.total) * 100;

                    totalValue
                        .addClass(bulletChartClasses.total)
                        .addClass(bulletChartClasses.unallocated)
                        .css('width', totalWidth + '%');

                    currentValue
                        .addClass(bulletChartClasses.current)
                        .addClass(bulletChartClasses.underallocated)
                        .css('width', currentWidth + '%');

                    totalValue.append(currentValue);
                    firstElement.append(totalValue);
                    animateSlideToLeft(container);

                } else {
                    var totalWidth = (options.total / options.current) * 100;
                    var currentWidth = (options.total / options.baseline) * 100;

                    currentValue
                        .addClass(bulletChartClasses.current)
                        .addClass(bulletChartClasses.overallocted)
                        .css('width', currentWidth + '%');

                    totalValue
                        .addClass(bulletChartClasses.total)
                        .addClass(bulletChartClasses.overallocted)
                        .css('width', totalWidth + '%');

                    currentValue.append(totalValue);
                    firstElement.append(currentValue);
                    animateSlideToLeft(container);
                }
            }

            container.append(firstElement);
        }

        function animateSlideToLeft(element) {

            var distance = element.css('width');

            element.css('width', '0px').animate({
                width: distance,
                duration: 200
            });
        }

        validateOptions();
        resolveOptions();
        createHtml();
    }

}(jQuery));