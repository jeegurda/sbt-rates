import api from './api';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import Rates from './components/root/rates';
import * as reducers from './reducers/';

let logger = createLogger({
  duration: true,
  diff: true,
  collapsed: true
});

let reducer = combineReducers(reducers);
let store = createStore(reducer, applyMiddleware(thunkMiddleware, logger));


let missingDict = {
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
};

let settings = {
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
  premiumServiceAllowedCodes: [ '840', '978' ],
  // currencies with limited exchange offices (a warning will be shown)
  // GBP, CHF, JPG
  limitedExchangeCodes: [ '826', '756', '392' ],
  // default codes for different widget modes
  // set 'checked' property to true for code to be checked by default in the filter
  // Note: only one property is allowed for 'converter' mode (sourceCurrencyCode is used)
  // format: { 'CODE': {checked: true|false}, ... }
  get codes() {
    if (this.mode === 'metal') {
      return {
        A33: { checked: true },
        A76: { checked: true },
        A98: { checked: true },
        A99: { checked: true }
      };
    } else if (this.mode === 'currency') {
      if (this.ratesType === 'premium' || this.ratesType === 'first') {
        return this.premiumServiceAllowedCodes.map(code => ({ [code]: { checked: true } }));
      }
      return {
        840: { checked: true },
        978: { checked: true }
      };
    } else if (this.mode === 'converter') {
      // at this point we don't care about ratesType for this mode
      return { [this.sourceCurrencyCode || this.destCurrencyCode]: { checked: true } };
    }
    return {};
  }
};

document.addEventListener('DOMContentLoaded', () => {
  fetch(api('dictionary', {
    lang: 'ru',
    regionId: 77,
    widgetId: 'rates'
  }))
    .then(res => res.ok ? res.json() : Promise.reject(res.text()))
    .then(json => {
      settings.dict = { ...settings.dict, ...missingDict, ...json.rates };
      ReactDOM.render(
        <Provider store={store}>
          <Rates settings={ settings }/>
        </Provider>,
        document.querySelector('#app')
      );
    }).catch(err => err.then ? err.then(e => console.error(e)) : console.error(err));
});
