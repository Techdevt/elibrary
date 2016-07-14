'use strict';
require('babel-core/register');

const http = require('http');
const httpProxy = require('http-proxy');
const config = require('./config').config;
const targetUrl = `http://${config.host}:${config.port}`;
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true,
});
const app = require('./server').default;
const server = new http.Server(app);
const debug = require('debug');

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl });
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, { target: `${targetUrl}/ws` });
});

app.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

app.on('error', (error, req, res) => {
  if (error.code !== 'ECONNRESET') {
    debug.log('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  const json = { error: 'proxy_error', reason: error.message };
  res.end(JSON.stringify(json));
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      debug.log(err);
    }
    debug.log('----\n==> ✅  %s is running, talking to API server on %s.',
      config.app.title, config.port);
    debug.log('==> 💻  Open %s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  debug.log('==>     ERROR: No PORT environment variable has been specified');
}
