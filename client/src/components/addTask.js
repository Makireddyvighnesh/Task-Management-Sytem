import React,{useState, useEffect} from 'react'
import axios from 'axios';
import DueDateCalendar from './DueDateCalender';

export default function Task({tasks, fillter,sortType, tasksList, sortTasksByPriority, sortByDueDate,  addTaskList}) {
   const [user, setUser]=useState(null);
    const setDefault=()=>{
        const now = new Date();
        const curr=new Date(now.getTime() + 12 * 60 * 60 * 1000);
        return curr;
      }


      useEffect(()=>{
        const jsonParse=localStorage.getItem('userToken');
        if(!jsonParse){
          return;
        }
        const User=JSON.parse(jsonParse);
        
          setUser(User);
        
      
        console.log('addTask', User.token);
      },[]);

      const [newTask, setNewTask] = useState({ title: '', description: '', dueDate:setDefault(), priority:'low', completed: false });
      const [add, setAdd]=useState(false);
      const handleDateTimeSelected = (dateTime) => {
        setNewTask({...newTask, dueDate:dateTime});     
      };

      const handlePriorityChange = (event)=>{
        setNewTask({...newTask, priority: event.target.value});
      }

      const handleCancel=()=>{
       setAdd(false);
       setNewTask({ title: '', description: '', dueDate:'', priority:'low', completed: false })
      }

      const createTask = async () => {
        setAdd(false);
        if (!user || !user.token) {
          console.log('You must be logged in', user);
          return;
        }

        try {
          console.log("Inside try", user.token);
          if(!newTask.dueDate){
            newTask.dueDate=setDefault();
          }
          const response = await axios.post('http://localhost:8080/api/tasks', newTask,{
            headers:{
              'Authorization':`Bearer ${user.token}`
            }
          });

          console.log("response", response)

          const totalTasks=[...tasks,response.data];
          console.log(totalTasks);
          let sortNewTask;
          if(fillter.state){
            if(sortType.sortedType==='priority'){
              sortNewTask=sortTasksByPriority(totalTasks);
            } else if(sortType.sortedType==='dueDate'){
              sortNewTask=sortByDueDate(totalTasks);
            } else{
              sortNewTask=totalTasks;
            }
          } else{
            sortNewTask=totalTasks;
          }
          addTaskList(sortNewTask);
        //   taskAdded();
          setNewTask({ title: '', description: '', dueDate: '', priority: 'low', completed: false });
        } catch (err) {
          console.log('Error creating task:', err);
        }
      };
      
  return (
    <div >
        <div >
        {!add && (<button className='addTaskB' onClick={()=>{setAdd(true)} }>Add task</button>)}
          
          
          { add && (
            <div className='addTask'> <input 
                type="text"
                placeholder="Task name"
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Desciption"
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
            
              <select id="taskPriority" value={newTask.priority}  onChange={handlePriorityChange}>
              
                <option value="high">P1-Highest</option>
                <option value="medium">P2-Medium</option>
                <option value="low">P3-Low</option>
              </select>
              <DueDateCalendar onDateTimeSelected={handleDateTimeSelected} className="due"/>
              <div style={{display:'flex', justifyContent:'flex-end'}}>
                <button style={{padding:'10px', background:'#FF7675', color:'#fff', marginRight:'20px'}} onClick={handleCancel}>Cancel</button>
                <button style={{padding:'10px', background:'#00D2B8', color:'#fff'}} onClick={createTask}>Create Task</button>
              </div>
            </div>
            )}
            
        </div>
    </div>
  )
}
