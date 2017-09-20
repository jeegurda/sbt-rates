import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

import HoverNote from '@root/src/js/hoverNote';

class AsideFilterConverterParams extends React.Component {
  render() {
    let premiumServiceNote = null;
    let { converter, premiumServiceCodes, data, dict, changeConverterParams, param } = this.props;

    // if there is a currency selected which is not in a premiumServiceCodes array and is not '' (RUR)
    // for first/premium service types, show a warning
    if (param.name === 'servicePack' && converter.params.servicePack !== 'empty') {
      let wrongCodes = [];

      if (converter.from && premiumServiceCodes.indexOf(converter.from) !== -1) {
        wrongCodes.push(data[converter.from].isoName);
      }
      if (converter.to && premiumServiceCodes.indexOf(converter.to) !== -1) {
        wrongCodes.push(data[converter.to].isoName);
      }

      if (wrongCodes.length) {
        premiumServiceNote =
          <span className="rates-aside-error">
            { `${dict.converterOptionsError}: ${wrongCodes.join(', ')}` }
          </span>;
      }
    }

    return (
      <div className="filter-block">
        <div>
          <h6>{ dict[`filterConverter${param.dictKey}`] }</h6>
          <HoverNote text={ dict[`filterConverter${param.dictKey}Tip`] } />
        </div>
        { param.values.map(el =>
          <label key={ el.prop } className={ el.active ? null : 'filter-inactive' }>
            <input
              type="radio"
              name={ param.name }
              checked={ converter.params[param.name] === el.prop }
              value={ el.prop }
              onChange={ changeConverterParams }
            />
            <span className="radio" />
            <p>
              { dict[`filterConverter${param.dictKey}${utils.capitalize(el.prop)}`] }
            </p>
          </label>
        ) }
        { premiumServiceNote }
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
    changeConverterParams: e => dispatch(actions.changeConverterParams(e))
  })
)(AsideFilterConverterParams);
