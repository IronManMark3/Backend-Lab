'use strict';

/**
 * Contract for ToDo Repositories.
 * Implement:
 * - list()               -> [{ id, title, done }]
 * - get(id)              -> { id, title, done } | null
 * - create({title,done}) -> created object
 * - update(id,data)      -> updated object | null
 * - remove(id)           -> true | false
 */
class TodoRepository {
  async list()   { throw new Error('Not implemented'); }
  async get()    { throw new Error('Not implemented'); }
  async create() { throw new Error('Not implemented'); }
  async update() { throw new Error('Not implemented'); }
  async remove() { throw new Error('Not implemented'); }
}

module.exports = TodoRepository;
