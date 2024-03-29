const Projects = function (name) {
    const taskList = [];

    function addTask(task) {
        taskList.push(task);
    }
    function removeTask(task) {
        const temp = taskList.filter((ele) => {
            return ele.id !== task.id;
        });
        taskList.length = 0;
        taskList.push(...temp);
    }
    return {taskList, addTask, removeTask, name};
}

export default Projects;