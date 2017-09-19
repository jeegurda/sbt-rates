import api from '../api';
import * as utils from '../utils';
import _ from 'lodash';
import u from 'updeep';

import * as domUtils from '../dom_utils';
import * as actions from './';
import { scrollToResult } from '../scroll';

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
    .then(res => res.ok ? res.json() : Promise.reject(res.json()))
    .then(json => {
      let state = getState();

      if ($.isNumeric(json.amount)) {
        dispatch({
          type: 'SET_CONVERTER',
          payload: {
            result: {
              from: state.converter.from,
              to: state.converter.to,
              amount: state.converter.amount,
              value: json.amount,
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
        return Promise.resolve();
      }

      dispatch({
        type: 'SET_CONVERTER',
        payload: {
          result: u({
            valid: false
          }, state.converter.result)
        }
      });
      console.warn(`Rates: couldn't parse response "${json}"`);
      return Promise.reject();
    })
    .catch(err => {
      let reject = genericError => {
        console.warn(`Rates: failed to fetch "${api('convert')}" with params`, params, `: ${genericError}`);
        return Promise.reject(genericError);
      };
      err.then ? err.then(e => reject(e)) : reject(err);
    });
};

export let requestConversionAndScroll = () => dispatch => {
  dispatch(actions.requestConversion())
    .then(() => {
      scrollToResult( domUtils.getDOMElement('converterResult') );
    })
    .catch(() => {
      // failed to request conversion or bad response
      // need to add a visual warning
    });
};
