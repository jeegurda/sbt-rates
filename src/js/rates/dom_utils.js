import * as actions from './actions';
import * as utils from './utils';
import _ from 'lodash';

let DOM = {};

window.actions = DOM

// expects { key: DOMElement, key2: DOMElement }
export let registerDOMElements = map => {
  Object.keys(map).forEach(key => {
    if (key in DOM) {
      console.warn(`Rates: an element with a key "${key}" is already registered:`, DOM[key]);
      return;
    }
    DOM[key] = map[key];
  });
};

export let unregisterDOMElements = keys => {
  if (typeof keys === 'string') {
    if (keys in DOM) {
      delete DOM[keys];
    } else {
      console.warn(`Rates: no element with a key "${keys}" was registered`);
    }
  } else if (Array.isArray(keys)) {
    keys.forEach(key => {
      if (key in DOM) {
        delete DOM[key];
      } else {
        console.warn(`Rates: no element with a key "${keys}" was registered`);
      }
    });
  } else {
    console.log(`Rates: an argument should be a string or an array`);
  }
};

export let getDOMElement = key => {
  if (key in DOM) {
    return DOM[key];
  }
  return null;
}

export let getDOM = () => DOM;
