import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter, { sortedItems } from './filter';
import DueDateCalendar from './DueDateCalender';
import Progress from './progress';
import Home from './Home';
import Search from './Search';
import Profile from './Profile';

function TaskList() {
  const setDefault=()=>{
    const now = new Date();
    const curr=new Date(now.getTime() + 12 * 60 * 60 * 1000);;
    console.log(typeof(curr), "called")
    return curr;
  }

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate:setDefault(), priority:'low', completed: false });
  console.log(setDefault())
  const [resetTasks, setResetTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [addTask, setAddTask]=useState(false);
  const [sortType, setSortType]=useState(()=>{
    const storedType=localStorage.getItem('type');
    return storedType?JSON.parse(storedType):{sortedType:"default"};
  })
  const [fillter, setFilter] =useState(()=>{
  const storedFilter = localStorage.getItem('filter');
  return storedFilter?JSON.parse(storedFilter):{state:false};
  });

  useEffect(() => {
    fetchTasks();
  },[]);

 useEffect(()=>{
  localStorage.setItem('filter', JSON.stringify(fillter));
 },[fillter])

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
  try {
    const response = await axios.get('http://localhost:8080/api/tasks');
    // const sortedTasks = fillter.state ? sortTasksByPriority(response.data) : response.data;
    let sortedTasks;
    alert(fillter.state)
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



const createTask = async () => {
  setAddTask(false);
  alert(fillter.state)
  
  try {
    const response = await axios.post('http://localhost:8080/api/tasks', newTask);
    const totalTasks=[...tasks,response.data];
    let sortNewTask;
    if(fillter.state){
      if(sortType.sortedType==='priority'){
        sortNewTask=sortTasksByPriority(totalTasks);
      } else if(sortType.sortedType==='dueDate'){
        alert("entered")
        sortNewTask=sortByDueDate(totalTasks);
      } else{
        sortNewTask=totalTasks;
      }
    } else{
      sortNewTask=totalTasks;
    }
    
    setTasks(sortNewTask);
    setResetTasks(sortNewTask);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'low', completed: false });
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
    setFilter({state:true});
  }

  const handleDateSort = (sortedDate)=>{
    setTasks(sortedDate)
    setFilter({state:true});

  }

  const handleCancel=()=>{
    setAddTask(false);
    setNewTask({ title: '', description: '', dueDate:'', priority:'low', completed: false })
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
  

  
  
  

  const handleDateTimeSelected = (dateTime) => {
    setNewTask({...newTask, dueDate:dateTime});
    
  };

  return (
    <div>
      <h1>Task Management System</h1>
      <div className="header">
       <div className='left'>
         <Home />
         <Search />
       </div>
       <div className='right'>
        <Filter tasks={tasks} onSortPriority={handleSortPriority} onSortDate={handleDateSort} onReset={handleReset} filterOn={()=>{setFilter({state:true}); }} sortType={(type)=>{setSortType({sortedType:type}); console.log(sortType);}}/>
        <Progress />
        <Profile />
       </div>
        
      </div>
      <div>
        <h2>Task List</h2>
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
 
              {addTask || !editingTask || editingTask._id !== task._id ? (
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
                    <select id="taskPriority" value={editingTask.priority}  onChange={(e)=> setEditingTask({ ...editingTask, priority: e.target.value })}>
           
                      <option value="high">P1-Highest</option>
                      <option value="medium">P2-Medium</option>
                      <option value="low">P3-Low</option>
                    </select>
                    <DueDateCalendar onDateTimeSelected={handleDateTimeSelected} onClick={(e)=> setEditingTask({ ...editingTask, dueDate: e.target.value })} className="due"/>
                
                    <button onClick={handleCancel}>Cancel</button>
         
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
      
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={createTask}>Create Task</button>
          
        </div>
        

       )}

      </div>
      
      
    </div>
  );
}

export default TaskList;