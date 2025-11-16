document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('task-form');
  const taskTitle = document.getElementById('task-title');
  const taskDesc = document.getElementById('task-desc');
  const taskStatus = document.getElementById('task-status');
  const tasksList = document.getElementById('tasks-list');

  let tasks = [];
  let nextId = 1;

  function generateId() {
    return nextId++;
  }

  function addTask(title, description, status) {
    const task = {
      id: generateId(),
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
    const task = tasks.find(task => task.id === id);
    if (task) {
      task.status = newStatus;
      renderTasks();
    }
  }

  function renderTasks() {
    tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
      tasksList.innerHTML = '<p>Задач пока нет</p>';
      return;
    }
    
    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = 'task-item';
      
      const statusText = getStatusText(task.status);
      const statusClass = getStatusClass(task.status);
      
      taskElement.innerHTML = `
        <div class="task-title">${task.title}</div>
        ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
        <div>
          <span class="task-status ${statusClass}">${statusText}</span>
        </div>
        <div class="task-actions">
          <button class="btn" onclick="changeStatus(${task.id}, 'planned')">Запланирована</button>
          <button class="btn" onclick="changeStatus(${task.id}, 'progress')">В работе</button>
          <button class="btn" onclick="changeStatus(${task.id}, 'done')">Сделано</button>
          <button class="btn btn-delete" onclick="deleteTask(${task.id})">Удалить</button>
        </div>
      `;
      
      tasksList.appendChild(taskElement);
    });
  }

  function getStatusText(status) {
    if (status === 'planned') return 'Запланирована';
    if (status === 'progress') return 'В работе';
    if (status === 'done') return 'Сделано';
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
});