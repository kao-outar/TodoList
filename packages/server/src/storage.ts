const fs = require('fs/promises');
const path = require('path');

// After compilation, __dirname will be /dist, so we go up one level.
const dataPath = path.join(__dirname, '..', 'data', 'todos.json');

async function readTodos() {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    // If the file doesn't exist, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeTodos(todos: any[]) {
  await fs.writeFile(dataPath, JSON.stringify(todos, null, 2));
}

module.exports = {
  readTodos,
  writeTodos
};
