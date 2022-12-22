import http2 from 'node:http2';
import fs    from 'node:fs';

const server = http2.createSecureServer({
  key : fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.cert'),
});

server.on('stream', (stream, headers) => {
  if (headers[':method'] === 'GET' && headers[':path'] === '/test') {
    stream.respond({
      ':status'     : 200,
      'Content-Type': 'text/plain'
    });
    stream.write(`http2 server ok`);
  } else {
    stream.respond({':status': 404});
  }
  stream.end();
});

server.listen(8001);
console.log('https://localhost:8001/test');