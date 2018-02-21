var express = require('express');
var app = express();

var path = require('path');
var __dirname = path.dirname(require.main.filename);

console.log(__dirname);

//app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, 'www')));  

app.listen(80);
console.log('Listening on port 80');