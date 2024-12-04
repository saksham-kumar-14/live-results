import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import DataEntry from './components/DataEntry';
import Results from './components/Results';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import axios from 'axios';
import { ADMIN_AUTH_API_URL } from './utils/constants';

const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(()=>{
    const getAuthentication = async () => {
      try{
        const token = localStorage.getItem("passwordToken");
        const res = await axios.get(`${ADMIN_AUTH_API_URL}`, {
          headers: {
            'password-token': token
          }
        });
        const data = await res.data;
        setIsAuthenticated(data.authenticated);
      }catch{
        setIsAuthenticated(false);
      }
    }
    getAuthentication();
  },[])

  return (
    <Router>
      <Routes>
        <Route 
          path="/admin" 
          element={<Admin isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>} 
        />
        <Route
          path="/data/:event" // Use a dynamic route for events
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <DataEntry />
            </PrivateRoute>
          }
        />
        <Route 
          path="/results/:event" 
          element={<Results isAuthenticated={isAuthenticated} />} 
        /> {/* Dynamic route for results */}
        
        <Route path="/" element={<h1>Welcome to Speedcubing Data Entry</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
