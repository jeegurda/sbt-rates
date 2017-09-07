# sbt-rates
React widget for currency rates used at sberbank.ru


*This repo includes a standalone version, which tries to emulate real environment at sberbank.ru with global variables and what not.*

This signle widget can run in 3 different modes. Live version:

[Currency mode](http://www.sberbank.ru/ru/quotes/currencies)

[Metals mode](http://www.sberbank.ru/ru/quotes/currencies)

[Converter mode](http://www.sberbank.ru/ru/quotes/currencies)

## Running locally

*node.js is required to run a local proxy server!*

1. Clone repo.

2. Install required packages.
```bash
$ npm i
```

3. Run a simple Express server. This is required to proxy local ajax-requests to REST-services at sberbank.ru:80. Make sure port :3000 isn't busy.
```bash
$ node express/server.js
```

4. Run a webpack dev server. Make sure port :8080 isn't busy, requests get proxied to Express only at this port.
```bash
$ npm run dev
```

5. Give webpack some time to compile bundle for the first time.