document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('task-form');
  const taskTitle = document.getElementById('task-title');
  const taskDesc = document.getElementById('task-desc');
  const taskStatus = document.getElementById('task-status');
  const statusFilter = document.getElementById('status-filter');
  const tasksList = document.getElementById('tasks-list');

  let tasks = [];
  let nextId = 1;

  !localStorage.tasks? tasks=[]:tasks=JSON.parse(localStorage.getItem('tasks'))
  const updateLocalStorage=() => {
    localStorage.setItem('tasks',JSON.stringify(tasks))
  }

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
    updateLocalStorage()
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    updateLocalStorage()
    renderTasks();
  }

  function changeStatus(id, newStatus) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i].status = newStatus;
        break;
      }
    }
    updateLocalStorage()
    renderTasks();
  }

  function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    if (!taskElement) return;

    taskElement.innerHTML = `
      <div class="edit-form">
        <input type="text" id="edit-title-${id}" value="${task.title}" placeholder="Название">
        <textarea id="edit-desc-${id}" placeholder="Описание">${task.description || ''}</textarea>
        <div class="edit-buttons">
          <button class="btn btn-save" onclick="saveTask(${id})">Сохранить</button>
          <button class="btn btn-cancel" onclick="cancelEdit(${id})">Отмена</button>
        </div>
      </div>
    `;
    updateLocalStorage()
  }

  function saveTask(id) {
    const newTitle = document.getElementById(`edit-title-${id}`).value;
    const newDesc = document.getElementById(`edit-desc-${id}`).value;

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i].title = newTitle;
        tasks[i].description = newDesc;
        break;
      }
    }
    updateLocalStorage()
    renderTasks();
  }

  function cancelEdit(id) {
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
      taskElement.setAttribute('data-task-id', task.id);
      
      const statusText = getStatusText(task.status);
      const statusClass = getStatusClass(task.status);
      
      taskElement.innerHTML = `
        <div class="task-title">${task.title}</div>
        ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
        <div class="task-status ${statusClass}">${statusText}</div>
        <div class="task-actions">
          <button class="btn btn-edit" onclick="editTask(${task.id})">Изменить</button>
          <button class="btn" onclick="changeStatus(${task.id}, 'planned')">Запланировать</button>
          <button class="btn" onclick="changeStatus(${task.id}, 'progress')">В работу</button>
          <button class="btn" onclick="changeStatus(${task.id}, 'done')">Завершить</button>
          <button class="btn btn-delete" onclick="deleteTask(${task.id})">Удалить</button>
        </div>
      `;
      
      updateLocalStorage()
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
    updateLocalStorage()
    

  });

  window.deleteTask = deleteTask;
  window.changeStatus = changeStatus;
  window.filterTasks = filterTasks;
  window.editTask = editTask;
  window.saveTask = saveTask;
  window.cancelEdit = cancelEdit;
  updateLocalStorage();
  renderTasks();
});