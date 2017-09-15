import api from './api';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import Rates from './components/root/rates';
import * as reducers from './reducers/';
import initSettings from './init_settings';

let controllerNode;
let appNode;

import u from 'updeep';
window.u = u;

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
      } else {
        return { ...settings.codes.currency };
      }
    } else if (settings.mode === 'converter') {
      return { [settings.sourceCurrencyCode || settings.destCurrencyCode]: { checked: true } };
    } else {
      console.warn(`Rates: unknown mode: "${settings.mode}`);
    }
  })();

  return settings;
};

let logger = createLogger({
  duration: true,
  diff: true,
  collapsed: true
});

let reducer = combineReducers(reducers);
let store = createStore(reducer, applyMiddleware(thunkMiddleware, logger));

let loadController = () => {
  ReactDOM.render(<AppController/>, controllerNode);
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

      reducer = combineReducers(reducers)
      store = createStore(reducer, applyMiddleware(thunkMiddleware, logger));

      ReactDOM.unmountComponentAtNode(appNode);
      ReactDOM.render(
        <Provider store={store}>
          <Rates settings={settings}/>
        </Provider>,
        appNode
      );
    }).catch(err => err.then ? err.then(e => console.error(e)) : console.error(err));

document.addEventListener('DOMContentLoaded', () => {
  controllerNode = document.querySelector('#controller');
  appNode = document.querySelector('#app');
  loadController();
  loadApp();
});


// controller

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
    this.settingsMap = [
      {
        name: 'language',
        values: ['en', 'ru']
      }, {
        name: 'mode',
        values: [ 'currency', 'metal', 'converter']
      }, {
        name: 'ratesType',
        values: ['base', 'beznal', 'premium', 'first']
      }
    ];

    let settings = getSettings();
    this.state = {
      language: settings.language,
      mode: settings.mode,
      ratesType: settings.ratesType,
    };
  }
  onSettingsChange(name, e) {
    let value = e.target.value;

    this.setState({ [name]: value }, () => {
      // if a language parameter was changed, the whole app has be to be reloaded
      // this is a sberbank-specific app loading behavior, global parameters can't be changed "on fly"
      if (name === 'language') {
        loadApp({ lang: value }, this.state);
      } else {
        store.dispatch(actions.loaded(false));
        store.dispatch(actions.clearCache());
        // store.dispatch(actions.destroyPlots());
        store.dispatch(actions.init(
            getSettings({
              dict: store.getState().settings.dict,
              ...this.state
            })
        ));
      }
    });
  }
  render() {
    let { dict, state, settings } = this;

    return (
      <div>
        {this.settingsMap.map((set, i) =>
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
