import React, { useState } from 'react'

export default function Group() {
    const [isGroup, setIsGroup]=useState(false);
    const [display, setDisplay]=useState(false);
    const [groupName, setGroupName]=useState('');
    const [userDetails, setUserDetails]=useState({email:'', userName:''})

    const handleCreate=()=>{
        setIsGroup(true);
    }

    const handleSubmit=(e)=>{
        // e.preventDefault();
       //post request 
       setDisplay(true);
       alert(groupName)
    }

    const handleCancel=()=>{
        setIsGroup(false);
    }

  return (
    
      <div className='group'>
        {!isGroup&& (<section style={{display:'flex', justifyContent:'flex-end'}}>
          <button className='create' onClick={handleCreate}>Create</button>
        </section>)}

        {isGroup && !display && (
            <form style={{border:'2px solid black', borderRadius:'5px'}}>
                <input onChange={e=>setGroupName(e.target.value)} placeholder='Group Name:' />
                <div>
                    <button onClick={handleCancel}  style={{background:'red'}}>Cancel</button>
                    <button  style={{background:'green'}}  onClick={handleSubmit}>Submit</button>
                </div>
            </form>)}
        
            
        {display && (<section>
            <h1>{groupName}</h1>
          <form>
            <input onChange={e=>setUserDetails({...userDetails, email:e.target.value})} placeholder='Enter the user mail id:' />
            <input onChange={e=>setUserDetails({...userDetails, userName:e.target.value})} placeholder='Enter the user name:' />
            <div>
                <button onClick={handleCancel}  style={{background:'red'}}>Cancel</button>
                <button  style={{background:'green'}}  onSubmit={handleSubmit}>Submit</button>
            </div>
          </form>
        </section>)}

        {!isGroup && (<div style={{textAlign:'center', marginTop:'20px'}}>
            You don't have any groups. To add click on create button 
        </div>)}
         
      </div>


  
  )
}
