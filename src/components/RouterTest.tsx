import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const RouterTest: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="router-test">
      <h3>React Router Test</h3>
      <p>Current location: <code>{location.pathname}</code></p>
      
      <div className="router-links">
        <p>Try these links:</p>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/teams">Teams</Link></li>
          <li><Link to="/test">Test</Link></li>
          <li><Link to="/new-game">New Game</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default RouterTest;
