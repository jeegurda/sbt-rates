import api from '../api';
import * as utils from '../utils';
import _ from 'lodash';
import u from 'updeep';

import * as actions from './';

export let requestConversion = () => (dispatch, getState) => {
  let state = getState();
  let params = {
    regionId: state.settings.regionId,
    sourceCode: state.converter.params.sourceCode,
    destinationCode: state.converter.params.destinationCode,
    exchangeType: state.converter.params.exchangeType,
    servicePack: state.converter.params.servicePack,
    amount: state.converter.amount.replace(utils.regExp.commas, '.').replace(utils.regExp.spaces, ''),
    // could be an empty string
    fromCurrencyCode: state.converter.from,
    // could be an empty string
    toCurrencyCode: state.converter.to
  };

  if (state.converter.dateSelect === 'select') {
    params.date = `${state.converter.date}:00`;
  }

  if (_.isEqual(state.cachedParams.converter, params)) {
    return Promise.resolve();
  }

  return fetch(api('convert', params))
    .then(res => res.ok ? res.text() : Promise.reject(res.text()))
    .then(text => {
      let state = getState();
      if ($.isNumeric(text)) {
        dispatch({
          type: 'SET_CONVERTER',
          payload: {
            result: {
              from: state.converter.from,
              to: state.converter.to,
              amount: state.converter.amount,
              value: text,
              valid: true
            }
          }
        });
        dispatch({
          type: 'CACHE_PARAMS',
          payload: {
            converter: params
          }
        });
      } else {
        dispatch({
          type: 'SET_CONVERTER',
          payload: {
            result: u({
              valid: false
            }, state.converter.result)
          }
        });
        console.warn(`Rates: couldn't parse response "${text}"`);
      }
    })
    .catch(err => {
      let reject = genericError => {
        console.warn(`Rates: failed to fetch "${api('rates')}" with params`, params, `: ${genericError}`);
        return Promise.reject(genericError);
      };
      err.then ? err.then(e => reject(e)) : reject(err);
    });
};

export let requestConversionAndScroll = () => dispatch => {
  dispatch(actions.requestConversion())
    .then(() => {
      // scrollToResult();
    });
};
