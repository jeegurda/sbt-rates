# sbt-rates
React widget for currency rates used at sberbank.ru


*This repo includes a standalone version, which tries to emulate real environment at sberbank.ru with global variables and what not.*

This single widget can run in 3 different modes. Live version:

[Currency mode](http://www.sberbank.ru/ru/quotes/currencies)

[Metals mode](http://www.sberbank.ru/ru/quotes/metal)

[Converter mode](http://www.sberbank.ru/ru/quotes/converter)

## Running locally

*node.js is required to run a local proxy server!*

1. Clone repo.

2. Install required packages.
```bash
$ npm i
```

3. Run a simple Express server. This is required to proxy local ajax-requests to REST-services at sberbank.ru:80. The default port is 3000, make sure it's not busy.
```bash
$ node express/server.js
```

4. Run a webpack dev server. The page would open before the bundle has finished building! Give webpack some time to finish bundling.
```bash
$ npm run dev-open
```
----

You can also build the project to `dist/rates/` directory to serve it from your server. This is required for ajax-requests to work.
```bash
$ npm run build
$ mv dist/rates/ /var/www/some/apache/directory/
```
