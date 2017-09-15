import api from '../api';
import _ from 'lodash';

export let requestInfo = () => (dispatch, getState) => {
  let state = getState();
  let nameProp = `currencyName${state.settings.language === 'en' ? 'En' : ''}`;
  let params = {
    type: state.settings.mode === 'metal' ? 'METAL' : 'CURRENCY'
  };

  return fetch(api('info', params))
    .then(res => res.ok ? res.json() : Promise.reject(res.text()))
    .then(json => {
      if (json.length) {
        let state = getState();
        let newData = _.cloneDeep(state.data);

        json.forEach((el, i) => {
          // no conflict with data setting requests
          !newData[el.currencyCode] && (newData[el.currencyCode] = {});

          if (state.settings.codes[el.currencyCode]) {
            newData[el.currencyCode].display = true;
            newData[el.currencyCode].checked = state.settings.codes[el.currencyCode].checked;
          } else {
            newData[el.currencyCode].display = false;
            newData[el.currencyCode].checked = false;
          }

          newData[el.currencyCode].name = el[nameProp];
          newData[el.currencyCode].isoName = el.isoCur;
          newData[el.currencyCode].order = i;
        });

        dispatch({
          type: 'DATA_INFO',
          payload: newData
        });
      } else {
        console.warn(`Rates: empty array received for currency type ${params.type}`);
      }
    })
    .catch(err => {
      let reject = genericError => {
        console.warn(`Rates: failed to fetch ${api('info')} with params`, params, `: ${genericError}`);
        return Promise.reject(genericError);
      };
      return err.then ? err.then(e => reject(e)) : reject(err);
    });
};
