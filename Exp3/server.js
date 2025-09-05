'use strict';
require('dotenv').config();

const http = require('http');
const { URL } = require('url');

// ── Choose backend via env ─────────────────────────────────────────────────────
const backend = (process.env.DB_BACKEND || 'memory').toLowerCase();

let repo;
if (backend === 'mongo') {
  const make = require('./repositories/mongoRepo');
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGO_DB || 'todo_lab';
  repo = make(uri, dbName);
} else if (backend === 'sqlite') {
  const make = require('./repositories/sqliteRepo');
  const file = process.env.SQLITE_FILE || './data/todo.db';
  repo = make(file);
} else {
  const make = require('./repositories/memoryRepo');
  repo = make();
}

// ── helpers ───────────────────────────────────────────────────────────────────
function send(res, status, data = null) {
  const body = data ? JSON.stringify(data) : '';
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => (raw += c));
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { reject(new Error('INVALID_JSON')); }
    });
  });
}

// ── routes ────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  // Health
  if (method === 'GET' && path === '/health') {
    return send(res, 200, { ok: true, backend });
  }

  // List
  if (method === 'GET' && path === '/items') {
    const items = await repo.list();
    return send(res, 200, items);
  }

  // Create
  if (method === 'POST' && path === '/items') {
    try {
      const body = await parseBody(req);
      if (!body.title || typeof body.title !== 'string') {
        return send(res, 400, { error: 'title (string) is required' });
      }
      const created = await repo.create({ title: body.title, done: !!body.done });
      return send(res, 201, created);
    } catch {
      return send(res, 400, { error: 'Invalid JSON' });
    }
  }

  // Match /items/:id
  const m = path.match(/^\/items\/([^/]+)$/);
  if (m) {
    const rawId = m[1];
    const id = backend === 'mongo' ? rawId : Number(rawId);
    if (backend !== 'mongo' && Number.isNaN(id)) return send(res, 400, { error: 'Invalid id' });

    // Get one
    if (method === 'GET') {
      const found = await repo.get(id);
      return found ? send(res, 200, found) : send(res, 404, { error: 'Not found' });
    }

    // Update
    if (method === 'PUT') {
      try {
        const body = await parseBody(req);
        if (!body.title || typeof body.title !== 'string' || typeof body.done !== 'boolean') {
          return send(res, 400, { error: 'title (string) and done (boolean) are required' });
        }
        const updated = await repo.update(id, { title: body.title, done: body.done });
        return updated ? send(res, 200, updated) : send(res, 404, { error: 'Not found' });
      } catch {
        return send(res, 400, { error: 'Invalid JSON' });
      }
    }

    // Delete
    if (method === 'DELETE') {
      const ok = await repo.remove(id);
      if (!ok) return send(res, 404, { error: 'Not found' });
      res.writeHead(204);
      return res.end();
    }
  }

  // Fallback
  send(res, 404, { error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`HTTP server on http://localhost:${PORT} (backend=${backend})`));
