const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const categoryInput = document.getElementById("category");
const taskList = document.getElementById("taskList");

const totalEl = document.getElementById("total");
const completedEl = document.getElementById("completed");
const pendingEl = document.getElementById("pending");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  totalEl.textContent = `Total: ${tasks.length}`;
  completedEl.textContent = `Completed: ${tasks.filter(t => t.completed).length}`;
  pendingEl.textContent = `Pending: ${tasks.filter(t => !t.completed).length}`;
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(task => {
      if (currentFilter === "completed") return task.completed;
      if (currentFilter === "pending") return !task.completed;
      return true;
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `${task.priority} ${task.completed ? "completed" : ""}`;

      li.innerHTML = `
        <span>${task.text} <small>(${task.category})</small></span>
        <div class="actions">
          <button onclick="toggleTask(${index})">✓</button>
          <button class="delete" onclick="deleteTask(${index})">✕</button>
        </div>
      `;

      taskList.appendChild(li);
    });

  updateStats();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    priority: priorityInput.value,
    category: categoryInput.value,
    completed: false,
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

document.getElementById("addBtn").addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

renderTasks();
