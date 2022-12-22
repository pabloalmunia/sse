let source;

const tasks = {
  async create (data) {
    const result = await fetch('/tasks', {
      method : 'POST',
      headers: {'Content-Type': 'application/json'},
      body   : JSON.stringify(data)
    });
    if (result.status !== 200) {
      throw new Error(`Error ${result.status}`);
    }
    return true;
  },
  async read () {
    const result = await fetch('/tasks');
    if (result.status === 200) {
      return await result.json()
    } else {
      throw new Error(`Error ${result.status}`);
    }
  },
  async update (id, data) {
    const result = await fetch(`/tasks/${id}`, {
      method : 'PUT',
      headers: {'Content-Type': 'application/json'},
      body   : JSON.stringify(data)
    });
    if (result.status !== 200) {
      throw new Error(`Error ${result.status}`);
    }
  },
  async delete (id) {
    const result = await fetch(`/tasks/${id}`, {
      method: 'DELETE'
    });
    if (result.status !== 200) {
      throw new Error(`Error ${result.status}`);
    }
    return true
  }
};

export default tasks;