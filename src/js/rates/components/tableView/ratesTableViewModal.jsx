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
    let lastDate = null;
    let dateRepeated = 0;
    let records = 0;

    return (
      <Modal
        bsClass="one modal"
        show={ itemData }
        onRequestHide={ hideTableView }
        keyboard={ true }
      >
        <div className="rates-table-view-close" onClick={ hideTableView }>
          <span>{ dict.tableViewClose }</span>
        </div>
        <h2>{ `${dict.tableView}, ${itemData.isoName}` }</h2>
        <a
          className="rates-table-view-download"
          href={ api('xls', {
            currencyCode: tableView,
            fromDate: ui.fromDate,
            toDate: ui.toDate,
            regionId,
            categoryCode: ratesType,
            rangesAmountFrom: itemData.ranges.map(el => el.amountFrom),
            lang: language
          }) }
        >
          { dict.tableViewDownload }
        </a>
        <div ref={ tableContainer => this.tableContainer = tableContainer } className="table-container">
          <table ref={ table => this.table = table }>
            <thead>
              <tr>
                { [
                  'tableViewDate',
                  'tableViewTime',
                  'tableViewAmount',
                  'tableViewFrom',
                  'tableViewTo',
                  'tableViewBuy',
                  'tableViewSell',
                ].map(el =>
                  <th key={ el }>{ dict[el] }</th>
                ) }
              </tr>
            </thead>
            <tbody>
              { itemData.ratesDated.map(el => {
                if (records > 200) {
                  return null;
                }

                let newRecord;
                let key;

                if (el.activeFrom === lastDate) {
                  key = `${lastDate}-${dateRepeated}`;
                  dateRepeated++;
                } else {
                  newRecord = true;
                  key = el.activeFrom;
                  dateRepeated = 0;
                  records++;
                }

                lastDate = el.activeFrom;

                return (
                  <tr className={ newRecord ? 'rates-record' : null } key={ key }>
                    <td>{ newRecord ? moment(lastDate).format(dateFormat) : null }</td>
                    <td>{ newRecord ? moment(lastDate).format(timeFormat) : null }</td>
                    <td>{ newRecord ? itemData.scale : null }</td>
                    <td>{ $.isNumeric(el.rangeFrom) ? el.rangeFrom : '—' }</td>
                    <td>{ $.isNumeric(el.rangeTo) ? el.rangeTo : '—' }</td>
                    <td>{ utils.format(el.buyValue) }</td>
                    <td>{ utils.format(el.sellValue) }</td>
                  </tr>
                );
              }) }
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
