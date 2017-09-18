import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

import CurrencySelect from './ratesCurrencySelect';

class AsideFilterRates extends React.Component {
  componentDidUpdate() {
    /* var currencySelect = this.refs.currencySelect;
    var Aside = this.props.Aside;

    if (currencySelect) {
      currencySelect = currencySelect;
      Aside.initSelect(currencySelect, function() {
        currencySelect.selectedIndex = -1;
      });
    }*/

    /* Rates.initDatepicker(this.refs.filterDatepickerFrom);
    Rates.initDatepicker(this.refs.filterDatepickerTo);*/
  }
  render() {
    let { dict, mode, data, changeCodes, changePeriod, ui, changeDate, validateInput, requestDetails } = this.props;

    return (
      <div className="rates-aside-filter rates-container">
        <div className="filter-block filter-block-currency-list">
          <div>
            <h6>{ dict[`filter${utils.capitalize(mode)}`] }</h6>
          </div>
          { utils.getCodes(data, 'display').map(code =>
            <label key={ code }>
              <input
                type="checkbox"
                name={ code }
                checked={ data[code].checked }
                onChange={ changeCodes }
              />
              <span className="checkbox" />
              <p>{ data[code].name }</p>
            </label>
          ) }
        </div>
        <CurrencySelect />
        <div className="filter-block filter-block-period">
          <div>
            <h6>{ dict.filterPeriod }</h6>
          </div>
          { [ 'month', 'halfyear', 'quarter', 'year', 'custom' ].map(period =>
            <label key={ period }>
              <input
                type="radio"
                name="period"
                checked={ ui.period === period }
                value={ period }
                onChange={ changePeriod }
              />
              <span className="radio" />
              <p>{ dict[`filter${utils.capitalize(period)}`] }</p>
            </label>
          ) }
        </div>
        <div className="filter-block filter-block-period-datepicker">
          { [ 'from', 'to' ].map(el =>
            <div className="filter-block-line with-caption" key={ el }>
              <p>{ dict[`filter${utils.capitalize(el)}`] }</p>
              <div className="filter-datepicker input">
                <input
                  className={ ui.invalidFields[`${el}Date`] && 'invalid' || null }
                  name={ `filter-datepicker-${el}` }
                  data-property={ `${el}Date` }
                  value={ ui[`${el}Date`] }
                  onChange={ changeDate }
                  onBlur={ validateInput }
                  ref={ `filterDatepicker${utils.capitalize(el)}` }
                  maxLength="10"
                />
                <span className="filter-datepicker-trigger" />
              </div>
            </div>
          ) }
        </div>
        <div className="filter-block filter-block-info">
          <p>
            { dict.dataAvailability }
            <span>{ ' ' }</span>
            { dict.dataAvailabilityDate }
          </p>
          <button className="button" onClick={ requestDetails }>{ dict.show }</button>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    mode: state.settings.mode,
    data: state.data,
    ui: state.ui
  }),
  dispatch => ({
    validateInput: e => dispatch(actions.validateInput(e)),
    changeCodes: e => dispatch(actions.changeCodes(e)),
    changeDate: e => dispatch(actions.changeDate(e)),
    changePeriod: e => dispatch(actions.changePeriod(e)),
    requestDetails: () => dispatch(actions.requestDetails()),
  })
)(AsideFilterRates);
