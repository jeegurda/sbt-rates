import * as utils from '../../utils';
import { connect } from 'react-redux';

class DetailsTableRow extends React.Component {
  render() {
    let { item, converterAmount } = this.props;

    let ratesDetailed = utils.getCurrentRatesForAmount(item.ratesCurrentFull, converterAmount);
    let buyClassName = ratesDetailed.buyChange > 0 ?
      'rates-up' :
      ratesDetailed.buyChange < 0 ? 'rates-down' : 'rates-none';
    let sellClassName = ratesDetailed.sellChange > 0 ?
      'rates-up' :
      ratesDetailed.sellChange < 0 ? 'rates-down' : 'rates-none';

    return (
      <tr>
        <td>{ item.name }</td>
        <td>{ item.isoName }</td>
        <td>{ ratesDetailed.scale }</td>
        <td>
          { typeof ratesDetailed.buyValue === 'number' ?
            [
              `${utils.format(ratesDetailed.buyValue)} (`,
              <span className={ buyClassName } key="0">{ utils.format(ratesDetailed.buyChange) }</span>,
              ')'
            ] :
            '—'
          }
        </td>
        <td>
          { typeof ratesDetailed.sellValue === 'number' ?
            [
              `${utils.format(ratesDetailed.sellValue)} (`,
              <span className={ sellClassName } key="0">{ utils.format(ratesDetailed.sellChange) }</span>,
              ')'
            ] :
            '—'
          }
        </td>
      </tr>
    );
  }
}

export default connect(
  state => ({
    converterAmount: state.converter.amount
  })
)(DetailsTableRow);
