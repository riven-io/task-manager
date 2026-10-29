
const taskForm = document.querySelector("form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const taskCounter = document.querySelector("#task-counter");

// UI updates

function updateTaskUI() {
    const tasks = taskList.querySelectorAll("li");

    emptyMessage.hidden = tasks.length > 0;

    const remainingTasks = Array.from(tasks).filter(function(taskItem) {
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        return !checkbox.checked;
    });

    taskCounter.textContent = remainingTasks.length + " remaining";
}

// Storage

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

function loadTasks() {
    let tasks;

    try {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        return;
    }

    if (!Array.isArray(tasks)) {
        return;
    }

    tasks.forEach(function(task) {
        if (!task || typeof task.text !== "string") {
            return;
        }

        const taskItem = createTask(task.text, task.completed === true);
        taskList.appendChild(taskItem);
    });
}

// Task creation

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

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "×";
    deleteButton.type = "button";
    deleteButton.className = "delete-button";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.type = "button";
    editButton.className = "edit-button";

    const taskActions = document.createElement("div");
    taskActions.className = "task-actions";

    // Delete task

    deleteButton.addEventListener("click", function() {
        taskItem.remove();
        updateTaskUI();
        saveTasks();
    });

    // Complete task

    taskCheckbox.addEventListener("change", function() {
        taskTextElement.classList.toggle("completed");
        updateTaskUI();
        saveTasks();
    });

    // Edit task

    editButton.addEventListener("click", function() {
        const originalText = taskTextElement.textContent;

        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = originalText;

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.type = "button";
        saveButton.className = "edit-button save-button";

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.type = "button";
        cancelButton.className = "edit-button";

        taskItem.replaceChild(editInput, taskTextElement);
        taskActions.replaceChildren(saveButton, cancelButton);

        function finishEditing() {
            taskItem.replaceChild(taskTextElement, editInput);
            taskActions.replaceChildren(editButton, deleteButton);
        }

        function saveEdit() {
            const newText = editInput.value.trim();

            if (newText === "") {
                return;
            }

            if (newText === originalText) {
                finishEditing();
                return;
            }

            taskTextElement.textContent = newText;
            finishEditing();
            saveTasks();
        }

        function cancelEdit() {
            finishEditing();
        }

        saveButton.addEventListener("click", saveEdit);
        cancelButton.addEventListener("click", cancelEdit);

        editInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                saveEdit();
            } else if (event.key === "Escape") {
                cancelEdit();
            }
        });

        editInput.focus();
        editInput.select();
    });

    // Assemble task

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskTextElement);

    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);
    taskItem.appendChild(taskActions);

    return taskItem;
}

// Initialize

loadTasks();
updateTaskUI();

// Add task

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const taskItem = createTask(taskText);
    taskList.appendChild(taskItem);

    taskInput.value = "";

    updateTaskUI();
    saveTasks();
});
