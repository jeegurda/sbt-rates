import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

class AsideFilterTable extends React.Component {
  render() {
    let { dict, invalidFields, ui, changeDate, validateInput, ratesType, requestDetails } = this.props;

    return (
      <div className="rates-aside-filter rates-container">
        <div className="filter-block">
          <div>
            <h6>{ dict.filterSelectDate }</h6>
          </div>
          <div className="filter-block-line">
            <div className="filter-datepicker input">
              <input
                className={ invalidFields.detailedDate && 'invalid' || null }
                name="filter-datepicker-detailed"
                data-property="detailedDate"
                value={ ui.detailedDate }
                onChange={ changeDate }
                onBlur={ validateInput }
                ref={ node => this.filterDatepickerDetailed = node }
                maxLength="10"
              />
              <span className="filter-datepicker-trigger" />
            </div>
          </div>
        </div>
        <div className="filter-block filter-block-info">
          <p>
            { dict.dataAvailability }
            <span>{ ' ' }</span>
            { dict[`dataAvailabilityDate${utils.capitalize(ratesType)}`] }
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
    invalidFields: state.ui.invalidFields,
    ui: state.ui,
    ratesType: state.ratesType,
  }),
  dispatch => ({
    changeDate: e => dispatch(actions.changeDate(e)),
    validateInput: e => dispatch(actions.validateInput(e)),
    requestDetails: () => dispatch(actions.requestDetails()),
  })
)(AsideFilterTable);
