import http from 'node:https';
import fs   from 'node:fs';

const server = http.createServer({
  key : fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.cert'),
});

server.on('request',(request, response) => {
  if (request.method === 'GET' && request.url === '/test') {
    response.writeHead(
      200,
      {'Content-Type': 'text/plain'}
    );
    response.write('http server ok');
  } else {
    response.writeHead(404);
  }
  response.end();
});

server.listen(8000);
console.log('https://localhost:8000/test');