import db from './db.js';

const subscribers = [];

const tasks = {
  async create (data) {
    const result = await db.insert('tasks', data);
    data.id      = result;
    subscribers.forEach(cb => cb('create', data))
    return result;
  },
  read (filter) {
    return db.select('tasks', filter);
  },
  async update (filter, data) {
    const result = await db.update('tasks', filter, data);
    const rows   = await db.select('tasks', filter);
    subscribers.forEach(cb => cb('update', rows[0]));
    return result;
  },
  async delete (id) {
    const result = await db.delete('tasks', id);
    subscribers.forEach(cb => cb('delete', id));
    return result;
  },
  subscribe (cb) {
    return subscribers.push(cb) - 1;
  },
  unsubscribe (id) {
    delete subscribers[id];
  }
}

export default tasks;