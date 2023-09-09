import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Task from './mongodb/task.js';
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/taskDB')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });

// const taskSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         default: '',
//     },
//     dueDate: {
//         type: Date,
//     },
//     completed: {
//         type: Boolean,
//         default: false,
//     },
// });

// const Task = mongoose.model('Task', taskSchema);

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving tasks' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const task = new Task({ title, description, completed });
        const savedTask = await task.save();
        console.log("Success");
        res.status(200).json(savedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error creating a task' });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title, description, completed
            },
            { new: true }
        );
        res.json(updateTask);
    } catch (error) {
        res.status(500).json({ error: 'Error updating a task' });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndRemove(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting a task' });
    }
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
