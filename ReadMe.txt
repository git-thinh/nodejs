Portable Node.js and NPM on Windows

1. Download the node.exe stand-alone from nodejs.org
		https://nodejs.org/download/release/latest/win-x64/
		https://nodejs.org/download/release/latest/
2. Grab an NPM release zip off of github
		https://github.com/npm/npm/releases
3. Create a folder named: node_modules in the same folder as node.exe
4. Extract the NPM zip into the node_modules folder
5. Rename the extracted npm folder to npm and remove any versioning ie: npm-3.3.4 –> npm.
6. Copy npm.cmd out of the /npm/bin/ folder into the root folder with node.exe
7. Open a command prompt in the node.exe directory (shift right-click “Open command window here”)
8. Now you will be able to run your npm installers ie:
		npm install -g express
		npm install express --save

9. How do I start with Node.js after I installed it?

	Once you have installed Node, let's try building our first web server. 
	Create a file named "app.js", and paste the following code:

		const http = require('http');

		const hostname = '127.0.0.1';
		const port = 3000;

		const server = http.createServer((req, res) => {
		  res.statusCode = 200;
		  res.setHeader('Content-Type', 'text/plain');
		  res.end('Hello World\n');
		});

		server.listen(port, hostname, () => {
		  console.log(`Server running at http://${hostname}:${port}/`);
		});

	After that, run your web server using node app.js, 
	visit http://localhost:3000, 
	and you will see a message 'Hello World'
	
/////////////////////////////////////////////////////	

npm.cmd install express
npm.cmd install express --save
npm.cmd install body-parser --save

WUI:
	npm.cmd install express-validator
	npm.cmd install express-ws
	npm.cmd install express-session
	npm.cmd install node-async-locks
	npm.cmd install uuid
	
GRPC:	
	npm.cmd install google-protobuf	

	
	