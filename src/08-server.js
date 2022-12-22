import http from 'node:http2';
import fs   from 'node:fs';

const loremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

Commodo odio aenean sed adipiscing diam donec. Vulputate mi sit amet mauris. Curabitur gravida arcu ac tortor. 

Enim tortor at auctor urna nunc id cursus metus aliquam. Sit amet risus nullam eget felis eget nunc. 
`;

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
      stream.write('id: ' + id++ + '\n');
      stream.write('event: my-event\n');
      stream.write('data: ' + JSON.stringify({text: loremIpsum}) + '\n');
      stream.write('\n');
    }, 5000);
  } else {
    stream.respondWithFile('08-index.html', {
      'Content-Type': 'text/html; charset=utf-8',
      ':status'     : 200,
    });
  }
});

server.listen(8005);
console.log('https://localhost:8005/');