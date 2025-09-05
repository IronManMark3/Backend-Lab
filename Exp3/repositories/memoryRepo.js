'use strict';
const TodoRepository = require('./TodoRepository');

class MemoryRepo extends TodoRepository {
  constructor() {
    super();
    this.items = [];
    this.nextId = 1;
  }

  async list() { return this.items; }

  async get(id) {
    return this.items.find(i => i.id === id) || null;
  }

  async create({ title, done = false }) {
    const item = { id: this.nextId++, title, done: !!done };
    this.items.push(item);
    return item;
  }

  async update(id, { title, done }) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.items[idx] = { id, title, done: !!done };
    return this.items[idx];
  }

  async remove(id) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    return true;
  }
}

module.exports = () => new MemoryRepo();
