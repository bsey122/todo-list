import TodoList from "./todoList";
import Projects from "./projects";
import Todo from "./task";
import events from "./pubsub";
import "./css/modal.css";

const DomTask = (function () {
    const todoContainer = document.querySelector('.todo-container');
    const projectContainer = document.querySelector('.nav');
    const openModalAddButton = document.querySelector('.open-modal-add-button');
    const closeModalAddButton = document.querySelector('#add-todo-modal .modal-close-button');
    const taskButton = document.querySelector('#todo-button');
    const addProjectButton = document.querySelector('#add-project-button');
    const addTodoModal = document.querySelector('#add-todo-modal');
    const overlay = document.querySelector('#overlay');
    const modalNavContainer = document.querySelector('.modal-nav');
    const todoForm = document.querySelector('.add-todo-form');
    const projectForm = document.querySelector('.add-project-form');
    const todoLink = document.querySelector('#modal-todo-link');
    const projectLink = document.querySelector('#modal-project-link');
    const taskInfoContainer = document.querySelector('.task-info-container');
    const addTodoModalSidebar = document.querySelector('.add-todo-modal-sidebar');
    const form = document.querySelector('#add-form');
    const formTitle = document.querySelector('#todo-title');
    const formDescription = document.querySelector('#description');
    const formPriority = document.querySelector('#priority');
    const formProject = document.querySelector('#add-todo-project');
    const projectList = TodoList.projectList;
    const inbox = Projects('inbox');
    let selectedProject = 'inbox';
    
    function init() {
        TodoList.addProject(inbox);
        const project = TodoList.getProject(selectedProject);
        const testTask = Todo('title', 'This is something I need to do with inbox', true);
        project.addTask(testTask);
        todoContainer.dataset.projectName = project.name;
        displayTasks(project.taskList);
        displayProjectList();
    }

    openModalAddButton.addEventListener('click', () => {
        projectForm.classList.add('hide');
        taskInfoContainer.classList.add('hide');
        taskButton.classList.add('add-todo-button');
        taskButton.textContent = 'Add Button';
        openModal(addTodoModal);
    });

    closeModalAddButton.addEventListener('click', () => {
        todoForm.classList.remove('hide');
        form.classList.remove('hide');
        addTodoModalSidebar.classList.remove('hide');
        closeModal(addTodoModal);
    });

    overlay.addEventListener('click', () => {
        todoForm.classList.remove('hide');
        closeModal(addTodoModal);
    });

    taskButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('add-todo-button')) {
            addTask();
        } else if (e.target.classList.contains('edit-todo-button')) {
            const selectedTask = selectTask(e);
            editTask(selectedTask);
        }
        displayProjectList();
        const selectedProject = selectProject(e);
        displayTasks(selectedProject.taskList);
        taskButton.removeAttribute('class');
        closeModal(addTodoModal);
    });

    addProjectButton.addEventListener('click', (e) => {
        e.preventDefault();
        addProject();
        displayProjectList();
        closeModal(addTodoModal);
    });

    projectContainer.addEventListener('click', (e) => {
        const selectedProject = selectProject(e);
        displayTasks(selectedProject.taskList);
    });

    todoContainer.addEventListener('click', (e) => {
        const selectedTask = selectTask(e);
        const selectedProject = selectProject(e);
        if (e.target.dataset.infoButtonId) {
            displayTaskInfo(selectedTask);
            openTaskInfoModal();
        }
        if (e.target.dataset.editButtonId) {
            openEditModal(selectedTask);
        }
        if (e.target.dataset.deleteButtonId) {
            removeTask(selectedTask);
            displayTasks(selectedProject.taskList);
        }
    });

    modalNavContainer.addEventListener('click', (e) => {
        toggleShowElement(e);
    });

    function selectProject(e) {
        if (e.target.tagName.toLowerCase() === 'li') {
            todoContainer.dataset.projectName = e.target.textContent;
            selectedProject = e.target.textContent;
            const project = projectList.find(({name}) => name === selectedProject);
            return project;
        }
        if (todoContainer.hasAttribute('data-project-name')) {
            selectedProject = todoContainer.dataset.projectName;
            const project = TodoList.getProject(selectedProject);
            return project;
        }
    }

    function selectTask(e) {
        if (e.target.dataset.infoButtonId) {
            const selectedTask = e.target.dataset.infoButtonId;
            return selectedTask;
        }
        if (e.target.dataset.editButtonId) {
            const selectedTask = e.target.dataset.editButtonId;
            return selectedTask;
        }
        if (e.target.dataset.deleteButtonId) {
            const selectedTask = e.target.dataset.deleteButtonId;
            return selectedTask;
        }
        if (addTodoModal.hasAttribute('data-todo-id')) {
            const selectedTask = addTodoModal.dataset.todoId;
            return selectedTask;
        }
    }

    function toggleShowElement(e) {
        if (e.target === todoLink) {
            projectForm.classList.add('hide');
            todoForm.classList.remove('hide');
        } else if (e.target === projectLink) {
            todoForm.classList.add('hide');
            projectForm.classList.remove('hide');
        }
    }

    function displayProjectList() {
        clearElement(projectContainer);
        projectList.map((project) => {
            const projectItem = document.createElement('li');
            projectItem.textContent = project.name;
            projectContainer.appendChild(projectItem);
        });
    }

    function displayTasks(selectedProject) {
        clearElement(todoContainer);
        selectedProject.map((task) => {
            const taskContainer = document.createElement('div');
            const taskCheckBox = document.createElement('input');
            const taskLabel = document.createElement('label');
            const taskInfoButton = document.createElement('button');
            const taskEditButton = document.createElement('button');
            const taskDeleteButton = document.createElement('button');
            taskLabel.dataset.taskId = task.id;
            taskCheckBox.type = 'checkbox';
            taskLabel.textContent = task.title;
            taskInfoButton.dataset.infoButtonId = task.id;
            taskEditButton.dataset.editButtonId = task.id;
            taskDeleteButton.dataset.deleteButtonId = task.id;
            taskInfoButton.textContent = 'info';
            taskEditButton.textContent = 'edit';
            taskDeleteButton.textContent = 'delete';
            taskContainer.appendChild(taskCheckBox);
            taskContainer.appendChild(taskLabel);
            taskContainer.appendChild(taskEditButton);
            taskContainer.appendChild(taskDeleteButton);
            taskContainer.appendChild(taskInfoButton);
            todoContainer.appendChild(taskContainer);
        });
    }

    function displayTaskInfo(selectedTask) {
        clearElement(taskInfoContainer);
        const titleContainer = document.createElement('div');
        const descriptionContainer = document.createElement('div');
        const priorityContainer = document.createElement('div');
        const projectContainer = document.createElement('div');
        const titleHeader = document.createElement('p');
        const taskTitle = document.createElement('p');
        const descriptionHeader = document.createElement('p');
        const taskDescription = document.createElement('p');
        const priorityHeader = document.createElement('p');
        const taskPriority = document.createElement('p');
        const projectHeader = document.createElement('p');
        const taskProject = document.createElement('p');
        
        const {title, description, priority, label} = TodoList.getTask(selectedTask);

        titleHeader.textContent = 'Title:';
        taskTitle.textContent = title;
        descriptionHeader.textContent = 'Description:';
        taskDescription.textContent = description;
        priorityHeader.textContent = 'Priority:';
        taskPriority.textContent = priority ? 'Important' : 'Low';
        projectHeader.textContent = 'Project:';
        taskProject.textContent = label;
        titleContainer.appendChild(titleHeader);
        titleContainer.appendChild(taskTitle);
        descriptionContainer.appendChild(descriptionHeader);
        descriptionContainer.appendChild(taskDescription);
        priorityContainer.appendChild(priorityHeader);
        priorityContainer.appendChild(taskPriority);
        projectContainer.appendChild(projectHeader);
        projectContainer.appendChild(taskProject);

        taskInfoContainer.appendChild(titleContainer);
        taskInfoContainer.appendChild(descriptionContainer);
        taskInfoContainer.appendChild(priorityContainer);
        taskInfoContainer.appendChild(projectContainer);
    }

    function editTask(selectedTask) {
        const task = TodoList.getTask(selectedTask);
        const tempTask = Object.assign({}, task);
        task.title = formTitle.value;
        task.description = formDescription.value;
        task.priority = formPriority.checked;
        task.label = formProject.value;
        if (tempTask.label !== task.label) {
            TodoList.removeTaskFromProject(tempTask);
            TodoList.addTaskToProject(task);
        }
    }

    function openTaskInfoModal() {
        form.classList.add('hide');
        addTodoModalSidebar.classList.add('hide');
        taskInfoContainer.classList.remove('hide');
        openModal(addTodoModal);
    }

    function openEditModal(selectedTask) {
        form.classList.remove('hide');
        addTodoModalSidebar.classList.add('hide');
        taskInfoContainer.classList.add('hide');
        projectForm.classList.add('hide');
        taskButton.classList.add('edit-todo-button');
        taskButton.textContent = 'Edit';

        const task = TodoList.getTask(selectedTask);
        let {title, description, priority, label} = task;
        addTodoModal.dataset.todoId = task.id;
        formTitle.value = title;
        formDescription.value = description;
        formPriority.checked = priority ? true : false;
        formProject.value = label;

        openModal(addTodoModal);
    }

    function clearElement(element) {
        while(element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function openModal(modal) {// Adds active classes to modal and overlay
        if (modal == null) {
            return
        }
        modal.classList.add('active');
        overlay.classList.add('active');
    }
    
    function closeModal(modal) {// Removes active class from modal and overlay
        if (modal == null) {
            return
        }
        modal.classList.remove('active');
        overlay.classList.remove('active');
        clearModal();
    }

    function clearModal() { // Clears values from modal form
        const inputs = document.querySelectorAll('input');
        const textArea = document.querySelector('textarea');
        inputs.forEach(input => {
            input.value = '';
            input.checked = false;
        });
        textArea.value = '';
    }

    function addTask() {
        const title = formTitle.value;
        const description = formDescription.value;
        const priority = formPriority.checked;
        const project = formProject.value;

        let newTodo = Todo(title, description, priority, project);

        TodoList.addTaskToProject(newTodo);
    }

    function addProject() {
        const title = document.querySelector('#add-project-title').value;
        const newProject = Projects(title);
        TodoList.addProject(newProject);
    }

    function removeTask(selectedTask) {
        const task = TodoList.getTask(selectedTask);
        TodoList.removeTaskFromProject(task);
    }

    init();
})();

export default DomTask;