import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConferences } from '../store/ConferenceContext';
import TeamSelector from '../components/TeamSelector';
import { Team } from '../models/team.model';
import '../App.css';

const NewGamePage: React.FC = () => {
  const navigate = useNavigate();
  const { conferences } = useConferences();
  const [coachName, setCoachName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [formStep, setFormStep] = useState(1);

  // Get conference name by ID
  const getConferenceName = (conferenceID: number): string => {
    const conference = conferences.find(conf => conf.id === conferenceID);
    return conference ? conference.name : 'Unknown Conference';
  };

  const handleStartGame = () => {
    // In the future, we'll initialize the game state here
    console.log(`Starting new game with Coach ${coachName} of the ${selectedTeam?.schoolName} ${selectedTeam?.mascot}`);
    // For now, just go back to home
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleTeamSelect = (team: Team | null) => {
    setSelectedTeam(team);
  };

  const isNextStepReady = () => {
    // Different validation based on the current step
    if (formStep === 1) {
      return coachName.trim().length > 0;
    }
    if (formStep === 2) {
      return selectedTeam !== null;
    }
    return true;
  };

  return (
    <div className="new-game-container">
      <h1>Create New Game</h1>
      
      <div className="form-steps">
        <div className={`form-step ${formStep === 1 ? 'active' : formStep > 1 ? 'completed' : ''}`}>1. Coach Info</div>
        <div className={`form-step ${formStep === 2 ? 'active' : formStep > 2 ? 'completed' : ''}`}>2. Team Selection</div>
        <div className={`form-step ${formStep === 3 ? 'active' : ''}`}>3. Confirm</div>
      </div>
      
      <div className="form-container">
        {formStep === 1 && (
          <div className="coach-info-form">
            <div className="form-group">
              <label htmlFor="coachName">Coach Name:</label>
              <input
                type="text"
                id="coachName"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="button-group">
              <button onClick={handleBack}>Back</button>
              <button 
                onClick={() => setFormStep(2)}
                disabled={!isNextStepReady()}
              >
                Next: Select Team
              </button>
            </div>
          </div>
        )}
        
        {formStep === 2 && (
          <div className="team-selection-form">
            <h2>Select Your Team</h2>
            <TeamSelector 
              onTeamSelect={handleTeamSelect}
              selectedTeam={selectedTeam}
            />

            <div className="button-group">
              <button onClick={() => setFormStep(1)}>Back</button>
              <button 
                onClick={() => setFormStep(3)}
                disabled={!isNextStepReady()}
              >
                Next: Confirm
              </button>
            </div>
          </div>
        )}
        
        {formStep === 3 && (
          <div className="confirm-form">
            <h2>Confirm New Game</h2>
            
            <div className="confirm-details">
              <div className="confirm-item">
                <span className="confirm-label">Coach Name:</span>
                <span className="confirm-value">{coachName}</span>
              </div>
              
              <div className="confirm-item">
                <span className="confirm-label">Team:</span>
                <span className="confirm-value">
                  {selectedTeam?.schoolName} {selectedTeam?.mascot}
                </span>
              </div>
              
              <div className="confirm-item">
                <span className="confirm-label">Conference:</span>
                <span className="confirm-value">
                  {selectedTeam ? getConferenceName(selectedTeam.conferenceID) : ''}
                </span>
              </div>
            </div>
            
            <div className="game-start-notice">
              <p>You'll begin your coaching career at {selectedTeam?.schoolName}. Good luck, Coach {coachName}!</p>
            </div>

            <div className="button-group">
              <button onClick={() => setFormStep(2)}>Back</button>
              <button 
                onClick={handleStartGame}
                className="start-game-button"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewGamePage;
