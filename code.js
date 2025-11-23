document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('task-form');
  const tasksList = document.getElementById('tasks-list');
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  let currentFilter = 'all';

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function addTask(title, description, status) {
    const task = {
      id: nextId++,
      title: title,
      description: description,
      status: status
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }

  function changeStatus(id, newStatus) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.status = newStatus;
      saveTasks();
      renderTasks();
    }
  }

  function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    
    if (!task || !taskElement) return;

    taskElement.innerHTML = `
      <div class="edit-form">
        <input type="text" id="edit-title-${id}" value="${task.title}">
        <textarea id="edit-desc-${id}">${task.description || ''}</textarea>
        <div class="edit-buttons">
          <button class="btn btn-save" onclick="saveTask(${id})">Сохранить</button>
          <button class="btn btn-cancel" onclick="renderTasks()">Отмена</button>
        </div>
      </div>
    `;
  }

  function saveTask(id) {
    const title = document.getElementById(`edit-title-${id}`).value;
    const desc = document.getElementById(`edit-desc-${id}`).value;
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.title = title;
      task.description = desc;
      saveTasks();
      renderTasks();
    }
  }

  function filterTasks() {
    currentFilter = document.getElementById('status-filter').value;
    renderTasks();
  }

  function setupDragAndDrop() {
    const taskItems = document.querySelectorAll('.task-item');
    let draggedItem = null;

    taskItems.forEach(item => {
      item.draggable = true;

      item.ondragstart = function(e) {
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.dataset.taskId);
      };

      item.ondragend = function() {
        this.classList.remove('dragging');
        taskItems.forEach(t => t.classList.remove('drop-zone'));
      };

      item.ondragover = function(e) {
        e.preventDefault();
      };

      item.ondragenter = function() {
        if (this !== draggedItem) {
          this.classList.add('drop-zone');
        }
      };

      item.ondragleave = function() {
        this.classList.remove('drop-zone');
      };

      item.ondrop = function(e) {
        e.preventDefault();
        this.classList.remove('drop-zone');

        if (draggedItem && draggedItem !== this) {
          const draggedId = parseInt(draggedItem.dataset.taskId);
          const targetId = parseInt(this.dataset.taskId);
          
          const draggedIndex = tasks.findIndex(t => t.id === draggedId);
          const targetIndex = tasks.findIndex(t => t.id === targetId);
          
          [tasks[draggedIndex], tasks[targetIndex]] = [tasks[targetIndex], tasks[draggedIndex]];
          
          saveTasks();
          renderTasks();
        }
      };
    });
  }

  function renderTasks() {
    let showTasks = tasks;
    
    if (currentFilter !== 'all') {
      showTasks = tasks.filter(t => t.status === currentFilter);
    }
    
    tasksList.innerHTML = '';
    
    if (showTasks.length === 0) {
      tasksList.innerHTML = '<p>Задач нет</p>';
      return;
    }
    
    showTasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = 'task-item';
      taskElement.setAttribute('data-task-id', task.id);
      
      const statusText = {
        'planned': 'Запланированная',
        'progress': 'В работе', 
        'done': 'Готовая'
      }[task.status] || 'Неизвестно';
      
      const statusClass = {
        'planned': 'status-planned',
        'progress': 'status-progress',
        'done': 'status-done'
      }[task.status] || 'status-planned';
      
      taskElement.innerHTML = `
        <div class="task-drag">
          <div class="task-title" draggable="true">
            <span class="drag-handle">☰</span>
            ${task.title}
          </div>
          ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
          <div class="task-status ${statusClass}">${statusText}</div>
          <div class="task-actions">
            <button class="btn btn-edit" onclick="editTask(${task.id})">Изменить</button>
            <button class="btn" onclick="changeStatus(${task.id}, 'planned')">Запланировать</button>
            <button class="btn" onclick="changeStatus(${task.id}, 'progress')">В работу</button>
            <button class="btn" onclick="changeStatus(${task.id}, 'done')">Завершить</button>
            <button class="btn btn-delete" onclick="deleteTask(${task.id})">Удалить</button>
          </div>
        </div>
      `;
      
      tasksList.appendChild(taskElement);
    });
    
    setupDragAndDrop();
  }

  taskForm.onsubmit = function(e) {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const status = document.getElementById('task-status').value;
    
    if (title) {
      addTask(title, desc, status);
      taskForm.reset();
    }
  };

  window.deleteTask = deleteTask;
  window.changeStatus = changeStatus;
  window.filterTasks = filterTasks;
  window.editTask = editTask;
  window.saveTask = saveTask;
  window.cancelEdit = cancelEdit = () => renderTasks();
  
  renderTasks();
});