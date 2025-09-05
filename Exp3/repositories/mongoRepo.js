'use strict';
const mongoose = require('mongoose');
const TodoRepository = require('./TodoRepository');

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    done:  { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);

class MongoRepo extends TodoRepository {
  constructor(uri, dbName = 'todo_lab') {
    super();
    this._ready = mongoose.connect(uri, { dbName });
  }

  async list() {
    await this._ready;
    const docs = await Todo.find().sort({ _id: 1 }).lean();
    return docs.map(d => ({ id: String(d._id), title: d.title, done: d.done }));
  }

  async get(id) {
    await this._ready;
    const d = await Todo.findById(id).lean();
    return d ? { id: String(d._id), title: d.title, done: d.done } : null;
  }

  async create({ title, done = false }) {
    await this._ready;
    const d = await Todo.create({ title, done });
    return { id: String(d._id), title: d.title, done: d.done };
  }

  async update(id, { title, done }) {
    await this._ready;
    const d = await Todo.findByIdAndUpdate(
      id,
      { title, done },
      { new: true, runValidators: true }
    ).lean();
    return d ? { id: String(d._id), title: d.title, done: d.done } : null;
  }

  async remove(id) {
    await this._ready;
    const r = await Todo.findByIdAndDelete(id);
    return !!r;
  }
}

module.exports = (uri, dbName) => new MongoRepo(uri, dbName);
