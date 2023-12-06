
// Selectors for new category form
const newCategoryForm = document.querySelector('[data-new-category-form]');
const newCategoryInput = document.querySelector('[data-new-category-input]');

// Selector for categories container
const categoriesContainer = document.querySelector('[data-categories]');

// Selector for currently viewing
const currentlyViewing = document.querySelector('[data-currently-viewing]');

// Selector for new todo form
const newTodoForm = document.querySelector('[data-new-todo-form]');
const newTodoSelect = document.querySelector('[data-new-todo-select]');
const newTodoInput = document.querySelector('[data-new-todo-input]');

// Selector for edit todo form
const editTodoForm = document.querySelector('[data-edit-todo-form]');
const editTodoSelect = document.querySelector('[data-edit-todo-select]');
const editTodoInput = document.querySelector('[data-edit-todo-input]');

// Selector for todos container
const todosContainer = document.querySelector('[data-cards]');

// Selectors for user management elements
const userOptionSelect = document.querySelector('[data-user-option]');
const welcomeMessageContainer = document.getElementById('welcome-message');
const usernameInputContainer = document.getElementById('username-input-container');
const setUsernameBtn = document.getElementById('set-username-btn');
const userManagementContainer = document.getElementById('user-management-container');
const userManagementSelect = document.getElementById('user-management');
const deleteUserBtn = document.getElementById('delete-user-btn');
const usernameContainer = document.getElementById('username');

// Local storage keys
const LOCAL_STORAGE_CATEGORIES_KEY = 'LOCAL_STORAGE_CATEGORIES_KEY';
const LOCAL_STORAGE_TODOS_KEY = 'LOCAL_STORAGE_TODOS_KEY';
const LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY = 'LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY';

let selectedCategoryId = localStorage.getItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY);
let categories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY)) || [];
let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS_KEY)) || [];

// Function to render categories
function renderCategories() {
    categoriesContainer.innerHTML = '';
    categories.forEach(category => {
        const categoryElement = document.createElement('li');
        categoryElement.classList.add('sidebar-item');
        categoryElement.textContent = category.name;
        categoryElement.style.color = category.color;
        categoryElement.addEventListener('click', () => {
            selectedCategoryId = category.id;
            saveAndRender();
        });
        if (category.id === selectedCategoryId) {
            categoryElement.classList.add('active');
        }
        categoriesContainer.appendChild(categoryElement);
    });
}

// Function to render todos
function renderTodos() {
    todosContainer.innerHTML = '';
    let filteredTodos = todos;
    if (selectedCategoryId) {
        filteredTodos = filteredTodos.filter(todo => todo.categoryId === selectedCategoryId);
    }
    filteredTodos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo');
        todoElement.style.borderColor = todo.categoryColor;
        todoElement.innerHTML = `
            <div class="todo-tag">${todo.categoryName}</div>
            <p class="todo-description">${todo.text}</p>
            <div class="todo-actions">
                <i class="far fa-edit" data-edit-todo-id="${todo.id}"></i>
                <i class="far fa-trash-alt" data-delete-todo-id="${todo.id}"></i>
            </div>
        `;
        todoElement.querySelector('[data-edit-todo-id]').addEventListener('click', () => {
            editTodoForm.style.display = 'flex';
            editTodoSelect.value = todo.categoryId;
            editTodoInput.value = todo.text;
            editTodoInput.focus();
            editTodoInput.select();
        });
        todoElement.querySelector('[data-delete-todo-id]').addEventListener('click', () => {
            deleteTodo(todo.id);
        });
        todosContainer.appendChild(todoElement);
    });
}

// Function to render user options
function renderUserOptions() {
    const storedUsername = localStorage.getItem('username') || 'Guest';
    
    // Clear existing options
    userOptionSelect.innerHTML = '';

    // Create a single option for the username
    const optionElement = document.createElement('option');
    optionElement.value = 'user';
    optionElement.textContent = storedUsername;

    // Append the option to the dropdown
    userOptionSelect.appendChild(optionElement);

    // Set the selected option
    userOptionSelect.value = 'user';
}

// Function to render welcome message
function renderWelcomeMessage() {
    const username = localStorage.getItem('username') || 'Guest';
    welcomeMessageContainer.textContent = `Welcome Back, ${username}!`;
}

// Function to render currently viewing
function renderCurrentlyViewing() {
    const categoryName = selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name : 'All Categories';
    currentlyViewing.textContent = `You are currently viewing ${categoryName}`;
}

// Function to render all elements
function render() {
    renderCategories();
    renderTodos();
    renderUserOptions();
    renderWelcomeMessage();
    renderCurrentlyViewing();
}

// Function to save and render
function saveAndRender() {
    save();
    render();
}

// Function to save categories and todos to local storage
function save() {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    localStorage.setItem(LOCAL_STORAGE_TODOS_KEY, JSON.stringify(todos));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY, selectedCategoryId);
}

// Event listener for new category form submission
newCategoryForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const categoryName = newCategoryInput.value.trim();
    if (categoryName === '') return;
    const newCategory = {
        id: new Date().toISOString(),
        name: categoryName,
        color: getRandomColor(),
    };
    categories.push(newCategory);
    newCategoryInput.value = '';
    saveAndRender();
});

// Event listener for new todo form submission
newTodoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const todoText = newTodoInput.value.trim();
    if (todoText === '') return;
    const newTodo = {
        id: new Date().toISOString(),
        text: todoText,
        categoryId: newTodoSelect.value,
    };
    todos.push(newTodo);
    newTodoInput.value = '';
    saveAndRender();
});

// Event listener for edit todo form submission
editTodoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const editedTodoText = editTodoInput.value.trim();
    if (editedTodoText === '') return;
    const todoId = editTodoForm.dataset.editTodoId;
    const todoToEdit = todos.find(todo => todo.id === todoId);
    if (todoToEdit) {
        todoToEdit.text = editedTodoText;
        todoToEdit.categoryId = editTodoSelect.value;
        editTodoForm.style.display = 'none';
        saveAndRender();
    }
});

// Event listener for set username button
setUsernameBtn.addEventListener('click', function () {
    const newUsername = document.getElementById('username-input').value.trim();
    if (newUsername !== '') {
        localStorage.setItem('username', newUsername);
        renderWelcomeMessage();
    }
});

// Event listener for delete user button
deleteUserBtn.addEventListener('click', function () {
    localStorage.removeItem('username');
    renderWelcomeMessage();
});

// Function to get random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Initial render
render();

