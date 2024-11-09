import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import DataEntry from './components/DataEntry';
import Results from './components/Results';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/data/:event" // Use a dynamic route for events
          element={
            <PrivateRoute>
              <DataEntry />
            </PrivateRoute>
          }
        />
        <Route path="/results/:event" element={<Results />} /> {/* Dynamic route for results */}
        <Route path="/" element={<h1>Welcome to Speedcubing Data Entry</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
