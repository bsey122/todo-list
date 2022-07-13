const Todo = function (title = '', description = '', priority = false, label = 'inbox') {
    const state = {
        title,
        description,
        priority,
        label,
    }
    return Object.assign({}, state);
}

export default Todo;