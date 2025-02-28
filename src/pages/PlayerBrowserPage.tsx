import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerBrowser from '../components/PlayerBrowser';
import '../App.css';

const PlayerBrowserPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Player Generation</h1>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
      
      <div className="player-browser-container">
        <PlayerBrowser />
      </div>
    </div>
  );
};

export default PlayerBrowserPage;