const http2 = require('http2');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 8443;

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
});
server.on('error', (err) => console.error(err));
server.on('socketError', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end('<h1>Hello World</h1>');
});

//server.listen(8443);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});