import { connect } from 'react-redux';

import Aside from '../aside/ratesAside';
import Current from '../current/ratesCurrent';
import Tabs from '../tabs/ratesTabs';
import Details from '../details/ratesDetails';
import TableView from '../tableView/ratesTableView';

class Content extends React.Component {
  render() {
    let { loaded } = this.props;

    // it's important to add a "key" prop here so when rebuilding the structure
    // the plot div wouldn't be re-rendered losing all svg data
    return (
      loaded ?
        <div>
          <Current />
          <Aside />
          <Tabs />
          <Details key="1" />
          <TableView />
        </div> :
        <div>
          <Details key="1" />
        </div>
    );
  }
}

export default connect(
  state => ({
    loaded: state.loaded
  })
)(Content);
