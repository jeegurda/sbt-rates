import combinations from './converterCombinations';

let converterConfig = {
  params: [
    {
      name: 'sourceCode',
      dictKey: 'Source',
      values: [ { prop: 'card', active: true }, { prop: 'account', active: true }, { prop: 'cash', active: true } ]
    },
    {
      name: 'destinationCode',
      dictKey: 'Dest',
      values: [ { prop: 'card', active: true }, { prop: 'account', active: true }, { prop: 'cash', active: true } ]
    },
    {
      name: 'exchangeType',
      dictKey: 'Exchange',
      values: [ { prop: 'ibank', active: true }, { prop: 'office', active: true }, { prop: 'atm', active: true } ]
    },
    {
      name: 'servicePack',
      dictKey: 'Service',
      values: [ { prop: 'empty', active: true }, { prop: 'premier', active: true }, { prop: 'first', active: true } ]
    }
  ],
  rateTypes: [ 'base', 'beznal', 'premium', 'first' ],
  combinations
};

export default converterConfig;
