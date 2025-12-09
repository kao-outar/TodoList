const request = require('supertest');
const express = require('express');
import type { Request, Response } from 'express';

// Mock the storage module MUST BE at the top
jest.mock('../storage', () => ({  
  readTodos: jest.fn(),
  writeTodos: jest.fn(),
}));

const { getAllTodos, addTodo } = require('../todos');  
const { readTodos, writeTodos } = require('../storage');  

const app = express();
app.use(express.json());

app.get('/api/todos', async (req: Request, res: Response) => {
    const todos = await getAllTodos();
    res.json(todos);
});

app.post('/api/todos', async (req: Request, res: Response) => {
    const { text } = req.body;
    const todo = await addTodo(text);
    res.json(todo);
});

describe('Todos API', () => {
  beforeEach(() => {
    (readTodos as jest.Mock).mockClear();
    (writeTodos as jest.Mock).mockClear();
  });

  describe('GET /api/todos', () => {
    it('should return an empty array when there are no todos', async () => {
      (readTodos as jest.Mock).mockResolvedValue([]);
      
      const response = await request(app).get('/api/todos');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/todos', () => {
    it('should add a new todo and return it', async () => {
      const newTodoText = 'Test a new todo';
      (readTodos as jest.Mock).mockResolvedValue([]);
      
      const response = await request(app)
        .post('/api/todos')
        .send({ text: newTodoText });
      
      expect(response.status).toBe(200);
      expect(response.body.text).toBe(newTodoText);
      expect(response.body.completed).toBe(false);
      expect(writeTodos).toHaveBeenCalledTimes(1);
    });
  });
});
