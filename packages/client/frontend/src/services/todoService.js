import { API_URL } from "../config";

const STORAGE_KEY = "todos";

/* --- MODE LOCAL (pour l'instant) --- */
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

/* --- PRET POUR BACKEND (plus tard) --- */
/*
export async function getTodos() {
  const res = await fetch(`${API_URL}/todos`);
  return res.json();
}

export async function addTodo(title) {
  const res = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  return res.json();
}
*/
