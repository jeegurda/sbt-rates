
import api from '../api';
import * as utils from '../utils';
import _ from 'lodash';
import u from 'updeep';

import * as actions from './';

export let requestDetails = () => (dispatch, getState) => {
    let state = getState();

    if (state.viewMode === 'history') {
        return dispatch( actions.requestRanges() )
            .then(() => dispatch( actions.requestDated() ))
            .then(() => dispatch( actions.drawPlot() ))
            .catch(err => {
                console.warn(`Rates: failed to get ranges or dated, aborting sequence: ${err}`);
            });
    } else if (state.viewMode === 'table') {
        return dispatch( actions.requestCurrent() );
    }
};

export let requestInitial = () => (dispatch, getState) => {
    return Promise.all([
        dispatch( actions.requestInfo() ),
        dispatch( actions.requestCurrent(true) ),
        dispatch( actions.requestDetails() )
    ]).then(() => {
        dispatch( actions.setLoading(false) );
    }).catch(() => {
        dispatch( actions.setLoading(false) );
    });
}
