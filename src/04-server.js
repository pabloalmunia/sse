import http2 from 'node:http2';
import fs    from 'node:fs';

const server = http2.createSecureServer({
  key : fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.cert'),
});

function push (stream, headers, file) {
  if (!stream.pushAllowed) {
    console.log(`this user-agent don't accept push: ${headers['user-agent']}`)
    return;
  }
  stream.pushStream({':path': `/${file}`}, (error, pushStream) => {
    if (error) throw error;
    pushStream.respondWithFile(
      file,
      {
        ':status'      : 200,
        'content-type' : 'text/html',
        'Cache-Control': 'max-age=3600'
      }
    );
  });
}

server.on('stream', (stream, headers) => {
  if (headers[':method'] === 'GET' && headers[':path'] === '/test') {
    stream.respond({
      ':status'     : 200,
      'Content-Type': 'text/html; charset=utf-8'
    });
    push(stream, headers,'04-push.html');
    stream.write(fs.readFileSync('04-index.html'));
  } else {
    stream.respond({':status': 404});
  }
  stream.end();
});

server.listen(8002);
console.log('https://localhost:8002/test');