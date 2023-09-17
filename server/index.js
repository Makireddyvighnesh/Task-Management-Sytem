import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Task from './mongodb/task.js';
import Filter from './mongodb/filter.js';
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




app.get('/', (req, res) => {
    res.send("Hello World");
});

// app.get('/api/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find();
//         tasks.forEach((task, index) => {
//             console.log(typeof(task));
//             const date = task.dueDate;
//             console.log(typeof(date))
//             const year = date.getFullYear();
//             const month = date.getMonth() + 1; // Adding 1 because months are zero-based
//             const day = date.getDate();
//             console.log(`Task ${index + 1}: Year: ${year}, Month: ${month}, Day: ${day}`);
//         });
        
//         res.status(200).json(tasks); // Send the original tasks in the response
//     } catch (error) {
//         res.status(500).json({ error: 'Error retrieving tasks' });
//     }
// });

app.get('/api/filter', async (req, res) => {
    try {
      const filter = await Filter.findById('6504aa0766c9b3835a92bf0b'); // Use findById to fetch by ID
      res.status(200).json(filter);
    } catch (error) {
      res.status(500).json({ error: 'Error in retrieving state of filter' });
    }
  });
  
  app.put('/api/filter', async (req, res) => {
    try {
      const { state } = req.body;
      console.log(state, "changed");
  
      const updateState = await Filter.findByIdAndUpdate(
        '6504aa0766c9b3835a92bf0b', 
        { state: state },
        { new: true }
      );
  
      console.log(updateState);
      res.status(200).json(updateState);
    } catch (error) {
      console.error("Error in updating state of filter: ", error);
      res.status(500).json({ error: 'Error in updating state of filter' });
    }
  });
  

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        console.log(tasks,"called");
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving tasks' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description,dueDate, priority, completed } = req.body;
        if(req.body.priority==null){
            console.log("null n")
        }
        const task = new Task({ title, description, dueDate, priority, completed });
        const savedTask = await task.save();

        console.log(task);
        res.status(200).json(savedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error creating a task' });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { title, description,dueDate, priority, completed } = req.body;
        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title, description,dueDate, priority, completed
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
