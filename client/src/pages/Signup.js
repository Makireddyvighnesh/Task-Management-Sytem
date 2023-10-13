// src/components/Auth/RegistrationForm.js
import React, { useState } from 'react';
import axios from 'axios';

export default function SignUp() {
  const [error, setError]=useState(null);
  const [loading, setLoading]=useState(null);
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const response=await fetch('http://localhost:8080/api/user/signup',
   { method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({email, password})
    })

    const json=await response.json();
    if(!response.ok){
      setLoading(false);
      setError(json.error);
    }
    if(response.ok){
      setLoading(false);
      localStorage.setItem('userToken', JSON.stringify(json))
    }

    console.log(email, password);
  }

  return (
    
      
      <form onSubmit={handleSubmit} className='signup'>
      <h2>Sign Up</h2>
        <label>Email:</label>
        <input
          type='email'
          onChange={(e)=>setEmail(e.target.value)}
          value={email}
        ></input>
        <label>Password:</label>
        <input
          type='password'
          onChange={(e)=>setPassword(e.target.value)}
          value={password}
        ></input>
        <button style={{background:'#5adbb5'}} disabled={loading}>Sign Up</button>
        {error && <div className='error'> {error}</div>}
      </form>
  );
}


