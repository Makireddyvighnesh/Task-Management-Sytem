import React from 'react'
import DueDateCalendar from './DueDateCalender';

export default function editTask({editingTask, handleEditTitle, updateTask, handleEditDesc, handleEditDate, cancel}) {
    console.log("editing task:", editingTask)
  return (
          <div className='editTask'>
                <form  >
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => handleEditTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      value={editingTask.description}
                      onChange={(e)=>handleEditDesc(e.target.value)}
                    />
                    <select id="taskPriority" value={editingTask.priority} >
           
                      <option value="high">P1-Highest</option>
                      <option value="medium">P2-Medium</option>
                      <option value="low">P3-Low</option>
                    </select>
                    <DueDateCalendar onDateTimeSelected={(date)=> handleEditDate(date)} className="due"/>
                    <div  style={{display:'flex', justifyContent:'flex-end', marginTop:'10px'}}>
                    <button  className="cancel-button"  onClick={cancel}>Cancel</button>
         
                    <button  className="save-button" onClick={updateTask}>Save</button>
                    </div>
                  </form>
       </div>
  )
}
