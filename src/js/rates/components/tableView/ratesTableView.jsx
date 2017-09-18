import { connect } from 'react-redux';
import TableViewModal from './ratesTableViewModal';

class TableView extends React.Component {
  render() {
    return (
      this.props.tableView ?
        <TableViewModal /> :
        null
    );
  }
}

export default connect(
  state => ({
    tableView: state.tableView,
  })
)(TableView);
