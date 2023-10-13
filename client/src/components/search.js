import React, { useState } from 'react'

export default function Search() {
    const [input, setInput]=useState('');


    const handleChange=(e)=>{
        setInput(e.target.value);
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        const token=localStorage.getItem('userToken');
        if(!token){
            console.log("You need to signin");
            return;
        }
        const user=JSON.parse(token);
        
}


  return (
    
    <form className="search" style={{marginRight:'30px'}}>
       <input type="text" placeholder="search.." name="search" onChange={handleChange}/>
      <button style={{padding:'8px', marginLeft:'10px'}} type="submit" onSubmit={handleSubmit}><i class="fa-solid fa-magnifying-glass"></i>
</button>
    </form>

  )
}
