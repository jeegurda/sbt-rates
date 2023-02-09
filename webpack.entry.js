let libs = [
  'lodash',
  'updeep',
  'moment',
  'redux',
  'react-redux',
  'redux-logger',
  'redux-thunk'
];

let polyfills = [
  'babel-polyfill',
  'isomorphic-fetch',
];

module.exports = dev => {
  return {
    libs: dev ? libs : polyfills.concat(libs),
    rates: './src/js/rates-app.js'
  };
};
