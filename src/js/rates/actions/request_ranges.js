/**
 * You can also use following 4 parameters for 'requestDated' and 'requestRanges' methods.
 * 'categoryCode' property is used as a shortcut, making them all insignificant
 *
 * For example
 *
 * sourceCode: state.converter.params.sourceCode,
 * destinationCode: state.converter.params.destinationCode,
 * exchangeType: state.converter.params.exchangeType,
 * servicePack: state.converter.params.servicePack
 *
 */

import api from '../api';
import * as utils from '../utils';
import _ from 'lodash';

export let requestRanges = () => (dispatch, getState) => {
  let state = getState();
  let requestCodes = utils.getCodes(state.data, 'checked');
  let params = {
    regionId: state.settings.regionId,
    currencyCode: requestCodes,
    categoryCode: state.ratesType
  };

  if (_.isEqual(state.cachedParams.ranges, params)) {
    return Promise.resolve();
  }

  return fetch(api('ranges', params))
    .then(res => res.ok ? res.json() : Promise.reject(res.text()))
    .then(json => {
      let newStateData = { ...state.data };

      requestCodes.forEach(code => {
        let item = json[code];

        // no conflict with data setting requests
        !newStateData[code] && (newStateData[code] = {});

        if (item) {
          if (item.length > 0) {
            item.forEach((el, i) => {
              el.checked = i === 0;
            });
            newStateData[code].ranges = item;
          } else {
            console.warn(`Rates: empty ranges array received for code ${code}`);
          }
        } else {
          console.warn(`Rates: no ranges received for code ${code}`);
        }
        newStateData[code].rangePopupVisible = false;
      });

      dispatch({
        type: 'DATA',
        payload: newStateData
      });
      dispatch({
        type: 'CACHE_PARAMS',
        payload: {
          ranges: params
        }
      });
    })
    .catch(err => {
      let reject = genericError => {
        console.warn(`Rates: failed to fetch ${api('ranges')} with params`, params, `: ${genericError}`);
        return Promise.reject(genericError);
      };
      return err.then ? err.then(e => reject(e)) : reject(err);
    });
};
