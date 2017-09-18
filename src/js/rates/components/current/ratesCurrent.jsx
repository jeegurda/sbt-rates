import moment from 'moment';
import * as utils from '../../utils';
import { connect } from 'react-redux';

import CurrentLinks from './ratesCurrentLinks';
import CurrentNote from './ratesCurrentNote';
import CurrentExchangeNote from './ratesCurrentExchangeNote';

class Current extends React.Component {
  render() {
    let { dict, data, mode, destinationCurrency, latestChange, dateFormat, converterAmount } = this.props;
    let currentData = utils.getCodes(data, 'checked');

    if (currentData.some(el => utils.getCurrentRatesForAmount(data[el].ratesCurrentFull, converterAmount))) {
      return (
        <div className="rates-current rates-right">
          <div className="current-rates rates-container">
            <div className="current-table">
              <table>
                <thead>
                  <tr>
                    <th>{ dict[`current${mode === 'metal' ? 'Metal' : 'Currency'}`] }</th>
                    <th>{ dict.currentAmount }</th>
                    <th>{ dict.currentBuy }</th>
                    <th>{ dict.currentSell }</th>
                  </tr>
                </thead>
                <tbody>
                  { currentData.map(code => {
                    let item = data[code];
                    let itemRates = utils.getCurrentRatesForAmount(item.ratesCurrentFull, converterAmount);

                    // if for some reason checked element wasn't loaded yet (few requests on a slow connection)
                    if (itemRates) {
                      let buyClassName = itemRates.buyChange > 0 ?
                        'rates-up' :
                        itemRates.buyChange < 0 ? 'rates-down' : 'rates-none';
                      let sellClassName = itemRates.sellChange > 0 ?
                        'rates-up' :
                        itemRates.sellChange < 0 ? 'rates-down' : 'rates-none';
                      let itemTitle;

                      if (mode === 'metal') {
                        itemTitle = item.name;
                      } else {
                        itemTitle = [
                          item.isoName,
                          <em key="0"> / { destinationCurrency }</em>
                        ];
                      }

                      let buyTitle = itemRates.buyChange > 0 ?
                        `${dict.currentIncrease}: ${utils.format(itemRates.buyChange)}` :
                        itemRates.buyChange < 0 ?
                          `${dict.currentDecrease}: ${utils.format(itemRates.buyChange)}` :
                          null;
                      let sellTitle = itemRates.sellChange > 0 ?
                        `${dict.currentIncrease}: ${utils.format(itemRates.sellChange)}` :
                        itemRates.sellChange < 0 ?
                          `${dict.currentDecrease}: ${utils.format(itemRates.sellChange)}` :
                          null;

                      return (
                        <tr key={ code }>
                          <td>{ itemTitle }</td>
                          <td>{ itemRates.scale }</td>
                          <td title={ buyTitle }>
                            <span className={ buyClassName }>
                              { utils.format(itemRates.buyValue) }
                            </span>
                          </td>
                          <td title={ sellTitle }>
                            <span className={ sellClassName }>
                              { utils.format(itemRates.sellValue) }
                            </span>
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  }) }
                </tbody>
              </table>
            </div>
            <div className="current-info">
              { dict.currentInfo.format(
                dict[`currentInfo${utils.capitalize(mode)}`],
                moment(latestChange).format(`${dateFormat} H:mm`)
              ) }
            </div>
          </div>
          <CurrentNote />
          <CurrentExchangeNote />
          <CurrentLinks />
        </div>
      );
    }
    return null;
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    data: state.data,
    mode: state.settings.mode,
    destinationCurrency: state.settings.destinationCurrency,
    latestChange: state.latestChange,
    dateFormat: state.settings.dateFormat,
    converterAmount: state.converter.amount
  })
)(Current);
