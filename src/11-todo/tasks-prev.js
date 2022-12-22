import db from './db.js';

const tasks = {
  async create (data) {
    const result = await db.insert('tasks', data);
    return result;
  },
  read (filter) {
    return db.select('tasks', filter);
  },
  async update (filter, data) {
    const result = await db.update('tasks', filter, data);
    return result;
  },
  async delete (id) {
    const result = await db.delete('tasks', id);
    return result;
  }
}

export default tasks;