import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

class AsideCurrencySelect extends React.Component {
  render() {
    let { dict, ratesType, mode, data, selectCurrency } = this.props;

    // for currency mode and if at least one option isn't selected
    let showSelect = ratesType !== 'first' &&
      ratesType !== 'premium' &&
      mode === 'currency' &&
      utils.getCodes(data, 'display', true).length;

    return (
      showSelect ?

        <div className="filter-block filter-block-currency-select">
          <div>
            <h6>{ dict.filterSelectCurrency }</h6>
          </div>
          <select
            ref={ node => this.currencySelect = node }
            onChange={ selectCurrency }
          >
            { utils.getCodes(data, 'display', true).map(code =>
              <option key={ code } value={ code }>{ data[code].name }</option>
            ) }
          </select>
        </div> :

        null
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    ratesType: state.ratesType,
    mode: state.settings.mode,
    data: state.data
  }),
  dispatch => ({
    selectCurrency: e => dispatch(actions.selectCurrency(e)),
  })
)(AsideCurrencySelect);
