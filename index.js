const Koa = require('koa');
const body = require('koa-json-body');
const fetch = require('node-fetch');
const BN = require('bn.js');
const config = require('./config');

for (const proxy of config) {
  console.log(`starting proxy to ${proxy.rpcUrl} on port ${proxy.port}`);

  const app = new Koa();

  app.use(body({
    limit: '10kb',
    fallback: true
  }));

  app.use(async ctx => {
    if (ctx.request.body) {
      console.log('request', ctx.request.body);

      const response = await fetch(proxy.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ctx.request.body)
      }).then(res => res.json());

      console.log('response', response);

      if (ctx.request.body.method === 'eth_getBlockByNumber' || ctx.request.body.method === 'eth_getBlockByHash') {
        if (response && response.result && response.result.timestamp) {
          const timestamp = new BN(response.result.timestamp.substring(2), 16);
          // must be a timestamp in nanos if this is the case ...
          if (timestamp.bitLength() > 53) {
            // ... so convert it to seconds.
            response.result.timestamp =
              '0x' + timestamp.div(new BN(1000000000)).toString(16);
          }
        }
      }

      ctx.body = response;
    }
  });

  app.listen(proxy.port);
}
