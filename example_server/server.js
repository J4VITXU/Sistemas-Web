const net = require('net');
const fs = require('fs');
const path = require('path');

// Create a TCP server using 'net'
const server = net.createServer(socket => {
  console.log('Cliente conectado:', socket.remoteAddress);

  // When data arrives from the client (HTTP request)
  socket.on('data', data => {
    const requestText = data.toString();
    // Split the request into lines to analyze it
    const [requestLine, ...headerLines] = requestText.split('\r\n');
    const [method, url, httpVersion] = requestLine.split(' ');
    console.log(`Petición recibida: ${method} ${url}`);

    if (method === 'GET' || method === 'HEAD') {
      // Decode URL-encoded characters
      const decodedUrl = decodeURIComponent(url);
      // Determine physical path of the requested file
      let filePath = decodedUrl === '/' ? './index.html' : '.' + decodedUrl;
      
      // Security check: prevent directory traversal
      if (decodedUrl.includes('..') || filePath.includes('..')) {
        const header = 'HTTP/1.1 403 Forbidden\r\nContent-Type: text/plain\r\n\r\n';
        socket.write(header + '403 Forbidden - Directory traversal not allowed');
        socket.end();
        return;
      }

      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          // If file doesn't exist or error reading, return 404
          const header = 'HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\n';
          socket.write(header + '404 Not Found');
        } else {
          // Determine basic MIME type according to extension
          let mimeType = 'text/html';
          if (filePath.endsWith('.css')) mimeType = 'text/css';
          else if (filePath.endsWith('.js')) mimeType = 'text/javascript';
          else if (filePath.endsWith('.png')) mimeType = 'image/png';
          else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) mimeType = 'image/jpeg';
          else if (filePath.endsWith('.gif')) mimeType = 'image/gif';
          else if (filePath.endsWith('.svg')) mimeType = 'image/svg+xml';
          else if (filePath.endsWith('.ico')) mimeType = 'image/x-icon';
          
          // Write HTTP response headers
          socket.write(`HTTP/1.1 200 OK\r\nContent-Type: ${mimeType}\r\n`);
          socket.write(`Content-Length: ${fileData.length}\r\n`);
          socket.write(`Date: ${new Date().toUTCString()}\r\n`);
          socket.write(`Server: Node.js Static Server\r\n\r\n`);
          // Write the response body (file content) only for GET requests
          if (method === 'GET') {
            socket.write(fileData);
          }
        }
        // Close the connection once the response is sent
        socket.end();
      });
    } else {
      // If not GET, respond with 501 Not Implemented
      socket.write('HTTP/1.1 501 Not Implemented\r\nContent-Type: text/plain\r\n\r\n');
      socket.end();
    }
  });

  // Handle connection close
  socket.on('end', () => {
    console.log('Cliente desconectado');
  });

  // Handle errors
  socket.on('error', (err) => {
    console.log('Error en la conexión:', err.message);
  });
});

// Start the server on port 8080
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
  console.log('Presiona Ctrl+C para detener el servidor');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Error: Puerto ${PORT} ya está en uso. Prueba con otro puerto.`);
  } else {
    console.log('Error del servidor:', err.message);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
});
