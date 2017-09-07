
let proxy;

if (process.env.NODE_ENV === 'development') {
    proxy = 'api/';
} else {
    proxy = '';
}

let restUrlDict = 'portalserver/proxy/?pipe=shortCachePipe&url=http://localhost/sbt-services/services/rest/';
let restUrlRates = 'portalserver/proxy/?pipe=shortCachePipe&url=http://localhost/rates-web/';

let rest = {
    info: restUrlRates + 'rateService/rate/currency',
    ranges: restUrlRates + 'rateService/rate/ranges',
    current: restUrlRates + 'rateService/rate/current',
    rates: restUrlRates + 'rateService/rate',
    convert: restUrlRates + 'rateService/rate/conversion',
    xls: restUrlRates + 'rateService/rate/xls',
    dictionary: restUrlDict + 'dictionary/getWidgetSettings'
};

let getUrl = service => `/${proxy}${rest[service] || ''}`;

export default function api(service, params) {
    if (typeof params === 'object' && Object.keys(params).length > 0) {
        return getUrl(service) + encodeURIComponent(
            '?' +
            Object.keys(params).reduce((a, c) => {
                if (params[c] instanceof Array) {
                    return a.concat( params[c].map(pk => `${c}=${pk}`) );
                } else {
                    return a.concat(`${c}=${params[c]}`)
                }
            }, [])
                .join('&')
        );
    } else {
        return getUrl(service);
    }
};