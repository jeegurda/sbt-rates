import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

class AsideFilterConverterInput extends React.Component {
  render() {
    let { dict, updateConverter, converter, changeAmount, selectCode, destinationCurrency, data } = this.props;

    return (
      <div className="filter-block filter-block-converter">
        <div>
          <h6>{ dict.filterConverter }</h6>
        </div>
        <div className="filter-block-line filter-block-line-amount">
          <div className="filter-block-line-right input">
            <form onSubmit={ updateConverter }>
              <input
                maxLength="20"
                placeholder={ dict.filterConverterAmount }
                value={ converter.amount }
                onKeyDown={ actions.onKeyDownAmount }
                onChange={ changeAmount }
                ref={ node => this.converterAmount = node }
              />
            </form>
          </div>
        </div>
        <div className="filter-block-line">
          <div className="filter-block-line-left">
            <span>{ dict.filterConverterFrom }</span>
          </div>
          <div className="filter-block-line-right">
            <select
              ref={ node => this.converterFrom = node }
              value={ converter.from }
              name="converterFrom"
              onChange={ selectCode }
            >
              <option key="0" value={ '' }>{ destinationCurrency }</option>
              { utils.getCodes(data, '', true).map(code =>
                <option key={ code } value={ code }>{ data[code].isoName }</option>
              ) }
            </select>
          </div>
        </div>
        <div className="filter-block-line">
          <div className="filter-block-line-left">
            <span>{ dict.filterConverterTo }</span>
          </div>
          <div className="filter-block-line-right">
            <select
              ref={ node => this.converterTo = node }
              value={ converter.to }
              name="converterTo"
              onChange={ selectCode }
            >
              <option key="0" value={ '' }>{ destinationCurrency }</option>
              { utils.getCodes(data, '', true).map(code =>
                <option key={ code } value={ code }>{ data[code].isoName }</option>
              ) }
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    converter: state.converter,
    premiumServiceCodes: state.settings.premiumServiceCodes,
    data: state.data,
    dict: state.settings.dict,
    destinationCurrency: state.settings.destinationCurrency,
    invalidFields: state.invalidFields,
    ui: state.ui,
  }),
  dispatch => ({
    updateConverter: e => dispatch(actions.updateConverter(e)),
    changeAmount: e => dispatch(actions.changeAmount(e)),
    selectCode: e => dispatch(actions.selectCode(e))
  })
)(AsideFilterConverterInput);
