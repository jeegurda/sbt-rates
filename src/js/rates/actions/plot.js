
import * as utils from '../utils';
import moment from 'moment';

export let drawPlotByCodes = (codes, plots) => (dispatch, getState) => {
    let state = getState();

    codes.forEach(code => {
        let plot = {
            values: {
                max: {
                    buy: Number.MIN_VALUE,
                    sell: Number.MIN_VALUE,
                    period: Number.MIN_VALUE
                },
                min: {
                    buy: Number.MAX_VALUE,
                    sell: Number.MAX_VALUE,
                    period: Number.MAX_VALUE
                },
                fill: (prop, value) => {
                    value > plot.values.max[prop] && (plot.values.max[prop] = value);
                    value < plot.values.min[prop] && (plot.values.min[prop] = value);
                },
                invalid: (...args) => Array.prototype.some.call(args, arg => !$.isNumeric(arg))
            },

            getTooltip: function(type) {
                return '\
                    <div class="plot-tooltip">\
                        <h3>' + state.settings.dict[`current${utils.capitalize(type)}`] + '</h3>\
                        <p>%s: <em>%s</em></p>\
                        <p>'
                            + state.settings.dict.plotMax
                            + ' <em>'
                            + utils.format(this.values.max[type])
                            + ' '
                            + state.settings.destinationCurrencyShort
                            + '</em>, '
                            + state.settings.dict.plotMin
                            + ' <em>'
                            + utils.format(this.values.min[type])
                            + ' '
                            + state.settings.destinationCurrencyShort
                            + '</em></p>\
                    </div>';
            },
            // need execution context for "this" referrer!
            getPlotData: function() {
                let checkedRange = utils.getCheckedRange(state.data, code);

                if (typeof checkedRange === 'undefined') {
                    // if no range available for the current code
                    return null;
                }

                let item = state.data[code];

                if (!item.ratesDated) {
                    return null;
                }

                let buyValues = [];
                let sellValues = [];
                let minDate = moment(state.fromDate, state.settings.dateFormat).valueOf();

                item.ratesDated.forEach(el => {
                    if (el.rangeFrom === checkedRange) {
                        if (this.values.invalid(el.activeFrom, el.buyValue, el.sellValue)) {
                            console.warn(`Rates: bad values for plot with code "${code}":`
                                + `${el.activeFrom}, ${el.buyValue}, ${el.sellValue}`);
                            return;
                        }
                        if (el.activeFrom < minDate) {
                            console.warn(`Rates: activeFrom value ${el.activeFrom} is less than `
                                + `minDate ${minDate}. Replacing the value.`);
                            el.activeFrom = minDate;
                        }
                        this.values.fill('period', el.activeFrom);
                        this.values.fill('buy', el.buyValue);
                        this.values.fill('sell', el.sellValue);

                        buyValues.push(
                            [el.activeFrom, el.buyValue]
                        );
                        sellValues.push(
                            [el.activeFrom, el.sellValue]
                        );
                    }
                });

                if (buyValues.length && sellValues.length) {
                    [buyValues, sellValues].forEach(arr => {
                        if (arr.length === 1) {
                            arr[1] = arr[0].slice();
                            // adding some time to be able to build a plot
                            arr[1][0] += 100;
                            this.values.max.period = this.values.min.period + 100;
                        }
                    });
                    return [buyValues.reverse(), sellValues.reverse()];
                } else {
                    console.warn(`Rates: empty values array for code "${code}"`);
                    return null;
                }
            },

            data: undefined,

            init: function() {
                return $.jqplot('plot-' + code, this.data, {
                    grid: {
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        shadow: false,
                        shadowColor: 'transparent'
                    },
                    axes: {
                        xaxis: {
                            borderWidth: 0,
                            shadow: false,
                            renderer: $.jqplot.DateAxisRenderer,
                            rendererOptions: {
                                drawBaseline: true
                            },
                            tickOptions: {
                                formatString: '%d.%m.%Y'
                            },
                            min: this.values.min.period,
                            max: this.values.max.period,
                            numberTicks: 6
                        },
                        yaxis: {
                            borderWidth: 0,
                            rendererOptions: {
                                drawBaseline: false
                            },
                            tickOptions: {
                                formatString:'$%.2f',
                                tickRenderer: $.jqplot.categoryAxisRenderer,
                                formatter: function(format, value) {
                                    return utils.format(value) + ' ' + state.settings.destinationCurrencyShort;
                                }
                            }
                        }
                    },
                    legend: {
                        show: true,
                        placement: 'outsideGrid',
                        location: 's',
                        renderer: $.jqplot.EnhancedLegendRenderer,
                        rendererOptions: {
                            numberRows: 1
                        }
                    },
                    highlighter: {
                        show: true,
                        showMarker: true,
                        tooltipAxes: 'both',
                        sizeAdjust: 1,
                        lineWidthAdjust: 0.4,
                        tooltipLocation: 'w',
                        tooltipOffset: 15
                    },
                    cursor: {
                        style: 'default',
                        showTooltip: false,
                        show: true,
                        showVerticalLine: true,
                        intersectionThreshold: 100,
                        followMouse: true,
                        zoom: true,
                        constrainZoomTo: 'x',
                        clickReset: true
                    },
                    seriesDefaults: {
                        shadow: false,
                        lineWidth: 2,
                        markerOptions: {
                            show: false,
                            style: 'filledCircle',
                            lineWidth: 3,
                            size: 11
                        }
                    },
                    series: [
                        {
                            label: state.settings.dict.currentBuy,
                            color:'#4ec42c',
                            highlighter: {
                                formatString: this.getTooltip('buy')
                            }
                        },
                        {
                            color: '#ffa101',
                            label: state.settings.dict.currentSell,
                            highlighter: {
                                formatString: this.getTooltip('sell')
                            }
                        }
                    ]
                });
            }
        };

        if (plots[code]) {
            plots[code].destroy();
        }

        plot.data = plot.getPlotData();

        let newStateData = { ...state.data };

        if (plot.data) {
            try {
                plots[code] = plot.init();
                newStateData[code].plot = true;
            } catch(e) {
                console.warn(`Rates: couldn\'t build the plot for code "${code}": ${e}`);
                plots[code] = null;
                newStateData[code].plot = null;
            }
        } else {
            console.warn(`Rates: no data to build the plot for code "${code}"`);
            plots[code] = null;
            newStateData[code].plot = null;
        }

        $('#plot-' + code).bind('jqplotMouseMove', function(e, gridpos, datapos, neighbor, plot) {
            if (!neighbor) {
                return;
            }

            let scrolled = $(this).closest('.scroll-content').scrollLeft();
            let $tooltip = $('.jqplot-highlighter-tooltip');

            $tooltip.toggleClass('right-sided', e.pageX + scrolled < $tooltip.width() + 100);
        });

        dispatch({
            type: 'DATA',
            payload: newStateData
        });
    });
};