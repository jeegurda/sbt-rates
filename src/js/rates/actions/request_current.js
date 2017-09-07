
import api from '../api';
import * as utils from '../utils';
import _ from 'lodash';
import u from 'updeep';

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

    let currentProp = noDate ? 'ratesCurrent' : 'ratesDetailed';
    let currentPropFull = currentProp + 'Full';

    let emptyRates = {
        '0': {
            buyValue: '—',
            sellValue: '—',
            buyChange: '—',
            sellChange: '—',
            scale: '—'
        }
    };

    let newStateData = { ...state.data };

    requestCodes.forEach(code => {
        // no conflict with data setting requests
        !newStateData[code] && (newStateData[code] = {});
        newStateData[code][currentPropFull] = { ...emptyRates };

        Object.defineProperty(newStateData[code], currentProp, {
            configurable: true,
            get() {
                // using 0 if the field is empty
                let amount = parseInt(state.converter.amount, 10) || 0;
                let limits = Object.keys(this[currentPropFull])
                    .map(el => parseInt(el))
                    .sort((a, b) => a - b);

                let limit;

                for (let i = 0; i < limits.length; i++) {
                    let next = limits[i + 1];
                    if (typeof next !== 'undefined') {
                        if (amount < next) {
                            limit = limits[i];
                            break;
                        }
                    } else {
                        limit = limits[i];
                    }
                }
                return this[currentPropFull][limit];
            }
        });
    });

    dispatch({
        type: 'DATA',
        payload: newStateData
    });

    return fetch( api('current', params) )
        .then(res => res.ok ? res.json() : Promise.reject( res.text() ))
        .then(json => {

            let latestChange = 0;
            let newStateDataAsync = { ...newStateData };

            requestCodes.forEach(code => {
                let item = json[state.ratesType][code];

                // no conflict with data setting requests
                !newStateDataAsync[code] && (newStateDataAsync[code] = {});

                if (item) {
                    Object.keys(item).forEach(l => {
                        !newStateDataAsync[code][currentPropFull] && (newStateDataAsync[code][currentPropFull] = {});

                        newStateDataAsync[code][currentPropFull][l] = {
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
                    newStateDataAsync[code][currentPropFull] = { ...emptyRates };
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
                type: 'DATA',
                payload: newStateDataAsync
            });
        })
        .catch(err => {
            let reject = genericError => {
                console.warn(`Rates: failed to fetch ${api('current')} with params`, params, `: ${genericError}`);
                return Promise.reject(genericError);
            }
            return err.then ? err.then(e => reject(e)) : reject(err);
        });
};