import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
const { getAllTodos, addTodo, toggleTodo, deleteTodo } = require('./todos');

const app = express();

Sentry.init({
  dsn: 'https://7e59c6b713b18d22383f905c1e5d5a71@o4507567793504256.ingest.us.sentry.io/4507567797764096',
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/todos', async (_req: Request, res: Response) => {
  const todos = await getAllTodos();
  res.json(todos);
});

app.post('/api/todos', async (req: Request, res: Response) => {
  const { text } = req.body;
  const todo = await addTodo(text);
  res.json(todo);
});

app.patch('/api/todos/:id', async (req: Request, res: Response) => {
  const todo = await toggleTodo(req.params.id);
  res.json(todo);
});

app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  const result = await deleteTodo(req.params.id);
  res.json(result);
});

app.get('/fail', (_req: Request, _res: Response) => {
  throw new Error('This is a test error from the /fail route!');
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});