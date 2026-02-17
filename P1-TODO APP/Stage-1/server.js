const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory task storage
let tasks = [];
let currentId = 1;

// POST /task → Add task
app.post('/task', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: currentId++,
    title,
    description: description || '',
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// GET /task → Retrieve/display all tasks
app.get('/task', (req, res) => {
  res.json(tasks);
});

// GET /task/:id → Retrieve a specific task
app.get('/task/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// PUT /task/:id → Update task
app.put('/task/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update fields if provided
  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.description !== undefined) task.description = req.body.description;
  if (req.body.completed !== undefined) task.completed = req.body.completed;

  res.json(task);
});

// DELETE /task/:id → Delete task
app.delete('/task/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted', task: deletedTask[0] });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Todo app server running at http://localhost:${PORT}`);
});
