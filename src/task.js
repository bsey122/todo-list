const Todo = function (title = '', description = '', priority = false, label = 'inbox') {
    const state = {
        title,
        description,
        priority,
        label,
        id: Date.now().toString(36) + Math.random().toString(36),
    }
    return Object.assign({}, state);
}

export default Todo;