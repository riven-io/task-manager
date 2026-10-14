const taskForm = document.querySelector("form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

console.log(taskForm, taskInput, taskList);

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const taskItem = document.createElement("li");

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";

    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = taskText;

    taskCheckbox.addEventListener("change", function() {
        taskTextElement.classList.toggle("completed");
    });

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskTextElement);

    taskList.appendChild(taskItem);

    taskInput.value = "";
});