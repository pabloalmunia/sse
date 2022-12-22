import http from 'node:http2';
import fs   from 'node:fs';

const server = http.createSecureServer({
  key : fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.cert'),
});

server.on('stream', (stream, headers) => {
  if (headers['accept'] === 'text/event-stream' && headers[':path'] === '/time') {
    let id = 0;
    stream.respond({
      'Content-Type' : 'text/event-stream',
      'Cache-Control': 'no-cache',
      ':status'      : 200
    });
    setInterval(() => {
      stream.write('id: ' + id++ + '\n' +
                   'data: ' + 'new server event ' + (new Date()).toLocaleTimeString() + '\n\n');
    }, 1000);
  } else {
    stream.respondWithFile('06-index.html', {
      'Content-Type': 'text/html; charset=utf-8',
      ':status'     : 200,
    });
  }
});

server.listen(8004);
console.log('https://localhost:8004/');