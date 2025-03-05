class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.taskDueDate = document.getElementById('taskDueDate');
        this.taskList = document.getElementById('taskList');
        this.filterButtons = document.querySelectorAll('.filter-btn');

        this.initializeApp();
    }

    initializeApp() {
        this.taskForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.handleFilter(button));
        });

        this.renderTasks();
    }

    handleSubmit(e) {
        e.preventDefault();
        const taskText = this.taskInput.value.trim();
        const dueDate = this.taskDueDate.value;

        if (taskText) {
            this.addTask(taskText, dueDate);
            this.taskInput.value = '';
            this.taskDueDate.value = '';
        }
    }

    addTask(text, dueDate) {
        const task = {
            id: Date.now(),
            text,
            completed: false,
            dueDate,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    editTask(id, newText, newDueDate) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText, dueDate: newDueDate };
            }
            return task;
        });

        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });

        this.saveTasks();
        this.renderTasks();
    }

    handleFilter(button) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.currentFilter = button.dataset.filter;
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                ${task.dueDate ? `<div class="task-due-date">Due: ${this.formatDate(task.dueDate)}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        
        editBtn.addEventListener('click', () => {
            const newText = prompt('Edit task:', task.text);
            const newDueDate = prompt('Edit due date (YYYY-MM-DD HH:MM):', task.dueDate);
            if (newText !== null) {
                this.editTask(task.id, newText, newDueDate);
            }
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                this.deleteTask(task.id);
            }
        });

        return li;
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';
        
        filteredTasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .forEach(task => {
                this.taskList.appendChild(this.createTaskElement(task));
            });
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the Todo App
new TodoApp();