import { connect } from 'react-redux';
import * as utils from '../../utils';
import DetailsTableRow from './ratesDetailsTableRow';

class DetailsTable extends React.Component {
  render() {
    let { dict, data, converterAmount } = this.props;

    return (
      <div className="rates-details">
        { utils.getCodes(data, 'checked').some(el =>
          utils.getCurrentRatesForAmount(data[el].ratesDetailedFull, converterAmount)
        ) &&
          <div className="rates-details-table">
            <table className="details-table">
              <thead>
                <tr>
                  { [ 'detailsName', 'detailsCode', 'detailsAmount', 'detailsBuy', 'detailsSell' ].map(el =>
                    <th key={ el }>{ dict[el] }</th>
                  ) }
                </tr>
              </thead>
              <tbody>
                { utils.getCodes(data, 'checked').map(code =>
                  // if it's checked and has something to show
                  utils.getCurrentRatesForAmount(data[code].ratesDetailedFull, converterAmount) ?
                    <DetailsTableRow key={ code } item={ data[code] } /> :
                    null
                ) }
              </tbody>
            </table>
          </div>
        }
        <div className="rates-details-note rates-note">
          <p>{ dict.detailsNoteFragment1 }</p>
          <p>{ dict.detailsNoteFragment2 }</p>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    data: state.data,
    converterAmount: state.converter.amount
  })
)(DetailsTable);
