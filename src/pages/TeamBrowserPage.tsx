import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeamBrowser from '../components/TeamBrowser';
import SimpleTeamList from '../components/SimpleTeamList';
import '../App.css';

const TeamBrowserPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>College Baseball Teams</h1>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
      
      <TeamBrowser />
    </div>
  );
};

export default TeamBrowserPage;
