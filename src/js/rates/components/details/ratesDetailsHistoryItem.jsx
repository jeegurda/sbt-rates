import { connect } from 'react-redux';
import * as actions from '../../actions/';

import RangeSelect from './ratesDetailsHistoryRangeSelect';

class DetailsHistoryItem extends React.Component {
  render() {
    let { dict, print, showTableView, item, code } = this.props;

    return (
      // if data for code is missing (no ranges) or plot wasn't built (no data, empty values array, jqplot errors)
      item.ratesDated === 'NODATA' || item.plot === null ?

        <div>
          <div>{dict.noData}</div>
          <div id={`plot-${code}`} className="details-item-plot plot-no-data"></div>
        </div> :

        <div className="scroll-content">
          <div className="rates-links">
            <div className="rl-left">
              <span className="rl-print" onClick={ print.bind(null, code) }>{dict.print}</span>
              <span onClick={ showTableView.bind(null, code) }>{dict.tableView}</span>
            </div>
            <RangeSelect item={item} code={code}/>
          </div>
          <div id={`plot-${code}`} className="details-item-plot"></div>
        </div>
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
  }),
  dispatch => ({
    print: code => dispatch(actions.print(code)),
    showTableView: code => dispatch(actions.tableView(code))
  })
)(DetailsHistoryItem);
