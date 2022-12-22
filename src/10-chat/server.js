const express      = require('express');
const bodyParser   = require('body-parser');
const http2Express = require('http2-express-bridge');
const http2        = require('http2');
const fs           = require('fs');

const options = {
  key : fs.readFileSync('../localhost.key'),
  cert: fs.readFileSync('../localhost.cert'),
};
const app     = http2Express(express);

app.use(bodyParser.text());

const connections = [];
const messages    = [];
let id            = 0;

app.use('/', express.static('public'));

app.get('/chat', async (req, res) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type' : 'text/event-stream'
  });
  res.flushHeaders();
  res.write('retry: 10000\n\n');
  connections.push(res);
  messages.forEach(message => {
    res.write(`id: ${message.id}\n`);
    res.write(`data: ${message.text}\n\n`);
  });
});

app.post('/chat/message', async (req, res) => {
  const message = {id: id++, text: req.body};
  messages.push(message);
  connections.forEach(connection => {
    connection.write(`id: ${message.id}\n`);
    connection.write(`data: ${message.text}\n\n`);
  });
  res.end();
});

http2.createSecureServer(options, app).listen(9000);
console.log('https://localhost:9000/');