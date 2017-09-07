'use strict';

(function () {

    var tools = window.SBT.TOOLBOX.tools;
    var widgetName = 'rates';
    var widgetInGlobal = tools.ns('SBT.' + widgetName);
    var WidgetMain = require('./components/rates');

    widgetInGlobal.init = function (__WIDGET__) {

        // params to filter from a getWidgetSettings request
        // you can also remove this array or leave it empty if you don't want to initiate the request at all
        // you can also specify '*' as the first parameter to not filter the response
        var paramsList = ['*'];

        var callbackFunc = function(node, paramsDict) {
            React.renderComponent(WidgetMain({
                dict: {
                    loading: tools.getLanguage() === 'ru' ? '' : '',
                    currentAmount: tools.getLanguage() === 'ru' ? 'Единица' : 'Unit',
                    exchangeNote: 'Обмен наличной валюты: Фунт стерлингов Соединенного королевства, Швейцарский франк, Японская йена осуществляется не во всех отделениях. Полный список отделений можете посмотреть в разделе "{0}"',
                    exchangeNoteLinkText: 'Наличная валюта',
                    exchangeNoteLinkRu: __WIDGET__.getPreference('exchangeNoteLinkRu'),
                    exchangeNoteLinkEn: __WIDGET__.getPreference('exchangeNoteLinkEn'),
                    calculatorLinkRu: __WIDGET__.getPreference('calculatorLinkRu'),
                    calculatorLinkEn: __WIDGET__.getPreference('calculatorLinkEn'),
                    calculatorIncomeLinkRu: __WIDGET__.getPreference('calculatorIncomeLinkRu'),
                    calculatorIncomeLinkEn: __WIDGET__.getPreference('calculatorIncomeLinkEn'),
                    premiumLinkRu: __WIDGET__.getPreference('premierLinkRu'),
                    premiumLinkEn: __WIDGET__.getPreference('premierLinkEn'),
                    firstLinkRu: __WIDGET__.getPreference('firstLinkRu'),
                    firstLinkEn: __WIDGET__.getPreference('firstLinkEn'),
                    availabilityDateBase: __WIDGET__.getPreference('availabilityDateBase'),
                    availabilityDateBeznal: __WIDGET__.getPreference('availabilityDateBeznal'),
                    availabilityDateFirst: __WIDGET__.getPreference('availabilityDateFirst'),
                    availabilityDatePremium: __WIDGET__.getPreference('availabilityDatePremium')
                    ...paramsDict
                },
                // region (77 for Moscow)
                regionId: tools.getRegion(),
                // language: 'en' or 'ru'
                language: tools.getLanguage(),
                // widget mode: 'metal' or 'currency' or 'converter'
                mode: __WIDGET__.getPreference('mode') || 'currency',
                // rates type: 'base' or 'beznal' or 'premium' or 'first'
                ratesType: __WIDGET__.getPreference('type') || 'base',
                // date format for moment.js
                dateFormat: 'DD.MM.YYYY',
                // time format for moment.js
                timeFormat: 'HH:mm',
                // selected period: 'month' or 'quarter' or 'halfyear' or 'year'
                // if set to 'custom', default period equals to a week
                period: 'custom',
                // view mode: 'history' or 'table'
                viewMode: 'history',
                // converter source currency code ('840' for USD, '' for RUR)
                sourceCurrencyCode: '',
                // converter destination currency code (same code format as source)
                destCurrencyCode: '840',
                // converter destination currency, used for display only
                destinationCurrency: 'RUR',
                // converter destination currency in short format, used for dispay only
                destinationCurrencyShort: 'р.',
                // value in converter input by default, using 1 in other modes (for current rates),
                // must be a string
                get converterAmount() {
                    return this.mode === 'converter' ? '100' : '1';
                },
                // currency codes that are allowed for 'first' and 'premium' services
                premiumServiceAllowedCodes: ['840', '978'],
                // currencies with limited exchange offices (a warning will be shown)
                // GBP, CHF, JPG
                limitedExchangeCodes: ['826', '756', '392'],
                // default codes for different widget modes
                // set 'checked' property to true for code to be checked by default in the filter
                // Note: only one property is allowed for 'converter' mode (sourceCurrencyCode is used)
                // format: { 'CODE': {checked: true|false}, ... }
                get codes() {
                    if (this.mode === 'metal') {
                        return {
                            'A33': {
                                checked: true
                            },
                            'A76': {
                                checked: true
                            },
                            'A98': {
                                checked: true
                            },
                            'A99': {
                                checked: true
                            }
                        };
                    } else if (this.mode === 'currency') {
                        if (this.ratesType === 'premium' || this.ratesType === 'first') {
                            return (function(o, c) {
                                c.forEach(function(code) {
                                    o[code] = {
                                        checked: true
                                    };
                                })
                                return o;
                            })({}, this.premiumServiceAllowedCodes);
                        } else {
                            return {
                                '840': {
                                    checked: true
                                },
                                '978': {
                                    checked: false
                                }
                            }
                        }
                    } else if (this.mode === 'converter') {
                        // at this point we don't care about ratesType for this mode
                        return (function(o, p) {
                            o[p] = {
                                checked: true
                            };
                            return o;
                        })({}, this.sourceCurrencyCode || this.destCurrencyCode);
                    }
                },
            }), node);
        };

        var options = {
            watchRegionChange: false,
            initialRender: false
        };

        // __WIDGET__ check exists in tools.initWidget method, so it was removed from here
        return tools.initWidget(widgetName, __WIDGET__, paramsList, callbackFunc, options);
    };

})();
