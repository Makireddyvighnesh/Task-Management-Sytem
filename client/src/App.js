import React from 'react'
import {BrowserRouter as Router, Routes, Route, Switch} from 'react-router-dom';
import Signin from './pages/Signin.js';
import Signup from './pages/Signup.js';
import TaskList from './components/Home.js'
import Navbar from './components/Navbar.js';
import Group from './components/Group.js';

export default function App() {
  const isLoggedIn=localStorage.getItem('userToken');
  return (
    
      <Router>
        <Navbar />
        <div>
          <Routes>
          <Route path='/create' element={<Group />}></Route>
            <Route path='/' element={<TaskList />}></Route>
            <Route path='/signin' element={<Signin />}></Route>
            <Route path='/signup' element={<Signup />}></Route>
            
          </Routes>
        </div>
      </Router>
      
   
    
  )
}
