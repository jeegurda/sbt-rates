
import api from '../api';
import * as utils from '../utils';
import _ from 'lodash';
import u from 'updeep';

export let requestInfo = () => (dispatch, getState) => {
    let state = getState();
    let nameProp = 'currencyName' + (state.settings.language === 'en' ? 'En' : '');
    let params = {
        type: state.settings.mode === 'metal' ? 'METAL' : 'CURRENCY'
    };

    return fetch( api('info', params) )
        .then(res => res.ok ? res.json() : Promise.reject( res.text() ))
        .then(json => {

            if (!json.length) {
                console.warn(`Rates: empty array received for currency type ${params.type}`);
            } else {
                let newData = { ...state.data };

                json.forEach(function(el, i) {
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
                    type: 'DATA',
                    payload: newData
                });
            }
        })
        .catch(err => {
            let reject = genericError => {
                console.warn(`Rates: failed to fetch ${api('info')} with params`, params, `: ${genericError}`);
                dispatch({
                    type: 'ERROR',
                    payload: {
                        info: true
                    }
                });
                return Promise.reject(genericError);
            }
            return err.then ? err.then(e => reject(e)) : reject(err);
        });
};
