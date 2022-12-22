import http2 from 'node:http2';
import fs    from 'node:fs';

const sessions = new Set();
const server  = http2.createSecureServer({
  key : fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.cert'),
});

server.on('stream', (stream, headers) => {
  sessions.add(stream);
  stream.on('close', () => {
    sessions.delete(stream);
  });
  if (headers['accept'] === 'text/event-stream' && headers[':path'] === '/time') {
    let id = 0;
    stream.respond({
      'Content-Type' : 'text/event-stream',
      'Cache-Control': 'no-cache',
      ':status'      : 200
    });
    stream.write('retry: 5000\n\n');
    setInterval(() => {
      stream.write('id: ' + id++ + '\n' +
                   'data: ' + 'new server event ' + (new Date()).toLocaleTimeString() + '\n\n');
    }, 1000);
  } else {
    stream.respondWithFile('09-index.html', {
      'Content-Type': 'text/html; charset=utf-8',
      ':status'     : 200,
    });
  }
});

server.listen(8006);
console.log('run on https://localhost:8006/');
setInterval(() => {
  console.log('close all sessions');
  [...sessions].forEach(stream => {
    stream.close(http2.constants.NGHTTP2_NO_ERROR)
  });
}, 5000);
