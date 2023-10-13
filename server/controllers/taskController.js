import Task from "../models/task.js";

//get all tasks
const getAllTasks= async (req, res) => {
    try {
        const tasks = await Task.find({user_id:req.user._id});
        console.log(tasks)
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ error: 'Error retrieving tasks' });
    }
}

// create a task
const createTask=async (req, res) => {
    console.log("called");
      try {
          const { title, description,dueDate, priority, completed  } = req.body;
          const user_id=req.user._id;
          console.log("bakend", user_id);
          const task = new Task({ title, description, dueDate, priority, completed, user_id});
          const savedTask = await task.save();

          console.log("bakend", user_id);
          console.log(task);
          res.status(200).json(savedTask);
      } catch (error) {
        console.log("fronrend")
          console.error(error);
          res.status(500).json({ error: 'Error creating a task' });
      }
  }

  //update task
  const updateTask=async (req, res) => {
    try {
      
        const { title, description,dueDate, priority, completed} = req.body;
        const user_id=req.user._id;
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
}

//delete task
const deleteTask= async (req, res) => {
    try {

        const taskId = req.params.id;
        const user_id=req.user._id;
        // Verify if the task belongs to the authenticated user
        
        await Task.findByIdAndRemove(req.params.id);
        res.status(200).json({message:"Successfuully deleted task"});
    } catch (error) {
        res.status(500).json({ error: 'Error deleting a task' });
    }
}

export {getAllTasks, createTask, updateTask, deleteTask};