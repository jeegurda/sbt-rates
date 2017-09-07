
import moment from 'moment';
import * as actions from './';

export let init = settings => (dispatch, getState) => {
    dispatch({
        type: 'INIT',
        payload: settings
    });

    dispatch({
        type: 'SET_RATES_TYPE',
        payload: settings.ratesType
    });

    dispatch({
        type: 'SET_CONVERTER',
        payload: {
            converterAmount: settings.converterAmount
        }
    });

    dispatch({
        type: 'SET_VIEWMODE',
        payload: settings.viewMode
    });

    dispatch({
        type: 'DATA',
        payload: { ...settings.codes }
    });
}

export let initUI = () => (dispatch, getState) => {
    let state = getState();

    let fromDate;
    let toDate;
    let detailedDate;
    let { period } = state.settings;


    if (period === 'custom') {
        fromDate = moment().subtract(1, 'week');
    } else if (period === 'month') {
        fromDate = moment().subtract(1, 'month');
    } else if (period === 'halfyear') {
        fromDate = moment().subtract(6, 'month');
    } else if (period === 'quarter') {
        fromDate = moment().subtract(1, 'quarter');
    } else if (period === 'year') {
        fromDate = moment().subtract(1, 'year');
    } else {
        console.warn('Rates: bad period literal');
    }

    fromDate = fromDate.format(state.settings.dateFormat);
    toDate = moment().format(state.settings.dateFormat);
    detailedDate = moment().format(state.settings.dateFormat);

    dispatch({
        type: 'SET_UI',
        payload: {
            fromDate,
            toDate,
            detailedDate,
            period,
        }
    });
}

export let changePeriod = e => (dispatch, getState) => {
    let state = getState();

    let fromDate;
    let toDate;
    let period = e.target.value;


    if (period === 'month') {
        fromDate = moment().subtract(1, 'month');
        toDate = moment().format(state.settings.dateFormat);
    } else if (period === 'halfyear') {
        fromDate = moment().subtract(6, 'month');
        toDate = moment().format(state.settings.dateFormat);
    } else if (period === 'quarter') {
        fromDate = moment().subtract(1, 'quarter');
        toDate = moment().format(state.settings.dateFormat);
    } else if (period === 'year') {
        fromDate = moment().subtract(1, 'year');
        toDate = moment().format(state.settings.dateFormat);
    } else {
        console.warn('Rates: bad period literal');
    }

    dispatch({
        type: 'SET_UI',
        payload: {
            fromDate,
            toDate,
            period
        }
    });
}
