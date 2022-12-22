import tasks  from './tasks.js';
import dialog from './dialog.js';

// Obtain references
const newTask   = document.querySelector('#new-task');
const send      = document.querySelector('#send');
const messages  = document.querySelector('#messages');
const tasksList = document.querySelector('#tasks');
const template  = document.querySelector('#task');

// Create new task
newTask.addEventListener('keypress', (evt) => {
  if (evt.keyCode === 13) {
    sendTask();
  }
});
send.addEventListener('click', sendTask);

async function sendTask () {
  messages.innerHTML = '&nbsp';
  try {
    await tasks.create({name: newTask.value, done: false});
    newTask.value = '';
  } catch (err) {
    messages.innerHTML = err.message;
  }
}

// Edit task
async function updateTask (id, data) {
  messages.innerHTML = '&nbsp';
  try {
    await tasks.update(id, data);
  } catch (err) {
    messages.innerHTML = err.message;
  }
}

// Initial load tasks
(async function getTasks () {
  try {
    const data = (await tasks.read());
    data.forEach(addTask);
  } catch (err) {
    messages.innerHTML = err.message;
  }
})();

function addTask (task) {
  const taskTemplate = template.content.cloneNode(true);
  const div          = taskTemplate.querySelector('.row');
  const done         = taskTemplate.querySelector('.done');
  const name         = taskTemplate.querySelector('.name');
  const del          = taskTemplate.querySelector('.delete');
  div.id             = `task_${task.id}`;
  done.checked       = task.done;
  name.value         = task.name;
  done.addEventListener('change', (e) => updateTask(task.id, {done: e.target.checked}));
  name.addEventListener('change', (e) => updateTask(task.id, {name: e.target.value}));
  del.addEventListener('click', () => deleteTaskDialog(task.id, task.name));
  tasksList.appendChild(taskTemplate);
}

// Delete task
async function deleteTaskDialog (id, name) {
  if (await dialog(`Do you want to delete the task <br/>"${name}"?`, ['not', 'yes'])) {
    messages.innerHTML = '&nbsp';
    try {
      await tasks.delete(id)
    } catch (err) {
      messages.innerHTML = err.message;
    }
  }
}

function removeTask (id) {
  const div = tasksList.querySelector(`#task_${id}`);
  if (div) {
    div.parentNode.removeChild(div);
  }
}

// Subscribe to changes

tasks.subscribe('create', function (data) {
  addTask(data);
});

tasks.subscribe('update', function (task) {
  const div                          = tasksList.querySelector(`#task_${task.id}`);
  div.querySelector('.done').checked = task.done;
  div.querySelector('.name').value   = task.name;
});

tasks.subscribe('delete', function (id) {
  removeTask(id);
});