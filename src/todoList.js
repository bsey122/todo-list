import Todo from "./task";
import Projects from "./projects";

const TodoList = (function () {
    const projectList = [];
    
    function addProject(project) {
        if (!projectList.includes(project.name)) {
            projectList.push(project);
        }
    }
    function removeProject(project) {
        const temp = projectList.filter((ele) => ele.name !== project.name);
        projectList.length = 0;
        projectList.push(projectList.concat(temp));
    }

    function addTaskToProject(task) {
        for (let index = 0; index < projectList.length; index++) {
            const element = projectList[index];
            if (element.name === task.label) {
                element.addTask(task);
                return
            }
        }
        if (!projectList.includes(task.label)) {
            const project = Projects(task.label);
            project.addTask(task);
            addProject(project);
            return
        }
    }

    function removeTaskFromProject(task) {
        for (let index = 0; index < projectList.length; index++) {
            const element = projectList[index];
            if (element.name === task.label) {
                element.removeTask(task);
            }
            
        }
    }

    function getTask(taskId) {
        let result;
        for (const {taskList} of projectList) {
            for (const task of taskList) {
                if (task.id === taskId) {
                    result = task;
                }
            }
        }
        return result;
    }

    function getProject(projectName) {
        const result = projectList.find(({name}) => name === projectName);
        return result;
    }

    return {addProject, projectList, removeProject, addTaskToProject, getTask, getProject, removeTaskFromProject}
})();

export default TodoList;