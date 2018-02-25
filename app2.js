const express = require('express');
const app = express();
const bcd = require('mdn-browser-compat-data');

app.get('/demo', (req, res) => res.send('Hello World!'));

app.get('/', (req, res) => {
	res.json(bcd.css.properties);
	//res.json(bcd.css.properties.background);
});

app.listen(99, () => console.log('Example app listening on port 99!'));