// Select DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const categoryInput = document.getElementById('category-input');
const tagsInput = document.getElementById('tags-input');
const categoryFilter = document.getElementById('category-filter');
const tagFilter = document.getElementById('tag-filter');

let todos = [];

// Load todos from localStorage on page load
window.onload = () => {
  const storedTodos = JSON.parse(localStorage.getItem('todos'));
  if (storedTodos) {
    todos = storedTodos;
  }
  renderTodos();
  updateTagFilter();
};

// Helper to get unique tags from all todos
function getAllTags() {
  const tags = new Set();
  todos.forEach(todo => {
    if (todo.tags) {
      todo.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags);
}

// Update tag filter dropdown
function updateTagFilter() {
  const tags = getAllTags();
  tagFilter.innerHTML = '<option value="all">All</option>' + tags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
}

// Add todo item to DOM (with category and tags)
function addTodoToDOM(todo) {
  const li = document.createElement('li');
  li.classList.add('todo-item');
  if (todo.completed) li.classList.add('completed');
  li.setAttribute('data-id', todo.id);

  let tagsHTML = '';
  if (todo.tags && todo.tags.length > 0) {
    tagsHTML = `<span class="tags">[${todo.tags.join(', ')}]</span>`;
  }

  li.innerHTML = `
    <span>${todo.text}</span>
    <span class="category">(${todo.category})</span>
    ${tagsHTML}
    <button class="delete-btn">&times;</button>
  `;

  // Toggle completed on click
  li.querySelector('span').addEventListener('click', () => {
    toggleComplete(todo.id, li);
  });

  // Delete todo on delete button click
  li.querySelector('.delete-btn').addEventListener('click', () => {
    deleteTodo(todo.id, li);
  });

  todoList.appendChild(li);
}

// Add todo on form submit (with category and tags)
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  const category = categoryInput.value;
  const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
  if (text !== '') {
    const newTodo = {
      id: Date.now().toString(),
      text,
      category,
      tags,
      completed: false,
    };
    todos.push(newTodo);
    renderTodos();
    saveTodos();
    todoInput.value = '';
    tagsInput.value = '';
    updateTagFilter();
  }
});

// Render todos with filtering
function renderTodos() {
  todoList.innerHTML = '';
  let filtered = todos;
  const selectedCategory = categoryFilter.value;
  const selectedTag = tagFilter.value;
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(todo => todo.category === selectedCategory);
  }
  if (selectedTag !== 'all') {
    filtered = filtered.filter(todo => todo.tags && todo.tags.includes(selectedTag));
  }
  filtered.forEach(todo => addTodoToDOM(todo));
}

// Filter event listeners
categoryFilter.addEventListener('change', renderTodos);
tagFilter.addEventListener('change', renderTodos);

// Toggle completed state
function toggleComplete(id, listItem) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
      if (todo.completed) {
        listItem.classList.add('completed');
      } else {
        listItem.classList.remove('completed');
      }
    }
    return todo;
  });
  saveTodos();
}

// Delete todo
function deleteTodo(id, listItem) {
  todos = todos.filter(todo => todo.id !== id);
  todoList.removeChild(listItem);
  saveTodos();
  updateTagFilter();
  renderTodos();
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Dark mode toggle logic
const darkModeSwitch = document.getElementById('dark-mode-switch');

function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    darkModeSwitch.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    darkModeSwitch.checked = false;
  }
}

darkModeSwitch.addEventListener('change', (e) => {
  setDarkMode(e.target.checked);
});

// On load, apply dark mode if previously set
window.addEventListener('DOMContentLoaded', () => {
  const darkPref = localStorage.getItem('darkMode');
  setDarkMode(darkPref === 'enabled');
});
