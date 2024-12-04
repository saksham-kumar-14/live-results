import React, { useState } from 'react';
import "../styles/Admin.css"
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_AUTH_URL } from '../utils/constants';
import '../styles/Admin.css'

interface AdminProps {
  isAuthenticated: Boolean;
  setIsAuthenticated: Function;
}

const Admin: React.FC<AdminProps> = ({isAuthenticated, setIsAuthenticated}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const res = await axios.post(`${ADMIN_AUTH_URL}`, {
      password: password,
    });
    const data = await res.data;
    if(data.authenticated) {
      setIsAuthenticated(true);
      setError('');
      localStorage.setItem('passwordToken', data.passwordToken);
    }else{
      setError('Incorrect password');
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('passwordToken');
  };

  return (
    <div className='container'>
      {
        isAuthenticated ? (
          <>
            <div className="welcome-container">
              <h2>Welcome, Admin!</h2>
              <button onClick={handleLogout}>Logout</button>
            </div>
            <div className='header-container'>
              <Link to="/data/3x3">
                <button type='button'> 3x3 data entry </button>
              </Link>
              <Link to="/data/2x2">
                <button type='button'> 2x2 data entry </button>
              </Link>
              <Link to="/data/4x4">
                <button type='button'> 4x4 data entry </button>
              </Link>
              <Link to="/data/3x3oh">
                <button type='button'> 3x3 OH data entry </button>
              </Link>
              <Link to="/data/pyra">
                <button type='button'> pyra data entry </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="login-container">
            <form onSubmit={handleLogin}>
              <h2>Admin Login</h2>
              <div className='input-container'>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>
            </form>
          </div>
        )
      }
    </div >
  );
};

export default Admin;