import '@css/controller.scss';
import * as actions from './actions/';

export default class AppController extends React.Component {
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
        values: [ 'en', 'ru' ]
      }, {
        name: 'mode',
        values: [ 'currency', 'metal', 'converter' ]
      }, {
        name: 'ratesType',
        values: [ 'base', 'beznal', 'premium', 'first' ]
      }
    ];

    let settings = this.props.shared.getSettings();
    this.state = {
      language: settings.language,
      mode: settings.mode,
      ratesType: settings.ratesType,
    };
  }
  onSettingsChange(name, e) {
    let value = e.target.value;
    let { store, loadApp, getSettings } = this.props.shared;

    this.setState({ [name]: value }, () => {
      // if a language parameter was changed, the whole app has be to be reloaded
      // this is a sberbank-specific app loading behavior, global parameters can't be changed "on fly"
      if (name === 'language') {
        loadApp({ lang: value }, this.state);
      } else {
        store.dispatch(actions.loaded(false));
        store.dispatch(actions.clearCache());
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
    let { dict, state } = this;

    return (
      <div>
        { this.settingsMap.map(set =>
          <div className="controller-block" key={ set.name }>
            <span>{ dict[state.language][set.name] }</span>
            <select onChange={ this.onSettingsChange.bind(this, set.name) } value={ state[set.name] }>
              { set.values.map(el =>
                <option value={ el } key={ el }>{ dict[state.language][el] }</option>
              ) }
            </select>
          </div>
        ) }
      </div>
    );
  }
}
