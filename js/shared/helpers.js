// This shared file keeps small reusable functions in one place.
const TodoHelpers = {
  storageKey: "taskflow-todos",

  // This gives every new task a short readable id.
  createId() {
    return `TD-${Date.now().toString().slice(-6)}`;
  },

  // This returns today's date in the format accepted by the date input.
  today() {
    return new Date().toISOString().split("T")[0];
  },

  // This shows the saved date in a friendly Indian date format.
  formatDate(date) {
    return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
  },

  // This safely loads tasks from the browser storage.
  loadTasks() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (error) {
      return [];
    }
  },

  // This saves tasks so the list remains after refreshing the page.
  saveTasks(tasks) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  },

  // This prevents user text from being treated as HTML.
  escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character]);
  }
};
