'use strict';
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const TodoRepository = require('./TodoRepository');

class SqliteRepo extends TodoRepository {
  constructor(filePath) {
    super();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.db = new Database(filePath);
    const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    this.db.exec(schema);

    this.qList = this.db.prepare('SELECT id, title, done FROM todos ORDER BY id ASC');
    this.qGet  = this.db.prepare('SELECT id, title, done FROM todos WHERE id = ?');
    this.qIns  = this.db.prepare('INSERT INTO todos (title, done) VALUES (?, ?)');
    this.qUpd  = this.db.prepare('UPDATE todos SET title = ?, done = ? WHERE id = ?');
    this.qDel  = this.db.prepare('DELETE FROM todos WHERE id = ?');
  }

  async list() {
    return this.qList.all().map(r => ({ id: r.id, title: r.title, done: !!r.done }));
  }

  async get(id) {
    const r = this.qGet.get(id);
    return r ? { id: r.id, title: r.title, done: !!r.done } : null;
  }

  async create({ title, done = false }) {
    const info = this.qIns.run(title, done ? 1 : 0);
    return { id: info.lastInsertRowid, title, done: !!done };
  }

  async update(id, { title, done }) {
    const info = this.qUpd.run(title, done ? 1 : 0, id);
    if (info.changes === 0) return null;
    return { id, title, done: !!done };
  }

  async remove(id) {
    const info = this.qDel.run(id);
    return info.changes > 0;
  }
}

module.exports = (filePath) => new SqliteRepo(filePath);
