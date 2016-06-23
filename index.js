'use strict';
require("babel-core/register");

var http = require('http');
var httpProxy = require('http-proxy');
var config = require('./config').config;
var targetUrl = 'http://' + config.host + ':' + config.port;
var proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});
var app = require('./server').default;
var server = new http.Server(app);

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});

app.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

app.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.port);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });

} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}