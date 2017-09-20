import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

class RatesTabs extends React.Component {
  constructor(props) {
    super(props);
    let { mode } = this.props;

    if (mode === 'metal') {
      this.tabs = [ 'history' ];
    } else {
      this.tabs = [ 'history', 'table' ];
    }
  }
  render() {
    let { changeViewMode, viewMode, dict } = this.props;

    return (
      <ul className="rates-tabs rates-right">
        { this.tabs.map(tab =>
          <li
            className={ viewMode === tab ? 'active' : '' }
            key={ tab }
            onClick={ changeViewMode.bind(null, tab) }
          >
            <span>{ dict[`tabMode${utils.capitalize(tab)}`] }</span>
          </li>
        ) }
      </ul>
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    viewMode: state.viewMode,
    mode: state.settings.mode,
  }),
  dispatch => ({
    changeViewMode: viewMode => dispatch(actions.changeViewMode(viewMode))
  })
)(RatesTabs);
