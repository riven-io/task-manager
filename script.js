const taskForm = document.querySelector("form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

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

    if (completed) {
        taskTextElement.classList.add("completed");
    }

    taskCheckbox.addEventListener("change", function() {
        taskTextElement.classList.toggle("completed");
        saveTasks();
    });

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskTextElement);

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

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const taskItem = createTask(taskText);

    taskList.appendChild(taskItem);

    taskInput.value = "";
    saveTasks();
});