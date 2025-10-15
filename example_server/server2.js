// server2.js - Static file server using http module
const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

// Function to get MIME type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  // Decode URL-encoded characters
  const decodedUrl = decodeURIComponent(req.url);
  
  // Determine file path
  let filePath;
  if (decodedUrl === '/') {
    filePath = path.join(__dirname, 'index.html');
  } else {
    filePath = path.join(__dirname, decodedUrl);
  }

  // Security check: prevent directory traversal
  if (decodedUrl.includes('..') || filePath.includes('..')) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('403 Forbidden - Directory traversal not allowed');
    return;
  }

  // Check if file exists and serve it
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
      } else {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('500 Internal Server Error');
      }
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', getMimeType(filePath));
      res.setHeader('Content-Length', data.length);
      res.setHeader('Date', new Date().toUTCString());
      res.setHeader('Server', 'Node.js Static Server v2');
      res.end(data);
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log('Serving static files from:', __dirname);
  console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
