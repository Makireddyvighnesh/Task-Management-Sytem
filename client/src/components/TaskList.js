import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './filter.js';
import DueDateCalendar from './DueDateCalender.js';
import Task from './addTask.js';
import './TaskList.css';
function TaskList() {
 

  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const [sortType, setSortType]=useState(()=>{
    const storedType=localStorage.getItem('type');
    return storedType?JSON.parse(storedType):{sortedType:"default"};
  })
  const [fillter, setFilter] =useState(()=>{
    const storedFilter = localStorage.getItem('filter');
    return storedFilter?JSON.parse(storedFilter):{state:false};
    });

    useEffect(()=>{
      localStorage.setItem('filter', JSON.stringify(fillter));
      },[fillter])

  useEffect(() => {
    fetchTasks();
  },[]);



 useEffect(()=>{
  localStorage.setItem('type',JSON.stringify(sortType));
 },[sortType])

 const sortTasksByPriority = (tasks) => {
  const customPriorityOrder = ['high', 'medium', 'low'];
  return [...tasks].sort((a, b) => {
    const aOrder = customPriorityOrder.indexOf(a.priority);
    const bOrder = customPriorityOrder.indexOf(b.priority);

    if (aOrder === -1) return 1;
    if (bOrder === -1) return -1;
    return aOrder - bOrder;
  });
};

const sortByDueDate = (tasks)=>{
return [...tasks].slice().sort((task1, task2) => {
  const date1 = new Date(task1.dueDate);
  const date2 = new Date(task2.dueDate);
  if (isNaN(date1) || isNaN(date2)) {
      return 0; 
  }
  if (date1.getFullYear() !== date2.getFullYear()) {
      return date1.getFullYear() - date2.getFullYear();
  }
  if (date1.getMonth() !== date2.getMonth()) {
      return date1.getMonth() - date2.getMonth();
  }
  return date1.getDate() - date2.getDate();
})
};

const fetchTasks = async () => {
  console.log(tasks);
  try {
    const response = await axios.get('http://localhost:8080/api/tasks');
    // const sortedTasks = fillter.state ? sortTasksByPriority(response.data) : response.data;
    let sortedTasks;
    if(fillter.state){
      if(sortType.sortedType==='priority'){
        sortedTasks=sortTasksByPriority(response.data);
       
      } else if(sortType.sortedType==="dueDate"){
        sortedTasks=sortByDueDate(response.data);
      } else{
        sortedTasks=response.data;
      }
    } else{
      sortedTasks=response.data;
    }
    setTasks(sortedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
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

  const updateTaskList = (newTaskList) => {
    setTasks(newTaskList);
    fetchTasks();
  };
  


  const handleSortPriority=(sortedItems)=>{
    setTasks(sortedItems);
    setFilter({state:true});
  }

  const handleDateSort = (sortedDate)=>{
    setTasks(sortedDate)
    setFilter({state:true});

  }


  const handleReset = () => {
    // Inside the click handler, set a flag to indicate that the reset button was clicked
    setFilter({ state: false });
  };
  
  // Use useEffect to handle the state change based on the resetClicked flag
  useEffect(() => {
    console.log(fillter.state)
    if (fillter.state === false) {
      fetchTasks();
    }
  }, [fillter.state]);
  

 const handleCancel=()=>{
  setEditingTask(null);
 }
  
  

  return (
    <div>
      <h1>Task Management System</h1>
      <div className="header">
       
       <div >
        <Filter tasks={tasks} onSortPriority={handleSortPriority} onSortDate={handleDateSort} onReset={handleReset} filterOn={()=>{setFilter({state:true}); }} sortType={(type)=>{setSortType({sortedType:type}); console.log(sortType);}}/>
       
       </div>
        
      </div>
      <div>
        <h2>Task List</h2>
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
 
              { !editingTask || editingTask._id !== task._id ? (
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
                <div className='editTask'>
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
                    <select id="taskPriority" onChange={e=>setEditingTask({...editingTask, priority:e.target.value})} value={editingTask.priority} >
           
                      <option value="high">P1-Highest</option>
                      <option value="medium">P2-Medium</option>
                      <option value="low">P3-Low</option>
                    </select>
                    <DueDateCalendar onDateTimeSelected={(date)=> setEditingTask({ ...editingTask, dueDate: date})} className="due"/>
                
                    <button className='edit' onClick={handleCancel}>Cancel</button>
         
                    <button className='edit' onClick={updateTask}>Save</button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

     
      <div >
        <Task tasks={[tasks]} 
        fillter={fillter}
         sortType={sortType} 
         sortTasksByPriority={sortTasksByPriority} 
         sortByDueDate={sortByDueDate} 
          updateTaskList={updateTaskList} />
      </div>
      
      
    </div>
  );
}

export default TaskList;