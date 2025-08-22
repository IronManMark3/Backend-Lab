const http = require('http');
const fs = require('fs');
const path = require('path');

const FILE = path.resolve('readme.txt');
const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log('➡️', req.method, req.url);
  if (req.url === '/' || req.url === '/file') {
    const rs = fs.createReadStream(FILE, 'utf8');
    rs.on('open', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      rs.pipe(res);
    });
    rs.on('error', (err) => {
      console.log('❌', err.code || err.message);
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? 'Not Found' : 'Server Error');
    });
  } else {
    res.writeHead(404); 
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C or type "q" then Enter to quit.');
});

function shutdown(signal = 'manual') {
  console.log(`\n🔻 Shutting down (${signal})...`);
  server.close(() => {
    console.log('✅ Server closed. Bye!');
    process.exit(0);
  });
  setTimeout(() => {
    console.log('⏱️ Force exit.');
    process.exit(0);
  }, 3000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // kill/stop

process.stdin.setEncoding('utf8');
process.stdin.resume();
process.stdin.on('data', (d) => {
  if (d.trim().toLowerCase() === 'q') shutdown('q');
});

/*
Explanation:
- Starts an HTTP server on port 3000 and serves readme.txt at "/" or "/file".
- Supports Ctrl+C or "q" + Enter to quit gracefully.
*/
