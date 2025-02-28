import React from 'react';
import { useNavigate } from 'react-router-dom';
import TestDatabaseLoad from '../components/TestDatabaseLoad';
import SimpleTeamList from '../components/SimpleTeamList';
import '../App.css';

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Database Test</h1>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
      
      <div className="test-page-content">
        <p>This page tests whether the teams database file can be loaded correctly.</p>
        <TestDatabaseLoad />
        
        <div className="section-divider"></div>
        
        <div className="team-context-test">
          <h3>Team Context Test</h3>
          <p>This component directly tests if teams are available in the React context:</p>
          <SimpleTeamList />
        </div>
      </div>
    </div>
  );
};

export default TestPage;
