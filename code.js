document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('task-form');
  const taskTitle = document.getElementById('task-title');
  const taskDesc = document.getElementById('task-desc');
  const taskStatus = document.getElementById('task-status');
  const statusFilter = document.getElementById('status-filter');
  const tasksList = document.getElementById('tasks-list');

  let tasks = [];
  let nextId = 1;

  function makeId() {
    return nextId++;
  }

  function addTask(title, description, status) {
    const task = {
      id: makeId(),
      title: title,
      description: description,
      status: status
    };
    
    tasks.push(task);
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }

  function changeStatus(id, newStatus) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i].status = newStatus;
        break;
      }
    }
    renderTasks();
  }

  function filterTasks() {
    const filterValue = statusFilter.value;
    renderTasks(filterValue);
  }

  function renderTasks(filterStatus = 'all') {
    tasksList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (filterStatus !== 'all') {
      filteredTasks = [];
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === filterStatus) {
          filteredTasks.push(tasks[i]);
        }
      }
    }
    
    if (filteredTasks.length === 0) {
      tasksList.innerHTML = '<p>Задач нет</p>';
      return;
    }
    
    for (let i = 0; i < filteredTasks.length; i++) {
      const task = filteredTasks[i];
      const taskElement = document.createElement('div');
      taskElement.className = 'task-item';
      
      const statusText = getStatusText(task.status);
      const statusClass = getStatusClass(task.status);
      
      taskElement.innerHTML = `
        <div class="task-title">${task.title}</div>
        ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
        <div class="task-status ${statusClass}">${statusText}</div>
        <div class="task-actions">
          <button class="btn" onclick="changeStatus(${task.id}, 'planned')">Запланировать</button>
          <button class="btn" onclick="changeStatus(${task.id}, 'progress')">В работу</button>
          <button class="btn" onclick="changeStatus(${task.id}, 'done')">Завершить</button>
          <button class="btn btn-delete" onclick="deleteTask(${task.id})">Удалить</button>
        </div>
      `;
      
      tasksList.appendChild(taskElement);
    }
  }

  function getStatusText(status) {
    if (status === 'planned') return 'Запланированная';
    if (status === 'progress') return 'В работе';
    if (status === 'done') return 'Готовая';
    return 'Неизвестно';
  }

  function getStatusClass(status) {
    if (status === 'planned') return 'status-planned';
    if (status === 'progress') return 'status-progress';
    if (status === 'done') return 'status-done';
    return 'status-planned';
  }

  taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = taskTitle.value;
    const description = taskDesc.value;
    const status = taskStatus.value;
    
    if (title) {
      addTask(title, description, status);
      
      taskTitle.value = '';
      taskDesc.value = '';
    }
  });

  window.deleteTask = deleteTask;
  window.changeStatus = changeStatus;
  window.filterTasks = filterTasks;
});