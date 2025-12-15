<template>
  <div class="container">
    <h1>Todo List</h1>

    <form @submit.prevent="handleAdd">
      <input v-model="newTodo" placeholder="Nouvelle tâche..." />
      <button>Ajouter</button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading">Chargement...</div>
    <ul v-else>
      <li v-for="todo in todos" :key="todo.id">
        <label>
          <input 
            type="checkbox" 
            :checked="todo.completed" 
            @change="handleToggle(todo.id)" 
          />
          <span :class="{ done: todo.completed }">{{ todo.text }}</span>
        </label>
        <button @click="handleDelete(todo.id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getTodos, addTodo, toggleTodo, deleteTodo } from "./services/todoService";
import type { Todo } from "./types/todo";

const todos = ref<Todo[]>([]);
const newTodo = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  await loadTodos();
});

async function loadTodos() {
  try {
    loading.value = true;
    error.value = null;
    todos.value = await getTodos();
  } catch (err) {
    error.value = "Erreur lors du chargement des tâches";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function handleAdd() {
  if (!newTodo.value.trim()) return;
  try {
    error.value = null;
    const todo = await addTodo(newTodo.value);
    todos.value.push(todo);
    newTodo.value = "";
  } catch (err) {
    error.value = "Erreur lors de l'ajout de la tâche";
    console.error(err);
  }
}

async function handleToggle(id: string) {
  try {
    error.value = null;
    await toggleTodo(id);
    await loadTodos();
  } catch (err) {
    error.value = "Erreur lors de la modification de la tâche";
    console.error(err);
  }
}

async function handleDelete(id: string) {
  try {
    error.value = null;
    await deleteTodo(id);
    todos.value = todos.value.filter(t => t.id !== id);
  } catch (err) {
    error.value = "Erreur lors de la suppression de la tâche";
    console.error(err);
  }
}
</script>

<style>
.container {
  max-width: 500px;
  margin: 50px auto;
  font-family: sans-serif;
}

input {
  padding: 8px;
  margin-right: 10px;
}

button {
  padding: 6px 10px;
  cursor: pointer;
}

.done {
  text-decoration: line-through;
  color: gray;
}

.error {
  color: red;
  padding: 10px;
  background: #ffe0e0;
  border-radius: 4px;
  margin-bottom: 10px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>
