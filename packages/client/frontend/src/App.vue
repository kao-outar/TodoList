<template>
  <div class="container">
    <h1>Todo List</h1>

    <form @submit.prevent="handleAdd">
      <input v-model="newTodo" placeholder="Nouvelle tâche..." />
      <button>Ajouter</button>
    </form>

    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <label>
          <input 
            type="checkbox" 
            :checked="todo.completed" 
            @change="handleToggle(todo.id)" 
          />
          <span :class="{ done: todo.completed }">{{ todo.title }}</span>
        </label>
        <button @click="handleDelete(todo.id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTodos, addTodo, toggleTodo, deleteTodo } from "./services/todoService";

const todos = ref([]);
const newTodo = ref("");

onMounted(() => {
  todos.value = getTodos();
});

const handleAdd = () => {
  if (!newTodo.value.trim()) return;
  const todo = addTodo(newTodo.value);
  todos.value.push(todo);
  newTodo.value = "";
};

const handleToggle = (id) => {
  toggleTodo(id);
  todos.value = getTodos();
};

const handleDelete = (id) => {
  deleteTodo(id);
  todos.value = getTodos();
};
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

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>
