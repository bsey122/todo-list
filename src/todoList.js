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
            } else {
                const project = Projects(task.label);
                project.addTask(task);
                addProject(project);
                return
            }
        }
    }

    return {addProject, projectList, removeProject, addTaskToProject}
})();

export default TodoList;