const { readTodos, writeTodos } = require('./storage');

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

async function getAllTodos(): Promise<Todo[]> {
  return await readTodos();
}

async function addTodo(text: string): Promise<Todo> {
  const todos = await readTodos() as Todo[];
  const newTodo: Todo = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(newTodo);
  await writeTodos(todos);
  return newTodo;
}

async function toggleTodo(id: string): Promise<Todo | undefined> {
  const todos = await readTodos() as Todo[];
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    await writeTodos(todos);
  }
  return todo;
}

async function deleteTodo(id: string): Promise<{ success: boolean }> {
  const todos = await readTodos() as Todo[];
  const filtered = todos.filter(t => t.id !== id);
  await writeTodos(filtered);
  return { success: true };
}

module.exports = {
  getAllTodos,
  addTodo,
  toggleTodo,
  deleteTodo
};
