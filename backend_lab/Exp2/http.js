const http = require('http');
const { URL } = require('url');

let items = [];       // in-memory store: [{ id: 1, title: "Buy milk", done: false }]
let nextId = 1;

function send(res, status, data = null) {
  const body = data ? JSON.stringify(data) : '';
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => (raw += chunk));
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch (e) { reject(new Error('INVALID_JSON')); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  // Routes
  if (method === 'GET' && path === '/items') {
    return send(res, 200, items);
  }

  if (method === 'POST' && path === '/items') {
    try {
      const body = await parseBody(req);
      if (!body.title || typeof body.title !== 'string') {
        return send(res, 400, { error: 'title (string) is required' });
      }
      const item = { id: nextId++, title: body.title, done: !!body.done };
      items.push(item);
      return send(res, 201, item);
    } catch {
      return send(res, 400, { error: 'Invalid JSON' });
    }
  }

  // Match /items/:id
  const itemIdMatch = path.match(/^\/items\/(\d+)$/);
  if (itemIdMatch) {
    const id = Number(itemIdMatch[1]);
    const idx = items.findIndex(i => i.id === id);

    if (method === 'GET') {
      if (idx === -1) return send(res, 404, { error: 'Not found' });
      return send(res, 200, items[idx]);
    }

    if (method === 'PUT') {
      try {
        const body = await parseBody(req);
        if (!body.title || typeof body.title !== 'string' || typeof body.done !== 'boolean') {
          return send(res, 400, { error: 'title (string) and done (boolean) are required' });
        }
        if (idx === -1) return send(res, 404, { error: 'Not found' });
        items[idx] = { id, title: body.title, done: body.done };
        return send(res, 200, items[idx]);
      } catch {
        return send(res, 400, { error: 'Invalid JSON' });
      }
    }

    if (method === 'DELETE') {
      if (idx === -1) return send(res, 404, { error: 'Not found' });
      items.splice(idx, 1);
      res.writeHead(204);
      return res.end();
    }
  }

  // Fallback
  send(res, 404, { error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`HTTP server listening on http://localhost:${PORT}`));
