import { API_URL } from "../config";
import type { Todo } from "../types/todo";

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

export async function addTodo(text: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!response.ok) {
    throw new Error('Failed to add todo');
  }
  return response.json();
}

export async function toggleTodo(id: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH'
  });
  if (!response.ok) {
    throw new Error('Failed to toggle todo');
  }
  return response.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
}
