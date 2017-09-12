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

import '@css/controller.scss';
import * as actions from './actions/';

class AppController extends React.Component {
  constructor(props) {
    super(props);
    this.lang = 'en';
    this.dict = {
      en: {
        language: 'Language',
        en: 'English',
        ru: 'Русский',
        mode: 'Mode',
        currency: 'Currency',
        metal: 'Metals',
        converter: 'Converter',
        ratesType: 'Exchange type',
        base: 'Card',
        beznal: 'ATM',
        premium: '"Premier"',
        first: '"First"'
      },
      ru: {
        language: 'Язык',
        en: 'English',
        ru: 'Русский',
        mode: 'Режим',
        currency: 'Валюта',
        metal: 'Металлы',
        converter: 'Калькулятор',
        ratesType: 'Курс обмена',
        base: 'Карта',
        beznal: 'Банкомат',
        premium: '"Премьер"',
        first: '"Первый"'
      }
    };
    this.settings = [
      /*{
        name: 'language',
        values: ['en', 'ru']
      },*/ {
        name: 'mode',
        values: [ 'currency', 'metal', 'converter']
      }, {
        name: 'ratesType',
        values: ['base', 'beznal', 'premium', 'first']
      }
    ];
    this.state = {
      // language: this.settings[0].values[0],
      mode: this.settings[0].values[0],
      ratesType: this.settings[1].values[0],
      language: 'ru'
    };
  }
  onSettingsChange(name, e) {
    this.setState({ [name]: e.target.value }, () => {
      store.dispatch(actions.loaded(false));
      store.dispatch(actions.clearCache());
      store.dispatch(actions.init({ ...settings, ...this.state }));
    });
  }
  render() {
    let { dict, state, settings } = this;

    return (
      <div className="controller">
        {this.settings.map((set, i) =>
          <div className="controller-block" key={i}>
            <span>{dict[state.language][set.name]}</span>
            <select onChange={ this.onSettingsChange.bind(this, set.name) } value={state[set.name]}>
              {set.values.map((el, i) =>
                <option value={el} key={i}>{dict[state.language][el]}</option>
              )}
            </select>
          </div>
        )}
      </div>
    );
  }
}

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
        <div>
          <AppController/>
          <Provider store={store}>
            <Rates settings={ settings }/>
          </Provider>
        </div>,
        document.querySelector('#app')
      );
    }).catch(err => err.then ? err.then(e => console.error(e)) : console.error(err));
});
