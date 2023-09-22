import React, { useState, useRef, useEffect } from 'react'
import './filter.css';

export default function Filter({tasks, onSortPriority, onSortDate, onReset, filterOn, sortType}) {
    const [filterVisible, setFilterVisible] = useState(false);
    const customPriorityOrder=['high', 'medium', 'low'];
    const ref=useRef(null);
    const sortPriority=()=>{
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
        sortType("priority");
    }
   

    const sortByDate = () => {
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
        sortType("dueDate");
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
          // Clicked outside of the popup, close it
          setFilterVisible(false);
        }
      }

    // Add the event listener to the window
    document.addEventListener('click', handleClickOutside, true);

    // Clean up the event listener when the component unmounts
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
                  <button >Priority</button>
                  <button >Due Date</button>
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

