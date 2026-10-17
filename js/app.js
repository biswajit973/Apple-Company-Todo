const todoForm = document.querySelector("#todoForm");
const taskNameInput = document.querySelector("#taskName");
const taskDateInput = document.querySelector("#taskDate");
const todoList = document.querySelector("#todoList");
const todoCount = document.querySelector("#taskCount");
const emptyHint = document.querySelector("#emptyHint");
const todoTemplate = document.querySelector("#todoTemplate");
let todos = TodoHelpers.loadTasks();

// This sets a useful default date when the page opens.
taskDateInput.value = TodoHelpers.today();

// This draws the saved task list on the screen.
function renderTodos() {
  todoList.innerHTML = "";
  todoCount.textContent = todos.length;
  emptyHint.textContent = todos.length ? `${todos.length} ${todos.length === 1 ? "task" : "tasks"}` : "Nothing here yet";

  if (!todos.length) {
    todoList.innerHTML = '<div class="empty-state">Your task list is ready. Add your first task above.</div>';
    return;
  }

  todos.forEach((todo) => {
    const todoElement = todoTemplate.content.cloneNode(true);
    todoElement.querySelector(".todo-id").textContent = todo.id;
    todoElement.querySelector(".todo-name").textContent = todo.name;
    todoElement.querySelector(".todo-comments").textContent = todo.comments || "No comments added";
    todoElement.querySelector(".todo-date").textContent = `Added on ${TodoHelpers.formatDate(todo.date)}`;

    const statusSelect = todoElement.querySelector(".todo-status");
    ["Pending", "In Progress", "Completed"].forEach((status) => {
      statusSelect.add(new Option(status, status, status === todo.status, status === todo.status));
    });
    statusSelect.addEventListener("change", () => updateStatus(todo.id, statusSelect.value));
    todoElement.querySelector(".delete-button").addEventListener("click", () => deleteTodo(todo.id));
    todoList.appendChild(todoElement);
  });
}

// This adds one task and clears the form for the next entry.
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(todoForm);
  todos.unshift({
    id: TodoHelpers.createId(),
    name: formData.get("taskName").trim(),
    comments: formData.get("comments").trim(),
    date: formData.get("taskDate"),
    status: formData.get("status")
  });
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

renderTodos();
