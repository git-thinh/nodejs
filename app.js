var express    = require('express');
var app = express();
var serveIndex = require('serve-index');

var path = require('path');
var __dirname = path.dirname(require.main.filename);
var serveStatic = require('serve-static');
var port = process.env.PORT || 80;

/**for files */
app.use(serveStatic(path.join(__dirname, 'www')));
/**for directory */
app.use('/', express.static('www'), serveIndex('www', {'icons': true}))

// Listen
app.listen(port,  function () {
  console.log('listening on port:',+ port );
})