const taskForm = document.querySelector("form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const taskCounter = document.querySelector("#task-counter");

function updateEmptyMessage() {
    emptyMessage.hidden = taskList.children.length > 0;
}

function updateTaskCounter() {
    const tasks = taskList.querySelectorAll("li");
    const remainingTasks = Array.from(tasks).filter(function(taskItem) {
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        return !checkbox.checked;
    });

    taskCounter.textContent = remainingTasks.length + " remaining";
}

console.log(taskForm, taskInput, taskList);

function saveTasks() {
    const tasks = [];

    taskList.querySelectorAll("li").forEach(function(taskItem) {
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        const textElement = taskItem.querySelector("span");

        tasks.push({
            text: textElement.textContent,
            completed: checkbox.checked
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTask(text, completed = false) {
    const taskItem = document.createElement("li");

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = completed;

    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "×";
    deleteButton.type = "button";
    deleteButton.className = "delete-button";

    deleteButton.addEventListener("click", function() {
        taskItem.remove();
        updateEmptyMessage();
        updateTaskCounter();
        saveTasks();
    });

    if (completed) {
        taskTextElement.classList.add("completed");
    }

    taskCheckbox.addEventListener("change", function() {
        taskTextElement.classList.toggle("completed");
        updateTaskCounter();
        saveTasks();
    });

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskTextElement);
    taskItem.appendChild(deleteButton);

    return taskItem;
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function(task) {
        const taskItem = createTask(task.text, task.completed);
        taskList.appendChild(taskItem);
    });
}

loadTasks();
updateEmptyMessage();
updateTaskCounter();

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const taskItem = createTask(taskText);

    taskList.appendChild(taskItem);
    updateEmptyMessage();
    updateTaskCounter();

    taskInput.value = "";
    saveTasks();
});