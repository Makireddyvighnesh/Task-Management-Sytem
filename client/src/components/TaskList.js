import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', completed: false });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks'); // Replace with your API URL
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', completed: false });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/${editingTask._id}`, editingTask);
      const updatedTasks = tasks.map(task => task._id === editingTask._id ? response.data : task);
      setTasks(updatedTasks);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      <h1>Task Management App</h1>

      {/* Task List */}
      <div>
        <h2>Task List</h2>
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              {!editingTask || editingTask._id !== task._id ? (
                <div>
                  <button onClick={() => setEditingTask(task)}>Edit</button>
                  <button onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editingTask.description}
                    onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                  />
                  <button onClick={updateTask}>Save</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Create Task Form */}
      <div>
        <h2>Create a Task</h2>
        <input 
          type="text"
          placeholder="add the task"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="add the desciption"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button onClick={createTask}>Create Task</button>
      </div>
    </div>
  );
}

export default TaskList;
