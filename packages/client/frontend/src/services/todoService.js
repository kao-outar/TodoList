import { API_URL } from "../config";

const STORAGE_KEY = "todos";

export function getTodos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function addTodo(title) {
  const todos = getTodos();
  const newTodo = {
    id: Date.now(),
    title,
    completed: false
  };
  todos.push(newTodo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  return newTodo;
}

export function toggleTodo(id) {
  const todos = getTodos().map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function deleteTodo(id) {
  const todos = getTodos().filter(todo => todo.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
