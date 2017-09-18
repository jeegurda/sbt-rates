import { connect } from 'react-redux';
import * as utils from '../../utils';

import ConverterPeriod from './ratesDetailsHistoryConverterPeriod';
import HistoryGraphs from './ratesDetailsHistoryGraphs';

class DetailsHistory extends React.Component {
  componentDidUpdate() {
    // Rates.initDatepicker(this.refs.filterDatepickerDetailsFrom);
    // Rates.initDatepicker(this.refs.filterDatepickerDetailsTo);
  }
  render() {
    let { dict, ratesType, loaded } = this.props;

    return (
      <div className="rates-details">
        { loaded && <ConverterPeriod /> }
        <HistoryGraphs />
        { loaded &&
          <div className="rates-details-availability-note">
            <p>
              { dict.dataAvailability }
              <span>{ ' ' }</span>
              { dict[`dataAvailabilityDate${utils.capitalize(ratesType)}`] }
            </p>
          </div>
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    loaded: state.loaded,
    dict: state.settings.dict,
    ratesType: state.ratesType,
  })
)(DetailsHistory);
