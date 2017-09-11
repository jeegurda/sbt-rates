import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';
import api from '../../api';
import moment from 'moment';

class TableViewModal extends React.Component {
  constructor(props) {
    super(props);
    this.table = null;
    this.tableContainer = null;
  }
  componentDidMount() {
    this.props.addTableViewEvents(this.table, this.tableContainer);
  }
  componentWillUnmount() {
    this.props.removeTableViewEvents();
  }
  render() {
    let { hideTableView, tableView, ui, dict, language, dateFormat, timeFormat, data, regionId, ratesType } = this.props;
    let Modal = ReactBootstrap.Modal;

    let itemData = data[tableView];
    let lastDate;
    let recordCounter = 0;
    let limitReached = false;

    return (
      <Modal show={ itemData } onRequestHide={ hideTableView } keyboard={true} className="rates-table-view">
        <div className="rates-table-view-close" onClick={ hideTableView }>
          <span>{dict.tableViewClose}</span>
        </div>
        <h2>{`${dict.tableView}, ${itemData.isoName}`}</h2>
        <a className="rates-table-view-download" href={ api('xls', {
          currencyCode: tableView,
          fromDate: ui.fromDate,
          toDate: ui.toDate,
          regionId,
          categoryCode: ratesType,
          rangesAmountFrom: itemData.ranges.map(el => el.amountFrom),
          lang: language
        }) }>
          {dict.tableViewDownload}
        </a>
        <div ref={tableContainer => this.tableContainer = tableContainer} className="table-container">
          <table ref={table => this.table = table}>
            <thead>
              <tr>
                {[
                  dict.tableViewDate,
                  dict.tableViewTime,
                  dict.tableViewAmount,
                  dict.tableViewFrom,
                  dict.tableViewTo,
                  dict.tableViewBuy,
                  dict.tableViewSell
                ].map((el, i) =>
                  <th key={i}>{el}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {itemData.ratesDated.map((el, i) => {
                let newRecord = el.activeFrom !== lastDate;
                lastDate = el.activeFrom;

                if (limitReached || newRecord && ++recordCounter > 200) {
                  limitReached = true;
                  return null;
                }

                return (
                  <tr className={newRecord ? 'rates-record' : null} key={i}>
                    <td>{newRecord ? moment(lastDate).format(dateFormat) : null}</td>
                    <td>{newRecord ? moment(lastDate).format(timeFormat) : null}</td>
                    <td>{newRecord ? itemData.scale : null}</td>
                    <td>{$.isNumeric(el.rangeFrom) ? el.rangeFrom : '—'}</td>
                    <td>{$.isNumeric(el.rangeTo) ? el.rangeTo : '—'}</td>
                    <td>{utils.format(el.buyValue)}</td>
                    <td>{utils.format(el.sellValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal>
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    ui: state.ui,
    tableView: state.tableView,
    data: state.data,
    language: state.settings.language,
    dateFormat: state.settings.dateFormat,
    timeFormat: state.settings.timeFormat,
    regionId: state.settings.regionId,
    ratesType: state.settings.ratesType
  }),
  dispatch => ({
    hideTableView: () => dispatch(actions.tableView(null)),
    addTableViewEvents: (table, tableContainer) => dispatch(actions.addTableViewEvents(table, tableContainer)),
    removeTableViewEvents: (table, tableContainer) => dispatch(actions.removeTableViewEvents(table, tableContainer)),
  })
)(TableViewModal);
