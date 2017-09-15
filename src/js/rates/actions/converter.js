import moment from 'moment';
import converterConfig from '../converterConfig';
import * as actions from './';
import * as utils from '../utils';
import _ from 'lodash';
import u from 'updeep';

export let initConverter = () => (dispatch, getState) => {
  let state = getState();

  switch (state.settings.mode) {
    case 'currency':
      switch (state.settings.ratesType) {
        case 'base':
          sessionStorage.widgetRatesPreset = 'NOCARD';
          break;
        case 'beznal':
          sessionStorage.widgetRatesPreset = 'CARD';
          break;
        case 'premium':
          sessionStorage.widgetRatesPreset = 'PREMIER';
          break;
        case 'first':
          sessionStorage.widgetRatesPreset = 'FIRST';
          break;
        default:
          console.warn('Rates: Unknown ratesType');
      }
      break;
    case 'metal':
      sessionStorage.widgetRatesPreset = 'METAL';
      break;
    case 'converter': {
      let newParams = {};
      let newType;

      let getParams = (so, de, ex, se) => ({
        sourceCode: converterConfig.params[0].values[so].prop,
        destinationCode: converterConfig.params[1].values[de].prop,
        exchangeType: converterConfig.params[2].values[ex].prop,
        servicePack: converterConfig.params[3].values[se].prop
      });

      let preset = sessionStorage.widgetRatesPreset;

      switch (preset) {
        // aka "nal/beznal"
        case 'NOCARD':
          newParams = getParams(2, 2, 1, 0);
          newType = 'base';
          break;
        case 'PREMIER':
          newParams = getParams(1, 1, 1, 1);
          newType = 'premium';
          break;
        case 'FIRST':
          newParams = getParams(1, 1, 1, 2);
          newType = 'first';
          break;
        // aka "UKO"
        case 'CARD':
        case 'INDEX':
        case 'METAL':
        case undefined:
          newParams = getParams(0, 1, 0, 0);
          newType = 'beznal';
          break;
        default:
          console.warn(`Rates: unknown preset ${preset}`);

          newParams = getParams(0, 1, 0, 0);
          newType = 'beznal';
      }

      let today = new Date();
      let hours = today.getHours();
      let minutes = Math.floor(today.getMinutes() / 5) * 5;

      let date = `${moment().format(state.settings.dateFormat)} ` +
        `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

      dispatch({
        type: 'SET_CONVERTER',
        payload: {
          params: newParams,
          from: state.settings.sourceCurrencyCode,
          to: state.settings.destCurrencyCode,
          date
        }
      });

      dispatch({
        type: 'SET_RATES_TYPE',
        payload: newType
      });

      break;
    }
    default:
      console.warn(`Rates: unknown mode ${state.settings.mode}`);
  }
};

// counter for currencies which should always appear at the bottom, such as selected ones
let bottomCurrencyOrder = 999;

export let selectCurrency = e => (dispatch, getState) => {
  let state = getState();
  let target = e.target;

  dispatch({
    type: 'DATA_UI',
    payload: u({
      [target.value]: {
        display: true,
        checked: true,
        order: bottomCurrencyOrder++
      }
    }, state)
  });

  target.selectedIndex = -1;
  dispatch(actions.requestCurrent(true));
  // $(target).trigger('update');
};

export let changeCodes = e => (dispatch, getState) => {
  let target = e.target;
  let state = getState();

  // if it's not the last checked checkbox
  if (utils.getCodes(state.data, 'checked').length !== 1 || target.checked) {
    dispatch({
      type: 'DATA_UI',
      payload: u({
        [target.name]: { checked: target.checked }
      }, state)
    });

    dispatch(actions.requestCurrent(true));
  }
};

export let updateConverter = e => (dispatch, getState) => {
  if (e.type === 'submit') {
    e.preventDefault();
  }

  let state = getState();

  if (Number(state.converter.amount.replace(utils.regExp.commas, '.').replace(utils.regExp.spaces, '') > 0)) {
    dispatch(actions.requestConversionAndScroll());
  } else {
    // Rates.DOM.converterAmount.focus();
  }
};


let removingSpace = false;

export let onKeyDownAmount = e => {
  let target = e.target;
  // if pressed backspace and it's going to remove the space
  if (e.keyCode === 8 && target.value.charAt(target.selectionStart - 1) === ' ') {
    removingSpace = true;
  }
};

export let changeAmount = e => dispatch => {
  let target = e.target;
  let value = target.value;
  let delimiterFound = false;
  let delimiter;

  // remember cursor position
  let start = target.selectionStart;
  let end = target.selectionEnd;

  // clear the string from non-digits and excessive delimiters
  let clearString = value.replace(utils.regExp.nonDigits, m => {
    if (!delimiterFound) {
      let match = m.match(utils.regExp.delimiters);
      if (match) {
        delimiterFound = true;
        delimiter = match[0];
        return match;
      }
    }
    return '';
  });

  // remember how many symbols from user input were cut
  let inputLength = value.length - clearString.length;

  // remove excessive digits
  clearString = clearString.split(delimiter).map((p, i) => p.substr(0, i === 0 ? 12 : 2)).join(delimiter);

  // remember string's length to count spaces after
  let lengthBefore = clearString.length;

  // insert spaces
  clearString = clearString.replace(utils.regExp.thousands, ' ');

  // substract inserted spaces from cursor position
  inputLength -= clearString.length - lengthBefore;

  if (removingSpace) {
    // remove one position to "jump over" the space (pure usability)
    inputLength++;
    removingSpace = false;
  }

  dispatch({
    type: 'SET_CONVERTER',
    payload: { amount: clearString }
  });

  // restore cursor position
  target.setSelectionRange(start - inputLength, end - inputLength);
};

export let selectCode = e => (dispatch, getState) => {
  let target = e.target;
  let value = target.value;
  let targetName = target.name;
  // let selectToUpdate;
  let state = getState();

  let handleSelect = function(curSelect, otherSelect) {
    let newStateData = _.cloneDeep(state.data);
    let newStateConverter = _.cloneDeep(state.converter);

    newStateData[state.converter.from || state.converter.to].checked = false;

    if (value === state.converter[otherSelect]) {
      newStateConverter[otherSelect] = state.converter[curSelect];
      // selectToUpdate = otherSelect;
    }
    newStateConverter[curSelect] = value;

    // using code in a 'from' property as a current code IF it's not the default currency
    // using 'to' property otherwise
    newStateData[newStateConverter.from || newStateConverter.to].checked = true;

    dispatch({
      type: 'DATA_UI',
      payload: newStateData
    });

    dispatch({
      type: 'SET_CONVERTER',
      payload: newStateConverter
    });

    dispatch(actions.requestCurrent(true));

  /*        if (selectToUpdate) {
      $(Rates.DOM[selectToUpdate]).trigger('update');
    }*/
  /*        Rates.DOM.converterAmount.focus();
    Rates.DOM.converterAmount.setSelectionRange(100, 100);*/
  };

  if (targetName === 'converterFrom') {
    handleSelect('from', 'to');
  } else if (targetName === 'converterTo') {
    handleSelect('to', 'from');
  }
};

export let setConverterParams = (params) => (dispatch, getState) => {
  let param = Object.keys(params)[0];
  let state = getState();
  let value = params[param];

  let paramOrder = _.findIndex(converterConfig.params, { name: param });
  let curParams = state.converter.params;

  if (paramOrder === -1) {
    console.warn('Rates: unknown params');
    return;
  }

  let availableCombinations;
  let finalType;

  let checkCombination = function(comb) {
    if (comb) {
      return Object.keys(comb);
    }
    return null;
  };

  switch (param) {
    case 'sourceCode':
      availableCombinations = checkCombination(converterConfig.combinations[value]);
      break;
    case 'destinationCode':
      availableCombinations = checkCombination(converterConfig.combinations[curParams.sourceCode][value]);
      break;
    case 'exchangeType':
      availableCombinations = checkCombination(converterConfig.combinations[curParams.sourceCode][curParams.destinationCode][value]);
      break;
    case 'servicePack':
      finalType = converterConfig.combinations[curParams.sourceCode][curParams.destinationCode][curParams.exchangeType][value];
      if (typeof finalType === 'undefined') {
        finalType = null;
      }
      break;
    default:
      console.warn(`Unknown converter param ${param}`);
  }

  if (availableCombinations === null || finalType === null) {
    // selected param combination is invalid (clicked the grayed out option)
    return;
  }

  let nextSection = converterConfig.params[paramOrder + 1];

  if (nextSection) {
    nextSection.values.forEach(el => {
      if (availableCombinations.indexOf(el.prop) === -1) {
        el.active = false;

        if (curParams[nextSection.name] === el.prop) {
          // wrong parameter is selected for the current combination, setting to the first valid
          params[nextSection.name] = availableCombinations[0];
        }
      } else {
        el.active = true;
      }
    });
  } else {
    dispatch({
      type: 'SET_RATES_TYPE',
      payload: converterConfig.rateTypes[finalType]
    });
    dispatch(actions.requestCurrent(true));
  }

  dispatch({
    type: 'SET_CONVERTER',
    payload: {
      params
    }
  });

  // if next params section exists, recursively set them all
  if (nextSection) {
    dispatch(actions.setConverterParams({ [nextSection.name]: state.converter.params[nextSection.name] }));
  }
};

export let changeConverterParams = e => dispatch => {
  dispatch(actions.setConverterParams({ [e.target.name]: e.target.value }));
};

export let changeConverterDate = e => dispatch => {
  dispatch({
    type: 'SET_CONVERTER',
    dateSelect: e.target.value
  });
};
