import React, { useState } from 'react'

export default function Filter({tasks, onSortPriority, onSortDate, onReset, filterOn, sortType}) {
    const [filter, setFilter]=useState(false);
    const customPriorityOrder=['high', 'medium', 'low'];
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
        setFilter(false);
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
        setFilter(false);
        filterOn();
        sortType("dueDate");
    }
     const resetTasks = ()=>{
        onReset();
        setFilter(false);
     }



  return (
    <div>
       <button onClick={()=>setFilter(true)}>Filter</button>
       {
        filter && (
            <div>
                <div >
                    <h2>Sort by </h2>
                    <span onClick={sortPriority}>Priority</span> <br />
                    <span onClick={sortByDate}>Due date</span>

                </div>
                <div>
                <br></br>
                    <button onClick={resetTasks}>Reset all</button>
                </div>
            </div>
            
        )
       }
    </div>
  )
}

