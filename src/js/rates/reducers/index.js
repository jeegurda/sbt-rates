
import u from 'updeep';

export function settings(settings = {}, action) {
    switch (action.type) {
        case 'INIT':
            return action.payload;
        default:
            return settings;
    }
}

export function loading(loading = false, action) {
    switch (action.type) {
        case 'LOADING':
            return action.payload;
        default:
            return loading;
    }
}

export function loaded(loaded = false, action) {
    switch (action.type) {
        case 'LOADED':
            return action.payload;
        default:
            return loaded;
    }
}

export function error(error = {
    info: false
}, action) {
    switch (action.type) {
        case 'ERROR':
            return u(action.payload, error);
        default:
            return error;
    }
}

export function ui(ui = {
    period: null,
    fromDate: null,
    toDate: null,
    detailedDate: null,
    lastValidDate: null,
    invalidFields: {}
}, action) {
    switch (action.type) {
        case 'SET_UI':
            return u(action.payload, ui);
        default:
            return ui;
    }
}

export function converter(converter = {
    params: {},
    result: {
        amount: '',
        value: null,
        from: '',
        to: '',
        valid: false
    },
    converterAmount: null,
    from: null,
    to: null,
    dateSelect: 'current'
}, action) {
    switch (action.type) {
        case 'SET_CONVERTER':
            return u(action.payload, converter);
        default:
            return converter;
    }
}

export function ratesType(ratesType = null, action) {
    switch (action.type) {
        case 'SET_RATES_TYPE':
            return action.payload;
        default:
            return ratesType;
    }
}

// no merges here, data gets fully replaced!
export function data(data = {}, action) {
    switch (action.type) {
        case 'DATA':
            return action.payload;
        default:
            return data;
    }
}

export function cachedParams(cachedParams = {
    converter: {},
    dated: {},
    datedBody: {},
    detailed: {},
    ranges: {}
}, action) {
    switch (action.type) {
        case 'CACHE_PARAMS':
            return u(action.payload, cachedParams);
        default:
            return cachedParams;
    }
}

export function latestChange(latestChange = 0, action) {
    switch (action.type) {
        case 'LATEST':
            return action.payload;
        default:
            return latestChange;
    }
}

export function viewMode(viewMode = null, action) {
    switch (action.type) {
        case 'SET_VIEWMODE':
            return action.payload;
        default:
            return viewMode;
    }
}

export function printSection(printSection = null, action) {
    switch (action.type) {
        case 'PRINT_SECTION':
            return action.payload;
        default:
            return printSection;
    }
}

export function tableView(tableView = null, action) {
    switch (action.type) {
        case 'SET_TABLE_VIEW':
            return action.payload;
        default:
            return tableView;
    }
}
