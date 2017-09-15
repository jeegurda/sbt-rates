export default {
  // region (77 for Moscow)
  regionId: 77,
  // language: 'en' or 'ru'
  language: 'ru',
  // widget mode: 'metal' or 'currency' or 'converter'
  mode: 'currency',
  // rates type: 'base' or 'beznal' or 'premium' or 'first'
  ratesType: 'base',
  // date format for moment.js
  dateFormat: 'DD.MM.YYYY',
  // time format for moment.js
  timeFormat: 'HH:mm',
  // selected period: 'month' or 'quarter' or 'halfyear' or 'year'
  // if set to 'custom', default period equals to a week
  period: 'halfyear',
  // view mode: 'history' or 'table'
  viewMode: 'history',
  // converter source currency code ('840' - USD, '' - RUR)
  sourceCurrencyCode: '',
  // converter destination currency code (same code format as source)
  destCurrencyCode: '840',
  // converter destination currency, used for display only
  destinationCurrency: 'RUR',
  // converter destination currency in short format, used for dispay only
  destinationCurrencyShort: 'р.',
  // currency codes that are allowed for 'first' and 'premium' services
  premiumServiceCodes: [ '840', '978' ],
  // currencies with limited exchange offices (a warning will be shown)
  // ('826' - GBP, '756' - CHF, '392' - JPG)
  limitedExchangeCodes: [ '826', '756', '392' ],
  // converter only: default input value, must be a string
  converterAmount: '100',
  // default codes for different widget modes
  // set 'checked' property to true for code to be checked by default in the filter
  // Note: if ratesType is set to either 'premium' or 'first', only premiumServiceCodes are used
  // Note: converter mode uses sourceCurrencyCode or destCurrencyCode, whichever is not an empty string
  // format: { 'CODE': {checked: true|false}, ... }
  codes: {
    metal: {
      A33: { checked: true },
      A76: { checked: true },
      A98: { checked: true },
      A99: { checked: true }
    },
    // has no effect if ratesType is set to either 'premium' or 'first'
    currency: {
      840: { checked: true },
      978: { checked: true }
    }
  },
  // dict values that are temporarily missing from 'dictionary' api response.
  // these will be overwritten by response values with the same names
  dict: {
    loading: 'loading...',
    exchangeNoteLinkRu: '/',
    exchangeNoteLinkEn: '/',
    calculatorLinkRu: '/',
    calculatorLinkEn: '/',
    calculatorIncomeLinkRu: '/',
    calculatorIncomeLinkEn: '/',
    premiumLinkRu: '/',
    premiumLinkEn: '/',
    firstLinkRu: '/',
    firstLinkEn: '/',
    dataAvailabilityDateBase: '01.01.2002',
    dataAvailabilityDateBeznal: '01.01.2002',
    dataAvailabilityDateFirst: '01.01.2002',
    dataAvailabilityDatePremium: '01.01.2002'
  }
};
