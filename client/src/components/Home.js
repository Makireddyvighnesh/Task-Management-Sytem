import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EditTask from './editTask.js';
import Filter from './filter.js';
import DueDateCalendar from './DueDateCalender.js';
import Task from './addTask.js';
import Search from './search.js';
import './Home.css';
function TaskList() { 
  const [user, setUser]=useState(null);
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});

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
    const {jsonParse}=localStorage.getItem('userToken');
    if(!jsonParse) {
      console.log("error");
     return;
    }
     const User=JSON.parse(jsonParse);
     setUser(User);
    if(User && User.token){
      console.log("user",user.token);
      
    }
  },[]);

  useEffect(()=>{
    console.log("Called fetch tasks")
    if(user && user.token){
      fetchTasks();
    }
  })

  const handleSortType=(type)=>{
    setSortType({sortedType:type});
     console.log(sortType);
  }

 useEffect(()=>{
  localStorage.setItem('type',JSON.stringify(sortType));
 },[sortType])

 useEffect(() => {
  // Fetch tasks when the component mounts (initial page load)
  if (user && user.token) {
    fetchTasks();
  }
}, []);

const oneDayTasks=(tasks)=>{
  const currDate =new Date();
  console.log("tasks are",tasks)
  const newTasks=tasks.filter(task=>{
    const dueDate=new Date(task.dueDate);
    
    const timeDiff=dueDate-currDate;
    const daysRemaining=timeDiff/(1000*60*60*24);
    return daysRemaining<1;
    
    })
    return newTasks;
}

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

const handleTasksByGroupP=(tasks)=>{
      console.log("called ")
  const highPriorityTasks=tasks.filter(task=>task.priority==='high');
  const mediumPriorityTasks=tasks.filter(task=>task.priority==='medium');
  const lowPriorityTasks=tasks.filter(task=>task.priority==='low');
  
  const priorityGroup={
    'Priority 1':highPriorityTasks,
    'Priority 2':mediumPriorityTasks,
    'Priority 3':lowPriorityTasks
  }
  
 
  console.log(priorityGroup);
  return priorityGroup;
}

const fetchTasks = async () => {
  
 console.log("inside fecth");

 const User=localStorage.getItem('userToken');
 if(!User){
  return;
 }
const token=JSON.parse(User);
console.log(token)
  
  try {
      const response = await axios.get('http://localhost:8080/api/tasks',{
        headers:{
          'Authorization':`Bearer ${token.token}`
        }
      });
      console.log("response is", response.data)
     
    // const sortedTasks = fillter.state ? sortTasksByPriority(response.data) : response.data;
    let sortedTasks;
    const fetchedTasks=await oneDayTasks(response.data);
    console.log("fetched tasks are", fetchedTasks)
    if(fillter.state){
      if(sortType.sortedType==='priority'){
        sortedTasks=sortTasksByPriority(fetchedTasks);
       
      } else if(sortType.sortedType==="dueDate"){
        sortedTasks=sortByDueDate(fetchedTasks);
        console.log(sortedTasks, "sorted asks")
      } else if(sortType.sortedType==="Grouping"){
        sortedTasks=fetchedTasks;
        
        console.log("before");
        setGroupedTasks(handleTasksByGroupP(sortedTasks));
        
        console.log("after");
      }
      else{
        sortedTasks=fetchedTasks;
      }
    } else{
      sortedTasks=fetchedTasks;
    }
    console.log("sorted tasks are ", sortedTasks)
    setTasks(sortedTasks);
    console.log("tasks", tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};




  const updateTask = async () => {
    try {
      const userToken=localStorage.getItem('userToken');
      if(!userToken){
        console.log("User is not authenticated");
        return;
      }
      const token=JSON.parse(userToken);
      const response = await axios.put(`http://localhost:8080/api/tasks/${editingTask._id}`, editingTask,{
        headers:{
          'Authorization':`Bearer ${token.token}`,
        },
      });
      const updatedTasks = tasks.map(task => task._id === editingTask._id ? response.data : task);
      setTasks(updatedTasks)
      .then(()=>{
        setEditingTask(null);
      })
      
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    console.log("taskID is",taskId)
    
    try {
      const userToken=localStorage.getItem('userToken');
      if(!userToken){
        console.log("User is not authenticated");
        return;
      }
      const token=JSON.parse(userToken);
      const response=await axios.delete(`http://localhost:8080/api/tasks/${taskId}`,{
        headers:{
          'Authorization':`Bearer ${token.token}`,
        },
      });
      if(response.status===200){
        const updatedTasks=tasks.filter(task=>task._id!==taskId);
        setTasks(prevTasks=>prevTasks.filter(task=>task._id!==taskId));;
      }
      else{
        console.error('Error  task', response);
      }
      
     
      
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addTaskList = (newTaskList) => {
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

  const handleEditTitle=(value)=> setEditingTask({ ...editingTask, title: value })
  const handleEditDesc=(value)=> setEditingTask({ ...editingTask, description: value })

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
      
      <div className="home">

       
       <div className='play' >
       
          <h2 style={{paddingTop:'4px'}}>Task List</h2>
          <div style={{display:'flex'}}>
            <Link style={{ textDecoration: 'none', color: 'black' , paddingRight:'20px', paddingTop:'9px'}} to='/create'>Groups</Link>
            <Filter sortType={sortType} tasks={tasks} onSortPriority={handleSortPriority} onSortDate={handleDateSort} onGroup={(tasks)=>setGroupedTasks(tasks)} onReset={handleReset} filterOn={()=>{setFilter({state:true}); }} sortingType={handleSortType}/>
            
          </div>
      
       </div>
        
      </div>
      <div className='task-list'>
        
            { sortType.sortedType === "Grouping" && Object.keys(groupedTasks).map(priority => (
        <div key={priority}>
          {Array.isArray(groupedTasks[priority]) && groupedTasks[priority].length > 0 && (
            <>
            <h2>{priority}</h2>
            <ul>
              {groupedTasks[priority].map(task => (
                <li key={task._id}>
                {!editingTask || editingTask._id !== task._id ?(
                  <div className='Container'>
                    <div className='task'>
                      <div className='task-name'>
                        <strong>{task.title}</strong>
                      </div>
                      <div className='buttonLayout hide'>
                        <button  onClick={() => setEditingTask(task)}><i class="far fa-edit"></i></button>
                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                      </div>
                    </div>
                    <p>{task.description}</p>
                  </div>
                ): (
                  <EditTask editingTask={editingTask} handleEditTitle={handleEditTitle} updateTask={updateTask} handleEditDesc={handleEditDesc} handleEditDate={(date)=> setEditingTask({ ...editingTask, dueDate: date})} cancel={handleCancel}/>
                )
                }
                
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    ))}


            {sortType.sortedType!="Grouping" && <ul>
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
                        <div style={{display:'flex', justifyContent:'flex-end', marginTop:'10px'}}>
                          <button  className="cancel-button"   onClick={handleCancel}>Cancel</button>
                          <button className='save-button'  onClick={updateTask}>Save</button>
                        </div>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>}
          </div>

        
          <div >
            <Task tasks={[tasks]} 
            fillter={fillter}
            sortType={sortType} 
            sortTasksByPriority={sortTasksByPriority} 
            sortByDueDate={sortByDueDate} 
              addTaskList={addTaskList} />
          </div>
      
          
      
    </div>
  );
}

export default TaskList;