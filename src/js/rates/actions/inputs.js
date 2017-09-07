
import api from '../api';
import * as utils from '../utils';
import _ from 'lodash';
import moment from 'moment';
import u from 'updeep';

import * as actions from './';

export let changeDate = e => (dispatch, getState) => {
    let state = getState();
    let inputType = e.target.getAttribute('data-property');
    let value = e.target.value;

    // using D.M.YYYY allows '1' as well as '01' for days/months
    let isDateInvalid = dateString => !moment(dateString, 'D.M.YYYY', true).isValid();

    let parseDate = dateString => moment(dateString, 'D.M.YYYY').toDate().getTime();

    let newInvalidFields = {};

    let validate = func => newInvalidFields[inputType] = func();

    switch(inputType) {
        case 'fromDate':
            validate(() => isDateInvalid(value) ||
                parseDate(value) < parseDate(state.settings.dict.dataAvailabilityDate) ||
                parseDate(value) > parseDate(state.ui.toDate)
            );
        break;
        case 'toDate':
            validate(() => isDateInvalid(value) ||
                parseDate(value) < parseDate(state.ui.fromDate) ||
                parseDate(value) > (new Date).getTime()
            );
        break;
        case 'detailedDate':
            validate(() => isDateInvalid(value) ||
                parseDate(value) < parseDate(state.settings.dict.dataAvailabilityDate) ||
                parseDate(value) > (new Date).getTime()
            );
        break;
        default:
            console.warn(`Rates: bad date type "${inputType}"`);
    }

    if (state.ui.lastValidDate === null) {
        dispatch({
            type: 'SET_UI',
            payload: {
                lastValidDate: state.ui[inputType]
            }
        });
    }

    dispatch({
        type: 'SET_UI',
        payload: {
            [inputType]: e.target.value,
            invalidFields: newInvalidFields
        }
    });
};

export let validateInput = e => (dispatch, getState) => {
    let state = getState();
    let inputType = e.target.getAttribute('data-property');

    if (state.ui.invalidFields[inputType]) {
        dispatch({
            type: 'SET_UI',
            payload: {
                [inputType]: state.ui.lastValidDate,
                invalidFields: {
                    [inputType]: false
                }
            }
        });
    }

    dispatch({
        type: 'SET_UI',
        payload: {
            lastValidDate: null
        }
    });
};
