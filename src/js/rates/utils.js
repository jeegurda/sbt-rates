
export let getRangesDescription = (ranges, dict) => {
    return Object.keys(ranges)
        .map(el => ranges[el].amountFrom)
        .sort((a, b) => a - b)
        .map((el, i, arr) => {
            let nextMax = el;
            for (let j = i; j < arr.length; j++) {
                if (arr[j] > el) {
                    nextMax = arr[j];
                    break;
                }
            }
            if (nextMax === el) {
                return dict.detailsRangeFrom + ' ' + el;
            } else {
                return el + '-' + nextMax;
            }
        });
};

export let getCheckedRange = (data, code) => {
    if (data[code].ranges) {
        return data[code].ranges.filter(range => range.checked)[0].amountFrom;
    }
};

export let getCodes = (data, property, inverse, dontSort) => {
    if (typeof data !== 'object') {
        debugger;
    }
    let codes = Object.keys(data).filter(code => inverse ? !data[code][property] : data[code][property]);

    // sorting is enabled by default if not told otherwise
    if (!dontSort) {
        codes = codes.sort((a, b) => data[a].order - data[b].order);
    }

    return codes;
};

export let regExp = {
    nonDigits: /\D/g,
    thousands: /\B(?=(\d{3})+(?!\d))/g,
    delimiters: /[.,]/,
    commas: /,/g,
    spaces: /\s/g,
    word: /\w/
};

export let capitalize = str => str.replace(regExp.word, m => m.toUpperCase());

export let format = x => {
    if (typeof x === 'string') {
        x = x.replace(regExp.commas, '.').replace(regExp.spaces, '');
    }

    if ($.isNumeric(x)) {
        x = parseFloat(x).toFixed(2).replace('.', ',');

        return x < 1000 ? x : x.replace(regExp.thousands, ' ');
    } else {
        return '—';
    }
};
