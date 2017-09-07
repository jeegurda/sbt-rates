
import combinations from './converterCombinations';

let converterConfig = {
    params: [
        {
            name: 'sourceCode',
            values: [{prop: 'card', active: true}, {prop: 'account', active: true}, {prop: 'cash', active: true}]
        },
        {
            name: 'destinationCode',
            values: [{prop: 'card', active: true}, {prop: 'account', active: true}, {prop: 'cash', active: true}]
        },
        {
            name: 'exchangeType',
            values: [{prop: 'ibank', active: true}, {prop: 'office', active: true}, {prop: 'atm', active: true}]
        },
        {
            name: 'servicePack',
            values: [{prop: 'empty', active: true}, {prop: 'premier', active: true}, {prop: 'first', active: true}]
        }
    ],
    rateTypes: [
        'base',
        'beznal',
        'premium',
        'first'
    ],
    combinations
};

export default converterConfig;
