import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';
import * as domUtils from '../../dom_utils';

class DetailsHistoryConverterPeriod extends React.Component {
  componentDidMount() {
    domUtils.registerDOMElements({
      dateDetailsFrom: this.dateDetailsFrom,
      dateDetailsTo: this.dateDetailsTo
    });
  }
  componentWillUnmount() {
    domUtils.unregisterDOMElements([ 'dateDetailsFrom', 'dateDetailsTo' ]);
  }
  render() {
    let { dict, data, converter, destinationCurrency, invalidFields, ui, changeDate, validateInput, requestDetails } = this.props;

    return (
      <div className="rates-details-period">
        <div className="rates-details-period-title">
          { data[converter.from || converter.to].isoName }
          <em>
            /
            { destinationCurrency }
          </em>
        </div>
        <div className="rates-details-period-datepicker">
          <div className="rates-details-period-datepicker-line">
            { [ 'from', 'to' ].map(el =>
              [
                <p key={ `${el}0` }>{ dict[`filter${utils.capitalize(el)}`] }</p>,
                <div className="filter-datepicker input" key={ `${el}1` }>
                  <input
                    className={ invalidFields[`${el}Date`] && 'invalid' || null }
                    name={ `filter-datepicker-details-${el}` }
                    data-property={ `${el}Date` }
                    value={ `${ui[`${el}Date`]}` }
                    onChange={ changeDate }
                    onBlur={ validateInput }
                    ref={ node => this[`dateDetails${utils.capitalize(el)}`] = node }
                    maxLength="10"
                  />
                  <span className="filter-datepicker-trigger" />
                </div>
              ]
            ) }
          </div>
          <div className="rates-details-period-datepicker-line">
            <button className="button" onClick={ requestDetails }>{ dict.show }</button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    data: state.data,
    converter: state.converter,
    destinationCurrency: state.settings.destinationCurrency,
    invalidFields: state.ui.invalidFields,
    ui: state.ui
  }),
  dispatch => ({
    changeDate: e => dispatch(actions.changeDate(e)),
    validateInput: e => dispatch(actions.validateInput(e)),
    requestDetails: () => dispatch(actions.requestDetails()),
  })
)(DetailsHistoryConverterPeriod);
