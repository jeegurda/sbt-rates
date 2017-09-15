import api from '../api';
import * as utils from '../utils';
import _ from 'lodash';

export let requestCurrent = noDate => (dispatch, getState) => {
  let state = getState();
  let requestCodes = utils.getCodes(state.data, 'checked');

  let params = {
    regionId: state.settings.regionId,
    rateCategory: state.ratesType,
    currencyCode: requestCodes
  };

  if (!noDate) {
    params.date = `${state.ui.detailedDate} 23:59:59`;
  }

  if (
    noDate && _.isEqual(state.cachedParams.current, params) ||
    !noDate && _.isEqual(state.cachedParams.detailed, params)
  ) {
    return Promise.resolve();
  }

  let currentPropFull = `${noDate ? 'ratesCurrent' : 'ratesDetailed'}Full`;

  let emptyRates = {
    0: {
      buyValue: '—',
      sellValue: '—',
      buyChange: '—',
      sellChange: '—',
      scale: '—'
    }
  };

  let newStateDataDummy = _.cloneDeep(state.data);

  requestCodes.forEach(code => {
    // no conflict with data setting requests
    !newStateDataDummy[code] && (newStateDataDummy[code] = {});
    newStateDataDummy[code][currentPropFull] = _.cloneDeep(emptyRates);
  });

  dispatch({
    type: 'DATA_CURRENT_DUMMY',
    payload: newStateDataDummy
  });

  return fetch(api('current', params))
    .then(res => res.ok ? res.json() : Promise.reject(res.text()))
    .then(json => {
      let latestChange = 0;
      let state = getState();
      let newStateData = _.cloneDeep(state.data);

      requestCodes.forEach(code => {
        let item = json[state.ratesType][code];

        // no conflict with data setting requests
        !newStateData[code] && (newStateData[code] = {});

        if (item) {
          Object.keys(item).forEach(l => {
            !newStateData[code][currentPropFull] && (newStateData[code][currentPropFull] = {});

            newStateData[code][currentPropFull][l] = {
              buyValue: item[l].buyValue,
              sellValue: item[l].sellValue,
              buyChange: item[l].buyValue - item[l].buyValuePrev,
              sellChange: item[l].sellValue - item[l].sellValuePrev,
              scale: item[l].scale
            };

            if (item[l].activeFrom > latestChange) {
              latestChange = item[l].activeFrom;
            }
          });
        } else {
          newStateData[code][currentPropFull] = _.cloneDeep(emptyRates);
          console.warn(`Rates: no current rates for code ${code} received`);
        }
      });

      if (noDate) {
        dispatch({
          type: 'LATEST',
          payload: latestChange
        });
      }

      dispatch({
        type: 'CACHE_PARAMS',
        payload: {
          [noDate ? 'current' : 'detailed']: params
        }
      });

      dispatch({
        type: 'DATA_CURRENT',
        payload: newStateData
      });
    })
    .catch(err => {
      let reject = genericError => {
        console.warn(`Rates: failed to fetch ${api('current')} with params`, params, `: ${genericError}`);
        return Promise.reject(genericError);
      };
      return err.then ? err.then(e => reject(e)) : reject(err);
    });
};
