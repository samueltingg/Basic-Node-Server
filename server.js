const http = require('http');
const fs = require('node:fs');
const path = require('path');

const CONTENT_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript'
  };

function getContentType(ext) {
    return CONTENT_TYPES[ext] || 'application/octet-stream' 
}

function getData(filename, ext) {
	try {
        const binaryExtentions = [".png", ".jpeg", ".jpg", ".gif"];
        const isBinary = binaryExtentions.includes(ext);
		return fs.readFileSync(filename, isBinary ? undefined : 'utf8');
	} catch (error) {
		console.error(`Error reading file ${filename}: ${error.message}`);
		return null;
	}
}

// Create Server
const server = http.createServer(function(request, response) {

    if (request.url === '/') {
        filename = 'index.html';
        contentType = 'text/html';
    } else {
        // Get the file extension and set the appropriate content type
        filename = path.join(__dirname, request.url); // Make sure the path is correct
        var ext = path.extname(filename).toLowerCase();
        contentType = getContentType(ext);
    }
	const data = getData(filename, ext);
	if (data) {
		response.statusCode = 200;
		response.setHeader('Content-Type', contentType);
		response.end(data);
	} else {
		response.statusCode = 404;
		response.setHeader('Content-Type', 'text/plain');
		response.end('404 Not Found');
	}
});

// Start Server
server.listen({ port: 3000, host: 'localhost' }, function() {
  console.log('Server is running!');
});