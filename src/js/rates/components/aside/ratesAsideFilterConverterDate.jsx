import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

import HoverNote from '@root/src/js/hoverNote';

class AsideFilterConverterDate extends React.Component {
  render() {
    let { converter, dict, invalidFields, ui, changeConverterDate } = this.props;

    return (
      <div className="filter-block">
        <div>
          <h6>{ dict.filterConverterDate }</h6>
          <HoverNote text={ dict.filterConverterDateTip } />
        </div>
        { [ 'current', 'select' ].map(el =>
          <label key={ el }>
            <input
              type="radio"
              name="converterDateSelect"
              checked={ converter.dateSelect === el }
              value={ el }
              onChange={ changeConverterDate }
            />
            <span className="radio" />
            <p>
              { dict[`filterConverterDate${utils.capitalize(el)}`] }
            </p>
          </label>
        ) }
        { converter.dateSelect === 'select' &&
          <div className="filter-datepicker input">
            <input
              className={ invalidFields.converterDate && 'invalid' || null }
              name="converter-datepicker"
              data-property="converterDate"
              value={ ui.converterDate }
              onChange={ $.noop }
              ref={ node => this.converterDatepicker = node }
              maxLength="21"
            />
            <span className="filter-datepicker-trigger" />
          </div>
        }
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
    changeConverterDate: e => dispatch(actions.changeConverterDate(e))
  })
)(AsideFilterConverterDate);
