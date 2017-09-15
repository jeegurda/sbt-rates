let express = require('express');
let http = require('http');
let bodyParser = require('body-parser');
let request = require('request-promise');
let _ = require('lodash');

let server = express();
let mockRouter = express.Router();

const expressPort = 3000;
const host = 'http://www.sberbank.ru';

const cliUrl = 'http://localhost:3000/';

// subroutes, useful for mocks
mockRouter.get('/static', (req, res) => {
  res.json({
    a: 1,
    b: 2
  });
});
mockRouter.get('/staticBad', (req, res) => {
  res.send('bad response');
});

server.use(bodyParser.json());

server.use('/api', mockRouter, (req, res) => {
  // for hosts that can't handle the OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res
      .set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      })
      .status(200)
      .send();
    return;
  }

  request({
    headers: _.omit(req.headers, ['host', 'referer', 'origin', 'accept-encoding']),
    method: req.method,
    uri: host + req.url,
    body: Object.keys(req.body).length > 0 ? req.body : undefined,
    json: true,
    resolveWithFullResponse: true,
    simple: false
  })
  .then(function(rRes) {
    res
      .set(rRes.headers)
      .status(rRes.statusCode)
      .send(rRes.body);
    console.log(`${req.method} ${host}${req.url}: ${rRes.statusCode} ${rRes.statusMessage}`);
  })
  .catch(function (err) {
    res.status(503).send('Express couldn\'t send the request: ' + err.toString());
    console.log('Failed to send req -', err.toString());
  });
});

server.listen(expressPort, () => {
  console.log(`Express listening at port ${expressPort}`);
});


// quick send GET requests from STDIN

process.stdin.on('readable', () => {
  let input = process.stdin.read();

  if (input) {
    input = input.toString().replace(/[\r\n]/g, '');

    console.log(`GET "${cliUrl}${input}" ...`);

    request({
      method: 'GET',
      uri: cliUrl + input,
      resolveWithFullResponse: true,
      simple: false
    })
    .then(function(rRes) {
      console.log(`${rRes.statusCode} ${rRes.statusMessage}. Response:`);
      console.log(rRes.body);
    })
    .catch(function (err) {
      console.log('Failed to send req -', err.toString());
    });
  }
});
