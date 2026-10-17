const todoForm = document.querySelector("#todoForm");
const taskNameInput = document.querySelector("#taskName");
const taskDateInput = document.querySelector("#taskDate");
const todoList = document.querySelector("#todoList");
const todoCount = document.querySelector("#taskCount");
const emptyHint = document.querySelector("#emptyHint");
const todoTemplate = document.querySelector("#todoTemplate");
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");
const themeText = document.querySelector("#themeText");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
let todos = TodoHelpers.loadTasks();

// This sets a useful default date when the page opens.
taskDateInput.value = TodoHelpers.today();

// This draws the saved task list and progress on the screen.
function renderTodos() {
  todoList.innerHTML = "";
  todoCount.textContent = todos.length;
  const completedCount = todos.filter((todo) => todo.status === "Completed").length;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = todos.length ? `${progress}% of the good stuff is done` : "Fresh start energy";
  emptyHint.textContent = todos.length ? `${todos.length} ${todos.length === 1 ? "task" : "tasks"}` : "Nothing here yet";

  if (!todos.length) {
    todoList.innerHTML = '<div class="empty-state">Your task list is ready. Add your first task above ✨</div>';
    return;
  }

  todos.forEach((todo) => {
    const todoElement = todoTemplate.content.cloneNode(true);
    todoElement.querySelector(".todo-id").textContent = todo.id;
    todoElement.querySelector(".todo-name").textContent = todo.name;
    todoElement.querySelector(".todo-comments").textContent = todo.comments || "No comments added";
    todoElement.querySelector(".todo-date").textContent = `Added on ${TodoHelpers.formatDate(todo.date)}`;
    const statusSelect = todoElement.querySelector(".todo-status");
    ["Pending", "In Progress", "Completed"].forEach((status) => statusSelect.add(new Option(status, status, status === todo.status, status === todo.status)));
    setStatusClass(statusSelect, todo.status);
    statusSelect.addEventListener("change", () => updateStatus(todo.id, statusSelect.value));
    todoElement.querySelector(".delete-button").addEventListener("click", () => deleteTodo(todo.id));
    todoList.appendChild(todoElement);
  });
}

// This adds a matching colour to each task status.
function setStatusClass(statusSelect, status) {
  statusSelect.className = `todo-status status-${status.toLowerCase().replace(" ", "-")}`;
}

// This adds one task and clears the form for the next entry.
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(todoForm);
  todos.unshift({ id: TodoHelpers.createId(), name: formData.get("taskName").trim(), comments: formData.get("comments").trim(), date: formData.get("taskDate"), status: formData.get("status") });
  TodoHelpers.saveTasks(todos);
  todoForm.reset();
  taskDateInput.value = TodoHelpers.today();
  renderTodos();
  taskNameInput.focus();
});

// This changes only the selected task status without reloading the page.
function updateStatus(id, status) {
  todos = todos.map((todo) => (todo.id === id ? { ...todo, status } : todo));
  TodoHelpers.saveTasks(todos);
  renderTodos();
}

// This removes a task after the user confirms the action.
function deleteTodo(id) {
  if (!window.confirm("Delete this task?")) return;
  todos = todos.filter((todo) => todo.id !== id);
  TodoHelpers.saveTasks(todos);
  renderTodos();
}

// This switches the colour theme and remembers the user's choice.
function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeText.textContent = isDark ? "Day mode" : "Night mode";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  localStorage.setItem("taskflow-theme", isDark ? "dark" : "light");
}

themeToggle.addEventListener("click", () => setTheme(!document.body.classList.contains("dark-mode")));
setTheme(localStorage.getItem("taskflow-theme") === "dark");
renderTodos();
