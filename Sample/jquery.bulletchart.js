var bulletChartClasses = {
    container: 'visual-progress-container',
    total: 'visual-progress-total',
    current: 'visual-progress-current',
    baseline: 'visual-progress-baseline',
    unallocated: 'visual-progress-unallocated',
    underallocated: 'visual-progress-underallocated',
    overallocted: 'visual-progress-overallocated'
};

(function ($) {
    
    $.fn.bulletChart = function (options) {

        var self = this;

        var current = options.current;
        var total = options.total;
        var baseline = options.baseline;

        function validateOptions() {
            if (!current)
                throw 'Options must contains an element \'current\'.';
            if (!total)
                throw 'Options must contains an element \'total\'.';
            if (baseline == '')
                baseline = undefined;

            self.addClass(bulletChartClasses.container);
        }

        function resolveOptions() {
            if (current.constructor === String) {
                current = current.replace(',', '.');
                current = parseFloat(current);
            }
            if (total.constructor === String) {
                total = total.replace(",", ".");
                total = parseFloat(total);
            }
            if (baseline && baseline.constructor === String) {
                baseline = baseline.replace(',', '.');
                baseline = parseFloat(baseline);
            }
        }

        function createCurrentAndTotal() {

            var width = (current / total) * 100;
            var totalValue = $('<div>');
            var currentValue = $('<div>');

            if (current <= total) {
                totalValue
                    .addClass(bulletChartClasses.total)
                    .addClass(bulletChartClasses.unallocated)
                    .css('width', '100%');

                currentValue
                    .addClass(bulletChartClasses.current)
                    .addClass(bulletChartClasses.underallocated)
                    .css('width', width + '%');

                totalValue.append(currentValue);
                self.append(totalValue);
                animateSlideToLeft(self);
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
                self.append(currentValue);
                animateSlideToLeft(self);
            }
        }

        function visualizeCurrentTotalAndBaseline() {

            var totalValue = $('<div>');
            var currentValue = $('<div>');

            var firstLayer = baseline > total ? bulletChartClasses.baseline : bulletChartClasses.total;
            var firstElement = $('<div>').addClass(firstLayer).css('width', '100%');

            if (firstLayer == bulletChartClasses.baseline) {

                if (current <= total) {
                    var totalWidth = (total / baseline) * 100;
                    var currentWidth = (current / total) * 100;

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
                    animateSlideToLeft(self);

                } else {
                    var totalWidth = (total / current) * 100;
                    var currentWidth = (total / baseline) * 100;

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
                    animateSlideToLeft(self);
                }
            }

            self.append(firstElement);
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

        if (!baseline) {
            createCurrentAndTotal();
        } else {
            visualizeCurrentTotalAndBaseline();
        }
    };

}(jQuery));