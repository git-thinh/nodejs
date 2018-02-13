const express = require('express');
const bodyParser= require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

var path = require('path');
var appDir = path.dirname(require.main.filename);

app.get('/demo', (req, res) => res.send('Hello World!'));

app.get('/', (req, res) => {
	res.sendFile(appDir + '/index.html');
});

app.post('/quotes', (req, res) => {
  console.log(req.body)
	res.end('');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));