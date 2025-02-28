import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNewGame = () => {
    navigate('/new-game');
  };

  return (
    <div className="home-container">
      <h1 className="game-title">College Baseball Coach</h1>
      <div className="menu-container">
        <button className="menu-button" onClick={handleNewGame}>
          New Game
        </button>
        
        <Link to="/teams" className="menu-button" style={{ textDecoration: 'none', display: 'block' }}>
          Browse Teams
        </Link>
        
        <Link to="/players" className="menu-button" style={{ textDecoration: 'none', display: 'block' }}>
          Player Generation
        </Link>
        
        <Link to="/league-manager" className="menu-button" style={{ textDecoration: 'none', display: 'block' }}>
          League Manager
        </Link>
        
        <Link to="/test" className="menu-button" style={{ textDecoration: 'none', display: 'block' }}>
          Test Database
        </Link>
      </div>
    </div>
  );
};

export default HomePage;