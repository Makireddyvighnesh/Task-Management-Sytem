import React, { useState, useRef, useEffect } from 'react'
import './filter.css';

export default function Filter({sortType, tasks, onSortPriority, onSortDate, onReset,onGroup, filterOn, sortingType}) {
    const [filterVisible, setFilterVisible] = useState(false);
    const customPriorityOrder=['high', 'medium', 'low'];
    const ref=useRef(null);


    const sortPriority=()=>{
      if(sortType==='Grouping'){

      }  else{
        const sortedItems = [...tasks].sort((a,b)=>{
          const aOrder=customPriorityOrder.indexOf(a.priority);
          const bOrder=customPriorityOrder.indexOf(b.priority);
          if(aOrder===-1) return 1;
          if(bOrder===-1) return -1;
          return aOrder-bOrder;
      });
      console.log(sortedItems);
      onSortPriority(sortedItems);
      filterOn();
      sortingType("priority");
      }
       
    }
   
    const handleTasksByGroupP=()=>{
      
      const highPriorityTasks=tasks.filter(task=>task.priority==='high');
      const mediumPriorityTasks=tasks.filter(task=>task.priority==='medium');
      const lowPriorityTasks=tasks.filter(task=>task.priority==='low');
      
      const priorityGroup={
        'Priority 1':highPriorityTasks,
        'Priority 2':mediumPriorityTasks,
        'Priority 3':lowPriorityTasks
      }
      onGroup(priorityGroup);
      console.log(priorityGroup);
      sortingType('Grouping');
    }

    const handleTasksByGroupDue = () => {
      const dueGroup = {};
      const currDate = new Date();
    
      tasks.forEach((task) => {
        const dueDate = new Date(task.dueDate);
    
        const timeDiff = dueDate - currDate;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const dayOfWeek = dueDate.toLocaleString('en-US', { weekday: 'long' });
        const month = (dueDate.toLocaleString('en-US', { month: 'long' })).slice(0, 3);
    
        const date = dueDate.getDate();
        const year = dueDate.getFullYear();
        let groupKey;
    
        if (daysRemaining < 2) {
          groupKey = `${date} ${month} Tomorrow`;
        } else if (daysRemaining < 8) {
          groupKey = `${date} ${month} ${dayOfWeek}`;
        } else {
          groupKey = `${date} ${month} ${year}`;
        }
    
        if (!dueGroup[groupKey]) {
          dueGroup[groupKey] = [];
        }
        dueGroup[groupKey].push(task);
      });
    
      let sortKeys = Object.keys(dueGroup);
      console.log("hi")
    
      sortKeys.sort((key1, key2) => {
        if(key1.includes("Tomorrow")) return -1;
        if(key2.includes("Tomorrow")) return -1;
        const taskDate1 = new Date(key1);
      
        const taskDate2 = new Date(key2);
        const leftDays1 = Math.abs(taskDate1 - currDate);
        const leftDays2 = Math.abs(taskDate2 - currDate);
    
        return leftDays1 - leftDays2;
      });
    
      const sortedDueGroup = {};
      sortKeys.forEach((key) => {
        sortedDueGroup[key] = dueGroup[key];
      });
    
      console.log(sortedDueGroup);
    
      onGroup(sortedDueGroup);
      sortingType('Grouping');
    };
    

    const sortByDate = () =>{
        const sortedDate = tasks.slice().sort((task1, task2) => {
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
        });
    
        onSortDate(sortedDate);
        filterOn();
        sortingType("dueDate");
    }
     const resetTasks = ()=>{
        onReset();
     }
     const toggleFilter = () => {
        setFilterVisible(!filterVisible);
      }

    
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (filterVisible && ref.current && !ref.current.contains(event.target)) {
          setFilterVisible(false);
        }
      }

        document.addEventListener('click', handleClickOutside, true);

      return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
      

     return (
        <div className="filter-container">
        <button onClick={toggleFilter}>Filter</button>
        {filterVisible && (
          <div className="filter-popup" ref={ref} style={{ display: filterVisible ? 'block' : 'none' }}>
            <div className="filter-popup-content">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ textAlign: 'left', marginBottom: '5px' }}>Sort</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Sorting</label>
                  <button  onClick={sortPriority}>
                    Priority
                  </button>
                  <button  onClick={sortByDate}>
                    Due Date
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '5px' }}>
                  <label>Grouping</label>
                  <button onClick={handleTasksByGroupP}>Priority</button>
                  <button onClick={handleTasksByGroupDue}>Due Date</button>
                </div>
              </div>
  
              <hr />
              <div>
                <h3 style={{ textAlign: 'left', marginBottom: '5px' }}>View</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Completed tasks</span>
                </div>
              </div>
              <hr></hr>
              <button style={{display:'flex'}} onClick={resetTasks}>Reset all</button>
            </div>
          </div>
        )}
      </div>
    );
      
}

