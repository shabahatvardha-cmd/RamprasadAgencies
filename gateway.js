const http = require('http');

const FRONTEND_PORT = 5173;
const ADMIN_PORT = 3000;
const GATEWAY_PORT = 80;

const server = http.createServer((req, res) => {
  const host = (req.headers.host || '').toLowerCase();
  const targetPort = host.startsWith('admin.') ? ADMIN_PORT : FRONTEND_PORT;

  const options = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      'x-forwarded-host': req.headers.host,
      'x-forwarded-proto': 'http',
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/html' });
    res.end(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; color: #1a1a1a;">
        <h2>Connecting to Service...</h2>
        <p>The target server on port ${targetPort} is starting up. Please refresh in a moment.</p>
      </div>
    `);
  });

  req.pipe(proxyReq);
});

// Proxy WebSocket upgrade requests (for Vite HMR)
server.on('upgrade', (req, clientSocket, head) => {
  const host = (req.headers.host || '').toLowerCase();
  const targetPort = host.startsWith('admin.') ? ADMIN_PORT : FRONTEND_PORT;

  const net = require('net');
  const serverSocket = net.connect(targetPort, '127.0.0.1', () => {
    serverSocket.write(head);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
  });

  serverSocket.on('error', () => {
    clientSocket.destroy();
  });
  clientSocket.on('error', () => {
    serverSocket.destroy();
  });
});

server.listen(GATEWAY_PORT, () => {
  console.log(`Domain Gateway running on port ${GATEWAY_PORT}`);
  console.log(`Frontend URL: http://watchstore.in/ or http://watchstore.lvh.me/`);
  console.log(`Admin URL:    http://admin.watchstore.in/ or http://admin.watchstore.lvh.me/`);
}).on('error', (err) => {
  if (err.code === 'EACCES') {
    console.warn(`Port ${GATEWAY_PORT} requires administrator privileges. You can access directly via:`);
    console.log(`Frontend: http://watchstore.in:5173`);
    console.log(`Admin:    http://admin.watchstore.in:3000`);
  } else {
    console.error('Gateway Error:', err.message);
  }
});
