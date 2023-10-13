import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'; 


const Navbar = () => {
  const [user, setUser] = useState(null); 

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null); 
  };

  useEffect(() => {
    console.log('useEffect is running');
    const jsonString = localStorage.getItem('userToken');
  
    if(!jsonString){
      console.log("Error")
      return;
    }
  
      const User=JSON.parse(jsonString);
      setUser(User);
      
    
   
  }, []);
  

  return (
    <header>
      <div className='navbar'>
        <Link to='/'>
          <h1>Task Management</h1>
        </Link>
        
        <nav>

          {user ? (
            <div>
              <span>{user.email}</span>
              <button onClick={logout}>Log Out</button>
            </div>
          ) : (
            <div>
              <Link to='/signin'>Sign in</Link>
              <Link to="/signup">Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
