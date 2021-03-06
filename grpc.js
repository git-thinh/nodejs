const express = require('express');
const bodyParser= require('body-parser');

const uuidV4 = require('uuid/v4');
const caller = require('grpc-caller');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

var path = require('path');
var __dirname = path.dirname(require.main.filename);

const PROTO_PATH = path.resolve(__dirname, './proto/helloworld.proto')
const client = caller('0.0.0.0:50051', PROTO_PATH, 'Greeter')

app.get('/demo', (req, res) => res.send('Hello World!'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/quotes', (req, res) => {
  console.log(req.body);
	res.end('');
});

// Works as standard gRPC client
app.get('/g1', (req, res) => {
	client.sayHello({ name: 'G1-' + uuidV4() }, (err, msg) => {
		console.log(msg);
		res.send(msg);
		res.end('');
	});
});

// For request / response calls, also promisified if callback is not provided "then()".
// Which means means you can use is with async / await
app.get('/g2', (req, res) => {
	client
		.sayHello({ name: 'G2-' + uuidV4() })
		.then(msg => {
			console.log(msg);
			res.send(msg);
			res.end('');
		})
		.catch(err => {
			console.error(err);
		});
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))