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

export let requestDated = () => (dispatch, getState) => {
  const ALLOW_MULTIPLE_REQUESTS = true;
  let state = getState();

  let postBody = {
    currencyData: [],
    categoryCode: state.ratesType
  };

  utils.getCodes(state.data, 'checked').forEach(code => {
    // if a code doesn't have a range, skip it
    if (!state.data[code].ranges) {
      let newStateData = _.cloneDeep(getState().data);
      newStateData[code].ratesDated = 'NODATA';

      dispatch({
        type: 'DATA_DATED',
        payload: newStateData
      });
      return;
    }
    postBody.currencyData.push({
      currencyCode: code,
      rangesAmountFrom: state.data[code].ranges.map(el => el.amountFrom).sort((a, b) => a - b)
    });
  });

  if (!postBody.currencyData.length) {
    console.warn('Rates: no correct ranges to request dated info');

    // removing dated rates for every code except checked ones
    utils.getCodes(state.data, 'ratesDated').forEach(code => {
      if (!state.data[code].checked) {
        let newStateData = _.cloneDeep(getState().data);
        newStateData[code].ratesDated = null;

        dispatch({
          type: 'DATA_DATED',
          payload: newStateData
        });
      }
    });
    return Promise.reject('No correct ranges');
  }

  let params = {
    regionId: state.settings.regionId,
    fromDate: state.ui.fromDate,
    toDate: state.ui.toDate
  };

  if (
    !ALLOW_MULTIPLE_REQUESTS &&
    _.isEqual(state.cachedParams.dated, params) &&
    _.isEqual(state.cachedParams.datedBody, postBody)
  ) {
    // to redraw plots in cases without ajax (e.g. after a tab change)
    return Promise.resolve();
  }

  return fetch(api('rates', params), {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(postBody)
  })
    .then(res => res.ok ? res.json() : Promise.reject(res.text()))
    .then(json => {
      let state = getState();
      let newStateData = _.cloneDeep(state.data);

      // no conflicts should happen here, this request shouldn't be initial

      Object.keys(state.data).forEach(code => {
        let newItem = newStateData[code];
        if (json[code]) {
          if (json[code].rates) {
            newItem.ratesDated = json[code].rates;
            newItem.scale = json[code].scale;
            // in case of no info has been received yet, showing the code instead
            newItem.name = newItem.name || code;
          } else {
            if (!newItem.checked) {
              newItem.ratesDated = null;
              newItem.scale = '-';
              newItem.name = newItem.name || code;
            }
            console.warn(`Rates: no dated rates received for code: ${code}`);
          }
        } else if (!newItem.checked) {
          // same check as before sending ajax, if it's checked, don't remove it
          newItem.ratesDated = null;
          newItem.scale = '-';
          newItem.name = newItem.name || code;
        }
      });

      dispatch({
        type: 'DATA_DATED',
        payload: newStateData
      });

      dispatch({
        type: 'CACHE_PARAMS',
        payload: {
          dated: params,
          datedBody: postBody
        }
      });
    })
    .catch(err => {
      let reject = genericError => {
        console.warn(`Rates: failed to fetch "${api('rates')}" with params`, params,
          'and body', postBody, `: ${genericError}`);
        return Promise.reject(genericError);
      };
      return err.then ? err.then(e => reject(e)) : reject(err);
    });
};
