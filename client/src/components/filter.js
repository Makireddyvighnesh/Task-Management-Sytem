import React, { useState } from 'react'

export default function Filter({tasks, onSortPriority}) {
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
    }

  return (
    <div>
       <button onClick={()=>setFilter(true)}>Filter</button>
       {
        filter && (
            <div >
                <h2>Sort by </h2>
                <span onClick={sortPriority}>Priority</span> <br />
                <span>Due date</span>
            </div>
        )
       }
    </div>
  )
}

