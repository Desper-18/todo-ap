const form = document.querySelector('#taskForm');
const taskList = document.querySelector('#taskList');
const noTasksMessage = document.querySelector('#noTasksMessage');

const tasks = [];
const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
    const tasksFromLS = JSON.parse(savedTasks);
    tasks.push(...tasksFromLS);
    tasksFromLS.forEach((task) => {
        renderTask(task);
    });
}

form.addEventListener('submit', addTask);
function addTask(evt) {
    evt.preventDefault();
    const taskInput = document.querySelector('#taskInput');
    if (taskInput.value.trim() === '') {
        taskInput.value = '';
        taskInput.focus();
        return;
    }

    const task = {
        id: crypto.randomUUID(),
        text: taskInput.value,
        done: false,
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTask(task);
    taskInput.value = '';
    taskInput.focus();
}
taskList.addEventListener('click', toggleComplete);
taskList.addEventListener('click', deleteTask);
function renderTask(task) {
    const taskHTML = `
      <li id="${task.id}" data-task-status="${
        task.done
    }" class="border p-2 mb-2 flex justify-between items-center ${task.done ? 'bg-slate-300' : ''}">
        <span class="${task.done ? 'line-through' : ''}">${task.text}</span>
        <div>
          <button data-action="complete" class="bg-green-500 text-white p-1 mr-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
          <button data-action="delete" class="bg-red-500 text-white p-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </li>

    `;
    taskList.insertAdjacentHTML('beforeend', taskHTML);
    if (taskList.children.length >= 1) {
        noTasksMessage.classList.add('hidden');
    }
}

function toggleComplete(evt) {
    if (evt.target.dataset.action !== 'complete') {
        return;
    }
    const completeButton = evt.target;
    const task = completeButton.closest('li');
    task.classList.toggle('bg-slate-300');
    const taskText = task.querySelector('span');
    taskText.classList.toggle('line-through');
    console.log(task.dataset);
    const taskStatus = task.dataset.taskStatus === 'false' ? false : true;
    task.dataset.taskStatus = !taskStatus;

    const taskId = task.dataset.taskId;
    const foundTask = tasks.find((task) => task.id === taskId);
    foundTask.done = !taskStatus;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(evt) {
    if (evt.target.dataset.action !== 'delete') {
        return;
    }
    const deleteButton = evt.target;
    const task = deleteButton.closest('li');
    task.remove();
    if (taskList.children.length === 0) {
        noTasksMessage.classList.remove('hidden');
    }

    const taskId = task.dataset.taskId;
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
