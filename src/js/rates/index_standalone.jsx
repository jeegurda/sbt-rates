import api from './api';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import AppController from './appController';
import Rates from './components/root/rates';
import * as reducers from './reducers/';
import initSettings from './init_settings';

let controllerNode;
let appNode;

const appName = 'rates';

let getSettings = (additionalSettings = {}) => {
  let settings = { ...initSettings, ...additionalSettings };

  settings.converterAmount = settings.mode === 'converter' ? settings.converterAmount : '1';
  settings.codes = (() => {
    if (settings.mode === 'metal') {
      return { ...settings.codes.metal };
    } else if (settings.mode === 'currency') {
      if (settings.ratesType === 'premium' || settings.ratesType === 'first') {
        return settings.premiumServiceCodes.reduce((a, code) => {
          a[code] = { checked: true };
          return a;
        }, {});
      }
      return { ...settings.codes.currency };
    } else if (settings.mode === 'converter') {
      return { [settings.sourceCurrencyCode || settings.destCurrencyCode]: { checked: true } };
    }
    console.warn(`Rates: unknown mode: "${settings.mode}`);
  })();

  return settings;
};

let logger = createLogger({
  duration: true,
  diff: true,
  collapsed: true
});

// methods for the controller
let shared = {
  store: null,
  loadApp: null,
  getSettings
};

let loadApp = ({ lang = 'ru' } = {}, additionalSettings = {}) =>
  fetch(api('dictionary', {
    lang,
    regionId: 77,
    widgetId: appName
  }))
    .then(res => res.ok ? res.json() : Promise.reject(res.text()))
    .then(json => {
      let settings = getSettings(additionalSettings);
      settings.dict = { ...settings.dict, ...json[appName] };

      let reducer = combineReducers(reducers);

      let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMOSE__ || compose;
      let store = createStore(reducer, composeEnhancers(
        applyMiddleware(thunkMiddleware, logger)
      ));

      shared.store = store;

      ReactDOM.unmountComponentAtNode(appNode);
      ReactDOM.render(
        <Provider store={ store }>
          <Rates settings={ settings } />
        </Provider>,
        appNode
      );
    }).catch(err => err.then ? err.then(e => console.error(e)) : console.error(err));

shared.loadApp = loadApp;

let loadController = () => {
  ReactDOM.render(<AppController shared={ shared } />, controllerNode);
};

document.addEventListener('DOMContentLoaded', () => {
  appNode = document.querySelector('#app');
  controllerNode = document.querySelector('#controller');
  loadApp();
  loadController();
});
