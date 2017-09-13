let host = 'http://localhost';
let port = 3000;
// anything to prepend to the URL, must be ending with "/"
let proxy = 'api/';

let restUrlDict = 'portalserver/proxy/?pipe=shortCachePipe&url=http://localhost/sbt-services/services/rest/';
let restUrlRates = 'portalserver/proxy/?pipe=shortCachePipe&url=http://localhost/rates-web/';

let rest = {
  info: `${restUrlRates}rateService/rate/currency`,
  ranges: `${restUrlRates}rateService/rate/ranges`,
  current: `${restUrlRates}rateService/rate/current`,
  rates: `${restUrlRates}rateService/rate`,
  convert: `${restUrlRates}rateService/rate/conversion`,
  xls: `${restUrlRates}rateService/rate/xls`,
  dictionary: `${restUrlDict}dictionary/getWidgetSettings`
};

let getUrl = service => `${host}:${port}/${proxy}${rest[service] || ''}`;

export default function api(service, params) {
  if (typeof params === 'object' && Object.keys(params).length > 0) {
    let paramsWithHash = { ...params, ...{ hash: Date.now() } };
    let paramsString = Object.keys(paramsWithHash).reduce((a, c) => {
      if (paramsWithHash[c] instanceof Array) {
        return a.concat(paramsWithHash[c].map(pk => `${c}=${pk}`));
      }
      return a.concat(`${c}=${paramsWithHash[c]}`);
    }, []).join('&');
    return getUrl(service) + encodeURIComponent(`?${paramsString}`);
  }
  return getUrl(service);
}
