const express = require('express');
const bodyParser= require('body-parser');
const caller = require('grpc-caller');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const path = require('path');
const appDir = path.dirname(require.main.filename);
const PROTO_PATH = path.resolve(appDir, './proto/helloworld.proto')
const client = caller('0.0.0.0:50051', PROTO_PATH, 'Greeter')

var uuidV4 = require('uuid/v4');

app.get('/demo', (req, res) => res.send('Hello World!'));

app.get('/', (req, res) => {
	res.sendFile(appDir + '/index.html');
});

app.get('/g1', (req, res) => {
	console.log('G1 ...');
	client.sayHello({ name: 'G1-' + uuidV4() }, (err, msg) => {
		console.log(msg);
		res.send(msg);
		res.end('');
	});
});

app.get('/g2', (req, res) => {
	console.log('G2 ...');
	const msg = await client.sayHello({ name: 'G2-' + uuidV4() })
	console.log(msg);
	res.send(msg);
	res.end('');
});



app.post('/quotes', (req, res) => {
  console.log(req.body)
	res.end('');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));