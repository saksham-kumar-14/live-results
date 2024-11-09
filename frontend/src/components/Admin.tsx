import React, { useState } from 'react';
import "../styles/Admin.css";
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    if (password === 'arghykadecimal') { // Replace with your desired password
      setAuthenticated(true);
      localStorage.setItem('authenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('authenticated');
  };

  return (
    <div className='container'>
      {
        authenticated || localStorage.getItem('authenticated') === 'true' ? (
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
