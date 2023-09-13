import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter, { sortedItems } from './filter';
import DueDateCalendar from './DueDateCalender';



function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate:'', priority:'low', completed: false });
  
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter]=useState(false);
  const [addTask, setAddTask]=useState(false);

  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks'); // Replace with your API URL
      setTasks(response.data);
     
      console.log(response.data);
      console.log(typeof(response.data[1].dueDate))
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    setAddTask(false);
    try {
      const response = await axios.post('http://localhost:8080/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      console.log(typeof(newTask.dueDate))
      setNewTask({ title: '', description: '',dueDate:'', priority:'low', completed: false });
    } catch (err) {
      console.log('Error creating task:', err);
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

  const handlePriorityChange = (event)=>{
    setNewTask({...newTask, priority: event.target.value});
  }

  const handleSortPriority=(sortedItems)=>{
    setTasks(sortedItems);
    
  }

  const handleDateTimeSelected = (dateTime) => {
    setNewTask({...newTask, dueDate:dateTime});
    
    console.log(typeof(dateTime));
  };

  return (
    <div>
      <h1>Task Management System</h1>
      <Filter tasks={tasks} onSortPriority={handleSortPriority}/>
      <div>
        <h2>Task List</h2>
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
 
              {!editingTask || editingTask._id !== task._id ? (
                <div className='Container'>
                <div className='task'>
                  <div className='task-name'>
                  <strong>{task.title}</strong>
                  </div>
                  
                  <div className='buttonLayout hide' >
                    <button onClick={() => setEditingTask(task)}>Edit</button>
                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                  </div>
                </div>
                
                <p>{task.description}</p>
                 
                </div>
              ) : (
                <div>
                <form >
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
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

     
      <div >
       {!addTask && (<button onClick={()=>{setAddTask(true)} }>Add task</button>)}
      { addTask && (
        <div className='container'>
          <input 
            type="text"
            placeholder="Task name"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Desciption"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          />
        
          <select id="taskPriority" value={newTask.priority}  onChange={handlePriorityChange}>
           
            <option value="high">P1-Highest</option>
            <option value="medium">P2-Medium</option>
            <option value="low">P3-Low</option>
          </select>
          <DueDateCalendar onDateTimeSelected={handleDateTimeSelected} className="due"/>
       
          <button onClick={createTask}>Create Task</button>
        </div>
        

       )}

      </div>
      
      
    </div>
  );
}

export default TaskList;